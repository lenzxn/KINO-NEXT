import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <Image src="/img/kino-logo.svg" alt="Kino" width={60} height={24} />
          <p>Din lokala biograf sedan 1987.</p>
        </div>

        <nav className="footer__nav">
          <h3>Navigering</h3>
          <Link href="/">Hem</Link>
          <Link href="/(pages)/movies">Filmer</Link>
          <Link href="/(pages)/about">Om oss</Link>
        </nav>

        <div className="footer__contact">
          <h3>Kontakt</h3>
          <p>Biografgatan 1, 123 45 Filmstad</p>
          <p>info@kino.se</p>
          <p>08-123 456 78</p>
        </div>
      </div>

      <div className="footer__bottom">
        <p>&copy; {new Date().getFullYear()} Kino. Alla rättigheter förbehållna.</p>
      </div>
    </footer>
  );
}
