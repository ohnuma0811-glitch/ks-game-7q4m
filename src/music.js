// 曲と効果音のデータ（Web Audio に依存しない）。メロディはすべてオリジナル
// 曲は「音名:長さ」を空白で並べる。長さは16分音符の数。R は休み、N はノイズ（打楽器）

const NOTE_BASE = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

export function noteFreq(name) {
  const m = /^([A-G])(#|b)?(\d)$/.exec(name);
  if (!m) throw new Error(`知らない音名 '${name}'`);
  const acc = m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0;
  const midi = 12 * (Number(m[3]) + 1) + NOTE_BASE[m[1]] + acc;
  return 440 * 2 ** ((midi - 69) / 12);
}

export function parseTrack(text) {
  return text.split(/\s+/).filter(Boolean).map((token) => {
    const m = /^([^:]+):(\d+)$/.exec(token);
    if (!m || Number(m[2]) <= 0) throw new Error(`音の書き方がおかしい '${token}'`);
    const len = Number(m[2]);
    if (m[1] === 'R') return { freq: null, len };
    if (m[1] === 'N') return { freq: null, noise: true, len };
    return { freq: noteFreq(m[1]), len };
  });
}

export function trackLength(track) {
  return track.reduce((s, n) => s + n.len, 0);
}

const rep = (s, n) => Array(n).fill(s).join(' ');

// bpm は4分音符の速さ。gain は音の大きさ（0〜1）
export const SONGS = {
  // タイトル: 勇ましい冒険の始まり。短調の行進から、明るく開ける（オリジナル）
  title: {
    bpm: 140,
    loop: true,
    tracks: [
      {
        wave: 'square',
        gain: 0.14,
        notes: [
          'A4:2 A4:1 A4:1 A4:2 C5:2 E5:2 A5:6',
          'G5:2 G5:1 G5:1 G5:2 F5:2 E5:2 D5:2 E5:4',
          'A5:3 E5:1 A5:2 B5:2 C6:4 B5:2 A5:2',
          'F5:3 C5:1 F5:2 G5:2 A5:6 R:2',
          'G5:3 D5:1 G5:2 A5:2 B5:4 A5:2 G5:2',
          'E5:6 G#5:2 B5:4 E6:4',
          'A5:3 E5:1 A5:2 B5:2 C6:4 D6:2 E6:2',
          'F6:4 E6:2 D6:2 C6:4 A5:4',
          'B5:3 C6:1 D6:2 B5:2 G5:4 B5:4',
          'A5:12 R:4',
          'E5:2 G5:2 C6:4 E6:2 D6:2 C6:4',
          'D6:2 B5:2 G5:4 B5:2 C6:2 D6:4',
          'C6:2 A5:2 F5:4 A5:2 B5:2 C6:4',
          'B5:6 A5:2 G5:8',
          'E5:2 G5:2 C6:4 E6:2 F6:2 G6:4',
          'F6:2 E6:2 D6:4 B5:2 C6:2 D6:4',
          'C6:3 A5:1 F6:4 E6:3 C6:1 A5:4',
          'B5:4 G#5:4 E5:4 B4:2 D5:2',
        ].join(' '),
      },
      {
        // ハモリ
        wave: 'square',
        gain: 0.07,
        notes: [
          'E4:2 E4:1 E4:1 E4:2 A4:2 C5:2 E5:6',
          'D5:2 D5:1 D5:1 D5:2 C5:2 B4:2 G4:2 B4:4',
          'C5:3 C5:1 C5:2 E5:2 E5:4 E5:2 C5:2',
          'A4:3 A4:1 A4:2 C5:2 C5:6 R:2',
          'B4:3 B4:1 B4:2 D5:2 D5:4 D5:2 B4:2',
          'B4:6 E5:2 G#5:4 B5:4',
          'C5:3 C5:1 C5:2 E5:2 E5:4 A5:2 C6:2',
          'A5:4 C6:2 A5:2 A5:4 F5:4',
          'G5:3 G5:1 B5:2 G5:2 D5:4 G5:4',
          'E5:12 R:4',
          'C5:2 E5:2 G5:4 C6:2 B5:2 G5:4',
          'B5:2 G5:2 D5:4 G5:2 A5:2 B5:4',
          'A5:2 F5:2 C5:4 F5:2 G5:2 A5:4',
          'G5:6 F5:2 D5:8',
          'C5:2 E5:2 G5:4 C6:2 D6:2 E6:4',
          'D6:2 C6:2 B5:4 G5:2 A5:2 B5:4',
          'A5:3 F5:1 C6:4 C6:3 A5:1 F5:4',
          'G#5:4 E5:4 B4:4 G#4:2 B4:2',
        ].join(' '),
      },
      {
        wave: 'triangle',
        gain: 0.3,
        notes: [
          'A2:2 A3:2 A2:2 A3:2 A2:2 A3:2 A2:2 A3:2',
          'G2:2 G3:2 G2:2 G3:2 E2:2 E3:2 E2:2 E3:2',
          'A2:2 E3:2 A2:2 E3:2 A2:2 E3:2 A2:2 E3:2',
          'F2:2 C3:2 F2:2 C3:2 F2:2 C3:2 F2:2 C3:2',
          'G2:2 D3:2 G2:2 D3:2 G2:2 D3:2 G2:2 D3:2',
          'E2:2 B2:2 E2:2 B2:2 E2:2 B2:2 E2:2 B2:2',
          'A2:2 E3:2 A2:2 E3:2 A2:2 E3:2 A2:2 E3:2',
          'F2:2 C3:2 F2:2 C3:2 F2:2 C3:2 F2:2 C3:2',
          'G2:2 D3:2 G2:2 D3:2 G2:2 D3:2 G2:2 D3:2',
          'A2:4 E2:4 A2:4 R:4',
          'C3:2 G3:2 C3:2 G3:2 C3:2 G3:2 C3:2 G3:2',
          'G2:2 D3:2 G2:2 D3:2 G2:2 D3:2 G2:2 D3:2',
          'F2:2 C3:2 F2:2 C3:2 F2:2 C3:2 F2:2 C3:2',
          'G2:2 D3:2 G2:2 D3:2 G2:2 D3:2 G2:2 D3:2',
          'C3:2 G3:2 C3:2 G3:2 C3:2 G3:2 C3:2 G3:2',
          'G2:2 D3:2 G2:2 D3:2 G2:2 D3:2 G2:2 D3:2',
          'F2:2 C3:2 F2:2 C3:2 F2:2 C3:2 F2:2 C3:2',
          'E2:2 B2:2 E2:2 B2:2 E2:2 E2:2 E3:2 E3:2',
        ].join(' '),
      },
      {
        wave: 'noise',
        gain: 0.05,
        notes: [
          'N:2 N:1 N:1 N:2 N:2 N:2 N:1 N:1 N:2 N:2',
          'N:1 N:1 N:1 N:1 N:1 N:1 N:1 N:1 N:2 N:2 N:2 N:2',
          'N:2 R:1 N:1 N:2 R:2 N:2 R:1 N:1 N:2 R:2',
          'N:2 R:1 N:1 N:2 R:2 N:2 R:1 N:1 N:2 R:2',
          'N:2 R:1 N:1 N:2 R:2 N:2 R:1 N:1 N:2 R:2',
          'N:2 R:1 N:1 N:2 R:2 N:2 R:1 N:1 N:2 R:2',
          'N:2 R:1 N:1 N:2 R:2 N:2 R:1 N:1 N:2 R:2',
          'N:2 R:1 N:1 N:2 R:2 N:2 R:1 N:1 N:2 R:2',
          'N:2 R:1 N:1 N:2 R:2 N:2 R:1 N:1 N:2 R:2',
          'N:1 N:1 N:1 N:1 N:1 N:1 N:1 N:1 N:2 N:2 N:2 N:2',
          'N:2 R:1 N:1 N:2 R:2 N:2 R:1 N:1 N:2 R:2',
          'N:2 R:1 N:1 N:2 R:2 N:2 R:1 N:1 N:2 R:2',
          'N:2 R:1 N:1 N:2 R:2 N:2 R:1 N:1 N:2 R:2',
          'N:2 R:1 N:1 N:2 R:2 N:2 R:1 N:1 N:2 R:2',
          'N:2 R:1 N:1 N:2 R:2 N:2 R:1 N:1 N:2 R:2',
          'N:2 R:1 N:1 N:2 R:2 N:2 R:1 N:1 N:2 R:2',
          'N:2 R:1 N:1 N:2 R:2 N:2 R:1 N:1 N:2 R:2',
          'N:1 N:1 N:1 N:1 N:1 N:1 N:1 N:1 N:2 N:2 N:2 N:2',
        ].join(' '),
      },
    ],
  },
  // 草原: 明るく弾む
  grass: {
    bpm: 150,
    loop: true,
    tracks: [
      {
        wave: 'square',
        gain: 0.16,
        notes: [
          'C5:2 E5:2 G5:2 E5:2 C5:2 E5:2 G5:4',
          'A5:2 G5:2 E5:2 C5:2 D5:4 R:4',
          'F5:2 A5:2 C6:2 A5:2 G5:2 E5:2 C5:4',
          'D5:2 E5:2 F5:2 D5:2 G5:8',
          'C5:2 E5:2 G5:2 E5:2 C5:2 E5:2 G5:4',
          'A5:2 C6:2 B5:2 A5:2 G5:4 E5:4',
          'F5:2 E5:2 D5:2 C5:2 D5:2 E5:2 F5:2 D5:2',
          'C5:8 R:8',
        ].join(' '),
      },
      {
        wave: 'triangle',
        gain: 0.3,
        notes: [
          'C3:4 G3:4 C3:4 G3:4',
          'A2:4 E3:4 A2:4 E3:4',
          'F2:4 C3:4 F2:4 C3:4',
          'G2:4 D3:4 G2:4 D3:4',
          'C3:4 G3:4 C3:4 G3:4',
          'A2:4 E3:4 A2:4 E3:4',
          'F2:4 C3:4 G2:4 D3:4',
          'C3:4 G3:4 C3:8',
        ].join(' '),
      },
      { wave: 'noise', gain: 0.06, notes: rep('N:2 R:2 N:1 R:1 N:2 N:2 R:2 N:1 R:1 N:2', 8) },
    ],
  },
  // 地下: 低く、ふしぎな感じ
  underground: {
    bpm: 120,
    loop: true,
    tracks: [
      {
        wave: 'square',
        gain: 0.13,
        notes: [
          'A4:2 C5:2 E5:2 A4:2 G4:2 B4:2 D5:2 G4:2',
          'F4:2 A4:2 C5:2 F4:2 E4:4 R:4',
          'A4:2 C5:2 E5:2 A5:2 G5:2 E5:2 D5:2 B4:2',
          'C5:2 B4:2 A4:2 G#4:2 A4:8',
        ].join(' '),
      },
      {
        wave: 'triangle',
        gain: 0.32,
        notes: 'A2:4 R:4 G2:4 R:4 F2:4 R:4 E2:4 R:4 A2:4 R:4 G2:4 R:4 E2:4 E2:4 A2:8',
      },
      { wave: 'noise', gain: 0.05, notes: rep('N:1 R:3', 16) },
    ],
  },
  // 空: 軽やか
  sky: {
    bpm: 140,
    loop: true,
    tracks: [
      {
        wave: 'square',
        gain: 0.15,
        notes: 'E5:4 G5:2 A5:2 G5:4 E5:4 D5:4 E5:2 G5:2 E5:8 C5:4 D5:2 E5:2 G5:4 A5:4 G5:8 R:8',
      },
      {
        wave: 'triangle',
        gain: 0.3,
        notes: 'C3:4 E3:4 G3:4 E3:4 G2:4 B2:4 D3:4 B2:4 F2:4 A2:4 C3:4 A2:4 C3:4 G2:4 C3:8',
      },
      { wave: 'noise', gain: 0.05, notes: rep('N:2 R:6', 8) },
    ],
  },
  // お城: 緊張感
  castle: {
    bpm: 140,
    loop: true,
    tracks: [
      {
        wave: 'square',
        gain: 0.14,
        notes: [
          'A4:2 A4:2 G#4:2 A4:2 C5:2 B4:2 A4:2 E4:2',
          'F4:2 F4:2 E4:2 F4:2 A4:2 G#4:2 E4:4',
          'D5:2 D5:2 C#5:2 D5:2 F5:2 E5:2 D5:2 A4:2',
          'B4:2 C5:2 B4:2 G#4:2 A4:8',
        ].join(' '),
      },
      {
        wave: 'triangle',
        gain: 0.32,
        notes: [rep('A2:2', 8), rep('F2:2', 4), rep('E2:2', 4), rep('D2:2', 8), rep('E2:2', 4), 'A2:8'].join(' '),
      },
      { wave: 'noise', gain: 0.06, notes: rep('N:2 R:2 N:2 R:2 N:2 R:2 N:1 N:1 N:2', 4) },
    ],
  },
  // ボス: 速く、緊張感
  boss: {
    bpm: 170,
    loop: true,
    tracks: [
      {
        wave: 'square',
        gain: 0.15,
        notes: [
          'E4:2 E4:2 G4:2 E4:2 A4:2 E4:2 Bb4:2 A4:2',
          'E4:2 E4:2 G4:2 E4:2 D5:2 C5:2 B4:2 G4:2',
          'E5:2 D5:2 C5:2 B4:2 A4:2 G4:2 F#4:2 G4:2',
          'A4:4 B4:4 E4:8',
        ].join(' '),
      },
      {
        wave: 'triangle',
        gain: 0.32,
        notes: [rep('E2:2 E3:2', 8), rep('C2:2 C3:2', 2), rep('D2:2 D3:2', 2), rep('B1:2 B2:2', 4)].join(' '),
      },
      { wave: 'noise', gain: 0.07, notes: rep('N:1 N:1 R:2 N:2 R:2', 8) },
    ],
  },
  // エンディング: 豪華に。ファンファーレ → 行進のメロディ → やさしい中間 → もう一度メロディで盛り上げて終わる（オリジナル）
  ending: {
    bpm: 120,
    loop: true,
    tracks: [
      {
        wave: 'square',
        gain: 0.14,
        notes: [
          'G4:2 C5:2 E5:2 G5:2 C6:6 G5:2',
          'A5:2 F5:2 A5:2 C6:2 F6:6 E6:2',
          'D6:3 C6:1 B5:2 A5:2 G5:3 F5:1 E5:2 D5:2',
          'G5:4 G5:2 A5:2 B5:4 D6:4',
          'E5:4 G5:2 E5:2 C6:4 G5:4',
          'D5:4 G5:2 D5:2 B5:4 G5:4',
          'C5:2 E5:2 A5:4 G5:2 A5:2 C6:4',
          'A5:6 G5:2 F5:4 E5:4',
          'E5:4 G5:2 E5:2 C6:4 E6:4',
          'D6:4 B5:2 G5:2 D6:4 B5:4',
          'A5:2 C6:2 F6:4 D6:2 B5:2 G5:4',
          'C6:12 R:4',
          'A5:6 C6:2 A5:4 F5:4',
          'B5:6 D6:2 B5:4 G5:4',
          'G5:4 B5:4 E6:6 D6:2',
          'C6:4 B5:2 A5:2 E5:8',
          'F5:4 A5:4 D6:6 C6:2',
          'B5:4 A5:2 G5:2 D5:8',
          'E5:2 G5:2 C6:2 E6:2 D6:2 C6:2 B5:2 C6:2',
          'D6:8 G5:2 A5:2 B5:2 D6:2',
          'E5:4 G5:2 E5:2 C6:4 G5:4',
          'D5:4 G5:2 D5:2 B5:4 G5:4',
          'C5:2 E5:2 A5:4 G5:2 A5:2 C6:4',
          'A5:6 G5:2 F5:4 E5:4',
          'E5:4 G5:2 E5:2 C6:4 E6:4',
          'D6:4 B5:2 G5:2 D6:4 B5:4',
          'A5:2 C6:2 F6:4 D6:2 B5:2 G5:4',
          'C6:4 E6:4 G6:4 E6:4',
          'C6:12 R:4',
        ].join(' '),
      },
      {
        // ハモリ
        wave: 'square',
        gain: 0.07,
        notes: [
          'E4:2 G4:2 C5:2 E5:2 E5:6 E5:2',
          'F4:2 A4:2 C5:2 F5:2 A5:6 G5:2',
          'B5:3 A5:1 G5:2 F5:2 E5:3 D5:1 C5:2 B4:2',
          'D5:4 D5:2 F5:2 G5:4 B5:4',
          'C5:4 E5:2 C5:2 E5:4 E5:4',
          'B4:4 D5:2 B4:2 D5:4 D5:4',
          'A4:2 C5:2 E5:4 E5:2 E5:2 E5:4',
          'F5:6 E5:2 C5:4 C5:4',
          'C5:4 E5:2 C5:2 G5:4 G5:4',
          'B5:4 G5:2 D5:2 B5:4 G5:4',
          'F5:2 A5:2 C6:4 B5:2 G5:2 D5:4',
          'E5:12 R:4',
          'F5:6 A5:2 F5:4 C5:4',
          'G5:6 B5:2 G5:4 D5:4',
          'E5:4 G5:4 B5:6 B5:2',
          'A5:4 G5:2 E5:2 C5:8',
          'D5:4 F5:4 A5:6 A5:2',
          'G5:4 F5:2 D5:2 B4:8',
          'C5:2 E5:2 G5:2 C6:2 B5:2 A5:2 G5:2 G5:2',
          'B5:8 D5:2 F5:2 G5:2 B5:2',
          'C5:4 E5:2 C5:2 E5:4 E5:4',
          'B4:4 D5:2 B4:2 D5:4 D5:4',
          'A4:2 C5:2 E5:4 E5:2 E5:2 E5:4',
          'F5:6 E5:2 C5:4 C5:4',
          'C5:4 E5:2 C5:2 G5:4 G5:4',
          'B5:4 G5:2 D5:2 B5:4 G5:4',
          'F5:2 A5:2 C6:4 B5:2 G5:2 D5:4',
          'E5:4 G5:4 C6:4 G5:4',
          'G5:12 R:4',
        ].join(' '),
      },
      {
        wave: 'triangle',
        gain: 0.3,
        notes: [
          'C3:2 C4:2 C3:2 C4:2 C3:2 C4:2 C3:2 C4:2',
          'F2:2 F3:2 F2:2 F3:2 F2:2 F3:2 F2:2 F3:2',
          'D3:2 D4:2 D3:2 D4:2 G2:2 G3:2 G2:2 G3:2',
          'G2:4 G2:2 G2:2 G2:4 G2:4',
          'C3:2 G3:2 C3:2 G3:2 C3:2 G3:2 C3:2 G3:2',
          'G2:2 D3:2 G2:2 D3:2 G2:2 D3:2 G2:2 D3:2',
          'A2:2 E3:2 A2:2 E3:2 A2:2 E3:2 A2:2 E3:2',
          'F2:2 C3:2 F2:2 C3:2 F2:2 C3:2 F2:2 C3:2',
          'C3:2 G3:2 C3:2 G3:2 C3:2 G3:2 C3:2 G3:2',
          'G2:2 D3:2 G2:2 D3:2 G2:2 D3:2 G2:2 D3:2',
          'F2:2 C3:2 F2:2 C3:2 G2:2 D3:2 G2:2 D3:2',
          'C3:4 G2:4 C3:4 R:4',
          'F2:2 C3:2 F2:2 C3:2 F2:2 C3:2 F2:2 C3:2',
          'G2:2 D3:2 G2:2 D3:2 G2:2 D3:2 G2:2 D3:2',
          'E2:2 B2:2 E2:2 B2:2 E2:2 B2:2 E2:2 B2:2',
          'A2:2 E3:2 A2:2 E3:2 A2:2 E3:2 A2:2 E3:2',
          'D3:2 A3:2 D3:2 A3:2 D3:2 A3:2 D3:2 A3:2',
          'G2:2 D3:2 G2:2 D3:2 G2:2 D3:2 G2:2 D3:2',
          'E2:2 C3:2 E2:2 C3:2 E2:2 C3:2 E2:2 C3:2',
          'G2:2 G2:2 G2:2 G2:2 G2:2 A2:2 B2:2 D3:2',
          'C3:2 G3:2 C3:2 G3:2 C3:2 G3:2 C3:2 G3:2',
          'G2:2 D3:2 G2:2 D3:2 G2:2 D3:2 G2:2 D3:2',
          'A2:2 E3:2 A2:2 E3:2 A2:2 E3:2 A2:2 E3:2',
          'F2:2 C3:2 F2:2 C3:2 F2:2 C3:2 F2:2 C3:2',
          'C3:2 G3:2 C3:2 G3:2 C3:2 G3:2 C3:2 G3:2',
          'G2:2 D3:2 G2:2 D3:2 G2:2 D3:2 G2:2 D3:2',
          'F2:2 C3:2 F2:2 C3:2 G2:2 D3:2 G2:2 D3:2',
          'C3:2 G3:2 C3:2 G3:2 C3:2 G3:2 C3:2 G3:2',
          'C2:12 R:4',
        ].join(' '),
      },
      {
        wave: 'noise',
        gain: 0.05,
        notes: [
          'N:2 R:2 N:1 N:1 N:2 N:2 R:2 N:1 N:1 N:2',
          'N:2 R:2 N:1 N:1 N:2 N:2 R:2 N:1 N:1 N:2',
          'N:2 R:2 N:1 N:1 N:2 N:2 R:2 N:1 N:1 N:2',
          'N:1 N:1 N:1 N:1 N:2 N:2 N:1 N:1 N:1 N:1 N:2 N:2',
          'N:2 R:2 N:2 N:2 N:2 R:2 N:2 N:2',
          'N:2 R:2 N:2 N:2 N:2 R:2 N:2 N:2',
          'N:2 R:2 N:2 N:2 N:2 R:2 N:2 N:2',
          'N:2 R:2 N:2 N:2 N:2 R:2 N:2 N:2',
          'N:2 R:2 N:2 N:2 N:2 R:2 N:2 N:2',
          'N:2 R:2 N:2 N:2 N:2 R:2 N:2 N:2',
          'N:2 R:2 N:2 N:2 N:2 R:2 N:2 N:2',
          'N:2 R:2 N:2 R:2 N:1 N:1 N:1 N:1 N:2 N:2',
          'N:2 R:2 N:2 R:2 N:2 R:2 N:2 R:2',
          'N:2 R:2 N:2 R:2 N:2 R:2 N:2 R:2',
          'N:2 R:2 N:2 R:2 N:2 R:2 N:2 R:2',
          'N:2 R:2 N:2 R:2 N:2 R:2 N:2 R:2',
          'N:2 R:2 N:2 R:2 N:2 R:2 N:2 R:2',
          'N:2 R:2 N:2 R:2 N:2 R:2 N:2 R:2',
          'N:2 R:2 N:2 R:2 N:2 R:2 N:2 R:2',
          'N:1 N:1 N:1 N:1 N:1 N:1 N:1 N:1 N:2 N:2 N:2 N:2',
          'N:2 N:1 N:1 N:2 N:2 N:2 N:1 N:1 N:2 N:2',
          'N:2 N:1 N:1 N:2 N:2 N:2 N:1 N:1 N:2 N:2',
          'N:2 N:1 N:1 N:2 N:2 N:2 N:1 N:1 N:2 N:2',
          'N:2 N:1 N:1 N:2 N:2 N:2 N:1 N:1 N:2 N:2',
          'N:2 N:1 N:1 N:2 N:2 N:2 N:1 N:1 N:2 N:2',
          'N:2 N:1 N:1 N:2 N:2 N:2 N:1 N:1 N:2 N:2',
          'N:2 N:1 N:1 N:2 N:2 N:2 N:1 N:1 N:2 N:2',
          'N:2 N:1 N:1 N:2 N:2 N:2 N:1 N:1 N:2 N:2',
          'N:2 N:2 N:2 R:10',
        ].join(' '),
      },
    ],
  },
  // スター中: 速く、わくわく
  star: {
    bpm: 200,
    loop: true,
    tracks: [
      {
        wave: 'square',
        gain: 0.15,
        notes: [
          'C5:2 C5:2 C5:2 C5:2 D5:2 D5:2 E5:2 E5:2',
          'G5:2 E5:2 G5:2 E5:2 F5:2 D5:2 F5:2 D5:2',
          'A5:2 A5:2 G5:2 G5:2 F5:2 F5:2 E5:2 E5:2',
          'D5:2 E5:2 F5:2 G5:2 C6:4 R:4',
        ].join(' '),
      },
      {
        wave: 'triangle',
        gain: 0.3,
        notes: [rep('C3:2 C4:2', 8), rep('F2:2 F3:2', 4), rep('G2:2 G3:2', 4)].join(' '),
      },
      { wave: 'noise', gain: 0.06, notes: rep('N:2', 32) },
    ],
  },
  // ステージクリア
  clear: {
    bpm: 160,
    loop: false,
    tracks: [
      { wave: 'square', gain: 0.18, notes: 'C5:2 D5:2 E5:2 C5:2 F5:2 A5:2 G5:4 E5:2 C6:14' },
      { wave: 'triangle', gain: 0.3, notes: 'C3:4 A2:4 F2:4 G2:4 C3:16' },
    ],
  },
  // ゲームオーバー: 「ちゃらりーん、鼻から牛乳」（バッハ「トッカータとフーガ ニ短調」BWV565 の出だし。
  // 300年前の曲で著作権は切れている。ユーザーの依頼で使用。ほかの曲と同じピコピコ音にそろえる）
  gameover: {
    bpm: 84,
    loop: false,
    tracks: [
      {
        wave: 'square',
        gain: 0.17,
        notes: 'A5:1 G5:1 A5:6 G5:1 F5:1 E5:1 D5:1 C#5:4 D5:8 R:4 A4:1 G4:1 A4:6 E4:2 F4:2 C#4:4 D4:12',
      },
      { wave: 'triangle', gain: 0.3, notes: 'D3:8 A2:6 D2:14 D3:8 A2:6 D2:14' },
    ],
  },
};

// 効果音: steps を順に鳴らす。freq から to へ音の高さを動かす。dur は秒
// 笑い声の「ハッ」と「ハッ」の間のすき間（ほぼ無音）
const gap = { freq: 100, dur: 0.04, gain: 0.001 };

export const SFX = {
  jump: { wave: 'square', steps: [{ freq: 260, to: 620, dur: 0.12, gain: 0.18 }] },
  coin: { wave: 'square', steps: [{ freq: 1175, dur: 0.05, gain: 0.18 }, { freq: 1568, dur: 0.2, gain: 0.18 }] },
  bump: { wave: 'triangle', steps: [{ freq: 160, to: 90, dur: 0.09, gain: 0.4 }] },
  item: { wave: 'square', steps: [{ freq: 392, dur: 0.06, gain: 0.15 }, { freq: 523, dur: 0.06, gain: 0.15 }, { freq: 659, dur: 0.06, gain: 0.15 }, { freq: 784, dur: 0.1, gain: 0.15 }] },
  stomp: { wave: 'square', steps: [{ freq: 520, to: 140, dur: 0.1, gain: 0.2 }] },
  // 続けて踏んだときは高い音（2回目・3回目）
  stomp2: { wave: 'square', steps: [{ freq: 780, to: 210, dur: 0.1, gain: 0.2 }] },
  stomp3: { wave: 'square', steps: [{ freq: 1170, to: 315, dur: 0.1, gain: 0.2 }] },
  kill: { wave: 'square', steps: [{ freq: 700, to: 200, dur: 0.14, gain: 0.18 }] },
  drink: { wave: 'square', steps: [{ freq: 523, dur: 0.07, gain: 0.16 }, { freq: 659, dur: 0.07, gain: 0.16 }, { freq: 784, dur: 0.07, gain: 0.16 }, { freq: 1047, dur: 0.18, gain: 0.16 }] },
  star: { wave: 'square', steps: [{ freq: 784, dur: 0.05, gain: 0.15 }, { freq: 988, dur: 0.05, gain: 0.15 }, { freq: 1175, dur: 0.05, gain: 0.15 }, { freq: 1568, dur: 0.15, gain: 0.15 }] },
  miss: { wave: 'square', steps: [{ freq: 660, to: 330, dur: 0.25, gain: 0.18 }, { freq: 330, to: 110, dur: 0.45, gain: 0.18 }] },
  button: { wave: 'square', steps: [{ freq: 880, dur: 0.04, gain: 0.12 }] },
  // ミスしたときの、いじわるな笑い声（「ヒャーッ」と上がって「ハッハッハッ」と下がる。オリジナル）
  laugh: {
    wave: 'square',
    steps: [
      { freq: 700, to: 1600, dur: 0.2, gain: 0.16 },
      gap,
      { freq: 1500, to: 1200, dur: 0.07, gain: 0.16 },
      gap,
      { freq: 1400, to: 1120, dur: 0.07, gain: 0.16 },
      gap,
      { freq: 1300, to: 1040, dur: 0.07, gain: 0.16 },
      gap,
      { freq: 1200, to: 960, dur: 0.07, gain: 0.16 },
      gap,
      { freq: 1100, to: 880, dur: 0.07, gain: 0.16 },
      gap,
      { freq: 1000, to: 800, dur: 0.07, gain: 0.16 },
    ],
  },
  // スターがもうすぐ切れる（3・2・1）
  starwarn: { wave: 'square', steps: [{ freq: 1319, dur: 0.07, gain: 0.16 }] },
  // ボスを踏んだ・ボスが甲羅に入った・ボスが倒れた
  bosshit: { wave: 'square', steps: [{ freq: 320, to: 120, dur: 0.12, gain: 0.22 }, { freq: 220, to: 70, dur: 0.14, gain: 0.22 }] },
  bossshell: { wave: 'triangle', steps: [{ freq: 240, to: 110, dur: 0.16, gain: 0.4 }] },
  // ボスが火を吹く（ゴーッ）
  bossfire: { wave: 'noise', steps: [{ freq: 0, dur: 0.12, gain: 0.35 }, { freq: 0, dur: 0.3, gain: 0.2 }] },
  bossdown: { wave: 'square', steps: [{ freq: 220, to: 55, dur: 0.45, gain: 0.2 }, { freq: 523, dur: 0.1, gain: 0.16 }, { freq: 659, dur: 0.1, gain: 0.16 }, { freq: 784, dur: 0.1, gain: 0.16 }, { freq: 1047, dur: 0.3, gain: 0.16 }] },
};

export const SFX_NAMES = Object.keys(SFX);
