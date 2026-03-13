# MountainEyes — Creative Feature Ideas

Generated for: mountaineyes.kr
Stack: React + Vite + Cloudflare Workers
Audience: Korean hikers, mountaineers, nature lovers, global webcam watchers

---

## Feature Ideas

### 1. Sunrise / Sunset Countdown Timer
**Description:** Show a live countdown to today's sunrise or sunset for the currently selected mountain, calculated from its GPS coordinates.
**Difficulty:** Easy
**Impact:** High
*Hikers plan ascents around golden hour — this turns the site into a mission-critical planning tool.*

---

### 2. Weather Trend Sparkline
**Description:** Display a 6-hour mini sparkline of temperature and wind behind the current weather badge, so users can tell if conditions are improving or worsening at a glance.
**Difficulty:** Medium
**Impact:** High
*Complements the existing weather display without adding visual clutter.*

---

### 3. "Best View Right Now" Auto-Ranker
**Description:** Automatically surface the feed with the clearest visibility (using a simple brightness/contrast heuristic from the stream thumbnail) and badge it as "Best View Now."
**Difficulty:** Hard
**Impact:** High
*Saves users from manually scanning 14+ feeds; rewards spontaneous discovery.*

---

### 4. Fog / Cloud Cover Indicator
**Description:** Derive a simple fog probability from humidity + temperature dew-point delta from the existing weather API and show a "foggy / clear / partly cloudy" badge on each card.
**Difficulty:** Easy
**Impact:** Medium
*Answers the most common hiker question: "Can I actually see anything from the summit?"*

---

### 5. Hiker's Moon Phase Widget
**Description:** Show the current moon phase and illumination percentage as a small widget — relevant for night hikers and astrophotographers who plan trips around full moons.
**Difficulty:** Easy
**Impact:** Medium
*Zero API cost (calculated client-side); delightful for the right audience.*

---

### 6. Screenshot Gallery / Wall of Moments
**Description:** Let users submit their screen-captures (already a built-in feature) to a public gallery wall, voted up with a single click — no login required (fingerprint by IP + timestamp).
**Difficulty:** Medium
**Impact:** High
*Converts a passive viewer feature into a lightweight community one.*

---

### 7. Seasonal Color Tracker
**Description:** Display a foliage / snow / bloom status badge per mountain (manually curated or crowd-sourced from community reports) that updates weekly through the seasons.
**Difficulty:** Easy
**Impact:** High
*Korean hikers travel specifically for autumn foliage (단풍) and spring cherry blossoms — this is a high-traffic search intent.*

---

### 8. "I'm Hiking This Mountain Today" Check-In
**Description:** A single-tap anonymous check-in that shows a small crowd counter ("3 people are hiking here today") — stored ephemerally, reset at midnight.
**Difficulty:** Easy
**Impact:** Medium
*Adds social warmth and real-time human presence without requiring accounts.*

---

### 9. Mountain Trivia Cards
**Description:** On feed load, flash a single interesting fact about the mountain (elevation, notable peak, first recorded ascent, local legend) as a dismissible toast.
**Difficulty:** Easy
**Impact:** Medium
*Educational, increases time-on-page, easy to localize for KO/EN.*

---

### 10. Ambient Sound Mode
**Description:** Let users toggle on a curated ambient audio track (wind, forest, stream) matched to the mountain's character while watching the feed — no microphone required on the CCTV end.
**Difficulty:** Easy
**Impact:** High
*Transforms the site into an immersive experience for remote workers and meditation users.*

---

### 11. Trail Condition Report (Community)
**Description:** A simple 3-option report button on each feed card: "Trail Open / Icy / Closed" — aggregated into a badge visible to all visitors for 24 hours.
**Difficulty:** Medium
**Impact:** High
*Safety-critical information hikers currently have to find across fragmented forums.*

---

### 12. Time-Lapse Replay Button
**Description:** Cache one screenshot every 10 minutes per feed on the server and offer a "Today's time-lapse" button that plays them back as a fast GIF or sequence.
**Difficulty:** Hard
**Impact:** High
*Turns yesterday's storm or this morning's sunrise fog into shareable content.*

---

### 13. Constellation / Star Map Easter Egg (Night Mode)
**Description:** Between 10pm–4am, when a mountain feed goes black/dark, replace the dead-air screen with an interactive star map for that mountain's sky coordinates.
**Difficulty:** Medium
**Impact:** Medium
*Turns offline feeds from a negative (offline dot) into a delightful discovery.*

---

### 14. Keyboard Shortcut Layer
**Description:** Add vim-style shortcuts: `j/k` to cycle mountains, `p` to pin, `s` to screenshot, `?` to show the shortcut map — for power users who keep the tab open all day.
**Difficulty:** Easy
**Impact:** Medium
*Zero visual footprint; beloved by the enthusiast audience who live in browser tabs.*

---

### 15. "Mountain of the Week" Spotlight
**Description:** Editorially curate one mountain per week with a short 3-sentence story, a best-time-to-visit note, and a highlight clip — shown as a banner above the feed grid.
**Difficulty:** Easy
**Impact:** Medium
*Gives return visitors a reason to check back; doubles as SEO content.*

---

### 16. Wind Speed Beaufort Scale Visualizer
**Description:** Convert raw wind speed (already fetched) into a Beaufort description ("Gentle Breeze," "Near Gale") with an animated line-art visualization of tree movement intensity.
**Difficulty:** Easy
**Impact:** Medium
*Makes raw meteorological data immediately legible to non-technical hikers.*

---

### 17. Adaptive Dark / Dawn / Day / Dusk Theme
**Description:** Automatically shift the site's color temperature and UI tone based on the local time at the selected mountain — warm amber at dawn, bright midday, deep blue at night.
**Difficulty:** Medium
**Impact:** High
*Creates a visceral sense of "being there" that no other webcam aggregator offers.*

---

### 18. Feed Health History Graph
**Description:** Show a 24-hour uptime sparkline per feed so users know if a camera has been flaky all day or just had a brief drop — replaces the single dot with richer signal.
**Difficulty:** Medium
**Impact:** Medium
*Reduces frustration when feeds are down; turns a negative into informative context.*

---

### 19. Hiking Route Quick-Link
**Description:** Add a single button per mountain that deep-links to that mountain's official trail map on Naver Maps or KakaoMap — keeping the user's flow in place.
**Difficulty:** Easy
**Impact:** High
*Completes the "planning" use case: see the view, then find the trail. Zero maintenance overhead.*

---

### 20. "Witnessed Something Beautiful" Button
**Description:** A single soft-glow button (a stylized star or leaf) users can press when they catch something special on a feed. The count accumulates publicly per mountain per day: "47 beautiful moments today."
**Difficulty:** Easy
**Impact:** High
*Pure delight mechanic, zero friction, transforms passive watching into collective appreciation — perfectly aligned with the spirit of a passion project.*

---

## Priority Matrix

| # | Feature | Difficulty | Impact |
|---|---------|-----------|--------|
| 1 | Sunrise/Sunset Countdown | Easy | High |
| 7 | Seasonal Color Tracker | Easy | High |
| 10 | Ambient Sound Mode | Easy | High |
| 19 | Hiking Route Quick-Link | Easy | High |
| 20 | "Witnessed Something Beautiful" Button | Easy | High |
| 17 | Adaptive Dawn/Day/Dusk Theme | Medium | High |
| 6 | Screenshot Gallery / Wall of Moments | Medium | High |
| 11 | Trail Condition Report | Medium | High |
| 12 | Time-Lapse Replay | Hard | High |
| 3 | "Best View Right Now" Auto-Ranker | Hard | High |
| 4 | Fog / Cloud Cover Indicator | Easy | Medium |
| 5 | Moon Phase Widget | Easy | Medium |
| 8 | Hiking Check-In Counter | Easy | Medium |
| 9 | Mountain Trivia Cards | Easy | Medium |
| 14 | Keyboard Shortcut Layer | Easy | Medium |
| 15 | Mountain of the Week Spotlight | Easy | Medium |
| 16 | Beaufort Wind Visualizer | Easy | Medium |
| 2 | Weather Trend Sparkline | Medium | High |
| 13 | Star Map Easter Egg | Medium | Medium |
| 18 | Feed Health History Graph | Medium | Medium |

---

*Generated 2026-03-13. Ideas are implementation-agnostic and assume the current React + Cloudflare Workers stack.*

---

## Round 2 Ideas

### 21. Cherry Blossom & First-Snow Alert
**Category:** Seasonal / Event-Driven
**Description:** Pull KMA (Korea Meteorological Administration) bloom and snowfall forecast data for each mountain region. During the cherry-blossom window (late March – mid April) and at the season's first snowfall, show a site-wide "First Snow" or "Blooms Now" banner and send a one-time push notification to subscribed users.
**Difficulty:** Medium
**Impact:** High
*Cherry blossom tourism (벚꽃) and first-snow hunting are the two biggest annual peak-traffic events for Korean outdoor sites. Being first to notify turns MountainEyes into a seasonally essential bookmark.*

---

### 22. Mountain Passport — Stamp Collection
**Category:** Gamification
**Description:** Every mountain has a unique ink-stamp design (inspired by the Korean 산림청 mountain stamp passport). When a user loads a camera feed and watches for at least 30 seconds, they "collect" that mountain's stamp into a locally-stored passport booklet. A "Complete Your Collection" nudge appears when they have 10 of 14 stamps.
**Difficulty:** Medium
**Impact:** High
*Korea already has a thriving physical passport-stamp culture for mountains (100대 명산). A digital parallel taps existing habit; stamps are stored in localStorage — no account needed.*

---

### 23. Daily Streak & Dawn Patrol Badge
**Category:** Gamification
**Description:** Track consecutive days a user has visited the site before 7 am (using localStorage timestamps). At day 7, award a "Dawn Patrol" badge; at day 30, a "Mountain Ghost" badge. The current streak counter appears as a tiny flame icon in the top-right corner.
**Difficulty:** Easy
**Impact:** Medium
*Streak mechanics are the lightest retention tool available. Dawn-patrol culture is deeply embedded in Korean hiking communities — naming the badge after it makes it feel native.*

---

### 24. Color-Blind Friendly Mode
**Category:** Accessibility
**Description:** Add a toggle in Settings for three palette modes: Deuteranopia (red-green), Tritanopia (blue-yellow), and High Contrast (WCAG AAA). All status badges, weather indicators, and fog overlays switch to perceptually safe palettes when the mode is active. Persist preference in localStorage.
**Difficulty:** Easy
**Impact:** Medium
*Approximately 5–8% of male users have color vision deficiency. Status badges (green = online, red = offline) are the primary UI element; this fix directly removes a barrier for that audience.*

---

### 25. Screen-Reader Landmark Overhaul
**Category:** Accessibility
**Description:** Audit and retrofit the feed grid with proper ARIA landmarks (`role="region"`, `aria-label="[Mountain name] live camera"`), live region announcements for feed status changes (`aria-live="polite"`), and descriptive alt text on every thumbnail that includes mountain name, approximate visibility, and timestamp.
**Difficulty:** Medium
**Impact:** Medium
*Webcam sites are almost universally inaccessible to blind users, who use them via screen readers to listen to ambient weather audio piped through extensions. This opens an underserved niche.*

---

### 26. Edge-Cached Stream Thumbnails (Performance)
**Category:** Performance / Technical
**Description:** Use a Cloudflare Worker scheduled cron to fetch and cache one JPEG thumbnail per feed every 60 seconds to Cloudflare R2. The page loads the cached image instantly and only falls back to the live stream on click. Eliminates the current "grey box while stream loads" first-paint problem.
**Difficulty:** Medium
**Impact:** High
*First contentful paint on live video grids is notoriously slow. Serving static JPEGs from the edge makes the page feel instantaneous and improves Core Web Vitals for SEO.*

---

### 27. Korea Forest Service (산림청) Trail Status Integration
**Category:** Content Partnership / Data Integration
**Description:** Ingest the Korea Forest Service's open API for national park trail open/close status and surface it directly on each mountain card. A "Trail Closed" banner auto-appears when the official status is closed — replacing the community-reported version with authoritative data.
**Difficulty:** Medium
**Impact:** High
*The KFS and national park authorities publish real-time closure data (for fire season, weather events, restricted zones). Integrating it makes MountainEyes the single authoritative source rather than a secondary one.*

---

### 28. Air Quality (미세먼지) Overlay
**Category:** Content Partnership / Data Integration
**Description:** Pull PM2.5 and PM10 readings from AirKorea (에어코리아) for the district nearest each mountain and display a color-coded AQI ring around the camera thumbnail. Hovering expands to show "Visibility Impact: Moderate — dust may obscure ridgeline."
**Difficulty:** Easy
**Impact:** High
*Fine dust is the single biggest visibility killer in Korean mountains and a daily concern for millions of hikers. It is conspicuously absent from the current weather data shown, making this a glaring gap to fill.*

---

### 29. Progressive Web App (PWA) — Install & Offline Shell
**Category:** Mobile-Specific
**Description:** Add a `manifest.json` with mountain-themed icons, a Service Worker that caches the app shell and the last-fetched thumbnail set, and an "Add to Home Screen" prompt triggered after a second visit. Offline state shows the cached thumbnails with a "Last seen" timestamp.
**Difficulty:** Medium
**Impact:** High
*Most Korean hikers browse on mobile. A PWA install converts a casual visitor into an icon on the home screen — the highest-value retention action possible without a native app. The offline shell means the app still loads in parking-lot dead zones at trailheads.*

---

### 30. Hyper-Local Push Notifications (Clear-Sky Alert)
**Category:** Mobile-Specific
**Description:** After PWA install, let users subscribe per-mountain to a "Clear Sky" alert: when a mountain's cloud cover drops below 20% and visibility is rated "clear," the Cloudflare Worker sends a Web Push notification — "Hallasan is clear right now. Go." Notifications fire at most once per 6 hours per mountain.
**Difficulty:** Hard
**Impact:** High
*The #1 reason Korean hikers miss good days is not knowing in real time. A timely push notification is a direct action trigger — it makes MountainEyes genuinely useful, not just informational.*

---

## Round 2 Priority Matrix

| # | Feature | Category | Difficulty | Impact |
|---|---------|----------|-----------|--------|
| 26 | Edge-Cached Thumbnails | Performance | Medium | High |
| 28 | Air Quality Overlay | Data Integration | Easy | High |
| 21 | Cherry Blossom / First-Snow Alert | Seasonal | Medium | High |
| 22 | Mountain Passport Stamps | Gamification | Medium | High |
| 27 | Forest Service Trail Status API | Data Integration | Medium | High |
| 29 | PWA Install & Offline Shell | Mobile | Medium | High |
| 30 | Clear-Sky Push Notifications | Mobile | Hard | High |
| 24 | Color-Blind Mode | Accessibility | Easy | Medium |
| 23 | Daily Streak & Dawn Patrol Badge | Gamification | Easy | Medium |
| 25 | Screen-Reader Landmark Overhaul | Accessibility | Medium | Medium |

---

*Round 2 added 2026-03-13. All ideas remain implementation-agnostic and assume the React + Vite + Cloudflare Workers stack.*

---

## Round 3 Ideas

### 31. Sponsor Badge Tier System
**Category:** Revenue-Free Sustainability
**Description:** Offer three visible sponsor tiers — Trail Supporter, Summit Partner, and Mountain Guardian — each displayed as a tasteful badge in the site footer and on the mountain card they choose to "adopt." Sponsors pay a flat annual fee (e.g., ₩50,000 / ₩200,000 / ₩500,000) with no ads, no tracking, and no editorial influence. A "Powered by community" page lists all sponsors with their chosen mountain.
**Difficulty:** Easy
**Impact:** High
*The Korean outdoor gear and travel industry has no clean sponsorship vehicle for niche mountain content. A badge model respects users while giving local brands (등산 용품점, regional tourism boards) direct association with a high-intent audience — without compromising the site's integrity.*

---

### 32. "Buy Me a Coffee" Integration with Mountain Goals
**Category:** Revenue-Free Sustainability
**Description:** Embed a Buy Me a Coffee (or Toss 후원) widget, framed not as a generic donation but as tangible goals: "5 coffees = one more mountain added," "20 coffees = time-lapse storage for 1 month." A live progress bar on the support page shows how close the next milestone is — making each contribution feel concrete.
**Difficulty:** Easy
**Impact:** Medium
*Passion-project audiences respond far better to goal-linked contributions than blank donate buttons. Showing exactly what their support unlocks turns one-time givers into invested stakeholders who share the project.*

---

### 33. Shared Viewing Room ("같이 보기")
**Category:** Real-Time Collaboration
**Description:** Generate a shareable room link (e.g., `mountaineyes.kr/room/abc123`) that syncs the selected mountain feed, current weather data, and a live cursor count ("4 people watching") across all connected visitors in real time via Cloudflare Durable Objects. No accounts required — join by link, leave when you close the tab.
**Difficulty:** Hard
**Impact:** High
*Remote hiking groups, friends separated by travel, and online hiking communities (산악회 카카오톡 단체방) regularly want to "watch together." A zero-friction shared room with a single link satisfies this exactly and generates organic sharing.*

---

### 34. Live Room Chat Overlay
**Category:** Real-Time Collaboration
**Description:** Within a Shared Viewing Room (idea #33), add a minimal floating chat panel — max 5 visible messages, auto-fade after 10 seconds, 140-character limit, no handles required. Messages like "구름 걷히고 있어요 🌤" or "정상 보인다!" create a shared moment without the noise of a full forum.
**Difficulty:** Medium
**Impact:** High
*Ephemeral, context-specific chat is fundamentally different from general social media. It mirrors the spontaneous conversation that happens among strangers sharing a viewpoint on a summit — transient, warm, and place-bound.*

---

### 35. AI Visibility Prediction (Next 3 Hours)
**Category:** AI-Powered
**Description:** Feed the last 6 hours of weather API readings (cloud cover, humidity, wind direction, temperature delta) into a lightweight regression model deployed as a Cloudflare Worker. Output a simple "Likely Clear / Improving / Deteriorating" badge with a confidence percentage for the next 1, 2, and 3-hour windows. Re-runs every 30 minutes.
**Difficulty:** Hard
**Impact:** High
*Weather APIs give current conditions; no existing tool gives hyper-local short-range mountain visibility forecasts. Even a 70%-accurate "improving" indicator is decision-grade information for a hiker deciding whether to drive to the trailhead.*

---

### 36. AI Best-Time-to-Visit Heatmap
**Category:** AI-Powered
**Description:** Aggregate 30+ days of historical cloud-cover and weather readings per mountain into a weekly heatmap (day × hour grid, colored by average visibility score). An AI summary sentence auto-generates per mountain: "Hallasan is clearest on Tuesday and Wednesday mornings between 7–10 am." Data refreshes weekly.
**Difficulty:** Medium
**Impact:** High
*Hikers plan trips days in advance. A data-backed "best window" recommendation derived from real local patterns is fundamentally more trustworthy than generic seasonal advice — and it becomes more accurate the longer MountainEyes runs.*

---

### 37. Real-Time Cloud Detection Badge
**Category:** AI-Powered
**Description:** Every time a new feed thumbnail is cached (see idea #26), pass it through a lightweight computer vision model (e.g., a MobileNet binary classifier fine-tuned on mountain/cloud images, running on a Cloudflare Worker with WebAssembly) that outputs a cloud-cover percentage: "12% cloud cover — summit likely visible." Display this alongside the weather API fog badge.
**Difficulty:** Hard
**Impact:** High
*Camera-derived cloud detection is more reliable than meteorological estimates for the specific camera angle. A user watching the Hallasan summit cam wants to know what is visible in that exact frame, not what the weather station 5 km away is reporting.*

---

### 38. Historical Weather Trend Charts per Mountain
**Category:** Data Visualization
**Description:** Build a dedicated "Climate" tab per mountain showing interactive line charts (using a lightweight charting library already in the stack) for: monthly average temperature, average cloud cover by hour-of-day, wind speed distribution, and rainfall days per month — derived from 12 months of stored API data. Mobile-responsive with swipeable chart panels.
**Difficulty:** Medium
**Impact:** Medium
*Trip planning across seasons requires historical context. A hiker planning a January Hallasan summit needs to understand average January cloud cover, not just today's conditions. This turns MountainEyes from a real-time tool into a year-round planning resource.*

---

### 39. Visitor Pattern Density Map
**Category:** Data Visualization
**Description:** Aggregate the anonymous check-in data (idea #8) and page-load events by mountain and hour of day into a heatmap-style density visualization on the site's "Explore" section: a stylized mountain grid where cell intensity reflects how many visitors were watching at that hour over the last 30 days. No personal data stored — only aggregate counts.
**Difficulty:** Medium
**Impact:** Medium
*"When do other hikers watch this camera?" is a proxy for peak trail traffic. A density map gives users crowd-avoidance intelligence — one of the top decision factors for Korean trail selection — without requiring integration with any third-party system.*

---

### 40. AllTrails / Komoot / Naver Map Deep-Link Cards
**Category:** Hiking App Integration
**Description:** For each mountain, surface three branded quick-link buttons beneath the camera feed: AllTrails (showing trail count and top-rated route), Komoot (activity count and GPX export hint), and 네이버 지도 (Naver Maps — the dominant Korean navigation app with mountain trail overlays). Links use pre-constructed deep-link URLs that land users directly on that mountain's page in each app. On mobile, the links attempt to open the native app before falling back to the web.
**Difficulty:** Easy
**Impact:** High
*MountainEyes already answers "what does it look like?" — these links answer "how do I get there and what trail do I take?" completing the entire pre-hike decision loop in one place. AllTrails and Komoot handle their own SEO; MountainEyes benefits from the referral relationship without any API contract.*

---

## Round 3 Priority Matrix

| # | Feature | Category | Difficulty | Impact |
|---|---------|----------|-----------|--------|
| 40 | AllTrails / Komoot / Naver Deep-Link Cards | Hiking App Integration | Easy | High |
| 31 | Sponsor Badge Tier System | Sustainability | Easy | High |
| 36 | AI Best-Time-to-Visit Heatmap | AI-Powered | Medium | High |
| 33 | Shared Viewing Room | Real-Time Collaboration | Hard | High |
| 34 | Live Room Chat Overlay | Real-Time Collaboration | Medium | High |
| 35 | AI Visibility Prediction | AI-Powered | Hard | High |
| 37 | Real-Time Cloud Detection Badge | AI-Powered | Hard | High |
| 32 | Buy Me a Coffee with Mountain Goals | Sustainability | Easy | Medium |
| 38 | Historical Weather Trend Charts | Data Visualization | Medium | Medium |
| 39 | Visitor Pattern Density Map | Data Visualization | Medium | Medium |

---

*Round 3 added 2026-03-13. All ideas remain implementation-agnostic and assume the React + Vite + Cloudflare Workers stack.*

---

## Round 4 Ideas — Community & Social

### 41. User Photo Upload Gallery per Mountain
**Category:** Community
**Description:** Let users upload their own hiking photos to a per-mountain gallery with a drag-and-drop interface. Photos are tagged with date, weather conditions at time of upload, and an optional one-line caption. Images are stored on Cloudflare R2 and moderated via a simple report-and-hide queue.
**Difficulty:** Medium
**Impact:** High
*Turns MountainEyes from a camera-only site into a living photo archive. User-contributed photos fill the gap between what fixed cameras show and what the trail actually looks like from hiking level.*

---

### 42. Mountain Condition Report Form
**Category:** Community
**Description:** A structured mini-form (takes under 15 seconds) where hikers returning from a mountain can submit: trail surface (dry / muddy / icy / snowy), crowd level (empty / moderate / packed), and one optional free-text note. Reports display as a timeline feed on each mountain's page, most recent first, expiring after 48 hours.
**Difficulty:** Medium
**Impact:** High
*Structured reports are far more useful than free-text forums. The 48-hour expiry keeps data fresh and prevents stale conditions from misleading future hikers.*

---

### 43. Trail Buddy Matching ("같이 가실 분")
**Category:** Community
**Description:** Users can post a simple "looking for hiking company" card: mountain name, date, time, and experience level (beginner / intermediate / advanced). Other users browse open cards filtered by mountain and date. Communication happens via a one-time anonymous chat link that expires after the planned hike date. No persistent accounts required — verified by phone number or KakaoTalk OAuth.
**Difficulty:** Hard
**Impact:** High
*Solo hiking is common in Korea but many hikers prefer company for safety and social reasons. Existing matching happens in scattered KakaoTalk groups with no structure — a purpose-built lightweight matcher fills a real gap.*

---

### 44. Mountain Event Calendar
**Category:** Community
**Description:** A shared calendar per mountain showing community-submitted events: group hikes, mountain marathon races, temple stays, sunrise gatherings, trail maintenance volunteer days. Events are displayed as small calendar icons on the mountain card and expandable to a full monthly view. Event creators can link to external registration pages.
**Difficulty:** Medium
**Impact:** Medium
*Korean mountains host hundreds of organized events per season. Centralizing them on MountainEyes makes the site a planning hub, not just a viewing one.*

---

### 45. Hiker Profile Cards (Anonymous or Named)
**Category:** Community
**Description:** Optional lightweight profiles stored in localStorage (or optionally synced via KakaoTalk login): a display name, favorite mountain, total mountains viewed, stamps collected, and condition reports submitted. Profile cards appear next to condition reports and photo uploads. No email required — the profile is the user's local hiking identity.
**Difficulty:** Medium
**Impact:** Medium
*Gives repeat contributors visible credit without the friction of a traditional account system. The localStorage-first approach respects privacy while still enabling community identity.*

---

### 46. "Was This Helpful?" Feedback on Condition Reports
**Category:** Community
**Description:** Each condition report has a simple thumbs-up / thumbs-down button. Reports with high positive ratios float to the top; reports with negative ratios fade in opacity. After 3 negative votes with zero positive, a report auto-hides pending review.
**Difficulty:** Easy
**Impact:** Medium
*Lightweight quality control for user-generated content. Keeps the condition report feed useful without requiring moderators to review every submission.*

---

### 47. Mountain Photo Challenge (Weekly Theme)
**Category:** Community
**Description:** Each week, a new photo theme is announced ("Golden Hour," "Wildlife Spotted," "Trail Selfie," "Fog Mood"). Users upload photos matching the theme, and the community votes with a single tap. The weekly winner's photo becomes the mountain's header image for the following week. Past winners are archived in a "Hall of Fame" page.
**Difficulty:** Medium
**Impact:** High
*Gamified photo submission drives repeat visits, generates high-quality user content, and gives the site fresh visual identity every week without editorial effort.*

---

### 48. Real-Time Visitor Chat per Mountain
**Category:** Community
**Description:** A collapsible chat sidebar on each mountain's feed page where current viewers can exchange short messages. Messages are ephemeral (stored only in memory via Cloudflare Durable Objects, no persistence beyond the session). A viewer count badge shows how many people are currently watching. Rate-limited to one message per 10 seconds to prevent spam.
**Difficulty:** Hard
**Impact:** Medium
*Different from the Shared Viewing Room (idea #33) — this is always-on for any mountain page, not link-gated. It captures the spontaneous "누가 저기 보이나요?" moments that happen when multiple strangers watch the same live feed.*

---

### 49. Community Mountain Wiki
**Category:** Community
**Description:** Each mountain gets an editable wiki-style info panel with structured sections: Overview, Access & Parking, Trail Descriptions, Water Sources, Shelter Info, and Local Tips. Edits are versioned and moderation uses a simple "flag for review" system. Content is rendered from Markdown stored in Cloudflare KV.
**Difficulty:** Medium
**Impact:** Medium
*Most Korean mountain info is scattered across blog posts, Naver Cafe threads, and government PDFs. A structured, community-maintained wiki on MountainEyes becomes a canonical reference that drives organic search traffic.*

---

### 50. Hiking Meetup Integration (산악회 Sync)
**Category:** Community
**Description:** Allow Korean hiking club (산악회) administrators to sync their group's upcoming hike schedule to MountainEyes via a simple iCal feed URL or manual entry. Club hikes appear on the mountain event calendar (idea #44) with the club's name and a join-request link. Clubs get a branded mini-page listing their upcoming and past hikes.
**Difficulty:** Medium
**Impact:** Medium
*산악회 culture is deeply embedded in Korean hiking. Giving clubs a presence on MountainEyes creates a symbiotic relationship — clubs bring members, members discover MountainEyes.*

---

### 51. Photo Spot Pins on Mini-Map
**Category:** Community
**Description:** On each mountain's page, display a small topographic mini-map with pins marking the best photo spots, as contributed by users. Each pin includes a thumbnail photo, compass direction, and a "best time" note (e.g., "sunrise facing east"). Users can suggest new pins which go through a simple community vote before appearing.
**Difficulty:** Hard
**Impact:** High
*Knowing where to stand for the best photo is insider knowledge. Crowdsourcing it onto a visual map creates a unique resource that no other Korean hiking platform offers.*

---

### 52. Seasonal Hiking Gear Checklist per Mountain
**Category:** Community
**Description:** A curated, season-aware packing checklist per mountain that adjusts based on the current month: crampons and gaiters flagged in winter for Hallasan, rain gear highlighted during monsoon season for all mountains. Users can check off items and share their list. Community members can suggest additions that are voted on.
**Difficulty:** Easy
**Impact:** Medium
*Beginner hikers frequently ask "what do I need for [mountain] in [month]?" — a dynamic checklist answers this instantly and positions MountainEyes as a full trip-planning companion.*

---

## Round 4 Priority Matrix

| # | Feature | Category | Difficulty | Impact |
|---|---------|----------|-----------|--------|
| 41 | User Photo Upload Gallery | Community | Medium | High |
| 42 | Mountain Condition Report Form | Community | Medium | High |
| 47 | Weekly Photo Challenge | Community | Medium | High |
| 51 | Photo Spot Pins on Mini-Map | Community | Hard | High |
| 43 | Trail Buddy Matching | Community | Hard | High |
| 46 | "Was This Helpful?" Feedback | Community | Easy | Medium |
| 52 | Seasonal Gear Checklist | Community | Easy | Medium |
| 44 | Mountain Event Calendar | Community | Medium | Medium |
| 45 | Hiker Profile Cards | Community | Medium | Medium |
| 49 | Community Mountain Wiki | Community | Medium | Medium |
| 50 | Hiking Meetup Integration | Community | Medium | Medium |
| 48 | Real-Time Visitor Chat | Community | Hard | Medium |

---

*Round 4 added 2026-03-13. All ideas remain implementation-agnostic and assume the React + Vite + Cloudflare Workers stack.*

---

## Round 5 Ideas — Data & Analytics

### 53. Historical Before/After Comparison Slider
**Category:** Historical Data
**Description:** Store one representative snapshot per mountain per day (selected at peak visibility time). Users can drag a slider to compare today's view with the same mountain on any past date — side by side or with an overlay wipe. Ideal for comparing seasonal changes: summer green vs. winter snow on the same summit.
**Difficulty:** Medium
**Impact:** High
*Visual comparison is far more compelling than numerical data. A single slider interaction tells the story of a mountain across seasons in a way that no chart can.*

---

### 54. Crowd Density Prediction by Day & Hour
**Category:** Predictive Analytics
**Description:** Using aggregated anonymous visit data (page views, check-ins from idea #8, and condition report crowd-level tags), build a per-mountain crowd prediction model that displays expected trail density for each hour of the upcoming 7 days. Output is a simple color-coded timeline: green (quiet), yellow (moderate), red (crowded).
**Difficulty:** Hard
**Impact:** High
*Crowd avoidance is the #1 factor in trail selection for experienced Korean hikers. A data-driven prediction based on actual patterns — not generic "weekends are busy" advice — is genuinely actionable intelligence.*

---

### 55. Weather Pattern Anomaly Detection
**Category:** Weather Analytics
**Description:** Compare the current week's weather readings against the same week in previous years (using stored historical data). When a significant anomaly is detected — unusual warmth in December, unexpected fog patterns in a typically clear season — surface a "Weather Anomaly" badge on the mountain card with a short explanation: "This week is 8°C warmer than the 3-year average for mid-December."
**Difficulty:** Medium
**Impact:** Medium
*Anomalies are precisely when hikers need to adjust their plans. A plain weather display shows current conditions; an anomaly alert tells users whether those conditions are normal or exceptional for the season.*

---

### 56. Peak Season Traffic Alert System
**Category:** Predictive Analytics
**Description:** Define peak periods per mountain based on historical traffic spikes (cherry blossom, autumn foliage, first snow, holidays). Two weeks before a predicted peak, display a banner: "Peak foliage expected Oct 15–25 for Seoraksan — expect heavy trail traffic." Include a link to the crowd prediction timeline (idea #54) so users can find the least crowded window within the peak.
**Difficulty:** Medium
**Impact:** High
*Korean hikers plan peak-season trips weeks in advance. An early alert with crowd-avoidance data is a decision-grade tool that drives return visits during the highest-traffic periods of the year.*

---

### 57. Sunrise/Sunset Quality Score
**Category:** Data Analytics
**Description:** Combine cloud cover percentage, humidity, particulate matter (PM2.5), and horizon obstruction data to calculate a daily "Sunrise Quality Score" (0–100) and "Sunset Quality Score" per mountain. Display as a colored ring around the sunrise/sunset countdown timer (idea #1). Scores above 80 get a "Golden Hour Alert" badge.
**Difficulty:** Medium
**Impact:** High
*Most sunrise chasers drive 1–3 hours to reach a summit. A quality prediction that says "today's sunrise will be spectacular (92/100)" versus "overcast, skip today (23/100)" saves wasted trips and builds deep trust in the platform.*

---

### 58. Monthly Mountain Analytics Report
**Category:** Data Visualization
**Description:** Auto-generate a shareable monthly report per mountain: total viewers, busiest day and hour, average visibility score, temperature range, notable weather events, top community photos, and condition report summary. Rendered as a single long-scroll page with charts and exportable as a PDF or shareable image card for social media.
**Difficulty:** Medium
**Impact:** Medium
*Monthly reports give the site editorial content without manual effort. They are highly shareable on social media and provide value to tourism boards, hiking clubs, and gear companies who want to understand mountain traffic patterns.*

---

### 59. Multi-Mountain Weather Comparison Table
**Category:** Data Visualization
**Description:** A dedicated comparison page where users select 2–5 mountains and see a side-by-side table of current conditions: temperature, wind, humidity, cloud cover, visibility score, AQI, and crowd level. Sortable by any column. A "Best Conditions Right Now" auto-sort button ranks all mountains by a composite score.
**Difficulty:** Easy
**Impact:** High
*Hikers who are flexible on destination ask "which mountain should I go to today?" — a comparison table answers this directly. The auto-sort feature is the logical evolution of the "Best View Right Now" ranker (idea #3) applied to all data dimensions.*

---

### 60. Visibility Score History Graph
**Category:** Data Analytics
**Description:** For each mountain, plot a 30-day rolling visibility score line chart (derived from cloud cover, AQI, humidity) with clear day/night shading. Overlay the best-visibility time slots as highlighted bands. Users can zoom into any day to see hourly breakdowns.
**Difficulty:** Medium
**Impact:** Medium
*Transforms raw weather data into a single actionable metric with historical context. A hiker planning a trip next Tuesday can check whether Tuesdays have historically been clear for that mountain.*

---

### 61. Trail Condition Trend Analysis
**Category:** Data Analytics
**Description:** Aggregate community condition reports (idea #42) over time to generate trend indicators per mountain: "Trail has been reported icy for 5 consecutive days," "Mud reports increasing — expect wet conditions," or "Dry streak: 12 days of dry-trail reports." Display as a simple trend arrow (improving / stable / deteriorating) next to the latest condition badge.
**Difficulty:** Easy
**Impact:** Medium
*A single condition report is a snapshot; a trend over multiple reports is a forecast. Trend indicators give hikers confidence that a reported condition is persistent, not a one-time outlier.*

---

### 62. Camera Uptime & Reliability Dashboard
**Category:** Operational Analytics
**Description:** A public-facing dashboard showing each camera's uptime percentage over the last 7 and 30 days, average daily online hours, and a reliability grade (A through F). Cameras with sustained outages get a "Maintenance Expected" tag. Users can subscribe to status change notifications for their favorite cameras.
**Difficulty:** Medium
**Impact:** Medium
*Transparency about camera reliability sets correct expectations and reduces frustration. Power users who plan viewing sessions around specific cameras can avoid consistently unreliable feeds.*

---

### 63. Seasonal Comparison Year-over-Year
**Category:** Historical Data
**Description:** For mountains with 2+ years of stored data, generate a year-over-year seasonal comparison: "Foliage peak arrived 6 days earlier this year than last year," "First snow was 2 weeks later than 2025." Display as a timeline overlay showing this year's seasonal milestones against previous years.
**Difficulty:** Medium
**Impact:** Medium
*Climate change is visibly shifting seasonal timing in Korean mountains. A year-over-year comparison makes MountainEyes a passive climate observation tool — valuable for hikers, researchers, and media alike.*

---

### 64. Personalized Mountain Recommendation Engine
**Category:** Predictive Analytics
**Description:** Based on a user's viewing history (stored locally), favorite mountains, preferred conditions (clear skies, snow, fog moods), and time-of-day patterns, generate a daily "Recommended for You" section showing the 3 mountains most likely to match their preferences today. Uses a simple rule-based engine, not ML.
**Difficulty:** Medium
**Impact:** High
*Personalization transforms a browse-everything grid into a curated experience. Even a rule-based engine ("you prefer clear mornings; Seoraksan is clear this morning") feels remarkably personal and drives engagement.*

---

### 65. Data Export API for Researchers
**Category:** Data Access
**Description:** Offer a public, rate-limited REST API that returns anonymized aggregate data: daily average weather per mountain, hourly visibility scores, crowd-level aggregates, and camera uptime stats. Documented with OpenAPI spec. Free for academic and non-commercial use; API key required for tracking.
**Difficulty:** Medium
**Impact:** Medium
*Korean university researchers studying climate, tourism patterns, and outdoor recreation currently lack easy access to this kind of hyper-local mountain data. An open API positions MountainEyes as a data source, not just a consumer product.*

---

## Round 5 Priority Matrix

| # | Feature | Category | Difficulty | Impact |
|---|---------|----------|-----------|--------|
| 59 | Multi-Mountain Weather Comparison | Data Visualization | Easy | High |
| 53 | Historical Before/After Slider | Historical Data | Medium | High |
| 56 | Peak Season Traffic Alert | Predictive Analytics | Medium | High |
| 57 | Sunrise/Sunset Quality Score | Data Analytics | Medium | High |
| 64 | Personalized Recommendation Engine | Predictive Analytics | Medium | High |
| 54 | Crowd Density Prediction | Predictive Analytics | Hard | High |
| 61 | Trail Condition Trend Analysis | Data Analytics | Easy | Medium |
| 55 | Weather Pattern Anomaly Detection | Weather Analytics | Medium | Medium |
| 58 | Monthly Mountain Analytics Report | Data Visualization | Medium | Medium |
| 60 | Visibility Score History Graph | Data Analytics | Medium | Medium |
| 62 | Camera Uptime Dashboard | Operational Analytics | Medium | Medium |
| 63 | Seasonal Comparison Year-over-Year | Historical Data | Medium | Medium |
| 65 | Data Export API for Researchers | Data Access | Medium | Medium |

---

*Round 5 added 2026-03-13. All ideas remain implementation-agnostic and assume the React + Vite + Cloudflare Workers stack.*

---

## Round 6 Ideas — Monetization & Partnerships

### 66. Jeju Tourism Board Official Partnership
**Category:** Tourism Partnership
**Description:** Partner with the Jeju Special Self-Governing Province tourism board (제주관광공사) to become the official live mountain view provider for Hallasan and Jeju Olle trail mountains. The partnership includes: MountainEyes branding on the tourism board's website, co-branded seasonal campaign pages (e.g., "Hallasan Winter Summit Live"), and access to the board's official trail and event data feeds. Revenue via an annual partnership fee.
**Difficulty:** Medium
**Impact:** High
*Jeju tourism is a ₩5+ trillion industry. Official endorsement from the tourism board provides credibility, traffic, and a sustainable revenue stream. The board gets a modern, real-time visualization tool they would otherwise need to build themselves.*

---

### 67. Contextual Gear Recommendations (Affiliate)
**Category:** Monetization
**Description:** Below each mountain's weather display, show 2–3 contextual gear suggestions based on current conditions: crampons when icy, rain shells when precipitation is forecast, UV protection when clear and high-altitude. Each recommendation links to a trusted Korean outdoor retailer (e.g., Montbell Korea, Black Yak, K2) via affiliate links. Clearly labeled as "Suggested Gear — affiliate link."
**Difficulty:** Easy
**Impact:** High
*Context-relevant recommendations convert 3–5x better than generic product ads. A hiker seeing "Icy conditions reported — crampons recommended" alongside a purchase link is a natural, helpful interaction rather than an intrusive ad. Transparency about affiliate links maintains trust.*

---

### 68. Guided Tour Integration Marketplace
**Category:** Partnership
**Description:** Create a "Guided Experiences" section where certified mountain guides and tour operators can list their offerings per mountain: guided sunrise hikes, photography tours, winter summit expeditions, family-friendly nature walks. Each listing includes price, date, guide credentials, and a booking link (or embedded booking form via a partner API). MountainEyes takes a flat listing fee or percentage commission.
**Difficulty:** Hard
**Impact:** High
*The Korean guided hiking market is fragmented across Naver Blog posts and KakaoTalk groups. A structured marketplace on MountainEyes — where users are already in planning mode — captures high-intent traffic at the moment of decision.*

---

### 69. Premium "Mountain Pro" Subscription
**Category:** Monetization
**Description:** A ₩4,900/month subscription unlocking: ad-free experience, 30-day time-lapse archive access (vs. 24 hours for free), sunrise/sunset quality score alerts via push notification, personalized recommendation engine, data export for personal use, and a "Pro" badge on community contributions. Free tier remains fully functional — Pro adds depth and convenience.
**Difficulty:** Medium
**Impact:** High
*A ₩4,900 price point (roughly $3.50 USD) is impulse-purchase territory for dedicated hikers. The key is that the free tier never feels crippled — Pro users get deeper data and convenience, not gated basic features.*

---

### 70. National Park Authority Data Partnership
**Category:** Tourism Partnership
**Description:** Establish a formal data-sharing agreement with Korea National Park Service (국립공원공단) to ingest real-time trail status, visitor count data from trailhead sensors, parking lot occupancy, and emergency alerts. In return, MountainEyes provides the Park Service with aggregated anonymized user interest data (which mountains are trending, peak viewing times). Revenue via data licensing or service fee.
**Difficulty:** Hard
**Impact:** High
*The Park Service operates its own monitoring systems but lacks a public-facing real-time visualization. MountainEyes becomes the consumer-facing layer for official data — a partnership model where both sides contribute unique value.*

---

### 71. Local Business Spotlight Ads
**Category:** Monetization
**Description:** Offer small, non-intrusive sponsored cards in the mountain feed for local businesses near each mountain: trailhead cafes, pension accommodations, equipment rental shops, hot spring (온천) facilities. Each card shows business name, distance from trailhead, one photo, and a map link. Maximum 1 sponsored card per mountain, clearly labeled. Sold as monthly placements to local businesses.
**Difficulty:** Easy
**Impact:** Medium
*Hyper-local ads are relevant rather than annoying. A hiker viewing Seoraksan seeing "Seorak Hot Spring — 2km from trailhead" is a genuinely useful suggestion. Local businesses get targeted exposure they cannot get on generic ad platforms.*

---

### 72. Corporate Wellness Hiking Program
**Category:** Partnership
**Description:** Package MountainEyes as a corporate wellness tool: companies subscribe to a "Team Hiking" plan where employees track mountains visited, earn collective stamps, and compete in inter-department hiking challenges. The company dashboard shows aggregate participation metrics. Priced per-seat for companies with 50+ employees.
**Difficulty:** Medium
**Impact:** Medium
*Korean corporate culture increasingly emphasizes wellness programs. Mountain hiking is already a popular team-building activity. A digital layer that gamifies and tracks participation gives HR departments a measurable wellness KPI.*

---

### 73. Photography Workshop Partnerships
**Category:** Partnership
**Description:** Partner with professional mountain photographers to offer branded "Photo Masterclass" content tied to specific mountains: "How to Photograph Hallasan's Sea of Clouds" or "Seoraksan Autumn Foliage — Lens Selection Guide." Content lives on MountainEyes as long-form articles with embedded live feeds. Photographers get exposure and a revenue share from workshop sign-ups linked from the articles.
**Difficulty:** Easy
**Impact:** Medium
*Mountain photography content has high search volume and long shelf life. Partnering with established photographers brings credibility and high-quality content without requiring an editorial team. The live feed integration makes the content uniquely interactive.*

---

### 74. Tourism Board Campaign Landing Pages
**Category:** Tourism Partnership
**Description:** Offer regional tourism boards (not just Jeju — Gangwon-do, Gyeongsang-do, etc.) custom-branded campaign landing pages powered by MountainEyes data: "Gangwon Winter Mountain Live" showing all Gangwon-do mountain feeds with weather, trail status, and event calendars. Tourism boards embed these pages on their own sites or use them for seasonal marketing campaigns. Revenue via campaign setup and monthly hosting fees.
**Difficulty:** Medium
**Impact:** High
*Tourism boards spend millions on seasonal campaign websites that go stale quickly. A live-data-powered landing page that updates itself is a compelling value proposition — and it drives traffic back to MountainEyes.*

---

### 75. Outdoor Brand Weather Sponsorship
**Category:** Monetization
**Description:** Allow outdoor brands (North Face Korea, Black Yak, Patagonia Korea) to sponsor the weather display module on specific mountains: "Weather at Hallasan — powered by Black Yak." The sponsorship is a small logo placement next to the weather badge, not a banner ad. Sold as seasonal packages (e.g., winter season sponsorship for snow-capped mountains).
**Difficulty:** Easy
**Impact:** Medium
*Weather sponsorship is a proven model in sports broadcasting. The placement is premium (every user sees weather), contextually relevant (outdoor brands + mountain weather), and non-intrusive (logo, not a banner). High perceived value for brands at a low implementation cost.*

---

### 76. Accommodation Booking Integration
**Category:** Partnership
**Description:** Partner with Korean accommodation platforms (여기어때, 야놀자) or directly with mountain-area pensions and guesthouses to show "Stay Nearby" options on each mountain page. Display 3–5 accommodation cards with price, distance from trailhead, rating, and availability for the upcoming weekend. Revenue via booking referral commission.
**Difficulty:** Medium
**Impact:** High
*Multi-day hiking trips require accommodation. Showing availability alongside live mountain conditions closes the planning loop. The referral model means no upfront cost — revenue scales with actual bookings.*

---

### 77. Annual "Mountain of the Year" Awards
**Category:** Community + Partnership
**Description:** Run an annual community vote for categories like "Most Beautiful Summit," "Best Maintained Trail," "Best Sunrise Spot," and "Hidden Gem of the Year." Voting runs for 2 weeks in December, results are announced January 1st with a dedicated awards page. Sponsors can present individual categories (e.g., "Best Sunrise — presented by Black Yak"). Winners get a badge on their mountain card for the following year.
**Difficulty:** Easy
**Impact:** Medium
*Annual events create anticipation and press coverage. Category sponsorship is a natural, non-intrusive revenue stream. The awards page becomes evergreen SEO content and a shareable social media moment.*

---

### 78. Freemium API for Travel App Developers
**Category:** Monetization
**Description:** Extend the research API (idea #65) into a commercial tier for travel app developers: real-time weather, visibility scores, crowd levels, and camera thumbnail URLs available via a paid API. Free tier allows 100 requests/day; paid tiers at ₩29,000/month (1,000 req/day) and ₩99,000/month (10,000 req/day). SDKs provided for JavaScript and Python.
**Difficulty:** Medium
**Impact:** Medium
*MountainEyes' unique data (visibility scores, crowd predictions, camera thumbnails) has commercial value for travel apps, weather services, and hiking platforms. A tiered API monetizes the data layer without affecting the consumer product.*

---

### 79. Insurance Partnership for Hiking Safety
**Category:** Partnership
**Description:** Partner with a Korean insurance provider (e.g., Samsung Fire & Marine, DB Insurance) to offer optional single-day hiking insurance directly from MountainEyes. A "Hike Safely" button on each mountain page links to a streamlined insurance purchase flow: select mountain, date, and coverage level. MountainEyes earns a referral fee per policy sold.
**Difficulty:** Medium
**Impact:** Medium
*Mountain rescue incidents in Korea have increased steadily. Single-day hiking insurance is inexpensive (₩1,000–₩5,000) but adoption is low because hikers forget or find the process cumbersome. Embedding it at the point of trip planning removes friction.*

---

## Round 6 Priority Matrix

| # | Feature | Category | Difficulty | Impact |
|---|---------|----------|-----------|--------|
| 67 | Contextual Gear Recommendations | Monetization | Easy | High |
| 66 | Jeju Tourism Board Partnership | Tourism Partnership | Medium | High |
| 69 | Premium "Mountain Pro" Subscription | Monetization | Medium | High |
| 74 | Tourism Board Campaign Pages | Tourism Partnership | Medium | High |
| 76 | Accommodation Booking Integration | Partnership | Medium | High |
| 68 | Guided Tour Integration Marketplace | Partnership | Hard | High |
| 70 | National Park Authority Data Partnership | Tourism Partnership | Hard | High |
| 71 | Local Business Spotlight Ads | Monetization | Easy | Medium |
| 75 | Outdoor Brand Weather Sponsorship | Monetization | Easy | Medium |
| 77 | Annual Mountain of the Year Awards | Community + Partnership | Easy | Medium |
| 73 | Photography Workshop Partnerships | Partnership | Easy | Medium |
| 72 | Corporate Wellness Hiking Program | Partnership | Medium | Medium |
| 78 | Freemium API for Travel Developers | Monetization | Medium | Medium |
| 79 | Insurance Partnership for Hiking Safety | Partnership | Medium | Medium |

---

*Round 6 added 2026-03-13. All ideas remain implementation-agnostic and assume the React + Vite + Cloudflare Workers stack.*
