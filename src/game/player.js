import { TILE } from './level.js?v=09f3fcb';
import { moveAndCollide } from './physics.js?v=09f3fcb';

// 動きの数値（ドット/更新、更新は 1/60 秒）
export const ACCEL = 0.06;
export const TURN_DECEL = 0.15;
export const FRICTION = 0.08;
export const MAX_WALK = 1.3;
export const MAX_RUN = 2.5;
export const RUN_DELAY = 45;
export const RUN_RAMP = 60;
export const JUMP_V = -4.95;
export const GRAVITY_HOLD = 0.16;
export const GRAVITY = 0.42;
export const MAX_FALL = 5;
export const COYOTE = 6;
export const JUMP_BUFFER = 6;

const W = 12;
const H = 22;

export function spawnPoint(level) {
  return { x: level.start.tx * TILE + 2, y: (level.start.ty + 1) * TILE - H };
}

export class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.prevY = y;
    this.w = W;
    this.h = H;
    this.vx = 0;
    this.vy = 0;
    this.onGround = true;
    this.facing = 1;
    this.anim = 'stand';
    this.fell = false;
    this.holdDir = 0;
    this.holdTicks = 0;
    this.coyote = 0;
    this.jumpBuffer = 0;
    this.walkDist = 0;
    // スターと無敵（ミス救済後）の残り更新数
    this.star = 0;
    this.invuln = 0;
    this.lastHit = { onGround: false, hitCeiling: false, hitWall: false, ceil: null };
    // この更新で跳んだか（効果音用）
    this.jumped = false;
  }

  update(input, level) {
    this.prevY = this.y;
    this.jumped = false;
    const dir = (input.right ? 1 : 0) - (input.left ? 1 : 0);

    // 横の動き: 同じ向きに押し続けると少しずつ速くなる
    if (dir !== 0) {
      this.facing = dir;
      this.holdTicks = dir === this.holdDir ? this.holdTicks + 1 : 0;
      this.holdDir = dir;
    } else {
      this.holdTicks = 0;
      this.holdDir = 0;
    }
    const ramp = Math.min(1, Math.max(0, (this.holdTicks - RUN_DELAY) / RUN_RAMP));
    const max = MAX_WALK + (MAX_RUN - MAX_WALK) * ramp;
    if (dir !== 0) {
      const turning = this.vx !== 0 && Math.sign(this.vx) !== dir;
      this.vx += dir * (turning ? TURN_DECEL : ACCEL);
      if (Math.abs(this.vx) > max) {
        this.vx = Math.sign(this.vx) * Math.max(max, Math.abs(this.vx) - FRICTION);
      }
    } else {
      const s = Math.abs(this.vx) - FRICTION;
      this.vx = s > 0 ? Math.sign(this.vx) * s : 0;
    }

    // ジャンプ: 足場から落ちた直後（コヨーテタイム）と着地直前の先行入力を許す
    if (input.jumpPressed) this.jumpBuffer = JUMP_BUFFER;
    if (this.onGround) this.coyote = COYOTE;
    if (this.jumpBuffer > 0 && this.coyote > 0) {
      this.vy = JUMP_V;
      this.jumpBuffer = 0;
      this.coyote = 0;
      this.jumped = true;
    }
    const g = input.jump && this.vy < 0 ? GRAVITY_HOLD : GRAVITY;
    this.vy = Math.min(this.vy + g, MAX_FALL);

    const r = moveAndCollide(this, level);
    this.lastHit = r;
    this.onGround = r.onGround;
    if (this.jumpBuffer > 0) this.jumpBuffer--;
    if (!this.onGround && this.coyote > 0) this.coyote--;

    // アニメーション
    if (!this.onGround) {
      this.anim = 'jump';
    } else if (Math.abs(this.vx) > 0.05) {
      this.anim = 'walk';
      this.walkDist += Math.abs(this.vx);
    } else {
      this.anim = 'stand';
      this.walkDist = 0;
    }

    if (this.y > level.height * TILE + 32) this.fell = true;
    if (this.star > 0) this.star--;
    if (this.invuln > 0) this.invuln--;
  }

  spriteName() {
    if (this.anim === 'jump') return 'jump';
    if (this.anim === 'walk') return Math.floor(this.walkDist / 8) % 2 === 0 ? 'walkA' : 'walkB';
    return 'stand';
  }
}
