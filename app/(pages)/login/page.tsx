"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [pwVisible, setPwVisible] = useState(false);
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const usernameErrRef = useRef<HTMLSpanElement>(null);
  const passwordErrRef = useRef<HTMLSpanElement>(null);
  const loginMsgRef = useRef<HTMLSpanElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") ?? "null");
    if (currentUser) router.replace("/profile");
  }, [router]);

  function showFieldError(el: HTMLSpanElement | null, input: HTMLInputElement | null, msg: string) {
    if (!el || !input) return;
    el.textContent = msg;
    el.classList.add("visible");
    input.classList.add("is-error");
  }
  function clearFieldError(el: HTMLSpanElement | null, input: HTMLInputElement | null) {
    if (!el || !input) return;
    el.classList.remove("visible");
    input.classList.remove("is-error");
  }
  function showLoginError(msg: string) {
    if (!loginMsgRef.current) return;
    loginMsgRef.current.textContent = msg;
    loginMsgRef.current.classList.add("visible");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    clearFieldError(usernameErrRef.current, usernameRef.current);
    clearFieldError(passwordErrRef.current, passwordRef.current);
    if (loginMsgRef.current) loginMsgRef.current.classList.remove("visible");

    const username = usernameRef.current?.value.trim() ?? "";
    const password = passwordRef.current?.value ?? "";
    let hasError = false;

    if (!username) { showFieldError(usernameErrRef.current, usernameRef.current, "Fältet kan inte vara tomt."); hasError = true; }
    if (!password) { showFieldError(passwordErrRef.current, passwordRef.current, "Fältet kan inte vara tomt."); hasError = true; }
    if (hasError) return;

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();

    if (!res.ok) {
      showLoginError(data.error ?? "Inloggning misslyckades");
      return;
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("currentUser", JSON.stringify({ username }));

    if (overlayRef.current) overlayRef.current.classList.add("visible");
    setTimeout(() => router.push("/profile"), 1200);
  }

  return (
    <>
      <div className="auth-success-overlay" id="loginSuccessOverlay" aria-live="polite" ref={overlayRef}>
        <div className="auth-success-card">
          <i className="fa-solid fa-circle-check"></i>
          <p>Loggar in&hellip;</p>
        </div>
      </div>

      <main className="auth-page">
        <div className="auth-card">

          <div className="auth-logo">
            <img src="/img/kino-logo.svg" alt="Kino" />
          </div>

          <h1 className="auth-title">Logga in</h1>
          <p className="auth-subtitle">Välkommen tillbaka till Kino</p>

          <form id="loginForm" noValidate onSubmit={handleSubmit}>

            <div className="auth-field">
              <label className="auth-label" htmlFor="username">Användarnamn</label>
              <input
                className="auth-input"
                type="text"
                id="username"
                name="username"
                placeholder="Ditt användarnamn"
                autoComplete="username"
                ref={usernameRef}
              />
              <span className="auth-error" id="usernameError" ref={usernameErrRef}>Fältet kan inte vara tomt.</span>
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="password">Lösenord</label>
              <div className="auth-input-wrap">
                <input
                  className="auth-input"
                  type={pwVisible ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Ditt lösenord"
                  autoComplete="current-password"
                  ref={passwordRef}
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
              <span className="auth-error" id="passwordError" ref={passwordErrRef}>Fältet kan inte vara tomt.</span>
              <span className="auth-error" id="loginMessage" ref={loginMsgRef}></span>
            </div>

            <button type="submit" className="auth-submit">
              <i className="fa-solid fa-right-to-bracket"></i> Logga in
            </button>

          </form>

          <a href="/signup" className="auth-secondary-btn">Bli medlem</a>
          <a href="/" className="auth-footer-link">Fortsätt som gäst</a>

        </div>
      </main>
    </>
  );
}
