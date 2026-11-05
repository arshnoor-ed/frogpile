                                                                                                 
                                        
                                                                                                    
                                                                                                   
                                                                                 
                                                                                                   
                                                                                                   
                                                                                                 
                                                       
                                                                                        
                                                                                              
                                                                                   
(function (g) {
  'use strict';

  var BASE = 'assets/ui2/expedition-map/map-anim/';
                                                                                                   
                                                                                                     
  var PIECES = {"art":[900,2000],"floaters":[[527,212,41,47,"air"], [729,214,21,29,"air"], [657,223,24,45,"air"], [751,277,50,57,"air"], [468,282,41,66,"air"], [434,299,19,29,"air"], [824,313,18,25,"air"], [799,333,24,29,"air"], [403,350,58,97,"air"], [791,354,57,57,"air"], [829,444,29,41,"air"], [774,484,62,87,"air"], [723,550,70,106,"air"], [571,560,45,74,"air"], [507,615,63,82,"sea"], [774,666,52,64,"sea"], [839,725,25,32,"sea"], [385,748,54,71,"sea"], [864,750,25,33,"sea"], [74,806,76,87,"sea"], [820,908,57,84,"sea"], [597,950,49,66,"sea"], [41,977,40,47,"sea"], [71,1022,34,41,"sea"], [0,1250,33,68,"sea"], [815,1262,68,92,"sea"], [14,1317,57,68,"sea"], [753,1339,71,83,"sea"], [651,1343,60,72,"sea"], [684,1406,66,77,"sea"], [766,1477,78,102,"sea"], [838,1687,23,27,"sea"], [84,1749,44,54,"sea"], [445,1835,71,95,"sea"], [208,1858,53,64,"sea"], [531,1911,25,28,"sea"]],"clouds":[[724,36,175,119,"r"], [0,106,234,154,"l"], [0,310,134,128,"l"], [267,322,122,47,"mid"], [816,448,84,112,"r"], [0,468,109,122,"l"], [821,624,79,90,"r"], [0,837,113,133,"l"], [855,990,45,103,"r"], [0,1028,94,100,"l"], [804,1374,96,103,"r"], [0,1414,143,139,"l"], [777,1567,123,84,"r"]],"isles":[[389,211,458,379,"crystal"], [27,479,559,384,"ice"], [439,595,419,388,"lava"], [49,806,835,1144,"meadows"]],"on":{"vortex":0,"lava":2,"falls":[3,3,3]},"vortex":[538,322,224,108],"lava":[440,600,423,376],"falls":[[372,990,69,103], [712,1226,61,83], [270,1292,57,111]],"sparkles":[[20,1167], [29,822], [549,592], [61,630], [871,1230], [31,1626], [428,1917], [840,1760], [871,1497], [82,1730], [481,648], [26,691], [869,890], [851,584], [800,1323], [188,814], [779,1465], [64,1410], [182,1843], [277,1915], [283,753], [716,1506]]};

                                                                                                   
                                                                                       
  var PARAMS = {
    seed: 20261027,
    bob: { air: { amp: 7, tilt: 4, dur: [3400, 5200] }, sea: { amp: 3.5, tilt: 0, dur: [2600, 3800] } },
    sway: { edge: 16, mid: 12, dur: [9000, 15000] },
                                                                                 
                                                                                                 
                                                                                                
                                                           
    isles: {
      crystal: { amp: 22, dur: 6200, off: 0, tilt: 1.1, tiltDur: 8300, tiltOff: 1700 },
      ice: { amp: 15, dur: 5400, off: 2100, tilt: 0.7, tiltDur: 7100, tiltOff: 4600 },
      lava: { amp: 15, dur: 5800, off: 4300, tilt: 0.7, tiltDur: 7700, tiltOff: 300 },
      meadows: { amp: 11, dur: 6900, off: 1300, tilt: 0.3, tiltDur: 9400, tiltOff: 5200 }
    },
                                                                                                   
    plateIsles: ['meadows', 'meadows', 'meadows', 'meadows', 'lava', 'ice', 'crystal'],
    spinMs: 32000,                               
    lavaMs: [2400, 2400],
    flowMs: 650,                                                                
    platesMs: 2400,                                                               
                                                                                   
    drifts: [
      { kind: 'snow', box: [60, 440, 420, 330], n: 14, dur: [5200, 8200], dx: [-14, 14] },
      { kind: 'ember', box: [560, 640, 200, 150], n: 12, dur: [2200, 3600], dx: [-12, 12] },
      { kind: 'mote', box: [560, 330, 180, 90], n: 10, dur: [2600, 4200], dx: [-10, 10] },
      { kind: 'leaf', box: [530, 1000, 330, 230], n: 8, dur: [4200, 6400], dx: [-24, 24] },
      { kind: 'pollen', box: [150, 1420, 540, 420], n: 10, dur: [3400, 5600], dx: [-18, 18] },
      { kind: 'pollen', box: [140, 900, 380, 150], n: 5, dur: [3400, 5600], dx: [-18, 18] }
    ],
    sparkleMs: [3200, 5600],
    leafColours: ['#ff9a2e', '#e9542a', '#ffc53d', '#d8402a']
  };

  function rng(seed) {
    var s = seed >>> 0;
    return function () { s = (s + 0x6d2b79f5) >>> 0; var t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  function between(r, range) { return range[0] + r() * (range[1] - range[0]); }

                                                                                                    
  function layout() {
    var r = rng(PARAMS.seed), out = { floaters: [], clouds: [], particles: [], sparkles: [] };
    PIECES.floaters.forEach(function (f, i) {
      var p = PARAMS.bob[f[4]];
      out.floaters.push({ i: i, box: f.slice(0, 4), kind: f[4], amp: p.amp * (0.75 + r() * 0.5),
        tilt: p.tilt ? (i % 2 ? 1 : -1) * p.tilt * (0.5 + r() * 0.5) : 0, dur: Math.round(between(r, p.dur)), off: Math.round(r() * 10000) });
    });
    PIECES.clouds.forEach(function (c, i) {
      var dx = c[4] === 'l' ? -PARAMS.sway.edge : c[4] === 'r' ? PARAMS.sway.edge : PARAMS.sway.mid;
      out.clouds.push({ i: i, box: c.slice(0, 4), side: c[4], dx: Math.round(dx * (0.7 + r() * 0.3)), dur: Math.round(between(r, PARAMS.sway.dur)), off: Math.round(r() * 15000) });
    });
    PARAMS.drifts.forEach(function (d) {
      for (var k = 0; k < d.n; k++) {
        out.particles.push({ kind: d.kind, x: d.box[0] + r() * d.box[2], y: d.box[1] + r() * d.box[3],
          dx: Math.round(between(r, d.dx)), dur: Math.round(between(r, d.dur)), off: Math.round(r() * 10000),
          size: 0.8 + r() * 0.5, colour: d.kind === 'leaf' ? PARAMS.leafColours[Math.floor(r() * PARAMS.leafColours.length)] : null });
      }
    });
    PIECES.sparkles.forEach(function (p) {
      out.sparkles.push({ x: p[0], y: p[1], dur: Math.round(between(r, PARAMS.sparkleMs)), off: Math.round(r() * 10000), size: 0.8 + r() * 0.6 });
    });
    return out;
  }
  var _layout = null;

                                                                                           
  function phase(now, dur, off) { return '-' + Math.round(((now + (off || 0)) % dur + dur) % dur) + 'ms'; }

  function pct(v, of) { return Math.round(v / of * 100000) / 1000 + '%'; }
                                                                                           
  function boxStyle(b, inside) {
    var o = inside || [0, 0, PIECES.art[0], PIECES.art[1]];
    return 'left:' + pct(b[0] - o[0], o[2]) + ';top:' + pct(b[1] - o[1], o[3]) + ';width:' + pct(b[2], o[2]) + ';height:' + pct(b[3], o[3]) + ';';
  }
  function two(n) { return n < 10 ? '0' + n : String(n); }
  function img(cls, file, style) { return '<img class="' + cls + '" src="' + BASE + file + '" alt="" draggable="false" style="' + style + '">'; }

                                                                                           
                                   
  function stageHTML(now) {
    var L = _layout || (_layout = layout()), W = PIECES.art[0], H = PIECES.art[1], h = '';
    var isles = PIECES.isles || [], on = PIECES.on || {}, rides = isles.map(function () { return ''; }), loose = '';
    function put(where, html) { if (where >= 0 && where < isles.length) rides[where] += html; else loose += html; }
    function inside(where) { return where >= 0 && where < isles.length ? isles[where] : null; }
    PIECES.falls.forEach(function (b, i) {
      var m = 'url(' + BASE + 'fall' + i + '.webp)', at = on.falls ? on.falls[i] : -1;
      put(at, '<span class="ma-fall" style="' + boxStyle(b, inside(at)) + '-webkit-mask-image:' + m + ';mask-image:' + m + ';">'
        + '<i style="animation-duration:' + PARAMS.flowMs + 'ms;animation-delay:' + phase(now, PARAMS.flowMs, i * 211) + '"></i></span>');
    });
    put(on.lava, img('ma-lava', 'lava.webp', boxStyle(PIECES.lava, inside(on.lava)) + 'animation-duration:' + PARAMS.lavaMs[0] + 'ms;animation-delay:' + phase(now, PARAMS.lavaMs[0], 0)));
    var v = PIECES.vortex, sq = Math.round(v[3] / v[2] * 10000) / 10000;
    put(on.vortex, '<span class="ma-vortex" style="' + boxStyle(v, inside(on.vortex)) + '--ma-sq:' + sq + ';--ma-isq:' + Math.round(10000 / sq) / 10000 + ';">'
      + '<i style="animation-duration:' + PARAMS.spinMs + 'ms;animation-delay:' + phase(now, PARAMS.spinMs, 0) + '"></i></span>');
    h += img('ma-plate', 'plate.webp', '') + loose;
                                                                    
    isles.map(function (b, i) { return i; }).sort(function (a, b) { return (isles[a][1] + isles[a][3]) - (isles[b][1] + isles[b][3]); }).forEach(function (i) {
      var b = isles[i], p = PARAMS.isles[b[4]] || { amp: 5, dur: 6400, off: i * 1000, tilt: 0, tiltDur: 8000, tiltOff: 0 };
      h += '<span class="ma-isle ma-isle--' + b[4] + '" style="' + boxStyle(b) + '--ma-amp:' + p.amp + ';--ma-tilt:' + p.tilt + 'deg;'
        + 'animation-duration:' + p.dur + 'ms,' + p.tiltDur + 'ms;animation-delay:' + phase(now, p.dur, p.off) + ',' + phase(now, p.tiltDur, p.tiltOff) + '">'
        + img('ma-isle-art', 'isle-' + b[4] + '.webp', '') + rides[i] + '</span>';
    });
    L.clouds.forEach(function (c) {
      h += img('ma-cloud ma-cloud--' + c.side, 'c' + two(c.i) + '.webp', boxStyle(c.box) + '--ma-dx:' + c.dx + ';animation-duration:' + c.dur + 'ms;animation-delay:' + phase(now, c.dur, c.off));
    });
    L.floaters.forEach(function (f) {
      h += img('ma-float ma-float--' + f.kind, 'f' + two(f.i) + '.webp', boxStyle(f.box) + '--ma-amp:' + Math.round(f.amp * 10) / 10 + ';--ma-tilt:' + Math.round(f.tilt * 10) / 10 + 'deg;animation-duration:' + f.dur + 'ms;animation-delay:' + phase(now, f.dur, f.off));
    });
    L.particles.forEach(function (p) {
      h += '<i class="ma-p ma-p--' + p.kind + '" style="left:' + pct(p.x, W) + ';top:' + pct(p.y, H) + ';--ma-dx:' + p.dx + ';--ma-s:' + Math.round(p.size * 100) / 100
        + (p.colour ? ';--ma-c:' + p.colour : '') + ';animation-duration:' + p.dur + 'ms;animation-delay:' + phase(now, p.dur, p.off) + '"></i>';
    });
    L.sparkles.forEach(function (s) {
      h += '<i class="ma-p ma-p--sparkle" style="left:' + pct(s.x, W) + ';top:' + pct(s.y, H) + ';--ma-s:' + Math.round(s.size * 100) / 100 + ';animation-duration:' + s.dur + 'ms;animation-delay:' + phase(now, s.dur, s.off) + '"></i>';
    });
    return '<div class="ma-stage" aria-hidden="true">' + h + '</div>';
  }
                                                                              
  function plateDelay(now) { return phase(now, PARAMS.platesMs, 0); }
                                                                                                   
                                                      
  function plateRide(i, now) {
    var p = PARAMS.isles[PARAMS.plateIsles[i]];
    if (!p) return '';
    return '--ma-amp:' + p.amp + ';animation-duration:' + p.dur + 'ms;animation-delay:' + phase(now, p.dur, p.off) + ';';
  }

  var MapAmbient = { PIECES: PIECES, PARAMS: PARAMS, BASE: BASE, layout: layout, phase: phase, stageHTML: stageHTML, plateDelay: plateDelay, plateRide: plateRide };
  if (typeof module !== 'undefined' && module.exports) module.exports = MapAmbient;
  else g.MapAmbient = MapAmbient;
})(typeof window !== 'undefined' ? window : globalThis);
