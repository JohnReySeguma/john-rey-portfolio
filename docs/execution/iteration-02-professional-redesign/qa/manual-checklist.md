# Iteration 02 — Manual click-through (browser)

Run the app yourself and confirm each step. ~5 minutes.

**Start:** `npm run build` then `npm run preview` → open the printed URL
(e.g. `http://127.0.0.1:4173/john-rey-portfolio/`). Keep DevTools Console open.

| # | Section | Do this | Expect |
|---|---------|---------|--------|
| 1 | Global | Look at the page background and scroll top to bottom | White/neutral surface, no starfield, no side rail, no space wording. ("Mission Harvest Robotics Competition" is a real competition name and stays.) |
| 2 | Hero | Read the top of the page | Photo, `John Rey Seguma`, `Junior Software Developer`, 2-sentence intro, `View Work` + `Contact` buttons, 4 social icons. No counters, no typing animation. |
| 3 | Hero | Click `View Work`; scroll back up, `Tab` to `Contact` and press `Enter` | Page scrolls to Selected Work / Get in Touch. |
| 4 | Work | Look at the six projects | ResilientLink, Smart Online Parking System, Hotel Management System are full-width feature rows; the other three are half-width cards below. Not a uniform 6-box grid. |
| 5 | Work | Click `View details` on ResilientLink; press `Enter` on another one | A panel opens with the screenshot, full description, stack chips and `View repository`. Click the repo link → GitHub opens in a **new tab**. |
| 6 | Skills | Click `Mobile`, then `Languages & Backend` | Tile grid changes to 2 tiles, then 6. `All` shows 26. |
| 7 | Skills | `Tab` onto the active category, then press `→` / `Home` | Selection moves category by category; `Home` returns to `All`. (On a phone, swipe the category strip sideways to reach `Tooling`.) |
| 8 | Experience | Click `View highlights`; on the second role press `Space`, then `Enter` | Highlights list expands/collapses. Dates read `08/2025 – Present`, badges `Full-Time` / `Internship`. |
| 9 | Recognition | Check the heading and the 9 cards | Nav says `Recognition`, heading `Tech Events & Awards`, nowhere says "Academic". Every card shows its photo. |
| 10 | Recognition | Click the *Best Student Research* card | Overlay opens on `1 / 3`; `Next image` steps to `2 / 3`, `3 / 3` and wraps. Scrolling the wheel does **not** move the page behind. |
| 11 | Recognition | Press `Esc` | Overlay closes and the focus ring is back on the card you opened. Close `×` works too. |
| 12 | Recognition | Open *Kabataan Inyovator 2019* | Shows the event photo plus a visible **Watch on Facebook** link → opens `facebook.com/share/v/19N5bPPYJk/` in a new tab. No blank box, no error frame. |
| 13 | Recognition | Open the *National Robotics* and *Robo Fest* cards | Each steps through `1 / 2` → `2 / 2`. |
| 14 | Education | Hover a card, then `Tab` onto it | A blue rule appears on the left edge on both hover and keyboard focus. Education sits directly above Contact. |
| 15 | Contact | Press `Compose email` with the form empty | Three red messages appear (name, email, message). |
| 16 | Contact | Type `not-an-email` in Email and submit | "Please enter a valid email address…" appears. Email/phone links are clickable. |
| 17 | Nav | Click each of the 7 nav entries | Each scrolls to its section and the entry highlights while that section is in view. |
| 18 | Mobile | Resize to 375 px, reload, open the hamburger | All 7 entries fit on screen; picking one scrolls there and closes the menu. |
| 19 | Responsive | Check 375 / 768 / 1024 / 1440 px | No horizontal scrollbar, no cut-off text. |
| 20 | Console | Look at DevTools Console after all of the above | No red errors, no warnings. |

Asset serving (index HTML, JS/CSS bundles, all 46 images) is covered by
`smoke.postman_collection.json` — import it with `smoke.postman_environment.json`,
set `baseUrl` to your preview origin, and run.
