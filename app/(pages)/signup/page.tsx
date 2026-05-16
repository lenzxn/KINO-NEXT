"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

export default function SignupPage() {
  const [username, setUsername] = useState("");
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
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Registrering misslyckades");

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
        <h1>Skapa konto</h1>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Användarnamn
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={2}
              autoComplete="username"
            />
          </label>

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
            Lösenord <small>(minst 6 tecken)</small>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
            />
          </label>

          {error && <p className="auth-form__error">{error}</p>}

          <Button type="submit" loading={loading}>Registrera</Button>
        </form>

        <p className="auth-card__switch">
          Har du redan ett konto? <Link href="/(pages)/login">Logga in</Link>
        </p>
      </div>
    </div>
  );
}
