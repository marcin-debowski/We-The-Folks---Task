import { fitStageToViewport } from "./stage.js";
import { createRenderer, loadImages } from "./renderer.js";
import { PLAYER_START, START_OBSTACLES } from "./layout.js";

const viewport = document.getElementById("viewport");
const stage = document.getElementById("stage");
const canvas = document.getElementById("game");
const gesture = document.getElementById("gesture");

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

function frame() {
  redraw();
  requestAnimationFrame(frame);
}

let state = "start";

function handleTap() {
  if (state === "start") {
    state = "playing";
    gesture.hidden = true;
  }
}
viewport.addEventListener("pointerdown", handleTap);

images = await loadImages();
requestAnimationFrame(frame);
