// ドット絵データ（文字1つ＝1ドット、'.' は透明）。右向きで描く
const CHAR_PALETTE = {
  H: '#1a1a1a', // 髪
  S: '#f2c9a0', // 肌
  E: '#1a1a1a', // 目
  M: '#7a2a2a', // 口
  T: '#ffffff', // 歯
  W: '#ffffff', // シャツのマーク
  P: '#222222', // ハーフパンツ
  O: '#ffffff', // 靴下
  B: '#111111', // 靴
};

const KYUGO_TOP = [
  '....H.H.H.......',
  '...HHHHHHHHH....',
  '.HHHHHHHHHHH....',
  '.HHHHHHHHHHHHH..',
  '..HHHHSHSHSHH...',
  '..HHSSSSSSSSS...',
  '..HHSSSSSESES...',
  '...HSSSSSESES...',
  '...SSSSSSSSSS...',
  '....SSSSMTTMS...',
  '.....SSSSSS.....',
  '....KKKKKKKK....',
  '...KKKKKKKKKK...',
  '..SKKKWKKKKKKS..',
  '..SKKWKWKKKKKS..',
  '..SKKKWKKKKKKS..',
  '....KKKKKKKK....',
  '....PPPPPPPP....',
  '....PPPPPPPP....',
];

const KYUGO_LEGS = {
  stand: [
    '....PPP..PPP....',
    '....SSS..SSS....',
    '....OOO..OOO....',
    '....BBBB.BBBB...',
    '....BBBB.BBBB...',
  ],
  walkA: [
    '...PPP....PPP...',
    '..SSS......SSS..',
    '..OOO......OOO..',
    '.BBBB......BBBB.',
    '.BBBB......BBBB.',
  ],
  walkB: [
    '.....PPPPPP.....',
    '......SSSS......',
    '......OOOO......',
    '.....BBBBBB.....',
    '.....BBBBBB.....',
  ],
  jump: [
    '....PPP..PPPP...',
    '....SSS...SSSS..',
    '....OOO....OOO..',
    '...BBBB....BBBB.',
    '................',
  ],
};

const SOKI_TOP = [
  '................',
  '................',
  '.....HHHHHH.....',
  '...HHHHHHHHHH...',
  '..HHHHHHHHHHHH..',
  '..HHHHHHHHHHHH..',
  '..HHHHHHHHHHHH..',
  '..HHSSSSSSESS...',
  '..HHSSSSSSESS...',
  '...SSSSSSSSSSS..',
  '...SSSSSMTMTM...',
  '....SSSSSSSS....',
  '....LLLLLLLL....',
  '...LLLLLLLLLL...',
  '..SLLLWWLLLLLS..',
  '..SLLLWWLLLLLS..',
  '....LLLLLLLL....',
  '....PPPPPPPP....',
];

const SOKI_LEGS = {
  stand: [
    '....PPP..PPP....',
    '....SSS..SSS....',
    '....OOO..OOO....',
    '....OOO..OOO....',
    '....BBBB.BBBB...',
    '....BBBB.BBBB...',
  ],
  walkA: [
    '...PPP....PPP...',
    '..SSS......SSS..',
    '..OOO......OOO..',
    '..OOO......OOO..',
    '.BBBB......BBBB.',
    '.BBBB......BBBB.',
  ],
  walkB: [
    '.....PPPPPP.....',
    '......SSSS......',
    '......OOOO......',
    '......OOOO......',
    '.....BBBBBB.....',
    '.....BBBBBB.....',
  ],
  jump: [
    '....PPP..PPPP...',
    '....SSS...SSSS..',
    '....OOO....OOO..',
    '....OOO....OOO..',
    '...BBBB....BBBB.',
    '................',
  ],
};

function frames(top, legs) {
  return Object.fromEntries(Object.entries(legs).map(([k, v]) => [k, top.concat(v)]));
}

export const AVATARS = {
  kyugo: { palette: { ...CHAR_PALETTE, K: '#c11f0a' }, frames: frames(KYUGO_TOP, KYUGO_LEGS) },
  soki: { palette: { ...CHAR_PALETTE, L: '#1c3c88' }, frames: frames(SOKI_TOP, SOKI_LEGS) },
};

export const TILE_PALETTE = { o: '#fc9838', b: '#c84c0c', d: '#000000' };

export const TILES = {
  // 地面
  G: [
    'oooooooooooooood',
    'obbbbbbbbbbbbbbd',
    'obbbbbbbbbbbbbbd',
    'obbbbbbbbbbbbbbd',
    'obbbdbbbbbbbbbbd',
    'obbbbbbbbbbbbbbd',
    'obbbbbbbbbbbbbbd',
    'obbbbbbbbbbbbbbd',
    'obbbbbbbbbbbbbbd',
    'obbbbbbbbbdbbbbd',
    'obbbbbbbbbbbbbbd',
    'obbbbbbbbbbbbbbd',
    'obbbbbdbbbbbbbbd',
    'obbbbbbbbbbbbbbd',
    'obbbbbbbbbbbbbbd',
    'dddddddddddddddd',
  ],
  // レンガ
  B: [
    'oooooooooooooooo',
    'bbbbbbbdbbbbbbbb',
    'bbbbbbbdbbbbbbbb',
    'bbbbbbbdbbbbbbbb',
    'dddddddddddddddd',
    'bbbdbbbbbbbdbbbb',
    'bbbdbbbbbbbdbbbb',
    'bbbdbbbbbbbdbbbb',
    'dddddddddddddddd',
    'bbbbbbbdbbbbbbbb',
    'bbbbbbbdbbbbbbbb',
    'bbbbbbbdbbbbbbbb',
    'dddddddddddddddd',
    'bbbdbbbbbbbdbbbb',
    'bbbdbbbbbbbdbbbb',
    'dddddddddddddddd',
  ],
};

export function parseSprite(rows, palette) {
  const w = rows[0].length;
  const data = [];
  for (const row of rows) {
    if (row.length !== w) throw new Error(`行の幅 ${row.length} が ${w} と違います: ${row}`);
    for (const ch of row) {
      if (ch === '.') data.push(null);
      else if (palette[ch]) data.push(palette[ch]);
      else throw new Error(`パレットにない文字 '${ch}'`);
    }
  }
  return { w, h: rows.length, data };
}
