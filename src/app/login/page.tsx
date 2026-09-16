"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

import { Button, Card, Input } from "@/components/ui";
import { useAppStore } from "@/store/useAppStore";
import { useT } from "@/lib/i18n";

export default function LoginPage() {
  const router = useRouter();
  const login = useAppStore((state) => state.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const payload = (await response.json()) as { user?: unknown; token?: string; message?: string };

      if (!response.ok || !payload.user || !payload.token) {
        setError(payload.message ?? "Login failed.");
        return;
      }

      login(payload.user as Parameters<typeof login>[0], payload.token);
      router.push("/");
    } catch {
      setError("Could not connect to the authentication service.");
    } finally {
      setIsSubmitting(false);
    }
  };
  const t = useT();

  return (
    <main className="auth-page">
      <div className="auth-shell">
        <Card title={t("signIn")} subtitle="Worker management portal" className="auth-card">
          <form className="auth-form" onSubmit={handleSubmit}>
            <Input
              label={t("email")}
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
            />
            <Input
              label={t("password")}
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
            />

            {error ? <p className="auth-error">{error}</p> : null}

            <div className="auth-actions">
              <Button type="submit" isLoading={isSubmitting} fullWidth>
                {t("signIn")}
              </Button>
            </div>

            {/* sign up link moved below demo accounts (demo removed) */}
          </form>

          {/* demo credentials removed to avoid hard-coded accounts */}

          <div className="auth-register" style={{ textAlign: "center", marginTop: 12 }}>
            <p>
              Don't have an account?{' '}
              <Link href="/register" className="auth-register__link">
                Sign up
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </main>
  );
}
