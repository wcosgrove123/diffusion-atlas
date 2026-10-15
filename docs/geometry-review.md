# Geometry review: West Africa (Phase 1)

For Wil. Every polity shape the Phase 1 map draws, with a screenshot, for your approval. **All of them are drafts.**
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
- **Change:** say what to move ("Takrur further north at Dagana", "Mali c.1250 should include Bambuk"), or edit the
  `outline` points (`[longitude, latitude]`, west is negative) or the `remove` boxes yourself. Then rebuild:

  ```
  python tools/build_geometry.py africa
  cd app && npm run build && GEOMETRY_REVIEW=1 PW_CHANNEL=msedge npx playwright test geometry-review --project=desktop
  ```

  The second line regenerates the screenshots in `docs/geometry-review/`.

## Questions for you

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

## The shapes

| Place | Years | Method | Basis (short) | Status |
|---|---|---|---|---|
| Mali | 1235 to 1300 | H | upper-Niger core from the geometry_note | draft |
| Mali | 1300 to 1360 | E | aourednik Mali 1279, Mossi south and east of 1.5E cut | draft |
| Mali | 1360 to 1433 | E | as above without Jolof (west of 14W, north of 13.9N) and Gao (east of 1W) | draft |
| Mali | 1433 to 1600 | E | as above, north cut at 15.8N (not in the audit; question 2) | draft |
| Ghana (Wagadu) | 1200 to 1240 | E | aourednik Ghana 1200, relabelled (question 4) | draft |
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

### Ghana (Wagadu), 1200 to 1240 (E)

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
