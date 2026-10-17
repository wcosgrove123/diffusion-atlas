# Geometry review: every polity shape (Phase 1 West Africa, Phase 2 the rest, part 3 Cliopatria)

For Wil. Every polity shape the map draws, with a screenshot, for your approval. **All of them are drafts.**
Part 1 is West Africa (Phase 1); part 2 is the other four regions (Phase 2); part 3 says which shapes
now come from Cliopatria (Seshat's open polity-borders dataset, 2026-10-17) and which do not, and why.
Hand-drawn shapes (method H) are the one place the build authors historical content (docs/build-plan.md, "Data rules"),
so none should ship to students as final until you approve it here.

How the shapes are made: `data/geometry/polity-shapes.yaml` lists each shape (method, years, basis, and either the
aourednik starting polygon with its cuts or the hand-drawn outline). `tools/build_geometry.py africa` turns it into
`data/geometry/polities/<place-id>.geojson`, rounds the corners, clips it to the land, and drops holes and slivers.
Methods follow docs/geometry-audit.md section 5: **E** = an aourednik/historical-basemaps polygon (GPL-3.0), edited;
**H** = drawn from the place's `geometry_note`, not traced from aourednik.

In each screenshot the shape's edge is traced in black, at a year inside its span. What else is on the map is the
student view at that year: fill = rural profile, inner ring = court profile, circles = towns.

## How to approve or change a shape

- **Approve:** change `review: draft` to `review: approved` for that entry in `data/geometry/polity-shapes.yaml`
  (or tell me which ones in chat).
- **Source:** `from: {source: cliopatria, ...}` or `{source: aourednik, ...}` picks the published dataset.
- **Change:** say what to move ("Takrur further north at Dagana", "Mali c.1250 should include Bambuk"), or edit the
  `outline` points (`[longitude, latitude]`, west is negative) or the `remove` boxes yourself. Then rebuild:

  ```
  python tools/build_geometry.py africa
  cd app && npm run build && GEOMETRY_REVIEW=1 PW_CHANNEL=msedge npx playwright test geometry-review --project=desktop
  ```

  The second line regenerates the screenshots in `docs/geometry-review/`.

## Questions for you (West Africa)

1. **Mali c.1250 core (1235 to 1300).** The `geometry_note` says "Core: upper Niger and Sankarani between Kangaba and
   Siguiri, with the Bure goldfield; Bambuk to the west." I read Bambuk as *outside* the core (it is a separate
   tributary place, `pl-bambuk-bure`), so the draft stops near the Bafing. Should the c.1250 shape include Bambuk?
2. **Mali after 1433.** The audit names three Mali shapes (c.1250, c.1330 to 1350, c.1400). I added a fourth from
   1433 that cuts the north at 15.8N, because the 1433 keyframe (Tuareg take Timbuktu and Walata) would otherwise
   show both towns inside Mali. Keep it, or drop it?
3. **When the big Mali shape starts and ends.** The audit uses the 1279 aourednik polygon "as the c.1330 to 1350
   snapshot only". The draft uses it from 1300 to 1360, the span between the core and the c.1400 shape. If you want
   the core to last longer (Mali's expansion under Sakura is about 1285 to 1300), move the 1300 boundary.
4. **Ghana (Wagadu) to 1240.** The audit says to use aourednik's Ghana 1200 "for the pre-1203 frame" and fade it
   after Sosso. The draft keeps it to 1240 to match the place span and its religion profiles (the Soninke kingdom
   survived under Sosso, then Mali). Keep 1240, or end it at about 1203?
5. **Kaabu and Bambuk-Bure** have no audit entry, so they show as small squares at their label points (the square's
   center is the rural profile, its border the court profile), not as areas. Do you want H drafts for them?

## Part 1: West Africa

| Place | Years | Method | Basis (short) | Status |
|---|---|---|---|---|
| Mali | 1235 to 1300 | H | upper-Niger core from the geometry_note | draft |
| Mali | 1300 to 1360 | E | aourednik Mali 1279, Mossi south and east of 1.5E cut | draft |
| Mali | 1360 to 1433 | E | as above without Jolof (west of 14W, north of 13.9N) and Gao (east of 1W) | draft |
| Mali | 1433 to 1600 | E | as above, north cut at 15.8N (not in the audit; question 2) | draft |
| Ghana (Wagadu) | 1200 to 1240 | A | aourednik Ghana 1200, relabelled, no edits (question 4) | draft |
| Sosso | 1180 to 1235 | H | Koulikoro hills north of the Niger into Kaniaga | draft |
| Takrur | 1000 to 1500 | H | middle Senegal valley, both banks, Dagana to Bakel | draft |
| Jolof | 1350 to 1549 | H | Wolof interior around Linguere (core only) | draft |
| Songhay kingdom of Gao | 1000 to 1464 | H | middle Niger around Gao and Kukiya | draft |
| Mossi | 1250 onward | H | soft area south of the Niger bend (a people, not a polity) | draft |
| Bono (Bono-Manso) | 1300 to 1723 | H | north of the forest around Bono Manso near Techiman | draft |

The full `basis` text for each shape is in `data/geometry/polity-shapes.yaml` and on every feature in the GeoJSON.

### Mali, 1235 to 1300 (H)

![Mali 1235 to 1300](geometry-review/pl-mali-1235.jpg)

Upper Niger and Sankarani between Kangaba and Siguiri with the Bure goldfield. See question 1 about Bambuk.

### Mali, 1300 to 1360 (E)

![Mali 1300 to 1360](geometry-review/pl-mali-1300.jpg)

aourednik's 1279 polygon with the two trims from the audit: the Mossi south cut away (south of 12.75N, east of 4W)
and the east cut at 1.5E (the audit says about 1 to 2E, at Gao and Tadmekka), which keeps Gao inside. It reaches the Gambia and Senegal rivers and Walata,
as the geometry_note says. The straight edges are the audit's cuts, rounded; say if you want them shaped differently.

### Mali, 1360 to 1433 (E)

![Mali 1360 to 1433](geometry-review/pl-mali-1360.jpg)

The c.1400 shape: Jolof's Wolof lands and Gao removed. Timbuktu and Walata stay until 1433.

### Mali, 1433 to 1600 (E)

![Mali 1433 to 1600](geometry-review/pl-mali-1433.jpg)

North cut at 15.8N after the loss of Timbuktu and Walata. The 15th-century shift west toward the Gambia (Ly-Tall) is
not drawn. See question 2.

### Ghana (Wagadu), 1200 to 1240 (A)

![Ghana 1200 to 1240](geometry-review/pl-ghana-wagadu-1200.jpg)

aourednik's Ghana 1200 around Kumbi and the Hodh, unchanged apart from the relabel and the land clip. See question 4.

### Sosso, 1180 to 1235 (H)

![Sosso 1180 to 1235](geometry-review/pl-sosso-1180.jpg)

From the Koulikoro hills north of the Niger up into Kaniaga. The capital's site is unknown, so the zone is broad.
The label sits at Koulikoro (the research label point).

### Takrur, 1000 to 1500 (H)

![Takrur 1000 to 1500](geometry-review/pl-takrur-1000.jpg)

The middle Senegal valley (later Fuuta Tooro), both banks, about Dagana to Bakel. At its west end the river runs
along the shape's north edge; it could move a little north there. One shape for the whole span; the overlordship
changes (Mali, then Jolof) are not drawn.

### Jolof, 1350 to 1549 (H)

![Jolof 1350 to 1549](geometry-review/pl-jolof-1350.jpg)

The Jolof core around Linguere in the Ferlo. Waalo, Kajoor, Bawol, Siin and Saalum (its tributaries) are not drawn.

### Songhay kingdom of Gao, 1000 to 1464 (H)

![Songhay kingdom of Gao 1000 to 1464](geometry-review/pl-songhay-gao-1000.jpg)

A small zone on the middle Niger from above Gao down past Kukiya. It sits inside Mali from 1300 to 1360, when Gao
was a Mali dependency; its own fill and ring draw on top. The later Songhay empire is outside the window.

### Mossi, 1250 onward (H)

![Mossi 1250 onward](geometry-review/pl-mossi-1250.jpg)

A soft area south of the Niger bend, drawn as a people, not a polity, as the geometry_note says.

### Bono (Bono-Manso), 1300 to 1723 (H)

![Bono 1300 to 1723](geometry-review/pl-bono-1300.jpg)

A small zone north of the forest around Bono Manso near Techiman. Begho (a town) is just to its northwest.

## Part 2: the other four regions (Phase 2)

Methods as above. "A" shapes are aourednik polygons as they are, so they carry aourednik's own approximations
where the audit accepted them (static copies across years, a coast that does not match Natural Earth; the land
clip fixes the coast). "E" shapes say what was cut or added. "H" shapes are drafts from each place's
`geometry_note` and need the most scrutiny. Full `basis` text: `data/geometry/polity-shapes.yaml`.

### Questions for you (Phase 2)

6. **Mamluk Egypt is cut to Africa.** The audit says use the aourednik Mamluk polygon as is; the research note
   says draw Egypt only for this module. I cut the Levant, the Hijaz coast and Nubia south of Aswan. Keep the
   cut, or show the Levant and Hijaz too (they are inside the map frame)?
7. **Ethiopia's halo from 1330.** The Solomonic kingdom jumps from aourednik's 1279 core to its 1492 shape at
   1330 (Amda Seyon's campaigns), which overlaps Ifat and Hadiya, drawn as tributaries. One jump at 1330, or a
   middle step?
8. **Takrur, Jolof and Mali overlap.** Takrur and Jolof sit inside Mali's 1300 to 1360 shape (Mali ruled them
   through governors). The smaller shape draws on top. Fine, or should Mali's west edge stop at the Senegal valley?
9. **The Tuareg sphere** is a wide hatched zone from the Niger bend to the Hoggar. Too wide, or about right for a
   nomadic sphere?
10. **Swahili towns** that are polities in the data (Kilwa, Mogadishu, Mombasa, Malindi) have 25 to 30 km
    buffers. Pate, Lamu, Gedi, Zanzibar and Sofala are towns in the data and stay plain town markers. Right?
11. **The Atlas Amazigh overlay** leaves out the Rif (it would need a second ring). Add it?
12. **Kano and Katsina** are 60 km zones, as the research asks. The Hausa city-states area under them switches
    to the aourednik 1492 envelope at 1440. Keep both layers, or only the city zones?

### Central Sahel and forest

| Place | Years | Method | Basis (short) | Status |
|---|---|---|---|---|
| Kanem | 1075 to 1210 | A | aourednik Kanem 1200 | draft |
| Kanem | 1210 to 1387 | E | the same plus a corridor north to Kawar for the c.1250 maximum | draft |
| Bornu | 1380 onward | E | aourednik Kanem-Bornu 1400 without Bioko, north cut at 16.5N | draft |
| Bulala | 1380 to 1630 | H | Kanem plus the Lake Fitri homeland | draft |
| Kano | 999 onward | H | 60 km city-state zone | draft |
| Katsina | 1300 onward | H | 60 km city-state zone with Durbi ta Kusheyi | draft |
| Hausa city-states | 1000 to 1440 | H | soft area between the Niger and the Bornu borderlands | draft |
| Hausa city-states | 1440 onward | A | aourednik Hausa States 1492 | draft |
| Ile-Ife | 1000 onward | H | 60 km zone around the city | draft |
| Benin | 1000 to 1440 | E | aourednik Benin 1279 kept to the Edo core (5.3E to 6.5E) | draft |
| Benin | 1440 onward | E | aourednik Benin 1279 with the west cut at 4.9E (Ife outside) | draft |
| Agadez | 1405 onward | H | the Air massif | draft |
| Tuareg | 1000 onward | H, nomadic | Air, Adrar des Ifoghas, Niger bend, Hoggar (question 9) | draft |
| Sao communities | 1000 to 1600 | H | Logone-Chari plains south and west of Lake Chad | draft |

**Kanem, 1075 to 1210 (A)**

![Kanem 1075 to 1210](geometry-review/pl-kanem-1075.jpg)

**Kanem, 1210 to 1387 (E)**

![Kanem 1210 to 1387](geometry-review/pl-kanem-1210.jpg)

**Bornu, 1380 onward (E)**

![Bornu 1380 onward](geometry-review/pl-bornu-1380.jpg)

**Bulala, 1380 to 1630 (H)**

![Bulala 1380 to 1630](geometry-review/pl-bulala-1380.jpg)

**Kano, 999 onward (H)**

![Kano 999 onward](geometry-review/pl-kano-999.jpg)

**Katsina, 1300 onward (H)**

![Katsina 1300 onward](geometry-review/pl-katsina-1300.jpg)

**Hausa city-states, 1000 to 1440 (H)**

![Hausa city-states 1000 to 1440](geometry-review/pl-hausa-states-1000.jpg)

**Hausa city-states, 1440 onward (A)**

![Hausa city-states 1440 onward](geometry-review/pl-hausa-states-1440.jpg)

**Ile-Ife, 1000 onward (H)**

![Ile-Ife 1000 onward](geometry-review/pl-ife-1000.jpg)

**Benin, 1000 to 1440 (E)**

![Benin 1000 to 1440](geometry-review/pl-benin-1000.jpg)

**Benin, 1440 onward (E)**

![Benin 1440 onward](geometry-review/pl-benin-1440.jpg)

**Agadez, 1405 onward (H)**

![Agadez 1405 onward](geometry-review/pl-agadez-1405.jpg)

**Tuareg, 1000 onward (H, nomadic)**

![Tuareg 1000 onward](geometry-review/pl-tuareg-1000.jpg)

**Sao communities, 1000 to 1600 (H)**

![Sao communities 1000 to 1600](geometry-review/pl-sao-1000.jpg)

### North Africa and Egypt

| Place | Years | Method | Basis (short) | Status |
|---|---|---|---|---|
| Almohad Caliphate | 1121 to 1235 | E | aourednik Almohad 1200 plus Ifriqiya, al-Andalus cut | draft |
| Almohad Caliphate | 1235 to 1269 | H | the Marrakesh region only | draft |
| Marinid Sultanate | 1244 to 1300 | A | aourednik Merinides 1279 | draft |
| Marinid Sultanate | 1300 to 1465 | A | aourednik Morocco 1300 | draft |
| Zayyanid Sultanate | 1235 to 1556 | H | Tlemcen-centred, 2W to 2E | draft |
| Hafsid Sultanate | 1229 to 1574 | E | aourednik Hafsid 1300 with the west cut at 1.5E | draft |
| Ayyubid Sultanate | 1171 to 1250 | E | Egypt portion of aourednik Mamluke 1279 | draft |
| Mamluk Sultanate | 1250 to 1517 | E | the same, cut to Egypt and Cyrenaica (question 6) | draft |
| Tamazight-speaking highlands | 1200 to 1450 | H | the Atlas band from the Sous to the Middle Atlas (question 11) | draft |

**Almohad Caliphate, 1121 to 1235 (E)**

![Almohad Caliphate 1121 to 1235](geometry-review/pl-almohads-1121.jpg)

**Almohad Caliphate, 1235 to 1269 (H)**

![Almohad Caliphate 1235 to 1269](geometry-review/pl-almohads-1235.jpg)

**Marinid Sultanate, 1244 to 1300 (A)**

![Marinid Sultanate 1244 to 1300](geometry-review/pl-marinids-1244.jpg)

**Marinid Sultanate, 1300 to 1465 (A)**

![Marinid Sultanate 1300 to 1465](geometry-review/pl-marinids-1300.jpg)

**Zayyanid Sultanate, 1235 to 1556 (H)**

![Zayyanid Sultanate 1235 to 1556](geometry-review/pl-zayyanids-1235.jpg)

**Hafsid Sultanate, 1229 to 1574 (E)**

![Hafsid Sultanate 1229 to 1574](geometry-review/pl-hafsids-1229.jpg)

**Ayyubid Sultanate, 1171 to 1250 (E)**

![Ayyubid Sultanate 1171 to 1250](geometry-review/pl-ayyubids-1171.jpg)

**Mamluk Sultanate, 1250 to 1517 (E)**

![Mamluk Sultanate 1250 to 1517](geometry-review/pl-mamluks-1250.jpg)

**Tamazight-speaking highlands, 1200 to 1450 (H)**

![Tamazight-speaking highlands 1200 to 1450](geometry-review/pl-atlas-amazigh-1200.jpg)

### Nubia and the Horn

| Place | Years | Method | Basis (short) | Status |
|---|---|---|---|---|
| Makuria | 580 to 1365 | E | aourednik Makkura 1200 trimmed south at 17.5N (Soba outside) | draft |
| Makuria | 1365 to 1500 | E | the remnant north of 21.3N after the 1365 civil war | draft |
| Alodia | 580 to 1504 | A | aourednik Alwa 1200 | draft |
| Zagwe kingdom | 1137 to 1270 | H | Lasta and Wag with Tigray and Amhara | draft |
| Christian kingdom of Ethiopia | 1270 to 1330 | A | aourednik Ethiopia 1279 as the core | draft |
| Christian kingdom of Ethiopia | 1330 onward | A | aourednik Ethiopia 1492 as core plus tributary halo (question 7) | draft |
| Damot | 1200 to 1550 | H | south of the Blue Nile bend | draft |
| Hadiya | 1250 to 1600 | H | south of the Awash | draft |
| Ifat | 1285 to 1415 | E | aourednik Shoa 1279 relabelled, extended west to Wafat and east to Zeila | draft |
| Adal | 1415 to 1577 | E | aourednik Adal 1492 extended to Zeila and the Harar plateau | draft |
| Beta Israel | 1200 onward | H | Semien, Wegera, Dembiya, around Lake Tana | draft |

**Makuria, 580 to 1365 (E)**

![Makuria 580 to 1365](geometry-review/pl-makuria-580.jpg)

**Makuria, 1365 to 1500 (E)**

![Makuria 1365 to 1500](geometry-review/pl-makuria-1365.jpg)

**Alodia, 580 to 1504 (A)**

![Alodia 580 to 1504](geometry-review/pl-alodia-580.jpg)

**Zagwe kingdom, 1137 to 1270 (H)**

![Zagwe kingdom 1137 to 1270](geometry-review/pl-zagwe-1137.jpg)

**Christian kingdom of Ethiopia, 1270 to 1330 (A)**

![Christian kingdom of Ethiopia 1270 to 1330](geometry-review/pl-ethiopia-solomonic-1270.jpg)

**Christian kingdom of Ethiopia, 1330 onward (A)**

![Christian kingdom of Ethiopia 1330 onward](geometry-review/pl-ethiopia-solomonic-1330.jpg)

**Damot, 1200 to 1550 (H)**

![Damot 1200 to 1550](geometry-review/pl-damot-1200.jpg)

**Hadiya, 1250 to 1600 (H)**

![Hadiya 1250 to 1600](geometry-review/pl-hadiya-1250.jpg)

**Ifat, 1285 to 1415 (E)**

![Ifat 1285 to 1415](geometry-review/pl-ifat-1285.jpg)

**Adal, 1415 to 1577 (E)**

![Adal 1415 to 1577](geometry-review/pl-adal-1415.jpg)

**Beta Israel, 1200 onward (H)**

![Beta Israel 1200 onward](geometry-review/pl-beta-israel-1200.jpg)

### Swahili coast and the interior

| Place | Years | Method | Basis (short) | Status |
|---|---|---|---|---|
| Kilwa Kisiwani | 1000 to 1505 | H | point with a 30 km coastal buffer (question 10) | draft |
| Mogadishu | 1100 to 1600 | H | point with a 30 km coastal buffer | draft |
| Mombasa | 1100 onward | H | point with a 25 km coastal buffer | draft |
| Malindi | 1250 onward | H | point with a 25 km coastal buffer | draft |
| Great Zimbabwe | 1200 to 1450 | A | aourednik Great Zimbabwe 1279 | draft |
| Mapungubwe | 1220 to 1290 | H | the Shashe-Limpopo confluence | draft |
| Mutapa | 1430 onward | H | the northern plateau and the Zambezi escarpment | draft |
| Coastal hinterland farmers | 1000 onward | H | a 10 to 50 km strip behind the coast, Lamu to past Kilwa | draft |

**Kilwa Kisiwani, 1000 to 1505 (H)**

![Kilwa Kisiwani 1000 to 1505](geometry-review/pl-kilwa-1000.jpg)

**Mogadishu, 1100 to 1600 (H)**

![Mogadishu 1100 to 1600](geometry-review/pl-mogadishu-1100.jpg)

**Mombasa, 1100 onward (H)**

![Mombasa 1100 onward](geometry-review/pl-mombasa-1100.jpg)

**Malindi, 1250 onward (H)**

![Malindi 1250 onward](geometry-review/pl-malindi-1250.jpg)

**Great Zimbabwe, 1200 to 1450 (A)**

![Great Zimbabwe 1200 to 1450](geometry-review/pl-great-zimbabwe-1200.jpg)

**Mapungubwe, 1220 to 1290 (H)**

![Mapungubwe 1220 to 1290](geometry-review/pl-mapungubwe-1220.jpg)

**Mutapa, 1430 onward (H)**

![Mutapa 1430 onward](geometry-review/pl-mutapa-1430.jpg)

**Coastal hinterland farmers, 1000 onward (H)**

![Coastal hinterland farmers 1000 onward](geometry-review/pl-coast-hinterland-1000.jpg)

## Part 3: Cliopatria (Seshat Global History Databank), 2026-10-17

Cliopatria is an open (CC BY 4.0) world dataset of polity borders with year ranges, hosted by the Seshat Global
History Databank. You asked to use it where it agrees with our research. `tools/extract_cliopatria.py` clips it to
the frame (`data/geometry/africa/cliopatria.geojson`), and each shape below was checked against the places the
research notes say must be inside or outside. The attribution line on the map now credits it.

### Switched to Cliopatria

| Place | Cliopatria rows used | Why it agrees | What changed on the map |
|---|---|---|---|
| Mali, 1300 to 1360 | Mali Empire 1241 to 1414 | Timbuktu, Gao, Walata, Djenne, Niani and the Senegal valley inside; Mossi and Tadmekka outside, with no cuts needed | A rounder, slightly smaller shape than the trimmed aourednik one (0.68 of its area) |
| Mali, 1360 to 1433 and 1433 on | the same, with our cuts | Cliopatria keeps Mali whole until 1463, which the notes do not support, so the Jolof, Gao and post-1433 cuts stay | Same cuts, new base |
| Takrur | Takrur 1139 to 1235 | The middle Senegal valley with Podor inside and Jolof outside | Wider than the hand strip; both banks and hinterland |
| Almohads, 1121 to 1250 | Almohad Caliphate 1202 to 1235, then 1241 to 1249 | Runs from the Atlantic to Tripolitania as the note says; the break-up after 1229 and 1235 is drawn | No more hand-added Ifriqiya; a second, shrunken snapshot for 1236 to 1250 |
| Marinids | 1363 to 1414 (used from 1244), 1344 to 1351, 1352 to 1362 | Fez, Marrakesh, Sijilmasa inside, Tlemcen out; and it draws Abu al-Hasan's Tlemcen and Abu Inan's Tunis, the brief maxima the note mentions | Two extra snapshots in the 1340s and 1350s |
| Zayyanids | 1285 to 1343 and 1363 to 1506 | Tlemcen-centred, Fez and Tunis outside | A published shape replaces my hand-drawn one; no Zayyanid shape in 1344 to 1362, when the Marinid shapes cover Tlemcen |
| Ethiopia | 1272 to 1332, then 1333 to 1501 | Lalibela, Hayq and Debre Libanos inside; the kingdom grows at 1333, which matches Amda Seyon's campaigns in the note | The growth step moves from 1330 (our guess) to 1333 (theirs) |
| Ifat | 1285 to 1414, plus our western ring | Reaches Zeila, as the note says and aourednik did not; its west edge stops short of Wafat, so the Shewa escarpment ring is kept | Larger to the east and south |
| Adal | 1415 to 1528 | Dakkar and Zeila inside | No more hand-added extensions |

### Kept as before (Cliopatria disagrees with the research)

| Place | What Cliopatria has | Why it stays as before |
|---|---|---|
| Kanem | 20,000 km² south of Lake Chad, without Njimi | The note puts Kanem north-east of the lake with Njimi inside and a reach to Kawar |
| Bornu | 14,000 km² | Too small for the Sayfawa sultanate west of the lake |
| Sosso | Ghana's polygon relabelled, without Koulikoro | The note's core is the Koulikoro hills |
| Ghana (Wagadu) | 205,000 km², shifted east toward the Niger bend | The note's core is Kumbi and the Hodh; aourednik's shape sits there |
| Zagwe | 14,000 km², Lasta only | The note gives authority over Tigray, Eritrea and Amhara |
| Makuria | a Nile strip that misses Old Dongola | The capital must be inside |
| Alodia | 124,000 km² north of Soba | The note says the Gezira, south of Soba |
| Ayyubids, Mamluks | Egypt with the Levant and the Hijaz | The notes say draw Egypt only; our aourednik cut already does that |
| Hafsids | 225,000 km² from 4.4E | Smaller than the note's Ifriqiya with Algiers and Constantine; kept the aourednik shape cut at 1.5E. A judgment call |
| Everything else | not in Cliopatria | Great Zimbabwe, the Swahili towns, the Hausa states, Benin, Ife, Mossi, Jolof, Bono, Mutapa, Mapungubwe and the peoples are absent from it |

### Questions for you (part 3)

13. **Hafsids:** keep the larger aourednik shape (with Algiers) or Cliopatria's smaller one (from Bougie east)?
14. **Mali after 1414:** Cliopatria grows Mali to 1.1 million km² for 1415 to 1462 and only shrinks it from 1463. Our
    research has Gao lost in the early 1400s and Timbuktu in 1433, so the cuts stay. Agree?

Screenshots for the switched shapes are in the part 1 and part 2 sections above (the same file names).
