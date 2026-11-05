                                                                             
                                                                         
                                                                           
                                              

                                                                          
                                                                            
                                      
                                                                           
                                                                               
                                                                         
                                                                             
                                                                         
                                                                            
                                                                             
                                                                             
                                                                            
                                                                             
                                                                      
                                                               
                                                                           
                                                                            
                                                                            
                                                                             
                                                                       
                                                                         
                                                                   
                                                                            
                                                            

                                                                            
                                                            
(function (g) {
  'use strict';

  var TIERS = ['normal', 'hard', 'extreme'];
  var LABEL = { normal: 'Normal', hard: 'Hard', extreme: 'Extreme' };

                                                                          
  function index(tier) { var i = TIERS.indexOf(tier); return i < 0 ? 0 : i; }
  function normalize(tier) { return TIERS[index(tier)]; }
  function label(tier) { return LABEL[normalize(tier)]; }

                                                                             
                                                                                    
  function mults(FP, tier) {
    tier = normalize(tier);
    if (tier === 'normal') return { enemyCount: 1, enemyHp: 1, attackRate: 1, reward: 1 };
    var p = 'expedition_' + tier + '_';
    return {
      enemyCount: Number(FP.value('MergeRules', p + 'enemy_count_mult')),
      enemyHp: Number(FP.value('MergeRules', p + 'enemy_hp_mult')),
      attackRate: Number(FP.value('MergeRules', p + 'enemy_attack_rate_mult')),
      reward: Number(FP.value('MergeRules', p + 'reward_mult'))
    };
  }

                                                                                 
                                                                              
                                                                                 
  var _bonusWarned = false;
  function bonusTable(FP, tier) {
    tier = normalize(tier);
    if (tier === 'normal') return null;
    var v;
    try { v = FP.value('MergeRules', 'expedition_' + tier + '_win_bonus'); }
    catch (e) {
      if (!_bonusWarned && typeof console !== 'undefined') console.warn('[ExpeditionDifficulty] MergeRules expedition_' + tier + '_win_bonus is missing from the config export — no Hard / Extreme bonus blueprint until a fresh export adds it.');
      _bonusWarned = true;
      return null;
    }
    v = String(v == null ? '' : v).trim();
    return v || null;
  }

                                                                             
                                                                            
                                                                   
  function scaleCount(count, mult) {
    var n = Number(count) || 0;
    if (mult === 1 || n <= 0) return n;
    return Math.max(1, Math.floor(n * mult + 1e-9));
  }
                                                                                               
                                                                                         
                                                                                         
  function isGiant(id) { return /giant/.test(String(id || '')); }
                                                                
  function scaleWaves(waves, mult) {
    if (mult === 1) return waves;
    return (waves || []).map(function (w) {
      var out = {};
      for (var k in w) out[k] = w[k];
      out.enemies = (w.enemies || []).map(function (e) { return { id: e.id, count: scaleCount(e.count, mult) }; });
      if (w.bosses) out.bosses = w.bosses.map(function (b) { return { id: b.id, count: isGiant(b.id) ? b.count : scaleCount(b.count, mult) }; });
      return out;
    });
  }
                                                                      
  function scaleSlots(slots, rewardMult) {
    var m = Math.max(1, Math.round(Number(rewardMult) || 1));
    if (m === 1) return slots;
    return slots.map(function (s) { return { dropTableId: s.dropTableId, count: s.count * m }; });
  }

                                                                     
  function ftueRunning(s) { return !!s && !s.ftueDone && (s.ftueLoop != null ? s.ftueLoop < 6 : !s.pondExpanded); }
  function available(s) { return !!s && !ftueRunning(s); }

                                                                    
                                 
  function highestCleared(s, no) {
    var best = ((s && s.expeditionsCleared) || []).indexOf('node-' + no) >= 0 ? 0 : -1;
    var t = s && s.expeditionTiersCleared && s.expeditionTiersCleared[no];
    if (t != null) best = Math.max(best, index(t));
    return best;
  }
                                                                             
                                             
  function unlocked(s, no, tier) {
    var i = index(tier);
    return i === 0 || i <= highestCleared(s, no) + 1;
  }
                                                                            
                                                
  function pickOf(s, no) {
    if (!available(s)) return 'normal';
    var t = normalize(s.expeditionTierPick && s.expeditionTierPick[no]);
    return unlocked(s, no, t) ? t : 'normal';
  }
  function setPick(s, no, tier) {
    tier = normalize(tier);
    if (!unlocked(s, no, tier)) return false;
    (s.expeditionTierPick || (s.expeditionTierPick = {}))[no] = tier;
    return true;
  }
                                                                               
                                                                             
  function recordWin(s, no, tier) {
    var i = index(tier), before = highestCleared(s, no);
    if (i > 0) {
      var map = s.expeditionTiersCleared || (s.expeditionTiersCleared = {});
      if (map[no] == null || index(map[no]) < i) map[no] = TIERS[i];
    }
    var after = Math.max(before, i);
    return (after > before && after + 1 < TIERS.length) ? TIERS[after + 1] : null;
  }

  var core = {
    TIERS: TIERS, index: index, normalize: normalize, label: label, mults: mults, bonusTable: bonusTable,
    scaleCount: scaleCount, scaleWaves: scaleWaves, scaleSlots: scaleSlots, isGiant: isGiant,
    ftueRunning: ftueRunning, available: available, highestCleared: highestCleared,
    unlocked: unlocked, pickOf: pickOf, setPick: setPick, recordWin: recordWin
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = core;
  g.ExpeditionDifficulty = core;
  if (!g.document) return;

                                                                          
  function S() { return typeof state !== 'undefined' ? state : null; }
  function FP() { return g.FPConfig; }
  core.pick = function (no) { return pickOf(S(), no); };
  core.multsFor = function (tier) { return mults(FP(), tier); };

                                                                             
                                                                             
                                                                           
                                                                               
  core.summary = function (tier) {
    tier = normalize(tier);
    if (tier === 'normal') return 'The stage as it was built';
    return tier === 'hard' ? 'A tougher, hand-built roster · doubled wood & stone'
      : 'The toughest roster · doubled wood & stone, extra blueprints';
  };

                                                                           
                                                                             
                                                                           
                                                                          
                                                                         
                                                                       
                                                                    
  var TONE = { normal: 'green', hard: 'gold', extreme: 'danger' };
  core.lockedHint = null;                                                                             
  function unlockRule(tier) { return tier === 'hard' ? 'Win Normal to unlock Hard' : 'Win Hard to unlock Extreme'; }
  core.tabsHTML = function (no) {
    var s = S();
    if (!available(s) || highestCleared(s, no) < 0 || !g.KitUI) return '';
    var cur = pickOf(s, no), best = highestCleared(s, no);
    var tabs = TIERS.map(function (t) {
      var open = unlocked(s, no, t), on = t === cur;
      return KitUI.button({
        tone: on ? TONE[t] : (open ? 'violet' : 'neutral'), shape: 'pill', size: 'tag',
        html: (open ? '' : '<span class="xd-tier__lock" aria-hidden="true">\u{1F512}</span>')
          + '<span class="xd-tier__name">' + LABEL[t].toUpperCase() + '</span>'
          + (t !== 'normal' && best >= index(t) ? '<span class="xd-tier__won" aria-hidden="true">✓</span>' : ''),
        onclick: "expeditionPickTier(" + no + ",'" + t + "')",
        ariaLabel: LABEL[t] + (on ? ', selected' : '') + (open ? '' : ', locked — ' + unlockRule(t)),
        className: 'xd-tier xd-tier--' + t + (on ? ' is-on' : '') + (open ? '' : ' is-locked')
      });
    }).join('');
    var h = core.lockedHint, hint = h && h.no === no && !unlocked(s, no, h.tier) ? h.tier : null;
    var rule = hint ? '<p class="xd-tier-rule xd-tier-rule--locked" role="status">\u{1F512} ' + unlockRule(hint) + '</p>'
      : (cur === 'normal' ? '' : '<p class="xd-tier-rule xd-tier-rule--' + cur + '">' + core.summary(cur) + '</p>');
    return '<div class="xd-tiers" role="group" aria-label="Difficulty" data-tier="' + cur + '">' + tabs + '</div>' + rule
      + (hint ? '' : core.bonusHTML(cur)) + prizeHTML(s, no);
  };
                                                                             
                                                                             
                                                                       
                                                                            
                                                                       
                                                                            
                                                                           
                                                                           
                                                       
  core.bonusOf = function () { return null; };
  core.bonusHTML = function () { return ''; };
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return '&#' + c.charCodeAt(0) + ';'; }); }
                                                                        
                                                                            
  function prizeHTML(s, no) {
    var p = null;
    try { p = g.Rewards && Rewards.extremePrizeFamily ? Rewards.extremePrizeFamily(no, s) : null; } catch (e) { p = null; }
    if (!p) return '';
    var name = String(p.name).replace(/[&<>"']/g, function (c) { return '&#' + c.charCodeAt(0) + ';'; });
    return '<p class="xd-tier-prize">\u{1F3C6} Win on Extreme: the whole ' + name + ' set!</p>';
  }
                                                               
  core.unlockBannerHTML = function (tier) {
    tier = normalize(tier);
    if (tier === 'normal') return '';
    return '<div class="xr-tier-unlock xr-tier-unlock--' + tier + '" role="status">'
      + '<span class="xr-tier-unlock__title">' + (tier === 'extreme' ? '\u{1F480}' : '\u{1F525}') + ' ' + LABEL[tier].toUpperCase() + ' UNLOCKED</span>'
      + '<span class="xr-tier-unlock__sub">' + esc(core.summary(tier)) + '</span></div>';
  };
                                                                    
  core.tagHTML = function (tier) {
    tier = normalize(tier);
    return '<span class="xd-tag xd-tag--' + tier + '">' + LABEL[tier].toUpperCase() + '</span>';
  };
                                                                           
                                                                           
                                                                   
  var STAR = '<svg viewBox="0 0 24 24" aria-hidden="true">'
    + '<path d="M12 1.9L15.47 8.13 22.46 9.5 17.61 14.72 18.47 21.8 12 18.8 5.53 21.8 6.39 14.72 1.54 9.5 8.53 8.13z"/>'
    + '<path class="xm-star-glint" d="M7.6 10.4l2.2-.45M11.1 5.6l.75-1.5"/></svg>';
  core.coinPipsHTML = function (no) {
    var s = S();
    if (!available(s)) return '';
    var best = highestCleared(s, no);
    if (best < 1) return '';
    return '<span class="xm-coin-tiers" aria-label="' + LABEL[TIERS[best]] + ' won">'
      + TIERS.slice(1).map(function (t, i) { return '<i class="xm-coin-tier xm-coin-tier--' + t + (best >= i + 1 ? ' is-won' : '') + '">' + STAR + '</i>'; }).join('')
      + '</span>';
  };
})(typeof window !== 'undefined' ? window : globalThis);
