// 1日に遊べる時間（KYUGO と SOKI の名前のときだけ、1日15分）。端末ごとに数える。DOM に依存しない
export const LIMITED_NAMES = ['KYUGO', 'SOKI'];
export const DAILY_LIMIT_MS = 15 * 60 * 1000;
const KEY = 'kyugo-soki.playtime';

export function isLimited(name) {
  return LIMITED_NAMES.includes(name);
}

// 「のこり 12ふん」（切り上げ）。1分以下は「のこり 45びょう」
export function formatLeft(ms) {
  const left = Math.max(0, ms);
  if (left > 60000) return `のこり ${Math.ceil(left / 60000)}ふん`;
  return `のこり ${Math.ceil(left / 1000)}びょう`;
}

function dayKey(d) {
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

export class PlayTime {
  constructor(storage, now = () => new Date()) {
    this.storage = storage;
    this.now = now;
    this.data = this.load();
  }

  load() {
    try {
      const v = JSON.parse(this.storage.getItem(KEY));
      if (v && typeof v.day === 'string' && v.used && typeof v.used === 'object') return v;
    } catch {
      // 保存できない端末や壊れたデータでも止まらない
    }
    return { day: '', used: {} };
  }

  // 日付が変わっていたら、0 から数え直す
  today() {
    const day = dayKey(this.now());
    if (this.data.day !== day) this.data = { day, used: {} };
    return this.data;
  }

  // きょうの のこり（ミリ秒）。制限のない名前は Infinity
  remaining(name) {
    if (!isLimited(name)) return Infinity;
    const used = Number(this.today().used[name]) || 0;
    return Math.max(0, DAILY_LIMIT_MS - used);
  }

  add(name, ms) {
    if (!isLimited(name)) return;
    const d = this.today();
    d.used[name] = (Number(d.used[name]) || 0) + ms;
    try {
      this.storage.setItem(KEY, JSON.stringify(d));
    } catch {
      // 保存できなくても、開いている間は数える
    }
  }
}
