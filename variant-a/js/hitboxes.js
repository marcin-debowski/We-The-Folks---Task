const PLAYER_CIRCLES = [
  [20.5, 25, 15], // face and body
  [7, 33, 6], // bottom left
  [34.5, 32, 6], // bottom right
];

const BACTERIA_CIRCLES = {
  bac1: [[32, 29, 26]],
  bac2: [
    [9.5, 8.5, 7.5],
    [8, 20.5, 7.5],
    [9.5, 32.5, 7.5],
    [12, 43.5, 7.5],
    [12.5, 56, 7.5],
    [9, 67.5, 7],
  ],
  bac3: [
    [11, 12, 8],
    [21.5, 17.5, 8],
    [34, 19, 8],
    [45.5, 17.5, 8],
    [58, 15.5, 8],
    [70, 14.5, 8],
  ],
  bac4: [
    [7.5, 7.5, 7],
    [21, 12, 7],
    [33, 20, 7],
    [46, 26, 7],
    [60.5, 25.5, 6.5],
  ],
  bac5: [
    [14, 14.5, 10],
    [22.5, 25.5, 10.5],
    [33, 29.5, 10.5],
  ],
  bac6: [
    [10.5, 31, 7],
    [22, 30, 10.5],
    [31, 23, 11],
    [37.5, 13.5, 8.5],
  ],
};

const TEXT_INSET = 2;

export function playerHitboxes(player) {
  return PLAYER_CIRCLES.map(([cx, cy, r]) => ({
    type: "circle",
    x: player.x + cx,
    y: player.y + cy,
    r,
  }));
}

export function obstacleHitboxes({ image, x, y }, sprite, scrollX) {
  const left = x - scrollX;
  const circles = BACTERIA_CIRCLES[image];

  if (circles) {
    return circles.map(([cx, cy, r]) => ({ type: "circle", x: left + cx, y: y + cy, r }));
  }

  return [
    {
      type: "rect",
      x: left + TEXT_INSET,
      y: y + TEXT_INSET,
      w: sprite.naturalWidth / 2 - 2 * TEXT_INSET,
      h: sprite.naturalHeight / 2 - 2 * TEXT_INSET,
    },
  ];
}
