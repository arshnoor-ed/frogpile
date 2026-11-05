                                                                               
                                                                     
                                             

                                                                               
                                                                               
                           
                                                                         
                                           
                                                                          
                                     
                                                                      
                                                                                 
                                                                               
                                                         
                                                                                  
(function (g) {
  'use strict';
  var K = g.KitUI;
  if (!K) throw new Error('js/kit/actions.js needs js/ui-kit.js (KitUI) loaded first');

  var GEMS = 'assets/ui2/currency/bluediamond.png';
  var CLOSE_ART = 'assets/ui2/kit/actions/button-close.png';

  function copy(o) { var r = {}; for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) r[k] = o[k]; return r; }

  function iconSlot(opts) {
    var inner = '';
    if (opts.iconHTML) inner = opts.iconHTML;
    else if (opts.iconSrc || opts.showIcon) {
      var src = opts.iconSrc || (K.ICONS && K.ICONS['currency/gems']) || GEMS;
      inner = '<img src="' + K.esc(src) + '" alt="" draggable="false">';
    }
    return inner ? '<span class="kit-btn__icon" aria-hidden="true">' + inner + '</span>' : '';
  }

  var baseButton = K.button;
  K.button = function (opts) {
    opts = opts || {};
    var icon = iconSlot(opts);
    if (!icon && opts.shine !== false) return baseButton(opts);
    var o = copy(opts);
    if (opts.shine === false) o.className = K.cls(opts.className, 'kit-btn--noshine');
    if (icon) o.html = icon + (opts.html != null ? opts.html : K.esc(opts.label));
    return baseButton(o);
  };

  function attrs(opts, cls, label) {
    var a = ' class="' + K.cls(cls, opts.className) + '"'
      + ' aria-label="' + K.esc(opts.ariaLabel || label) + '"';
    if (opts.id) a += ' id="' + K.esc(opts.id) + '"';
    if (opts.size) a += ' style="width:' + (+opts.size) + 'px;height:' + (+opts.size) + 'px;"';
    if (opts.disabled) a += ' disabled';
    else if (opts.onclick) a += ' onclick="' + opts.onclick + '"';
    return a;
  }

                                                                              
                                                                                                   
  K.closeButton = function (opts) {
    opts = opts || {};
    return '<button type="button"' + attrs(opts, 'kit-close', 'Close') + '>'
      + '<img class="kit-close__img" src="' + K.esc(opts.imgSrc || CLOSE_ART) + '" alt="" draggable="false">'
      + '</button>';
  };

                                                                                  
                                                                                          
  K.backButton = function (opts) {
    opts = opts || {};
    return '<button type="button"' + attrs(opts, 'kit-back', 'Back') + '>'
      + '<span class="kit-back__glyph" aria-hidden="true">‹</span></button>';
  };
})(typeof window !== 'undefined' ? window : globalThis);
