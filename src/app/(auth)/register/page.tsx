"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/components/auth/auth-layout";
import { Field, Input } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      let json: any;
      try {
        json = await res.json();
      } catch {
        setError("Received invalid response from server. Please try again.");
        setLoading(false);
        return;
      }

      if (!res.ok || !json.success) {
        setError(json.error?.message ?? "Unable to create account. Please try again.");
        setLoading(false);
        return;
      }
      router.push("/onboarding");
      router.refresh();
    } catch {
      setError("We couldn't reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <Card className="p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-text">
            Create your account
          </h2>
          <p className="mt-1.5 text-sm text-text-secondary">
            Start understanding your placement readiness today.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Field label="Full Name" htmlFor="name">
            <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Mahidhar Reddy" />
          </Field>
          <Field label="Email" htmlFor="email">
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@college.edu"
            />
          </Field>
          <Field label="Password" htmlFor="password" hint="At least 8 characters.">
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a strong password"
            />
          </Field>

          {error ? (
            <div role="alert" className="rounded-lg border border-danger/20 bg-danger/5 px-4 py-3 text-sm font-medium text-danger">
              {error}
            </div>
          ) : null}

          <Button type="submit" size="lg" loading={loading} className="mt-2 w-full">
            Create Account
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-text-secondary">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-primary transition-colors hover:text-primary-hover"
          >
            Sign in
          </Link>
        </p>
      </Card>
    </AuthLayout>
  );
}
