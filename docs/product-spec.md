# Diffusion Atlas: product spec (Africa 1200–1450 module)

Author: Wil Cosgrove (AP World History, Walt Whitman HS). This spec is the source of truth for what the app does.
If the code and this spec disagree, the spec wins until Wil changes it.

## 1. Purpose

Students watch culture, religion first, move across West, North, and East Africa from 1200 to 1450. They should
leave able to say **how** it moved (mechanism, carriers), **what happened** when it arrived (outcome), **who**
practiced it (court, town, countryside), and **how we know** (whose sources say so).

This is a map of cultural diffusion, not of trade routes. Trade appears only as the carrier of ideas and as an
optional background layer that is off by default.

The same app will later host Asia, the Middle East, and Europe modules. Nothing in the code may assume Africa,
Islam, or this date range. A module is a data file plus a frame (bounds, years).

## 2. Users and settings

| User | Where | Needs |
|---|---|---|
| Wil, teaching | Classroom projector, laptop | Big type, keyboard control, keyframe stepping, teacher detail on demand |
| Students | MCPS Chromebooks (Chrome, WebGL, ~4 GB RAM, school network) | Fast load, clear legend, readable cards, works without accounts |
| Students at home | Any browser, phones | Same, responsive down to 360 px |

Hosting: GitHub Pages (static). No backend, no login, no analytics, no external calls except map assets the app
itself ships. MCPS filters may block third-party tile servers, so **everything is self-hosted in the repo**.

## 3. The core design rule: color people, not states

A place does not have "a religion." Each place has religion profiles per stratum (court, urban, rural, plus named
minority communities) per time span. The map must make it impossible to read "Mali = Muslim."

### 3.1 What the religion lens draws, for the year on the slider

| Element | Shows | Encoding |
|---|---|---|
| Polygon fill (polities, peoples) | **rural** stratum, the majority | color of the dominant tradition; relation as pattern (3.2) |
| Inner ring inside the polygon edge | **court** stratum | color of the court's dominant tradition; pattern for relation; omitted if identical to the fill |
| City marker | **urban** stratum | small donut: one segment per tradition sized by share (dominant 3, significant 2, minority 1, trace 0.5); ring pattern for relation |
| Community badge on a city | each **community** profile | small pill next to the city, colored by tradition, labeled with community_name on hover |
| Polygon with rural relation `undocumented` | **no evidence** | light gray crosshatch with the label "No direct evidence" in the legend. Absence is shown, never filled with a guess. |
| Place with no profile covering the year | no record | outline only, no fill |

Profile lookup: for place P, stratum S, year Y, use the profile whose span satisfies `start <= Y < end`
(`end: null` means open-ended). The data has no overlapping spans per (place, stratum, community); a test enforces it.

### 3.2 Relation encoding (the teaching variable)

Every relation needs a pattern as well as color, because color alone fails color-blind students and projectors.

| relation | Pattern | Student label |
|---|---|---|
| exclusive | solid | "One tradition" |
| plural | base color with dots of the second | "Both, for different purposes" |
| syncretic | interleaved diagonal stripes of both | "Blended together" |
| coexisting | split fill, half and half along a vertical line (or two-tone marker) | "Side by side, separate communities" |
| contested | sawtooth or dashed border in the second color | "In conflict" |
| undocumented | gray crosshatch | "No direct evidence" |

### 3.3 How sure are we

- `confidence` drives opacity: high 1.0, medium 0.75, low 0.5.
- `basis: inferred` adds a fine dotted border; `basis: projected` adds the dotted border and a small "later evidence"
  chip in the card. The legend explains both in one line each.
- Polities have **soft borders** (blurred or feathered edges), never crisp lines. Pre-modern borders were zones.

### 3.4 Colors

Tradition-level colors, consistent across every future module. Branches are shades of their tradition.
Starting palette (must be verified for color-vision deficiency and for contrast on both light and dark bases with the
`dataviz` skill's validator; adjust shades, keep hue families):

| tradition | hue family | notes |
|---|---|---|
| islam | green | Sunni schools as shades; sufi overlay as a thin outline accent |
| christianity | purple | Ethiopian, Coptic/Nubian, Latin-African, Latin, Eastern Orthodox as distinct shades |
| judaism | gold | |
| indigenous (local family) | terracotta / earth | one hue family; local_form text, not color, names the practice |
| buddhism, hinduism, confucianism, daoism, shinto, zoroastrianism, manichaeism, jainism | reserved | assign now in the palette file so later modules stay consistent |

Colors live in one file (`app/src/theme/palette.ts`) keyed by taxonomy values. No hex codes anywhere else.

## 4. Diffusion arrows

Each diffusion record draws a curved arc from each `from` place to the `to` place while the slider year is inside
its span. On entering the span the arc animates once (a dash travels from origin to destination), then stays visible.

| Property | Encoding |
|---|---|
| lens | arc color (lens colors from the palette, distinct from tradition colors) |
| mechanism | line style: relocation solid, hierarchical long dash, contagious dotted, stimulus double line, imposed thick with chevrons |
| outcome | end glyph at the destination: adoption filled circle, elite-only crown-like small triangle, syncretism half-filled circle, coexistence two small circles, resistance bar, withheld bar with gap, no-uptake hollow circle, loss x, impact starburst, undocumented question mark |
| confidence | opacity, as above |

Arcs to or from `external` places run to the frame edge with the external place named in a small edge label
(e.g. "to the Hijaz").

Clicking an arc opens the diffusion card (section 6). The legend shows mechanism and outcome definitions in student
language, taken from taxonomy.yaml.

## 5. Time

- Slider 1200–1450, year steps. Shows the year large.
- **Keyframes** (events with `keyframe: true`): ticks on the slider; "next/previous keyframe" buttons and keyboard
  (arrow keys step a year, Shift+arrow steps keyframes, Space plays).
- Play: 5 years per second by default, pausing 3 seconds at each keyframe with its card open.
- Region filter for keyframes: West, Central Sahel and forest, North, Nile and Horn, Swahili coast, or All.
  (There are 25 keyframes; one region at a time keeps a class period manageable.)
- Events (all, not only keyframes) appear as small markers during a short window around their year (default ±5).
- Exemplars appear from their span start. `on_slider: false` exemplars never appear on the map by year; they are
  reachable from their place's card ("Later evidence") and from source cards.

## 6. Cards (click anything)

Every card has a student view (summary fields) and a teacher view (detail fields), toggled by a teacher switch that
is hidden unless the URL has `?teacher=1`. Student view is the default.

- **Place card**: name and alt names; at the current year, a three-row table (court, urban, rural) plus communities,
  each row showing traditions, relation label, local_form, and confidence/basis chips; a mini timeline of how each
  stratum changed across 1200–1450; the Polity Profile snapshot nearest the year (Wil's seven axes, codes with
  plain-English labels); events and exemplars at this place; "Historians disagree" debates linked to it; sources.
- **Diffusion card**: what moved, from, to, when; mechanism and outcome with the taxonomy's definition and the
  "why this code" test that decided it; carriers; summary; sources.
- **Exemplar card**: name, image if the record has an approved image (see 9), dates (founding vs. fabric_date),
  summary, lenses, sources.
- **Event card**: year, title, summary, linked place, lenses, sources; for keyframes this is the narrative card.
- **Debate card**: question, positions with who holds them. No answer given.
- **Source card**: citation, type, voice, verification; for primary sources the HAPP fields
  (historical situation, audience, purpose, point of view). If the source title contains outdated language
  (e.g. "Pagan," "Arab City"), show the title as published with a one-line note that the term is the author's.

Text rendering: show summaries exactly as in the data. Never generate or paraphrase history text in the app.

## 7. Lenses

Tabs: Religion (default), Language, Architecture, Knowledge, Social, Art & music, Technology, Population, Governance,
Economy. Each lens tab carries its InSPECT letter chip (CDI, SIO, ENV, TEC, GOV, ECN).

- Religion lens: everything in section 3 plus religion arcs.
- Any other lens: polygons drop to a neutral fill (still showing names and soft borders); only that lens's arcs,
  exemplars, and events show. A small note says how many records the lens has, so thin lenses are honest about it.

## 8. The historiography control ("Whose sources?")

A panel with four checkboxes for source voice groups, all on by default:

1. Insiders (people of the place: griot recordings, Timbuktu chronicles, Ethiopian chronicles, inscriptions, coins)
2. Regional outsiders (e.g. Cairo or Moroccan writers on Mali)
3. Distant outsiders
4. Modern scholars (from the region / international, as two sub-checkboxes)

A record "survives" the filter if at least one of its evidence sources has a checked voice. Records that do not
survive fade to 15% opacity and their arcs hide. A counter shows "Showing N of M records."

Teaching use: uncheck everything but regional outsiders and Mali looks like a Muslim court seen from Cairo; uncheck
everything but insiders and the picture changes. This is the pod source-analysis lesson as a toggle.

## 9. Images

Only public-domain or CC-licensed images (Wikimedia Commons), each with author, license, and link stored in an
`images.yaml` the app reads. No image ships without a license line. Exemplars without an approved image show an icon.
Image curation is a separate, later task (see build plan); the app must work with zero images.

## 10. Modes

- **Explore** (default): everything above.
- **Present** (`P` key or button): hides chrome, enlarges type 1.5x, slider and keyframe controls along the bottom,
  cards as large overlays. Tested at 1280x720 projected.
- **Compare**: split view, same map at two years (default 1250 and 1400) with linked pan/zoom, OR two place cards
  side by side. Supports Wil's cross-continental comparison method once more modules exist.

## 11. AP alignment

Every card shows its AP topic chips (e.g. 1.2, 2.4) with titles on hover, from taxonomy.yaml.
A filter "Show only records tagged with topic ..." exists in teacher mode.
Note for teacher view: the CED files religion in Africa under 1.2, not 1.5 (docs/ap-ced-alignment.md).

## 12. Accessibility and performance

- Keyboard reachable: slider, lenses, cards, legend. Focus visible. Cards are dialogs with ARIA labels.
- Never color alone: every color encoding has a pattern, glyph, or text twin.
- Text at least 16 px in cards; summaries are short by design.
- First load under 3 seconds on a Chromebook on school Wi-Fi: total transferred under 5 MB without images;
  data JSON gzipped; no map tiles, vector base drawn from our own GeoJSON.
- Works offline after first load (service worker caching the app shell and data) is a nice-to-have, phase 4.

## 13. Out of scope

Accounts, saving student work in the app, editing data in the browser, trade-route analytics, any text generation.
