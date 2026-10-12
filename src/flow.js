import { addName, removeName } from './names.js?v=d96f255';

// 画面の流れ（タイトル → だれが遊ぶ／名前 → キャラ → むずかしさ → ステージ → 結果）。DOM に依存しない
export const MAX_NAME = 8;
export const AVATAR_IDS = ['kyugo', 'soki'];
export const DIFFICULTY_IDS = ['easy', 'normal', 'hard'];
export const START_LIVES = 3;

const BACK = { pick: 'title', avatar: 'name', difficulty: 'avatar' };

export class Flow {
  constructor(stageCount, { savedNames = [], onSavedNamesChange = () => {} } = {}) {
    this.stageCount = stageCount;
    // その端末で入れたことのある名前と、変わったときに保存する関数
    this.savedNames = savedNames;
    this.onSavedNamesChange = onSavedNamesChange;
    this.deleting = null;
    this.screen = 'title';
    this.name = '';
    this.avatar = 'kyugo';
    this.difficulty = 'normal';
    this.stageIndex = 0;
    this.carry = { lives: START_LIVES, score: 0, coins: 0 };
    this.result = null;
    this.paused = false;
    // 「STAGE 1」の間に頼まれた一時停止（縦向きにしたときなど）
    this.pausePending = false;
  }

  start() {
    if (this.screen !== 'title') return;
    this.name = '';
    this.deleting = null;
    this.screen = this.savedNames.length ? 'pick' : 'name';
  }

  pickName(name) {
    if (this.screen !== 'pick' || this.deleting || !this.savedNames.includes(name)) return;
    this.name = name;
    this.remember(name);
    this.screen = 'avatar';
  }

  newName() {
    if (this.screen !== 'pick') return;
    this.name = '';
    this.screen = 'name';
  }

  askDelete(name) {
    if (this.screen === 'pick' && this.savedNames.includes(name)) this.deleting = name;
  }

  confirmDelete() {
    if (!this.deleting) return;
    this.savedNames = removeName(this.savedNames, this.deleting);
    this.onSavedNamesChange(this.savedNames);
    this.deleting = null;
  }

  cancelDelete() {
    this.deleting = null;
  }

  remember(name) {
    this.savedNames = addName(this.savedNames, name);
    this.onSavedNamesChange(this.savedNames);
  }

  typeLetter(ch) {
    if (this.screen !== 'name') return;
    const c = String(ch).toUpperCase();
    if (!/^[A-Z]$/.test(c) || this.name.length >= MAX_NAME) return;
    this.name += c;
  }

  deleteLetter() {
    if (this.screen === 'name') this.name = this.name.slice(0, -1);
  }

  canConfirmName() {
    return this.name.length > 0;
  }

  confirmName() {
    if (this.screen !== 'name' || !this.canConfirmName()) return;
    this.remember(this.name);
    this.screen = 'avatar';
  }

  back() {
    if (this.screen === 'name') this.screen = this.savedNames.length ? 'pick' : 'title';
    else if (BACK[this.screen]) this.screen = BACK[this.screen];
  }

  chooseAvatar(id) {
    if (this.screen !== 'avatar' || !AVATAR_IDS.includes(id)) return;
    this.avatar = id;
    this.screen = 'difficulty';
  }

  chooseDifficulty(id) {
    if (this.screen !== 'difficulty' || !DIFFICULTY_IDS.includes(id)) return;
    this.difficulty = id;
    this.stageIndex = 0;
    this.carry = { lives: START_LIVES, score: 0, coins: 0 };
    this.result = null;
    this.screen = 'intro';
  }

  beginStage() {
    if (this.screen !== 'intro') return;
    this.screen = 'play';
    this.paused = this.pausePending;
    this.pausePending = false;
  }

  stageCleared({ lives, score, coins }) {
    if (this.screen !== 'play') return;
    this.carry = { lives, score, coins };
    if (this.stageIndex + 1 < this.stageCount) {
      this.stageIndex++;
      this.screen = 'intro';
    } else {
      this.result = { type: 'clear', score, coins };
      this.screen = 'result';
    }
  }

  gameOver({ score, coins }) {
    if (this.screen !== 'play') return;
    this.result = { type: 'gameover', score, coins };
    this.screen = 'result';
  }

  pause() {
    if (this.screen === 'play') this.paused = true;
    else if (this.screen === 'intro') this.pausePending = true;
  }

  resume() {
    this.paused = false;
  }

  quitToTitle() {
    this.screen = 'title';
    this.paused = false;
    this.pausePending = false;
    this.result = null;
  }

  finish() {
    if (this.screen !== 'result') return;
    this.screen = 'title';
    this.result = null;
  }
}
