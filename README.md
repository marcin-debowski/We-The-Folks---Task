# We The Folks – take-home (SF-FE-01-BAM)

Two rich media ads built from the provided designs and assets, with plain HTML, CSS and JavaScript (ES modules) and GSAP.

| Folder                     | What it is                              | Status      |
| -------------------------- | --------------------------------------- | ----------- |
| [`variant-a/`](variant-a/) | **Gut Run**: mobile tap-to-jump game ad | Done        |
| [`variant-b/`](variant-b/) | **Fireplace**: three-part desktop skin  | In progress |

Design decisions are in [DECISIONS.md](DECISIONS.md).

## Run it locally

```bash
cd variant-a
npx serve
```

Open the URL it prints (usually http://localhost:3000). A local server is needed because the code uses ES modules. Any static server works, e.g. `python -m http.server`.

Useful URL flags:

- `?debug=1` draws the hitboxes (player green, obstacles red) and the playfield limits (yellow).
- `?overlay=1` lays `design/01-start.png` over the start screen at 50% opacity to check alignment.

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

## How I used AI

I used **Claude Code** (in VS Code) as a pair programmer: to plan the work in small steps, to explain browser APIs I was less sure about (canvas buffer size vs. CSS size, GSAP timelines, `visibilitychange`), and to measure the assets. The positions and hitboxes come from small Python scripts it wrote that match each asset against the design PNGs pixel by pixel. I typed most of the code myself from its step-by-step instructions, and it ran Playwright checks after each step (screenshots, edge pixels, timings, a frame-by-frame simulation that proves the level can be finished).

Where it was wrong and I corrected it:

- **The hairline gap.** I saw a 1 px gap around the scaled stage; it first said this came from the DevTools frame, not the page. I set the page background to red and the gap was still there. Measuring then showed two real causes (a stage that is not exactly 9:16, and `top: 50%` landing on half pixels), which I fixed by filling the screen when the leftover is under 2 px and by snapping the stage position to physical pixels.
- **The tap hint after replay.** Its first version paused the looping hint _before_ finishing the intro. GSAP then recorded the hand's scale at that moment (0) as the loop's start, so after a replay the hand pulsed between 6% and 34%. Fixed by swapping the order and giving the loop explicit start values (`fromTo`).
- **The jump.** The suggested jump speed made the very first tap hit the ceiling, because the player starts only 34 px below it. That is why the "get ready" glide exists and the jump was retuned.
