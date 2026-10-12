// 背景の雲と山（ステージ1の草原）。地面より遅くスクロールさせて奥行きを出す
export const BACKDROP_SPRITES = {
  cloud: {
    palette: { o: '#b8d8ff', f: '#ffffff', s: '#dcecff' },
    rows: [
      '.............oooooo.............',
      '............offffffo............',
      '...........offffffffo...........',
      '..........offffffffffo..........',
      '.......oooffffffffffffoooo......',
      '.....oofffffffffffffffffffoo....',
      '....offfffffffffffffffffffffo...',
      '....offfffffffffffffffffffffo...',
      '...offfffffffffffffffffffffffo..',
      '...offfffffffffffffffffffffffo..',
      '...offfffffffffffffffffffffffo..',
      '...offfffffffffffffffffffffffo..',
      '....ossssssssssssssssssssssso...',
      '....ossssssssooooooosssssssso...',
      '.....oooooooo.......oooooooo....',
      '................................',
    ],
  },
  hill: {
    palette: { o: '#1e6b1e', f: '#4caf3c' },
    rows: [
      '................................................................',
      '..........................oooooooooooo..........................',
      '......................ooooffffffffffffoooo......................',
      '...................oooffffffffffffffffffffooo...................',
      '.................ooffffffffffffffffffffffffffoo.................',
      '...............ooffffffffffffffffffffffffffffffoo...............',
      '..............offffffffffffffffffffffffffffffffffo..............',
      '............ooffffffffffffffffffffffffffffffffffffoo............',
      '...........offffffffffffffffffffffffffffffffffffffffo...........',
      '..........offffffffffffffffffffffffffffffffffffffffffo..........',
      '.........offffffffffffffffffffffffffffooffffffffffffffo.........',
      '........offfffffffffffffffffffffffffffoofffffffffffffffo........',
      '.......offffffffffffffffffffffffffffffffffffffffffffffffo.......',
      '......offffffffffffffffffffffffffffffffffffffffffffffffffo......',
      '......offfffffffffffffoofffffffffffffffffffffffffffffffffo......',
      '.....offffffffffffffffooffffffffffffffffffffffffffffffffffo.....',
      '....offffffffffffffffffffffffffffffffffffffffffffffffffffffo....',
      '....offffffffffffffffffffffffffffffffffffffffffffffffffffffo....',
      '...offffffffffffffffffffffffffffffffffffffffooffffffffffffffo...',
      '...offffffffffffffffffffffffffffffffffffffffooffffffffffffffo...',
      '..offfffffffffffffffffffffffffoofffffffffffffffffffffffffffffo..',
      '..offfffffffffffffffffffffffffoofffffffffffffffffffffffffffffo..',
      '..offffffffffffffffffffffffffffffffffffffffffffffffffffffffffo..',
      '.offffffffffffffffffffffffffffffffffffffffffffffffffffffffffffo.',
      '.offffffffffffffffffffffffffffffffffffffffffffffffffffffffffffo.',
      '.offffffffffffffffffffffffffffffffffffffffffffffffffffffffffffo.',
      '.offffffffffffffffffffffffffffffffffffffffffffffffffffffffffffo.',
      'offffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffo',
      'offffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffo',
      'offffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffo',
      'offffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffo',
      'offffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffo',
    ],
  },
};

// 奥から順に描く。factor はカメラに対する動きの割合（小さいほど遠い）。y はステージの上からの位置
export const LAYERS = [
  { sprite: 'cloud', factor: 0.25, spacing: 150, ys: [20, 44, 28, 56] },
  // 山の下端を地面の上面（10行目 = 160）にそろえる
  { sprite: 'hill', factor: 0.5, spacing: 210, ys: [128] },
];

// 画面に入る分の位置（x は画面上、y はステージ上）
export function layerPositions(layer, camX, viewW, spriteW) {
  const offset = camX * layer.factor;
  const n = layer.ys.length;
  const first = Math.floor((offset - spriteW) / layer.spacing) + 1;
  const last = Math.floor((offset + viewW - 1) / layer.spacing);
  const out = [];
  for (let i = first; i <= last; i++) {
    out.push({ x: Math.round(i * layer.spacing - offset), y: layer.ys[((i % n) + n) % n] });
  }
  return out;
}
