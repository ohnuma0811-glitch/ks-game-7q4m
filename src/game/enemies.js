import { TILE, isSolid } from './level.js?v=a2c093a';
import { moveAndCollide } from './physics.js?v=a2c093a';
import { platformUnder } from './platforms.js?v=a2c093a';

// x の位置の足元（footY）に、地面か動く足場があるか
function groundAt(level, x, footY) {
  return isSolid(level, Math.floor(x / TILE), Math.floor(footY / TILE)) || Boolean(platformUnder(level, x, footY));
}

// 敵の文字と種類
const KIND = { w: 'walker', W: 'walker', x: 'walker', j: 'jumper', J: 'jumper', y: 'jumper', S: 'spike', z: 'spike' };

const GRAVITY = 0.3;
const MAX_FALL = 4;
export const WALK_SPEED = 0.5;
export const SPIKE_SPEED = 0.4;
export const HOP_V = -3.6;
export const HOP_VX = 0.9;
export const HOP_INTERVAL = 50;
// 跳んでから着地するまでの更新数（-HOP_V / GRAVITY の2倍）
const HOP_AIR_TICKS = Math.ceil((2 * -HOP_V) / GRAVITY);

export function createEnemy(ch, tx, ty, diff) {
  if (!diff.enemyChars.includes(ch)) return null;
  const kind = KIND[ch];
  return {
    kind,
    x: tx * TILE + 1,
    y: (ty + 1) * TILE - 14,
    w: 14,
    h: 14,
    vx: 0,
    vy: 0,
    dir: -1,
    speed: diff.enemySpeed,
    onGround: false,
    active: false,
    dead: false,
    squash: 0,
    timer: 0,
    stompable: kind !== 'spike',
    removed: false,
  };
}

export function updateEnemy(e, level, player) {
  if (e.removed) return;
  // 踏まれてつぶれている間
  if (e.squash > 0) {
    e.squash--;
    if (e.squash === 0) e.removed = true;
    return;
  }
  // スターで倒されたら、地面をすり抜けて落ちていく
  if (e.dead) {
    e.vy = Math.min(e.vy + GRAVITY, MAX_FALL);
    e.y += e.vy;
    if (e.y > level.height * TILE + 32) e.removed = true;
    return;
  }

  if (e.kind === 'walker' || e.kind === 'spike') {
    const speed = (e.kind === 'walker' ? WALK_SPEED : SPIKE_SPEED) * e.speed;
    e.vx = e.dir * speed;
    // 足場の端で引き返す（自分から穴に落ちない）
    if (e.onGround) {
      const aheadX = e.dir > 0 ? e.x + e.w + 1 : e.x - 1;
      if (!groundAt(level, aheadX, e.y + e.h + 1)) {
        e.dir = -e.dir;
        e.vx = e.dir * speed;
      }
    }
  } else if (e.kind === 'jumper' && e.onGround) {
    e.vx = 0;
    e.timer++;
    if (e.timer >= HOP_INTERVAL / e.speed) {
      e.timer = 0;
      e.dir = player.x < e.x ? -1 : 1;
      e.vy = HOP_V;
      e.vx = e.dir * HOP_VX * e.speed;
      // 着地する所に地面がなければ、その場で跳ねる（自分から穴に落ちない）
      const landX = e.x + e.w / 2 + e.vx * HOP_AIR_TICKS;
      if (!groundAt(level, landX, e.y + e.h + 1)) e.vx = 0;
    }
  }

  e.vy = Math.min(e.vy + GRAVITY, MAX_FALL);
  const vxBefore = e.vx;
  const r = moveAndCollide(e, level);
  e.onGround = r.onGround;
  // 乗っている動く足場（次の更新で一緒に動かす）
  e.ride = r.platform;
  if (r.hitWall) e.dir = vxBefore > 0 ? -1 : 1;
  if (e.y > level.height * TILE + 32) e.removed = true;
}
