// A small looping tune made live in the browser (Web Audio), no files: soft chords, a bouncy bass,
// a light beat and a hummable "doo dooo doot" lead. Original melody. Starts only when the reader taps Sound.
export function music() {
  let ctx, master, timer, step = 0, nextT = 0, on = false;
  const BPM = 92, S = 60 / BPM / 4; // sixteenth notes
  const hz = n => 440 * Math.pow(2, (n - 69) / 12);
  // C major / A minor, 4 bars: C  Am  F  G
  const chords = [[60, 64, 67], [57, 60, 64], [53, 57, 60], [55, 59, 62]];
  const bass = [36, 33, 29, 31];
  // lead: 64 sixteenths, null = rest. The hook: doo dooo doot, doot doooo doot
  const L = [76,null,null,79,null,null,null,null,76,null,74,null,72,null,null,null,
             72,null,74,null,76,null,null,null,74,null,72,null,69,null,null,null,
             69,null,72,null,74,null,null,74,72,null,69,null,67,null,null,null,
             67,null,null,71,null,null,null,null,74,null,72,null,71,null,null,null];
  const len = {0:3,3:5,8:2,10:2,12:4,16:2,18:2,20:4,24:2,26:2,28:4,32:2,34:2,36:3,39:1,40:2,42:2,44:4,48:3,51:5,56:2,58:2,60:4};

  function voice(type, freq, t, dur, vol, cut) {
    const o = ctx.createOscillator(), g = ctx.createGain(), f = ctx.createBiquadFilter();
    o.type = type; o.frequency.value = freq; f.type = 'lowpass'; f.frequency.value = cut || 2400;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + .02); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    o.connect(f); f.connect(g); g.connect(master); o.start(t); o.stop(t + dur + .05);
  }
  function kick(t) { const o = ctx.createOscillator(), g = ctx.createGain(); o.frequency.setValueAtTime(120, t); o.frequency.exponentialRampToValueAtTime(40, t + .15); g.gain.setValueAtTime(.55, t); g.gain.exponentialRampToValueAtTime(.001, t + .25); o.connect(g); g.connect(master); o.start(t); o.stop(t + .3); }
  let noise;
  function hat(t, v) { const s = ctx.createBufferSource(), g = ctx.createGain(), f = ctx.createBiquadFilter(); s.buffer = noise; f.type = 'highpass'; f.frequency.value = 7000; g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.001, t + .05); s.connect(f); f.connect(g); g.connect(master); s.start(t); s.stop(t + .06); }
  function snap(t) { const s = ctx.createBufferSource(), g = ctx.createGain(), f = ctx.createBiquadFilter(); s.buffer = noise; f.type = 'bandpass'; f.frequency.value = 1800; g.gain.setValueAtTime(.22, t); g.gain.exponentialRampToValueAtTime(.001, t + .12); s.connect(f); f.connect(g); g.connect(master); s.start(t); s.stop(t + .14); }

  function sched() {
    while (nextT < ctx.currentTime + .15) {
      const i = step % 64, bar = Math.floor(i / 16), t = nextT, sw = (i % 2) ? S * .12 : 0;
      if (i % 16 === 0) chords[bar].forEach(n => voice('triangle', hz(n), t, S * 15, .045, 1600));
      if (i % 16 === 8) chords[bar].forEach(n => voice('triangle', hz(n + 12), t, S * 6, .02, 2200));
      if ([0, 6, 10].includes(i % 16)) voice('sine', hz(bass[bar] + (i % 16 === 10 ? 12 : 0)), t, S * 3, .32, 600);
      if (i % 8 === 0) kick(t);
      if (i % 16 === 4 || i % 16 === 12) snap(t + sw);
      if (i % 2 === 0) hat(t + sw, i % 4 === 2 ? .05 : .025);
      if (L[i] != null) { const d = (len[i] || 2) * S; voice('square', hz(L[i]), t + sw, d, .05, 1900); voice('sine', hz(L[i]), t + sw, d, .06, 3000); }
      nextT += S; step++;
    }
  }
  return {
    get on() { return on; },
    start() {
      if (!ctx) {
        ctx = new (window.AudioContext || window.webkitAudioContext)();
        master = ctx.createGain(); master.gain.value = .55;
        const comp = ctx.createDynamicsCompressor(); master.connect(comp); comp.connect(ctx.destination);
        noise = ctx.createBuffer(1, ctx.sampleRate * .2, ctx.sampleRate); const d = noise.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      }
      ctx.resume(); on = true; nextT = ctx.currentTime + .05; clearInterval(timer); timer = setInterval(sched, 40); sched();
    },
    stop() { on = false; clearInterval(timer); if (ctx) ctx.suspend(); }
  };
}
