import type { Metadata } from "next";

export const metadata: Metadata = { title: "Om oss" };

export default function AboutPage() {
  return (
    <main className="about-page">

      <section className="about_us__field">
        <div className="about-us">
          <h1>Om oss</h1>
          <p>Välkommen till Kino – en exklusiv biograf där film möter finess och varje besök är noggrant utformat
            för att bli något utöver det vanliga. Kino grundades med en tydlig ambition: att skapa en sofistikerad
            mötesplats där filmälskare kan njuta av filmens magi i en miljö präglad av komfort, kvalitet och personlig
            service. Från första stund har Kino varit mer än en traditionell biograf.
            Här förenas den stora filmupplevelsen med gastronomi, dryck och social samvaro.
            Våra moderna salonger erbjuder generösa, bekväma sittplatser och en genomtänkt atmosfär,
            kompletterat av restaurang, bar och kiosk med ett noga utvalt sortiment.
            Kino vänder sig till alla som uppskattar det lilla extra – par för en romantisk kväll,
            vänner för en stilfull sammankomst och familjer för att skapa gemensamma filmminnen.</p>
        </div>
      </section>

      <section className="map-section">
        <div className="map_salon">
          <img src="/img/map.png" alt="Karta över Kino" className="map_img" loading="lazy" />
        </div>
      </section>

      <section className="salon_field">
        <div className="salon">
          <h2>Salong Atlas</h2>
          <p>Vår största och mest storslagna salong. Salong Atlas bär upp de stora premiärerna och de episka
            berättelserna, där generöst utrymme, mäktigt ljud och en omslutande atmosfär låter filmen ta fullt
            grepp om publiken.</p>
          <h2>Salong Lumière</h2>
          <p>En intim och sofistikerad salong, döpt efter filmkonstens pionjärer. Här står närhet och detaljrikedom
            i fokus – perfekt för konstfilm, utvalda visningar och filmupplevelser som förtjänar full uppmärksamhet.</p>
          <h2>Salong Bijou</h2>
          <p>Vår mest personliga salong, där ordet bijou – franska för &ldquo;liten juvel&rdquo; – speglar känslan.
            Salong Bijou lämpar sig för barnbio, specialvisningar och privata evenemang, med en varm och inbjudande
            stämning som gör varje visning minnesvärd.</p>
        </div>
      </section>

      <div className="supplies_img">
        <img src="/img/salon.png" alt="Insidan av salongen" className="salon_img" loading="lazy" />
        <img src="/img/snacks.png" alt="Kiosken" className="snacks_img" loading="lazy" />
      </div>

      <section className="outside-image">
        <div className="outside-image__wrapper">
          <img src="/img/outside.png" alt="Kino utsida" className="image_outside" loading="lazy" />
        </div>
      </section>

      <section className="history_field">
        <div className="history">
          <p>Det sägs att huset alltid har vetat att det en dag skulle bli en plats för berättelser.
            Redan innan filmrullarna och neonskylten tog plats lär kvällsljuset ha samlats runt tornet,
            som om byggnaden själv ville bli betraktad. När gatlyktorna tändes speglades skenet i de välvda
            fönstren och förbipasserande stannade till – inte för att de visste varför, utan för att huset bad om
            uppmärksamhet. När Kino till slut slog upp portarna var det som om lokalen drog en lättnadens suck.
            De tunga tegelväggarna, som burit decennier av stadens röster, fick äntligen fyllas av nya historier –
            viskade repliker, dämpade skratt och det där speciella ögonblicket precis innan filmen börjar.
            Och än i dag, när dörrarna öppnas och ljuset inifrån spiller ut
            över gatan, känns det som om huset lutar sig fram en aning och viskar:
            &ldquo;Välkommen. I kväll har jag något att berätta.&rdquo;</p>
        </div>
      </section>

    </main>
  );
}
