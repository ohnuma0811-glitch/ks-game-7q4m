import { TILE, isSolid } from './level.js?v=e150c2c';
import { moveAndCollide } from './physics.js?v=e150c2c';
import { platformUnder } from './platforms.js?v=e150c2c';

// x の位置の足元（footY）に、地面か動く足場があるか
function groundAt(level, x, footY) {
  return isSolid(level, Math.floor(x / TILE), Math.floor(footY / TILE)) || Boolean(platformUnder(level, x, footY));
}

// 敵の文字と種類
// R・r は赤いカエル（Level 3）。R は Level 2 では緑のカエル、r は Level 3 だけ
const KIND = { w: 'walker', W: 'walker', x: 'walker', j: 'jumper', J: 'jumper', y: 'jumper', R: 'jumper', r: 'jumper', S: 'spike', z: 'spike' };

const GRAVITY = 0.3;
const MAX_FALL = 4;
export const WALK_SPEED = 0.5;
export const SPIKE_SPEED = 0.4;
export const HOP_V = -3.6;
export const HOP_VX = 0.9;
export const HOP_INTERVAL = 50;
// 赤いカエル: 火を吹く前に溜める時間（約1秒）と、次に溜めはじめるまでの時間（ランダム。1.5〜3秒）。
// 画面に入ったら、まずすぐに溜める
export const CHARGE_TICKS = 60;
export const FROG_FIRE_MIN = 90;
export const FROG_FIRE_MAX = 180;
// 跳んでから着地するまでの更新数（-HOP_V / GRAVITY の2倍）
const HOP_AIR_TICKS = Math.ceil((2 * -HOP_V) / GRAVITY);

export function createEnemy(ch, tx, ty, diff) {
  if (!diff.enemyChars.includes(ch)) return null;
  const kind = KIND[ch];
  return {
    kind,
    // 赤いカエル（溜めてから、上と左右ななめ上に火を吹く）
    red: ch === 'r' || (ch === 'R' && Boolean(diff.redFrog)),
    charge: 0,
    fireTimer: null,
    fire: false,
    chargeStart: false,
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

function nextFire(rng) {
  return Math.min(FROG_FIRE_MAX, FROG_FIRE_MIN + Math.floor(rng() * (FROG_FIRE_MAX - FROG_FIRE_MIN + 1)));
}

// 赤いカエル: 時間が来たら着地している所で止まって溜め、溜め終わったら fire（火はゲームが出す）。
// 溜めている間は true を返す（跳ねない）
function updateRedFrog(e, rng) {
  // 動き出して最初は、すぐに溜める
  if (e.fireTimer === null) e.fireTimer = 0;
  if (e.charge > 0) {
    e.charge--;
    e.vx = 0;
    if (e.charge === 0) {
      e.fire = true;
      e.fireTimer = nextFire(rng);
    }
    return true;
  }
  if (e.fireTimer > 0) e.fireTimer--;
  if (e.fireTimer <= 0 && e.onGround) {
    e.charge = CHARGE_TICKS;
    e.chargeStart = true;
    e.vx = 0;
    return true;
  }
  return false;
}

export function updateEnemy(e, level, player, rng = Math.random) {
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
  } else if (e.kind === 'jumper' && e.red && updateRedFrog(e, rng)) {
    // 溜めている間はその場で止まる
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
