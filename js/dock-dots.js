                                                                               
                                                                        
                          

                                                                               
                                                                              
                                                                              
                                                                            
                                                                               
                                                                            
                                                                             
                                                                   
                                                                          
                                                                           
                                                                          
                                       

                                                                   
(function (root) {
  'use strict';

                                                                            
                                                                            
  function step(seen, offers, open) {
    var now = (offers || []).filter(function (k, i, a) { return k != null && a.indexOf(k) === i; }).map(String);
    var had = Array.isArray(seen) ? seen : [];
    if (open) {
      var same = had.length === now.length && now.every(function (k) { return had.indexOf(k) >= 0; });
      return { seen: same ? had : now, changed: !same, dot: false };
    }
    return { seen: had, changed: false, dot: now.some(function (k) { return had.indexOf(k) < 0; }) };
  }

  var wasOpen = {};

  function dot(state, menu, offers, open) {
    if (!state) return false;
    var store = state.dockDotSeen = state.dockDotSeen || {};
    var r = step(store[menu], offers, open || !!wasOpen[menu]);
    wasOpen[menu] = !!open;
    if (r.changed) {
      store[menu] = r.seen;
      if (typeof root.queueSave === 'function') root.queueSave();
    }
    return r.dot;
  }

  var api = { step: step, dot: dot, _reset: function () { wasOpen = {}; } };
  if (typeof window !== 'undefined') window.DockDots = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(this);
