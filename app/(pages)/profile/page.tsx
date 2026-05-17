"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface CurrentUser {
  username: string;
  fname?: string;
  lname?: string;
  email?: string;
}

type View = "main" | "details";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [view, setView] = useState<View>("main");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("currentUser") ?? "null") as CurrentUser | null;
    if (!stored) {
      router.replace("/login");
      return;
    }
    setUser(stored);
  }, [router]);

  function handleLogout() {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    router.push("/login");
  }

  if (!user) return null;

  const displayName =
    `${user.fname ?? ""} ${user.lname ?? ""}`.trim() || user.username || "Min profil";

  if (view === "details") {
    return (
      <main className="profile-page">
        <div className="profile-card" id="profileSection">
          <div className="profile-details">
            <button className="profile-details__back" onClick={() => setView("main")}>
              <i className="fa-solid fa-arrow-left"></i> Tillbaka
            </button>
            <h2 className="profile-details__title">Mina uppgifter</h2>
            <div className="profile-details__field">
              <span className="profile-details__label">Förnamn</span>
              <span className="profile-details__value">{user.fname || "Ej angivet"}</span>
            </div>
            <div className="profile-details__field">
              <span className="profile-details__label">Efternamn</span>
              <span className="profile-details__value">{user.lname || "Ej angivet"}</span>
            </div>
            <div className="profile-details__field">
              <span className="profile-details__label">E-post</span>
              <span className="profile-details__value">{user.email || "Ej angiven"}</span>
            </div>
            <div className="profile-details__field">
              <span className="profile-details__label">Användarnamn</span>
              <span className="profile-details__value">{user.username || "Ej angivet"}</span>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="profile-page">
      <div className="profile-card" id="profileSection">

        <div className="profile-left">

          <div className="profile-banner">
            <div className="profile-banner__glow"></div>
          </div>

          <div className="profile-header">
            <div className="profile-avatar">
              <i className="fa-regular fa-user"></i>
            </div>
            <h1 className="profile-name" id="profileName">{displayName}</h1>
            <p className="profile-role">
              <i className="fa-solid fa-circle-check"></i> Kino Medlem
            </p>
          </div>

          <div className="profile-stats">
            <div className="profile-stat">
              <span className="profile-stat__value">12</span>
              <span className="profile-stat__label">Bokningar</span>
            </div>
            <div className="profile-stat-divider"></div>
            <div className="profile-stat">
              <span className="profile-stat__value">3</span>
              <span className="profile-stat__label">Recensioner</span>
            </div>
            <div className="profile-stat-divider"></div>
            <div className="profile-stat">
              <span className="profile-stat__value profile-stat__value--gold">Gold</span>
              <span className="profile-stat__label">Nivå</span>
            </div>
          </div>

          <div className="profile-card__footer">
            <button id="logoutBtn" className="profile-logout" onClick={handleLogout}>
              <i className="fa-solid fa-right-from-bracket"></i> Logga ut
            </button>
          </div>

        </div>

        <div className="profile-right">
          <p className="profile-menu-heading">Mitt konto</p>
          <nav className="profile-menu">
            <a href="#" className="profile-menu-item">
              <span className="profile-menu-item__icon"><i className="fa-regular fa-id-card"></i></span>
              <span className="profile-menu-item__body">
                <span className="profile-menu-item__text">Mitt medlemskap</span>
                <span className="profile-menu-item__sub">Hantera ditt Kino-kort</span>
              </span>
              <i className="fa-solid fa-chevron-right profile-menu-item__arrow"></i>
            </a>
            <a href="#" className="profile-menu-item">
              <span className="profile-menu-item__icon"><i className="fa-solid fa-ticket"></i></span>
              <span className="profile-menu-item__body">
                <span className="profile-menu-item__text">Biljetter och bokningar</span>
                <span className="profile-menu-item__sub">Se dina kommande och tidigare besök</span>
              </span>
              <i className="fa-solid fa-chevron-right profile-menu-item__arrow"></i>
            </a>
            <a href="#" className="profile-menu-item">
              <span className="profile-menu-item__icon"><i className="fa-regular fa-star"></i></span>
              <span className="profile-menu-item__body">
                <span className="profile-menu-item__text">Personliga erbjudanden</span>
                <span className="profile-menu-item__sub">Erbjudanden baserade på dina val</span>
              </span>
              <i className="fa-solid fa-chevron-right profile-menu-item__arrow"></i>
            </a>
            <a href="#" className="profile-menu-item">
              <span className="profile-menu-item__icon"><i className="fa-regular fa-comment"></i></span>
              <span className="profile-menu-item__body">
                <span className="profile-menu-item__text">Recensioner</span>
                <span className="profile-menu-item__sub">Filmer du har betygsatt</span>
              </span>
              <i className="fa-solid fa-chevron-right profile-menu-item__arrow"></i>
            </a>
            <a
              href="#"
              id="detailsLink"
              className="profile-menu-item"
              onClick={e => { e.preventDefault(); setView("details"); }}
            >
              <span className="profile-menu-item__icon"><i className="fa-solid fa-gear"></i></span>
              <span className="profile-menu-item__body">
                <span className="profile-menu-item__text">Mina uppgifter</span>
                <span className="profile-menu-item__sub">Namn, e-post och lösenord</span>
              </span>
              <i className="fa-solid fa-chevron-right profile-menu-item__arrow"></i>
            </a>
          </nav>
        </div>

      </div>
    </main>
  );
}
