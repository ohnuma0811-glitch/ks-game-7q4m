import { AVATARS, TILES, TILE_PALETTE, parseSprite } from './data/sprites.js?v=bd0bd2d';
import { ENEMIES, ITEMS, BLOCKS } from './data/objects.js?v=bd0bd2d';

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

const both = (s) => ({ right: toCanvas(s, false), left: toCanvas(s, true) });

export function buildGraphics() {
  const avatars = {};
  for (const [name, a] of Object.entries(AVATARS)) {
    avatars[name] = {};
    for (const [frame, rows] of Object.entries(a.frames)) {
      avatars[name][frame] = both(parseSprite(rows, a.palette));
    }
  }
  const tiles = {};
  for (const [key, rows] of Object.entries(TILES)) {
    tiles[key] = toCanvas(parseSprite(rows, TILE_PALETTE), false);
  }
  for (const [key, s] of Object.entries(BLOCKS)) {
    tiles[key] = toCanvas(parseSprite(s.rows, s.palette), false);
  }
  const enemies = {};
  for (const [key, s] of Object.entries(ENEMIES)) {
    enemies[key] = both(parseSprite(s.rows, s.palette));
  }
  const sprites = {};
  for (const [key, s] of Object.entries(ITEMS)) {
    sprites[key] = toCanvas(parseSprite(s.rows, s.palette), false);
  }
  return { avatars, tiles, enemies, sprites };
}
