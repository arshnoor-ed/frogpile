                                                                          
                                                                            
                                                                   

                                                                           
                                                                            
                                                                             
                                                                         
                                                                         
                                                                              
                                                                             
                                                                            
                                                                             
                                                                     

                                                                  
                                                                              
                                                                             
                                                                              
                            

                                                                             
                                                                            
                                                                              
                                                                             
                                                                            
                                                                             

                                                                         
                                                                             
                                                              

                                                                           
                                                                       
(function (g) {
  'use strict';

  var MS_PER_MIN = 60000;

                                                                          
                                                                            
  function shareAt(w, now, regenPerMin) {
    if (!w) return 1;
    var s = Number(w.share);
    if (!isFinite(s)) return 1;
    var mins = Math.max(0, (now - (Number(w.at) || 0)) / MS_PER_MIN);
    return Math.max(0, Math.min(1, s + Math.max(0, Number(regenPerMin) || 0) * mins));
  }
                                                                      
  function hpFor(maxHp, share) {
    maxHp = Math.max(0, Number(maxHp) || 0);
    if (share >= 1) return maxHp;
    return Math.min(maxHp, Math.max(1, Math.floor(maxHp * share)));
  }
                                                                       
  function msToFull(w, now, regenPerMin) {
    var cur = shareAt(w, now, regenPerMin);
    if (cur >= 1) return 0;
    if (!(regenPerMin > 0)) return Infinity;
    return Math.ceil((1 - cur) / regenPerMin * MS_PER_MIN);
  }
                                                                         
                                                                      
  function wound(frog, share, now, regenPerMin) {
    var next = Math.min(shareAt(frog.wound, now, regenPerMin), Math.max(0, Math.min(1, Number(share))));
    if (!(next < 1)) { delete frog.wound; return null; }
    frog.wound = { share: next, at: now };
    return frog.wound;
  }
                                                                 
  function settle(frog, now, regenPerMin) {
    if (!frog.wound || shareAt(frog.wound, now, regenPerMin) < 1) return false;
    delete frog.wound;
    return true;
  }
                                                                            
  function fmtLeft(ms) {
    if (!isFinite(ms)) return '';
    var s = Math.max(1, Math.ceil(ms / 1000));
    if (s < 60) return s + 's';
    var m = Math.ceil(s / 60);
    if (m < 60) return m + 'm';
    var h = Math.floor(m / 60), r = m % 60;
    return r ? h + 'h ' + r + 'm' : h + 'h';
  }
                                                                     
  function ftueRunning(s) { return !!s && !s.ftueDone && (s.ftueLoop != null ? s.ftueLoop < 6 : !s.pondExpanded); }

                                                                          
                                                                          
                                                                             
                                                                            
                                                                         
                                                                          
                                                                           
  function levelRulesFromFrogsRows(rows, level) {
    var row = null;
    for (var i = 0; i < rows.length; i++) { if (rows[i]['Frog Level'] === level) { row = rows[i]; break; } }
    if (!row) throw new Error('[FrogWounds] "Frogs" tab has no "Frog Level" row for ' + level);
    var after = Number(row['HP % after loss']);
    if (!isFinite(after) || after < 0 || after > 100) {
      throw new Error('[FrogWounds] Frog Level ' + level + ': invalid "HP % after loss" (' + row['HP % after loss'] + ')');
    }
    var recover = Number(row['HP % recover per minute']);
    if (!isFinite(recover) || recover < 0) {
      throw new Error('[FrogWounds] Frog Level ' + level + ': invalid "HP % recover per minute" (' + row['HP % recover per minute'] + ')');
    }
    return { share: after / 100, regen: recover / 100 };
  }

  var api = {
    shareAt: shareAt, hpFor: hpFor, msToFull: msToFull, wound: wound, settle: settle,
    fmtLeft: fmtLeft, ftueRunning: ftueRunning, levelRulesFromFrogsRows: levelRulesFromFrogsRows
  };

                                                                          
  var isBrowser = typeof document !== 'undefined';
  if (isBrowser) {
    var TICK_MS = 1000;
    function S() { return typeof state !== 'undefined' ? state : null; }

    var configReady = false;
    if (g.FPConfig && FPConfig.ready) FPConfig.ready.then(function () { configReady = true; }, function () {});

                                                                            
    function levelOf(f) {
      var bodySize = typeof frogBodySize === 'function' ? frogBodySize(f) : 0;
      return (g.FrogStats && FrogStats.frogLevelForBodySize) ? FrogStats.frogLevelForBodySize(bodySize) : 0;
    }
                                                                         
                                                                              
                                                                          
                                                                              
                                                                     
    var _rulesByLevel = {};
    function rulesFor(f) {
      var level = levelOf(f);
      if (!(level in _rulesByLevel)) _rulesByLevel[level] = levelRulesFromFrogsRows(FPConfig.rows('Frogs'), level);
      return _rulesByLevel[level];
    }
    api.rulesFor = rulesFor;

                                                                             
    api.share = function (f, now) {
      if (!f || !f.wound || !configReady) return 1;
      return shareAt(f.wound, now == null ? Date.now() : now, rulesFor(f).regen);
    };
                                                                           
    api.hpOf = function (f, maxHp, now) {
      now = now == null ? Date.now() : now;
      var share = api.share(f, now), hurt = share < 1;
      return { hp: hpFor(maxHp, share), maxHp: maxHp, share: share, hurt: hurt,
        msToFull: hurt ? msToFull(f.wound, now, rulesFor(f).regen) : 0 };
    };
                                                          
    api.statusText = function (f, now) {
      now = now == null ? Date.now() : now;
      if (api.share(f, now) >= 1) return '';
      var left = fmtLeft(msToFull(f.wound, now, rulesFor(f).regen));
      return left ? 'Healing · ' + left : 'Hurt';
    };
                                                                            
                                                                          
                                                                     
    api.onLoss = function (frogIds, at) {
      var s = S();
      if (!s || !configReady || ftueRunning(s)) return 0;
      var when = at == null ? Date.now() : at, n = 0;
      (frogIds || []).forEach(function (id) {
        var f = (s.frogs || []).filter(function (x) { return x.id === id; })[0];
        if (!f) return;
        var r = rulesFor(f);
        if (r.share < 1 && wound(f, r.share, when, r.regen)) n++;
      });
      return n;
    };

                                                                                                    
                                                                                            
    var _alpha = {};
    function alphaBox(src) {
      var a = _alpha[src];
      if (a) return a === 1 ? null : a;
      _alpha[src] = 1;             
      var im = new Image();
      im.onload = function () {
        try {
          var k = Math.min(1, 160 / Math.max(im.naturalWidth, im.naturalHeight)), W = Math.max(1, Math.round(im.naturalWidth * k)), H = Math.max(1, Math.round(im.naturalHeight * k));
          var cv = document.createElement('canvas'); cv.width = W; cv.height = H;
          var cx = cv.getContext('2d'); cx.drawImage(im, 0, 0, W, H);
          var d = cx.getImageData(0, 0, W, H).data, t = H, l = W, r = -1;
          for (var y = 0; y < H; y++) for (var x = 0; x < W; x++) if (d[(y * W + x) * 4 + 3] > 40) { if (y < t) t = y; if (x < l) l = x; if (x > r) r = x; }
          _alpha[src] = r < 0 ? { t: 0, l: 0, r: 1 } : { t: t / H, l: l / W, r: (r + 1) / W };
        } catch (e) { _alpha[src] = { t: 0, l: 0, r: 1 }; }
      };
      im.onerror = function () { _alpha[src] = { t: 0, l: 0, r: 1 }; };
      im.src = src;
      return null;
    }
                                                                                                      
                                                
    function headSeat(el, hop) {
      var er = el.getBoundingClientRect(), k = el.offsetHeight ? er.height / el.offsetHeight : 0;
      if (!k) return null;
      var imgs = hop.querySelectorAll('img.fs-body:not(.fs-dz), img.fs-head'), top = Infinity, bl = Infinity, br = -Infinity;
      for (var i = 0; i < imgs.length; i++) {
        var im = imgs[i]; if (getComputedStyle(im).visibility === 'hidden') continue;
        var a = alphaBox(im.currentSrc || im.src); if (!a) return null;
        var r = im.getBoundingClientRect(); if (!r.height) continue;
        top = Math.min(top, r.top + a.t * r.height);
        if (im.classList.contains('fs-body')) { bl = Math.min(bl, r.left + a.l * r.width); br = Math.max(br, r.left + a.r * r.width); }
      }
      if (!isFinite(top)) return null;
      var tf = getComputedStyle(el).transform, flip = !!tf && tf !== 'none' && new DOMMatrix(tf).a < 0;
      var x = isFinite(bl) ? ((bl + br) / 2 - er.left) / k : el.offsetWidth / 2;
      return { x: flip ? el.offsetWidth - x : x, y: (top - er.top) / k };
    }

                                                                                                     
                                                                                             
                                                                                                   
    function syncPond() {
      var s = S(); if (!s || !s.frogs || !configReady || typeof wanderingSprites === 'undefined') return;
      var now = Date.now(), byId = {};
      s.frogs.forEach(function (f) {
        if (f.wound) settle(f, now, rulesFor(f).regen);
        byId[f.id] = f;
      });
      Object.keys(wanderingSprites).forEach(function (id) {
        var spr = wanderingSprites[id], el = spr && spr.el; if (!el) return;
        var hop = el.querySelector('.frog-hop');
        var f = byId[id], share = f && f.wound ? shareAt(f.wound, now, rulesFor(f).regen) : 1;
        var bar = el.querySelector('.frog-wound');
        if (share >= 1 || !hop) { if (bar) bar.remove(); return; }
        if (bar && bar.parentElement !== hop) { bar.remove(); bar = null; }
        if (!bar) {
          bar = document.createElement('div');
          bar.className = 'frog-wound';
          bar.setAttribute('aria-hidden', 'true');
          bar.innerHTML = '<i></i>';
          hop.appendChild(bar);
        }
        if (hop.classList.contains('idle') && !hop.classList.contains('fg-moving')) { var seat = headSeat(el, hop); if (seat) el._fwSeat = seat; }
        if (el._fwSeat) {
          bar.style.left = el._fwSeat.x.toFixed(1) + 'px';
          bar.style.top = (el._fwSeat.y - bar.offsetHeight - 0.08 * el.offsetWidth).toFixed(1) + 'px';
        }
        bar.style.setProperty('--fw-share', share.toFixed(3));
        bar.title = api.statusText(f, now);
      });
      var marked = document.querySelectorAll('[data-fw-frog]');
      for (var i = 0; i < marked.length; i++) {
        var n = marked[i], f = byId[n.getAttribute('data-fw-frog')], sh = f && f.wound ? shareAt(f.wound, now, rulesFor(f).regen) : 1;
        n.hidden = sh >= 1;
        n.style.setProperty('--fw-share', sh.toFixed(3));
        var tx = n.querySelector('[data-fw-text]'); if (tx && sh < 1) tx.textContent = api.statusText(f, now);
      }
    }
    api.syncPond = syncPond;
                                                                            
                                                                             
                                                                             
                                                                            
                                                                        
                                                                
    var tickWarned = false;
    setInterval(function () {
      try { syncPond(); }
      catch (e) { if (!tickWarned) { tickWarned = true; if (g.console) console.error('[FrogWounds] pond tick: ' + e); } }
    }, TICK_MS);
  }

  g.FrogWounds = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
