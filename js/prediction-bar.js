                                                                                
                                                            
                                                                             

                                                                            
                                                                         
                                                                              
                                                                           
                                                                           
                                                                           
                                                                          
                                                                      
                                                               

                                                                          
                                                                     
                                                                           
                                                                           
                                                   

                                                                        
                                                              
                                                                            
                                                                            
                                                                          
                                                                    
                                                                         
                                                                          
                                                                           
                                                                     

                                                                 
                                                                             
                                                                           
                                                                            
                       

                                                                           
                                                                          
                                                                  
                                                             
                                                                                   
(function (root, factory) {
  var mod = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = mod;
  if (root) root.PredictionBar = mod;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : null), function () {
  'use strict';

  var FACE_BASE = 'assets/ui2/prediction/';
  var FACE_FILE = { risky: 'FrogFace_Worried.png', even: 'FrogFace_Unsure.png', strong: 'FrogFace_Happy.png' };
  var BAND_LABEL = { risky: 'Risky', even: 'Even Odds', strong: 'Strong' };
  var BAND_ORDER = ['risky', 'even', 'strong'];

  function facePath(band) { return FACE_BASE + (FACE_FILE[band] || FACE_FILE.risky); }
  function bandLabel(band) { return BAND_LABEL[band] || BAND_LABEL.risky; }

                                                                                
                                                                         
                                                                         
                                                              
                                                                                
  function getFPConfig() {
    var FP = (typeof window !== 'undefined' && window.FPConfig) ? window.FPConfig
      : (typeof globalThis !== 'undefined' ? globalThis.FPConfig : null);
    if (!FP) throw new Error('[PredictionBar] window.FPConfig is missing — load the config layer before calling into js/prediction-bar.js\'s gameplay functions.');
    return FP;
  }

  var _cutoffsCache = null;
                                                                                  
  function getCutoffs() {
    if (_cutoffsCache) return _cutoffsCache;
    var FP = getFPConfig();
    var riskyEven = FP.value('MergeRules', 'prediction_bar_cutoff_risky_even_pct');
    var evenStrong = FP.value('MergeRules', 'prediction_bar_cutoff_even_strong_pct');
    _cutoffsCache = { riskyEven: riskyEven, evenStrong: evenStrong };
    return _cutoffsCache;
  }

  function getCombatLive() {
    var CL = (typeof window !== 'undefined' && window.CombatLive) ? window.CombatLive
      : (typeof globalThis !== 'undefined' ? globalThis.CombatLive : null);
    if (!CL) throw new Error('[PredictionBar] window.CombatLive is missing — load js/combat-live.js before js/prediction-bar.js\'s gameplay functions.');
    return CL;
  }

  function _resetConfigCacheForTests() { _cutoffsCache = null; }

                                                                                
                                                                 
                                                                                
  function classifyBand(winRate, cutoffs) {
    if (winRate >= cutoffs.evenStrong) return 'strong';
    if (winRate >= cutoffs.riskyEven) return 'even';
    return 'risky';
  }

                                                                      
                                                                                         
                                                                         
                                                                             
                                                                         
                                          
                                                                        
                                                                   
                                                                               
  function compute(party, expedition, trials) {
    var CL = getCombatLive();
    var est = CL.estimate(party, expedition, trials);
    var cutoffs = getCutoffs();
    return { winRate: est.winRate, trials: est.trials, band: classifyBand(est.winRate, cutoffs), cutoffs: cutoffs };
  }

                                                                                
                                                                         
                                                                           
                                                                         
                           
                                                                                
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  }); }
  function clamp01(n) { return Math.max(0, Math.min(1, n)); }

                                                            
                                                                 
                                                                             
                                                                         
                                                                            
                                                                          
                                                                           
                                                                  
  function renderHTML(result, opts) {
    opts = opts || {};
    var band = result.band || 'risky';
    var pct = (clamp01(result.winRate) * 100);
    var c1 = (clamp01(result.cutoffs.riskyEven) * 100).toFixed(1);
    var c2 = (clamp01(result.cutoffs.evenStrong) * 100).toFixed(1);
    var pctStr = pct.toFixed(1);
    var label = opts.empty ? 'Pick your party' : bandLabel(band);
    var pointerStyle = 'left:' + pctStr + '%';
    var trackStyle = '--pb-c1:' + c1 + '%;--pb-c2:' + c2 + '%';
    return '<div class="pb" data-band="' + esc(band) + '"' + (opts.empty ? ' data-empty="1"' : '') + '>'
      + '<div class="pb-face pb-face--' + esc(band) + '"><img src="' + esc(facePath(band)) + '" alt="' + esc(bandLabel(band)) + ' frog reaction" draggable="false"></div>'
      + '<div class="pb-main">'
        + '<div class="pb-head"><span class="pb-eyebrow">Squad</span><div class="pb-label">' + esc(label) + '</div></div>'
        + '<div class="pb-track" style="' + trackStyle + '" role="meter" aria-valuemin="0" aria-valuemax="100"'
          + ' aria-valuenow="' + pctStr + '" aria-label="Expedition win chance: ' + esc(label) + '">'
          + '<div class="pb-fill" style="width:' + pctStr + '%"></div>'
          + '<div class="pb-pointer" style="' + pointerStyle + '"></div>'
        + '</div>'
        + '<div class="pb-ticks"><span>Risky</span><span>Even Odds</span><span>Strong</span></div>'
      + '</div>'
    + '</div>';
  }

  return {
    BAND_ORDER: BAND_ORDER,
    facePath: facePath,
    bandLabel: bandLabel,
    getCutoffs: getCutoffs,
    classifyBand: classifyBand,
    compute: compute,
    renderHTML: renderHTML,
    _resetConfigCacheForTests: _resetConfigCacheForTests
  };
});
