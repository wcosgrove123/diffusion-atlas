# Record format for research files

Every research file is YAML at `data/research/<module>/<region>.yaml` with six top-level lists:
`places`, `religion_profiles`, `diffusions`, `exemplars`, `events`, `sources`.
All controlled values come from `data/taxonomy.yaml`. `tools/validate.py` checks every file.

IDs: lowercase-kebab, globally unique, prefixed by kind:
`pl-` place, `rp-` religion profile, `df-` diffusion, `ex-` exemplar, `ev-` event, `src-` source.
Source IDs follow `src-<author-surname>-<short-title>` (e.g. `src-niane-sundiata`, `src-ibn-battuta-rihla`,
`src-unesco-gha-vol4`) so files from different researchers merge without collisions.

Years are integers CE. Use `approx: true` when a date is approximate.
Every `summary` is student-facing (max 2 sentences, high-school readable).
Every `detail` is teacher-facing. Every record cites `evidence` (list of source IDs) and a `confidence`.

```yaml
places:
  - id: pl-mali
    name: Mali
    alt_names: [Manden, Manden Kurufaba]
    kind: polity                  # taxonomy.place_kinds
    region: western-sahel         # free text, use the region names in the module brief
    location: {lat: 11.95, lon: -8.30}   # capital or label point (Niani area is debated; say so in geometry_note)
    span: {start: 1235, end: 1600, approx: true}
    parent: null                  # a city names its polity id here, by span
    geometry_note: >
      Core: upper Niger between Bamako and Siguiri, Bambuk and Bure goldfields. Max extent c.1330-1350
      from Atlantic (Gambia, Senegal) to Gao. Capital location debated (Niani vs. others).
    basemap_match: ["Mali Empire"]   # NAME values to look for in aourednik historical-basemaps, if known
    polity_profile:               # only for kind polity; 1-3 snapshots
      - year: 1330
        base: AGR
        flow: EXT
        membership: [KIN, FAITH]
        ruled_not_counted: tributary peoples; enslaved people
        standing: SOV
        shape: IMPERIAL
        rulers: ONE
        right: [DESCENT, DIVINE]
        flag: null                # or a sentence where claim and practice differ
    evidence: [src-levtzion-ancient-ghana-mali, src-unesco-gha-vol4]
    confidence: medium

religion_profiles:
  - id: rp-mali-court-1324-1360
    place: pl-mali
    span: {start: 1324, end: 1360}
    stratum: court                # taxonomy.strata
    community_name: null          # required only when stratum is community
    traditions:
      - {family: abrahamic, tradition: islam, branch: sunni-maliki, share: dominant, local_form: null}
      - {family: local, tradition: indigenous, branch: other, share: significant,
         local_form: "Mande royal ritual: jeliw praise performance, masked performers, prostration and dust-pouring before the mansa"}
    relation: syncretic           # taxonomy.religion.relation (run the tests in order)
    summary: >
      Mali's court prayed as Muslims and funded mosques, but kept Mande royal rituals that
      a Moroccan visitor found un-Islamic.
    detail: >
      Ibn Battuta (1352-53) praises Friday prayer and Qur'an memorization under Mansa Sulayman and
      condemns dust-pouring, the jeli performance in bird masks, and women's dress...
    evidence: [src-ibn-battuta-rihla, src-niane-sundiata]
    confidence: high
    flag: null

diffusions:
  - id: df-maliki-scholars-to-timbuktu
    lens: religion                # taxonomy.lenses
    what: Maliki Sunni scholarship and teaching networks
    from: [pl-cairo, pl-fez]      # place ids, external places allowed (kind: external)
    to: pl-timbuktu
    span: {start: 1325, end: 1450, approx: true}
    mechanism: hierarchical       # taxonomy.diffusion.mechanism
    carriers: [scholar, ruler, pilgrim]
    outcome: elite-only           # taxonomy.diffusion.outcome
    summary: ...
    detail: ...
    evidence: [...]
    confidence: medium
    ap_topics: ["1.5", "2.4", "2.5"]

exemplars:                        # markers students click: buildings, objects, texts, institutions
  - id: ex-djinguereber
    name: Djinguereber Mosque, Timbuktu
    place: pl-timbuktu
    location: {lat: 16.771, lon: -3.009}
    span: {start: 1327, end: null, approx: true}
    lenses: [architecture, religion]
    summary: ...
    detail: ...
    image_hint: "Wikimedia Commons search: Djinguereber Mosque"   # no copyrighted images; CC/PD only
    evidence: [...]
    confidence: high

events:                           # keyframes on the timeline
  - id: ev-musa-hajj
    year: 1324
    approx: false
    place: pl-mali
    title: Mansa Musa's hajj
    keyframe: true                # true = slider snaps here with a narrative card
    lenses: [religion, knowledge, architecture]
    summary: ...
    detail: ...
    evidence: [...]
    confidence: high
    ap_topics: ["1.5", "2.4"]

sources:
  - id: src-ibn-battuta-rihla
    title: Tuhfat al-nuzzar (the Rihla)
    author: Ibn Battuta (dictated to Ibn Juzayy)
    author_from: Tangier, Morocco
    date: 1355-1356
    kind: primary
    type: travel-geography        # taxonomy.sources.type
    voice: regional-outsider      # relative to the places it describes
    happ:                         # primary sources only
      historical_situation: Written for the Marinid court after his return from Mali.
      audience: Marinid sultan Abu Inan and his court in Fez.
      purpose: Record and entertain; display the reach of Islam and the author's piety and learning.
      point_of_view: Maliki jurist from Morocco judging West African practice by North African norms.
    citation: "Ibn Battuta. In Hamdun and King, eds., Ibn Battuta in Black Africa (Markus Wiener, 1994)."
    url: null
    access: book                  # open-url | library | book
    verification: citation-only   # taxonomy.sources.verification
    notes: Hopkins & Levtzion, Corpus of Early Arabic Sources (CEAS) has the standard translation.
```
