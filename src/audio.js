import { SONGS, SFX, parseTrack } from './music.js?v=12fe0c3';

// Web Audio で BGM と効果音を鳴らす（ブラウザ専用）
// BGM は少し先まで音を予約しておく（先読みスケジューラ）。重い端末でも途切れにくい
const LOOKAHEAD = 0.15;
const TICK_MS = 30;
const MASTER_GAIN = 0.5;
const MUSIC_GAIN = 0.6;
const SFX_GAIN = 0.9;
const NOISE_DUR = 0.05;

export class Sound {
  constructor(AudioCtx) {
    this.AudioCtx = AudioCtx;
    this.ctx = null;
    this.song = null;
    this.timer = 0;
    this.parsed = {};
  }

  get current() {
    return this.song ? this.song.name : null;
  }

  // スマホ・タブレットは、タッチの中でしか音を鳴らし始められない。ボタンを押したときに呼ぶ
  unlock() {
    if (!this.AudioCtx) return;
    if (!this.ctx) {
      try {
        this.ctx = new this.AudioCtx();
      } catch {
        this.AudioCtx = null;
        return;
      }
      const ctx = this.ctx;
      this.master = ctx.createGain();
      this.master.gain.value = MASTER_GAIN;
      this.master.connect(ctx.destination);
      this.musicBus = ctx.createGain();
      this.musicBus.gain.value = MUSIC_GAIN;
      this.musicBus.connect(this.master);
      this.sfxBus = ctx.createGain();
      this.sfxBus.gain.value = SFX_GAIN;
      this.sfxBus.connect(this.master);
      this.noise = this.makeNoise();
    }
    this.resume();
  }

  makeNoise() {
    const ctx = this.ctx;
    const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.5), ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    return buf;
  }

  // 1つの音（ノイズまたは発振器）を start から dur 秒鳴らす
  tone(dest, wave, freq, to, start, dur, gain) {
    const ctx = this.ctx;
    const env = ctx.createGain();
    env.gain.setValueAtTime(gain, start);
    env.gain.exponentialRampToValueAtTime(0.001, start + dur);
    env.connect(dest);
    let src;
    if (wave === 'noise') {
      src = ctx.createBufferSource();
      src.buffer = this.noise;
    } else {
      src = ctx.createOscillator();
      src.type = wave;
      src.frequency.setValueAtTime(freq, start);
      if (to) src.frequency.exponentialRampToValueAtTime(to, start + dur);
    }
    src.connect(env);
    src.start(start);
    src.stop(start + dur + 0.02);
  }

  playSfx(name) {
    const spec = SFX[name];
    if (!this.ctx || !spec) return;
    let t = this.ctx.currentTime + 0.005;
    for (const st of spec.steps) {
      this.tone(this.sfxBus, spec.wave, st.freq, st.to, t, st.dur, st.gain);
      t += st.dur;
    }
  }

  // name が null なら止める。同じ曲を頼まれたら何もしない
  playMusic(name) {
    if (name === this.current) return;
    this.stopMusic();
    if (!this.ctx || !name || !SONGS[name]) return;
    const song = SONGS[name];
    if (!this.parsed[name]) this.parsed[name] = song.tracks.map((t) => parseTrack(t.notes));
    const bus = this.ctx.createGain();
    bus.connect(this.musicBus);
    const start = this.ctx.currentTime + 0.05;
    this.song = {
      name,
      song,
      bus,
      sixteenth: 60 / song.bpm / 4,
      tracks: song.tracks.map((t, i) => ({ ...t, notes: this.parsed[name][i], idx: 0, time: start, pos: 0, done: false })),
    };
    this.schedule();
    this.timer = setInterval(() => this.schedule(), TICK_MS);
  }

  schedule() {
    const s = this.song;
    if (!s) return;
    const now = this.ctx.currentTime;
    const until = now + LOOKAHEAD;
    // 重い処理やタブの切り替えで遅れたときは、まとめて鳴らさずに今から続ける。
    // パートどうしの間隔がずれないよう、全部のパートを同じだけ進める
    const live = s.tracks.filter((tr) => !tr.done);
    const earliest = Math.min(...live.map((tr) => tr.time));
    if (live.length && earliest < now - 0.05) {
      const shift = now - earliest;
      for (const tr of live) tr.time += shift;
    }
    for (const tr of s.tracks) {
      while (!tr.done && tr.time < until) {
        const n = tr.notes[tr.idx];
        const dur = n.len * s.sixteenth;
        if (n.noise) this.tone(s.bus, 'noise', 0, 0, tr.time, NOISE_DUR, tr.gain);
        else if (n.freq) this.tone(s.bus, tr.wave, n.freq, 0, tr.time, dur * 0.9, tr.gain);
        tr.time += dur;
        tr.pos += n.len;
        tr.idx++;
        if (tr.idx >= tr.notes.length) {
          if (s.song.loop) tr.idx = 0;
          else tr.done = true;
        }
      }
    }
    // ジングルは最後の音が鳴り終わったら止める
    if (s.tracks.every((tr) => tr.done) && now >= Math.max(...s.tracks.map((tr) => tr.time))) this.stopMusic();
  }

  stopMusic() {
    clearInterval(this.timer);
    this.timer = 0;
    if (this.song) this.song.bus.disconnect();
    this.song = null;
  }

  suspend() {
    if (this.ctx && this.ctx.state === 'running') this.ctx.suspend().catch(() => {});
  }

  // iPhone は電話・アプリの切り替えのあと 'interrupted' になることがあるので、running 以外なら再開する
  resume() {
    if (this.ctx && this.ctx.state !== 'running' && this.ctx.state !== 'closed') this.ctx.resume().catch(() => {});
  }
}
