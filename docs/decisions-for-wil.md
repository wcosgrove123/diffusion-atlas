# Decisions for Wil

Open questions the coding agent must not decide. Each has a recommendation; answer in place (edit this file) or in chat.

## Before or during Phase 1

1. **Repo name and visibility.** GitHub Pages from a private repo needs a paid GitHub plan; a public repo works on
   any plan. The research text and data would be public. Recommendation: public repo named `diffusion-atlas`.
   **Decided 2026-10-15 (Wil): public repo `wcosgrove123/diffusion-atlas`, Pages from GitHub Actions.**
   Site: https://wcosgrove123.github.io/diffusion-atlas/

2. **Hand-drawn polygons.** About 12 polities have no usable open geometry and must be drafted as soft zones from the
   research `geometry_note` text (geometry-audit section 5). The coding agent drafts; you approve from
   docs/geometry-review.md. Recommendation: approve in batches by region, Phase 1 covers only West Africa.
   **Phase 1 drafts are ready (2026-10-15):** docs/geometry-review.md has every West Africa shape with a screenshot
   and five questions (Mali's c.1250 core and Bambuk, a fourth Mali shape after 1433, when the big Mali shape starts,
   Ghana to 1240 or 1203, shapes for Kaabu and Bambuk-Bure).

3. **Keyframes.** 25 keyframes across five regions. The spec adds a region filter. Do you also want a curated
   "lesson path" per class day (an ordered list of keyframes and cards)? Recommendation: yes, Phase 4, as a small
   YAML file you edit.

12. **Student labels for relations.** product-spec 3.2 gives them ("One tradition", "Blended together", and so on)
    but taxonomy.yaml did not. **Decided 2026-10-15 (Wil): added to taxonomy.yaml as `religion.relation_labels`,**
    word for word from the spec. validate.py now checks that every relation has a label.

13. **Ghana, Kaabu, Bambuk-Bure shapes.** The Phase 1 brief named seven polities; wsahel.yaml has three more places
    that could take an area. **Decided 2026-10-15 (Wil): Ghana (Wagadu) by method E from aourednik 1200;** Kaabu and
    Bambuk-Bure show as points until you decide on shapes (docs/geometry-review.md, question 5).

14. **Polity Profile labels.** The place card shows the Polity Profile snapshot nearest the year, but taxonomy.yaml
    lists only the codes (AGR, EXT, KIN...), not the plain-English labels the spec asks for (section 6). The card
    shows codes for now. Recommendation: add a label per code to `polity_profile` in taxonomy.yaml (from your Polity
    Profile taxonomy) and the card will pick them up.

15. **Names of traditions in the UI.** The taxonomy has no display names, so cards and the legend show the keys with
    a capital ("Islam", "Indigenous", "Christianity"; branches as "sunni-maliki"). Recommendation: fine for now; if
    you want "Local (indigenous)" or "Sunni, Maliki school", add display labels to taxonomy.yaml.

16. **Speed check on GitHub.** Build-plan check 6 (Lighthouse >= 80 on a throttled phone) passes on machines with a
    graphics chip (85 to 98 on Wil's laptop), but GitHub's test runners have none and draw the map in software, so
    they score about 70 for the same site. **Decided 2026-10-15 (Wil): GitHub's check fails only below 65**
    (`LIGHTHOUSE_MIN` in .github/workflows/pages.yml); the 80 bar is checked on a machine with a GPU before a release:
    `cd app && npm run build && PW_CHANNEL=msedge npx playwright test lighthouse --project=desktop`.

17. **Outdated words in source titles.** The source card shows a title as published with a note when it contains a
    word from the taxonomy's `banned_terms` ("Pagan" in three titles). "Arab City" (Kirkman's *The Arab City of
    Gedi*) is not on that list, so it gets no note. Recommendation: add an `outdated_title_terms` list to
    taxonomy.yaml with "Arab City" (and anything else you want flagged), and the card will use it too.

18. **Phase 2 geometry drafts (2026-10-16).** 42 more shapes for the other four regions, all drafts, in
    docs/geometry-review.md with screenshots and questions (Mamluk Egypt cut to Africa, the Ethiopia halo, Takrur and
    Jolof overlaps, the Tuareg sphere, Swahili coastal buffers of 25 to 30 km).

19. **Phase 2 built before Phase 1 shipped.** You asked to keep building, so Phase 2 is stacked on the Phase 1 branch
    (PR 2 on top of PR 1). CLAUDE.md says to ship each phase before the next; this is the one exception, on your word.

20. **The "AP World only" view (decided 2026-10-16, Wil).** Students open on the records the AP World curriculum
    names; a switch in the time bar, "AP World only", shows everything when unticked (`?view=all` in the address
    does the same). What counts as named: `tools/ap_match.py` looks for each record's names in the CED Units 1 and
    2 text (docs/ap-ced-alignment.md) and in the textbook chapters in Loom's library (data/ap-world/sources.yaml
    lists them). The follow rule: a named place brings its religion profiles, events and exemplars; an arc shows
    when it arrives at a named place or its subject carries a place name or a religion branch word (Maliki, Sufi,
    Coptic). The result is `data/ap-world/africa.yaml`; add ids under `include` or `exclude` there to overrule it
    (Kano, Takrur, Jolof and Bono are out, for example, because the texts never name them). Rerun the matcher after
    changing sources: `python tools/ap_match.py africa` (needs Loom's library on this machine).

21. **Cliopatria shapes (decided 2026-10-17, Wil).** Use Seshat's Cliopatria polity borders (CC BY 4.0) wherever
    they agree with the research notes. Nine polities switched (Mali's big shape, Takrur, Almohads, Marinids,
    Zayyanids, Ethiopia, Ifat, Adal); six stay with the earlier choice because Cliopatria disagrees with the notes
    (Kanem, Bornu, Sosso, Zagwe, Makuria, Alodia). docs/geometry-review.md part 3 has the comparison. Questions
    13 (Hafsids: aourednik with Algiers to 1300, Cliopatria core after) and 14 (Mali: Jolof out 1360, Gao out 1430,
    Timbuktu 1433) were decided the same day on Wil's "just choose as a historian".

22. **Zoom tiers (decided 2026-10-17, Wil).** The opening map was "a flooded overflow of layers". Fix: a
    `prominence` axis in taxonomy.yaml (section 8) with three values, continent, region, local, approved by Wil in
    chat on 2026-10-17 ("Yes, add them"). The build assigns it by rule (continent = the AP World match names the
    place in the CED itself; region = the AP World view shows it; local = the rest; a diffusion takes its most
    prominent endpoint and gets a corridor id per origin). Any record may carry its own `prominence:` to overrule
    the rule. The map has three zoom bands (`zoom_bands` in data/modules.yaml): zoomed out it draws states, course
    landmarks as dots and one corridor line per route family; at region zoom it adds the other course places as
    circles and each arrow on its own, with the off-map names on hover; close up it shows everything, as before.
    The map opens at region zoom on the current keyframe's region, and the region dropdown moves it. Screenshots:
    docs/zoom-tiers/. Two things to look at: the tier labels in taxonomy.yaml (the legend reads them), and
    whether "AP World only" unticked at region zoom should also show the places beyond the course (today they
    show close up only, as proposed).

## Data and taxonomy (your call; the researchers raised these)

4. **Polity Profile, Right axis.** Two researchers needed a value for legitimacy from mastery of spiritual or occult
   power (Sunjata's and Sumaoro's nyama, the Sunni magician-kings, Kanem's sacred kingship). They used VICTORY or
   DIVINE with a flag. Options: add `RITUAL` ("mastery of spiritual or occult power"), or widen DIVINE's definition.
   This is your taxonomy, so it is your call. It also matters for later modules (shamanic legitimacy in Central Asia).

5. **Second research pass for African scholarship.** Source voices after merge: 205 international scholars,
   57 scholars from the region, 44 insider sources, 19 Arabic/European outsiders. The researchers ran out of web
   searches partway through. Recommendation: one targeted pass per region that only adds scholar-from-region and
   insider sources and re-checks claims against them (no new records).

6. **Library checks.** docs/library-checklist.md lists 39 sources flagged `needs-library`, sorted by how many records
   depend on each. The top ten cover most of the weight (Ogundiran's *The Yoruba*, the Asl al-Wangariyin,
   el-Leithy on Coptic conversion, Kably, Taddesse Tamrat's UNESCO chapter...).

7. **Split the big primary sources by passage.** al-Umari, Ibn Battuta, and al-Sadi are each one source record cited by
   many records about different passages. The build now reports them as citation-only to stay honest. Splitting them
   (e.g. `src-ibn-battuta-rihla-mali`, `-kilwa`, `-walata`) would let each passage carry its own verification and
   HAPP. Recommendation: yes, during the second research pass.

8. **Taxonomy proposals not yet adopted** (v0.2 adopted the rest):
   - an overlay for sacred kingship on local traditions (like `sufi` for Islam)
   - a secondary Shape value on polity profiles (Kilwa: CENTRAL with IMPERIAL reach)
   - `route_inferred: true` on diffusions whose origin is a reasoned guess
   - a `recorded` date on oral-tradition sources (performance vs. recording, e.g. Egharevba)
   - a `participation` outcome for Africans joining networks abroad (Zeila and Mogadishu scholars in Cairo and Mecca)

9. **fabric_date additions.** The correction pass added `fabric_date` for Djinguereber (1570) and the Kilwa Great
   Mosque (1421) beyond what was asked. Keep or drop.

## Later

10. **Images.** A list of Wikimedia Commons candidates (license-checked) for the 55 exemplars, for your approval
    before any ship. Recommendation: Phase 4.
11. **Next modules.** The taxonomy is world-general now. Each new module needs: a registry, a research brief section
    for the region, the same five-researcher pass, and a frame in the build. The Middle East module will overlap
    Africa (Mamluk Egypt, Hijaz): decide whether places can belong to two modules (recommendation: yes, one canonical
    record, listed in both registries).
