"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button, Card, Input } from "@/components/ui";
import { useT } from "@/lib/i18n";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState("");

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/login");
    }
  };

  const validate = () => {
    const out: Record<string, string> = {};
    if (!name.trim()) out.name = "Full name is required.";
    if (!email.trim()) out.email = "Email is required.";
    if (!password) out.password = "Password is required.";
    if (password && password.length < 6) out.password = "Password must be at least 6 characters.";
    if (password !== confirm) out.confirm = "Passwords do not match.";
    return out;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setSuccess("");

    const v = validate();
    if (Object.keys(v).length > 0) {
      setErrors(v);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const payload = await res.json();
      if (!res.ok) {
        setErrors({ form: payload?.message ?? "Registration failed." });
        return;
      }

      setSuccess("Account created. Redirecting to login...");
      setTimeout(() => router.push("/login"), 1200);
    } catch (err) {
      setErrors({ form: "Could not connect to the registration service." });
    } finally {
      setIsSubmitting(false);
    }
  };
  const t = useT();

  return (
    <main className="auth-page">
      <div className="auth-shell">
        <Card title={t("createAccount") ?? "Create account"} subtitle="Worker management portal" action={<Button variant="ghost" onClick={handleBack}>← Back</Button>} className="auth-card">
          <form className="auth-form" onSubmit={handleSubmit}>
            <Input
              label={t("fullName")}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              error={errors.name}
            />

            <Input
              label={t("email")}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              error={errors.email}
            />

            <Input
              label={t("password")}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              error={errors.password}
            />

            <Input
              label={t("confirmPassword")}
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
              error={errors.confirm}
            />

            {errors.form ? <p className="auth-error">{errors.form}</p> : null}
            {success ? <p className="auth-success">{success}</p> : null}

            <div className="auth-actions">
              <Button type="submit" isLoading={isSubmitting} fullWidth>
                {t("createAccount") ?? "Create account"}
              </Button>
            </div>
          </form>

          {/* demo credentials removed to avoid hard-coded accounts */}
        </Card>
      </div>
    </main>
  );
}
