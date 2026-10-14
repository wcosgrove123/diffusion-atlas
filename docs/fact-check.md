# Fact-check: Africa 1200-1450 dataset (data/build/africa.json)

Checked 2026-10-14 by an independent reviewer. I did not edit any data file. Every "fix" below names the record, the field and the new value or wording, so the data owner can apply it.

**Scope.** I checked all 25 keyframe events, a stratified sample of 34 more records (12 religion profiles, 10 diffusions, 12 exemplars) and 65 cited URLs. There are 25 keyframes, not 26: `_merge.yaml` merged `ev-tuareg-timbuktu` away and set `ev-musa-in-cairo` to keyframe false. Each record gets one of four verdicts:

- **supported**: the cited evidence says what the record says.
- **partly supported**: the core is right, but a date, an attribution or a detail is wrong or does not come from the cited source.
- **not supported**: the cited evidence does not back the claim.
- **could not check**: I could not reach the evidence.

**Method and limits.**
- **Web search:** WebSearch was rate-limited and failed on its first call (the shared per-turn budget was spent). All checks used WebFetch of the cited URLs plus stable references: UNESCO WHC, the Met Heilbrunn essays, the British Museum collection record, Cambridge Core abstracts, the UNESCO GHA IV chapter PDFs and Wikipedia.
- **Texts I did not read:**
  - The Kano Chronicle PDF on Zenodo.
  - The full Rihla passages on Takedda, Bornu and Timbuktu. The cited abridgments do not contain them, so on those points I rely on my own knowledge of the Hamdun and King translation, and say so where it matters.
  - Conrad 1992, which I checked only through the Wikipedia "Mali Empire" footnote.
  - Taddesse Tamrat 1972.
  - Seignobos's articles.
  - Any library-only source (Levtzion and Hopkins *Corpus*, Chittick 1974, Matenga 1998, Blier 2015).
- **Unchecked claims are marked as such.**

---

## 1. Keyframe events (25)

| id | claim (one line) | verdict |
|---|---|---|
| ev-dunama-opens-mune | Dunama Dibbalemi (c.1210-48) pushes Islam and destroys the mune; later writers blame it for trouble | supported |
| ev-yaji-wangara-kano | Under Yaji (1349-85) Wangara from Mali bring Islam; mosque by the sacred tree; old-shrine defenders resist | partly supported |
| ev-umar-leaves-njimi | Umar b. Idris (c.1382-87) abandons Njimi/Kanem for Bornu after Bulala attacks | supported |
| ev-eweka-first-oba | Edo tradition: Eweka, son of an Ife prince and an Edo woman, first Oba with Ife regalia | supported |
| ev-ife-florescence | Around 1300 Ife casts the naturalistic heads and makes glass beads | partly supported |
| ev-lalibela-new-jerusalem | Around 1200 Lalibela makes Roha a New Jerusalem with rock-cut churches | partly supported |
| ev-yekuno-amlak-1270 | 1270: Yekuno Amlak defeats the last Zagwe king and founds the Solomonic line | partly supported |
| ev-mamluk-sack-dongola | 1276 Mamluk army defeats King David and sacks Dongola; Makuria becomes a vassal | partly supported |
| ev-dongola-mosque-1317 | 29 May 1317 throne hall made a mosque under Barshambu; churches keep working | supported |
| ev-amda-seyon-ifat-1332 | Amda Seyon defeats Ifat and the eastern Muslim states (1332, or 1329) | supported |
| ev-debre-mitmaq-1450 | Council of Debre Mitmaq: Egyptian bishops accept the double Sabbath | supported |
| ev-almohad-mahdi-repudiated | 1229 al-Ma'mun repudiates the mahdi doctrine, uses Castilian troops; Hafsid breakaway | supported |
| ev-abbasid-caliphate-cairo | 1261 Baybars installs an Abbasid caliph in Cairo | partly supported |
| ev-cairo-1321-churches | 1321 about 60 churches destroyed, fires, harsh decrees later rescinded | supported |
| ev-black-death-maghreb-egypt | Plague at Alexandria in autumn 1347; about a third of Cairo dead; Tunis and Fez hit | supported |
| ev-fez-mellah | c.1438 Fez's Jews moved to the mellah after Idris II's tomb is found | partly supported |
| ev-mahdali-takeover | c.1277 al-Hasan ibn Talut founds the Mahdali dynasty at Kilwa | supported |
| ev-ibn-battuta-swahili-coast | Ibn Battuta at Mogadishu, Mombasa and Kilwa (c.1331) | supported |
| ev-great-zimbabwe-peak | Mid-1300s Great Enclosure built; gold trade to the coast; Shona religion kept | supported |
| ev-malindi-giraffe | 1414 giraffe (via Bengal) and 1415 giraffe from Malindi; read as a qilin | supported |
| ev-great-zimbabwe-decline | Around 1450 Great Zimbabwe declines; Khami and Mutapa rise; salt tradition | partly supported |
| ev-kirina | c.1235 Sunjata defeats Sumaoro at Kirina | supported |
| ev-musa-hajj | Musa in Cairo July 1324; gold value falls; returns with al-Sahili | supported |
| ev-ibn-battuta-mali | Ibn Battuta in Mali 1352-53; praises prayer and security, condemns court rituals | supported |
| ev-tuareg-take-timbuktu | Tuareg under Akil take Timbuktu c.1433 | partly supported |

### Details and fixes

**ev-dunama-opens-mune** (supported)
- Lange (GHA IV T4-14) gives a reign of about 1210-1248 and says the chronicles and Ibn Furtu reproach Dunama for destroying the mune, "probably the central element of a pre-Islamic royal cult."
- Lange also says orthodox Islam reached the popular strata in this reign.
- The year 1230 is a midpoint, with approx: true. That is correct.
- Fix: none.

**ev-yaji-wangara-kano** (partly supported)
- Adamu (T4-15) supports Yaji's dates (1349-1385) and the Wangara arriving "from Mali" in his reign.
- Adamu notes that the *Asl al-Wangariyin* puts them under Rumfa and prefers the Chronicle's date. He dates the Chronicle to about 1890. All of this matches the record.
- Adamu does not mention the mosque under the sacred tree. That detail is from the Kano Chronicle, which is citation-only, and the research notes say the Zenodo PDF was never read. I believe the Palmer translation does contain the mosque-under-the-tree episode, but I could not check it.
- Fix:
  - `detail`: add "The mosque-by-the-sacred-tree episode is from the Chronicle itself (Palmer 1908), not checked against the text in this research."
  - Also add Adamu's point, which the student summary hides: Islam was "probably" in Kano before the Wangara, via Kanem-Bornu.

**ev-umar-leaves-njimi** (supported)
- Lange: Umar b. Idris (c.1382-87) left Njimi under Bulala pressure.
- Sa'id (c.1387-88) was the first king to rule only Bornu.
- Fix: none.

**ev-eweka-first-oba** (supported)
- Ryder (T4-18) says the founding was "probably around 1300." He does not name Eweka.
- Ryder 1965 (Cambridge abstract) proposes a northern (Nupe-Igala) origin. The summary correctly attributes the story to Edo tradition, and confidence: low is right.
- Fix: none.

**ev-ife-florescence** (partly supported)
- Babalola et al. 2018 give two radiocarbon dates: 1295-1404 and 1304-1423 cal AD. Their conclusion is a chronology "of the 11th to 15th centuries." The detail's "dates for glass reach 1295-1423" merges the two calibrated ranges into one span and leaves out the authors' broader conclusion.
- The British Museum dates its Ife head to the "14th-15th c. (early), probably."
- Fix: `detail` → "Blier ties the florescence to Obalufon II c.1250-1350; the British Museum dates its head 14th-early 15th c. Babalola et al. (2018) date the Igbo Olokun glass workshop to the 11th-15th c.; their two basal radiocarbon dates calibrate to 1295-1404 and 1304-1423."

**ev-lalibela-new-jerusalem** (partly supported)
- UNESCO WHC 18 and the Met essay (Windmuller-Luna, 2014) agree that tradition credits Lalibela (r. c.1181-1221).
- The Met adds that scholars place construction "in four or five phases between the seventh and thirteenth centuries."
- UNESCO's own page is inconsistent ("12th century" in one place, "13th-century New Jerusalem" in another).
- The student summary states as fact that Lalibela made the churches ("with churches cut from the rock"). That contradicts the record's own exemplar (ex-lalibela-churches).
- Fix: `summary` → "Ethiopian tradition says King Lalibela, who ruled around 1200, turned his capital Roha into a New Jerusalem of churches carved from the rock. Archaeologists think the carving took several phases, and Ethiopians still go there on pilgrimage today."

**ev-yekuno-amlak-1270** (partly supported)
- Wikipedia confirms:
  - 1270.
  - The Battle of Ansata.
  - Aid from the Muslim Sultanate of Shewa.
  - The 1273 letter to Baybars asking for an abun.
- Wikipedia presents Za-Ilmaknun as the king who imprisoned Yekuno Amlak, according to tradition. It reports Getatchew Mekonnen's alternative identification of the last Zagwe king as Na'akueto La'ab.
- The detail's "Za-Ilmaknun looks like a name meant to erase him" is an interpretation with no cited support. Confidence "high" rests on Wikipedia plus a citation-only book.
- Fix:
  - `detail` → "Taddesse Tamrat argued the last Zagwe king was Yetbarak, whose name the records erased; Getatchew Mekonnen Hasen names Na'akueto La'ab. Tradition calls the Zagwe king Za-Ilmaknun ('the unknown')."
  - `confidence` → medium.

**ev-mamluk-sack-dongola** (partly supported; contains a date error)
- The detail says "Battle near Dongola, 20 January 1276 (Seignobos)." The Wikipedia "Makuria" page is the cited, web-checked source, and the Seignobos entry itself says it was taken "via Wikipedia." That page gives 20 January 1276 as the date the Mamluk army was dispatched. The army then took Gebel Adda and Meinarti before the battle at Dongola. The installation of Mashkouda on 4 June 1276 is confirmed.
- The Seignobos source note says the titles were "abbreviated from memory."
- Fix:
  - `detail` → "The Mamluk army set out on 20 January 1276 (Wikipedia, citing Seignobos), took Gebel Adda and Meinarti, and defeated David's army at Dongola in spring 1276. ... Mashkouda was installed on 4 June 1276 and swore fealty to Baybars."
  - Correct or verify the full Seignobos titles.

**ev-dongola-mosque-1317** (supported)
- DBMNT 611 confirms 16 Rabi I 717 = 29 May 1317, a marble stela in situ to the left of the mihrab. The stela does not name a ruler; the Barshambu link comes from Wikipedia and the chronicles.
- Godlewski 2018 says the mosque served "newcomers from the north" and that "Dongola remained a Christian city throughout the 15th century." That supports the teaching point.
- Note: Wikipedia spells the name Barshanbu. Consider listing it in alt spellings.

**ev-amda-seyon-ifat-1332** (supported)
- Wikipedia confirms:
  - The 1332 date (Dillmann, Conti Rossini, Cerulli; Taddesse Tamrat cites a supporting document) against 1329 (Huntingford).
  - The killing of Ti'yintay by Haqq ad-Din.
  - Sabr ad-Din's revolt.
  - The Mamluk persecution of Copts around 1320 as background.
- approx: true is correct.

**ev-debre-mitmaq-1450** (supported)
- Wikipedia (Zara Yaqob) supports:
  - 1450.
  - Debre Mitmaq in Tegulet.
  - The abuns Mikael and Gabriel.
  - The church named after the demolished Egyptian Debre Mitmaq monastery.
  - The protest letter to Jaqmaq.
- Wikipedia (Ewostatewos) dates the open conflict to about 1337, when Abuna Yaqob arrived. Ewostatewos himself (1273-1352) began the movement.
- Fix: `summary` second sentence → "It ended a split of about a century that began with the monk Ewostatewos and his followers."

**ev-almohad-mahdi-repudiated** (supported)
- Wikipedia (Almohad doctrine) gives 1229.
- Hrbek (T4-8, p.102) confirms Castilian Christian cavalry and the public repudiation, but gives no year. He describes the revolt as "breaking out in 1230."
- Hrbek p.105 confirms Abu Zakariyya took the independent title in 1229 and asserted full sovereignty in 1236.
- Saidi (T4-6) gives the reasons (pressure from the shaykhs, p.51; political isolation, p.53) but no date.
- Fix:
  - `approx` → true; the repudiation is variously put in 1229 or 1230 (626-627 AH).
  - Replace the source URL `https://en.wikipedia.com/wiki/Almohadism` with `https://en.wikipedia.org/wiki/Almohad_doctrine`. The .com host works only as a redirect.

**ev-abbasid-caliphate-cairo** (partly supported)
- Banister supports the installation of al-Mustansir, then al-Hakim, and the caliphs' loss of political weight by the mid-14th century.
- Garcin (T4-19, p.419) dates the caliph's residence in Cairo to 1262. The detail already says so.
- The summary's "Cairo became the place Muslim rulers, including some in Africa, looked to for religious legitimacy" has no example inside 1200-1450. The detail admits the only documented African investiture is Askia Muhammad in 1496-97.
- Fix: `summary` second sentence → "Cairo's caliph gave the Mamluk sultans religious standing, and later rulers elsewhere, such as Songhay's Askia Muhammad in 1497, sought his blessing too."

**ev-cairo-1321-churches** (supported)
- Konieczny (Medievalists.net) gives 11 churches in Cairo plus 49 elsewhere, the fires blamed on monks, confessions under torture, decrees later rescinded, and "only one person by name" converting.
- O'Sullivan gives "sixty churches and monasteries."
- Konieczny does not name the sultan, but al-Nasir Muhammad was sultan in 1321, so the record is accurate.

**ev-black-death-maghreb-egypt** (supported)
- Wikipedia (Black Death in the Middle East) supports Alexandria in autumn 1347, 200,000 dead in Cairo (a third), Asyut's taxpayers falling from 6,000 to 116, Tunis in June 1348, and Fez via the Marinid army.
- Dols supports communal prayers and processions, plague as martyrdom, Ibn al-Khatib's argument for contagion, and no institutional breakdown.
- The Ibn Khaldun parents claim is not on the cited Wikipedia page. Idris (T4-9, p.137) mentions only his father, in 1349. Ibn Khaldun's own *Ta'rif* says both parents died, so the claim is right but unsourced here.
- Fix: add Idris p.137 to `detail`.

**ev-fez-mellah** (partly supported)
- Wikipedia (Jewish community of Fes) gives 1437 for the "rediscovery" of Idris II's body and a mid-15th-century move. It also records Rguig's and Gilson Miller's argument for a gradual move.
- Chtatou gives 1438 and calls Fez's mellah the first. He says "other cities built similar such walled quarters for the Jews much later," mainly after 1492. Neither source says it was a "model."
- The 1465 detail is right in substance: the revolt was against Abd al-Haqq II and his vizier Harun; both were killed and the mellah was attacked.
- Fix: `summary` second sentence → "It was Morocco's first mellah, and later Jewish quarters in other Moroccan cities took the same name."

**ev-mahdali-takeover** (supported)
- Chittick 1965 (abstract) ties a cultural break to a "change in dynasty at Kilwa ... and the gaining of control of Sofala and the gold trade."
- Saad 1979 discusses how the Chronicle and Barros differ.
- The 1277 date is Freeman-Grenville's, and the detail says so.

**ev-ibn-battuta-swahili-coast** (supported)
- The Fordham Gibb abridgment confirms:
  - Mombasa's "well-built wooden mosques."
  - Kilwa "all its buildings are of wood."
  - Most people "Zanj ... with tattoo marks on their faces."
  - Sultan Abu'l-Muzaffar Hasan, a fifth of the booty given to pious purposes.
  - Gold "from Yufi" reported only by hearsay.
- Lafayette (Gibb 1958) confirms Abu Bakr "of Berberah origin," who speaks Maqdishi and knows Arabic.
- The medievalslavery.org page 3340 (Freeman-Grenville) confirms the gifts of slaves and ivory.
- Wikipedia (Ibn Battuta) gives 1330 for Kilwa and 1332 for Mogadishu. The detail flags this disagreement.
- The Shafi'i point for Mombasa is not in the Fordham text. It comes from Hamdun and King via a blog. I believe it is right, but it is unchecked.

**ev-great-zimbabwe-peak** (supported)
- Chirikure et al. 2013: walls began in the late 12th or early 13th century and building peaked in the 14th and 15th.
- UNESCO: the Great Enclosure is 14th century.
- Fagan (T4-25): the site was at its height around 1400, with imports in use in the 14th century.
- Fix: in `detail`, `ev-ibn-battuta` is a broken reference; change it to `ev-ibn-battuta-swahili-coast`.

**ev-malindi-giraffe** (supported)
- Science News (Zielinski, 2013) supports the 1414 giraffe via Bengal, another "a year later," and the qilin reading tied to Yongle's legitimacy.
- "Directly from Malindi" in 1415 is not in Science News; it comes from Duyvendak.
- Fix: none.

**ev-great-zimbabwe-decline** (partly supported)
- Only UNESCO gives "about 1450."
- Fagan (T4-25) places the decline in the late 15th century.
- Chirikure et al. 2013 show occupation into at least the 16th century and probably the 17th. Their abstract says nothing about Khami; the overlap it discusses is with Mapungubwe.
- The salt explanation is real Mutapa tradition (Mutota leaving to find salt), but it is citation-only.
- The student summary turns a contested date into a fact.
- Fix:
  - `summary` → "During the 1400s Great Zimbabwe lost its place as the region's main center, while Khami in the southwest and Mutapa in the north grew. Shona tradition says people left because salt ran short; archaeologists also point to worn-out land and shifting trade."
  - `detail`: drop "a century of overlap with Khami" unless it can be cited from the article's body text.

**ev-kirina** (supported)
- Niane (T4-10) gives 1235 as the date of Sunjata's victory and of "la naissance du Mali," and puts the war in 1220-1235.
- Niane calls Delafosse's chronology relative, and quotes Ibn Khaldun on Mari Djata subduing the Sosso.
- Fix: none.

**ev-musa-hajj** (supported in substance; the source URL is wrong)
- The World History Commons excerpt of al-Umari confirms:
  - The refusal to kiss the ground.
  - The 1324 visit.
  - The mithqal falling from 25 dirhams to "22 dirhams or less."
- Kenny ch.11 (dhspriory a11) also has these passages. Niane dates the pilgrimage 1325 and the drop in gold price as long-lasting; the record is fine with 1324 for the Cairo arrival.
- The merged source `src-al-umari-masalik` points to medievalslavery.org page 4049, which contains only the Hadiya eunuch passage. See systemic issue S1.

**ev-ibn-battuta-mali** (supported in substance; the source URL is wrong)
- The Strayer/Gibb excerpt (Macmillan) confirms:
  - The feathered "thrush" figures.
  - Dust-pouring.
  - The qadi's children chained until they learn the Qur'an.
  - "complete security in their country."
  - Women's "friends."
- The merged URL (Fordham East Africa abridgment) contains none of this. See S1.
- The arrival month in the capital varies: the detail says June; Wikipedia (Mali Empire) says July 1352; Niane says the visit was in 1353. I could not resolve this without the Rihla.
- Fix: `detail` → "reached the capital in mid-1352 (June or July, by different chronologies)."

**ev-tuareg-take-timbuktu** (partly supported)
- Ly-Tall (T4-11, p.200) supports "vers 1433" and Tuareg control of Walata and Nema. She does not name Akil.
- The cited web-checked URL for al-Sa'di (dhspriory a12, Kenny ch.12) covers Sonni Ali onward. It contains no Akil and no 1433 passage.
- Both research files that cite al-Sa'di marked it citation-only. The merge promoted it to web-checked; see S1.
- The Akil name is correct per Hunwick, but it is unverified here.
- Fix: per-record source, al-Sa'di `verification: citation-only` and `url: null`. Keep Ly-Tall as the web-checked support.

---

## 2. Stratified sample

### 2a. Religion profiles (12)

The sample covers every region file: wsahel 3, csahel 3, north 2, nile-horn 2, swahili 2. Seven are coded exclusive and two syncretic.

| id | file | relation | claim | verdict |
|---|---|---|---|---|
| rp-mali-court-1300-1450 | wsahel | syncretic | Friday prayer and mosques plus Mande royal ritual (dust, feathered jeliw, Komo objects) | supported |
| rp-bambuk-bure-rural-1300-1350 | wsahel | exclusive | Gold peoples left outside Islam by royal choice; "Al-Umari reports Musa saying" | partly supported |
| rp-timbuktu-urban-1325-1433 | wsahel | exclusive | Muslim scholarly town; mostly Masufa (Ibn Battuta) | supported (wrong URLs) |
| rp-kanem-court-1250-1387 | csahel | syncretic | Maliki kings who rule as secluded sacred kings behind a curtain | partly supported |
| rp-kano-court-1200-1349 | csahel | exclusive | Early Kano kings tied to the Tsumburbura cult | partly supported (coding) |
| rp-ife-court-1200-1350 | csahel | exclusive | Ooni's sacred kingship and orisa worship; heads in ritual use | partly supported |
| rp-atlas-amazigh-rural-1269-1450 | north | exclusive | Rural Maliki Islam through zawiyas and saint lineages | partly supported |
| rp-tozeur-indigenous-christians-1200-1260 | north | exclusive | Indigenous Latin Christians may survive in the Djerid to c.1260 | supported (coding fix) |
| rp-beta-israel-rural-1270-1413 | nile-horn | exclusive | "Ayhud" of the northwest fought the king; identification with Beta Israel debated | partly supported |
| rp-solomonic-court-1270-1433 | nile-horn | exclusive | Solomonic court Christian; disputes with monks inside Christianity | supported |
| rp-great-zimbabwe-court-1300-1450 | swahili | exclusive | Shona ancestors, Mwari and the soapstone birds; no Islam despite trade | supported (coding fix) |
| rp-kilwa-court-1277-1450 | swahili | exclusive | Mahdali court a showcase of Shafi'i Islam; a fifth of booty to pious causes | partly supported |

**rp-mali-court-1300-1450** (supported; the coding is right)
- Ibn Battuta's details are confirmed in the Gibb excerpt (Macmillan URL).
- The Komo objects claim is confirmed only via Wikipedia "Mali Empire," which cites Conrad 1992, p.152: Musa "brought important boliw (sacred objects) from Mecca for use in the Kòmò rituals."
- Niane's "faible vernis musulman" is confirmed (about p.178).
- Syncretic is right by Test 5. The taxonomy's own example is this case.
- Fixes:
  - `detail`: "boys chained" → "the qadi's children chained."
  - The detail says 1360-1450 is inferred. Split the span at 1360, or add `basis: inferred` with a note, because one profile cannot carry two bases.

**rp-bambuk-bure-rural-1300-1350** (partly supported; the attribution is wrong in the student summary)
- In al-Umari's text (Kenny ch.11, Levtzion and Hopkins translation) the gold-country passage comes from the shaykh Abu 'Uthman Sa'id al-Dukkali, "who lived at Yiti for 35 years." The speaker is not Musa.
- The passage says "the kings of this kingdom have learnt by experience" that when Islam spreads in a gold town the gold disappears. The land is named *Mazazat al-Tibr*. Identifying it with Bambuk and Bure is a modern inference.
- The withheld outcome and exclusive coding are fine. There is direct testimony that the miners were not Muslim. What they practiced is unrecorded, so add `basis: inferred` for the indigenous entry.
- Fixes:
  - `summary` → "Al-Umari, citing a Moroccan who lived in Mali for 35 years, reports that Mali's kings left the gold-producing peoples to their own religion, believing the gold would vanish if Islam spread there. They took tribute instead."
  - `detail`: replace "from Cairo informants who knew Musa" with "on the authority of Abu 'Uthman Sa'id al-Dukkali (in Levtzion and Hopkins, Corpus; also Kenny, ch.11, https://dhspriory.org/kenny/NWAfr/a11.htm)"; add "the identification of al-Umari's 'land of gold' with Bambuk/Bure is modern."
  - Apply the same fix to `df-islam-gold-country-no-uptake`.

**rp-timbuktu-urban-1325-1433** (supported; the URLs are wrong)
- The Masufa majority and al-Sahili's grave are in the full Rihla, as far as I know.
- Neither cited URL contains them: the Fordham abridgment covers East Africa only, and dhspriory a12 is Songhay.
- Exclusive rests on silence about enslaved and riverine residents, which the detail admits.
- Fix: add `basis: inferred`.

**rp-kanem-court-1250-1387** (partly supported)
- Al-Umari's Maliki statement comes via Lange. The curtain statement is Ibn Battuta's hearsay at Takedda; I believe it is accurate, but it is not in any cited URL.
- The summary says "Visitors described," but neither author visited Kanem.
- Syncretic is defensible. However, rp-kanem-court-1086-1210 is coded plural because the mune cult was a "separate institution." The curtain seclusion is a court protocol, and the record infers that it is religious. That should be explicit.
- Fixes:
  - `summary` → "Writers in Cairo, and Ibn Battuta from what he heard at Takedda, describe Kanem-Bornu's kings as Maliki Muslims who still ruled as hidden, sacred kings, speaking to people only from behind a curtain."
  - Add `basis: inferred` (the religious reading of the seclusion).

**rp-kano-court-1200-1349** (partly supported; the coding is wrong)
- Adamu supports Dala's six generations of ritual chiefs. He argues Muslims, including people with Muslim names among earlier Kano figures, were in Kano before Yaji. He calls the Chronicle's "Muslims versus non-believers" framing a later reinterpretation.
- Barbushe and Tsumburbura are not in Adamu; they come from the Chronicle, which was not read.
- By Test 1 there is no evidence from the span itself; the only source is an 1880s compilation. Exclusive also contradicts the cited scholar's view.
- Fix: one of the following.
  - (a) `relation: undocumented`, keeping the Chronicle content in the detail.
  - (b) Keep the coding but set `basis: projected`, add a minority Islam entry (`share: unknown`, local_form "Muslim traders and clerics, per Adamu"), and change relation to plural.
- I recommend (b).

**rp-ife-court-1200-1350** (partly supported)
- Ryder (T4-18) supports most heads depicting the oni and fragments found in temples as cult objects. Ryder also says they were made after the oni's death for his tomb; that could be added.
- Inconsistency: `local_form` lists "Ifa divination," but the detail says no dated evidence for Ifa exists in the window.
- The detail contains a broken reference, `df-ife- kingship-to-benin` (with a stray space).
- Fixes:
  - Remove "Ifa divination;" from `local_form`, or append "(antiquity unattested)".
  - Change the reference to `df-ife-kingship-to-benin`.
  - Add `basis: projected`, since the orisa names and concepts come from later Yoruba practice.

**rp-atlas-amazigh-rural-1269-1450** (partly supported)
- Idris (T4-9, p.127) confirms that social structures "maintained intact" in isolated Berber-speaking areas.
- The Hoffman 2020 article is about customary courts under the French Protectorate, so using it for the 13th-15th centuries is projection. The term "azref" is not in it.
- Exclusive rests on hagiography, fatwas and silence, as the detail admits.
- Fixes:
  - Add `basis: projected`.
  - `detail`: mark Hoffman as 20th-century evidence read backward.

**rp-tozeur-indigenous-christians-1200-1260** (supported; one coding fix)
- Prevost 2007 (abstract) says the Christians most likely disappeared from the oases "around the middle of the 13th century," alongside the Ibadis.
- Wikipedia "African Romance" confirms Gregory VII's letter to Archbishop Cyriacus of Carthage and Prevost's mid-13th-century end. It also mentions a Latin psalter dated 1230, which is worth adding as evidence.
- The cited sources do not mention Bougie or the Almohad "decisive blow." Those come from general scholarship and are plausible.
- Fix: `traditions[0].branch` `other` → `latin-african`. Taxonomy v0.2 created that branch for exactly this community.

**rp-beta-israel-rural-1270-1413** (partly supported; the source is wrong)
- The detail cites "Wikipedia, Beta Israel" for the 1329 campaign and the church burning. The evidence list cites `src-wikipedia-jews-ethiopia` ("History of the Jews in Ethiopia"). That page has no 1329 date and no church burning; its only church burning is the Gudit legend of about 960.
- The "Beta Israel" Wikipedia page does say that in 1329 reports reached Amda Seyon that Jews "had started to burn churches," in Semien, Wagara, Tselemti and Tsegede, and that the governor Tsaga Christos led the response.
- The Ethiopian Jewry Heritage Center page supports all three origin traditions.
- Kaplan's "label also hurled at Christian dissidents" is consistent with his work, but it is citation-only. The Wikipedia page says only that the chronicle says "like Jews" (*kama ayhud*).
- Fixes:
  - Add a source for https://en.wikipedia.org/wiki/Beta_Israel and cite it.
  - `detail`: "Sagede" → "Tsegede"; "sent troops" → "ordered Tsaga Christos, governor of Begemder, to lead forces."
  - `span.approx` → true. The endpoints 1270 and 1413 are periodization, not attested events.
  - Add `basis: projected` for the local_form practices.

**rp-solomonic-court-1270-1433** (supported)
- The facts are confirmed via Wikipedia (Yekuno Amlak, Amda Seyon).
- Exclusive is reasonable for the court. The monk conflicts are inside one tradition; the relation note says to record that as two entries, but these were clergy against the court rather than two practices within the court stratum.
- Confidence "high" rests on Wikipedia plus the citation-only Taddesse Tamrat.
- Fix: `confidence` → medium until Tamrat is read.

**rp-great-zimbabwe-court-1300-1450** (supported; one coding fix)
- The Met confirms eight birds, six from the Eastern Enclosure of the Hill complex, as "emblems of royal authority, perhaps representing the ancestors."
- Fagan confirms Abraham's view that chiefs and priests controlled the Mwari cult, resting on unpublished Shona traditions.
- The flag correctly says the Mwari link comes from later practice.
- Fix: add `basis: projected`.

**rp-kilwa-court-1277-1450** (partly supported)
- The fifth of the booty is confirmed (Fordham Gibb).
- The record's own flag says Shafi'i is unverified for Kilwa, yet the student summary calls the court "a showcase of Shafi'i Sunni Islam."
- Fixes:
  - `summary` → "...made Kilwa's court a showcase of Sunni Islam."
  - Keep `branch: sunni-shafii` only with the flag, or use `sunni-unspecified` until the Rihla passage is checked.

### 2b. Diffusions (10)

| id | claim | mechanism / outcome | verdict |
|---|---|---|---|
| df-islam-gold-country-no-uptake | Mali's rulers kept Islam from the gold peoples | hierarchical / withheld | partly supported |
| df-mecca-objects-komo | Musa's Mecca objects used in Komo ritual | stimulus / syncretism | supported (as tradition) |
| df-dunama-reform-kanem | Dunama presses Islam beyond the court; mune opened | hierarchical / resistance | partly supported (coding) |
| df-ife-kingship-to-benin | Ife sacred kingship adopted and blended in Benin | hierarchical / syncretism | supported |
| df-mamluk-court-islam-dongola | Islam imposed at the Makurian court by Mamluk force | hierarchical / elite-only | supported (coding debatable) |
| df-kebra-nagast-solomonic-ideology | Kebra Nagast put into Ge'ez c.1314-22 as a dynastic charter | stimulus / adoption | partly supported |
| df-coptic-conversion-islam | Waves of pressure push Copts to convert in the 1300s | hierarchical / adoption | supported (coding caveat) |
| df-black-death-egypt-maghreb | Plague 1347-49 in Egypt and the Maghreb | contagious / impact | supported (stale note) |
| df-malindi-giraffe-to-china | Malindi's giraffe reread as a qilin | hierarchical / syncretism | supported |
| df-kilwa-coinage | Local coinage with Arabic legends, local customs | stimulus / syncretism | partly supported |

**df-islam-gold-country-no-uptake**
- Same informant error as rp-bambuk-bure.
- Withheld is correct by outcome Test 3.
- Fix: `detail` → "al-Umari on the authority of Abu 'Uthman Sa'id al-Dukkali, who lived 35 years in Mali (Levtzion and Hopkins; Kenny ch.11). He attributes the belief to 'the kings of this kingdom', not to Musa."

**df-mecca-objects-komo**
- Wikipedia "Mali Empire" confirms the tradition, citing Conrad 1992, p.152.
- Syncretism fits Test 6.
- The mechanism is arguable. The objects were carried by a pilgrim-ruler, which is closer to relocation or hierarchical; stimulus ("reshaped into something new") is defensible.
- No fix required.

**df-dunama-reform-kanem** (coding problem)
- The cited, web-checked source (Lange) says the opposite of "resistance": under Dunama, orthodox Islam "penetrated the popular strata."
- "Resistance" rests on Ibn Furtu's 16th-century moralizing that blames the mune's destruction for later wars. That is not evidence that anyone refused Islam in 1210-50.
- By the tests in order, Test 4 (actively refused, rolled back or fought) is not shown for Islam itself. The fought-over thing was the dynasty's authority.
- Students would learn "Kanem resisted Islam."
- Fix:
  - `outcome` → adoption.
  - `detail`: keep the coding debate, adding "Ibn Furtu's 16th-c. blame of the mune's destruction is remembered opposition, not attested refusal."

**df-ife-kingship-to-benin**
- Ryder GHA supports c.1300 and the uzama titles resembling Yoruba ones in either direction.
- Ryder 1965 supports the northern (Nupe-Igala) alternative.
- Syncretism is fine.

**df-mamluk-court-islam-dongola**
- The facts are confirmed: 1276, Barshambu in 1316-17, Kudanbes in 1323, and Godlewski's "newcomers from the north."
- Coding: by Test 5, Godlewski's reading (a mosque for northern soldiers, merchants and tax collectors) points to coexistence before elite-only.
- After 1317 both Christian and Muslim kings ruled, so the court was not durably Muslim.
- Fix: keep elite-only if the "what" is the court, but add to `detail`: "Test 5 (coexistence) is arguable: Godlewski reads the 1317 mosque as serving northern newcomers. Christian kings (Kudanbes) also reigned after Barshambu."

**df-kebra-nagast-solomonic-ideology**
- Wikipedia supports:
  - The colophon (Coptic → Arabic in 409 "year of mercy" = 1225 → Ge'ez under Abuna Giyorgis, possibly for Ya'ibika Igzi' of Enderta).
  - The 1314-1321/22 dating.
  - Doubt about a Coptic original.
- Tiruneh (Columbia) supports the older-Arabic and 6th-century views.
- The student summary states the colophon's story as fact ("clergy at Aksum put into Ge'ez a book").
- The "governor who rebelled against Amda Seyon" is not in any checked source. I believe Taddesse Tamrat describes Ya'ibika Egzi's revolt, but it is citation-only.
- Fix:
  - `summary` first clause → "In the early 1300s, according to its own closing note, clergy at Aksum put into Ge'ez..."
  - `detail`: mark the rebellion as "(Taddesse Tamrat; not checked)".

**df-coptic-conversion-islam**
- O'Sullivan supports:
  - Eight assaults (1259 to 1354).
  - The 450 converts at Qalyub as "insufficient support."
  - A Muslim majority by the 9th century.
  - Little's "turning point."
- Garcin p.424 supports early-15th-century conversions, though he says "minoritaires," not Copts specifically.
- Coding: the summary itself says "especially officials." By the tests in order, elite-only (Test 7) fits better than adoption (Test 8) if one follows O'Sullivan. Adoption fits if one follows el-Leithy and Little.
- The mechanism "hierarchical" is redefined in the detail as state coercion; see S5.
- Fix: keep adoption but add to `detail`: "Outcome is contested: O'Sullivan's reading supports elite-only."

**df-black-death-egypt-maghreb**
- The facts are confirmed (see the keyframe).
- The detail still says: "Outcome value does not fit disease (taxonomy pressure); 'adoption' here means it spread broadly." The outcome is now `impact`, so this note is stale and contradicts the record.
- Fix: replace that sentence with "Outcome impact (Test 2): plague is undergone, not taken up."

**df-malindi-giraffe-to-china**
- Supported.
- Fix: `detail` → "(1415 route per Duyvendak; Science News says only 'a year later')."

**df-kilwa-coinage**
- Horton et al. 2022 supports "first ... coins at the end of the tenth century."
- Matveiev supports no place, date or value on Kilwa coins.
- Perkins, Fleisher and Wynne-Jones 2014 say the Ali ibn al-Hasan types "remained in circulation for several hundred years," in a deposit of the "end of the fourteenth or very early fifteenth centuries." They do not say the types were reissued.
- Fix: `detail` "with old names reissued (Ali ibn al-Hasan types still in use in a late-14th c. deposit)" → "with old types kept in circulation for centuries (Ali ibn al-Hasan coins in a deposit of c.1400)."

### 2c. Exemplars (12)

| id | claim | verdict |
|---|---|---|
| ex-djinguereber | Founded c.1325-27 after the hajj; much-rebuilt fabric | supported |
| ex-great-mosque-djenne | 1906-07 rebuild on Kunburu's palace-mosque site | supported (slider fix) |
| ex-sankore | Mosque of a teaching network, not a "university," peak 16th c. | supported |
| ex-lalibela-churches | Eleven churches; tradition vs multi-phase scholarship | supported |
| ex-dongola-throne-hall-mosque | 9th-c. hall, mosque 1317-1969 | partly supported |
| ex-bou-inania-madrasa | Built 1350-55, a Friday mosque, water clock 1357 | supported |
| ex-al-azhar | Mamluk revival from 1266; 750 students in riwaqs in 1415-16 | supported (citation fix) |
| ex-great-mosque-kilwa | 11th/12th-c. hall; early-14th-c. domed extension; 15th-c. rebuild | supported |
| ex-zimbabwe-birds | Eight birds, six from the Eastern Enclosure; looting and return | partly supported |
| ex-ife-heads | 17 heads from Wunmonije (1938), leaded zinc-brass, 12th-15th c. | supported |
| ex-mapungubwe-gold-rhino | Gold foil over wood, elite burial, found 1933 | supported (minor) |
| ex-fakhr-al-din-mosque | Mihrab inscription dated 1269 | supported |

**ex-djinguereber**
- Wikipedia confirms:
  - 1327 (infobox) and 1325 (text).
  - The Aradeon and Hunwick dispute ("attested only as the designer of a royal audience chamber").
  - al-Aqib's work from 1570.
  - Limestone in the 1960s.
  - The 2006 restoration.
  - UNESCO 1988.
- The record's summary should not say the mosque was simply "founded after Mansa Musa's pilgrimage" without a hedge, but it already says "around 1325-1327." Fine.

**ex-great-mosque-djenne**
- Maas (Aramco World) confirms Koy Kunboro replacing his palace with a mosque (quoting the *Tarikh al-Sudan*), construction "in 1907," and the masons' guild organizing the annual replastering.
- Ismaila Traore and the forced labor are from Bourgeois (citation-only); they are standard facts.
- The span starts in 1907 with no `on_slider` flag. Taxonomy v0.2 defined `on_slider: false` for later sources shown only as cards; without it this exemplar falls outside the 1200-1450 slider.
- Fix: `on_slider: false`. The same applies to `ex-marchinbar-coins` (1944) and `ex-kilwa-chronicle` (1520).

**ex-sankore**
- Wikipedia supports a 14th-century founding and a Tuareg (Aghlal) woman patron. The record's "wealthy woman" is fine; it could add "Tuareg."
- The Wikipedia article itself uses the "university" framing. The record rightly avoids it.

**ex-lalibela-churches**
- The Met supports four or five phases from the 7th to the 13th century.
- Gnisci's review of Bosc-Tiessé and Derat (2019) supports Fauvelle and Mensan's phases and fortifications. The review does not mention "palaces"; that is Phillipson's view.
- UNESCO 1978 is confirmed.

**ex-dongola-throne-hall-mosque** (partly supported)
- Wikipedia confirms the 9th century, Zacharias III and Georgios I, 29 May 1317, 1969, and PCMA excavations in 1970-1983.
- The detail's "Godlewski suggests the conversion may have helped make Barshambu unpopular" is not in the cited Godlewski 2018 article, which never mentions Barshambu. It may be from Godlewski 2015, which is not in the sources.
- Fix: delete that sentence, or add and cite Godlewski 2015 with a page number.

**ex-bou-inania-madrasa**
- Wikipedia confirms:
  - Construction started 28 December 1350 and ended 1355.
  - It was the only Moroccan madrasa with Friday-mosque status.
  - Its original name was al-Mutawakkiliyya.
  - The water clock was completed 6 May 1357, per al-Jazna'i alone.

**ex-al-azhar**
- Archnet confirms that Aydamur al-Hilli restored the khutba in 1266, the Taybarsiyya (1309, Shafi'i and Maliki iwans) and the Aqbughawiyya (1340).
- The encyclopedia.com page confirms the 750 students by province and nationality in 1415-16. However, that page is the *Encyclopedia of Religion* (Gale, 2005), entry by Ismail K. Poonawala, not the "Encyclopedia of Islam and the Muslim World" that the record names.
- Fix: `src-encyclopedia-al-azhar.citation` → "Ismail K. Poonawala, 'Azhar, al-', Encyclopedia of Religion, 2nd ed. (Gale, 2005), via encyclopedia.com."

**ex-great-mosque-kilwa**
- UNESCO: "constructed in the 11th century and considerably enlarged in the 13th century."
- Matveiev: 12th-century original, rebuilt and completed under Sulayman ibn Muhammad al-Malik al-'Adil, dated "1412-1442" in Matveiev. The record has c.1421-1442.
- The record's summary ("began ... in the 1100s") sits between UNESCO's 11th century and Matveiev's 12th. approx: true covers it.
- Fix: `detail` → "Sulayman ibn Muhammad (c.1412/1421-1442; sources differ)."

**ex-zimbabwe-birds** (partly supported)
- The Met supports eight birds, six from the Eastern Enclosure, as emblems of royal authority.
- Al Jazeera 2020 supports five birds returned by South Africa in 1981, the pedestal from Germany in 2003, and Mahachi's quote. It does not mention Posselt or 1889. That claim is standard (Posselt removed a bird in 1889 and sold it to Rhodes) but is unsourced here.
- The detail says "Wikipedia reports a final return from South Africa in April 2026 (not checked)." Al Jazeera (2020) says one bird remains at Rhodes's former home. An unverified recent event should not ship.
- Fix: delete the April 2026 sentence until it is sourced. Cite Posselt 1889 to Matenga or Huffman.

**ex-ife-heads**
- The British Museum (Af1939,34.1) confirms "14thC-15thC(early) (probably)," found with "sixteen other brass and copper heads" at Wunmonije in 1938, "heavily leaded zinc-brass."
- Supported.

**ex-mapungubwe-gold-rhino**
- The Met (Apley) confirms gold foil over a likely wooden core, the hilltop graveyard with royal-style burials, and flourishing in 1220-1290/1300. It says the ruins were "uncovered in 1932."
- The van Graan party found the gold at the end of 1932, and excavation began in 1933.
- Fix: `detail` "Found ... in 1933" → "Found ... in 1932-33."

**ex-fakhr-al-din-mosque**
- Matveiev confirms the mihrab inscription dated 1269 and a Mogadishu minaret dated 1238.
- Supported.

---

## 3. URL checks (65 fetched)

- **Dead:** none. Every cited URL I fetched resolved.
- **Fabricated:** none. Every page exists and is the work the citation names. One exception: the encyclopedia.com page is a different encyclopedia than cited.
- **Wrong for the claim it is cited for.** These are the serious ones.

| source id | url | problem |
|---|---|---|
| src-al-umari-masalik | medievalslavery.org/?p=4049 | Hadiya eunuch passage only. It is attached to about 30 records, including Mali, Kanem, Musa's hajj and the gold country, and labeled web-checked. The wsahel and north files had the right URL (worldhistorycommons.org Musa excerpt), and the csahel and wsahel files marked it citation-only; the merge overwrote both. |
| src-ibn-battuta-rihla | sourcebooks.web.fordham.edu/.../ibnbattuta-africa14C.asp | East Africa abridgment only. No Mali, Walata, Timbuktu, Takedda or Bornu, yet it is cited by about 48 records and labeled web-checked. The csahel and north files marked it citation-only. The wsahel file's correct URL (Macmillan/Strayer Gibb excerpt) is buried in `variants`. |
| src-al-sadi-tarikh-al-sudan | dhspriory.org/kenny/NWAfr/a12.htm | Kenny ch.12 (Songhay from Sonni Ali). It does not contain the 1433 Tuareg passage. Both files that use al-Sa'di for 1433 marked it citation-only, but the merged record says web-checked. |
| src-tarikh-al-fattash | same a12 url | Same merge promotion (the wsahel copy was citation-only). Not content-checked. |
| src-wikipedia-jews-ethiopia | en.wikipedia.org/wiki/History_of_the_Jews_in_Ethiopia | Does not contain the 1329 campaign or church burning. The right page is /wiki/Beta_Israel. |
| src-godlewski-dongola-social-change | api.sopw.openform.pl/... | Real and supports most uses, but it does not support "Barshambu unpopular" (ex-dongola-throne-hall-mosque). |
| src-wikipedia-makuria | en.wikipedia.org/wiki/Makuria | Contradicts the record's date: 20 Jan 1276 is the army's departure, not the battle. |
| src-encyclopedia-al-azhar | encyclopedia.com/.../al-azhar | Supports the claim, but it is the *Encyclopedia of Religion* (Poonawala 2005), not *Encyclopedia of Islam and the Muslim World*. |
| src-wp-almohad-doctrine | en.wikipedia.com/wiki/Almohadism | Works only as a redirect from a non-canonical host. Use en.wikipedia.org/wiki/Almohad_doctrine. |

**URLs that support their claims:**
- DBMNT 611
- UNESCO WHC 18, 144, 364 and 1099
- Met essays on Lalibela, Great Zimbabwe and Mapungubwe
- GHA IV chapters T4-6, T4-8, T4-9, T4-10, T4-11, T4-14, T4-15, T4-18, T4-19, T4-22 and T4-25
- Banister (MSR)
- O'Sullivan (MSR)
- Konieczny (Medievalists.net)
- Dols (Stanford)
- Science News
- Chirikure et al. 2013
- Saad 1979
- Chittick 1965
- Ryder 1965
- Horton et al. 2022
- Perkins et al. 2014
- Babalola et al. 2018
- Prevost 2007
- Hoffman 2020 (supports the claim, but it is 20th-century evidence)
- Gnisci 2025
- Tiruneh (Columbia)
- Ethiopian Jewry Heritage Center
- medievalslavery.org page 3340
- Al Jazeera 2020
- Aramco World (Maas)
- Lafayette (Gibb 1958)
- Archnet 2311
- Zenodo record (resolves to Palmer 1908; the PDF was not read)
- Wikipedia: Yekuno Amlak, Amda Seyon I, Zara Yaqob, Ewostatewos, Throne Hall of Dongola, Kebra Nagast, Djinguereber, Sankore, Bou Inania, Black Death in the Middle East, Jewish community of Fes, African Romance

---

## 4. Verdict counts

| set | checked | supported | partly supported | not supported | could not check |
|---|---|---|---|---|---|
| keyframe events | 25 | 16 | 9 | 0 | 0 |
| religion profiles | 12 | 5 | 7 | 0 | 0 |
| diffusions | 10 | 6 | 4 | 0 | 0 |
| exemplars | 12 | 10 | 2 | 0 | 0 |
| **total records** | **59** | **37** | **22** | **0** | **0** |
| cited URLs fetched | 65 | 56 support their use | — | 9 wrong for the claim or misattributed (table in section 3) | 0 dead |

No record is wholly unsupported. Several specific claims inside records are not supported by their cited source:

- The battle date in ev-mamluk-sack-dongola.
- "Al-Umari reports Musa saying" in rp-bambuk-bure-rural.
- The 1329 church burning, as cited, in rp-beta-israel.
- "Barshambu unpopular" in ex-dongola.
- "Reissued" coins in df-kilwa-coinage.
- "Model for other quarters" in ev-fez-mellah.
- "Including some in Africa" in ev-abbasid-caliphate-cairo.

Claims I could not check, and why:

- The Kano Chronicle text (PDF unread).
- Ibn Battuta on Bornu, Takedda and Timbuktu (cited abridgments lack them).
- Conrad 1992 (checked only via Wikipedia's footnote).
- Taddesse Tamrat 1972 (Za-Ilmaknun; Ya'ibika Egzi's revolt).
- Seignobos.
- The Mombasa Shafi'i statement (Hamdun and King via a blog).
- The April 2026 bird return.
- Ibn Battuta's arrival month at the Mali capital.
- WebSearch was unavailable for all of these.

---

## 5. Required fixes, by severity

**A. Errors students would learn wrong (student-facing summaries, or keyframe facts)**

1. **rp-bambuk-bure-rural-1300-1350 `summary`, and df-islam-gold-country-no-uptake `detail`:** the source is al-Umari's informant Abu 'Uthman Sa'id al-Dukkali, reporting what "the kings of this kingdom" learned, not Musa. Use the replacement wording in 2a.
2. **ev-mamluk-sack-dongola `detail`:** 20 January 1276 was the army's departure; the battle at Dongola came later in 1276. Correct the Seignobos citation, whose titles were "from memory."
3. **ev-great-zimbabwe-decline `summary`:** replace "Around 1450 ... lost its place" with "During the 1400s." Remove the Khami-overlap claim attributed to Chirikure 2013, whose abstract shows overlap with Mapungubwe only.
4. **df-dunama-reform-kanem `outcome`:** change resistance to adoption. The cited source, Lange, says Islam reached the popular strata under Dunama.
5. **ev-abbasid-caliphate-cairo `summary`:** remove "including some in Africa," which has no case inside 1200-1450, or name Askia Muhammad in 1497 as later.
6. **rp-kilwa-court-1277-1450 `summary`:** change "Shafi'i Sunni Islam" to "Sunni Islam." The record's own flag says Shafi'i is unverified for Kilwa.
7. **ev-lalibela-new-jerusalem `summary`:** attribute the church carving to tradition, and mention the multi-phase scholarship.
8. **rp-kanem-court-1250-1387 `summary`:** change "Visitors described" to "Writers in Cairo, and Ibn Battuta from hearsay at Takedda."
9. **ev-fez-mellah `summary`:** change "the model for Jewish quarters" to "Morocco's first mellah; later quarters took its name."
10. **df-kebra-nagast-solomonic-ideology `summary`:** attribute the Aksum translation story to the book's colophon.
11. **ev-debre-mitmaq-1450 `summary`:** change "started by Ewostatewos's followers" to "began with the monk Ewostatewos and his followers."
12. **ex-great-mosque-djenne, ex-marchinbar-coins, ex-kilwa-chronicle:** set `on_slider: false`, so 1907, 1944 and 1520 objects do not sit on a 1200-1450 timeline.

**B. Source integrity (teacher-facing, but this is the biggest single problem)**

13. **Merge bug: per-file citations collapsed into one top-level record (systemic issue S1).**
    - Fix `src-al-umari-masalik`, `src-ibn-battuta-rihla`, `src-al-sadi-tarikh-al-sudan` and `src-tarikh-al-fattash` by splitting them per passage. Suggested split:
      - `src-al-umari-masalik-habasha` (medievalslavery 4049)
      - `src-al-umari-masalik-mali` (worldhistorycommons; Kenny a11)
      - `src-ibn-battuta-rihla-eastafrica` (Fordham)
      - `src-ibn-battuta-rihla-mali` (Macmillan)
      - `src-ibn-battuta-rihla-bornu-takedda` (citation-only)
      - `src-al-sadi-...` (citation-only, url null)
    - Alternatively, make `tools/build_data.py` keep the least-verified status rather than the most.
    - About 100 citations currently show "web-checked" for passages nobody read online.
14. **rp-beta-israel-rural-1270-1413:** cite https://en.wikipedia.org/wiki/Beta_Israel for the 1329 campaign, not "History of the Jews in Ethiopia." Set `span.approx: true`.
15. **ex-dongola-throne-hall-mosque `detail`:** delete "Godlewski suggests ... unpopular," or cite Godlewski 2015 with a page.
16. **ex-zimbabwe-birds `detail`:** delete the unchecked "April 2026" return.
17. **src-encyclopedia-al-azhar `citation`:** Poonawala, *Encyclopedia of Religion* (2005).
18. **src-wp-almohad-doctrine `url`:** https://en.wikipedia.org/wiki/Almohad_doctrine.

**C. Taxonomy coding**

19. **Add `basis`:**
    - `projected` for rp-great-zimbabwe-court-1300-1450, rp-ife-court-1200-1350, rp-atlas-amazigh-rural-1269-1450 and rp-beta-israel-rural-1270-1413.
    - `inferred` for rp-timbuktu-urban-1325-1433, rp-kanem-court-1250-1387 and rp-bambuk-bure-rural-1300-1350.
    - Then sweep all 78 exclusive profiles (see S2).
20. **rp-kano-court-1200-1349:** add minority Islam (`share: unknown`, per Adamu), change `relation` to plural, and set `basis: projected`. Alternatively, recode to undocumented.
21. **rp-tozeur-indigenous-christians-1200-1260:** set `branch: latin-african`.
22. **rp-ife-court-1200-1350:** remove "Ifa divination" from `local_form`, or mark it unattested.
23. **df-black-death-egypt-maghreb `detail`:** delete the stale "adoption here means it spread broadly" sentence.
24. **df-mamluk-court-islam-dongola and df-coptic-conversion-islam:** note the arguable alternatives in `detail` (coexistence by Test 5; elite-only by Test 7).
25. **ev-almohad-mahdi-repudiated:** set `approx: true` (1229 or 1230).

**D. Small detail fixes**

26. **ev-yekuno-amlak-1270:** add Getatchew's Na'akueto La'ab; reword the Za-Ilmaknun claim; set confidence to medium.
27. **ev-ife-florescence:** state the two Babalola dates and the 11th-15th c. conclusion separately.
28. **df-kilwa-coinage:** "reissued" → "kept in circulation."
29. **ex-mapungubwe-gold-rhino:** 1933 → 1932-33.
30. **ex-great-mosque-kilwa:** Sulayman ibn Muhammad, c.1412/1421-1442.
31. **rp-mali-court-1300-1450:** "boys chained" → "the qadi's children."
32. **ev-ibn-battuta-mali:** arrival at the capital "June or July 1352."
33. **Broken internal references:** in ev-great-zimbabwe-peak, `ev-ibn-battuta` → `ev-ibn-battuta-swahili-coast`; in rp-ife-court-1200-1350, `df-ife- kingship-to-benin` → `df-ife-kingship-to-benin`.

---

## 6. Systemic problems

**S1. The merge inflates verification and swaps URLs.**
- `build_data.py` sorts copies of a shared source id by verification rank and keeps the best one at top level. Other copies go into `variants`, which the app does not show per citation.
- Result: a source that one researcher web-checked for one passage (al-Umari on Hadiya; Ibn Battuta on Zeila and the Swahili coast; al-Sa'di on Askia's investiture) shows as web-checked, with that passage's URL, for every other passage in every other file.
- This is the "mismatched URL" pattern the brief warned about. The URLs are not fabricated, but they are attached to claims they do not contain.
- It affects the three most-cited primary sources: about 100 citations.

**S2. Exclusive coding rests on silence, and `basis` is never used.**
- 78 of 219 profiles are exclusive.
- `basis` (added in taxonomy v0.2 for exactly this case) is set on 0 of 219.
- At least 23 exclusive profiles say in their own detail that the coding rests on silence, inference or later practice. Examples:
  - Great Zimbabwe.
  - Ife.
  - Benin.
  - Kano.
  - Timbuktu ("recorded free urban population only").
  - The Swahili urban strata.
  - Atlas rural.
  - Beta Israel.
- The relation note requires `basis: inferred` whenever exclusive rests on silence. The swahili file (19 exclusive, 0 coexisting) and the forest kingdoms in csahel (Ife and Benin, all exclusive) are the heaviest cases.
- Students looking at the map will read "one religion, full stop" where the evidence is "one religion is all anyone wrote down."

**S3. The data predates taxonomy v0.2.**
- `taxonomy_version` in africa.json is 0.1, and `meta.version` in taxonomy.yaml still says 0.1 under a v0.2 header.
- None of the v0.2 fields are used:
  - `basis` (0 profiles).
  - `latin-african` (0; Tozeur uses `other`).
  - `on_slider` (0 exemplars).
  - `fabric_date` (0; Djinguereber, Djenne and the Kilwa Great Mosque all need it).
  - `found_at` (0).
- The validator passes because these fields are optional.

**S4. Nile-horn and north spans are too precise.**
- 68 profile and diffusion spans with round 50-year or periodization boundaries have approx false. All are in nile-horn and north. Examples:
  - rp-makuria-rural-1200-1350.
  - rp-alodia-court-1200-1300.
  - rp-zeila-court-1200-1415.
  - rp-hadiya-court-1330-1450.
  - All of the rp-mamluks-*, rp-hafsids-* and rp-tunis-* profiles.
- These boundaries are the researcher's periodization, not attested dates. Other regions set approx: true for the same kind of break.
- Separately, ev-almohad-mahdi-repudiated (1229/1230) and ev-abbasid-caliphate-cairo (1261/1262) have approx: false where the cited sources differ by a year.

**S5. Mechanism codes are being stretched.**
- "Hierarchical" is defined as "adopted first by rulers or elites, then spreads downward." Two records use it to mean coercion from above, and their detail fields admit the redefinition:
  - df-coptic-conversion-islam.
  - df-mamluk-court-islam-dongola.
- The taxonomy has no mechanism for conquest or pressure. Either add one (with a tie-break test) or say in the hierarchical definition that state pressure counts.

**S6. Too much rests on Wikipedia and citation-only books.**
- 58 sources are Wikipedia.
- Four keyframes rest on Wikipedia plus books nobody opened:
  - ev-yekuno-amlak-1270 (Taddesse Tamrat, citation-only).
  - ev-debre-mitmaq-1450 (Tamrat, citation-only).
  - ev-mamluk-sack-dongola (Seignobos via Wikipedia, titles from memory).
  - ev-black-death-maghreb-egypt (fine, because Dols and Garcin back it).
- Two of these carry confidence "high." Confidence should not be high when the only checked source is Wikipedia.

**S7. Primary voices are cited through the wrong passage.**
- Al-Umari, Ibn Battuta and al-Sa'di are each one long work that the research files cite for different regions.
- Splitting them by passage, as in fix 13, also lets the HAPP block fit each use. Right now the merged al-Umari record's HAPP describes his Habasha section, and the merged Ibn Battuta record's HAPP describes the 1331 Zeila voyage. Both are shown next to Mali and Kanem claims.
