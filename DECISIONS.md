# Decisions

## Variant A: Game Ad

- **Viewport scaling:** the 360x640 stage is scaled with a small JS function using `transform: scale()` rather than CSS-only units, so the game, CSS and GSAP all share one coordinate system that matches the design.
