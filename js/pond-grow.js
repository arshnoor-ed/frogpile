  
                                                                  
  
                                                                            
                                                                              
                                                                     
  
                                                                             
                                                                             
                                                                           
                                                                          
                                                                           
                                                                    
  
                                                                            
                                                                             
                                                                             
                                                           
  
                                                                             
                                                                            
                                                                         
                                                                                         
                                    
  
                                                                                                         
                                                                              
                                           
   
(function (g) {
  'use strict';

                                                                           
                                                    
                                                                              
                                                                                       
                                                                                      
                                                             
                                                                              
                                                                
                                                                         
                                                                         
  var PARAMS = { side: 0.10, bottom: 0.4, curve: 0.5, roam: 0.6,
                                                                        
                                                                             
                                                                              
                                                                           
                                                                             
                                                                         
                                                                         
                                                                          
                                              
    push: { side: 0.15, centre: 0.5, top: 0.6, bottom: 0.85 },
                                                                      
    glideMs: 1100,
                                                                                           
                                                                                              
                                                                                           
                                                                                       
                       
    topPad: 10,
                                                                                  
                                                                                      
                                                
                                                                                         
                                                                                              
                                                                                          
                                                                                            
                                                             
                                                                                          
                                                                                                     
                                                           
                                                                                             
                                                       
                                                                                          
                                                      
                                                                                             
                                                                                           
                                       
    forest: { scale: 0.5, band: 0.4, depthMax: 0.16,
      pine: { box: [2326, 100, 142, 198], cut: [[2434, 96, 60, 94], [2464, 96, 60, 126]] },
      bush: { box: [1988, 168, 116, 98], cut: [[2072, 160, 34, 25], [2020, 259, 24, 10]] },
      rowStep: 0.032, colStep: 0.05, jitter: 0.4, near: 0.5, far: 0.92, thick: 0.12, bushChance: 0.18,
      size: [0.8, 1.15], shade: 0.28, toneVar: 0.2, reach: 8, island: 150, grow: 3, fade: 8, tile: 72, feather: 10 } };

  function margins(tier) {
    var t = Math.max(0, Math.floor(Number(tier) || 0));
    var f = t > 0 ? Math.pow(t, PARAMS.curve) : 0;
    return { l: PARAMS.side * f, r: PARAMS.side * f, b: PARAMS.bottom * f };
  }

  var NONE = { l: 0, r: 0, b: 0 };
  function orNone(m) { return m || NONE; }

                                                                         
                                                   
  function clampAxis(v, half, lo, hi) {
    if (half * 2 >= hi - lo) return (lo + hi) / 2;
    return Math.max(lo + half, Math.min(hi - half, v));
  }
                                                                                             
                                                                    
  function clampCam(cam, half, m) {
    m = orNone(m);
    return {
      x: clampAxis(cam.x, half.x, -m.l, 1 + m.r),
      y: clampAxis(cam.y, half.y, -(m.t || 0), 1 + m.b)
    };
  }
                                                                                            
                                                                                               
                                                
  function topRoom(chromePx, worldH, zoom) {
    if (!(chromePx > 0) || !(worldH > 0)) return 0;
    return (chromePx + PARAMS.topPad) / (worldH * (zoom || 1));
  }

                                                                             
  function roam(area, m) {
    m = orNone(m);
    return {
      x0: area.x0 - m.l * PARAMS.roam, x1: area.x1 + m.r * PARAMS.roam,
      y0: area.y0, y1: area.y1 + m.b * PARAMS.roam
    };
  }

                                                                             
                                                                        
  function widen(x0, x1, y0, y1, m) {
    m = orNone(m);
    return { x0: x0 - m.l * 100, x1: x1 + m.r * 100, y0: y0, y1: y1 + m.b * 100 };
  }

                                                                               
  function water(w, m) {
    m = orNone(m);
    return { x0: w.x0 - m.l, x1: w.x1 + m.r, y0: w.y0, y1: w.y1 + m.b };
  }

                                 
  function smooth(t) { t = Math.max(0, Math.min(1, t)); return t * t * (3 - 2 * t); }
                                                                                  
  function shiftOf(p, m) {
    m = orNone(m);
    var P = PARAMS.push;
    var wl = smooth((P.centre - p.x) / (P.centre - P.side));
    var wr = smooth((p.x - P.centre) / ((1 - P.side) - P.centre));
    var wb = smooth((p.y - P.top) / (P.bottom - P.top));
    return { dx: -m.l * wl + m.r * wr, dy: m.b * wb };
  }
  function nearest(p, pts) {
    var best = null, bd = Infinity;
    for (var i = 0; i < pts.length; i++) {
      var d = Math.hypot(pts[i].x - p.x, pts[i].y - p.y);
      if (d < bd) { bd = d; best = i; }
    }
    return best === null ? null : { i: best, d: bd };
  }
                                                                             
                                                                        
                                                                         
                                              
  function pushPoint(p, type, woods, m) {
    if (type === 'hatch') return { x: p.x, y: p.y };
    var anchor = p;
    if (type === 'stone' && woods && woods.length) anchor = woods[nearest(p, woods).i];
    var d = shiftOf(anchor, m);
    return { x: p.x + d.dx, y: p.y + d.dy };
  }
  function pushPoints(points, type, woods, m) {
    return points.map(function (p) { return pushPoint(p, type, woods, m); });
  }
                                                                             
                                                                
  function unpush(q, m) {
    m = orNone(m);
    if (!m.l && !m.r && !m.b) return { x: q.x, y: q.y };
    function solve(target, f) {
      var lo = target - 3, hi = target + 3;
      for (var i = 0; i < 60; i++) { var mid = (lo + hi) / 2; if (f(mid) < target) lo = mid; else hi = mid; }
      return (lo + hi) / 2;
    }
    return {
      x: solve(q.x, function (x) { return x + shiftOf({ x: x, y: 0 }, m).dx; }),
      y: solve(q.y, function (y) { return y + shiftOf({ x: 0.5, y: y }, m).dy; })
    };
  }
                                                                            
                                                                            
                                                                             
                                          
  function carry(pos, oldPts, newPts, tol) {
    var n = nearest(pos, oldPts);
    if (!n || n.d > (tol == null ? 0.004 : tol) || !newPts[n.i]) return null;
    return { x: newPts[n.i].x, y: newPts[n.i].y };
  }

                                                                       
                                                                         
                                                    
  function tier() {
    try { return (state && state.pondTier) || 0; } catch (e) { return 0; }
  }
  function current() { var m = margins(tier()); m.t = liveTopRoom(); return m; }

                                                                                              
                                                                                             
  var chrome = { at: -1e9, px: 0 };
  function chromePx() {
    if (!g.document) return 0;
    var now = Date.now();
    if (now - chrome.at < 400) return chrome.px;
    var st = document.querySelector('.pond-stage'), top = st ? st.getBoundingClientRect().top : 0, px = 0;
    document.querySelectorAll('.hud-top, .tutorial-tip, .mission-banner').forEach(function (el) {
      if (el.checkVisibility && !el.checkVisibility({ checkVisibilityCSS: true, checkOpacity: true })) return;
      var r = el.getBoundingClientRect();
      if (r.height && r.top < top + 300) px = Math.max(px, r.bottom - top);                                        
    });
    chrome = { at: now, px: px };
    return px;
  }
                                                                                 
  function liveTopRoom() {
    if (typeof g.pondWorld !== 'function') return 0;
    var W = g.pondWorld();
    return topRoom(chromePx(), W.h, typeof g.pondCamZoom === 'function' ? g.pondCamZoom() : 1);
  }

                                                                     
                                                                      
  function isGrass(r, gr, b) { return r > 85 && gr > 128 && gr > r + 18 && gr - b > 70; }
  function hash3(i, j, k) {
    var h = (i * 374761393 + j * 668265263 + k * 2147483647) | 0;
    h = Math.imul(h ^ (h >>> 13), 1274126177); h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  }
                                                                                              
                                                                                      
  function edgeObjects(data, w, h) {
    var m = new Uint8Array(w * h), st = [], depth = 0;
    function solid(p) { var i = p * 4; return !isGrass(data[i], data[i + 1], data[i + 2]); }
    function visit(q) { if (!m[q] && solid(q)) { m[q] = 1; st.push(q); } }
    for (var x = 0; x < w; x++) visit(x);
    while (st.length) {
      var p = st.pop(), px = p % w, py = (p / w) | 0;
      if (py + 1 > depth) depth = py + 1;
      if (px > 0) visit(p - 1);
      if (px < w - 1) visit(p + 1);
      if (py > 0) visit(p - w);
      if (py < h - 1) visit(p + w);
    }
    return { mask: m, depth: depth };
  }
                                                                                                
                                                                                                
                                                                                               
                                                                                               
                                                    
  function absorbIslands(mask, data, w, h, reach, maxSize, loose) {
    var n = w * h, near = new Uint8Array(n), seen = new Uint8Array(n), front = [], p, q, e, nb;
    function solid(p) { var i = p * 4; return !isGrass(data[i], data[i + 1], data[i + 2]); }
    function around(p) { var px = p % w; return [px > 0 ? p - 1 : -1, px < w - 1 ? p + 1 : -1, p - w, p + w < n ? p + w : -1]; }
    for (p = 0; p < n; p++) if (mask[p]) { near[p] = 1; front.push(p); }
    for (var k = 0; k < reach && front.length; k++) {
      var next = [];
      for (var f = 0; f < front.length; f++) {
        nb = around(front[f]);
        for (e = 0; e < 4; e++) { q = nb[e]; if (q >= 0 && !near[q]) { near[q] = 1; next.push(q); } }
      }
      front = next;
    }
    for (p = 0; p < n; p++) {
      if (mask[p] || seen[p] || !solid(p)) continue;
      var piece = [p], st = [p], touch = false, dark = 0;
      seen[p] = 1;
      while (st.length) {
        var a = st.pop();
        if (near[a]) touch = true;
        if (data[a * 4 + 1] < 100) dark++;
        nb = around(a);
        for (e = 0; e < 4; e++) { q = nb[e]; if (q >= 0 && !seen[q] && !mask[q] && solid(q)) { seen[q] = 1; st.push(q); piece.push(q); } }
      }
      if (piece.length <= maxSize && (touch || (dark > 2 && loose && loose(p % w))))
        for (var i = 0; i < piece.length; i++) mask[piece[i]] = 1;
    }
    return mask;
  }
                                                                                                  
  function growIntoGrass(mask, data, w, h, n) {
    var front = [], p, q;
    for (p = 0; p < w * h; p++) if (mask[p]) front.push(p);
    for (var k = 0; k < n && front.length; k++) {
      var next = [];
      for (var f = 0; f < front.length; f++) {
        p = front[f];
        var px = p % w, nb = [px > 0 ? p - 1 : -1, px < w - 1 ? p + 1 : -1, p - w, p + w];
        for (var e = 0; e < 4; e++) {
          q = nb[e];
          if (q < 0 || q >= w * h || mask[q]) continue;
          var i = q * 4;
          if (isGrass(data[i], data[i + 1], data[i + 2])) { mask[q] = 1; next.push(q); }
        }
      }
      front = next;
    }
    return mask;
  }
                                                                                       
  function softAlpha(mask, w, h) {
    var a = new Float32Array(w * h), b = new Float32Array(w * h), x, y, p;
    for (p = 0; p < w * h; p++) a[p] = mask[p];
    for (var pass = 0; pass < 2; pass++) {
      for (y = 0; y < h; y++) for (x = 0; x < w; x++) {
        p = y * w + x;
        b[p] = (a[p] + (x > 0 ? a[p - 1] : a[p]) + (x < w - 1 ? a[p + 1] : a[p])) / 3;
      }
      for (y = 0; y < h; y++) for (x = 0; x < w; x++) {
        p = y * w + x;
        a[p] = (b[p] + (y > 0 ? b[p - w] : b[p]) + (y < h - 1 ? b[p + w] : b[p])) / 3;
      }
    }
    var out = new Uint8ClampedArray(w * h);
    for (p = 0; p < w * h; p++) out[p] = Math.round(Math.min(1, a[p] * 1.5) * 255);
    return out;
  }
                                                                                              
                                                                                              
                                                                                               
                                                                                            
                                                                                                
                                                                                                
                                                   
  function forestPlan(x0, x1, band, depth, F) {
    var out = [], j0 = -Math.ceil(depth / F.rowStep), j1 = Math.ceil(band / F.rowStep);
    for (var j = j0; j <= j1; j++) {
      var off = (j & 1) ? 0.5 : 0;
      for (var i = Math.floor(x0 / F.colStep) - 1; i <= Math.ceil(x1 / F.colStep) + 1; i++) {
        var y = -(j + (hash3(i, j, 1) - 0.5) * F.jitter) * F.rowStep;
        var x = (i + off + (hash3(i, j, 2) - 0.5) * F.jitter) * F.colStep;
        if (x < x0 - F.colStep || x > x1 + F.colStep || y > depth || y < -band - F.rowStep) continue;
        var up = Math.max(0, Math.min(1, -y / F.thick));
        var keep = y > 0 ? F.near * 0.8 : F.near + (F.far - F.near) * up;
        if (hash3(i, j, 3) > keep) {
          if (y > -F.thick && hash3(i, j, 5) < F.bushChance)
            out.push({ x: x, y: y, kind: 'bush', shade: 0, size: Math.round((0.85 + 0.3 * hash3(i, j, 4)) * 20) / 20, inBand: y > 0 });
          continue;
        }
        var tone = up * F.shade + (hash3(i, j, 6) - 0.5) * F.toneVar;
        out.push({ x: x, y: y, kind: 'pine', shade: Math.round(tone * 20) / 20, inBand: y > 0,
          size: Math.round((F.size[0] + (F.size[1] - F.size[0]) * hash3(i, j, 4)) * 20) / 20 });
      }
    }
    return out.sort(function (a, b) { return a.y - b.y; });
  }

  var api = { PARAMS: PARAMS, margins: margins, clampCam: clampCam, topRoom: topRoom, roam: roam, widen: widen, water: water, current: current,
    shiftOf: shiftOf, pushPoint: pushPoint, pushPoints: pushPoints, unpush: unpush, carry: carry,
    isGrass: isGrass, edgeObjects: edgeObjects, absorbIslands: absorbIslands, growIntoGrass: growIntoGrass, softAlpha: softAlpha, forestPlan: forestPlan };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (!g.document) return;

                              

  var EXT = ['l', 'r', 'b'];
  var lastSig = '';
                                                                          
                                                                               
                                                     
  function sync() {
    var scene = document.getElementById('pond-scene');
    if (!scene) return;
    var m = current();
    if (!scene.querySelector('.pond-ext')) {
      EXT.forEach(function (k) {
        var el = document.createElement('div');
        el.className = 'pond-ext pond-ext-' + k;
        el.setAttribute('aria-hidden', 'true');
        if (k !== 'b') {
          var src = g.Assets ? g.Assets.scene('pond-edge-' + k) : 'assets/env/scene/pond-edge-' + k + '.jpg';
          el.style.backgroundImage = 'url("' + src + '")';
        }
        scene.appendChild(el);
      });
      lastSig = '';
    }
    var t = Math.round((m.t || 0) * 1000) / 1000;
    var sig = m.l + '|' + m.r + '|' + m.b + '|' + t + '|' + waterColour;
    if (sig === lastSig) return;
    lastSig = sig;
    scene.style.setProperty('--grow-l', m.l);
    scene.style.setProperty('--grow-r', m.r);
    scene.style.setProperty('--grow-b', m.b);
    scene.style.setProperty('--grow-t', t);
    if (waterColour) scene.style.setProperty('--grow-water', waterColour);
    forestBand(scene, m);
  }

                                                                                               
                                                                                                
                                                                                                 
                                                                                        
                                                                              
                                                                                   
                                                                                      
                                                                                             
                                                                   
                                                                                                  
                                                                                             
                                                                                           
                                                                                             
  var forestArt = {}, forestSig = '', forestEl = null;
  function forestImage(key, name) {
    if (forestArt[key] !== undefined) return;
    forestArt[key] = null;
    var im = new Image();
    im.onload = function () { forestArt[key] = im; lastSig = ''; sync(); };
    im.src = g.Assets ? g.Assets.scene(name) : 'assets/env/scene/' + name + '.jpg';
  }
  function canvas(w, h) { var c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
  function forestBand(scene, m) {
    forestImage('plate', 'pond'); forestImage('l', 'pond-edge-l'); forestImage('r', 'pond-edge-r');
    var A = forestArt;
    if (!A.plate || !A.l || !A.r) return;
    var sig = m.l + '|' + m.r;
    if (sig === forestSig && forestEl && forestEl.parentNode === scene) return;
    forestSig = sig;
    var f;
    try { f = drawForest(A.plate, A.l, A.r, m); }
    catch (e) { if (g.console) console.warn('PondGrow: no forest up top', e); return; }                               
    var c = f.canvas;
    c.className = 'pond-forest';
    c.setAttribute('aria-hidden', 'true');
    c.style.left = (-f.left * 100) + '%';
    c.style.width = (f.width * 100) + '%';
    c.style.top = (-f.above * 100) + '%';
    c.style.height = ((f.above + f.below) * 100) + '%';
    if (forestEl && forestEl.parentNode) forestEl.parentNode.replaceChild(c, forestEl);
    else scene.appendChild(c);
    forestEl = c;
  }
                                                                                             
                                                                                                   
  function paintBand(ctx, P, EL, ER, lp, pw, ph, Wc, h) {
    var tl = EL.naturalWidth * ph / EL.naturalHeight, tr = ER.naturalWidth * ph / ER.naturalHeight, x;
    for (x = lp - tl; x > -tl; x -= tl) ctx.drawImage(EL, 0, 0, EL.naturalWidth, h / ph * EL.naturalHeight, x, 0, tl, h);
    for (x = lp + pw; x < Wc; x += tr) ctx.drawImage(ER, 0, 0, ER.naturalWidth, h / ph * ER.naturalHeight, x, 0, tr, h);
    ctx.drawImage(P, 0, 0, P.naturalWidth, h / ph * P.naturalHeight, lp, 0, pw, h);
  }
  function nbrs(p, w, n) { var px = p % w; return [px > 0 ? p - 1 : -1, px < w - 1 ? p + 1 : -1, p - w, p + w < n ? p + w : -1]; }
                                                                                                
                                                                                               
                                                                                               
                                    
  function cutSprite(P, spec, s, k) {
    var bx = spec.box[0] * k, by = spec.box[1] * k, bw = spec.box[2] * k, bh = spec.box[3] * k;
    var w = Math.round(bw * s), h = Math.round(bh * s), n = w * h, c = canvas(w, h), x = c.getContext('2d', { willReadFrequently: true });
    x.drawImage(P, bx, by, bw, bh, 0, 0, w, h);
    var id = x.getImageData(0, 0, w, h), d = id.data, gone = new Uint8Array(n), st = [], p, q, e, nb;
    spec.cut.forEach(function (r) {
      var x0 = Math.max(0, Math.floor((r[0] * k - bx) * s)), x1 = Math.min(w, Math.ceil(((r[0] + r[2]) * k - bx) * s));
      var y0 = Math.max(0, Math.floor((r[1] * k - by) * s)), y1 = Math.min(h, Math.ceil(((r[1] + r[3]) * k - by) * s));
      for (var yy = y0; yy < y1; yy++) for (var xx = x0; xx < x1; xx++) gone[yy * w + xx] = 1;
    });
    function grass(p) { return isGrass(d[p * 4], d[p * 4 + 1], d[p * 4 + 2]); }
    for (p = 0; p < n; p++) {
      var px = p % w, py = (p / w) | 0;
      if (gone[p] || ((px === 0 || py === 0 || px === w - 1 || py === h - 1) && grass(p))) { gone[p] = 1; st.push(p); }
    }
    while (st.length) {
      nb = nbrs(st.pop(), w, n);
      for (e = 0; e < 4; e++) { q = nb[e]; if (q >= 0 && !gone[q] && grass(q)) { gone[q] = 1; st.push(q); } }
    }
    var lab = new Int32Array(n).fill(-1), best = -1, most = 0, id2 = 0;
    for (p = 0; p < n; p++) {
      if (gone[p] || lab[p] >= 0) continue;
      var count = 0; st = [p]; lab[p] = id2;
      while (st.length) {
        nb = nbrs(st.pop(), w, n); count++;
        for (e = 0; e < 4; e++) { q = nb[e]; if (q >= 0 && !gone[q] && lab[q] < 0) { lab[q] = id2; st.push(q); } }
      }
      if (count > most) { most = count; best = id2; }
      id2++;
    }
    var foot = 0, solid = new Uint8Array(n);
    for (p = 0; p < n; p++) {
      if (lab[p] === best) { d[p * 4 + 3] = 255; solid[p] = 1; foot = Math.max(foot, ((p / w) | 0) + 1); continue; }
      d[p * 4 + 3] = 0;
      nb = nbrs(p, w, n);
      for (e = 0; e < 4; e++) if (nb[e] >= 0 && lab[nb[e]] === best) { d[p * 4 + 3] = 110; break; }
    }
    x.putImageData(id, 0, 0);
    return { c: c, w: w, h: h, foot: foot, solid: solid };
  }
                                                                                            
  function shaded(sp, shade) {
    var w = sp.w, h = sp.h, c = canvas(w, h), x = c.getContext('2d');
    x.drawImage(sp.c, 0, 0);
    x.globalCompositeOperation = 'source-atop';
    if (shade > 0) { x.fillStyle = 'rgba(8,40,30,' + shade + ')'; x.fillRect(0, 0, w, h); }
    if (shade < 0) { x.fillStyle = 'rgba(190,230,120,' + (-shade * 0.6) + ')'; x.fillRect(0, 0, w, h); }
    return c;
  }
                                                                                                   
                                                                  
  function grassPatches(P, pw, ph, T, f) {
    var hh = Math.round(ph * 0.3), c = canvas(pw, hh), x = c.getContext('2d', { willReadFrequently: true }), W1 = pw + 1, xx, yy, i;
    x.drawImage(P, 0, 0, P.naturalWidth, hh / ph * P.naturalHeight, 0, 0, pw, hh);
    var d = x.getImageData(0, 0, pw, hh).data, I = new Int32Array(W1 * (hh + 1)), K = new Int32Array(W1 * (hh + 1)), sum = [0, 0, 0, 0];
    for (yy = 0; yy < hh; yy++) for (xx = 0; xx < pw; xx++) {
      i = (yy * pw + xx) * 4;
      var gr = isGrass(d[i], d[i + 1], d[i + 2]);
      if (gr) { sum[0] += d[i]; sum[1] += d[i + 1]; sum[2] += d[i + 2]; sum[3]++; }
      I[(yy + 1) * W1 + xx + 1] = (gr ? 0 : 1) + I[yy * W1 + xx + 1] + I[(yy + 1) * W1 + xx] - I[yy * W1 + xx];
      K[(yy + 1) * W1 + xx + 1] = (d[i + 1] < 115 ? 1 : 0) + K[yy * W1 + xx + 1] + K[(yy + 1) * W1 + xx] - K[yy * W1 + xx];
    }
    function box(A, x0, y0) { return A[(y0 + T) * W1 + x0 + T] - A[y0 * W1 + x0 + T] - A[(y0 + T) * W1 + x0] + A[y0 * W1 + x0]; }
    var at = [];
    function near(o) { return Math.abs(o.x - xx) < T && Math.abs(o.y - yy) < T; }
    for (yy = 0; yy + T <= hh; yy += 6) for (xx = 0; xx + T <= pw; xx += 6) {
      if (box(I, xx, yy) <= T * T * 0.012 && !box(K, xx, yy) && !at.some(near)) at.push({ x: xx, y: yy });
    }
    var mask = canvas(T, T), mx = mask.getContext('2d');
    [[T, 0], [0, T]].forEach(function (v, k) {
      var gd = mx.createLinearGradient(0, 0, v[0], v[1]);
      gd.addColorStop(0, 'rgba(0,0,0,0)'); gd.addColorStop(f / T, '#000'); gd.addColorStop(1 - f / T, '#000'); gd.addColorStop(1, 'rgba(0,0,0,0)');
      mx.globalCompositeOperation = k ? 'destination-in' : 'source-over';
      mx.fillStyle = gd; mx.fillRect(0, 0, T, T);
    });
    var n = Math.max(1, sum[3]);
    return { mean: 'rgb(' + Math.round(sum[0] / n) + ',' + Math.round(sum[1] / n) + ',' + Math.round(sum[2] / n) + ')',
      tiles: at.map(function (o) {
        var t = canvas(T, T), tx = t.getContext('2d');
        tx.drawImage(c, o.x, o.y, T, T, 0, 0, T, T);
        tx.globalCompositeOperation = 'destination-in'; tx.drawImage(mask, 0, 0);
        return t;
      }) };
  }
                                                                                               
                                                                                  
  function ground(w, h, lp, G, T, f) {
    var c = canvas(w, h), x = c.getContext('2d'), step = T - f * 1.6;
    x.fillStyle = G.mean; x.fillRect(0, 0, w, h);
    if (!G.tiles.length) return c;
    for (var j = -1; j * step < h; j++) for (var i = -Math.ceil(lp / step) - 2; lp + i * step < w + step; i++) {
      var t = G.tiles[Math.floor(hash3(i, j, 11) * G.tiles.length)];
      x.drawImage(t, Math.round(lp + i * step + (j & 1) * step / 2 + (hash3(i, j, 12) - 0.5) * f), Math.round(j * step + (hash3(i, j, 13) - 0.5) * f));
    }
    return c;
  }
  function drawForest(P, EL, ER, m) {
    var F = PARAMS.forest, s = F.scale, k = P.naturalWidth / 2600;
    var pw = Math.round(P.naturalWidth * s), ph = Math.round(P.naturalHeight * s);
    var lp = Math.round(m.l * pw), Wc = lp + pw + Math.round(m.r * pw), B = Math.round(F.band * ph), Dmax = Math.round(F.depthMax * ph);
                                                              
    var S = canvas(Wc, Dmax), sx = S.getContext('2d', { willReadFrequently: true });
    paintBand(sx, P, EL, ER, lp, pw, ph, Wc, Dmax);
    var sd = sx.getImageData(0, 0, Wc, Dmax).data, eo = edgeObjects(sd, Wc, Dmax);
    absorbIslands(eo.mask, sd, Wc, Dmax, F.reach, F.island, function (x) { return x < lp || x >= lp + pw; });
    growIntoGrass(eo.mask, sd, Wc, Dmax, F.grow);
    var D = Math.min(Dmax, eo.depth + F.grow + 4), alpha = softAlpha(eo.mask, Wc, D), x, y, p;
    for (y = 0; y < Math.min(D, F.fade); y++) for (x = 0; x < Wc; x++) {
      p = y * Wc + x; alpha[p] = Math.max(alpha[p], Math.round(255 * (1 - y / F.fade)));
    }
                                                                                                
                                     
    var T = Math.round(F.tile * s * 2), fe = Math.round(F.feather * s * 2), G = ground(Wc, B + D, lp, grassPatches(P, pw, ph, T, fe), T, fe);
    var out = canvas(Wc, B + D), ox = out.getContext('2d');
    ox.drawImage(G, 0, 0, Wc, B, 0, 0, Wc, B);
    var mask = canvas(Wc, D), mid = mask.getContext('2d').createImageData(Wc, D);
    for (p = 0; p < Wc * D; p++) mid.data[p * 4 + 3] = alpha[p];
    mask.getContext('2d').putImageData(mid, 0, 0);
    var band = canvas(Wc, D), bx = band.getContext('2d');
    bx.drawImage(G, 0, B, Wc, D, 0, 0, Wc, D);
    bx.globalCompositeOperation = 'destination-in';
    bx.drawImage(mask, 0, 0);
    ox.drawImage(band, 0, B);
                                
    var keepOut = [];
    if (typeof POND_SCENE !== 'undefined' && typeof artY === 'function') {
      var pp = POND_SCENE.podPipe;
      if (pp) keepOut.push({ x0: pp.x0 - 0.01, x1: pp.x1 + 0.01, y0: 0 });
      [POND_SCENE.caveArt || POND_SCENE.cave, POND_SCENE.pvpArt || POND_SCENE.pvp].forEach(function (r) { if (r) keepOut.push({ x0: r.x0 - 0.02, x1: r.x1 + 0.02, y0: artY(r.y0) - 0.02 }); });
    }
                                                                                                      
    function stands(sp, z, cx, fy) {
      var w = sp.w * z, h = sp.h * z, x0 = Math.round(cx - w / 2), y0 = Math.round(fy - sp.foot * z);
      for (var yy = 0; yy < h; yy += 2) for (var xx = 0; xx < w; xx += 2) {
        if (!sp.solid[((yy / z) | 0) * sp.w + ((xx / z) | 0)]) continue;
        var X = x0 + xx, Y = y0 + yy - B;
        if (Y < 0) continue;
        if (Y >= D || X < 0 || X >= Wc) return false;
        var q = Y * Wc + X;
        if (!eo.mask[q] && !isGrass(sd[q * 4], sd[q * 4 + 1], sd[q * 4 + 2])) return false;
      }
      var u0 = (x0 - lp) / pw, u1 = (x0 + w - lp) / pw, vb = (y0 + h - B) / ph;
      return !keepOut.some(function (r) { return u1 > r.x0 && u0 < r.x1 && vb > r.y0; });
    }
    var trees = { pine: cutSprite(P, F.pine, s, k), bush: cutSprite(P, F.bush, s, k) }, tones = {};
    forestPlan(-lp / pw, (Wc - lp) / pw, B / ph, D / ph, F).forEach(function (t) {
      var sp = trees[t.kind], cx = lp + t.x * pw, fy = B + t.y * ph;
      if (t.inBand && !stands(sp, t.size, cx, fy)) return;
      var key = t.kind + t.shade, img = tones[key] || (tones[key] = shaded(sp, t.shade));
      var w = Math.round(sp.w * t.size), h = Math.round(sp.h * t.size);
      ox.drawImage(img, Math.round(cx - w / 2), Math.round(fy - sp.foot * t.size), w, h);
    });
    return { canvas: out, left: lp / pw, width: Wc / pw, above: B / ph, below: D / ph };
  }

                                                                         
                                                                              
                                           
  var waterColour = '';
  (function measureWater() {
    var im = new Image();
    im.onload = function () {
      try {
        var c = document.createElement('canvas'), w = im.naturalWidth, h = im.naturalHeight;
        c.width = 64; c.height = 1;
        var x = c.getContext('2d');
                                                                                   
        x.drawImage(im, w * 0.25, h - 6, w * 0.5, 4, 0, 0, 64, 1);
        var d = x.getImageData(0, 0, 64, 1).data, r = 0, gg = 0, b = 0;
        for (var i = 0; i < d.length; i += 4) { r += d[i]; gg += d[i + 1]; b += d[i + 2]; }
        var n = d.length / 4;
        waterColour = 'rgb(' + Math.round(r / n) + ',' + Math.round(gg / n) + ',' + Math.round(b / n) + ')';
        sync();
      } catch (e) {                                     }
    };
    im.src = g.Assets ? g.Assets.scene('pond') : 'assets/env/scene/pond.jpg';
  })();

                                                                      
                                                                     
                                                                          
                                        
  function points(rows, type, tier) {
    var L = g.PondLayout, m = margins(tier);
    var pts = L.pointsFor(rows, type, tier);
    if (!m.l && !m.r && !m.b) return pts;
    return pushPoints(pts, type, type === 'stone' ? L.pointsFor(rows, 'wood', tier) : null, m);
  }
                                                                       
  function home(p, tier) { return pushPoint(p, 'wood', null, margins(tier)); }

                                                                         
                                                                          
                                                                      
                                                                        
  var growTimer = null;
  function grow() {
    document.body.style.setProperty('--grow-glide', PARAMS.glideMs + 'ms');
    document.body.classList.add('pond-growing');
    clearTimeout(growTimer);
    growTimer = setTimeout(function () { document.body.classList.remove('pond-growing'); }, PARAMS.glideMs + 150);
    if (g.PondSpawn && g.PondSpawn.followTier) g.PondSpawn.followTier();
  }

  g.PondGrow = Object.assign(api, { sync: sync, points: points, home: home, grow: grow });
})(typeof window !== 'undefined' ? window : globalThis);
