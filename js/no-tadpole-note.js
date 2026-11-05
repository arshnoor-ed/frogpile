                                                                               
                                                                           
                                                                     
                                                                             
                      

                                                                               
                                                                        
                                                                               
                                                                             
                                                                            
                                                                             
                                                                     

                                                                             
                                                                          
                                                                             
                                                                     
                                                                     
                
(function (g) {
  'use strict';

  var PARAMS = {
    showMs: 1900,                                             
    shakeMs: 520,                      
    gapPx: 6,                                                   
    edgePx: 8,                                                       
    tailInsetPx: 18                                                               
  };

  var DEFAULT_PILL = '.hud-pill.tad', DEFAULT_TITLE = 'No tadpoles!';
  var cur = null;                                                              

                                                                             
                                                                               
  function placeFor(rect, below, x, gap) {
    var g = gap == null ? PARAMS.gapPx : gap;
    return { x: x == null ? rect.left + rect.width / 2 : x, y: below ? rect.bottom + g : rect.top - g };
  }

                                                                               
                                                                              
                                                                                 
  function shiftFor(x, w, lo, hi) {
    var e = PARAMS.edgePx, half = w / 2, dx = 0;
    if (x - half < lo + e) dx = (lo + e) - (x - half);
    else if (x + half > hi - e) dx = (hi - e) - (x + half);
    var room = Math.max(0, half - PARAMS.tailInsetPx);
    return Math.max(-room, Math.min(room, dx));
  }

  function bubbleHTMLWithTitle(iconHTML, title, sub) {
                                                                            
    var safeTitle = String(title).replace(/[&<>"]/g, function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];
    });
    return '<div class="ntn-body">'
      + (iconHTML ? '<span class="ntn-ico">' + iconHTML + '</span>' : '')
      + '<span class="ntn-txt"><b class="ntn-title">' + safeTitle + '</b>'
      + (sub ? '<span class="ntn-sub">' + sub + '</span>' : '')
      + '</span></div>';
  }
                                                                           
  function bubbleHTML(iconHTML, sub) { return bubbleHTMLWithTitle(iconHTML, DEFAULT_TITLE, sub); }

  function visibleRect(el) {
    if (!el || el.isConnected === false) return null;
    var r = el.getBoundingClientRect();
    return (r.width || r.height) ? r : null;
  }

                                                                                
  function pillPoint(pillSelector) {
    var pill = document.querySelector(pillSelector), r = visibleRect(pill);
    if (!r) return null;
    var v = visibleRect(pill.querySelector('.hp-val'));
    return placeFor(r, true, v ? v.left + v.width / 2 : null);
  }

  function hide() {
    if (!cur) return;
    if (cur.raf) cancelAnimationFrame(cur.raf);
    if (cur.el && cur.el.parentNode) cur.el.parentNode.removeChild(cur.el);
    var pill = document.querySelector(cur.pill + '.ntn-shake');
    if (pill) { pill.classList.remove('ntn-shake'); pill.style.animationDelay = ''; }
    cur = null;
  }

  function frame() {
    if (!cur) return;
    var t = performance.now() - cur.start;
    if (t >= PARAMS.showMs) { hide(); return; }
    var p = null;
    if (cur.below) p = pillPoint(cur.pill);
    else {
      var r = visibleRect(typeof cur.fallback === 'function' ? cur.fallback() : null);
      if (r) p = placeFor(r, false);
    }
    if (p) {                                                     
      cur.el.style.left = p.x + 'px';
      cur.el.style.top = p.y + 'px';
                                                                  
      var lr = cur.layer.getBoundingClientRect();
      cur.el.style.setProperty('--ntn-dx', shiftFor(p.x, cur.body.offsetWidth, lr.left, lr.right) + 'px');
    }
                                                                                 
    var pill = document.querySelector(cur.pill);
    if (pill) {
      if (t < PARAMS.shakeMs) {
        if (!pill.classList.contains('ntn-shake')) {
          pill.style.animationDelay = (-t) + 'ms';
          pill.classList.add('ntn-shake');
        }
      } else if (pill.classList.contains('ntn-shake')) {
        pill.classList.remove('ntn-shake');
        pill.style.animationDelay = '';
      }
    }
    cur.raf = requestAnimationFrame(frame);
  }

                                                                               
                                                                              
                                                                           
                                           
  function show(opts) {
    var layer = document.getElementById('fx-layer');
    if (!layer) return false;
    opts = opts || {};
    hide();
    var pillSelector = opts.pillSelector || DEFAULT_PILL;
    var below = !!pillPoint(pillSelector);
    var el = document.createElement('div');
    el.className = 'ntn-note' + (below ? ' ntn-note--below' : '');
    el.setAttribute('role', 'status');
    el.style.setProperty('--ntn-ms', PARAMS.showMs + 'ms');
    el.innerHTML = bubbleHTMLWithTitle(opts.iconHTML, opts.title || DEFAULT_TITLE, opts.sub);
    layer.appendChild(el);
    cur = { el: el, body: el.firstChild, layer: layer, below: below, fallback: opts.fallback,
      pill: pillSelector, start: performance.now(), raf: 0 };
    frame();
    return true;
  }

  var api = { PARAMS: PARAMS, show: show, hide: hide, placeFor: placeFor, shiftFor: shiftFor,
    bubbleHTML: bubbleHTML, bubbleHTMLWithTitle: bubbleHTMLWithTitle,
    active: function () { return !!cur; } };
  g.NoTadpoleNote = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
