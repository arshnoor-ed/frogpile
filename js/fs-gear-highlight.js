                                                                        
                                                                           
                                                                           
                                                                             
                                                                             
                                                                            
                                       

                                                                              
                                                                             
                                                                                 
(function (g) {
  'use strict';
                                                   
  var FAMILIES = ['forestSpirit'];
                                                                     
  var PARAMS = {
    lg: { leaves: 12, sparks: 10, far: 150, near: 108 },
    md: { leaves: 8, sparks: 8, far: 78, near: 56 },
    sm: { leaves: 6, sparks: 6, far: 62, near: 44 },
    chimeGapMs: 140
  };

  function isGearSlot(slot) { return slot === 'weapon' || slot === 'shield'; }
  function familyOf(key) { var m = /^set:([^:]+):/.exec(key || ''); return m ? m[1] : null; }
                                                                          
  function is(piece) {
    if (!piece) return false;
    return isGearSlot(piece.slot) && FAMILIES.indexOf(familyOf(piece.key || piece.k)) >= 0;
  }

                                                                            
                                                                    
  function burstHTML(size) {
    var P = PARAMS[size] || PARAMS.md, out = '', i, far;
    for (i = 0; i < P.leaves; i++) {
      far = i % 2 === 0;
      out += '<i class="fsg-leaf" style="--a:' + Math.round(i * 360 / P.leaves + (far ? 0 : 11)) + 'deg;--d:'
        + (far ? P.far : P.near) + 'px;--r:' + ((i * 137) % 360) + 'deg"></i>';
    }
    for (i = 0; i < P.sparks; i++) {
      far = i % 2 === 1;
      out += '<i class="fsg-spark" style="--a:' + Math.round(i * 360 / P.sparks + 22) + 'deg;--d:'
        + Math.round((far ? P.far : P.near) * 0.8) + 'px"></i>';
    }
    return '<span class="fsg-burst fsg-burst--' + (PARAMS[size] ? size : 'md') + '" aria-hidden="true">'
      + '<span class="fsg-rays"></span><span class="fsg-ring"></span><span class="fsg-ring fsg-ring--late"></span>'
      + out + '</span>';
  }
                                                                            
  function glossHTML() { return '<span class="fsg-gloss" aria-hidden="true"></span>'; }
  function ribbonHTML() { return '<span class="fsg-ribbon">Forest Spirit gear</span>'; }

                                                                             
                                          
  var lastChime = 0;
  function chime() {
    var now = Date.now();
    if (now - lastChime < PARAMS.chimeGapMs) return;
    lastChime = now;
    var c = null;
    try { c = typeof g.ac === 'function' ? g.ac() : null; } catch (e) { c = null; }
    if (!c) return;
    var t0 = c.currentTime;
    [0, 4, 7, 12, 16, 19].forEach(function (semi, i) {
      var o = c.createOscillator(), gn = c.createGain(), s = t0 + i * 0.055;
      o.type = i < 4 ? 'triangle' : 'sine';
      o.frequency.value = 659.25 * Math.pow(2, semi / 12);
      o.connect(gn); gn.connect(c.destination);
      gn.gain.setValueAtTime(0, s);
      gn.gain.linearRampToValueAtTime(i < 4 ? 0.18 : 0.12, s + 0.015);
      gn.gain.exponentialRampToValueAtTime(0.001, s + 0.5);
      o.start(s); o.stop(s + 0.52);
    });
  }

  var api = { FAMILIES: FAMILIES, PARAMS: PARAMS, is: is, burstHTML: burstHTML, glossHTML: glossHTML, ribbonHTML: ribbonHTML, chime: chime };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (!g.document) return;
  g.FsGearHighlight = api;
                                                                             
                                                                             
                                                 
  g.document.addEventListener('animationstart', function (e) {
    if (e.animationName === 'fsgRing' || e.animationName === 'fsgRingFade') chime();
  }, true);
})(typeof window !== 'undefined' ? window : globalThis);
