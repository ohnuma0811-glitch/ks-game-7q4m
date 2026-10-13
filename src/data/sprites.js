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
  N: '#c0705e', // 乳首（服が脱げたとき）
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
  '.....SSSSSSS....',
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

// 服が脱げた絵（シャツとシャツのマークを肌の色にして、胸に乳首を2つ）
function bare(fr, shirt) {
  return Object.fromEntries(Object.entries(fr).map(([k, rows]) => {
    // 乳首はシャツの一番上の段の2つ下。体のはしから3ドット内側に、左右1つずつ
    const y = rows.findIndex((r) => r.includes(shirt)) + 2;
    const left = rows[y].indexOf(shirt) + 3;
    const right = rows[y].lastIndexOf(shirt) - 3;
    return [k, rows.map((r, i) => {
      let row = r;
      if (i === y) row = [...row].map((c, x) => (x === left || x === right ? 'N' : c)).join('');
      return row.replaceAll(shirt, 'S').replaceAll('W', 'S');
    })];
  }));
}

const KYUGO_FRAMES = frames(KYUGO_TOP, KYUGO_LEGS);
const SOKI_FRAMES = frames(SOKI_TOP, SOKI_LEGS);

export const AVATARS = {
  kyugo: { palette: { ...CHAR_PALETTE, K: '#c11f0a' }, frames: KYUGO_FRAMES, bareFrames: bare(KYUGO_FRAMES, 'K') },
  soki: { palette: { ...CHAR_PALETTE, L: '#1c3c88' }, frames: SOKI_FRAMES, bareFrames: bare(SOKI_FRAMES, 'L') },
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
