// 3つの難易度。ステージの地形は共通で、敵の数・速さ・チェックポイントが変わる
// M3 実機確認で調整: かんたん＝以前のふつう、ふつう＝敵2倍、むずかしい＝敵2倍で速く
export const DIFFICULTIES = {
  easy: {
    label: 'EASY',
    enemySpeed: 1,
    checkpoints: ['H'],
    enemyChars: ['w', 'j', 'S'],
  },
  normal: {
    label: 'NORMAL',
    enemySpeed: 1,
    checkpoints: ['H'],
    enemyChars: ['w', 'W', 'j', 'J', 'S'],
  },
  hard: {
    label: 'HARD',
    enemySpeed: 1.6,
    checkpoints: [],
    enemyChars: ['w', 'W', 'x', 'j', 'J', 'y', 'S'],
  },
};

export function getDifficulty(name) {
  return DIFFICULTIES[name] || DIFFICULTIES.normal;
}
