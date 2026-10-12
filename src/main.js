import { computeViewport, isPortrait } from './screen.js?v=bb6eec5';
import { startLoop } from './loop.js?v=bb6eec5';
import { Input, attachInput, computeButtonLayout } from './input.js?v=bb6eec5';
import { buildGraphics } from './gfx.js?v=bb6eec5';
import { Game } from './game/game.js?v=bb6eec5';
import { renderGame } from './render.js?v=bb6eec5';
import { STAGES } from './data/stages.js?v=bb6eec5';
import { Flow } from './flow.js?v=bb6eec5';
import { createUI } from './ui.js?v=bb6eec5';
import { loadNames, saveNames } from './names.js?v=bb6eec5';
import { loadRanking, saveRanking, storageWorks } from './ranking.js?v=bb6eec5';

// 「STAGE 1」を見せる時間（更新数）
const INTRO_TICKS = 90;

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const rotateEl = document.getElementById('rotate');
const touchLayer = document.getElementById('touch-layer');
const probe = document.getElementById('safe-probe');
const pauseEl = document.getElementById('btn-pause');
const menuEl = document.getElementById('menu');
const btnEls = {
  left: document.getElementById('btn-left'),
  right: document.getElementById('btn-right'),
  jump: document.getElementById('btn-jump'),
};

const input = new Input();
let view = computeViewport(window.innerWidth, window.innerHeight);
let layout = computeButtonLayout(window.innerWidth, window.innerHeight);

const gfx = buildGraphics();
// 入れたことのある名前は端末に覚えておく（保存できない端末でもゲームは遊べる）
function getStorage() {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}
const storage = getStorage();
const flow = new Flow(STAGES.length, {
  savedNames: loadNames(storage),
  onSavedNamesChange: (list) => saveNames(storage, list),
  // ランキングも端末に記録する（保存できない端末では記録しない）
  ranking: loadRanking(storage),
  onRankingChange: (r) => saveRanking(storage, r),
  rankingAvailable: storageWorks(storage),
});
// メニューの後ろに見せるステージ1の景色
const backdrop = new Game(STAGES[0]);
let game = null;
let tick = 0;
let introTicks = 0;
let lastScreen = flow.screen;
let lastPaused = flow.paused;

const ui = createUI({ root: menuEl, flow, gfx, onAction: afterAction });

// 画面が変わったあとの片付け（ボタンの表示切り替え、メニューの作り直し）
function afterAction() {
  if (flow.screen !== lastScreen) {
    if (flow.screen === 'intro') introTicks = 0;
    if (flow.screen === 'title') game = null;
    lastScreen = flow.screen;
  }
  lastPaused = flow.paused;
  const playing = flow.screen === 'play' && !flow.paused;
  for (const b of Object.values(btnEls)) b.classList.toggle('hidden', !playing);
  pauseEl.classList.toggle('show', playing);
  if (!playing) input.clear();
  ui.render();
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

function update() {
  input.tick();
  tick++;
  // 縦向きの間は進めない（「STAGE 1」の間なら、ポーズした状態で始まる）
  if (rotateEl.classList.contains('show') && (flow.screen === 'intro' || flow.screen === 'play')) flow.pause();
  if (flow.screen === 'intro') {
    introTicks++;
    if (introTicks >= INTRO_TICKS) {
      game = new Game(STAGES[flow.stageIndex], {
        avatar: flow.avatar,
        difficulty: flow.difficulty,
        name: flow.name,
        ...flow.carry,
      });
      flow.beginStage();
    }
  } else if (flow.screen === 'play' && !flow.paused) {
    game.update(input, view.width);
    // クリア・ゲームオーバーの表示を見せ終わったら次へ
    if (game.canRestart()) {
      if (game.state === 'clear') flow.stageCleared(game);
      else flow.gameOver(game);
    }
  }
  if (flow.screen !== lastScreen || flow.paused !== lastPaused) afterAction();
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
    renderGame(ctx, backdrop, gfx, view.width, view.height, tick, { hud: false, player: false });
  }
  ctx.font = '8px monospace';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'top';
  ctx.fillStyle = '#fff';
  ctx.fillText(`${fps}fps`, view.width - 4, 13);
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
  } else if (flow.screen === 'play' && (e.code === 'Escape' || e.code === 'KeyP')) {
    if (flow.paused) flow.resume();
    else flow.pause();
    afterAction();
  }
});
pauseEl.addEventListener('click', pause);
document.addEventListener('visibilitychange', () => {
  if (document.hidden) pause();
});

attachInput(input, touchLayer, () => layout);
window.addEventListener('resize', resize);
window.addEventListener('orientationchange', resize);
document.addEventListener('gesturestart', (e) => e.preventDefault());

resize();
afterAction();
startLoop({
  update,
  render() { countFps(); render(); },
});
