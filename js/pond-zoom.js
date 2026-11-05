  
                                                              
  
                                                                            
                                                                          
                                                                               
                                                                             
  
                                                                              
                                               
                                                                           
                                                             
                                                                            
                                                                             
  
                                                                           
                                                                           
                                                                             
                                                                             
                                                                              
                                                                           
                                                                           
                                                                
  
                                                                               
                                                                             
                                                                         
                                                                             
                                                                          
                                                                   
                                                                         
                                                                       
  
                                                                             
                                                    
   
(function (g) {
  'use strict';

  var PARAMS = {
    max: 2.2,                                                         
    tapZoom: 1.8,                                                   
    wheelStep: 1.25,                             
    freq: 2.4,                                  
    damping: 0.6,                                           
    pushMs: 620,                                                     
    anticipation: 0.08,                                                   
    rubber: 0.15,                                                                             
    flick: 0.12,                                                           
    bonk: 1.3,                                                                
    vignette: 0.5,                                                  
    tapMs: 320, tapPx: 28
  };

  var clamp = function (v, lo, hi) { return Math.max(lo, Math.min(hi, v)); };

                                                                            
                                                                 
  function minZoom(world, m) {
    if (!(world.w > 0 && world.h > 0 && world.vw > 0 && world.vh > 0)) return 1;                                  
    m = m || { l: 0, r: 0, b: 0 };
    return Math.min(1, Math.max(world.vw / (world.w * (1 + m.l + m.r)), world.vh / (world.h * (1 + m.b))));
  }
                                                                              
                                                      
  function rubber(u, lo, hi, k) {
    if (u > hi) return hi + k * (1 - Math.exp(-(u - hi) / k));
    if (u < lo) return lo;                                                             
    return u;
  }
                                                                             
                                                                  
  function camFor(p, f, z, world) {
    return { x: p.x - f.x / (world.w * z), y: p.y - f.y / (world.h * z) };
  }
                                                                          
  function pointAt(cam, f, z, world) {
    return { x: cam.x + f.x / (world.w * z), y: cam.y + f.y / (world.h * z) };
  }
                                                                            
                                        
  function springStep(s, to, dt, freq, damping) {
    var w = 2 * Math.PI * freq, n = Math.max(1, Math.ceil(dt / (1 / 240))), h = dt / n;
    for (var i = 0; i < n; i++) {
      s.v += (w * w * (to - s.x) - 2 * damping * w * s.v) * h;
      s.x += s.v * h;
    }
    return s;
  }
                                                                             
                                                                          
                                                                            
                                                                           
                                                      
  function pushCurve(t, ant) {
    t = clamp(t, 0, 1);
    var a = ant > 0 ? 0.24 : 0;
    if (t < a) { var s = Math.sin(Math.PI / 2 * t / a); return -ant * s * s; }
    var q = Math.pow((t - a) / (1 - a), 1.4);
    return -ant + (1 + ant) * q * q * (3 - 2 * q);
  }

  var api = { PARAMS: PARAMS, minZoom: minZoom, rubber: rubber, camFor: camFor, pointAt: pointAt,
    springStep: springStep, pushCurve: pushCurve };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (!g.document) return;

                              

  var reduced = function () { return g.matchMedia && g.matchMedia('(prefers-reduced-motion: reduce)').matches; };
  var LAYERS = ['pond-scene', 'frog-layer', 'pond-landmarks'];

                                                                            
                                                                                 
  function allowed() {
    try {
      if (activeTab !== 'pond' || activeSheet) return false;
      if (!sized()) return false;                                                                        
      if (ftueActive() && !state.pondExpanded) return false;
      if (g.PondExpansionCamera && g.PondExpansionCamera.active()) return false;
      if (g.FtueSteps && g.FtueSteps.cinematicActive && g.FtueSteps.cinematicActive()) return false;
      if (document.getElementById('ftue-crop') || document.body.classList.contains('ftue-uncrop')) return false;
      return true;
    } catch (e) { return false; }
  }
  function world() { return pondWorld(); }
  function sized() { var W = world(); return W.w > 0 && W.h > 0 && W.vw > 0 && W.vh > 0; }
  var finite = function (v) { return typeof v === 'number' && isFinite(v); };
                                                                                               
  function healCam() { if (!finite(pondCam.x) || !finite(pondCam.y)) pondCamHome(); }
  function room() { return g.PondGrow ? g.PondGrow.current() : null; }
  function limits() {
    var lo = minZoom(world(), room());
    return { lo: Math.log(lo), hi: Math.log(Math.max(lo, PARAMS.max)) };
  }
                                                             
  function offsetOf(clientX, clientY) {
    var st = document.querySelector('.pond-stage'), W = world();
    var r = st ? st.getBoundingClientRect() : { left: 0, top: 0 };
    return { x: clientX - r.left - W.vw / 2, y: clientY - r.top - W.vh / 2 };
  }

                                                                              
                                                                                  
  var rig = {
    u: { x: 0, v: 0 }, fx: { x: 0, v: 0 }, fy: { x: 0, v: 0 },
    uTo: 0, fTo: { x: 0, y: 0 }, p: null, tween: null, pinch: null,
    damping: PARAMS.damping, frame: null, last: null, wrote: null
  };
  var shown = 1;                                                             

  function level() { return shown; }
  function paint() {
    document.documentElement.style.setProperty('--cam-zoom', shown.toFixed(5));
  }

                                                                          
                                                      
  function repin() {
    var W = world();
    healCam();
    if (!rig.p || !finite(rig.p.x) || !finite(rig.p.y) || !rig.wrote || rig.wrote.x !== pondCam.x || rig.wrote.y !== pondCam.y)
      rig.p = pointAt(pondCam, { x: rig.fx.x, y: rig.fy.x }, shown, W);
  }
  function place() {
    var L = limits(), W = world();
    var z = Math.exp(Math.max(L.lo, rig.u.x));
    var c = camFor(rig.p, { x: rig.fx.x, y: rig.fy.x }, z, W);
    if (!finite(z) || !finite(c.x) || !finite(c.y)) return;                                                  
    shown = z;
    paint();
    pondCam.x = c.x; pondCam.y = c.y;
    syncPondCamera();                                                                         
    rig.wrote = { x: pondCam.x, y: pondCam.y };
    vignette(Math.abs(rig.u.v));
  }

  var vig = null;
  function vignette(speed) {
    if (!vig) {
      var view = document.getElementById('pond-view'); if (!view) return;
      vig = document.createElement('div'); vig.id = 'pond-zoom-vignette'; vig.setAttribute('aria-hidden', 'true');
      view.appendChild(vig);
    }
    vig.style.opacity = reduced() ? 0 : (Math.min(1, speed / 2.2) * PARAMS.vignette).toFixed(3);
  }

  function settled() {
    return !rig.tween && !rig.pinch &&
      Math.abs(rig.u.x - rig.uTo) < 1e-4 && Math.abs(rig.u.v) < 1e-3 &&
      Math.abs(rig.fx.x - rig.fTo.x) < 0.05 && Math.abs(rig.fy.x - rig.fTo.y) < 0.05 &&
      Math.abs(rig.fx.v) < 0.5 && Math.abs(rig.fy.v) < 0.5;
  }
  function tick(now) {
    rig.frame = null;
    if (!allowed() && !rig.pinch) { stop(); return; }
    var dt = rig.last == null ? 1 / 60 : Math.min(0.05, (now - rig.last) / 1000);
    rig.last = now;
    repin();
    if (rig.tween) {
      var T = rig.tween, t = (now - T.start) / T.ms, k = T.curve(t);
      rig.uTo = T.u0 + (T.u1 - T.u0) * k;
      var kf = clamp(k, -T.ant, 1);
      rig.fTo = { x: T.f0.x + (T.f1.x - T.f0.x) * kf, y: T.f0.y + (T.f1.y - T.f0.y) * kf };
      if (t >= 1) rig.tween = null;
    }
    if (!rig.pinch) {
      var damp = reduced() ? 1 : rig.damping;
      springStep(rig.u, rig.uTo, dt, PARAMS.freq, damp);
      springStep(rig.fx, rig.fTo.x, dt, PARAMS.freq, damp);
      springStep(rig.fy, rig.fTo.y, dt, PARAMS.freq, damp);
                                                                                        
      var lo = limits().lo;
      if (rig.u.x < lo) { rig.u.x = lo; if (rig.u.v < 0) rig.u.v = 0; }
    }
    if (![rig.u.x, rig.u.v, rig.uTo, rig.fx.x, rig.fy.x, rig.fTo.x, rig.fTo.y].every(finite)) {
                                                                              
      rig.u.x = rig.uTo = Math.log(shown); rig.fx.x = rig.fy.x = 0; rig.fTo = { x: 0, y: 0 }; rig.p = null;
      stop(); return;
    }
    place();
    if (settled()) { finish(); return; }
    rig.frame = requestAnimationFrame(tick);
  }
  function run() {
    if (rig.frame != null) return;
                                                                             
    LAYERS.forEach(function (id) { var e = document.getElementById(id); if (e) e.style.transition = ''; });
    rig.last = null;
    rig.frame = requestAnimationFrame(tick);
  }
  function finish() {
    rig.u.x = rig.uTo; rig.u.v = 0; rig.fx.v = rig.fy.v = 0;
    place(); vignette(0); sharpen();
  }
  function stop() {
    if (rig.frame != null) cancelAnimationFrame(rig.frame);
    rig.frame = null; rig.tween = null; rig.pinch = null;
    rig.uTo = rig.u.x; rig.u.v = rig.fx.v = rig.fy.v = 0;
    rig.fTo = { x: rig.fx.x, y: rig.fy.x };
    vignette(0);
  }
                                                                             
                                                                          
  var rasterAt = 1;
  function sharpen() {
    if (Math.abs(shown - rasterAt) < 0.02) return;
    rasterAt = shown;
    var els = LAYERS.map(function (id) { return document.getElementById(id); }).filter(Boolean);
    els.forEach(function (e) { e.style.willChange = 'auto'; });
    requestAnimationFrame(function () { els.forEach(function (e) { e.style.willChange = ''; }); });
  }

                                                                       
  function anchorAt(clientX, clientY) {
    healCam();
    var f = offsetOf(clientX, clientY), W = world();
    if (rig.frame == null) { rig.u.x = rig.uTo = Math.log(shown); rig.u.v = 0; }
    rig.p = pointAt(pondCam, f, shown, W);
    rig.fx.x = rig.fTo.x = f.x; rig.fy.x = rig.fTo.y = f.y; rig.fx.v = rig.fy.v = 0;
    rig.wrote = { x: pondCam.x, y: pondCam.y };
  }

                                                                                  
  function whoosh(dir) {
    var c = typeof g.ac === 'function' ? g.ac() : null; if (!c) return;
    try {
      var t0 = c.currentTime, dur = dir > 0 ? 0.62 : 0.45;
      var n = Math.floor(c.sampleRate * dur), buf = c.createBuffer(1, n, c.sampleRate), d = buf.getChannelData(0);
      for (var i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
      var src = c.createBufferSource(); src.buffer = buf;
      var bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 1.2;
      bp.frequency.setValueAtTime(dir > 0 ? 260 : 1500, t0);
      bp.frequency.exponentialRampToValueAtTime(dir > 0 ? 1600 : 240, t0 + dur);
      var gn = c.createGain(); gn.gain.setValueAtTime(0.0001, t0);
                                                                                    
      gn.gain.exponentialRampToValueAtTime(0.11, t0 + (dir > 0 ? dur * 0.78 : 0.05));
      gn.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      src.connect(bp); bp.connect(gn); gn.connect(c.destination);
      src.start(t0); src.stop(t0 + dur + 0.02);
    } catch (e) {}
  }
  var lastTock = 0;
  function tock() {
    var now = Date.now(); if (now - lastTock < 280) return; lastTock = now;
    var c = typeof g.ac === 'function' ? g.ac() : null; if (!c) return;
    try {
      var t0 = c.currentTime, o = c.createOscillator(), gn = c.createGain();
      o.type = 'sine'; o.frequency.setValueAtTime(150, t0); o.frequency.exponentialRampToValueAtTime(70, t0 + 0.12);
      gn.gain.setValueAtTime(0.0001, t0); gn.gain.exponentialRampToValueAtTime(0.09, t0 + 0.01);
      gn.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.16);
      o.connect(gn); gn.connect(c.destination); o.start(t0); o.stop(t0 + 0.18);
    } catch (e) {}
  }

                                  

                                                                          
                                         
  function pushIn(clientX, clientY, to) {
    if (!allowed()) return false;
    stop(); anchorAt(clientX, clientY);
    var L = limits(), u0 = rig.u.x, u1 = clamp(Math.log(to || PARAMS.tapZoom), L.lo, L.hi);
                                                                                                   
    var ant = reduced() || u0 - PARAMS.anticipation * (u1 - u0) < L.lo - 1e-3 ? 0 : PARAMS.anticipation;
    rig.damping = PARAMS.damping;
    rig.tween = { start: performance.now(), ms: ant ? PARAMS.pushMs : PARAMS.pushMs * 0.8, u0: u0, u1: u1, ant: ant,
      f0: { x: rig.fx.x, y: rig.fy.x }, f1: { x: 0, y: 0 },
      curve: function (t) { return pushCurve(t, ant); } };
    whoosh(1); run();
    return true;
  }
                                                                         
                                                                            
                                                                
  function pullOut(clientX, clientY, to) {
    if (!allowed()) return false;
    stop(); anchorAt(clientX, clientY);
    var L = limits(), u1 = clamp(Math.log(to == null ? 1 : to), L.lo, L.hi);
    rig.uTo = u1;
    rig.damping = u1 - L.lo < 0.02 ? 1 : PARAMS.damping;
    whoosh(-1); run();
    return true;
  }
                                                                                    
  function zoomTo(z, clientX, clientY) {
    var st = document.querySelector('.pond-stage'), r = st ? st.getBoundingClientRect() : null;
    if (clientX == null && r) { clientX = r.left + r.width / 2; clientY = r.top + r.height / 2; }
    return z > shown ? pushIn(clientX, clientY, z) : pullOut(clientX, clientY, z);
  }

                       

  function onPond(t) {
    return !!(t && t.closest && (t.closest('.pond-stage') || t.closest('#frog-layer')));
  }
                                                                          
  function onWater(t) {
    if (!t || !t.closest) return false;
    if (t.closest('.wander-frog,.lilypad,.pond-mark,.fab-upgrades,.sacrifice-drop,button,a,input')) return false;
    return !!t.closest('.pond-stage') || t.id === 'frog-layer' || t.id === 'pond-scene';
  }

                                                                                     
  g.addEventListener('wheel', function (e) {
    if (!onPond(e.target) || !allowed()) return;
    e.preventDefault();
    if (rig.tween) rig.tween = null;
    var px = e.deltaY * (e.deltaMode === 1 ? 33 : e.deltaMode === 2 ? 400 : 1);
    var du = clamp(-px / 100, -2, 2) * Math.log(PARAMS.wheelStep) * (e.ctrlKey ? 1.6 : 1);
    if (rig.frame == null) anchorAt(e.clientX, e.clientY);
    else { repin(); rig.p = pointAt(pondCam, offsetOf(e.clientX, e.clientY), shown, world());
      var f = offsetOf(e.clientX, e.clientY); rig.fx.x = rig.fTo.x = f.x; rig.fy.x = rig.fTo.y = f.y; rig.fx.v = rig.fy.v = 0; }
    var L = limits(), want = rig.uTo + du;
    rig.damping = PARAMS.damping;
    if (want > L.hi) { rig.uTo = L.hi; if (rig.u.x > L.hi - 0.03 && !reduced()) { rig.u.v += PARAMS.bonk; tock(); } }
    else if (want < L.lo) { rig.uTo = L.lo; if (rig.u.x < L.lo + 0.03 && !reduced()) { rig.u.v += PARAMS.bonk * 0.5; tock(); } }
    else rig.uTo = want;
    run();
  }, { passive: false, capture: true });

                                                                          
  var touches = new Map();
  function mid() {
    var a = Array.from(touches.values());
    return { x: (a[0].x + a[1].x) / 2, y: (a[0].y + a[1].y) / 2, d: Math.hypot(a[0].x - a[1].x, a[0].y - a[1].y) };
  }
  document.addEventListener('pointerdown', function (e) {
    if (e.pointerType !== 'touch') return;
    if (e.isPrimary) touches.clear();                                                                            
    if (!onPond(e.target)) return;
    touches.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (touches.size !== 2 || rig.pinch || !allowed()) return;
    try { if (dragState) return; } catch (err) {}
    try { swipeState = null; } catch (err) {}                                           
    taps.length = 0;
    var m = mid();
    stop(); anchorAt(m.x, m.y);
    rig.pinch = { d0: Math.max(10, m.d), u0: rig.u.x, at: performance.now(), uPrev: rig.u.x, v: 0 };
    run();
    e.stopImmediatePropagation(); e.preventDefault();                                          
  }, true);
  document.addEventListener('pointermove', function (e) {
    if (!touches.has(e.pointerId)) return;
    touches.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (!rig.pinch || touches.size < 2) return;
    var m = mid(), P = rig.pinch, L = limits(), now = performance.now();
    var u = rubber(P.u0 + Math.log(Math.max(10, m.d) / P.d0), L.lo, L.hi, PARAMS.rubber);
    var dt = Math.max(0.008, (now - P.at) / 1000);
    P.v = P.v * 0.6 + ((u - P.uPrev) / dt) * 0.4;                              
    P.uPrev = u; P.at = now;
    rig.u.x = rig.uTo = u; rig.u.v = 0;
    var f = offsetOf(m.x, m.y);
    rig.fx.x = rig.fTo.x = f.x; rig.fy.x = rig.fTo.y = f.y;
  }, true);
  function lift(e) {
    if (!touches.has(e.pointerId)) return;
    touches.delete(e.pointerId);
    if (!rig.pinch || touches.size >= 2) return;
    var P = rig.pinch, L = limits();
    rig.pinch = null;
    var v = reduced() ? 0 : clamp(P.v, -6, 6);
    rig.u.v = v;
    rig.uTo = clamp(rig.u.x + v * PARAMS.flick, L.lo, L.hi);                                                  
    rig.damping = PARAMS.damping;
    if (rig.u.x > L.hi + 0.01) tock();
    run();
  }
  document.addEventListener('pointerup', lift, true);
  document.addEventListener('pointercancel', lift, true);

                                                                            
  var taps = [], press = null;
  document.addEventListener('pointerdown', function (e) {
    press = (e.isPrimary && onWater(e.target)) ? { x: e.clientX, y: e.clientY, t: performance.now() } : null;
  }, true);
  document.addEventListener('pointerup', function (e) {
    var p = press; press = null;
    if (!p || touches.size || rig.pinch) return;
    var now = performance.now();
    if (now - p.t > 280 || Math.hypot(e.clientX - p.x, e.clientY - p.y) > 10) { taps.length = 0; return; }
    var prev = taps[0];
    if (prev && now - prev.t < PARAMS.tapMs && Math.hypot(e.clientX - prev.x, e.clientY - prev.y) < PARAMS.tapPx) {
      taps.length = 0;
      if (shown > PARAMS.tapZoom * 0.85) pullOut(e.clientX, e.clientY, 1);
      else pushIn(e.clientX, e.clientY);
      return;
    }
    taps[0] = { x: e.clientX, y: e.clientY, t: now };
  }, true);

                                                                         
  g.addEventListener('resize', function () {
    if (!sized()) return;                                                                           
    var lo = Math.exp(limits().lo);
    if (shown < lo) { shown = lo; rig.u.x = rig.uTo = Math.log(lo); paint(); if (typeof syncPondCamera === 'function') syncPondCamera(); }
  });

  g.PondZoom = Object.assign(api, { level: level, pushIn: pushIn, pullOut: pullOut, zoomTo: zoomTo,
    active: function () { return rig.frame != null || !!rig.pinch; }, stop: stop });
})(typeof window !== 'undefined' ? window : globalThis);
