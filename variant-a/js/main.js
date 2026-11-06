import { fitStageToViewport } from "./stage.js";
import { createRenderer, loadImages } from "./renderer.js";
import { CEILING_Y, FLOOR_Y, PLAYER_HEIGHT, PLAYER_START, START_OBSTACLES } from "./layout.js";

const GRAVITY = 1200; // stage px per second², tuned by feel
const MAX_FRAME_TIME = 1 / 30; // seconds; caps dt after a lag or a hidden tab
const JUMP_SPEED = 220;

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
let state = "start";
const player = { ...PLAYER_START, vy: 0 };

function redraw() {
  if (images) renderer.draw(images, { player, obstacles: START_OBSTACLES });
}

fitStageToViewport(viewport, stage, (scale) => {
  renderer.resize(scale);
  redraw();
});

let lastTime = null;

function frame(time) {
  const dt = lastTime === null ? 0 : Math.min((time - lastTime) / 1000, MAX_FRAME_TIME);
  lastTime = time;
  if (state === "playing") update(dt);
  redraw();
  requestAnimationFrame(frame);
}

function update(dt) {
  player.vy += GRAVITY * dt;
  player.y += player.vy * dt;

  const hitCeiling = player.y < CEILING_Y;
  const hitFloor = player.y + PLAYER_HEIGHT > FLOOR_Y;
  if (hitCeiling || hitFloor) fail();
}

function fail() {
  state = "fail";
  console.log("Run failed: left the playfield");
}

function jump() {
  player.vy = -JUMP_SPEED;
}

function handleTap() {
  if (state === "start") {
    state = "playing";
    gesture.hidden = true;
  }
  if (state === "playing") jump();
}
viewport.addEventListener("pointerdown", handleTap);

images = await loadImages();
requestAnimationFrame(frame);
