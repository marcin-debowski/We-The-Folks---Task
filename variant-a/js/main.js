import { fitStageToViewport, STAGE_WIDTH } from "./stage.js";
import { createRenderer, loadImages } from "./renderer.js";
import { circleOverlapsShape, obstacleHitboxes, playerHitboxes } from "./hitboxes.js";
import { createSounds } from "./audio.js";
import {
  CEILING_Y,
  FLOOR_Y,
  PLAYER_HEIGHT,
  PLAYER_START,
  OBSTACLES,
  GUT_OFFSET_X,
  GUT_WIDTH,
} from "./layout.js";

const GRAVITY = 1200; // stage px per second², tuned by feel
const MAX_FRAME_TIME = 1 / 30; // seconds; caps dt after a lag or a hidden tab
const JUMP_SPEED = 220;
const SCROLL_SPEED = 130;
const MAX_SCROLL_X = GUT_WIDTH + GUT_OFFSET_X - STAGE_WIDTH;

const viewport = document.getElementById("viewport");
const stage = document.getElementById("stage");
const canvas = document.getElementById("game");
const gesture = document.getElementById("gesture");
const failCard = document.getElementById("fail-card");
const failCta = document.getElementById("fail-cta");
const replayButton = document.getElementById("replay");
const winCard = document.getElementById("win-card");
const winCta = document.getElementById("win-cta");
const muteButton = document.getElementById("mute");
const logo = document.getElementById("logo");
const headline = document.getElementById("headline");

// ?overlay=1 lays the design over the build to check alignment. Development only.
const params = new URLSearchParams(location.search);

if (params.has("overlay")) {
  const overlay = new Image();
  overlay.src = "design/01-start.png";
  overlay.className = "layer design-overlay";
  overlay.alt = "";
  stage.append(overlay);
}

const renderer = createRenderer(canvas, params.has("debug"));
const sounds = createSounds();

let images = null;
let state = "start";
const player = { ...PLAYER_START, vy: 0 };
let scrollX = 0;
let paused = false;

function redraw() {
  if (images) renderer.draw(images, { player, obstacles: OBSTACLES, scrollX });
}

fitStageToViewport(viewport, stage, (scale) => {
  renderer.resize(scale);
  redraw();
});

let lastTime = null;

function frame(time) {
  const dt = lastTime === null ? 0 : Math.min((time - lastTime) / 1000, MAX_FRAME_TIME);
  lastTime = time;
  if (state === "playing" && !paused) update(dt);
  redraw();
  requestAnimationFrame(frame);
}

function touchesObstacle() {
  const playerCircles = playerHitboxes(player);

  return OBSTACLES.some((obstacle) =>
    obstacleHitboxes(obstacle, images[obstacle.image], scrollX).some((shape) =>
      playerCircles.some((circle) => circleOverlapsShape(circle, shape)),
    ),
  );
}

function update(dt) {
  scrollX = Math.min(scrollX + SCROLL_SPEED * dt, MAX_SCROLL_X);

  player.vy += GRAVITY * dt;
  player.y += player.vy * dt;

  const hitCeiling = player.y < CEILING_Y;
  const hitFloor = player.y + PLAYER_HEIGHT > FLOOR_Y;
  if (hitCeiling || hitFloor || touchesObstacle()) fail();
  else if (scrollX === MAX_SCROLL_X) win();
}

function fail() {
  state = "fail";
  failCard.hidden = false;
  stage.classList.add("is-endcard");
  sounds.playFail();
}
function win() {
  state = "win";
  winCard.hidden = false;
  stage.classList.add("is-endcard");
  sounds.playWin();
}

function resetRun() {
  state = "start";
  Object.assign(player, PLAYER_START, { vy: 0 });
  scrollX = 0;
  sounds.stopAll();

  gesture.hidden = false;
  tapHint.play(0);
  failCard.hidden = true;
  stage.classList.remove("is-endcard");
}

function jump() {
  player.vy = -JUMP_SPEED;
}

let intro = null;
//Looping tap hint
const tapHint = gsap.fromTo(
  gesture,
  { scale: 1, y: 0 },
  {
    scale: 0.9,
    y: 6,
    transformOrigin: "35% 15%",
    duration: 0.45,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true,
    paused: true,
  },
);

function playIntro() {
  intro = gsap
    .timeline({ defaults: { duration: 0.5, ease: "power2.out" } })
    .from(canvas, { autoAlpha: 0, duration: 0.6 })
    .from(logo, { y: -30, autoAlpha: 0 }, 0.1)
    .from(headline, { y: 20, autoAlpha: 0 }, 0.25)
    .from(player, { y: 0, duration: 1, ease: "bounce.out" }, 0.35)
    .from(gesture, { scale: 0, autoAlpha: 0, ease: "back.out(2)" }, "-=0.3")
    .call(() => tapHint.play(0));
}

function handleTap() {
  if (state === "start") {
    intro.progress(1);
    tapHint.pause(0);
    state = "playing";
    gesture.hidden = true;
    sounds.startMusic();
  }
  if (state === "playing") jump();
}
viewport.addEventListener("pointerdown", handleTap);

function openLandingPage() {
  const clickTag = window.clickTag || "https://example.com/landing";
  window.open(clickTag, "_blank");
}

let muted = false;

function toggleMute() {
  muted = !muted;
  sounds.setMuted(muted);
  muteButton.setAttribute("aria-pressed", String(muted));
  muteButton.setAttribute("aria-label", muted ? "Ton einschalten" : "Ton ausschalten");
}

function handleVisibilityChange() {
  paused = document.hidden;

  if (paused) {
    sounds.pauseForHidden();
  } else {
    lastTime = null; // the next frame starts with dt = 0, not with the whole hidden time
    sounds.resumeAfterHidden();
  }
}

failCta.addEventListener("click", openLandingPage);
replayButton.addEventListener("click", resetRun);
winCta.addEventListener("click", openLandingPage);
muteButton.addEventListener("click", toggleMute);
muteButton.addEventListener("pointerdown", (event) => event.stopPropagation());
document.addEventListener("visibilitychange", handleVisibilityChange);

images = await loadImages();
requestAnimationFrame(frame);
stage.classList.remove("is-loading");
playIntro();
