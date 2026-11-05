                                                                  
                                                                          
                                                                            
                                           
  
                                                                            
                                                                           
                                   
   
(function (g) {
  'use strict';
  var K = g.KitUI;
  if (!K || !K.art) throw new Error('[kit/traits-gear] js/ui-kit.js and js/kit/frog.js must load first');
  var esc = K.esc, cls = K.cls;
  var HAMMER = 'assets/ui2/grimoire/icon_hammer.png';
  var PLUS = 'assets/ui2/kit/frog/equip-empty-plus.svg';
  var CHECK = 'assets/ui2/kit/traits-gear/family-check.svg';
  var ARROW = 'assets/ui2/kit/traits-gear/boost-arrow.svg';
  var TIERS = ['common', 'rare', 'epic', 'legendary'];
  function tier(r) { return TIERS.indexOf(r) >= 0 ? r : 'common'; }

  function tap(o, label) {
    return o.onclick ? ' onclick="' + o.onclick + '"' + (label ? ' aria-label="' + esc(label) + '"' : '') : '';
  }
  function hammer(cl) { return '<img class="' + (cl || 'kit-hammer') + '" src="' + HAMMER + '" alt="" draggable="false">'; }
  function boost(b) { return b ? K.boostPill({ size: 'sm', text: b.text, iconHTML: b.iconHTML, kind: b.kind }) : ''; }

                                                                           
                                                                      
                                                                         
                                                                  
  function band(pct) { return pct > 0.5 ? 'green' : pct > 0.2 ? 'amber' : 'red'; }
  function durabilityBar(o) {
    o = o || {};
    var pct = Math.max(0, Math.min(1, +o.pct || 0));
    var label = o.label != null ? o.label : Math.round(pct * 100) + '%';
    return '<span class="' + cls('kit-dur', 'kit-dur--' + band(pct), 'kit-dur--' + (o.tone || 'muted'), o.className) + '"'
      + (o.ariaLabel ? ' aria-label="' + esc(o.ariaLabel) + '"' : '') + '>'
      + '<span class="kit-dur__track"><i style="width:' + Math.round(pct * 100) + '%"></i></span><b>' + esc(label) + '</b></span>';
  }

                                                                           
                                                                            
                                                                          
                                                                               
                                                                                      
  function traitTile(o) {
    o = o || {};
    var r = tier(o.rarity);
    var a = o.artHTML || K.art(o.artSrc, { size: 54, sil: !o.found, aura: o.aura, fill: 0.78 });
    if (!o.found) {
      return '<div class="' + cls('kit-traittile', 'is-missing', o.className) + '" aria-label="' + esc(o.ariaLabel || 'Undiscovered ' + r + ' trait') + '">'
        + a + '<b class="kit-traittile__name">???</b><span class="kit-rarity-dot kit-rarity-dot--' + r + '"></span></div>';
    }
    var tag = o.onclick ? 'button' : 'div';
    return '<' + tag + (tag === 'button' ? ' type="button"' : '') + ' class="' + cls('kit-traittile', 'kit-tone--' + r, o.className) + '"'
      + tap(o, o.ariaLabel || o.name) + '>' + a + '<b class="kit-traittile__name">' + esc(o.name) + '</b>' + boost(o.boost) + (o.badgeHTML || '') + '</' + tag + '>';
  }

                                                                           
                                                                          
                                                                          
                                                                                
                                                           
  function equipCell(o) {
    o = o || {};
    var state = o.state || 'equipped', r = tier(o.rarity), slot = o.slot || 'Sword';
    var tag = o.onclick ? 'button' : 'div', open = '<' + tag + (tag === 'button' ? ' type="button"' : '');
    if (state === 'empty') {
      return open + ' class="' + cls('kit-equipcell', 'kit-equipcell--empty', o.className) + '"' + tap(o, o.ariaLabel || slot + ': ' + (o.emptyLabel || 'Tap to equip')) + '>'
        + '<span class="kit-equipcell__dash" aria-hidden="true"></span>'
        + '<img class="kit-equipcell__plus" src="' + PLUS + '" alt="" draggable="false">'
        + '<b class="kit-equipcell__slotname">' + esc(slot) + '</b>'
        + '<span class="kit-equipcell__hint">' + esc(o.emptyLabel || 'Tap to equip') + '</span></' + tag + '>';
    }
    if (state === 'missing') {
      return '<div class="' + cls('kit-equipcell', 'is-missing', o.className) + '" aria-label="' + esc(o.ariaLabel || 'Unfound ' + r + ' ' + slot) + '">'
        + '<span class="kit-equipcell__slot">' + esc(slot) + '</span>'
        + (o.artHTML || K.art(o.artSrc, { size: [77, 85], sil: true, emoji: o.emoji, fill: 0.72 }))
        + '<b class="kit-equipcell__name">???</b><span class="kit-rarity-dot kit-rarity-dot--' + r + '"></span></div>';
    }
    var repair = state === 'repair';
    var art = o.artHTML || K.art(o.artSrc, { size: repair ? [65, 57] : [77, 85], emoji: o.emoji, fill: repair ? 0.85 : 0.72 });
    return open + ' class="' + cls('kit-equipcell', 'kit-tone--' + r, repair ? 'is-repair' : '', o.className) + '"' + tap(o, o.ariaLabel || o.name) + '>'
      + '<span class="kit-equipcell__slot">' + esc(slot) + '</span>' + art
      + '<b class="kit-equipcell__name">' + esc(o.name || '') + '</b>'
      + boost(o.boost)
      + (o.power != null ? K.powerPill({ value: o.power, size: 'sm', worse: String(o.power).charAt(0) === '−' || String(o.power).charAt(0) === '-' }) : '')
      + (o.durability ? durabilityBar({ pct: o.durability.pct, label: o.durability.label, tone: 'ink' }) : '')
      + (o.note ? '<span class="kit-equipcell__note">' + esc(o.note) + '</span>' : '')
      + (repair ? '<span class="kit-equipcell__repair"' + (o.onRepair ? ' role="button" tabindex="0" onclick="event.stopPropagation();' + o.onRepair + '"' : '') + '>'
          + hammer('kit-equipcell__repair-icon') + esc(o.repairLabel || 'REPAIR') + '</span>' : '')
      + '</' + tag + '>';
  }

                                                                            
                                                                             
                                                                      
                                                                       
                                                                  
                                                                            
  function gearRow(o) {
    o = o || {};
    var state = o.state || 'better', r = tier(o.rarity);
    var tag = o.onclick ? 'button' : 'div';
    var deltas = state === 'equipped' ? '' : '<span class="kit-gearrow__deltas">' + (o.deltas || []).map(function (d) {
      return K.boostPill({ size: 'sm', tone: 'flat', worse: d.worse, text: d.text, iconHTML: d.iconHTML, kind: d.kind });
    }).join('') + '</span>';
    var right = state === 'equipped'
      ? '<span class="kit-gearrow__tag">' + esc(o.equippedLabel || 'EQUIPPED') + '</span>'
      : (o.power ? K.powerPill({ value: o.power.text, size: 'md', worse: o.power.worse }) : '');
    return '<' + tag + (tag === 'button' ? ' type="button"' : '') + ' class="' + cls('kit-gearrow', 'kit-gearrow--' + state, o.className) + '"'
      + tap(o, o.ariaLabel || o.name) + (state === 'locked' ? ' aria-disabled="true"' : '') + '>'
      + '<span class="kit-gearrow__item kit-rarity-fill--' + r + '">' + (o.artHTML || K.art(o.artSrc, { size: 37, emoji: o.emoji, fill: 0.9 })) + '</span>'
      + '<span class="kit-gearrow__info"><b>' + esc(o.name || '') + '</b><i class="kit-rarity-text--' + r + '">' + esc(o.rarityLabel || r.toUpperCase()) + '</i>'
        + deltas + (o.wornBy ? '<em>' + esc(o.wornBy) + '</em>' : '') + '</span>'
      + '<span class="kit-gearrow__right">' + right + (o.durability ? durabilityBar({ pct: o.durability.pct, label: o.durability.label }) : '') + '</span>'
      + '</' + tag + '>';
  }

                                                                            
                                                                         
                                                                                  
  function wearRow(o) {
    o = o || {};
    var pct = Math.max(0, Math.min(1, +o.pct || 0));
    return '<div class="' + cls('kit-wearrow', 'kit-wearrow--' + band(pct), o.className) + '">'
      + (o.artHTML || K.art(o.artSrc, { size: 38, emoji: o.emoji, fill: 0.9 }))
      + '<b class="kit-wearrow__name">' + esc(o.name || '') + '</b>'
      + '<span class="kit-wearrow__track"><i style="width:' + Math.round(pct * 100) + '%"></i></span>'
      + '<span class="kit-wearrow__pct">' + esc(o.label != null ? o.label : Math.round(pct * 100) + '%') + '</span>'
      + '<button type="button" class="kit-wearrow__mend"' + (o.onMend ? ' onclick="' + o.onMend + '"' : ' disabled') + ' aria-label="Mend ' + esc(o.name || '') + '">'
        + hammer('kit-wearrow__icon') + 'MEND</button></div>';
  }

                                                                            
                                                                   
                                                     
                                                                               
                                       
  function traitCard(o) {
    o = o || {};
    var style = o.style || 'default', tag = o.onclick ? 'button' : 'div';
    var art = o.artHTML || K.art(o.artSrc, { size: 42, aura: o.aura, fill: 0.9 });
    var body = style === 'empty'
      ? '<span class="kit-traitcard__text"><b>' + esc(o.emptyLabel || 'Slot') + '</b><i>' + esc(o.emptyNote || 'empty') + '</i></span>'
      : '<span class="kit-traitcard__text"><b>' + esc(o.name || '') + '</b>' + boost(o.boost) + '</span>';
    return '<' + tag + (tag === 'button' ? ' type="button"' : '') + ' class="' + cls('kit-traitcard', 'kit-traitcard--' + style, o.className) + '"'
      + tap(o, o.ariaLabel || o.name || o.emptyLabel) + '>' + art + body + '</' + tag + '>';
  }

                                                                          
                                                                      
                                                                          
                                                      
  function familySlot(o) {
    o = o || {};
    return '<span class="' + cls('kit-familyslot', o.found ? 'is-found' : '', o.className) + '"' + (o.ariaLabel ? ' aria-label="' + esc(o.ariaLabel) + '"' : '') + '>'
      + (o.artHTML || K.art(o.artSrc, { size: 44, aura: o.aura, fill: 0.9 }))
      + (o.found ? '<img class="kit-familyslot__check" src="' + CHECK + '" alt="" draggable="false">' : '') + (o.extraHTML || '') + '</span>';
  }
  function familyTracker(o) {
    o = o || {};
    return '<div class="' + cls('kit-familytracker', o.className) + '">'
      + '<div class="kit-familytracker__head">' + (o.iconHTML || '') + '<b>' + esc(o.family || '') + '</b><span>' + (o.countHTML || esc(o.count || '')) + '</span></div>'
      + '<div class="kit-familytracker__slots">' + (o.slots || []).map(familySlot).join('') + '</div></div>';
  }

                                                                             
                                                                                 
  function rewardStat(o) {
    o = o || {};
    var kind = o.stat || 'atk';
    return '<span class="' + cls('kit-rewardstat', o.className) + '">'
      + (o.iconHTML || K.statIconHTML(kind, 'kit-rewardstat__icon'))
      + '<span class="kit-rewardstat__value"><b>' + esc(o.value) + '</b>'
      + (o.boosted ? '<img class="kit-rewardstat__arrow" src="' + ARROW + '" alt="boosted" draggable="false">' : '') + '</span></span>';
  }

  K.RARITY_TIERS = TIERS;
  K.durabilityBand = band;
  K.durabilityBar = durabilityBar;
  K.traitTile = traitTile;
  K.equipCell = equipCell;
  K.gearRow = gearRow;
  K.wearRow = wearRow;
  K.traitCard = traitCard;
  K.familySlot = familySlot;
  K.familyTracker = familyTracker;
  K.rewardStat = rewardStat;
  K.hammerIcon = hammer;
})(typeof window !== 'undefined' ? window : globalThis);
