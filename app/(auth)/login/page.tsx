"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Brain } from "lucide-react";
import { isAdmin } from "@/lib/admin";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function redirectAfterAuth(userId: string, userEmail?: string) {
    if (isAdmin(userEmail)) {
      router.push("/dashboard");
      return;
    }

    const supabase = createClient();
    const { data: profile } = await supabase
      .from("profiles")
      .select("level")
      .eq("id", userId)
      .single();

    if (!profile || profile.level === 1) {
      router.push("/onboarding");
    } else {
      router.push("/dashboard");
    }
  }

  async function handleSignIn() {
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      await redirectAfterAuth(data.user.id, data.user.email);
    }
    setLoading(false);
  }

  async function handleSignUp() {
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      // New users always go to onboarding
      router.push("/onboarding");
    }
    setLoading(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      handleSignIn();
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-primary/10">
          <Brain className="size-6 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold text-foreground">
          MindCalc
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Seu treino de mente para os números
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground">
              Senha
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <div className="flex flex-col gap-2 pt-2">
            <Button
              onClick={handleSignIn}
              disabled={loading || !email || !password}
              className="w-full min-h-[48px]"
              size="lg"
            >
              {loading ? "Carregando..." : "Entrar"}
            </Button>
            <Button
              onClick={handleSignUp}
              disabled={loading || !email || !password}
              variant="outline"
              className="w-full"
              size="lg"
            >
              Criar conta
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
