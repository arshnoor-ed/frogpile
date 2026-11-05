                                                                             
                                                                      

                                                                               
                                                                               
                                                                              
                                                                              
                                                                         
                                                                       
                                                                          
                                                                               
(function (root) {
  'use strict';

  var PARAMS = {
    gapMs: [2600, 7000],                                               
    doubleChance: 0.18,                                             
    doubleGapMs: 120,
    frames: [[1, 70], [2, 110], [1, 70]],                                                  
    tickMs: 100,
    startJitterMs: 300                                                                          
  };

  function gap(rand) { var r = rand || Math.random; return PARAMS.gapMs[0] + r() * (PARAMS.gapMs[1] - PARAMS.gapMs[0]); }
                                                                                
  function sequence(times) {
    var seq = [], t = 0;
    for (var k = 0; k < times; k++) {
      PARAMS.frames.forEach(function (f) { seq.push([t, f[0]]); t += f[1]; });
      seq.push([t, 0]);
      if (k < times - 1) t += PARAMS.doubleGapMs;
    }
    return { steps: seq, ms: t };
  }

                                                                         
  function paused(stack) { var C = root.CombatLive; return !!(C && C.isPresentationPaused && C.isPresentationPaused(stack)); }
  function show(stack, n) {
    var base = stack.querySelector('img[data-dz-base]');
    if (n && base && base.style.visibility === 'hidden') n = 0;                                                                 
    var lids = stack.querySelectorAll('img.fs-blink');
    for (var i = 0; i < lids.length; i++) lids[i].style.visibility = (+lids[i].dataset.blink === n) ? 'visible' : 'hidden';
  }
                                                                               
                                    
  function pondClock(stack) { return root.PondPause && stack.closest('.wander-frog'); }
  function clock(stack) { return pondClock(stack) ? root.PondPause.now() : performance.now(); }
  function later(stack, fn, ms) { return (pondClock(stack) ? root.PondPause.later : setTimeout)(fn, ms); }
  function play(stack, times, delay) {
    var steps = sequence(times).steps, i = 0;
    stack._blinking = true;
                                                                                         
    function next() {
      if (paused(stack) || (stack.closest('.wander-frog') && root.PondPause && root.PondPause.active())) { later(stack, next, PARAMS.tickMs); return; }
      show(stack, steps[i][1]); i++;
      if (i < steps.length) later(stack, next, steps[i][0] - steps[i - 1][0]);
      else { stack._blinking = false; stack._blinkAt = clock(stack) + gap(); }
    }
    later(stack, next, delay);
  }
  function tick() {
    if (typeof document === 'undefined' || document.hidden) return;
    var lids = document.querySelectorAll('img.fs-blink[data-blink="1"]');
    for (var i = 0; i < lids.length; i++) {
      var stack = lids[i].closest('.frog-stack');
      if (!stack || stack._blinking || stack.classList.contains('fs-flopped') || stack.classList.contains('fs-croaking') || paused(stack)) continue;                                                          
      var now = clock(stack);
                                                                                                      
      if (stack._blinkAt === undefined) { stack._blinkAt = now + Math.random() * PARAMS.gapMs[1]; continue; }
      if (now < stack._blinkAt) continue;
      var base = stack.querySelector('img[data-dz-base]');
      if (base && base.style.visibility === 'hidden') { stack._blinkAt = now + 400; continue; }                
      play(stack, Math.random() < PARAMS.doubleChance ? 2 : 1, Math.random() * PARAMS.startJitterMs);
    }
  }
  if (typeof document !== 'undefined') setInterval(tick, PARAMS.tickMs);

  var api = { PARAMS: PARAMS, sequence: sequence, gap: gap, tick: tick };
  root.FrogBlink = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
