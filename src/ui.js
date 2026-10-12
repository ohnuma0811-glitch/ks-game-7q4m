import { screenModel, dispatch } from './screens.js?v=0fcb32f';

// screenModel を HTML のメニューにする。ボタンを押すと flow を進めて onAction を呼ぶ
export function createUI({ root, flow, gfx, onAction }) {
  let lastKey = '';

  function button(b) {
    const el = document.createElement('button');
    el.type = 'button';
    el.textContent = b.label;
    if (b.primary) el.className = 'primary';
    if (b.disabled) el.disabled = true;
    el.addEventListener('click', () => {
      dispatch(flow, b.act, b.arg);
      onAction();
    });
    return el;
  }

  function el(tag, className, text) {
    const e = document.createElement(tag);
    if (className) e.className = className;
    if (text !== undefined) e.textContent = text;
    return e;
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
    const panel = el('div', 'panel');
    panel.append(el('h1', '', m.heading));
    if (m.text) panel.append(el('p', '', m.text));
    if (m.nameBox !== undefined) panel.append(el('div', 'name-box', m.nameBox));
    if (m.letters) {
      const grid = el('div', 'letters');
      for (const l of m.letters) grid.append(button(l));
      panel.append(grid);
    }
    if (m.avatars) {
      const row = el('div', 'avatars');
      for (const a of m.avatars) {
        const b = button(a);
        const src = gfx.avatars[a.arg].stand.right;
        const c = document.createElement('canvas');
        c.width = src.width;
        c.height = src.height;
        c.getContext('2d').drawImage(src, 0, 0);
        b.prepend(c);
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
  }

  return { render };
}
