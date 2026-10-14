# AP World History: Modern CED alignment, Units 1 and 2 (c. 1200 to c. 1450)

This is the reference for every `ap_topics` tag in the atlas. It covers all fourteen topics in Units 1 and 2, not
only the African ones, so the Asia, Middle East, and Europe modules can use the same file.

## Source and how it was checked

- **Document:** *AP World History: Modern Course and Exam Description*, "Effective Fall 2026," footer
  "AP World History: Modern Course and Exam Description V.1," © 2026 College Board.
- **URL read:** https://apcentral.collegeboard.org/pdf/ap-world-history-modern-course-and-exam-description.pdf
  (the official PDF, linked from the AP Central course page).
- **Clarifications and Corrections** (https://apcentral.collegeboard.org/media/pdf/ap-world-history-modern-course-and-exam-description-clarifications.pdf),
  labeled "Implemented for Fall 2026": none of its changes touch Units 1 or 2. It updates topic-page resource
  listings, two source descriptions, and the SAQ/LEQ formats.
- **AP Central course page:** says course content has not changed. The SAQ and LEQ updates take effect with the
  May 2027 exam.
- **Unit weighting:** Unit 1, The Global Tapestry, 8–10% of the exam, about 10–13 class periods. Unit 2, Networks of
  Exchange, 8–10%, about 10–13 class periods.

**How the text was captured.** The proxy blocked a direct download (HTTP 403), so the PDF could not be run through
pdftotext locally. All wording below was read from the official PDF through a web-fetch tool. That tool returns at
most about 125 characters per quotation. Statements longer than that were rebuilt from overlapping verbatim
beginning, middle, and ending excerpts and are marked **[joined]**. The PDF's text layer drops spaces between
words, so spacing has been restored. Nothing on this page comes from a secondary source. Before printing anything
for students, spot-check the **[joined]** lines against the PDF: Unit 1 topic pages are about pp. 39–46, and the
Unit 2 topic pages end on p. 63.

**Learning objective letters restart in each unit.** Unit 1 runs A–N and Unit 2 runs A–L, so "LO J" means different
things in each unit. In data and UI, write the unit with the letter: `U1-J`, `U2-J`.

**Thematic focus labels.** These are printed beside each learning objective. Topic pages spell two of them
differently from the framework ("Economics Systems," "Humans and the Environments"). The codes are the same, and the
atlas stores codes only.

---

## Unit 1: The Global Tapestry

### 1.1 Developments in East Asia from c. 1200 to c. 1450
- **Thematic focus:** GOV (LO A), CDI (LO B), ECN (LO C)
- **U1-A:** "Explain the systems of government employed by Chinese dynasties and how they developed over time."
  - KC-3.2.I.A: "Empires and states in Afro-Eurasia and the Americas demonstrated continuity, innovation, and diversity in the 13th century. This included the Song Dynasty of China, which utilized traditional methods of Confucianism and an imperial bureaucracy to maintain and justify its rule." **[joined]**
- **U1-B:** "Explain the effects of Chinese cultural traditions on East Asia over time."
  - KC-3.1.III.D.i: "Chinese cultural traditions continued, and they influenced neighboring regions."
  - KC-3.1.III.D.ii: "Buddhism and its core beliefs continued to shape societies in Asia and included a variety of branches, schools, and practices."
- **U1-C:** "Explain the effects of innovation on the Chinese economy over time."
  - KC-3.3.III.A.i: "The economy of Song China became increasingly commercialized while continuing to depend on free peasant and artisanal labor."
  - KC-3.1.I.D: "The economy of Song China flourished as a result of increased productive capacity, expanding trade networks, and innovations in agriculture and manufacturing." **[joined]**
- **Illustrative examples:**
  - *Cultural traditions:* Filial piety in East Asia; Influence of Neo-Confucianism and Buddhism in East Asia; Confucian traditions of both respect for and expected deference from women; Chinese literary and scholarly traditions and their spread to Heian Japan and Korea
  - *Branches of Buddhism:* Theravada; Mahayana; Tibetan
  - *Technological innovations:* Champa rice; Transportation innovations, like the Grand Canal expansion; Steel and iron production; Textiles and porcelains for export
- **Use on the Africa map:** Do not tag African records with this topic. Song and Ming China are comparison points for
  1.7 and appear only as the external node `pl-ext-china`.

### 1.2 Developments in Dar al-Islam from c. 1200 to c. 1450
- **Thematic focus:** CDI (LO D), GOV (LO E), TEC (LO F)
- **U1-D:** "Explain how systems of belief and their practices affected society in the period from c. 1200 to c. 1450."
  - KC-3.1.III.D.iii: "Islam, Judaism, Christianity, and the core beliefs and practices of these religions continued to shape societies in Africa and Asia." **[joined]**
- **U1-E:** "Explain the causes and effects of the rise of Islamic states over time."
  - KC-3.2.I: "As the Abbasid Caliphate fragmented, new Islamic political entities emerged, most of which were dominated by Turkic peoples. These states demonstrated continuity, innovation, and diversity." **[joined]**
  - KC-3.1.III.A: "Muslim rule continued to expand to many parts of Afro-Eurasia due to military expansion, and Islam subsequently expanded through the activities of merchants, missionaries, and Sufis." **[joined]**
- **U1-F:** "Explain the effects of intellectual innovation in Dar al-Islam."
  - KC-3.2.II.A.i: "Muslim states and empires encouraged significant intellectual innovations and transfers."
- **Illustrative examples:**
  - *New Islamic political entities:* Seljuk Empire; Mamluk sultanate of Egypt; Delhi sultanates
  - *Innovations:* Advances in mathematics (Nasir al-Din al-Tusi); Advances in literature ('A'ishah al-Ba'uniyyah); Advances in medicine
  - *Transfers:* Preservation and commentaries on Greek moral and natural philosophy; House of Wisdom in Abbasid Bagdad [sic, CED spelling]; Scholarly and cultural transfers in Muslim and Christian Spain
- **Use on the Africa map:** This is the main religion topic. The CED statement that Islam, Judaism, and Christianity
  "continued to shape societies in Africa" (KC-3.1.III.D.iii) is filed here, not under 1.5. Tag 1.2 on every
  religion profile for Islam, Christianity, or Judaism in Africa, including Ethiopian and Nubian Christianity and the
  Beta Israel. Tag it on every diffusion whose `agent` is merchants, scholars and clerics, or Sufis
  (KC-3.1.III.A). Also tag the Mamluk sultanate. Show KC-3.1.III.A's sequence, rule first and then conversion
  through merchants, missionaries, and Sufis, as two separate mechanisms.

### 1.3 Developments in South and Southeast Asia from c. 1200 to c. 1450
- **Thematic focus:** CDI (LO G), GOV (LO H)
- **U1-G:** "Explain how the various belief systems and practices of South and Southeast Asia affected society over time."
  - KC-3.1.III.D.iv: "Hinduism, Islam, and Buddhism, and their core beliefs and practices, continued to shape societies in South and Southeast Asia."
- **U1-H:** "Explain how and why various states of South and Southeast Asia developed and maintained power over time."
  - KC-3.2.I.B.i: "State formation and development demonstrated continuity, innovation, and diversity, including the new Hindu and Buddhist states that emerged in South and Southeast Asia." **[joined]**
- **Illustrative examples:**
  - *Beliefs and practices:* Bhakti movement; Sufism; Buddhist monasticism
  - *Hindu/Buddhist states:* Vijayanagara Empire; Srivijaya Empire; Rajput kingdoms; Khmer Empire; Majapahit; Sukhothai kingdom; Sinhala dynasties
- **Use on the Africa map:** Do not tag African records with this topic. The CED's only example of Sufism is filed
  here as a South Asian practice, but Sufis in Africa belong under 1.2 (KC-3.1.III.A). Gujarat links to 2.3.

### 1.4 State Building in the Americas
- **Thematic focus:** GOV (LO I)
- **U1-I:** "Explain how and why states in the Americas developed and changed over time."
  - KC-3.2.I.D.i: "In the Americas, as in Afro-Eurasia, state systems demonstrated continuity, innovation, and diversity, and expanded in scope and reach." **[joined]**
- **Illustrative examples:** *State systems in the Americas:* Maya city-states; Mexica; Inca; Chaco; Mesa Verde; Cahokia
- **Use on the Africa map:** Do not tag African records with this topic. Its only use here is as a 1.7 comparison,
  for example Great Zimbabwe with Cahokia.

### 1.5 State Building in Africa
- **Thematic focus:** GOV (LO J). In the Unit at a Glance table, the reasoning process is Continuity and Change.
- **U1-J:** "Explain how and why states in Africa developed and changed over time."
  - KC-3.2.I.D.ii: "In Africa, as in Eurasia and the Americas, state systems demonstrated continuity, innovation, and diversity and expanded in scope and reach." **[joined]**
- **Illustrative examples:** *State systems in Africa:* Great Zimbabwe; Ethiopia; Hausa kingdoms
- **Use on the Africa map:** Tag 1.5 on every African polity record. Feature the three CED examples. The topic is
  framed as continuity, innovation, and diversity, so the map should show different state forms side by side:
  stone-built Great Zimbabwe, Christian Ethiopia, and the Hausa city-states. It should not rank them. The topic is
  about governance, so religion profiles get 1.2 and polity records get 1.5.

### 1.6 Developments in Europe from c. 1200 to c. 1450
- **Thematic focus:** CDI (LO K), GOV (LO L), SIO (LO M)
- **U1-K:** "Explain how the beliefs and practices of the predominant religions in Europe affected European society."
  - KC-3.1.III.D.v: "Christianity, Judaism, Islam, and the core beliefs and practices of these religions continued to shape societies in Europe."
- **U1-L:** "Explain the causes and consequences of political decentralization in Europe from c. 1200 to c. 1450."
  - KC-3.2.I.B.ii: "Europe was politically fragmented and characterized by decentralized monarchies, feudalism, and the manorial system."
- **U1-M:** "Explain the effects of agriculture on social organization in Europe from c. 1200 to c. 1450."
  - KC-3.3.III.C: "Europe was largely an agricultural society dependent on free and coerced labor, including serfdom."
- **Illustrative examples:** none printed.
- **Use on the Africa map:** Do not tag African records with this topic. Christian Iberia and the Italian city-states
  appear as external nodes (`pl-ext-iberia-christian`, `pl-ext-italy`). Their Mediterranean links are covered by 1.2
  (transfers in Spain) and 2.6 (plague).

### 1.7 Comparison in the Period from c. 1200 to c. 1450
- **Thematic focus:** none printed.
- **U1-N:** "Explain the similarities and differences in the processes of state formation from c. 1200 to c. 1450."
- **Review: Unit 1 Key Concepts:**
  - KC-3.2: "State formation and development demonstrated continuity, innovation, and diversity in various regions."
  - KC-3.2.I, KC-3.2.I.A, KC-3.2.I.B.i, KC-3.2.I.D.i, KC-3.2.I.D.ii (wording as given above)
- **Illustrative examples:** none printed.
- **Use on the Africa map:** Tag 1.7 only on records that set up a comparison of state formation. Two examples are
  Mali and the Hausa states, and Great Zimbabwe and Ethiopia. Its main job is to be the hook for later cross-module
  comparisons, so a comparison view is better than a tag on every polity.

---

## Unit 2: Networks of Exchange

### 2.1 The Silk Roads
- **Thematic focus:** ECN (LO A)
- **U2-A:** "Explain the causes and effects of growth of networks of exchange after 1200."
  - KC-3.1.I.A.i: "Improved commercial practices led to an increased volume of trade and expanded the geographical range of existing trade routes—including the Silk Roads—promoting the growth of powerful new trading cities." **[joined]**
  - KC-3.1.I.C.i: "The growth of interregional trade in luxury goods was encouraged by innovations in previously existing transportation and commercial technologies, including the caravanserai, forms of credit, and the development of money economies." **[joined]**
  - KC-3.3.I.B: "Demand for luxury goods increased in Afro-Eurasia. Chinese, Persian, and Indian artisans and merchants expanded their production of textiles and porcelains for export; manufacture of iron and steel expanded in China." **[joined]**
- **Illustrative examples:**
  - *Trading cities:* Kashgar; Samarkand
  - *New forms of credit and money economies:* Bills of exchange; Banking houses; Use of paper money
- **Use on the Africa map:** Do not tag African records with this topic. Saharan credit and caravan practices go
  under 2.4, which is where the CED puts the trans-Saharan case.

### 2.2 The Mongol Empire and the Making of the Modern World
- **Thematic focus:** GOV (LO B), ECN (LO C), CDI (LO D)
- **U2-B:** "Explain the process of state building and decline in Eurasia over time."
  - KC-3.2.I.B.iii: "Empires collapsed in different regions of the world and in some areas were replaced by new imperial states, including the Mongol khanates." **[joined]**
- **U2-C:** "Explain how the expansion of empires influenced trade and communication over time."
  - KC-3.1.I.E.i: "The expansion of empires—including the Mongols—facilitated Afro-Eurasian trade and communication as new people were drawn into their conquerors' economies and trade networks." **[joined]**
- **U2-D:** "Explain the significance of the Mongol Empire in larger patterns of continuity and change."
  - KC-3.2.II.A.ii: "Interregional contacts and conflicts between states and empires, including the Mongols, encouraged significant technological and cultural transfers." **[joined]**
- **Illustrative examples:** *Technological and cultural transfers:* Transfer of Greco-Islamic medical knowledge to western Europe; Transfer of numbering systems to Europe; Adoption of Uyghur script
- **Use on the Africa map:** Tag sparingly. It applies only to records about Mamluk Egypt's conflict and contact with
  the Ilkhanate, or about scholars and refugees who moved to Cairo after 1258. U2-C has the same wording as U2-I in
  2.4, which is the CED's way of pairing the Mongols with Mali.

### 2.3 Exchange in the Indian Ocean
- **Thematic focus:** ECN (LO E), CDI (LO F), ENV (LO G)
- **U2-E:** "Explain the causes of the growth of networks of exchange after 1200."
  - KC-3.1.I.A.ii: "Improved transportation technologies and commercial practices led to an increased volume of trade and expanded the geographical range of existing trade routes, including the Indian Ocean, promoting the growth of powerful new trading cities." **[joined]**
  - KC-3.1.I.C.ii: "The growth of interregional trade in luxury goods was encouraged by significant innovations in previously existing transportation and commercial technologies, including the use of the compass, the astrolabe, and larger ship designs." **[joined]**
  - KC-3.1.I.A.iii: "The Indian Ocean trading network fostered the growth of states."
- **U2-F:** "Explain the effects of the growth of networks of exchange after 1200."
  - KC-3.1.III.B: "In key places along important trade routes, merchants set up diasporic communities where they introduced their own cultural traditions into the indigenous cultures and, in turn, indigenous cultures influenced merchant cultures." **[joined]**
  - KC-3.2.II.A.iii: "Interregional contacts and conflicts between states and empires encouraged significant technological and cultural transfers, including during Chinese maritime activity led by Ming Admiral Zheng He." **[joined]**
- **U2-G:** "Explain the role of environmental factors in the development of networks of exchange in the period from c. 1200 to c. 1450."
  - KC-3.1.II.A.i: "The expansion and intensification of long distance trade routes often depended on environmental knowledge, including advanced knowledge of the monsoon winds." **[joined]**
- **Illustrative examples:**
  - *Growth of states:* City-states of the Swahili Coast; Gujarat; Sultanate of Malacca
  - *Diasporic communities:* Arab and Persian communities in East Africa; Chinese merchant communities in Southeast Asia; Malay communities in the Indian Ocean basin
- **Use on the Africa map:** Tag 2.3 on every Swahili-coast record and on diffusions into it from Hadramawt, Yemen,
  Oman, the Persian Gulf, and Gujarat. KC-3.1.III.B is the two-way model the atlas is built on: merchants bring
  their own traditions and local cultures change the merchants in turn. The map should draw both directions. That
  means Swahili language and coastal Islam shown as a local form, not as Arab culture transplanted.

### 2.4 Trans-Saharan Trade Routes
- **Thematic focus:** TEC (LO H), GOV (LO I)
- **U2-H:** "Explain the causes and effects of the growth of trans-Saharan trade."
  - KC-3.1.II.A.ii: "The growth of interregional trade was encouraged by innovations in existing transportation technologies."
  - KC-3.1.I.A.iv: "Improved transportation technologies and commercial practices led to an increased volume of trade and expanded the geographical range of existing trade routes, including the trans-Saharan trade network." **[joined]**
- **U2-I:** "Explain how the expansion of empires influenced trade and communication over time."
  - KC-3.1.I.E.ii: "The expansion of empires—including Mali in West Africa—facilitated Afro-Eurasian trade and communication as new people were drawn into the economies and trade networks." **[joined]**
- **Illustrative examples:** *Technologies encouraging interregional trade:* Camel saddle; Caravans
- **Use on the Africa map:** Tag 2.4 on every Saharan route segment and terminus (Sijilmasa, Walata, Timbuktu, Gao,
  Agadez, the routes to Kanem and Bornu) and on Mali. Under KC-3.1.I.E.ii, the CED's point about Mali is that the
  empire pulled new people into the network. The map should show which peoples were drawn in, and when.

### 2.5 Cultural Consequences of Connectivity
- **Thematic focus:** CDI (LO J)
- **U2-J:** "Explain the intellectual and cultural effects of the various networks of exchange in Afro-Eurasia from c. 1200 to c. 1450."
  - KC-3.1.III.D: "Increased cross-cultural interactions resulted in the diffusion of literary, artistic, and cultural traditions, as well as scientific and technological innovations." **[joined]**
  - KC-3.3.II: "The fate of cities varied greatly, with periods of significant decline and periods of increased urbanization, buoyed by rising productivity and expanding trade networks." **[joined]**
  - KC-3.1.III.C: "As exchange networks intensified, an increasing number of travelers within Afro-Eurasia wrote about their travels."
- **Illustrative examples:**
  - *Diffusion of cultural traditions:* The influence of Buddhism in East Asia; The spread of Hinduism and Buddhism into Southeast Asia; The spread of Islam in sub-Saharan Africa and Asia
  - *Diffusion of scientific or technological innovations:* Gunpowder from China; Paper from China
  - *Travelers:* Ibn Battuta; Margery Kempe; Marco Polo
- **Use on the Africa map:** Tag 2.5 on every diffusion record. "The spread of Islam in sub-Saharan Africa" is the
  CED example closest to the atlas's core subject. Ibn Battuta should be a source and traveler layer, with his route
  through the Maghreb, Egypt, the Swahili coast (1331), and Mali (1352–53) and the places he wrote about. KC-3.3.II
  supports showing city growth and decline over time, for example Timbuktu, Djenne, Kilwa, and Cairo after the
  plague.

### 2.6 Environmental Consequences of Connectivity
- **Thematic focus:** ENV (LO K)
- **U2-K:** "Explain the environmental effects of the various networks of exchange in Afro-Eurasia from c. 1200 to c. 1450."
  - KC-3.1.IV: "There was continued diffusion of crops and pathogens, with epidemic diseases, including the bubonic plague, along trade routes." **[joined]**
- **Illustrative examples:** *Diffusion of crops:* Bananas in Africa; New rice varieties in East Asia; Spread of citrus in the Mediterranean
- **Use on the Africa map:** Tag 2.6 on the crop and disease lenses. Bananas in Africa should get one record. Its date
  needs care, because banana cultivation in Africa is generally dated well before 1200, so show it as an ongoing
  diffusion and say so in `detail`. The Black Death in Egypt and the Maghreb (1347–49) also gets a record.

### 2.7 Comparison of Economic Exchange
- **Thematic focus:** none printed.
- **U2-L:** "Explain the similarities and differences among the various networks of exchange in the period from c. 1200 to c. 1450."
- **Review: Unit 2 Key Concepts:**
  - KC-3.1: "A deepening and widening of networks of human interaction within and across regions contributed to cultural, technological, and biological diffusion within and between various societies." **[joined]**
  - KC-3.1.I.A.i; KC-3.1.I.C.i; KC-3.3.I.B (wording as in 2.1)
  - KC-3.3: "Changes in trade networks resulted from and stimulated increasing productive capacity, with important implications for social and gender structures and environmental processes." **[joined]**
- **Illustrative examples:** none printed.
- **Use on the Africa map:** Use 2.7 for a comparison view that sets the trans-Saharan, Indian Ocean, and Silk Roads
  networks side by side, not as a tag on single records. KC-3.1 is the atlas's thesis statement in CED language.

---

## Africa module checklist

These are all the African places, people, practices, and developments that the CED names in Units 1–2, illustrative
examples included. "Dataset" lists the matching registry ids from `data/research/africa/_registry.yaml`. The
research team should confirm each item has a record.

| # | CED item (exact) | Where | Dataset check |
|---|---|---|---|
| 1 | Islam, Judaism, Christianity ... "continued to shape societies in Africa" | 1.2, KC-3.1.III.D.iii | Religion profiles for all three. Judaism: `pl-beta-israel` plus North African Jewish communities. Christianity: Ethiopia (`pl-zagwe`, `pl-ethiopia-solomonic`, `pl-lalibela`), Nubia (`pl-makuria`, `pl-alodia`), Coptic Egypt (`pl-cairo`, `pl-alexandria`). |
| 2 | Muslim rule expanding "due to military expansion" | 1.2, KC-3.1.III.A | Conquest-led diffusions. North African dynasties (`pl-almohads`, `pl-marinids`); Mamluk pressure on Makuria. |
| 3 | Islam spreading "through the activities of merchants, missionaries, and Sufis" | 1.2, KC-3.1.III.A | `agent` values for merchants, scholars and clerics, and Sufis are used across the wsahel, csahel, swahili, and nile-horn files. |
| 4 | Mamluk sultanate of Egypt | 1.2 example | `pl-mamluks`, `pl-cairo` |
| 5 | Muslim states encouraging "intellectual innovations and transfers" | 1.2, KC-3.2.II.A.i | Scholarship and learning records (Cairo, Fez, Timbuktu). The CED names none of these cities, so tag them under the KC. |
| 6 | Scholarly and cultural transfers in Muslim and Christian Spain | 1.2 example | External `pl-ext-al-andalus`, `pl-ext-iberia-christian`, with links to the Maghreb (`pl-fez`, `pl-tlemcen`, `pl-tunis`) |
| 7 | State systems in Africa ("continuity, innovation, and diversity") | 1.5, KC-3.2.I.D.ii | All polity records |
| 8 | Great Zimbabwe | 1.5 example | `pl-great-zimbabwe` |
| 9 | Ethiopia | 1.5 example | `pl-zagwe`, `pl-ethiopia-solomonic` (the CED names no dynasty) |
| 10 | Hausa kingdoms | 1.5 example | `pl-hausa-states`, `pl-kano`, `pl-katsina` |
| 11 | Indian Ocean trade routes and "powerful new trading cities" | 2.3, KC-3.1.I.A.ii | Swahili city records |
| 12 | The Indian Ocean network "fostered the growth of states" | 2.3, KC-3.1.I.A.iii | Swahili polities. Great Zimbabwe as the interior partner. |
| 13 | City-states of the Swahili Coast | 2.3 example | `pl-kilwa`, `pl-mogadishu`, `pl-mombasa`, `pl-malindi`, `pl-zanzibar`, `pl-pate`, `pl-lamu`, `pl-sofala`, `pl-gedi` |
| 14 | Arab and Persian communities in East Africa | 2.3 example | Diffusions from `pl-ext-hadramawt`, `pl-ext-yemen`, `pl-ext-oman`, `pl-ext-persian-gulf` to the coast |
| 15 | Two-way influence between merchants and local cultures (diasporic communities) | 2.3, KC-3.1.III.B | Return-direction diffusions, coast to merchants. Check that at least some exist. |
| 16 | Monsoon winds | 2.3, KC-3.1.II.A.i | Environment or technology lens record for the Swahili coast |
| 17 | Compass, astrolabe, larger ship designs | 2.3, KC-3.1.I.C.ii | Technology lens. The CED does not tie these to Africa, so tag under the KC only. |
| 18 | Zheng He's maritime activity | 2.3, KC-3.2.II.A.iii | `pl-ext-china`. The CED does not say his fleets reached East Africa, so any Malindi or Mogadishu record needs its own sources. |
| 19 | Gujarat (trade partner) | 2.3 example | `pl-ext-gujarat` |
| 20 | Malay communities in the Indian Ocean basin | 2.3 example | No African place is named. Madagascar is the obvious candidate but is not in the registry. Its Austronesian settlement predates 1200, so leave it out unless the team decides it adds something. |
| 21 | Trans-Saharan trade network | 2.4, KC-3.1.I.A.iv | Route records: `pl-sijilmasa`, `pl-walata`, `pl-timbuktu`, `pl-gao`, `pl-agadez`, routes to `pl-kanem` and `pl-bornu` |
| 22 | Camel saddle | 2.4 example | Technology lens record |
| 23 | Caravans | 2.4 example | Technology or economic lens record. Also a diffusion `agent`. |
| 24 | Mali in West Africa: empire expansion drawing in "new people" | 2.4, KC-3.1.I.E.ii | `pl-mali`, `pl-niani`, plus records for the peoples Mali drew in |
| 25 | The spread of Islam in sub-Saharan Africa | 2.5 example | Islam diffusion records across wsahel, csahel, swahili, and nile-horn (Ifat, Adal, Zeila) |
| 26 | Ibn Battuta | 2.5 example | Person or source record and a route layer through the Maghreb, Egypt, the Swahili coast, and Mali |
| 27 | Travelers who "wrote about their travels" | 2.5, KC-3.1.III.C | Source records tagged `regional-outsider`. The CED names only Ibn Battuta for Africa. |
| 28 | Paper from China | 2.5 example | The CED names no African point. Paper reached Egypt and the Maghreb before 1200, so treat it as background, not a 1200–1450 diffusion. |
| 29 | Cities' fates and urbanization | 2.5, KC-3.3.II | City-over-time records. The CED names no African city. |
| 30 | Bananas in Africa | 2.6 example | Crop lens record. Flag the dating, which is earlier than 1200. |
| 31 | Bubonic plague along trade routes | 2.6, KC-3.1.IV | Disease lens record for Egypt and the Maghreb, 1347–49. The CED states this generally and the Africa application is ours. |

**Not named by the CED in Units 1–2.** These items are often assumed to be "AP content" but do not appear in the
Unit 1–2 text: Mansa Musa, Sundiata, Timbuktu, Djenne, Kilwa, Mogadishu, Lalibela, the Solomonic dynasty, Nubia
and Makuria, Coptic Christianity, Kanem-Bornu, Ife, Benin, Kongo, gold, salt, and griots. They can still go on the
map, and many are needed to make the CED statements concrete, but the CED does not name them. The Songhai appear
only in Unit 4 (Topic 4.5, in the context of the Moroccan conflict), which is outside this period.

---

## Terminology: syncretism, diffusion, cultural diffusion

- **"Syncretism"** does not appear in any part of the CED that could be searched (the front matter, the course
  framework, and Units 1–4).
- **"Syncretic"** appears once, in Unit 3, not in Units 1–2: KC-4.1.VI refers to "the development of syncretic
  belief systems and practices" in the Unit 3 review (Topic 3.4). The CED does not use the word for 1200–1450. If
  the atlas says "syncretism" about this period, that is its own term and not a CED term. This matters because the
  atlas's `relation` vocabulary already uses neutral terms.
- **"Diffusion"** is a core Unit 2 term:
  - KC-3.1 (the overarching Unit 2 concept, reviewed in 2.7): "cultural, technological, and biological diffusion"
  - KC-3.1.III.D (2.5): "the diffusion of literary, artistic, and cultural traditions"
  - KC-3.1.IV (2.6): "continued diffusion of crops and pathogens"
  - Illustrative example headings: "Diffusion of cultural traditions" and "Diffusion of scientific or technological
    innovations" (2.5), and "Diffusion of crops" (2.6).
  - "Spread" is used for the same thing in examples: "The spread of Islam in sub-Saharan Africa and Asia" and "The
    spread of Hinduism and Buddhism into Southeast Asia" (2.5).
- **"Cultural diffusion"** as an exact phrase does not appear. The closest wording is in KC-3.1 ("cultural,
  technological, and biological diffusion") and the 2.5 heading "Diffusion of cultural traditions." Calling the
  atlas a map of "cultural diffusion" is a fair label taken from KC-3.1, but it should not be quoted as CED wording.
- **Religion in Unit 1:** the CED describes religion as something that "continued to shape societies"
  (KC-3.1.III.D.i–v), not as something that spread. Spread language belongs to Unit 2. The atlas can use the same
  split: Unit 1 framing for religion profiles of people, and Unit 2 framing for diffusion events.

---

## CED themes and the InSPECT letters

The CED has six course themes. Each maps one-to-one to a letter in the teacher's InSPECT scheme, with no gaps and no
overlaps.

| CED theme (framework heading) | Code | InSPECT letter |
|---|---|---|
| Theme 1: Humans and the Environment | ENV | **In**: Interaction with Environment |
| Theme 5: Social Interactions and Organization | SIO | **S**: Social |
| Theme 3: Governance | GOV | **P**: Political |
| Theme 4: Economic Systems | ECN | **E**: Economic |
| Theme 2: Cultural Developments and Interactions | CDI | **C**: Cultural |
| Theme 6: Technology and Innovation | TEC | **T**: Technological |

Notes:
- Store the CED codes in the data and show the InSPECT letters in the UI. The codes are what AP materials use.
- Thematic focus across Units 1–2: GOV 8 LOs, CDI 7, ECN 4, ENV 2, TEC 2, SIO 1. SIO appears only in 1.6 (Europe)
  and is never attached to an African topic. The atlas's social-stratum design ("color people, not states") still
  supports SIO, but that link is the atlas's own reading and does not come from the CED.
- GOV covers more than "Political." The CED theme statement begins "A variety of internal and external factors
  contribute to state formation, expansion, and decline." The Mali and Mongol expansion statements (U2-I and U2-C)
  are filed under GOV and ECN even though they are about trade.

---

## Check of `data/taxonomy.yaml` → `ap_topics`

| Key | Current title | CED title | Status |
|---|---|---|---|
| 1.2 | Developments in Dar al-Islam | Developments in Dar al-Islam from c. 1200 to c. 1450 | **Correct it.** The date range is missing. |
| 1.5 | State Building in Africa | State Building in Africa | OK |
| 1.7 | Comparison in the Period from c. 1200 to c. 1450 | same | OK |
| 2.3 | Exchange in the Indian Ocean | same | OK |
| 2.4 | Trans-Saharan Trade Routes | same | OK |
| 2.5 | Cultural Consequences of Connectivity | same | OK |
| 2.6 | Environmental Consequences of Connectivity | same | OK |
| 2.7 | Comparison of Economic Exchange | same | OK |

**Additions.** The Africa module does not need any new topic. The eight topics above cover every African item the
CED names. Two changes are recommended:
1. **Add 2.2** (The Mongol Empire and the Making of the Modern World) for the few records about Mamluk Egypt and
   Mongol contact, and so 2.2 and 2.4 can be compared side by side as the CED pairs them.
2. **Add the remaining six topics to the world-general taxonomy now**, because `tools/validate.py` rejects any tag not
   in the list and later modules will need them:
   `1.1 Developments in East Asia from c. 1200 to c. 1450`, `1.3 Developments in South and Southeast Asia from c. 1200 to c. 1450`,
   `1.4 State Building in the Americas`, `1.6 Developments in Europe from c. 1200 to c. 1450`,
   `2.1 The Silk Roads`, `2.2 The Mongol Empire and the Making of the Modern World`.

**Fix to the research brief.** `docs/research-brief.md`, under "AP alignment," gives Mansa Musa, Kilwa, and Timbuktu
as examples of "things the AP course names." The Unit 1–2 CED text does not name them. It names Mali, Ibn Battuta,
Great Zimbabwe, Ethiopia, the Hausa kingdoms, the city-states of the Swahili Coast, Sufis, and the spread of Islam in
sub-Saharan Africa. Reword the line to "things the AP course names, or common teaching examples of them," or swap
in the checklist above.
