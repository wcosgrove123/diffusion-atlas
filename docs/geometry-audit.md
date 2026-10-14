# Geometry audit: open-source polygons and points for Africa, 1200–1450

Audited 2026-10-14. Frame: lon -20..60, lat -36..40 (Africa plus the Iberian and Arabian margins).
Canonical place list: `data/research/africa/_registry.yaml`.

**Bottom line.** No open dataset gives usable 1200–1450 borders for most of the registry. aourednik/historical-basemaps
is the only real polygon source. In the window it amounts to about three distinct states (1200, 1279/1300, 1400),
and every border is `BORDERPRECISION=1`. Its North African and Egyptian polygons are roughly usable. Its Sahel, Horn
and Nubian polygons are frequently misdated, mislabelled or misplaced. Plan to hand-draw soft extents for most
sub-Saharan polities and use aourednik only as a starting sketch. Natural Earth covers the physical base well,
apart from Lake Chad and modern reservoirs. OpenHistoricalMap and AtlasPI add nothing usable.

---

## 1. Sources

| Source | What | License | URL | Staged files |
|---|---|---|---|---|
| aourednik/historical-basemaps | World political/cultural polygons by snapshot year; settlement points | **GPL-3.0** (repo `LICENSE`) | https://github.com/aourednik/historical-basemaps (HEAD `da7a4b7`) | `data/geometry/raw/aourednik/world_{1000,1100,1200,1279,1300,1400,1492,1500,1530}.geojson`, `places.geojson`, `index.json`, `LICENSE`, `README.md` (17 MB, originals untouched) |
| (derived) Africa clips | The above, clipped to the frame, slivers <1 km² dropped, with area and inventory | GPL-3.0 (derivative) | built by `tools/extract_africa.py` | `data/geometry/africa/aourednik_<year>.geojson` (9 files), `aourednik_places.geojson`, `aourednik_inventory.json` (1.9 MB) |
| Natural Earth vector 5.2.0-pre | Physical base layers | Public domain | https://github.com/nvkelso/natural-earth-vector (HEAD `ca96624`), `geojson/` dir | `data/geometry/raw/naturalearth/` (48 MB): `ne_50m_{coastline,land,ocean,rivers_lake_centerlines,lakes,playas,geography_regions_polys}`, `ne_10m_{coastline,land,rivers_lake_centerlines,lakes,lakes_historic,playas,geography_regions_polys,geography_regions_elevation_points}` (all `.geojson`), plus `LICENSE.md`, `VERSION` |
| Natural Earth raster | Shaded relief (`SR_50M`, 10800×5400, ~11 MB zip, v3.2.0); alternatives `NE2_50M_SR` ("suited to historical mapping"), `GRAY_50M_SR`, `MSR_50M` (manual shaded relief) | Public domain | https://www.naturalearthdata.com/downloads/50m-raster-data/ | **Not staged.** naciscdn.org and naturalearthdata.com are blocked from this shell (403), and GitHub does not mirror the rasters. Download by hand. |
| RESOLVE Ecoregions 2017 (Dinerstein et al. 2017, *BioScience* doi:10.1093/biosci/bix014) | 846 ecoregions in 14 biomes; the source for Sahara/Sahel/savanna/forest zones | **CC-BY 4.0** | https://ecoregions.appspot.com/ ; Earth Engine `RESOLVE/ECOREGIONS/2017`; zip usually at `storage.googleapis.com/teow2016/Ecoregions2017.zip` | **Not staged** (all hosts blocked from this shell). Download by hand, dissolve by `BIOME_NAME`, clip to frame, simplify. |
| OpenHistoricalMap | Crowd-mapped dated features | **CC0** (data "in the public domain under a Creative Commons CC0 dedication unless noted otherwise"; OHM deliberately avoided ODbL) | https://www.openhistoricalmap.org | None. Nothing usable (see §6). |
| AtlasPI | REST + MCP API, 1,006+ "entities" with GeoJSON and confidence scores | Code Apache-2.0; data "retain original licenses" | https://atlaspi.it , https://github.com/Soil911/AtlasPI | None. Not usable (see §7). |

Natural Earth layers per job (Africa frame):

| Job | File | Notes |
|---|---|---|
| Land fill | `ne_50m_land` (zoom ≤5), `ne_10m_land` (zoom 6+) | 10m is 10 MB world-wide; clip to frame for the app |
| Coastline | `ne_50m_coastline` / `ne_10m_coastline` | |
| Rivers | `ne_10m_rivers_lake_centerlines` | 50m lacks **Gambia, Bani, Logone, Komadugu Yobe, Sokoto, Kaduna, Awash, Shabeelle, Moulouya, Sebou, Tekeze, Rufiji, Save**. 10m has all of them. Names: Senegal is `Sénégal` (scalerank 4); Blue Nile is `Abay` / `El Bahr el Azraq`; White Nile is `El Bahr el Abyad` / `Bahr el Jebel`; Benue is `Benue` + `Bénoué`. Missing even at 10m: Falémé, Bakoye, Drâa, Medjerda. **Drop** `Suez Canal`, `Ismailiya Canal`, `Gharraf Canal`. |
| Lakes | `ne_10m_lakes` | **Drop the 23 `featurecla='Reservoir'` features in frame**: Lake Nasser, Lake Volta, Kainji, Kariba, Cahora Bassa, Kossou, Buyo, Roseires, Khashm el Girba, M'Bakaou, and others. Lake Débo (Niger inland delta) is present. Lakes Faguibine, Horo and Télé are not. |
| Lake Chad | `ne_10m_lakes_historic` (one feature, "Lake Chad", 23,492 km², 13.03–15.32E, 12.45–14.37N) | **Problem.** The `ne_10m_lakes`/`ne_50m_lakes` Lake Chad is the post-drought remnant (~1,300 km², 14.25–14.77E). That is the wrong lake for any pre-1970 map. Use the `lakes_historic` polygon, which is roughly the mid-20th-century "normal" lake, drawn with a soft edge. Lake levels in 1200–1450 fluctuated and are not reconstructible at this scale. Say so in the map notes, and keep Njimi and the Kanem/Bornu labels clear of the shoreline. |
| Seasonal pans | `ne_10m_playas` | Chott el Djerid, Chott Melrhir and similar |
| Physical labels | `ne_10m_geography_regions_polys` (+ `_elevation_points`) | Label polygons only: SAHARA, SAHEL, Fouta Djallon, Aoukâr, El Djouf, Ténéré, Tagant, SUDD, ETHIOPIAN HIGHLANDS, Gezira, Niger Delta, the coast names (Gold, Slave, Grain). **Not a biome layer**: the SAHEL polygon lies entirely inside the SAHARA polygon. |
| Biomes | RESOLVE 2017, by hand | These are modern potential-vegetation zones. The Sahel/Sahara boundary c.1300 was not today's, so present them as "present-day ecological zones" |

---

## 2. aourednik: what the files are

- Snapshot years in 1000–1550: **1000, 1100, 1200, 1279, 1300, 1400, 1492, 1500, 1530**. There is nothing between 1400 and 1492, so the window's end (1450) falls in a gap.
- Every feature in the frame, in every year, has `BORDERPRECISION = 1` (approximate). The field cannot separate good borders from guessed ones.
- Many polygons are copied unchanged between snapshots. Identical geometry: Kanem, Ghana and Makkura in 1000/1100/1200; Ethiopia, Shoa, Makkura, Alwa, Islamic city-states, Great Zimbabwe and Mamluke Sultanate in 1279/1300/1400; Mali and Kanem-Bornu in 1279/1300. In practice the window has three states: **1200**, **1279≈1300**, **1400**.
- The 1200 file has 25 zero-area unnamed slivers along the Guinea and Cape coasts (dropped by the script).
- Large unnamed polygons: an 8.6 million km² null-`NAME` blob in 1300/1400 (Sahara plus much else), and 4.2 million km² in 1279.
- The coastline does not match Natural Earth. In the frame (1300), 103,000 km² of aourednik polygons lie over NE sea and 227,000 km² of NE land are uncovered. Coastal points fall just outside polygons: Alexandria, Zeila, Mombasa, Lamu, Kilwa, Zanzibar, Sofala.
- **`places.geojson` is useless here.** It has 1,093 points in the frame, but they are almost all Levant/Egypt archaeological sites (many in Hebrew/Arabic only). Only 30 carry `inhabitedSince`. South of 24N there are three: Timbuktu (since -500), Zanzibar (since 0) and Great Zimbabwe (since 1000). North Africa has Tlemcen, Cirta, Lambaesa and Siga; there is no Fez, Marrakesh, Tunis, Kairouan, Cairo or Sijilmasa. **Take every point from our own research records.**

### Per-year Africa features (≥1,000 km² in frame; margin features listed by name only)

Full inventory, with label points and bounds: `data/geometry/africa/aourednik_inventory.json`.
Re-run with `python3 tools/extract_africa.py --report`.

**1000** and **1100** (context): Bantu peoples, West African cereal farmers, Khoisan, Fatimid Caliphate, Makkura, Alwa, Islamic city-states, Great Zimbabwe, Kanem, Ghana, Mali, Takrur, Madagascar, Merina Kingdom, Guanches, Caliphate of Córdoba (1000) / Almoravid dynasty (1100, 2.26 million km², -17.1..4.3 / 16.5..40), plus an unnamed Sahara blob.

**1200**

| NAME | km² | lon / lat bbox |
|---|---:|---|
| Bantu peoples | 8,479,477 | 5.3..43.4 / -20.0..7.7 |
| Tuareg Nomadic Tribes | 5,816,694 | 0.3..30.8 / 10.2..32.8 |
| West African cereal farmers | 4,938,541 | -17.0..**51.2** / 2.5..14.9 |
| Berber Tribes | 2,721,886 | -17.4..0.5 / 13.3..32.4 |
| Khoisan | 2,494,378 | 12.5..35.5 / -35.0..-19.1 |
| Fatimid Caliphate | 1,823,764 | 0.5..41.9 / 19.7..37.3 |
| Ifat | 838,398 | 32.3..43.5 / 5.5..18.6 |
| Makkura | 661,228 | 29.3..37.9 / 15.4..24.4 |
| Almohad Caliphate | 579,676 (673,679 unclipped) | -9.9..4.3 / 30.4..40.0 |
| Madagascar | 430,017 | 43.3..50.5 / -25.7..-12.3 |
| Alwa | 350,964 | 30.5..35.6 / 10.0..16.8 |
| Islamic city-states | 337,837 | 37.7..47.6 / -11.2..4.1 |
| Great Zimbabwe | 214,684 | 28.3..33.4 / -23.1..-18.6 |
| Kanem | 208,349 | 12.6..19.4 / 13.1..16.2 |
| Ghana | 202,494 | -11.9..-4.8 / 14.3..17.6 |
| Merina Kingdom | 150,148 | 45.3..48.5 / -23.6..-16.9 |
| Mali | 126,097 | -9.6..-4.6 / 11.3..13.9 |
| Ibadites | 115,234 | -2.6..2.5 / 29.6..32.7 |
| Takrur | 70,285 | -16.2..-13.6 / 13.8..16.5 |
| Guanches | 8,741 | Canaries |

Margin: Buwayhid Emirates, Byzantine Empire, Portugal, Yemen, Hadramaut, Muscat, Cyprus, Sardinia, Armenia, Ghaznavid, Kara Khitai, Cuman, Bulgar, Duchy of Benevento, unnamed Arabia.

**1279** (1300 is the same except as noted)

| NAME | km² | lon / lat bbox |
|---|---:|---|
| Bantu peoples | 8,466,662 | 6.1..43.4 / -20.0..7.7 |
| Touareg *(1279 only)* | 4,427,844 | -17.1..12.6 / 10.8..32.8 |
| West African cereal farmers | 4,225,642 | -17.0..51.2 / 2.5..14.6 |
| *(unnamed)* | 4,213,504 (8.64 million in 1300) | 10.5..43.5 / 5.5..31.6 |
| Khoisan | 2,494,378 | 12.5..35.5 / -35.0..-19.1 |
| Mali | 1,751,725 | -17.4..**5.3** / **10.1**..18.8 |
| Mamluke Sultanate | 1,244,050 | 18.0..41.9 / 19.7..36.3 |
| Hafsid Caliphate | 688,811 | **-2.2**..18.0 / 28.6..37.3 |
| Madagascar | 430,017 | |
| Makkura | 407,522 | 29.5..38.9 / 15.3..20.9 |
| Kanem-Bornu | 369,060 (+ a 2,125 km² part on **Bioko**) | 10.1..15.8 / 11.2..21.0 |
| Ethiopia | 349,238 | 35.5..40.8 / 7.1..14.5 |
| Islamic city-states | 337,195 | 37.7..47.6 / -11.2..4.1 |
| Great Zimbabwe | 214,684 | 28.3..33.4 / -23.1..-18.6 |
| Alwa | 163,740 | 30.8..35.2 / 11.4..15.6 |
| Merina Kingdom | 150,148 | |
| Merinides *(1279)* → Morocco *(1300)* | 148,530 → 250,592 | -9.9..-4.8 → -9.9..-1.6 / 30.4..35.9 |
| Benin | 107,970 | 3.9..7.4 / 4.3..8.7 |
| Abdelouadides *(1279 only)* | 102,240 | -5.0..-1.6 / 31.7..35.4 |
| Shoa | 48,777 | 41.5..44.3 / 9.5..11.8 |
| Guanches | 8,741 | |

Margin: Ilkhanate, Castile, Aragón, Granada, Portugal, Sicily, Byzantine, Seljuk, Venice (1279), Golden Horde, Yemen, Hadramaut, Muscat, Cyprus, Sardinia.

**1400**: identical to 1300 except Mali 1,571,628 km² (same bbox, slightly trimmed) and West African cereal farmers 4,405,853 km². Margin adds Timurid Empire, Ottoman Empire and Beylik of Aydin.

**1492** (≈1500)

| NAME | km² | lon / lat bbox |
|---|---:|---|
| *(unnamed)* | 8,865,272 | -17.1..43.5 / 5.5..33.3 |
| Bantu peoples | 8,234,112 | |
| West African cereal farmers | 3,979,879 | -17.0..51.2 / 2.5..14.6 |
| Khoisan | 2,356,514 | |
| Mamluke Sultanate | 1,469,392 (+ Suakin-coast part) | 12.1..41.9 / 17.7..38.4 |
| Mali | 624,247 | -17.4..-5.9 / 11.4..18.7 |
| Songhai | 610,877 | -9.4..3.6 / 11.6..19.4 |
| Ethiopia | 502,164 | 35.5..42.5 / 6.5..15.6 |
| Mwenemutapa | 490,762 | 28.0..33.7 / -25.9..-16.1 |
| Kanem-Bornu | 369,083 | 8.3..15.8 / 3.1..21.0 |
| *(unnamed, Upper Guinea)* | 355,814 | -16.8..1.9 / 10.1..15.2 |
| Zayyanid Caliphate | 325,549 | -2.2..6.9 / 32.4..37.1 |
| Islamic city-states | 242,846 | 37.7..44.3 / -11.2..1.3 |
| Hausa States | 240,747 | 3.6..10.7 / 10.9..14.5 |
| Hafsid Caliphate | 227,404 | 6.5..12.5 / 30.8..37.3 |
| Funj | 152,621 | 31.8..34.6 / 11.0..16.5 |
| Wattasid Caliphate | 150,122 | -8.3..-1.6 / 32.3..35.9 |
| Mossi States | 110,024 | -3.8..0.1 / 10.8..13.8 |
| Benin | 107,975 | |
| *(unnamed, Somali coast)* | 94,589 | 39.4..47.6 / -1.4..4.1 |
| Congo | 78,407 | |
| Oyo | 70,868 | 2.0..5.3 / 7.7..9.9 |
| Akan | 47,550 | -3.9..0.5 / 4.7..6.3 |
| Adal | 44,743 | 41.5..44.3 / 9.5..11.8 |
| Alwa | 44,140 | 31.6..34.2 / **16.3..18.3** |
| Ndongo | 15,231 | |

Margin: Ottoman, Castille, Aragón, Portugal, Aq Qoyunlu ("Emirate of the White Sheep Turks"), Timurid Emirates, Arabs, Yemen, Hadramaut, Muscat.

**1530** (context): Ottoman Empire (3.97 million km², now including Egypt), Songhai, Kanem-Bornu, Ethiopia, Adal (337k), Darfur, Wadai, Bagirmi, Senegal, Watassid Morocco, Hausa States, Oyo, Benin, Akan, Congo, Luba, Lunda, Mwenemutapa, Oromo, Islamic city-states.

---

## 3. Registry polities matched to aourednik features

Grades: **good** = usable as is for the stated years; **rough** = right place, wrong size or dates, needs edits;
**wrong** = misplaced, misdated or mislabelled; **missing** = no feature.
Point tests used the capitals or label points listed in the right-hand column.

| Registry id | Best aourednik feature (year) | Grade | Notes |
|---|---|---|---|
| pl-mali | `Mali` 1279/1300 (1.75 million km²); `Mali` 1400 (1.57 million km²) | rough | The 1279 polygon is already Mali at its c.1330–1350 maximum, before Mansa Musa and before Gao was held. It reaches **5.3E** (past Gao into the Aïr margin) and **10.1N**, which puts **Ouagadougou/Mossi inside Mali**. 1400 barely shrinks, although Jolof had seceded (c.1360) and Gao was slipping away. 1000/1100/1200 show a 126,000 km² "Mali" on the upper Niger, presumably meant as pre-imperial Manden. Niani point is inside "West African cereal farmers" in 1200. |
| pl-sosso | none | missing | The Sosso area (Kaniaga) is inside `Berber Tribes` in 1200 |
| pl-ghana-wagadu | `Ghana` 1000/1100/1200 (identical, 202,000 km²) | rough | Fine for c.1000–1100. The 1200 copy ignores the decline and the Sosso conquest (c.1203). Koumbi Saleh and Walata are inside. Gone from 1279. |
| pl-takrur | `Takrur` 1000/1100/1200 (70,000 km²) | **wrong** | Displaced about 1° south. Podor and the middle Senegal valley (Futa Toro) are **outside** it, in `Berber Tribes`. The polygon instead covers the Ferlo/Jolof interior: **Linguere (Jolof) is inside "Takrur"**. Absorbed into Mali from 1279. |
| pl-jolof | none (Linguere is inside `Mali` 1279–1492) | missing | Jolof is still drawn inside Mali in 1492. `Senegal` 1530 is the nearest later feature. |
| pl-songhay-gao | `Songhai` 1492 (611,000 km²) | missing for the window | The 1492 polygon shows the post-1464 Sonni Ali/Askia state, outside the window. The Gao kingdom before c.1430 has no feature: Gao is in `Berber Tribes` (1200) and `Mali` (1279–1400). |
| pl-mossi | `Mossi States` 1492 (110,000 km²) | rough (1492 only) | 1279–1300 put Ouagadougou inside Mali (wrong). Mossi state formation is 15th century and debated. |
| pl-bono, pl-begho | none (`West African cereal farmers`); `Akan` 1492 is a coastal strip at 4.7–6.3N | missing | Bono Manso (7.75N) and Begho (8.38N) are both outside `Akan` |
| pl-kanem | `Kanem` 1000/1100/1200 (208,000 km², east/northeast of Lake Chad) | rough | The location is right for Kanem. The polygon misses the 13th-century reach north to Kawar/Fezzan under Dunama Dibbalemi. **From 1279 Kanem is replaced by `Kanem-Bornu`**, which lies west of the lake (10.1–15.8E), so **Njimi (east of the lake) falls outside any named polity in 1279–1492**. In 1279/1300, while the dynasty was still in Kanem, this is backwards. |
| pl-bornu | `Kanem-Bornu` 1400 / 1492 | rough | The west-of-lake position suits Bornu after c.1380. It runs north to 21N (Kawar). It carries a **detached part on Bioko island** (8.3–8.9E, 3.1–3.7N) in 1279–1492. Ngazargamu was founded c.1460s–70s. |
| pl-hausa-states, pl-kano, pl-katsina | `Hausa States` 1492 (241,000 km²) | missing for the window; rough for c.1450 | There is nothing before 1492: Kano is in `West African cereal farmers`, Katsina in `Tuareg`/`Touareg`/unnamed. There are no individual city-states. |
| pl-ife | none. Ife falls inside `Benin` 1279–1492 | missing / **wrong** | Ife should not sit inside Benin |
| pl-benin | `Benin` 1279/1300/1400/1492 (108,000 km²) | rough | Too big and too early. It runs west to 3.9E (swallowing Ife and much of eastern Yorubaland) and south to the Niger delta at 4.3N. Edo expansion came mainly under Ewuare (c.1440s on). |
| pl-agadez | none | missing | Inside `Touareg` 1279, unnamed later |
| pl-tuareg | `Tuareg Nomadic Tribes` 1200 (5.8 million km²); `Touareg` 1279 (4.4 million km²) | wrong (as a polity) | In 1200 it reaches **30.8E** (Darfur/Libyan desert). In 1279 it is shifted west to the Atlantic and contains **Sijilmasa** and Katsina. It vanishes into an unnamed blob in 1300/1400. It is a nomadic-zone label, not a territory. |
| pl-almohads | `Almohad Caliphate` 1200 | **wrong** in part | Covers Morocco, western Algeria to 4.3E and al-Andalus, but **not Ifriqiya**. In 1200, Tunis and Kairouan sit inside a `Fatimid Caliphate` that ended in 1171. |
| pl-ayyubids | none | missing / **wrong** | Egypt in 1200 is drawn as `Fatimid Caliphate` (1.82 million km², 0.5..41.9E, from the Maghreb to the Hejaz). |
| pl-marinids | `Merinides` 1279; `Morocco` 1300/1400 | good | Fez and Marrakesh are inside. The generic "Morocco" name needs relabelling. |
| pl-hafsids | `Hafsid Caliphate` 1279/1300/1400 (689,000 km²) | rough | Runs west to **-2.2E, so Tlemcen is inside the Hafsid polygon** in every year 1279–1400. Tunis and Kairouan are inside (correct). The 1492 Hafsid polygon (227,000 km²) is too small. |
| pl-zayyanids | `Abdelouadides` 1279; `Zayyanid Caliphate` 1492 | **wrong** in 1279, missing 1300/1400 | The 1279 polygon is **displaced west** (-5.0..-1.6E), so Tlemcen (-1.32) is outside it and inside the Hafsids. No Zayyanid feature at all in 1300/1400. 1492 is plausible. |
| pl-mamluks | `Mamluke Sultanate` 1279/1300/1400 (1.24 million km²), 1492 | good | Egypt, Cyrenaica to 18E, Levant and Hejaz coast. Cairo is inside. Alexandria falls just off the coastline. |
| pl-makuria | `Makkura` 1000–1200 (661,000 km²), 1279–1400 (408,000 km²) | rough / **wrong in 1400** | Old Dongola is inside. In 1279–1400 it runs south to 15.3N and **contains Soba (the Alodian capital)**. 1400 is an unchanged copy of 1279, although Makuria had collapsed by c.1365. |
| pl-alodia | `Alwa` 1000/1100/1200 (351,000 km²) | rough to 1200; **wrong after** | 1279–1400 `Alwa` sits south of Soba (11.4–15.6N), with Soba inside Makkura. 1492 `Alwa` sits **north** of Soba (16.3–18.3N, Makuria's old ground) while `Funj` takes the Gezira. |
| pl-zagwe | none | missing / **wrong** | In 1200 Lalibela is inside a polygon labelled **`Ifat`**. It covers the whole Ethiopian highland plus eastern Sudan (838,000 km², 32.3–43.5E). Ifat did not exist until c.1285 and was a small eastern-Shewan sultanate. |
| pl-ethiopia-solomonic | `Ethiopia` 1279/1300/1400 (349,000 km²); 1492 (502,000 km²) | rough | Plausible soft core (Lalibela, Tegulet and Dembiya are inside), static across 120 years. Acceptable as a soft extent. |
| pl-ifat | `Shoa` 1279/1300/1400 (49,000 km², 41.5–44.3E) | **wrong label**, rough shape | The polygon is in the Harar/Awash lowland: Ifat/Adal country, not highland Shewa (~39–40E). The same polygon is labelled `Adal` in 1492. Zeila (coast) is outside it. |
| pl-adal | `Adal` 1492 | rough | Same shape as "Shoa" 1279. Too small, and it misses the Zeila coast. |
| pl-beta-israel | none | n/a | A community, not a territory. The Dembiya point is inside `Ethiopia`. |
| pl-kilwa, pl-mogadishu (and Swahili towns) | `Islamic city-states` 1000–1400 (337,000 km²) | rough / **wrong in kind** | One continuous strip ~200 km deep from Mogadishu to Cape Delgado. It cannot separate polities. Kilwa, Mombasa, Lamu and Zanzibar fall just outside it (coast mismatch; Zanzibar island is not included). Mogadishu falls outside the 1492 version (in an unnamed Somali-coast polygon). |
| pl-great-zimbabwe | `Great Zimbabwe` 1000–1400 (215,000 km²) | rough | Present from 1000, before the site's rise (c.1100/1200 onward), and present in 1400 unchanged. Superseded by `Mwenemutapa` in 1492 (fine for after 1450). |

City and town points (pl-gao, pl-timbuktu, pl-djenne, pl-walata, pl-niani, pl-njimi, pl-fez, pl-marrakesh,
pl-tlemcen, pl-tunis, pl-kairouan, pl-cairo, pl-alexandria, pl-sijilmasa, pl-dongola, pl-lalibela, pl-zeila, the Swahili
towns, pl-sofala): aourednik has no usable points for them. Use the `location` in each research record. Coastal points
need to sit on the Natural Earth coastline, not on aourednik's.

`basemap_match` values in `csahel.yaml` that do not exist as aourednik `NAME`s: "Kanem Empire", "Bornu", "Bornu Empire",
"Kano", "Hausa Kingdoms", "Katsina", "Ife", "Yoruba states", "Kingdom of Benin", "Edo", "Agadez", "Air", "Tuareg"/"Tuaregs",
"Sao", "Bulala". Case matters: the actual names are `Hausa States`, `Tuareg Nomadic Tribes` (1200) and `Touareg` (1279).
Match on `(year, NAME)` pairs, not on names alone.

---

## 4. Error list (concrete)

1. **Fatimid Caliphate drawn in 1200** over Egypt, Libya, Tunisia and the Hejaz (ended 1171). Egypt should be Ayyubid and Ifriqiya Almohad. It is also drawn over Tunisia in 1100, where the Zirids/Hammadids ruled from c.1048.
2. **"Ifat" in 1200** covers the entire Ethiopian highland, 838,000 km². Ifat was founded c.1285 and was small and eastern. Zagwe is absent.
3. **"Shoa" 1279–1400** is placed in the Harar/Awash lowland, the territory of Ifat/Adal, and is renamed "Adal" in 1492.
4. **Takrur is displaced south** off the Senegal valley and onto the Jolof interior.
5. **Mali 1279** is drawn at its 1330s maximum, extends to 5.3E, and includes the Mossi country. **Mali 1400** ignores the Jolof secession and the loss of Gao. **Mali 1492** still contains Jolof.
6. **Kanem-Bornu 1279/1300** is west of Lake Chad and excludes Njimi/Kanem, while the dynasty was still Kanem-based. It also carries a detached piece on **Bioko** (1279–1492).
7. **Benin 1279–1492** swallows Ife and runs into the Niger delta.
8. **Hafsid polygon contains Tlemcen** 1279–1400; **Abdelouadides 1279** is displaced west; no Zayyanid polygon at all in 1300/1400.
9. **Makuria 1400** is a copy of 1279 (it had collapsed by c.1365) and contains Soba. **Alwa 1492** sits north of Soba.
10. **"West African cereal farmers" spans -17E to 51.2E**, covering about 60% of the Horn (Harar, Ogaden, Somalia) under a West African label, in every year.
11. **"Khoisan" covers all of southern Africa south of 19S**, including KwaZulu-Natal and the Limpopo, where Bantu-speaking farmers (Mapungubwe, Great Zimbabwe's hinterland) lived throughout.
12. **"Tuareg Nomadic Tribes" 1200 reaches 30.8E**; **"Touareg" 1279 contains Sijilmasa**. **"Berber Tribes" 1200 contains Djenné**, Gao and Timbuktu (settled Niger towns).
13. Huge **unnamed** polygons (4–9 million km²) in 1279–1492, and 25 zero-area coastal slivers in 1200.
14. **Static copying**: most window polygons are identical across 1279/1300/1400, and Kanem/Ghana are identical across 1000/1100/1200, so apparent continuity is an artefact.
15. **Great Zimbabwe** is drawn from 1000.

---

## 5. Recommendation: how the app should get each polygon

Rules:
- **No hard borders anywhere.** Render every polity as a soft extent (blurred fill plus a feathered or dashed edge), with the `confidence` from the research record driving opacity. aourednik's `BORDERPRECISION` carries no information here.
- **One geometry per polity per snapshot year that the research records define** (`polity_profile[].year`), stored in our own file (`data/geometry/polities/<place-id>.geojson`, with `properties.year`, `method`, `basis`), not keyed to aourednik years.
- **Points always come from research `location`**, never from aourednik.
- **Clip all polygons to Natural Earth land** at build time so coasts match the base.
- Methods: **A** = use aourednik as is (clip and relabel only); **E** = start from an aourednik polygon and edit it; **H** = hand-draw a soft extent from the `geometry_note` text (and the cited atlases), not traced from aourednik.

| Polity | Method | Starting point / what to do |
|---|---|---|
| pl-marinids | A | `Merinides` 1279 / `Morocco` 1300–1400. Relabel. |
| pl-mamluks | A | `Mamluke Sultanate` 1279–1400 |
| pl-ethiopia-solomonic | A→E | `Ethiopia` 1279–1400 as a soft core. Grow it for c.1330–1340 (Amda Seyon's campaigns) if the research asks. |
| pl-mali | E | Use `Mali` 1279 as the **c.1330–1350 snapshot** only. Trim the Mossi south (cut at about 12.5–13N east of -4) and cut the east at about 1–2E (Gao/Tadmekka). Hand-shrink to the upper-Niger core for c.1250 and to a contracted c.1400 shape without Jolof and Gao. |
| pl-ghana-wagadu | E | `Ghana` 1200, used only for the pre-1203 frame. Fade it out after Sosso. |
| pl-kanem | E | `Kanem` 1200. Extend north toward Kawar/Fezzan for the c.1250 maximum. Keep it through c.1380. |
| pl-bornu | E | `Kanem-Bornu` 1400. Delete the Bioko part. Pull the northern arm back from 21N unless the research supports Kawar. Start c.1380. |
| pl-hafsids | E | `Hafsid Caliphate` 1300. Cut the west at about 1–2E to exclude Tlemcen. |
| pl-zayyanids | H (or E from `Zayyanid Caliphate` 1492) | Tlemcen-centred, about -2..2E. The 1279 aourednik shape is displaced; do not use it. |
| pl-almohads | E | `Almohad Caliphate` 1200 plus Ifriqiya (Tunis–Tripoli coast) for c.1200. Iberia is part of the external margin. |
| pl-ayyubids | E | Egypt portion of `Mamluke Sultanate` 1279 (the Egyptian/Levantine core), relabelled and dated 1171–1250 |
| pl-makuria | E | `Makkura` 1200 shape. Trim the south so Soba is outside. End c.1365–1400 with a fading remnant. |
| pl-alodia | E | `Alwa` 1200 shape centred on Soba. Ignore the 1279–1492 Alwa polygons. |
| pl-great-zimbabwe | A→E | `Great Zimbabwe` 1279 shape with our dates (c.1200/1250–1450) |
| pl-benin | E | `Benin` shrunk to the Edo core (about 5.3–6.5E) before c.1440, and the existing shape only as the post-Ewuare extent. Remove Ife. |
| pl-ifat | E | The `Shoa` 1279 polygon **relabelled Ifat**, extended to the Zeila coast, dated c.1285–1415 |
| pl-adal | E | Same polygon (`Adal` 1492) from 1415, extended to the coast |
| pl-hausa-states | E (c.1450 only) / H | `Hausa States` 1492 as a soft c.1450 envelope. Hand-draw small Kano and Katsina core zones for earlier snapshots. |
| pl-songhay-gao | H | A small Gao-centred zone before c.1430. `Songhai` 1492 is post-window context only. |
| pl-sosso, pl-jolof, pl-takrur | H | Takrur on the middle Senegal (Futa Toro), Jolof in the Ferlo/Linguere interior (from c.1350), Sosso in Kaniaga. Draw all three from `geometry_note`. |
| pl-zagwe | H | Lasta/Wag/Tigray-centred highland zone for 1137–1270. Do not use the 1200 "Ifat" polygon. |
| pl-mossi, pl-bono, pl-ife, pl-agadez | H | Small soft zones, low confidence |
| pl-tuareg | H (hatched zone) | A nomadic sphere (Aïr, Adrar des Ifoghas), styled differently from states |
| Swahili polities (pl-kilwa, pl-mogadishu, others) | H (points + small coastal buffers) | Do not use `Islamic city-states`. Show each town as a point with an optional ~20–40 km coastal buffer. Kilwa's c.1300 sway over Sofala can be a dashed link, not a polygon. |
| Background "peoples" layers (Bantu, Khoisan, cereal farmers, Berber, Tuareg) | **Drop** | Misleading labels (errors 10–12). Let the biome layer carry the background. |

Expected effort: about 9 polities from edited aourednik shapes, about 2 as is, about 12 hand-drawn. All of them are low-vertex
soft shapes, so the work is modest. Hand-drawn shapes should cite their basis (atlas page or `geometry_note`) in `properties.basis`.

---

## 6. OpenHistoricalMap

- **License: CC0** (public domain dedication unless an element says otherwise; OHM deliberately avoided ODbL). Source: OSM wiki *OpenHistoricalMap/FAQ*.
- **Africa 1200–1450: no usable polygons found.** The OHM Projects page lists for Africa only "Colonial Africa", modern Algerian and Moroccan roads, Alexandria and Carthage. A web search turned up relation **2822621 "Songhai Empire"** (start_date 1430, end_date 1591, admin_level 2) **with no members, so no geometry**. Its 1430 start is also doubtful, since Sonni Ali's expansion begins in 1464. Recent West African edits (user CharliePlett, e.g. changeset 143105) are colonial and modern borders.
- Caveat: Overpass, taginfo and the OHM API are blocked from this shell, and WebFetch could not run an Overpass query, so this is not an exhaustive query. If it matters, run this in Overpass Turbo (OHM endpoint) in a browser: `rel[boundary](-35,-20,37,52); out tags;` and filter on `start_date < 1450`.

---

## 7. AtlasPI

- **What it is:** a FastAPI REST + MCP service (`/v1/snapshot/{year}`, `/v1/nearby`, and others; no API key) over about 1,006 "entities". Every record has a `confidence_score` (0–1), a `status` (confirmed / uncertain / disputed / deprecated) and `sources[]`. The README says curation is **AI-assisted and not reviewed by historians**.
- **License:** code Apache-2.0 (`Soil911/AtlasPI`). The NOTICE says imported data keeps its own license, but it **labels aourednik "CC BY 4.0", which is wrong: aourednik is GPL-3.0.** Its pre-1800 borders are copies of aourednik, so their redistribution terms are muddled.
- **Africa 1200–1450 coverage** (checked against the repo's `data/entities/*.json`, commit `b5a6107`, 2026-07-23): about 120 entities with capitals in the frame and dates overlapping the window. **Boundary sources:** 46 `approximate_circle` (33-vertex circles around the capital), 40 `historical_approximation` (mostly 6-vertex hexagons), 16 straight `aourednik` copies (Kanem 1000, Takrur 1100, Alwa 1000, Mamluke 1400, Morocco 1400 as Marinids, Ethiopia 1400, and others), 12 `historical_map` (unknown provenance; e.g. Mali "Manden Kurufaba" 1.24 million km² in 13 vertices, Ifat 27,000 km², Adal 110,000 km², Great Zimbabwe 176,000 km²), and 7 `natural_earth`. The Natural Earth matches are **modern country outlines**: Kanem-Bornu = modern Chad (`TCD`), Bornu = modern Nigeria (`NGA`). Jolof 1350–1549 reuses aourednik's **Mali 1492** polygon. Confidence scores grade name and source curation, not border accuracy (a hexagon can score 0.85).
- **Verdict: do not use its geometry.** At most it can cross-check names and dates; every claim still needs our own sources.

---

## 8. License implications (plain)

- **aourednik/historical-basemaps is GPL-3.0.** Our clipped files in `data/geometry/africa/` are already modified versions. If the app repo ships them, or any polygon edited from them (method **E** or **A** above), it distributes a modified GPL-3.0 work. **The app repo should then be GPL-3.0**, with the license text, a notice that the files were modified (and how), and the source (the GeoJSON itself is the source form). A static GitHub Pages site serving that data counts as distribution. Do not try to wall the data off under a different license in the same deliverable.
- Polygons **hand-drawn (method H) from our own research notes and published atlases**, without tracing aourednik, are our own work and can carry any license. If we ever want a non-GPL release, every E and A polygon has to be redrawn as H. Keep `properties.method` on each feature so that remains possible.
- **Natural Earth**: public domain, no conditions (credit optional: "Made with Natural Earth").
- **RESOLVE Ecoregions 2017**: CC-BY 4.0. Attribution is required (Dinerstein et al. 2017, *BioScience* 67(6):534–545, doi:10.1093/biosci/bix014). It can be combined with a GPL-3.0 repo.
- **OpenHistoricalMap**: CC0 (moot, nothing to use).
- **AtlasPI**: Apache-2.0 code (GPL-3.0 compatible), but its border data inherits aourednik's GPL and is mislabelled. Not used.
- The research YAML (our own text) can stay under its own license. If it lives in a GPL-3.0 repo, put a per-directory `LICENSE` that says so.

---

## 9. Reproduce

```
pip install --break-system-packages shapely pyproj
python3 tools/extract_africa.py --report          # writes data/geometry/africa/*
```

Raw downloads came from `raw.githubusercontent.com/aourednik/historical-basemaps/master/geojson/` and
`raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/`. Staged total: about 67 MB.
To add by hand: the Natural Earth `SR_50M` or `NE2_50M_SR` raster, cropped to the frame (about 2,400 × 2,300 px at 50m, usable as a single MapLibre `image` source), and RESOLVE Ecoregions 2017 dissolved by biome.
