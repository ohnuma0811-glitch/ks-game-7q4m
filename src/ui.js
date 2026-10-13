import { screenModel, dispatch } from './screens.js?v=e6a2c48';

// screenModel を HTML のメニューにする。ボタンを押すと flow を進めて onAction を呼ぶ
// guard つきのメニューは、出てからこの時間はボタンを押せない（ゲーム中の連打で押されないように）
const GUARD_MS = 500;
// 長押しボタン（ランキングのリセット）を押し続ける時間
const LONG_PRESS_MS = 3000;

export function createUI({ root, flow, gfx, onAction }) {
  let lastKey = '';
  let guardTimer = 0;

  function button(b) {
    const el = document.createElement('button');
    el.type = 'button';
    el.textContent = b.label;
    if (b.primary) el.className = 'primary';
    if (b.selected) el.classList.add('selected');
    if (b.disabled) el.disabled = true;
    if (b.longPress) {
      // 押し続けたときだけ動く（子どもが間違えて押しても何も起きない）
      el.classList.add('long');
      let timer = 0;
      const cancel = () => {
        clearTimeout(timer);
        el.classList.remove('holding');
      };
      el.addEventListener('pointerdown', () => {
        el.classList.add('holding');
        timer = setTimeout(() => {
          cancel();
          dispatch(flow, b.act, b.arg);
          onAction();
        }, LONG_PRESS_MS);
      });
      for (const type of ['pointerup', 'pointerleave', 'pointercancel']) el.addEventListener(type, cancel);
      el.addEventListener('contextmenu', (e) => e.preventDefault());
      return el;
    }
    el.addEventListener('click', () => {
      dispatch(flow, b.act, b.arg);
      // 押したボタンを伝える（音を鳴らし始めるため。タッチの中で呼ぶ必要がある）
      onAction(b.act);
    });
    return el;
  }

  function el(tag, className, text) {
    const e = document.createElement(tag);
    if (className) e.className = className;
    if (text !== undefined) e.textContent = text;
    return e;
  }

  // ドット絵を拡大表示用の canvas にする（右向き／左向き）
  function sprite(id, facing, className) {
    const src = gfx.avatars[id].stand[facing];
    const c = document.createElement('canvas');
    c.width = src.width;
    c.height = src.height;
    c.getContext('2d').drawImage(src, 0, 0);
    if (className) c.className = className;
    return c;
  }

  function render() {
    const m = screenModel(flow);
    const key = JSON.stringify(m);
    if (key === lastKey) return;
    lastKey = key;
    root.replaceChildren();
    root.classList.toggle('show', Boolean(m));
    if (!m) return;
    root.dataset.screen = m.id;
    if (m.heroes) {
      // 左の Kyugo は右向き、右の Soki は左向きで、まん中を向く
      root.append(sprite(m.heroes[0], 'right', 'hero left'), sprite(m.heroes[1], 'left', 'hero right'));
    }
    const panel = el('div', 'panel');
    panel.append(el('h1', '', m.heading));
    if (m.text) panel.append(el('p', '', m.text));
    if (m.rankText) panel.append(el('p', 'rank-in', m.rankText));
    if (m.credits) {
      // エンドロール: 下から上へ流れて、最後の「おとうさんより」で止まる
      const box = el('div', 'credits');
      const roll = el('div', 'credits-roll');
      for (const line of m.credits) roll.append(el('p', line ? '' : 'gap', line || ' '));
      box.append(roll);
      panel.append(box);
    }
    if (m.tabs) {
      const tabs = el('div', 'tabs');
      for (const t of m.tabs) tabs.append(button(t));
      panel.append(tabs);
    }
    if (m.notice) panel.append(el('p', 'notice', m.notice));
    if (m.empty) panel.append(el('p', 'empty', m.empty));
    if (m.rows && m.rows.length) {
      // 5件ずつ2列。順位・顔・名前・日付・スコア
      const list = el('ol', 'rank-list');
      for (const r of m.rows) {
        const li = el('li', r.highlight ? 'rank-row highlight' : 'rank-row');
        li.append(el('span', 'rank', String(r.rank)), sprite(r.avatar, 'right', 'face'), el('span', 'name', r.name), el('span', 'date', r.date), el('span', 'score', String(r.score)));
        list.append(li);
      }
      panel.append(list);
    }
    if (m.nameBox !== undefined) panel.append(el('div', 'name-box', m.nameBox));
    if (m.savedNames) {
      const list = el('div', 'saved-names');
      for (const n of m.savedNames) {
        const chip = el('div', 'saved-name');
        const remove = button(n.remove);
        remove.className = 'remove';
        remove.setAttribute('aria-label', `${n.label} を けす`);
        chip.append(button(n), remove);
        list.append(chip);
      }
      panel.append(list);
    }
    if (m.keyRows) {
      const kb = el('div', 'keyboard');
      for (const row of m.keyRows) {
        const r = el('div', 'key-row');
        for (const k of row) r.append(button(k));
        kb.append(r);
      }
      panel.append(kb);
    }
    if (m.avatars) {
      const row = el('div', 'avatars');
      for (const a of m.avatars) {
        const b = button(a);
        b.prepend(sprite(a.arg, 'right'));
        row.append(b);
      }
      panel.append(row);
    }
    if (m.buttons.length) {
      const row = el('div', 'buttons');
      for (const b of m.buttons) row.append(button(b));
      panel.append(row);
    }
    root.append(panel);
    clearTimeout(guardTimer);
    if (m.guard) {
      const buttons = [...root.querySelectorAll('button:not(:disabled)')];
      for (const b of buttons) b.disabled = true;
      guardTimer = setTimeout(() => {
        for (const b of buttons) b.disabled = false;
      }, m.guardMs || GUARD_MS);
    }
  }

  return { render };
}
