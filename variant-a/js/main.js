import { fitStageToViewport } from "./stage.js";
import { createRenderer, loadImages } from "./renderer.js";
import { PLAYER_START, START_OBSTACLES } from "./layout.js";

const viewport = document.getElementById("viewport");
const stage = document.getElementById("stage");
const canvas = document.getElementById("game");

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
