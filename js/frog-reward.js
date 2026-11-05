                                                                          
                                                                            
                                                                             
                                                                  

                                                                        
                                                                            
                                                                          
                                                                       
                                                                        
                             

                      
                                                                              
                                                                      
                                                           
                                                                                
                                                                              
                                                              
                                                                             
                                                                           
                                                                             
                                                                 
                                                                           
                                                                               
                                                                             
                                                                      
                                                                          
                                                
                                                     
                                                                    
                                                                     
        
(function (g) {
  'use strict';
  var TITLE_NEW_TRAIT = 'assets/ui2/screens/overlays/title-new-trait.png';                               
  var TONES = ['none', 'common', 'rare', 'epic', 'legendary'];                                  

                                                                             
                                                                             
                                                                               
                                                                             
                                                                              
                                                                             
                                                                            
                                                  

                                                                               
                                                                              
                                                                            
                                                      
  var PARAMS = {
    newSlotMs: 260,                                                       
    newCheckMs: 560,                                            
  };
  var opened = { key: null, at: 0 };
  function now() { return g.performance && g.performance.now ? g.performance.now() : Date.now(); }
  function elapsedMs(o) {
    if (o.countKey == null) return o.noAnim ? 1e6 : 0;
    if (opened.key !== o.countKey) { opened.key = o.countKey; opened.at = now(); }
    return Math.max(0, Math.round(now() - opened.at));
  }

                                                                         
                                                                               
                                                                       
                                                                    
                                                                          
                                                                             
                                                                           
                             
  function statHTML(K, s) {
    var FX = g.StatCountFX;
    var c = s.from != null && s.from < s.value && FX ? FX.cell(s.stat) : null;
    if (!c) return K.rewardStat({ stat: s.stat, value: s.value, boosted: !!s.boosted, className: 'fr-stat' });
    var card = K.rewardStat({ stat: s.stat, value: c.value, boosted: !!s.boosted, className: 'fr-stat fr-stat--count' })
      .replace(/^<span /, '<span data-fx="' + c.id + '" data-stat="' + s.stat + '" ')
      .replace(/<\/span>$/, '<span class="fr-stat-glint" aria-hidden="true"></span></span>');
    return '<span class="' + c.cls + '" style="' + c.style + '"><span class="fr-stat-rays" aria-hidden="true"></span>' + card + '</span>';
  }

                                                                               
                                                                            
                                                                     
  function familyHTML(K, esc, f) {
    var slots = (f.slots || []).map(function (s) {
      if (!s.fresh || !s.found) return s;
      var extra = '<span class="fr-slot-ring" aria-hidden="true"></span>'
        + (s.fresh === 'new' ? '<span class="fr-slot-tag">NEW</span>' : '');
      return Object.assign({}, s, { className: K.cls(s.className, 'fr-slot-' + s.fresh), extraHTML: (s.extraHTML || '') + extra });
    });
    var opts = Object.assign({ className: 'fr-family' }, f, { slots: slots });
    var m = /^(\d+)\/(\d+)$/.exec(f.count || '');
    if (m && f.countFrom != null && +f.countFrom < +m[1]) {
      opts.countHTML = '<span class="fr-count"><span class="fr-count__num">'
        + '<i class="fr-count__was">' + esc(f.countFrom) + '</i><i class="fr-count__now">' + m[1] + '</i></span>/' + m[2] + '</span>';
    }
    return K.familyTracker(opts);
  }

  function html(o) {
    var K = g.KitUI, esc = K.esc;
    var tone = TONES.indexOf(o.tone) >= 0 ? o.tone : 'none';
    var close = o.onClose ? ' onclick="if(event.target===this)' + o.onClose + '"' : '';
                                                                                 
    var title = o.titleArt
      ? '<img class="fr-title__art" src="' + TITLE_NEW_TRAIT + '" alt="' + esc(o.title || 'New trait!') + '" draggable="false">'
      : '<span class="fr-title__text" style="--fr-title-len:' + Math.max(1, String(o.title || '').length) + '">' + esc(o.title || '') + '</span>';
    var FX = g.StatCountFX;
    var counting = (o.stats || []).filter(function (s) { return s.from != null && s.from < s.value; })
      .map(function (s) { return { stat: s.stat, from: s.from, to: s.value }; });
    if (counting.length && FX) FX.begin(o.countKey, counting);
    var stats = (o.stats || []).map(function (s) { return statHTML(K, s); }).join('');
    if (counting.length && FX) FX.kick();
    var clock = '--fr-el:' + elapsedMs(o) + 'ms;--fr-slot-at:' + PARAMS.newSlotMs + 'ms;--fr-check-at:' + PARAMS.newCheckMs + 'ms';
    var statsHTML = stats ? '<div class="fr-stats">' + stats + '</div>' + (o.statNotesHTML || '') : '';
    var btn = o.button || {};
    var famHTML = o.family ? familyHTML(K, esc, o.family) : '';
    var head = (o.name ? '<p class="fr-name">' + esc(o.name) + '</p>' : '')
      + (o.boost && o.boost.text ? K.boostPill({ size: 'md', kind: o.boost.kind, text: o.boost.text, className: 'fr-boost fr-fxsrc' }) : '');
    return '<div class="' + K.cls(o.rootClass, 'fr-overlay', 'fr-tone--' + tone, o.noAnim ? 'no-anim' : '') + '"'
      + ' style="' + clock + (o.rootStyle ? ';' + o.rootStyle : '') + '" role="dialog" aria-modal="true" aria-label="' + esc(o.title || 'Reward') + '"' + close + '>'
      + '<div class="fr-reward"' + close + '>'
      + '<h2 class="fr-title">' + title + '</h2>'
      + '<div class="showcase-stage fr-stage">' + (o.stageHTML || '') + '</div>'
      + head
      + (o.sub ? '<p class="fr-sub">' + esc(o.sub) + '</p>' : '')
      + (o.aboutHTML || '')
      + famHTML + statsHTML
      + K.button({ tone: 'gold', shape: 'pill', size: 'lg', label: btn.label || 'Nice!', html: btn.html,
          onclick: btn.onclick, className: K.cls('fr-btn', btn.className) })
          .replace(/^<button /, btn.ariaDisabled ? '<button aria-disabled="true" ' : '<button ')
      + '</div></div>';
  }

  g.FrogRewardUI = { html: html, TONES: TONES, PARAMS: PARAMS };
  if (typeof module !== 'undefined' && module.exports) module.exports = g.FrogRewardUI;
})(typeof window !== 'undefined' ? window : globalThis);
