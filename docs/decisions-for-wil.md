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

3. **Keyframes.** 25 keyframes across five regions. The spec adds a region filter. Do you also want a curated
   "lesson path" per class day (an ordered list of keyframes and cards)? Recommendation: yes, Phase 4, as a small
   YAML file you edit.

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
