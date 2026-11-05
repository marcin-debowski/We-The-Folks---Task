import { STAGE_HEIGHT, STAGE_WIDTH } from "./stage.js";

export function createRenderer(canvas) {
  const ctx = canvas.getContext("2d");

  return {
    resize(stageScale) {
      const pixelRatio = stageScale * (window.devicePixelRatio || 1);
      canvas.width = Math.round(STAGE_WIDTH * pixelRatio);
      canvas.height = Math.round(STAGE_HEIGHT * pixelRatio);
      ctx.setTransform(canvas.width / STAGE_WIDTH, 0, 0, canvas.height / STAGE_HEIGHT, 0, 0);
    },
  };
}
