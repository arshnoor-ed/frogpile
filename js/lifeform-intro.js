                                                                   
                                                                              
                                                                         
                                                               
                                                                             
                                                                            
                                                                        
                                                                       

                                                                             
                                                                         
                                                                              
                                                                       
                                             
(function (g) {
  'use strict';
                                                       
  var PARAMS = {
    aboutAtMs: 700,                                        
    noteAtMs: 1300,                                     
    noteStepMs: 380,                                  
    holdMs: 4000                        
  };
                                                                             
                                                                       
  var COPY = {
    title: 'It’s alive!',
    body: 'A blob of alien black goo, hungry to explore the world!',
    stats: {
      atk: { name: 'Attack', line: 'Damage it deals' },
      def: { name: 'Defense', line: 'Damage it blocks' },
      hp: { name: 'Health', line: 'Hits it can take' }
    }
  };
  var opened = { key: null, at: 0 }, ticking = false;
  function now() { return g.performance && g.performance.now ? g.performance.now() : Date.now(); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return '&#' + c.charCodeAt(0) + ';'; }); }

  function due(state) { return !!state && !state.lifeFormIntroSeen; }
  function holdLeft() { return opened.key == null ? 0 : Math.max(0, opened.at + PARAMS.holdMs - now()); }
  function holding() { return holdLeft() > 0; }
  function secondsLeft(ms) { return Math.max(1, Math.ceil(ms / 1000)); }

                                                                            
                                                                            
  function opts(key, stats) {
    if (opened.key !== key) { opened.key = key; opened.at = now(); }
    var left = holdLeft();
                                                                            
    var times = ['--lf-about-at:' + PARAMS.aboutAtMs + 'ms'];
    var notes = (stats || []).map(function (s, i) {
      var c = COPY.stats[s] || { name: s, line: '' };
      times.push('--lf-note' + (i + 1) + '-at:' + (PARAMS.noteAtMs + i * PARAMS.noteStepMs) + 'ms');
      return '<p class="lf-note lf-note--' + esc(s) + '"><b>' + esc(c.name) + '</b><span>' + esc(c.line) + '</span></p>';
    }).join('');
    if (left > 0) tick();
    return {
      rootClass: 'lf-intro',
      rootStyle: times.join(';'),
      onClose: 'LifeFormIntro.holding()||closeShowcase()',
      aboutHTML: '<div class="lf-about"><b>' + esc(COPY.title) + '</b><span>' + esc(COPY.body) + '</span></div>',
      statNotesHTML: '<div class="lf-notes">' + notes + '</div>',
      button: {
        onclick: 'LifeFormIntro.holding()||closeShowcase()',
        className: left > 0 ? 'lf-wait' : '',
        ariaDisabled: left > 0,
        html: esc('Nice!') + (left > 0 ? '<span class="lf-count" aria-hidden="true">' + secondsLeft(left) + '</span>' : '')
      }
    };
  }

                                                                            
                                                                              
                                                           
  function tick() {
    if (ticking || typeof document === 'undefined' || typeof setTimeout !== 'function') return;
    ticking = true;
    setTimeout(function beat() {
      var btn = document.querySelector('.showcase-overlay.lf-intro .fr-btn.lf-wait');
      var left = holdLeft(), count = btn && btn.querySelector('.lf-count');
      if (left <= 0 || opened.key == null) {
        if (btn) {
          btn.classList.remove('lf-wait'); btn.removeAttribute('aria-disabled');
          if (count) count.remove();
          btn.focus({ preventScroll: true });
        }
        ticking = false; return;
      }
      if (count) count.textContent = secondsLeft(left);
      setTimeout(beat, Math.min(200, left));
    }, 0);
  }

                                                                         
  function done(state) {
    opened.key = null;
    if (!state || state.lifeFormIntroSeen) return false;
    state.lifeFormIntroSeen = true;
    return true;
  }

  g.LifeFormIntro = { due: due, opts: opts, holding: holding, done: done, PARAMS: PARAMS, COPY: COPY };
  if (typeof module !== 'undefined' && module.exports) module.exports = g.LifeFormIntro;
})(typeof window !== 'undefined' ? window : globalThis);
