"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import SearchBar from "@/components/ui/SearchBar";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    setUsername(localStorage.getItem("username"));
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUsername(null);
    window.location.href = "/";
  }

  return (
    <header className="site-header">
      <div className="header__inner">
        <Link href="/" className="header__logo">
          <Image src="/img/kino-logo.svg" alt="Kino" width={80} height={32} priority />
        </Link>

        <nav className={`header__nav ${menuOpen ? "header__nav--open" : ""}`}>
          <Link href="/" onClick={() => setMenuOpen(false)}>Hem</Link>
          <Link href="/movies" onClick={() => setMenuOpen(false)}>Filmer</Link>
          <Link href="/about" onClick={() => setMenuOpen(false)}>Om oss</Link>
          {username ? (
            <>
              <Link href="/profile" onClick={() => setMenuOpen(false)}>
                {username}
              </Link>
              <button onClick={handleLogout} className="btn btn--ghost">Logga ut</button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn btn--ghost" onClick={() => setMenuOpen(false)}>
                Logga in
              </Link>
              <Link href="/signup" className="btn btn--primary" onClick={() => setMenuOpen(false)}>
                Registrera
              </Link>
            </>
          )}
        </nav>

        <SearchBar />

        <button
          className="header__burger"
          aria-label="Öppna meny"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span /><span /><span />
        </button>
      </div>
    </header>
  );
}
