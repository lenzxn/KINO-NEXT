import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Om oss" };

export default function AboutPage() {
  return (
    <div className="about-page">
      <section className="about-hero">
        <h1>Om Kino</h1>
        <p className="about-hero__lead">
          En biograf som älskar film — sedan 1987.
        </p>
      </section>

      <section className="about-section">
        <div className="about-section__text">
          <h2>Vår historia</h2>
          <p>
            Kino grundades 1987 av ett gäng filmälskare med en enkel vision: att
            skapa en biograf där upplevelsen sätts i centrum. Sedan dess har vi
            visat tusentals filmer och välkomnat hundratusentals besökare.
          </p>
          <p>
            Idag driver vi tre salonger med plats för allt från blockbusters
            till smala arthouse-produktioner. Vi tror att varje film förtjänar
            en publik.
          </p>
        </div>
        <Image
          src="/img/salon.png"
          alt="Biografsalong"
          width={500}
          height={340}
          className="about-section__img"
        />
      </section>

      <section className="about-section about-section--reverse">
        <div className="about-section__text">
          <h2>Mat &amp; dryck</h2>
          <p>
            Vi serverar popcorn, snacks och drycker av hög kvalitet. Njut av
            din favorit i en av våra sköna fåtöljer.
          </p>
        </div>
        <Image
          src="/img/snacks.png"
          alt="Snacks"
          width={500}
          height={340}
          className="about-section__img"
        />
      </section>

      <section className="about-map">
        <h2>Hitta hit</h2>
        <p>Biografgatan 1, 123 45 Filmstad</p>
        <Image src="/img/map.png" alt="Karta" width={800} height={400} className="about-map__img" />
      </section>
    </div>
  );
}
