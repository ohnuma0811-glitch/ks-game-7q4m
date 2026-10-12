// 3つの難易度。ステージの地形は共通で、敵・救済・チェックポイントが変わる
export const DIFFICULTIES = {
  easy: {
    label: 'EASY',
    enemySpeed: 0.6,
    pitRescue: true,
    checkpoints: ['h', 'H'],
    enemyChars: ['w', 'j', 'S'],
  },
  normal: {
    label: 'NORMAL',
    enemySpeed: 1,
    pitRescue: false,
    checkpoints: ['H'],
    enemyChars: ['w', 'W', 'j', 'J', 'S'],
  },
  hard: {
    label: 'HARD',
    enemySpeed: 1.3,
    pitRescue: false,
    checkpoints: [],
    enemyChars: ['w', 'W', 'x', 'j', 'J', 'y', 'S'],
  },
};

export function getDifficulty(name) {
  return DIFFICULTIES[name] || DIFFICULTIES.normal;
}
