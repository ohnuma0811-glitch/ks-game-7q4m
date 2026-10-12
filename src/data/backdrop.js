// 背景の富士山・雲・丸い山（ステージ1の草原）。地面より遅くスクロールさせて奥行きを出す
export const BACKDROP_SPRITES = {
  // 富士山（遠くの青い山。てっぺんに雪、すそ野に向かって広がる。地面より下まで描いて穴の所でも浮かない）
  fuji: {
    palette: { o: '#2a4f86', f: '#4a78bf', w: '#ffffff' },
    rows: [
      '.......................................................................................oooooooooooooooooo.......................................................................................',
      '.......................................................................................owwwwwwwwwwwwwwwwo.......................................................................................',
      '.......................................................................................owwwwwwwwwwwwwwwwo.......................................................................................',
      '.......................................................................................owwwwwwwwwwwwwwwwo.......................................................................................',
      '......................................................................................owwwwwwwwwwwwwwwwwwo......................................................................................',
      '......................................................................................owwwwwwwwwwwwwwwwwwo......................................................................................',
      '......................................................................................owwwwwwwwwwwwwwwwwwo......................................................................................',
      '.....................................................................................owwwwwwwwwwwwwwwwwwwwo.....................................................................................',
      '.....................................................................................owwwwwwwwwwwwwwwwwwwwo.....................................................................................',
      '....................................................................................owwwwwwwwwwwwwwwwwwwwwwo....................................................................................',
      '....................................................................................owwwwwwwwwwwwwwwwwwwwwwo....................................................................................',
      '...................................................................................owwwwwwwwwwwwwwwwwwwwwwwwo...................................................................................',
      '..................................................................................owwwwwwwwwwwwwwwwwwwwwwwwwwo..................................................................................',
      '..................................................................................owffffffwwwwwwffffffwwwwwwfo..................................................................................',
      '.................................................................................owwffffffwwwwwwffffffwwwwwwffo.................................................................................',
      '................................................................................owwwffffffwwwwwwffffffwwwwwwfffo................................................................................',
      '...............................................................................owwwwffffffwwwwwwffffffwwwwwwffffo...............................................................................',
      '..............................................................................owwwwwffffffwwwwwwffffffwwwwwwfffffo..............................................................................',
      '.............................................................................offffffffffffffffffffffffffffffffffffo.............................................................................',
      '............................................................................offffffffffffffffffffffffffffffffffffffo............................................................................',
      '...........................................................................offffffffffffffffffffffffffffffffffffffffo...........................................................................',
      '..........................................................................offffffffffffffffffffffffffffffffffffffffffo..........................................................................',
      '.........................................................................offffffffffffffffffffffffffffffffffffffffffffo.........................................................................',
      '.......................................................................ooffffffffffffffffffffffffffffffffffffffffffffffoo.......................................................................',
      '......................................................................offffffffffffffffffffffffffffffffffffffffffffffffffo......................................................................',
      '.....................................................................offffffffffffffffffffffffffffffffffffffffffffffffffffo.....................................................................',
      '...................................................................ooffffffffffffffffffffffffffffffffffffffffffffffffffffffoo...................................................................',
      '..................................................................offffffffffffffffffffffffffffffffffffffffffffffffffffffffffo..................................................................',
      '.................................................................offffffffffffffffffffffffffffffffffffffffffffffffffffffffffffo.................................................................',
      '...............................................................ooffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffoo...............................................................',
      '.............................................................ooffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffoo.............................................................',
      '............................................................offffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffo............................................................',
      '..........................................................ooffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffoo..........................................................',
      '........................................................ooffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffoo........................................................',
      '.......................................................offffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffo.......................................................',
      '.....................................................ooffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffoo.....................................................',
      '...................................................ooffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffoo...................................................',
      '.................................................ooffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffoo.................................................',
      '...............................................ooffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffoo...............................................',
      '.............................................ooffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffoo.............................................',
      '...........................................ooffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffoo...........................................',
      '.........................................ooffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffoo.........................................',
      '.......................................ooffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffoo.......................................',
      '.....................................ooffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffoo.....................................',
      '...................................ooffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffoo...................................',
      '................................oooffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffooo................................',
      '..............................ooffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffoo..............................',
      '............................ooffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffoo............................',
      '.........................oooffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffooo.........................',
      '.......................ooffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffoo.......................',
      '....................oooffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffooo....................',
      '..................ooffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffoo..................',
      '...............oooffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffooo...............',
      '.............ooffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffoo.............',
      '..........oooffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffooo..........',
      '.......oooffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffooo.......',
      '......offffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffo......',
      '......offffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffo......',
      '......offffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffo......',
      '.....offffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffo.....',
      '.....offffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffo.....',
      '.....offffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffo.....',
      '.....offffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffo.....',
      '.....offffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffo.....',
      '....offffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffo....',
      '....offffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffo....',
      '....offffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffo....',
      '....offffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffo....',
      '....offffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffo....',
      '...offffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffo...',
      '...offffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffo...',
      '...offffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffo...',
      '...offffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffo...',
      '...offffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffo...',
      '...offffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffo...',
      '..offffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffo..',
      '..offffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffo..',
      '..offffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffo..',
      '..offffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffo..',
      '..offffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffo..',
      '.offffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffo.',
      '.offffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffo.',
      '.offffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffo.',
      '.offffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffo.',
      '.offffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffo.',
      'offffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffo',
      'offffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffo',
      'offffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffo',
    ],
  },
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
const GRASS_LAYERS = [
  // 一番遠い富士山。地面から上に56ドット見え、すそ野は地面の下（ステージの下端）まで続く
  { sprite: 'fuji', factor: 0.12, spacing: 640, ys: [104] },
  { sprite: 'cloud', factor: 0.25, spacing: 150, ys: [20, 44, 28, 56] },
  // 山の下端を地面の上面（10行目 = 160）にそろえる。穴の所で浮いて見えないよう、下は画面の下まで塗り足す
  { sprite: 'hill', factor: 0.5, spacing: 210, ys: [128], fillBelow: true },
];

// ステージごとの背景（奥から順）。地下とお城は背景なし
export const BACKDROPS = {
  grass: GRASS_LAYERS,
  underground: [],
  // 空: 遠くの小さな動きの雲と、近くの雲
  sky: [
    { sprite: 'cloud', factor: 0.15, spacing: 120, ys: [30, 70, 50, 90] },
    { sprite: 'cloud', factor: 0.4, spacing: 170, ys: [100, 20, 130, 60] },
  ],
  castle: [],
};

// 草原の背景（テストや古い呼び出し用）
export const LAYERS = GRASS_LAYERS;

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
