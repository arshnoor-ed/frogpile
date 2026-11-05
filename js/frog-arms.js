                                                                                         

                                                                            
                                                                              
                                                                                
                                                                                
                                          

                                                                           
                                                                               
                                                                          
                                                      
                                                                               
                                                                         
                                                              

                                                                             
                                                                            
                                                                             
                                                                             
                                                                             
                                                                             
                                                                               
                                                       

                                                                             
                                                                            
                                                                               
                                                                               
                                                                         
                          

                                                                                               
                                                                                                  
                                                                                                 
                                                                                                
                                                                                                 
                                                                                          

                                                                                              
                                                                                                  
                                                                                                   
                                                                                                
                                                                 

                                                                             
                                                                               
                                                                              
             

                                                                            
                                                                             
                                                                    
                                                                              
(function (root) {
  'use strict';

  var PARAMS = {
    tickMs: 250,
    slap: { gapMs: [6500, 15000], pats: [2, 3], patMs: [210, 270], out: 34, in: -14, bothChance: 0.6, jitterMs: 500 },
    walk: { amp: 24, tuck: 0.35, stumble: 1.35 },
    slash: { gapMs: [7000, 17000], ms: 980, windup: 46, strike: -98, overshoot: -110, lean: 6 },
                                                                                                   
                                                                                                    
                                          
    squat: { standMs: 2800, firstJitterMs: 3000, gapMs: [4500, 9000], dipMs: 820, depth: 0.1, spread: 0.065,
             overshoot: 0.035, doubleChance: 0.35, armOut: 13 },
                                                                                                             
                                                                                                          
                                                                                                              
    swing: { standMs: 2400, firstJitterMs: 2500, gapMs: [4500, 9000], inMs: 220, swingMs: 360, outMs: 280, betweenMs: 160,
             swings: 3, fewerChance: 0.35, deg: 30, low: 4, lean: 8, armOut: 12 },                                                                    
                                                                                                          
                         
    croak: { standMs: 2600, firstJitterMs: 2500, gapMs: [5000, 10000], pulses: [2, 3], pulseMs: 380, restMs: 160,
             puff: [1.035, 0.985] },
                                                                                               
                                                                                                     
                                                                                                  
                                                                                                    
    battle: { tuck: -24, fling: 66, slap: -14, balance: 46, up: 62, low: 12, standMs: 700, jitterMs: 900 },
                                                                                                            
    legs: { deg: 16, up: 3.5 },
                                                                                      
                                                                                          
                                    
    hold: { raise: 1.5, lower: 0.18, minDeg: -24, maxDeg: 78, wrist: 0.4 },
    swoosh: 'assets/expeditions/vfx/creature_attack_fallback.png'
  };

  function rnd(r) { return r[0] + Math.random() * (r[1] - r[0]); }
  function outward(side) { return side === 'l' ? 1 : -1; }                                                       
  function pt(el, name) { var v = (el && el.dataset[name] || '').split(' ').map(Number); return v.length === 2 && !isNaN(v[0]) ? v : null; }
  function deg(k) { return parseFloat(k.rotate) || 0; }

                                                                              
                                                        
  function armForWeapon(w, side) {
    var H = PARAMS.hold, a = w > 0 ? w * H.raise : w * H.lower;
    return outward(side) * Math.max(H.minDeg, Math.min(H.maxDeg, a));
  }
                                                                                
                                                                                  
  function handShift(pivot, hand, a) {
    var r = a * Math.PI / 180, dx = hand[0] - pivot[0], dy = hand[1] - pivot[1];
    return [dx * Math.cos(r) - dy * Math.sin(r) - dx, dx * Math.sin(r) + dy * Math.cos(r) - dy];
  }
                                                                               
                                                                              
                                                                          
  function holdKeyframes(frames, pivot, hand, side, armAngles) {
    var arm = [], weapon = [];
    frames.forEach(function (k, i) {
      var w = deg(k), a = armAngles ? armAngles[i] : armForWeapon(w, side), sh = handShift(pivot, hand, a);
      var phi = a + (armAngles ? 0 : w * PARAMS.hold.wrist);
      var ak = { rotate: a.toFixed(1) + 'deg' }, wk = { rotate: phi.toFixed(1) + 'deg', translate: sh[0].toFixed(2) + '% ' + sh[1].toFixed(2) + '%' };
      if (k.offset != null) { ak.offset = k.offset; wk.offset = k.offset; }
      if (k.easing) { ak.easing = k.easing; wk.easing = k.easing; }
      arm.push(ak); weapon.push(wk);
    });
    return { arm: arm, weapon: weapon };
  }
                                                                              
                                                                             
                                                                                   
                                                                          
  function riders(stack, a) {
    var out = [], hand = pt(a, 'hand'), w = a.hasAttribute('data-holds') && stack.querySelector('.fs-weapon-arm');
    if (w && hand) out.push({ el: w, at: hand });
    var s = stack.querySelector('.fs-shield-arm[data-arm="' + a.dataset.arm + '"]'), palm = pt(s, 'palm');
    if (s && palm) out.push({ el: s, at: palm });
    return out;
  }
                                                                                                         
  function rideFrames(stack, a, frames, angles) {
    var pivot = pt(a, 'pivot'); if (!pivot) return [];
    angles = angles || frames.map(function (f) { return deg(f); });
    return riders(stack, a).map(function (r) { return { el: r.el, frames: holdKeyframes(frames, pivot, r.at, a.dataset.arm, angles).weapon }; });
  }
                                                                                
                                                                             
                           
  function holdFrames(rootEl, frames) {
    var armEl = rootEl && rootEl.querySelector('img.fs-arm[data-holds]');
    var wrap = rootEl && rootEl.querySelector('.fs-weapon-arm');
    if (!armEl || !wrap) return null;
    var pivot = pt(armEl, 'pivot'), hand = pt(armEl, 'hand');
    if (!pivot || !hand) return null;
    var h = holdKeyframes(frames, pivot, hand, armEl.dataset.arm);
    h.armEl = armEl; h.weaponEl = wrap;
    return h;
  }

                                                                               
                                                                           
  function slapFrames(n, side, rand) {
    var S = PARAMS.slap, r = rand || Math.random, o = outward(side), fr = [{ offset: 0, rotate: '0deg' }], contacts = [];
    for (var i = 0; i < n; i++) {
      var t0 = i / n, d = 1 / n, out = S.out * (0.85 + 0.3 * r());
      fr.push({ offset: t0 + d * 0.45, rotate: (o * out).toFixed(1) + 'deg', easing: 'cubic-bezier(.55,0,.9,.5)' });              
      fr.push({ offset: t0 + d * 0.66, rotate: (o * S.in).toFixed(1) + 'deg', easing: 'cubic-bezier(.2,.8,.4,1)' });          
      fr.push({ offset: t0 + d * 0.84, rotate: (o * 4).toFixed(1) + 'deg', easing: 'ease-in-out' });
      fr.push({ offset: i === n - 1 ? 1 : t0 + d, rotate: '0deg', easing: 'ease-out' });
      contacts.push(t0 + d * 0.66);
    }
    fr[0].easing = 'ease-out';
    return { frames: fr, contacts: contacts };
  }
                                                                                                   
                                      
  function idleAnim(stack, el, frames, opts) {
    var a = el.animate(frames, opts);
    stack._faAnims = (stack._faAnims || []).filter(function (o) { return o.playState !== 'finished'; });
    stack._faAnims.push(a);
    return a;
  }
  function idleLater(stack, ms, fn) { var tok = stack._faToken || 0; (root.PondPause ? root.PondPause.later : setTimeout)(function () { if ((stack._faToken || 0) === tok) fn(); }, ms); }
  function stopIdle(stack) {
    if (!stack) return;
    (stack._faAnims || []).forEach(function (a) { try { a.cancel(); } catch (e) {} });
    stack._faAnims = []; stack._faToken = (stack._faToken || 0) + 1; stack._faBusy = false;
    if (stack.classList) stack.classList.remove('fs-croaking');
  }
  function slap(spriteEl, stack) {
    var S = PARAMS.slap, arms = Array.prototype.slice.call(stack.querySelectorAll('img.fs-arm'));
    if (!arms.length) return 0;
    if (Math.random() > S.bothChance) arms = [arms[Math.random() < 0.5 ? 0 : arms.length - 1]];
    var n = Math.round(rnd(S.pats)), ms = rnd(S.patMs) * n, contacts = null;
    arms.forEach(function (a, i) {
      var sf = slapFrames(n, a.dataset.arm);
      contacts = contacts || sf.contacts;
      idleAnim(stack, a, sf.frames, { duration: ms, delay: i ? 40 : 0 });
      rideFrames(stack, a, sf.frames).forEach(function (r) { idleAnim(stack, r.el, r.frames, { duration: ms, delay: i ? 40 : 0 }); });
    });
    contacts.forEach(function (c) {
      idleLater(stack, ms * c, function () {
        if (!spriteEl.isConnected) return;
                                                                                                          
        idleAnim(stack, stack, [{ scale: '1 1' }, { scale: '1.06 0.95', offset: 0.3 }, { scale: '0.98 1.02', offset: 0.65 }, { scale: '1 1' }], { duration: 230, easing: 'ease-out' });
        if (root.FrogGait && root.FrogGait.jiggle) root.FrogGait.jiggle(spriteEl, 0.45);
        arms.forEach(function (a) { pat(stack, a); });
      });
    });
    return ms + 40;
  }
                                                     
  function pat(stack, arm) {
    var hand = pt(arm, 'hand'); if (!hand || !stack.animate) return;
    var p = document.createElement('span');
    p.className = 'fa-pat';
    p.style.left = 'calc(var(--fs-l) + var(--fs-frame, var(--fs-zoom)) * ' + (hand[0] / 100).toFixed(4) + ')';
    p.style.top = 'calc(var(--fs-t) + var(--fs-frame, var(--fs-zoom)) * ' + (hand[1] / 100).toFixed(4) + ')';
    stack.appendChild(p);
    p.animate([{ transform: 'translate(-50%,-50%) scale(.3)', opacity: 0.9 }, { transform: 'translate(-50%,-50%) scale(1.25)', opacity: 0 }],
      { duration: 280, easing: 'cubic-bezier(.2,.7,.4,1)' }).onfinish = function () { p.remove(); };
  }

                                                                             
                                                                               
                           
  function squatFrames(n) {
    var S = PARAMS.squat, keys = [{ offset: 0, sx: 1, sy: 1, arm: 0, easing: 'ease-in-out' }], rises = [];
    for (var i = 0; i < n; i++) {
      var t0 = i / n, d = 1 / n, last = i === n - 1;
      keys.push({ offset: t0 + d * 0.38, sx: 1 + S.spread, sy: 1 - S.depth, arm: 1, easing: 'ease-in-out' });                              
      keys.push({ offset: t0 + d * 0.54, sx: 1 + S.spread * 1.05, sy: 1 - S.depth * 1.05, arm: 0.9,
                  easing: last ? 'cubic-bezier(.3,0,.2,1)' : 'ease-in-out' });                                                          
      if (!last) {
        keys.push({ offset: t0 + d * 0.86, sx: 1 + S.spread * 0.35, sy: 1 - S.depth * 0.3, arm: 0.55, easing: 'ease-in-out' });
        rises.push(t0 + d * 0.86);
      } else {
        keys.push({ offset: t0 + d * 0.74, sx: 1 - S.overshoot * 0.7, sy: 1 + S.overshoot, arm: -0.2, easing: 'ease-in-out' });                      
        keys.push({ offset: t0 + d * 0.88, sx: 1 + S.overshoot * 0.25, sy: 1 - S.overshoot * 0.3, arm: 0.08, easing: 'ease-in-out' });
        keys.push({ offset: 1, sx: 1, sy: 1, arm: 0 });
        rises.push(t0 + d * 0.74);
      }
    }
    return { keys: keys, rises: rises };
  }
                                                                           
  function squat(spriteEl, stack, n) {
    var S = PARAMS.squat;
    n = n || (Math.random() < S.doubleChance ? 2 : 1);
    var sf = squatFrames(n), ms = S.dipMs * n;
                                                                                  
    idleAnim(stack, stack, sf.keys.map(function (k) {
      var f = { offset: k.offset, scale: k.sx.toFixed(3) + ' ' + k.sy.toFixed(3) };
      if (k.easing) f.easing = k.easing;
      return f;
    }), { duration: ms });
    Array.prototype.forEach.call(stack.querySelectorAll('img.fs-arm'), function (a) {
      var angles = sf.keys.map(function (k) { return outward(a.dataset.arm) * S.armOut * k.arm; });
      var fr = sf.keys.map(function (k, i) { var f = { offset: k.offset, rotate: angles[i].toFixed(1) + 'deg' }; if (k.easing) f.easing = k.easing; return f; });
      idleAnim(stack, a, fr, { duration: ms });
      rideFrames(stack, a, fr, angles).forEach(function (r) { idleAnim(stack, r.el, r.frames, { duration: ms }); });
    });
                                                       
    sf.rises.forEach(function (r) {
      idleLater(stack, ms * r, function () { if (spriteEl.isConnected && root.FrogGait && root.FrogGait.jiggle) root.FrogGait.jiggle(spriteEl, 0.5); });
    });
    return ms;
  }

                                                                                                       
                                                                                                       
                                                                                                      
                                                                           
  function swingFrames(n) {
    var W = PARAMS.swing, T = W.inMs + n * W.swingMs + W.outMs, at = function (ms) { return ms / T; };
    var fr = [{ offset: 0, swing: 0, lean: 0, arm: 0, easing: 'ease-in-out' }];
    fr.push({ offset: at(W.inMs), swing: W.low / W.deg, lean: 1, arm: 1, easing: 'ease-in-out' });                                
    for (var i = 0; i < n; i++) {
      var t0 = W.inMs + i * W.swingMs;
      fr.push({ offset: at(t0 + W.swingMs * 0.5), swing: 1 - 0.14 * i, lean: 1, arm: 1.2, easing: 'ease-in-out' });            
      fr.push({ offset: at(t0 + W.swingMs), swing: W.low / W.deg, lean: 1, arm: 1, easing: i === n - 1 ? 'cubic-bezier(.5,0,.8,.4)' : 'ease-in-out' });                 
    }
    var d0 = W.inMs + n * W.swingMs;
    fr.push({ offset: at(d0 + W.outMs * 0.55), swing: 0, lean: -0.2, arm: 0, easing: 'ease-in-out' });                                  
    fr.push({ offset: 1, swing: 0, lean: 0, arm: 0 });
    return { keys: fr, ms: T };
  }
                                                                        
  function swing(spriteEl, stack, n) {
    var W = PARAMS.swing, legs = Array.prototype.slice.call(stack.querySelectorAll('img.fs-foot'));
    if (!legs.length) return 0;
    if (Math.random() < 0.5) legs.reverse();                                      
    n = n || W.swings - (Math.random() < W.fewerChance ? 1 : 0);
    var sf = swingFrames(n), body = stack.querySelector('img.fs-body'), frame = (body && body.offsetWidth) || 0;
    var ox = parseFloat(stack.style.getPropertyValue('--fs-ox')) || 0;
                                                                
    var keys = [];
    legs.forEach(function (leg, j) { var t0 = j * (sf.ms + W.betweenMs); sf.keys.forEach(function (k) { keys.push([t0 + k.offset * sf.ms, k, j]); }); });
    var ms = legs.length * sf.ms + (legs.length - 1) * W.betweenMs;
    function keyed(fn) { return keys.map(function (q) { var f = fn(q[1], q[2]); f.offset = q[0] / ms; if (q[1].easing) f.easing = q[1].easing; return f; }); }
                                                                                                  
    legs.forEach(function (leg, j) {
      var o = outward(leg.dataset.foot);
      idleAnim(stack, leg, keyed(function (k, who) { return { rotate: (who === j ? o * W.deg * k.swing : 0).toFixed(1) + 'deg' }; }), { duration: ms });
    });
                                                                                                     
                                                                                                     
    if (frame) {
      var planted = legs.map(function (leg, j) {
        var other = legs[legs.length > 1 ? 1 - j : j], pv = pt(other, 'pivot');
        var d = pv ? (pv[0] / 100 - 0.5531 - ox) * frame : 0;
        return legs.length > 1 ? d : -d;                                                       
      });
      idleAnim(stack, stack, keyed(function (k, who) {
        var vx = planted[who], th = (vx < 0 ? -1 : 1) * W.lean * k.lean, r = th * Math.PI / 180;
        return { rotate: th.toFixed(2) + 'deg', translate: (vx * (1 - Math.cos(r))).toFixed(2) + 'px ' + (-vx * Math.sin(r)).toFixed(2) + 'px' };
      }), { duration: ms });
      Array.prototype.forEach.call(stack.querySelectorAll('img.fs-arm'), function (arm) {
        var fr = keyed(function (k) { return { rotate: (outward(arm.dataset.arm) * W.armOut * k.arm).toFixed(1) + 'deg' }; });
        idleAnim(stack, arm, fr, { duration: ms });
        rideFrames(stack, arm, fr).forEach(function (r) { idleAnim(stack, r.el, r.frames, { duration: ms }); });
      });
    }
                                                              
    legs.forEach(function (leg, j) {
      idleLater(stack, j * (sf.ms + W.betweenMs) + sf.keys[sf.keys.length - 2].offset * sf.ms, function () {
        if (spriteEl.isConnected && root.FrogGait && root.FrogGait.jiggle) root.FrogGait.jiggle(spriteEl, 0.45);
      });
    });
    return ms;
  }

                                                                                                    
  function croakPlan(n) {
    var C = PARAMS.croak, T = n * C.pulseMs + (n - 1) * C.restMs, pulses = [], puff = [{ offset: 0, sx: 1, sy: 1 }];
    for (var i = 0; i < n; i++) {
      var t0 = i * (C.pulseMs + C.restMs), t1 = t0 + C.pulseMs;
      pulses.push([t0, t1]);
      puff.push({ offset: t0 / T, sx: 1, sy: 1, easing: 'cubic-bezier(.2,.8,.4,1)' });
      puff.push({ offset: (t0 + C.pulseMs * 0.3) / T, sx: C.puff[0], sy: C.puff[1], easing: 'ease-in-out' });                            
      puff.push({ offset: (t0 + C.pulseMs * 0.75) / T, sx: 1 + (C.puff[0] - 1) * 0.5, sy: 1 + (C.puff[1] - 1) * 0.5, easing: 'ease-in' });
      puff.push({ offset: t1 / T, sx: 1, sy: 1 });
    }
                                                            
    puff = puff.filter(function (p, i) { return i === 0 || p.offset > puff[i - 1].offset; });
    return { ms: T, pulses: pulses, puff: puff };
  }
                                                         
  function croak(spriteEl, stack, n) {
    var C = PARAMS.croak, plan = croakPlan(n || Math.round(rnd(C.pulses)));
    if (!stack.querySelector('img.fs-croak')) return 0;
    idleAnim(stack, stack, plan.puff.map(function (p) { var f = { offset: p.offset, scale: p.sx + ' ' + p.sy }; if (p.easing) f.easing = p.easing; return f; }), { duration: plan.ms });
    plan.pulses.forEach(function (p) {
      idleLater(stack, p[0], function () { stack.classList.add('fs-croaking'); if (spriteEl.isConnected && root.FrogGait && root.FrogGait.jiggle) root.FrogGait.jiggle(spriteEl, 0.35); });
      idleLater(stack, p[1], function () { stack.classList.remove('fs-croaking'); });
    });
    return plan.ms;
  }

                                                                        
  function slashFrames() {
    var S = PARAMS.slash;
    return [
      { offset: 0, rotate: '0deg', easing: 'ease-out' },
      { offset: 0.22, rotate: (S.windup * 0.85) + 'deg', easing: 'ease-in-out' },
      { offset: 0.36, rotate: S.windup + 'deg', easing: 'cubic-bezier(.6,0,.95,.45)' },                      
      { offset: 0.45, rotate: S.strike + 'deg', easing: 'ease-out' },                                  
      { offset: 0.53, rotate: S.overshoot + 'deg', easing: 'ease-in-out' },
      { offset: 0.64, rotate: (S.strike * 0.9) + 'deg', easing: 'ease-in-out' },
      { offset: 0.84, rotate: '6deg', easing: 'ease-in-out' },
      { offset: 1, rotate: '0deg' }
    ];
  }
  function slash(spriteEl, stack) {
    var S = PARAMS.slash, wrap = stack.querySelector('.fs-weapon-arm'); if (!wrap) return;
    var frames = slashFrames(), hold = holdFrames(stack, frames);
    if (hold) { idleAnim(stack, hold.weaponEl, hold.weapon, { duration: S.ms }); idleAnim(stack, hold.armEl, hold.arm, { duration: S.ms }); }
    else idleAnim(stack, wrap, frames, { duration: S.ms });
                                                                                                              
    idleAnim(stack, stack, [{ rotate: '0deg' }, { rotate: (S.lean * 0.5) + 'deg', offset: 0.36 }, { rotate: (-S.lean) + 'deg', offset: 0.47, easing: 'ease-out' },
      { rotate: (-S.lean * 0.6) + 'deg', offset: 0.64 }, { rotate: '0deg' }], { duration: S.ms, easing: 'ease-in-out' });
    idleLater(stack, S.ms * 0.38, function () { if (spriteEl.isConnected) swoosh(stack); });
  }
                                                          
  function swoosh(stack) {
    var s = document.createElement('img');
    s.className = 'fa-swoosh'; s.src = PARAMS.swoosh; s.alt = ''; s.draggable = false;
    stack.appendChild(s);
    s.animate([
      { transform: 'translate(-50%,-50%) rotate(-28deg) scale(.55,.8)', opacity: 0 },
      { transform: 'translate(-50%,-50%) rotate(-14deg) scale(1,1)', opacity: 0.95, offset: 0.3 },
      { transform: 'translate(-50%,-50%) rotate(4deg) scale(1.08,1.04)', opacity: 0 }
    ], { duration: 300, easing: 'ease-out' }).onfinish = function () { s.remove(); };
  }

                                                                               
                                                                             
                                                                        
                                                                             
              
  function walkArmAngles(wf, side) {
    var W = PARAMS.walk, o = outward(side), out = [0], offs = [0];
    wf.contacts.forEach(function (c, k) {
      out.push(c.side === o ? o * W.amp : -o * W.amp * W.tuck);
      offs.push((k + 0.5) / wf.strides);
    });
    out.push(out[out.length - 1] * 0.5); offs.push(1);
    return { angles: out, offsets: offs };
  }
  function walk(spriteEl, wf, ms, stopMs, animate) {
    var stack = spriteEl && spriteEl.querySelector('.frog-stack');
    if (!stack || stack.dataset.arms !== 'walk') return;
    animate = animate || function (el, fr, opts) { return el.animate(fr, opts); };
    var W = PARAMS.walk;
    Array.prototype.forEach.call(stack.querySelectorAll('img.fs-arm'), function (a) {
      var o = outward(a.dataset.arm), wa = walkArmAngles(wf, a.dataset.arm);
      var fr = wa.angles.map(function (v, i) { return { offset: wa.offsets[i], rotate: v.toFixed(1) + 'deg', easing: 'ease-in-out' }; });
      var last = wa.angles[wa.angles.length - 1];
      var stop = [last, o * W.amp * W.stumble, -o * 6, o * 4, 0];
      var sfr = stop.map(function (v, i) { return { offset: [0, 0.22, 0.5, 0.72, 1][i], rotate: v.toFixed(1) + 'deg', easing: 'ease-in-out' }; });
      animate(a, fr, { duration: ms }, true);
      animate(a, sfr, { duration: stopMs, delay: ms }, true);
      rideFrames(stack, a, fr, wa.angles).forEach(function (r) { animate(r.el, r.frames, { duration: ms }, true); });
      rideFrames(stack, a, sfr, stop).forEach(function (r) { animate(r.el, r.frames, { duration: stopMs, delay: ms }, true); });
    });
  }

                                                                                             
                                                                                     
                                                                                                   
                                                                                
  function marchAngles(swing, fling) {
    var W = PARAMS.walk, s = swing || 0, f = fling || 0;
    var l = s > 0 ? W.amp * s : W.amp * W.tuck * s, r = s > 0 ? W.amp * W.tuck * s : W.amp * s;
    return { l: l + W.amp * f, r: r - W.amp * f };
  }
                                                                                                  
  function pose(stack, angles) {
    if (!stack) return;
    Array.prototype.forEach.call(stack.querySelectorAll('img.fs-arm'), function (a) {
      var v = angles ? (angles[a.dataset.arm] || 0) : null;
      a.style.rotate = v == null ? '' : v.toFixed(1) + 'deg';
      var pivot = pt(a, 'pivot'); if (!pivot) return;
      riders(stack, a).forEach(function (r) {
        if (v == null) { r.el.style.rotate = r.el.style.translate = ''; return; }
        var sh = handShift(pivot, r.at, v);
        r.el.style.rotate = v.toFixed(1) + 'deg'; r.el.style.translate = sh[0].toFixed(2) + '% ' + sh[1].toFixed(2) + '%';
      });
    });
  }
                                                                                                 
                                                               
  function legs(stack, lift) {
    var L = PARAMS.legs;
    Array.prototype.forEach.call(stack ? stack.querySelectorAll('img.fs-foot') : [], function (f) {
      var v = lift ? (lift[f.dataset.foot] || 0) : null;
      f.style.rotate = v == null ? '' : (outward(f.dataset.foot) * L.deg * v).toFixed(1) + 'deg';
      f.style.translate = v == null ? '' : '0 ' + (-L.up * v).toFixed(2) + '%';
    });
  }
  function turnFrames(keys, side) {
    var o = outward(side);
    return keys.map(function (k) { return { offset: k[0], rotate: (o * k[1]).toFixed(1) + 'deg', easing: 'ease-in-out' }; });
  }
                                                                                                      
                                                                                                 
                                                                                                 
                                                                             
  function leapArms(stack, gait, tl) {
    var B = PARAMS.battle, out = [];
    Array.prototype.forEach.call(stack ? stack.querySelectorAll('img.fs-arm') : [], function (a) {
      if (a.hasAttribute('data-holds') && stack.querySelector('.fs-weapon-arm')) return;
      var air = tl.windup + (tl.hit - tl.windup) * 0.6, k;
      if (gait === 'roll') k = [[0, 0], [tl.windup, B.tuck * 0.5], [air, B.tuck], [tl.back, B.tuck], [tl.land, B.tuck * 0.5], [1, 0]];
      else if (stack.dataset.arms === 'slap') k = [[0, 0], [tl.windup, 10], [air, B.fling], [tl.hit, B.slap], [tl.back, B.slap * 0.5],
        [tl.back + (tl.land - tl.back) * 0.4, B.fling * 0.45], [tl.land, 6], [1, 0]];
      else k = [[0, 0], [tl.windup, 8], [tl.hit, B.balance], [tl.back, B.balance * 0.8], [tl.land, 10], [1, 0]];
      var fr = turnFrames(k, a.dataset.arm);
      out.push({ el: a, frames: fr });
      out.push.apply(out, rideFrames(stack, a, fr));                                        
    });
    return out;
  }
                                                                                                    
                                                                                               
  function cheerArms(stack) {
    var B = PARAMS.battle, out = [];
    var keys = [[0, 0], [0.07, -6], [0.24, B.up], [0.4, B.low], [0.47, B.low * 0.5], [0.53, -4], [0.68, B.up * 0.85], [0.82, B.low], [0.9, 0], [1, 0]];
    Array.prototype.forEach.call(stack ? stack.querySelectorAll('img.fs-arm') : [], function (a) {
      var fr = turnFrames(keys, a.dataset.arm);
      out.push({ el: a, frames: fr });
      out.push.apply(out, rideFrames(stack, a, fr));
    });
    return out;
  }

                                                                             
  function tick() {
    if (typeof document === 'undefined' || document.hidden || (root.PondPause && root.PondPause.active())) return;
    var now = root.PondPause ? root.PondPause.now() : performance.now(), sprites = document.querySelectorAll('.wander-frog');
    for (var i = 0; i < sprites.length; i++) {
      var sp = sprites[i], stack = sp.querySelector('.frog-stack'), hop = sp.querySelector('.frog-hop');
      if (!stack || !hop) continue;
      var slaps = stack.dataset.arms === 'slap', armed = !!stack.querySelector('.fs-weapon-arm'), idle = IDLE[stack.dataset.idle];
      if (!slaps && !armed && !idle) continue;
      var standing = hop.classList.contains('idle') && !hop.classList.contains('fg-moving') && !sp.classList.contains('dragging');
      var free = standing && !stack._faBusy;
      if (idle) {
                                                                                          
        var IP = PARAMS[stack.dataset.idle];
        if (!standing) stack._idleAt = undefined;
        else if (stack._idleAt === undefined) stack._idleAt = now + IP.standMs + Math.random() * IP.firstJitterMs;
        else if (now >= stack._idleAt) {
          if (free) { busy(stack, idle(sp, stack) + 120); stack._idleAt = now + rnd(IP.gapMs); }
          else stack._idleAt = now + 700;
        }
      }
      if (slaps) {
        if (stack._slapAt === undefined) stack._slapAt = now + Math.random() * PARAMS.slap.gapMs[1];
        else if (now >= stack._slapAt) {
          if (free) { busy(stack, 1100); idleLater(stack, Math.random() * PARAMS.slap.jitterMs, slap.bind(null, sp, stack)); stack._slapAt = now + rnd(PARAMS.slap.gapMs); }
          else stack._slapAt = now + 800;
        }
      }
      if (armed) {
        if (stack._slashAt === undefined) stack._slashAt = now + Math.random() * PARAMS.slash.gapMs[1];
        else if (now >= stack._slashAt) {
          if (free && !stack._faBusy) { busy(stack, PARAMS.slash.ms + 100); slash(sp, stack); stack._slashAt = now + rnd(PARAMS.slash.gapMs); }
          else stack._slashAt = now + 900;
        }
      }
    }
  }
                                                                                        
  var IDLE = { squat: squat, swing: swing, croak: croak };
  function busy(stack, ms) { stack._faBusy = true; (root.PondPause ? root.PondPause.later : setTimeout)(function () { stack._faBusy = false; }, ms); }
  if (typeof document !== 'undefined') setInterval(tick, PARAMS.tickMs);

  var api = { PARAMS: PARAMS, outward: outward, armForWeapon: armForWeapon, handShift: handShift, holdKeyframes: holdKeyframes,
              holdFrames: holdFrames, riders: riders, rideFrames: rideFrames, slapFrames: slapFrames, slashFrames: slashFrames, squatFrames: squatFrames, squat: squat, slap: slap,
              swingFrames: swingFrames, swing: swing, croakPlan: croakPlan, croak: croak, idleMove: function (name) { return IDLE[name] || null; },
              stopIdle: stopIdle, walkArmAngles: walkArmAngles, walk: walk, tick: tick,
              marchAngles: marchAngles, legs: legs, pose: pose, leapArms: leapArms, cheerArms: cheerArms };
  root.FrogArms = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
