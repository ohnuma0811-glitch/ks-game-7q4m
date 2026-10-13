import { TILE } from './level.js?v=248de58';

// 上下に動く足場（空とお城のステージ）。横3タイル。上から乗れて、下からはすり抜ける
export const PLATFORM_TOP = 104;
export const PLATFORM_BOTTOM = 152;
export const PLATFORM_SPEED = 0.5;
// お城の溶岩は一番下の行（上面 176）。溶岩の上の足場は、ふつうより1ブロック下まで下りて、
// 一番下で少しの間だけ溶岩に沈む。
// 沈んでいる間は2倍の速さで動くので、沈むのは約12更新。ジャンプして戻ってくるまでに出てくる
export const LAVA_DIP_BOTTOM = 182;
const LAVA_SURFACE = 176;
const DIP_SPEED = 1;
const W = TILE * 3;
const H = TILE;

// index で動き始めをずらす（0: 上から下へ、1: 下から上へ、2: まん中から下へ）。bottom は一番下の位置
export function createPlatform(tx, ty, index, bottom = PLATFORM_BOTTOM) {
  const starts = [
    { y: PLATFORM_TOP, dir: 1 },
    { y: bottom, dir: -1 },
    { y: (PLATFORM_TOP + bottom) / 2, dir: 1 },
  ];
  const s = starts[index % starts.length];
  return { x: tx * TILE, y: s.y, prevY: s.y, dy: 0, w: W, h: H, dir: s.dir, speed: PLATFORM_SPEED, top: PLATFORM_TOP, bottom };
}

// 上下に動く雲（空のステージ）。width タイルの幅で、置いた高さから上下に CLOUD_RANGE ずつ動く。dir は動き始めの向き
export const CLOUD_RANGE = 24;
export function createCloud(tx, ty, width, dir) {
  const y = ty * TILE;
  return {
    x: tx * TILE, y, prevY: y, dy: 0, w: width * TILE, h: H, dir, speed: PLATFORM_SPEED,
    top: y - CLOUD_RANGE, bottom: y + CLOUD_RANGE,
  };
}

export function updatePlatform(p) {
  p.prevY = p.y;
  p.y += p.dir * (p.y >= LAVA_SURFACE ? DIP_SPEED : p.speed);
  if (p.y <= p.top) {
    p.y = p.top;
    p.dir = 1;
  } else if (p.y >= p.bottom) {
    p.y = p.bottom;
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
