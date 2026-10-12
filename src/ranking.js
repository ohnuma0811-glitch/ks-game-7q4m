// ランキング（難易度ごとに上位10位）。保存先は端末のブラウザの中（localStorage）。DOM に依存しない
export const RANK_SIZE = 10;
const KEY = 'kyugo-soki.ranking';
const LEVELS = ['easy', 'normal', 'hard'];
const AVATARS = ['kyugo', 'soki'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// 「年の下2桁-月-日」（例: 26-Oct-13）
export function formatDate(d) {
  const yy = String(d.getFullYear() % 100).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yy}-${MONTHS[d.getMonth()]}-${dd}`;
}

export function emptyRanking() {
  return { easy: [], normal: [], hard: [] };
}

// スコアの高い順に入れる。同点は先に記録した人が上。11位以下なら rank は 0 で list はそのまま
export function insertScore(list, entry) {
  let i = 0;
  while (i < list.length && list[i].score >= entry.score) i++;
  if (i >= RANK_SIZE) return { list, rank: 0 };
  return { list: [...list.slice(0, i), entry, ...list.slice(i)].slice(0, RANK_SIZE), rank: i + 1 };
}

function validEntry(e) {
  return Boolean(e)
    && typeof e.name === 'string' && /^[A-Z]{1,8}$/.test(e.name)
    && AVATARS.includes(e.avatar)
    && Number.isInteger(e.score) && e.score >= 0
    && typeof e.date === 'string' && /^\d{2}-[A-Z][a-z]{2}-\d{2}$/.test(e.date);
}

// 保存できない端末や壊れたデータでも止まらない
export function loadRanking(storage) {
  const r = emptyRanking();
  try {
    const v = JSON.parse(storage.getItem(KEY) || '{}');
    for (const lv of LEVELS) {
      if (!Array.isArray(v[lv])) continue;
      r[lv] = v[lv]
        .filter(validEntry)
        .map(({ name, avatar, score, date }) => ({ name, avatar, score, date }))
        .sort((a, b) => b.score - a.score)
        .slice(0, RANK_SIZE);
    }
  } catch {
    return emptyRanking();
  }
  return r;
}

export function saveRanking(storage, ranking) {
  try {
    storage.setItem(KEY, JSON.stringify(ranking));
    return true;
  } catch {
    return false;
  }
}

// この端末で保存できるか（プライベートモードなどでは false）
export function storageWorks(storage) {
  try {
    const k = 'kyugo-soki.test';
    storage.setItem(k, '1');
    storage.removeItem(k);
    return true;
  } catch {
    return false;
  }
}
