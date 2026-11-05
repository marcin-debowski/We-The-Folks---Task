import { STAGE_HEIGHT, STAGE_WIDTH } from "./stage.js";
import { GUT_OFFSET_X } from "./layout.js";

const ASSET_RATIO = 2; // Assets are exported at 2x.

const IMAGE_PATHS = {
  gut: "assets/01_game/gameplay.png",
};

export async function loadImages() {
  const entries = await Promise.all(
    Object.entries(IMAGE_PATHS).map(async ([name, path]) => {
      const image = new Image();
      image.src = path;
      await image.decode();
      return [name, image];
    }),
  );
  return Object.fromEntries(entries);
}

export function createRenderer(canvas) {
  const ctx = canvas.getContext("2d");

  function drawSprite(image, x, y) {
    ctx.drawImage(image, x, y, image.naturalWidth / ASSET_RATIO, image.naturalHeight / ASSET_RATIO);
  }

  return {
    resize(stageScale) {
      const pixelRatio = stageScale * (window.devicePixelRatio || 1);
      canvas.width = Math.round(STAGE_WIDTH * pixelRatio);
      canvas.height = Math.round(STAGE_HEIGHT * pixelRatio);
      ctx.setTransform(canvas.width / STAGE_WIDTH, 0, 0, canvas.height / STAGE_HEIGHT, 0, 0);
    },
    draw(images) {
      ctx.clearRect(0, 0, STAGE_WIDTH, STAGE_HEIGHT);
      drawSprite(images.gut, GUT_OFFSET_X, 0);
    },
  };
}
