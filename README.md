# varmont

## Postavljanje sajta na server

Ovo je statički sajt: ne traži WordPress, bazu podataka niti posebnu aktivaciju. Da bi radio, na web server treba preneti i `index.html` i ceo folder `assets/`.

### Ažuriranje preko Git-a

Na serveru pokreni:

```bash
cd ~/apps/varmont/varmont
git pull
cp -r index.html assets /home/krle/html/varmont/
```

Ako želiš da kopiraš samo početnu stranu, koristi:

```bash
cp index.html /home/krle/html/varmont/index.html
```

Sajt se zatim automatski prikazuje sa sadržaja foldera `/home/krle/html/varmont/`, jer je taj folder podešen kao web root/mount.

### Prvo postavljanje bez Git-a

Preko SFTP-a, File Manager-a ili `scp` prenesi u web root sledeće stavke, uz očuvanu strukturu:

```text
varmont/
├── index.html
└── assets/
    ├── app.js
    ├── styles.css
    ├── translations.js
    ├── varmont-logo.png
    └── *.jpg
```

Nemoj prenositi samo `index.html`: bez foldera `assets/` neće se videti stil, fotografije, logo niti će raditi meni, prevodi i forma.

### Provera nakon postavljanja

1. Otvori `https://varmont.rs/` u privatnom/incognito prozoru.
2. Proveri da li se vide logo i fotografije i da li radi promena jezika.
3. Ako se vidi stara verzija, uradi hard refresh: `Ctrl + Shift + R` (Windows/Linux) ili `Cmd + Shift + R` (Mac).

Kako da se azurira u buduce:

1. odes na server na ovaj folder: cd ~/apps/varmont/varmont
2. uradis git pull, znaci skidas sa github-a
3. kopiras `index.html` i folder `assets/` u `/home/krle/html/varmont/` jer je taj folder mountovan
 cp index.html /home/krle/html/varmont/index.html ovo je stara komanda
4. cp -r index.html assets /home/krle/html/varmont/  nova komanda