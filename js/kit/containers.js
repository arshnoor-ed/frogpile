                                                                               
                                                                            
                                                                           

                                                  
                                                                                 
                                                        

                                                                         
                                                                         

                                                                
                                                                             
                                                              
                                                                                  
(function (g) {
  'use strict';
  var K = g.KitUI;
  if (!K) return;
  var esc = K.esc, cls = K.cls;

                                                                          
                                                              
  var FALLBACK_ICONS = {
    'currency/bones': 'assets/ui2/currency/bone.png',                                 
    'ui/power': 'assets/ui2/grimoire/icon_power.png'                              
  };
  function icon(name) { return (K.ICONS && K.ICONS[name]) || FALLBACK_ICONS[name]; }
  var uid = 0;
  function nextId(prefix) { uid += 1; return prefix + uid; }
  function img(src) { return '<img src="' + esc(src) + '" alt="" draggable="false">'; }

  function closeButton(opts) {
    if (K.closeButton) return K.closeButton(opts);
    return '<button type="button" class="' + cls('kit-close', opts.className) + '" aria-label="' + esc(opts.ariaLabel || 'Close') + '"'
      + (opts.onclick ? ' onclick="' + opts.onclick + '"' : '') + '>×</button>';
  }
  function backButton(opts) {
    if (K.backButton) return K.backButton(opts);
    return '<button type="button" class="' + cls('kit-back', opts.className) + '" aria-label="' + esc(opts.ariaLabel || 'Back') + '"'
      + (opts.onclick ? ' onclick="' + opts.onclick + '"' : '') + '><span aria-hidden="true">‹</span></button>';
  }

                                                      
                                                                           
                                                                             
                                                                            
                                                                             
  K.popup = function (opts) {
    opts = opts || {};
    var id = opts.id || nextId('kit-popup-');
    var footer = opts.footerHTML != null ? opts.footerHTML
      : (opts.primary ? K.button({ tone: opts.primary.tone || 'gold', shape: 'pill', size: 'lg', label: opts.primary.label,
        onclick: opts.primary.onclick, disabled: opts.primary.disabled, className: 'kit-popup__cta' }) : '');
    return '<section class="' + cls('kit-popup', opts.className) + '" id="' + esc(id) + '" role="dialog" aria-modal="true"'
      + (opts.title != null ? ' aria-labelledby="' + esc(id) + '-title"' : '')
      + (opts.style ? ' style="' + esc(opts.style) + '"' : '') + '>'
      + '<header class="kit-popup__header">'
      + (opts.title != null ? '<h2 class="kit-popup__title" id="' + esc(id) + '-title">' + esc(opts.title) + '</h2>' : '')
      + (opts.subtitle != null ? '<p class="kit-popup__subtitle">' + esc(opts.subtitle) + '</p>' : '')
      + '</header>'
      + (opts.onClose ? closeButton({ onclick: opts.onClose, ariaLabel: opts.closeAriaLabel, className: 'kit-popup__close' }) : '')
      + (opts.tabsHTML ? '<div class="kit-popup__tabs">' + opts.tabsHTML + '</div>' : '')
      + '<div class="kit-popup__body">' + (opts.bodyHTML || '') + '</div>'
      + (footer ? '<footer class="kit-popup__footer">' + footer + '</footer>' : '')
      + '</section>';
  };

                                                              
                                                                          
                                                                         
                                                                          
                                                                           
                                                                     
  K.confirmModal = function (opts) {
    opts = opts || {};
    var danger = opts.tone === 'danger';
    var id = opts.id || nextId('kit-confirm-');
    var cancel = opts.cancel || {}, confirm = opts.confirm || {};
    var meta = opts.meta;
    return '<div class="' + cls('kit-confirm', danger ? 'kit-confirm--danger' : '', opts.className) + '" id="' + esc(id) + '"'
      + ' role="alertdialog" aria-modal="true" aria-labelledby="' + esc(id) + '-title"' + (opts.body != null ? ' aria-describedby="' + esc(id) + '-body"' : '') + '>'
      + '<h2 class="kit-confirm__title" id="' + esc(id) + '-title">' + esc(opts.title) + '</h2>'
      + '<div class="kit-confirm__inner">'
      + (opts.body != null ? '<p class="kit-confirm__body" id="' + esc(id) + '-body">' + esc(opts.body) + '</p>' : '')
      + (meta ? '<span class="kit-confirm__meta">' + (meta.iconHTML != null ? meta.iconHTML : img(meta.iconSrc || icon('currency/bones')))
        + '<b>' + esc(meta.label) + '</b></span>' : '')
      + '<div class="kit-confirm__actions">'
      + K.button({ tone: 'violet', shape: 'pill', size: 'sm', label: cancel.label || 'No', onclick: cancel.onclick })
      + K.button({ tone: danger ? 'danger' : 'gold', shape: 'pill', size: 'sm', label: confirm.label || 'Yes',
        onclick: confirm.onclick, disabled: confirm.disabled })
      + '</div></div></div>';
  };

                                                            
                                                                           
                                                                     
                                    
  K.pageHeader = function (opts) {
    opts = opts || {};
    return '<header class="' + cls('kit-page-header', opts.className) + '">'
      + backButton({ onclick: opts.onBack, ariaLabel: opts.backAriaLabel })
      + '<div class="kit-page-header__titles">'
      + '<h2 class="kit-page-header__title">' + esc(opts.title) + '</h2>'
      + (opts.subtitle != null ? '<p class="kit-page-header__subtitle">' + esc(opts.subtitle) + '</p>' : '')
      + '</div>'
      + (opts.power != null ? '<span class="kit-page-header__power" role="img" aria-label="' + esc(opts.powerAriaLabel || ('Power ' + opts.power)) + '">'
        + img(opts.powerIconSrc || icon('ui/power')) + '<b>' + esc(opts.power) + '</b></span>' : '')
      + '</header>';
  };
})(typeof window !== 'undefined' ? window : globalThis);
