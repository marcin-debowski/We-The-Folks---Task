# Decisions

## Variant A: Game Ad

- **Viewport scaling:** the 360x640 stage is scaled with a small JS function using `transform: scale()` rather than CSS-only units, so the game, CSS and GSAP all share one coordinate system that matches the design. When less than 2 px would be left over, the stage fills the screen instead, and its position is snapped to physical pixels; together with a 1–2 px overlap on the bands around it, this removes the hairline seams that fractional edges caused.

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
