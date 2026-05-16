export default function Footer() {
  return (
    <footer className="footer">

      {/* Mobile-only compact strip */}
      <div className="footer__mobile">
        <div className="footer__mobile-links">
          <a href="/movies" className="footer__mobile-link">
            <i className="fa-solid fa-film"></i>
            <span>Filmer</span>
          </a>
          <a href="/about" className="footer__mobile-link">
            <i className="fa-solid fa-circle-info"></i>
            <span>Om Kino</span>
          </a>
          <a href="/about" className="footer__mobile-link">
            <i className="fa-solid fa-envelope"></i>
            <span>Kontakt</span>
          </a>
          <a href="#" className="footer__mobile-link">
            <i className="fa-solid fa-gift"></i>
            <span>Presentkort</span>
          </a>
        </div>
      </div>

      <div className="footer__inner">

        <div className="footer__brand">
          <a href="/" className="footer__logo">
            <img src="/img/kino-logo.svg" alt="Kino Umeå" />
          </a>
          <p className="footer__tagline">Din lokala biograf i Umeå.<br />Film för alla, varje kväll.</p>
        </div>

        <div className="footer__columns">

          <ul className="footer__col">
            <li className="footer__col-head">Öppettider</li>
            <li>Mån – Fre &nbsp;<strong>16–22</strong></li>
            <li>Lör – Sön &nbsp;<strong>12–23</strong></li>
          </ul>

          <ul className="footer__col">
            <li className="footer__col-head">Biografen</li>
            <li><a href="/about">Om Kino Umeå</a></li>
            <li><a href="/about">Hitta hit</a></li>
            <li><a href="/about">Evenemang</a></li>
          </ul>

          <ul className="footer__col">
            <li className="footer__col-head">Kundservice</li>
            <li><a href="/about">Kontakta oss</a></li>
            <li><a href="/about">Presentkort</a></li>
            <li><a href="/about">Tillgänglighet</a></li>
          </ul>

          <ul className="footer__col">
            <li className="footer__col-head">Utforska</li>
            <li><a href="/movies">Alla filmer</a></li>
            <li><a href="#">Erbjudanden</a></li>
            <li><a href="#">Mat &amp; Dryck</a></li>
          </ul>

        </div>

      </div>

      <div className="footer__bottom">
        <span>© 2026 Kino Umeå. Alla rättigheter förbehållna.</span>
        <nav className="footer__bottom-nav">
          <a href="/about">Integritetspolicy</a>
          <a href="/about">Villkor</a>
          <a href="/about">Cookies</a>
        </nav>
      </div>

    </footer>
  );
}
