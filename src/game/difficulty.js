// 3つの難易度。ステージの地形は共通で、敵の数・速さ・チェックポイントが変わる
// M3 実機確認で調整: かんたん＝以前のふつう、ふつう＝敵2倍、むずかしい＝敵2倍で速く
export const DIFFICULTIES = {
  easy: {
    label: 'LEVEL 1',
    enemySpeed: 1,
    checkpoints: ['H'],
    enemyChars: ['w', 'j', 'S'],
    // ボスが甲羅に入るまでに歩く時間（更新数）と、火の玉を吹くか
    bossWalk: 150,
    bossFire: 0,
    bossRandom: false,
  },
  normal: {
    label: 'LEVEL 2',
    enemySpeed: 1,
    checkpoints: ['H'],
    enemyChars: ['w', 'W', 'j', 'J', 'R', 'S'],
    bossWalk: 100,
    bossFire: 2,
    bossRandom: false,
  },
  hard: {
    label: 'LEVEL 3',
    enemySpeed: 1.6,
    checkpoints: [],
    enemyChars: ['w', 'W', 'x', 'j', 'J', 'y', 'R', 'r', 'S', 'z'],
    // R のカエルを赤いカエル（火を吹く）にする
    redFrog: true,
    // ライフアップ（ドリンク）は出さず、コインにする
    noDrink: true,
    bossWalk: 70,
    bossFire: 1,
    // 甲羅に入るまでの時間と、甲羅に入っている時間を毎回ランダムに
    bossRandom: true,
  },
};

export function getDifficulty(name) {
  return DIFFICULTIES[name] || DIFFICULTIES.normal;
}
