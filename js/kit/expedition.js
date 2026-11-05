                                                              
                                                                               
                                                                           
                                                 
  
                                                                            
                                                                             
                                                                
  
                                                                               
                                                                         
                                                                 
   
(function (g) {
  'use strict';
  var K = g.KitUI;
  if (!K) throw new Error('[kit/expedition] js/ui-kit.js must load first');
  var esc = K.esc, cls = K.cls;

  var ART = 'assets/ui2/kit/expedition/';
  var SET = 'assets/frog2/sets/forestSpirit/';
  var SRC = {
    hp: 'assets/ui2/icon/hp_icon.png', atk: 'assets/ui2/icon/atk_icon.png', def: 'assets/ui2/icon/def_icon.png',
    power: 'assets/ui2/grimoire/icon_power.png',
    hammer: 'assets/ui2/grimoire/icon_hammer.png',
    seeds: 'assets/ui2/currency/seed.png',
    crow: 'assets/expeditions/creatures/reedmarsh_crane/idle.png',
    check: 'assets/ui2/kit/traits-gear/family-check.svg',
    body: 'assets/frog2/body/body_01.png'
  };
                                                                
  function icon(key, fallback) { return (K.ICONS && K.ICONS[key]) || fallback; }
  var LADDER = {
    cleared: ART + 'ladder-node-cleared.png', current: ART + 'ladder-node-current.png', locked: ART + 'ladder-node-locked.png'
  };

  function img(src, cl) {
    return '<img' + (cl ? ' class="' + cl + '"' : '') + ' src="' + esc(src) + '" alt="" draggable="false">';
  }
  function on(onclick) { return onclick ? ' onclick="' + onclick + '"' : ''; }
  function mask(src, extra) {
    var u = 'url("' + src + '")';
    return ' style="' + esc('-webkit-mask-image:' + u + ';mask-image:' + u + (extra ? ';' + extra : '')) + '"';
  }
                                                                               
                                                                            
                                                                        
                                        
  function traitArt(src, box, fill, cl) {
    if (typeof K.art === 'function') return K.art(src, { size: box, fill: fill, className: cl });
    return '<span class="' + cls('kit-art', cl) + '" style="display:block;width:' + box + 'px;height:' + box + 'px">' + img(src, 'kit-xp-img') + '</span>';
  }
  function statIcon(kind) {
    if (typeof K.statIconHTML === 'function') return K.statIconHTML(kind);
    return SRC[kind] ? img(SRC[kind], 'kit-staticon') : '';
  }
  function frogArt(w, h) {
    return typeof K.frogStandIn === 'function' ? K.frogStandIn({ width: w, height: h }) : '';
  }
  function chip(state, artHTML) {
    if (typeof K.frogChip === 'function') return K.frogChip({ state: state, artHTML: artHTML });
    return '<span class="' + cls('kit-frogchip', 'kit-frogchip--' + state) + '">' + (state === 'empty' ? '' : (artHTML || '')) + '</span>';
  }

                                                                         
                                                                        
                                                                          
                      
                                                                          
                                                                      
                                                                     
                                                                     
                                    
  K.partyRow = function (o) {
    o = o || {};
    var state = o.state || 'default', name = o.name || '';
    var selected = state === 'selected', working = state === 'working';
    var gear = (o.gear || []).map(function (gr) {
      var icon = gr.iconHTML || (gr.imgSrc ? img(gr.imgSrc) : statIcon(gr.kind));
      return '<span class="' + cls('kit-party-row__gear', 'kit-party-row__gear--' + (gr.rarity || 'rare')) + '"'
        + (gr.label ? ' title="' + esc(gr.label) + '"' : '') + '>' + icon + '</span>';
    }).join('');
    var stats = ['hp', 'atk', 'def'].filter(function (k) { return o[k] != null; }).map(function (k) {
      if (typeof K.boostPill === 'function') return K.boostPill({ size: 'sm', kind: k, text: o[k], className: 'kit-party-row__stat' });
      return '<span class="kit-boost kit-boost--sm kit-party-row__stat">' + statIcon(k) + '<b>' + esc(o[k]) + '</b></span>';
    }).join('');
    var label = o.ariaLabel || (working ? name + ' (working)' : (selected ? 'Deselect ' : 'Select ') + name);
    return '<div class="' + cls('kit-party-row', 'kit-party-row--' + state, o.className) + '">'
      + '<button type="button" class="kit-party-row__hit" aria-label="' + esc(label) + '" aria-pressed="' + selected + '"'
        + (working ? ' disabled' : on(o.onclick)) + '></button>'
      + '<span class="kit-party-row__portrait"><span class="kit-party-row__art">' + (o.artHTML || frogArt(57.5, 48.75)) + '</span></span>'
      + '<span class="kit-party-row__info">'
        + '<span class="kit-party-row__title"><span class="kit-party-row__name">' + esc(name) + '</span>' + gear + '</span>'
        + '<span class="kit-party-row__stats">' + stats + '</span>'
      + '</span>'
      + (o.infoOnclick === false ? '' : '<button type="button" class="kit-party-row__info-btn" aria-label="' + esc(o.infoAriaLabel || 'Inspect ' + name) + '"' + on(o.infoOnclick) + '>i</button>')
      + '</div>';
  };

                                                                         
                                                                           
                                                                           
                                                                    
                                                    
                                                                           
                                                                
                                                                            
                                                               
                                              
                                                                     
                                                                   
  K.partyTray = function (o) {
    o = o || {};
    var picks = (o.picks || []).map(function (p, i) {
      var c = chip(p.state || 'default', p.artHTML);
      return p.onclick
        ? '<button type="button" class="kit-party-tray__pick" aria-label="' + esc(p.ariaLabel || 'Remove frog ' + (i + 1)) + '"' + on(p.onclick) + '>' + c + '</button>'
        : c;
    }).join('');
    if (o.openSlot !== false) {
      var empty = chip('empty');
      picks += o.openSlotOnclick
        ? '<button type="button" class="kit-party-tray__pick" aria-label="Add a frog"' + on(o.openSlotOnclick) + '>' + empty + '</button>'
        : empty;
    }
    var rec = o.recText != null ? o.recText : (o.recommended != null ? '/ ' + o.recommended + ' recommended' : '');
    var repair = o.repair ? K.button({
      tone: 'danger', size: 'tag', shape: 'pill', className: 'kit-party-tray__repair',
      iconSrc: o.repair.iconSrc || icon('ui/hammer', SRC.hammer), label: o.repair.label || 'Repair',
      onclick: o.repair.onclick, ariaLabel: o.repair.ariaLabel
    }) : '';
    var send = o.send || {};
    return '<div class="' + cls('kit-party-tray', o.tone === 'bar' ? 'kit-party-tray--bar' : '', o.className) + '">'
      + (o.headHTML || '')
      + '<div class="kit-party-tray__picks">' + picks + '</div>'
      + '<div class="kit-party-tray__squad">'
        + '<span class="kit-party-tray__label">' + esc(o.label || 'SQUAD') + '</span>'
        + (o.power != null ? img(o.powerIconSrc || icon('ui/power', SRC.power), 'kit-party-tray__power-icon')
          + '<span class="' + cls('kit-party-tray__power', o.powerUnder ? 'kit-party-tray__power--under' : '') + '">' + esc(o.power) + '</span>' : '')
        + '<span class="kit-party-tray__rec">' + esc(rec) + '</span>'
        + repair
      + '</div>'
      + K.button({
        tone: 'green', size: 'md', shape: 'pill', className: cls('kit-party-tray__send', send.className),
        label: send.label || 'SEND PARTY', onclick: send.onclick, disabled: send.disabled, ariaLabel: send.ariaLabel
      })
      + '</div>';
  };

                                                                         
                                                                         
                                                                          
                                                                       
                                                                 
                                                  
  K.ladderNode = function (o) {
    o = o || {};
    var state = LADDER[o.state] ? o.state : 'cleared';
    return '<button type="button" class="' + cls('kit-ladder-node', 'kit-ladder-node--' + state, o.className) + '"'
      + ' aria-label="' + esc(o.ariaLabel || 'Level ' + o.level + ', ' + state) + '"'
      + (state === 'current' ? ' aria-current="step"' : '')
      + (o.disabled ? ' disabled' : on(o.onclick)) + '>'
      + img(o.artSrc || LADDER[state], 'kit-ladder-node__art')
      + '<span class="kit-ladder-node__level" aria-hidden="true">' + esc(o.level) + '</span>'
      + '</button>';
  };

                                                                         
                                                                          
                            
                                                                        
                                                                   
                                
  K.mapPlate = function (o) {
    o = o || {};
    var locked = o.state === 'locked', showZone = o.showZone !== false;
    var label = o.ariaLabel || (locked ? (o.zone ? o.zone + ', locked' : 'Locked zone') : (o.zone || '') + (o.detail ? ' ' + o.detail : ''));
    var rivet = img(ART + (locked ? 'map-plate-rivet-locked.svg' : 'map-plate-rivet.svg'), 'kit-map-plate__rivet');
    var body = locked
      ? (showZone ? '<span class="kit-map-plate__q">' + esc(o.lockedTitle || '???') + '</span>' : '')
        + '<span class="kit-map-plate__locked">' + esc(o.lockedLabel || 'Locked') + '</span>'
        + img(ART + 'map-plate-padlock.svg', 'kit-map-plate__padlock')
      : img(ART + 'map-plate-shine.svg', 'kit-map-plate__shine')
        + (showZone ? '<span class="kit-map-plate__zone">' + esc(o.zone) + '</span>' : '')
        + '<span class="kit-map-plate__detail">' + esc(o.detail) + '</span>';
    return '<button type="button" class="' + cls('kit-map-plate', locked ? 'kit-map-plate--locked' : '', o.className) + '"'
      + ' aria-label="' + esc(label) + '"' + on(o.onclick) + '>'
      + body
      + rivet.replace('kit-map-plate__rivet"', 'kit-map-plate__rivet kit-map-plate__rivet--l"')
      + rivet.replace('kit-map-plate__rivet"', 'kit-map-plate__rivet kit-map-plate__rivet--r"')
      + '</button>';
  };

                                                                         
                                                                      
                                                                       
                                         
                                                                          
                                                         
  K.weaknessSlot = function (o) {
    o = o || {};
    var known = o.state === 'known' || o.known === true;
    var badge = known
      ? (o.iconHTML || traitArt(o.iconSrc || SET + 'shield.png', 21, 18 / 21, 'kit-weakness__icon'))
      : '<span class="kit-weakness__q">?</span>';
    return '<span class="' + cls('kit-weakness', known ? 'kit-weakness--known' : '', o.glow ? 'kit-weakness--glow' : '', o.className) + '"'
      + ' aria-label="' + esc((o.label || 'Weak to') + ': ' + (known ? (o.iconLabel || 'known') : 'unknown')) + '">'
      + '<span class="kit-weakness__label" aria-hidden="true">' + esc(o.label || 'WEAK TO') + '</span>'
      + '<span class="kit-weakness__badge" aria-hidden="true">' + badge + '</span></span>';
  };

                                                                         
                                                                   
                                                               
                                                                       
                                                                             
                                                          
  K.enemyRow = function (o) {
    o = o || {};
    var boss = o.kind === 'boss';
    return '<div class="' + cls('kit-enemy-row', boss ? 'kit-enemy-row--boss' : '', o.className) + '">'
      + '<span class="kit-enemy-row__portrait"><span class="kit-enemy-row__art">' + (o.artHTML || img(o.imgSrc || SRC.crow)) + '</span></span>'
      + '<span class="kit-enemy-row__info">'
        + '<span class="kit-enemy-row__top"><span class="kit-enemy-row__name">' + esc(o.name) + '</span>'
          + (o.count != null && o.count !== '' ? '<span class="kit-enemy-row__count">' + esc(o.count) + '</span>' : '')
          + (boss ? '<span class="kit-enemy-row__boss">' + esc(o.bossLabel || 'BOSS') + '</span>' : '')
        + '</span>'
        + (o.type ? '<span class="kit-enemy-row__type">' + esc(o.type) + '</span>' : '')
        + (o.stage ? '<span class="kit-enemy-row__stage">' + esc(o.stage) + '</span>' : '')
      + '</span>'
      + (o.weakness === false ? '' : K.weaknessSlot(o.weakness || {}))
      + '</div>';
  };

                                                                         
                                                                         
                                                                           
                                                                            
                                                                          
                                                                             
                               
  K.enemyChip = function (o) {
    o = o || {};
    var boss = o.kind === 'boss';
    var weak = o.weak === false ? false : (o.weak === 'known' || o.weak === 'countered' ? o.weak : 'unknown');
    var dot = weak === false ? '' : '<span class="' + cls('kit-enemy-chip__weak', weak !== 'unknown' ? 'kit-enemy-chip__weak--' + weak : '') + '" aria-hidden="true">'
      + '<span class="kit-enemy-chip__q">' + (weak === 'countered' ? '✓' : '?') + '</span></span>';
    var state = weak === 'countered' ? ', countered' : (weak === 'known' ? ', weakness known' : '');
    return '<span class="' + cls('kit-enemy-chip', boss ? 'kit-enemy-chip--boss' : '', o.defeated ? 'kit-enemy-chip--defeated' : '', o.className) + '" role="img"'
      + ' aria-label="' + esc((o.name || 'Enemy') + (boss ? ', boss' : '') + state + (o.defeated ? ', defeated' : '')) + '">'
      + '<span class="kit-enemy-chip__art">' + (o.artHTML || img(o.imgSrc || SRC.crow)) + '</span>'
      + dot + '</span>';
  };

                                                                         
                                                                        
                                                                          
                                                                 
                                                                      
                                                                        
                                                                         
                                                                      
                                                                             
                                                                           
                                                                             
                                
  var BEHIND = ['aura', 'head', 'back', 'weapon'], FRONT = ['mouth', 'shield'];
  K.setPaperDoll = function (o) {
    o = o || {};
    var owned = o.owned || { head: true, mouth: true }, srcs = o.art || {}, seat = o.seat || {};
    var body = o.bodySrc || SRC.body;
    function layer(slot) {
      if (o.art && !srcs[slot]) return '';
      var src = srcs[slot] || SET + slot + '.png';
      var xf = seat[slot] ? 'transform:' + seat[slot] : '';
      return '<span class="kit-paper-doll__ghost"' + mask(src, xf) + '></span>'
        + (owned[slot] ? '<img class="kit-paper-doll__art" src="' + esc(src) + '" alt="" draggable="false"' + (xf ? ' style="' + esc(xf) + '"' : '') + '>' : '');
    }
    return '<span class="' + cls('kit-paper-doll', o.className) + '" aria-hidden="true"' + (o.size ? ' style="width:' + (+o.size) + 'px"' : '') + '>'
      + '<span class="kit-paper-doll__frame"' + (o.frame ? ' style="transform:' + esc(o.frame) + '"' : '') + '>'
      + BEHIND.map(layer).join('')
      + '<span class="kit-paper-doll__rim"' + mask(body) + '></span>'
      + '<span class="kit-paper-doll__body"' + mask(body) + '></span>'
      + FRONT.map(layer).join('')
      + '</span></span>';
  };

                                                                         
                                                                           
                                                                         
                                                                              
                                                                             
                                                                         
                           
  var SPARKLES = [[18.33, 28, 14], [80.32, 38, 12], [15.63, 108, 10], [84.37, 110, 14]];
  function setPiece(p) {
    var owned = !!p.owned;
    return '<span class="' + cls('kit-set-piece', owned ? 'kit-set-piece--owned' : 'kit-set-piece--missing') + '"'
      + (p.name ? ' role="img" aria-label="' + esc(p.name + (owned ? ', owned' : ', missing')) + '"' : '') + '>'
      + (p.imgSrc ? traitArt(p.imgSrc, 49, 44 / 49, 'kit-set-piece__art') : '')
      + (owned ? img(SRC.check, 'kit-set-piece__check') : '') + '</span>';
  }
  K.setPiece = setPiece;
  K.setRewardPanel = function (o) {
    o = o || {};
    var tone = o.rarityTone || String(o.rarity || 'rare').toLowerCase();
    var sparkles = SPARKLES.map(function (s) {
      return '<img class="kit-set-reward__sparkle" src="' + ART + 'set-reward-sparkle.svg" alt="" draggable="false"'
        + ' style="left:' + s[0] + '%;top:' + s[1] + 'px;width:' + s[2] + 'px;height:' + s[2] + 'px">';
    }).join('');
    return '<div class="' + cls('kit-set-reward', o.className) + '">'
      + '<div class="kit-set-reward__head">'
        + '<span class="kit-set-reward__eyebrow">' + esc(o.eyebrow || 'TRAIT REWARD') + '</span>'
        + '<span class="kit-set-reward__set">' + esc(o.set) + '</span>'
        + (o.rarity ? '<span class="' + cls('kit-set-reward__rarity', 'kit-set-reward__rarity--' + tone) + '">' + esc(o.rarity) + '</span>' : '')
        + (o.count != null ? '<span class="kit-set-reward__count">' + esc(o.count) + '</span>' : '')
      + '</div>'
      + '<div class="kit-set-reward__stage">' + sparkles
        + '<span class="kit-set-reward__caption">' + esc(o.caption != null ? o.caption : 'OWNED IN COLOUR · MISSING AS SHADOWS') + '</span>'
        + (o.dollHTML || K.setPaperDoll(o.doll || {}))
      + '</div>'
      + '<div class="kit-set-reward__pieces">' + (o.pieces || []).map(setPiece).join('') + '</div>'
      + (o.rule ? '<div class="kit-set-reward__rule">' + esc(o.rule) + '</div>' : '')
      + '</div>';
  };

                                                                         
                                                                      
                                                                         
                                     
  K.rewardPill = function (o) {
    o = o || {};
    var rare = o.type === 'rare';
    return '<span class="' + cls('kit-reward-pill', rare ? 'kit-reward-pill--rare' : '', o.className) + '">'
      + '<span class="kit-reward-pill__icon">' + (o.iconHTML || img(o.iconSrc || icon('currency/seeds', SRC.seeds))) + '</span>'
      + '<span class="kit-reward-pill__amount">' + esc(o.amount) + '</span>'
      + (rare && o.chance != null ? '<span class="kit-reward-pill__chance">' + esc(o.chance) + '</span>' : '')
      + '</span>';
  };

                                                                         
                                                                      
                                                                
                                                                      
                                                                         
                                                  
  K.dropOdds = function (o) {
    o = o || {};
    var open = o.open !== false, rows = o.rows || [];
    var mini = open ? '' : '<span class="kit-drop-odds__mini">' + rows.map(function (r) {
      return '<span class="' + cls('kit-drop-odds__mini-item', r.rarity && r.rarity !== 'rare' ? 'kit-drop-odds__mini-item--' + r.rarity : '') + '">'
        + traitArt(r.imgSrc, 23, 22 / 23) + '</span>';
    }).join('') + '</span>';
    var head = '<button type="button" class="kit-drop-odds__head" aria-expanded="' + open + '"'
      + ' aria-label="' + esc(o.ariaLabel || (open ? 'Hide drop odds' : 'Show drop odds')) + '"' + on(o.onclick) + '>'
      + '<span class="kit-drop-odds__title">' + esc(o.title || 'DROP ODDS') + '</span>'
      + '<span class="kit-drop-odds__summary">' + esc(open ? o.summary : o.closedSummary) + '</span>'
      + mini
      + img(ART + (open ? 'drop-odds-chevron-up.svg' : 'drop-odds-chevron-down.svg'), 'kit-drop-odds__chevron')
      + '</button>';
    var body = open ? rows.map(function (r) {
      return '<div class="kit-drop-odds__row">'
        + '<span class="' + cls('kit-drop-odds__frame', r.rarity && r.rarity !== 'rare' ? 'kit-drop-odds__frame--' + r.rarity : '') + '">' + traitArt(r.imgSrc, 43, 38 / 43) + '</span>'
        + '<span class="kit-drop-odds__text"><span class="kit-drop-odds__name">' + esc(r.name) + '</span>'
          + (r.stat ? '<span class="kit-drop-odds__stat">' + esc(r.stat) + '</span>' : '') + '</span>'
        + '<span class="kit-drop-odds__pct">' + esc(r.pct) + '</span>'
        + '</div>';
    }).join('') + (o.owned ? '<div class="kit-drop-odds__owned">' + esc(o.owned) + '</div>' : '') : '';
    return '<div class="' + cls('kit-drop-odds', open ? 'kit-drop-odds--open' : '', o.className) + '">' + head + body + '</div>';
  };
})(typeof window !== 'undefined' ? window : globalThis);
