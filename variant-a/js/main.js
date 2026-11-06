import { fitStageToViewport } from "./stage.js";
import { createRenderer, loadImages } from "./renderer.js";
import { PLAYER_START, START_OBSTACLES } from "./layout.js";

const viewport = document.getElementById("viewport");
const stage = document.getElementById("stage");
const canvas = document.getElementById("game");

// ?overlay=1 lays the design over the build to check alignment. Development only.
if (new URLSearchParams(location.search).has("overlay")) {
  const overlay = new Image();
  overlay.src = "design/01-start.png";
  overlay.className = "layer design-overlay";
  overlay.alt = "";
  stage.append(overlay);
}

const renderer = createRenderer(canvas);
let images = null;

function redraw() {
  if (images) renderer.draw(images, { player: PLAYER_START, obstacles: START_OBSTACLES });
}

fitStageToViewport(viewport, stage, (scale) => {
  renderer.resize(scale);
  redraw();
});

images = await loadImages();
redraw();
