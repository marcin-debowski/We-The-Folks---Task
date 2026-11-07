# Decisions

## Variant A: Game Ad

- **Viewport scaling:** the 360×640 stage is scaled with a small JS function using `transform: scale()` rather than CSS-only units, so the game, CSS and GSAP all share one coordinate system that matches the design. When less than 2 px would be left over, the stage fills the screen instead, and its position is snapped to physical pixels; together with a 1–2 px overlap on the bands around it, this removes the hairline seams that fractional edges caused.

- **Canvas for the game, DOM for the UI:** the gut, texture, obstacles and player are drawn on one 2D canvas that is redrawn every frame. The logo, headline, tutorial hand, endcards and buttons are HTML, because they need clicks, `alt` text and GSAP animation. I did not use Phaser: it would add about 1 MB and far more than this game needs.

- **Sharp canvas:** the canvas buffer is sized to 360 × stage scale × `devicePixelRatio`, and `setTransform` keeps drawing in stage units, so the game is sharp on 3x phones without changing any game code.

- **Assets and positions:** every asset is drawn at 50%. Positions were measured, not placed by eye: small Python scripts match each asset against the design PNGs and return its offset. The code keeps the 2x numbers (`x: 111 / 2`) so each value can be traced back to the design. Where the design scales an asset differently (some obstacles, the endcard headlines), I kept the 50% rule.

- **One game loop and explicit states:** a single `requestAnimationFrame` loop runs from page load; `start → ready → playing → fail / win` decides what it does. Replay only resets the data and the state, so a second loop (double speed) or a leftover timer cannot appear. Physics uses the real frame time (`dt`, capped at 1/30 s), so it behaves the same at 60 and 120 Hz; a tap sets the upward speed instead of adding to it, so every jump is the same.

- **Collision:** hitboxes are circles fitted inside the art (the largest circles that fit, computed from the PNG alpha), so a hitbox never sticks out of what the player sees. The player is three circles, each bacterium a chain of circles, and each word its rectangle shrunk by 2 px. That needs only two tests: circle–circle and circle–rectangle. The playfield limits come from `border.png` in the player's fixed column and are forgiving: the run ends when the player is fully inside a cloud. `?debug=1` draws every hitbox.

- **Level design:** a hand-made level, not a random one, so it is always possible and every obstacle appears exactly once: 9 columns 215 px apart, with the gap between a bacterium and a word shrinking from 150 px to 115 px. The two columns from the design start screen keep their arrangement but start 200 px later, so they are not on the player at the start. A frame-by-frame simulation with the real physics and hitboxes confirms the level can be finished.

- **Endcards:** each endcard is an HTML section whose navy layer starts below the logo bar, so the logo stays visible. Its entrance is a GSAP timeline built once and restarted on every lost or won run; the endcard sound is scheduled inside that timeline, so pausing it on replay also cancels the sound.

- **Clickout:** `window.clickTag` is read at click time (an ad server may set it late), with the README fallback URL. The buttons listen to `click`, which popup blockers accept as a user action and which also works from the keyboard.

- **Audio:** plain `Audio` elements instead of the Web Audio API: a few lines are enough for four sounds and a loop. Each file has exactly one element, created once, so a sound can restart but never play twice at the same time. Mute uses `muted`, which also works on iOS (where `volume` is ignored), and stays on across replays. When the tab is hidden, only the sounds that were playing are paused and later resumed.

- **Loading and audio:** the loading screen waits only for the images, which the first frame needs. Sounds download in the background and are needed only after the first tap; on desktop the music is ready in about 0.5 s, well before the intro ends. I chose not to wait for audio, because iOS Safari does not download audio before a user interaction, so waiting for it could leave the loading screen up forever. A capped wait (music or 2 s, whichever comes first) would help on slow mobile networks and is listed as a possible improvement.

- **Motion and weight:** GSAP is a local vendor file (no CDN), so the ad works without external requests and its 71 KB counts toward the limit. Decorative animations go through two small helpers that skip them under `prefers-reduced-motion`. The shipped ad is 2.02 MB, under 3 MB, so I did not compress anything; the audio (about 1.4 MB) would be the first thing to compress.

## Variant B: Fireplace Ad

- **Background from `bg-big.jpg`, cut by a script:** the pre-cut `bg.jpg` files do not continue into each other (the stone breaks at the top|right seam), so I cut all three parts from the one continuous photo with `tools/crop_backgrounds.py`: 1680 CSS px = 320 + 4 + 1032 + 4 + 320, so the moss on both sides of each 4 px gap is the same photo. The price is that the photo is framed differently from the design (packs larger and higher, the top stone cut); I chose a continuous fireplace over matching the background pixel for pixel. Each crop reaches 40 px further towards the fireplace centre than its part (20 px below the top banner), so the zoom never shows an edge; the extra pixels are clipped by the stage.

- **Fixed size, measured positions:** each part is a fixed-size stage in CSS px with no scaling, because the parts are delivered as fixed ad slots. I fitted the background into `layout.png` (0.9723 design px per CSS px; one fit for all three parts, error under 0.2 px), which confirmed the 0 / 324 / 1360 px layout and the overlay values. The logo and copy layers are full-size 2x canvases and match at (0, 0); the CTA is centred horizontally (x 73.75, y 838).

- **Assets without transparency:** `box.png`, both `hl.png` copy files and `cta.png` have black where transparency was intended. Instead of editing the assets: the panel is clipped to its blue band (`clip-path: inset()`) and set to `opacity: 0.8` (measured 0.81–0.82 in the design); the copy uses `mix-blend-mode: screen`, which keeps white and drops black; the CTA's black corners are clipped with `border-radius: 7px` (radius measured from the PNG).

- **Product without its own asset:** the pack is part of the photo, so the "product" is a second copy of the background (same file, no extra download) clipped with `clip-path: polygon()` to the pack outline, measured from the edges and widened by 1 px. It starts 15% larger and rotated by −1.5° and settles onto the original with `power3.out`. Because the copy is always at least as large as the original around its centre, the original never shows; a test with the original painted magenta found no magenta pixels in any frame.

- **One zoom centre for all parts:** the background and the product copy sit in one `.scene` group per part, scaled around the centre of the whole fireplace (840, 487.5) converted into each part's own coordinates (840 / 516 / −520 px). The three parts then behave like one photo, and the seams line up during the zoom and the idle breath, which I checked against `bg-big.jpg` at several moments. The intro starts zoomed in (1.08) and settles at 1, so the end state is the measured layout; zooming in towards 1 would need photo beyond the outer edges of the fireplace, which `bg-big.jpg` does not have. The centre is set once with `gsap.set()`, because a `from()` tween returns `transformOrigin` to its original value when it ends.

- **Headline line by line:** `top/hl.png` is one image with a soft shadow over its whole height, so the three lines are three copies of it, each clipped with `clip-path: inset()` at whole-pixel boundaries (89 and 157 px) halfway between the lines. Together they rebuild the image exactly; only the first copy has the `alt` text.

- **One 30-second timeline per part:** intro (0–5 s) and idle motion (5–30 s) are one GSAP timeline with a finite number of repeats, chosen so every loop ends at rest exactly at 30 s (the breath is 4 × 6.25 s, the CTA pulse 7 times). So nothing has to be stopped by a timer and no tween is active afterwards. Under `prefers-reduced-motion` the timeline jumps to its end (`progress(1)`), which is the static layout.

- **Synced start:** the parts are separate documents, so each part tells its parent it has loaded (`fireplace-ready`, on the `load` event, so its images are in); the preview answers all three at once with `fireplace-start` when every part is ready. Measured start difference between the parts: under 1 ms, also with one part loading 0.8 s later. A part on its own starts at once, and one in an unknown page starts after 1.5 s, so it never waits forever. The messages use `'*'` as the target origin, because an ad cannot know the publisher's domain and the messages carry no data.

- **Clickout:** one `click` listener on each stage (events bubble up from every layer), so the whole part is clickable; the CTA is a real `<button>` for the keyboard. `window.clickTag` is read at click time, and the window opens with `noopener`.

- **Weight:** 1.31 MB in total with GSAP as a local file (no CDN requests). Beyond the JPEG quality 80 crops, nothing was compressed, because the ad is well under 3 MB.
