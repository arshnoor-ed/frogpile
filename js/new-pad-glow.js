  
                                                                           
                                                                 
  
                                                                             
                                                                            
                                                                           
                                                                             
                                                                      
                                                                            
                                                                           
                                
  
                                                                                  
                                                                               
                                                                              
   
(function (g) {
  'use strict';
  const PARAMS = {
    riseMs: 820,                                                         
    checkMs: 120,                                                          
    droplets: 10, sparkles: 9,
  };
  const UNDER = '<div class="npg-glow"></div><div class="npg-ring"></div><div class="npg-ring npg-ring--2"></div>';
  const OVER = [[6, 22, 0], [90, 30, 0.7], [70, 92, 1.3], [22, 86, 2]]
    .map(([x, y, d]) => '<i class="npg-twinkle" style="left:' + x + '%;top:' + y + '%;animation-delay:' + d + 's"></i>').join('')
    + '<div class="npg-tag">NEW!</div>';

                                   
  function list(s) { return (s && Array.isArray(s.newEggPads)) ? s.newEggPads : []; }
  function entry(s, i) { return list(s).find(e => e && e.pad === i) || null; }
  function isNew(s, i) { return !!entry(s, i); }
  function mark(s, i) {
    if (!s || !Number.isInteger(i) || entry(s, i)) return false;
    if (!Array.isArray(s.newEggPads)) s.newEggPads = [];
    s.newEggPads.push({ pad: i, rose: false });
    return true;
  }
  function used(s, i) {
    if (!entry(s, i)) return false;
    s.newEggPads = s.newEggPads.filter(e => e && e.pad !== i);
    return true;
  }
                                          
  function waiting(s, i) { const e = entry(s, i); return !!(e && !e.rose); }

                                      
  const reduced = () => !!(g.matchMedia && g.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const count = n => reduced() ? Math.ceil(n / 2) : n;
  const rnd = (a, b) => a + Math.random() * (b - a);
  const sprite = i => (typeof lilypadSprites !== 'undefined' && lilypadSprites[i]) || null;
  const liveState = () => (typeof state !== 'undefined' ? state : null);

  function layer(el, cls, html) {
    let n = el.querySelector(':scope > .' + cls);
    if (!n) { n = document.createElement('div'); n.className = cls; n.innerHTML = html; el.appendChild(n); }
    return n;
  }
                                                                                 
  function sync(spr, i, s) {
    if (!spr || !spr.el) return;
    const el = spr.el, on = isNew(s, i);
    el.classList.toggle('pad-new', on);
    el.classList.toggle('npg-wait', on && waiting(s, i));
    if (on) { layer(el, 'npg-under', UNDER); layer(el, 'npg-over', OVER); }
    else el.querySelectorAll(':scope > .npg-under, :scope > .npg-over').forEach(n => n.remove());
  }

                                  
                                                                            
                                                                  
  function onScreen(el) {
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) return false;
    const pts = [[0.5, 0.5], [0.22, 0.5], [0.78, 0.5], [0.5, 0.3], [0.5, 0.72]];
    for (const [u, v] of pts) {
      const x = r.left + r.width * u, y = r.top + r.height * v;
      if (x < 0 || y < 0 || x >= g.innerWidth || y >= g.innerHeight) continue;
      const hit = document.elementFromPoint(x, y);
      if (hit && el.contains(hit)) return true;
    }
    return false;
  }
  function tick() {
    const s = liveState();
    if (!list(s).length || document.hidden) return;
    list(s).forEach(e => {
      if (!e || e.rose) return;
                                                                               
      if (s.ftueL5PadPopPending) return;
      const spr = sprite(e.pad);
      if (!spr || !spr.el.isConnected || !onScreen(spr.el)) return;
      e.rose = true;
      rise(e.pad, spr, s);
      if (typeof g.queueSave === 'function') g.queueSave();
    });
  }

                                                     
  function fxLayer() { return document.getElementById('fx-layer'); }
  function particle(cls, x, y, frames, opts) {
    const fx = fxLayer(); if (!fx) return null;
    const o = fx.getBoundingClientRect();
    const el = document.createElement('div');
    el.className = 'npg-p ' + cls;
    el.style.left = (x - o.left) + 'px';
    el.style.top = (y - o.top) + 'px';
    fx.appendChild(el);
    const a = el.animate(frames, Object.assign({ fill: 'both' }, opts));                                                                      
    const done = () => el.remove();
    a.onfinish = done; a.oncancel = done;
    setTimeout(done, (opts.duration || 0) + (opts.delay || 0) + 500);                                                 
    return el;
  }
  const tf = (x, y, extra) => 'translate(-50%,-50%) translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px)' + (extra ? ' ' + extra : '');

                                                                    
  function audio() { return typeof g.ac === 'function' ? g.ac() : null; }
  function tone(c, type, f0, f1, t, len, vol) {
    const o = c.createOscillator(), gn = c.createGain();
    o.type = type; o.frequency.setValueAtTime(f0, t);
    if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(f1, t + len * 0.8);
    gn.gain.setValueAtTime(0.0001, t);
    gn.gain.exponentialRampToValueAtTime(vol, t + Math.min(0.02, len * 0.2));
    gn.gain.exponentialRampToValueAtTime(0.0001, t + len);
    o.connect(gn); gn.connect(c.destination); o.start(t); o.stop(t + len + 0.02);
  }
  function splash(c, t, vol) {
    const len = Math.floor(c.sampleRate * 0.24), buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0);
    for (let k = 0; k < len; k++) d[k] = (Math.random() * 2 - 1) * Math.pow(1 - k / len, 3);
    const n = c.createBufferSource(), f = c.createBiquadFilter(), gn = c.createGain();
    n.buffer = buf; f.type = 'bandpass'; f.frequency.value = 1800; f.Q.value = 0.8; gn.gain.value = vol;
    n.connect(f); f.connect(gn); gn.connect(c.destination); n.start(t);
  }
  function riseSound() {
    const c = audio(); if (!c) return;
    const t = c.currentTime;
    tone(c, 'sine', 150, 520, t, 0.28, 0.26);                                       
    splash(c, t + 0.16, 0.13);
    [0, 4, 7, 12].forEach((semi, k) => {                                                 
      const f = 523.25 * Math.pow(2, semi / 12);
      tone(c, 'triangle', f, f, t + 0.22 + k * 0.07, 0.42, 0.11);
    });
    [2093, 2637, 3136].forEach((f, k) => tone(c, 'sine', f, f, t + 0.4 + k * 0.06, 0.3, 0.025));
  }

                          
  function rise(i, spr, s) {
    sync(spr, i, s);                                                  
    const el = spr.el, content = spr.content;
    const under = el.querySelector(':scope > .npg-under'), over = el.querySelector(':scope > .npg-over');
    if (reduced()) {
      content.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 320, easing: 'ease-out' });
      [under, over].forEach(n => n && n.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 320, delay: 200, fill: 'backwards' }));
      riseSound();
      return;
    }
    content.animate([
      { scale: '.2 .06', translate: '0 14px', opacity: 0 },
      { opacity: 1, offset: 0.12 },
      { scale: '1.24 1.14', translate: '0 -12px', offset: 0.42 },
      { scale: '.86 1.08', translate: '0 1px', offset: 0.62 },
      { scale: '1.07 .94', translate: '0 0', offset: 0.8 },
      { scale: '1 1', translate: '0 0', opacity: 1 },
    ], { duration: PARAMS.riseMs, easing: 'ease-out' });
    if (under) under.animate([{ opacity: 0, scale: '.4' }, { opacity: 1, scale: '1' }],
      { duration: 520, delay: PARAMS.riseMs * 0.35, easing: 'cubic-bezier(.2,1.4,.4,1)', fill: 'backwards' });
    if (over) over.animate([{ opacity: 0 }, { opacity: 1 }],
      { duration: 300, delay: PARAMS.riseMs * 0.6, fill: 'backwards' });
    if (typeof g.padRipple === 'function') { g.padRipple(el); setTimeout(() => g.padRipple(el), 180); }

    const r = el.getBoundingClientRect(), px = r.left + r.width / 2, py = r.top + r.height / 2;
    for (let k = 0, n = count(PARAMS.droplets); k < n; k++) {                                             
      const a = Math.PI * (1.06 + 0.88 * (k / Math.max(1, n - 1))) + rnd(-0.1, 0.1);
      const d = rnd(26, 56), dx = Math.cos(a) * d, dy = Math.sin(a) * d * 0.9 - rnd(10, 22);
      particle('npg-drop', px, py, [
        { transform: tf(0, 0, 'scale(.5)'), opacity: 1 },
        { transform: tf(dx * 0.7, dy, 'scale(1)'), opacity: 1, offset: 0.45 },
        { transform: tf(dx, dy + 40, 'scale(.6)'), opacity: 0 },
      ], { duration: rnd(520, 700), delay: 60, easing: 'cubic-bezier(.2,.7,.4,1)' });
    }
    const at = PARAMS.riseMs * 0.4;                                                                         
    particle('npg-flash', px, py, [
      { transform: tf(0, 0, 'scale(.25)'), opacity: 0.95 }, { transform: tf(0, 0, 'scale(1.8)'), opacity: 0 },
    ], { duration: 520, delay: at, easing: 'cubic-bezier(.2,.8,.3,1)' });
    particle('npg-burst-ring', px, py, [
      { transform: tf(0, 0, 'scale(.4)'), opacity: 1 }, { transform: tf(0, 0, 'scale(4.4)'), opacity: 0 },
    ], { duration: 760, delay: at, easing: 'cubic-bezier(.2,.7,.3,1)' });
    for (let k = 0, n = count(PARAMS.sparkles); k < n; k++) {
      const a = (k / n) * Math.PI * 2 + rnd(-0.3, 0.3), d = rnd(36, 78);
      particle('npg-spark', px, py - 4, [
        { transform: tf(0, 0, 'scale(0) rotate(0deg)'), opacity: 1, easing: 'cubic-bezier(.15,.8,.3,1)' },
        { transform: tf(Math.cos(a) * d, Math.sin(a) * d * 0.8, 'scale(1.25) rotate(90deg)'), opacity: 1, offset: 0.45, easing: 'ease-in' },
        { transform: tf(Math.cos(a) * d * 1.15, Math.sin(a) * d * 0.95, 'scale(0) rotate(180deg)'), opacity: 0 },
      ], { duration: rnd(720, 980), delay: at + rnd(0, 90), easing: 'linear' });
    }
    riseSound();
    if (typeof g.spawnFloatText === 'function') setTimeout(() => {
      const b = el.getBoundingClientRect();
      g.spawnFloatText('New hatching pad!', b.left + b.width / 2, b.top - 6, '#ffe58a');
    }, at);
  }

  function reveal(i, onDone) {
    const s = liveState(), spr = sprite(i), e = entry(s, i);
    if (!e || !spr) { if (onDone) onDone(); return; }
    e.rose = true;
    rise(i, spr, s);
    if (typeof g.queueSave === 'function') g.queueSave();
    setTimeout(() => { if (onDone) onDone(); }, reduced() ? 320 : PARAMS.riseMs);
  }
  const api = { PARAMS, mark, used, isNew, waiting, sync, tick, onScreen, reveal };
  g.NewPadGlow = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (g.document && typeof g.setInterval === 'function') g.setInterval(tick, PARAMS.checkMs);
})(typeof window !== 'undefined' ? window : globalThis);
