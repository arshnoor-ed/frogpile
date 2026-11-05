  
                                                                               
                                                    
  
                                                                             
                                                                              
                                                                              
                                                                             
                                                                         
                                                                               
                                                                            
                                                
  
                                                                           
                                                                              
                                                                               
                                                                               
                                                                         
                                                                         
   
(function (g) {
  'use strict';
  var PARAMS = {
    delayMs: 420,                                                                         
    chargeMs: 240,                                                     
    flightMs: 380,                                     
    spreadMs: 760,                                   
    spreadPow: 0.7,                                                       
    maxShots: 8,                                                      
    staggerMs: 220,                                                                             
    punchTauMs: 75,                                                      
    landTauMs: 170, landPeriodMs: 300,                                             
    sparkMs: 340, sparksPerHit: 5,
    flashMs: 340, ringMs: 640, burstMs: 820, burst: 18, floatMs: 1150, raysMs: 1500,
    motes: 6,
  };
                                                                                      
  var COLOR = { atk: '#ffc23a', def: '#5aaeff', hp: '#ff5a4f' };
  var ICON = { atk: 'assets/ui2/icon/atk_icon.png', def: 'assets/ui2/icon/def_icon.png', hp: 'assets/ui2/icon/hp_icon.png' };

                                                                              

                                                                             
                                           
  function timeline(stats, P) {
    P = P || PARAMS;
    return (stats || []).map(function (s, j) {
      var delta = s.to - s.from, n = Math.max(1, Math.min(P.maxShots, delta));
      var t0 = j * P.staggerMs, shots = [];
      for (var i = 0; i < n; i++) {
        var at = t0 + P.chargeMs + (n > 1 ? P.spreadMs * Math.pow(i / (n - 1), P.spreadPow) : 0);
        shots.push({ launch: at, hit: at + P.flightMs, value: s.from + Math.round(delta * (i + 1) / n) });
      }
      return { stat: s.stat, from: s.from, to: s.to, delta: delta, t0: t0, shots: shots, land: shots[n - 1].hit };
    });
  }
  function lastHit(tr, t) {
    var k = -1;
    for (var i = 0; i < tr.shots.length; i++) if (tr.shots[i].hit <= t) k = i;
    return k;
  }
  function valueAt(tr, t) {
    var k = lastHit(tr, t);
    return k < 0 ? tr.from : tr.shots[k].value;
  }
                                                  
  function endOf(tr, P) {
    P = P || PARAMS;
    return tr.land + Math.max(P.burstMs, P.floatMs, P.ringMs + 100, P.raysMs) + 40;
  }

                                                                          
                                                              
  function cardPose(tr, t, P, reduced) {
    P = P || PARAMS;
    var k = lastHit(tr, t), landed = t >= tr.land, n = tr.shots.length, d;
    var pose = { value: k < 0 ? tr.from : tr.shots[k].value, counting: t >= tr.t0 && !landed, landed: landed,
      sx: 1, sy: 1, rot: 0, ty: 0, num: 1, flash: 0, glow: 0, icon: 0, iconRot: 0, arrow: 0, rays: 0, raysS: 0.6, raysRot: 0 };
    if (t < tr.t0) return pose;
    pose.glow = 0.12 + 0.5 * (k + 1) / n;                                   
    if (k >= 0 && !landed) {
      d = t - tr.shots[k].hit;
      var kick = Math.exp(-d / P.punchTauMs), side = k % 2 ? 1 : -1;
      pose.num = 1 + 0.4 * kick;
      pose.sx = pose.sy = 1 + 0.06 * kick;
      pose.rot = side * 2.5 * kick;
      pose.ty = -4 * kick;
      pose.flash = 0.3 * kick;
      pose.glow += 0.3 * kick;
      pose.iconRot = -side * 14 * kick;
    }
    if (landed) {
      d = t - tr.land;
      var spring = Math.exp(-d / P.landTauMs) * Math.cos(2 * Math.PI * d / P.landPeriodMs);
      var pop = 1 + 0.14 * Math.exp(-d / 220);
      pose.sy = pop * (1 + 0.2 * spring);
      pose.sx = pop * (1 - 0.13 * spring);
      pose.ty = -6 * Math.exp(-d / 160);
      pose.num = 1 + 0.55 * Math.exp(-d / 140);
      pose.flash = Math.pow(Math.max(0, 1 - d / P.flashMs), 1.5);
      pose.glow = 0.45 + 0.75 * Math.exp(-d / 380);                                              
      pose.icon = 0.35 * Math.exp(-d / 160);
      pose.arrow = -10 * Math.exp(-d / 150) * Math.cos(2 * Math.PI * d / 280);
      var q = d / P.raysMs;
      pose.rays = q < 1 ? Math.min(1, d / 120) * (1 - q * q) : 0;
      pose.raysS = 0.6 + 0.5 * Math.min(1, q * 1.6);
      pose.raysRot = d * 0.045;
    }
    if (reduced) {
      pose.sx = pose.sy = pose.num = 1;
      pose.rot = pose.ty = pose.iconRot = pose.icon = pose.arrow = pose.rays = 0;
      pose.flash = Math.min(pose.flash, 0.35);
    }
    return pose;
  }

                                                                     
  function pillPose(tr, t, P, reduced) {
    P = P || PARAMS;
    if (!tr || t < tr.t0) return null;
    var c = Math.min(1, (t - tr.t0) / P.chargeMs), last = tr.shots[tr.shots.length - 1].launch, kick = 0;
    tr.shots.forEach(function (sh) { if (sh.launch <= t) kick = Math.exp(-(t - sh.launch) / 70); });
    var relax = t > last ? Math.exp(-(t - last) / 200) : 1;
    var glow = c * relax;
    if (glow < 0.01) return null;
    var e = 1 - Math.pow(1 - c, 3);
    return { scale: reduced ? 1 : 1 + (0.14 * e + 0.1 * kick) * relax, glow: glow };
  }

                                                                            
  function rng(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      var x = Math.imul(a ^ (a >>> 15), a | 1);
      x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
      return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
    };
  }
  function seedOf(j, i, salt) { return (j + 1) * 7919 + (i + 1) * 104729 + salt * 1299709; }
  function bez(a, c, b, u) {
    var v = 1 - u;
    return { x: v * v * a.x + 2 * v * u * c.x + u * u * b.x, y: v * v * a.y + 2 * v * u * c.y + u * u * b.y };
  }
                                                                                      
  function shotPath(geo, j, i) {
    var r = rng(seedOf(j, i, 1));
    var p0 = { x: geo.o.x + (r() - 0.5) * geo.o.w * 0.5, y: geo.o.y + (r() - 0.5) * 6 };
    var p2 = { x: geo.c.x + (r() - 0.5) * geo.c.w * 0.3, y: geo.c.y - geo.c.h * 0.18 + (r() - 0.5) * 10 };
    var dx = p2.x - p0.x, dy = p2.y - p0.y, dist = Math.sqrt(dx * dx + dy * dy) || 1;
    var side = (i % 2 ? 1 : -1) * (0.2 + r() * 0.25);
    var cp = { x: (p0.x + p2.x) / 2 - dy / dist * side * dist, y: (p0.y + p2.y) / 2 + dx / dist * side * dist - dist * 0.22 };
    return { p0: p0, cp: cp, p2: p2, spin: (r() < 0.5 ? -1 : 1) * (200 + r() * 260) };
  }
  var flightU = function (p) { return Math.pow(p, 1.35); };                                          

                                                                                
                                                                              
  function particles(tr, j, t, geo, P, reduced) {
    P = P || PARAMS;
    var out = [], col = COLOR[tr.stat] || '#8dff6a', n = tr.shots.length, d, q, m, r;
    var push = function (p) { p.c = p.c || col; p.stat = tr.stat; out.push(p); };
    var dl = t - tr.land;
    if (reduced) {                                                            
      if (dl >= 0 && dl <= P.floatMs) {
        q = dl / P.floatMs;
        push({ id: 'f' + j, kind: 'float', text: '+' + tr.delta, x: geo.c.x, y: geo.c.top - 26, s: 1, r: 0, a: q < 0.65 ? 1 : 1 - (q - 0.65) / 0.35 });
      }
      return out;
    }
                                         
    d = t - tr.t0;
    if (d >= 0 && d < P.chargeMs) {
      q = d / P.chargeMs;
      for (m = 0; m < P.motes; m++) {
        r = rng(seedOf(j, m, 4));
        var ang = 2 * Math.PI * m / P.motes + r() * 0.6, rad = (40 + r() * 26) * (1 - Math.pow(q, 1.4));
        push({ id: 'm' + j + '-' + m, kind: 'dot', x: geo.o.x + Math.cos(ang) * rad * 1.5, y: geo.o.y + Math.sin(ang) * rad * 0.7,
          s: 0.5 + 0.4 * q, r: 0, a: Math.sin(Math.PI * q) });
      }
    }
    tr.shots.forEach(function (sh, i) {
                                                       
      var p = (t - sh.launch) / P.flightMs;
      if (p >= 0 && p < 1) {
        var path = shotPath(geo, j, i), pos = bez(path.p0, path.cp, path.p2, flightU(p));
        var sc = p < 0.25 ? 0.3 + 0.95 * (p / 0.25) : 1.25 - 0.4 * (p - 0.25) / 0.75;
        push({ id: 's' + j + '-' + i, kind: 'shot', x: pos.x, y: pos.y, s: sc, r: path.spin * p, a: Math.min(1, p * 8) });
        for (var k = 1; k <= 4; k++) {
          var pk = p - k * 0.045;
          if (pk <= 0) break;
          var tp = bez(path.p0, path.cp, path.p2, flightU(pk));
          push({ id: 't' + j + '-' + i + '-' + k, kind: 'dot', x: tp.x, y: tp.y, s: sc * (0.95 - k * 0.17), r: 0, a: 0.75 * (1 - k / 5) });
        }
      }
                                                                                                 
      var dh = t - sh.hit;
      if (i < n - 1 && dh >= 0 && dh <= P.sparkMs) {
        var hp = shotPath(geo, j, i).p2, qh = dh / P.sparkMs, rs = rng(seedOf(j, i, 2)), ns = P.sparksPerHit;
        for (var s = 0; s < ns; s++) {
          var a2 = -Math.PI / 2 + (s / (ns - 1) - 0.5) * 2.4 + (rs() - 0.5) * 0.4, dist = (22 + rs() * 26) * (1 - Math.pow(1 - qh, 3));
          push({ id: 'k' + j + '-' + i + '-' + s, kind: 'dot', c: s % 2 ? '#ffffff' : col, x: hp.x + Math.cos(a2) * dist, y: hp.y + Math.sin(a2) * dist + 30 * qh * qh,
            s: (0.55 + rs() * 0.5) * (1 - qh * 0.7), r: 0, a: 1 - qh * qh });
        }
      }
    });
    if (dl < 0) return out;
                                              
    for (m = 0; m < 2; m++) {
      var dm = dl - m * 100;
      if (dm < 0 || dm > P.ringMs) continue;
      q = dm / P.ringMs;
      var e = 1 - Math.pow(1 - q, 3);
      push({ id: 'r' + j + '-' + m, kind: 'ring', c: m ? col : '#ffffff', x: geo.c.x, y: geo.c.y, w: geo.c.w, h: geo.c.h,
        s: 1 + (m ? 0.9 : 0.65) * e, r: 0, a: Math.pow(1 - q, 1.4), bw: 7 * (1 - q) + 1.5 });
    }
                                                           
    if (dl <= P.burstMs) for (m = 0; m < P.burst; m++) {
      r = rng(seedOf(j, m, 3));
      var life = P.burstMs * (0.7 + r() * 0.3);
      if (dl > life) continue;
      var ang2 = 2 * Math.PI * m / P.burst + (r() - 0.5) * 0.5, v = 230 + r() * 220, sec = dl / 1000, kd = 3.2;
      var far = v * (1 - Math.exp(-kd * sec)) / kd, qb = dl / life, star = m % 3 === 0;
      push({ id: 'b' + j + '-' + m, kind: star ? 'star' : 'dot', c: star ? (m % 2 ? '#ffffff' : '#ffe27a') : col,
        x: geo.c.x + Math.cos(ang2) * far, y: geo.c.y + Math.sin(ang2) * far * 0.8 + 260 * sec * sec,
        s: (qb < 0.12 ? qb / 0.12 : 1 - 0.6 * (qb - 0.12) / 0.88) * (0.7 + r() * 0.6) * (star ? 1 : 1.3),
        r: (r() - 0.5) * 720 * sec, a: qb < 0.7 ? 1 : (1 - qb) / 0.3 });
    }
                                                  
    if (dl <= P.floatMs) {
      q = dl / P.floatMs;
      push({ id: 'f' + j, kind: 'float', text: '+' + tr.delta, x: geo.c.x, y: geo.c.top - 8 - 70 * (1 - Math.pow(1 - q, 3)),
        s: q < 0.12 ? 0.4 + 0.95 * (q / 0.12) : q < 0.3 ? 1.35 - 0.35 * ((q - 0.12) / 0.18) : 1, r: 0,
        a: q < 0.65 ? 1 : 1 - (q - 0.65) / 0.35 });
    }
    return out;
  }

                                                                            

  var run = null, raf = 0, nextId = 1, pool = {};
  function now() { return g.performance && g.performance.now ? g.performance.now() : Date.now(); }
  function reducedMotion() { return !!(g.matchMedia && g.matchMedia('(prefers-reduced-motion: reduce)').matches); }
  function trackOf(stat) {
    if (!run) return null;
    for (var i = 0; i < run.tracks.length; i++) if (run.tracks[i].stat === stat) return run.tracks[i];
    return null;
  }

                                                                                  
  function begin(key, stats) {
    if (run && run.key === key) return run;
    clearLayer();
    var tracks = timeline(stats);
    run = { id: nextId++, key: key, start: now() + PARAMS.delayMs, tracks: tracks, reduced: reducedMotion(),
      fired: tracks.map(function () { return -1; }), charged: tracks.map(function () { return false; }), settled: false,
      end: Math.max.apply(null, tracks.map(function (tr) { return endOf(tr); })) };
    return run;
  }
  function active(stat) { return !!trackOf(stat); }

  function poseVars(p) {
    return '--fr-ty:' + p.ty.toFixed(2) + ';--fr-rot:' + p.rot.toFixed(2) + ';--fr-sx:' + p.sx.toFixed(4) + ';--fr-sy:' + p.sy.toFixed(4)
      + ';--fr-num:' + p.num.toFixed(3) + ';--fr-flash:' + p.flash.toFixed(3) + ';--fr-glow:' + p.glow.toFixed(3)
      + ';--fr-icon:' + p.icon.toFixed(3) + ';--fr-icon-rot:' + p.iconRot.toFixed(2) + ';--fr-arrow:' + p.arrow.toFixed(2)
      + ';--fr-rays:' + p.rays.toFixed(3) + ';--fr-rays-s:' + p.raysS.toFixed(3) + ';--fr-rays-rot:' + p.raysRot.toFixed(1)
      + ';--fr-rays-d:' + (p.rays > 0.002 ? 'block' : 'none');
  }
  function cellClass(stat, p) {
    return 'fr-stat-cell fr-stat-cell--' + stat + (p.counting ? ' is-counting' : '') + (p.landed ? ' is-landed' : '')
      + (run.settled ? ' is-settled' : '');
  }
                                                                       
                                                                        
  function cell(stat) {
    var tr = trackOf(stat);
    if (!tr) return null;
    var p = cardPose(tr, now() - run.start, PARAMS, run.reduced);
    return { id: run.id, value: p.value, cls: cellClass(stat, p), style: run.settled ? '' : poseVars(p) };
  }

  function layer() {
    var el = document.getElementById('fr-statfx');
    if (!el) {
      el = document.createElement('div');
      el.id = 'fr-statfx';
      el.setAttribute('aria-hidden', 'true');
      document.body.appendChild(el);
    }
    return el;
  }
  function clearLayer() {
    pool = {};
    var el = typeof document !== 'undefined' && document.getElementById('fr-statfx');
    if (el) el.innerHTML = '';
  }
  function draw(lay, p) {
    var e = pool[p.id];
    if (!e) {
      e = document.createElement('div');
      e.className = 'sfx sfx-' + p.kind;
      if (p.kind === 'shot') e.innerHTML = '<img src="' + (ICON[p.stat] || ICON.atk) + '" alt="" draggable="false">';
      else if (p.kind === 'star') e.textContent = '✦';
      else if (p.kind === 'float') e.textContent = p.text;
      e.style.setProperty('--c', p.c);
      lay.appendChild(e);
      pool[p.id] = e;
    }
    var tf = 'translate(' + p.x.toFixed(1) + 'px,' + p.y.toFixed(1) + 'px)';
    if (p.kind === 'ring') {
      e.style.width = p.w + 'px'; e.style.height = p.h + 'px';
      e.style.marginLeft = (-p.w / 2) + 'px'; e.style.marginTop = (-p.h / 2) + 'px';
      e.style.borderWidth = p.bw.toFixed(1) + 'px';
    }
    e.style.transform = tf + (p.kind === 'float' ? ' translate(-50%,-50%)' : '') + (p.r ? ' rotate(' + p.r.toFixed(1) + 'deg)' : '') + ' scale(' + Math.max(0, p.s).toFixed(3) + ')';
    e.style.opacity = Math.max(0, Math.min(1, p.a)).toFixed(3);
  }

                                                                    
  function audio() { return typeof g.ac === 'function' ? g.ac() : null; }
  function tone(c, type, f0, f1, t, len, vol) {
    var o = c.createOscillator(), gn = c.createGain();
    o.type = type; o.frequency.setValueAtTime(f0, t);
    if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(f1, t + len * 0.8);
    gn.gain.setValueAtTime(0.0001, t);
    gn.gain.exponentialRampToValueAtTime(vol, t + Math.min(0.02, len * 0.2));
    gn.gain.exponentialRampToValueAtTime(0.0001, t + len);
    o.connect(gn); gn.connect(c.destination); o.start(t); o.stop(t + len + 0.02);
  }
  var sound = {
    charge: function () { var c = audio(); if (!c) return; var t = c.currentTime; tone(c, 'sine', 320, 900, t, 0.26, 0.05); tone(c, 'triangle', 640, 1800, t, 0.22, 0.02); },
    hit: function (i) {                                   
      var c = audio(); if (!c) return; var t = c.currentTime, f = 760 * Math.pow(2, i * 2 / 12);
      tone(c, 'triangle', f, f * 1.03, t, 0.1, 0.11); tone(c, 'sine', f * 2, f * 2, t, 0.06, 0.03);
    },
    land: function () {
      var c = audio(); if (!c) return; var t = c.currentTime;
      tone(c, 'sine', 210, 70, t, 0.24, 0.26);               
      [0, 4, 7, 12].forEach(function (semi, k) { var f = 1046.5 * Math.pow(2, semi / 12); tone(c, 'triangle', f, f, t + 0.02 + k * 0.05, 0.5, 0.1); });
      [2637, 3136, 3951].forEach(function (f, k) { tone(c, 'sine', f, f, t + 0.1 + k * 0.06, 0.32, 0.025); });
    },
  };
  function sounds(tr, j, t) {
    if (!run.charged[j] && t >= tr.t0) { run.charged[j] = true; if (t - tr.t0 < 200) sound.charge(); }
    var k = lastHit(tr, t);
    while (run.fired[j] < k) {
      var i = ++run.fired[j];
      if (t - tr.shots[i].hit > 150) continue;                                                   
      if (i === tr.shots.length - 1) sound.land(); else sound.hit(i);
    }
  }

  function rectIn(el, lo) {
    var r = el.getBoundingClientRect();
    return { x: r.left - lo.left + r.width / 2, y: r.top - lo.top + r.height / 2, w: r.width, h: r.height, top: r.top - lo.top };
  }
  function setPill(pill, pp) {
    if (!pill) return;
    if (!pp) { pill.style.transform = ''; pill.style.filter = ''; return; }
    var col = COLOR[run.tracks[0].stat] || '#fff';
    pill.style.transform = 'scale(' + pp.scale.toFixed(3) + ')';
    pill.style.filter = 'drop-shadow(0 0 ' + (10 * pp.glow).toFixed(1) + 'px ' + col + ') brightness(' + (1 + 0.25 * pp.glow).toFixed(3) + ')';
  }

  function frame() {
    raf = 0;
    if (!run || typeof document === 'undefined') return;
    var cards = document.querySelectorAll('.fr-stat[data-fx="' + run.id + '"]');
    if (!cards.length) { teardown(); return; }                       
    var t = now() - run.start, lay = layer(), lo = lay.getBoundingClientRect(), live = {};
                                                                                      
    var pill = document.querySelector('.fr-overlay .fr-fxsrc');
    var src = pill || document.querySelector('.fr-overlay .fr-stage');
    var o = src ? rectIn(src, lo) : null;
    run.tracks.forEach(function (tr, j) {
      var card = null;
      for (var i = 0; i < cards.length; i++) if (cards[i].getAttribute('data-stat') === tr.stat) card = cards[i];
      if (!card || !card.parentNode) return;
      var cellEl = card.parentNode, p = cardPose(tr, t, PARAMS, run.reduced);
      cellEl.setAttribute('style', poseVars(p));
      cellEl.className = cellClass(tr.stat, p);
      var b = card.querySelector('.kit-rewardstat__value b');
      if (b && b.textContent !== String(p.value)) b.textContent = p.value;
      if (o) particles(tr, j, t, { o: o, c: rectIn(cellEl, lo) }, PARAMS, run.reduced).forEach(function (pt) { live[pt.id] = 1; draw(lay, pt); });
      sounds(tr, j, t);
    });
    setPill(pill, pill ? pillPose(run.tracks[0], t, PARAMS, run.reduced) : null);
    Object.keys(pool).forEach(function (id) { if (!live[id]) { pool[id].remove(); delete pool[id]; } });
    if (t > run.end) { settle(); return; }
    raf = g.requestAnimationFrame(frame);
  }
                                                                        
  function settle() {
    run.settled = true;
    clearLayer();
    document.querySelectorAll('.fr-stat[data-fx="' + run.id + '"]').forEach(function (card) {
      var tr = trackOf(card.getAttribute('data-stat'));
      if (!tr) return;
      card.parentNode.removeAttribute('style');
      card.parentNode.className = cellClass(tr.stat, cardPose(tr, run.end, PARAMS, run.reduced));
    });
    setPill(document.querySelector('.fr-overlay .fr-fxsrc'), null);
  }
  function teardown() {
    if (raf && g.cancelAnimationFrame) g.cancelAnimationFrame(raf);
    raf = 0; run = null;
    clearLayer();
  }
                                                                         
  function kick() {
    if (run && !run.settled && !raf && g.requestAnimationFrame) raf = g.requestAnimationFrame(frame);
  }

  var api = {
    PARAMS: PARAMS, COLOR: COLOR,
    timeline: timeline, lastHit: lastHit, valueAt: valueAt, endOf: endOf,
    cardPose: cardPose, pillPose: pillPose, particles: particles,
    begin: begin, active: active, cell: cell, kick: kick,
  };
  g.StatCountFX = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
