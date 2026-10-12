import { AVATARS, TILES, TILE_PALETTE, parseSprite } from './data/sprites.js';

// ドット絵を小さな Canvas に描いておき、毎フレーム drawImage で使い回す
function toCanvas(sprite, flip) {
  const c = document.createElement('canvas');
  c.width = sprite.w;
  c.height = sprite.h;
  const g = c.getContext('2d');
  sprite.data.forEach((color, i) => {
    if (!color) return;
    const x = i % sprite.w;
    const y = Math.floor(i / sprite.w);
    g.fillStyle = color;
    g.fillRect(flip ? sprite.w - 1 - x : x, y, 1, 1);
  });
  return c;
}

export function buildGraphics() {
  const avatars = {};
  for (const [name, a] of Object.entries(AVATARS)) {
    avatars[name] = {};
    for (const [frame, rows] of Object.entries(a.frames)) {
      const s = parseSprite(rows, a.palette);
      avatars[name][frame] = { right: toCanvas(s, false), left: toCanvas(s, true) };
    }
  }
  const tiles = {};
  for (const [key, rows] of Object.entries(TILES)) {
    tiles[key] = toCanvas(parseSprite(rows, TILE_PALETTE), false);
  }
  return { avatars, tiles };
}
