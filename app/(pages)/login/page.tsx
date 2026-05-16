"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Inloggning misslyckades");

      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Serverfel");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Logga in</h1>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            E-post
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </label>

          <label>
            Lösenord
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </label>

          {error && <p className="auth-form__error">{error}</p>}

          <Button type="submit" loading={loading}>Logga in</Button>
        </form>

        <p className="auth-card__switch">
          Inget konto? <Link href="/(pages)/signup">Registrera dig</Link>
        </p>
      </div>
    </div>
  );
}
