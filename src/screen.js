// 画面サイズから、内部解像度（高さ184固定）と拡大率を決める
// 184 は以前の 240 の約 1/1.3。キャラとブロックが 1.3 倍の大きさに見える
export const BASE_HEIGHT = 184;
export const MIN_WIDTH = 245;
export const MAX_WIDTH = 410;

export function computeViewport(winW, winH) {
  let scale = winH / BASE_HEIGHT;
  let width = Math.round(winW / scale);
  if (width < MIN_WIDTH) {
    // 正方形に近い画面: 横幅に合わせて縮め、上下に余白
    scale = winW / MIN_WIDTH;
    width = MIN_WIDTH;
  } else if (width > MAX_WIDTH) {
    // 極端な横長: 最大幅で止め、左右に余白
    width = MAX_WIDTH;
  }
  const cssW = width * scale;
  const cssH = BASE_HEIGHT * scale;
  return {
    width,
    height: BASE_HEIGHT,
    scale,
    cssW,
    cssH,
    offsetX: Math.floor((winW - cssW) / 2),
    offsetY: Math.floor((winH - cssH) / 2),
  };
}

export function isPortrait(winW, winH) {
  return winH > winW;
}
