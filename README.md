# We The Folks – take-home (SF-FE-01-BAM)

Two rich media ads built from the provided designs and assets, with plain HTML, CSS and JavaScript (ES modules) and GSAP.

| Folder                     | What it is                              | Status |
| -------------------------- | --------------------------------------- | ------ |
| [`variant-a/`](variant-a/) | **Gut Run**: mobile tap-to-jump game ad | Done   |
| [`variant-b/`](variant-b/) | **Fireplace**: three-part desktop skin  | Done   |

Design decisions are in [DECISIONS.md](DECISIONS.md).

## Run it locally

```bash
cd variant-a   # or variant-b
npx serve
```

Open the URL it prints (usually http://localhost:3000). A local server is needed because the code uses ES modules. Any static server works, e.g. `python -m http.server`.

**Variant A:** the game is the start page. Useful URL flags:

- `?debug=1` draws the hitboxes (player green, obstacles red) and the playfield limits (yellow).
- `?overlay=1` lays `design/01-start.png` over the start screen at 50% opacity to check alignment.

**Variant B:** open `/preview` for the whole fireplace, or `/left`, `/top`, `/right` for one part on its own.

- `/preview?overlay=1` lays `design/layout.png` over the build at 50% opacity. Use `/preview`, not `/preview.html`: `serve` redirects `.html` URLs and drops the query string.
- The fireplace is 1680 CSS px wide, like the real format. On a smaller screen, zoom the browser out (Cmd/Ctrl + minus).

To test reduced motion without changing system settings: DevTools → Ctrl+Shift+P → "Emulate CSS prefers-reduced-motion: reduce", then reload.

## Variant A: Gut Run

### What is implemented

- **Start screen** with the logo bar, headline and the tutorial hand, an intro animation, and a looping "tap" hint. The first tap starts the run.
- **Get ready:** after the first tap the player glides to the middle of the playfield before physics starts.
- **Gameplay:** the player stays on a fixed x; a tap sets an upward speed, gravity pulls it down. The gut and the obstacles scroll from right to left. All 15 obstacles (`bac1`–`bac6`, `txt1`–`txt9`) appear exactly once, in a hand-made level whose gaps narrow from 150 px to 115 px.
- **Fair collision:** the player is three circles and each bacterium a chain of circles, all measured as the largest circles that fit inside the art; words are their rectangle shrunk by 2 px. Leaving the playfield is measured from the cloud border in the player's column.
- **Fail endcard** with an animated entrance, the CTA and a replay button. Replay resets data and state only; the game loop runs once from page load, so there is no second loop, leftover timer or doubled sound.
- **Win endcard** with confetti bursting from the party hat, a landing and hopping poo, the CTA, cheer and applause.
- **Sound:** background music loop, crash on hit, fail and win sounds, all after the first tap. A mute toggle sits in the logo bar.
- **Pause** of the game and the sound while the tab is hidden, and a clean resume.
- **Clickout** through `window.clickTag`, falling back to `https://example.com/landing`.
- **Viewport:** the 360×640 stage scales to any phone between 320×568 and 430×932 without distortion, following toolbar changes (`dvh` + `ResizeObserver`).
- **Loading screen** (CSS spinner) until the images are ready, so the first frames never show an unscaled stage.
- **`prefers-reduced-motion`:** decorative animations jump to their final state; the game itself still moves.

### Weight

The shipped ad (everything in `variant-a/` except `design/`, which is only used by the `?overlay=1` check) is **2.02 MB**, under the 3 MB limit. I did not compress the assets yet; see [DECISIONS.md](DECISIONS.md).

### Known issues and shortcuts

- **Background texture:** `bg_texture.png` does not reproduce the denser pattern in the design at any position (a single copy covers about 36% of it). It is drawn once, moved down 21.5 px so it reaches the bottom border. A fuller texture asset would fix this.
- **Asset scales vs. the design:** on the start screen some obstacles, and both endcard headlines, are drawn at a slightly different size in the design than their 2x assets. I kept the README rule (every asset at 50%), so these are a few pixels bigger than in the screenshots.
- **First obstacles:** the two columns shown on the design start screen keep their arrangement but start 200 px further right, so they don't sit on the player at the start. After about 1.5 s of play the screen shows them exactly as in the design.
- **"tab to run":** the typo is part of `gesture.png`, so it stays (the `alt` text says "Tap to run").
- **Pause when not visible** covers a hidden tab (`visibilitychange`), not an ad scrolled out of view inside a page.
- **iOS:** Safari ignores `audio.volume`, so sounds play at full volume there (mute still works, it uses `muted`). Tested in desktop Edge/Chromium with device emulation and Playwright; not yet on a physical iPhone.
- **Mute icon:** no icon was provided, so it is a small inline SVG.

### Next steps with more time

- Pause also when the ad is scrolled out of view (`IntersectionObserver`).
- Wait up to 2 s for the music before showing the start screen, for slow mobile networks.
- Switch audio to the Web Audio API for instant start and a gapless music loop.
- Test on physical iOS and Android devices.
- More animation during the game itself. A tap-to-jump mini game in an ad most likely speaks to a younger, casual audience, and small playful details hold their attention: bacteria that wiggle as they scroll in, a squash-and-stretch on the poo when it jumps and lands, a short shake and a few particles on a crash. All of it would respect `prefers-reduced-motion`.

## Variant B: Fireplace

### What is implemented

- **Three separate ads:** `left.html` and `right.html` (320×975) and `top.html` (1032×250), each a fixed-size stage with the 2x assets drawn at 50%, sharing `css/fireplace.css` and `js/part.js`.
- **Preview page** (`preview.html`) with the three parts in iframes at their fireplace positions (0, 324 and 1360 px, 4 px gaps) and an empty middle for the website, plus a `?overlay=1` design overlay at 50% opacity.
- **Pixel-accurate layout:** logo, panel, copy and CTA are placed from measurements against `layout.png`, not by eye.
- **Continuous moss background** cut from `bg-big.jpg`; the seams line up at rest and during every zoom.
- **Intro (5 s), the same in all parts:** the background zooms as one surface around the centre of the whole fireplace; the logos fade and scale in; the product settles into place and eases to a stop; the panel and copy reveal; the top headline builds line by line; the CTA pops in last.
- **Calm idle motion:** a very slow background "breath" (3%) and a gentle CTA pulse every few seconds. Everything stops at rest after 30 s.
- **Synced start** across the three documents via `postMessage`; a part on its own starts immediately.
- **Clickout** anywhere on a part (or the CTA button, also from the keyboard) through `window.clickTag`, falling back to `https://example.com/landing`.
- **Animation:** only `transform` and `opacity` are animated. `prefers-reduced-motion` shows the final state with no motion.

### Weight

The shipped ad (everything in `variant-b/` except `design/`, which is only used by the `?overlay=1` check, and `source/`, the input for the crop script) is **1.31 MB**, under the 3 MB limit; one part is about 430 KB. The only compression is the background crops, re-saved as JPEG quality 80 by `tools/crop_backgrounds.py`.

### Known issues and shortcuts

- **Background vs. the design:** the design was built from the pre-cut `bg.jpg` files, but I used `bg-big.jpg` for a continuous background (see DECISIONS). The same photo is framed differently in `bg-big.jpg`: the product packs are larger and higher than in `layout.png`, and the stone in the top banner is cut by its top edge.
- **Top headline text:** `top/hl.png` says "STARK BEI / HUSTENREIZ & / HALSSCHMERZEN.", the design says "NATÜRLICH STARK / BEI HUSTENREIZ & / HALSSCHMERZEN.". I used the asset as delivered.
- **No product asset:** the pack is part of the background photo, so it cannot slide in from outside. It "settles" instead (a clipped copy of the background shrinks onto the original).
- **Sync fallback:** a part that gets no start message (for example on a publisher page) starts on its own 1.5 s after loading. In the preview, a part that loads more than 1.5 s after the others would start out of sync.
- **Keyboard:** the top banner has no CTA button, so it is clickable with the mouse only.
- **Browsers:** tested in desktop Chromium, WebKit and Firefox with Playwright, and by hand in Safari.

### Next steps with more time

- Ask for a product cut-out (PNG with transparency) for a real slide-in, and for a `bg-big.jpg` that matches the design framing.
- Start the intro when the fireplace becomes visible (`IntersectionObserver`), not only on load.
- Make the preview reply to each "ready" message, so a part can wait longer for the sync without delaying ads that run on their own.
- Compress further if needed: WebP backgrounds and a palette version of `top/hl.png` (195 KB, mostly a soft shadow).

## How I used AI

I used **Claude Code** (in VS Code) as a pair programmer in both variants: to plan the work in small steps, to explain browser APIs I was less sure about, to measure the assets with small Python scripts, and to run Playwright checks after each step. It also helped me write this README and DECISIONS.md: it drafted the text from our decisions and measurements, and I reviewed and corrected it.

**Variant A:** it explained canvas buffer size vs. CSS size, GSAP timelines and `visibilitychange`. The positions and hitboxes come from Python scripts it wrote that match each asset against the design PNGs pixel by pixel. I typed most of the code myself from its step-by-step instructions; its Playwright checks covered screenshots, edge pixels, timings and a frame-by-frame simulation that proves the level can be finished.

**Variant B:** it also wrote most of the code into the files after explaining every line to me; I reviewed each step and decided on the approach. I used it mostly for planning, measuring and testing:

- **Planning:** before writing any code, we planned the steps and the approach: which background to use, how to animate a product that is part of the photo, and how to start three separate documents together.
- **Measuring:** Python scripts fitted the backgrounds into `layout.png` (scale and offset of each part), placed the CTA, checked that the logo and copy layers sit at (0, 0), found the corners of the product packs for the clip polygons, the panel band and the headline line boundaries, and checked that the cut backgrounds line up at the seams.
- **Testing:** Playwright scripts compared screenshots with the design and with `bg-big.jpg` and reported in numbers how well they match: the seams during the zoom and the idle motion, the product copy covering the original in every frame (no uncovered pixels), the end state against the static layout, the start time of the three parts (under 1 ms apart), no active animations after 30 s, and reduced motion.

### Where it was wrong and I corrected it

**Variant A**

- **The hairline gap.** I saw a 1 px gap around the scaled stage; it first said this came from the DevTools frame, not the page. I set the page background to red and the gap was still there. Measuring then showed two real causes (a stage that is not exactly 9:16, and `top: 50%` landing on half pixels), which I fixed by filling the screen when the leftover is under 2 px and by snapping the stage position to physical pixels.
- **The tap hint after replay.** Its first version paused the looping hint _before_ finishing the intro. GSAP then recorded the hand's scale at that moment (0) as the loop's start, so after a replay the hand pulsed between 6% and 34%. Fixed by swapping the order and giving the loop explicit start values (`fromTo`).
- **The jump.** The suggested jump speed made the very first tap hit the ceiling, because the player starts only 34 px below it. That is why the "get ready" glide exists and the jump was retuned.
**Variant B**

- **The zoom around the fireplace centre.** The first plan scaled each part's background around the centre of the whole fireplace, but with crops exactly the size of each part this would show empty strips on the inner edges at the start of the zoom. Working out which part of `bg-big.jpg` each part shows at scale 1.08 showed that every crop needs 40 px more towards the centre, so I re-cut them with that margin.
- **The idle "breath" broke the seams.** Watching the preview, I noticed that after the intro the background scaled around a different point and the parts stopped lining up. Its seam check against `bg-big.jpg` confirmed it in numbers. The cause: the first version set the zoom centre inside the intro's `gsap.from()`, and a `from()` tween also returns `transformOrigin` to its original value when it ends, so after the intro each part scaled around its own centre. The centre is now set once with `gsap.set()`.
