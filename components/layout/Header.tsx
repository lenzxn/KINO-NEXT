"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const navMenuRef = useRef<HTMLElement>(null);
  const menuToggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Auth navbar — visa Min profil om inloggad
    const currentUser = JSON.parse(localStorage.getItem("currentUser") ?? "null");
    const desktopLink = document.getElementById("authLinkDesktop") as HTMLAnchorElement | null;
    const mobileLink = document.getElementById("authLinkMobile") as HTMLAnchorElement | null;

    if (currentUser) {
      if (desktopLink) { desktopLink.textContent = "Min profil"; desktopLink.href = "/profile"; }
      if (mobileLink) {
        mobileLink.href = "/profile";
        const textNode = Array.from(mobileLink.childNodes).find(
          n => n.nodeType === Node.TEXT_NODE && (n.textContent ?? "").trim() !== ""
        );
        if (textNode) textNode.textContent = " Min profil";
        else mobileLink.append(" Min profil");
      }
    }

    // Mobile nav — sätt aktiv item
    const mobileItems = document.querySelectorAll<HTMLElement>(".mobile-nav_item[data-nav]");
    mobileItems.forEach(item => {
      const nav = (item as HTMLElement & { dataset: DOMStringMap }).dataset.nav;
      if (
        (nav === "home"    && pathname === "/") ||
        (nav === "movies"  && pathname.startsWith("/movies")) ||
        (nav === "profile" && pathname.startsWith("/profile"))
      ) {
        item.classList.add("active");
      }
    });

    // Mobile hamburger-meny
    const menuToggle = menuToggleRef.current;
    const navMenu    = navMenuRef.current;
    if (!menuToggle || !navMenu) return;

    navMenu.style.display = "";

    function openMenu() {
      if (!navMenu || !menuToggle) return;
      navMenu.style.display = "flex";
      requestAnimationFrame(() => {
        navMenu!.classList.add("active");
        menuToggle!.classList.add("active");
      });
    }

    function closeMenu() {
      if (!navMenu || !menuToggle) return;
      navMenu.classList.remove("active");
      menuToggle.classList.remove("active");
      navMenu.addEventListener("transitionend", () => {
        if (!navMenu!.classList.contains("active")) navMenu!.style.display = "";
      }, { once: true });
    }

    function handleToggle(e: Event) {
      e.stopPropagation();
      navMenu!.classList.contains("active") ? closeMenu() : openMenu();
    }

    menuToggle.addEventListener("click", handleToggle);
    document.getElementById("menuClose")?.addEventListener("click", closeMenu);
    document.addEventListener("click", (e) => {
      if (
        navMenu!.classList.contains("active") &&
        !navMenu!.contains(e.target as Node) &&
        !menuToggle!.contains(e.target as Node)
      ) closeMenu();
    });

    // Desktop dropdown
    const dropdown = document.querySelector<HTMLElement>(".nav_item_dropdown");
    if (dropdown) {
      const dropLink = dropdown.querySelector<HTMLElement>(".nav_link");
      dropLink?.addEventListener("click", (e) => {
        e.preventDefault();
        dropdown.classList.toggle("active");
      });
      document.addEventListener("click", (e) => {
        if (!dropdown.contains(e.target as Node)) dropdown.classList.remove("active");
      });
    }
  }, [pathname]);

  return (
    <header className="header">

      {/* Mobile top bar */}
      <div className="mobile-top-bar">
        <a href="/" className="mobile-top-bar__logo">
          <img src="/img/kino-logo.svg" alt="Kino" />
        </a>
      </div>

      {/* Desktop header */}
      <div className="header_inner">
        <a href="/" className="logo">
          <img src="/img/kino-logo.svg" alt="Kino" />
        </a>
        <nav className="nav_desktop">
          <ul className="nav_list">
            <li className="nav_item"><a href="#" className="nav_link">Evenemang</a></li>
            <li className="nav_item"><a href="/movies" className="nav_link">Filmer</a></li>
            <li className="nav_item_dropdown">
              <button className="nav_link">Mer</button>
              <ul className="dropdown">
                <li><a href="/about">Om biografen</a></li>
                <li><a href="#">Erbjudanden</a></li>
                <li><a href="/about">Kontakt &amp; oss</a></li>
                <li><a href="#">Mat &amp; Dryck</a></li>
                <li><a href="#">Presentkort</a></li>
              </ul>
            </li>
          </ul>
        </nav>
        <div className="header_actions">
          <a href="/login" id="authLinkDesktop" className="login" style={{ textDecoration: "none" }}>
            Logga in
          </a>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <nav className="mobile-nav">
        <a href="/" className="mobile-nav_item" data-nav="home">
          <svg viewBox="0 0 24 24" className="icon" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12L12 3l9 9"/><path d="M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9"/>
          </svg>
          <span>Hem</span>
        </a>
        <a href="/movies" className="mobile-nav_item" data-nav="movies">
          <svg viewBox="0 0 24 24" className="icon" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="18" rx="2"/>
            <line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/>
            <line x1="2" y1="9" x2="9" y2="9"/><line x1="15" y1="9" x2="22" y2="9"/>
            <line x1="2" y1="15" x2="9" y2="15"/><line x1="15" y1="15" x2="22" y2="15"/>
          </svg>
          <span>Filmer</span>
        </a>
        <a href="/profile" className="mobile-nav_item" data-nav="profile">
          <svg viewBox="0 0 24 24" className="icon" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
          </svg>
          <span>Profil</span>
        </a>
        <button className="mobile-nav_item" id="menuToggle" data-nav="menu" ref={menuToggleRef}>
          <svg viewBox="0 0 24 24" className="icon" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1"/>
            <rect x="14" y="3" width="7" height="7" rx="1"/>
            <rect x="3" y="14" width="7" height="7" rx="1"/>
            <rect x="14" y="14" width="7" height="7" rx="1"/>
          </svg>
          <span>Meny</span>
        </button>
      </nav>

      {/* Full-screen menu overlay */}
      <nav className="nav-menu" ref={navMenuRef}>
        <div className="nav-menu__head">
          <img src="/img/kino-logo.svg" alt="Kino" className="nav-menu__logo" />
          <button className="nav-menu__close" id="menuClose" aria-label="Stäng meny">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <ul className="nav-menu__list">
          <li>
            <a href="/about">
              <span className="nav-menu__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><circle cx="12" cy="16" r="1" fill="currentColor"/></svg>
              </span>
              Om Biografen
              <svg className="nav-menu__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
            </a>
          </li>
          <li>
            <a href="#">
              <span className="nav-menu__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              </span>
              Erbjudanden
              <svg className="nav-menu__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
            </a>
          </li>
          <li>
            <a href="/about">
              <span className="nav-menu__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.63A2 2 0 014.11 2h3a2 2 0 012 1.72c.12.81.3 1.6.54 2.37a2 2 0 01-.45 2.11L8 9.47a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.77.24 1.56.42 2.37.54A2 2 0 0122 16.92z"/></svg>
              </span>
              Kontakta oss
              <svg className="nav-menu__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
            </a>
          </li>
          <li>
            <a href="#">
              <span className="nav-menu__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l19-9-9 19-2-8-8-2z"/></svg>
              </span>
              Mat &amp; Dryck
              <svg className="nav-menu__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
            </a>
          </li>
          <li>
            <a href="#">
              <span className="nav-menu__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
              </span>
              Presentkort
              <svg className="nav-menu__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
            </a>
          </li>
        </ul>

        <div className="nav-menu__foot">
          <a href="/login" id="authLinkMobile" className="nav-menu__login">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
            Logga in
          </a>
        </div>
      </nav>

    </header>
  );
}
