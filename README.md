# Koupačka 100 — návod k použití

Osobní aplikace pro zapisování míst, kde jsi byl/a koupat se. Cílem je nasbírat **100 míst**.

## Instalace na telefon

1. Zkopíruj soubor `app-debug.apk` (najdeš ho v `android/app/build/outputs/apk/debug/`) do telefonu.
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
