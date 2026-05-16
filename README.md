# Kino — biografwebbplats

En fullstack biografwebbplats byggd med Next.js 14 App Router, MongoDB, PostgreSQL och TMDB API.

## Stack

| Del | Teknik |
|-----|--------|
| Framework | Next.js 14 (App Router) |
| Språk | TypeScript |
| Primär databas | MongoDB via Mongoose |
| Sekundär databas | PostgreSQL via Prisma |
| Auth | JWT med jose |
| Filmdata | TMDB API (Bearer token) |
| Styling | SASS (BEM) |
| Tester | Jest + React Testing Library |
| Infrastruktur | Docker Compose |

---

## Databas-motivering (VG-moment)

### MongoDB (primär)
MongoDB valdes som primär databas eftersom filmdata och recensioner är naturligt dokumentorienterade — en recension hör ihop med en film och en användare, men relationsstrukturen är enkel och varierar sällan. MongoDB ger flexibelt schema (vi kan lägga till fält utan migration), hög prestanda vid läsning av enskilda dokument, och passar Next.js serverless-modellen via connection pooling med Mongoose.

### PostgreSQL (sekundär)
PostgreSQL används som sekundär databas för att demonstrera skillnaden mot MongoDB. Prisma ger typsäker query-builder och stöd för komplexa relationer och transaktioner — fördelar som MongoDB saknar. PostgreSQL passar bättre om man behöver avancerad aggregering, JOIN-operationer eller starka ACID-garantier, t.ex. för bokningssystem med platsnummer.

### Jämförelse

| Aspekt | MongoDB | PostgreSQL |
|--------|---------|------------|
| Schema | Flexibelt, schemalöst | Strikt, migrationer |
| Relationer | Embedded documents | Foreign keys, JOIN |
| Prestanda | Snabb läsning av dokument | Effektiv vid komplexa queries |
| Skalning | Horisontell (sharding) | Vertikal (replikering) |
| Lämpar sig för | Recensioner, filmdata | Bokningar, rapporter |

---

## Testningsstrategi (VG-moment)

Testerna är uppdelade i tre nivåer:

### 1. Enhetstester — `__tests__/api/`
- **movies.test.ts** — testar `loadMovies` och `loadMovie` i `lib/tmdb.ts` med mockad `fetch`
- **reviews.test.ts** — testar betygsvalidering och JWT sign/verify

### 2. Komponenttester — `__tests__/components/`
- **MovieCard.test.tsx** — renderar `<MovieCard>` och verifierar titel, genre, år, länk och betyg

### Köra testerna
```bash
npm test
```

---

## Kom igång

### Förutsättningar
- Node.js 20+
- Docker + Docker Compose

### Lokal utveckling
```bash
# 1. Starta databaser
docker compose up mongodb postgres -d

# 2. Installera paket
npm install

# 3. Generera Prisma-klient
npx prisma generate

# 4. Kör migreringar (PostgreSQL)
npx prisma migrate dev --name init

# 5. Starta dev-servern
npm run dev
```

Öppna [http://localhost:3000](http://localhost:3000)

---

## Docker Compose (VG-moment)

```bash
# Bygg och starta hela stacken (app + MongoDB + PostgreSQL)
docker compose up --build

# Kör bara databaserna (för lokal Next.js-dev)
docker compose up mongodb postgres -d

# Stoppa allt
docker compose down

# Stoppa och rensa volymer
docker compose down -v
```

### Miljövariabler i Docker
Skapa en `.env`-fil (ej `.env.local`) med:
```
JWT_SECRET=ditt_hemliga_värde
TMDB_READ_TOKEN=din_tmdb_token
```

---

## API-översikt

| Metod | Endpoint | Beskrivning |
|-------|----------|-------------|
| GET | `/api/movies` | Hämta alla filmer från TMDB |
| GET | `/api/movies/[id]` | Hämta enskild film |
| GET | `/api/movies/[id]/reviews` | Hämta recensioner för film |
| POST | `/api/movies/[id]/reviews` | Skapa recension (kräver JWT) |
| GET | `/api/movies/[id]/screenings` | Kommande visningar |
| POST | `/api/auth/login` | Logga in → JWT |
| POST | `/api/auth/signup` | Registrera konto |
