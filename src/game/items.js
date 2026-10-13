import { TILE } from './level.js?v=a2c093a';

// ？ブロックから飛び出すコインの演出時間（更新数）
export const POP_COIN_TICKS = 24;

export function createCoin(tx, ty) {
  return { kind: 'coin', x: tx * TILE, y: ty * TILE, rise: 0, life: -1, taken: false };
}

export function popCoin(tx, ty) {
  return { kind: 'popcoin', x: tx * TILE, y: (ty - 1) * TILE, rise: 0, life: POP_COIN_TICKS, taken: false };
}

export function popItem(kind, tx, ty) {
  return { kind, x: tx * TILE, y: ty * TILE, rise: TILE, life: -1, taken: false };
}

export function updateItem(it) {
  if (it.rise > 0) {
    it.y -= 1;
    it.rise -= 1;
  }
  if (it.kind === 'popcoin') {
    it.y -= 2;
    it.life--;
    if (it.life <= 0) it.taken = true;
  }
}

export function itemBox(it) {
  return { x: it.x + 2, y: it.y + 1, w: 12, h: 14 };
}

export function collectible(it) {
  return !it.taken && it.kind !== 'popcoin';
}
