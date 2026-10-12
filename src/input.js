// タッチとキーボードを left / right / jump にまとめる
const KEYS_LEFT = ['ArrowLeft', 'KeyA'];
const KEYS_RIGHT = ['ArrowRight', 'KeyD'];
const KEYS_JUMP = ['Space', 'ArrowUp', 'KeyZ'];
const HANDLED = new Set([...KEYS_LEFT, ...KEYS_RIGHT, ...KEYS_JUMP]);

export function computeButtonLayout(winW, winH, safe = { left: 0, right: 0, bottom: 0 }) {
  // 半径は画面の短い辺の9%、34〜56px（約1〜1.5cm）
  const r = Math.max(34, Math.min(56, Math.min(winW, winH) * 0.09));
  const margin = 16;
  // ◀ は親指が届きやすいよう左端に寄せる
  const leftMargin = 8;
  const y = winH - safe.bottom - margin - r;
  const left = { x: safe.left + leftMargin + r, y, r };
  const right = { x: left.x + r * 2 + 16, y, r };
  const jumpR = r * 1.2;
  const jump = { x: winW - safe.right - margin - jumpR, y: winH - safe.bottom - margin - jumpR, r: jumpR };
  return { left, right, jump, splitX: (left.x + right.x) / 2, winW, winH };
}

export function resolveTouches(points, layout) {
  const s = { left: false, right: false, jump: false };
  for (const p of points) {
    if (p.x < layout.winW / 2) {
      if (p.x < layout.splitX) s.left = true;
      else s.right = true;
    } else if (p.y > layout.winH * 0.25) {
      s.jump = true;
    }
  }
  return s;
}

export class Input {
  constructor() {
    this.touch = { left: false, right: false, jump: false };
    this.keys = new Set();
    this.left = false;
    this.right = false;
    this.jump = false;
    this.jumpPressed = false;
    this.prevJump = false;
    // 更新の間に押して離されたジャンプも拾うための記録
    this.jumpLatch = false;
    this.points = [];
  }

  setTouches(points, layout) {
    const wasJump = this.touch.jump;
    this.points = points;
    this.touch = resolveTouches(points, layout);
    if (this.touch.jump && !wasJump) this.jumpLatch = true;
  }

  // 画面サイズが変わったとき、押している指を新しい配置で判定し直す
  relayout(layout) {
    this.touch = resolveTouches(this.points, layout);
  }

  keyDown(code) {
    if (KEYS_JUMP.includes(code) && !this.keys.has(code)) this.jumpLatch = true;
    this.keys.add(code);
  }

  keyUp(code) { this.keys.delete(code); }

  clear() {
    this.touch = { left: false, right: false, jump: false };
    this.keys.clear();
    this.points = [];
    this.jumpLatch = false;
  }

  // 更新1回につき1度だけ呼ぶ
  tick() {
    const has = (list) => list.some((k) => this.keys.has(k));
    this.left = this.touch.left || has(KEYS_LEFT);
    this.right = this.touch.right || has(KEYS_RIGHT);
    this.jump = this.touch.jump || has(KEYS_JUMP);
    this.jumpPressed = (this.jump && !this.prevJump) || this.jumpLatch;
    this.jumpLatch = false;
    this.prevJump = this.jump;
  }
}

export function attachInput(input, target, getLayout) {
  const onTouch = (e) => {
    e.preventDefault();
    const points = Array.from(e.touches, (t) => ({ x: t.clientX, y: t.clientY }));
    input.setTouches(points, getLayout());
  };
  for (const type of ['touchstart', 'touchmove', 'touchend', 'touchcancel']) {
    target.addEventListener(type, onTouch, { passive: false });
  }
  window.addEventListener('keydown', (e) => {
    if (HANDLED.has(e.code)) {
      e.preventDefault();
      input.keyDown(e.code);
    }
  });
  window.addEventListener('keyup', (e) => input.keyUp(e.code));
  window.addEventListener('blur', () => input.clear());
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) input.clear();
  });
}
