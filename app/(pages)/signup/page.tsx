"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [pwVisible, setPwVisible] = useState(false);
  const [strength, setStrength] = useState({ okLength: false, okSpecial: false, okNumber: false });
  const [meterVisible, setMeterVisible] = useState(false);
  const [signupError, setSignupError] = useState("");

  const fnameRef    = useRef<HTMLInputElement>(null);
  const lnameRef    = useRef<HTMLInputElement>(null);
  const emailRef    = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") ?? "null");
    if (currentUser) router.replace("/profile");
  }, [router]);

  function handlePasswordInput() {
    const val = passwordRef.current?.value ?? "";
    const okLength  = val.length >= 8;
    const okSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(val);
    const okNumber  = /\d/.test(val);
    setStrength({ okLength, okSpecial, okNumber });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSignupError("");

    const fname    = fnameRef.current?.value.trim() ?? "";
    const lname    = lnameRef.current?.value.trim() ?? "";
    const email    = emailRef.current?.value.trim() ?? "";
    const username = usernameRef.current?.value.trim() ?? "";
    const password = passwordRef.current?.value ?? "";

    if (!fname || !lname || !email || !username || !password) return;

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });
    const data = await res.json();

    if (!res.ok) {
      setSignupError(data.error ?? "Registrering misslyckades");
      return;
    }

    if (data.token) localStorage.setItem("token", data.token);
    localStorage.setItem("currentUser", JSON.stringify({ username, fname, lname, email }));
    router.push("/profile");
  }

  const score = [strength.okLength, strength.okSpecial, strength.okNumber].filter(Boolean).length;

  function barClass(barIndex: number) {
    if (score >= barIndex) return `auth-strength__bar filled-${Math.min(score, 3)}`;
    return "auth-strength__bar";
  }

  return (
    <>
      <main className="auth-page">
        <div className="auth-card">

          <div className="auth-logo">
            <img src="/img/kino-logo.svg" alt="Kino" />
          </div>

          <h1 className="auth-title">Bli medlem</h1>
          <p className="auth-subtitle">Skapa ditt Kino-konto</p>

          <form id="signupForm" noValidate onSubmit={handleSubmit}>

            <p className="auth-section-label">Personlig information</p>

            <div className="auth-field">
              <label className="auth-label" htmlFor="fname">Förnamn</label>
              <input
                className="auth-input"
                type="text"
                id="fname"
                name="fname"
                placeholder="Förnamn"
                autoComplete="given-name"
                pattern="[A-Za-zåäöÅÄÖ]*"
                required
                ref={fnameRef}
              />
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="lname">Efternamn</label>
              <input
                className="auth-input"
                type="text"
                id="lname"
                name="lname"
                placeholder="Efternamn"
                autoComplete="family-name"
                pattern="[A-Za-zåäöÅÄÖ]*"
                required
                ref={lnameRef}
              />
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="email">E-post</label>
              <input
                className="auth-input"
                type="email"
                id="email"
                name="email"
                placeholder="din@epost.se"
                autoComplete="email"
                required
                ref={emailRef}
              />
            </div>

            <p className="auth-section-label">Inloggning</p>

            <div className="auth-field">
              <label className="auth-label" htmlFor="username">Användarnamn</label>
              <input
                className="auth-input"
                type="text"
                id="username"
                name="username"
                placeholder="Välj ett användarnamn"
                autoComplete="username"
                required
                ref={usernameRef}
              />
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="password">Lösenord</label>
              <div className="auth-input-wrap">
                <input
                  className="auth-input"
                  type={pwVisible ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Välj ett säkert lösenord"
                  autoComplete="new-password"
                  required
                  ref={passwordRef}
                  onFocus={() => setMeterVisible(true)}
                  onInput={handlePasswordInput}
                />
                <button
                  type="button"
                  className="auth-toggle-password"
                  id="togglePassword"
                  aria-label="Visa/dölj lösenord"
                  onClick={() => setPwVisible(v => !v)}
                >
                  <svg id="eyeIconShow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={pwVisible ? { display: "none" } : undefined}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  <svg id="eyeIconHide" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={pwVisible ? undefined : { display: "none" }}><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                </button>
              </div>
              <div className={`auth-strength${meterVisible ? " visible" : ""}`} id="strengthMeter">
                <div className="auth-strength__bars">
                  <div className={barClass(1)} id="bar1"></div>
                  <div className={barClass(2)} id="bar2"></div>
                  <div className={barClass(3)} id="bar3"></div>
                </div>
                <div className="auth-strength__rules">
                  <span className={`auth-rule${strength.okLength ? " valid" : ""}`} id="ruleLength">
                    <svg className="auth-rule__x" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    <svg className="auth-rule__check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    Minst 8 tecken
                  </span>
                  <span className={`auth-rule${strength.okSpecial ? " valid" : ""}`} id="ruleSpecial">
                    <svg className="auth-rule__x" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    <svg className="auth-rule__check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    Minst ett specialtecken
                  </span>
                  <span className={`auth-rule${strength.okNumber ? " valid" : ""}`} id="ruleNumber">
                    <svg className="auth-rule__x" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    <svg className="auth-rule__check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    Minst en siffra
                  </span>
                </div>
              </div>
            </div>

            {signupError && (
              <p className="auth-error visible" style={{ marginBottom: "12px" }}>{signupError}</p>
            )}

            <button type="submit" className="auth-submit">
              <i className="fa-solid fa-user-plus"></i> Skapa konto
            </button>

          </form>

          <a href="/login" className="auth-footer-link">Redan medlem? Logga in</a>

        </div>
      </main>
    </>
  );
}
