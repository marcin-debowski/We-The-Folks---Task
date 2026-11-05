import { fitStageToViewport } from "./stage.js";
import { createRenderer } from "./renderer.js";

const viewport = document.getElementById("viewport");
const stage = document.getElementById("stage");
const canvas = document.getElementById("game");

const renderer = createRenderer(canvas);

fitStageToViewport(viewport, stage, (scale) => renderer.resize(scale));
