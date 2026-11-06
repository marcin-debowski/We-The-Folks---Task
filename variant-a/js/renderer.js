import { STAGE_HEIGHT, STAGE_WIDTH } from "./stage.js";
import { CEILING_Y, FLOOR_Y, GUT_OFFSET_X, PLAYFIELD_TOP, TEXTURE_OFFSET_Y } from "./layout.js";
import { obstacleHitboxes, playerHitboxes } from "./hitboxes.js";

const ASSET_RATIO = 2; // Assets are exported at 2x.

const IMAGE_PATHS = {
  gut: "assets/01_game/gameplay.png",
  texture: "assets/01_game/bg_texture.png",
  border: "assets/border.png",
  player: "assets/01_game/player.png",
  bac1: "assets/01_game/bac1.png",
  bac2: "assets/01_game/bac2.png",
  bac3: "assets/01_game/bac3.png",
  bac4: "assets/01_game/bac4.png",
  bac5: "assets/01_game/bac5.png",
  bac6: "assets/01_game/bac6.png",
  txt1: "assets/01_game/txt1.png",
  txt2: "assets/01_game/txt2.png",
  txt3: "assets/01_game/txt3.png",
  txt4: "assets/01_game/txt4.png",
  txt5: "assets/01_game/txt5.png",
  txt6: "assets/01_game/txt6.png",
  txt7: "assets/01_game/txt7.png",
  txt8: "assets/01_game/txt8.png",
  txt9: "assets/01_game/txt9.png",
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

export function createRenderer(canvas, debug) {
  const ctx = canvas.getContext("2d");

  function drawSprite(image, x, y) {
    ctx.drawImage(image, x, y, image.naturalWidth / ASSET_RATIO, image.naturalHeight / ASSET_RATIO);
  }

  function drawShape(shape) {
    ctx.beginPath();
    if (shape.type === "circle") ctx.arc(shape.x, shape.y, shape.r, 0, Math.PI * 2);
    else ctx.rect(shape.x, shape.y, shape.w, shape.h);
    ctx.stroke();
  }

  // ?debug=1: playfield limits in yellow, player in green, obstacles in red.
  function drawHitboxes(images, player, obstacles, scrollX) {
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#ffd400";
    drawShape({ type: "rect", x: 0, y: CEILING_Y, w: STAGE_WIDTH, h: FLOOR_Y - CEILING_Y });
    ctx.strokeStyle = "#00e676";
    playerHitboxes(player).forEach(drawShape);
    ctx.strokeStyle = "#ff1744";
    obstacles.forEach((o) => obstacleHitboxes(o, images[o.image], scrollX).forEach(drawShape));
  }

  return {
    resize(stageScale) {
      const pixelRatio = stageScale * (window.devicePixelRatio || 1);
      canvas.width = Math.round(STAGE_WIDTH * pixelRatio);
      canvas.height = Math.round(STAGE_HEIGHT * pixelRatio);
      ctx.setTransform(canvas.width / STAGE_WIDTH, 0, 0, canvas.height / STAGE_HEIGHT, 0, 0);
    },
    draw(images, { player, obstacles, scrollX }) {
      ctx.clearRect(0, 0, STAGE_WIDTH, STAGE_HEIGHT);
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, PLAYFIELD_TOP, STAGE_WIDTH, STAGE_HEIGHT - PLAYFIELD_TOP);
      ctx.clip();

      drawSprite(images.texture, 0, TEXTURE_OFFSET_Y);
      drawSprite(images.gut, GUT_OFFSET_X - scrollX, 0);
      drawSprite(images.border, 0, 0);
      obstacles.forEach(({ image, x, y }) => drawSprite(images[image], x - scrollX, y));
      drawSprite(images.player, player.x, player.y);
      if (debug) drawHitboxes(images, player, obstacles, scrollX);

      ctx.restore();
    },
  };
}
