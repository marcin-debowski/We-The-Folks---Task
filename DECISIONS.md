# Decisions

## Variant A: Game Ad

- **Viewport scaling:** the 360x640 stage is scaled with a small JS function using `transform: scale()` rather than CSS-only units, so the game, CSS and GSAP all share one coordinate system that matches the design.

- **Loading and audio:** the loading screen waits only for the images, which the first frame needs. Sounds download in the background and are needed only after the first tap; on desktop the music is ready in about 0.5 s, well before the intro ends. I chose not to wait for audio, because iOS Safari does not download audio before a user interaction, so waiting for it could leave the loading screen up forever. A capped wait (music or 2 s, whichever comes first) would help on slow mobile networks and is listed as a possible improvement.
