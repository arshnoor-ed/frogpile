                                                                               
                                                                                
                                                                               
                                          

                                                                        
                                                                      
                                                                        
                                                                       
                                                                             
                                                                     
                                                         
                                                                                  
(function (g) {
  'use strict';
  var K = g.KitUI;
  if (!K) throw new Error('[kit/missions] js/ui-kit.js must load first');
  var esc = K.esc, cls = K.cls;

  var DIR = 'assets/ui2/kit/missions/';
  var ART = {
    shine: 'assets/ui2/grimoire/btn_shine.svg',                                                      
    megaphone: 'assets/ui2/icon/task_megaphone.png',
    platePanel: DIR + 'mission-plate-panel.png',
    plateHalftone: DIR + 'mission-plate-halftone.svg',
    plateEdge: DIR + 'mission-plate-edge.svg',
    timerShine: DIR + 'timer-sign-shine.svg',
    timerClock: DIR + 'timer-sign-clock.svg',
    upgrade: 'assets/ui2/kit/icons/nav-upgrades.png',                                      
    chevron: 'assets/ui2/kit/frog/hero-chevron.svg'                                                          
  };
  var CURRENCY = {
    gems: 'assets/ui2/currency/bluediamond.png', wood: 'assets/ui2/currency/wood.png',
    stone: 'assets/ui2/currency/rock.png', rock: 'assets/ui2/currency/rock.png',
    seeds: 'assets/ui2/currency/seed.png', bones: 'assets/ui2/currency/bone.png',
    flies: 'assets/ui2/currency/fly.png', tadpoles: 'assets/ui2/currency/tadpoles.png'
  };

  function img(src, c, extra) {
    return '<img class="' + c + '" src="' + esc(src) + '" alt="" draggable="false"' + (extra || '') + '>';
  }
                                                                             
                                   
  function currencyIcon(name, size) {
    name = name === 'rock' ? 'stone' : name;
    if (K.icon && K.ICONS && K.ICONS['currency/' + name]) return K.icon('currency/' + name, { size: size });
    var src = CURRENCY[name];
    return src ? '<img class="kit-icon" src="' + src + '" alt="" draggable="false" style="width:' + size + 'px;height:' + size + 'px">' : '';
  }
  function shine(c, src) {
    return '<img class="' + c + '" src="' + (src || ART.shine) + '" alt="" aria-hidden="true" draggable="false">';
  }
  function countText(o) {
    if (o.progressText != null) return String(o.progressText);
    if (o.target == null) return '';
    var need = Math.max(1, o.target), have = Math.max(0, Math.min(o.progress || 0, need));
    return K.progressCount(have, need);
  }

                                                                             
                                                 
                                                                                  
                                                                                    
                                                                            
                
                                                                         
                                                                   
                                                   
  var ROW_LABEL = { go: 'GO', claim: 'CLAIM' };
  function missionRow(o) {
    o = o || {};
    var state = ROW_LABEL[o.state] ? o.state : 'go';
    var label = o.actionLabel || ROW_LABEL[state];
    var act = K.button({
      tone: state === 'claim' ? 'gold' : 'violet', shape: 'pill', size: 'tag',
      className: 'kit-mrow__act kit-mrow__act--' + state,
      html: (state === 'claim' ? shine('kit-mrow__shine') : '') + esc(label),
      onclick: o.onclick,
      ariaLabel: o.ariaLabel || (label + ' — ' + (o.title || 'mission'))
    });
    return '<div class="' + cls('kit-mrow', 'kit-mrow--' + state, o.className) + '">'
      + '<div class="kit-mrow__main">'
      + '<span class="kit-mrow__title">' + esc(o.title) + '</span>'
      + (o.reward != null ? '<span class="kit-mrow__reward">' + (o.rewardIconHTML || currencyIcon('gems', 20)) + '<b>' + esc(o.reward) + '</b></span>' : '')
      + act + '</div>'
      + '<div class="kit-mrow__progress">' + esc(countText(o)) + '</div></div>';
  }

                                                                             
                                                                         
                                                                            
                                                                             
                                                
                                                                     
                                                                             
                                                                 
  var basePlate = K.missionPlate;
  function missionPlate(o) {
    o = o || {};
    if (o.variant !== 'art') return basePlate(o);
    var need = Math.max(1, o.target || 1), have = Math.max(0, Math.min(o.progress || 0, need));
    var pct = Math.round(have / need * 100);
    var count = o.countText != null ? String(o.countText) : K.progressCount(have, need);
    var tag = o.onclick ? 'button' : 'div';
    var open = o.onclick
      ? '<button type="button" onclick="' + o.onclick + '" aria-label="' + esc(o.ariaLabel || (o.title + ', ' + count)) + '"'
      : '<div role="group" aria-label="' + esc(o.ariaLabel || (o.title + ', ' + count)) + '"';
    return open + ' class="' + cls('kit-plate', 'kit-plate--art', o.className) + '">'
      + '<span class="kit-plate__band" aria-hidden="true"></span>'
      + img(ART.plateHalftone, 'kit-plate__halftone', ' aria-hidden="true"')
      + img(ART.platePanel, 'kit-plate__panel', ' aria-hidden="true"')
      + img(ART.plateEdge, 'kit-plate__edge', ' aria-hidden="true"')
      + '<span class="kit-plate__mega" aria-hidden="true">' + (o.artHTML || img(ART.megaphone, '')) + '</span>'
      + '<span class="kit-plate__body">'
      + '<span class="kit-plate__task">' + esc(o.title) + '</span>'
      + '<span class="kit-plate__meterrow">'
      + '<span class="kit-plate__meter"><i class="kit-plate__meterfill" style="width:' + pct + '%"></i></span>'
      + '<span class="kit-plate__tally">' + esc(count) + '</span>'
      + (o.reward != null ? '<span class="kit-plate__prize">' + (o.rewardIconHTML || currencyIcon('gems', 24)) + '<b>' + esc(o.reward) + '</b></span>' : '')
      + '</span></span></' + tag + '>';
  }

                                                                             
                                                   
                                                          
                                                                                  
                                                                
                                                       
                                                                                      
                                                                            
                                       
                                                                       
                                                                        
                                                                         
                                            
  var UP_STATES = { upgrade: 'Upgrade', short: 'Upgrade', 'new': 'Build', blocked: 'No space' };
  var UP_ALIAS = { 'cant-afford': 'short', 'cant afford': 'short', 'new-build': 'new', 'new build': 'new', 'no-space': 'blocked' };
  function upgradeRow(o) {
    o = o || {};
    var state = UP_ALIAS[o.state] || (UP_STATES[o.state] ? o.state : 'upgrade');
    var gold = state === 'upgrade' || state === 'new';
    var label = o.actionLabel || UP_STATES[state];
    var desc;
                                                                                 
    if (state === 'upgrade' && o.level) desc = '<span class="kit-uprow__lv">' + esc(o.level) + ' </span>' + (o.desc ? '   ' + esc(o.desc) : '');
    else desc = esc([o.level, o.desc].filter(function (s) { return s != null && s !== ''; }).join(' · '));
    var costs = (o.costs || []).filter(function (c) { return c && c.need > 0; }).map(function (c) {
      return K.costChip(c.iconHTML || currencyIcon(c.currency || 'wood', 15), c.need, c.have == null ? c.need : c.have);
    }).join('');
    var act = K.button({
      tone: gold ? 'gold' : 'violet', shape: 'pill', size: 'sm', className: 'kit-uprow__act',
      html: (gold ? shine('kit-uprow__shine') : '') + esc(label),
      onclick: o.onclick, disabled: o.disabled != null ? !!o.disabled : !gold,
      ariaLabel: label + ' ' + (o.name || '')
    });
    var art = o.artHTML || img(o.imgSrc || (K.ICONS && K.ICONS['nav/upgrades']) || ART.upgrade, '');
    return '<div class="' + cls('kit-uprow', 'kit-uprow--' + state, o.className) + '"' + (o.id ? ' data-upgrade="' + esc(o.id) + '"' : '') + '>'
      + '<span class="kit-uprow__art">' + art + '</span>'
      + '<span class="kit-uprow__info">'
      + '<span class="kit-uprow__titlerow"><b class="kit-uprow__name">' + esc(o.name) + '</b>'
      + (state === 'new' ? '<span class="kit-uprow__tag">' + esc(o.tag || 'NEW') + '</span>' : '') + '</span>'
      + (desc ? '<span class="kit-uprow__desc">' + desc + '</span>' : '')
      + (costs ? '<span class="kit-uprow__costs">' + costs + '</span>' : '')
      + '</span>' + act + '</div>';
  }

                                                                             
                                                                           
                                                     
  function timerSign(time, o) {
    o = o || {};
    return '<span class="' + cls('kit-timer', o.className) + '"' + (o.ariaLabel ? ' aria-label="' + esc(o.ariaLabel) + '"' : '') + '>'
      + shine('kit-timer__shine', ART.timerShine)
      + '<span class="kit-timer__clock" aria-hidden="true">' + img(ART.timerClock, '') + '</span>'
      + '<span class="kit-timer__time">' + esc(time) + '</span></span>';
  }

                                                                             
                                                        
                                                                                         
  function yieldBox(o) {
    o = o || {};
    return '<span class="' + cls('kit-yield', o.className) + '">'
      + (o.iconHTML || currencyIcon(o.currency || 'wood', 22))
      + '<b class="kit-yield__amount">' + esc(o.amount) + '</b>'
      + '<span class="kit-yield__unit">' + esc(o.unit == null ? '/ min' : o.unit) + '</span></span>';
  }

                                                                             
                                                                           
                                                                                  
  function chevron(o) {
    o = o || {};
    if (o.onclick) {
      return '<button type="button" class="' + cls('kit-chevron', o.className) + '" onclick="' + o.onclick + '" aria-label="' + esc(o.ariaLabel || 'Open') + '">'
        + img(ART.chevron, '') + '</button>';
    }
    return img(ART.chevron, cls('kit-chevron', o.className), ' aria-hidden="true"');
  }

  K.MISSIONS_ART = ART;
  K.missionRow = missionRow;
  K.missionPlate = missionPlate;
  K.upgradeRow = upgradeRow;
  K.timerSign = timerSign;
  K.yieldBox = yieldBox;
  K.chevron = chevron;
})(typeof window !== 'undefined' ? window : globalThis);
