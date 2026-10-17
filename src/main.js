import { computeViewport, isPortrait } from './screen.js?v=5ef8f1e';
import { startLoop } from './loop.js?v=5ef8f1e';
import { Input, attachInput, computeButtonLayout } from './input.js?v=5ef8f1e';
import { buildGraphics } from './gfx.js?v=5ef8f1e';
import { Game } from './game/game.js?v=5ef8f1e';
import { renderGame } from './render.js?v=5ef8f1e';
import { STAGES } from './data/stages.js?v=5ef8f1e';
import { Flow } from './flow.js?v=5ef8f1e';
import { createUI } from './ui.js?v=5ef8f1e';
import { loadNames, saveNames } from './names.js?v=5ef8f1e';
import { loadRanking, saveRanking, storageWorks } from './ranking.js?v=5ef8f1e';
import { Sound } from './audio.js?v=5ef8f1e';
import { musicFor } from './musicstate.js?v=5ef8f1e';
import { SharedRanking } from './shared.js?v=5ef8f1e';
import { RANKING_URL } from './config.js?v=5ef8f1e';
import { PlayTime } from './playtime.js?v=5ef8f1e';

// 「STAGE 1」を見せる時間（更新数）
const INTRO_TICKS = 90;
// ミスの音から笑い声までの秒数
const LAUGH_DELAY = 0.6;

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const rotateEl = document.getElementById('rotate');
const touchLayer = document.getElementById('touch-layer');
const probe = document.getElementById('safe-probe');
const pauseEl = document.getElementById('btn-pause');
const menuEl = document.getElementById('menu');
const keyHintEl = document.getElementById('key-hint');
const btnEls = {
  left: document.getElementById('btn-left'),
  right: document.getElementById('btn-right'),
  jump: document.getElementById('btn-jump'),
};

const input = new Input();
let view = computeViewport(window.innerWidth, window.innerHeight);
let layout = computeButtonLayout(window.innerWidth, window.innerHeight);

const gfx = buildGraphics();
const sound = new Sound(window.AudioContext || window.webkitAudioContext);
// 入れたことのある名前は端末に覚えておく（保存できない端末でもゲームは遊べる）
function getStorage() {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}
const storage = getStorage();
const params = new URLSearchParams(location.search);
// 確認用: ?stage=4 でステージ4から始める（ランキングには入らない）
const startStage = Number(params.get('stage')) - 1;
// 確認用: ?fps で、1秒に何回描けているかを右上に出す
const showFps = params.has('fps');
// 記録の id（みんなのランキングで、同じ記録を2回数えないため）
function makeId() {
  if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}
// みんなのランキング（src/config.js に URL があるとき）。遠くの家族の端末で遊んだ記録もまとめる
// 手元の確認（http）では使わない（試しの記録を、みんなのランキングに送らないように）
const sharedUrl = location.protocol === 'https:' ? RANKING_URL : '';
const shared = new SharedRanking({ url: sharedUrl, fetch: (url, opt) => fetch(url, opt), storage, makeId });
if (shared.enabled) shared.migrate(loadRanking(storage));
// ホーム画面への追加: ホーム画面から開いていない Android・iPhone・iPad のときだけ、タイトルの前に聞く
let installPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
  // Chrome が勝手に出す案内の代わりに、ゲームの画面で聞く
  e.preventDefault();
  installPrompt = e;
});
// インストールが終わったら（Android）、ブラウザを閉じてホーム画面から遊ぶように案内する
window.addEventListener('appinstalled', () => {
  flow.installed();
  afterAction();
});
function installOptions() {
  const ua = navigator.userAgent;
  const ios = /iPhone|iPad|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const android = /Android/.test(ua);
  const standalone = matchMedia('(display-mode: standalone)').matches
    || matchMedia('(display-mode: fullscreen)').matches
    || navigator.standalone === true;
  if (!(ios || android) || standalone) return null;
  return {
    platform: ios ? 'ios' : 'android',
    // Android の Chrome は、ボタンを押したときにブラウザの追加の画面を出せる
    prompt() {
      if (!installPrompt) return false;
      installPrompt.prompt();
      installPrompt = null;
      return true;
    },
  };
}
// 1日に遊べる時間（KYUGO・SOKI は1日15分。端末ごと）
const playTime = new PlayTime(storage);
// まだ保存していない遊んだ時間（1秒ごとにまとめて保存する）
let unsavedMs = 0;
// 時間が終わったあとにミスした（やり直す前に「きょうは おしまい」にする）
let missedAfterTime = false;
function savePlayTime() {
  if (unsavedMs > 0) playTime.add(flow.name, unsavedMs);
  unsavedMs = 0;
}
const flow = new Flow(STAGES.length, {
  timeLeft: (name) => playTime.remaining(name),
  startStage,
  install: installOptions(),
  savedNames: loadNames(storage),
  onSavedNamesChange: (list) => saveNames(storage, list),
  // ランキングも端末に記録する（保存できない端末では記録しない）
  ranking: shared.enabled ? shared.view() : loadRanking(storage),
  onRankingChange: (r) => saveRanking(storage, r),
  rankingAvailable: storageWorks(storage),
  shared: shared.enabled,
  makeId,
  onRecord: (level, entry) => shared.add(level, entry),
  // みんなのランキングを消す。消せなかったら、そのことを出して、ランキングを元に戻す
  onSharedReset: (code) => {
    // 消し終わるまでは「よみこみちゅう…」
    flow.rankingLoading = true;
    shared.reset(code).then((ok) => {
      if (!ok) flow.resetFailed = true;
      refreshShared(false);
    });
  },
});
// メニューの後ろに見せるステージ1の景色
const backdrop = new Game(STAGES[0].map);
let game = null;
let tick = 0;
let introTicks = 0;
// 「STAGE N」の後ろに見せる、次のステージの景色
let introPreview = null;
let lastScreen = flow.screen;
let lastPaused = flow.paused;

const ui = createUI({ root: menuEl, flow, gfx, onAction: afterAction });

// 画面が変わったあとの片付け（ボタンの表示切り替え、メニューの作り直し、音）
function afterAction(act) {
  if (act) {
    // ボタンを押したときに音を有効にする（スマホ・タブレットはタッチの中でしか鳴らせない）
    sound.unlock();
    sound.playSfx('button');
  }
  if (flow.screen !== lastScreen) {
    // ステージを出たら、数えた時間を保存する
    if (lastScreen === 'play') {
      savePlayTime();
      missedAfterTime = false;
    }
    // タイトルとランキングの画面に来たら、みんなのランキングを受け取り直す
    if (flow.screen === 'title' || flow.screen === 'ranking') refreshShared(flow.screen === 'ranking');
    if (flow.screen === 'intro') {
      introTicks = 0;
      const next = STAGES[flow.stageIndex];
      introPreview = new Game(next.map, { theme: next.theme });
    }
    if (flow.screen === 'title') game = null;
    lastScreen = flow.screen;
  }
  lastPaused = flow.paused;
  const playing = flow.screen === 'play' && !flow.paused;
  for (const b of Object.values(btnEls)) b.classList.toggle('hidden', !playing);
  pauseEl.classList.toggle('show', playing);
  // パソコンのときだけ CSS で表示される
  keyHintEl.classList.toggle('show', playing);
  if (!playing) input.clear();
  if (flow.paused) sound.suspend();
  else sound.resume();
  updateMusic();
  ui.render();
}

// みんなのランキングを受け取り直して、画面に出す。loading なら受け取っている間「よみこみちゅう…」
function refreshShared(loading) {
  if (!shared.enabled) return;
  if (loading) flow.rankingLoading = true;
  shared.refresh().then((r) => {
    flow.setRanking(r);
    flow.rankingLoading = false;
    ui.render();
  });
}

// 今の状態に合う BGM にする（メニューでは止める。ミス・クリア・結果の間はジングルのまま）
function updateMusic() {
  const want = musicFor({
    screen: flow.screen,
    gameState: game ? game.state : null,
    star: game ? game.player.star : 0,
    stageIndex: flow.stageIndex,
    stageMusic: STAGES.map((s) => s.music),
    boss: Boolean(game && game.boss && game.boss.active && !game.boss.defeated),
    current: sound.current,
  });
  if (want !== undefined) sound.playMusic(want);
}

// ゲームで起きたことに合わせて効果音・ジングルを鳴らす
function playEvents() {
  for (const ev of game.events) {
    if (ev === 'clear' || ev === 'gameover') sound.playMusic(ev);
    else if (ev === 'miss') {
      sound.playMusic(null);
      sound.playSfx('miss');
      // ミスの音が下がりきるころに、いじわるな笑い声
      sound.playSfx('laugh', LAUGH_DELAY);
    } else sound.playSfx(ev);
    if (ev === 'miss' && timeLeftNow() <= 0) missedAfterTime = true;
  }
  game.events.length = 0;
}

function pause() {
  flow.pause();
  afterAction();
}

function readSafeArea() {
  const s = getComputedStyle(probe);
  return {
    left: parseFloat(s.paddingLeft) || 0,
    right: parseFloat(s.paddingRight) || 0,
    bottom: parseFloat(s.paddingBottom) || 0,
  };
}

function placeButton(el, c) {
  el.style.left = `${c.x - c.r}px`;
  el.style.top = `${c.y - c.r}px`;
  el.style.width = `${c.r * 2}px`;
  el.style.height = `${c.r * 2}px`;
}

function resize() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  view = computeViewport(w, h);
  canvas.width = view.width;
  canvas.height = view.height;
  canvas.style.width = `${view.cssW}px`;
  canvas.style.height = `${view.cssH}px`;
  canvas.style.left = `${view.offsetX}px`;
  canvas.style.top = `${view.offsetY}px`;
  ctx.imageSmoothingEnabled = false;
  const portrait = isPortrait(w, h);
  rotateEl.classList.toggle('show', portrait);
  if (portrait) pause();
  layout = computeButtonLayout(w, h, readSafeArea());
  placeButton(btnEls.left, layout.left);
  placeButton(btnEls.right, layout.right);
  placeButton(btnEls.jump, layout.jump);
  input.relayout(layout);
}

// いま遊んでいる名前の、きょうの のこり（ミリ秒。制限のない名前は Infinity）
function timeLeftNow() {
  return playTime.remaining(flow.name) - unsavedMs;
}

function update() {
  input.tick();
  tick++;
  // 縦向きの間は進めない（「STAGE 1」の間なら、ポーズした状態で始まる）
  if (rotateEl.classList.contains('show') && (flow.screen === 'intro' || flow.screen === 'play')) flow.pause();
  if (flow.screen === 'intro') {
    introTicks++;
    if (introTicks >= INTRO_TICKS) {
      const stage = STAGES[flow.stageIndex];
      game = new Game(stage.map, {
        theme: stage.theme,
        time: stage.time,
        avatar: flow.avatar,
        difficulty: flow.difficulty,
        name: flow.name,
        ...flow.carry,
      });
      flow.beginStage();
    }
  } else if (flow.screen === 'play' && !flow.paused) {
    // 遊んだ時間を数える（KYUGO・SOKI だけ）
    if (Number.isFinite(playTime.remaining(flow.name))) {
      unsavedMs += 1000 / 60;
      if (unsavedMs >= 1000) savePlayTime();
    }
    game.timeLeftMs = timeLeftNow();
    game.update(input, view.width);
    playEvents();
    const over = timeLeftNow() <= 0;
    // 時間が終わったあとのミスは、やり直さずに「きょうは おしまい」
    if (missedAfterTime && game.state === 'playing') {
      missedAfterTime = false;
      savePlayTime();
      flow.timeUp(game);
    } else if (game.canRestart()) {
      // クリア・ゲームオーバーの表示を見せ終わったら次へ（時間が終わっていたら、次のステージへは進まない）
      if (game.state === 'clear' && over && flow.stageIndex + 1 < flow.stageCount) {
        savePlayTime();
        flow.timeUp(game);
      } else if (game.state === 'clear') flow.stageCleared(game);
      else flow.gameOver(game);
    }
  }
  if (flow.screen !== lastScreen || flow.paused !== lastPaused) afterAction();
  // 曲は毎回確かめる（エンディングの曲は、クリアのジングルが鳴り終わったあとで始める）
  updateMusic();
}

let fps = 0;
let fpsFrames = 0;
let fpsTime = performance.now();

function countFps() {
  fpsFrames++;
  const now = performance.now();
  if (now - fpsTime >= 1000) {
    fps = fpsFrames;
    fpsFrames = 0;
    fpsTime = now;
  }
}

function render() {
  if (game && (flow.screen === 'play' || flow.screen === 'result')) {
    renderGame(ctx, game, gfx, view.width, view.height, tick);
  } else {
    const scene = flow.screen === 'intro' && introPreview ? introPreview : backdrop;
    renderGame(ctx, scene, gfx, view.width, view.height, tick, { hud: false, player: false });
  }
  if (showFps) {
    ctx.font = '8px monospace';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'top';
    ctx.fillStyle = '#fff';
    ctx.fillText(`${fps}fps`, view.width - 4, 13);
  }
  btnEls.left.classList.toggle('active', input.left);
  btnEls.right.classList.toggle('active', input.right);
  btnEls.jump.classList.toggle('active', input.jump);
}

// 名前は PC のキーボードでも入れられる。プレイ中は Esc / P で一時停止
window.addEventListener('keydown', (e) => {
  if (flow.screen === 'name') {
    if (/^Key[A-Z]$/.test(e.code)) flow.typeLetter(e.code.slice(3));
    else if (e.code === 'Backspace') flow.deleteLetter();
    else if (e.code === 'Enter') flow.confirmName();
    else return;
    e.preventDefault();
    afterAction();
  } else if (flow.confirmingReset) {
    // リセットのパスワードも、パソコンの数字キーで入れられる
    const m = /^(?:Digit|Numpad)([0-9])$/.exec(e.code);
    if (m) flow.typeDigit(m[1]);
    else if (e.code === 'Backspace') flow.deleteDigit();
    else if (e.code === 'Enter' || e.code === 'NumpadEnter') flow.confirmReset();
    else return;
    e.preventDefault();
    afterAction();
  } else if (flow.screen === 'play' && (e.code === 'Escape' || e.code === 'KeyP')) {
    if (flow.paused) flow.resume();
    else flow.pause();
    afterAction();
  }
});
pauseEl.addEventListener('click', pause);
// ほかのアプリやタブに切り替えたら、音も止める（タイトルの曲が裏で鳴り続けないように）
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    pause();
    sound.suspend();
  } else if (!flow.paused) sound.resume();
});
// スマホ・タブレットは、画面に触れるまで音を出せない。最初にどこかに触れたらタイトルの曲を始める
for (const type of ['pointerdown', 'touchend', 'keydown']) {
  // ポーズ中は鳴らし始めない。iPhone は pointerdown では鳴らせないことがあるので、鳴っていなければ touchend でもう一度
  window.addEventListener(type, () => {
    if (!flow.paused && (!sound.ctx || sound.ctx.state !== 'running')) sound.unlock();
  }, { capture: true });
}

attachInput(input, touchLayer, () => layout);
// 電波が戻ったら、送れていなかった記録を送る
window.addEventListener('online', () => shared.flush());
window.addEventListener('resize', resize);
window.addEventListener('orientationchange', resize);
document.addEventListener('gesturestart', (e) => e.preventDefault());

// 公開している所では、ゲームのファイルを端末に保存して、オフラインでも遊べるようにする（手元の確認では使わない）
if ('serviceWorker' in navigator && location.protocol === 'https:') {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}

resize();
afterAction();
refreshShared(false);
startLoop({
  update,
  render() { countFps(); render(); },
});
