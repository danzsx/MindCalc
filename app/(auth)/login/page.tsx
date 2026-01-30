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

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function redirectAfterAuth(userId: string) {
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
      await redirectAfterAuth(data.user.id);
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
    <Card className="w-full max-w-md border-slate-800 bg-slate-900/80 backdrop-blur">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-slate-100">
          MindCalc
        </CardTitle>
        <CardDescription className="text-slate-400">
          Treine calculo mental como um profissional
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-300">
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
              className="border-slate-700 bg-slate-800 text-slate-100 placeholder:text-slate-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-300">
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
              className="border-slate-700 bg-slate-800 text-slate-100 placeholder:text-slate-500"
            />
          </div>

          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}

          <div className="flex flex-col gap-2 pt-2">
            <Button
              onClick={handleSignIn}
              disabled={loading || !email || !password}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {loading ? "Carregando..." : "Entrar"}
            </Button>
            <Button
              onClick={handleSignUp}
              disabled={loading || !email || !password}
              variant="outline"
              className="w-full border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              Criar conta
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
