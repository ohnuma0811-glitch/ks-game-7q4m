import { parseLevel, tileAt, setTile, isSolid, TILE, QUESTION, USED, LAVA, GATE, EMPTY } from './level.js?v=f9d92c9';
import { moveAndCollide } from './physics.js?v=f9d92c9';
import { createBoss, updateBoss, hitBoss, canStomp, HURT_TICKS } from './boss.js?v=f9d92c9';
import { createPlatform, createCloud, updatePlatform, PLATFORM_BOTTOM, LAVA_DIP_BOTTOM } from './platforms.js?v=f9d92c9';
import { Player, spawnPoint } from './player.js?v=f9d92c9';
import { cameraX } from './camera.js?v=f9d92c9';
import { createEnemy, updateEnemy } from './enemies.js?v=f9d92c9';
import { createCoin, popCoin, popItem, updateItem, itemBox, collectible } from './items.js?v=f9d92c9';
import { getDifficulty } from './difficulty.js?v=f9d92c9';

export const LIVES = 3;
export const START_TIME = 200;
// スターの無敵時間（7.5秒。M3 実機確認で15秒から半分に）
export const STAR_TICKS = 450;
export const DEATH_TICKS = 90;
export const COIN_SCORE = 100;
export const DRINK_BONUS = 3000;
export const TIME_BONUS = 10;
// 敵を倒したとき（踏む・スター）
export const ENEMY_SCORE = 200;
// 敵の種類ごとの点（トゲトゲはスターでしか倒せない）
export const ENEMY_POINTS = { walker: ENEMY_SCORE, jumper: 300, spike: 400 };
// 着地する前に続けて踏むと、点が 2倍・3倍になる（3倍まで）
export const MAX_COMBO = 3;
// 服を着ているときに敵に当たると、服が脱げて続けられる（点はマイナス、0より下にはならない）
export const SHIRT_PENALTY = 1000;
// 服が脱げたあと、敵に当たらない時間（2秒）
export const HURT_INVULN = 120;
// 足元からこのドット数より低い所で敵に触れたら、踏んだことにする（キャラの背は22）
export const LOW_STOMP = 8;
// ステージをクリアしたときの、残りライフ1つあたりの点数
export const LIFE_BONUS = 1000;
// ボスを1回踏む / 倒す
export const BOSS_HIT_SCORE = 1000;
export const BOSS_DOWN_SCORE = 5000;
// ボスを踏んだあとの無敵。ボスがひるんでいる間より長く（壁ぎわで重なったままミスにならないように）
const BOSS_STOMP_INVULN = HURT_TICKS + 20;
// ボスの火の玉（Level 3）の速さと大きさ
const FIRE_SPEED = 2.2;
// 赤いカエルの火の速さ
const FROG_FIRE_SPEED = 1.8;
const FIRE_W = 12;
const FIRE_H = 8;
export const STOMP_BOUNCE = -3.2;
export const STOMP_BOUNCE_HOLD = -4.6;
// クリア・ゲームオーバーの結果を見せる時間（この間はやり直しを受け付けない）
export const RESULT_LOCK = 60;
// 取った点数を浮かべて見せる時間（更新数）と、1更新で浮かぶ量
export const POPUP_TICKS = 40;
// ゴールで旗竿をすべり降りる速さ（ドット/更新）
const SLIDE_SPEED = 2;
const POPUP_RISE = 0.5;

// 旗竿のどの高さにさわったか（0=一番下、1=一番上）で点が決まる
export function goalPoints(ratio) {
  if (ratio >= 0.8) return 5000;
  if (ratio >= 0.6) return 2000;
  if (ratio >= 0.4) return 800;
  if (ratio >= 0.2) return 400;
  return 100;
}

// スターが切れる3秒前からのカウントダウン（3・2・1）。それより前とスターなしは null
export function starCountdown(star) {
  if (star <= 0 || star > 180) return null;
  return Math.ceil(star / 60);
}

export function overlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

export class Game {
  constructor(levelLines, { avatar = 'kyugo', difficulty = 'normal', name = '', lives = LIVES, score = 0, coins = 0, theme = 'grass', time = START_TIME, rng = Math.random } = {}) {
    this.lines = levelLines;
    // 赤いカエルが火を吹く間かくなど（テストでは決まった値にできる）
    this.rng = rng;
    this.avatar = avatar;
    this.name = name;
    // ステージの見た目（src/data/themes.js）
    this.theme = theme;
    // 制限時間（秒）。ステージごとに違う
    this.startTime = time;
    this.difficulty = difficulty;
    this.diff = getDifficulty(difficulty);
    this.lives = lives;
    this.coins = coins;
    this.score = score;
    this.checkpoint = null;
    this.passed = new Set();
    // 取ったコインと使った？ブロックは、出直しても戻らない（何度もミスして稼げないように）
    this.takenCoins = new Set();
    this.usedBlocks = new Set();
    this.resultTicks = 0;
    this.popups = [];
    // 起きたこと（音を鳴らすため）。読む側が空にする
    this.events = [];
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
    this.boss = null;
    this.fireballs = [];
    this.combo = 0;
    // 上下に動く足場（当たり判定から見えるよう level にも持たせる）
    this.platforms = [];
    let clouds = 0;
    this.level.platforms = this.platforms;
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
      } else if (e.ch === 'M' || e.ch === 'N') {
        // お城では溶岩に少し沈む
        const p = createPlatform(e.tx, e.ty, this.platforms.length, this.theme === 'castle' ? LAVA_DIP_BOTTOM : PLATFORM_BOTTOM);
        this.platforms.push(p);
        // 2つ目の足場: Level 2 はクリボー、Level 3 はカエル
        const rider = e.ch === 'N' ? { normal: 'W', hard: 'y' }[this.difficulty] : null;
        if (rider) {
          const enemy = createEnemy(rider, e.tx + 1, e.ty, this.diff);
          enemy.y = p.y - enemy.h;
          enemy.ride = p;
          this.enemies.push(enemy);
        }
      } else if (e.ch === 'V') {
        // 横に並んだ V の左端で、1つの雲にする。雲ごとに動き始めの向きを逆にする
        if (this.level.entities.some((o) => o.ch === 'V' && o.ty === e.ty && o.tx === e.tx - 1)) continue;
        let width = 1;
        while (this.level.entities.some((o) => o.ch === 'V' && o.ty === e.ty && o.tx === e.tx + width)) width++;
        clouds++;
        this.platforms.push(createCloud(e.tx, e.ty, width, clouds % 2 ? 1 : -1));
      } else if (e.ch === 'K') {
        this.boss = createBoss(e.tx, e.ty, this.diff);
      } else if (e.ch === 'F' || e.ch === '|') {
        this.goalX = Math.min(this.goalX, e.tx * TILE + 7);
        // 旗の布が降りる長さ（旗の行から竿の一番下の行まで）
        if (e.ch === 'F') this.flagRow = e.ty;
        else this.poleBottom = Math.max(this.poleBottom || 0, e.ty);
      } else {
        const enemy = createEnemy(e.ch, e.tx, e.ty, this.diff);
        if (enemy) this.enemies.push(enemy);
      }
    }
  }

  respawn() {
    const p = this.checkpoint || spawnPoint(this.level);
    this.player = new Player(p.x, p.y);
    this.time = this.startTime;
    this.timeTicks = 0;
    this.state = 'playing';
    this.deathTimer = 0;
  }

  // 敵・ボス・火の玉に当たった。服を着ていれば脱げるだけ、裸ならミス（穴・溶岩・時間切れは miss() ですぐミス）
  hurt() {
    const p = this.player;
    if (p.bare) {
      this.miss();
      return;
    }
    p.bare = true;
    p.invuln = HURT_INVULN;
    p.hurt = HURT_INVULN;
    this.score = Math.max(0, this.score - SHIRT_PENALTY);
    this.addPopup(-SHIRT_PENALTY, p.x + p.w / 2, p.y);
    this.events.push('shirt');
  }

  miss() {
    if (this.state !== 'playing') return;
    this.state = 'dying';
    this.deathTimer = DEATH_TICKS;
    this.events.push('miss');
    // 敵に当たったときは小さく跳ねて落ちる（穴に落ちたときはそのまま）
    if (!this.player.fell) this.player.vy = -4;
  }

  update(input, viewW) {
    this.updatePopups();
    if (this.state === 'dying') {
      this.updateDying();
      return;
    }
    if (this.state === 'clear' && !this.goalDone) {
      this.updateGoal();
      return;
    }
    if (this.state !== 'playing') {
      this.resultTicks++;
      return;
    }

    const p = this.player;
    this.updatePlatforms();
    p.update(input, this.level);
    if (p.jumped) this.events.push('jump');
    if (p.onGround) this.combo = 0;
    // スターがもうすぐ切れる合図（残り3・2・1秒）
    if (p.star === 180 || p.star === 120 || p.star === 60) this.events.push('starwarn');
    if (p.lastHit.ceil) this.hitBlock(p.lastHit.ceil.tx, p.lastHit.ceil.ty);
    if (p.fell || this.touchingLava()) {
      this.miss();
      return;
    }
    this.camX = cameraX(p.x + p.w / 2, viewW, this.level.width * TILE);
    this.updateItems();
    this.updateEnemies(input, viewW);
    if (this.state !== 'playing') return;
    this.updateBoss(viewW);
    if (this.state !== 'playing') return;
    // ボスと赤いカエルの火の玉
    this.updateFireballs();
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
      this.events.push('gameover');
      return;
    }
    this.loadStage();
    this.respawn();
  }

  // 動く足場を動かし、乗っているプレイヤーと敵も一緒に動かす
  updatePlatforms() {
    for (const pl of this.platforms) {
      updatePlatform(pl);
      if (this.player.lastHit.platform === pl) this.player.y += pl.dy;
      for (const e of this.enemies) if (e.ride === pl && !e.dead && !e.removed) e.y += pl.dy;
    }
  }

  // プレイヤーの体が溶岩のマスに重なっているか
  touchingLava() {
    const p = this.player;
    const x0 = Math.floor(p.x / TILE);
    const x1 = Math.floor((p.x + p.w - 0.001) / TILE);
    const y0 = Math.floor(p.y / TILE);
    const y1 = Math.floor((p.y + p.h - 0.001) / TILE);
    for (let ty = y0; ty <= y1; ty++) {
      for (let tx = x0; tx <= x1; tx++) if (tileAt(this.level, tx, ty) === LAVA) return true;
    }
    return false;
  }

  hitBlock(tx, ty) {
    if (tileAt(this.level, tx, ty) !== QUESTION) {
      this.events.push('bump');
      return;
    }
    setTile(this.level, tx, ty, USED);
    this.usedBlocks.add(ty * this.level.width + tx);
    let kind = this.level.contents.get(ty * this.level.width + tx) || 'coin';
    // Level 3 ではライフアップ（ドリンク）の代わりにコイン
    if (kind === 'drink' && this.diff.noDrink) kind = 'coin';
    if (kind === 'coin') {
      this.addCoin(tx * TILE + TILE / 2, ty * TILE - TILE / 2);
      this.items.push(popCoin(tx, ty));
    } else {
      this.items.push(popItem(kind, tx, ty));
      this.events.push('item');
    }
  }

  addCoin(x, y) {
    this.coins++;
    this.score += COIN_SCORE;
    this.events.push('coin');
    this.addPopup(COIN_SCORE, x, y);
  }

  // 取った点数を、その場所に小さく浮かべる（x は中心）
  addPopup(points, x, y) {
    this.popups.push({ text: String(points), x, y, life: POPUP_TICKS });
  }

  updatePopups() {
    if (this.popups.length === 0) return;
    for (const pop of this.popups) {
      pop.y -= POPUP_RISE;
      pop.life--;
    }
    this.popups = this.popups.filter((pop) => pop.life > 0);
  }

  updateItems() {
    const p = this.player;
    for (const it of this.items) {
      if (it.taken) continue;
      updateItem(it);
      if (!collectible(it) || !overlap(p, itemBox(it))) continue;
      it.taken = true;
      if (it.kind === 'coin') {
        this.addCoin(it.x + TILE / 2, it.y);
        this.takenCoins.add(`${it.x / TILE},${it.y / TILE}`);
      } else if (it.kind === 'drink') {
        this.events.push('drink');
        // 裸なら服が戻る。服を着ていればライフが1増える（ライフが3なら点）
        if (p.bare) {
          p.bare = false;
        } else if (this.lives >= LIVES) {
          this.score += DRINK_BONUS;
          this.addPopup(DRINK_BONUS, it.x + TILE / 2, it.y);
        } else {
          this.lives++;
        }
      } else if (it.kind === 'star') {
        p.star = STAR_TICKS;
        this.events.push('star');
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
      updateEnemy(e, this.level, p, this.rng);
      if (e.chargeStart) {
        e.chargeStart = false;
        this.events.push('charge');
      }
      if (e.fire) {
        e.fire = false;
        this.frogFire(e);
      }
      if (e.removed || e.dead || e.squash > 0 || !overlap(p, e)) continue;
      if (p.star > 0) {
        e.dead = true;
        e.vy = -3;
        const pts = ENEMY_POINTS[e.kind] || ENEMY_SCORE;
        this.score += pts;
        this.addPopup(pts, e.x + e.w / 2, e.y);
        this.events.push('kill');
        continue;
      }
      // 上から落ちてきて踏んだときのほか、足元に近い所で触れたときも踏んだことにする
      // （立っている足に下からカエルが跳んできた、など。ミスの判定を少しゆるく）
      const low = e.y >= p.y + p.h - LOW_STOMP;
      if (e.stompable && ((falling && p.prevY + p.h <= e.y + 6) || low)) {
        e.squash = 30;
        stomped = true;
        this.combo = Math.min(this.combo + 1, MAX_COMBO);
        const pts = (ENEMY_POINTS[e.kind] || ENEMY_SCORE) * this.combo;
        this.score += pts;
        this.addPopup(pts, e.x + e.w / 2, e.y);
        continue;
      }
      if (p.invuln > 0) continue;
      this.hurt();
      if (this.state !== 'playing') return;
    }
    if (stomped) {
      p.vy = input.jump ? STOMP_BOUNCE_HOLD : STOMP_BOUNCE;
      this.events.push(['stomp', 'stomp2', 'stomp3'][this.combo - 1]);
    }
  }

  updateBoss(viewW) {
    const b = this.boss;
    const p = this.player;
    if (!b || b.removed) return;
    // 画面に入ったら動き出す（ボスの曲に切り替える）
    if (!b.active) {
      if (b.x >= this.camX + viewW) return;
      b.active = true;
      this.events.push('bossstart');
    }
    const ev = updateBoss(b, this.level, p, this.rng);
    if (ev === 'shell') this.events.push('bossshell');
    if (ev === 'fire') {
      // 口の前から、向いている方へまっすぐ
      const x = b.dir < 0 ? b.x - FIRE_W + 2 : b.x + b.w - 2;
      this.fireballs.push({ x, y: b.y + 6, w: FIRE_W, h: FIRE_H, vx: b.dir * FIRE_SPEED });
      this.events.push('bossfire');
    }
    if (b.defeated || !overlap(p, b)) return;
    // ひるんでいる間とスター中は、どちらも傷つかない
    if (b.state === 'hurt' || p.star > 0) return;
    if (canStomp(b) && p.vy > 0 && p.prevY + p.h <= b.y + 8) {
      const r = hitBoss(b);
      p.vy = STOMP_BOUNCE_HOLD;
      p.invuln = BOSS_STOMP_INVULN;
      this.score += BOSS_HIT_SCORE;
      this.addPopup(BOSS_HIT_SCORE, b.x + b.w / 2, b.y);
      this.events.push('bosshit');
      if (r === 'down') {
        this.score += BOSS_DOWN_SCORE;
        this.addPopup(BOSS_DOWN_SCORE, b.x + b.w / 2, b.y - 10);
        this.events.push('bossdown');
        this.openGates();
        this.fireballs = [];
      }
      return;
    }
    if (p.invuln > 0) return;
    this.hurt();
  }

  // 火の玉はまっすぐ進み、壁や扉に当たると消える。触れるとミス（スター中・無敵中は平気）
  // 赤いカエルの火: 真上と、左右ななめ上に3発
  frogFire(e) {
    const x = e.x + e.w / 2 - FIRE_W / 2;
    const y = e.y - FIRE_H + 4;
    const d = FROG_FIRE_SPEED * Math.SQRT1_2;
    for (const [vx, vy] of [[0, -FROG_FIRE_SPEED], [-d, -d], [d, -d]]) {
      this.fireballs.push({ x, y, w: FIRE_W, h: FIRE_H, vx, vy });
    }
    this.events.push('frogfire');
  }

  updateFireballs() {
    const p = this.player;
    for (const f of this.fireballs) {
      f.x += f.vx;
      f.y += f.vy || 0;
      const tx = Math.floor((f.x + f.w / 2) / TILE);
      const ty = Math.floor((f.y + f.h / 2) / TILE);
      if (isSolid(this.level, tx, ty)) f.gone = true;
      // 画面の上やステージの外へ出たら消える
      if (f.y + f.h < 0 || f.x + f.w < 0 || f.x > this.level.width * TILE) f.gone = true;
      if (!f.gone && overlap(p, f) && p.star <= 0 && p.invuln <= 0) {
        f.gone = true;
        this.hurt();
        if (this.state !== 'playing') return;
      }
    }
    if (this.fireballs.some((f) => f.gone)) this.fireballs = this.fireballs.filter((f) => !f.gone);
  }

  // ボスを倒したら、扉（X）を消す
  openGates() {
    const { tiles } = this.level;
    for (let i = 0; i < tiles.length; i++) if (tiles[i] === GATE) tiles[i] = EMPTY;
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
    if (this.state === 'clear' && !this.goalDone) return false;
    return (this.state === 'clear' || this.state === 'gameover') && this.resultTicks >= RESULT_LOCK;
  }

  // ゴールの演出: キャラが竿をすべり降り、旗の布も下まで降りる
  updateGoal() {
    const p = this.player;
    if (!p.onGround) {
      p.vx = 0;
      p.vy = SLIDE_SPEED;
      p.onGround = moveAndCollide(p, this.level).onGround;
      p.anim = p.onGround ? 'stand' : 'jump';
    }
    const flagMax = Math.max(0, ((this.poleBottom || 0) - (this.flagRow || 0)) * TILE - TILE / 2);
    this.flagDrop = Math.min(flagMax, this.flagDrop + SLIDE_SPEED);
    if (p.onGround && this.flagDrop >= flagMax) this.goalDone = true;
  }

  clear() {
    this.state = 'clear';
    this.events.push('clear');
    const p = this.player;
    // さわった高さの点（敵を倒したときと同じように、その場所に数字を出す）
    const poleTop = (this.flagRow || 0) * TILE;
    const poleBottom = ((this.poleBottom || 0) + 1) * TILE;
    const ratio = Math.min(1, Math.max(0, (poleBottom - (p.y + p.h)) / Math.max(1, poleBottom - poleTop)));
    this.goalBonus = goalPoints(ratio);
    this.score += this.goalBonus;
    this.addPopup(this.goalBonus, this.goalX, p.y);
    // 竿にくっついて、すべり降りる準備
    p.x = this.goalX - p.w;
    p.vx = 0;
    p.vy = 0;
    p.facing = 1;
    p.onGround = false;
    this.flagDrop = 0;
    this.goalDone = false;
    this.score += this.time * TIME_BONUS + this.lives * LIFE_BONUS;
  }
}
