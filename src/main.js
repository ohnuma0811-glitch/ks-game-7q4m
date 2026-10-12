import { computeViewport, isPortrait } from './screen.js?v=2812ac1';
import { startLoop } from './loop.js?v=2812ac1';
import { Input, attachInput, computeButtonLayout } from './input.js?v=2812ac1';
import { buildGraphics } from './gfx.js?v=2812ac1';
import { Game } from './game/game.js?v=2812ac1';
import { renderGame } from './render.js?v=2812ac1';
import { STAGE_1 } from './data/stages.js?v=2812ac1';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const rotateEl = document.getElementById('rotate');
const touchLayer = document.getElementById('touch-layer');
const probe = document.getElementById('safe-probe');
const btnEls = {
  left: document.getElementById('btn-left'),
  right: document.getElementById('btn-right'),
  jump: document.getElementById('btn-jump'),
};

const input = new Input();
let view = computeViewport(window.innerWidth, window.innerHeight);
let layout = computeButtonLayout(window.innerWidth, window.innerHeight);

// 選択画面（M4）までの仮: ?c=soki でキャラ、?d=easy|normal|hard で難易度
const params = new URLSearchParams(location.search);
const options = {
  avatar: params.get('c') === 'soki' ? 'soki' : 'kyugo',
  difficulty: ['easy', 'normal', 'hard'].includes(params.get('d')) ? params.get('d') : 'normal',
};
const gfx = buildGraphics();
let game = new Game(STAGE_1, options);
let tick = 0;

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
  rotateEl.classList.toggle('show', isPortrait(w, h));
  layout = computeButtonLayout(w, h, readSafeArea());
  placeButton(btnEls.left, layout.left);
  placeButton(btnEls.right, layout.right);
  placeButton(btnEls.jump, layout.jump);
  input.relayout(layout);
}

function update() {
  input.tick();
  tick++;
  // クリア・ゲームオーバーのあとは、ジャンプで最初から（M4 で画面遷移に置き換える）
  if (game.canRestart() && input.jumpPressed) {
    game = new Game(STAGE_1, options);
    return;
  }
  game.update(input, view.width);
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
  renderGame(ctx, game, gfx, view.width, view.height, tick);
  ctx.font = '8px monospace';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'top';
  ctx.fillStyle = '#fff';
  ctx.fillText(`${fps}fps`, view.width - 4, 13);
  btnEls.left.classList.toggle('active', input.left);
  btnEls.right.classList.toggle('active', input.right);
  btnEls.jump.classList.toggle('active', input.jump);
}

attachInput(input, touchLayer, () => layout);
window.addEventListener('resize', resize);
window.addEventListener('orientationchange', resize);
document.addEventListener('gesturestart', (e) => e.preventDefault());

resize();
startLoop({
  update,
  render() { countFps(); render(); },
});
