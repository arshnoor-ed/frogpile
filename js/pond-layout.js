                                                                         
                                                                              
                                                       
  
                                                                           
                                                                           
                                                                            
                                                                              
                                                                           
                                                                            
                                                                            
                                                                
                               
  
                                                                             
                                                                            
                                                                            
                                                                             
                                                                          
   
(function (g) {
  'use strict';

  function pointsFor(rows, type, tier) {
    return rows.filter(function (r) {
      return r.type === type && Number(r.min_tier) <= tier;
    }).map(function (r) { return { x: Number(r.x), y: Number(r.y) }; });
  }

  function rectAt(x, y, w, h) {
    return { left: x - w / 2, right: x + w / 2, top: y - h / 2, bottom: y + h / 2 };
  }
  function rectArea(r) { return Math.max(0, r.right - r.left) * Math.max(0, r.bottom - r.top); }
  function overlapArea(a, b) {
    var w = Math.min(a.right, b.right) - Math.max(a.left, b.left);
    var h = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
    return (w > 0 && h > 0) ? w * h : 0;
  }
                                                                              
                                                                      
                                                                       
                                                                          
  function overlapFrac(a, b) {
    var smaller = Math.min(rectArea(a), rectArea(b));
    if (smaller <= 0) return 0;
    return overlapArea(a, b) / smaller;
  }
                                                                               
                           
  function maxOverlapFrac(rect, placedRects) {
    var worst = 0;
    for (var i = 0; i < placedRects.length; i++) {
      var f = overlapFrac(rect, placedRects[i]);
      if (f > worst) worst = f;
    }
    return worst;
  }

                                                                              
                                                                         
                                                                             
                                                                    
                                                                          
                                                      
    
                                                                        
                                                                           
                                            
                                                                       
                                                                     
                                                                           
                                                                       
                                                                            
                                                                         
                                                                          
                                                                         
                                                                            
                                                                          
                                                                     
                                  
                                                                        
                                                    
  function pickFreePoint(candidates, placedRects, footprint, opts) {
    opts = opts || {};
    var rng = opts.rng || Math.random;
    var tolerance = opts.toleranceFrac != null ? opts.toleranceFrac : 0.25;
    var allowFallback = opts.allowFallback !== false;
    if (!candidates || !candidates.length) return null;
    var scored = candidates.map(function (p) {
      var rect = rectAt(p.x, p.y, footprint.w, footprint.h);
      return { point: p, rect: rect, overlap: maxOverlapFrac(rect, placedRects || []) };
    });
    var ok = scored.filter(function (s) { return s.overlap <= tolerance; });
    if (ok.length) return ok[Math.floor(rng() * ok.length) % ok.length].point;
    if (!allowFallback) return null;
                                                                         
                                                                           
                                   
    var best = scored[0];
    for (var i = 1; i < scored.length; i++) if (scored[i].overlap < best.overlap) best = scored[i];
    return best.point;
  }

                                                                        
                                                                           
                                                                             
                                                                           
                                                                         
                                      
  function sortByBottom(items) {
    return (items || []).map(function (x, i) { return { x: x, i: i }; })
      .sort(function (a, b) { return (a.x.bottom - b.x.bottom) || (a.i - b.i); })
      .map(function (p) { return p.x; });
  }

                                                                               
                                                                              
                                                               
                                                 
  function csvField(v) {
    var s = String(v);
    return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  }
  function toCsv(rows) {
    var header = ',[BUILD READ],[BUILD READ],[BUILD READ],[BUILD READ]\n,type,x,y,min_tier\n';
    var body = rows.map(function (r) {
      return [''].concat([r.type, r.x, r.y, r.min_tier].map(csvField)).join(',');
    }).join('\n');
    return header + body + (rows.length ? '\n' : '');
  }

                                                                            
                                                                         
                                                                           
                                                                          
                                
  function filterByTolerance(candidates, placedRects, footprint, toleranceFrac) {
    return (candidates || []).filter(function (p) {
      var rect = rectAt(p.x, p.y, footprint.w, footprint.h);
      return maxOverlapFrac(rect, placedRects || []) <= toleranceFrac;
    });
  }

  var api = {
    pointsFor: pointsFor,
    filterByTolerance: filterByTolerance,
    rectAt: rectAt,
    overlapArea: overlapArea,
    overlapFrac: overlapFrac,
    maxOverlapFrac: maxOverlapFrac,
    pickFreePoint: pickFreePoint,
    sortByBottom: sortByBottom,
    toCsv: toCsv
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  g.PondLayout = api;
  if (!g.document) return;

                                                                     
                                                                            
                                                                        
                                                                          
                                                                            
                                                                            
                                                                            
                                                                         
                                                                         
                                                                              
  function ySortLayer(layer) {
    var pieces = Array.prototype.slice.call(layer.querySelectorAll('.pond-log,.g-rock,.lilypad'));
    var withBottom = sortByBottom(pieces.map(function (el) {
      return { el: el, bottom: el.getBoundingClientRect().bottom };
    }));
    var frag = document.createDocumentFragment();
    withBottom.forEach(function (p) { frag.appendChild(p.el); });
    layer.insertBefore(frag, layer.firstChild);
  }
  api.ySortLayer = ySortLayer;

                                                                     
                                                                         
                                                                             
                                                                            
                                                                       
                                                                          
                                                                           
                                                                          
                                    
                                                                              
                                                                     
                                                                     
                                                                             
                                                                         
                                                                            
  function padFootprints(excludeIndex) {
    var out = [];
    var layer = document.getElementById('frog-layer');
    var lr = layer ? layer.getBoundingClientRect() : null;
    if (typeof state !== 'undefined' && state.lilyPositions && lr) {
      Object.keys(state.lilyPositions).forEach(function (k) {
        if (Number(k) === excludeIndex) return;
        var pos = state.lilyPositions[k];
        if (!pos) return;
        var role = (typeof padRole === 'function') ? padRole(Number(k)) : 'flower';
        var fp = padFootprintPxGeneric(layer, role);
        var x = lr.left + pos.left / 100 * lr.width, y = lr.top + pos.top / 100 * lr.height;
        out.push({ left: x - fp.w / 2, right: x + fp.w / 2, top: y - fp.h / 2, bottom: y + fp.h / 2 });
      });
    }
    return out;
  }
  function nonPadFootprints() {
    var out = [];
    var layer = document.getElementById('frog-layer');
    var lr = layer ? layer.getBoundingClientRect() : null;
    Array.prototype.slice.call(document.querySelectorAll('.pond-log,.g-rock'))
      .filter(function (el) { return el && el.isConnected && getComputedStyle(el).visibility !== 'hidden'; })
      .forEach(function (el) { var r = el.getBoundingClientRect(); if (r.width && r.height) out.push(r); });
    if (typeof POND_SCENE !== 'undefined' && lr && typeof artY === 'function') {
      ['cave', 'pvp'].forEach(function (k) {
        var r = POND_SCENE[k]; if (!r) return;
        out.push({ left: lr.left + r.x0 * lr.width, right: lr.left + r.x1 * lr.width,
          top: lr.top + artY(r.y0) * lr.height, bottom: lr.top + artY(r.y1) * lr.height });
      });
    }
    var dock = document.querySelector('.bottom-dock');
    if (dock && dock.checkVisibility && dock.checkVisibility({ checkVisibilityCSS: true, checkOpacity: true })) {
      var dr = dock.getBoundingClientRect();
      out.push({ left: -1e6, right: 1e6, top: dr.top, bottom: 1e6 });
    }
    return out;
  }
                                                                            
                                                           
  function allPlacedFootprints(excludeIndex) {
    return padFootprints(excludeIndex).concat(nonPadFootprints());
  }
                                                                        
                                                                             
                                                                  
  function padFootprintPxGeneric(layer, role) {
    var lr = layer ? layer.getBoundingClientRect() : null;
    var pondObj = (typeof POND_OBJ !== 'undefined') ? POND_OBJ : 0.56;
    var baseW = (typeof LILYPAD_BASE_W !== 'undefined') ? LILYPAD_BASE_W : 104;
    var baseH = (typeof LILYPAD_BASE_H !== 'undefined') ? LILYPAD_BASE_H : 70;
    var w = baseW * pondObj, h = baseH * pondObj;
    if (role === 'egg') h += h * 0.7 + 30;
    return { w: w, h: h };
  }
  api.allPlacedFootprints = allPlacedFootprints;
  api.padFootprints = padFootprints;
  api.nonPadFootprints = nonPadFootprints;
})(typeof window !== 'undefined' ? window : globalThis);
