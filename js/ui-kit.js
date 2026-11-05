                                                                               
                                                                            

                                                                               
                                                                                
                                                                                
                                                                            

                                                           
                                                                             
                                                                       
                                                                             
                                                                             
                                       
                                                                             
                                                                           
                                                                         
                                                                  
                                                                                  
(function (global) {
  'use strict';

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  }); }
  function cls() {
    var out = [];
    for (var i = 0; i < arguments.length; i++) if (arguments[i]) out.push(arguments[i]);
    return out.join(' ');
  }

                                                                        
                                                      
                        
                          
  function button(opts) {
    opts = opts || {};
    var tone = opts.tone || 'gold', shape = opts.shape || 'pill', size = opts.size || 'md';
    var disabled = !!opts.disabled;
    var attrs = ' class="' + cls('kit-btn', 'kit-btn--' + tone, 'kit-shape-' + shape, 'kit-btn--' + size, opts.className) + '"';
    if (opts.id) attrs += ' id="' + esc(opts.id) + '"';
    if (opts.style) attrs += ' style="' + esc(opts.style) + '"';
    if (opts.ariaLabel) attrs += ' aria-label="' + esc(opts.ariaLabel) + '"';
    if (disabled) attrs += ' disabled';
    else if (opts.onclick) attrs += ' onclick="' + opts.onclick + '"';
    return '<button type="button"' + attrs + '>' + (opts.html != null ? opts.html : esc(opts.label)) + '</button>';
  }

                                                                                 
  function panel(innerHTML, opts) {
    opts = opts || {};
    return '<div class="' + cls('kit-panel', opts.className) + '"' + (opts.style ? ' style="' + esc(opts.style) + '"' : '') + '>'
      + '<div class="kit-panel__inner">' + innerHTML + '</div></div>';
  }

                                                                                       
  function card(faceHTML, opts) {
    opts = opts || {};
    return '<div class="' + cls('kit-card', opts.tappable ? 'kit-card--tappable' : '', opts.className) + '"'
      + (opts.onclick ? ' onclick="' + opts.onclick + '"' : '') + '>'
      + '<div class="kit-card__face kit-dots">' + faceHTML + '</div>'
      + (opts.footerHTML || '') + '</div>';
  }

                                                                                      
                                                                            
                                                                     
                                                                                    
  function costChip(iconHTML, need, have, showHave) {
    var ok = (have || 0) >= need;
    return '<span class="' + cls('kit-cost', ok ? 'kit-cost--ok' : 'kit-cost--short') + '">'
      + (iconHTML || '') + '<b>' + (showHave ? esc(Math.floor(have || 0)) + ' / ' : '') + esc(need) + '</b></span>';
  }

                                                                                      
                                                                    
  function pill(opts) {
    opts = opts || {};
    var capHTML = opts.cap ? '<i class="kit-pill__of">/' + esc(opts.cap) + '</i>' : '';
    return '<div class="' + cls('kit-pill', opts.short ? 'kit-pill--short' : '', opts.className) + '">'
      + '<span class="kit-pill__icon">' + (opts.icon || '') + '</span>'
      + (opts.label ? '<span class="kit-pill__label">' + opts.label + '</span>' : '')
      + '<span class="kit-pill__amount"' + (opts.valId ? ' id="' + esc(opts.valId) + '"' : '') + '>' + esc(opts.value) + capHTML + '</span>'
      + (opts.plusOnclick ? '<button class="kit-pill__plus" onclick="' + opts.plusOnclick + '">+</button>' : '')
      + '</div>';
  }

                                                                        
                                                                           
                                      
  function rail(pillsHTML, opts) {
    opts = opts || {};
    return '<div class="' + cls('kit-rail', opts.className) + '">' + pillsHTML.join('') + '</div>';
  }

                                                                                 
                                                                       
                                                                              
  function priceButton(opts) {
    opts = opts || {};
    var need = opts.need || 0, have = opts.have || 0;
    var ok = opts.sold ? false : have >= need;
    var label = opts.sold ? (opts.soldLabel || 'SOLD') : ((opts.label ? opts.label + ' ' : '') + (opts.priceIconHTML || '') + esc(need));
    return button({
      tone: opts.tone || 'gold', shape: opts.shape || 'pill', size: opts.size || 'sm',
      disabled: !ok, onclick: opts.onclick, className: opts.className,
      html: label,
    });
  }

                                                                                               
  function dockTile(opts) {
    opts = opts || {};
    return '<button type="button" class="' + cls('kit-dock__item', opts.active ? 'is-active' : '', opts.locked ? 'is-locked' : '') + '"'
      + ' onclick="' + opts.onclick + '" aria-label="' + esc(opts.label) + '" aria-current="' + (opts.active ? 'page' : 'false') + '">'
      + '<span class="kit-dock__iconwrap">' + (opts.iconHTML || '') + (opts.dot ? '<span class="kit-dock__dot' + (opts.gold ? ' gold' : '') + '"></span>' : '') + '</span>'
      + (opts.active ? '<span class="kit-dock__label">' + esc(opts.label) + '</span>' : '')
      + '</button>';
  }

                                                                               
                                                               
  function progressCount(have, need) {
    return Math.floor(have) + '/' + Math.ceil(need);
  }

                                                                                         
  function missionPlate(opts) {
    opts = opts || {};
    var need = Math.max(1, opts.target || 1), have = Math.max(0, Math.min(opts.progress || 0, need));
    var done = !!opts.done;
    var pct = done ? 100 : Math.round(have / need * 100);
    return '<div class="' + cls('kit-plate', done ? 'kit-plate--ready' : '', opts.className) + '"'
      + (opts.onclick ? ' onclick="' + opts.onclick + '"' : '') + '>'
      + (opts.badge ? '<span class="kit-plate__badge">' + esc(opts.badge) + '</span>' : '')
      + '<div class="kit-plate__text">'
      + '<div class="kit-plate__title">' + esc(opts.title) + '</div>'
      + '<div class="kit-plate__progress"><span class="kit-plate__track"><i class="kit-plate__fill" style="width:' + pct + '%"></i></span>'
      + '<span class="kit-plate__count">' + (done ? '✓' : progressCount(have, need)) + '</span></div>'
      + '</div></div>';
  }

                                                                                     
                                                                          
                                                                         
                                                                           
                                                                      
                                                                            
                                                                           
                                                                               
  function rewardTile(opts) {
    opts = opts || {};
    var rarity = opts.rarity || 'common';
    var media = opts.imgSrc
      ? '<img src="' + esc(opts.imgSrc) + '" draggable="false" alt="" class="kit-reward-tile__img">'
      : '<span class="kit-reward-tile__icon">' + (opts.iconHTML || '') + '</span>';
    var amt = (opts.amount != null) ? '<span class="kit-reward-tile__amt">+' + esc(opts.amount) + '</span>' : '';
                                                                                           
    var style = (opts.delay != null) ? ' style="animation-delay:' + esc(opts.delay) + 's;--kit-reward-delay:' + esc(opts.delay) + 's;"' : '';
    var key = opts.key ? ' data-reward="' + esc(opts.key) + '"' : '';                                         
    var tag = opts.tag ? '<span class="kit-reward-tile__tag">' + esc(opts.tag) + '</span>' : '';
    return '<div class="' + cls('kit-reward-tile', 'kit-reward-tile--' + rarity, opts.className) + '"' + key + style + '>'
      + tag + amt + media + '<span class="kit-reward-tile__name">' + esc(opts.name) + '</span>' + '</div>';
  }

                                                              
                                                                           
                                                                             
                                                                          
                                                                             
  function tabRow(tabs, activeKey) {
    return '<div class="kit-tabrow">' + tabs.map(function (t) {
      var active = t.key === activeKey;
      return button({ tone: active ? (t.tone || 'gold') : 'violet', shape: 'rounded', size: 'sm',
        onclick: t.onclick, label: t.label, className: 'kit-tab' + (active ? ' is-active' : '') });
    }).join('') + '</div>';
  }

  var KitUI = {
    esc: esc, cls: cls,
    button: button, panel: panel, card: card,
    costChip: costChip, pill: pill, rail: rail, priceButton: priceButton,
    dockTile: dockTile, missionPlate: missionPlate, progressCount: progressCount, tabRow: tabRow,
    rewardTile: rewardTile,
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = KitUI;
  else global.KitUI = KitUI;
})(typeof window !== 'undefined' ? window : globalThis);
