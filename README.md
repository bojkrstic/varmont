# varmont

## Aktiviranje nove verzije na serveru

Sajt je statički: nema WordPress-a, baze podataka niti posebnog „aktiviranja“. Nova verzija postaje aktivna kada se `index.html` i ceo folder `assets/` kopiraju u web folder.

Na serveru pokreni sledeće komande:

```bash
cd ~/apps/varmont/varmont
git switch main
git pull origin main
cp index.html /home/krle/html/varmont/index.html
cp -r assets /home/krle/html/varmont/
```

Web folder je `/home/krle/html/varmont/` i on je mountovan za javni sajt.

Važno: ne kopiraj samo `index.html`. Novi sajt koristi `assets/styles.css`, `assets/app.js`, `assets/translations.js`, logo i fotografije; ako `assets/` nije prekopiran, prikaz može biti neispravan.

## Provera nakon postavljanja

1. Otvori sajt u incognito/private prozoru.
2. Proveri da li se prikazuju fotografije slajdera, stilovi i jezička traka.
3. Ako vidiš staru verziju, uradi hard refresh: `Ctrl + Shift + R` (Windows/Linux) ili `Cmd + Shift + R` (Mac).
4. Ako se stara verzija zadržava, u Cloudflare-u uradi purge cache-a za `varmont.rs`.

## Kako da se ažurira ubuduće

Ponovi iste četiri komande iz sekcije „Aktiviranje nove verzije na serveru“.
