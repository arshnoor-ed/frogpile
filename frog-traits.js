                                                                               
                                                        

                                                               

                                                                  
                                                                  
                                                                       
                                                                       

                                                                          
                                                        

                                                                    

                                                              
                                                                              

                                                                               
                                                                                
                                                                                
          

                                                                           
                                                                 

                                                                              
                                                                             
                                               

                                                                                
                                                                        

                                                           
                                                                       
                                                               
                                                                                  
(function (root) {
  'use strict';

  var ART = 'assets/frog2/';

                                                                               

                                                                               
                                                                                  
                                                       
  var MAX_LEVEL = 12;

                                                                               
                                                                             
                                                                
  function xpToReach(n) { return Math.round(5 * Math.pow(n - 1, 1.6)); }

  var LEVEL_XP = [];
  for (var i = 1; i <= MAX_LEVEL; i++) LEVEL_XP[i] = xpToReach(i);

  function levelFromXp(xp) {
    var lv = 1;
    while (lv < MAX_LEVEL && xp >= LEVEL_XP[lv + 1]) lv++;
    return lv;
  }
                                                             
  function levelProgress(xp) {
    var lv = levelFromXp(xp);
    if (lv >= MAX_LEVEL) return 1;
    var a = LEVEL_XP[lv], b = LEVEL_XP[lv + 1];
    return Math.max(0, Math.min(1, (xp - a) / (b - a)));
  }

                                                   
  var MERGE_BONUS = 5;
  function mergeValue(frog) { return (frog.xp || 0) + MERGE_BONUS; }

                                                                                

                                                                                
                                                                               
                                

                                                                              
                                                                             
                                                                             

                                                                           
                                       

                                                                                 
                                                                                   
                                                                                
                                                                                      
  function A(s, x, y) { return { s: s, x: x, y: y }; }
  var IDENT = A(1, 0, 0);

                                                                                 
                                                                                  
                                                                                   
                                                

                                                                              
                                                                              

                                                                                 
                                                                             
                                                                                  
                                                                                  
                                           
                                                                                
                                                                                 
                                                                        
                                                                              
                                                                            
                                                                                
                                                                               
                                                                              
                                                                         
                                                                            
                                                                               
                                                                               
                                                                                 
                                                                            
                                                                               
                                                                                
                                                                             
                                                                                 
                                                                               
                                         
                                                                               
                                                                            
                                                                            
                     
                                                                               
                                                                               
                                                                         
                                                                        
                                                                   
                                                                               
                                                                              
                                             
                                                                             
                                                                               
                                                                                       
                                                                               
                                                                    
                                                                              
                                                                                
                                                                               
                                                                                       
                                                                               
                                                                               
                                                                               
                                                                             
                                                                               
                                                                                 
                                                                                 
                                                                          
                                   
                                                                                       
                                                                                          
                                                        
                                                                                     
                                                                             
                                                                               
                                                                              
                                                                       
                            
                                                                              
                                                                         
  var BODIES = [
                                                                                                                 
                                                                                                               
    { key: 'body_01', name: null, blink: true, gait: 'crawl', disp: 0.770, ox:  0.024, oy: -0.009, famDisp: 0.821, tr: IDENT,
      anchors: { head: A(1, 0.24, -4.3), mouth: A(1, 0, 0.9) } },
    { key: 'body_02', name: null, blink: true, gait: 'leap', disp: 0.749, ox:  0.020, oy:  0.069, famDisp: 0.916, tr: IDENT,
      anchors: { head: A(1, 0.85, -2.89), mouth: A(1, 0, 1.21) },
      idle: 'croak', croak: true },
    { key: 'body_03', name: null, blink: true, gait: 'roll', disp: 1.033, ox: -0.029, oy:  0.002, famDisp: 1.022, tr: IDENT,
      anchors: { head: A(1, 0.62, -2.11), mouth: A(1.3, 0.66, -0.75) },
                                                                                                                 
                                                                                                         
      flop: { eyes: [-3.11, 9.33, 0.999], back: [7.5, 1.41],
        legs: [{ over: false, pivot: [37.34, 64.06], paw: [26.09, 70.31] }, { over: true, pivot: [60.94, 67.5], paw: [78.44, 70.47] },
               { over: false, pivot: [71.88, 62.97], paw: [86.41, 69.22] }] },
      armMove: 'slap', arms: [{ side: 'l', pivot: [33.55, 58.78], hand: [40, 65.94] }, { side: 'r', pivot: [64.28, 59.12], hand: [53.91, 67.34] }] },
    { key: 'body_04', name: null, blink: true, gait: 'waddle', disp: 1.020, ox: -0.029, oy:  0.080, famDisp: 1.140, tr: IDENT,
      anchors: { head: A(1, 0.75, -2.27), mouth: A(1.35, 0.77, -0.79) },
      armMove: 'slap', arms: [{ side: 'l', pivot: [32.54, 59.64], hand: [36.72, 68.91] }, { side: 'r', pivot: [67.26, 60.52], hand: [54.53, 67.19] }],
      idle: 'swing', feet: [{ side: 'l', pivot: [36.06, 67.66], toe: [43.12, 82.34] }, { side: 'r', pivot: [67.26, 70.2], toe: [56.09, 80.62] }] },
    { key: 'body_05', name: null, blink: true, gait: 'stomp', disp: 1.169, ox: -0.034, oy:  0.055, famDisp: 1.272, tr: IDENT,
                                                                                                       
                                                                                                        
                                                                                                                
                                                                                     
      anchors: { head: A(1, 0.92, -2.5), mouth: A(1.35, 0.77, -0.87), weapon: A(1.3, 7.5, -5.4) },
      armMove: 'walk', idle: 'squat', holds: 'l',
      arms: [{ side: 'l', pivot: [34.43, 56.7], hand: [27.34, 67.66], under: true }, { side: 'r', pivot: [70.22, 57.33], hand: [75, 69.53] }] }
  ];
                                                                                
                                                                                
                                                                              
                                    
  function anchorFor(frog, slot) {
    var b = bodyOf(frog);
    if (slot === 'back' && facesUs(b) && BACK_SEAT[b.key]) return BACK_SEAT[b.key];
    if (b.anchors && b.anchors[slot]) return b.anchors[slot];
    return b.tr || IDENT;
  }
                                                                                                        
  function facesUs(b) { return !b.family || !!b.frontal; }
  var MAX_BODY = BODIES.length - 1;

                                                                                    
                                                                              
                                                         
                                                                                
                                                                               
                                                                                
                
                                                                                 
                                                                               
                                                                         
                                                                               
                                                                                  
  var BACK_SEAT = {
    'body_01':               A(0.9, -1.99, -2.24),
    'body_02':               A(0.9, 1.59, 0.8),
    'body_03':               A(0.9, -2.41, -0.34),
    'body_04':               A(0.9, -1.82, 0.86),
    'body_05':               A(0.9, -2.62, 0.55),
    'family_bunny':          A(0.9, -3.67, 0.11),
    'family_forestSpirit':   A(0.9, 2.79, 0.88),
    'family_ice':            A(0.9, -1.71, 0.63),
    'family_lightning':      A(0.9, -2.44, 0.96),
    'family_demon':          A(0.9, -3.78, -0.22),
    'family_mushroom':       A(0.9, -3.31, 0.51),
    'family_pirate':         A(0.9, -3.06, 0.35)
  };
                                                                                  
                                                                                 
                                                                          
                                                                                
                                                                            
                                                                           
  var BACK_NUDGE = {
    'set:pirate:back': [35, 12, 1.25]                                                                                   
  };
                                                                                    
                                                                                           
                                                                                                      
                                                                                                 
                                                                                                  
                                                                      
  var HAND_SEATS = {
    'family_bunny': {
      head: { dx: 0.18, dy: 4.7, k: 1.221 },                
      back: { dx: -4.48, dy: -1.11, k: 1.269 },                
      mouth: { dx: 1.09, dy: 0.84, k: 0.885 }                
    },
    'family_forestSpirit': {
      head: { dx: 4.8, dy: 3.65, k: 1.218 },                    
      back: { dx: 0.22, dy: 3.1, k: 1.091 },                
      mouth: { dx: 0.32, dy: 1.75, k: 0.786 }               
    },
    'family_pirate': {
      head: { dx: -0.75, dy: 2.79, k: 0.941 },                 
      back: { dx: 3.67, dy: -2.64, k: 0.755, r: 15 },                
      mouth: { dx: 0.5, dy: 0.49, k: 0.848 }               
    }
  };
  function handSeat(a, h) {
    var r = function (v) { return Math.round(v * 100) / 100; };
    var o = A(Math.round((a.s || 1) * (h.k || 1) * 1000) / 1000, r((a.x || 0) + (h.dx || 0)), r((a.y || 0) + (h.dy || 0)));
    if (h.r) o.r = h.r;
    if (a.m != null) o.m = a.m;
    return o;
  }
                                                                                                      
                                                                                                   
                                                                                                    
                                                                                                
                                                                                                   
                                                                                               
                                                              
  var BOARD_SEATS = {
    'body_02': {
      'head_02':                [1.275, 4.33, 3.14],                
      'head_04':                [1.317, 1.97, 7.74],              
      'set:forestSpirit:head':  [1.277, 4.7, 0.67],                    
      'set:ice:head':           [1.227, 1.91, -1.93],               
      'set:lightning:head':     [1.191, 2.51, -3.27],                 
      'set:demon:head':         [1.148, 4.81, -0.04],                 
      'set:mushroom:head':      [1.109, 2.71, -1.85],               
      'set:pirate:head':        [1.325, 2.33, 2.56],                 
      'mouth_02':               [1.614, -5.17, -2.71],                
      'set:forestSpirit:mouth': [1.412, -4.47, -2.74],               
      'set:lightning:mouth':    [1.413, -4.54, -1.16],               
      'set:demon:mouth':        [2.001, -5.93, -0.78],                
      'set:mushroom:mouth':     [1.736, -6.22, 0.41],                
      'set:pirate:mouth':       [1.617, -3.54, -1.2],               
      'back_01':                [0.9, 4.62, 6.78],                    
      'back_02':                [1.19, 1.97, -2.36],                
      'back_04':                [1.028, 5.95, 3.19],                  
      'set:forestSpirit:back':  [0.999, 4.09, 3.26],                
      'set:ice:back':           [0.9, 8.55, 2.72],                 
      'set:lightning:back':     [1.066, 2.52, 5.64],                 
      'set:demon:back':         [1.083, 4.12, 4.68],                  
      'set:mushroom:back':      [0.979, 4.34, 0.94],                 
      'set:pirate:back':        [1.261, 0.29, -0.31]                 
    },
    'body_03': {
      'head_02':                [1.027, 2.42, 2.03],                
      'head_04':                [1.144, 2.12, 4.2],              
      'set:forestSpirit:head':  [1.06, 2.01, -0.87],                    
      'set:lightning:head':     [1.013, 4.34, -5.16],                 
      'set:demon:head':         [1, 3.91, -2.34],                 
      'set:pirate:head':        [1.13, 1.09, 0.87],                 
      'mouth_02':               [1.078, -2.68, -0.59],                
      'set:forestSpirit:mouth': [1.118, -3.26, -1.14],               
      'set:ice:mouth':          [1.351, -4.18, -2.09],                
      'set:lightning:mouth':    [1.242, -2.67, -1.13],               
      'set:demon:mouth':        [1.684, -3.57, -2.39],                
      'back_01':                [0.9, 2.91, 3.81],                    
      'back_02':                [1.17, -4.23, 0.89],                
      'back_04':                [0.9, 1.95, 2.66],                  
      'set:forestSpirit:back':  [0.9, 4.06, 5.03],                
      'set:ice:back':           [0.9, 3.08, 0.84],                 
      'set:lightning:back':     [0.9, 2.48, 4.72],                 
      'set:demon:back':         [0.9, 4.24, 4.03],                  
      'set:mushroom:back':      [0.9, 0.94, -0.22],                 
      'set:pirate:back':        [1.125, -5.31, -3.45, 5]                 
    },
    'body_04': {
      'head_02':                [1.17, 3.02, 1.7],                
      'head_04':                [1.144, 2.74, 4.05],              
      'set:forestSpirit:head':  [1.028, 2.14, -1.03],                    
      'set:lightning:head':     [1, 3.13, -4.22],                 
      'set:demon:head':         [1, 3.91, -2.34],                 
      'set:pirate:head':        [1.13, 2.81, 0.25],                 
      'mouth_02':               [1.273, -2.23, -2.7],                
      'set:forestSpirit:mouth': [1.32, -2.31, -3.36],               
      'set:ice:mouth':          [1.351, -3.71, -0.84],                
      'set:lightning:mouth':    [1.242, -2.51, -0.98],               
      'back_02':                [0.9, 4.03, 9.53],                
      'back_04':                [0.9, 6.76, 3.78, 20],                  
      'set:forestSpirit:back':  [1.056, 2.85, 6.12],                
      'set:ice:back':           [0.9, 5.42, 4.28],                 
      'set:lightning:back':     [0.971, 2.25, 6.73],                 
      'set:demon:back':         [1.083, 1.93, 6.4],                  
      'set:mushroom:back':      [1.032, -0.18, 3.6],                 
      'set:pirate:back':        [1.125, -1.43, -0.68, 10]                 
    },
    'body_05': {
      'head_02':                [1.17, 3.33, 1.7],                
      'head_04':                [1.144, 2.74, 4.05],              
      'set:forestSpirit:head':  [1.06, 2.94, -0.87],                    
      'set:lightning:head':     [1, 3.13, -4.84],                 
      'set:demon:head':         [1, 3.91, -2.5],                 
      'set:pirate:head':        [1.13, 2.81, 0.25],                 
      'mouth_02':               [1.273, -3.79, -3.01],                
      'set:forestSpirit:mouth': [1.221, -2.39, -2.88],               
      'set:ice:mouth':          [1.351, -3.25, -0.84],                
      'set:lightning:mouth':    [1.242, -2.05, -1.29],               
      'back_02':                [0.9, 0.44, 9.53],                
      'back_04':                [0.9, 4.13, 2.05, 25],                  
      'set:forestSpirit:back':  [0.9, 2.66, 5.19],                
      'set:ice:back':           [0.9, 3.39, 4.28],                 
      'set:lightning:back':     [0.971, -1.03, 4.23],                 
      'set:demon:back':         [0.9, 4.88, 4.03],                  
      'set:mushroom:back':      [1.032, -3.93, 3.6],                 
      'set:pirate:back':        [1.125, -1.88, -3.88, 10]                 
    }
  };
  function boardSeat(body, key) {
    var v = BOARD_SEATS[body] && BOARD_SEATS[body][key]; if (!v) return null;
    var a = A(v[0], v[1], v[2]); if (v[3]) a.r = v[3];
    return a;
  }
                                                                             
                                                                                 
                                                                               
  var BACK_EDGE = [462.6, 318.4];
  function nudgeBack(a, n) {
    var k = n[2] || 1, s = a.s || 1, tx = (a.x || 0) * 6.4, ty = (a.y || 0) * 6.4;
    var qx = s * (BACK_EDGE[0] - 320) + tx, qy = s * (BACK_EDGE[1] - 320) + ty;                                                      
    var r = function (v) { return Math.round(v / 6.4 * 100) / 100; };
    return A(Math.round(k * s * 1000) / 1000, r((1 - k) * qx + k * tx + n[0]), r((1 - k) * qy + k * ty + n[1]));
  }
                                                                                
                                                                                  
                                                                            
                                                               
  var BACK_MIDLINE = {
    'body_01':               330,
    'body_02':               339,
    'body_03':               335.5,
    'body_04':               336.5,
    'body_05':               335,
    'family_bunny':          330.5,
    'family_forestSpirit':   349,
    'family_ice':            334,
    'family_lightning':      331.5,
    'family_demon':          332,
    'family_mushroom':       332.5,
    'family_pirate':         333.5
  };
  var SHIELD_PALM = {
    'body_01':               null,
    'body_02':               null,
    'body_03':               [55.09, 66.05],
    'body_04':               [56.16, 66.68],
    'body_05':               [74.66, 67.76],
    'family_bunny':          [75.75, 66.12],
    'family_forestSpirit':   [77.15, 67.5],
    'family_ice':            [76.99, 66],
    'family_lightning':      [76.84, 68.98],
    'family_demon':          [74.76, 62.48],
    'family_mushroom':       [75.7, 64.66],
    'family_pirate':         [76.85, 65.3]
  };
  var SHIELD_CENTRE = {
    'shield_01':                 [373, 411],                  
    'shield_02':                 [370, 434.5],                 
    'shield_03':                 [405.5, 419],                  
    'shield_04':                 [364.5, 434.5],             
    'shield_08':                 [369.5, 429],                   
    'set:forestSpirit:shield':   [372.5, 419.5],             
    'set:ice:shield':            [365.5, 446],                 
    'set:lightning:shield':      [358.5, 444],                    
    'set:demon:shield':          [351.5, 431.5],             
    'set:mushroom:shield':       [371, 435],                  
    'set:pirate:shield':         [370, 434],                     
    'set:autumnGrove:shield_01': [367, 434],                    
    'set:autumnGrove:shield_02': [367, 434.5],                  
    'set:mirewood:shield_01':    [367.5, 434.5],                
    'set:mirewood:shield_02':    [367, 434.5],                 
    'set:mirewood:shield_03':    [367, 434.5]                    
  };
                                                                                  
                                                                               
                                                                                  
                                                                                     
                                                                                    
  var WING_FLAP = {
    'back_01':        { root: [458, 356], deg: 9,  ms: 700 },                     
    'back_07':        { root: [409, 350], deg: 12, ms: 1500 },                                
    'back_13':        { root: [459, 346], deg: 14, ms: 1200 },                    
    'back_14':        { root: [409, 350], deg: 12, ms: 1500 },               
    'set:demon:back': { root: [416, 349], deg: 10, ms: 1700 }                   
  };
                                                                                
                                                                            
  function shieldSeat(b, key) {
    var p = facesUs(b) && SHIELD_PALM[b.key], c = SHIELD_CENTRE[key];
    if (!p || !c) return null;
    return A(1, Math.round((p[0] - c[0] / 6.4) * 100) / 100, Math.round((p[1] - c[1] / 6.4) * 100) / 100);
  }
                                                                                      
  function shieldSide(b) { return b.holds === 'r' ? 'l' : 'r'; }
                                                                                
                                                         
  function wingFlap(key, anchor) {
    var w = WING_FLAP[key]; if (!w) return null;
    var a = anchor || IDENT, s = a.s || 1;
    var at = function (v, d) { return Math.round(((320 + s * (v - 320)) / 6.4 + (d || 0)) * 100) / 100; };
    return { origin: [at(w.root[0], a.x), at(w.root[1], a.y)], deg: w.deg, ms: w.ms };
  }

                                                                             

                                                                              

                                                       
                                                     
                                                       
                                                                      

                                                                              
                                                                              
                                                                              

                                                            

                                                                                 
                                                                                 
                                                                              
                                                                               
                                                                                  
  var BODY_STEPS = MAX_BODY;                                                        
  var TRAIT_STEPS = 4;                                                       

                                                                             

                                                                           
                                                                            
                                                                           
                                             

                                    
                              
                              
                                             

                                                                         
                                                                             
                                                                              
                                                                              
                                                                            
                                                                              
                                                                                
  var SAME_BODY_MERGE = true;

                                                      
  var LADDER = [{ body: 0, traits: 0 }];
  (function buildLadder() {
    if (SAME_BODY_MERGE) {
      var n = Math.min(BODY_STEPS, TRAIT_STEPS);
      for (var i = 1; i <= n; i++) LADDER.push({ body: i, traits: i });
      return;
    }
    var b = 0, t = 0, wantTrait = true;
    while (b < BODY_STEPS || t < TRAIT_STEPS) {
      if (wantTrait && t < TRAIT_STEPS) t++;
      else if (b < BODY_STEPS) b++;
      else t++;
      wantTrait = !wantTrait;
      LADDER.push({ body: b, traits: t });
    }
  })();
  var MAX_MERGES = LADDER.length - 1;                           
  function rung(merges) { return LADDER[Math.max(0, Math.min(MAX_MERGES, merges || 0))]; }

                                                                    
  function bodyIndexForMerges(merges) { return rung(merges).body; }
                                                                                        
  function traitsForMerges(merges) { return rung(merges).traits; }
                                                                                      
  function mergeGrowsBody(n) {
    return n > 0 && n <= MAX_MERGES && LADDER[n].body > LADDER[n - 1].body;
  }
                                                                              
  function nextStep(frog) {
    var n = mergesOf(frog) + 1;
    if (n > MAX_MERGES) return null;
    return mergeGrowsBody(n)
      ? { kind: 'body',  n: n, body: BODIES[bodyIndexForMerges(n)] }
      : { kind: 'trait', n: n, index: traitsForMerges(n) };
  }
  function bodyForMerges(merges) { return BODIES[bodyIndexForMerges(merges)]; }
                                                                             
                                                                            
                                                                              
                                                    
  function canMergePair(a, b) {
    if (!a || !b || a === b) return false;
    if (!canMerge(a) || !canMerge(b)) return false;
    if (!SAME_BODY_MERGE) return true;
    return bodyIndexForMerges(mergesOf(a)) === bodyIndexForMerges(mergesOf(b));
  }
  function mergesOf(frog) { return (frog && frog.merges) || 0; }
  function bodyPath(key) { return ART + 'body/' + key + '.png'; }

                                                                              

                                                                          
                                                                              
                                                                             

                                                                               
                                                                            
                                                                               
        

                                                                           
                                                                           
                                                                             
                                                                            
                                                                            
                                                                            
                                                                          
                                                                         
                                         
  var STARTER_FAMILY = 'bunny';
                                                   

                                                                            
                                                                             
                                                                        
                                                                         
                                                                  

                                                                            
                                                                        
                                                                       
                                                                          
                                                                        
                                                                         
                                                                               
                                                                             
                                                                      
                                                             
  var FAMILY_BONUS = 0.25;
                                                                       
                                                                             
                                                             
  var FAMILY_BODY_BONUS = 0.25;
                                                                               
                                                                               
                                                                           
                                           
  var ASCENDED_BODY = { bunny: 'family_bunny_ascended' };
                                                                             
                                                                                
                                                              
  var ASCENDED_TR = { bunny: { s: 0.942, x: 0, y: 0 } };
  var ASCEND_BONUS = 0.25;
  var ASCEND_HIDES = ['head', 'mouth', 'back'];                                 
  function ascendedOf(frog){
    if (!frog || !frog.ascended || !ASCENDED_BODY[frog.ascended]) return null;
    var fam = familyOf(frog);
    return fam && fam.id === frog.ascended ? frog.ascended : null;                                           
  }
                                                                             
                                                                                 
                                                                            
  function ascensionHeldByFtue(){
    return !!(root.FtueSteps && root.FtueSteps.ftueUiActive && root.FtueSteps.ftueUiActive());
  }
  function canAscendPair(a, b){
    if (!a || !b || a === b || ascensionHeldByFtue()) return false;
    var fa = familyOf(a), fb = familyOf(b);
    if (!fa || !fb || fa.id !== fb.id || !ASCENDED_BODY[fa.id]) return false;
    if (a.assimilated !== fa.id || b.assimilated !== fb.id) return false;                                   
    return !a.ascended && !b.ascended;
  }
  var FAMILIES = [
                                                      
                                                                              
                                                                               
                                                                             
                                                                         
                                                                                            
                                                                                 
                                                          
                                                                               
                                                                               
                                                                             
                                                                               
    { id: 'bunny', n: 'Bunny', r: 'uncommon', body: 'family_bunny', frontal: true, disp: 1.216, ox: -0.037, oy: 0.033, grip: [25.78, 64.84],
      anchors: { head: A(1, 0.51, -2.58), mouth: A(1.35, 0.77, -0.63), weapon: A(1.3, 5.94, -8.22) },
      traits: { head: 'head_02', mouth: 'mouth_02', back: 'back_02', aura: 'aura_10' } },
                                                                              
                                                                            
                                                                          
                                                                             
                                                     
    { id: 'catBurglar', n: 'Cat Burglar', r: 'uncommon', body: 'family_catBurglar', tr: { s: 0.927, x: 0, y: 0 }, shop: true,
                                                                          
                                                                          
                                                                             
      anchors: { head: A(1.05, 1.4, 1.2) },
      traits: { head: 'head_04', mouth: 'mouth_11', back: 'back_04', aura: 'aura_07' } },
                                                                          
                                                                                
                                                                                
                                                                             
                                                      
    { id: 'lumberjack', n: 'Lumberjack', r: 'uncommon', body: null, ftue: true, slots: ['head', 'mouth', 'back'],
      traits: { head: 'ftue_lumberjack_head', mouth: 'ftue_lumberjack_mouth', back: 'ftue_lumberjack_back' } }
  ];
  var FTUE_FAMILY = 'bunny';
                                                                          
                                                                            
                                                                  
                                                                                
                                                                                 
                                                                     
                                                                                  
                                                                              
                                         
  var SET_BODIES = {
                                                                                                                                 
    ice:          { body: 'family_ice', frontal: true, disp: 1.153, ox: -0.034, oy: 0.058, grip: [25.16, 64.38],
                    anchors: { head: A(1, 0.79, -2.58), mouth: A(1.35, 0.77, -0.79), weapon: A(1.3, 5.32, -8.68) } },
    mushroom:     { body: 'family_mushroom', frontal: true, disp: 1.207, ox: -0.039, oy: 0.044, grip: [25.31, 63.91],
                    anchors: { head: A(1, 0.89, -2.03), mouth: A(1.35, 0.77, -1.18), weapon: A(1.3, 5.47, -9.15) } },
    pirate:       { body: 'family_pirate', frontal: true, disp: 1.211, ox: -0.030, oy: 0.038, grip: [26.09, 63.75],
                    anchors: { head: A(1, 0.57, -2.42), mouth: A(1.35, 0.77, -0.9), weapon: A(1.3, 6.25, -9.31) } },
    autumnGrove:  { body: 'family_autumnGrove',  tr: { s: 0.955, x: 0, y: 0 } },
    demon:        { body: 'family_demon', frontal: true, disp: 1.312, ox: -0.036, oy: -0.003, grip: [26.72, 62.34],
                    anchors: { head: A(1, 0.25, -1.72), mouth: A(1.35, 0.77, -1.18), weapon: A(1.3, 6.88, -10.72) } },
    forestSpirit: { body: 'family_forestSpirit', frontal: true, disp: 1.105, ox: -0.035, oy: 0.077, grip: [24.53, 66.25],
                    anchors: { head: A(1, 0.57, -2.89), mouth: A(1.35, 0.77, -0.75), weapon: A(1.3, 4.69, -6.81) } },
    lightning:    { body: 'family_lightning', frontal: true, disp: 1.114, ox: -0.039, oy: 0.075, grip: [24.22, 66.72],
                    anchors: { head: A(1, 0.29, -2.81), mouth: A(1.35, 0.77, -0.87), weapon: A(1.3, 4.38, -6.34) } }
  };
  var _famBuilt = false;
  function families() {
    if (!_famBuilt && typeof SETS !== 'undefined' && SETS) {
      _famBuilt = true;
      SETS.forEach(function (s) {
                                                                               
                                                                               
                                                                               
                                                                               
                                                                            
        var t = {};
        SLOTS.forEach(function (slot) {
          var ref = setRef(s, slot);
          var mine = setEntries(slot).filter(function (e) { return e.set === s.id; });
          if (ref) t[slot] = ref;
          else if (mine.length) t[slot] = mine[0].k;
        });
        var sb = SET_BODIES[s.id] || {};
        FAMILIES.push({ id: s.id, n: s.n, r: s.r, body: sb.body || null, tr: sb.tr || null,
                        frontal: !!sb.frontal, disp: sb.disp, ox: sb.ox, oy: sb.oy, grip: sb.grip, anchors: sb.anchors || null,
                        traits: t, set: true });
      });
    }
    return FAMILIES;
  }
  function familyDefOf(id) {
    var F = families();
    for (var i = 0; i < F.length; i++) if (F[i].id === id) return F[i];
    return null;
  }
                                                                            
                                                      
  function familyProgressOn(frog, fam) {
    var slots = (fam && fam.slots) || SLOTS;
    if (!frog || !frog.traits || !fam) return { have: 0, need: slots.length, whole: false };
    var have = 0;
    slots.forEach(function (slot) {
      var want = fam.traits[slot];
      var worn = traitDef(frog.traits[slot]);
      if (want && (frog.traits[slot] === want || (worn && worn.set === fam.id && worn.slot === slot))) have++;
    });
    return { have: have, need: slots.length, whole: have >= slots.length };
  }
                                                                            
  function familyOf(frog) {
    var F = families();
    for (var i = 0; i < F.length; i++) {
      if (familyProgressOn(frog, F[i]).whole) return F[i];
    }
    return null;
  }
                                                                  
  function familyNearest(frog) {
    var best = null, bestHave = 0;
    families().forEach(function (f) {
      var p = familyProgressOn(frog, f);
      if (p.have > bestHave) { bestHave = p.have; best = { fam: f, have: p.have, need: p.need }; }
    });
    return bestHave > 1 ? best : null;                                                      
  }
                                                                         
                                                         
  var _claimed = {};
  function setClaimedFamilies(list) {
    _claimed = {};
    (list || []).forEach(function (id) { _claimed[id] = true; });
  }
  function familyClaimedIn(id) { return !!_claimed[id]; }
                                                                              
                                                                               
                                                                            
                                                                       
                                
  function bodyOf(frog) {
    var fam = familyOf(frog);
    if (fam && fam.body && frog.assimilated !== fam.id) return bodyForMerges(MAX_MERGES);
    if (fam && fam.body) {
      var ladder = bodyForMerges(mergesOf(frog)), asc = ascendedOf(frog);
                                                                                      
      if (fam.frontal && !asc) {
                                                                                  
                                                                               
                                                                                     
        var b5 = BODIES[MAX_BODY];
        return { key: fam.body, name: fam.n, disp: fam.disp * ladder.disp / b5.disp, ox: fam.ox, oy: fam.oy,
                 tr: IDENT, anchors: fam.anchors, grip: fam.grip, family: fam.id, frontal: true, gait: b5.gait, idle: b5.idle };
      }
      return { key: fam.body, name: fam.n, disp: ladder.famDisp || ladder.disp, tr: (asc && ASCENDED_TR[asc]) || fam.tr || ladder.tr,
               anchors: (!asc && fam.anchors) || null, family: fam.id };
    }
    return bodyForMerges(mergesOf(frog));
  }

                                                                                 
                                                                                
                                                                                
                                                                 

                                                                              
                                                                            
  var DISTORT_FRAMES = 5;
  function distortFrames(frog) {
    return isFullyEvolved(frog) ? null : mutateFrames(frog);
  }
                                                                           
                                                                   
                                                          
  function mutateFrames(frog) {
    if (bodyOf(frog).family) return null;
    var key = bodyOf(frog).key, out = [];
    for (var i = 0; i < DISTORT_FRAMES; i++) out.push(ART + 'body/' + key + '_distort/d' + i + '.png');
    return out;
  }
                                                                              
                                                                               
                                               
  function blinkFrames(frog) {
    if (ascendedOf(frog)) return null;
    var b = bodyOf(frog);
    return b.blink ? [ART + 'body/' + b.key + '_blink/b1.png', ART + 'body/' + b.key + '_blink/b2.png'] : null;
  }
                                                                          
  function displayScale(frog) { return bodyOf(frog).disp; }

                                                                              

                                                                               
  function baseStats(level) {
    return {
      atk: 3 + Math.round(level * 1.8),
      def: 2 + Math.round(level * 1.2),
      hp: 14 + level * 6
    };
  }

                                                                              

                                                                          
  var RARITY = {
    common:   { rank: 0, weight: 10, name: 'Common',   tint: '#9fb4ab' },
    uncommon: { rank: 1, weight: 5,  name: 'Uncommon', tint: '#5fd08a' },
    rare:     { rank: 2, weight: 2,  name: 'Rare',     tint: '#5aa8ff' },
    mythic:   { rank: 3, weight: 1,  name: 'Mythic',   tint: '#d18bff' }
  };

                                                                            

                                                                              
                                                             
                                                                              
                                            
    

  var HEAD = [
    { k: 'head_01', n: 'Sprout',        r: 'common',   b: { hp: 4 },
      evo: [{ level: 5, k: 'head_01_evolution01', n: 'Budding Sprout', b: { hp: 9, def: 2 } },
            { level: 10, k: 'head_01_evolution02', n: 'Pond Bloom',     b: { hp: 16, def: 4, atkPct: 0.05 } }] },
    { k: 'head_02', n: 'Bunny Ears',    r: 'common',   b: { def: 2, hp: 3 } },
    { k: 'head_03', n: 'Beach Ball',    r: 'common',   b: { hp: 6 } },
    { k: 'head_04', n: 'Cat Ears',      r: 'common',   b: { atk: 2, def: 1 } },
    { k: 'head_05', n: 'Mushroom Caps', r: 'uncommon', b: { def: 4, hp: 4 } },
    { k: 'head_06', n: 'Moose Antlers', r: 'uncommon', b: { atk: 6 } },
    { k: 'head_07', n: 'Apple',         r: 'common',   b: { hp: 8 } },
    { k: 'head_08', n: 'Star Circlet',  r: 'rare',     b: { def: 6, hp: 10 } },
    { k: 'head_09', n: 'Ox Horns',      r: 'uncommon', b: { atk: 5, def: 2 } },
    { k: 'head_10', n: 'Toast',         r: 'common',   b: { hp: 7 } },
    { k: 'head_11', n: 'Ram Horns',     r: 'rare',     b: { atk: 7, def: 4 } },
    { k: 'head_12', n: 'Sundae',        r: 'uncommon', b: { hp: 12 } },
    { k: 'head_13', n: 'Party Hat',     r: 'common',   b: { atk: 2, def: 2, hp: 2 } },
    { k: 'head_14', n: 'Crown',         r: 'mythic',   b: { atk: 6, def: 6, hp: 12, atkPct: 0.10 } },
    { k: 'head_15', n: 'Dozing Zs',     r: 'uncommon', b: { hp: 14, atk: -2 } }
  ];

  var MOUTH = [
    { k: 'mouth_01', n: 'Lolling Tongue', r: 'common',   b: { hp: 3 } },
    { k: 'mouth_02', n: 'Buck Tooth',     r: 'common',   b: { atk: 2 } },
    { k: 'mouth_03', n: 'Little Fang',    r: 'common',   b: { atk: 3 } },
    { k: 'mouth_04', n: 'Twin Fangs',     r: 'uncommon', b: { atk: 5 } },
    { k: 'mouth_05', n: 'Gasp',           r: 'common',   b: { def: 2 } },
    { k: 'mouth_06', n: 'Smirk',          r: 'common',   b: { def: 2, hp: 2 } },
    { k: 'mouth_07', n: 'Thin Line',      r: 'common',   b: { def: 3 } },
    { k: 'mouth_08', n: 'Red Lips',       r: 'uncommon', b: { def: 4, hp: 4 } },
    { k: 'mouth_09', n: 'Gold Teeth',     r: 'rare',     b: { atk: 4, hpPct: 0.08 } },
    { k: 'mouth_10', n: 'Handlebar',      r: 'uncommon', b: { atk: 3, def: 3 } },
    { k: 'mouth_11', n: 'Pencil Stache',  r: 'common',   b: { atk: 2, def: 1 } },
    { k: 'mouth_12', n: 'Beaver Teeth',   r: 'uncommon', b: { atk: 4, hp: 4 } },
    { k: 'mouth_13', n: 'Big Grin',       r: 'common',   b: { hp: 5 } },
    { k: 'mouth_14', n: 'Open Fangs',     r: 'rare',     b: { atk: 8, def: -2 } },
    { k: 'mouth_15', n: 'Soft Pout',      r: 'common',   b: { hp: 4 } },
                                                                                  
                                                                                 
                                                                                
                                    
    { k: 'mouth_16', n: 'Walrus Stache',  r: 'common',   b: { def: 3 } },
    { k: 'mouth_17', n: 'Fanged Yawn',    r: 'uncommon', b: { atk: 5, hp: 2 } },
    { k: 'mouth_18', n: 'Picket Teeth',   r: 'uncommon', b: { atk: 4, def: 3 } },
    { k: 'mouth_19', n: 'Wide Gape',      r: 'uncommon', b: { atk: 6, def: -1 } },
    { k: 'mouth_20', n: 'Horse Teeth',    r: 'common',   b: { hp: 6 } },
    { k: 'mouth_21', n: 'Needle Row',     r: 'rare',     b: { atk: 9 } },
    { k: 'mouth_22', n: 'Beak',           r: 'rare',     b: { atk: 7, def: 3 } },
    { k: 'mouth_23', n: 'Crimson Maw',    r: 'rare',     b: { atk: 10, hp: -3 } },
    { k: 'mouth_24', n: 'Snaggletooth',   r: 'common',   b: { atk: 3 } },
    { k: 'mouth_25', n: 'Deep Gullet',    r: 'uncommon', b: { atk: 6, hp: 3 } },
    { k: 'mouth_26', n: 'Dark Lip',       r: 'common',   b: { def: 3, hp: 2 } },
    { k: 'mouth_27', n: 'Bared Teeth',    r: 'uncommon', b: { atk: 5, def: 2 } },
    { k: 'mouth_28', n: 'Jagged Smile',   r: 'rare',     b: { atk: 8, def: 2 } },
    { k: 'mouth_29', n: 'Tiny Frown',     r: 'common',   b: { def: 2 } },
    { k: 'mouth_30', n: 'Quiet Gap',      r: 'common',   b: { hp: 4 } },
    { k: 'mouth_31', n: 'Single Tooth',   r: 'common',   b: { atk: 2, hp: 2 } },
    { k: 'mouth_32', n: 'Soot Smudge',    r: 'common',   b: { def: 3 } },
    { k: 'mouth_33', n: 'Red Tongue',     r: 'uncommon', b: { hp: 8 } },
    { k: 'mouth_34', n: 'Howling Jaw',    r: 'mythic',   b: { atk: 12, def: 4, hp: -4 } },
    { k: 'mouth_35', n: 'Sabre Bite',     r: 'rare',     b: { atk: 9, def: 3 } },
    { k: 'mouth_36', n: 'Lolling Maw',    r: 'uncommon', b: { atk: 5, hp: 5 } },
    { k: 'mouth_37', n: 'Thin Smirk',     r: 'common',   b: { def: 2, hp: 2 } },
    { k: 'mouth_38', n: 'Small Yawn',     r: 'common',   b: { hp: 5 } },
    { k: 'mouth_39', n: 'Shy Line',       r: 'common',   b: { def: 3 } },
    { k: 'mouth_40', n: 'Open Croak',     r: 'uncommon', b: { atk: 4, hp: 4 } },
    { k: 'mouth_41', n: 'Fly Snack',      r: 'rare',     b: { hp: 12, atk: 3 } },
    { k: 'mouth_42', n: 'Drool',          r: 'common',   b: { hp: 6, def: -1 } },
    { k: 'mouth_43', n: 'Clean Gape',     r: 'common',   b: { atk: 3, hp: 2 } },
    { k: 'mouth_44', n: 'Rust Lips',      r: 'uncommon', b: { def: 5, hp: 3 } },
    { k: 'mouth_45', n: 'Pink Lips',      r: 'uncommon', b: { def: 4, hp: 5 } },
    { k: 'mouth_46', n: 'Cyan Lips',      r: 'uncommon', b: { def: 6, hp: 2 } },
    { k: 'mouth_47', n: 'Violet Lips',    r: 'rare',     b: { def: 6, hp: 6 } },
    { k: 'mouth_48', n: 'Bandit Stache',  r: 'common',   b: { atk: 3, def: 2 } },
    { k: 'mouth_49', n: 'Little Tongue',  r: 'common',   b: { hp: 4 } },
    { k: 'mouth_50', n: 'Split Lip',      r: 'uncommon', b: { atk: 5, def: 2 } }
  ];

                                                                                
                                                               
                                                                          
                                                                              
                                                                                

                                                                            
                                                                              
                                                                            
                                                                        
                                                                          
                                               
  var MOUTH_SEAT = {
    'mouth_01':                A(1.0000,  -3.17,    0.4),                    
    'mouth_02':                A(1.0000,  -3.37,   -0.2),                
    'mouth_03':                A(1.0000,  -1.98,   1.39),                 
    'mouth_04':                A(1.0000,  -2.97,      0),                
    'mouth_05':                A(1.0000,  -2.38,   -0.4),          
    'mouth_06':                A(1.1025,  -3.21,   0.66),           
    'mouth_07':                A(1.1025,  -2.92,  -0.65),               
    'mouth_08':                A(1.0000,  -3.37,  -0.59),              
    'mouth_09':                A(1.1209,  -2.34,  -1.57),                
    'mouth_10':                A(1.0000,  -2.18,   -0.2),               
    'mouth_11':                A(1.0000,  -3.76,   -0.2),                   
    'mouth_12':                A(1.2495,  -2.53,   -0.4),                  
    'mouth_13':                A(1.0612,  -2.06,  -1.13),              
    'mouth_14':                A(1.2817,  -3.56,  -0.21),                
    'mouth_15':                A(1.2311,  -4.09,  -1.28),               
    'mouth_16':                A(0.8682,  -3.58,  -0.15),                   
    'mouth_17':                A(0.8315,  -2.33,    0.1),                 
    'mouth_18':                A(0.7993,  -2.09,   0.89),                  
    'mouth_19':                A(0.7855,  -5.24,   3.36),               
    'mouth_20':                A(0.8544,  -2.25,   0.62),                 
    'mouth_21':                A(0.7166,  -1.39,   2.01),                
    'mouth_22':                A(0.8544,  -5.54,  -0.26),          
    'mouth_23':                A(0.6615,  -2.81,   3.97),                 
    'mouth_24':                A(0.7809,  -3.07,    2.2),                  
    'mouth_25':                A(0.7534,  -3.22,   3.56),                 
    'mouth_26':                A(0.7258,  -3.38,   1.56),              
    'mouth_27':                A(0.7120,  -3.41,   2.63),                 
    'mouth_28':                A(0.7894,  -2.36,   1.47),                  
    'mouth_29':                A(0.8544,  -5.41,    3.5),                
    'mouth_30':                A(1.0000,  -3.24,      0),               
    'mouth_31':                A(1.0000,  -3.24,   1.35),                  
    'mouth_32':                A(1.0000,  -3.24,   1.35),                 
    'mouth_33':                A(0.7488,  -5.39,   4.98),                
    'mouth_34':                A(1.0000,  -3.37,   0.99),                 
    'mouth_35':                A(1.0000,  -1.78,   4.16),                
    'mouth_36':                A(0.9004,  -3.62,  -1.34),                 
    'mouth_38':                A(1.0000,  -2.97,    0.4),                
    'mouth_39':                A(0.8269,  -2.92,  -1.07),              
    'mouth_40':                A(0.7166,  -2.97,   0.82),                
    'mouth_41':                A(0.9142,  -2.85,  -0.24),               
    'mouth_42':                A(1.0000,  -3.37,  -0.59),           
    'mouth_43':                A(0.8269,  -3.68,   1.11),                
    'mouth_44':                A(0.8085,   -3.3,   1.02),               
    'mouth_45':                A(0.8866,  -3.01,   0.73),               
    'mouth_46':                A(0.8315,  -1.35,   0.29),               
    'mouth_47':                A(0.8820,  -1.52,   0.38),                 
    'mouth_48':                A(0.8866,  -2.22,   0.33),                   
    'mouth_49':                A(0.8912,  -2.42,    0.7),                   
    'mouth_50':                A(0.8407,   0.22,   1.02),               
    'ftue_lumberjack_mouth':   A(0.8223,  -0.48,   1.32),                  
    'set:forestSpirit:mouth':  A(1.0000,  -2.54,      0),               
    'set:ice:mouth':           A(1.3506,  -3.51,  -1.13),                
    'set:lightning:mouth':     A(1.0000,  -2.54,  -0.32),               
    'set:demon:mouth':         A(1.2954,   -3.4,  -0.08),                
    'set:mushroom:mouth':      A(1.0000,  -3.02,   0.48),                
    'set:pirate:mouth':        A(1.1025,  -1.65,  -0.46)                
  };
                                                                             
                                                                              
                                                                           
                                                                             
                                                                       
                                                                          
                                                                              
                                                                                 
                                                                             
                                                         
                                                                               
  var HEAD_CENTRE = {
    'head_01':                    315.5,                                                 
    'head_01_evolution01':        310.5,                               
    'head_01_evolution02':        314,                             
    'head_02':                    320.5,                
    'head_03':                    322,                  
    'head_04':                    321.5,              
    'head_05':                    329,                     
    'head_06':                    331.5,                   
    'head_07':                    321,             
    'head_08':                    320,                    
    'head_09':                    319,                
    'head_10':                    324,             
    'head_11':                    328,                 
    'head_12':                    332,              
    'head_13':                    325.5,               
    'head_14':                    333.5,           
    'head_15':                    331,                 
    'set:forestSpirit:head':      330,                      
    'set:ice:head':               325.5,               
    'set:lightning:head':         345,                   
    'set:demon:head':             323,                   
    'set:mushroom:head':          326,                 
    'set:pirate:head':            329.5,                                                                 
    'set:autumnGrove:head_01':    328.5,                  
    'set:autumnGrove:head_02':    327.5,               
    'set:mirewood:head_01':       328.5,                     
    'set:mirewood:head_02':       328.5,                   
    'ftue_lumberjack_head':       350                      
  };
  var RIG_EYE_X = 326.4;                                                                             
  function headSeat(key) {
    var c = HEAD_CENTRE[key];
    return c == null ? null : A(1, Math.round((RIG_EYE_X - c) / 6.4 * 100) / 100, 0);
  }

                                                                          
                                                                             
                                                                           
                                    
  function seatedAnchor(bodyAnchor, key, ladder) {
    var seat = MOUTH_SEAT[key] || (ladder ? headSeat(key) : null);
    if (!seat) return bodyAnchor;
    var b = bodyAnchor || IDENT;
    return A(b.s * seat.s, (b.x || 0) + b.s * seat.x, (b.y || 0) + b.s * seat.y);
  }

                                                                              
  var BACK = [
    { k: 'back_01', n: 'Dragonfly Wing', r: 'uncommon', b: { atk: 5, hp: 6 } },
    { k: 'back_02', n: 'Steam Vent',     r: 'common',   b: { def: 5 } },
    { k: 'back_03', n: 'Windup Key',     r: 'uncommon', b: { atk: 7 } },
    { k: 'back_04', n: 'Black Banner',   r: 'rare',     b: { atk: 9, def: 4 } },
    { k: 'back_05', n: 'Ivy Sprigs',     r: 'common',   b: { hp: 10 } },
    { k: 'back_06', n: 'Snail Shell',    r: 'uncommon', b: { def: 9, atk: -2 } },
    { k: 'back_07', n: 'Pale Banner',    r: 'uncommon', b: { def: 6, hp: 6 } },
    { k: 'back_08', n: 'Blue Fin',       r: 'uncommon', b: { def: 7, hp: 5 } },
    { k: 'back_09', n: 'Ember Fin',      r: 'rare',     b: { atk: 10, hp: 4 } },
    { k: 'back_10', n: 'Live Plug',      r: 'rare',     b: { atk: 8, atkPct: 0.08 } },
    { k: 'back_11', n: 'Quill',          r: 'common',   b: { def: 4, hp: 4 } },
    { k: 'back_12', n: 'Silk Ribbon',    r: 'uncommon', b: { hp: 12 } },
    { k: 'back_13', n: 'Butterfly Wing', r: 'rare',     b: { atk: 6, def: 6, hp: 8 } },
    { k: 'back_14', n: 'Crow Wing',      r: 'rare',     b: { atk: 11 } },
    { k: 'back_15', n: 'Bare Nub',       r: 'common',   b: { hp: 6 } }
  ];

                                                                      
                                                                               
                                                                               
                                                                              
                                                                                

                                                                             
                                                                               
                                                            

                                                         
  var AURA = [
    { k: 'aura_01', n: 'Fume',        r: 'rare',     f: 3, b: { atk: 10, hp: 10 } },
    { k: 'aura_02', n: 'Tidewash',    r: 'rare',     f: 7, b: { def: 12, hp: 10 } },
    { k: 'aura_03', n: 'Dim Halo',    r: 'uncommon', f: 2, b: { def: 8, hp: 8 } },
    { k: 'aura_04', n: 'Cinderfall',  r: 'rare',     f: 3, b: { atk: 12, def: 4 } },
    { k: 'aura_05', n: 'Mirebloom',   r: 'rare',     f: 5, b: { hp: 22 } },
    { k: 'aura_06', n: 'Stormring',   r: 'mythic',   f: 4, b: { atk: 16, atkPct: 0.10 } },
    { k: 'aura_07', n: 'Gloamlight',  r: 'rare',     f: 5, b: { def: 10, hp: 12 } },
    { k: 'aura_09', n: 'Frostveil',   r: 'rare',     f: 4, b: { def: 14, hp: 6 } },
    { k: 'aura_10', n: 'Sunmote',     r: 'rare',     f: 4, b: { atk: 8, def: 8, hp: 8 } },
    { k: 'aura_11', n: 'Duskmoth',    r: 'uncommon', f: 3, b: { atk: 7, hp: 10 } },
    { k: 'aura_13', n: 'Hexcircle',   r: 'mythic',   f: 6, b: { atk: 14, def: 10, atkPct: 0.08 } },
    { k: 'aura_14', n: 'Starfall',    r: 'mythic',   f: 8, b: { atk: 12, def: 12, hp: 18 } },
    { k: 'aura_15', n: 'Bogbreath',   r: 'rare',     f: 5, b: { hp: 24, def: 4 } },
    { k: 'aura_16', n: 'Ashcloud',    r: 'rare',     f: 5, b: { atk: 13, hp: -4 } },
    { k: 'aura_17', n: 'Auroral',     r: 'mythic',   f: 8, b: { def: 14, hp: 20, defPct: 0.10 } },
    { k: 'aura_18', n: 'Lanternfly',  r: 'rare',     f: 5, b: { atk: 9, hp: 12 } },
    { k: 'aura_19', n: 'Voidhum',     r: 'mythic',   f: 7, b: { atk: 18, def: 8, hpPct: 0.08 } },
    { k: 'aura_20', n: 'Spiritflame', r: 'mythic',   f: 6, b: { atk: 15, def: 12, hp: 16 } },
    { k: 'aura_21', n: 'Deepcurrent', r: 'mythic',   f: 7, b: { def: 18, hp: 22, defPct: 0.10 } }
  ];
                                                                                   
  function auraPieces(key) {
    var t = INDEX[key];
    if (!t || !t.f) return [];
    var out = [];
    for (var i = 0; i < t.f; i++) out.push(ART + 'aura/' + key + '/f' + i + '.png');
    return out;
  }

                                                                         

                                    
                                           
                                     
                                         
                                          
                                              
                                               
                                                               
                                                                                
                                                                              
                                                                              
                                                                                

                                                                                
                                                                        
                                                                    

                                                                               
                                                                                  
  var AURA_MOTION_DEFAULT = 'breathe 6';
  var AURA_MOTION = {
                                                                           
                                                                                
                                      

                                                                                
                                                                            
                                                                               
                                                                         
    'aura_01': [
      'emit 4.3 0',                                         
      'emit 5.7 1.9',                                     
      'emit 4.9 3.4'                                            
    ],

                                                                                 
                                                                              
                                                               

                                                                               
                                                                        
    'aura_03': ['shatter 3.6 0', 'shatter 3.6 0'],

                                            
    'aura_04': ['orbit 7.4 0', 'orbit 9.1 1.3', 'orbit 8.2 2.9'],

                                                             
    'aura_05': ['hover 3.4 0', 'pop 3.1 .5', 'pop 3.7 1.6', 'pop 3.3 2.4', 'pop 4.1 .9'],

                                                         
    'aura_06': ['spinFade 6.3 0', 'spinFade 7.1 1.7', 'spinFade 6.7 3.2', 'spinFade 7.6 4.4'],

                               
    'aura_07': ['twinkle 2.6 0', 'twinkle 3.1 .7', 'twinkle 2.9 1.5', 'twinkle 3.4 2.1', 'twinkle 2.4 1.1'],

                                                         
    'aura_09': ['seq', 'seq', 'seq', 'seq'],

                                                
    'aura_10': ['spin 9.5 0', 'spin 11.2 0', 'spin 8.7 0', 'spin 10.4 0'],

                                                                           
    'aura_11': ['seq', 'seq', 'seq'],

                                                          
    'aura_13': ['pop 2.8 0', 'pop 3.2 .6', 'pop 2.6 1.2', 'pop 3.5 1.9', 'pop 3.0 2.5', 'pop 2.9 .3'],

                                                                            
    'aura_14': ['hover 3.8 0', 'fall 1.9 0', 'fall 2.2 .4', 'fall 1.7 .9',
                'fall 2.4 1.3', 'fall 1.8 .6', 'fall 2.1 1.6', 'fall 2.3 .2'],

                                                     
    'aura_15': ['blowW 4.4 0', 'blowW 5.2 1.1', 'blowW 4.8 2.3', 'blowW 5.6 3.1', 'blowW 4.1 1.7'],

                                         
    'aura_17': ['fall 2.0 0', 'fall 2.3 .5', 'fall 1.8 1.0', 'fall 2.5 1.4',
                'fall 2.1 .3', 'fall 1.9 1.7', 'fall 2.4 .8', 'fall 2.2 1.2'],

                                                    
    'aura_18': ['orbit 6.2 0', 'orbit 7.8 1.4', 'orbit 6.9 2.7', 'orbit 8.4 .8', 'orbit 7.3 3.5'],

                                                                                
    'aura_19': ['rock 5.2 0', 'twinkle 2.7 .4', 'twinkle 3.3 1.1', 'twinkle 2.5 1.8',
                'twinkle 3.6 .9', 'twinkle 2.9 2.4', 'twinkle 3.1 1.5'],

                                                                              
                                                                                 
                                                                                 
                                                                
    'aura_20': ['blowSE 4.6 0', 'blowSE 5.4 1.2', 'blowSE 4.2 2.4',
                'blowSE 5.9 3.3', 'blowSE 4.9 1.8',
                'hide'],                                                         

                                                     
    'aura_21': ['rise 3.4 0', 'rise 4.1 .7', 'rise 3.7 1.5', 'rise 4.4 2.2',
                'rise 3.2 .4', 'rise 4.0 1.9', 'rise 3.9 2.7']
  };
  function auraMotion(key, i) {
    var m = AURA_MOTION[key];
    return (m && m[i]) || AURA_MOTION_DEFAULT;
  }

                                                                             
                                                                             
                                                                              
                                                                             
                                                                              

  var SETS = [
    { id: 'forestSpirit', n: 'Forest Spirit', r: 'rare',
      pieces: { head: { n: 'Branch Antlers', b: { atk: 8, hp: 8 } },
                mouth: { n: 'Leaf Bite',     b: { def: 6, hp: 6 } },
                back: { n: 'Great Leaf',     b: { def: 10, hp: 12 } },
                aura: { n: 'Spirit Flame',   b: { atk: 10, def: 10, hp: 24, hpPct: 0.12 } },
                weapon: { w: { atk: 3, hp: 2 } },
                shield: { w: { def: 3, hp: 2 } } } },
    { id: 'ice', n: 'Frostbound', r: 'rare',
      pieces: { head: { n: 'Ice Crown',   b: { def: 10, hp: 6 } },
                mouth: { n: 'Frost Bite', b: { atk: 7, def: 3 } },
                back: { n: 'Glacier Fin', b: { def: 14 } },
                aura: { n: 'Cold Snap',   b: { def: 16, hp: 20, defPct: 0.12 } },
                weapon: { w: { atk: 4, def: 1 } },
                shield: { w: { def: 4, hp: 1 } } } },
    { id: 'lightning', n: 'Stormcalled', r: 'rare',
      pieces: { head: { n: 'Storm Horns', b: { atk: 12 } },
                mouth: { n: 'Spark Jaw',  b: { atk: 9 } },
                back: { n: 'Thunder Fin', b: { atk: 14, hp: -4 } },
                aura: { n: 'Storm Front', b: { atk: 20, atkPct: 0.15 } },
                weapon: { w: { atk: 1 } },
                shield: { w: { def: 2, atk: 1 } } } },
    { id: 'demon', n: 'Hollowborn', r: 'mythic',
      pieces: { head: { n: 'Demon Horns',  b: { atk: 14, def: 4 } },
                mouth: { n: 'Hungry Maw',  b: { atk: 12, hp: -6 } },
                back: { n: 'Hollow Wings', b: { atk: 16, def: 6 } },
                aura: { n: 'Hollow Fire',  b: { atk: 24, def: 12, atkPct: 0.18 } },
                weapon: { w: { atk: 4, hp: -1 } },
                shield: { w: { def: 3, hp: 2 } } } },
    { id: 'mushroom', n: 'Sporekin', r: 'uncommon',
      pieces: { head: { n: 'Spore Cap',   b: { hp: 16 } },
                mouth: { n: 'Spore Puff', b: { hp: 10, def: 4 } },
                back: { n: 'Shelf Fungi', b: { def: 8, hp: 14 } },
                aura: { n: 'Spore Cloud', b: { def: 10, hp: 30, hpPct: 0.14 } },
                weapon: { w: { atk: 2, hp: 3 } },
                shield: { w: { def: 2, hp: 3 } } } },
    { id: 'pirate', n: 'Pond Corsair', r: 'rare',
      pieces: { head: { n: 'Corsair Hat', b: { atk: 9, def: 5 } },
                mouth: { n: 'Gold Grin',  b: { atk: 6, hp: 8 } },
                back: { n: 'Jolly Flag',  b: { atk: 11, def: 5 } },
                aura: { n: 'Black Tide',  b: { atk: 16, def: 10, atkPct: 0.12 } },
                weapon: { w: { atk: 4, def: 1 } },
                shield: { w: { def: 3, atk: 1 } } } },
                                                                                
    { id: 'autumnGrove', n: 'Autumn Grove', r: 'uncommon',
      pieces: { mouth: { n: 'Autumn Grove Mouth', sheetId: 'autumn_grove_mouth', pending: true },
                aura: { n: 'Autumn Grove Aura', sheetId: 'autumn_grove_aura', pending: true },
                head: { n: 'Autumn Crown', b: { def: 6, hp: 10 }, file: 'head_01' },
                head2: { n: 'Acorn Cap',   b: { hp: 14 }, file: 'head_02', slot: 'head' },
                back: { n: 'Autumn Fronds', b: { def: 7, hp: 12 }, file: 'back_01' },
                back2: { n: 'Fallen Bough', b: { atk: 9, hp: 6 }, file: 'back_02', slot: 'back' },
                weapon: { w: { atk: 3, hp: 2 }, file: 'weapon_01' },
                weapon2: { w: { atk: 1 }, file: 'weapon_02', slot: 'weapon' },
                shield: { w: { def: 3, hp: 2 }, file: 'shield_01' },
                shield2: { w: { def: 4, hp: 1 }, file: 'shield_02', slot: 'shield' } } },
                                                                         
                                                                       
                                                                               
                                                                              
                                                                  
    { id: 'mirewood', n: 'Mirewood', r: 'uncommon',
      pieces: { head: { n: 'Bramble Circlet', b: { def: 6, hp: 10 }, file: 'head_01' },
                mouth: { ref: 'mouth_22' },
                aura: { n: 'Mirewood Aura', sheetId: 'mirewood_aura', pending: true },
                back: { n: 'Bog Leaves',      b: { def: 7, hp: 12 }, file: 'back_01' },
                weapon: { w: { atk: 3, hp: 2 }, file: 'weapon_01' },
                shield: { w: { def: 3, hp: 2 }, file: 'shield_01' } },
                                                                          
                                                                         
                                                                   
                                
      retired: { head2: { n: 'Cattail Crest',  b: { atk: 8, hp: 6 }, file: 'head_02', slot: 'head' },
                 back2: { n: 'Moss Stone',     b: { def: 10, hp: 8 }, file: 'back_02', slot: 'back' },
                 weapon2: { w: { atk: 2, hp: 3 }, file: 'weapon_02', slot: 'weapon' },
                 shield2: { w: { def: 4, hp: 1 }, file: 'shield_02', slot: 'shield' },
                 shield3: { w: { def: 4, hp: 2 }, file: 'shield_03', slot: 'shield' } } }
  ];

                                                                                
                                                                                 
  var SHEET_TRAIT_KEYS = {
    "forest_spirit_head": "set:forestSpirit:head",
    "forest_spirit_mouth": "set:forestSpirit:mouth",
    "forest_spirit_back": "set:forestSpirit:back",
    "forest_spirit_aura": "set:forestSpirit:aura",
    "frostbound_head": "set:ice:head",
    "frostbound_mouth": "set:ice:mouth",
    "frostbound_back": "set:ice:back",
    "frostbound_aura": "set:ice:aura",
    "stormcalled_head": "set:lightning:head",
    "stormcalled_mouth": "set:lightning:mouth",
    "stormcalled_back": "set:lightning:back",
    "stormcalled_aura": "set:lightning:aura",
    "hollowborn_head": "set:demon:head",
    "hollowborn_mouth": "set:demon:mouth",
    "hollowborn_back": "set:demon:back",
    "hollowborn_aura": "set:demon:aura",
    "sporekin_head": "set:mushroom:head",
    "sporekin_mouth": "set:mushroom:mouth",
    "sporekin_back": "set:mushroom:back",
    "sporekin_aura": "set:mushroom:aura",
    "pond_corsair_head": "set:pirate:head",
    "pond_corsair_mouth": "set:pirate:mouth",
    "pond_corsair_back": "set:pirate:back",
    "pond_corsair_aura": "set:pirate:aura",
    "mirewood_head": "set:mirewood:head_01",
    "mirewood_mouth": "mouth_22",
    "mirewood_back": "set:mirewood:back_01",
    "mirewood_aura": "set:mirewood:aura",
    "autumn_grove_head": "set:autumnGrove:head_01",
    "autumn_grove_head2": "set:autumnGrove:head_02",
    "autumn_grove_mouth": "set:autumnGrove:mouth",
    "autumn_grove_back": "set:autumnGrove:back_01",
    "autumn_grove_back2": "set:autumnGrove:back_02",
    "autumn_grove_aura": "set:autumnGrove:aura"
};
  function traitForSheetId(id) {
    var key = SHEET_TRAIT_KEYS[id], t = key && traitDef(key);
    if (!t) throw new Error('[FrogTraits] unknown trait_id "' + id + '" (no catalogue mapping)');
    return t;
  }

                                                                               
  function setEntry(s, p, pieceSlot) {
    var entry = {
      k: 'set:' + s.id + ':' + (p.file || pieceSlot),
                                                                           
      n: p.n, r: s.r, set: s.id, setName: s.n, slot: pieceSlot,
                                                                         
                                                                         
                                                                      
      b: p.w ? gearBoost(s.r, p.w, true, pieceSlot) : p.b,
      sheetId: p.sheetId,
      path: p.pending ? 'assets/traits/pending/' + p.sheetId + '.svg' : ART + 'sets/' + s.id + '/' + (p.file || pieceSlot) + '.png'
    };
    return pieceSlot === 'weapon' || pieceSlot === 'shield' ? namedGear(entry) : entry;
  }
                                                                          
                                                                      
                                                                      
  function setEntries(slot) {
    var out = [];
    SETS.forEach(function (s) {
      Object.keys(s.pieces).forEach(function (pk) {
        var p = s.pieces[pk], pieceSlot = p.slot || pk;
        if (pieceSlot === slot && !p.ref) out.push(setEntry(s, p, pieceSlot));
      });
    });
    return out;
  }
                                                             
  function setRef(s, slot) {
    var keys = Object.keys(s.pieces);
    for (var i = 0; i < keys.length; i++) {
      var p = s.pieces[keys[i]];
      if (p.ref && (p.slot || keys[i]) === slot) return p.ref;
    }
    return null;
  }
                                                                           
                                                                               
                                                                   
  function retiredSetEntries(slot) {
    var out = [];
    SETS.forEach(function (s) {
      Object.keys(s.retired || {}).forEach(function (pk) {
        var p = s.retired[pk], pieceSlot = p.slot || pk;
        if (pieceSlot !== slot) return;
        var e = setEntry(s, p, pieceSlot);
        delete e.set; delete e.setName; e.retired = true;
        out.push(e);
      });
    });
    return out;
  }

                                                                             

                                                                              
                                                                             
                                                                              
                                         

                                                                               
                                                                                
                                                                            
                                                                            
                                                                          

                                                                                
                                                                           
                                                                              
                                                                                

  var GEAR_BUDGET = {                                                    
    common:   22,
    uncommon: 32,
    rare:     45,
    mythic:   62
  };
                                                                               
                                                                         
                                                                            
                           
  var SHIELD_BUDGET_BONUS = 1.35;
                                                                            
                                                                       
  var GEAR_SET_BONUS = 1.25;
                                                                               
                                                                              
                                                      
  var DRAWBACK_PAYBACK = 0.6;

                                                                               
                                                                       
  function gearBoost(rarity, w, isSet, slot) {
    var budget = (GEAR_BUDGET[rarity] || GEAR_BUDGET.common) * (isSet ? GEAR_SET_BONUS : 1);
    if (slot === 'shield') budget *= SHIELD_BUDGET_BONUS;
    var keys = ['atk', 'def', 'hp'], mass = 0, raw = {}, pos = 0, penalty = 0, i, k, share;
    for (i = 0; i < keys.length; i++) mass += Math.abs(w[keys[i]] || 0);
    if (!mass) return {};
    for (i = 0; i < keys.length; i++) {
      k = keys[i];
      share = (w[k] || 0) / mass * budget;
      raw[k] = share;
      if (share < 0) penalty -= share; else pos += share;
    }
    if (penalty && pos) {                                                         
      var back = penalty * DRAWBACK_PAYBACK;
      for (i = 0; i < keys.length; i++) { k = keys[i]; if (raw[k] > 0) raw[k] += back * raw[k] / pos; }
    }
    var b = {};
    for (i = 0; i < keys.length; i++) {
      k = keys[i];
      var pct = Math.round(raw[k]) / 100;                                          
      if (pct) b[k + 'Pct'] = pct;
    }
    return b;
  }
                                                                          
                                                                        
  function namedGear(entry) {
    return Object.defineProperty(entry,'n',{enumerable:true,get:function(){
      if(!root.Equipment)throw new Error('[Equipment] Missing catalogue for gear display_name');
      var itemId=root.Equipment.itemForPiece(entry.k);
      if(!itemId)throw new Error('[Equipment] No catalogue item for gear '+entry.k);
      return root.Equipment.displayName(root.Equipment.itemRow(itemId));
    }});
  }
  function gearPiece(k, r, w, slot) { return namedGear({ k: k, r: r, b: gearBoost(r, w, false, slot) }); }

                                                                             
                                                                                
                                                              
  var WEAPON = [
    gearPiece('weapon_01', 'common',   { atk: 1 }),
    gearPiece('weapon_02', 'uncommon', { atk: 1 }),
    gearPiece('weapon_03', 'uncommon', { atk: 3, def: 1 }),
    gearPiece('weapon_04', 'rare',     { atk: 4, hp: -1 })
  ];
  var SHIELD = [
    gearPiece('shield_01', 'common',   { def: 1, hp: 1 },        'shield'),
    gearPiece('shield_02', 'common',   { def: 1, hp: 2 },        'shield'),
    gearPiece('shield_03', 'uncommon', { def: 1, hp: 2 },        'shield'),
    gearPiece('shield_04', 'rare',     { def: 2, hp: 1 },        'shield'),
    gearPiece('shield_08', 'rare',     { def: 2, hp: 4, atk: -1 },'shield')
  ];

  var EQUIP_SLOTS = ['weapon', 'shield'];
  var EQUIP_META = {
    weapon: { name: 'Weapon', icon: '⚔️' },
    shield: { name: 'Shield', icon: '🛡️' }
  };
  var EQUIP_POOL = { weapon: WEAPON, shield: SHIELD };

  var SLOTS = ['head', 'mouth', 'back', 'aura'];
  var SLOT_META = {
    head:  { name: 'Headwear', kind: 'roll',     icon: '👑' },
    mouth: { name: 'Mouth',    kind: 'roll',     icon: '👄' },
    back:  { name: 'Backwear', kind: 'mutation', icon: '🦋' },
    aura:  { name: 'Aura',     kind: 'mutation', icon: '✨' }
  };

  var BASE_POOL = { head: HEAD, mouth: MOUTH, back: BACK, aura: AURA };

                                                                 
  var INDEX = {};
  SLOTS.forEach(function (slot) {
    BASE_POOL[slot].forEach(function (t) {
      register(slot, t);
      (t.evo || []).forEach(function (e) {
        register(slot, { k: e.k, n: e.n, r: t.r, b: e.b, evolvedFrom: t.k });
      });
    });
    setEntries(slot).forEach(function (t) { register(slot, t); });
    retiredSetEntries(slot).forEach(function (t) { register(slot, t); });
  });
                                                                                      
  [{ slot: 'head',  t: { k: 'ftue_lumberjack_head',  n: 'Plaid Trapper', r: 'uncommon', b: { def: 2, hp: 4 } } },
   { slot: 'mouth', t: { k: 'ftue_lumberjack_mouth', n: 'Lumber Beard',  r: 'uncommon', b: { atk: 2, hp: 2 } } },
   { slot: 'back',  t: { k: 'ftue_lumberjack_back',  n: "Woodsman's Axe", r: 'uncommon', b: { atk: 4 } } }
  ].forEach(function (e) { register(e.slot, e.t); });
                                                                    
  EQUIP_SLOTS.forEach(function (slot) {
    EQUIP_POOL[slot].forEach(function (t) { register(slot, t); });
    setEntries(slot).forEach(function (t) { register(slot, t); });
    retiredSetEntries(slot).forEach(function (t) { register(slot, t); });
  });
  function register(slot, t) {
    t.slot = slot;
                                                                         
    if (!t.path) t.path = t.f ? (ART + slot + '/' + t.k + '/f0.png')
                              : (ART + slot + '/' + t.k + '.png');
    INDEX[t.k] = t;
  }
  function traitDef(key) { return key ? INDEX[key] || null : null; }
                                                                                                      
  function traitKeys(slot) { return Object.keys(INDEX).filter(function (k) { return INDEX[k].slot === slot; }); }

                                                                              

                                                                       
                                         
                                                                           
                                                                              
                                                                                
                                                
                                                                      
                                                                      
                                                     
                                                                             
                                                                               
                                                                              
                                                                             
                                                 
  var ALL_SETS_IN_POOL = true;

                                                                         
                                                        
                                                                
                                                                               
                                                                            
                                                                             
                                                                              
                                                                              
  var FAMILY_TRAITS_ONLY = true;
                                                                                 
  function familyCompletable(f) {
    for (var i = 0; i < SLOTS.length; i++) if (!f.traits[SLOTS[i]]) return false;
    return true;
  }
  var _famKeys = null;
  function familyTraitKeys() {
    if (!_famKeys) {
      _famKeys = {};
      families().forEach(function (f) {
        if (!familyCompletable(f) || f.shop) return;
        familyTraitPool(f.id).forEach(function (t) { _famKeys[t.k] = true; });
      });
    }
    return _famKeys;
  }
                                                                             
                                                                          
                                                                                
                                                                               
                                                                              
                                                                         
                                                                
  function bunnyIntroductionActive() {
    return typeof state !== 'undefined' && state && !state.ftueDone &&
      (state.ftueLoop >= 1 || (!state.ftueLoop && state.tutorialStep && state.tutorialStep !== 'done')) &&
      (state.expeditionsCleared || []).indexOf('node-1') < 0 &&
      (state.claimedExpeditionRewards || []).indexOf('1:win') < 0;
  }
                                                                          
                                                                        
                                                                        
                                                               
                                                      
  function accessiblePool(slot, unlockedSets, unlockedPieces) {
    if (bunnyIntroductionActive()) return familyTraitPool('bunny').filter(function(t){ return t.slot === slot; });
    var pool = BASE_POOL[slot].slice();
    var sets = unlockedSets || [], pieces = unlockedPieces || [];
    setEntries(slot).forEach(function (t) {
      if (ALL_SETS_IN_POOL || sets.indexOf(t.set) >= 0 || pieces.indexOf(t.k) >= 0) pool.push(t);
    });
    if (FAMILY_TRAITS_ONLY) {
      var keys = familyTraitKeys();
      var only = pool.filter(function (t) { return keys[t.k]; });
      if (only.length) return only;                                          
    }
    return pool;
  }

                                                                           
                                                                           
                                                                            
                                                                        
                                                                                 
                                                                              
                                                                                     
  function rollPool(slot, unlocked) {
    var keys = unlocked || [], starter = familyDefOf(STARTER_FAMILY);
                                                                            
    return (BASE_POOL[slot] || []).concat(setEntries(slot), retiredSetEntries(slot)).filter(function (t) {
      return (starter && starter.traits[slot] === t.k) || keys.indexOf(t.k) >= 0;
    });
  }
  function isRollableKey(k) { var t = traitDef(k); return !!(t && BASE_POOL[t.slot]); }
                                                                              
                                                                            
                                                                             
                                                                             
                                                                              
  function traitUnlocks(st) {
    if (!st) return [];
    if (!Array.isArray(st.traitUnlocks)) {
      var seed = (st.unlockedSetPieces || []).concat((st.pendingWinQueue || []).map(function (e) { return e && e.traitKey; }));
      st.traitUnlocks = seed.filter(function (k, i) { return isRollableKey(k) && seed.indexOf(k) === i; });
    }
    return st.traitUnlocks;
  }
                                                                         
  function unlockTraits(st, keys) {
    var list = traitUnlocks(st), added = [];
    (keys || []).forEach(function (k) {
      if (isRollableKey(k) && list.indexOf(k) < 0) { list.push(k); added.push(k); }
    });
    return added;
  }

                                                                         
                                                                  
  function familyTraitPool(familyId) {
    var family = familyDefOf(familyId);
    if (!family) return [];
    var pool = [];
    SLOTS.forEach(function (slot) {
      BASE_POOL[slot].concat(setEntries(slot)).forEach(function (t) {
        if (t.k === family.traits[slot] || t.set === familyId) pool.push(t);
      });
    });
    return pool;
  }
                                                                               
                                                                              
                                                                             
                                                                             
  function familyRewardPool(familyId) {
    var pool = familyTraitPool(familyId);
    if (!pool.length) return pool;
    EQUIP_SLOTS.forEach(function (slot) {
      setEntries(slot).forEach(function (t) { if (t.set === familyId) pool.push(t); });
    });
    return pool;
  }

  function weightedPick(pool, rng) {
    var total = 0, i;
    for (i = 0; i < pool.length; i++) total += RARITY[pool[i].r].weight;
    var r = (rng || Math.random)() * total;
    for (i = 0; i < pool.length; i++) {
      r -= RARITY[pool[i].r].weight;
      if (r <= 0) return pool[i];
    }
    return pool[pool.length - 1];
  }

                                                                               

                                                                                
                                                                          
  var ODDS = {
    head:  0.65,
    mouth: 0.65,
    back:  0.12,                                                   
    aura:  0.08                                                                   
                                                                    
  };

                                                                             
                                                                          
                                                       

                                                                                

                                                                                
                                  
  var _seq = 0;
  function newFrog() {
    return {
      id: 'f' + (++_seq) + '_' + Math.random().toString(36).slice(2, 7),
      xp: 0,
      merges: 0,
      traits: { head: null, mouth: null, back: null, aura: null },
      locked: { head: false, mouth: false },
      hue: Math.floor(Math.random() * 360)
    };
  }

  function levelOf(frog) { return levelFromXp(frog.xp || 0); }

                                                                           
                                                                           
                                                                              
                                                                            
                                                                           
                                                                            
                                                    
  function bodySizeOf(frog) {
    if (!frog || !frog.traits) return 0;
    return SLOTS.filter(function (s) { return frog.traits[s]; }).length;
  }

                                                                             

                                                                                

  function stats(frog) {
    var lv = levelOf(frog);
    var s = baseStats(lv);
    var pct = { atk: 1, def: 1, hp: 1 };
    SLOTS.concat(canEquip(frog) ? EQUIP_SLOTS : []).forEach(function (slot) {
      var t = (EQUIP_SLOTS.indexOf(slot) >= 0) ? equippedOn(frog, slot) : traitDef(frog.traits[slot]);
      if (!t || !t.b) return;
      s.atk += t.b.atk || 0;
      s.def += t.b.def || 0;
      s.hp += t.b.hp || 0;
      pct.atk += t.b.atkPct || 0;
      pct.def += t.b.defPct || 0;
      pct.hp += t.b.hpPct || 0;
    });
    return {
      atk: Math.max(1, Math.round(s.atk * pct.atk)),
      def: Math.max(0, Math.round(s.def * pct.def)),
      hp: Math.max(1, Math.round(s.hp * pct.hp))
    };
  }

                                              
  function statBreakdown(frog) {
    var lv = levelOf(frog);
    var rows = [{ label: 'Level ' + lv, kind: 'base', b: baseStats(lv) }];
    SLOTS.forEach(function (slot) {
      var t = traitDef(frog.traits[slot]);
      if (t) rows.push({ label: t.n, kind: slot, rarity: t.r, b: t.b || {} });
    });
                                                                             
    if (canEquip(frog)) EQUIP_SLOTS.forEach(function (slot) {
      var t = equippedOn(frog, slot);
      if (t) rows.push({ label: t.n, kind: slot, rarity: t.r, b: t.b || {} });
    });
    return rows;
  }

  function boostLabel(b) {
    if (!b) return '';
    var parts = [];
    ['atk', 'def', 'hp'].forEach(function (k) {
      if (b[k]) parts.push((b[k] > 0 ? '+' : '') + b[k] + ' ' + k.toUpperCase());
    });
    ['atkPct', 'defPct', 'hpPct'].forEach(function (k) {
      if (b[k]) parts.push((b[k] > 0 ? '+' : '') + Math.round(b[k] * 100) + '% ' + k.replace('Pct', '').toUpperCase());
    });
    return parts.join(' · ');
  }

                                                                              

                                                                         
                                                                                

                                                                      
  function evoChain(t) {
    if (!t) return [];
    var root = traitDef(t.evolvedFrom || t.k);
    if (!root || !root.evo) return [t];
    return [root].concat(root.evo.map(function (e) { return traitDef(e.k); }).filter(Boolean));
  }

                                                                                 
                                                                              
                                                                          
                                                 
  function applyEvolutions(frog) {
    var lv = levelOf(frog), changed = [];
    SLOTS.forEach(function (slot) {
      var cur = traitDef(frog.traits[slot]);
      if (!cur) return;
      var chain = evoChain(cur);
      if (chain.length < 2) return;
      var curIx = chain.findIndex(function (c) { return c.k === cur.k; });
      var earned = 0;
      chain.forEach(function (c, i) {
        if (i === 0) return;
        var step = (chain[0].evo || [])[i - 1];
        if (step && lv >= step.level) earned = i;
      });
      var next = Math.max(curIx, earned);                                                     
      if (next !== curIx) {
        frog.traits[slot] = chain[next].k;
        changed.push({ slot: slot, from: cur, to: chain[next] });
      }
    });
    return changed;
  }

                                                                             

                                                                           
                                                                           
                                                                        
                                                                           
                                                                         
                                                          

                                                                            
                                                                         
                                                                             
                                                                          
                                                                          
                                                                             
                                                                           
  var _mrFamilyByKey = null;
  function mrFamilyOfKey(k) {
    if (!_mrFamilyByKey) {
      _mrFamilyByKey = {};
      families().forEach(function (f) {
        familyTraitPool(f.id).forEach(function (t) { _mrFamilyByKey[t.k] = f.id; });
      });
    }
    return _mrFamilyByKey[k] || null;
  }
  function mrTraitInfo(k) {
    var t = traitDef(k);
    return t ? { slot: t.slot, rarity: t.r, family: mrFamilyOfKey(k) } : null;
  }
  function mrFamilyPieceFor(familyId, slot) {
    var f = familyDefOf(familyId);
    return (f && f.traits[slot]) || null;
  }
  function mrPool(slot, unlocked) {
    return rollPool(slot, unlocked).map(function (t) {
      return { key: t.k, family: mrFamilyOfKey(t.k), rarity: t.r };
    });
  }
  function mrFamilyList() {
    return families().map(function (f) { return f.id; });
  }
                                                                   
                                                                             
                                             
    
                                                                             
                                                                          
                                                                         
                                                                  
                                                                            
                                                                          
                                                                              
                                                                             
                                                                         
                                                                        
                                                                            
                                                                  
                                                                           
                                                                                
                                                                             
                                                              
                                                           
  var _leanNoted = null;
  function leanOverride() {
    try {
      var q = /[?&]lean=([^&]*)/.exec(root.location.search || '');
      if (q) {
        if (q[1] === '') root.sessionStorage.removeItem('fp-lean');
        else root.sessionStorage.setItem('fp-lean', decodeURIComponent(q[1]));
      }
      var v = parseFloat(root.sessionStorage.getItem('fp-lean'));
      if (v > 1 && v <= 100) v = v / 100;
      if (!(v >= 0 && v <= 1)) return null;
      if (_leanNoted !== v) { _leanNoted = v; console.info('[playtest] family lean override ' + v + ' (sheet value ignored; ?lean= to clear)'); }
      return v;
    } catch (e) { return null; }
  }
  function mergeParams() {
    var lean = leanOverride();
    return root.MergeRules.mergeParams({
      rarityOrder: ['common', 'uncommon', 'rare', 'mythic'],
      rarityWeight: {
        common: RARITY.common.weight, uncommon: RARITY.uncommon.weight,
        rare: RARITY.rare.weight, mythic: RARITY.mythic.weight
      },
      familyLeanNewRoll: lean != null ? lean : root.FPConfig.value('MergeRules', 'new_roll_family_lean_pct'),
      starterFamilyLean: root.FPConfig.value('MergeRules', 'starter_bunny_lean_pct'),
      starterFamilyId: STARTER_FAMILY,
      sharedSlotFamilyLean: root.FPConfig.value('MergeRules', 'shared_slot_same_rarity_lean_pct')
                                                                           
                                                                            
                                                                                
                                                                     
                                                                          
                                             
        
                                                                         
                                                                             
                                                                 
                                                                 
                                                                        
                                                                  
                                                                      
                                        
    });
  }

                                                                              

                                                                               
                                                                             
                                                                         
                                                                            
                                                                           
                                                                              
                                                                          
                                                         
    

  function merge(into, eaten, opts) {
    opts = opts || {};
    var rng = opts.rng || Math.random;
    var unlocked = opts.unlockedTraits || [];                                                                  
                                                                         
                                                                    
    var params = mergeParams();

    var before = {
      level: levelOf(into), stats: stats(into), traits: cloneTraits(into.traits),
      body: bodyOf(into), merges: mergesOf(into)
    };

    into.xp = (into.xp || 0) + mergeValue(eaten);

                                                                           
                                                                                 
                                                                            
                                                                           
                                                                      

                                                                                
    var bodyIxBefore = bodyIndexForMerges(mergesOf(into));
    var step = Math.min(MAX_MERGES, Math.max(mergesOf(into), mergesOf(eaten)) + 1);

    var report = { before: before, rolled: [], inherited: [], mutated: [], evolved: [], blocked: [], grewBody: false };

                                                                              
                                                                            
                                                                                
                                                                           
                                                                                
                                         

                                                                            
                                                                         
                                                                         
                                                                           
                                                                        
                                                                          
                                                                          
                                                  
                                                                         
    var decidedFamilies = [];
    for (var ci = 0; ci < SLOTS.length; ci++) {
      var cs = SLOTS[ci];
      var theirsDef = traitDef(eaten.traits && eaten.traits[cs]);
      var mineDef = traitDef(into.traits[cs]);
      if (!theirsDef && !mineDef) continue;
      var myLock = !!(into.locked[cs] && mineDef);
      var theirLock = !!(eaten.locked && eaten.locked[cs] && theirsDef);

                                                                            
                                                                               
                                                                                
      if (opts.ftueKeep) {
        var ftueK = familyDefOf(FTUE_FAMILY);
        var ftueMine = ftueK && mineDef && ftueK.traits[cs] === mineDef.k;
        var ftueTheirs = ftueK && theirsDef && ftueK.traits[cs] === theirsDef.k;
        if (ftueMine) { decidedFamilies.push(mrFamilyOfKey(mineDef.k)); continue; }
        if (ftueTheirs) {
          into.traits[cs] = theirsDef.k;
          report.inherited.push({ slot: cs, from: mineDef || null, to: theirsDef });
          decidedFamilies.push(mrFamilyOfKey(theirsDef.k));
          continue;
        }
      }

      var mine = mineDef ? { key: mineDef.k, locked: myLock } : null;
      var their = theirsDef ? { key: theirsDef.k, locked: theirLock } : null;
      var resolved = root.MergeRules.resolveSlot(mine, their, {
        params: params, rng: rng, traitInfo: mrTraitInfo, decidedFamilies: decidedFamilies
      });
      if (!resolved) continue;
      decidedFamilies.push(mrFamilyOfKey(resolved.key));

      if (mineDef && resolved.key === mineDef.k) {
                                                                        
                                                                            
                                                                               
                                                                             
                                                                          
                                                                          
                                                                      
                                                       
        into.locked[cs] = (cs !== 'aura') && !!resolved.locked;
        if (resolved.source === 'lock' || (myLock && theirLock)) report.blocked.push(cs);
        continue;
      }
      into.traits[cs] = resolved.key;
      into.locked[cs] = (cs !== 'aura') && !!resolved.locked;
      report.inherited.push({
        slot: cs, from: mineDef || null, to: traitDef(resolved.key),
        locked: into.locked[cs] || undefined
      });
    }

                                                                              
                                                                              
                                                                            
                            

                                                                             
                                                                            
                                                                              
                                                              

                                                                              
                                                                   
                                                                              
                                                                 
                                                                              
                                                                               
                                                                                  
                                                                            
                                                                             
                                                                            
                                                                            
                                                                            
                                                                              
                                                                          
                                                                            
                                                                         
    var filled = 0;
    SLOTS.forEach(function (s) { if (into.traits[s]) filled++; });
    var traitStep = SAME_BODY_MERGE ? (filled < traitsForMerges(step)) : !mergeGrowsBody(step);

    if(opts.ftueFinishFamily && step===MAX_MERGES) traitStep=false;                                     
    var queue = opts.queue || [];
    var target = null, pick = null;
    if (traitStep) {
                                                                           
                                                                            
                                                                            
                                                                           
                                                                  
                                                                         
                                                                    
      var open = [];
      SLOTS.forEach(function (s) {
        if (into.traits[s]) return;                                                             
        if (into.locked[s]) { report.blocked.push(s); return; }
        open.push(s);
      });
      var eligible = open.filter(function (s) { return s !== 'aura'; });
      if (!eligible.length) eligible = open;                                                        

      var claim = root.MergeRules.claimEligible(queue, eligible, { familyPieceFor: mrFamilyPieceFor });
      if (claim && (!bunnyIntroductionActive() || mrFamilyOfKey(claim.key)==='bunny')) { target = claim.slot; pick = traitDef(claim.key); queue = claim.queue; } else claim=null;

                                                                         
                                                                                 
                                                                             
                                                                             
                                                                      
                                                                                
      if (!target && opts.ftueScriptSlot && open.indexOf(opts.ftueScriptSlot) >= 0) target = opts.ftueScriptSlot;
      if (!target && eligible.length) target = eligible[Math.floor((rng || Math.random)() * eligible.length) % eligible.length];

      if (!SAME_BODY_MERGE && !target) { step = Math.min(MAX_MERGES, step + 1); traitStep = false; }
    }

    into.merges = step;
    var bodyIxAfter = bodyIndexForMerges(step);
    report.step = step;
    report.grewBody = bodyIxAfter > bodyIxBefore;
    report.queue = queue;                                                              

    if (traitStep && target) {
                                                                               
                                                                               
                                                                               
      if (!pick && (opts.ftueForce || (opts.ftueScriptSlot && target === opts.ftueScriptSlot))) {
        var ftueFam = familyDefOf(FTUE_FAMILY);
        pick = ftueFam && traitDef(ftueFam.traits[target]);
      }
                                                                          
                                                                        
                                                                           
      if (!pick) {
                                                                                               
        if (opts.goalFamily && opts.goalFamilyLean > 0) params.goalFamilyLean = opts.goalFamilyLean;
        var picked = root.MergeRules.pickNewTrait(target, into.traits, {
          params: params, rng: rng, traitInfo: mrTraitInfo,
          familyList: mrFamilyList(), familyPieceFor: mrFamilyPieceFor,
          pool: function (slot) { return mrPool(slot, unlocked); },
          starterDone: !!opts.starterDone, goalFamily: opts.goalFamily || null
        });
        pick = picked && traitDef(picked.key);
      }
      if (pick) {
        into.traits[target] = pick.k;
        report.consumedPromise = !!claim;                                                
        if (target === 'back' || target === 'aura') report.mutated.push({ slot: target, to: pick });
        else report.rolled.push({ slot: target, from: null, to: pick });
      }
    }

                                                                          
                                                                             
                                                                             
                                                                              
    if(opts.ftueFinishFamily && step===MAX_MERGES){
      into.traits = root.MergeRules.completeFamilyTraits(opts.ftueFinishFamily, {familyPieceFor:mrFamilyPieceFor});
                                                                                     
      var bunnyAura=into.traits.aura;
      var auraClaim=root.MergeRules.claimEligible(queue,['aura'],{familyPieceFor:mrFamilyPieceFor});
      if(auraClaim && auraClaim.key===bunnyAura){ queue=auraClaim.queue; report.queue=queue; report.consumedPromise=true; }
      into.locked = {head:false, mouth:false, back:false, aura:false};
      report.rolled = [];
      report.inherited = [];
      report.blocked = [];
      report.mutated = [{slot:'aura', to:traitDef(into.traits.aura)}];
    }
    report.evolved = applyEvolutions(into);
                                                                               
                                                                     
    report.completed = isFullyEvolved(into) &&
      !isFullyEvolved({ traits: before.traits, merges: before.merges });
    report.after = {
      level: levelOf(into), stats: stats(into), traits: cloneTraits(into.traits),
      body: bodyOf(into), merges: into.merges
    };
    report.leveled = report.after.level > before.level;
    report.bodyChanged = report.after.body.key !== before.body.key;
    return report;
  }

  function cloneTraits(t) { return { head: t.head, mouth: t.mouth, back: t.back, aura: t.aura }; }

                                                                              

                                                                              

                                                                                 
                                                                              
                                                                                                                     

                                                                                
                                                                                 
                                                                                
  function isFullyEvolved(frog) {
    if (!frog || !frog.traits) return false;
    if (mergesOf(frog) < MAX_MERGES) return false;
    return SLOTS.every(function (s) { return !!frog.traits[s]; });
  }
                                                                              
                                                                             
                                                                             
                                                                           
                                                                          
                                    
  function isRetired(frog) { return isFullyEvolved(frog) || !!familyOf(frog); }
  function canMerge(frog) { return !isRetired(frog); }

                                                                                
                                                                                
                                                                                 
  function deservesSpotlight(trait, seen) {
    if (!trait) return false;
    return !(seen && seen.indexOf(trait.k) >= 0);
  }

                                                                              

                                                                             
                                                                                 

  function traitScore(t) {
    if (!t || !t.b) return 0;
    var b = t.b;
    return (b.atk || 0) + (b.def || 0) + (b.hp || 0)
         + ((b.atkPct || 0) + (b.defPct || 0) + (b.hpPct || 0)) * 100;
  }
                                             
  function traitBetter(a, b) {
    if (!b) return true;
    if (!a) return false;
    var ra = RARITY[a.r].rank, rb = RARITY[b.r].rank;
    if (ra !== rb) return ra > rb;
    return traitScore(a) > traitScore(b);
  }
                                                                           
  function grantedTrait(report) {
    if (!report) return null;
    if (report.mutated.length) return report.mutated[0].to;
    if (report.inherited.length) return report.inherited[0].to;
    if (report.rolled.length) return report.rolled[0].to;
    return null;
  }

                                                                             
                                                                              
                                                                    

  function canEquip(frog) { return isRetired(frog); }
  function equippedOn(frog, slot) {
    return (frog && frog.equipped && traitDef(frog.equipped[slot])) || null;
  }
                                                                         
                                                                             
                                                                           
                                                                             
                                                                              
                                      
  function equipPool(slot, unlockedSets, unlockedPieces) {
    var sets = unlockedSets || [], pieces = unlockedPieces || [];
    return EQUIP_POOL[slot].concat(setEntries(slot).filter(function (t) {
      return sets.indexOf(t.set) >= 0 || pieces.indexOf(t.k) >= 0;
    }));
  }
  function equip(frog, slot, key, unlockedSets, unlockedPieces) {
    if (!frog || EQUIP_SLOTS.indexOf(slot) < 0) return false;
    if (!canEquip(frog)) return false;
    frog.equipped = frog.equipped || { weapon: null, shield: null };
    if (frog.equipped[slot] === key) { frog.equipped[slot] = null; return true; }                                  
                                                                              
    var pool = equipPool(slot, unlockedSets, unlockedPieces);
    for (var i = 0; i < pool.length; i++) {
      if (pool[i].k === key) { frog.equipped[slot] = key; return true; }
    }
    return false;
  }
                                                                             
                                                                           
                                                          
  function sanitizeEquipment(frog, unlockedSets, unlockedPieces) {
    if (!frog || !frog.equipped) return false;
    var stripped = false;
    EQUIP_SLOTS.forEach(function (slot) {
      var key = frog.equipped[slot];
      if (!key) return;
      var pool = equipPool(slot, unlockedSets, unlockedPieces);
      for (var i = 0; i < pool.length; i++) if (pool[i].k === key) return;
      frog.equipped[slot] = null; stripped = true;
    });
    return stripped;
  }

                                                                           
                                                                           
                                                                             
                                                                      
                                                          

                                                                           
                                                                              
                                                                             
                                                                           
                                                                          
                                                                             
                                                                        
  function canLock(slot) {
    if (!root.MergeRules.canLock(slot)) return false;
    if (slot === 'back') return !!root.FPConfig.value('MergeRules', 'freeze_allowed_back_slot');
    return true;
  }
  function lockCost(frog, slot) {
    if (!canLock(slot) || !frog.traits[slot]) return 0;
                                                                                 
    var lesson = root.FtueTooltips && root.FtueTooltips.lessonLockPrice ? root.FtueTooltips.lessonLockPrice(frog, slot) : null;
    if (lesson != null) return lesson;
    return root.FPConfig.value('MergeRules', slot === 'back' ? 'freeze_price_bones_back' : 'freeze_price_bones');
  }
  function rerollCost(frog, slot) {
    return root.MergeRules.canReroll(slot) && frog.traits[slot] ? root.FPConfig.value('MergeRules', 'gem_reroll_price_gems') : 0;
  }
                                                                                      
  function sacrificeBones(frog) { return root.Sacrifice.bonesFor(frog); }

                                                                            

                                                                            
                                                                             
                                                                                

  function tierOf(frog) { return levelFromXp(frog.xp || 0) - 1; }
  function levelForTier(tier) { return Math.max(1, Math.min(MAX_LEVEL, (tier || 0) + 1)); }
  function xpForTier(tier) { return LEVEL_XP[levelForTier(tier)]; }
                                                                                 
                                                                              
  function mergesForTier(tier) { return Math.max(0, Math.min(MAX_MERGES, tier || 0)); }
  function bodyForTier(tier) { return bodyForMerges(mergesForTier(tier)); }

                                                                              

                                                                             
                                                                           
                                                                         
                                                                                 

  function adopt(frog, opts) {
    if (!frog) return frog;
    opts = opts || {};
                                                                             
                                       
    if (Array.isArray(frog.traits)) delete frog.traits;
    if (!frog.traits || typeof frog.traits !== 'object') {
      frog.traits = { head: null, mouth: null, back: null, aura: null };
    }
    SLOTS.forEach(function (s) { if (!INDEX[frog.traits[s]]) frog.traits[s] = frog.traits[s] || null; });
    if (!frog.locked || typeof frog.locked !== 'object') frog.locked = { head: false, mouth: false, back: false, aura: false };

                                                                                  
                                                                               
                                                                                
                                                                                 
                                               
    var hi = frog._hi || (frog._hi = { xp: 0, merges: 0, tier: 0 });

                                                                           
    frog.xp = Math.max(typeof frog.xp === 'number' ? frog.xp : 0, xpForTier(frog.tier || 0), hi.xp);
                                                               
    frog.tier = Math.max(frog.tier || 0, tierOf(frog), hi.tier);
                                                                               
                                                                                  
                                                             
    if (typeof frog.merges !== 'number') frog.merges = mergesForTier(frog.tier);
    frog.merges = Math.max(frog.merges, hi.merges);

    hi.xp = frog.xp; hi.tier = frog.tier; hi.merges = frog.merges;
    applyEvolutions(frog);
    if (opts.fillTraits) fillTraitsForTier(frog, opts.unlockedTraits);
    syncClaim(frog);
    return frog;
  }
                                                                             
                                                                             
                                                                             
                                                            
  function syncClaim(frog) {
    if (!frog || (!frog.assimilated && !frog.ascended)) return frog;
    var fam = familyOf(frog), id = fam && fam.id;
    if (frog.assimilated && frog.assimilated !== id) delete frog.assimilated;
    if (frog.ascended && (frog.ascended !== id || frog.assimilated !== id)) delete frog.ascended;
    return frog;
  }

                                                                                
                                                                                   
                                                                                  
                                                                                
                                                                             
                                                                              
  function fillTraitsForTier(frog, unlocked) {
    var want = traitsForMerges(mergesOf(frog));
    var have = SLOTS.filter(function (s) { return !!frog.traits[s]; }).length;
    for (var i = 0; i < SLOTS.length && have < want; i++) {
      var slot = SLOTS[i];
      if (frog.traits[slot]) continue;
      var pool = rollPool(slot, unlocked);
      if (!pool.length) continue;
      frog.traits[slot] = weightedPick(pool).k;
      have++;
    }
    applyEvolutions(frog);
    return frog;
  }

                                                                           
                                                                                 
                                                                                 
                                                                                
                                              
                                                                           
                                                                                   
  function familyBonusOf(frog) {
    var fam = familyOf(frog);
    if (!fam) return { fam: null, set: 0, body: 0 };
    return { fam: fam, set: FAMILY_BONUS, body: ((fam.body && frog && frog.assimilated === fam.id) ? FAMILY_BODY_BONUS : 0) + (ascendedOf(frog) ? ASCEND_BONUS : 0) };
  }
  function traitBoost(frog) {
    var flat = { atk: 0, def: 0, hp: 0 }, pct = { atk: 0, def: 0, hp: 0 };
    SLOTS.concat(canEquip(frog) ? EQUIP_SLOTS : []).forEach(function (slot) {
      var t = (EQUIP_SLOTS.indexOf(slot) >= 0)
        ? equippedOn(frog, slot)
        : traitDef(frog.traits && frog.traits[slot]);
      if (!t || !t.b) return;
      flat.atk += t.b.atk || 0; flat.def += t.b.def || 0; flat.hp += t.b.hp || 0;
      pct.atk += t.b.atkPct || 0; pct.def += t.b.defPct || 0; pct.hp += t.b.hpPct || 0;
    });
                                                                             
                                                                             
                                                                         
                                                                            
                                               
    var fb = familyBonusOf(frog);
    pct.atk += fb.set + fb.body; pct.def += fb.set + fb.body; pct.hp += fb.set + fb.body;
    return { flat: flat, pct: pct };
  }

                                                                              

                                                                            
                                                                                  

                                                                            
                                                                               
                                                                               
                                                 
  var PAINT_ORDER = ['aura', 'head', 'back', 'weapon', 'body', 'mouth', 'shield'];

                                                                               
                                                                            
                                                                              
                                                                   
  function layersOf(frog, opts) {
    var out = [], asc = ascendedOf(frog), gear = (opts && opts.gear) || {};
    var b = bodyOf(frog), ladder = !b.family || b.frontal;                                                                    
    PAINT_ORDER.forEach(function (layer) {
      if (layer === 'body') {
        out.push(asc ? { layer: 'body', path: bodyPath(ASCENDED_BODY[asc]), tint: false, distort: null }
                     : bodyLayer(frog));
        return;
      }
      if (asc && ASCEND_HIDES.indexOf(layer) >= 0) return;                                      
                                                                                
      var t = (EQUIP_SLOTS.indexOf(layer) >= 0)
        ? (traitDef(gear[layer]) || (canEquip(frog) ? equippedOn(frog, layer) : null))
        : traitDef(frog.traits[layer]);
      if (!t) return;
                                                                             
                                                                    
      var pieces = (layer === 'aura') ? auraPieces(t.k) : [];
      if (pieces.length) {
        pieces.forEach(function (p, i) {
          out.push({ layer: 'aura', key: t.k, name: t.n, path: p, tint: false,
                     anchor: anchorFor(frog, 'aura'),
                     piece: i, motion: auraMotion(t.k, i), scale: t.s || 1 });
        });
        return;
      }
      var L = { layer: layer, key: t.k, name: t.n, path: t.path, tint: false,
                anchor: seatedAnchor(anchorFor(frog, layer), t.k, ladder && layer === 'head') };
                                                                                                     
      var ss = layer === 'shield' && shieldSeat(b, t.k);
      if (ss) { L.anchor = ss; L.palm = SHIELD_PALM[b.key]; L.side = shieldSide(b); }
      var nudge = layer === 'back' && facesUs(b) && BACK_NUDGE[t.k];
      if (nudge) L.anchor = nudgeBack(L.anchor, nudge);
      var hand = (layer === 'head' || layer === 'mouth' || layer === 'back') && HAND_SEATS[b.key] && HAND_SEATS[b.key][layer];
      if (hand) L.anchor = handSeat(L.anchor, hand);
      var board = boardSeat(b.key, t.k);                                                                
      if (board) L.anchor = board;
      var fl = layer === 'back' && wingFlap(t.k, L.anchor);
      if (fl) L.flap = fl;
      out.push(L);
                                                                                                        
                                                       
      var mid = fl && facesUs(b) && BACK_MIDLINE[b.key];
      if (mid) out.push({ layer: layer, key: t.k, name: t.n, path: t.path, tint: false, twin: true,
        anchor: L.anchor.r ? { s: L.anchor.s, x: L.anchor.x, y: L.anchor.y, r: L.anchor.r, m: mid } : { s: L.anchor.s, x: L.anchor.x, y: L.anchor.y, m: mid },
        flap: { origin: [Math.round((mid / 3.2 - fl.origin[0]) * 100) / 100, fl.origin[1]], deg: -fl.deg, ms: fl.ms } });
    });
    return out;
  }
                                                                               
                                                                             
                                            
  function bodyLayer(frog) {
    var b = bodyOf(frog);
    var L = { layer: 'body', path: bodyPath(b.key), tint: false, distort: distortFrames(frog), blink: blinkFrames(frog) };
    if (b.flop) {
      L.flop = bodyPath(b.key + '_flop');
      L.flopLegs = (b.flop.legs || []).map(function (g, i) { return { path: bodyPath(b.key + '_flop_leg' + (i + 1)), over: !!g.over, pivot: g.pivot, paw: g.paw }; });
    }
    if (b.feet && b.feet.length) {
      L.path = bodyPath(b.key + '_base');
      L.feet = b.feet.map(function (f, i) { return { path: bodyPath(b.key + '_foot' + (i + 1)), side: f.side, pivot: f.pivot, toe: f.toe, over: !!f.over }; });
    }
    if (b.croak) L.croak = bodyPath(b.key + '_croak');
    if (b.arms && b.arms.length) {
      L.path = bodyPath(b.key + '_base');
      L.armMove = b.armMove || null;
      L.arms = b.arms.map(function (a, i) {
        return { path: bodyPath(b.key + '_arm' + (i + 1)), side: a.side, pivot: a.pivot, hand: a.hand, holds: b.holds === a.side, under: !!a.under };
      });
    }
    return L;
  }
                                                                          
  function anchorCSS(a) {
                                                                          
    var mirror = (a && a.m != null) ? 'translate(' + Math.round((a.m - 320) / 3.2 * 100) / 100 + '%,0%) scaleX(-1)' : '';
    if (!a || (a.s === 1 && !a.x && !a.y && !a.r)) return mirror;
    return (mirror ? mirror + ' ' : '') + 'translate(' + (a.x || 0) + '%,' + (a.y || 0) + '%) scale(' + (a.s || 1) + ')' + (a.r ? ' rotate(' + a.r + 'deg)' : '');
  }

  root.FrogTraits = {
    ART: ART, MAX_LEVEL: MAX_LEVEL, LEVEL_XP: LEVEL_XP, MERGE_BONUS: MERGE_BONUS,
    SLOTS: SLOTS, SLOT_META: SLOT_META, RARITY: RARITY, ODDS: ODDS,
    BODIES: BODIES, SETS: SETS, BASE_POOL: BASE_POOL,
                                                                             
                                                                           
                                                                    
                                                            
    mergeParams: mergeParams, mrTraitInfo: mrTraitInfo,
    bunnyIntroductionActive: bunnyIntroductionActive, newFrog: newFrog, levelOf: levelOf, bodySizeOf: bodySizeOf, levelFromXp: levelFromXp, levelProgress: levelProgress,
    mergeValue: mergeValue, bodyPath: bodyPath, distortFrames: distortFrames, mutateFrames: mutateFrames, blinkFrames: blinkFrames, baseStats: baseStats,
    MAX_MERGES: MAX_MERGES, traitsForMerges: traitsForMerges, nextStep: nextStep,
    BODIES: BODIES, bodyOf: bodyOf, bodyForMerges: bodyForMerges, mergesOf: mergesOf,
    mergeGrowsBody: mergeGrowsBody, displayScale: displayScale, mergesForTier: mergesForTier,
    anchorFor: anchorFor, anchorCSS: anchorCSS,
    traitBetter: traitBetter, traitScore: traitScore,
    isFullyEvolved: isFullyEvolved, isRetired: isRetired, canMerge: canMerge,
    canMergePair: canMergePair, SAME_BODY_MERGE: SAME_BODY_MERGE,
    FAMILY_BONUS: FAMILY_BONUS, FAMILY_BODY_BONUS: FAMILY_BODY_BONUS, familyBonusOf: familyBonusOf,
    canAscendPair: canAscendPair, ascendedOf: ascendedOf, ASCEND_BONUS: ASCEND_BONUS, syncClaim: syncClaim,
    deservesSpotlight: deservesSpotlight, grantedTrait: grantedTrait,
    stats: stats, statBreakdown: statBreakdown, boostLabel: boostLabel, traitBoost: traitBoost,
    traitForSheetId: traitForSheetId, SHEET_TRAIT_KEYS: SHEET_TRAIT_KEYS,
    traitDef: traitDef, traitKeys: traitKeys, HEAD_CENTRE: HEAD_CENTRE, BACK_SEAT: BACK_SEAT, BACK_MIDLINE: BACK_MIDLINE, BACK_NUDGE: BACK_NUDGE, HAND_SEATS: HAND_SEATS, BOARD_SEATS: BOARD_SEATS, SHIELD_PALM: SHIELD_PALM, SHIELD_CENTRE: SHIELD_CENTRE, WING_FLAP: WING_FLAP, accessiblePool: accessiblePool, familyTraitPool: familyTraitPool, familyRewardPool: familyRewardPool, applyEvolutions: applyEvolutions,
    rollPool: rollPool, traitUnlocks: traitUnlocks, unlockTraits: unlockTraits,
    merge: merge, canLock: canLock, lockCost: lockCost, canReroll: root.MergeRules.canReroll, rerollCost: rerollCost,
    sacrificeBones: sacrificeBones,
    layersOf: layersOf, auraPieces: auraPieces, auraMotion: auraMotion, AURA_MOTION: AURA_MOTION,
                                                              
    tierOf: tierOf, levelForTier: levelForTier, xpForTier: xpForTier, bodyForTier: bodyForTier,
    adopt: adopt, fillTraitsForTier: fillTraitsForTier,
                                                                          
    EQUIP_SLOTS: EQUIP_SLOTS, EQUIP_META: EQUIP_META, EQUIP_POOL: EQUIP_POOL,
    canEquip: canEquip, equippedOn: equippedOn, equip: equip,
    equipPool: equipPool, sanitizeEquipment: sanitizeEquipment,
                                                                          
    families: function () { return families().filter(function (f) { return !f.ftue; }); }, familyDefOf: familyDefOf, familyOf: familyOf,
    STARTER_FAMILY: STARTER_FAMILY,
    setClaimedFamilies: setClaimedFamilies, familyClaimedIn: familyClaimedIn,
    familyProgressOn: familyProgressOn, familyNearest: familyNearest,
    GEAR_BUDGET: GEAR_BUDGET, GEAR_SET_BONUS: GEAR_SET_BONUS, gearBoost: gearBoost
  };
                                                                            
  root.FT = root.FrogTraits;
})(window);
