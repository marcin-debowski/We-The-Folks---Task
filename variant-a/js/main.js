const STAGE_WIDTH = 360;
const STAGE_HEIGHT = 640;

const viewport = document.getElementById("viewport");
const stage = document.getElementById("stage");

// Below this leftover (CSS px) we fill the screen instead of showing a hairline gap.
const MAX_HAIRLINE_GAP = 2;

function fitStage() {
  const { width, height } = viewport.getBoundingClientRect();
  const contain = Math.min(width / STAGE_WIDTH, height / STAGE_HEIGHT);
  const cover = Math.max(width / STAGE_WIDTH, height / STAGE_HEIGHT);

  const gapX = width - STAGE_WIDTH * contain;
  const gapY = height - STAGE_HEIGHT * contain;
  const isHairline = Math.max(gapX, gapY) < MAX_HAIRLINE_GAP;

  const scale = isHairline ? cover : contain;

  stage.style.setProperty("--scale", scale);
  stage.style.setProperty("--x", `${centerOffset(width, STAGE_WIDTH * scale)}px`);
  stage.style.setProperty("--y", `${centerOffset(height, STAGE_HEIGHT * scale)}px`);
}

// Centers the stage, snapped to a physical pixel so the browser cannot shift it by rounding.
function centerOffset(available, size) {
  const dpr = window.devicePixelRatio || 1;
  return Math.round(((available - size) / 2) * dpr) / dpr;
}

new ResizeObserver(fitStage).observe(viewport);
fitStage();
