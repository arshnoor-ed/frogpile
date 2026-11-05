  
                                                  
  
                                                                                             
                                                                                          
                                                                                              
                                                                                
                                                                                         
                                                                                            
                                                                                               
                                                                                         
  
                                                                                          
                                                                                          
                                                                                         
                                                                                          
                                                                                             
                                                                                              
                           
  
                                                                                               
                                                                                                
                                                                                            
                                                                                             
                                               
  
                                                                                         
                                                                                                        
                                                                                         
                                      
   
(function (g) {
  'use strict';

                        
                                                                                              
                                                                              
                                                                                         
                                                                             
                                                                        
                                                                                          
                                                                                          
                                                                                          
                                                                                     
                                                                                             
                                                                                               
                                    
                                                                                           
                                                                           
                                                                                           
                                                                                               
                                                                                          
                                                                                             
                                                                                           
                                                                                              
                                                                                              
                                                          
                                                                                           
                                                                                             
                                                                                              
                                                                                              
                                                                                            
                                                                                          
                                                                                          
                                                                           
  var PARAMS = { strength: 0.6, tile: 0.7, key: { near: 26, far: 46 }, maskScale: 0.25, tintScale: 2,
    patch: { scale: 0.42, min: 0.15, lo: 0.3, hi: 0.68 },
    centre: { size: 0.85, inner: 0.3, min: 0.1 },
    sway: { amp: 0.015, s: 16 },
    sand: { color: '#f3dfaa', width: 0.009, wobble: 0.45 },
    shallow: { color: '#d4f7f6', strength: 1, spread: 0.03, wobble: 0.15,
      steps: [{ at: 0.024, alpha: 0.8 }, { at: 0.052, alpha: 0.42 }] },
    props: { reach: 0.25, shore: 0.018 },
    spark: { everyMs: 480, max: 5, ms: [850, 1350], size: 0.022, vary: 0.35, pair: 0.35, minAlpha: 230 } };

                           
  function smooth(a, b, x) { var t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); }
                                                                                       
  function keyAlpha(r, gg, b, water, key) {
    key = key || PARAMS.key;
    var d = Math.sqrt((r - water[0]) * (r - water[0]) + (gg - water[1]) * (gg - water[1]) + (b - water[2]) * (b - water[2]));
    return 1 - smooth(key.near, key.far, d);
  }
                                                                                        
                                                 
  function measureWater(px) {
    var ch = [[], [], []];
    for (var i = 0; i < px.length; i += 4) { ch[0].push(px[i]); ch[1].push(px[i + 1]); ch[2].push(px[i + 2]); }
    return ch.map(function (a) { a.sort(function (x, y) { return x - y; }); return a[a.length >> 1]; });
  }
                                                                                            
                                                                                          
                                                                                          
                                                                                            
                                                       
  function stripTiles(side, room, imgW, imgH, plateAspect) {
    var tw = (imgW / imgH) / plateAspect, xs = [];
    if (!(room > 0) || !(tw > 0)) return { tw: tw, xs: xs };
    if (side === 'l') for (var x = -tw; x + tw > -room; x -= tw) xs.push(x);
    else for (var x2 = 1; x2 < 1 + room; x2 += tw) xs.push(x2);
    return { tw: tw, xs: xs };
  }

                                                                                          
                                                                                            
                                                                                                 
  function keepConnected(alpha, w, h, faint) {
    faint = faint == null ? 4 : faint;
    var seen = new Uint8Array(w * h), q = new Int32Array(w * h), head = 0, tail = 0, i;
    for (var x = 0; x < w; x++) { i = (h - 1) * w + x; if (alpha[i] > 127) { seen[i] = 1; q[tail++] = i; } }
    while (head < tail) {
      i = q[head++];
      var px = i % w, n;
      if (px > 0 && !seen[n = i - 1] && alpha[n] > faint) { seen[n] = 1; q[tail++] = n; }
      if (px < w - 1 && !seen[n = i + 1] && alpha[n] > faint) { seen[n] = 1; q[tail++] = n; }
      if (i >= w && !seen[n = i - w] && alpha[n] > faint) { seen[n] = 1; q[tail++] = n; }
      if (i < (h - 1) * w && !seen[n = i + w] && alpha[n] > faint) { seen[n] = 1; q[tail++] = n; }
    }
    for (i = 0; i < w * h; i++) if (!seen[i]) alpha[i] = 0;
    return alpha;
  }

                                                                                       
                                                                                      
                                                                                      
                                                                            
  function hash2(i, j) {
    var h = (i * 374761393 + j * 668265263) | 0;
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
  }
  function vnoise(x, y) {
    var i = Math.floor(x), j = Math.floor(y), fx = x - i, fy = y - j;
    fx = fx * fx * (3 - 2 * fx); fy = fy * fy * (3 - 2 * fy);
    var a = hash2(i, j), b = hash2(i + 1, j), c = hash2(i, j + 1), d = hash2(i + 1, j + 1);
    return (a + (b - a) * fx) * (1 - fy) + (c + (d - c) * fx) * fy;
  }
  function patchAt(x, y, patch) {
    patch = patch || PARAMS.patch;
    var u = x / patch.scale, v = y / patch.scale;
    var n = (vnoise(u, v) * 2 + vnoise(u * 2.3 + 17.1, v * 2.3 + 5.7)) / 3;
    return patch.min + (1 - patch.min) * smooth(patch.lo, patch.hi, n);
  }

                                                                                         
                                                                                           
                                                                                          
                                                                           
  function centreFade(x, y, water, c) {
    c = c || PARAMS.centre;
    var cx = (water.x0 + water.x1) / 2, cy = (water.y0 + water.y1) / 2;
    var rx = (water.x1 - water.x0) / 2 * c.size, ry = (water.y1 - water.y0) / 2 * c.size;
    var d = Math.hypot((x - cx) / rx, (y - cy) / ry);
    return c.min + (1 - c.min) * smooth(c.inner, 1, d);
  }

                                                                                            
                                                                                           
                                        
  function shoreLand(alpha, w, h) {
    var land = new Uint8Array(w * h), q = new Int32Array(w * h), head = 0, tail = 0, i, n;
    for (var x = 0; x < w; x++) if (alpha[x] < 128) { land[x] = 1; q[tail++] = x; }
    while (head < tail) {
      i = q[head++];
      var px = i % w;
      if (px > 0 && !land[n = i - 1] && alpha[n] < 128) { land[n] = 1; q[tail++] = n; }
      if (px < w - 1 && !land[n = i + 1] && alpha[n] < 128) { land[n] = 1; q[tail++] = n; }
      if (i >= w && !land[n = i - w] && alpha[n] < 128) { land[n] = 1; q[tail++] = n; }
      if (i < (h - 1) * w && !land[n = i + w] && alpha[n] < 128) { land[n] = 1; q[tail++] = n; }
    }
    return land;
  }
                                                                                          
                                                                                       
  function shoreDistance(land, w, h) {
    var D = new Float32Array(w * h), R2 = Math.SQRT2, FAR = 1e6, x, y, i, v;
    for (i = 0; i < w * h; i++) D[i] = land[i] ? 0 : FAR;
    for (y = 0; y < h; y++) for (x = 0; x < w; x++) {
      i = y * w + x; v = D[i];
      if (x > 0) v = Math.min(v, D[i - 1] + 1);
      if (y > 0) {
        v = Math.min(v, D[i - w] + 1);
        if (x > 0) v = Math.min(v, D[i - w - 1] + R2);
        if (x < w - 1) v = Math.min(v, D[i - w + 1] + R2);
      }
      D[i] = v;
    }
    for (y = h - 1; y >= 0; y--) for (x = w - 1; x >= 0; x--) {
      i = y * w + x; v = D[i];
      if (x < w - 1) v = Math.min(v, D[i + 1] + 1);
      if (y < h - 1) {
        v = Math.min(v, D[i + w] + 1);
        if (x < w - 1) v = Math.min(v, D[i + w + 1] + R2);
        if (x > 0) v = Math.min(v, D[i + w - 1] + R2);
      }
      D[i] = v;
    }
    return D;
  }
                                                                
  function wander(x, y, k) { return vnoise(x / 0.11 + k * 13.7, y / 0.11 + k * 5.3) * 2 - 1; }
                                                                                          
                                                              
  function sandWidth(x, y, s) { s = s || PARAMS.sand; return s.width * (1 + s.wobble * wander(x, y, 1)); }
  function sandAt(d, x, y, px, s) {
    var w = sandWidth(x, y, s);
    return 1 - smooth(w - px, w + px, d);
  }
                                                                                              
                                                                                               
                                                                                             
                                                            
  function blurLand(land, w, h, r) {
    var A = new Float32Array(w * h), T = new Float32Array(w * h), i, x, y, s, n = 2 * r + 1;
    for (i = 0; i < w * h; i++) A[i] = land[i];
    function pass(src, dst, len, count, stride, step) {
      for (var line = 0; line < count; line++) {
        var o = line * stride, acc = 0, k;
        for (k = -r; k <= r; k++) acc += src[o + Math.min(len - 1, Math.max(0, k)) * step];
        for (k = 0; k < len; k++) {
          dst[o + k * step] = acc / n;
          acc += src[o + Math.min(len - 1, k + r + 1) * step] - src[o + Math.max(0, k - r) * step];
        }
      }
    }
    for (s = 0; s < 3; s++) { pass(A, T, w, h, w, 1); pass(T, A, h, w, 1, w); }
    return A;
  }
                                                                                             
                                                                          
  function cdf(z) {
    var t = 1 / (1 + 0.2316419 * Math.abs(z)), p = 0.3989423 * Math.exp(-z * z / 2) *
      t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    return z > 0 ? 1 - p : p;
  }
                                                                                              
                                                                                                
                                                                                           
                                                 
  function shallowSteps(b, grad, x, y, s) {
    s = s || PARAMS.shallow;
    var wv = 1 + s.wobble * wander(x, y, 2), aa = Math.max(1e-4, grad * 0.8), a = 0, prev = 0;
    for (var i = s.steps.length - 1; i >= 0; i--) {                         
      var st = s.steps[i], t = cdf(-st.at / s.spread) * wv;
      a += (st.alpha - prev) * smooth(t - aa, t + aa, b);
      prev = st.alpha;
    }
    return a;
  }

                                                   
  function bilerp(A, w, h, u, v) {
    var x0 = Math.floor(u), y0 = Math.floor(v), fx = u - x0, fy = v - y0;
    var x1 = Math.min(w - 1, x0 + 1), y1 = Math.min(h - 1, y0 + 1);
    x0 = Math.max(0, x0); y0 = Math.max(0, y0);
    var a = A[y0 * w + x0], b = A[y0 * w + x1], c = A[y1 * w + x0], d = A[y1 * w + x1];
    return (a + (b - a) * fx) * (1 - fy) + (c + (d - c) * fx) * fy;
  }
                                                                                          
                                                                                         
                                                                                         
                                                                                               
                                                                                                
                                                                                                 
  function shoreTints(al, D, B, w, h, L, pw, up) {
    var S = PARAMS.sand, H = PARAMS.shallow, W2 = w * up, H2 = h * up;
    var sand = new Uint8Array(W2 * H2), shallow = new Uint8Array(W2 * H2);
    var reach = S.width * (1 + S.wobble) * pw + 2, px = 1.2 / (pw * up), e = 0.5 / up;
    var last = H.steps[H.steps.length - 1], tMin = cdf(-last.at / H.spread) * (1 - H.wobble) * 0.8;
    for (var Y = 0; Y < H2; Y++) {
      var v = (Y + 0.5) / up - 0.5, row = Math.min(h - 1, Math.max(0, Math.round(v))) * w;
      for (var X = 0; X < W2; X++) {
        var u = (X + 0.5) / up - 0.5, near = row + Math.min(w - 1, Math.max(0, Math.round(u)));
        var nearSand = D[near] <= reach, inShallows = B[near] >= tMin;
        if (!nearSand && !inShallows) continue;
        var a = bilerp(al, w, h, u, v) / 255;
        if (a <= 0.02) continue;
        var cover = smooth(0.02, 0.3, a), x = (u - L) / pw, y = v / pw, k = Y * W2 + X;
        if (nearSand) sand[k] = Math.round(255 * cover * sandAt(bilerp(D, w, h, u, v) / pw, x, y, px));
        if (inShallows) {
          var b = bilerp(B, w, h, u, v);
          var gx = bilerp(B, w, h, u + e, v) - bilerp(B, w, h, u - e, v), gy = bilerp(B, w, h, u, v + e) - bilerp(B, w, h, u, v - e);
          shallow[k] = Math.round(255 * cover * shallowSteps(b, Math.hypot(gx, gy), x, y));
        }
      }
    }
    return { w: W2, h: H2, sand: sand, shallow: shallow };
  }

                                       
                                                                                           
                                                                                            
                                                                                           
                                                                                             
                                                                                             
                                                                                        
                                                                       
  function footprintOk(mask, x, y, w, h, clear) {
    if (mask.open) return true;                                                               
    for (var j = 0; j < 4; j++) for (var i = 0; i < 5; i++) {
      var u = Math.floor(mask.L + (x - w / 2 + w * (i + 0.5) / 5) * mask.pw);
      var v = Math.floor((y + h / 2 * j / 3) * mask.ph);
      if (u < 0 || v < 0 || u >= mask.w || v >= mask.h) return false;
      var k = v * mask.w + u;
      if (mask.a[k] < 128 || mask.d[k] <= clear) return false;
    }
    return true;
  }
                                                                                              
                                                                                              
                                                                                             
                                                                                                
                                                                                                
                                                                                      
  function nearestOk(mask, x, y, w, h, clear, reach, step, keep, place) {
    if (footprintOk(mask, x, y, w, h, clear) && (!keep || keep(x, y))) return { x: x, y: y };
    step = step || 3;
    var cells = ringCells(reach, step);                                                                
    for (var i = 0; i < cells.length; i++) {
      var cx = x + cells[i][0] * step / mask.pw, cy = y + cells[i][1] * step / mask.ph;
      if (footprintOk(mask, cx, cy, w, h, clear) && (!keep || keep(cx, cy)) && (!place || place(cx, cy))) return { x: cx, y: cy };
    }
    return null;
  }
                                                                                                  
  var RINGS = {};
  function ringCells(reach, step) {
    var key = reach + '|' + step;
    if (RINGS[key]) return RINGS[key];
    var cells = [], n = Math.ceil(reach / step);
    for (var dj = -n; dj <= n; dj++) for (var di = -n; di <= n; di++) {
      var dd = (di * di + dj * dj) * step * step;
      if (dd && dd <= reach * reach) cells.push([di, dj, dd]);
    }
    cells.sort(function (a, b) { return a[2] - b[2]; });
    return (RINGS[key] = cells);
  }
                                                                                              
                                                                                             
  var OPEN = { open: true, pw: 400, ph: 400 };

                                                                                         
                                                                                       
                                                                                        
  function sparkPoint(rand, view, layer, mask, minAlpha, tries) {
    if (!view.width || !view.height || !layer.width || !layer.height || !mask) return null;
    for (var t = 0; t < (tries || 6); t++) {
      var fx = (view.left + rand() * view.width - layer.left) / layer.width;
      var fy = (view.top + rand() * view.height - layer.top) / layer.height;
      if (!(fx >= 0 && fy >= 0 && fx < 1 && fy < 1)) continue;
      var k = Math.floor(fy * mask.h) * mask.w + Math.floor(fx * mask.w);
      if (mask.d && mask.d[k] < mask.minD) continue;                                            
      if (mask.a[k] >= minAlpha) return { x: fx, y: fy };
    }
    return null;
  }

  var api = { PARAMS: PARAMS, keyAlpha: keyAlpha, measureWater: measureWater, stripTiles: stripTiles,
    keepConnected: keepConnected, patchAt: patchAt, centreFade: centreFade, shoreLand: shoreLand,
    shoreDistance: shoreDistance, sandAt: sandAt, blurLand: blurLand, shallowSteps: shallowSteps, shoreTints: shoreTints,
    footprintOk: footprintOk, nearestOk: nearestOk, OPEN: OPEN, sparkPoint: sparkPoint };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (!g.document) return;

                              

                                                                                       
                                      
  function src(name) { return new URL('assets/env/water/' + name + '.png', document.baseURI).href; }
  function sceneSrc(name) { return g.Assets ? g.Assets.scene(name) : 'assets/env/scene/' + name + '.jpg'; }
  var art = {};
  function load(key, url) {
    var im = new Image();
    im.onload = function () { art[key] = im; sync(); };
    im.src = url;
  }
  var started = false;
  function start() {
    if (started) return; started = true;
    load('plate', sceneSrc('pond')); load('l', sceneSrc('pond-edge-l')); load('r', sceneSrc('pond-edge-r'));
    if (typeof POD_PIPE === 'function') { load('patch', POD_PIPE('patch')); load('pipe', POD_PIPE('base')); }
    if (typeof POND_CLEAR !== 'undefined') load('clear', POND_CLEAR);
    if (typeof g.pondLandmarkSrc === 'function') { load('cave', g.pondLandmarkSrc('cave')); load('pvp', g.pondLandmarkSrc('pvp')); }
    sparkLoop();
  }
                                                                                           
                                                                               
                                                                                           
                                                                                             
                                                                                             
                                                                                                                                                                  
                                                                         
  function landmarkBox(key, L, pw, ph) {
    if (typeof POND_SCENE === 'undefined' || !POND_SCENE[key] || typeof artY !== 'function') return null;
    var r = POND_SCENE[key];
    return { x: L + r.x0 * pw, y: artY(r.y0) * ph, w: (r.x1 - r.x0) * pw, h: artY(r.y1 - r.y0) * ph };
  }

                                                                                             
                                                                                        
  function overscan() {
    var C = g.PondExpansionCamera;
    return C && C.PARAMS && C.PARAMS.overscan > 0 ? C.PARAMS.overscan : 0.2;
  }

  var water = null;                                                                    
                                                                                             
                                                                                               
                                                                                            
                                 
  function buildMask(m) {
    var P = art.plate; if (!P) return null;
    var s = PARAMS.maskScale, pw = Math.round(P.naturalWidth * s), ph = Math.round(P.naturalHeight * s);
    var L = Math.round(m.l * pw), R = Math.round(m.r * pw), B = Math.round((m.b + overscan()) * ph);
    var c = document.createElement('canvas'); c.width = L + pw + R; c.height = ph + B;
    var x = c.getContext('2d', { willReadFrequently: true });
    x.drawImage(P, L, 0, pw, ph);
    if (typeof POND_CLEAR !== 'undefined' && !art.clear) return null;                                                 
    if (art.clear) x.drawImage(art.clear, L, 0, pw, ph);
    if (!water) {
                                                               
      water = measureWater(x.getImageData(L + Math.round(pw * 0.3), Math.round(ph * 0.9), Math.round(pw * 0.4), Math.round(ph * 0.06)).data);
    }
    ['l', 'r'].forEach(function (k) {
      var im = art[k], room = k === 'l' ? m.l : m.r; if (!im || !(room > 0)) return;
      var t = stripTiles(k, room, im.naturalWidth, im.naturalHeight, P.naturalWidth / P.naturalHeight);
      t.xs.forEach(function (tx) { x.drawImage(im, L + tx * pw, 0, t.tw * pw, ph); });
    });
    if (B) { x.fillStyle = 'rgb(' + water.join(',') + ')'; x.fillRect(0, ph, c.width, B); }
    var d = x.getImageData(0, 0, c.width, c.height), px = d.data, n = c.width * c.height, al = new Uint8Array(n);
    for (var i = 0; i < n; i++) al[i] = Math.round(keyAlpha(px[i * 4], px[i * 4 + 1], px[i * 4 + 2], water) * 255);
    var marks = [['patch', 'podPatch'], ['pipe', 'podPipe'], ['cave', 'caveArt'], ['pvp', 'pvpArt']].map(function (m2) {
      return art[m2[0]] && { im: art[m2[0]], box: landmarkBox(m2[1], L, pw, ph) };
    }).filter(function (m2) { return m2 && m2.box; });
    if (marks.length) {
      var pc = document.createElement('canvas'); pc.width = c.width; pc.height = c.height;
      var pctx = pc.getContext('2d', { willReadFrequently: true });
      marks.forEach(function (m2) { pctx.drawImage(m2.im, m2.box.x, m2.box.y, m2.box.w, m2.box.h); });
      var pa = pctx.getImageData(0, 0, c.width, c.height).data;
      for (var q = 0; q < n; q++) if (pa[q * 4 + 3] > 100) al[q] = 0;
    }
    keepConnected(al, c.width, c.height);
                                                                                             
                                
    var wr = typeof g.pondWater === 'function' ? g.pondWater() : { x0: 0.08, x1: 0.92, y0: 0.25, y1: 0.98 };
    for (var j = 0; j < n; j++) {
      var a = al[j];
      if (a) {
        var mx = (j % c.width - L) / pw, my = Math.floor(j / c.width);
        a = Math.round(a * patchAt(mx, my / pw) * centreFade(mx, my / ph, wr));
      }
      px[j * 4] = px[j * 4 + 1] = px[j * 4 + 2] = 0; px[j * 4 + 3] = a;
    }
    x.putImageData(d, 0, 0);
    c.alpha = al;
                                                                                              
    var land = shoreLand(al, c.width, c.height), D = shoreDistance(land, c.width, c.height);
    var H = PARAMS.shallow, r = Math.max(1, Math.round((Math.sqrt(4 * Math.pow(H.spread * pw, 2) + 1) - 1) / 2));
    var B = blurLand(land, c.width, c.height, r);
    var T = shoreTints(al, D, B, c.width, c.height, L, pw, PARAMS.tintScale);
    c.sand = alphaCanvas(T.sand, T.w, T.h); c.shallow = alphaCanvas(T.shallow, T.w, T.h);
    c.shoreD = D;
    c.clearD = (PARAMS.sand.width + H.steps[H.steps.length - 1].at) * pw;
    c.frame = { L: L, pw: pw, ph: ph };
    return c;
  }
                                                                   
  function alphaCanvas(a, w, h) {
    var k = document.createElement('canvas'); k.width = w; k.height = h;
    var cx = k.getContext('2d'), img = cx.createImageData(w, h), p = img.data;
    for (var i = 0; i < a.length; i++) p[i * 4 + 3] = a[i];
    cx.putImageData(img, 0, 0);
    return k;
  }

  var el = null, shallowEl = null, sandEl = null, mask = null, maskSig = '', urls = [], building = false, pending = false;
                                                                                              
  function tintLayer(scene, cls, color, alpha) {
    var t = document.createElement('div');
    t.className = 'wt-tint ' + cls;
    t.setAttribute('aria-hidden', 'true');
    t.style.setProperty('--wt-over', overscan());
    t.style.setProperty('--wt-tint', color);
    t.style.setProperty('--wt-tint-a', alpha);
    scene.appendChild(t);
    return t;
  }
  function setMask(node, url) {
    node.style.webkitMaskImage = node.style.maskImage = 'url("' + url + '")';
    node.classList.add('wt-ready');
  }
  function ensureEl(scene) {
    if (el && el.parentNode === scene) return el;
    [shallowEl, sandEl].forEach(function (t) { if (t && t.parentNode) t.parentNode.removeChild(t); });
    el = document.createElement('div');
    el.className = 'wt-water';
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML = '<div class="wt-base"></div>';
    el.style.setProperty('--wt-base-img', 'url("' + src('water-base') + '")');
    el.style.setProperty('--wt-over', overscan());
    el.style.setProperty('--wt-strength', PARAMS.strength);
    el.style.setProperty('--wt-tile', PARAMS.tile);
    el.style.setProperty('--wt-sway', PARAMS.sway.amp);
    el.style.setProperty('--wt-sway-s', PARAMS.sway.s + 's');
    el.style.setProperty('--wt-spark', PARAMS.spark.size);
    maskSig = '';
    scene.appendChild(el);
    shallowEl = tintLayer(scene, 'wt-shallow', PARAMS.shallow.color, PARAMS.shallow.strength);
    sandEl = tintLayer(scene, 'wt-sand', PARAMS.sand.color, 1);
    return el;
  }

                                                                                          
                                                                                            
  function sync() {
    var scene = document.getElementById('pond-scene');
    if (!scene) return;
    start();
    var e = ensureEl(scene);
    var m = g.PondGrow ? g.PondGrow.current() : { l: 0, r: 0, b: 0 };
                                                                     
    var sig = m.l + '|' + m.r + '|' + m.b + '|' + (m.l > 0 && art.l ? 'l' : '') + (m.r > 0 && art.r ? 'r' : '') + (art.patch ? 'p' : '') + (art.pipe ? 'b' : '');
    if (sig === maskSig || !art.plate) return;
    if (building) { pending = true; return; }
    var c = buildMask(m);
    if (!c) return;
    maskSig = sig; building = true;
    var nodes = [e, shallowEl, sandEl], canvases = [c, c.shallow, c.sand], blobs = [], left = 3;
    canvases.forEach(function (cv, i) {
      cv.toBlob(function (b) {
        blobs[i] = b;
        if (--left) return;
        building = false;
        if (blobs.every(Boolean)) {
          var fresh = blobs.map(function (b2) { return URL.createObjectURL(b2); });
                                                                                                  
                                                                             
          fresh.forEach(function (u, j) {
            ['l', 'r', 'b'].forEach(function (k) { nodes[j].style.setProperty('--wt-' + k, m[k]); });
            setMask(nodes[j], u);
          });
          mask = { a: c.alpha, w: c.width, h: c.height, d: c.shoreD, minD: c.clearD, L: c.frame.L, pw: c.frame.pw, ph: c.frame.ph };
          maskVersion++;
          urls.forEach(function (u) { URL.revokeObjectURL(u); });
          urls = fresh;
        }
        if (pending) { pending = false; sync(); }                                                   
      });
    });
  }

                          
  var alive = 0;
  function reduced() { return !!(g.matchMedia && g.matchMedia('(prefers-reduced-motion: reduce)').matches); }
  function spark(fx, fy, k, delayMs) {
    var S = PARAMS.spark, s = document.createElement('i'), ms = S.ms[0] + Math.random() * (S.ms[1] - S.ms[0]);
    s.className = 'wt-spark';
    s.style.left = (fx * 100) + '%'; s.style.top = (fy * 100) + '%';
    s.style.setProperty('--k', (k * (1 - S.vary + Math.random() * 2 * S.vary)).toFixed(3));
    s.style.setProperty('--turn', (Math.random() < 0.5 ? -1 : 1) * (20 + Math.random() * 25) + 'deg');
    s.style.animationDuration = Math.round(ms) + 'ms';
    if (delayMs) s.style.animationDelay = Math.round(delayMs) + 'ms';
    alive++;
    var done = function () { if (s.parentNode) { s.parentNode.removeChild(s); alive--; } };
    s.addEventListener('animationend', done);
    setTimeout(done, ms + (delayMs || 0) + 400);                                           
    el.appendChild(s);
  }
  function sparkTick() {
    var view = document.getElementById('pond-view');
    if (!el || !mask || document.hidden || reduced() || alive >= PARAMS.spark.max) return;
    if (!view || view.style.display === 'none') return;                                     
    var S = PARAMS.spark, lr = el.getBoundingClientRect();
    var p = sparkPoint(Math.random, view.getBoundingClientRect(), lr, mask, S.minAlpha);
    if (!p) return;
    spark(p.x, p.y, 1, 0);
    if (Math.random() < S.pair) {
                                                                                          
      var m = g.PondGrow ? g.PondGrow.current() : { l: 0, r: 0 };
      var off = S.size * (1.2 + Math.random() * 0.8) / (1 + m.l + m.r);                                                
      var ang = Math.random() * Math.PI * 2;
      var qx = p.x + Math.cos(ang) * off, qy = p.y + Math.sin(ang) * off * (lr.width / lr.height);
      var qk = Math.floor(qy * mask.h) * mask.w + Math.floor(qx * mask.w);
      if (qx >= 0 && qy >= 0 && qx < 1 && qy < 1 && mask.a[qk] >= S.minAlpha && !(mask.d && mask.d[qk] < mask.minD))
        spark(qx, qy, 0.55, 120 + Math.random() * 200);
    }
  }
  function sparkLoop() {
    try { sparkTick(); } catch (e) {                                               }
    setTimeout(sparkLoop, PARAMS.spark.everyMs * (0.5 + Math.random()));
  }

                                                    
                                                                                             
                                                                                                 
                                                                                                
                                              
  var maskVersion = 0;
                                                                                              
                                                                     
  function propClear() { var S = PARAMS.sand; return mask ? (S.width * (1 + S.wobble) + PARAMS.props.shore) * mask.pw + 3 : 0; }
  function propInWater(x, y, w, h) { return !mask || footprintOk(mask, x, y, w, h, propClear()); }
                                                          
  function propToWater(x, y, w, h, keep, place, reach) {
    var m = mask || OPEN;
    return nearestOk(m, x, y, w, h, propClear(), (reach || PARAMS.props.reach) * m.pw, 3, keep, place);
  }

  g.WaterTexture = Object.assign(api, { sync: sync, buildMask: buildMask, propInWater: propInWater,
    propToWater: propToWater, waterVersion: function () { return maskVersion; } });
})(typeof window !== 'undefined' ? window : globalThis);
