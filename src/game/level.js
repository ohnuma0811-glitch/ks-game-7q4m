// 文字の地図（1文字＝1タイル）を読み込む
export const TILE = 16;
export const EMPTY = 0;
export const GROUND = 1;
export const BRICK = 2;

const TILE_CODES = { G: GROUND, B: BRICK };

export function parseLevel(lines) {
  const height = lines.length;
  const width = Math.max(...lines.map((l) => l.length));
  const tiles = new Uint8Array(width * height);
  let start = null;
  const entities = [];
  lines.forEach((line, ty) => {
    for (let tx = 0; tx < line.length; tx++) {
      const ch = line[tx];
      if (ch === ' ') continue;
      if (TILE_CODES[ch]) tiles[ty * width + tx] = TILE_CODES[ch];
      else if (ch === 'P') start = { tx, ty };
      else entities.push({ ch, tx, ty });
    }
  });
  if (!start) throw new Error('スタート地点 P がありません');
  return { width, height, tiles, start, entities };
}

export function tileAt(level, tx, ty) {
  if (tx < 0 || ty < 0 || tx >= level.width || ty >= level.height) return EMPTY;
  return level.tiles[ty * level.width + tx];
}

export function isSolid(level, tx, ty) {
  if (tx < 0 || tx >= level.width) return true;
  if (ty < 0 || ty >= level.height) return false;
  return level.tiles[ty * level.width + tx] !== EMPTY;
}
