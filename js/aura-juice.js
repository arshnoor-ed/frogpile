                                                                        
                                                                        
  
                                                                            
                                                                              
                                                                                
                                                                                
                                                                 
  
                                                                         
                                                                                
                                                                            
                                                                      
                                                                   
                                                                            
                                         
  
                                                                             
                                                                                
                                                                              
                                                                          
  
                                                                              
                                                                           
                                                                              
                                                                               
                                            
  
                                                                           
                                                                               
                                                                            
  
                                                 
   
(function (g) {
  'use strict';

  var PARAMS = {
    embers: 7,                             
    licks: 2,                                               
    boil: {
      frames: 8,                                                                       
      res: 360,                                                                                    
      amp: 0.034,                                                             
      waves: 1.15,                                                
      ripple: 0.38                                                 
    }
  };
                                                                           
  var FLAME_DEFAULT = { cx: 57, top: 1, bottom: 76, left: 29, right: 85, rgb: '255,226,150' };

                                                                            
                                                                               
                                                                           
                                                                                
  function emberSpec(n, count) {
    var u = (n * 0.618034 + 0.13) % 1, v = (n * 0.414214 + 0.57) % 1;
    var dur = 1.35 + v * 0.95;
    return {
      x: +(0.12 + u * 0.72).toFixed(3),
      y: +(0.22 + v * 0.22).toFixed(3),
      dx: +(((n % 2) ? 1 : -1) * (2 + u * 5)).toFixed(2),
      rise: +(20 + v * 14).toFixed(2),
      size: +(2.1 + ((n * 0.7548) % 1) * 1.6).toFixed(2),
      dur: +dur.toFixed(2),
      delay: +(-dur * ((n + 0.5) / count)).toFixed(2)
    };
  }

                                                                           
                                                                           
                                                                              
                                                                              
                                                                      
  function boilShift(yPct, s, k, frames, P) {
    P = P || PARAMS.boil; s = s || FLAME_DEFAULT;
    var h = Math.max(1, s.bottom - s.top);
    var up = (s.bottom - yPct) / h;                                                     
    if (up <= 0) return 0;
    var w = Math.pow(Math.min(1, up), 1.25);
    var ph = 2 * Math.PI * k / frames;
    var a = Math.sin(2 * Math.PI * up * P.waves - ph)
          + P.ripple * Math.sin(2 * Math.PI * up * P.waves * 2.3 - 2 * ph + 1.1);
    return P.amp * w * a / (1 + P.ripple);
  }

  function attr(s) { return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;'); }

                                                                                  
  function stackHTML(src, frames, err) {
    if (!frames) return '<img class="fs-flame-still" src="' + src + '" draggable="false" decoding="async" alt=""' + err + '>';
    return frames.map(function (u, i) {
      return '<img class="fs-flame-frame" src="' + attr(u) + '" style="--fi:' + i + '" draggable="false" alt="">';
    }).join('');
  }

                                                                         
                                                                                 
  function flameHTML(l, xf, onerr) {
    var src = attr(l.path), err = onerr ? ' onerror="' + attr(onerr) + '"' : '';
    var frames = _frames[l.path] || null, s = _stats[l.path], style = xf ? 'transform:' + xf + ';' : '';
    if (s) { var v = flameVars(s); for (var p in v) style += p + ':' + v[p] + ';'; }
    var h = '<span class="fs-aura-flame" data-flame="' + attr(l.key || '') + '" data-src="' + src + '"'
      + (s ? ' data-geom="1"' : '') + (frames ? ' data-boil="1"' : '')
      + (style ? ' style="' + attr(style) + '"' : '') + '>'
      + '<span class="fs-flame-glow"></span>'
      + '<span class="fs-flame-body">' + stackHTML(src, frames, err) + '</span>'
      + '<span class="fs-flame-core">' + stackHTML(src, frames, err) + '</span>';
    for (var k = 0; k < PARAMS.licks; k++) {
      h += '<img class="fs-flame-lick" src="' + src + '" style="--lk-i:' + k + '" draggable="false" decoding="async" alt=""' + err + '>';
    }
    for (var n = 0; n < PARAMS.embers; n++) {
      var e = emberSpec(n, PARAMS.embers);
      h += '<i class="fs-ember" style="--ex:' + e.x + ';--ey:' + e.y + ';--edx:' + e.dx + '%;--erise:-' + e.rise
        + '%;--esz:' + e.size + '%;--edur:' + e.dur + 's;--edel:' + e.delay + 's"><b></b></i>';
    }
    return h + '</span>';
  }

                                                                                 
                                                                                 
                                     
  function inkStats(data, N) {
    var x0 = 1e9, y0 = 1e9, x1 = -1, y1 = -1, r = 0, gg = 0, b = 0, c = 0;
    for (var y = 0; y < N; y++) for (var x = 0; x < N; x++) {
      var i = (y * N + x) * 4, a = data[i + 3];
      if (a > 18) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
      if (a > 200) { r += data[i]; gg += data[i + 1]; b += data[i + 2]; c++; }
    }
    if (x1 < 0) return null;
    var P = function (v) { return +(v / N * 100).toFixed(2); };
    return {
      cx: P((x0 + x1 + 1) / 2), top: P(y0), bottom: P(y1 + 1), left: P(x0), right: P(x1 + 1),
      rgb: c ? [Math.round(r / c), Math.round(gg / c), Math.round(b / c)].join(',') : FLAME_DEFAULT.rgb
    };
  }

                                                                        
                                                                               
                                                                               
                                                                          
                                                               
  function flameVars(s) {
    s = s || FLAME_DEFAULT;
    var h = s.bottom - s.top, w = s.right - s.left;
    var rgb = String(s.rgb).split(',').map(Number);
    var hot = rgb.map(function (v) { return Math.round(v + (255 - v) * 0.6); }).join(',');
    return {
      '--fl-ox': s.cx + '%', '--fl-oy': s.bottom + '%',
      '--fl-tx': s.cx + '%', '--fl-ty': (s.top + h * 0.14).toFixed(2) + '%',
      '--fl-l': s.left + '%', '--fl-w': w.toFixed(2) + '%',
      '--fl-t': s.top + '%', '--fl-h': h.toFixed(2) + '%',
      '--fl-mask': (s.top + h * 0.3).toFixed(2) + '%',
      '--fl-rgb': rgb.join(','), '--fl-hot': hot
    };
  }

                                                                              
                                                                               
                                                                              
                                                                         
                                                                         
                                                                        
  var GLINTS = 3;
  function glintSpec(n, count) {
    var u = (n * 0.618034 + 0.31) % 1, v = (n * 0.754878 + 0.17) % 1;
    var dur = 1.9 + u * 1.1;
    return {
      x: +(0.15 + u * 0.7).toFixed(3), y: +(0.15 + v * 0.7).toFixed(3),
      size: +(7 + v * 5).toFixed(2),
      dur: +dur.toFixed(2), delay: +(-dur * (n + 0.35) / count).toFixed(2)
    };
  }
  function sparkleHTML(key) {
    var h = '<span class="fs-aura-sparkle" data-aura="' + attr(key || '') + '"'
      + (_auraStats[key] ? ' data-geom="1" style="' + attr(sparkleStyle(_auraStats[key])) + '"' : '') + '>'
      + '<span class="fs-aura-glow"></span>';
    for (var n = 0; n < GLINTS; n++) {
      var e = glintSpec(n, GLINTS);
      h += '<i class="fs-glint" style="--gx:' + e.x + ';--gy:' + e.y + ';--gsz:' + e.size + '%;--gdur:' + e.dur
        + 's;--gdel:' + e.delay + 's"></i>';
    }
    return h + '</span>';
  }
                                                                            
                                                                     
  function auraUnion(stats) {
    var L = 1e9, T = 1e9, R = -1, B = -1, r = 0, gg = 0, b = 0, wsum = 0;
    (stats || []).forEach(function (s) {
      if (!s) return;
      L = Math.min(L, s.left); T = Math.min(T, s.top); R = Math.max(R, s.right); B = Math.max(B, s.bottom);
      var w = Math.max(1, (s.right - s.left) * (s.bottom - s.top)), c = String(s.rgb).split(',').map(Number);
      r += c[0] * w; gg += c[1] * w; b += c[2] * w; wsum += w;
    });
    if (R < 0) return null;
    return { left: L, top: T, right: R, bottom: B,
      rgb: [Math.round(r / wsum), Math.round(gg / wsum), Math.round(b / wsum)].join(',') };
  }
                                                                                             
  function sparkleStyle(u) {
    var light = String(u.rgb).split(',').map(function (v) { return Math.round(+v + (255 - v) * 0.4); }).join(',');
    return '--ag-l:' + u.left + '%;--ag-t:' + u.top + '%;--ag-w:' + (u.right - u.left).toFixed(2)
      + '%;--ag-h:' + (u.bottom - u.top).toFixed(2) + '%;--ag-rgb:' + light + ';';
  }

                                                                               
  var _img = {}, _stats = {}, _frames = {}, _busy = {}, _auraStats = {};
  function measureAura(key) {
    if (_auraStats[key] || _busy['a' + key] || typeof Image === 'undefined' || !g.FT) return;
    var paths = g.FT.auraPieces(key);
    if (!paths.length) { _auraStats[key] = { left: 20, top: 10, right: 80, bottom: 60, rgb: FLAME_DEFAULT.rgb }; return; }
    _busy['a' + key] = 1;
    var got = [], left = paths.length;
    paths.forEach(function (p, i) {
      var im = new Image();
      var done = function () {
        if (--left) return;
        _auraStats[key] = auraUnion(got) || { left: 20, top: 10, right: 80, bottom: 60, rgb: FLAME_DEFAULT.rgb };
        delete _busy['a' + key];
      };
      im.onload = function () {
        try {
          var N = 96, c = document.createElement('canvas'); c.width = c.height = N;
          var ctx = c.getContext('2d', { willReadFrequently: true });
          ctx.drawImage(im, 0, 0, N, N);
          got[i] = inkStats(ctx.getImageData(0, 0, N, N).data, N);
        } catch (e) {}
        done();
      };
      im.onerror = done;
      im.src = p;
    });
  }
  function load(src, done) {
    if (_img[src]) { if (_img[src].complete && _img[src].naturalWidth) done(_img[src]); return; }
    var im = new Image();
    im.onload = function () { done(im); };
    im.onerror = function () { _stats[src] = FLAME_DEFAULT; _frames[src] = false; };
    _img[src] = im; im.src = src;
  }
  function measure(src) {
    if (_stats[src] || _busy['m' + src] || typeof Image === 'undefined') return;
    _busy['m' + src] = 1;
    load(src, function (im) {
      try {
        var N = 128, c = document.createElement('canvas'); c.width = c.height = N;
        var ctx = c.getContext('2d', { willReadFrequently: true });
        ctx.drawImage(im, 0, 0, N, N);
        _stats[src] = inkStats(ctx.getImageData(0, 0, N, N).data, N) || FLAME_DEFAULT;
      } catch (e) { _stats[src] = FLAME_DEFAULT; }
      delete _busy['m' + src];
    });
  }
                                                                            
                                                                              
                                        
  function boilFrames(src) {
    if (_frames[src] !== undefined || _busy['b' + src] || !_stats[src]) return;
    _busy['b' + src] = 1;
    load(src, function (im) {
      var P = PARAMS.boil, R = P.res, s = _stats[src], urls = [], left = P.frames;
      var fail = function () { _frames[src] = false; delete _busy['b' + src]; };
      try {
        var srcC = document.createElement('canvas'); srcC.width = srcC.height = R;
        srcC.getContext('2d').drawImage(im, 0, 0, R, R);
        for (var k = 0; k < P.frames; k++) (function (k) {
          var c = document.createElement('canvas'); c.width = c.height = R;
          var ctx = c.getContext('2d');
          for (var y = 0; y < R; y++) {
            var dx = boilShift(y / R * 100, s, k, P.frames, P) * R;
            ctx.drawImage(srcC, 0, y, R, 1, dx, y, R, 1);
          }
          c.toBlob(function (blob) {
            if (!blob) return fail();
            var u = URL.createObjectURL(blob), pre = new Image();
            pre.src = u; urls[k] = u;
            var ready = function () { if (--left === 0) { _frames[src] = urls; delete _busy['b' + src]; } };
            if (pre.decode) pre.decode().then(ready, ready); else pre.onload = ready;
          }, 'image/png');
        })(k);
      } catch (e) { fail(); }
    });
  }
  function tick() {
    if (!g.document) return;
    var els = document.querySelectorAll('.fs-aura-flame:not([data-boil])');
    for (var i = 0; i < els.length; i++) {
      var el = els[i], src = el.getAttribute('data-src'), s = _stats[src];
      if (!s) { measure(src); continue; }
      if (!el.hasAttribute('data-geom')) {
        var v = flameVars(s);
        for (var k in v) el.style.setProperty(k, v[k]);
        el.setAttribute('data-geom', '1');
      }
      var fr = _frames[src];
      if (fr === undefined) { boilFrames(src); continue; }
      if (fr) {
        var body = el.querySelector('.fs-flame-body'), core = el.querySelector('.fs-flame-core');
        if (body) body.innerHTML = stackHTML(src, fr, '');
        if (core) core.innerHTML = stackHTML(src, fr, '');
      }
      el.setAttribute('data-boil', fr ? '1' : '0');
    }
    var sp = document.querySelectorAll('.fs-aura-sparkle:not([data-geom])');
    for (var q = 0; q < sp.length; q++) {
      var key = sp[q].getAttribute('data-aura'), u = _auraStats[key];
      if (!u) { measureAura(key); continue; }
      sp[q].setAttribute('style', sparkleStyle(u));
      sp[q].setAttribute('data-geom', '1');
    }
                                                                                     
    var unseated = document.querySelectorAll('.fs-aura-flame[data-boil]:not([data-geom])');
    for (var j = 0; j < unseated.length; j++) {
      var st = _stats[unseated[j].getAttribute('data-src')];
      if (!st) continue;
      var vv = flameVars(st);
      for (var kk in vv) unseated[j].style.setProperty(kk, vv[kk]);
      unseated[j].setAttribute('data-geom', '1');
    }
  }
  if (g.document && typeof setInterval !== 'undefined') setInterval(tick, 200);

  var api = { PARAMS: PARAMS, FLAME_DEFAULT: FLAME_DEFAULT, emberSpec: emberSpec, boilShift: boilShift,
    flameHTML: flameHTML, inkStats: inkStats, flameVars: flameVars,
    glintSpec: glintSpec, sparkleHTML: sparkleHTML, auraUnion: auraUnion, sparkleStyle: sparkleStyle, tick: tick };
  g.AuraJuice = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
