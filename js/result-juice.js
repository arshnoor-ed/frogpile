                                                                                
                                                                            

                                                                            
                                                                         
                                                                               
                                                                             
                                                                             
                                                                              
                                                                          
                                                        
                                                                           
                                                                          
                                                                            
                                                                             
                                                                          
                                                                            
                                                                         
                                                                         
                                                                  

                                                                             
                                                                           
                                                                            
                                       
                                                                                   
(function (g) {
  'use strict';

  var PARAMS = {
                                                                                  
    landMs: 330,                                       
    slamMs: 620,                                                  
    poppersMs: 760,                        
    btnMs: 1150,                                                  
    confetti: { badge: 34, popper: 12 },
    colors: ['#ffd84a', '#ffb321', '#5be07a', '#3fc1ff', '#ff6fae', '#b98bff', '#ffffff'],
                               
    pill: {
      baseS: 0.35,                                                                         
      stepS: 0.24,                      
      popS: 0.5,                                             
      countLeadS: 0.18,                                          
      countS: [0.45, 1.1],                             
      tickMs: 32,                     
      soundGapMs: 55,                                       
      landHoldMs: 450                                                                  
    }
  };

  function reduced() {
    try { return !!(g.matchMedia && g.matchMedia('(prefers-reduced-motion: reduce)').matches); } catch (e) { return false; }
  }
                                                                                
  function rng(seed) {
    var s = seed >>> 0;
    return function () {
      s = (s + 0x6D2B79F5) >>> 0;
      var t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

                                                                           
                                                                       
  function audio() {
    try { return typeof g.ac === 'function' ? g.ac() : null; } catch (e) { return null; }
  }
  function tone(c, freq, at, dur, gain, type, slideTo) {
    var o = c.createOscillator(), v = c.createGain();
    o.type = type || 'triangle';
    o.frequency.setValueAtTime(freq, at);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, at + dur);
    v.gain.setValueAtTime(0, at);
    v.gain.linearRampToValueAtTime(gain, at + 0.015);
    v.gain.exponentialRampToValueAtTime(0.001, at + dur);
    o.connect(v); v.connect(c.destination);
    o.start(at); o.stop(at + dur + 0.05);
  }
  var SFX = {
    thud: function () {
      var c = audio(); if (!c) return; var t = c.currentTime;
      tone(c, 150, t, 0.22, 0.28, 'sine', 55);
    },
    fanfare: function () {
      var c = audio(); if (!c) return; var t = c.currentTime;
      [523.25, 659.25, 783.99].forEach(function (f, i) { tone(c, f, t + i * 0.08, 0.32, 0.16); });
      [1046.5, 1318.5, 1568].forEach(function (f) { tone(c, f, t + 0.26, 0.9, 0.09); });
      [2093, 2637, 3136, 2637, 3520].forEach(function (f, i) { tone(c, f, t + 0.36 + i * 0.06, 0.18, 0.035, 'sine'); });
    },
    pop: function () {
      var c = audio(); if (!c) return; var t = c.currentTime;
      tone(c, 420, t, 0.12, 0.12, 'sine', 900);
    },
    womp: function () {
      var c = audio(); if (!c) return; var t = c.currentTime;
      tone(c, 311.1, t, 0.32, 0.12, 'triangle', 293.7);
      tone(c, 233.1, t + 0.3, 0.6, 0.12, 'triangle', 207.7);
    },
    tick: function (k) {
      var c = audio(); if (!c) return; var t = c.currentTime;
      tone(c, 880 * Math.pow(2, Math.min(k, 24) / 24), t, 0.05, 0.035, 'square');
    },
    coin: function (k) {
      var c = audio(); if (!c) return; var t = c.currentTime, up = Math.pow(2, (k % 5) * 2 / 12);
      tone(c, 1318.5 * up, t, 0.12, 0.08);
      tone(c, 1975.5 * up, t + 0.07, 0.35, 0.07);
    }
  };

                                                                              
  function esc(s) { return String(s).replace(/[&<>"']/g, function (ch) { return '&#' + ch.charCodeAt(0) + ';'; }); }
  function letters(word) {
    return word.split('').map(function (ch, i) {
      return '<span class="rj-l" style="--i:' + i + '" data-t="' + esc(ch) + '">' + esc(ch) + '</span>';
    }).join('');
  }
                                                                     
  function starSVG() {
    return '<svg class="rj-star" viewBox="0 0 120 116" aria-hidden="true">'
      + '<defs><linearGradient id="rj-star-gold" x1="0" y1="0" x2="0" y2="1">'
      + '<stop offset="0" stop-color="#fff6b8"/><stop offset=".28" stop-color="#ffe14d"/>'
      + '<stop offset=".62" stop-color="#ffb81f"/><stop offset="1" stop-color="#f08a0c"/></linearGradient></defs>'
      + '<path d="M60 8 L74.5 40.5 L110 44 L83 67.5 L91 102 L60 84 L29 102 L37 67.5 L10 44 L45.5 40.5 Z" '
      + 'fill="url(#rj-star-gold)" stroke="#0d0a27" stroke-width="9" stroke-linejoin="round" paint-order="stroke fill"/>'
      + '<path d="M60 22 L70 44.5 L94 47 L76 63" fill="none" stroke="#fffbe0" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" opacity=".85"/>'
      + '</svg>';
  }
                                                                              
                                              
  function cardHTML(won, kitUI) {
    var title = '<div class="cl-result-title rj-title" role="heading" aria-level="2" aria-label="'
      + (won ? 'Expedition Cleared!' : 'Expedition Failed') + '">'
      + '<span class="rj-title-top" aria-hidden="true">EXPEDITION</span>'
      + '<span class="rj-title-main" aria-hidden="true">' + letters(won ? 'CLEARED!' : 'FAILED') + '</span></div>';
    var sub = '<div class="cl-result-sub rj-sub">' + (won ? 'Your frogs made it through.' : 'Your frogs fought bravely but fell short.') + '</div>';
                                                                                           
    var label = 'Continue' + (won ? '<span class="rj-glint" aria-hidden="true"><i></i></span>' : '');
    var btn = kitUI
      ? kitUI.button({ tone: won ? 'green' : 'gold', shape: 'rounded', size: 'md', id: 'cl-result-continue', className: 'rj-btn', html: label, ariaLabel: 'Continue' })
      : '<button id="cl-result-continue" class="rj-btn" type="button">' + label + '</button>';
    var inner = '<div class="cl-result-card">' + title + sub + '<div class="rj-btn-wrap">' + btn + '</div></div>';
    var panel = kitUI ? kitUI.panel(inner) : inner;
    var badge = won
      ? '<div class="rj-badge" aria-hidden="true"><span class="rj-badge-ring"></span><span class="rj-badge-bob">' + starSVG()
        + '<span class="rj-badge-shine"></span></span></div>'
      : '';
    var back = won
      ? '<div class="rj-glow" aria-hidden="true"></div><div class="rj-rays" aria-hidden="true"></div>'
        + '<div class="rj-twinkles" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></div>'
      : '';
    return '<div class="rj-scene ' + (won ? 'rj-win' : 'rj-loss') + '">' + back
      + '<div class="rj-card">' + badge + panel + '<div class="rj-fx" aria-hidden="true"></div></div></div>';
  }

                                                                          
                                                                        
                                                                   
  function burst(fx, rand, ox, oy, n, dir, spread, speed, delayMs) {
    var html = '';
    for (var i = 0; i < n; i++) {
      var a = (dir + (rand() - 0.5) * spread) * Math.PI / 180;
      var v = speed * (0.55 + rand() * 0.6);
      var x = Math.sin(a) * v, y = -Math.cos(a) * v;
      var shape = rand() < 0.5 ? 'rj-c--rect' : (rand() < 0.5 ? 'rj-c--strip' : 'rj-c--dot');
      var col = PARAMS.colors[Math.floor(rand() * PARAMS.colors.length)];
      var dur = 1.3 + rand() * 0.9;
      html += '<i class="rj-c ' + shape + '" style="left:' + (ox * 100).toFixed(1) + '%;top:' + (oy * 100).toFixed(1) + '%;'
        + '--x:' + x.toFixed(0) + 'px;--y:' + y.toFixed(0) + 'px;--fall:' + (150 + rand() * 170).toFixed(0) + 'px;'
        + '--r:' + ((rand() - 0.5) * 900).toFixed(0) + 'deg;--fx:' + ((rand() - 0.5) * 1080).toFixed(0) + 'deg;'
        + '--c:' + col + ';animation-duration:' + dur.toFixed(2) + 's;animation-delay:' + (delayMs / 1000).toFixed(2) + 's"></i>';
    }
    fx.insertAdjacentHTML('beforeend', html);
  }

                                                                           
                                                                          
                                                       
  function play(root, won) {
    var timers = [];
    function at(ms, fn) { timers.push(setTimeout(fn, ms)); }
    if (!root) return function () {};
    root.classList.add('rj-on');
    var rm = reduced();
    var btn = root.querySelector('#cl-result-continue');
    if (btn && !rm) {
      btn.style.pointerEvents = 'none';
      at(won ? PARAMS.btnMs : PARAMS.btnMs - 250, function () { btn.style.pointerEvents = ''; });
    }
    if (!won) {
      at(PARAMS.landMs, SFX.thud);
      at(PARAMS.landMs + 260, SFX.womp);
      return function () { timers.forEach(clearTimeout); };
    }
    at(PARAMS.landMs, SFX.thud);
    at(PARAMS.slamMs, SFX.fanfare);
    at(PARAMS.btnMs, SFX.pop);
    var fx = root.querySelector('.rj-fx');
    if (fx && !rm) {
      var rand = rng(0xC1EA2ED);
                                                          
      burst(fx, rand, 0.5, 0, PARAMS.confetti.badge, 0, 150, 230, PARAMS.slamMs);
      burst(fx, rand, 0.04, 0.8, PARAMS.confetti.popper, -16, 30, 320, PARAMS.poppersMs);
      burst(fx, rand, 0.96, 0.8, PARAMS.confetti.popper, 16, 30, 320, PARAMS.poppersMs);
    }
    return function () { timers.forEach(clearTimeout); };
  }

                                                                             
  function easeOut(p) { return 1 - Math.pow(1 - p, 3); }
  function countDur(n) {
    var c = PARAMS.pill.countS, digits = String(Math.abs(n)).length;
    return Math.min(c[1], c[0] + digits * 0.18);
  }
                                                                            
                                                                           
                                                                           
                               
  function receipt(m) {
    if (!m || !m.classList || !m.classList.contains('kit-reward-fullscreen')) return;
    var row = m.querySelector(':scope > .xr-res');
    if (!row || row.getAttribute('data-rj')) return;
    row.setAttribute('data-rj', '1');
    var big = !!m.querySelector(':scope > .xr-newtrait');
    var items = m.querySelectorAll(':scope > .xr-items .kit-reward-tile').length;
    var rm = reduced(), P = PARAMS.pill;
    var lastSound = 0, ticks = 0;
    [].forEach.call(row.querySelectorAll('.kit-reward-tile'), function (t, k) {
      var amt = t.querySelector('.kit-reward-tile__amt');
      var text = amt && amt.firstChild && amt.firstChild.nodeType === 3 ? amt.firstChild : null;
      var final = text ? text.data : '';
      var n = parseInt(final.replace(/[^\d]/g, ''), 10);
      var startS;
      if (big) {
        startS = P.baseS + (items ? items * 0.22 : 0) + k * P.stepS;
        t.style.animationDelay = startS.toFixed(2) + 's';
        t.style.setProperty('--kit-reward-delay', startS.toFixed(2) + 's');
        if (amt) amt.style.minWidth = final.length + 'ch';                                                            
      } else {
        startS = parseFloat(t.style.animationDelay) || 0;
      }
      var cut = final.indexOf(String(n));
      if (rm || !text || !(n > 1) || cut < 0 || cut + String(n).length !== final.length) return;                                                
      t.classList.add('xr-pending');
      var prefix = final.slice(0, cut);
      var dur = countDur(n) * 1000, t0 = null, shown = -1;
      text.data = prefix + '0';
      function frame() {
        if (!m.isConnected) return;
        var now = Date.now();
        if (t0 == null) t0 = now;
        var p = Math.min(1, (now - t0) / dur), v = Math.round(n * easeOut(p));
        if (v !== shown) {
          shown = v; text.data = prefix + v;
          if (now - lastSound >= P.soundGapMs && p < 1) { lastSound = now; SFX.tick(ticks++); }
        }
        if (p < 1) { setTimeout(frame, P.tickMs); return; }
        text.data = final;
        t.classList.remove('xr-pending');
        t.classList.add('xr-landed');
        SFX.coin(k);
                                                                                               
        setTimeout(function () {
          if (m.isConnected && g.FtueTooltips && typeof g.FtueTooltips.sync === 'function') { try { g.FtueTooltips.sync(); } catch (e) {} }
        }, P.landHoldMs);
      }
      setTimeout(frame, (startS + P.countLeadS) * 1000);
    });
  }

  var api = { PARAMS: PARAMS, cardHTML: cardHTML, play: play, receipt: receipt, countDur: countDur, rng: rng };
  g.ResultJuice = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
