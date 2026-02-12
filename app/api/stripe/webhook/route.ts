import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { getStripe } from "@/lib/stripe";

// Use service role client for webhook (no user auth context)
function getAdminSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = getAdminSupabase();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.supabase_user_id;
      const customerId = session.customer as string;
      const subscriptionId = session.subscription as string;

      if (!userId) break;

      // Get subscription details from Stripe
      const subscription = await getStripe().subscriptions.retrieve(subscriptionId);

      // Get current_period_end from the first item
      const periodEnd = subscription.items.data[0]?.current_period_end;

      // Upsert subscription record
      await supabase.from("subscriptions").upsert(
        {
          user_id: userId,
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
          status: subscription.status,
          current_period_end: periodEnd
            ? new Date(periodEnd * 1000).toISOString()
            : null,
        },
        { onConflict: "stripe_subscription_id" }
      );

      // Upgrade user plan
      await supabase
        .from("profiles")
        .update({ plan: "pro" })
        .eq("id", userId);

      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const subId = subscription.id;

      const updatedPeriodEnd = subscription.items?.data[0]?.current_period_end;

      await supabase
        .from("subscriptions")
        .update({
          status: subscription.status,
          current_period_end: updatedPeriodEnd
            ? new Date(updatedPeriodEnd * 1000).toISOString()
            : null,
          updated_at: new Date().toISOString(),
        })
        .eq("stripe_subscription_id", subId);

      // If subscription is no longer active, downgrade
      if (
        subscription.status === "canceled" ||
        subscription.status === "unpaid"
      ) {
        const { data: sub } = await supabase
          .from("subscriptions")
          .select("user_id")
          .eq("stripe_subscription_id", subId)
          .single();

        if (sub) {
          await supabase
            .from("profiles")
            .update({ plan: "free" })
            .eq("id", sub.user_id);
        }
      }

      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const subId = subscription.id;

      // Get user_id before deleting
      const { data: sub } = await supabase
        .from("subscriptions")
        .select("user_id")
        .eq("stripe_subscription_id", subId)
        .single();

      if (sub) {
        // Downgrade user
        await supabase
          .from("profiles")
          .update({ plan: "free" })
          .eq("id", sub.user_id);

        // Remove subscription record
        await supabase
          .from("subscriptions")
          .delete()
          .eq("stripe_subscription_id", subId);
      }

      break;
    }
  }

  return NextResponse.json({ received: true });
}
