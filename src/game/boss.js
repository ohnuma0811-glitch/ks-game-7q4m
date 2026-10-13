import { TILE } from './level.js?v=72496cd';
import { moveAndCollide } from './physics.js?v=72496cd';

// ステージ4のボス（トゲの甲羅の大きな亀）
// 歩く（プレイヤーの方へ）→ 甲羅に入る（その場で止まる）をくり返す。踏まれるとひるんで離れ、また歩き出す。
// 歩いている間に上から踏めば1回。甲羅の間はトゲがあって踏めない。5回で倒れる
export const BOSS_HP = 5;
export const BOSS_W = 28;
// 歩くときは2本足で立っているので背が高い（甲羅の間は SHELL_H）
export const BOSS_H = 30;
export const BOSS_WALK = 0.45;
export const WALK_TICKS = 150;
export const SHELL_TICKS = 110;
// ひるむ時間。跳ね返ったプレイヤーが落ちてくるまで（約60更新）より長く
export const HURT_TICKS = 75;
// 甲羅に入る少し前から、ぶるぶるふるえて合図する
export const WARN_TICKS = 25;
// 甲羅の間の当たり判定の高さ（甲羅の絵に合わせる。足元の高さは同じ）
const SHELL_H = 19;
// ひるんだとき、プレイヤーから離れる速さ
const HURT_RETREAT = 1.2;
const GRAVITY = 0.3;
const MAX_FALL = 4;

export function createBoss(tx, ty, diff) {
  return {
    x: tx * TILE + 2,
    y: (ty + 1) * TILE - BOSS_H,
    w: BOSS_W,
    h: BOSS_H,
    vx: 0,
    vy: 0,
    dir: -1,
    speed: diff.enemySpeed,
    hp: BOSS_HP,
    state: 'walk',
    timer: 0,
    active: false,
    defeated: false,
    removed: false,
    onGround: false,
    warning: false,
    // 甲羅に入るまでに歩く時間（難易度ごと）
    walkTicks: diff.bossWalk ?? WALK_TICKS,
    // 何回歩くうち1回、歩いている途中で火を吹くか（0 なら吹かない。Level 3 は毎回、Level 2 は2回に1回）
    fireEvery: diff.bossFire || 0,
    walks: 0,
    fired: false,
  };
}

// 甲羅に入る・出るときに、当たり判定の高さを変える（足元はそのまま）
function setShell(b, on) {
  const h = on ? SHELL_H : BOSS_H;
  b.y += b.h - h;
  b.h = h;
}

// 甲羅に入った更新は 'shell'、火を吹いた更新は 'fire' を返す
export function updateBoss(b, level, player) {
  if (b.removed) return null;
  if (b.defeated) {
    b.vy = Math.min(b.vy + GRAVITY, MAX_FALL);
    b.y += b.vy;
    if (b.y > level.height * TILE + 32) b.removed = true;
    return null;
  }
  b.timer++;
  let ev = null;
  const towardPlayer = player.x + player.w / 2 < b.x + b.w / 2 ? -1 : 1;
  if (b.state === 'walk') {
    b.dir = towardPlayer;
    b.vx = b.dir * BOSS_WALK * b.speed;
    if (b.fireEvery && b.walks % b.fireEvery === 0 && !b.fired && b.timer >= Math.floor(b.walkTicks / 2)) {
      b.fired = true;
      ev = 'fire';
    }
    if (b.timer >= b.walkTicks) {
      b.state = 'shell';
      b.timer = 0;
      setShell(b, true);
      ev = 'shell';
    }
  } else if (b.state === 'shell') {
    b.vx = 0;
    if (b.timer >= SHELL_TICKS) {
      b.state = 'walk';
      b.timer = 0;
      b.fired = false;
      b.walks++;
      setShell(b, false);
    }
  } else if (b.state === 'hurt') {
    b.vx = -towardPlayer * HURT_RETREAT;
    // ひるみが終わったら歩き出す（落ちてきたプレイヤーがトゲに当たらないように）
    if (b.timer >= HURT_TICKS) {
      b.state = 'walk';
      b.timer = 0;
      b.fired = false;
      b.walks++;
    }
  }
  b.warning = b.state === 'walk' && b.timer >= b.walkTicks - WARN_TICKS;
  b.vy = Math.min(b.vy + GRAVITY, MAX_FALL);
  const r = moveAndCollide(b, level);
  b.onGround = r.onGround;
  return ev;
}

// 踏まれた。'hit'（ひるむ）か 'down'（倒れた）を返す
export function hitBoss(b) {
  b.hp--;
  b.timer = 0;
  if (b.hp <= 0) {
    b.defeated = true;
    b.state = 'down';
    b.vy = -3;
    return 'down';
  }
  b.state = 'hurt';
  return 'hit';
}

export function canStomp(b) {
  return b.state === 'walk';
}
