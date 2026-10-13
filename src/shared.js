import { emptyRanking, validEntry, RANK_SIZE } from './ranking.js?v=69fd9b8';

// みんなのランキング（遠くの家族の端末で遊んだ記録もまとめる）。DOM に依存しない
// 記録の置き場所は Google スプレッドシート（apps-script/Code.gs）。URL は src/config.js に書く
const PENDING_KEY = 'kyugo-soki.pending';
const CACHE_KEY = 'kyugo-soki.shared';
const MIGRATED_KEY = 'kyugo-soki.migrated';
const LEVELS = ['easy', 'normal', 'hard'];

function read(storage, key, fallback) {
  try {
    const v = JSON.parse(storage.getItem(key));
    return v ?? fallback;
  } catch {
    return fallback;
  }
}

function write(storage, key, value) {
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {
    // 保存できない端末でも止まらない
  }
}

const pick = ({ id, name, avatar, score, date }) => ({ id, name, avatar, score, date });

// サーバーから受け取ったランキングを、おかしな記録を除いて整える
function clean(r) {
  const out = emptyRanking();
  for (const lv of LEVELS) {
    if (r && Array.isArray(r[lv])) out[lv] = r[lv].filter((e) => validEntry(e) && typeof e.id === 'string').map(pick);
  }
  return out;
}

// みんなのランキングに、まだ送っていない記録を合わせて、レベルごとに上位10人（同点は先にあった方が上）
export function mergeRanking(ranking, pending) {
  const out = emptyRanking();
  for (const lv of LEVELS) {
    const list = [...ranking[lv]];
    const ids = new Set(list.map((e) => e.id));
    for (const p of pending) if (p.level === lv && !ids.has(p.id)) list.push(pick(p));
    out[lv] = list
      .map((e, i) => ({ e, i }))
      .sort((a, b) => b.e.score - a.e.score || a.i - b.i)
      .map(({ e }) => e)
      .slice(0, RANK_SIZE);
  }
  return out;
}

export class SharedRanking {
  constructor({ url, fetch, storage, makeId }) {
    this.url = url;
    this.fetch = fetch;
    this.storage = storage;
    this.makeId = makeId;
    this.pending = read(storage, PENDING_KEY, []).filter((p) => validEntry(p) && LEVELS.includes(p.level));
    this.cache = clean(read(storage, CACHE_KEY, null));
    this.sending = null;
  }

  get enabled() {
    return Boolean(this.url);
  }

  view() {
    return mergeRanking(this.cache, this.pending);
  }

  // 遊び終わった記録。まず端末にためて、送る
  add(level, entry) {
    this.pending.push({ ...pick(entry), id: entry.id || this.makeId(), level });
    write(this.storage, PENDING_KEY, this.pending);
    return this.flush();
  }

  // ためた記録を送る。送れた物だけ消す（同じ記録が2回届いても、サーバーが1つにまとめる）
  flush() {
    if (!this.enabled) return Promise.resolve();
    if (!this.sending) {
      this.sending = (async () => {
        for (const p of [...this.pending]) {
          try {
            // text/plain で送る（Google のサーバーへ、確認の通信なしで届く）
            const res = await this.fetch(this.url, { method: 'POST', body: JSON.stringify(p) });
            if (!res.ok) break;
          } catch {
            break;
          }
          this.pending = this.pending.filter((q) => q.id !== p.id);
          write(this.storage, PENDING_KEY, this.pending);
        }
      })().finally(() => {
        this.sending = null;
      });
    }
    return this.sending;
  }

  // 送ってから、みんなのランキングを受け取り直す。つながらなければ前に受け取った物
  async refresh() {
    if (!this.enabled) return this.view();
    await this.flush();
    try {
      const res = await this.fetch(this.url, { method: 'GET' });
      if (res.ok) {
        this.cache = clean(await res.json());
        write(this.storage, CACHE_KEY, this.cache);
      }
    } catch {
      // 前に受け取った物のまま
    }
    return this.view();
  }

  // みんなのランキングを全部消す（パスワードはサーバーでも確かめる）。消せたら true。
  // 消せたら、端末に受け取っていた物と、まだ送っていない記録も消す
  async reset(password) {
    if (!this.enabled) return false;
    try {
      const res = await this.fetch(this.url, { method: 'POST', body: JSON.stringify({ action: 'reset', password }) });
      if (!res.ok || !(await res.json()).ok) return false;
    } catch {
      return false;
    }
    this.cache = emptyRanking();
    this.pending = [];
    write(this.storage, CACHE_KEY, this.cache);
    write(this.storage, PENDING_KEY, this.pending);
    return true;
  }

  // 共有を始める前にこの端末にあったランキングを、最初の1回だけ送る分に入れる
  migrate(local) {
    if (!this.enabled || read(this.storage, MIGRATED_KEY, false)) return;
    for (const lv of LEVELS) for (const e of local[lv] || []) this.pending.push({ ...pick(e), id: this.makeId(), level: lv });
    write(this.storage, PENDING_KEY, this.pending);
    write(this.storage, MIGRATED_KEY, true);
  }
}
