                                                                               
                                                                      
                 

                                                                                
                                                                              
                                                                               
                                                             
                                                                           
                                                                
                                                                    
                                                                      
                                                                               
                                                                                     
                                                                              
                                                                                  
(function (g) {
  'use strict';
  var K = g.KitUI;
  if (!K) throw new Error('js/kit/feedback.js needs js/ui-kit.js (KitUI) loaded first');

  var GEMS = 'assets/ui2/currency/bluediamond.png';

  K.rewardCountTile = function (opts) {
    opts = opts || {};
    var art = opts.iconHTML != null && !opts.imgSrc ? opts.iconHTML
      : '<img src="' + K.esc(opts.imgSrc || (K.ICONS && K.ICONS['currency/gems']) || GEMS) + '" alt="" draggable="false">';
    var amt = opts.amount != null
      ? '<div class="kit-reward-count__band"><span class="kit-reward-count__amt">'
        + K.esc((opts.prefix != null ? opts.prefix : '×') + opts.amount) + '</span></div>'
      : '';
    var label = opts.name ? ' role="img" aria-label="' + K.esc(opts.name + (opts.amount != null ? ' ×' + opts.amount : '')) + '"' : '';
    return '<div class="' + K.cls('kit-reward-count', opts.className) + '"' + label + '>'
      + '<span class="kit-reward-count__art"' + (label ? ' aria-hidden="true"' : '') + '>' + art + '</span>'
      + amt + '</div>';
  };

  K.toast = function (message, opts) {
    opts = opts || {};
    return '<div class="' + K.cls('kit-toast', opts.className) + '" role="status"'
      + (opts.id ? ' id="' + K.esc(opts.id) + '"' : '') + '>'
      + '<span class="kit-toast__msg">' + K.esc(message) + '</span></div>';
  };

  K.sheen = function (opts) {
    opts = opts || {};
    return '<span class="' + K.cls('kit-sheen', opts.className) + '" aria-hidden="true">'
      + '<span class="kit-sheen__track"' + (opts.still ? ' style="animation:none"' : '') + '>'
      + '<i class="kit-sheen__band"></i></span></span>';
  };
})(typeof window !== 'undefined' ? window : globalThis);
