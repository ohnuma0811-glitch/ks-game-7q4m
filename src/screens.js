import { MAX_NAME, DIFFICULTY_IDS } from './flow.js?v=b55e073';

// 画面ごとの見出しとボタン（DOM に依存しない。ui.js が HTML にする）
export const GAME_TITLE = 'KyugoとSokiの大冒険';
export const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const DIFFICULTY_LABELS = { easy: 'かんたん', normal: 'ふつう', hard: 'むずかしい' };

export function screenModel(flow) {
  switch (flow.screen) {
    case 'title':
      // 2人のゲームだとわかるよう、左に Kyugo・右に Soki を大きく出す
      return { id: 'title', heading: GAME_TITLE, heroes: ['kyugo', 'soki'], buttons: [{ label: 'スタート', act: 'start', primary: true }] };
    case 'name': {
      const full = flow.name.length >= MAX_NAME;
      return {
        id: 'name',
        heading: 'なまえを いれてね',
        nameBox: flow.name.padEnd(MAX_NAME, '_'),
        letters: LETTERS.map((ch) => ({ label: ch, act: 'typeLetter', arg: ch, disabled: full })),
        buttons: [
          { label: 'けす', act: 'deleteLetter', disabled: flow.name.length === 0 },
          { label: 'OK', act: 'confirmName', primary: true, disabled: !flow.canConfirmName() },
          { label: 'もどる', act: 'back' },
        ],
      };
    }
    case 'avatar':
      return {
        id: 'avatar',
        heading: 'キャラを えらんでね',
        avatars: [
          { label: 'KYUGO', act: 'chooseAvatar', arg: 'kyugo' },
          { label: 'SOKI', act: 'chooseAvatar', arg: 'soki' },
        ],
        buttons: [{ label: 'もどる', act: 'back' }],
      };
    case 'difficulty':
      return {
        id: 'difficulty',
        heading: 'むずかしさを えらんでね',
        buttons: [
          ...DIFFICULTY_IDS.map((d) => ({ label: DIFFICULTY_LABELS[d], act: 'chooseDifficulty', arg: d, primary: true })),
          { label: 'もどる', act: 'back' },
        ],
      };
    case 'intro':
      return { id: 'intro', heading: `STAGE ${flow.stageIndex + 1}`, text: `${flow.name} ×${flow.carry.lives}`, buttons: [] };
    case 'play':
      if (!flow.paused) return null;
      return {
        id: 'pause',
        heading: 'ポーズ',
        guard: true,
        buttons: [
          { label: 'つづける', act: 'resume', primary: true },
          { label: 'タイトルへ', act: 'quitToTitle' },
        ],
      };
    case 'result': {
      const r = flow.result;
      return {
        id: 'result',
        guard: true,
        heading: r.type === 'clear' ? 'ALL CLEAR!' : 'GAME OVER',
        text: `SCORE ${r.score}  COIN ${r.coins}`,
        buttons: [{ label: 'タイトルへ', act: 'finish', primary: true }],
      };
    }
    default:
      return null;
  }
}

const ACTIONS = new Set([
  'start', 'typeLetter', 'deleteLetter', 'confirmName', 'back',
  'chooseAvatar', 'chooseDifficulty', 'resume', 'quitToTitle', 'finish',
]);

export function dispatch(flow, act, arg) {
  if (ACTIONS.has(act)) flow[act](arg);
}
