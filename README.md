# Kino

Biografwebbplats byggd med Next.js och MongoDB.

## Starta

```bash
npm install
```

Skapa `.env.local`:

```
MONGODB_URI=din-mongodb-uri
TMDB_READ_TOKEN=din-token
JWT_SECRET=valfri-sträng
```

```bash
npm run build
npm start
```

Öppna [http://localhost:3000](http://localhost:3000)

---

## Tester

```bash
npm test
```

Tre testsuiter: API-tester för TMDB-integrationen, valideringstester för recensioner och JWT, samt komponenttest för MovieCard.

---

## Databas

MongoDB används för användare och recensioner. PostgreSQL finns också definierat via Prisma för jämförelse.

MongoDB valdes för att filmdata och recensioner passar bättre som dokument — flexibelt schema, snabb läsning, och enkel integration med Next.js. PostgreSQL hade passat bättre om appen behövde komplexa relationer eller transaktioner, t.ex. för ett bokningssystem.

---

## Docker

```bash
# Starta bara MongoDB lokalt
docker compose up mongodb -d

# Bygg och kör hela stacken (app + databaser)
docker compose up --build
```

Miljövariabler i Docker sätts via en `.env`-fil (ej `.env.local`):

```
JWT_SECRET=...
TMDB_READ_TOKEN=...
```
