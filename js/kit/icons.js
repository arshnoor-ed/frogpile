                                                                               
                                                                                 

                                                                            
                                                                          
                                                                                
                                                                              
                                                                                 
                            

                                                                               
                                                                            
                                                                             
                                                                                          
                                                                                  
(function (g) {
  'use strict';
  var K = g.KitUI;
  if (!K) throw new Error('js/kit/icons.js needs js/ui-kit.js (KitUI) loaded first');

  var KIT = 'assets/ui2/kit/icons/';
  K.ICONS = {
    'currency/gems': 'assets/ui2/currency/bluediamond.png',
    'currency/wood': 'assets/ui2/currency/wood.png',
    'currency/seeds': 'assets/ui2/currency/seed.png',
    'currency/bones': 'assets/ui2/currency/bone.png',
    'currency/stone': 'assets/ui2/currency/rock.png',
    'currency/flies': 'assets/ui2/currency/fly.png',
    'currency/tadpoles': 'assets/ui2/currency/tadpoles.png',
    'stat/attack': 'assets/ui2/icon/atk_icon.png',
    'stat/defense': 'assets/ui2/icon/def_icon.png',
    'stat/hp': 'assets/ui2/icon/hp_icon.png',
    'nav/shop': KIT + 'nav-shop.png',
    'nav/upgrades': KIT + 'nav-upgrades.png',
    'nav/expedition': KIT + 'nav-expedition.png',
    'nav/grimoire': KIT + 'nav-grimoire.png',
    'nav/harvesting': KIT + 'nav-harvesting.png',
    'nav/missions': KIT + 'nav-missions.png',
    'nav/tasks': KIT + 'nav-tasks.png',
    'ui/close': KIT + 'ui-close.png',
    'ui/locked': KIT + 'ui-locked.png',
    'ui/lock-closed': 'assets/ui2/grimoire/icon_lock.png',
    'ui/lock-open': KIT + 'ui-lock-open.png',
    'ui/hammer': 'assets/ui2/grimoire/icon_hammer.png',
    'ui/power': 'assets/ui2/grimoire/icon_power.png',
    'ui/pencil': 'assets/ui2/kit/frog/ui-pencil.svg'
  };

  var warned = {};

                                                              
                                                                                    
                                 
                                                                                
  K.icon = function (name, opts) {
    opts = opts || {};
    var src = K.ICONS[name];
    if (!src) {
      if (!warned[name]) { warned[name] = 1; if (g.console) g.console.warn('[KitUI.icon] unknown icon "' + name + '"'); }
      return '';
    }
    var size = opts.size == null ? 32 : +opts.size;
    return '<img class="' + K.cls('kit-icon', opts.className) + '" src="' + K.esc(src) + '"'
      + ' alt="' + K.esc(opts.alt || '') + '"' + (opts.title ? ' title="' + K.esc(opts.title) + '"' : '')
      + ' width="' + size + '" height="' + size + '" style="width:' + size + 'px;height:' + size + 'px"'
      + ' draggable="false">';
  };
})(typeof window !== 'undefined' ? window : globalThis);
