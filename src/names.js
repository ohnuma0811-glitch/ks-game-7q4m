// その端末で入れたことのある名前（最近遊んだ人が先頭）。保存先は端末のブラウザの中（localStorage）
export const MAX_SAVED_NAMES = 8;
const KEY = 'kyugo-soki.names';
const VALID = /^[A-Z]{1,8}$/;

export function addName(list, name) {
  return [name, ...list.filter((n) => n !== name)].slice(0, MAX_SAVED_NAMES);
}

export function removeName(list, name) {
  return list.filter((n) => n !== name);
}

// 保存できない端末（プライベートモードなど）や壊れたデータでも止まらない
export function loadNames(storage) {
  try {
    const v = JSON.parse(storage.getItem(KEY) || '[]');
    if (!Array.isArray(v)) return [];
    return v.filter((n) => typeof n === 'string' && VALID.test(n)).slice(0, MAX_SAVED_NAMES);
  } catch {
    return [];
  }
}

export function saveNames(storage, list) {
  try {
    storage.setItem(KEY, JSON.stringify(list));
    return true;
  } catch {
    return false;
  }
}
