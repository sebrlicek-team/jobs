# Jobs — Prostor pro myšlenku

Černobílý web se 100 volnými českými parafrázemi myšlenek Steva Jobse. Obsahuje všech 30 původních myšlenek a 70 dalších. Nejde o doslovné citace.

## Spuštění

Web nevyžaduje sestavení ani externí závislosti. Publikovat lze obsah adresáře `dist/` na libovolném statickém hostingu. Lokálně spusťte `python3 -m http.server 8000 --directory dist` a otevřete `http://localhost:8000`.

## Ovládání

- Posouvání postupně odhaluje slova; rychlost animace odpovídá posouvání.
- Slunce a měsíc přepínají vzhled a ukládají volbu do prohlížeče.
- Přehled „100 myšlenek“ umožňuje přejít přímo na libovolný text.
- Pravý okraj přeskakuje mezi desítkami; šipky vlevo a vpravo mezi sousedními texty.
- Web respektuje systémové omezení pohybu. V patičce lze animace také ručně vypnout.

GitHub Pages může publikovat větev `gh-pages`, složku `/ (root)`. Tato větev obsahuje přímo statické soubory.
