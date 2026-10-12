// 敵・アイテム・ブロック・ゴールのドット絵（16×16、'.' は透明）
const WALKER_PAL = { a: '#9c5a2a', k: '#000000', w: '#ffffff', f: '#f2c9a0' };
const JUMPER_PAL = { g: '#2e9e3e', l: '#9be38a', k: '#000000', w: '#ffffff', r: '#c0392b' };
const SPIKE_PAL = { p: '#7b2fbe', q: '#c39bd3', k: '#000000', w: '#ffffff', s: '#e8e8e8' };
const COIN_PAL = { y: '#f8d030', o: '#c88800', w: '#ffffff' };
const DRINK_PAL = { w: '#ffffff', l: '#1f4fbf', r: '#e02020', s: '#bbbbbb' };
const STAR_PAL = { y: '#f8d030', k: '#000000' };
const GOAL_PAL = { y: '#f8d030', g: '#2e9e3e', w: '#ffffff' };
const CHECK_PAL = { k: '#444444', r: '#e02020' };
const CHECK_ON_PAL = { k: '#444444', r: '#2ecc40' };
const BLOCK_PAL = { q: '#f8b800', w: '#ffffff', d: '#8a4517', u: '#a0522d', k: '#000000' };

const empty = (n) => Array(n).fill('................');

export const ENEMIES = {
  // 歩く敵（くり坊）
  walker: {
    palette: WALKER_PAL,
    rows: [
      '................',
      '.....aaaaaa.....',
      '...aaaaaaaaaa...',
      '..aaaaaaaaaaaa..',
      '.aawwkaaaakwwaa.',
      '.aawwkaaaakwwaa.',
      'aaaaaaaaaaaaaaaa',
      'aaaaaaaaaaaaaaaa',
      '.aaaaaaaaaaaaaa.',
      '....ffffffff....',
      '...ffffffffff...',
      '...ffffffffff...',
      '..kkkk....kkkk..',
      '.kkkkk....kkkkk.',
      '.kkkk......kkkk.',
      '................',
    ],
  },
  walkerFlat: {
    palette: WALKER_PAL,
    rows: [
      ...empty(10),
      '..aaaaaaaaaaaa..',
      '.aawwkaaaakwwaa.',
      'aaaaaaaaaaaaaaaa',
      '..kkkk....kkkk..',
      '.kkkkk....kkkkk.',
      '................',
    ],
  },
  // ジャンプしてくる敵（かえる）
  jumper: {
    palette: JUMPER_PAL,
    rows: [
      '................',
      '..www......www..',
      '.wwkww....wwkww.',
      '.wwkwwggggwwkww.',
      '..wwwggggggwww..',
      '..gggggggggggg..',
      '.gggrrrrrrrrggg.',
      '.ggggrrrrrrgggg.',
      '.gggggggggggggg.',
      'ggglllllllllggg.',
      '.gglllllllllgg..',
      '.ggllllllllgg...',
      '..gggggggggg....',
      '.ggg......ggg...',
      'gggg......gggg..',
      '................',
    ],
  },
  jumperFlat: {
    palette: JUMPER_PAL,
    rows: [
      ...empty(10),
      '..wwwggggggwww..',
      '.gggggggggggggg.',
      'ggglllllllllggg.',
      '.ggg......ggg...',
      'gggg......gggg..',
      '................',
    ],
  },
  // 踏めない敵（トゲトゲ）
  spike: {
    palette: SPIKE_PAL,
    rows: [
      '.......s........',
      '...s...s...s....',
      '....s.ppp.s.....',
      '..s.ppppppp.s...',
      '...ppqqpppppp...',
      '..pppqpppppppp..',
      'sppppwwppwwpppps',
      '.pppwkwppwkwppp.',
      '.pppppppppppppp.',
      'sppppppppppppps.',
      '..pppkkkkkkppp..',
      '...pppppppppp...',
      '..s.pppppppp.s..',
      '.....s....s.....',
      '....s......s....',
      '................',
    ],
  },
};

export const ITEMS = {
  coin: {
    palette: COIN_PAL,
    rows: [
      '................',
      '......yyyy......',
      '.....yyyyyy.....',
      '....yywyyyyy....',
      '....ywyyyoyy....',
      '....ywyyyoyy....',
      '....ywyyyoyy....',
      '....ywyyyoyy....',
      '....ywyyyoyy....',
      '....ywyyyoyy....',
      '....yyyyyoyy....',
      '....yyyyyyyy....',
      '.....yyyyyy.....',
      '......yyyy......',
      '................',
      '................',
    ],
  },
  // 100PLUS 風のドリンク（白と青の缶に赤い＋。本物のロゴや文字は描かない）
  drink: {
    palette: DRINK_PAL,
    rows: [
      '....ssssssss....',
      '...ssssssssss...',
      '...wwwwwwwwww...',
      '...wllllllllw...',
      '...wwwwwwwwww...',
      '...wwwwrrwwww...',
      '...wwwwrrwwww...',
      '...wwrrrrrrww...',
      '...wwrrrrrrww...',
      '...wwwwrrwwww...',
      '...wwwwrrwwww...',
      '...wwwwwwwwww...',
      '...wllllllllw...',
      '...llllllllll...',
      '...ssssssssss...',
      '....ssssssss....',
    ],
  },
  star: {
    palette: STAR_PAL,
    rows: [
      '.......yy.......',
      '.......yy.......',
      '......yyyy......',
      '......yyyy......',
      'yyyyyyyyyyyyyyyy',
      '.yyyyyyyyyyyyyy.',
      '..yyyykyykyyyy..',
      '...yyykyykyyy...',
      '....yyyyyyyy....',
      '....yyyyyyyy....',
      '...yyyyyyyyyy...',
      '...yyyyyyyyyy...',
      '..yyyyy..yyyyy..',
      '..yyyy....yyyy..',
      '.yyy........yyy.',
      '.y............y.',
    ],
  },
  // ゴールの旗（一番上）と旗竿
  flag: {
    palette: GOAL_PAL,
    rows: [
      '......yyyy......',
      '......yyyy......',
      '.......gg.......',
      '..wwwwwgg.......',
      '...wwwwgg.......',
      '....wwwgg.......',
      '.....wwgg.......',
      '......wgg.......',
      '.......gg.......',
      '.......gg.......',
      '.......gg.......',
      '.......gg.......',
      '.......gg.......',
      '.......gg.......',
      '.......gg.......',
      '.......gg.......',
    ],
  },
  pole: {
    palette: GOAL_PAL,
    rows: Array(16).fill('.......gg.......'),
  },
  // チェックポイント（通過前は赤、通過後は緑）
  check: {
    palette: CHECK_PAL,
    rows: [
      '................',
      '................',
      '.....kk.........',
      '.....krrrrrr....',
      '.....krrrrr.....',
      '.....krrrr......',
      '.....krr........',
      ...Array(9).fill('.....k..........'),
    ],
  },
  checkOn: {
    palette: CHECK_ON_PAL,
    rows: [
      '................',
      '................',
      '.....kk.........',
      '.....krrrrrr....',
      '.....krrrrr.....',
      '.....krrrr......',
      '.....krr........',
      ...Array(9).fill('.....k..........'),
    ],
  },
};

export const BLOCKS = {
  // ？ブロック
  Q: {
    palette: BLOCK_PAL,
    rows: [
      'qqqqqqqqqqqqqqqd',
      'qwqqqqqqqqqqqwqd',
      'qqqqqddddqqqqqqd',
      'qqqqddqqddqqqqqd',
      'qqqqddqqddqqqqqd',
      'qqqqqqqqddqqqqqd',
      'qqqqqqqddqqqqqqd',
      'qqqqqqddqqqqqqqd',
      'qqqqqqddqqqqqqqd',
      'qqqqqqqqqqqqqqqd',
      'qqqqqqddqqqqqqqd',
      'qqqqqqddqqqqqqqd',
      'qqqqqqqqqqqqqqqd',
      'qwqqqqqqqqqqqwqd',
      'qqqqqqqqqqqqqqqd',
      'dddddddddddddddd',
    ],
  },
  // 使用済みブロック
  U: {
    palette: BLOCK_PAL,
    rows: [
      'uuuuuuuuuuuuuuuk',
      'ukuuuuuuuuuuukuk',
      ...Array(11).fill('uuuuuuuuuuuuuuuk'),
      'ukuuuuuuuuuuukuk',
      'uuuuuuuuuuuuuuuk',
      'kkkkkkkkkkkkkkkk',
    ],
  },
};
