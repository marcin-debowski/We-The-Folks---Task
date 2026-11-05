const STAGE_WIDTH = 360;
const STAGE_HEIGHT = 640;

const viewport = document.getElementById("viewport");
const stage = document.getElementById("stage");

function fitStage() {
  const { width, height } = viewport.getBoundingClientRect();
  const scale = Math.min(width / STAGE_WIDTH, height / STAGE_HEIGHT);
  stage.style.setProperty("--scale", scale);
}

new ResizeObserver(fitStage).observe(viewport);
fitStage();
