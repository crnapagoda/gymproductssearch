# Gym Product Search

Ovaj projekat je jednostavna web aplikacija za pretragu i filtriranje proizvoda u teretani. Korisnici mogu pretraživati proizvode po nazivu, kategoriji i cenovnom rangu, kao i sortirati proizvode po ceni.

## Struktura projekta

- `index.html`: Glavna HTML datoteka koja sadrži strukturu stranice i proizvode.
- `styles/`
  - `styles.css`: CSS datoteka koja sadrži stilove za stranicu.
- `scripts/`
  - `main.js`: JavaScript datoteka koja sadrži logiku aplikacije.
- `images/`: Folder koji sadrži slike proizvoda.
- `README.md`: Ovaj fajl sa informacijama o projektu.
- `.env`: Datoteka sa environment varijablama (nije uključena u repozitorijum).

## Funkcionalnosti

- **Pretraga proizvoda**: Korisnici mogu pretraživati proizvode po nazivu ili opisu.
- **Filtriranje proizvoda**: Korisnici mogu filtrirati proizvode po kategoriji i cenovnom rangu.
- **Sortiranje proizvoda**: Korisnici mogu sortirati proizvode po ceni (rastuće ili opadajuće).
- **Dodavanje proizvoda**: Administratori mogu dodavati nove proizvode.
- **Izmena proizvoda**: Administratori mogu izmeniti postojeće proizvode.
- **Brisanje proizvoda**: Administratori mogu brisati proizvode.
- **Animacije**: Proizvodi imaju animaciju prilikom prelaska miša preko njih.

## Tehnologije

- **HTML**: Za strukturu stranice.
- **CSS**: Za stilizaciju stranice.
- **JavaScript**: Za logiku aplikacije.
- **Supabase**: Za backend usluge (autentifikacija, baza podataka, skladištenje).
- **Vite**: Za razvoj i build alat.

## Kako koristiti

1. Klonirajte repozitorijum:
   ```sh
   git clone https://github.com/crnapagoda/gymproductssearch.git
   cd gymproductssearch
   ```

2. Instalirajte zavisnosti:
   ```sh
   npm install
   ```

3. Kreirajte `.env` datoteku i dodajte vaš Supabase ključ:
   ```sh
   SUPABASE_KEY=your_supabase_key
   ```

4. Pokrenite razvojni server:
   ```sh
   npm run dev
   ```

5. Otvorite pretrazivac i idite na `http://localhost:3000`.

## Deploy

1. Izgradite projekat za produkciju:
   ```sh
   npm run build
   ```

2. Deploy-ujte na Vercel:
   ```sh
   vercel
   ```

## Doprinos

Ako želite da doprinesete ovom projektu, slobodno otvorite pull request ili prijavite problem.

## Licenca

Ovaj projekat je licenciran pod MIT licencom.
