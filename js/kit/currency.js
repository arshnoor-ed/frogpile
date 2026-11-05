                                                                               
                                                                               
                                                                      

                                                                               
                                                                         

                                                                             
                             
                                                                              
                                                                             
                                                         
                                                                            
                                                                          
                                                     
                                                         
                                                                   
                                    
                                                                            
                                                                               
                                                                   
                                                     
                                                                          
                                                                                  
(function (g) {
  'use strict';
  var K = g.KitUI;
  if (!K) throw new Error('js/kit/currency.js needs js/ui-kit.js (KitUI) loaded first');

  var GEMS = 'assets/ui2/currency/bluediamond.png';
  var WOOD = 'assets/ui2/currency/wood.png';

  function copy(o) { var r = {}; for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) r[k] = o[k]; return r; }
  function img(src, cls) { return '<img' + (cls ? ' class="' + cls + '"' : '') + ' src="' + K.esc(src) + '" alt="" draggable="false">'; }
  function iconPath(name, fallback) { return (K.ICONS && K.ICONS[name]) || fallback; }
  function num(v) { var n = typeof v === 'number' ? v : parseFloat(v); return isFinite(n) ? n : null; }
  function clamp01(n) { return n < 0 ? 0 : n > 1 ? 1 : n; }

  K.currencyPlus = function (opts) {
    opts = opts || {};
    var a = ' class="' + K.cls('kit-plus', opts.className) + '" aria-label="' + K.esc(opts.ariaLabel || 'Get more') + '"';
    if (opts.id) a += ' id="' + K.esc(opts.id) + '"';
    if (opts.disabled) a += ' disabled';
    else if (opts.onclick) a += ' onclick="' + opts.onclick + '"';
    return '<button type="button"' + a + '>+</button>';
  };

  var basePill = K.pill;
  K.pill = function (opts) {
    opts = opts || {};
    var o = copy(opts);
    if (!('icon' in opts)) o.icon = img(opts.iconSrc || iconPath('currency/gems', GEMS));
    var capped = opts.type === 'capped' || (opts.type == null && opts.fill != null);
    if (capped) o.className = K.cls(opts.className, 'kit-pill--capped');
    o.plusOnclick = null;                                                                
    var html = basePill(o);

    var tail = '';
    if (capped) {
      var f = num(opts.fill);
      if (f == null) { var v = num(opts.value), c = num(opts.cap); f = (v != null && c) ? v / c : 0; }
      tail += '<span class="kit-pill__bar" aria-hidden="true"><i class="kit-pill__fill" style="width:'
        + Math.round(clamp01(f) * 1000) / 10 + '%"></i></span>';
    }
    if (opts.plusOnclick || opts.showPlus) {
      tail += K.currencyPlus({ onclick: opts.plusOnclick, ariaLabel: opts.plusLabel, className: 'kit-pill__plus' });
    }
    if (!tail || html.slice(-6) !== '</div>') return html;
    return html.slice(0, -6) + tail + '</div>';
  };

  var baseCost = K.costChip;
  K.costChip = function (iconHTML, need, have, showHave) {
    if (!iconHTML || typeof iconHTML !== 'object') return baseCost(iconHTML, need, have, showHave);
    var o = iconHTML;
    var icon = o.iconHTML != null ? o.iconHTML
      : (K.icon && !o.iconSrc ? K.icon('currency/wood', { size: 15 }) : img(o.iconSrc || WOOD));
    var h = o.state === 'short' ? -Infinity : o.state === 'ok' ? Infinity : o.have;
    var html = baseCost(icon, o.need, h, o.state ? false : o.showHave);
    return o.className ? html.replace(/^<span class="/, '<span class="' + K.esc(o.className) + ' ') : html;
  };
})(typeof window !== 'undefined' ? window : globalThis);
