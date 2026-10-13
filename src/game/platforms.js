import { TILE } from './level.js?v=016b13c';

// 上下に動く足場（空とお城のステージ）。横3タイル。上から乗れて、下からはすり抜ける
export const PLATFORM_TOP = 104;
export const PLATFORM_BOTTOM = 152;
export const PLATFORM_SPEED = 0.5;
const W = TILE * 3;
const H = TILE;

// index で動き始めをずらす（0: 上から下へ、1: 下から上へ、2: まん中から下へ）
export function createPlatform(tx, ty, index) {
  const starts = [
    { y: PLATFORM_TOP, dir: 1 },
    { y: PLATFORM_BOTTOM, dir: -1 },
    { y: (PLATFORM_TOP + PLATFORM_BOTTOM) / 2, dir: 1 },
  ];
  const s = starts[index % starts.length];
  return { x: tx * TILE, y: s.y, prevY: s.y, dy: 0, w: W, h: H, dir: s.dir, speed: PLATFORM_SPEED };
}

export function updatePlatform(p) {
  p.prevY = p.y;
  p.y += p.dir * p.speed;
  if (p.y <= PLATFORM_TOP) {
    p.y = PLATFORM_TOP;
    p.dir = 1;
  } else if (p.y >= PLATFORM_BOTTOM) {
    p.y = PLATFORM_BOTTOM;
    p.dir = -1;
  }
  p.dy = p.y - p.prevY;
}

// 足元（footY = 足の1ドット下）の x の位置に、乗っていられる足場があるか（敵が端で引き返すため）
export function platformUnder(level, x, footY) {
  for (const p of level.platforms || []) {
    if (x >= p.x && x < p.x + p.w && Math.abs(p.y - (footY - 1)) <= 2) return p;
  }
  return null;
}
