# Promptok amik működtek az AI használata közben

## Backend

---
Milyen CLI lehetőségem van file generálásra laravelben ott a php artisan make:..., itt van hasonló?

AI válasza:

Ez az a pont, ahol a Laravelből érkezve a legnagyobb "kultúrsokkot" fogod átélni. A rövid válasz: A hivatalos Spring Boot ökoszisztémában nincs a php artisan make:...-hez fogható, beépített és általánosan használt CLI fájlgenerátor.

Miért nincs beépített generátor?
A Java világ történelmileg az "IDE-vezérelt" fejlesztésre épült. A közmegegyezés az, hogy a fejlesztő az IntelliJ IDEA-ban vagy az Eclipse-ben nyom egy jobb klikket, és az integrált fejlesztőkörnyezet grafikus felülete legenerálja a megfelelő osztályokat, automatikusan kitöltve a package és import deklarációkat. Emiatt a Spring fejlesztői sosem érezték szükségét egy robusztus, Artisan-szintű parancssori generátornak.

Mivel te a terminálos, Neovim-alapú munkafolyamatot választottad, ezt az űrt neked kell kitöltened. Íme a legcélravezetőbb alternatívák a te környezetedben:

1. A hacker út: Saját Bash script (Ajánlott)
Mivel már van egy szuper tmux indító scripted, a legkézenfekvőbb megoldás (amit sok Vim/Neovim Java fejlesztő használ), ha írsz egy egyszerű, saját make.sh bash scriptet a projekt gyökerébe.

Ha például kiadod a ./make.sh feature account parancsot, a script:

Létrehozza a src/main/java/com/egyetem/netbank/account/ mappát.

Beletesz egy AccountController.java, AccountService.java és Account.java fájlt.

Mindegyik fájl tetejére automatikusan beírja a package com.egyetem.netbank.account; sort és a megfelelő alap osztálydefiníciókat (public class...).

Ez adja vissza leginkább az Artisan-életérzést, és 100%-ban a te "Package by Feature" mappastruktúrádra szabható.

2. A Neovim út: Snippet Engine (LuaSnip / kiegészítők)
A fájlokat manuálisan (vagy a Neovim fájlkezelőjével, pl. Nvim-Tree, Oil) hozod létre, de a boilerplate kódot snippetekkel generálod.
Ha használsz valamilyen snippet motort (mint a LuaSnip), felvehetsz egyedi Java sablonokat. Létrehozol egy üres UserController.java fájlt, beírod, hogy !ctrl, nyomsz egy Tabot, és a Neovim beilleszti az egész @RestController struktúrát. Bár az nvim-java is segít a kódkiegészítésben, a teljes osztályok vázának felhúzásához a snippetek a legjobbak.

3. A nehéztüzérség: JHipster
Létezik egy harmadik féltől származó, elképesztően robusztus CLI generátor a Spring Boot világában, a JHipster (jhipster entity BankAccount).
Ez nem csak az osztályokat hozza létre, hanem legenerálja hozzá az adatbázis migrációkat, a végpontokat, a DTO-kat, a teszteket, sőt, még egy Angular/React frontendet is, ha kéred. Egy egyetemi netbank projekthez (főleg, ha most tanulod a keretrendszert) viszont túl nagy ágyú. Annyi kódot fog a mappáidba szórni egyetlen paranccsal, hogy napokig fogod olvasni, mire megérted, mi mit csinál.
---
