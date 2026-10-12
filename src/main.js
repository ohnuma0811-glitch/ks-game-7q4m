import { computeViewport, isPortrait } from './screen.js';
import { startLoop } from './loop.js';
import { Input, attachInput, computeButtonLayout } from './input.js';

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

// M1 の確認用デモ: 四角が左右に動いてジャンプする（M2 で置き換える）
const GROUND_Y = 240 - 32;
const demo = { x: 40, y: GROUND_Y - 24, vy: 0, onGround: true };

function update() {
  input.tick();
  const dir = (input.right ? 1 : 0) - (input.left ? 1 : 0);
  demo.x = Math.max(0, Math.min(view.width - 16, demo.x + dir * 1.5));
  if (input.jumpPressed && demo.onGround) {
    demo.vy = -5;
    demo.onGround = false;
  }
  demo.vy += 0.25;
  demo.y += demo.vy;
  if (demo.y >= GROUND_Y - 24) {
    demo.y = GROUND_Y - 24;
    demo.vy = 0;
    demo.onGround = true;
  }
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
  ctx.fillStyle = '#5c94fc';
  ctx.fillRect(0, 0, view.width, view.height);
  ctx.fillStyle = '#c84c0c';
  ctx.fillRect(0, GROUND_Y, view.width, 32);
  ctx.fillStyle = '#000';
  for (let x = 0; x < view.width; x += 16) ctx.fillRect(x, GROUND_Y, 1, 32);
  ctx.fillStyle = '#c11f0a';
  ctx.fillRect(Math.round(demo.x), Math.round(demo.y), 16, 24);
  ctx.fillStyle = '#fff';
  ctx.font = '8px monospace';
  ctx.fillText(`${view.width}x${view.height} x${view.scale.toFixed(2)} ${fps}fps`, 4, 10);
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
