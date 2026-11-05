  
                                                                         
                                                                      
  
                                                                              
                                                                            
                                                                           
                                                                            
                                                                
  
                                                                         
                                                                     
                                                                        
                                                                        
                                           
   
(function (g) {
  'use strict';
  const PARAMS = {
    dropMs: 300,                                     
    dropFrom: 92,                                             
    sproutMs: 460,                                                  
    bloomMs: 720,                       
    droplets: 9, leaves: 4, motes: 5, petals: 14, sparkles: 9, pollen: 7,
  };
  const SEED_ART = 'assets/ui2/currency/seed.png';
  const expect = {};                                                                       
  const planted = {};                                                           
  const BASE = 'translate(-50%,0)';                                                

  const reduced = () => !!(g.matchMedia && g.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const count = n => reduced() ? Math.ceil(n / 2) : n;
  const rnd = (a, b) => a + Math.random() * (b - a);
  const pad = i => (typeof lilypadSprites !== 'undefined' && lilypadSprites[i]) || null;

  function centre(el) {
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height };
  }
                                                                             
                                                                   
  function fxLayer() { return document.getElementById('fx-layer'); }
  function particle(cls, x, y, frames, opts, html) {
    const fx = fxLayer(); if (!fx) return null;
    const o = fx.getBoundingClientRect();
    const el = document.createElement('div');
    el.className = 'fpj-p ' + cls;
    if (html) el.innerHTML = html;
    el.style.left = (x - o.left) + 'px';
    el.style.top = (y - o.top) + 'px';
    fx.appendChild(el);
    return run(el, frames, opts);
  }
                                                                          
  function onPad(spr, cls, frames, opts) {
    const el = document.createElement('div');
    el.className = 'fpj-pad ' + cls;
    spr.el.appendChild(el);
    return run(el, frames, opts);
  }
  function run(el, frames, opts) {
    const a = el.animate(frames, Object.assign({ fill: 'forwards' }, opts));
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
    const len = Math.floor(c.sampleRate * 0.2), buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0);
    for (let k = 0; k < len; k++) d[k] = (Math.random() * 2 - 1) * Math.pow(1 - k / len, 3);
    const n = c.createBufferSource(), f = c.createBiquadFilter(), gn = c.createGain();
    n.buffer = buf; f.type = 'bandpass'; f.frequency.value = 2200; f.Q.value = 0.9; gn.gain.value = vol;
    n.connect(f); f.connect(gn); gn.connect(c.destination); n.start(t);
  }
  const sound = {
    plop() { const c = audio(); if (!c) return; const t = c.currentTime; tone(c, 'sine', 560, 130, t, 0.2, 0.34); splash(c, t + 0.01, 0.14); },
    sprout() { const c = audio(); if (!c) return; const t = c.currentTime; tone(c, 'sine', 300, 760, t, 0.2, 0.16); tone(c, 'triangle', 600, 1300, t + 0.03, 0.16, 0.05); },
    charge(ms) { const c = audio(); if (!c) return; const t = c.currentTime, s = ms / 1000; tone(c, 'sine', 380, 980, t, s, 0.045); tone(c, 'triangle', 760, 1960, t, s, 0.02); },
    bloom() {
      const c = audio(); if (!c) return; const t = c.currentTime;
      tone(c, 'sine', 180, 90, t, 0.25, 0.22);                                                     
      [0, 4, 7, 12, 16, 19].forEach((semi, k) => tone(c, 'triangle', 659.25 * Math.pow(2, semi / 12), 659.25 * Math.pow(2, semi / 12), t + 0.04 + k * 0.055, 0.5, 0.13));
      [2637, 3136, 3520].forEach((f, k) => tone(c, 'sine', f, f, t + 0.12 + k * 0.07, 0.35, 0.03));             
    },
  };

                                                            
  function plant(i, bloomAt) {
    const spr = pad(i); if (!spr) return false;
    const now = performance.now();
    planted[i] = { at: now, bloomAt: bloomAt };
    expect[i] = 'bud';
    const p = centre(spr.el);
    particle('fpj-seed', p.x, p.y, [
      { transform: tf(0, -PARAMS.dropFrom, 'rotate(-40deg) scale(.7)'), opacity: 0 },
      { transform: tf(0, -PARAMS.dropFrom * 0.8, 'rotate(-20deg) scale(.85)'), opacity: 1, offset: 0.18 },
      { transform: tf(0, 0, 'rotate(150deg) scale(1.05,.9)'), opacity: 1 },
    ], { duration: PARAMS.dropMs, easing: 'cubic-bezier(.55,0,.95,.5)' }, '<img src="' + SEED_ART + '" alt="" draggable="false">');
    onPad(spr, 'fpj-shadow', [
      { transform: 'scale(.2)', opacity: 0 }, { transform: 'scale(1)', opacity: 0.55 },
    ], { duration: PARAMS.dropMs, easing: 'ease-in' });
    setTimeout(() => impact(i), PARAMS.dropMs);
    return true;
  }
  function impact(i) {
    const spr = pad(i); if (!spr) return;
    if (typeof g.springSquish === 'function') g.springSquish(spr.content, 0.46);
    if (typeof g.padRipple === 'function') { g.padRipple(spr.el); setTimeout(() => g.padRipple(spr.el), 150); }
    const p = centre(spr.el);
    for (let k = 0, n = count(PARAMS.droplets); k < n; k++) {                                  
      const a = Math.PI * (1.08 + 0.84 * (k / Math.max(1, n - 1))) + rnd(-0.12, 0.12);
      const d = rnd(20, 44), dx = Math.cos(a) * d, dy = Math.sin(a) * d * 0.9 - rnd(8, 18);
      particle('fpj-drop', p.x, p.y, [
        { transform: tf(0, 0, 'scale(.5)'), opacity: 1 },
        { transform: tf(dx * 0.7, dy, 'scale(1)'), opacity: 1, offset: 0.45 },
        { transform: tf(dx, dy + 34, 'scale(.6)'), opacity: 0 },
      ], { duration: rnd(480, 640), easing: 'cubic-bezier(.2,.7,.4,1)' });
    }
    for (let k = 0, n = count(PARAMS.leaves); k < n; k++) {                                
      const a = rnd(-Math.PI * 0.9, -Math.PI * 0.1), d = rnd(18, 34), r0 = rnd(0, 360);
      particle('fpj-leaf', p.x, p.y, [
        { transform: tf(0, 0, 'rotate(' + r0 + 'deg) scale(.4)'), opacity: 1 },
        { transform: tf(Math.cos(a) * d, Math.sin(a) * d - 10, 'rotate(' + (r0 + 220) + 'deg) scale(1)'), opacity: 1, offset: 0.5 },
        { transform: tf(Math.cos(a) * d * 1.3, Math.sin(a) * d + 22, 'rotate(' + (r0 + 400) + 'deg) scale(.8)'), opacity: 0 },
      ], { duration: rnd(620, 820), easing: 'ease-out' });
    }
    sound.plop();
    if (typeof g.spawnFloatText === 'function') g.spawnFloatText('Planted!', p.x, p.y - p.h * 0.9, '#d9ffc4');
  }

                                                             
  function sprout(i, spr, img) {
    const info = planted[i] || { at: performance.now(), bloomAt: null };
    const now = performance.now();
    const delay = Math.max(0, PARAMS.dropMs - (now - info.at));
    img.style.transform = BASE;
    img.animate([
      { transform: BASE + ' scale(.25,0)', opacity: 0 },
      { opacity: 1, offset: 0.1 },
      { transform: BASE + ' scale(.7,1.42)', offset: 0.38 },
      { transform: BASE + ' scale(1.24,.78)', offset: 0.6 },
      { transform: BASE + ' scale(.93,1.08)', offset: 0.8 },
      { transform: BASE + ' scale(1,1)', opacity: 1 },
    ], { duration: PARAMS.sproutMs, delay: delay, easing: 'ease-out', fill: 'backwards' });
    setTimeout(sound.sprout, delay);
                                                                            
                                                                     
    const wallLeft = info.bloomAt != null ? info.bloomAt - Date.now() : 0;
    const chargeMs = Math.round(wallLeft - delay - PARAMS.sproutMs);
    if (chargeMs < 160) return;
    const base = img.style.filter || '';
    const steps = 9, frames = [];
    for (let k = 0; k <= steps; k++) {
      const u = k / steps, amp = (2 + 9 * u * u) * (k % 2 ? 1 : -1) * (k === 0 || k === steps ? 0 : 1);
      frames.push({
        offset: u * 0.86,
        transform: BASE + ' rotate(' + amp.toFixed(2) + 'deg) scale(' + (1 + 0.14 * u).toFixed(3) + ')',
        filter: base + ' drop-shadow(0 0 ' + (10 * u).toFixed(1) + 'px rgba(255,170,215,' + (0.95 * u).toFixed(2) + ')) brightness(' + (1 + 0.3 * u).toFixed(2) + ')',
      });
    }
    frames.push({ offset: 1, transform: BASE + ' rotate(0deg) scale(1.22,.82)', filter: base + ' drop-shadow(0 0 12px rgba(255,190,225,1)) brightness(1.42)' });
    const startIn = delay + PARAMS.sproutMs;
    const anim = img.animate(frames, { duration: chargeMs, delay: startIn, easing: 'linear', fill: 'forwards' });
    anim.onfinish = () => {                                                              
      if (expect[i] === 'bloom' || !img.classList.contains('bud')) return;
      img.animate([
        { transform: BASE + ' rotate(-3deg) scale(1.18,.86)' }, { transform: BASE + ' rotate(3deg) scale(1.18,.86)' },
      ], { duration: 140, iterations: Infinity, direction: 'alternate' });
    };
    onPad(spr, 'fpj-glow', [
      { transform: 'scale(.3)', opacity: 0 }, { transform: 'scale(1)', opacity: 0.6, offset: 0.85 }, { transform: 'scale(1.25)', opacity: 0.85 },
    ], { duration: chargeMs, delay: startIn, easing: 'ease-in', fill: 'both' });
    setTimeout(() => sound.charge(chargeMs), startIn);
    for (let k = 0, n = count(PARAMS.motes); k < n; k++) {                                             
      setTimeout(() => {
        const s = pad(i); if (!s || !img.isConnected || !img.classList.contains('bud')) return;
        const b = centre(img), a = rnd(0, Math.PI * 2), d = rnd(30, 44);
        particle('fpj-spark fpj-spark--sm', b.x, b.y, [
          { transform: tf(Math.cos(a) * d, Math.sin(a) * d * 0.8, 'scale(.4) rotate(0deg)'), opacity: 0 },
          { transform: tf(Math.cos(a) * d * 0.6, Math.sin(a) * d * 0.5, 'scale(1) rotate(90deg)'), opacity: 1, offset: 0.4 },
          { transform: tf(0, 0, 'scale(.3) rotate(180deg)'), opacity: 0 },
        ], { duration: 420, easing: 'ease-in' });
      }, startIn + chargeMs * (k / n) * 0.9);
    }
  }

                                            
  function bloomSoon(i) { expect[i] = 'bloom'; }
  function burst(i, spr, img) {
    img.getAnimations().forEach(a => a.cancel());
    spr.el.querySelectorAll('.fpj-glow').forEach(el => el.remove());                                  
    img.style.transform = BASE;
    const base = img.style.filter || '';
    img.animate([
      { transform: BASE + ' scale(.3,.42)', filter: base + ' brightness(3)' },
      { transform: BASE + ' scale(1.38,1.22)', filter: base + ' brightness(1.8)', offset: 0.26 },
      { transform: BASE + ' scale(.86,1.1)', offset: 0.46 },
      { transform: BASE + ' scale(1.1,.94)', offset: 0.64 },
      { transform: BASE + ' scale(.97,1.03)', offset: 0.82 },
      { transform: BASE + ' scale(1,1)', filter: base + ' brightness(1)' },
    ], { duration: PARAMS.bloomMs, easing: 'ease-out' });
    const pc = centre(spr.el), h = img.getBoundingClientRect().height || pc.h * 0.6;
    const fx = pc.x, fy = pc.y - h / 2;                                                          
    particle('fpj-flash', fx, fy, [
      { transform: tf(0, 0, 'scale(.2)'), opacity: 0.95 }, { transform: tf(0, 0, 'scale(1.7)'), opacity: 0 },
    ], { duration: 460, easing: 'cubic-bezier(.2,.8,.3,1)' });
    onPad(spr, 'fpj-rays', [
      { transform: 'scale(.3) rotate(0deg)', opacity: 0 },
      { transform: 'scale(1.1) rotate(25deg)', opacity: 0.9, offset: 0.25 },
      { transform: 'scale(1.3) rotate(70deg)', opacity: 0 },
    ], { duration: 1150, easing: 'ease-out' });
    particle('fpj-ring', pc.x, pc.y, [
      { transform: tf(0, 0, 'scale(.4)'), opacity: 1 }, { transform: tf(0, 0, 'scale(4.2)'), opacity: 0 },
    ], { duration: 700, easing: 'cubic-bezier(.2,.7,.3,1)' });
    for (let k = 0, n = count(PARAMS.petals); k < n; k++) {                                
      const a = (k / n) * Math.PI * 2 + rnd(-0.2, 0.2), d = rnd(46, 92);
      const dx = Math.cos(a) * d, dy = Math.sin(a) * d * 0.8 - 18, r0 = rnd(0, 360), sway = rnd(-16, 16);
      particle('fpj-petal', fx, fy, [                                                  
        { transform: tf(0, 0, 'rotate(' + r0 + 'deg) scale(.35)'), opacity: 1, easing: 'cubic-bezier(.1,.8,.3,1)' },
        { transform: tf(dx, dy - 12, 'rotate(' + (r0 + 200) + 'deg) scale(1)'), opacity: 1, offset: 0.28, easing: 'ease-in-out' },
        { transform: tf(dx * 1.08 + sway, dy + 26, 'rotate(' + (r0 + 320) + 'deg) scale(.9)'), opacity: 1, offset: 0.72, easing: 'ease-in' },
        { transform: tf(dx * 1.12 + sway * 1.4, dy + 50, 'rotate(' + (r0 + 380) + 'deg) scale(.8)'), opacity: 0 },
      ], { duration: rnd(1300, 1700), easing: 'linear' });
    }
    for (let k = 0, n = count(PARAMS.sparkles); k < n; k++) {                    
      const a = rnd(0, Math.PI * 2), d = rnd(26, 70);
      particle('fpj-spark', fx, fy, [
        { transform: tf(0, 0, 'scale(0) rotate(0deg)'), opacity: 1, easing: 'cubic-bezier(.15,.8,.3,1)' },
        { transform: tf(Math.cos(a) * d, Math.sin(a) * d, 'scale(1.25) rotate(90deg)'), opacity: 1, offset: 0.45, easing: 'ease-in' },
        { transform: tf(Math.cos(a) * d * 1.15, Math.sin(a) * d * 1.15, 'scale(0) rotate(180deg)'), opacity: 0 },
      ], { duration: rnd(700, 950), delay: rnd(0, 90), easing: 'linear' });
    }
    for (let k = 0, n = count(PARAMS.pollen); k < n; k++) {                                   
      const x0 = rnd(-14, 14), rise = rnd(44, 76), drift = rnd(-18, 18);
      particle('fpj-pollen', fx + x0, fy, [
        { transform: tf(0, 0, 'scale(.4)'), opacity: 0 },
        { transform: tf(drift * 0.4, -rise * 0.35, 'scale(1)'), opacity: 1, offset: 0.3 },
        { transform: tf(drift, -rise, 'scale(.6)'), opacity: 0 },
      ], { duration: rnd(1200, 1650), delay: 120 + rnd(0, 180), easing: 'ease-out' });
    }
    if (typeof g.springSquish === 'function') g.springSquish(spr.content, 0.34);
    if (typeof g.padRipple === 'function') g.padRipple(spr.el);
    sound.bloom();
    if (typeof g.spawnFloatText === 'function') g.spawnFloatText('Bloomed!', fx, fy - h * 0.7, '#ffc4e1');
  }

                                                                            
  function claim(i, sprite, spr) {
    if (!spr || !spr.flower || expect[i] !== sprite) return false;
    delete expect[i];
    if (sprite === 'bud') sprout(i, spr, spr.flower);
    else { delete planted[i]; burst(i, spr, spr.flower); }
    return true;
  }

  const api = { PARAMS, plant, bloomSoon, claim };
  g.FlowerPlantFX = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
