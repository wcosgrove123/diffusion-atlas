# Corrections log: Africa 1200-1450 research files

Applied 2026-10-14 from `docs/fact-check.md` and `docs/language-review.md`, plus taxonomy v0.2 coding. Only the five region files were edited (`data/research/africa/{wsahel,csahel,north,nile-horn,swahili}.yaml`). Every row below is one record; "Review item" names the section of the review that asked for the change (FC = fact-check, LR = language review, S1-S6 = fact-check systemic issues).

## Counts by type of change

| type | changes |
|---|---|
| summary replaced (language review) | 128 |
| basis added | 104 |
| approx set true | 85 |
| detail edit | 62 |
| source record edit | 13 |
| v0.2 field, location or founding span | 10 |
| mechanism -> imposed | 8 |
| summary replaced (fact-check only) | 4 |
| branch -> latin-african | 3 |
| title replaced (language review) | 3 |
| confidence lowered | 2 |
| other field edit (geometry_note) | 2 |
| relation or tradition recode | 2 |
| other field edit (flag replaced) | 1 |
| other field edit (local_form) | 1 |
| other field edit (evidence) | 1 |
| outcome recode | 1 |

Total: 430 field changes across 271 records.

## Records changed

| id | file | what changed | review item |
|---|---|---|---|
| `ev-ibn-battuta-mali` | wsahel | detail: "the capital in June," -> "the capital in mid-1352 (June or July, by different chronolo" | FC 5.D32 |
| `ev-tuareg-take-timbuktu` | wsahel | detail: "Hunwick 1999 (1433-34); Ly-Tall p. 200 (about 1433, also Wal" -> "Hunwick 1999 (1433-34; names Akil, not checked here); Ly-Tal" | FC 1 ev-tuareg-take-timbuktu |
| `rp-mali-court-1300-1450` | wsahel | detail: "boys chained until they memorized the Qur'an" -> "the qadi's children chained until they memorized the Qur'an"; basis: added inferred; detail: "so the 1360-1450 part of this span is inferred and lower con" -> "so the 1360-1450 part of this span is inferred and lower con" | FC 5.D31; FC 2a rp-mali-court-1300-1450 |
| `rp-bambuk-bure-rural-1300-1350` | wsahel | summary replaced; detail: "al-Umari (about 1337-38), from Cairo informants who knew Mus" -> "al-Umari (about 1337-38), on the authority of Abu 'Uthman Sa"; detail: "the gold-belief may be Musa's or his hosts' explanation" -> "the gold-belief may be the Malian court's or the informant's"; flag replaced; basis: added inferred | FC 5.A1; FC 5.A1 (consistency); FC 5.C19; LR + merged: FC 5.A1 wording (informant, not Musa) + LR hedge |
| `df-islam-gold-country-no-uptake` | wsahel | detail: "al-Umari via Cairo informants (Corpus; citation-only, check " -> "al-Umari on the authority of Abu 'Uthman Sa'id al-Dukkali, w" | FC 5.A1 |
| `ex-sankore` | wsahel | detail: "(tradition credits a wealthy woman as patron)" -> "(tradition credits a wealthy Tuareg woman as patron)" | FC 2c ex-sankore |
| `src-ibn-battuta-rihla` | wsahel | verification web-checked -> citation-only (url excerpt lacks the Timbuktu, Gao and Taghaza passages cited in this file); notes: what the url does and does not support | FC 3 / 5.B13 (S1) |
| `src-al-umari-masalik` | wsahel | notes: gold-country passage location and informant | FC 5.A1 |
| `rp-takrur-court-1035-1200` | wsahel | basis: added inferred; summary replaced | S2 sweep: detail says exclusive may be silence; LR (problems 3,4) |
| `rp-takrur-court-1200-1450` | wsahel | basis: added inferred | S2 sweep: thin evidence for court practice; Islam reasoned from reputation and later Fuuta traditions |
| `rp-timbuktu-urban-1325-1433` | wsahel | basis: added inferred | FC 5.C19 |
| `rp-timbuktu-urban-1433-1468` | wsahel | basis: added inferred | S2 sweep: same silence about enslaved and riverine residents as 1325-1433 |
| `rp-timbuktu-court-1325-1468` | wsahel | basis: added inferred | S2 sweep: detail says governors' practice not described |
| `rp-walata-urban-1300-1450` | wsahel | basis: added attested; summary replaced | S2 sweep: Ibn Battuta eyewitness 1352; LR (problems 2,4) |
| `rp-walata-court-1300-1433` | wsahel | basis: added attested | S2 sweep: Ibn Battuta eyewitness 1352 |
| `rp-walata-rural-1300-1450` | wsahel | basis: added attested | S2 sweep: Ibn Battuta traveled with Masufa guides |
| `rp-mossi-court-1330-1450` | wsahel | basis: added projected; summary replaced | S2 sweep: 17th-c. Songhay chronicles and a 1498 episode; LR (problems 3) |
| `rp-begho-urban-1100-1350` | wsahel | basis: added projected | S2 sweep: local_form says "as known from later Bono tradition" |
| `rp-begho-community-dyula-1350-1450` | wsahel | basis: added projected | S2 sweep: Suwarian reading rests on later Dyula tradition (Wilks) |
| `rp-bono-court-1350-1450` | wsahel | basis: added projected; summary replaced | S2 sweep: archaeology plus later ethnography (Warren); LR (problems 3) |
| `rp-diakha-urban-1250-1450` | wsahel | basis: added projected; summary replaced | S2 sweep: clerical tradition with disputed dating; LR (problems 3) |
| `rp-mali-urban-1235-1324` | wsahel | basis: added inferred; summary replaced | S2 sweep (non-exclusive): detail says reasoned reconstruction; LR (problems 3) |
| `rp-takrur-rural-1200-1450` | wsahel | basis: added projected; summary replaced | S2 sweep (non-exclusive): Serer traditions recorded 19th-20th c.; LR (problems 3,4) |
| `rp-jolof-court-1350-1450` | wsahel | basis: added projected; summary replaced | S2 sweep (non-exclusive): founding legends and Cadamosto (1455); LR (problems 3) |
| `rp-songhay-court-1080-1300` | wsahel | basis: added inferred | S2 sweep (non-exclusive): detail says indigenous share is inferred |
| `rp-songhay-court-1430-1464` | wsahel | basis: added projected; summary replaced | S2 sweep (non-exclusive): detail says projected from Sunni Ali; LR (problems 3) |
| `rp-gao-urban-1100-1325` | wsahel | basis: added inferred | S2 sweep (non-exclusive): detail says indigenous share is inferred |
| `rp-djenne-urban-1300-1450` | wsahel | basis: added inferred | S2 sweep (non-exclusive): detail says indigenous share is inferred |
| `rp-djenne-court-1200-1330` | wsahel | basis: added projected; summary replaced | S2 sweep (non-exclusive): chronicle written about 400 years later; LR (problems 3) |
| `rp-sosso-court-1180-1235` | wsahel | basis: added projected; summary replaced | S2 sweep (non-exclusive): oral tradition; no contemporary text; LR (problems 1) |
| `rp-mali-court-1235-1300` | wsahel | basis: added projected | S2 sweep (non-exclusive): oral tradition and Ibn Khaldun (1390s) |
| `ex-great-mosque-djenne` | wsahel | span: {start: 1907, approx: false} -> {start: 1200, approx: true} (founding by Koi Kunboro kept in span); fabric_date: added 1907; on_slider: added false; detail: "Span starts 1907 deliberately: the medieval mosque does not " -> "Span starts with the founding, when Koi Kunboro turned his p" | step 4 / FC 5.A12, S3 (taxonomy v0.2) |
| `rp-ghana-urban-1068-1240` | wsahel | summary replaced | LR (problems 2) |
| `rp-mali-urban-1324-1450` | wsahel | summary replaced | LR (problems 1) |
| `rp-songhay-court-1300-1430` | wsahel | summary replaced | LR (problems 3) |
| `df-islam-jolof-court` | wsahel | summary replaced | LR (problems 1) |
| `df-islam-malal-king` | wsahel | summary replaced | LR (problems 2) |
| `df-islam-mossi-resisted` | wsahel | summary replaced | LR (problems 3) |
| `df-islam-sosso-resisted` | wsahel | summary replaced | LR (problems 1) |
| `df-islam-takrur-war-jabi` | wsahel | summary replaced | LR (problems 3) |
| `df-mali-royal-hajj` | wsahel | summary replaced | LR (problems 1,3) |
| `df-mande-religion-kaabu` | wsahel | summary replaced | LR (problems 3) |
| `df-mecca-objects-komo` | wsahel | summary replaced | LR (problems 3,4) |
| `df-sudano-sahelian-mosque-form` | wsahel | summary replaced | LR (problems 3) |
| `df-suwarian-clerical-tradition` | wsahel | summary replaced | LR (problems 1,3) |
| `ex-niani-excavations` | wsahel | summary replaced | LR (problems 4) |
| `ex-sunjata-epic` | wsahel | summary replaced | LR (problems 1) |
| `ex-taa-kora-tanoboase` | wsahel | summary replaced | LR (problems 3) |
| `ev-al-umari-goldfields` | wsahel | summary replaced; detail: "Exact wording not verified in this research." -> "The passage (Kenny ch.11) is on the authority of Abu 'Uthman" | LR + LR proposal corrected to FC 5.A1 (informant al-Dukkali, not Musa); FC 5.A1 (same claim) |
| `ev-gao-royal-epitaph` | wsahel | title -> "Earliest dated royal gravestone at Gao-Saney"; summary replaced | LR (problems 4); LR (problems 3,4) |
| `ev-jolof-founded` | wsahel | summary replaced | LR (problems 1,3) |
| `ev-mossi-sack-timbuktu` | wsahel | summary replaced | LR (problems 1,3) |
| `ev-musa-hajj` | wsahel | summary replaced | LR (problems 2,4) |
| `ev-sunni-independence` | wsahel | summary replaced | LR (problems 3) |
| `ev-uli-hajj` | wsahel | summary replaced | LR (problems 2,4) |
| `ex-djinguereber` | wsahel | fabric_date: added 1570; detail: added fabric_date 1570 marks qadi al-Aqib's renovation, the oldest major lay... | FC S3 (fabric_date for Djinguereber and Kilwa Great Mosque) |
| `ev-yaji-wangara-kano` | csahel | detail: added The mosque-by-the-sacred-tree episode is from the Chronicle itself (Pa...; summary replaced | FC 1 ev-yaji-wangara-kano; LR (problems 1,3) |
| `ev-ife-florescence` | csahel | detail replaced; summary replaced | FC 1 ev-ife-florescence / 5.D27; LR (problems 3,4) |
| `rp-kanem-court-1250-1387` | csahel | summary replaced; detail: added Basis inferred: the religious reading of the curtain seclusion is an i...; basis: added inferred | FC 5.A8 (superseded by language review in step 5); FC 2a rp-kanem-court-1250-1387; FC 5.C19; LR + LR proposal, plus 'at Takedda' from FC 5.A8 |
| `rp-ife-court-1200-1350` | csahel | local_form: removed "Ifa divination" (antiquity unattested in window); detail: "(see df-ife- kingship-to-benin)" -> "(see df-ife-kingship-to-benin)"; detail: "suggesting ritual use." -> "suggesting ritual use; Ryder also suggests they were made af"; detail: "Ifa's antiquity at Ife rests on tradition;" -> "Ifa divination is left out of local_form because its antiqui"; basis: added projected; summary replaced | FC 5.C22; FC 5.D33 broken reference; FC 2a rp-ife-court-1200-1350; FC 5.C19; LR (problems 4) |
| `df-dunama-reform-kanem` | csahel | outcome: resistance -> adoption; detail: "Outcome "resistance" is chosen because the act provoked reme" -> "Outcome "adoption" follows the cited source: Lange says orth"; mechanism: hierarchical -> imposed; detail: mechanism note added; summary replaced | FC 5.A4; step 3 / FC S5 (taxonomy v0.2 imposed); LR + LR proposal; second sentence adjusted to match outcome adoption (FC 5.A4) |
| `rp-bornu-court-1387-1450` | csahel | basis: added inferred | S2 sweep: detail says exclusive is the court's self-presentation in a diplomatic letter |
| `rp-kano-wangara-1349-1450` | csahel | basis: added projected | S2 sweep: Kano Chronicle (1880s) and Asl al-Wangariyin (1650-51) |
| `rp-agadez-court-1405-1450` | csahel | basis: added projected | S2 sweep: Agadez Chronicles (later texts); al-Umari predates span |
| `rp-takedda-urban-1340-1360` | csahel | basis: added inferred | S2 sweep: detail says exclusive applies only to the people Ibn Battuta met |
| `rp-ife-court-1350-1450` | csahel | basis: added projected | S2 sweep: same orisa content as 1200-1350, from later Yoruba practice |
| `rp-ife-urban-1200-1450` | csahel | basis: added projected | S2 sweep: orisa names from later practice; archaeology shows shrine contexts only |
| `rp-benin-court-1200-1300` | csahel | basis: added projected | S2 sweep: Egharevba 1934 tradition |
| `rp-benin-court-1300-1450` | csahel | basis: added projected; summary replaced | S2 sweep: detail says pairing documented in 20th-c. ethnography; LR (problems 3) |
| `rp-benin-urban-1300-1450` | csahel | basis: added projected; summary replaced | S2 sweep: tradition and 20th-c. study; LR (problems 3) |
| `rp-kanem-court-1086-1210` | csahel | basis: added projected; summary replaced | S2 sweep (non-exclusive): mune inferred from 16th-c. Ibn Furtu; LR (problems 1,3) |
| `rp-kanem-court-1210-1250` | csahel | basis: added projected; summary replaced | S2 sweep (non-exclusive): mune destruction known from Ibn Furtu (1570s); LR (problems 1) |
| `rp-kano-court-1349-1390` | csahel | basis: added projected; summary replaced | S2 sweep (non-exclusive): Kano Chronicle, compiled 1880s; LR (problems 1,4) |
| `rp-kano-court-1390-1410` | csahel | basis: added projected; summary replaced | S2 sweep (non-exclusive): Kano Chronicle, compiled 1880s; LR (problems 3) |
| `rp-kano-court-1410-1450` | csahel | basis: added projected; summary replaced | S2 sweep (non-exclusive): Kano Chronicle, compiled 1880s; LR (problems 1,3) |
| `rp-kano-urban-1349-1450` | csahel | basis: added projected; summary replaced | S2 sweep (non-exclusive): Kano Chronicle, compiled 1880s; LR (problems 1,3) |
| `rp-kano-rural-1349-1450` | csahel | basis: added projected; summary replaced | S2 sweep (non-exclusive): detail says one late chronicle; LR (problems 1) |
| `rp-katsina-court-1445-1500` | csahel | basis: added projected | S2 sweep (non-exclusive): Katsina tradition, disputed king list |
| `rp-hausa-rural-1349-1450` | csahel | basis: added projected; summary replaced | S2 sweep (non-exclusive): detail says projection from later centuries; LR (problems 3) |
| `rp-kano-court-1200-1349` | csahel | traditions: added minority Islam entry (share unknown, "Muslim traders and clerics, per Adamu"); relation: exclusive -> plural; basis: added projected; detail: "Adamu also argues Muslims (traders and clerics from Bornu an" -> "Adamu also argues Muslims (traders and clerics from Bornu an"; summary replaced | FC 5.C20 option (b); FC 5.C20 (summary made consistent with the new coding) |
| `df-kanem-jihad-sao-lake` | csahel | mechanism: hierarchical -> imposed; detail: mechanism note added | step 3 / FC S5 (taxonomy v0.2 imposed) |
| `rp-tuareg-rural-1200-1450` | csahel | summary replaced | LR (problems 4) |
| `df-hajj-to-kanem` | csahel | summary replaced | LR (problems 3) |
| `df-islam-air-sultanate` | csahel | summary replaced | LR (problems 3) |
| `df-islam-tuareg` | csahel | summary replaced | LR (problems 3,4) |
| `df-korau-islam-katsina` | csahel | summary replaced | LR (problems 4) |
| `df-maliki-learning-cairo-kanem` | csahel | summary replaced | LR (problems 3) |
| `ex-dala-tsumburbura` | csahel | summary replaced | LR (problems 1) |
| `ex-kano-walls` | csahel | summary replaced | LR (problems 3) |
| `ev-dunama-opens-mune` | csahel | summary replaced | LR (problems 1,3,4) |
| `ev-kanajeji-tchibiri` | csahel | title -> "Kano's king Kanajeji returns to the Tchibiri rites (Kano Chronicle)"; summary replaced | LR (problems 3,4) |
| `ev-almohad-mahdi-repudiated` | north | approx: false -> true; detail: added The repudiation is variously put in 1229 or 1230 (626-627 AH), hence a...; title -> "Almohad caliph al-Ma'mun rejects the founder's claim to be the mahdi"; summary replaced | FC 5.C25 / S4; FC 5.C25; LR (problems 4) |
| `src-wp-almohad-doctrine` | north | url -> https://en.wikipedia.org/wiki/Almohad_doctrine; notes updated | FC 5.B18 |
| `ev-abbasid-caliphate-cairo` | north | detail: "African investiture documented here only for Askia Muhammad " -> "African investiture documented here only for Askia Muhammad "; approx: false -> true; summary replaced | FC S4; FC S4 (1261/1262); LR + LR proposal; date matched to detail (1496-97) per FC 5.A5 |
| `ev-black-death-maghreb-egypt` | north | detail: "Ibn Khaldun lost his parents in Tunis." -> "Ibn Khaldun lost his parents in Tunis (Idris, GHA IV p. 137," | FC 1 ev-black-death-maghreb-egypt |
| `rp-atlas-amazigh-rural-1269-1450` | north | detail: "Hoffman notes the Anti-Atlas and Sous had a long tradition o" -> "Hoffman (2020) notes the Anti-Atlas and Sous had a long trad"; basis: added projected | FC 2a rp-atlas-amazigh-rural-1269-1450; FC 5.C19 |
| `rp-tozeur-indigenous-christians-1200-1260` | north | detail: "The Almohad abolition of dhimma (1150s-60s) is usually treat" -> "The Almohad abolition of dhimma (1150s-60s) is usually treat"; basis: added inferred; traditions: christianity branch other -> latin-african | FC 2a rp-tozeur-indigenous-christians; S2 sweep: scattered evidence; existence debated; step 4 / FC 5.C21 |
| `df-coptic-conversion-islam` | north | detail: added Outcome is contested: O'Sullivan's reading supports elite-only....; mechanism: hierarchical -> imposed; detail: mechanism note added; detail: removed stale sentence redefining hierarchical as state pressure | FC 5.C24; step 3 / FC S5 (taxonomy v0.2 imposed) |
| `df-black-death-egypt-maghreb` | north | detail: "Outcome value does not fit disease (taxonomy pressure); "ado" -> "Outcome impact (Test 2): plague is undergone, not taken up." | FC 5.C23 stale note |
| `src-encyclopedia-al-azhar` | north | author -> Ismail K. Poonawala; title -> Encyclopedia of Religion entry; citation -> Poonawala, Encyclopedia of Religion (2005); date -> 2005 | FC 5.B17 |
| `rp-almohads-court-1200-1229` | north | basis: added attested; summary replaced; span.approx false -> true (1200-1229: periodization boundary, not a dated event) | S2 sweep: Almohad doctrine directly documented; LR (problems 4); FC S4 (round-boundary spans) |
| `rp-atlas-amazigh-rural-1200-1269` | north | basis: added inferred; span.approx false -> true (1200-1269: periodization boundary, not a dated event) | S2 sweep: urban-written hagiography of the span; azref element is later evidence; FC S4 (round-boundary spans) |
| `rp-marinids-rural-1248-1350` | north | basis: added inferred; summary replaced; span.approx false -> true (1248-1350: periodization boundary, not a dated event) | S2 sweep: detail says evidence for farmers' belief is indirect; LR (problems 3); FC S4 (round-boundary spans) |
| `rp-marinids-rural-1350-1465` | north | basis: added inferred; span.approx false -> true (1350-1465: periodization boundary, not a dated event) | S2 sweep: detail says peasant voices remain indirect; FC S4 (round-boundary spans) |
| `rp-tunis-european-christians-1229-1450` | north | basis: added attested; span.approx false -> true (1229-1450: periodization boundary, not a dated event) | S2 sweep: treaties and Idris; FC S4 (round-boundary spans) |
| `rp-kairouan-urban-1200-1450` | north | basis: added inferred; span.approx false -> true (1200-1450: periodization boundary, not a dated event) | S2 sweep: Jewish community "not documented"; exclusive rests on silence; FC S4 (round-boundary spans) |
| `rp-tozeur-urban-1260-1450` | north | basis: added inferred; summary replaced | S2 sweep: rests on Prevost's argument from absence; LR (problems 3,4) |
| `rp-fez-jews-1248-1438` | north | basis: added attested; span.approx false -> true (1438 debated) | S2 sweep: community directly documented; FC S4 (round-boundary spans) |
| `rp-marrakesh-urban-1269-1450` | north | basis: added inferred | S2 sweep: detail says Jewish presence not checked |
| `rp-cairo-copts-1200-1300` | north | basis: added attested; span.approx false -> true (1200-1300: periodization boundary, not a dated event) | S2 sweep: Copto-Arabic texts of the span; FC S4 (round-boundary spans) |
| `rp-cairo-takrur-1240-1450` | north | basis: added attested | S2 sweep: madrasa and interpreter attested (secondhand) |
| `rp-alexandria-europeans-1200-1450` | north | basis: added inferred; summary replaced; span.approx false -> true (1200-1450: periodization boundary, not a dated event) | S2 sweep: detail says chapels assumed by parallel with Maghreb; LR (problems 3,4); FC S4 (round-boundary spans) |
| `rp-marrakesh-christian-militia-1229-1269` | north | basis: added attested; span.approx false -> true (1229 is itself 1229/1230) | S2 sweep: Hrbek; FC S4 (round-boundary spans) |
| `df-almohad-creed-rollback` | north | mechanism: hierarchical -> imposed; detail: mechanism note added; summary replaced | step 3 / FC S5 (taxonomy v0.2 imposed); LR (problems 4) |
| `rp-tozeur-urban-1200-1260` | north | traditions: christianity branch other -> latin-african; summary replaced | step 4 / FC 5.C21 (same community, consistency); LR (problems 4) |
| `rp-hafsids-rural-1229-1260` | north | traditions: christianity branch other -> latin-african; detail: "The "Latin African" branch has no slot in the taxonomy (bran" -> "Branch latin-african (taxonomy v0.2)."; summary replaced | step 4 / FC 5.C21 (same community, consistency); step 4 (stale taxonomy note); LR (problems 4) |
| `rp-alexandria-urban-1365-1450` | north | summary replaced; span.approx false -> true (1365-1450: periodization boundary, not a dated event) | LR (problems 3); FC S4 (round-boundary spans) |
| `rp-ayyubids-court-1200-1250` | north | summary replaced; span.approx false -> true (1200-1250: periodization boundary, not a dated event) | LR (problems 4); FC S4 (round-boundary spans) |
| `rp-cairo-urban-1354-1450` | north | summary replaced; span.approx false -> true (1354-1450: periodization boundary, not a dated event) | LR (problems 3); FC S4 (round-boundary spans) |
| `rp-fez-urban-1200-1248` | north | summary replaced; span.approx false -> true (1200-1248: periodization boundary, not a dated event) | LR (problems 3); FC S4 (round-boundary spans) |
| `rp-fez-urban-1438-1465` | north | summary replaced; span.approx false -> true (1438 debated) | LR (problems 3); FC S4 (round-boundary spans) |
| `rp-mamluks-court-1250-1300` | north | summary replaced; span.approx false -> true (1250-1300: periodization boundary, not a dated event) | LR (problems 4); FC S4 (round-boundary spans) |
| `rp-marinids-court-1248-1350` | north | summary replaced; span.approx false -> true (1248-1350: periodization boundary, not a dated event) | LR (problems 4); FC S4 (round-boundary spans) |
| `rp-marinids-court-1350-1465` | north | summary replaced; span.approx false -> true (1350-1465: periodization boundary, not a dated event) | LR (problems 4); FC S4 (round-boundary spans) |
| `rp-marrakesh-urban-1200-1269` | north | summary replaced; span.approx false -> true (1200-1269: periodization boundary, not a dated event) | LR (problems 3); FC S4 (round-boundary spans) |
| `rp-sijilmasa-urban-1200-1400` | north | summary replaced | LR (problems 3,4) |
| `df-badawi-fez-to-tanta` | north | summary replaced | LR (problems 3) |
| `df-cairo-to-mali-musa-hajj` | north | summary replaced | LR (problems 3,4) |
| `df-caliphal-investiture-sahel` | north | summary replaced; span.approx false -> true (1261/1262 and 1496-97) | LR (problems 4); FC S4 (round-boundary spans) |
| `df-coptic-to-arabic` | north | summary replaced | LR (problems 4) |
| `df-madrasa-model-to-tunis` | north | summary replaced; span.approx false -> true (Shamma'iya dated 1236-1249 or about 1240) | LR (problems 4); FC S4 (round-boundary spans) |
| `ex-al-azhar` | north | summary replaced | LR (problems 3,4) |
| `ev-fez-mellah` | north | summary replaced | LR + LR proposal + FC 5.A9 ('Morocco's first mellah') |
| `ev-marinids-take-fez` | north | summary replaced | LR (problems 4) |
| `rp-almohads-urban-1200-1229` | north | span.approx false -> true (1200-1229: periodization boundary, not a dated event) | FC S4 (round-boundary spans) |
| `rp-almohads-rural-1200-1269` | north | span.approx false -> true (1200-1269: periodization boundary, not a dated event) | FC S4 (round-boundary spans) |
| `rp-hafsids-court-1229-1350` | north | span.approx false -> true (1229-1350: periodization boundary, not a dated event) | FC S4 (round-boundary spans) |
| `rp-hafsids-court-1350-1450` | north | span.approx false -> true (1350-1450: periodization boundary, not a dated event) | FC S4 (round-boundary spans) |
| `rp-tunis-urban-1229-1350` | north | span.approx false -> true (1229-1350: periodization boundary, not a dated event) | FC S4 (round-boundary spans) |
| `rp-tunis-urban-1350-1450` | north | span.approx false -> true (1350-1450: periodization boundary, not a dated event) | FC S4 (round-boundary spans) |
| `rp-ayyubids-rural-1200-1250` | north | span.approx false -> true (1200-1250: periodization boundary, not a dated event) | FC S4 (round-boundary spans) |
| `rp-mamluks-court-1300-1354` | north | span.approx false -> true (1300-1354: periodization boundary, not a dated event) | FC S4 (round-boundary spans) |
| `rp-mamluks-court-1354-1450` | north | span.approx false -> true (1354-1450: periodization boundary, not a dated event) | FC S4 (round-boundary spans) |
| `rp-mamluks-rural-1250-1354` | north | span.approx false -> true (1250-1354: periodization boundary, not a dated event) | FC S4 (round-boundary spans) |
| `rp-mamluks-rural-1354-1450` | north | span.approx false -> true (1354-1450: periodization boundary, not a dated event) | FC S4 (round-boundary spans) |
| `rp-cairo-urban-1200-1300` | north | span.approx false -> true (1200-1300: periodization boundary, not a dated event) | FC S4 (round-boundary spans) |
| `rp-cairo-urban-1300-1354` | north | span.approx false -> true (1300-1354: periodization boundary, not a dated event) | FC S4 (round-boundary spans) |
| `rp-cairo-copts-1300-1450` | north | span.approx false -> true (1300-1450: periodization boundary, not a dated event) | FC S4 (round-boundary spans) |
| `rp-cairo-jews-1200-1300` | north | span.approx false -> true (1200-1300: periodization boundary, not a dated event) | FC S4 (round-boundary spans) |
| `rp-cairo-jews-1300-1450` | north | span.approx false -> true (1300-1450: periodization boundary, not a dated event) | FC S4 (round-boundary spans) |
| `rp-alexandria-urban-1200-1365` | north | span.approx false -> true (1200-1365: periodization boundary, not a dated event) | FC S4 (round-boundary spans) |
| `df-latin-merchant-colonies` | north | span.approx false -> true (1200-1450: periodization boundary, not a dated event) | FC S4 (round-boundary spans) |
| `df-mamluk-slave-soldiers` | north | span.approx false -> true (1240-1450: periodization boundary, not a dated event) | FC S4 (round-boundary spans) |
| `rp-almohads-court-1229-1269` | north | span.approx false -> true (1229 is itself 1229/1230 per fact-check) | FC S4 (round-boundary spans) |
| `rp-fez-urban-1248-1438` | north | span.approx false -> true (1438 mellah date is debated (1437/1438, or gradual)) | FC S4 (round-boundary spans) |
| `rp-fez-jews-1438-1465` | north | span.approx false -> true (1438 debated) | FC S4 (round-boundary spans) |
| `ev-yekuno-amlak-1270` | nile-horn | detail: "Taddesse Tamrat names the last Zagwe king Yetbarak; traditio" -> "Taddesse Tamrat argued the last Zagwe king was Yetbarak, who"; confidence: high -> medium | FC 1 ev-yekuno-amlak-1270 / 5.D26 |
| `ev-mamluk-sack-dongola` | nile-horn | detail: "Battle near Dongola, 20 January 1276 (Seignobos). Followed K" -> "The Mamluk army set out on 20 January 1276 (Wikipedia, citin"; detail: "The installed king swore fealty on 4 June 1276." -> "Mashkouda was installed on 4 June 1276 and swore fealty to B" | FC 1 ev-mamluk-sack-dongola / 5.A2 |
| `rp-makuria-court-1276-1365` | nile-horn | detail: "Baybars' army defeated him at Dongola (20 January 1276);" -> "Baybars' army set out on 20 January 1276 and defeated him at" | FC 5.A2 (same date error as ev-mamluk-sack-dongola) |
| `src-seignobos-nubia-mamluks` | nile-horn | notes: 20 Jan 1276 = departure; titles flagged unverified | FC 5.A2 |
| `ev-debre-mitmaq-1450` | nile-horn | summary: "It ended a century-long split started by Ewostatewos's follo" -> "It ended a split of about a century that began with the monk" | FC 1 ev-debre-mitmaq-1450 / 5.A11 |
| `ev-dongola-mosque-1317` | nile-horn | detail: "See ex-dongola-throne-hall-mosque." -> "See ex-dongola-throne-hall-mosque. Barshambu is also spelled" | FC 1 ev-dongola-mosque-1317 (alt spelling) |
| `rp-beta-israel-rural-1270-1413` | nile-horn | detail: "Amda Seyon sent troops in 1329 to Semien, Wegera, Tselemt an" -> "In 1329, after reports that Jews were burning churches in Se"; detail: "Kaplan notes the label was also hurled at Christian dissiden" -> "Kaplan notes the label was also hurled at Christian dissiden"; evidence: src-wikipedia-jews-ethiopia -> src-wikipedia-beta-israel (the right page for 1329); basis: added projected; span.approx false -> true (1270-1413: periodization boundary, not a dated event) | FC 2a rp-beta-israel / 5.B14; FC 2a rp-beta-israel; FC 5.B14; FC 5.C19; FC S4 (round-boundary spans) |
| `df-christian-pressure-beta-israel` | nile-horn | detail: "1329: Amda Seyon's troops sent to Semien, Wegera, Tselemt an" -> "1329: Amda Seyon ordered Tsaga Christos, governor of Begemde"; mechanism: hierarchical -> imposed; detail: mechanism note added | FC 2a rp-beta-israel (same claim; Tsegede spelling); step 3 / FC S5 (taxonomy v0.2 imposed) |
| `pl-beta-israel` | nile-horn | geometry_note: "Tselemt and Sagede" -> "Tselemt and Tsegede" | FC 2a rp-beta-israel (Tsegede spelling) |
| `src-wikipedia-jews-ethiopia` | nile-horn | notes: flagged as wrong for the 1329 claim | FC 3 / 5.B14 |
| `rp-solomonic-court-1270-1433` | nile-horn | confidence: high -> medium; detail: added Confidence medium until Taddesse Tamrat is read: the checked support i...; basis: added attested | FC 2a rp-solomonic-court-1270-1433; S2 sweep: chronicles and letters of the span |
| `df-mamluk-court-islam-dongola` | nile-horn | detail: added Test 5 (coexistence) is arguable: Godlewski reads the 1317 mosque as s...; mechanism: hierarchical -> imposed; detail: mechanism note added | FC 5.C24; step 3 / FC S5 (taxonomy v0.2 imposed) |
| `df-kebra-nagast-solomonic-ideology` | nile-horn | detail: "Ironically it was finished in the Tigrayan circle of a gover" -> "Ironically it was finished in the Tigrayan circle of a gover"; summary replaced | FC 5.A10; LR + LR proposal merged with FC 5.A10 (colophon attribution) |
| `ex-dongola-throne-hall-mosque` | nile-horn | detail: deleted unsupported "Godlewski suggests ... Barshambu unpopular" | FC 5.B15 |
| `ex-lalibela-churches` | nile-horn | detail: "probably began as palaces or fortifications (Fauvelle and Me" -> "probably began as fortifications (Fauvelle and Mensan) or pa" | FC 2c ex-lalibela-churches |
| `src-al-umari-masalik` | nile-horn | verification web-checked -> citation-only (url holds only the Hadiya eunuch passage; this file cites it for Ifat, Zeila and Hadiya claims) | FC 3 / 5.B13 (S1) |
| `src-wikipedia-makuria` | nile-horn | notes: 20 Jan 1276 is the departure | FC 3 |
| `src-godlewski-dongola-social-change` | nile-horn | notes: does not support the Barshambu claim | FC 3 |
| `rp-makuria-court-1200-1275` | nile-horn | basis: added attested; span.approx false -> true (1200-1275: periodization boundary, not a dated event) | S2 sweep: Old Nubian documents, Faras paintings; FC S4 (round-boundary spans) |
| `rp-makuria-court-1365-1450` | nile-horn | basis: added inferred; span.approx false -> true (1365-1450: periodization boundary, not a dated event) | S2 sweep: detail says exclusive is inferred from Christian documents 90 years apart; FC S4 (round-boundary spans) |
| `rp-makuria-community-bedouin-1350-1450` | nile-horn | basis: added inferred; summary replaced; span.approx false -> true (1350-1450: periodization boundary, not a dated event) | S2 sweep: outsider Mamluk-era accounts plus much later genealogies; LR (problems 3); FC S4 (round-boundary spans) |
| `rp-qasr-ibrim-urban-1200-1450` | nile-horn | basis: added inferred; span.approx false -> true (1200-1450: periodization boundary, not a dated event) | S2 sweep: Muslim traders likely but undocumented; documents mostly 12th c. and 1463; FC S4 (round-boundary spans) |
| `rp-alodia-court-1200-1300` | nile-horn | basis: added inferred; span.approx false -> true (1200-1300: periodization boundary, not a dated event) | S2 sweep: church survey passage not seen; Soba archaeology shows decline; FC S4 (round-boundary spans) |
| `rp-zagwe-court-1200-1270` | nile-horn | basis: added attested; span.approx false -> true (1200-1270: periodization boundary, not a dated event) | S2 sweep: land grants of 1204 and 1225; FC S4 (round-boundary spans) |
| `rp-zagwe-community-muslims-1200-1270` | nile-horn | basis: added inferred; span.approx false -> true (1200-1270: periodization boundary, not a dated event) | S2 sweep: Wikipedia summary; site names unverified; FC S4 (round-boundary spans) |
| `rp-lalibela-urban-1200-1270` | nile-horn | basis: added inferred; span.approx false -> true (1200-1270: periodization boundary, not a dated event) | S2 sweep: detail says town population beyond clergy not described; FC S4 (round-boundary spans) |
| `rp-lalibela-urban-1270-1450` | nile-horn | basis: added inferred; span.approx false -> true (1270-1450: periodization boundary, not a dated event) | S2 sweep: same silence as 1200-1270; FC S4 (round-boundary spans) |
| `rp-damot-court-1250-1316` | nile-horn | basis: added projected; summary replaced | S2 sweep: 15th-16th-c. hagiographies; LR (problems 1,3) |
| `rp-ifat-court-1285-1415` | nile-horn | basis: added attested; span.approx false -> true (1285-1415: periodization boundary, not a dated event) | S2 sweep: al-Umari's informant from Ifat; FC S4 (round-boundary spans) |
| `rp-ifat-urban-1285-1415` | nile-horn | basis: added inferred; span.approx false -> true (1285-1415: periodization boundary, not a dated event) | S2 sweep: detail says Christian traders or captives not described; FC S4 (round-boundary spans) |
| `rp-adal-court-1415-1468` | nile-horn | basis: added attested; span.approx false -> true (1415-1468: periodization boundary, not a dated event) | S2 sweep: al-Maqrizi (1430s) and Ethiopian chronicles; FC S4 (round-boundary spans) |
| `rp-adal-urban-1415-1468` | nile-horn | basis: added inferred; span.approx false -> true (1415-1468: periodization boundary, not a dated event) | S2 sweep: Harar traditions unchecked; Dakkar poorly known; FC S4 (round-boundary spans) |
| `rp-zeila-court-1200-1415` | nile-horn | basis: added attested; span.approx false -> true (1200-1415: periodization boundary, not a dated event) | S2 sweep: Ibn al-Mujawir, al-Umari; FC S4 (round-boundary spans) |
| `rp-zeila-urban-1200-1450` | nile-horn | basis: added attested; span.approx false -> true (1200-1450: periodization boundary, not a dated event) | S2 sweep: Ibn Battuta eyewitness 1331; FC S4 (round-boundary spans) |
| `rp-hadiya-court-1330-1450` | nile-horn | basis: added attested; span.approx false -> true (1330-1450: periodization boundary, not a dated event) | S2 sweep: al-Umari names the Hanafi school; FC S4 (round-boundary spans) |
| `rp-alodia-urban-1200-1300` | nile-horn | basis: added inferred; span.approx false -> true (1200-1300: periodization boundary, not a dated event) | S2 sweep (non-exclusive): carries a 10th-c. observation forward (no basis value for forward projection); FC S4 (round-boundary spans) |
| `rp-makuria-rural-1350-1450` | nile-horn | basis: added inferred; span.approx false -> true (1350-1450: periodization boundary, not a dated event) | S2 sweep (non-exclusive): detail says least-assumption reading; FC S4 (round-boundary spans) |
| `rp-solomonic-rural-1270-1433` | nile-horn | basis: added projected; summary replaced; span.approx false -> true (1270-1433: periodization boundary, not a dated event) | S2 sweep (non-exclusive): flag says inferred from later royal complaints and late hagiographies; LR (problems 3); FC S4 (round-boundary spans) |
| `rp-beta-israel-rural-1414-1468` | nile-horn | basis: added projected; span.approx false -> true (1414-1468: periodization boundary, not a dated event) | S2 sweep (non-exclusive): decree known from later accounts and oral tradition; FC S4 (round-boundary spans) |
| `df-christianity-to-damot` | nile-horn | mechanism: hierarchical -> imposed; detail: mechanism note added; span.approx false -> true (1317-1450: periodization boundary, not a dated event) | step 3 / FC S5 (taxonomy v0.2 imposed); FC S4 (round-boundary spans) |
| `df-marian-devotion-miracles` | nile-horn | mechanism: hierarchical -> imposed; detail: mechanism note added; summary replaced | step 3 / FC S5 (taxonomy v0.2 imposed); LR (problems 4) |
| `pl-zeila` | nile-horn | parent: pl-ifat -> span list [Ifat 1285-1415, Adal 1415-]; geometry_note: "Parent is Ifat to 1415; treat as Adal's port after 1415 (sin" -> "Parent is a span list: no parent before about 1285 (local sh" | step 4 / FC 5.A12, S3 (taxonomy v0.2) |
| `rp-solomonic-community-stephanites-1434-1468` | nile-horn | summary replaced | LR (problems 3) |
| `rp-solomonic-court-1434-1468` | nile-horn | summary replaced | LR (problems 1,3) |
| `ex-amharic-soldier-songs` | nile-horn | summary replaced | LR (problems 3) |
| `ex-ioel-land-sale-1463` | nile-horn | summary replaced | LR (problems 4) |
| `ex-timotheos-scrolls` | nile-horn | summary replaced | LR (problems 4) |
| `ev-lalibela-new-jerusalem` | nile-horn | summary replaced | LR (problems 3) |
| `ev-sad-al-din-killed` | nile-horn | summary replaced | LR (problems 3) |
| `ev-yeshaq-beta-israel` | nile-horn | summary replaced | LR (problems 3) |
| `rp-makuria-rural-1200-1350` | nile-horn | span.approx false -> true (1200-1350: periodization boundary, not a dated event) | FC S4 (round-boundary spans) |
| `rp-dongola-urban-1200-1316` | nile-horn | span.approx false -> true (1200-1316: periodization boundary, not a dated event) | FC S4 (round-boundary spans) |
| `rp-dongola-urban-1317-1450` | nile-horn | span.approx false -> true (1317-1450: periodization boundary, not a dated event) | FC S4 (round-boundary spans) |
| `rp-alodia-court-1300-1450` | nile-horn | span.approx false -> true (1300-1450: periodization boundary, not a dated event) | FC S4 (round-boundary spans) |
| `rp-alodia-rural-1200-1450` | nile-horn | span.approx false -> true (1200-1450: periodization boundary, not a dated event) | FC S4 (round-boundary spans) |
| `rp-zagwe-rural-1200-1270` | nile-horn | span.approx false -> true (1200-1270: periodization boundary, not a dated event) | FC S4 (round-boundary spans) |
| `rp-solomonic-urban-1270-1450` | nile-horn | span.approx false -> true (1270-1450: periodization boundary, not a dated event) | FC S4 (round-boundary spans) |
| `rp-solomonic-community-agaw-1270-1450` | nile-horn | span.approx false -> true (1270-1450: periodization boundary, not a dated event) | FC S4 (round-boundary spans) |
| `rp-damot-rural-1317-1450` | nile-horn | span.approx false -> true (1317-1450: periodization boundary, not a dated event) | FC S4 (round-boundary spans) |
| `rp-ifat-rural-1285-1415` | nile-horn | span.approx false -> true (1285-1415: periodization boundary, not a dated event) | FC S4 (round-boundary spans) |
| `rp-adal-rural-1415-1468` | nile-horn | span.approx false -> true (1415-1468: periodization boundary, not a dated event) | FC S4 (round-boundary spans) |
| `rp-hadiya-rural-1330-1450` | nile-horn | span.approx false -> true (1330-1450: periodization boundary, not a dated event) | FC S4 (round-boundary spans) |
| `df-arabic-writing-dongola` | nile-horn | span.approx false -> true (1317-1450: periodization boundary, not a dated event) | FC S4 (round-boundary spans) |
| `df-abun-from-alexandria` | nile-horn | span.approx false -> true (1200-1450: periodization boundary, not a dated event) | FC S4 (round-boundary spans) |
| `df-ewostatewos-sabbath` | nile-horn | span.approx false -> true (1330-1450: periodization boundary, not a dated event) | FC S4 (round-boundary spans) |
| `df-islam-zeila-to-ifat` | nile-horn | span.approx false -> true (1200-1415: periodization boundary, not a dated event) | FC S4 (round-boundary spans) |
| `df-zeila-scholars-abroad` | nile-horn | span.approx false -> true (1300-1450: periodization boundary, not a dated event) | FC S4 (round-boundary spans) |
| `df-slave-trade-southern-highlands` | nile-horn | span.approx false -> true (1300-1450: periodization boundary, not a dated event) | FC S4 (round-boundary spans) |
| `ev-great-zimbabwe-peak` | swahili | detail: "Pair this keyframe with ev-ibn-battuta (1331)" -> "Pair this keyframe with ev-ibn-battuta-swahili-coast (1331)" | FC 5.D33 broken reference |
| `ev-great-zimbabwe-decline` | swahili | detail: "Chirikure et al. (2013) show occupation into the 16th-17th c" -> "Chirikure et al. (2013) show occupation into the 16th c. and"; detail: "Fagan (GHA IV) gives environmental limits." -> "Fagan (GHA IV) gives environmental limits and a late-15th-c."; summary replaced | FC 5.A3; FC 1 ev-great-zimbabwe-decline; LR + FC 5.A3 wording used instead of the LR proposal, which kept 'Around 1450' |
| `df-malindi-giraffe-to-china` | swahili | detail: "In 1415 Malindi envoys brought another giraffe directly." -> "In 1415 Malindi envoys brought another giraffe directly (141" | FC 2b df-malindi-giraffe-to-china |
| `df-kilwa-coinage` | swahili | detail: "with old names reissued (Ali ibn al-Hasan types still in use" -> "with old types kept in circulation for centuries (Ali ibn al" | FC 5.D28 |
| `ex-zimbabwe-birds` | swahili | detail: "Looting: a bird was cut off its pedestal in 1889 (Posselt) a" -> "Looting: a bird was cut off its pedestal in 1889 (Posselt) a"; detail: deleted unchecked April 2026 return | FC 5.B16 |
| `ex-great-mosque-kilwa` | swahili | detail: "under Sulayman ibn Muhammad (c.1421-1442)" -> "under Sulayman ibn Muhammad (c.1412/1421-1442; sources diffe"; fabric_date: added 1421; detail: added fabric_date 1421 marks the start of Sulayman ibn Muhammad's rebuild (c... | FC 5.D30; FC S3 (fabric_date for Djinguereber and Kilwa Great Mosque) |
| `ex-mapungubwe-gold-rhino` | swahili | detail: "in 1933;" -> "in 1932-33;"; summary replaced | FC 5.D29; LR (problems 3,4) |
| `ex-marchinbar-coins` | swahili | detail: "The Kilwa coins' issue dates are uncertain because old types" -> "The Kilwa coins' issue dates are uncertain because old types"; location: Marchinbar Island -> Kilwa (pl-kilwa point); found_at: added {name: "Marchinbar Island, Wessel Islands, Northern Territory, Australia", lat: -11.25, lon: 136.63}; on_slider: added false; detail: "Span is the find date; this marker should be optional on the" -> "Span is the find date; location is Kilwa, where the coins we" | FC 5.D28 (same "reissued" claim); step 4 / FC 5.A12, S3 (taxonomy v0.2) |
| `rp-kilwa-court-1200-1277` | swahili | basis: added inferred | S2 sweep: flag says exclusive reflects only coins and mosques |
| `rp-kilwa-court-1277-1450` | swahili | basis: added attested; summary replaced | S2 sweep: Ibn Battuta eyewitness 1331; LR (problems 3) |
| `rp-mogadishu-court-1200-1300` | swahili | basis: added inferred | S2 sweep: flag "public practice only" |
| `rp-mogadishu-court-1300-1450` | swahili | basis: added attested; summary replaced | S2 sweep: Ibn Battuta eyewitness; LR (problems 4) |
| `rp-mogadishu-urban-1200-1300` | swahili | basis: added inferred | S2 sweep: outsider texts that would not record other practice |
| `rp-mogadishu-urban-1300-1450` | swahili | basis: added attested | S2 sweep: Ibn Battuta eyewitness |
| `rp-zanzibar-court-1200-1350` | swahili | basis: added inferred | S2 sweep: flag says lineages known almost only from coins |
| `rp-zanzibar-court-1350-1450` | swahili | basis: added inferred | S2 sweep: thin evidence; Shafi'i assumed |
| `rp-mombasa-urban-1300-1450` | swahili | basis: added inferred | S2 sweep: detail says one-night outsider snapshot |
| `rp-malindi-court-1250-1450` | swahili | basis: added inferred; summary replaced | S2 sweep: flag "inference, not direct evidence"; LR (problems 3,4) |
| `rp-pate-court-1300-1450` | swahili | basis: added projected | S2 sweep: Pate Chronicle copies from 1903 |
| `rp-lamu-urban-1370-1450` | swahili | basis: added inferred | S2 sweep: 1441 report unverified |
| `rp-sofala-court-1300-1450` | swahili | basis: added projected | S2 sweep: Portuguese 1505 evidence read back |
| `rp-sofala-urban-1300-1450` | swahili | basis: added inferred | S2 sweep: Abu al-Fida outsider report; 1505 count |
| `rp-great-zimbabwe-court-1200-1300` | swahili | basis: added projected; summary replaced | S2 sweep: detail says interpretation leans on later Shona ethnography; LR (problems 3) |
| `rp-great-zimbabwe-court-1300-1450` | swahili | basis: added projected; summary replaced | FC 5.C19; LR (problems 3) |
| `rp-great-zimbabwe-urban-1300-1450` | swahili | basis: added projected | S2 sweep: flag "content inferred from ethnography" |
| `rp-mapungubwe-court-1220-1290` | swahili | basis: added inferred | S2 sweep: archaeology of the span read through sacral-kingship models |
| `rp-mutapa-court-1430-1500` | swahili | basis: added projected; summary replaced | S2 sweep: flag "projected back from later sources"; LR (problems 3) |
| `rp-kilwa-urban-1200-1300` | swahili | basis: added projected; summary replaced | S2 sweep (non-exclusive): mizimu evidence from later ethnography; LR (problems 1) |
| `ex-kilwa-chronicle` | swahili | on_slider: added false; detail: "Span is the composition range; the marker is a source card, " -> "Span is the composition range; on_slider is false because th"; summary replaced | step 4 / FC 5.A12, S3 (taxonomy v0.2); LR (problems 4) |
| `df-arabic-written-religion-law` | swahili | summary replaced | LR (problems 4) |
| `df-enslaved-from-mainland` | swahili | summary replaced | LR (problems 3) |
| `df-islam-malindi` | swahili | summary replaced | LR (problems 3) |
| `df-islam-mombasa` | swahili | summary replaced | LR (problems 2,4) |
| `df-islam-no-uptake-hinterland` | swahili | summary replaced | LR (problems 2) |
| `df-islam-pemba-chwaka` | swahili | summary replaced | LR (problems 3) |
| `df-islam-through-marriage` | swahili | summary replaced | LR (problems 3) |
| `df-mahdali-sharifs-kilwa` | swahili | summary replaced | LR (problems 3) |
| `df-shirazi-status-identity` | swahili | summary replaced | LR (problems 4) |
| `ex-fakhr-al-din-mosque` | swahili | summary replaced | LR (problems 4) |
| `ex-gedi-dated-tomb` | swahili | summary replaced | LR (problems 1) |
| `ex-great-enclosure` | swahili | summary replaced | LR (problems 3) |
| `ex-malindi-giraffe-painting` | swahili | summary replaced | LR (problems 4) |
| `ex-shanga-mosques` | swahili | summary replaced | LR (problems 3) |
| `ev-fakhr-al-din-mosque` | swahili | summary replaced | LR (problems 4) |
| `ev-kilwa-great-mosque-rebuilt` | swahili | summary replaced | LR (problems 4) |
| `ev-said-of-mogadishu` | swahili | summary replaced | LR (problems 2) |
| `ev-tumbatu-abandoned` | swahili | summary replaced | LR (problems 3) |
