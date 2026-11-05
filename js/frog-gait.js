                                                                             

                                                                                
                                                                              
                                                            

                                                                               
                                                                               
                                                                              
                                                                                  
                                                                               
                                                                               

                                                                            
                                                                               
                                                                               
                                                                             
                                                                          
                                                                           
                                                                               
                                                                           
                                 

                                                                              
                                                                               
                                                                               
                                                                            
                                                                         
                                                                  
                                                                              
                                                                                 
                                                                           
                                                                        

                                                                             
                                                                              
                                                                              
                                                                              
                                                                         
                                                                    
                                                       

                                                                        
                                                                           
                                                                         
                                                                           
                                                                              
(function (root) {
  'use strict';

  var PARAMS = {
    roll: {
      baseS: 0.55, pxPerS: 150,                                          
      minS: 1.0, maxS: 3.0,                   
      bounceS: 0.5,                                                       
      height: 0.75,                                                                                                    
      lastBounces: 2,                                                     
      decay: 0.6,                                        
      jitter: 0.12,                                                                              
      sit: 0.26,                                                           
      squash: 0.22,                                                                            
      stretch: 0.14,                                          
      crouch: 0.24,                                                            
      sitTurn: 0.15,                                                                          
      settle: [0.3, 0.1],                                                                      
      settleS: 0.8,
      settleDeg: 14,                                                                    
      bodyFill: 0.85,                                                               
      travelEase: 'cubic-bezier(.3,.1,.35,1)'
    },
    crawl: {
      baseS: 0.45, pxPerS: 55,                                                            
      minS: 1.1, maxS: 3.8,                   
      surgeS: 0.5,                                                       
      stretch: 0.13,                                                                
      gather: 0.08,                                                        
      reach: 0.05,                                                                                
      lean: 3,                                                    
      bubbleMs: [110, 190],                                            
      settleS: 0.55,                                              
      travelEase: 'linear'
    },
                                                                                                         
    bubble: { size: [0.12, 0.24], rise: [0.06, 0.18], ms: [440, 760], gooEvery: 3, gooMs: 1400, gooSize: [0.24, 0.36] },
    leap: {
      baseS: 0.35, pxPerS: 170,                                          
      minS: 0.75, maxS: 2.4,                  
      leapS: 0.62,                                                      
      gather: 0.3,                                                                    
      land: 0.12,                                                          
      height: 0.55,                                                         
      squash: 0.2, stretch: 0.16,
      tilt: 13,                                                                       
      skid: 0.06,                                                                            
      jitter: 0.1,                                                       
      croakMs: 320,                                        
      travelEase: 'linear'
    },
    waddle: {
      baseS: 0.25, pxPerS: 62,                                                        
      minS: 0.8, maxS: 3.4,                   
      stepS: 0.24,                                                      
      rock: 8,                                                     
      lift: 0.035,                                                           
      squash: 0.06,
      legDeg: 16, legUp: 3.5,                                                                                    
      armOut: 14,                                                                                          
      settleS: 0.6,                                             
      travelEase: 'linear'
    },
    stomp: {
      baseS: 0.3, pxPerS: 75,                                                                   
      minS: 0.9, maxS: 3.6,                   
      strideS: 0.38,                                                      
      lift: 0.13,                                                                       
      liftVar: 0.25,                                         
      sway: 9,                                                                
      shift: 0.055,                                                                              
      squash: 0.16,                                        
      stumble: 0.14,                                               
      stumbleSway: 1.7,
      stopS: 0.85, stopTip: 15, stopLift: 0.06,                                 
      travelEase: 'cubic-bezier(.35,.05,.45,1)'
    },
    flop: {                                                                       
      squashMs: 90,                                                                                        
                                                                                                        
      splatMs: 430,                                                                             
      holdMs: [1500, 2600],                    
                                                                                                        
                                                                                                      
                                                                                                        
                                                                                           
      up: { liftMs: 260, slamMs: 70, pushMs: 110, riseMs: 100, landMs: 330 },
      liftDeg: 40, pressDeg: 9, pushUp: 0.09,
      battleHoldMs: 420                                                                               
    },
    jiggle: {                                                                               
      drop: 0.035,                                                              
      spring: 0.025,                                          
      ms: 380
    },
    plop: {                                                                                                  
      ms: 640,
      held: [1.08, 0.94],                                                                                               
      toss: 0.13,                                                                            
      tossAt: 0.15,                                        
      contactAt: 0.36,                               
      squash: [1.3, 0.7],               
      squashAt: 0.46,
      rebound: [0.9, 1.12], reboundUp: 0.05, reboundAt: 0.64,
      settle: [1.05, 0.96], settleAt: 0.82,
      wobble: 4,                                                  
      splash: 1.35                                               
    },
    bonk: {                                                                                                       
      ms: 900,                                                                                                    
      lunge: 0.16,                                                                               
      lungeAt: 0.07,                                
      holdAt: 0.19,                                                                            
      squash: [0.7, 1.24],                                      
      push: 1.6,                                                    
      up: 0.55,                                                       
      landAt: 0.62,                                         
      skid: 0.1,                                                                 
      skidAt: 0.84,
      tumble: 46,                                                   
      wobble: [-18, 11, -6, 3],                            
      flashAt: 0.32,                                                         
      burst: 1.25,                                                                 
      lines: 9,                                                    
      dizzyMs: 1500,                                                        
      dizzyStars: 3,
      dizzyLaps: 2.5                                              
    },
    splash: {
      drops: [3, 5],                                            
      dropSize: 0.11,                                       
      reach: [0.22, 0.5],                                                         
      rise: [0.16, 0.32],
      ms: [340, 480],
      ring: 0.95,                                                               
      feet: 0.91                                                                                          
    }
  };

                                                                                              
  function frogById(id) {
    try { return (typeof state !== 'undefined' && state && state.frogs || []).find(function (f) { return f.id === id; }) || null; }
    catch (e) { return null; }
  }
  var GAITS = ['roll', 'stomp', 'leap', 'waddle', 'crawl'];
                                                                          
  function facesTravel(gait) { return gait === 'leap' || gait === 'crawl'; }
                                                                                     
  function gaitOf(frog) {
    if (typeof frog === 'string') frog = frogById(frog);
    var FT = root.FrogTraits;
    if (!frog || !FT || !FT.bodyOf) return 'hop';
    var b = FT.bodyOf(frog);
    return (b && GAITS.indexOf(b.gait) >= 0) ? b.gait : 'hop';
  }
                                                                                     
  function steps(gait, hops) { return GAITS.indexOf(gait) >= 0 ? 1 : hops; }
  function tripPx(o) {
    var L = (o && o.layer) || { width: 390, height: 844 };
    return o && o.from && o.to ? Math.hypot((o.to.x - o.from.x) / 100 * L.width, (o.to.y - o.from.y) / 100 * L.height) : 0;
  }
                                                
  function stepDur(gait, trip) {
    var G = PARAMS[gait] || PARAMS.roll;
    return Math.max(G.minS, Math.min(G.maxS, G.baseS + tripPx(trip) / G.pxPerS));
  }
  function ease(gait) { return (PARAMS[gait] || PARAMS.roll).travelEase; }
                                                                              
                                                                            
                                                                                
  function rollAngle(i, n, dist, size) {
    var circ = Math.PI * Math.max(1, size * PARAMS.roll.bodyFill);
    var turns = Math.max(1, Math.round(dist / circ));
    return 360 * turns * Math.min(1, (i + 1) / Math.max(1, n));
  }

  function track(el, a) { (el._gaitAnims = el._gaitAnims || []).push(a); a.onfinish = a.oncancel = function () { var l = el._gaitAnims || []; var k = l.indexOf(a); if (k >= 0) l.splice(k, 1); }; return a; }
                                                                                                  
                                                                                                
                                                                                                  
                                                                                    
  function animate(el, frames, opts, keep) { if (!el || !el.animate) return null; var a = track(el, el.animate(frames, opts)); a._gaitKeep = !!keep; return a; }

  function rnd(r) { return r[0] + Math.random() * (r[1] - r[0]); }
                                                                                                    
                                                        
  var PARTS = 'img.fs-arm, img.fs-foot, .fs-weapon-arm, .fs-shield-arm, .frog-stack, .frog-stack img.fs-head, .frog-stack img.fs-mouth, .frog-stack img.fs-back';
  function tf(y, sx, sy, rot, x) {
    return 'translate(' + (x || 0).toFixed(1) + 'px,' + (y || 0).toFixed(1) + 'px) rotate(' + (rot || 0).toFixed(1) + 'deg) scale(' + sx.toFixed(3) + ',' + sy.toFixed(3) + ')';
  }
  function later(hopEl, ms, fn) { var t = root.PondPause ? root.PondPause.later(fn, ms) : setTimeout(fn, ms); (hopEl._gaitTimers = hopEl._gaitTimers || []).push(t); }

                                                                               
                                                                                 
                                                                              
                                                                             
                                                                                
                                                                              
                                                      
  function bounceFrames(T, size, rand, full) {
    var R = PARAMS.roll, r = rand || Math.random;
    var B = Math.max(2, Math.round(T / R.bounceS)), d = 1 / B, H = R.height * size;
    var frames = [{ offset: 0, transform: tf(0, 1, 1), easing: 'cubic-bezier(.4,0,.2,1)' }];                                                
                                                                                                              
    var contacts = [], L = full ? 0 : Math.min(R.lastBounces, B - 1);
    for (var k = 0; k < B; k++) {
      var t0 = k * d, a = t0 + R.sit * d, air = (1 - R.sit) * d;
      var tail = Math.max(0, k - (B - 1 - L)), f = 1 - R.decay * tail / Math.max(1, L);
      var h = H * f * (1 + (r() * 2 - 1) * R.jitter), s = R.stretch * f, q = k === 0 ? R.crouch * 1.15 : R.squash * f;
      frames.push({ offset: t0 + R.sit * d * 0.42, transform: tf(0, 1 + q, 1 - q), easing: 'cubic-bezier(.45,0,.4,1)' });                                  
      frames.push({ offset: a, transform: tf(-h * 0.06, 1 - s * 0.5, 1 + s * 0.5), easing: 'cubic-bezier(.3,.55,.45,1)' });                                                            
      frames.push({ offset: a + air * 0.25, transform: tf(-h * 0.75, 1 - s, 1 + s), easing: 'cubic-bezier(.3,.7,.6,1)' });              
      frames.push({ offset: a + air * 0.5, transform: tf(-h, 1.02, 0.98), easing: 'cubic-bezier(.4,0,.7,.3)' });                                  
      frames.push({ offset: a + air * 0.75, transform: tf(-h * 0.75, 1 - s, 1 + s), easing: 'cubic-bezier(.4,0,.75,.4)' });              
      var end = k === B - 1 ? 1 : t0 + d;
      frames.push({ offset: end, transform: tf(0, 1, 1), easing: 'ease-out' });                                                                             
      contacts.push(end);
    }
    return { frames: frames, contacts: contacts, bounces: B };
  }
                                                                            
                                                                
  function rollTurnFrames(B, a1) {
    var R = PARAMS.roll, per = a1 / B, d = 1 / B, fr = [{ offset: 0, rotate: '0deg', easing: 'linear' }];
    for (var k = 0; k < B; k++) {
      fr.push({ offset: k * d + R.sit * d, rotate: ((k + R.sitTurn) * per) + 'deg', easing: 'cubic-bezier(.35,.15,.55,.95)' });
      fr.push({ offset: k === B - 1 ? 1 : (k + 1) * d, rotate: ((k + 1) * per) + 'deg', easing: 'linear' });
    }
    return fr;
  }
                                                                          
                                                                           
                                                                          
                                                                           
                                                                               
                                                                     
  function walkFrames(T, size, rand) {
    var S = PARAMS.stomp, r = rand || Math.random;
    var N = Math.max(2, Math.round(T / S.strideS)), D = 1 / N;
    var frames = [{ offset: 0, transform: tf(0, 1, 1, 0, 0), easing: 'ease-in-out' }];
    var contacts = [], lean = 0, shift = 0;
    for (var k = 0; k < N; k++) {
      var side = k % 2 ? -1 : 1, stumble = k < N - 1 && r() < S.stumble;
      var A = S.sway * side * (stumble ? S.stumbleSway : 1) * (0.85 + 0.3 * r());
      var X = S.shift * size * side * (stumble ? 1.3 : 1);
      var lift = S.lift * size * (1 + (r() * 2 - 1) * S.liftVar) * (stumble ? 1.15 : 1);
      var q = S.squash * (0.85 + 0.3 * r()) * (stumble ? 1.3 : 1), t0 = k * D;
      frames.push({ offset: t0 + D * 0.22, transform: tf(0, 1.04, 0.96, lean * 0.45, shift * 0.45), easing: 'cubic-bezier(.3,.6,.5,1)' });
      frames.push({ offset: t0 + D * 0.48, transform: tf(-lift, 0.95, 1.06, A * 0.55, X * 0.4), easing: 'cubic-bezier(.5,0,.85,.5)' });
      frames.push({ offset: t0 + D * 0.74, transform: tf(0, 1 + q, 1 - q, A, X), easing: 'cubic-bezier(.2,.7,.4,1)' });
      frames.push({ offset: t0 + D * 0.87, transform: tf(-lift * 0.12, 0.98, 1.02, A * (stumble ? 1.25 : 1.05), X), easing: 'ease-in-out' });
      lean = A * 0.9; shift = X * 0.9;
      frames.push({ offset: k === N - 1 ? 1 : t0 + D, transform: tf(0, 1.02, 0.98, lean, shift), easing: 'ease-in-out' });
      contacts.push({ at: t0 + D * 0.74, side: side, power: stumble ? 1.4 : 1 });
    }
    return { frames: frames, contacts: contacts, strides: N, end: { lean: lean, shift: shift } };
  }
                                                                                                       
                                                                                                   
                                                                                                    
                                                                                                    
                                                                                                
                                                                                          
  function leapFrames(T, size, rand) {
    var L = PARAMS.leap, r = rand || Math.random;
    var n = Math.max(1, Math.round(T / L.leapS)), d = 1 / n, H = L.height * size;
    var frames = [{ offset: 0, transform: tf(0, 1, 1, 0), easing: 'cubic-bezier(.4,0,.2,1)' }];
    var way = [0], wayAt = [0], contacts = [];
    for (var k = 0; k < n; k++) {
      var t0 = k * d, up = t0 + L.gather * d, down = t0 + (1 - L.land) * d, air = down - up;
      var h = H * (1 + (r() * 2 - 1) * L.jitter), q = L.squash, st = L.stretch, tl = L.tilt;
      frames.push({ offset: t0 + L.gather * d * 0.7, transform: tf(0, 1 + q, 1 - q, tl * 0.3), easing: 'cubic-bezier(.5,0,.6,1)' });                               
      frames.push({ offset: up, transform: tf(-h * 0.12, 1 - st * 0.6, 1 + st, tl), easing: 'cubic-bezier(.2,.65,.45,1)' });                                           
      frames.push({ offset: up + air * 0.48, transform: tf(-h, 1 + st * 0.55, 1 - st * 0.4, tl * 0.1), easing: 'cubic-bezier(.45,0,.75,.45)' });                                
      frames.push({ offset: up + air * 0.82, transform: tf(-h * 0.42, 1 - st * 0.25, 1 + st * 0.3, -tl), easing: 'cubic-bezier(.5,0,.85,.6)' });                                       
      frames.push({ offset: down, transform: tf(0, 1 + q * 1.1, 1 - q * 1.1, -tl * 0.35), easing: 'cubic-bezier(.2,.7,.4,1)' });                              
      frames.push({ offset: k === n - 1 ? 1 : t0 + d, transform: tf(0, 1, 1, 0), easing: 'ease-out' });                                                                
                                                                                                                     
      way.push(k / n, k / n + d * (1 - L.skid), (k + 1) / n); wayAt.push(t0 + L.gather * d * 0.85, down, k === n - 1 ? 1 : t0 + d);
      contacts.push(down);
    }
    return { frames: frames, way: way, wayAt: wayAt, contacts: contacts, leaps: n };
  }
                                                                                                                        
                                                                                                                          
                                                                                                                         
                                                                                    
  function crawlFrames(T, size, rand) {
    var C = PARAMS.crawl, r = rand || Math.random;
    var n = Math.max(2, Math.round(T / C.surgeS)), d = 1 / n;
    var frames = [{ offset: 0, transform: tf(0, 1, 1, 0, 0), easing: 'ease-in-out' }], way = [0], wayAt = [0];
    for (var k = 0; k < n; k++) {
      var t0 = k * d, st = C.stretch * (0.85 + 0.3 * r()), g = C.gather * (0.85 + 0.3 * r()), last = k === n - 1;
      frames.push({ offset: t0 + d * 0.45, transform: tf(0, 1 + st, 1 - st * 0.7, -C.lean, -C.reach * size), easing: 'cubic-bezier(.45,0,.4,1)' });                          
      frames.push({ offset: t0 + d * 0.8, transform: tf(0, 1 - g, 1 + g, C.lean * 0.3, C.reach * 0.4 * size), easing: 'cubic-bezier(.4,0,.5,1)' });                        
      frames.push({ offset: last ? 1 : t0 + d, transform: tf(0, 1, 1, 0, 0), easing: 'ease-in-out' });
      way.push(k / n + d * 0.78, (k + 1) / n); wayAt.push(t0 + d * 0.5, last ? 1 : t0 + d);
    }
    return { frames: frames, way: way, wayAt: wayAt, surges: n };
  }
                                                                                                                        
                                                                                                                       
                                            
  function bubble(parent, x, y, size, goo) {
    if (!parent || !parent.isConnected || !root.document || !parent.animate) return;
    if (root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var B = PARAMS.bubble, s = rnd(B.size) * size, up = rnd(B.rise) * size, ms = rnd(B.ms);
    var b = document.createElement('div');
    b.className = 'fg-bubble';
    b.style.cssText = 'left:' + x.toFixed(1) + 'px;top:' + y.toFixed(1) + 'px;width:' + s.toFixed(1) + 'px;height:' + s.toFixed(1) + 'px';
    parent.appendChild(b);
    b.animate([
      { transform: 'translate(-50%,-50%) translate(0,0) scale(.15)', opacity: 1 },
      { transform: 'translate(-50%,-50%) translate(0,' + (-up * 0.7).toFixed(1) + 'px) scale(1)', opacity: 1, offset: 0.78, easing: 'cubic-bezier(.2,.7,.4,1)' },
      { transform: 'translate(-50%,-50%) translate(0,' + (-up).toFixed(1) + 'px) scale(1.18,1.08)', opacity: 1, offset: 0.88 },
      { transform: 'translate(-50%,-50%) translate(0,' + (-up).toFixed(1) + 'px) scale(1.35)', opacity: 0 }
    ], { duration: ms, easing: 'ease-out' }).onfinish = function () {
      b.remove();
      if (!parent.isConnected) return;
      var p = document.createElement('div');                                    
      p.className = 'fg-pop';
      p.style.cssText = 'left:' + x.toFixed(1) + 'px;top:' + (y - up).toFixed(1) + 'px;width:' + (s * 1.3).toFixed(1) + 'px;height:' + (s * 1.3).toFixed(1) + 'px';
      parent.appendChild(p);
      p.animate([{ transform: 'translate(-50%,-50%) scale(.6)', opacity: 0.9 }, { transform: 'translate(-50%,-50%) scale(1.5)', opacity: 0 }],
        { duration: 220, easing: 'ease-out' }).onfinish = function () { p.remove(); };
    };
    if (goo) {
      var gs = rnd(B.gooSize) * size, gp = document.createElement('div');
      gp.className = 'fg-goo';
      gp.style.cssText = 'left:' + x.toFixed(1) + 'px;top:' + (y + s * 0.25).toFixed(1) + 'px;width:' + gs.toFixed(1) + 'px;height:' + (gs * 0.42).toFixed(1) + 'px';
      parent.appendChild(gp);
      gp.animate([{ transform: 'translate(-50%,-50%) scale(.4,.6)', opacity: 0.95 }, { transform: 'translate(-50%,-50%) scale(1)', opacity: 0.9, offset: 0.18, easing: 'ease-out' },
        { transform: 'translate(-50%,-50%) scale(1.1,.9)', opacity: 0 }], { duration: B.gooMs, easing: 'ease-in' }).onfinish = function () { gp.remove(); };
    }
  }
                                                                                                      
                                                                                               
                                                                                                     
                                                                                                   
                                                                                                     
  function waddleFrames(T, size, rand) {
    var W = PARAMS.waddle, r = rand || Math.random;
    var n = Math.max(2, Math.round(T / W.stepS)), d = 1 / n;
    var frames = [{ offset: 0, transform: tf(0, 1, 1, 0), easing: 'ease-in-out' }];
    var legs = { l: [{ offset: 0, v: 0 }], r: [{ offset: 0, v: 0 }] }, arms = { l: [{ offset: 0, v: 0 }], r: [{ offset: 0, v: 0 }] };
    var contacts = [], rock = 0;
    for (var k = 0; k < n; k++) {
      var side = k % 2 ? -1 : 1, t0 = k * d, R = W.rock * side * (0.85 + 0.3 * r()), lift = W.lift * size, q = W.squash;
      var step = side > 0 ? 'r' : 'l', still = side > 0 ? 'l' : 'r', last = k === n - 1;
      frames.push({ offset: t0 + d * 0.45, transform: tf(-lift, 0.98, 1.03, R * 0.2), easing: 'cubic-bezier(.4,0,.6,1)' });                                        
      frames.push({ offset: t0 + d * 0.8, transform: tf(0, 1 + q, 1 - q, R), easing: 'cubic-bezier(.2,.7,.4,1)' });                                       
      rock = R * 0.95;
      frames.push({ offset: last ? 1 : t0 + d, transform: tf(0, 1, 1, rock), easing: 'ease-in-out' });
                                                                                           
      legs[step].push({ offset: t0 + d * 0.05, v: 0 }, { offset: t0 + d * 0.45, v: 1 }, { offset: t0 + d * 0.8, v: 0 });
                                                                                   
      arms[step].push({ offset: t0 + d * 0.45, v: 1.3 }, { offset: last ? 1 : t0 + d * 0.8, v: 1 });
      arms[still].push({ offset: t0 + d * 0.45, v: 0.75 }, { offset: last ? 1 : t0 + d * 0.8, v: 1 });
      contacts.push({ at: t0 + d * 0.8, side: side });
    }
    ['l', 'r'].forEach(function (s2) {
      if (legs[s2][legs[s2].length - 1].offset < 1) legs[s2].push({ offset: 1, v: 0 });
      if (arms[s2][arms[s2].length - 1].offset < 1) arms[s2].push({ offset: 1, v: 1 });
    });
    return { frames: frames, legs: legs, arms: arms, contacts: contacts, steps: n, end: { rock: rock } };
  }
  function outward(side) { return side === 'l' ? 1 : -1; }                                                               
                                                                               
                                                                               
                                                 
  function jiggle(spriteEl, power) {
    if (!spriteEl || !spriteEl.isConnected) return;
    var J = PARAMS.jiggle, p = power || 1;
    var parts = spriteEl.querySelectorAll('.frog-stack img.fs-head, .frog-stack img.fs-back');
    for (var i = 0; i < parts.length; i++) {
      if (!parts[i].animate) continue;
      parts[i].animate([
        { translate: '0 0' },
        { translate: '0 ' + (J.drop * 100 * p).toFixed(2) + '%', offset: 0.3, easing: 'cubic-bezier(.3,0,.2,1)' },
        { translate: '0 ' + (-J.spring * 100 * p).toFixed(2) + '%', offset: 0.65, easing: 'ease-in-out' },
        { translate: '0 0' }
      ], { duration: J.ms * (i % 2 ? 1.12 : 1), delay: i % 2 ? 30 : 0, easing: 'ease-out' });
    }
  }
                                                                                
                                                                            
  function travel(spriteEl, o, ms, easing) {
    var box = spriteEl.offsetParent || spriteEl.parentElement;
    if (!box || !o.from || !o.to) return;
    var dx = (o.from.x - o.to.x) / 100 * box.offsetWidth, dy = (o.from.y - o.to.y) / 100 * box.offsetHeight;
    animate(spriteEl, [{ translate: dx.toFixed(1) + 'px ' + dy.toFixed(1) + 'px' }, { translate: '0px 0px' }], { duration: ms, easing: easing }, true);
  }

                                                                                                     
                                                                      
                                                                                                                          
                                                                        
  function travelWay(spriteEl, o, ms, way, wayAt, skidEvery) {
    var box = spriteEl.offsetParent || spriteEl.parentElement;
    if (!box || !o.from || !o.to) return;
    var dx = (o.from.x - o.to.x) / 100 * box.offsetWidth, dy = (o.from.y - o.to.y) / 100 * box.offsetHeight;
    animate(spriteEl, way.map(function (w, i) {
      var f = { offset: wayAt[i], translate: (dx * (1 - w)).toFixed(1) + 'px ' + (dy * (1 - w)).toFixed(1) + 'px' };
      if (i < way.length - 1) f.easing = (skidEvery && i % skidEvery === skidEvery - 1) ? 'cubic-bezier(.2,.7,.4,1)' : 'linear';
      return f;
    }), { duration: ms }, true);
  }

                                                                                               
                                                                                                       
                                                                                                 
                                                                                                  
                                                                                                
                                                                                                   
                                                                                                
                                                                                                
                                                                                       
                                                   
                                                                                                 
                                                                                                 
                                                                                                         
  function flop(stack, o) {
    o = o || {};
    var F = PARAMS.flop, v = (stack && stack.dataset && stack.dataset.flop || '').split(' ').map(Number);
    if (!stack || !stack.animate || v.length < 5 || v.some(isNaN)) return null;
    var drawn = stack.querySelector('img.fs-flop:not(.fs-flop-leg)');                                                            
    if (drawn && drawn.style && drawn.style.display === 'none') return null;
    var anims = [], timers = [], delay = o.delay || 0;
    var play = o.animate || function (el, fr, op) { return el.animate(fr, op); };
    var wait = o.later || function (ms, fn) { timers.push(setTimeout(fn, ms)); };
    var U = F.up, hold = o.holdMs != null ? o.holdMs : rnd(F.holdMs), downMs = F.squashMs + F.splatMs, g0 = downMs + hold;
                                                                                        
    var t1 = g0 + U.liftMs, t4 = t1 + U.slamMs, t5 = t4 + U.pushMs, t6 = t5 + U.riseMs;
    var T = t6 + U.landMs, at = function (ms) { return ms / T; };
    var swap = at(F.squashMs), down = at(downMs), rise = at(g0), back = at(t5), splat = swap + (down - swap) * 0.4;
    var body = stack.querySelector('img.fs-flop:not(.fs-flop-leg)') || stack.querySelector('img'), push = -F.pushUp * ((body && body.offsetWidth) || 140);
    var opts = { duration: T, delay: delay };
    function k(offset, sx, sy, ty, easing) { var f = { offset: offset, scale: sx + ' ' + sy, translate: '0 ' + (ty || 0).toFixed(1) + 'px' }; if (easing) f.easing = easing; return f; }
    anims.push(play(stack, [
      k(0, 1, 1, 0, 'cubic-bezier(.2,.75,.45,1)'),                                                       
      k(swap, 1.22, 0.7, 0, 'linear'),                                                                  
      k(swap + 0.002, 0.9, 1.08, 0, 'cubic-bezier(.2,.75,.35,1)'),                                     
      k(splat, 1.09, 0.9, 0, 'ease-in-out'),                                     
      k(down, 0.98, 1.03, 0, 'ease-in-out'),
      k(down + (rise - down) * 0.5, 1.025, 0.975, 0, 'ease-in-out'),                                
      k(rise, 1, 1, 0, 'ease-out'),
      k(at(t1), 1.03, 0.97, 0, 'cubic-bezier(.6,0,.9,.4)'),                              
      k(at(t4), 1.1, 0.9, 0, 'cubic-bezier(.2,.7,.4,1)'),                                                      
      k(back, 0.94, 1.08, push * 0.6, 'linear'),                                                            
      k(back + 0.002, 0.92, 1.1, push * 0.6, 'cubic-bezier(.25,.6,.45,1)'),
      k(at(t6), 0.97, 1.04, push, 'cubic-bezier(.5,0,.85,.5)'),                  
      k(at(t6 + U.landMs * 0.4), 1.12, 0.88, 0, 'cubic-bezier(.2,.7,.4,1)'),           
      k(at(t6 + U.landMs * 0.7), 0.97, 1.03, 0, 'ease-in-out'),
      k(1, 1, 1, 0)
    ], opts));
                                                                                                         
    Array.prototype.forEach.call(stack.querySelectorAll('img.fs-flop-leg'), function (leg) {
      var pv = (leg.dataset.pivot || '').split(' ').map(Number), pw = (leg.dataset.paw || '').split(' ').map(Number);
      var s = pw[0] < pv[0] ? 1 : -1, slapIn = 'cubic-bezier(.6,0,.9,.4)', liftUp = 'cubic-bezier(.2,.7,.4,1)';
      function r(offset, deg, easing) { var f = { offset: offset, rotate: (s * deg).toFixed(1) + 'deg' }; if (easing) f.easing = easing; return f; }
      anims.push(play(leg, [r(0, 0), r(rise, 0, liftUp), r(at(t1), F.liftDeg, slapIn), r(at(t4), -F.pressDeg, 'ease-out'), r(back, 6), r(1, 0)], opts));
    });
    var rig = 'translate(' + v[0] + '%,' + v[1] + '%) scale(' + v[2] + ')', rigBack = 'translate(' + v[3] + '%,' + v[4] + '%)';
    Array.prototype.forEach.call(stack.querySelectorAll('img.fs-head, img.fs-mouth, img.fs-back'), function (img) {
      var a = img.style.transform || 'none', m = (img.classList.contains('fs-back') ? rigBack : rig) + (a === 'none' ? '' : ' ' + a);
      anims.push(play(img, [{ offset: 0, transform: a }, { offset: swap * 0.85, transform: a, easing: 'cubic-bezier(.3,.7,.4,1)' },
        { offset: splat, transform: m }, { offset: back, transform: m, easing: 'cubic-bezier(.3,.7,.4,1)' },
        { offset: at(t6), transform: a }, { offset: 1, transform: a }], opts));
    });
    wait(delay + T * swap, function () { stack.classList.add('fs-flopped'); });
    wait(delay + T * splat, function () { if (o.onLand) o.onLand(); });
    wait(delay + t4, function () { pats(stack, 1); if (o.onSlap) o.onSlap(1); });
    wait(delay + T * back, function () { stack.classList.remove('fs-flopped'); if (o.onUp) o.onUp(); });
    wait(delay + t6 + U.landMs * 0.4, function () { if (o.onTouch) o.onTouch(); });
    if (o.onDone) wait(delay + T, o.onDone);
    return { ms: delay + T, cancel: function () {
      timers.forEach(clearTimeout); timers = [];
      anims.forEach(function (a) { try { if (a) a.cancel(); } catch (e) {} });
      stack.classList.remove('fs-flopped');
    } };
  }

                                                                                                        
  function pats(stack, power) {
    if (!stack.isConnected || !root.document || (root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches)) return;
    Array.prototype.forEach.call(stack.querySelectorAll('img.fs-flop-leg'), function (leg) {
      var pw = (leg.dataset.paw || '').split(' ').map(Number); if (pw.length < 2 || isNaN(pw[0])) return;
      var p = document.createElement('span');
      p.className = 'fa-pat';
      p.style.left = 'calc(var(--fs-l) + var(--fs-frame, var(--fs-zoom)) * ' + (pw[0] / 100).toFixed(4) + ')';
      p.style.top = 'calc(var(--fs-t) + var(--fs-frame, var(--fs-zoom)) * ' + (pw[1] / 100).toFixed(4) + ')';
      stack.appendChild(p);
      p.animate([{ transform: 'translate(-50%,-50%) scale(.3)', opacity: 0.9 }, { transform: 'translate(-50%,-50%) scale(' + (0.9 + 0.5 * power).toFixed(2) + ')', opacity: 0 }],
        { duration: 300, easing: 'cubic-bezier(.2,.7,.4,1)' }).onfinish = function () { p.remove(); };
    });
  }

                                                                                                                      
                                                                                                                         
  function step(spriteEl, hopEl, gait, o) {
    if (!spriteEl || !hopEl) return;
    var art = hopEl.querySelector('.frog-art') || hopEl;
    var size = art.offsetWidth || 80, ms = o.dur * 1000;
    reset(hopEl, true);
    if (root.FrogArms) root.FrogArms.stopIdle(hopEl.querySelector('.frog-stack'));                                                      
    hopEl.classList.remove('idle', 'tinkering', 'walking');
    hopEl.classList.add('fg-moving');                                                                                 
    hopEl.style.animation = 'none';
    if (gait === 'crawl') {
      var Cw = PARAMS.crawl, cf = crawlFrames(o.dur, size);
      travelWay(spriteEl, o, ms, cf.way, cf.wayAt);
      animate(hopEl, cf.frames, { duration: ms }, true);
                                                                                                               
      var layer = spriteEl.parentElement, back = o.from && o.to ? (o.to.x >= o.from.x ? -1 : 1) : (o.back || 1), nb = 0;
      for (var tb = rnd(Cw.bubbleMs) * 0.5; tb < ms; tb += rnd(Cw.bubbleMs)) {
        (function (t, k) {
          later(hopEl, t, function () {
            var st3 = spriteEl.querySelector('.frog-stack'); if (!layer || !st3 || !spriteEl.isConnected) return;
            var lr = layer.getBoundingClientRect(), rr = st3.getBoundingClientRect(), kk = layer.offsetWidth ? lr.width / layer.offsetWidth : 1;
            if (!kk || !rr.width) return;
            var w = rr.width / kk, x = (rr.left + rr.width / 2 - lr.left) / kk + back * (0.2 + 0.12 * Math.random()) * w;
            var y = (rr.top + rr.height * PARAMS.splash.feet - lr.top) / kk - Math.random() * 0.3 * w;                                      
            bubble(layer, x, y, w, k % PARAMS.bubble.gooEvery === PARAMS.bubble.gooEvery - 1);
          });
        })(tb, nb++);
      }
                                                                                
      animate(hopEl, [
        { transform: tf(0, 1, 1), easing: 'ease-out' },
        { transform: tf(0, 1.07, 0.94), offset: 0.22, easing: 'ease-in-out' },
        { transform: tf(0, 0.96, 1.05), offset: 0.48, easing: 'ease-in-out' },
        { transform: tf(0, 1.02, 0.985), offset: 0.74, easing: 'ease-in-out' },
        { transform: tf(0, 1, 1) }
      ], { duration: Cw.settleS * 1000, delay: ms }, true);
      later(hopEl, ms, function () { jiggle(spriteEl, 0.5); });
      return;
    }
    if (gait === 'leap') {
      var Lp = PARAMS.leap, lf = leapFrames(o.dur, size);
      travelWay(spriteEl, o, ms, lf.way, lf.wayAt, 3);
      animate(hopEl, lf.frames, { duration: ms }, true);
      lf.contacts.forEach(function (c, k) {
        later(hopEl, ms * c, function () { splash(spriteEl, size, 0, k === lf.leaps - 1 ? 1.1 : 0.9); jiggle(spriteEl, 1); });
      });
                                                                                        
      var st2 = hopEl.querySelector('.frog-stack');
      if (st2 && st2.querySelector('img.fs-croak')) {
        later(hopEl, ms + 60, function () {
          if (!st2.isConnected) return;
          st2.classList.add('fs-croaking');
          animate(st2, [{ scale: '1 1' }, { scale: '1.04 0.985', offset: 0.3, easing: 'ease-in-out' }, { scale: '1.02 0.993', offset: 0.75 }, { scale: '1 1' }],
            { duration: Lp.croakMs, easing: 'cubic-bezier(.2,.8,.4,1)' }, true);
          later(hopEl, Lp.croakMs, function () { st2.classList.remove('fs-croaking'); });
        });
      }
      return;
    }
    travel(spriteEl, o, ms, ease(gait));
    if (gait === 'waddle') {
      var Wd = PARAMS.waddle, wd = waddleFrames(o.dur, size), stk = hopEl.querySelector('.frog-stack');
      animate(hopEl, wd.frames, { duration: ms }, true);
      if (stk) {
                                                                                      
        Array.prototype.forEach.call(stk.querySelectorAll('img.fs-foot'), function (leg) {
          var sd = leg.dataset.foot === 'l' ? 'l' : 'r', o2 = outward(sd);
          animate(leg, wd.legs[sd].map(function (k) {
            return { offset: k.offset, rotate: (o2 * Wd.legDeg * k.v).toFixed(1) + 'deg', translate: '0 ' + (-Wd.legUp * k.v).toFixed(2) + '%', easing: 'ease-in-out' };
          }), { duration: ms }, true);
        });
        Array.prototype.forEach.call(stk.querySelectorAll('img.fs-arm'), function (arm) {
          var sd = arm.dataset.arm === 'l' ? 'l' : 'r', o2 = outward(sd), ks = wd.arms[sd];
          animate(arm, ks.map(function (k) { return { offset: k.offset, rotate: (o2 * Wd.armOut * k.v).toFixed(1) + 'deg', easing: 'ease-in-out' }; }), { duration: ms }, true);
                                                  
          animate(arm, [{ rotate: (o2 * Wd.armOut).toFixed(1) + 'deg' }, { rotate: (o2 * Wd.armOut * 0.4).toFixed(1) + 'deg', offset: 0.45, easing: 'ease-in-out' }, { rotate: '0deg' }],
            { duration: Wd.settleS * 1000, delay: ms, easing: 'ease-out' }, true);
        });
      }
      wd.contacts.forEach(function (c) { later(hopEl, ms * c.at, function () { splash(spriteEl, size, c.side, 0.35); jiggle(spriteEl, 0.35); }); });
                                                                    
      var R0 = wd.end.rock;
      animate(hopEl, [
        { transform: tf(0, 1, 1, R0), easing: 'ease-in-out' },
        { transform: tf(0, 1.02, 0.98, -R0 * 0.55), offset: 0.38, easing: 'ease-in-out' },
        { transform: tf(0, 1, 1, R0 * 0.22), offset: 0.7, easing: 'ease-in-out' },
        { transform: tf(0, 1, 1, 0) }
      ], { duration: Wd.settleS * 1000, delay: ms }, true);
      return;
    }
    if (gait === 'roll') {
      var R = PARAMS.roll;
      var a1 = rollAngle(0, 1, tripPx(o), size);
                                                                                                    
      var stack = hopEl.querySelector('.frog-stack'), flops = !!(stack && stack.dataset.flop);
      var bf = bounceFrames(o.dur, size, null, flops);
      art.style.rotate = '0deg';
      animate(art, rollTurnFrames(bf.bounces, a1), { duration: ms }, true);
      animate(hopEl, bf.frames, { duration: ms }, true);
      bf.contacts.forEach(function (c, k) {
        if (flops && k === bf.contacts.length - 1) return;                                                        
        var pw = !flops && k >= bf.contacts.length - R.lastBounces ? 0.75 : 1.15;
        later(hopEl, ms * c, function () { splash(spriteEl, size, 0, pw); jiggle(spriteEl, pw); });
      });
                                                          
      if (flops && flop(stack, { delay: ms, animate: function (el, fr, op) { return animate(el, fr, op, true); },
                        later: function (t, fn) { later(hopEl, t, fn); },
                        onLand: function () { splash(spriteEl, size, 0, 1.25); jiggle(spriteEl, 0.6); },
                        onSlap: function (pw) { splash(spriteEl, size, 0, 0.6 + 0.5 * pw); jiggle(spriteEl, 0.4 * pw); },
                        onTouch: function () { splash(spriteEl, size, 0, 0.9); jiggle(spriteEl, 1); } })) return;
                                                                                              
      var H = R.height * size, s1 = R.settle[0] * H, s2 = R.settle[1] * H, sm = R.settleS * 1000;
      animate(hopEl, [
        { offset: 0, transform: tf(0, 1, 1), easing: 'cubic-bezier(.4,0,.2,1)' },
        { offset: 0.1, transform: tf(0, 1.16, 0.84), easing: 'cubic-bezier(.25,.6,.45,1)' },
        { offset: 0.2, transform: tf(-s1 * 0.3, 0.95, 1.06), easing: 'cubic-bezier(.3,.7,.6,1)' },
        { offset: 0.32, transform: tf(-s1, 1.01, 0.99), easing: 'cubic-bezier(.4,0,.75,.4)' },
        { offset: 0.46, transform: tf(0, 1, 1), easing: 'cubic-bezier(.4,0,.2,1)' },
        { offset: 0.53, transform: tf(0, 1.09, 0.91), easing: 'cubic-bezier(.25,.6,.45,1)' },
        { offset: 0.63, transform: tf(-s2, 1, 1), easing: 'cubic-bezier(.4,0,.75,.4)' },
        { offset: 0.74, transform: tf(0, 1, 1), easing: 'ease-out' },
        { offset: 0.82, transform: tf(0, 1.04, 0.96), easing: 'ease-in-out' },
        { offset: 1, transform: tf(0, 1, 1) }
      ], { duration: sm, delay: ms }, true);
      animate(art, [
        { rotate: a1 + 'deg', easing: 'ease-out' }, { rotate: (a1 + R.settleDeg) + 'deg', offset: 0.3, easing: 'ease-in-out' },
        { rotate: (a1 - R.settleDeg * 0.45) + 'deg', offset: 0.6, easing: 'ease-in-out' },
        { rotate: (a1 + R.settleDeg * 0.12) + 'deg', offset: 0.82, easing: 'ease-in-out' }, { rotate: a1 + 'deg' }
      ], { duration: sm, delay: ms }, true);
      later(hopEl, ms + sm * 0.46, function () { splash(spriteEl, size, 0, 0.5); jiggle(spriteEl, 0.5); });
      return;
    }
    if (gait === 'stomp') {
      var S = PARAMS.stomp, wf = walkFrames(o.dur, size);
      animate(hopEl, wf.frames, { duration: ms }, true);
                                                                                                                            
      if (root.FrogArms) root.FrogArms.walk(spriteEl, wf, ms, S.stopS * 1000, animate);
      wf.contacts.forEach(function (c) {
        later(hopEl, ms * c.at, function () { splash(spriteEl, size, c.side, c.power); jiggle(spriteEl, c.power * 0.9); });
      });
                                                                               
                                                                            
                                                                              
                                                   
      var T2 = S.stopTip, sm2 = S.stopS * 1000, up2 = -S.stopLift * size, L0 = wf.end.lean, X0 = wf.end.shift;
      animate(hopEl, [
        { transform: tf(0, 1.02, 0.98, L0, X0), easing: 'cubic-bezier(.5,0,.8,.5)' },
        { transform: tf(up2, 0.96, 1.05, T2, 0.06 * size), offset: 0.2, easing: 'cubic-bezier(.2,.8,.4,1)' },                               
        { transform: tf(0, 1.12, 0.88, T2 * 0.5, 0.07 * size), offset: 0.34, easing: 'ease-in-out' },                                      
        { transform: tf(up2 * 0.3, 0.97, 1.03, -T2 * 0.5, -0.02 * size), offset: 0.52, easing: 'ease-in-out' },                             
        { transform: tf(0, 1.05, 0.95, T2 * 0.28, 0.01 * size), offset: 0.68, easing: 'ease-in-out' },
        { transform: tf(0, 0.99, 1.01, -T2 * 0.12, 0), offset: 0.82, easing: 'ease-in-out' },
        { transform: tf(0, 1.01, 0.99, T2 * 0.04, 0), offset: 0.92, easing: 'ease-out' },
        { transform: tf(0, 1, 1, 0, 0) }
      ], { duration: sm2, delay: ms }, true);
      later(hopEl, ms + sm2 * 0.34, function () { splash(spriteEl, size, 1, 1.2); jiggle(spriteEl, 1.2); });
      later(hopEl, ms + sm2 * 0.68, function () { jiggle(spriteEl, 0.6); });
    }
  }

                                                                              
                                                                        
                                                                         
  function splash(spriteEl, size, side, power) {
    var layer = spriteEl && spriteEl.parentElement;
    if (!layer || !spriteEl.isConnected || !layer.animate) return;
    if (root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var stack = spriteEl.querySelector('.frog-stack'); if (!stack) return;
    var P = PARAMS.splash, lr = layer.getBoundingClientRect(), r = stack.getBoundingClientRect();
    var k = layer.offsetWidth ? lr.width / layer.offsetWidth : 1;
    if (!k || !r.width) return;
    var w = r.width / k;
    var x = (r.left + r.width / 2 - lr.left) / k + side * 0.16 * w, y = (r.top + r.height * P.feet - lr.top) / k;
    power = power || 1;
    var ring = document.createElement('div');
    ring.className = 'fg-ring';
    var rw = P.ring * w * (side ? 0.7 : 1) * Math.sqrt(power);
    ring.style.cssText = 'left:' + x + 'px;top:' + y + 'px;width:' + rw + 'px;height:' + (rw * 0.36) + 'px';
    layer.appendChild(ring);
    ring.animate([{ transform: 'translate(-50%,-50%) scale(.25)', opacity: 0.95 }, { transform: 'translate(-50%,-50%) scale(1)', opacity: 0 }],
      { duration: 560, easing: 'cubic-bezier(.2,.7,.4,1)' }).onfinish = function () { ring.remove(); };
    var n = Math.round(rnd(P.drops) * Math.min(1.5, power));
    for (var j = 0; j < n; j++) {
      var d = document.createElement('div'), ds = P.dropSize * w * (0.7 + Math.random() * 0.6);
      d.className = 'fg-drop';
      d.style.cssText = 'left:' + x + 'px;top:' + y + 'px;width:' + ds + 'px;height:' + ds + 'px';
      layer.appendChild(d);
                                                                                       
      var dir = side ? side : (j % 2 ? 1 : -1);
      var dx = dir * rnd(P.reach) * w * power * (0.6 + 0.4 * Math.random()), up = -rnd(P.rise) * w * power, dur = rnd(P.ms);
      d.animate([
        { transform: 'translate(-50%,-50%) translate(0,0) scale(.6)', opacity: 1 },
        { transform: 'translate(-50%,-50%) translate(' + (dx * 0.55) + 'px,' + up + 'px) scale(1)', opacity: 1, offset: 0.45, easing: 'ease-in' },
        { transform: 'translate(-50%,-50%) translate(' + dx + 'px,' + (up * 0.1) + 'px) scale(.5)', opacity: 0 }
      ], { duration: dur, easing: 'cubic-bezier(.2,.7,.4,1)' }).onfinish = (function (el) { return function () { el.remove(); }; })(d);
    }
  }

                                                                               
                                                                               
                                                                                 
  function reset(hopEl, all) {
    if (!hopEl) return;
    if (all) { (hopEl._gaitTimers || []).forEach(root.PondPause ? root.PondPause.cancel : clearTimeout); hopEl._gaitTimers = []; }                                      
    var art = hopEl.querySelector ? (hopEl.querySelector('.frog-art') || null) : null;
                                                                                               
    var spr = hopEl.parentElement;
    if (all && spr && spr.style && (spr._gaitAnims || []).length && root.getComputedStyle) {
      var t = root.getComputedStyle(spr).translate, box = spr.offsetParent || spr.parentElement;
      if (t && t !== 'none' && box && box.offsetWidth) {
        var m = t.split(' ').map(parseFloat);
        spr.style.left = ((parseFloat(spr.style.left) || 0) + (m[0] || 0) / box.offsetWidth * 100) + '%';
        spr.style.top = ((parseFloat(spr.style.top) || 0) + (m[1] || 0) / box.offsetHeight * 100) + '%';
      }
    }
    var parts = hopEl.querySelectorAll ? Array.prototype.slice.call(hopEl.querySelectorAll(PARTS)) : [];
    var stack = hopEl.querySelector ? hopEl.querySelector('.frog-stack') : null;
    if (all && stack) stack.classList.remove('fs-flopped', 'fs-croaking');                                                        
    [hopEl, art, hopEl.parentElement].concat(parts).forEach(function (el) {
      if (!el) return;
      el._gaitAnims = (el._gaitAnims || []).filter(function (a) {
        if (!all && a._gaitKeep) return true;
        try { a.cancel(); } catch (e) {}
        return false;
      });
    });
    if (hopEl.classList) hopEl.classList.remove('fg-moving');
                                                       
    if (all && spr && spr.querySelectorAll) Array.prototype.forEach.call(spr.querySelectorAll('.fg-dizzy'), function (d) { d.remove(); });
                                                                               
    if (art && !art._gaitAnims.length) { art.style.rotate = ''; art._gaitAngle = 0; }
  }

                                                                                                    
                                                                                                
                                 
  function bonkFrames(size) {
    var P = PARAMS.bonk, s = size || 70, up = -P.up * s, sq = P.squash, W = P.wobble;
    var fly = (P.holdAt + P.landAt) / 2, hitAt = P.lungeAt + 0.025;
    return {
      hop: [
        { transform: tf(0, 1, 1), easing: 'ease-in' },
        { transform: tf(0, 0.93, 1.08), offset: P.lungeAt, easing: 'linear' },                                                 
        { transform: tf(0, sq[0], sq[1]), offset: hitAt, easing: 'linear' },                                                   
        { transform: tf(0, sq[0] + 0.03, sq[1] - 0.03), offset: P.holdAt, easing: 'cubic-bezier(.2,.8,.4,1)' },                
        { transform: tf(up, 0.94, 1.08), offset: fly, easing: 'cubic-bezier(.45,0,.8,.45)' },                               
        { transform: tf(0, 1.24, 0.78), offset: P.landAt, easing: 'cubic-bezier(.2,.8,.4,1)' },                      
        { transform: tf(up * 0.2, 0.95, 1.06), offset: P.landAt + 0.1, easing: 'ease-in' },                               
        { transform: tf(0, 1.07, 0.94), offset: P.skidAt, easing: 'ease-out' },
        { transform: tf(0, 1, 1) }
      ],
      turn: [
        { rotate: '0deg', easing: 'ease-in' },
        { rotate: '-7deg', offset: P.lungeAt, easing: 'linear' },                                                        
        { rotate: '-4deg', offset: P.holdAt, easing: 'cubic-bezier(.2,.7,.4,1)' },
        { rotate: P.tumble + 'deg', offset: fly, easing: 'ease-in-out' },                                                      
        { rotate: W[0] + 'deg', offset: P.landAt + 0.06, easing: 'ease-in-out' },                                                
        { rotate: W[1] + 'deg', offset: P.landAt + 0.15, easing: 'ease-in-out' },
        { rotate: W[2] + 'deg', offset: P.landAt + 0.24, easing: 'ease-in-out' },
        { rotate: W[3] + 'deg', offset: P.landAt + 0.31 },
        { rotate: '0deg' }
      ]
    };
  }
                                                                                                     
                                                                               
  function bonkTravel(ox, oy, lx, ly) {
    var P = PARAMS.bonk, at = function (x, y) { return x.toFixed(1) + 'px ' + y.toFixed(1) + 'px'; };
    return [
      { translate: at(ox, oy), easing: 'cubic-bezier(.5,0,.9,.6)' },
      { translate: at(ox + lx, oy + ly), offset: P.lungeAt, easing: 'linear' },                                            
      { translate: at(ox + lx * 0.7, oy + ly * 0.7), offset: P.holdAt, easing: 'cubic-bezier(.2,.55,.45,1)' },                     
      { translate: at(ox * P.skid, oy * P.skid), offset: P.landAt, easing: 'cubic-bezier(.3,.6,.5,1)' },                     
      { translate: at(0, 0), offset: P.skidAt },                                                                             
      { translate: at(0, 0) }
    ];
  }

                                                                             
                                                                              
                                                                              
                                                                            
                                                                          
                                                                             
                                                                             
                                                                               
                                                                                    
  function bounceApart(aId, bId) {
    var S = (typeof wanderingSprites !== 'undefined') ? wanderingSprites : null;
    var A = S && S[aId], B = S && S[bId];
    if (!A || !B || A.presenting || B.presenting) return false;
    if (root.PondMotion && (root.PondMotion.heldForDrag(aId) || root.PondMotion.heldForDrag(bId))) return false;
    var layer = A.el.parentElement; if (!layer || !layer.animate) return false;
    var lr = layer.getBoundingClientRect(), k = layer.offsetWidth ? lr.width / layer.offsetWidth : 1;
    var ra = A.el.getBoundingClientRect(), rb = B.el.getBoundingClientRect();
    var dx = (ra.left + ra.width / 2) - (rb.left + rb.width / 2), dy = (ra.top + ra.height / 2) - (rb.top + rb.height / 2);
    var d = Math.hypot(dx, dy);
    if (d < 1) { var t = Math.random() * Math.PI * 2; dx = Math.cos(t); dy = Math.sin(t); d = 1; }
    var ux = dx / d, uy = dy / d;
    var X = { x0: 6, x1: 92 }, Y = { y0: 1, y1: 95 };
    try { if (root.PondGrow) X = root.PondGrow.widen(6, 92, 0, 0, root.PondGrow.current()); } catch (e) {}
    try { Y = { y0: GATE_BAND.y0, y1: MERGE_AREA.y1 }; } catch (e) {}
    var P = PARAMS.bonk, ms = P.ms;
    var mid = { x: (ra.left + ra.width / 2 + rb.left + rb.width / 2) / 2, y: (ra.top + ra.height / 2 + rb.top + rb.height / 2) / 2 };
    var bigger = Math.max(ra.width, rb.width) / k, gap = d / k;
    bonkBurst(layer, (mid.x - lr.left) / k, (mid.y - lr.top) / k, bigger, P.lungeAt * ms);
    bonkSound(P.lungeAt * ms);
    try { var n = root.navigator; if (n && n.vibrate && (!n.userActivation || n.userActivation.hasBeenActive)) n.vibrate(30); } catch (e) {}
    [[A, aId, 1], [B, bId, -1]].forEach(function (s) {
      var spr = s[0], id = s[1], dir = s[2], hop = spr.el.querySelector('.frog-hop'), art = hop && hop.querySelector('.frog-art');
      if (!hop) return;
      (root.PondPause ? root.PondPause.cancel : clearTimeout)(spr.timer); reset(hop, true);
      if (root.FrogArms) root.FrogArms.stopIdle(hop.querySelector('.frog-stack'));
      spr.moving = true;
      var size = (spr.el.querySelector('.frog-stack') || spr.el).getBoundingClientRect().width / k || 70;
      var head = headSpot(spr.el);                                                                                    
      var push = size * P.push;                                                                     
                                                                                         
      var lunge = Math.max(0.05 * size, Math.min(P.lunge * size, (gap - 0.55 * size) / 2));
      var L0 = parseFloat(spr.el.style.left) || 50, T0 = parseFloat(spr.el.style.top) || 50;
      var L1 = Math.max(X.x0, Math.min(X.x1, L0 + ux * dir * push / layer.offsetWidth * 100));
      var T1 = Math.max(Y.y0, Math.min(Y.y1, T0 + uy * dir * push / layer.offsetHeight * 100));
      try { var tv = ftueCinematicActive() && ftueTvBox(spr.el); if (tv) { L1 = Math.max(tv.x0, Math.min(tv.x1, L1)); T1 = Math.max(tv.y0, Math.min(tv.y1, T1)); } } catch (e) {}
      var flyL = L1 < L0;
      spr.el.style.transition = 'none';
      spr.el.style.transform = (typeof frogFacing === 'function') ? frogFacing(id, L0, L1) : (flyL ? 'scaleX(-1)' : 'scaleX(1)');                                                    
      if (head && /scaleX\(-1\)/.test(spr.el.style.transform) !== head.mirrored) head.x = 1 - head.x;                                      
      spr.el.style.left = L1 + '%'; spr.el.style.top = T1 + '%';
      var ox = (L0 - L1) / 100 * layer.offsetWidth, oy = (T0 - T1) / 100 * layer.offsetHeight;
      hop.classList.remove('idle'); hop.classList.add('fg-moving'); hop.style.animation = 'none';
      var fr = bonkFrames(size);
      animate(spr.el, bonkTravel(ox, oy, -ux * dir * lunge, -uy * dir * lunge), { duration: ms }, true);
      animate(hop, fr.hop, { duration: ms }, true);
                                           
      animate(hop, [{ filter: 'drop-shadow(0 0 0 rgba(255,64,64,0)) brightness(1)' },
        { filter: 'drop-shadow(0 0 8px rgba(255,64,64,.95)) brightness(1.22)', offset: P.lungeAt + 0.02 },
        { filter: 'drop-shadow(0 0 0 rgba(255,64,64,0)) brightness(1)', offset: P.flashAt }, { filter: 'none' }], { duration: ms }, true);
      if (art) animate(art, fr.turn, { duration: ms }, true);
      later(hop, ms * P.landAt, function () {
        splash(spr.el, size, 0, 1.35); jiggle(spr.el, 1.4);
        if (dir === 1) plopSound();
        dizzy(spr.el, head, P.dizzyMs);
      });
      later(hop, ms + 30, function () {
        spr.moving = false;
        try { frogRest(hop); } catch (e) { reset(hop); }
        spr.timer = (root.PondPause ? root.PondPause.later : setTimeout)(function () { try { scheduleWander(id); } catch (e) {} }, 1300 + Math.random() * 1400);
      });
    });
    return true;
  }
                                                                                              
                                                                                               
                                                                                                  
                                                                           
  function plopFrames(size) {
    var P = PARAMS.plop, s = size || 70;
    return [
      { transform: tf(0, P.held[0], P.held[1]), easing: 'cubic-bezier(.2,.7,.4,1)' },
      { transform: tf(-P.toss * s, 0.92, 1.1), offset: P.tossAt, easing: 'cubic-bezier(.55,0,.9,.45)' },                            
      { transform: tf(0, 0.94, 1.1), offset: P.contactAt, easing: 'cubic-bezier(.2,.8,.4,1)' },                                   
      { transform: tf(0, P.squash[0], P.squash[1]), offset: P.squashAt, easing: 'cubic-bezier(.3,0,.3,1)' },         
      { transform: tf(-P.reboundUp * s, P.rebound[0], P.rebound[1]), offset: P.reboundAt, easing: 'ease-in-out' },
      { transform: tf(0, P.settle[0], P.settle[1]), offset: P.settleAt, easing: 'ease-out' },
      { transform: tf(0, 1, 1) }
    ];
  }
  function plop(spriteEl) {
    var hop = spriteEl && spriteEl.querySelector('.frog-hop');
    if (!hop || !spriteEl.isConnected || !hop.animate) return false;
    var P = PARAMS.plop, layer = spriteEl.parentElement, lr = layer.getBoundingClientRect();
    var k = layer.offsetWidth ? lr.width / layer.offsetWidth : 1;
    var size = (spriteEl.querySelector('.frog-stack') || spriteEl).getBoundingClientRect().width / (k || 1) || 70;
    reset(hop, true);
    hop.classList.remove('idle'); hop.style.animation = 'none';                                                         
    animate(hop, plopFrames(size), { duration: P.ms }, true);
                                                            
    animate(spriteEl, [{ filter: 'drop-shadow(0 10px 12px rgba(74,52,35,0.45))' },
      { filter: 'drop-shadow(0 0px 0px rgba(74,52,35,0))', offset: P.contactAt }, { filter: 'none' }], { duration: P.ms }, true);
    var art = hop.querySelector('.frog-art');
    if (art) animate(art, [{ rotate: '0deg' }, { rotate: (-P.wobble) + 'deg', offset: P.squashAt + 0.04, easing: 'ease-in-out' },
      { rotate: (P.wobble * 0.7) + 'deg', offset: P.settleAt - 0.04, easing: 'ease-in-out' }, { rotate: '0deg' }], { duration: P.ms }, true);
    later(hop, P.ms * P.contactAt, function () { splash(spriteEl, size, 0, P.splash); jiggle(spriteEl, 1.4); plopSound(); });
    later(hop, P.ms * P.settleAt, function () { jiggle(spriteEl, 0.6); });
    return true;
  }
                                                                        
  function plopSound() {
    var c = null; try { c = typeof ac === 'function' ? ac() : null; } catch (e) {}
    if (!c) return;
    var t = c.currentTime, o = c.createOscillator(), g = c.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(240, t); o.frequency.exponentialRampToValueAtTime(620, t + 0.07);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.22, t + 0.01); g.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
    o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + 0.17);
  }
  function reducedMotion() { return !!(root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches); }
                                                                                                   
                                                           
  function burstPoints(n, inner, reach) {
    var pts = [];
    for (var i = 0; i < n * 2; i++) {
      var a = Math.PI * i / n - Math.PI / 2, r = i % 2 ? reach * inner : reach * (i % 4 ? 0.82 : 1);
      pts.push((50 + Math.cos(a) * r).toFixed(1) + ',' + (50 + Math.sin(a) * r).toFixed(1));
    }
    return pts.join(' ');
  }
                                                                                                       
                                                                                                       
                                                             
  function bonkBurst(layer, x, y, size, delay) {
    if (reducedMotion()) return;
    var P = PARAMS.bonk, w = size * P.burst, at = 'left:' + x.toFixed(1) + 'px;top:' + y.toFixed(1) + 'px;';
    var s = document.createElement('div');
    s.className = 'fg-bonk';
    s.style.cssText = at + 'width:' + w.toFixed(1) + 'px;height:' + w.toFixed(1) + 'px';
    s.innerHTML = '<svg viewBox="0 0 100 100" aria-hidden="true"><polygon class="fg-bonk-out" points="' + burstPoints(9, 0.5, 46) + '"/>'
      + '<polygon class="fg-bonk-in" points="' + burstPoints(9, 0.5, 26) + '"/></svg>';
    layer.appendChild(s);
                                                                                                     
                                                                                
    s.animate([{ transform: 'translate(-50%,-50%) scale(.15) rotate(-20deg)', opacity: 1, easing: 'cubic-bezier(.2,.9,.3,1.2)' },
      { transform: 'translate(-50%,-50%) scale(1.2) rotate(6deg)', opacity: 1, offset: 0.18, easing: 'ease-in-out' },
      { transform: 'translate(-50%,-50%) scale(1) rotate(10deg)', opacity: 1, offset: 0.6, easing: 'ease-in' },
      { transform: 'translate(-50%,-50%) scale(.35) rotate(26deg)', opacity: 0 }],
      { duration: 600, delay: delay }).onfinish = function () { s.remove(); };
    var ring = document.createElement('div');
    ring.className = 'fg-bonk-ring';
    ring.style.cssText = at + 'width:' + w.toFixed(1) + 'px;height:' + w.toFixed(1) + 'px';
    layer.appendChild(ring);
    ring.animate([{ transform: 'translate(-50%,-50%) scale(.3)', opacity: 0.95 }, { transform: 'translate(-50%,-50%) scale(1.5)', opacity: 0 }],
      { duration: 380, delay: delay, easing: 'cubic-bezier(.2,.7,.4,1)' }).onfinish = function () { ring.remove(); };
    for (var i = 0; i < P.lines; i++) {
      var ln = document.createElement('div'), a = (360 * i / P.lines + (i % 2 ? 14 : -6)).toFixed(1), len = size * (i % 3 ? 0.3 : 0.42);
      ln.className = 'fg-bonk-line';
      ln.style.cssText = at + 'width:' + len.toFixed(1) + 'px;height:' + Math.max(3, size * 0.055).toFixed(1) + 'px';
      layer.appendChild(ln);
      var r0 = w * 0.3, r1 = w * 0.62, r2 = w * 0.82;
      ln.animate([{ transform: 'translate(-50%,-50%) rotate(' + a + 'deg) translateX(' + r0.toFixed(1) + 'px) scaleX(.2)', opacity: 1 },
        { transform: 'translate(-50%,-50%) rotate(' + a + 'deg) translateX(' + r1.toFixed(1) + 'px) scaleX(1)', opacity: 1, offset: 0.45 },
        { transform: 'translate(-50%,-50%) rotate(' + a + 'deg) translateX(' + r2.toFixed(1) + 'px) scaleX(.1)', opacity: 0 }],
        { duration: 340, delay: delay + (i % 2) * 25, easing: 'cubic-bezier(.15,.7,.4,1)' }).onfinish = (function (el) { return function () { el.remove(); }; })(ln);
    }
  }
                                                                                                        
                                                                                             
  function headSpot(spriteEl) {
    var sr = spriteEl.getBoundingClientRect(); if (!sr.width || !spriteEl.offsetWidth) return null;
    var br = null; try { br = root.PondMotion && root.PondMotion.bodyRect ? root.PondMotion.bodyRect(spriteEl) : null; } catch (e) {}
    if (!br || !br.width) br = { left: sr.left + sr.width * 0.2, top: sr.top, width: sr.width * 0.6 };
    var mirrored = /scaleX\(-1\)/.test(spriteEl.style.transform || ''), x = (br.left + br.width / 2 - sr.left) / sr.width;
    return { x: mirrored ? 1 - x : x, y: (br.top - sr.top) / sr.height, w: br.width / (sr.width / spriteEl.offsetWidth), mirrored: mirrored };
  }
                                               
  var DIZZY_STAR = '<svg viewBox="0 0 20 20" aria-hidden="true"><polygon points="10,1.5 12.6,7.2 18.8,7.6 14,11.6 15.6,17.8 10,14.4 4.4,17.8 6,11.6 1.2,7.6 7.4,7.2"/></svg>';
                                                                                                      
                                                                                                           
  function dizzy(spriteEl, head, ms) {
    if (!spriteEl || !spriteEl.isConnected || !head || reducedMotion()) return;
    var P = PARAMS.bonk, rx = head.w * 0.5, ry = rx * 0.3, star = Math.max(14, head.w * 0.4);
    var box = document.createElement('div');
    box.className = 'fg-dizzy';
    box.style.cssText = 'left:' + (head.x * 100).toFixed(1) + '%;top:' + (head.y * 100).toFixed(1) + '%';
    spriteEl.appendChild(box);
    box.animate([{ opacity: 0 }, { opacity: 1, offset: 0.08 }, { opacity: 1, offset: 0.82 }, { opacity: 0 }], { duration: ms })
      .onfinish = function () { box.remove(); };
    var steps = 16, laps = P.dizzyLaps;
    for (var i = 0; i < P.dizzyStars; i++) {
      var s = document.createElement('i'), frames = [];
      s.className = 'fg-dizzy-star'; s.innerHTML = DIZZY_STAR;
      s.style.cssText = 'width:' + star.toFixed(1) + 'px;height:' + star.toFixed(1) + 'px';
      box.appendChild(s);
      for (var j = 0; j <= steps; j++) {
        var a = 2 * Math.PI * (i / P.dizzyStars + laps * j / steps), front = Math.sin(a);                                        
                                                                                        
        frames.push({ transform: 'translate(-50%,-50%) translate(' + (Math.cos(a) * rx).toFixed(1) + 'px,' + (front * ry - ry * 1.3).toFixed(1) + 'px) scale('
          + (0.86 + 0.24 * front).toFixed(2) + ') rotate(' + (j * 40) + 'deg)', opacity: (0.72 + 0.28 * front).toFixed(2) });
      }
      s.animate(frames, { duration: ms, easing: 'linear' });
    }
  }
                                                                                                    
                             
  function bonkSound(delay) {
    var c = null; try { c = typeof ac === 'function' ? ac() : null; } catch (e) {}
    if (!c) return;
    var t = c.currentTime + (delay || 0) / 1000;
    var o = c.createOscillator(), g = c.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(200, t); o.frequency.exponentialRampToValueAtTime(70, t + 0.1);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.34, t + 0.005); g.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
    o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + 0.17);
    var b = c.createOscillator(), bg = c.createGain(), lfo = c.createOscillator(), lg = c.createGain(), t2 = t + 0.02;
    b.type = 'triangle';
    b.frequency.setValueAtTime(640, t2); b.frequency.exponentialRampToValueAtTime(220, t2 + 0.3);
    lfo.frequency.setValueAtTime(26, t2); lg.gain.setValueAtTime(45, t2);
    lfo.connect(lg); lg.connect(b.frequency);
    bg.gain.setValueAtTime(0, t2); bg.gain.linearRampToValueAtTime(0.15, t2 + 0.015); bg.gain.exponentialRampToValueAtTime(0.001, t2 + 0.32);
    b.connect(bg); bg.connect(c.destination);
    b.start(t2); b.stop(t2 + 0.34); lfo.start(t2); lfo.stop(t2 + 0.34);
  }

                                                                              
                                                                           
                                                                            
                                                                               
                                                                                
  function restAfter(hopEl, fn) {
    if (!hopEl) return false;
    reset(hopEl);
    var els = [hopEl, hopEl.querySelector && hopEl.querySelector('.frog-art'), hopEl.parentElement]
      .concat(hopEl.querySelectorAll ? Array.prototype.slice.call(hopEl.querySelectorAll(PARTS)) : []), live = [];
    els.forEach(function (el) { (el && el._gaitAnims || []).forEach(function (a) { if (a.playState !== 'finished') live.push(a); }); });
    if (!live.length) return false;
                                                                                              
    if (hopEl.classList) hopEl.classList.add('fg-moving');
    Promise.all(live.map(function (a) { return a.finished; })).then(function () {
      if (!hopEl.isConnected) return;
      hopEl.classList.remove('fg-moving'); fn();
    }, function () {});
    return true;
  }
                                                                                                      
                                                                                               
  function beatLeftMs(hopEl) {
    if (!hopEl) return 0;
    var els = [hopEl, hopEl.querySelector && hopEl.querySelector('.frog-art'), hopEl.parentElement]
      .concat(hopEl.querySelectorAll ? Array.prototype.slice.call(hopEl.querySelectorAll(PARTS)) : []), left = 0;
    els.forEach(function (el) {
      (el && el._gaitAnims || []).forEach(function (a) {
        if (a.playState === 'finished' || !a.effect || !a.effect.getComputedTiming) return;
        var end = a.effect.getComputedTiming().endTime, cur = a.currentTime || 0;
        if (isFinite(end)) left = Math.max(left, end - cur);
      });
    });
    return left;
  }

  var api = { PARAMS: PARAMS, gaitOf: gaitOf, steps: steps, stepDur: stepDur, ease: ease, rollAngle: rollAngle,
              bounceFrames: bounceFrames, rollTurnFrames: rollTurnFrames, walkFrames: walkFrames, leapFrames: leapFrames, waddleFrames: waddleFrames,
              crawlFrames: crawlFrames, bubble: bubble, facesTravel: facesTravel, step: step, reset: reset, restAfter: restAfter,
              jiggle: jiggle, splash: splash, bounceApart: bounceApart, bonkFrames: bonkFrames, bonkTravel: bonkTravel,
              burstPoints: burstPoints, flop: flop, beatLeftMs: beatLeftMs,
              plop: plop, plopFrames: plopFrames };
  root.FrogGait = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
