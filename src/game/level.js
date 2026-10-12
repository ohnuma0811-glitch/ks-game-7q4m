// 文字の地図（1文字＝1タイル）を読み込む
export const TILE = 16;
export const EMPTY = 0;
export const GROUND = 1;
export const BRICK = 2;
export const QUESTION = 3;
export const USED = 4;

const TILE_CODES = { G: GROUND, B: BRICK, '?': QUESTION, d: QUESTION, s: QUESTION };
// ？ブロックの中身
const BLOCK_CONTENTS = { '?': 'coin', d: 'drink', s: 'star' };
// 敵・コイン・チェックポイント・ゴール
export const ENTITY_CHARS = new Set(['c', 'w', 'W', 'x', 'j', 'J', 'y', 'S', 'h', 'H', 'F', '|']);

export function parseLevel(lines) {
  const height = lines.length;
  const width = Math.max(...lines.map((l) => l.length));
  const tiles = new Uint8Array(width * height);
  const contents = new Map();
  let start = null;
  const entities = [];
  lines.forEach((line, ty) => {
    for (let tx = 0; tx < line.length; tx++) {
      const ch = line[tx];
      if (ch === ' ') continue;
      if (TILE_CODES[ch]) {
        tiles[ty * width + tx] = TILE_CODES[ch];
        if (BLOCK_CONTENTS[ch]) contents.set(ty * width + tx, BLOCK_CONTENTS[ch]);
      } else if (ch === 'P') {
        start = { tx, ty };
      } else if (ENTITY_CHARS.has(ch)) {
        entities.push({ ch, tx, ty });
      } else {
        throw new Error(`知らない文字 '${ch}'（${tx}列目, ${ty}行目）`);
      }
    }
  });
  if (!start) throw new Error('スタート地点 P がありません');
  return { width, height, tiles, contents, start, entities };
}

export function tileAt(level, tx, ty) {
  if (tx < 0 || ty < 0 || tx >= level.width || ty >= level.height) return EMPTY;
  return level.tiles[ty * level.width + tx];
}

export function setTile(level, tx, ty, code) {
  if (tx < 0 || ty < 0 || tx >= level.width || ty >= level.height) return;
  level.tiles[ty * level.width + tx] = code;
}

export function isSolid(level, tx, ty) {
  if (tx < 0 || tx >= level.width) return true;
  if (ty < 0 || ty >= level.height) return false;
  return level.tiles[ty * level.width + tx] !== EMPTY;
}
