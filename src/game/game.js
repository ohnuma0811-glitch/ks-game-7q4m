import { parseLevel, tileAt, setTile, isSolid, TILE, QUESTION, USED } from './level.js';
import { Player, spawnPoint } from './player.js';
import { cameraX } from './camera.js';
import { createEnemy, updateEnemy } from './enemies.js';
import { createCoin, popCoin, popItem, updateItem, itemBox, collectible } from './items.js';
import { getDifficulty } from './difficulty.js';

export const LIVES = 3;
export const START_TIME = 200;
export const STAR_TICKS = 900;
export const DEATH_TICKS = 90;
// かんたんの歩く敵が、立っているプレイヤーを通り過ぎる時間（約87更新）より長く
export const RESCUE_INVULN = 120;
export const COIN_SCORE = 100;
export const DRINK_BONUS = 1000;
export const TIME_BONUS = 10;
export const STOMP_BOUNCE = -3.2;
export const STOMP_BOUNCE_HOLD = -4.6;
// クリア・ゲームオーバーの結果を見せる時間（この間はやり直しを受け付けない）
export const RESULT_LOCK = 60;

export function overlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

export class Game {
  constructor(levelLines, { avatar = 'kyugo', difficulty = 'normal' } = {}) {
    this.lines = levelLines;
    this.avatar = avatar;
    this.difficulty = difficulty;
    this.diff = getDifficulty(difficulty);
    this.lives = LIVES;
    this.coins = 0;
    this.score = 0;
    this.checkpoint = null;
    this.passed = new Set();
    // 取ったコインと使った？ブロックは、出直しても戻らない（何度もミスして稼げないように）
    this.takenCoins = new Set();
    this.usedBlocks = new Set();
    this.resultTicks = 0;
    this.camX = 0;
    this.loadStage();
    this.respawn();
  }

  // ステージを読み込み直す（ミスのたびに敵・アイテム・ブロックが元に戻る）
  loadStage() {
    this.level = parseLevel(this.lines);
    for (const i of this.usedBlocks) this.level.tiles[i] = USED;
    this.enemies = [];
    this.items = [];
    this.checkpoints = [];
    this.goalX = Infinity;
    for (const e of this.level.entities) {
      if (e.ch === 'c') {
        if (!this.takenCoins.has(`${e.tx},${e.ty}`)) this.items.push(createCoin(e.tx, e.ty));
      } else if (e.ch === 'h' || e.ch === 'H') {
        this.checkpoints.push({
          ch: e.ch,
          tx: e.tx,
          ty: e.ty,
          enabled: this.diff.checkpoints.includes(e.ch),
          passed: this.passed.has(e.tx),
        });
      } else if (e.ch === 'F' || e.ch === '|') {
        this.goalX = Math.min(this.goalX, e.tx * TILE + 7);
      } else {
        const enemy = createEnemy(e.ch, e.tx, e.ty, this.diff);
        if (enemy) this.enemies.push(enemy);
      }
    }
  }

  respawn() {
    const p = this.checkpoint || spawnPoint(this.level);
    this.player = new Player(p.x, p.y);
    this.time = START_TIME;
    this.timeTicks = 0;
    this.state = 'playing';
    this.deathTimer = 0;
    this.safe = null;
  }

  miss() {
    if (this.state !== 'playing') return;
    this.state = 'dying';
    this.deathTimer = DEATH_TICKS;
    // 敵に当たったときは小さく跳ねて落ちる（穴に落ちたときはそのまま）
    if (!this.player.fell) this.player.vy = -4;
  }

  update(input, viewW) {
    if (this.state === 'dying') {
      this.updateDying();
      return;
    }
    if (this.state !== 'playing') {
      this.resultTicks++;
      return;
    }

    const p = this.player;
    p.update(input, this.level);
    if (p.lastHit.ceil) this.hitBlock(p.lastHit.ceil.tx, p.lastHit.ceil.ty);
    this.updateSafeGround();
    if (p.fell) {
      this.onFall();
      if (this.state !== 'playing') return;
    }
    this.camX = cameraX(p.x + p.w / 2, viewW, this.level.width * TILE);
    this.updateItems();
    this.updateEnemies(input, viewW);
    if (this.state !== 'playing') return;
    this.updateCheckpoints();
    this.updateTimer();
    if (this.state === 'playing' && p.x + p.w >= this.goalX) this.clear();
  }

  updateDying() {
    const p = this.player;
    if (!p.fell) {
      p.vy = Math.min(p.vy + 0.25, 5);
      p.y += p.vy;
    }
    this.deathTimer--;
    if (this.deathTimer > 0) return;
    this.lives--;
    if (this.lives <= 0) {
      this.state = 'gameover';
      return;
    }
    this.loadStage();
    this.respawn();
  }

  onFall() {
    const p = this.player;
    if (this.diff.pitRescue && this.safe) {
      p.x = this.safe.x;
      p.y = this.safe.y;
      p.vx = 0;
      p.vy = 0;
      p.fell = false;
      p.invuln = RESCUE_INVULN;
      return;
    }
    this.miss();
  }

  // 両足が地面に乗っている位置を覚えておく（かんたんの穴の救済用）
  updateSafeGround() {
    const p = this.player;
    if (!p.onGround) return;
    const ty = Math.floor((p.y + p.h + 1) / TILE);
    const left = Math.floor(p.x / TILE);
    const right = Math.floor((p.x + p.w - 0.001) / TILE);
    if (isSolid(this.level, left, ty) && isSolid(this.level, right, ty)) this.safe = { x: p.x, y: p.y };
  }

  hitBlock(tx, ty) {
    if (tileAt(this.level, tx, ty) !== QUESTION) return;
    setTile(this.level, tx, ty, USED);
    this.usedBlocks.add(ty * this.level.width + tx);
    const kind = this.level.contents.get(ty * this.level.width + tx) || 'coin';
    if (kind === 'coin') {
      this.addCoin();
      this.items.push(popCoin(tx, ty));
    } else {
      this.items.push(popItem(kind, tx, ty));
    }
  }

  addCoin() {
    this.coins++;
    this.score += COIN_SCORE;
  }

  updateItems() {
    const p = this.player;
    for (const it of this.items) {
      if (it.taken) continue;
      updateItem(it);
      if (!collectible(it) || !overlap(p, itemBox(it))) continue;
      it.taken = true;
      if (it.kind === 'coin') {
        this.addCoin();
        this.takenCoins.add(`${it.x / TILE},${it.y / TILE}`);
      } else if (it.kind === 'drink') {
        if (this.lives >= LIVES) this.score += DRINK_BONUS;
        else this.lives++;
      } else if (it.kind === 'star') {
        p.star = STAR_TICKS;
      }
    }
    if (this.items.some((it) => it.taken)) this.items = this.items.filter((it) => !it.taken);
  }

  updateEnemies(input, viewW) {
    const p = this.player;
    // 2匹同時に踏んでも両方倒せるよう、落下中かどうかは最初に決めて、跳ね返りは最後に1回
    const falling = p.vy > 0;
    let stomped = false;
    for (const e of this.enemies) {
      if (e.removed) continue;
      // 画面の右端から1タイル以内に入ったら動き出す
      if (!e.active) {
        if (e.x < this.camX + viewW + TILE) e.active = true;
        else continue;
      }
      updateEnemy(e, this.level, p);
      if (e.removed || e.dead || e.squash > 0 || !overlap(p, e)) continue;
      if (p.star > 0) {
        e.dead = true;
        e.vy = -3;
        continue;
      }
      if (e.stompable && falling && p.prevY + p.h <= e.y + 6) {
        e.squash = 30;
        stomped = true;
        continue;
      }
      if (p.invuln > 0) continue;
      this.miss();
      return;
    }
    if (stomped) p.vy = input.jump ? STOMP_BOUNCE_HOLD : STOMP_BOUNCE;
  }

  updateCheckpoints() {
    const p = this.player;
    for (const cp of this.checkpoints) {
      if (!cp.enabled || cp.passed || p.x < cp.tx * TILE) continue;
      cp.passed = true;
      this.passed.add(cp.tx);
      this.checkpoint = { x: cp.tx * TILE + 2, y: (cp.ty + 1) * TILE - p.h };
    }
  }

  updateTimer() {
    this.timeTicks++;
    if (this.timeTicks < 60) return;
    this.timeTicks = 0;
    this.time--;
    if (this.time <= 0) {
      this.time = 0;
      this.miss();
    }
  }

  // 結果を見せ終わって、やり直しを受け付けてよいか
  canRestart() {
    return (this.state === 'clear' || this.state === 'gameover') && this.resultTicks >= RESULT_LOCK;
  }

  clear() {
    this.state = 'clear';
    this.score += this.time * TIME_BONUS;
  }
}
