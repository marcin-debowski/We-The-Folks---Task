export const GUT_OFFSET_X = -2;
export const PLAYFIELD_TOP = 337 / 2;
export const TEXTURE_OFFSET_Y = 43 / 2;

export const PLAYER_START = { x: 111 / 2, y: 517 / 2 };

// The first two columns keep the arrangement from design/01-start.png, but start 200 px
// further right, so they don't sit on the player at the start. After 200 px of scrolling
// (about 1.5 s) the screen shows them exactly as in the design.
const DESIGN_COLUMNS_SHIFT = 200;

export const OBSTACLES = [
  { image: "bac6", x: 188 / 2 + DESIGN_COLUMNS_SHIFT, y: 636 / 2 },
  { image: "txt1", x: 199 / 2 + DESIGN_COLUMNS_SHIFT, y: 740 / 2 },

  { image: "bac2", x: 549 / 2 + DESIGN_COLUMNS_SHIFT, y: 657 / 2 },
  { image: "txt2", x: 603 / 2 + DESIGN_COLUMNS_SHIFT, y: 778 / 2 },

  { image: "txt3", x: 718, y: 440 },

  { image: "bac1", x: 914, y: 243 },
  { image: "txt4", x: 930.5, y: 437.5 },

  { image: "bac3", x: 1120.5, y: 237 },
  { image: "txt6", x: 1150, y: 395 },

  { image: "txt5", x: 1360, y: 240 },

  { image: "bac4", x: 1555.5, y: 326 },
  { image: "txt7", x: 1575, y: 480 },

  { image: "bac5", x: 1778, y: 229 },
  { image: "txt9", x: 1792, y: 387.5 },

  { image: "txt8", x: 2011, y: 300 },
];

export const CEILING_Y = 448 / 2;
export const FLOOR_Y = 1171 / 2;
export const PLAYER_HEIGHT = 82 / 2;

// Where the player waits after the "get ready" glide: the middle of the playfield.
export const READY_Y = (CEILING_Y + FLOOR_Y - PLAYER_HEIGHT) / 2;

export const GUT_WIDTH = 5056 / 2;
