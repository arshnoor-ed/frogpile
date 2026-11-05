                                                                              
                                                                             
                                      

                                                                     
                                                                          
                                                                            
                                                                        
                                                                             
                                                                            
                                                               

                                                                              
(function (root) {
  'use strict';

  var PARAMS = {
    rippleSPerPx: 0.0011,                                                      
    rippleMaxS: 0.45,                                                        
  };

                                                                                      
  function delayFor(distancePx) {
    var d = Number(distancePx);
    if (!(d > 0)) return 0;
    return Math.round(Math.min(PARAMS.rippleMaxS, d * PARAMS.rippleSPerPx) * 1000) / 1000;
  }

                                                                            
  function plan(prev, next) {
    var had = {}, want = {}, add = [], remove = [];
    (prev || []).forEach(function (id) { had[id] = true; });
    (next || []).forEach(function (id) { want[id] = true; if (!had[id]) add.push(id); });
    (prev || []).forEach(function (id) { if (!want[id]) remove.push(id); });
    return { add: add, remove: remove };
  }

  var api = { PARAMS: PARAMS, delayFor: delayFor, plan: plan };

  if (typeof window !== 'undefined') {
    var lit = [], heldId = null;

    function spriteEl(id) {
      var s = (typeof wanderingSprites !== 'undefined') && wanderingSprites[id];
      return s && s.el;
    }
    function centre(el) {
      var r = el.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    }

    api.sync = function (frogId) {
      var fresh = heldId !== frogId;
      if (fresh) api.stop();
      heldId = frogId;
      var next = [];
      try { next = (typeof mergePartners === 'function') ? mergePartners(frogId) : []; } catch (e) { next = []; }
      var p = plan(lit, next);
      p.remove.forEach(function (id) { var el = spriteEl(id); if (el) el.classList.remove('merge-hint'); });
      var from = spriteEl(frogId), c = from && centre(from);
      p.add.forEach(function (id) {
        var el = spriteEl(id); if (!el) return;
        var o = centre(el);
        el.style.setProperty('--mh-delay', (fresh && c ? delayFor(Math.hypot(o.x - c.x, o.y - c.y)) : 0) + 's');
        el.classList.add('merge-hint');
      });
                                                                                      
      next.forEach(function (id) { var el = spriteEl(id); if (el && !el.classList.contains('merge-hint')) el.classList.add('merge-hint'); });
      lit = next;
    };

    api.stop = function () {
      lit = []; heldId = null;
      document.querySelectorAll('.merge-hint').forEach(function (el) { el.classList.remove('merge-hint'); });
    };

    window.MergeHint = api;
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(this);
