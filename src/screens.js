import { MAX_NAME, DIFFICULTY_IDS, RESET_PASSWORD } from './flow.js?v=1332750';

// ランキングの画面に出す順位（レベルごと）
export const RANK_SHOWN = 5;

// ホーム画面への追加のしかた（ブラウザの追加の画面を出せない端末）
const INSTALL_HELP = {
  ios: '画面の 下（iPad は 上）の 共有ボタン（□に↑）→「ホーム画面に追加」',
  android: '右上の「︙」→「ホーム画面に追加」（または「アプリをインストール」）',
};

// 画面ごとの見出しとボタン（DOM に依存しない。ui.js が HTML にする）
export const GAME_TITLE = 'KyugoとSokiの大冒険';
// 名前入力は、パソコンのキーボードと同じ並び
export const KEY_ROWS = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'];
// 難易度は Level 1〜3 で表す（中の名前は easy / normal / hard のまま）
const DIFFICULTY_LABELS = { easy: 'Level 1', normal: 'Level 2', hard: 'Level 3' };

export function screenModel(flow) {
  switch (flow.screen) {
    case 'install':
      return {
        id: 'install',
        heading: 'ホーム画面に ついかしますか？',
        text: 'アプリのように ぜんがめんで あそべます',
        buttons: [
          { label: 'ついかする', act: 'installYes', primary: true },
          { label: 'あとで', act: 'installLater' },
        ],
      };
    case 'installHelp':
      return {
        id: 'installHelp',
        heading: 'ホーム画面に ついかする',
        text: INSTALL_HELP[flow.install && flow.install.platform] || INSTALL_HELP.android,
        buttons: [{ label: 'わかった', act: 'installDone', primary: true }],
      };
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
        // ランキングの画面に出る5位までのとき
        rankText: r.rank > 0 && r.rank <= RANK_SHOWN ? `ランクイン！ ${r.rank}位` : undefined,
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
    'ゲームばかりしてないで、',
    'べんきょうしなさい！',
    '',
    'お父さんより',
  ];
}

function rankingNotice(flow) {
  if (flow.rankingLoading) return 'よみこみちゅう…';
  if (flow.shared) return 'みんなの ランキング';
  return flow.rankingAvailable ? undefined : 'この端末では きろくできません';
}

function rankingModel(flow) {
  if (flow.confirmingReset) {
    // 大人だけが消せるよう、パスワードを入れる（入れた数字は ● で隠す）
    const full = flow.resetCode.length >= RESET_PASSWORD.length;
    return {
      id: 'confirmReset',
      heading: 'ランキングを ぜんぶ けしますか？',
      text: flow.resetError ? 'パスワードが ちがいます' : 'パスワードを いれてね',
      nameBox: '●'.repeat(flow.resetCode.length).padEnd(RESET_PASSWORD.length, '_'),
      keyRows: [[...'1234567890'].map((d) => ({ label: d, act: 'typeDigit', arg: d, disabled: full }))],
      buttons: [
        { label: 'やめる', act: 'cancelReset' },
        { label: 'けす', act: 'deleteDigit', disabled: flow.resetCode.length === 0 },
        { label: 'リセット', act: 'confirmReset', primary: true, disabled: !full },
      ],
    };
  }
  // レベルを選ばず、1画面に3つのレベルを並べる（それぞれ上位5位まで）
  const columns = DIFFICULTY_IDS.map((level) => {
    const hl = flow.highlight && flow.highlight.level === level ? flow.highlight.rank : 0;
    const rows = flow.ranking[level].slice(0, RANK_SHOWN).map((e, i) => ({
      rank: i + 1, name: e.name, avatar: e.avatar, date: e.date, score: e.score, highlight: i + 1 === hl,
    }));
    return { label: DIFFICULTY_LABELS[level], rows, empty: rows.length === 0 ? 'まだ ありません' : undefined };
  });
  const buttons = [{ label: 'もどる', act: 'back' }];
  // リセットは大人向け。3秒押し続けたときだけ。みんなのランキングは、ゲームからは消せない（消すときはスプレッドシートで）
  if (flow.rankingAvailable && !flow.shared) buttons.push({ label: 'リセット（ながおし）', act: 'askReset', longPress: true });
  return {
    id: 'ranking',
    heading: 'ランキング',
    columns,
    notice: rankingNotice(flow),
    buttons,
  };
}

const ACTIONS = new Set([
  'start', 'typeLetter', 'deleteLetter', 'confirmName', 'back',
  'pickName', 'newName', 'askDelete', 'confirmDelete', 'cancelDelete',
  'openRanking', 'openResultRanking', 'showRanking', 'askReset', 'typeDigit', 'deleteDigit', 'confirmReset', 'cancelReset',
  'endingDone',
  'chooseAvatar', 'chooseDifficulty', 'resume', 'quitToTitle', 'finish', 'retry',
  'installYes', 'installLater', 'installDone',
]);

export function dispatch(flow, act, arg) {
  if (ACTIONS.has(act)) flow[act](arg);
}
