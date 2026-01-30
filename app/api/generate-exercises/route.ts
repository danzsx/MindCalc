import { NextResponse } from "next/server";
import { Mistral } from "@mistralai/mistralai";
import { createClient } from "@/lib/supabase/server";
import type { Exercise, Operator } from "@/types";

export async function POST(request: Request) {
  try {
    const { userId, level } = (await request.json()) as {
      userId: string;
      level: number;
    };

    if (!userId || !level) {
      return NextResponse.json(
        { error: "userId and level are required" },
        { status: 400 }
      );
    }

    // Fetch recent error history from exercise_logs
    const supabase = await createClient();
    const { data: errorLogs } = await supabase
      .from("exercise_logs")
      .select("operator, is_correct")
      .eq("user_id", userId)
      .eq("is_correct", false)
      .order("created_at", { ascending: false })
      .limit(50);

    // Identify weak operations based on error frequency
    const errorCounts: Record<string, number> = {};
    if (errorLogs && errorLogs.length > 0) {
      for (const log of errorLogs) {
        const op = log.operator as string;
        errorCounts[op] = (errorCounts[op] || 0) + 1;
      }
    }

    const weakOperations = Object.entries(errorCounts)
      .sort(([, a], [, b]) => b - a)
      .map(([op]) => op);

    const weakOpsText =
      weakOperations.length > 0
        ? `The user struggles most with these operations (in order of difficulty): ${weakOperations.join(", ")}. Prioritize these operations.`
        : "No error history available. Generate a balanced mix of operations.";

    // Determine available operations based on level
    let availableOps: string;
    if (level <= 3) {
      availableOps = "addition (+) and subtraction (-)";
    } else {
      availableOps = "addition (+), subtraction (-), multiplication (*), and division (/)";
    }

    let numberRange: string;
    if (level <= 3) {
      numberRange = "numbers below 50";
    } else if (level <= 7) {
      numberRange =
        "larger numbers (two-digit for +/-, multiplication up to 15x15, division with exact integer results)";
    } else {
      numberRange = "numbers with decimals (one decimal place), larger ranges";
    }

    // Build the prompt for Mistral
    const prompt = `Generate exactly 10 math exercises for a mental calculation training app.

User level: ${level}/10
Available operations: ${availableOps}
Number range: ${numberRange}
${weakOpsText}

Rules:
- Each exercise must be solvable mentally (no unreasonably large numbers).
- Division exercises must have exact numeric results (no infinite decimals).
- Subtraction results must be non-negative.
- Vary the difficulty slightly across exercises.

Return ONLY a JSON array with exactly 10 objects, each with these fields:
- "operand1": number
- "operand2": number
- "operator": one of "+", "-", "*", "/"
- "correctAnswer": number (the correct result)

Return ONLY the JSON array, no markdown, no explanation.`;

    // Call Mistral AI
    const client = new Mistral({ apiKey: process.env.MISTRAL_API_KEY! });

    const chatResponse = await client.chat.complete({
      model: "mistral-medium-latest",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const content = chatResponse.choices?.[0]?.message?.content;
    if (!content || typeof content !== "string") {
      return NextResponse.json(
        { error: "Failed to generate exercises from AI" },
        { status: 500 }
      );
    }

    // Parse the JSON response — strip possible markdown fences
    const cleaned = content
      .replace(/```json\s*/gi, "")
      .replace(/```\s*/g, "")
      .trim();

    const exercises: Exercise[] = JSON.parse(cleaned);

    // Validate the structure
    if (!Array.isArray(exercises) || exercises.length === 0) {
      return NextResponse.json(
        { error: "Invalid exercises format from AI" },
        { status: 500 }
      );
    }

    const validated: Exercise[] = exercises.slice(0, 10).map((ex) => ({
      operand1: Number(ex.operand1),
      operand2: Number(ex.operand2),
      operator: ex.operator as Operator,
      correctAnswer: Number(ex.correctAnswer),
    }));

    return NextResponse.json(validated);
  } catch (error) {
    console.error("generate-exercises error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
