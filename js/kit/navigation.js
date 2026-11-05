                                                                               
                                                                            
                                                                           

                                                                    
                                                                                
                                                   
                                                         
                                                                        

                                                                            
                                                           

                                                                   
                                                                         
                                
                                                                                  
(function (g) {
  'use strict';
  var K = g.KitUI;
  if (!K) return;
  var esc = K.esc, cls = K.cls;

                                                                  
                                                                           
  var FALLBACK_ICONS = {
    'currency/tadpoles': 'assets/ui2/currency/tadpoles.png'                                       
  };
  function icon(name) {
    return (K.ICONS && K.ICONS[name]) || FALLBACK_ICONS[name] || 'assets/ui2/kit/icons/' + name.replace('/', '-') + '.png';
  }
  var ASSET = {
    settings: 'assets/ui2/grimoire/btn_settings.png'                                       
  };

  function img(src, className) {
    return '<img src="' + esc(src) + '" alt="" draggable="false"' + (className ? ' class="' + className + '"' : '') + '>';
  }
  function art(opts, fallbackSrc) {
    if (opts.iconHTML != null) return opts.iconHTML;
    var src = opts.iconSrc || fallbackSrc;
    return src ? img(src) : '';
  }

                                                         
                                                                          
                                                                               
                                                                            
                               
  function dockTab(opts) {
    opts = opts || {};
    var active = opts.state ? opts.state === 'active' : !!opts.active;
    var label = opts.label || '';
    return '<button type="button" class="' + cls('kit-dock__item', active ? 'is-active' : '', opts.className) + '"'
      + (opts.key ? ' data-tab="' + esc(opts.key) + '"' : '')
      + (opts.onclick ? ' onclick="' + opts.onclick + '"' : '')
      + ' aria-label="' + esc(opts.ariaLabel || label) + '" aria-current="' + (active ? 'page' : 'false') + '">'
      + '<span class="kit-dock__iconwrap">' + art(opts)
      + (opts.dot ? '<span class="kit-dock__dot' + (opts.gold ? ' gold' : '') + '"></span>' : '') + '</span>'
      + (active && label ? '<span class="kit-dock__label">' + esc(label) + '</span>' : '')
      + '</button>';
  }

                                                         
                                                                                 
                                                                            
                                                                                
                                                                           
                               
  var TABS = [
    { key: 'shop', label: 'Shop' },
    { key: 'upgrades', label: 'Upgrades' },
    { key: 'expedition', label: 'Expedition' },
    { key: 'grimoire', label: 'Grimoire' },
    { key: 'harvesting', label: 'Harvesting' }
  ];
  function hudDock(opts) {
    opts = opts || {};
    var tabs = opts.tabs || TABS;
    var active = opts.active ? String(opts.active).toLowerCase() : null;
    return '<nav class="' + cls('kit-dock', opts.className) + '" aria-label="' + esc(opts.ariaLabel || 'Main navigation') + '">'
      + tabs.map(function (t) {
        var key = t.key || String(t.label || '').toLowerCase();
        return dockTab({
          key: key, label: t.label,
          active: key === active,
          iconHTML: t.iconHTML, iconSrc: t.iconSrc || (t.iconHTML == null ? icon('nav/' + key) : null),
          dot: t.dot, gold: t.gold, ariaLabel: t.ariaLabel,
          onclick: t.onclick || (opts.onclick ? String(opts.onclick).split('{key}').join(key) : '')
        });
      }).join('')
      + '</nav>';
  }
  hudDock.TABS = TABS;

                                                                                  
  function plusButton(onclick, ariaLabel) {
    if (K.currencyPlus) return K.currencyPlus({ onclick: onclick, ariaLabel: ariaLabel, className: 'kit-pill__plus kit-chip__plus' });
    return '<button type="button" class="kit-pill__plus kit-chip__plus" onclick="' + onclick + '" aria-label="' + esc(ariaLabel) + '">+</button>';
  }

                                                          
                                                                          
                                                                   
                                                                     
                                                                       
                                        
  function pondChip(opts) {
    opts = opts || {};
    var level = opts.level == null ? 'LV 1' : (typeof opts.level === 'number' ? 'LV ' + opts.level : opts.level);
    var frogs = opts.frogs != null ? opts.frogs : (opts.count != null ? opts.count + (opts.cap != null ? '/' + opts.cap : '') : '');
    return '<div class="' + cls('kit-chip', opts.mutedLevel ? 'kit-chip--muted-level' : '', opts.className) + '">'
      + '<span class="kit-chip__level"><span class="kit-chip__eyebrow">' + esc(opts.eyebrow || 'POND') + '</span>'
      + '<span class="kit-chip__lv">' + esc(level) + '</span></span>'
      + '<span class="kit-chip__icon">' + art(opts, icon('currency/tadpoles')) + '</span>'
      + '<span class="kit-chip__value">' + esc(frogs) + '</span>'
      + (opts.plusOnclick ? plusButton(opts.plusOnclick, opts.plusAriaLabel || 'Upgrade the pond') : '')
      + '</div>';
  }

                                                                
                                                                                       
  function settingsButton(opts) {
    opts = opts || {};
    return '<button type="button" class="' + cls('kit-gear', opts.className) + '"'
      + (opts.id ? ' id="' + esc(opts.id) + '"' : '')
      + (opts.onclick ? ' onclick="' + opts.onclick + '"' : '')
      + ' aria-label="' + esc(opts.ariaLabel || 'Settings') + '">' + img(opts.iconSrc || ASSET.settings) + '</button>';
  }

                                                        
                                                                               
                                                                          
                                                                    
                                                                             
  function pillHTML(p) {
    if (typeof p === 'string') return p;
    var o = {};
    for (var k in p) if (Object.prototype.hasOwnProperty.call(p, k)) o[k] = p[k];
    if (o.icon == null && o.iconSrc) o.icon = img(o.iconSrc);
    return K.pill(o);
  }
  function topBar(opts) {
    opts = opts || {};
    var context = opts.context === 'screen' ? 'screen' : 'pond';
    var pills = (opts.pills || []).map(pillHTML);
    return '<div class="' + cls('kit-hud-top__bar', 'kit-hud-top__bar--' + context, opts.className) + '"'
      + (opts.style ? ' style="' + esc(opts.style) + '"' : '') + '>'
      + (context === 'pond' ? pondChip(opts.pond) : '')
      + (pills.length ? K.rail(pills) : '')
      + (opts.settings === false ? '' : settingsButton(opts.settings))
      + '</div>';
  }

  K.dockTab = dockTab;
  K.hudDock = hudDock;
  K.pondChip = pondChip;
  K.settingsButton = settingsButton;
  K.topBar = topBar;
})(typeof window !== 'undefined' ? window : globalThis);
