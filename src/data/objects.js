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
const CLOUD_PAL = { o: '#88b8e8', w: '#ffffff', s: '#d0e8ff' };
const LAVA_PAL = { y: '#ffd040', o: '#ff6a00', r: '#d02000' };
const GATE_PAL = { k: '#202020', g: '#8a8a8a', w: '#d0d0d0' };

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
      '.......gg.......',
      '.......gg.......',
      '.......gg.......',
      '.......gg.......',
      '.......gg.......',
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
  // ゴールの旗の布（ゴールすると竿にそって下へ降りる）
  cloth: {
    palette: GOAL_PAL,
    rows: [
      '................',
      '................',
      '................',
      '..wwwww.........',
      '...wwww.........',
      '....www.........',
      '.....ww.........',
      '......w.........',
      ...Array(8).fill('................'),
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
  // 雲の足場（空のステージ）
  C: {
    palette: CLOUD_PAL,
    rows: [
      '..oooo....oooo..',
      '.owwwwo..owwwwo.',
      'owwwwwwoowwwwwwo',
      ...Array(7).fill('owwwwwwwwwwwwwwo'),
      'oswwwwwwwwwwwwso',
      'osswwwwwwwwwwsso',
      'osssswwwwwwsssso',
      'osssssssssssssso',
      'osssssssssssssso',
      'oooooooooooooooo',
    ],
  },
  // 溶岩（お城のステージ。触れるとミス）
  L: {
    palette: LAVA_PAL,
    rows: [
      'yy..yy..yy..yy..',
      'yyyyyyyyyyyyyyyy',
      'oyyoyyoyyoyyoyyo',
      ...Array(13).fill(0).map((_, i) => (i % 2 ? 'rrrroooorrrroooo' : 'oooorrrroooorrrr')),
    ],
  },
  // ボスの扉（ボスを倒すと消える）
  X: {
    palette: GATE_PAL,
    rows: ['kkkkkkkkkkkkkkkk', ...Array(14).fill('kgwkkgwkkgwkkgwk'), 'kkkkkkkkkkkkkkkk'],
  },
};

// ステージ4のボス（トゲの甲羅の亀。耳つき。左向き。32×32）。歩くときは2本足で立ち（上は頭なので踏める）、甲羅に入ると甲羅だけ
const BOSS_PAL = { s: '#8a4a12', S: '#4a2006', y: '#f0d060', Y: '#b08a20', w: '#ffffff', e: '#ffffff', g: '#3a9a3a', G: '#1e5a1e', k: '#000000' };

export const BOSS_SPRITES = {
  walkA: {
    palette: BOSS_PAL,
    rows: [
      '......G...GGGG...G..............',
      '.....GgGGGggggGGGgG.............',
      '.....GggggggggggggG.............',
      '.......kkkggggggG...............',
      '......GgeegggggggG..............',
      '......GgkegggggggG..............',
      '......GgggggggggggSSSS..........',
      '......GgggggggggggssssSS........',
      '.......kkkgggggggsssssssS..w....',
      '.......GgggggggggssssssssS.www..',
      '........GgggggggssssssssssSw....',
      '.........YggggyyysssssssssS.....',
      '........YyyyyyyyyyssssssssS.....',
      '......G.YyyyyyyyyysssssssssS.w..',
      '......gggyyyyyyyyyyssssssssS.www',
      '......gggyyyyyyyyyyssssssssS.w..',
      '......gggyyyyyyyyyyssssssssS....',
      '......gggyyyyyyyyyyssssssssS....',
      '......GYyyyyyyyyyyyssssssssS....',
      '.......YyyyyyyyyyyysssssssS.w...',
      '........YyyyyyyyyyssssssssS.www.',
      '........YyyyyyyyyyssssssssS.w...',
      '.........YyyyyyyyssssssssS......',
      '..........YyyyyYssssssssS.......',
      '...........YYYY.SSssssSS........',
      '..........gggg...ggggS..........',
      '..........gggg...gggg...........',
      '..........gggg...gggg...........',
      '..........gggg...gggg...........',
      '.........GGGGGG.GGGGGG..........',
      '.........GGGGGG.GGGGGG..........',
      '.........GGGGGG.GGGGGG..........',
    ],
  },
  walkB: {
    palette: BOSS_PAL,
    rows: [
      '......G...GGGG...G..............',
      '.....GgGGGggggGGGgG.............',
      '.....GggggggggggggG.............',
      '.......kkkggggggG...............',
      '......GgeegggggggG..............',
      '......GgkegggggggG..............',
      '......GgggggggggggSSSS..........',
      '......GgggggggggggssssSS........',
      '.......kkkgggggggsssssssS..w....',
      '.......GgggggggggssssssssS.www..',
      '........GgggggggssssssssssSw....',
      '.........YggggyyysssssssssS.....',
      '........YyyyyyyyyyssssssssS.....',
      '......G.YyyyyyyyyysssssssssS.w..',
      '......gggyyyyyyyyyyssssssssS.www',
      '......gggyyyyyyyyyyssssssssS.w..',
      '......gggyyyyyyyyyyssssssssS....',
      '......gggyyyyyyyyyyssssssssS....',
      '......GYyyyyyyyyyyyssssssssS....',
      '.......YyyyyyyyyyyysssssssS.w...',
      '........YyyyyyyyyyssssssssS.www.',
      '........YyyyyyyyyyssssssssS.w...',
      '.........YyyyyyyyssssssssS......',
      '..........YyyyyYssssssssS.......',
      '...........YYYY.SSssssSS........',
      '........gggg......Sgggg.........',
      '........gggg.......gggg.........',
      '........gggg.......gggg.........',
      '........gggg.......gggg.........',
      '.......GGGGGG.....GGGGGG........',
      '.......GGGGGG.....GGGGGG........',
      '.......GGGGGG.....GGGGGG........',
    ],
  },
  // 甲羅に入った状態（頭と足を引っこめる。トゲがあるので踏むとミス）
  shell: {
    palette: BOSS_PAL,
    rows: [
      '................................',
      '................................',
      '................................',
      '................................',
      '................................',
      '................................',
      '................................',
      '................................',
      '................................',
      '................................',
      '................................',
      '...............w....w...........',
      '...............w....w...........',
      '..........w...www..www...w......',
      '..........w...SSSSSSSS...w......',
      '.........wwwSSssssssssSSwww.....',
      '..........SSssssssssssssSS......',
      '.........SssssssssssssssssS.....',
      '........SssssssssssssssssssS....',
      '.......SssssssssssssssssssssS...',
      '.......SssssssssssssssssssssS...',
      '......SssssssssssssssssssssssS..',
      '......SssssssssssssssssssssssS..',
      '......SssssssssssssssssssssssS..',
      '......SssssssssssssssssssssssS..',
      '......SssssssssssssssssssssssS..',
      '......SssssssssssssssssssssssS..',
      '.......SssssssssssssssssssssS...',
      '.......SssssssssssssssssssssS...',
      '........SSSSSSSSSSSSSSSSSSSS....',
      '......yyyyyyyyyyyyyyyyyyyyyyyy..',
      '......yyyyyyyyyyyyyyyyyyyyyyyy..',
    ],
  },
};

// ボスの火の玉（Level 3）。12×8
export const FIREBALL = {
  palette: { r: '#d02000', o: '#ff8000', y: '#ffe040' },
  rows: [
    '...rrrr.....',
    '.rroooorr...',
    'roooyyyyoor.',
    'rooyyyyyyyor',
    'rooyyyyyyyor',
    'roooyyyyoor.',
    '.rroooorr...',
    '...rrrr.....',
  ],
};
