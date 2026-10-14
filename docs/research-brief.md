# Research brief: Africa 1200–1450, cultural diffusion with a focus on religion

## What this is for
A time-slider map for an AP World History: Modern class (Walt Whitman HS, MCPS). Students watch religion and other
culture move across West, North, and East Africa from 1200 to 1450 and explain HOW it moved (mechanism, carriers)
and WHAT HAPPENED when it arrived (outcome). The teacher is a historiographer: the map must show whose sources
say what, so students can see how the narrative changes with the sources chosen.

The core design rule: **color people, not states.** Mali in 1350 was not "Muslim." It had a Muslim court, Muslim
merchant quarters, and a mostly Mande-religion countryside. Every place gets religion profiles per stratum
(court, urban, rural, and named minority communities), per time span.

## Files you must read first
- `data/taxonomy.yaml` — every controlled value. Do not invent values. If something truly will not fit, put it in
  `detail` and add a line to the "taxonomy pressure" list in your final message.
- `docs/record-format.md` — exact record format with an example of each type.
- `data/research/africa/_registry.yaml` — canonical place IDs and which researcher owns each. Define full records
  only for places you own. Reference others' places by registry id. If you need a place that is not registered,
  create it in your file with a new `pl-` id and list it in your final message.

## Perspective rules (non-negotiable)
The teacher asked for research "from an African perspective, not from an American-Christian scholar perspective."
Operationally:
1. **Weight African voices.** For every place, look first for:
   - Insider primary sources: oral traditions and their published transcriptions (jeliw / griots, praise poetry,
     clan histories), chronicles written in the region (Timbuktu tarikhs; Kano Chronicle; Kilwa Chronicle;
     Ethiopian royal chronicles, Kebra Nagast, hagiographies; Kanem girgam / diwan; Old Nubian documents from
     Qasr Ibrim), inscriptions (e.g. the Gao-Saney and Gao royal epitaphs), coins (Kilwa).
   - Scholarship by researchers from the region or working in its institutions: UNESCO General History of Africa
     (esp. vol. IV, ed. D.T. Niane, "Africa from the Twelfth to the Sixteenth Century"), Joseph Ki-Zerbo,
     Djibril Tamsir Niane, Sékéné Mody Cissoko, Youssouf Tata Cissé, Boubacar Barry, J.F. Ade Ajayi,
     Bethwell Ogot, Taddesse Tamrat, Merid Wolde Aregay, Abdul Sheriff, Felix Chami, Chapurukha Kusimba,
     Bertram Mapunda, Ousmane Oumar Kane, Souleymane Bachir Diagne, Mamadou Diawara, Hamid Bobboyi, Abdullahi Smith,
     Ali Mazrui, Toyin Falola, Akinwumi Ogundiran, Ahmed Baba Institute / Timbuktu manuscripts scholarship,
     Ethiopian and Egyptian historians. (These are leads, not a closed list. Find the right people for your region.)
   - International scholarship (Levtzion, Hunwick, Conrad, Insoll, Fauvelle, Horton, Pouwels, Gomez, etc.) is
     welcome and often essential. Tag it `scholar-international`, and where African scholars read the evidence
     differently, say so in `detail`.
2. **Arabic and European writers are outsiders.** al-Bakri, al-Idrisi, Ibn Said, al-Umari, Ibn Battuta,
   Ibn Khaldun, al-Maqrizi, Portuguese sources: record them as primary sources with `voice` set relative to the
   place they describe, with HAPP filled in, and attribute their claims in summaries ("Ibn Battuta reports...").
   Note when an outsider judges local practice by his own norms.
3. **Indigenous religion on its own terms.** Name it specifically and by its own concepts (e.g. Mande nyama,
   komo, jeliya; Yoruba orisa and Ifa; Edo kingship and Olokun; Soninke Wagadu-Bida; Kanem's mune; Hausa bori and
   iskoki; Akan Nyame and abosom; Swahili mizimu). Never "animist," "pagan," "fetish," or "traditional religion"
   as a name. Do not describe conversion as progress or as Islam/Christianity "civilizing" anyone.
4. **Oral tradition is a source, not a legend to be corrected.** Treat griot epics and chronicles as historical
   sources with transmitters, purposes, and dates of recording (HAPP applies).
5. **Show the gaps.** Rural majorities are the least documented. If no evidence speaks to a stratum in a span,
   write a profile with `relation: undocumented` and say in `detail` what kind of evidence is missing. That
   absence is a teaching point, not a hole to fill with a guess.

## AP alignment
Tag `ap_topics` from taxonomy. Religion in Africa is CED topic 1.2 (KC-3.1.III.D.iii), not 1.5; 1.5 is state
building. The Units 1–2 CED names Great Zimbabwe, Ethiopia, the Hausa kingdoms, the Swahili city-states, Mali,
Ibn Battuta, the Mamluks, and the spread of Islam through merchants, missionaries, and Sufis (docs/ap-ced-alignment.md
has the full checklist). It does NOT name Mansa Musa, Timbuktu, or Kilwa, though teachers use them constantly.
Do not limit the map to CED names: it should carry the places that make the diffusion story true.

## Lenses
Religion is primary (aim for at least 60% of diffusions). Also cover, where the evidence is real: language
(Arabic, Ajami scripts, Swahili, Mande/Dyula lingua franca, Ge'ez/Amharic, Old Nubian, Tamazight/Berber),
architecture, knowledge/education, social (gender, status, occupational groups like Mande nyamakala, slavery),
art-music, technology, population, governance.

## Quotas for your region (minimums; quality over count)
- places: every registry place you own, plus any you need
- religion_profiles: for each polity and major city, at least court + urban + rural (or undocumented), across
  at least two time spans where things changed between 1200 and 1450. Use `community` for minorities.
- diffusions: 12–25
- exemplars: 6–12 (buildings, objects, texts, institutions students can click)
- events: 6–12, mark 3–6 as `keyframe: true`
- sources: as many as you use; every cited id needs a record

## Honesty about verification
You can reach the open web only. Many key works are books or paywalled. Use `verification`:
- `web-checked` only if you read the supporting text during this research (give the URL)
- `citation-only` if you know the work supports the claim but did not see the passage
- `needs-library` if the teacher should check it in a library copy (he has AU and GW library access)
Never invent page numbers, quotes, or URLs. Prefer no URL to a guessed URL. Dates: say `approx: true` when
scholars give a range, and put the range and any disagreement in `detail`.

## Copyright
No quotations longer than 15 words from any modern source; paraphrase. Primary-source quotations from medieval
texts in published translations: keep under 15 words too, and attribute.

## Output
1. Write your file to `data/research/africa/<your-region>.yaml`.
2. Run `python3 tools/validate.py data/research/africa/<your-region>.yaml` and fix every ERROR.
3. Your final message (it comes back to the coordinator, not the teacher) must include:
   - counts per record type and validator result
   - the 5 claims you are least sure of and why
   - contested questions in your region where scholars disagree (one line each) — these become classroom debates
   - "taxonomy pressure": anything that did not fit the controlled lists, with a proposed fix
   - new place ids you created that are not in the registry
