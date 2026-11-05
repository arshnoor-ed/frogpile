                                                                                
                                                                             
                                                                        

                                                                            
                                                                            
                                                                              
                                                                          
                                                                              
                                                                              
                                                                         
                                                                         
                                                                           
                                                                          
                                                                             
                                                                         
                                                                     
                                                                             
                                          
                                                                           
                                                                        
                             
                                                                                   
(function (g) {
  'use strict';

  var LEVELS = 4;                              
  var MIN_ZOOM = 0.6;
  var STEPS = 7;                                                       
                                                                           
                                                                       
  var KEEP = /(^|\s)(kit-feature__glow|xr-sparkles|kit-reward-eyebrow|kit-reward-title|kit-reward-message|kit-reward-collect)(\s|$)/;

                                                                              
                                                                           
  function fits(over) { return over <= 0.05; }

                                                                              
                                                                                
  function solve(apply, opts) {
    opts = opts || {};
    var levels = opts.levels != null ? opts.levels : LEVELS;
    var minZoom = opts.minZoom || MIN_ZOOM, steps = opts.steps || STEPS;
    var level = 0, over = apply(0, 1);
    while (!fits(over) && level < levels) over = apply(++level, 1);
    if (fits(over)) return { level: level, zoom: 1, fits: true };
    if (!fits(apply(level, minZoom))) return { level: level, zoom: minZoom, fits: false };
    var lo = minZoom, hi = 1;
    for (var i = 0; i < steps; i++) {
      var mid = (lo + hi) / 2;
      if (fits(apply(level, mid))) lo = mid; else hi = mid;
    }
    apply(level, lo);
    return { level: level, zoom: lo, fits: true };
  }

                                                                           
  function inFlow(el) { var p = getComputedStyle(el).position; return p !== 'absolute' && p !== 'fixed'; }
                                                                               
                                                                              
                                                                           
                                                                           
                                                                
  function overflowOf(m) {
    var kids = [].filter.call(m.children, inFlow), last = kids[kids.length - 1];
    if (!last) return 0;
    var mr = m.getBoundingClientRect(), lr = last.getBoundingClientRect();
    var bottom = lr.bottom - mr.top - m.clientTop + m.scrollTop
      + (parseFloat(getComputedStyle(last).marginBottom) || 0) + (parseFloat(getComputedStyle(m).paddingBottom) || 0);
    return bottom - m.clientHeight;
  }
                                                                            
                                                                           
                                                                          
  function setLevel(m, zoomers, level, zoom, top) {
    m.classList.toggle('xr-fit', level > 0);
    for (var n = 2; n <= LEVELS; n++) m.classList.toggle('xr-fit-' + n, level >= n);
    if (level) m.setAttribute('data-xr-fit', String(level)); else m.removeAttribute('data-xr-fit');
    m.style.removeProperty('--xr-top');
    zoomers.forEach(function (el) { el.style.zoom = zoom < 1 ? String(zoom) : ''; });
    var over = overflowOf(m);
    if (level === 1 && !fits(over)) {
      m.style.setProperty('--xr-top', 'max(var(--xr-top-min), ' + Math.max(0, top - over).toFixed(2) + 'px)');
      over = overflowOf(m);
    }
    return over;
  }
                                                                           
                                                                             
                                                                             
                                          
  function markRepeats(m) {
    var first = {};
    [].forEach.call(m.querySelectorAll('.xr-slot.xr-fit-won'), function (s) { s.classList.remove('xr-fit-won'); });
    [].forEach.call(m.querySelectorAll(':scope > .xr-newtrait[data-family]'), function (card) {
      var fam = card.getAttribute('data-family'), keep = first[fam];
      card.classList.toggle('xr-fit-repeat', !!keep);
      if (!keep) { first[fam] = card; return; }
      var kept = keep.querySelectorAll('.xr-slot');
      [].forEach.call(card.querySelectorAll('.xr-slot'), function (s, i) {
        if (s.classList.contains('is-won') && kept[i]) kept[i].classList.add('xr-fit-won');
      });
    });
  }
                                                                          
                                                                             
                                                                             
                                          
  function fit(m) {
    m = m || document.getElementById('claim-modal');
    if (!m || !m.isConnected) return null;
    m.style.overflowY = 'hidden'; m.scrollTop = 0;
    markRepeats(m);
    var zoomers = [].filter.call(m.children, function (el) { return !KEEP.test(el.className) && inFlow(el); });
    var top = 0;
    var r = solve(function (level, zoom) {
      var over = setLevel(m, zoomers, level, zoom, top);
      if (!level) top = parseFloat(getComputedStyle(m).paddingTop) || 0;
      return over;
    });
    if (!r.fits) m.style.overflowY = '';
    if (r.zoom < 1) m.setAttribute('data-xr-zoom', r.zoom.toFixed(3)); else m.removeAttribute('data-xr-zoom');
    return r;
  }

                                                                               
                                                                           
                                                                             
  var watched = null, mo = null;
  function watch() {
    var m = document.getElementById('claim-modal');
    if (m === watched) return;
    if (mo) { mo.disconnect(); mo = null; }
    watched = m;
    if (!m) return;
    mo = new MutationObserver(function () { fit(m); });
    mo.observe(m, { childList: true, subtree: true });
    fit(m);
  }
  function boot() {
    new MutationObserver(watch).observe(document.body, { childList: true });
    g.addEventListener('resize', function () { if (watched) fit(watched); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (watched) fit(watched); });
    watch();
  }

  var api = { LEVELS: LEVELS, MIN_ZOOM: MIN_ZOOM, solve: solve, fit: fit, overflowOf: overflowOf };
  g.ReceiptFit = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (typeof document !== 'undefined' && document.body) boot();
})(typeof window !== 'undefined' ? window : globalThis);
