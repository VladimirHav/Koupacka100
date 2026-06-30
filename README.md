# Koupačka 100 — návod k použití

Osobní aplikace pro zapisování míst, kde jsi byl/a koupat se. Cílem je nasbírat **100 míst**.

Cíl 100 míst vychází ze činu **1P2 — Koupání v řekách, rybnících, ...** 


**VL + ML**

- Koupej se¹⁴ ve **100** řekách, jezerech, potocích, rybnících, přehradách, mořích⁷ — **ČIN**
- Koupej se¹⁴ ve **200** řekách, jezerech, potocích, rybnících, přehradách, mořích⁷ — **VELKÝ ČIN**

**ML:** Koupej se ve 3× tolika řekách, jezerech, potocích, rybnících, přehradách, kolik je ti let.

## Vysvětlivky

**⁷ Evidence**

(nachozené km, noci v přírodě apod.): nutno předložit záznamy, které budou u každé položky obsahovat minimálně datum, místo a počet (km, nocí, …).

**¹⁴ Koupej se**

ponoř se do vody celý až po krk a pokud možno udělej alespoň 2 tempa.


## Instalace na telefon

1. Zkopíruj soubor `app-debug.apk` (najdeš ho v `android/app/build/outputs/apk/debug/`) do telefonu nebo z adresáře Applikace.
2. Otevři soubor v telefonu a potvrď instalaci (Android se může zeptat na povolení instalace z neznámého zdroje — je to v pořádku, aplikace není z Google Play).
3. Při prvním použití GPS nebo fotoaparátu se zobrazí systémové žádosti o povolení — potvrď je, jinak tyto funkce nebudou fungovat.

## Hlavní obrazovka

Po otevření vidíš seznam všech zapsaných koupání jako kartičky. Číslo v záhlaví (např. `5/100`) ukazuje, kolik míst máš zapsáno z cílových 100.

- **Plus tlačítko** (vpravo dole) — vytvoří nový záznam.
- **Klepnutí na kartičku** — otevře detail záznamu.
- **Přejetí kartičky doleva** — zobrazí možnost smazání.
- **Ikony nahoře v záhlaví** — export a import záznamů (viz níže).

## Vytvoření nového záznamu

1. Klepni na **+**.
2. **Datum** — předvyplněné na dnešek, můžeš změnit.
3. **Místo** — napiš název místa (např. "Bagr Poděbrady").
4. **GPS poloha** — klepni na *Získat polohu* a aplikace zjistí souřadnice tvé aktuální pozice.
5. **Kvalita vody** a **Přístup do vody** — posuvníky od 1 do 10. Klepnutím na text na okraji posuvníku (např. "Špatná"/"Dobrá") se hodnota posune o jeden krok daným směrem.
6. **Teplota vody** — posuvník od 1 do 5, stejné ovládání.
7. **Komentář** — volitelná poznámka, max. 500 znaků.
8. **Fotky** — *Vyfotit* vyfotí jednu fotku fotoaparátem, *Vybrat z galerie* umožní vybrat i více fotek najednou. Fotku lze odstranit křížkem v jejím náhledu.
9. Klepni na **Uložit**.

## Detail záznamu

Zobrazuje všechny zadané údaje včetně fotek, data koupání a data, kdy byl záznam vytvořen. Odsud lze záznam **upravit** nebo **smazat** (smazání je nutné potvrdit).

## Export a import dat

- **Export** (ikona stažení) — vytvoří soubor `moje-plavani-DATUM.json` se všemi záznamy včetně fotek a otevře nabídku "Sdílet", odkud si soubor můžeš uložit (např. do Souborů, na Disk, poslat e-mailem).
- **Import** (ikona nahrání) — vybereš dříve exportovaný `.json` soubor a záznamy se načtou zpět. Import je bezpečný i opakovaně — záznamy se stejným ID se jen přepíšou, nezduplikují se.

Doporučení: po větším počtu nových záznamů si občas udělej export jako záložní kopii.

## Často kladené otázky

**Proč aplikace žádá o přístup k poloze/fotoaparátu?**
Pouze pro funkce *Získat polohu* a *Vyfotit/Vybrat z galerie*. Bez povolení tyto konkrétní tlačítka nebudou fungovat, zbytek aplikace ano.

**Kde se data ukládají?**
Pouze v telefonu (lokálně), nikam se neodesílají. Proto je dobré dělat zálohy přes export.

**Co když omylem smažu záznam?**
Mazání je nutné potvrdit dialogem. Pokud máš zálohu (export), můžeš záznamy obnovit importem.

---

## Developer setup (after cloning the repository)

This is an Ionic React app with a Capacitor Android wrapper. The web app is the source of truth; the Android project under `android/` is generated/synced from it.

### Prerequisites

- **Node.js** 18+ and npm
- **Android Studio / Android SDK** (`ANDROID_HOME` set) — only needed if you want to build the Android APK, not for browser development
- **JDK 17+** for the Android Gradle build (a JDK 8 system default, common on older setups, will fail the build). The repo's `build-apk.bat` points at a specific JDK 21 path — update that path if your machine doesn't have it there (e.g. point it at Android Studio's bundled JBR, usually `<Android Studio install dir>\jbr`).

### Install dependencies

```sh
npm install
```

### Run in the browser

```sh
run-browser.bat
```

(equivalent to `npm run dev -- --open`). This starts the Vite dev server and opens the app in your default browser — fastest loop for UI/feature work. Camera/GPS/export use the browser-based service implementations (file picker, `navigator.geolocation`, a Blob download) in this mode.

### Build the Android APK

```sh
build-apk.bat
```

This runs, in order: `npm run build` (web bundle) → `npx cap sync android` (copies the web build and any new/updated Capacitor plugins into the native project) → a Gradle debug build. The resulting APK lands at:

```
android/app/build/outputs/apk/debug/app-debug.apk
```

Copy that file to an Android device to install it (see the Czech installation instructions above). This project is not configured for Play Store distribution — only debug/sideload builds.

### Project structure pointers

- `src/services/*/` — platform abstractions (storage, camera, geolocation, file export). Each has a `Web*` implementation and a `Capacitor*` implementation; `src/services/platform.ts` picks one at runtime via `Capacitor.isNativePlatform()`. Add new platform-dependent features through this pattern rather than calling browser or Capacitor APIs directly from a page/component.
- `src/pages/` — one folder per screen (list, create/edit form, detail).
- `src/domain/record.ts` — the `SwimRecord` data model and validation.
- `src/state/` — React Context + reducer wrapping the repository; `useRecords()` is the hook pages call.
- `capacitor.config.ts` — app id/name and web build output dir used by the Android wrapper.

### Notes if you change platform/native code

- Adding a new Capacitor plugin: `npm install @capacitor/<plugin>`, then run `build-apk.bat` (or `npx cap sync android` directly) so the native project picks it up.
- Changing the app icon: regenerate via `npx capacitor-assets generate --android` from a square source image in `resources/icon.png`, then rebuild.
- The Android project's permissions live in `android/app/src/main/AndroidManifest.xml`; app display name lives in `android/app/src/main/res/values/strings.xml` and `capacitor.config.ts` (`appName`) — keep both in sync.
