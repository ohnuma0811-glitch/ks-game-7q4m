import { AVATARS, TILES, TILE_PALETTE, parseSprite } from './data/sprites.js?v=623cc89';
import { ENEMIES, ITEMS, BLOCKS, BOSS_SPRITES, FIREBALL } from './data/objects.js?v=623cc89';
import { BACKDROP_SPRITES } from './data/backdrop.js?v=623cc89';
import { THEMES } from './data/themes.js?v=623cc89';

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
  // 地面とレンガはステージごとの色、？ブロックなどは共通
  const shared = {};
  for (const [key, s] of Object.entries(BLOCKS)) {
    shared[key] = toCanvas(parseSprite(s.rows, s.palette), false);
  }
  const tiles = {};
  for (const [theme, t] of Object.entries(THEMES)) {
    tiles[theme] = { ...shared };
    for (const [key, rows] of Object.entries(TILES)) {
      tiles[theme][key] = toCanvas(parseSprite(rows, { ...TILE_PALETTE, ...t.tiles }), false);
    }
  }
  const enemies = {};
  for (const [key, s] of Object.entries(ENEMIES)) {
    enemies[key] = both(parseSprite(s.rows, s.palette));
  }
  // ボスの絵は左向き。right が元の絵（左向き）、left が反転（右向き）
  const boss = {};
  for (const [key, s] of Object.entries(BOSS_SPRITES)) {
    boss[key] = both(parseSprite(s.rows, s.palette));
  }
  const sprites = {};
  for (const [key, s] of Object.entries(ITEMS)) {
    sprites[key] = toCanvas(parseSprite(s.rows, s.palette), false);
  }
  const backdrop = {};
  for (const [key, s] of Object.entries(BACKDROP_SPRITES)) {
    backdrop[key] = toCanvas(parseSprite(s.rows, s.palette), false);
  }
  const fireball = both(parseSprite(FIREBALL.rows, FIREBALL.palette));
  return { avatars, tiles, enemies, sprites, backdrop, boss, fireball };
}
