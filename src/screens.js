import { MAX_NAME, DIFFICULTY_IDS } from './flow.js?v=2f88e93';

// 画面ごとの見出しとボタン（DOM に依存しない。ui.js が HTML にする）
export const GAME_TITLE = 'KyugoとSokiの大冒険';
// 名前入力は、パソコンのキーボードと同じ並び
export const KEY_ROWS = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'];
// 難易度は Level 1〜3 で表す（中の名前は easy / normal / hard のまま）
const DIFFICULTY_LABELS = { easy: 'Level 1', normal: 'Level 2', hard: 'Level 3' };

export function screenModel(flow) {
  switch (flow.screen) {
    case 'title':
      // 2人のゲームだとわかるよう、左に Kyugo・右に Soki を大きく出す
      return { id: 'title', heading: GAME_TITLE, heroes: ['kyugo', 'soki'], buttons: [{ label: 'スタート', act: 'start', primary: true }, { label: 'ランキング', act: 'openRanking' }] };
    case 'pick':
      if (flow.deleting) {
        return {
          id: 'confirmDelete',
          heading: `${flow.deleting} を けしますか？`,
          buttons: [
            { label: 'けす', act: 'confirmDelete', primary: true },
            { label: 'やめる', act: 'cancelDelete' },
          ],
        };
      }
      return {
        id: 'pick',
        heading: 'だれが あそぶ？',
        savedNames: flow.savedNames.map((n) => ({ label: n, act: 'pickName', arg: n, remove: { label: '×', act: 'askDelete', arg: n } })),
        buttons: [
          { label: 'あたらしい なまえ', act: 'newName', primary: true },
          { label: 'もどる', act: 'back' },
        ],
      };
    case 'name': {
      const full = flow.name.length >= MAX_NAME;
      return {
        id: 'name',
        heading: 'なまえを いれてね',
        nameBox: flow.name.padEnd(MAX_NAME, '_'),
        keyRows: KEY_ROWS.map((row) => row.split('').map((ch) => ({ label: ch, act: 'typeLetter', arg: ch, disabled: full }))),
        // OK は一番右
        buttons: [
          { label: 'もどる', act: 'back' },
          { label: 'けす', act: 'deleteLetter', disabled: flow.name.length === 0 },
          { label: 'OK', act: 'confirmName', primary: true, disabled: !flow.canConfirmName() },
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
        rankText: r.rank > 0 ? `ランクイン！ ${r.rank}位` : undefined,
        buttons: [
          { label: 'ランキング', act: 'openResultRanking' },
          { label: 'もう一度やる', act: 'retry' },
          { label: 'タイトルへ', act: 'finish', primary: true },
        ],
      };
    }
    case 'ranking':
      return rankingModel(flow);
    case 'ending':
      return {
        id: 'ending',
        heading: 'Congratulations!',
        text: 'You cleared all stages!',
        heroes: ['kyugo', 'soki'],
        credits: endingCredits(flow),
        guard: true,
        // 連打でエンドロールを飛ばさないよう、つぎへ は3秒たってから
        guardMs: 3000,
        buttons: [{ label: 'つぎへ', act: 'endingDone', primary: true }],
      };
    default:
      return null;
  }
}

// エンドロール（下から上へ流れる）
function endingCredits(flow) {
  return [
    'You cleared all stages!',
    '',
    'KyugoとSokiの大冒険',
    '',
    '― しゅやく ―',
    'Kyugo',
    'Soki',
    '',
    '― ステージ ―',
    '1 そうげん',
    '2 ちか',
    '3 そら',
    '4 おしろ',
    '',
    '― プレイヤー ―',
    flow.name,
    `SCORE ${flow.result.score}`,
    '',
    'ゲームばかりしてないで、べんきょうしなさい！',
    '',
    'お父さんより',
  ];
}

function rankingModel(flow) {
  if (flow.confirmingReset) {
    return {
      id: 'confirmReset',
      heading: 'ランキングを ぜんぶ けしますか？',
      buttons: [
        { label: 'けす', act: 'confirmReset', primary: true },
        { label: 'やめる', act: 'cancelReset' },
      ],
    };
  }
  const level = flow.rankingLevel;
  const hl = flow.highlight && flow.highlight.level === level ? flow.highlight.rank : 0;
  const rows = flow.ranking[level].map((e, i) => ({
    rank: i + 1, name: e.name, avatar: e.avatar, date: e.date, score: e.score, highlight: i + 1 === hl,
  }));
  const buttons = [{ label: 'もどる', act: 'back' }];
  // リセットは大人向け。3秒押し続けたときだけ
  if (flow.rankingAvailable) buttons.push({ label: 'リセット（ながおし）', act: 'askReset', longPress: true });
  return {
    id: 'ranking',
    heading: 'ランキング',
    tabs: DIFFICULTY_IDS.map((d) => ({ label: DIFFICULTY_LABELS[d], act: 'showRanking', arg: d, selected: d === level })),
    rows,
    empty: rows.length === 0 ? 'まだ きろくが ありません' : undefined,
    notice: flow.rankingAvailable ? undefined : 'この端末では きろくできません',
    buttons,
  };
}

const ACTIONS = new Set([
  'start', 'typeLetter', 'deleteLetter', 'confirmName', 'back',
  'pickName', 'newName', 'askDelete', 'confirmDelete', 'cancelDelete',
  'openRanking', 'openResultRanking', 'showRanking', 'askReset', 'confirmReset', 'cancelReset',
  'endingDone',
  'chooseAvatar', 'chooseDifficulty', 'resume', 'quitToTitle', 'finish', 'retry',
]);

export function dispatch(flow, act, arg) {
  if (ACTIONS.has(act)) flow[act](arg);
}
