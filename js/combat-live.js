                                                                                
                                             
                                                                                

                                                                   
                                                        
                                                                              
                                                                              
                                                                              
                                                                               
                  

                                                       
                                                                
                                                                              
                                                                                    
                                                                                 
                                                                                         
                                                                                 
                                                                    
                                                                              
                                                                                       
                                                                                    
                                                                             
                                                                        
                                                                        
                             

                                                               
                                                  
                                                                                 
                                                              
                                                                                     
                                                                                     
                                                                               

                                                                             
                                                                              
                                                                       
                                                                      
                                                                       
                                                                           
                                                 

                                                                             
                                                                            
                                                          
                                                                  
                                                                                   
(function (root, factory) {
  var mod = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = mod;
  if (root) root.CombatLive = mod;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : null), function () {
  'use strict';
                                                                                             
  function text(key, fallback, tokens){
    if(typeof FPConfig !== 'undefined' && FPConfig.text) return FPConfig.text(key, fallback, tokens);
    return String(fallback).replace(/\{(\w+)\}/g, function(all, name){ return tokens && Object.prototype.hasOwnProperty.call(tokens,name) ? String(tokens[name]) : all; });
  }


                                                                                
                                                                               
                                             
                                                                                
  var PARAMS = {
                                                                                           
    fixedStepS: 0.05,
    maxTicksPerStepCall: 20000,                                                                    

  };

                                                                               
                                                                              
  var PRESENTATION_PARAMS = {
    beforeClearS: 0.5,
    clearBannerS: 2,
    afterClearS: 0.5,
    attackDurationMs: 440, impactDurationMs: 260, dodgeDurationMs: 560, doubleStrikeLagMs: 170,
                                                                                                     
    strikeGapMs: 80,
                                                                          
                                                                     
    harvestHoldS: 1.6,
                                                                             
    rockSmashHoldS: 1.2,
    formationGapPx: 12,
    frogBoxPx: 140,
    enemyFrameAspect: 1.1, bossFrameAspect: 0.84
  };

                                                                              
                                                                              

  function shouldShowTapPopup(fight, teachTap, alreadyShown) {
    if (!teachTap || alreadyShown || fight.isDone() ||
        fight.currentWaveIndex() !== fight.waveCount - 1 ||
        fight.waveClearPhase() !== null) return false;
    return fight.frogs().length > 0 && fight.partyHpFrac() <= getFPConfig().value('FTUE','exp1_tap_popup_party_hp_fraction');
  }

                                                                       
                                                                
                                                         
                                                                               
                                                                                  
  function packFormation(count, width, height, size, aspect, gap) {
    if (!count || width <= 0 || height <= 0) return { units: [], height: 0 };
    var best = null;
    for (var cols = 1; cols <= count; cols++) {
      var rows = Math.ceil(count / cols);
      var scale = Math.min(1, (width - (cols - 1) * gap) / (cols * size),
        (height - (rows - 1) * gap) / (rows * size * aspect));
      if (scale > 0 && (!best || scale > best.scale)) best = { cols: cols, rows: rows, scale: scale };
    }
    if (!best) return { units: [], height: 0 };
    var w = size * best.scale, h = w * aspect;
    var usedHeight = best.rows * h + (best.rows - 1) * gap;
    var units = [];
    for (var i = 0; i < count; i++) {
      var row = Math.floor(i / best.cols), col = i % best.cols;
      var rowCount = Math.min(best.cols, count - row * best.cols);
      units.push({ left: (width - rowCount * w - (rowCount - 1) * gap) / 2 + col * (w + gap),
        top: (height - usedHeight) / 2 + row * (h + gap), width: w, height: h, scale: best.scale });
    }
    return { units: units, height: usedHeight };
  }

                                                                                
                                                                              
                                                                           
                                                                              
                                                                              
                                                                           
                                                                         
                                                                              
                                                                                
  function getFPConfig() {
    var FP = (typeof window !== 'undefined' && window.FPConfig) ? window.FPConfig
      : (typeof globalThis !== 'undefined' ? globalThis.FPConfig : null);
    if (!FP) throw new Error('[CombatLive] window.FPConfig is missing — load the config layer before calling into js/combat-live.js\'s gameplay functions.');
    return FP;
  }

  var _warnedMissingKnobs = {};
                                                                             
                                                                              
                                                                     
                                                                             
                                                                         
                                                                         
                                                                          
  function tryValue(FP, tab, name, fallback) {
    try { return FP.value(tab, name); }
    catch (e) {
      var key = tab + '.' + name;
      if (!_warnedMissingKnobs[key]) {
        _warnedMissingKnobs[key] = true;
        if (typeof console !== 'undefined') console.warn('[CombatLive] "' + key + '" is missing from the current config export — using the fallback ' + fallback + ' until a fresh export adds it.', e);
      }
      return fallback;
    }
  }

  var _sheetParamsCache = null;
                                                                          
                                                                       
                                                            
  function getSheetParams() {
    if (_sheetParamsCache) return _sheetParamsCache;
    var FP = getFPConfig();
    var tapRow = FP.row('TapAttack', 'level', 1);
    _sheetParamsCache = {
      mitigationK: FP.value('MergeRules', 'combat_mitigation_k'),
      tap: {
        level: 1,
        damagePctOfPondAttack: tapRow.damage_pct_of_pond_attack,
        coveragePctOfPond: tapRow.coverage_pct_of_pond,                                          
        tapIncreasePct: tapRow.tap_increase_pct,                                                 
        rateMinPerS: tapRow.tap_rate_min_per_s,
        rateMaxPerS: tapRow.tap_rate_max_per_s,
        bypassesMitigation: !!FP.value('TapAttack', 'tap_bypasses_boss_mitigation'),
        surge: {
          pPerAttempt: FP.value('TapAttack', 'tap_surge_p_per_attempt'),
          magnitudeMult: FP.value('TapAttack', 'tap_surge_magnitude_mult'),
          durationAttempts: FP.value('TapAttack', 'tap_surge_duration_attempts'),
          holdMax: FP.value('TapAttack', 'tap_surge_hold_max')
        }
      }
    };
    return _sheetParamsCache;
  }
                                                                               
                                                                              
                                                                    
                                                                          
                                                                               
                                                                             
                                                                             
                                                                            

                                                                             
                                                                            
                                                                               
                                                                               
                                                                              
                                                                            
                                                                            
                                                                                
  function enemyAttackMult(expeditionNo) {
    if (expeditionNo == null) return 1;
    var row = getFPConfig().rows('Expeditions').filter(function (r) { return r.expedition_no === Number(expeditionNo); })[0];
    var mult = row ? Number(row.enemy_attack_mult) : NaN;
    if (row && !('enemy_attack_mult' in row) && !_warnedMissingKnobs['Expeditions.enemy_attack_mult']) {
      _warnedMissingKnobs['Expeditions.enemy_attack_mult'] = true;
      if (typeof console !== 'undefined') console.warn('[CombatLive] "Expeditions.enemy_attack_mult" is missing from the current config export — enemies hit as authored until a fresh export adds it.');
    }
    return mult > 0 ? mult : 1;
  }

                                                                               
  function tapParamsFor(expeditionNo) {
    return getSheetParams().tap;
  }

                                                                            
                                                                             
                                                                           
                                                                         
                                                                             
                                                                          
                                                                            
                                                                              
                                                                              
                                                                            
  function difficulty() {
    var D = (typeof window !== 'undefined' && window.ExpeditionDifficulty) || (typeof globalThis !== 'undefined' && globalThis.ExpeditionDifficulty) || null;
    if (!D && typeof require === 'function') { try { D = require('./expedition-difficulty'); } catch (e) { D = null; } }
    return D;
  }
                                                                          
                                                                           
                                               
  var TIER_TAB = { hard: 'ExpeditionsHard', extreme: 'ExpeditionsExtreme' };
  var _fasterDbCache = {};
                                                                       
                                                                            
                                      
  function forExpedition(kind, db, expeditionNo) {
    var hits = enemyAttackMult(expeditionNo);
    if (hits === 1) return db;
    var key = kind + ':' + hits, hit = _fasterDbCache[key];
    if (hit && hit.base === db) return hit.db;
    var out = {};
    Object.keys(db).forEach(function (id) {
      out[id] = Object.assign({}, db[id], { attack: db[id].attack * hits });
    });
    _fasterDbCache[key] = { base: db, db: out };
    return out;
  }

                                                                            
                                                                            
  var _enemyDbCache = null;
                                                                          
                                                                                 
                                                                     
                                                                           
                                                                       
                                                                            
                                                                           
                                                                            
                                                                          
                                                                        
  function getEnemyDb(expeditionNo, tier) {
    if (_enemyDbCache) return forExpedition('enemy', _enemyDbCache, expeditionNo);
    var FP = getFPConfig();
    var out = {};
    FP.rows('Enemies').forEach(function (r) {
      var id = r['Enemy Id'];
      out[id] = {
        id: id, name: r['Enemy Name'], hp: r['Enemy HP'], attack: r['Enemy Attack'], defense: r['Enemy Defense'],
        cadence: r['Attack Cadence (s)'], hitsPerAttack: r['Frogs Hit Per Attack'],
        killRewardCurrency: r['Enemy Kill Reward 1'] || null,
        killRewardCount: r['Enemy Kill Reward 1 Count'] || 0,
        art: id
      };
    });
    _enemyDbCache = out;
    return forExpedition('enemy', out, expeditionNo);
  }

  var _bossDbCache = null;
                                                                       
                                                                 
  function getBossDb(expeditionNo, tier) {
    if (_bossDbCache) return forExpedition('boss', _bossDbCache, expeditionNo);
    var FP = getFPConfig();
    var out = {};
    FP.rows('Bosses').forEach(function (r) {
      var id = r['Boss ID'];
      out[id] = {
        id: id, name: r['Boss Name'], hp: r['Enemy HP'], attack: r['Enemy Attack'], defense: r['Enemy Defense'],
        cadence: r['Attack Cadence (s)'], hitsPerAttack: r['Frogs Hit Per Attack'],
        art: id
      };
    });
    _bossDbCache = out;
    return forExpedition('boss', out, expeditionNo);
  }

                                                                            
                                                      
  function enemyTypeIdCol(n) { return n === 3 ? 'Enemy Type 3ID' : 'Enemy Type ' + n + ' ID'; }
  function enemyTypeCountCol(n) { return 'Enemy Type ' + n + ' Count'; }

  var _wavesCache = {};
                                                                          
                                                                          
                                                                      
                                                                          
                                                                            
                                                                            
                                                                             
                                                                       
                                                                 
  function getFtueWaves(expeditionNo, tier) {
    tier = tier == null ? 'normal' : tier;
    if (tier === 'normal') {
      return flowersPaused() ? wavesWithoutFlowers(expeditionNo) : sheetWaves(expeditionNo, 'Expeditions');
    }
    var tab = TIER_TAB[tier];
    if (!tab) throw new Error('[CombatLive] unknown difficulty tier "' + tier + '"');
    return sheetWaves(expeditionNo, tab);
  }
                                                                                        
                                                                                        
                                                                 
  function flowersPaused() {
    var F = (typeof window !== 'undefined' && window.FtueSteps) || (typeof globalThis !== 'undefined' && globalThis.FtueSteps) || null;
    return !!(F && typeof F.flowersPaused === 'function' && F.flowersPaused());
  }
  function wavesWithoutFlowers(expeditionNo) {
    var key = expeditionNo + ':noflower';
    if (_wavesCache[key]) return _wavesCache[key];
    var all = sheetWaves(expeditionNo, 'Expeditions'), kept = all.filter(function (w) { return !(w.harvest && w.harvest.flower); });
    return (_wavesCache[key] = kept.length === all.length ? all
      : kept.map(function (w, i) { var c = Object.assign({}, w); c.no = i + 1; return c; }));
  }
                                                                           
                                                                      
  function fightFor(expeditionNo, tier) {
    return { waves: getFtueWaves(expeditionNo, tier), enemyDb: getEnemyDb(expeditionNo, tier), bossDb: getBossDb(expeditionNo, tier) };
  }
  function sheetWaves(expeditionNo, tab) {
    var cacheKey = tab + ':' + expeditionNo;
    if (_wavesCache[cacheKey]) return _wavesCache[cacheKey];
    var FP = getFPConfig();
    var rows = FP.rows(tab).filter(function (r) { return r.expedition_no === expeditionNo; });
    if (!rows.length) throw new Error('[CombatLive] no [EXPORT] ' + tab + ' rows for expedition_no=' + expeditionNo);
    rows = rows.slice().sort(function (a, b) { return a.wave_no - b.wave_no; });
    var waves = rows.map(function (r) {
      var enemies = [];
      for (var n = 1; n <= 6; n++) {
        var id = r[enemyTypeIdCol(n)], count = r[enemyTypeCountCol(n)];
        if (id && count) enemies.push({ id: id, count: count });
      }
      var bosses = [];
      if (r['Boss Type 1 ID'] && r['Boss Type 1 Count']) bosses.push({ id: r['Boss Type 1 ID'], count: r['Boss Type 1 Count'] });
      if (r['Boss Type 2 ID'] && r['Boss Type 2 Count']) bosses.push({ id: r['Boss Type 2 ID'], count: r['Boss Type 2 Count'] });
      var wave = { no: r.wave_no, enemies: enemies };
      if (bosses.length) wave.bosses = bosses;
      var h = harvestOf(r) || rescueOf(r), rk = rocksOf(r);
      if (h) { wave.harvest = h; wave.enemies = []; delete wave.bosses; }
      else if (rk) wave.rocks = rk;
      return wave;
    });
    _wavesCache[cacheKey] = waves;
    return waves;
  }

                                                                         
                                                                             
                                                                        
                                                                              
                                                                              
                                                                             
                                                                              
                                                                               
                                                                             
                              
  function harvestOf(r) {
    var flower = r && r.harvest_flower ? String(r.harvest_flower).trim() : '';
    if (!flower) return null;
    return { flower: flower, reward: String(r.harvest_reward || '').trim() || null, taps: Math.max(1, Math.round(Number(r.harvest_taps) || 1)) };
  }
  function harvestFrogTapS() {
    return tryValue(getFPConfig(), 'MergeRules', 'harvest_wave_frog_tap_interval_s', 0.6);
  }
                                                                                
                                                                                
                                                                              
                                                                             
                                                                                
                                                                            
                                                                          
                                                                          
                                                                              
                                                                             
                                                                     
                                                                                
                                                                             
                                                                                    
  function rescuePrizesOf(r) {
    var out = [];
    for (var n = 1; ; n++) {
      var col = n === 1 ? 'rescue_prize' : 'rescue_prize_' + n;
      if (!(col in r)) break;
      var table = String(r[col] || '').trim();
      if (!table) continue;
      var p = { table: table, winOnly: Number(r[col + '_win_only']) === 1 };
      var chance = r[col + '_chance'] === '' || r[col + '_chance'] == null ? 1 : Number(r[col + '_chance']);
      if (isFinite(chance) && chance < 1) p.chance = Math.max(0, chance);
      out.push(p);
    }
    return out;
  }
  function rescueOf(r) {
    var web = r && r.rescue_web ? String(r.rescue_web).trim() : '';
    if (!web) return null;
    var out = { web: web, reward: String(r.rescue_reward || '').trim() || null, taps: Math.max(1, Math.round(Number(r.rescue_taps) || 1)) };
    var prizes = rescuePrizesOf(r);
    if (prizes.length) out.prizes = prizes;
    return out;
  }
  function rescueFrogTapS() {
    return tryValue(getFPConfig(), 'MergeRules', 'rescue_wave_frog_tap_interval_s', 0.6);
  }

                                                                                                   
                                                                                                      
                                                                                                        
                                                                                                      
                                                                                                         
                                                                                                          
                                                                                                       
                                                                                                   
                                                                                                      
                                                                                 
                                                                                                        
                                   
  function rocksOf(r) {
    var n = Math.max(0, Math.round(Number(r && r.rock_count) || 0)), reward = r && r.rock_reward ? String(r.rock_reward).trim() : '';
    return n && reward ? { count: n, reward: reward } : null;
  }
  function rockHitsKnob() {
    return tryValue(getFPConfig(), 'MergeRules', 'combat_rock_hits', 2);
  }

                                                                                
                                                                                
                                                                                  
                                                                                  
                                                                          
                                                                             
                                                                                   
                                                                                   
                                                                               
                                                                               
                        
  var STAGE_BY_ZONE = {
    'Reed Marsh': [[1, 'reedmarsh-1'], [2, 'mirewood'], [3, 'autumngrove'], [4, 'lagoon'], [5, 'autumngrove-blight']],
    'Mire Wood': [[1, 'mirewood'], [3, 'mirewood-2'], [5, 'mirewood-3']],
    'Autumn Grove': [[1, 'autumngrove']],
    'Frost Hollow': [[1, 'frost-pending']],
    'Storm Peaks': [[1, 'storm-pending']]
  };
  function stageFor(expeditionNo) {
    var rows = getFPConfig().rows('Expeditions');
    var row = rows.filter(function (r) { return r.expedition_no === expeditionNo; })[0];
    var steps = row && STAGE_BY_ZONE[row.zone_name];
    if (!steps) return 'meadow';
    var upTo = {};
    rows.forEach(function (r) { if (r.zone_name === row.zone_name && r.expedition_no <= expeditionNo) upTo[r.expedition_no] = true; });
    var place = Object.keys(upTo).length, key = steps[0][1];
    steps.forEach(function (s) { if (place >= s[0]) key = s[1]; });
    return key;
  }

                                                                          
                                                                           
                                                                            
                                                                            
                                                                 
  function sheetFamilyId(family) {
    var FR = (typeof window !== 'undefined' && window.FamilyRewards) || (typeof globalThis !== 'undefined' && globalThis.FamilyRewards);
    return (FR && FR.aliases && FR.aliases[family]) || family;
  }
  function getFamilyAbility(family) {
    if (!family) return null;
    try {
      var key = sheetFamilyId(family);
      var row = FPConfig.rows('TraitFamilies').find(function (r) { return r.family === key; });
      if (!row || !row.S4_Bonus_Name || row['S4 Bonus Value'] == null || row['S4 Bonus Value'] === '') return null;
      var raw = String(row['S4 Bonus Value']).trim();
      var value = raw.endsWith('%') ? Number(raw.slice(0, -1)) / 100 : Number(raw);
      if (!Number.isFinite(value)) return null;
      return { name: String(row.S4_Bonus_Name).trim(), value: value };
    } catch (e) { return null; }
  }
  function getFamilyDodgeChance(family) {
    var ability = getFamilyAbility(family);
    return ability && ability.name === 'Dodge' && ability.value >= 0 && ability.value <= 1 ? ability.value : 0;
  }

                                                                           
                                                                          
                                                                            
                                                                            
                                                                          
                                         
  var ABILITY_ICON_DIR = 'assets/ui2/kit/frog/';
  var ABILITIES = {
    'Dodge':         { id: 'dodge',         icon: 'ability-quick-paws.png',    chance: true },
    'Stealth':       { id: 'stealth',       icon: 'ability-stealth.png',       chance: true },
    'Heal':          { id: 'heal',          icon: 'ability-heal.png',          chance: true, knob: 'family_ability_heal_interval_s' },
    'Freeze':        { id: 'freeze',        icon: 'ability-freeze.png',        chance: true, knob: 'family_ability_freeze_s' },
    'Double Strike': { id: 'double_strike', icon: 'ability-double-strike.png', chance: true },
    'Burn':          { id: 'burn',          icon: 'ability-burn.png',          chance: true, knob: 'family_ability_burn_s' },
    'Poison Cloud':  { id: 'poison_cloud',  icon: 'ability-poison-cloud.png',  chance: true, knob: 'family_ability_poison_interval_s' },
    'Critical Hit':  { id: 'crit',          icon: 'ability-crit-up.png',       chance: true, knob: 'family_ability_crit_multiplier' },
    'Shield Cycle':  { id: 'shield_cycle',  icon: 'ability-shield-cycle.png' },
    'Slow':          { id: 'slow',          icon: 'ability-slow.png',          chance: true, knob: 'family_ability_slow_s' }
  };
  function abilityKnob(name) {
    try { var v = Number(getFPConfig().value('MergeRules', name)); return Number.isFinite(v) && v > 0 ? v : null; }
    catch (e) { return null; }
  }
                                                                               
                                      
  function resolveAbility(ability) {
    var def = ability && ABILITIES[ability.name];
    if (!def) return null;
    var v = Number(ability.value);
    if (!Number.isFinite(v) || v <= 0 || (def.chance && v > 1)) return null;
    var knob = def.knob ? abilityKnob(def.knob) : null;
    if (def.knob && knob == null) return null;
    return { id: def.id, value: v, knob: knob };
  }
  function pctText(v) { return Number((v * 100).toFixed(2)) + '%'; }
                                                                 
  function abilityCopy(name, value) {
    var r = resolveAbility({ name: name, value: value });
    if (!r) return null;
    var p = pctText(r.value), k = r.knob;
    switch (r.id) {
      case 'dodge':         return { text: p + ' chance to jump and evade an enemy hit', short: p + ' dodge' };
      case 'stealth':       return { text: 'Foes overlook it ' + p + ' of the time and strike another frog', short: p + ' stealth' };
      case 'heal':          return { text: 'Every ' + k + 's, heals the most hurt frog for ' + p + ' of its max HP', short: 'heals ' + p + ' every ' + k + 's' };
      case 'freeze':        return { text: p + ' chance per hit to freeze the foe for ' + k + 's', short: p + ' freeze' };
      case 'double_strike': return { text: p + ' chance to strike twice', short: p + ' double strike' };
      case 'burn':          return { text: 'Hits burn the foe for ' + p + ' of their damage every second for ' + k + 's', short: 'burns ' + p + '/s' };
      case 'poison_cloud':  return { text: 'Every ' + k + 's, spores hit every foe for ' + p + ' of its damage', short: 'spores every ' + k + 's' };
      case 'crit':          return { text: p + ' chance to land a critical hit for ' + k + 'x damage', short: p + ' crit' };
      case 'shield_cycle':  return { text: 'Every ' + r.value + 's, a shield blocks the next hit', short: 'shield every ' + r.value + 's' };
      case 'slow':          return { text: 'Hits slow the foe\'s attacks by ' + p + ' for ' + k + 's', short: p + ' slow' };
    }
    return null;
  }
                                                                      
                                                                       
                    
  function familyAbilityInfo(family) {
    var a = getFamilyAbility(family), copy = a && abilityCopy(a.name, a.value);
    if (!copy) return null;
    var def = ABILITIES[a.name];
    return { name: a.name, value: a.value, id: def.id, icon: ABILITY_ICON_DIR + def.icon, text: copy.text, short: copy.short };
  }
  function familyAbilityHTML(family) {
    var info = familyAbilityInfo(family);
    if (!info) return '';
    return '<div class="fam-ability"><img class="fam-ability__ico" src="' + info.icon + '" alt="" draggable="false">'
      + '<span>' + info.name + ': ' + info.text + '.</span></div>';
  }

                                                                             
                                                                 
  function _resetConfigCacheForTests() {
    _sheetParamsCache = null; _enemyDbCache = null; _bossDbCache = null; _fasterDbCache = {}; _wavesCache = {};
  }

                                                                                
                                                                             
                                                                                

                                                            
  function makeRng(seed) {
    var a = seed >>> 0;
    function next() {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }
                                                                       
    next.state = function (value) { if (value !== undefined) a = value; return a; };
    return next;
  }

                                                                            
                                                                  
                                                                             
                                                                              
                                                                        
  function mitigatedDamage(atk, def, k) {
    var kk = k || 20;
    return atk * kk / (def + kk);
  }

  function jitteredCadence(cadence, rng) {
    return cadence * (1 + (rng() * 2 - 1) * getFPConfig().value('MergeRules','combat_attack_jitter_fraction'));
  }
                                                                            
                                                                             
                                                         
  function enemyFirstRemain(cadence, rng) {
    return cadence * (0.5 + 0.5 * rng());
  }

  function pondTotalAttack(frogs) {
    var sum = 0;
    for (var i = 0; i < frogs.length; i++) if (frogs[i].hp > 0) sum += frogs[i].attack;
    return sum;
  }
  function livingOf(list) { return list.filter(function (x) { return x.hp > 0; }); }
  function partyHpFrac(frogs) {
    var hp = 0, maxHp = 0;
    for (var i = 0; i < frogs.length; i++) { hp += Math.max(0, frogs[i].hp); maxHp += frogs[i].maxHp; }
    return maxHp > 0 ? hp / maxHp : 0;
  }

  function buildEnemiesForWave(wave, enemyDb, bossDb, rng) {
    var enemies = [];
    (wave.enemies || []).forEach(function (grp) {
      var def = enemyDb[grp.id];
      if (!def) return;
      for (var c = 0; c < grp.count; c++) {
        enemies.push({
          id: grp.id + '#' + enemies.length, defId: grp.id, isBoss: false, name: def.name, art: def.art,
          hp: def.hp, maxHp: def.hp, attack: def.attack, defense: def.defense,
          cadence: def.cadence, remain: enemyFirstRemain(def.cadence, rng), hitsPerAttack: Math.max(1, def.hitsPerAttack || 1)
        });
      }
    });
    (wave.bosses || []).forEach(function (b) {
      var def = bossDb[b.id];
      if (!def) return;
      for (var c = 0; c < b.count; c++) {
        enemies.push({
          id: b.id + '#' + enemies.length, defId: b.id, isBoss: true, name: def.name, art: def.art,
          hp: def.hp, maxHp: def.hp, attack: def.attack, defense: def.defense,
          cadence: def.cadence, remain: enemyFirstRemain(def.cadence, rng), hitsPerAttack: Math.max(1, def.hitsPerAttack || 1)
        });
      }
    });
    return enemies;
  }

                                                                        
                                                                          
                                                                          
                                                                         
                                                                         
                                                                         
                                                                          
                                                                          
                                                                       
                                                                             
                                                                           
                                             
  function resolveKillRewards(kills, enemyDb) {
    var totals = {};
    Object.keys(kills || {}).forEach(function (defId) {
      var def = enemyDb && enemyDb[defId];
      if (!def || !def.killRewardCurrency || !def.killRewardCount || def.killRewardCurrency === 'bones') return;
      var qty = kills[defId] * def.killRewardCount;
      if (qty <= 0) return;
      totals[def.killRewardCurrency] = (totals[def.killRewardCurrency] || 0) + qty;
    });
    return Object.keys(totals).map(function (id) { return { currencyId: id, qty: totals[id] }; });
  }

                                                                                 
                                                                             
                                                                            
                                                                                   
                                                                         
                                                                         
                          

                                                                          
                                                                          
                                               
                                                                          
                                                                       
                                                  

            
                                                    
                                                                 
                       
                    
                                                                                                   
                                                          
                                                   
                                                                                     
         
  function createFight(opts) {
    var rng = makeRng(opts.seed || 1);
    var tapRng = makeRng(((opts.seed || 1) ^ 0x9E3779B9) >>> 0);                                             
    var dodgeRng = makeRng(((opts.seed || 1) ^ 0x85EBCA6B) >>> 0);
                                                                           
                                                             
    var abilityRng = makeRng(((opts.seed || 1) ^ 0xC2B2AE35) >>> 0);
    var sheetParams = opts.sheetParams || getSheetParams();
    var tapParams = opts.tapParams || sheetParams.tap;
    var mitigationK = sheetParams.mitigationK;

    var frogs = (opts.party || []).map(function (p, i) {
      var spd = p.attackSpeed;
      if (spd == null) {
        spd = getFPConfig().value('MergeRules','combat_default_frog_attack_speed_per_s');
        if (!_warnedMissingKnobs.partyAttackSpeed) {
          _warnedMissingKnobs.partyAttackSpeed = true;
          console.error('[CombatLive] party is missing attackSpeed; using combat_default_frog_attack_speed_per_s=' + spd + '. Production parties must resolve Frogs Attack Speed.');
        }
      }
      if (typeof spd !== 'number' || !Number.isFinite(spd) || spd <= 0) throw new Error('[CombatLive] invalid attackSpeed for frog ' + p.id);
      var cadence = 1 / spd;
                                                                                                               
      var unit = { id: p.id, slot: i, dodgeChance: Math.max(0, Math.min(1, Number(p.dodgeChance) || 0)), hp: p.hp, maxHp: Math.max(p.hp, Number(p.maxHp) || 0), attack: p.attack, defense: p.defense, cadence: cadence, remain: cadence * rng() };
                                                                                  
      var ab = resolveAbility(p.ability);
      if (ab && ab.id === 'dodge') { if (p.dodgeChance == null) unit.dodgeChance = ab.value; }
      else if (ab) {
        unit.abil = ab.id; unit.abilVal = ab.value; unit.abilKnob = ab.knob;
        if (ab.id === 'heal' || ab.id === 'poison_cloud') unit.abilT = ab.knob;                                  
        if (ab.id === 'shield_cycle') { unit.shield = true; unit.abilT = 0; }                                  
      }
      return unit;
    });

    var waveIdx = 0, simTime = 0, enemies = [], done = false, won = null;
    var clearElapsedS = null, paused = false;
                                                                                                              
                                                                              
                                                                          
                                                                         
                                                                            
                                                 
    var pendingDt = 0;
    var tapsThisFight = 0, lastTapAtMs = null;
    var log = opts.record ? [] : null;
    function emit(event) {
      if (log) log.push(event);
                                                                                 
      if (typeof opts.onEvent === 'function') { try { opts.onEvent(Object.assign({}, event)); } catch (e) {} }
    }
                                                                              
                                                                              
                                                                           
                                                                            
    var kills = {};
    function recordKillIfDead(target) {
      if (target.hp <= 0) kills[target.defId] = (kills[target.defId] || 0) + 1;
    }

                                                                             
                                                                               
                                                                              
                                                                                 
                                                                              
                                                                               
                                                                 
    var harvestS = null, harvests = [];
    var frogTapS = null;
    function spawnHarvest(h) {
      enemies = [];
      harvestS = h.web
        ? Object.assign({ web: h.web, reward: h.reward, taps: h.taps },
          h.prizes && h.prizes.length ? { prizes: h.prizes.map(function (p) { return { table: p.table, winOnly: !!p.winOnly }; }) } : {}, { progress: 0, clock: 0, done: false })
        : { flower: h.flower, reward: h.reward, taps: h.taps, progress: 0, clock: 0, done: false };
      frogTapS = null;                                                 
      if (log) log.push({ t: simTime, type: 'wave-start', waveNo: opts.waves[waveIdx].no, waveIdx: waveIdx, enemies: [], harvest: h.flower || h.web });
    }
                                                                      
    function addHarvest(by) {
      harvestS.progress = Math.min(harvestS.taps, harvestS.progress + 1);
      emit({ t: simTime, type: 'harvest', by: by, progress: harvestS.progress, taps: harvestS.taps });
      if (harvestS.progress >= harvestS.taps) completeHarvest();
    }
    function completeHarvest() {
      harvestS.done = true; harvestS.progress = harvestS.taps;
      if (harvestS.reward) harvests.push(harvestS.reward);
      var prizeTables = (harvestS.prizes || []).map(function (p) { return p.table; });
      prizeTables.forEach(function (id) { harvests.push(id); });
      emit(harvestS.web ? { t: simTime, type: 'harvested', web: harvestS.web, reward: harvestS.reward, prizes: prizeTables }
        : { t: simTime, type: 'harvested', flower: harvestS.flower, reward: harvestS.reward });
                                                                                                           
      if (opts.presentation) clearElapsedS = -PRESENTATION_PARAMS.harvestHoldS;
      else nextWave();
    }
    function stepHarvest(dtS) {
      if (!opts.presentation) { completeHarvest(); return; }
      if (frogTapS == null) frogTapS = Math.max(0.05, harvestS.web ? (opts.rescueFrogTapS || rescueFrogTapS()) : (opts.harvestFrogTapS || harvestFrogTapS()));
      simTime += dtS; harvestS.clock += dtS;
      while (!harvestS.done && harvestS.clock >= frogTapS - 1e-9) { harvestS.clock -= frogTapS; addHarvest('frogs'); }
    }

                                                                                                    
                                                                                                       
                                                                                                   
                                           
    var rocks = null, rockHitsN = null;
    function spawnRocks() {
      rocks = null;
      var rk = opts.waves[waveIdx].rocks;
      if (!rk) return;
      if (rockHitsN == null) rockHitsN = Math.max(1, Math.round(opts.rockHits || rockHitsKnob()));
      rocks = { count: rk.count, reward: rk.reward, hits: rockHitsN, chips: 0, burst: 0 };
    }
    function burstRock(by, to) {
      rocks.burst++; rocks.chips = 0;
      harvests.push(rocks.reward);
      emit({ t: simTime, type: 'rock', by: by, to: to, burst: true, left: rocks.count - rocks.burst, reward: rocks.reward });
    }
                                                                                 
    function chipRocks(by, to) {
      if (!rocks || rocks.burst >= rocks.count) return;
      if (++rocks.chips >= rocks.hits) burstRock(by, to);
      else emit({ t: simTime, type: 'rock', by: by, to: to, burst: false, left: rocks.count - rocks.burst });
    }
                                                                                   
    function smashRocks() {
      var left = rocks ? rocks.count - rocks.burst : 0;
      for (var i = 0; i < left; i++) burstRock('smash', null);
      return left > 0;
    }

    function spawnWave() {
      rocks = null;
      if (opts.waves[waveIdx].harvest) { spawnHarvest(opts.waves[waveIdx].harvest); return; }
      harvestS = null;
      spawnRocks();
      enemies = buildEnemiesForWave(opts.waves[waveIdx], opts.enemyDb, opts.bossDb, rng);
      if (log) log.push({ t: simTime, type: 'wave-start', waveNo: opts.waves[waveIdx].no, waveIdx: waveIdx, enemies: enemies.map(function (e) { return { id: e.id, maxHp: e.maxHp, isBoss: e.isBoss }; }) });
    }
    spawnWave();

    function finish(didWin) {
      done = true; won = didWin;
      if (log) log.push({ t: simTime, type: 'result', won: didWin });
    }

    function nextWave() {
      clearElapsedS = null;
      waveIdx++;
      if (waveIdx >= opts.waves.length) finish(true);
      else spawnWave();
    }
    function waveClearPhase() {
      if (clearElapsedS === null) return null;
      if (clearElapsedS < PRESENTATION_PARAMS.beforeClearS) return 'before';
      if (clearElapsedS < PRESENTATION_PARAMS.beforeClearS + PRESENTATION_PARAMS.clearBannerS) return 'banner';
      return 'after';
    }
                                                                                      
                                                                                    
    function advancePresentation(dtS) {
      if (paused || clearElapsedS === null || done || dtS <= 0) return;
      clearElapsedS += dtS;
      var total = PRESENTATION_PARAMS.beforeClearS + PRESENTATION_PARAMS.clearBannerS + PRESENTATION_PARAMS.afterClearS;
      if (clearElapsedS + 1e-9 >= total) nextWave();
    }

    function applyTap(nowMs) {
      if (paused || done || clearElapsedS !== null) return null;
      var lf = livingOf(frogs), le = livingOf(enemies);
      if (!lf.length || (!le.length && !(harvestS && !harvestS.done))) return null;
                                                                                
                                      
      var minGapMs = 1000 / tapParams.rateMaxPerS;
      if (lastTapAtMs != null && (nowMs - lastTapAtMs) < minGapMs - 1e-6) return null;
      lastTapAtMs = nowMs;
                                                                     
      if (harvestS) {
        tapsThisFight++;
        addHarvest('tap');
        if (log) log.push({ t: simTime, type: 'tap', harvest: true, progress: harvestS.progress });
        return { harvest: true, progress: harvestS.progress, taps: harvestS.taps, complete: harvestS.done };
      }
      var surgeMult = opts.surgeActive ? tapParams.surge.magnitudeMult : 1;
      var raw = tapParams.damagePctOfPondAttack * surgeMult * pondTotalAttack(frogs);
      var tgt = le[Math.floor(tapRng() * le.length)];                                           
      var dmg = tapParams.bypassesMitigation ? raw : mitigatedDamage(raw, tgt.defense, mitigationK);
      tgt.hp = Math.max(0, tgt.hp - dmg);
      tapsThisFight++;
      var targetDied = tgt.hp <= 0;
      if (targetDied) recordKillIfDead(tgt);
      if (log) log.push({ t: simTime, type: 'tap', targetId: tgt.id, dmg: dmg, hpAfter: tgt.hp });
      chipRocks('tap', tgt.id);
      return { dmg: dmg, targetId: tgt.id, targetDied: targetDied };
    }

                                                                              
    function hurtFoe(tgt, dmg) {
      tgt.hp = Math.max(0, tgt.hp - dmg);
      recordKillIfDead(tgt);
      return dmg;
    }
                                                               
    function frogStrike(f, tgt, extra) {
      var base = mitigatedDamage(f.attack, tgt.defense, mitigationK);
      var crit = f.abil === 'crit' && abilityRng() < f.abilVal;
      var dmg = hurtFoe(tgt, crit ? base * f.abilKnob : base);
      var event = { t: simTime, type: 'attack', side: 'frog', from: f.id, to: tgt.id, dmg: dmg, hpAfter: tgt.hp };
      if (crit) event.crit = true;
      if (extra) event.extra = extra;
      emit(event);
      chipRocks('attack', tgt.id);
      if (tgt.hp > 0 && f.abil) applyOnHit(f, tgt, base);
    }
    function statusEvent(f, tgt, ability, fresh) {
      emit({ t: simTime, type: 'status', side: 'frog', from: f.id, to: tgt.id, ability: ability, fresh: fresh });
    }
    function applyOnHit(f, tgt, base) {
      if (f.abil === 'freeze' && abilityRng() < f.abilVal) {
        var wasFrozen = tgt.frozenS > 0; tgt.frozenS = f.abilKnob; statusEvent(f, tgt, 'freeze', !wasFrozen);
      } else if (f.abil === 'slow') {
        var wasSlow = tgt.slowS > 0; tgt.slowS = f.abilKnob; tgt.slowFrac = f.abilVal; statusEvent(f, tgt, 'slow', !wasSlow);
      } else if (f.abil === 'burn') {
        var wasBurning = tgt.burnPulses > 0;
        if (!wasBurning) tgt.burnTick = 1;                                              
        tgt.burnPulses = Math.max(1, Math.round(f.abilKnob));                             
        tgt.burnDmg = base * f.abilVal; tgt.burnFrom = f.id;
        statusEvent(f, tgt, 'burn', !wasBurning);
      }
    }
                                                                  
    function abilityTick(dt) {
      livingOf(frogs).forEach(function (f) {
        if (f.abil === 'heal') {
          f.abilT -= dt;
          while (f.abilT <= 1e-9) {
            f.abilT += f.abilKnob;
            var hurt = livingOf(frogs).filter(function (u) { return u.hp < u.maxHp; })
              .sort(function (a, b) { return a.hp / a.maxHp - b.hp / b.maxHp; })[0];
            if (!hurt) continue;
            var amount = Math.min(hurt.maxHp - hurt.hp, hurt.maxHp * f.abilVal);
            hurt.hp += amount;
            emit({ t: simTime, type: 'heal', side: 'frog', from: f.id, to: hurt.id, amount: amount, hpAfter: hurt.hp });
          }
        } else if (f.abil === 'poison_cloud') {
          f.abilT -= dt;
          while (f.abilT <= 1e-9) {
            f.abilT += f.abilKnob;
            var foes = livingOf(enemies);
            if (!foes.length) continue;
            emit({ t: simTime, type: 'status', side: 'frog', from: f.id, ability: 'poison_cloud', fresh: true });
            foes.forEach(function (e) {
              var d = hurtFoe(e, mitigatedDamage(f.attack, e.defense, mitigationK) * f.abilVal);
              emit({ t: simTime, type: 'dot', kind: 'poison', side: 'frog', from: f.id, to: e.id, dmg: d, hpAfter: e.hp });
            });
          }
        } else if (f.abil === 'shield_cycle' && !f.shield) {
          f.abilT -= dt;
          if (f.abilT <= 1e-9) { f.shield = true; emit({ t: simTime, type: 'status', side: 'frog', from: f.id, to: f.id, ability: 'shield_cycle', fresh: true }); }
        }
      });
      livingOf(enemies).forEach(function (e) {
        if (!(e.burnPulses > 0)) return;
        e.burnTick -= dt;
        while (e.burnTick <= 1e-9 && e.burnPulses > 0 && e.hp > 0) {
          e.burnTick += 1; e.burnPulses--;
          var d = hurtFoe(e, e.burnDmg);
          emit({ t: simTime, type: 'dot', kind: 'burn', side: 'frog', from: e.burnFrom, to: e.id, dmg: d, hpAfter: e.hp });
        }
      });
    }
                                                                              
                                                        
    function stealthRetarget(targets, living) {
      return targets.map(function (t) {
        if (t.abil !== 'stealth' || abilityRng() >= t.abilVal) return t;
        var others = living.filter(function (u) { return u !== t && targets.indexOf(u) < 0; });
        if (!others.length) return t;
        emit({ t: simTime, type: 'status', side: 'enemy', to: t.id, ability: 'stealth', fresh: true });
        return others[Math.floor(abilityRng() * others.length)];
      });
    }

                                                                          
                                                                               
    function step(dtS) {
      if (paused || done || clearElapsedS !== null || !dtS || dtS <= 0) return;
      if (harvestS && !harvestS.done) { stepHarvest(dtS); return; }
      pendingDt += dtS;
      var guard = 0;
      while (pendingDt >= PARAMS.fixedStepS - 1e-9 && !done && guard < PARAMS.maxTicksPerStepCall) {
        var dt = PARAMS.fixedStepS;
        pendingDt -= dt; guard++; simTime += dt;

        var lf = livingOf(frogs);
        for (var i = 0; i < lf.length; i++) {
          var f = lf[i];
          f.remain -= dt;
          while (f.remain <= 1e-9) {
            var le = livingOf(enemies);
            if (!le.length) break;
            var tgt = le[Math.floor(rng() * le.length)];
            frogStrike(f, tgt, null);
            if (f.abil === 'double_strike' && abilityRng() < f.abilVal) {
              var le3 = livingOf(enemies);
              if (le3.length) frogStrike(f, le3[Math.floor(abilityRng() * le3.length)], 'double_strike');
            }
            f.remain += jitteredCadence(f.cadence, rng);
          }
        }
        abilityTick(dt);

        if (!livingOf(enemies).length) {
                                                                                 
                                                                                 
          var smashed = smashRocks();
          if (opts.presentation) { clearElapsedS = smashed ? -PRESENTATION_PARAMS.rockSmashHoldS : 0; break; }
          nextWave();
          if (done || harvestS) break;                                              
          continue;
        }

        var le2 = livingOf(enemies);
        for (var j = 0; j < le2.length; j++) {
          var e = le2[j];
                                                              
          var clock = e.frozenS > 0 ? 0 : (e.slowS > 0 ? 1 - e.slowFrac : 1);
          if (e.frozenS > 0) e.frozenS = Math.max(0, e.frozenS - dt);
          if (e.slowS > 0) e.slowS = Math.max(0, e.slowS - dt);
          e.remain -= dt * clock;
          while (e.remain <= 1e-9) {
            var lfNow = livingOf(frogs);
            if (!lfNow.length) break;
                                                                           
                                                                              
                                                              
            var pool = lfNow.slice(), hits = Math.min(e.hitsPerAttack, pool.length), targets = [];
            for (var h = 0; h < hits; h++) { var idx = Math.floor(rng() * pool.length); targets.push(pool.splice(idx, 1)[0]); }
            targets = stealthRetarget(targets, lfNow);
            targets.forEach(function (t) {
              var dodged = t.dodgeChance > 0 && dodgeRng() < t.dodgeChance;
              var blocked = !dodged && t.shield === true;
              var d = dodged || blocked ? 0 : mitigatedDamage(e.attack, t.defense, mitigationK);
              t.hp = Math.max(0, t.hp - d);
              var event = { t: simTime, type: 'attack', side: 'enemy', from: e.id, to: t.id, dmg: d, hpAfter: t.hp, dodged: dodged };
              if (blocked) { event.blocked = true; t.shield = false; t.abilT = t.abilVal; }                                
              emit(event);
            });
            e.remain += jitteredCadence(e.cadence, rng);
          }
        }

        if (!livingOf(frogs).length) { finish(false); break; }

      }
    }

                                                                            
                                                          
    function cloneUnits(list) { return list.map(function (u) { return Object.assign({}, u); }); }
    function snapshot() {
      return { frogs: cloneUnits(frogs), enemies: cloneUnits(enemies), waveIdx: waveIdx, simTime: simTime,
        done: done, won: won, clearElapsedS: clearElapsedS, pendingDt: pendingDt, tapsThisFight: tapsThisFight,
        kills: Object.assign({}, kills), rng: [rng.state(), tapRng.state(), dodgeRng.state(), abilityRng.state()],
        harvest: harvestS ? Object.assign({}, harvestS) : null, harvests: harvests.slice(), rocks: rocks ? Object.assign({}, rocks) : null };
    }
    function restore(snap) {
      frogs = cloneUnits(snap.frogs); enemies = cloneUnits(snap.enemies);
      waveIdx = snap.waveIdx; simTime = snap.simTime; done = snap.done; won = snap.won;
      clearElapsedS = snap.clearElapsedS; pendingDt = snap.pendingDt; tapsThisFight = snap.tapsThisFight;
      harvestS = snap.harvest ? Object.assign({}, snap.harvest) : null; harvests = (snap.harvests || []).slice(); frogTapS = null;
      rocks = snap.rocks ? Object.assign({}, snap.rocks) : null;
      kills = Object.assign({}, snap.kills); lastTapAtMs = null;
      rng.state(snap.rng[0]); tapRng.state(snap.rng[1]); dodgeRng.state(snap.rng[2]);
      if (snap.rng[3] != null) abilityRng.state(snap.rng[3]);
      if (log) log.push({ t: simTime, type: 'rewind' });
    }

    return {
      step: step,
      advancePresentation: advancePresentation,
      waveClearPhase: waveClearPhase,
                                                                            
                                                     
      clearElapsed: function () { return clearElapsedS; },
      applyTap: applyTap,
      snapshot: snapshot,
      restore: restore,
      isDone: function () { return done; },
      isWon: function () { return won; },
      setPaused: function (value) { paused = !!value; },
      isPaused: function () { return paused; },
      pauseReason: function () { return paused ? 'tap-tutorial' : null; },
      currentWaveIndex: function () { return waveIdx; },
      waveCount: opts.waves.length,
      enemies: function () { return enemies; },
      frogs: function () { return frogs; },
      partyHpFrac: function () { return partyHpFrac(frogs); },
      pondTotalAttack: function () { return pondTotalAttack(frogs); },
      tapsThisFight: function () { return tapsThisFight; },
      simTime: function () { return simTime; },
      kills: function () { return Object.assign({}, kills); },
                                                                        
      harvest: function () { return harvestS ? Object.assign({}, harvestS) : null; },
                                                                                              
      harvests: function () { return harvests.slice(); },
                                                                                                          
      rocks: function () { return rocks ? Object.assign({}, rocks) : null; },
      log: log
    };
  }

                                                                        
                                                                             
                                                                             
                                                                         
                                                
  function simulateHeadless(party, waves, enemyDb, bossDb, seed, tapRatePerS) {
    var fight = createFight({ party: party, waves: waves, enemyDb: enemyDb, bossDb: bossDb, seed: seed });
    var guard = 0;
    if (tapRatePerS > 0) {
      var stepS = 0.1, tapEveryS = 1 / tapRatePerS, sinceLastTap = 0, nowMs = 0, maxT = 1200;
      while (!fight.isDone() && guard < (maxT / stepS)) {
        fight.step(stepS); nowMs += stepS * 1000; sinceLastTap += stepS; guard++;
        if (sinceLastTap >= tapEveryS) { fight.applyTap(nowMs); sinceLastTap = 0; }
      }
    } else {
      while (!fight.isDone() && guard < 4000) { fight.step(5); guard++; }
    }
                                                                                           
                                                                          
    return { won: !!fight.isWon(), partyHpFrac: fight.partyHpFrac(), simTime: fight.simTime(), wavesCleared: fight.currentWaveIndex(), timedOut: !fight.isDone(), kills: fight.kills(), harvests: fight.harvests() };
  }

                                                                                
                                                                            
                                                                             
                                                                        
                                                                                

  function resolveExpeditionWaves(expedition) {
    if (expedition == null) return null;
    try {
      if (typeof expedition === 'number' || typeof expedition === 'string') {
        var w = getFtueWaves(Number(expedition));
        return w ? { waves: w, enemyDb: getEnemyDb(Number(expedition)), bossDb: getBossDb(Number(expedition)) } : null;
      }
      if (expedition.waves) return { waves: expedition.waves, enemyDb: expedition.enemyDb || getEnemyDb(), bossDb: expedition.bossDb || getBossDb() };
    } catch (e) { return null; }                                                                                          
    return null;
  }

                                                                          
                                                                             
                                                                              
                                                                        
                                                                             
                                                                    
                                                                            
                                                                              
  function estimate(party, expedition, trials) {
    var src = resolveExpeditionWaves(expedition);
    if (!party || !party.length || !src) return { winRate: 0, band: 'risky', trials: 0 };
    trials = trials || getFPConfig().value('MergeRules','prediction_trials');
    var wins = 0;
    for (var i = 0; i < trials; i++) {
      var seed = ((i + 1) * 2654435761) >>> 0;                                                
      var res = simulateHeadless(party, src.waves, src.enemyDb, src.bossDb, seed);
      if (res.won) wins++;
    }
    var winRate = wins / trials;
    var band = winRate >= getFPConfig().value('MergeRules','prediction_strong_min_win_rate') ? 'strong'
      : winRate >= getFPConfig().value('MergeRules','prediction_even_min_win_rate') ? 'even' : 'risky';
    return { winRate: winRate, band: band, trials: trials };
  }

                                                                                
                                                                            
                                                                               
                                                                      
                                                                            
                                                                               
                                                                         
                                                                               
                                                                                 
                                                                                
  function synthWaveFromReq(req) {
    req = req || {};
    var hp = Math.max(20, Math.round((req.hp || 0) * 2.4));
    var atk = Math.max(2, Math.round((req.atk || 0) * 0.5));
    var def = Math.max(0, Math.round((req.def || 0) * 0.6));
    var enemyDb = { __synth: { id: '__synth', name: 'Wild Thing', hp: hp, attack: atk, defense: def, cadence: 1.3, hitsPerAttack: 1, art: 'boar' } };
    return { waves: [{ no: 1, enemies: [{ id: '__synth', count: 1 }] }], enemyDb: enemyDb, bossDb: {} };
  }

                                                                                
                                                                              
                                                                    
                                                                                
  var isBrowser = typeof document !== 'undefined';
  var STAGE_ID = 'cl-stage';
  var TIP_PILL_TEXT = 'TAP THE FIELD · RALLY STRIKE';                                     
  var current = null;                                                 

  function isOpen() { return !!current; }

  function kitUI() {
    return (typeof KitUI !== 'undefined') ? KitUI : (typeof window !== 'undefined' ? window.KitUI : null);
  }

  function creatureArt() { return typeof CreatureArt !== 'undefined' ? CreatureArt : {}; }
  function presentation() { return CombatPresentation; }
  function enemyArtPath(e, pose) {
    var record = creatureArt()[e.defId];
    return record ? record[pose || 'idle'] || record.idle : '';
  }
                                                                                                
                                                                                             
                                                                                                  
                                                                                                
                                                                                                 
                                                                    
                                                         
  function foeFrames(e) { var r = e && creatureArt()[e.defId]; return (r && r.frames) || null; }
  function frameSrc(fr, name) { return fr.dir + name + '.png'; }
                                                                                                
                                                                                         
  function foeArtSrc(e, pose) {
    var fr = foeFrames(e);
    return fr ? frameSrc(fr, pose === 'calm' ? fr.calm : fr.stance) : enemyArtPath(e, pose);
  }
                                                                                              
                                                                                                  
                                                                                                       
  function foeTargetRect(node) {
    var r = node.getBoundingClientRect(), fr = foeFrames({ defId: node.dataset.catalog });
    var img = fr && fr.body && node.querySelector('.cl-foe-motion img');
    if (!img || !img.offsetWidth || !node.offsetWidth) return r;
    var s = r.width / node.offsetWidth, kx = img.offsetWidth / fr.cell.w * s, ky = img.offsetHeight / fr.cell.h * s;
    var x = r.x + img.offsetLeft * s + fr.body.x * kx, y = r.y + (img.parentNode.offsetTop + img.offsetTop) * s + fr.body.y * ky;
    var w = fr.body.w * kx, h = fr.body.h * ky;
    return { x: x, y: y, left: x, top: y, width: w, height: h, right: x + w, bottom: y + h };
  }
  var framePreload = {};
  function preloadFrames(fr) {
    if (framePreload[fr.dir]) return;
    var names = [fr.calm, fr.stance].concat(fr.attack.concat(fr.back).map(function (s) { return s[0]; }));
    if (fr.shot) names = names.concat(fr.shot.fly.map(function (s) { return s[0]; }),
      fr.shot.impact.seq ? fr.shot.impact.seq.map(function (s) { return s[0]; }) : [fr.shot.impact.name]);
    if (fr.notice) names.push(fr.notice[0]);
    if (fr.lash) names = [fr.calm, fr.stance].concat(fr.notice ? [fr.notice[0]] : [], Object.keys(fr.lash.pieces).reduce(function (a, n) { return a.concat([n + '_vine', n + '_head']); }, []),
      fr.lash.heads.reduce(function (a, h) { return a.concat(fr.attack.map(function (s) { return h + s[0]; })); }, []));
    framePreload[fr.dir] = names.map(function (n) { var i = new Image(); i.src = frameSrc(fr, n); return i; });
  }
                                                                                                       
                                                                                                     
                                                 
  function frogFramePx(id) {
    var fn = current && current.opts.frogPx, px = typeof fn === 'function' ? Number(fn(id)) : 0;
    return px > 0 ? px : presentation().PARAMS.frogFramePx;
  }
                                                                                               
                                                                             
  function battleFrogPx(id) { return frogFramePx(id) * presentation().PARAMS.frogScale; }
                                                                                                                        
                                                                                                                       
                                                                                                                            
  var GROUND_BAND_BY_STAGE = { lagoon: [250, 640] };
                                                                                                                     
                                                                                                         
  var SCENE_SCALE_BY_STAGE = { lagoon: 0.7 };
  function stageGround(rect) {
    var el = current && current.el;
    return presentation().ground(rect.width, rect.height, frogFramePx(null), el && GROUND_BAND_BY_STAGE[el.dataset.stage]);
  }
                                                                                                
                                                                     
  function foeRegion(el, rect, waveIdx) {
    var region = stageGround(rect).enemy, art = creatureArt();
    region.avoid = rockLayoutFor(el, waveIdx).filter(function (b) { return b.front; });
                                                                                                                     
                                                                                                                
    var wave = current.opts.waves[waveIdx];
    ((wave && wave.bosses) || []).concat((wave && wave.enemies) || []).forEach(function (b) {
      var s = art[b.id] && art[b.id].stand;
      if (s) (region.stand = region.stand || {})[b.id] = { x: rect.width * s.x, y: region.top + (region.bottom - region.top) * s.y };
    });
    return region;
  }
  function battleRoster(fight) {
    var rect=current.el.getBoundingClientRect();
    var key=[fight.currentWaveIndex(),rect.width,rect.height].join('|');
    if(current.rosterKey!==key){
      current.enemyRoster=presentation().organicRoster(fight.enemies(),foeRegion(current.el,rect,fight.currentWaveIndex()),current.layoutSeed+':'+fight.currentWaveIndex());
      current.rosterKey=key;current.rosterPage=0;
    }
    var living=new Set(fight.enemies().filter(function(e){return e.hp>0;}).map(function(e){return e.id;}));
    current.enemyRoster.groups.forEach(function(g){g.count=g.members.filter(function(id){return living.has(id);}).length;});
    return current.enemyRoster;
  }

  function waveHpTotals(fight) {
    var es = fight.enemies(), hp = 0, maxHp = 0;
    es.forEach(function (e) { hp += Math.max(0, e.hp); maxHp += e.maxHp; });
    return { hp: hp, maxHp: maxHp, frac: maxHp > 0 ? hp / maxHp : 0 };
  }

  function fmt(n) { n = Math.max(0, Math.round(n)); return n.toLocaleString ? n.toLocaleString() : String(n); }

  function escHTML(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
  }
                                                                        
                                                                         
                                                                    
                                            
  function stageTrackHTML(fight, bossWaveIdx, waves) {
    var cur = fight.currentWaveIndex(), between = fight.waveClearPhase() !== null, out = '';
    for (var i = 0; i < fight.waveCount; i++) {
      var cleared = i < cur || (i === cur && between);
      var st = cleared ? 'done' : (i === cur ? 'cur' : 'next');
      var boss = bossWaveIdx != null && i === bossWaveIdx, h = waves && waves[i] && waves[i].harvest, art = h && (h.web ? webInfo(h.web) : harvestInfo(h.flower)).art;
      if (i) out += '<i class="cl-stage-link' + (i <= cur ? ' done' : '') + '"></i>';
      out += '<span class="cl-stage cl-stage--' + st + (boss ? ' cl-stage--boss' : '') + (h ? ' cl-stage--harvest' + (h.web ? ' cl-stage--rescue' : '') : '') + '">'
        + (cleared ? '✓' : (boss ? 'B' : art ? '<img src="' + escHTML(art) + '" alt="' + (i + 1) + '" draggable="false">' : i + 1)) + '</span>';
    }
    return out;
  }
                                                                           
                                                                            
                                          
  function enemyPlates(fight) {
    var groups = [], byKey = {};
    fight.enemies().forEach(function (e) {
      var k = (e.isBoss ? 'b:' : 'e:') + e.defId;
      if (!byKey[k]) { byKey[k] = { key: k, name: e.name, art: enemyArtPath(e, 'idle'), hp: 0, maxHp: 0 }; groups.push(byKey[k]); }
      byKey[k].hp += Math.max(0, e.hp); byKey[k].maxHp += e.maxHp;
    });
    return groups;
  }
  function platesHTML(groups) {
    return groups.map(function (gp) {
      return '<div class="cl-plate" data-key="' + escHTML(gp.key) + '">'
        + '<span class="cl-plate__art">' + (gp.art ? '<img src="' + escHTML(gp.art) + '" alt="" draggable="false">' : '') + '<span class="cl-plate__weak">?</span></span>'
        + '<span class="cl-plate__info"><span class="cl-plate__name">' + escHTML(gp.name) + '</span>'
        + '<span class="cl-plate__bar"><i></i></span></span></div>';
    }).join('');
  }

  function pipsHTML(fight, bossWaveIdx, waves) {
    var out = '';
    for (var i = 0; i < fight.waveCount; i++) {
      var isBoss = bossWaveIdx != null && i === bossWaveIdx;
      var cleared = i < fight.currentWaveIndex() || (i === fight.currentWaveIndex() && fight.waveClearPhase() !== null);
      var cls = cleared ? 'cl-pip done' : i === fight.currentWaveIndex() ? 'cl-pip cur' : 'cl-pip';
      out += '<span class="' + cls + (isBoss ? ' boss' : '') + (waves && waves[i] && waves[i].harvest ? ' harvest' + (waves[i].harvest.web ? ' rescue' : '') : '') + '"></span>';
    }
    return out;
  }

  function buildShell(opts) {
    var el = document.getElementById(STAGE_ID);
    if (!el) { el = document.createElement('div'); el.id = STAGE_ID; document.body.appendChild(el); }
    el.className = 'cl-overlay';
    var KUI = kitUI();
                                                                       
    var backBtnHTML = KUI && KUI.backButton
      ? KUI.backButton({ className: 'cl-back', ariaLabel: 'Leave expedition' })
      : '<button class="cl-back kit-back" type="button" aria-label="Leave expedition"><span aria-hidden="true">‹</span></button>';

    var hand = typeof Assets !== 'undefined' ? Assets.ui('pointClicker01') : '';
                                                                               
                                                                                 
                                                                        
    var leaveTitle = 'Leave the expedition?';
    var leaveBody = 'Your party returns now and this run won’t count.';
    var leaveHTML = KUI && KUI.confirmModal
      ? '<div class="cl-leaveconfirm-card"><img class="cl-leaveconfirm-badge" src="assets/tooltips/badge.png" alt="" draggable="false">' +
        KUI.confirmModal({ tone: 'danger', id: 'cl-leaveconfirm-modal', title: leaveTitle, body: leaveBody, cancel: { label: 'No' }, confirm: { label: 'Leave' } }) + '</div>'
      : '<div class="cl-leaveconfirm-card"><div class="cl-leaveconfirm-title">' + leaveTitle + '</div>' +
        '<div class="cl-leaveconfirm-sub">' + leaveBody + '</div><div class="cl-leaveconfirm-btns">' +
        '<button id="cl-leave-cancel" type="button">No</button><button id="cl-leave-confirm" type="button">Leave</button></div></div>';

                                                                                
                                                                    
    function tipCard(id, title, art, alt, label) {
      var original = id === 'cl-tappopup' ? 'Tap the field to strike! Every tap is bonus damage!' : 'Your Bunny frog dodged the hit! Full families unlock combat powers!';
      var picture = '<img src="' + art + '" alt="' + escHTML(alt) + '">';
      if(typeof FtueArtText !== 'undefined') picture=FtueArtText.html(art,picture);
      if(alt !== original) picture = '<div class="ftt-edited-art"><div class="ftt-edited-picture">'+picture+'</div><p>'+escHTML(alt)+'</p></div>';
      return '<div class="ftt-card"><img class="ftt-badge" src="assets/tooltips/badge.png" alt="">' +
        '<h2 class="ftt-title" id="' + id + '-title">' + escHTML(title) + '</h2>' +
        '<div class="ftt-art">' + picture + '</div>' +
        (KUI ? KUI.button({ tone: 'gold', size: 'sm', id: id + '-continue', label: label }) : '<button id="' + id + '-continue" type="button">' + escHTML(label) + '</button>') +
        '<div class="ftt-tail" aria-hidden="true"><i class="o"></i><i class="i"></i></div></div>';
    }
    var tapHTML = tipCard('cl-tappopup', text("text_combat_tap_title", "Your frogs need backup!"), 'assets/tooltips/combat-tap.png', text("text_combat_tap_caption", "Tap the field to strike! Every tap is bonus damage!"), text("text_combat_tap_button", "Let’s go!"));
    var dodgeHTML = tipCard('cl-dodgepopup', text("text_combat_dodge_title", "Family power: Dodge!"), 'assets/tooltips/combat-dodge.png', text("text_combat_dodge_caption", "Your Bunny frog dodged the hit! Full families unlock combat powers!"), text("text_combat_dodge_button", "Awesome!"));

                                                                             
                                                                            
                                                                             
                                                                              
    var gearHTML = KUI && KUI.settingsButton ? KUI.settingsButton({ className: 'cl-gear', onclick: 'SettingsUI.open()' }) : '';
    var pay = opts && opts.payout;
    var payoutHTML = pay && pay.text
      ? '<div class="cl-payout">' + (pay.artSrc && KUI && KUI.art ? KUI.art(pay.artSrc, { size: 24, fill: 0.92 }) : '') + '<span>' + escHTML(pay.text) + '</span></div>'
      : '';
    el.innerHTML =
                                                                             
                                                                           
                                          
      '<div class="cl-world">' +
        '<div class="cl-bg cl-far"></div><div class="cl-bg cl-mid"></div>' +
        '<div class="cl-bg cl-floor"></div>' +
        '<div class="cl-arena" id="cl-arena">' +
          '<div class="cl-party" id="cl-party"></div>' +
          '<div class="cl-foes" id="cl-foes"></div>' +
                                                                             
                                                                         
          '<div class="cl-bg cl-fore"></div>' +
          '<div class="cl-fx" id="cl-fx"></div>' +
          '<button id="cl-roster-pages" class="cl-roster-pages" type="button" hidden></button>' +
        '</div>' +
      '</div>' +
      '<div class="cl-danger" aria-hidden="true"></div><div class="cl-flash" aria-hidden="true"></div>' +
      '<div class="cl-top">' + backBtnHTML +
                                                                                        
        '<div class="cl-wavehead">' + (opts && opts.tier && opts.tier !== 'normal' ? '<div class="cl-tier cl-tier--' + escHTML(opts.tier) + '">' + escHTML(String(opts.tier).toUpperCase()) + '</div>' : '') +
          '<div class="cl-wavelabel" id="cl-wavelabel"></div><div class="cl-pips" id="cl-pips"></div></div>' +
        gearHTML +
      '</div>' +
                                                                             
                                                                           
                                                                          
      '<div class="cl-vsrow">' +
                                                                              
                                                      
        '<div class="cl-side cl-side--party"><span class="cl-sidename">YOUR POND</span><span class="cl-bar"><b class="cl-bar-trail" id="cl-partytrail"></b><i id="cl-partybar"></i></span><span class="cl-sidelabel" id="cl-partystat"></span></div>' +
        '<div class="cl-side cl-side--foe"><span class="cl-sidename" id="cl-foename"></span><span class="cl-bar cl-bar--foe"><b class="cl-bar-trail" id="cl-foetrail"></b><i id="cl-foebar"></i></span><span class="cl-hp" id="cl-foestat"></span></div>' +
      '</div>' +
      '<div class="cl-stagetrack" id="cl-stagetrack" aria-hidden="true"></div>' +
      '<div class="cl-plates" id="cl-plates" aria-hidden="true"></div>' +
      payoutHTML +
      '<div class="cl-tapnote">' + TIP_PILL_TEXT + '</div>' +
      '<div class="cl-waveclear" id="cl-waveclear" hidden>Wave cleared</div>' +
      '<div class="cl-tap-guide" id="cl-tap-guide" hidden><span>' + escHTML(text("text_combat_tap_guide", "Tap to help your frogs!")) + '</span>' + (hand ? '<img src="'+hand+'" alt="" draggable="false">' : '') + '</div>' +
      '<div class="cl-rewind" id="cl-rewind" role="status" hidden><div class="cl-rewind-badge"><span aria-hidden="true">⏪</span>' + escHTML(text("text_combat_rewind", "Rewind!")) + '</div></div>' +
      '<div class="cl-tappopup cl-tip" id="cl-tappopup" role="dialog" aria-modal="true" aria-labelledby="cl-tappopup-title" hidden>' + tapHTML + '</div>' +
      '<div class="cl-tappopup cl-tip" id="cl-dodgepopup" role="dialog" aria-modal="true" aria-labelledby="cl-dodgepopup-title" hidden><div class="ftt-spot" aria-hidden="true" hidden></div>' + dodgeHTML + '</div>' +
      '<div class="cl-leaveconfirm" id="cl-leaveconfirm" hidden>' + leaveHTML + '</div>' +
      '<div class="cl-result" id="cl-result" hidden></div>';
                                                                           
    var leaveBtns = el.querySelectorAll('#cl-leaveconfirm .kit-confirm__actions > button');
    if (leaveBtns.length === 2) { leaveBtns[0].id = 'cl-leave-cancel'; leaveBtns[1].id = 'cl-leave-confirm'; }
    return el;
  }

                                                                            
  function idleDelay(key, periodS) {
    var n = 0; String(key).split('').forEach(function (c) { n = (n * 31 + c.charCodeAt(0)) >>> 0; });
    return 'animation-delay:-' + ((n % 997) / 997 * periodS).toFixed(2) + 's';
  }
  function renderFrogRow(party, frogArtFn) {
    return (party || []).map(function (p) {
      var art = (typeof frogArtFn === 'function') ? safeFrogArt(frogArtFn, p.id) : '';
      return '<div class="cl-frog" data-id="' + p.id + '">' +
        '<div class="cl-strike"><div class="cl-hop"><div class="cl-frog-face" style="' + idleDelay(p.id, 1.1) + '">' + (art || '<div class="cl-frog-fallback">🐸</div>') + '</div></div></div></div>';
    }).join('');
  }
  function safeFrogArt(fn, id) { try { return fn(id, 120); } catch (e) { return ''; } }

  function renderFoeRow(fight) { return foeNodesHTML(battleRoster(fight), fight.currentWaveIndex()); }
                                                       
  function foeNodesHTML(roster, waveIdx, calm) {
    function pct(v) { return (v * 100).toFixed(3) + '%'; }
    return roster.groups.filter(function(e){return e.count>0;}).map(function(e){
      var path = foeArtSrc(e, calm ? 'calm' : 'idle'), fr = foeFrames(e), style = idleDelay(e.id, 1.3);
      if (fr) {
        preloadFrames(fr);
        var box = presentation().frameBox(fr);
        style += ';left:' + pct(box.left) + ';top:' + pct(box.top) + ';width:' + pct(box.width) + ';height:' + pct(box.height);
      }
      return '<div class="cl-foe' + (e.isBoss ? ' cl-foe--boss' : '') + (fr ? ' cl-foe--frames' : '') + '" data-id="' + e.id + '" data-wave="'+waveIdx+'" data-unit="'+waveIdx+':'+(roster.individual?'individual:':'cohort:')+e.id+'" data-catalog="'+e.defId+'">' +
        '<div class="cl-foe-motion">' + (path ? '<img src="'+path+'" alt="'+e.name+'" draggable="false" style="'+style+'">' : '<span class="cl-art-pending">'+e.name+' · art pending</span>') +
        '</div><span class="cl-cohort-count"'+(roster.individual?' hidden':'')+' title="'+e.name+'" aria-label="'+e.name+' ×'+e.count+'">×'+e.count+'</span></div>';
    }).join('');
  }

                                                                             
                                   
  function placeUnit(node,pos,frog,arenaTop){
    node.style.left=pos.left+'px';node.style.top=(pos.top-arenaTop)+'px';
    node.style.width=(frog?PRESENTATION_PARAMS.frogBoxPx:pos.width)+'px';
    node.style.height=(frog?PRESENTATION_PARAMS.frogBoxPx:pos.height)+'px';
    if(frog)node.style.transform='scale('+pos.width/PRESENTATION_PARAMS.frogBoxPx+')';
    node.dataset.footY=pos.footY;
                                                                           
    node.style.zIndex=node._clLunging?'90000':String(node._clPerchZ||pos.z);
  }
  function layoutBattleUnits(el) {
    var rect=el.getBoundingClientRect(),arenaTop=el.querySelector('#cl-arena').offsetTop;
    var ground=stageGround(rect);
    function place(node,pos,frog){placeUnit(node,pos,frog,arenaTop);}
    var party=el.querySelector('#cl-party'),foes=el.querySelector('#cl-foes');
                                                                         
                                                                             
    var key=[rect.width,rect.height].join('|');
    if(current.partyLayoutKey!==key){
                                                                                   
                                                                                           
      var items=current.opts.party.map(function(f){var w=battleFrogPx(f.id);return {id:String(f.id),width:w,height:w};});
      current.partyLayout=presentation().partyLayout(items,ground.party,current.layoutSeed+':party');current.partyLayoutKey=key;
    }
    current.partyLayout.units.forEach(function(pos){
      var node=Array.from(party.children).find(function(n){return n.dataset.id===pos.id;});if(node)place(node,pos,true);
    });
    var roster=battleRoster(current.fight),groups=roster.groups,layout=roster.layout;
    current.rosterPage=(current.rosterPage||0)%layout.pages;
    layout.units.forEach(function(pos){
      var group=groups.find(function(g){return g.id===pos.id;});
      var node=Array.from(foes.children).find(function(n){return n.dataset.id===String(group.id)&&!n._clDead&&!n._clIncoming;});
      if(!node||!group.count)return;
      node.hidden=pos.page!==current.rosterPage;place(node,pos,false);
      node.querySelector('.cl-cohort-count').textContent='×'+group.count;
      node.querySelector('.cl-cohort-count').setAttribute('aria-label',group.name+' ×'+group.count);
    });
    var pager=el.querySelector('#cl-roster-pages');pager.hidden=layout.pages<=1;
    pager.textContent='Enemies '+(current.rosterPage+1)+'/'+layout.pages+' · Next ›';
    pager.onclick=function(ev){ev.stopPropagation();current.rosterPage=(current.rosterPage+1)%layout.pages;layoutBattleUnits(el);};
  }

  function createPresentationClock() {
    var time = 0, timers = [];
    return {
      now: function () { return time; },
      delay: function (fn, ms) { timers.push({ at: time + ms, fn: fn }); },
      advance: function (ms) {
        time += ms;
        var due = timers.filter(function (t) { return t.at <= time; });
        timers = timers.filter(function (t) { return t.at > time; });
        due.forEach(function (t) { t.fn(); });
      }
    };
  }
  function presentationDelay(fn, ms) { current.clock.delay(fn, ms); }

  function burst(fx,x,y,size) {
    var img=document.createElement('img');img.className='cl-burst';img.src='assets/expeditions/vfx/attack_burst.png';img.alt='';
    img.style.left=x+'px';img.style.top=y+'px';img.style.width=size+'px';img.style.height=size+'px';fx.appendChild(img);
    presentationDelay(function(){img.remove();},500);
  }
                                                                           
                                                                            
                                                                           
                                   
  function damageAt(fx,dmg,x,y,kind,big) {
    var label=document.createElement('span');label.className='cl-dmg'+(kind?' cl-dmg--'+kind:'')+(big?' cl-dmg--big':'');
    label.textContent=dmg>0?fmt(dmg):'Blocked';
    current.dmgN=(current.dmgN||0)+1;
    label.style.left=x+'px';label.style.top=y+'px';label.style.marginLeft=((current.dmgN*37)%21-10)+'px';
    fx.appendChild(label);presentationDelay(function(){label.remove();},big?820:700);
    return label;
  }
                                                                                 
  function fxMap(fx) {
    var b=fx.getBoundingClientRect(),k=b.width?fx.clientWidth/b.width:1;
    return {x:function(v){return (v-b.x)*k;},y:function(v){return (v-b.y)*k;},box:function(r){return {x:(r.x-b.x)*k,y:(r.y-b.y)*k,width:r.width*k,height:r.height*k};}};
  }
                                                                                 
                                                                              
  function sparks(fx,x,y,kind,dir,count,dist) {
    var P=presentation().PARAMS,box=document.createElement('div');box.className='cl-sparks cl-sparks--'+kind;
    box.style.left=x+'px';box.style.top=y+'px';
    current.sparkN=(current.sparkN||0)+1;
    var rand=presentation().layoutRng(current.layoutSeed+':spark:'+current.sparkN);
    for(var i=0;i<count;i++){
      var s=document.createElement('i');box.appendChild(s);
      s.animate(presentation().sparkFrames(i,count,rand,dir,dist),{duration:P.sparkMs*(.75+rand()*.5),easing:'cubic-bezier(.15,.75,.35,1)',fill:'forwards'});
    }
    fx.appendChild(box);presentationDelay(function(){box.remove();},P.sparkMs*1.3);
  }
                                       
  function ring(fx,x,y,kind,size) {
    var r=document.createElement('span');r.className='cl-ring cl-ring--'+kind;
    r.style.left=x+'px';r.style.top=y+'px';r.style.width=r.style.height=size+'px';
    fx.appendChild(r);presentationDelay(function(){r.remove();},480);
  }
                                                                        
                                                                              
  function flashScreen(kind,strength) {
    var flash=current.el.querySelector('.cl-flash');
    if(!flash)return;
    flash.dataset.kind=kind;
    var peak=Math.min(1,strength),ms=kind==='hit'?380:560;
    playMotion(flash,[{opacity:0},{opacity:peak,offset:.12},{opacity:0}],ms,'_clFlash');
  }
                                                   
  function jolt(selector) {
    var bar=current.el.querySelector(selector);
    if(bar)playMotion(bar,[{translate:'0 0',filter:'brightness(2.2)'},{translate:'-4px 2px',filter:'brightness(1.6)',offset:.2},{translate:'3px -1px',offset:.45},{translate:'-1px 0',offset:.7},{translate:'0 0',filter:'brightness(1)'}],320,'_clJolt');
  }

                                                                               
                                                                              
  function reducedMotion() {
    try { return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); } catch (e) { return false; }
  }
  function shake(amount) {
    if(!current||!amount||reducedMotion())return;
    current.trauma=presentation().addTrauma(current.trauma,amount);
  }
                                                                   
  function updateShake(dtS) {
    var world=current.el.querySelector('.cl-world');
    current.trauma=presentation().decayTrauma(current.trauma,dtS);current.shakeT+=dtS;
    if(!world)return;
    if(!current.trauma){if(world.style.transform)world.style.transform='';return;}
    var o=presentation().shakeOffset(current.trauma,current.shakeT,current.el.clientWidth);
    world.style.transform='translate('+o.x+'px,'+o.y+'px) scale('+o.zoom.toFixed(4)+')';
  }
  function stillShake() { if(current){current.trauma=0;updateShake(0);} }
                                                                          
                                                                           
                                                                                  
  function hitStop() {
    if(!current||current.hitStopAnims)return;
    current.hitStopUntil=performance.now()+presentation().PARAMS.hitStopMs / (current.speed || 1);
    current.hitStopAnims=current.el.querySelector('.cl-world').getAnimations({subtree:true}).filter(function(a){return a.playState==='running';});
    current.hitStopAnims.forEach(function(a){a.pause();});
  }
  function endHitStop() {
    if(!current)return;
    if(current.hitStopAnims)current.hitStopAnims.forEach(function(a){if(a.playState==='paused')a.play();});
    current.hitStopAnims=null;current.hitStopUntil=0;
  }

                                                                   
  function tapStar(fx,x,y) {
    var star=document.createElement('span');star.className='cl-tapstar';star.style.left=x+'px';star.style.top=y+'px';
    star.innerHTML='<img src="assets/expeditions/vfx/attack_burst.png" alt="" draggable="false">';
    fx.appendChild(star);presentationDelay(function(){star.remove();},320);
  }
                                                                         
                                                 
  function spillBones(fx,box,count,seed) {
    if(fx.querySelectorAll('.cl-bone').length>=presentation().PARAMS.bonesMax)return;
    var pile=document.createElement('div');pile.className='cl-bonepile';pile._clScroll0=current.scrollPx;
    pile.style.left=(box.x+box.width/2)+'px';pile.style.top=(box.y+box.height*.5)+'px';
    var rand=presentation().layoutRng(seed),size=Math.max(12,Math.min(34,box.width*.2));
    for(var i=0;i<count;i++){
      var bone=document.createElement('img');bone.className='cl-bone';bone.src='assets/ui2/currency/bone.png';bone.alt='';bone.draggable=false;
      bone.style.width=size+'px';pile.appendChild(bone);
      bone.animate(presentation().boneFrames(rand,box.height*.5),{duration:presentation().PARAMS.boneMs,delay:i*40,fill:'both'});
    }
    fx.appendChild(pile);presentationDelay(function(){pile.remove();},presentation().PARAMS.boneMs+count*40);
  }
  function syncGroundFx(fx) {
    fx.querySelectorAll('.cl-bonepile').forEach(function(pile){pile.style.translate=(pile._clScroll0-current.scrollPx)+'px 0';});
  }
  function presentTap(res) {
    var fx=current.el.querySelector('#cl-fx'),m=fxMap(fx);
    var target=unitNode('enemy',res.targetId),art=target&&target.querySelector('.cl-foe-motion img');
    if(!art || target.hidden)return;
    var r=art.getBoundingClientRect(),cx=m.x(r.x+r.width/2),cy=m.y(r.y+r.height/2),P=presentation().PARAMS;
    if(res.targetDied)current.tapKills[String(res.targetId)]=true;
    burst(fx,cx,cy,90);
                                                                                                     
    hurtFoe(target,'tap',res.targetDied);
    sparks(fx,cx,cy,'tap',0,res.targetDied?9:5,res.targetDied?70:46);
    if(res.targetDied){ring(fx,cx,cy,'kill',Math.max(90,r.width*1.1));shake(P.traumaFoeKill);}
    var label=damageAt(fx,res.dmg,0,0,'tap');
    label.dataset.targetId=String(res.targetId);
    label.dataset.wave=String(current.fight.currentWaveIndex());
    followTapNumbers();
  }

  function followTapNumbers() {
    var fx=current.el.querySelector('#cl-fx'),bounds=fx.getBoundingClientRect();
    fx.querySelectorAll('.cl-dmg--tap').forEach(function(label){
      var target=label.dataset.wave===String(current.fight.currentWaveIndex()) && unitNode('enemy',label.dataset.targetId);
      var art=target && !target.hidden && target.querySelector('.cl-foe-motion img');
      if(!art){label.remove();return;}
                                                                            
                                                                             
      var r=art.getBoundingClientRect();
      label.style.left=((r.x+r.width/2-bounds.x)*fx.clientWidth/bounds.width)+'px';
      label.style.top=((r.y+r.height/2-bounds.y)*fx.clientHeight/bounds.height)+'px';
    });
  }

                                                                              
                                                                            
                                                                            
                                                                        
                                                                             
                                                                         
  function clearTotalS() { return PRESENTATION_PARAMS.beforeClearS + PRESENTATION_PARAMS.clearBannerS + PRESENTATION_PARAMS.afterClearS; }
                                                                           
                                                                        
  function setScroll(px) {
    var el = current.el, k = presentation().PARAMS.parallax;
    current.scrollPx = px;
    ['far', 'mid', 'floor', 'fore'].forEach(function (layer) {
      var node = el.querySelector('.cl-' + layer);
      if (node) node.style.backgroundPositionX = 'calc(var(--cl-x, 0px) - ' + (px * k[layer]).toFixed(1) + 'px)';
    });
  }
                                                                         
                                                                               
  function buildIncoming(el, waveIdx) {
    var wave = current.opts.waves[waveIdx], foes = el.querySelector('#cl-foes');
    if (!wave || !foes) return;
    var enemies = buildEnemiesForWave(wave, current.enemyDb, current.bossDb, function () { return 0.5; });
    var rect = el.getBoundingClientRect(), arenaTop = el.querySelector('#cl-arena').offsetTop;
    var roster = presentation().organicRoster(enemies, foeRegion(el, rect, waveIdx), current.layoutSeed + ':' + waveIdx);
    roster.groups.forEach(function (g) { g.count = g.members.length; });
    var template = document.createElement('div'); template.innerHTML = foeNodesHTML(roster, waveIdx, true);
    Array.from(template.children).forEach(function (node) {
      var pos = roster.layout.units.find(function (u) { return String(u.id) === node.dataset.id; });
      if (!pos) return;
      node._clIncoming = true; node.hidden = pos.page !== 0;
      placeUnit(node, pos, false, arenaTop);
      foes.appendChild(node);
    });
  }
  function incomingNodes(el) { return Array.from(el.querySelectorAll('.cl-foe')).filter(function (n) { return n._clIncoming; }); }
                                                                                            
                                                                                               
                                                                                                
  function noticeParty(n) {
    var fr = foeFrames({ defId: n.dataset.catalog }), img = fr && n.querySelector('.cl-foe-motion img');
    if (!img) return;
    img.src = frameSrc(fr, fr.notice ? fr.notice[0] : fr.stance);
    if (fr.notice) presentationDelay(function () { if (img.isConnected && !n._clLunging && !n._clDead) img.src = frameSrc(fr, fr.stance); }, fr.notice[1]);
    var hop = fr.lash ? 0 : -16;
    playMotion(n.querySelector('.cl-foe-motion'), [{ transform: 'translateY(0) scale(1,1)' }, { transform: 'translateY(' + hop + 'px) scale(.94,1.07)', offset: .35 },
      { transform: 'translateY(0) scale(1.06,.94)', offset: .7 }, { transform: 'translateY(0) scale(1,1)' }], 340, '_clAttack');
  }
  function endTravel(el) {
    var t = current.travel; current.travel = null;
    setScroll(t.base + t.dist);
    el.classList.remove('cl-traveling');
                                                                          
                                                                           
    var tpl = document.createElement('div'); tpl.innerHTML = renderFoeRow(current.fight);
    var units = Array.from(tpl.children).map(function (n) { return n.dataset.unit; });
    incomingNodes(el).forEach(function (n) {
      n._clIncoming = false; n.style.translate = '';
      if (units.indexOf(n.dataset.unit) < 0 || Array.from(el.querySelectorAll('.cl-foe')).some(function (o) { return o !== n && o.dataset.unit === n.dataset.unit && !o._clDead; })) n.remove();
      else noticeParty(n);
    });
    el.querySelectorAll('.cl-frog .cl-hop').forEach(function (hop) { hop.style.translate = hop.style.scale = hop.style.rotate = ''; });
    el.querySelectorAll('.cl-frog').forEach(endMarch);
                                                                                                   
    bloomParts(el).concat(rockNodes(el), meadowNodes(el), crackNodes(el)).forEach(function (n) {
      if (n._clLeaving) n.remove();
      else if (n._clIncoming) { n._clIncoming = false; n.style.translate = ''; }
    });
  }
  function presentTravel(el) {
    var fight = current.fight, P = presentation().PARAMS, t = fight.clearElapsed();
    var marching = t !== null && t >= P.travelStartS && fight.currentWaveIndex() < fight.waveCount - 1 && !fight.isDone();
    if (!marching) {
      if (current.travel && t === null) endTravel(el);
      syncGroundFx(el.querySelector('#cl-fx'));
      return;
    }
    if (!current.travel) {
      current.travel = { base: current.scrollPx, dist: el.clientWidth * P.travelScreens, durS: clearTotalS() - P.travelStartS };
      el.classList.add('cl-traveling');
                                                                            
                                                              
      bloomParts(el).forEach(function (n) { n._clLeaving = true; n._clScroll0 = current.scrollPx; });
      var next = current.opts.waves[fight.currentWaveIndex() + 1];
      if (next && next.harvest) (next.harvest.web ? buildWeb : buildBloom)(el, next.harvest, true);
      else buildIncoming(el, fight.currentWaveIndex() + 1);
                                                                                                        
                                                               
      rockNodes(el).forEach(function (n) {
        if (n._clBurst) return;
        if (n._clSmashing) burstRuin(n);
        else { n._clLeaving = true; n._clScroll0 = current.scrollPx; }
      });
      if (next && next.rocks) buildRocks(el, fight.currentWaveIndex() + 1, true);
                                                                                         
      meadowNodes(el).forEach(function (n) { n._clLeaving = true; n._clScroll0 = current.scrollPx; });
      buildMeadow(el, fight.currentWaveIndex() + 1, true);
                                                                     
      crackNodes(el).forEach(function (n) { n._clLeaving = true; n._clScroll0 = current.scrollPx; });
      if (current.crackHost && current.crackHost.wave === fight.currentWaveIndex() + 1) buildCrackBed(el, current.crackHost.wave, true);
    }
    var tr = current.travel, s = t - P.travelStartS, e = presentation().travelEase(s / tr.durS);
    setScroll(tr.base + tr.dist * e);
    incomingNodes(el).forEach(function (n) { n.style.translate = (tr.dist * (1 - e)).toFixed(1) + 'px 0'; });
    rockNodes(el).concat(meadowNodes(el), crackNodes(el)).forEach(function (n) {
      if (n._clIncoming) n.style.translate = (tr.dist * (1 - e)).toFixed(1) + 'px 0';
      else if (n._clLeaving) n.style.translate = (n._clScroll0 - current.scrollPx).toFixed(1) + 'px 0';
    });
    bloomParts(el).forEach(function (n) {
      if (n._clIncoming) n.style.translate = (tr.dist * (1 - e)).toFixed(1) + 'px 0';
      else if (n._clLeaving) n.style.translate = (n._clScroll0 - current.scrollPx).toFixed(1) + 'px 0';
    });
                                                                                                   
                                           
    Array.from(el.querySelectorAll('.cl-frog')).forEach(function (node, i) {
      var hop = node.querySelector('.cl-hop'), lag = (i % 3) * 0.07, gait = gaitOf(node);
      if (!hop || node.hidden) return;
      if (gait !== 'hop') { marchGait(node, gait, s - lag, tr.durS - lag); return; }
      var pose = presentation().hopPose(s - lag, tr.durS - lag);
      hop.style.translate = '0 ' + (-pose.y) + 'px';
      hop.style.scale = pose.sx + ' ' + pose.sy;
      hop.style.rotate = pose.rot + 'deg';
    });
    syncGroundFx(el.querySelector('#cl-fx'));
  }

                                                                                
                                                                              
                                                                               
                                                                               
                                                                                
                                                                                
                                                                       
                                                                              
                              
  var HARVEST_ART = { lily: 'assets/expeditions/harvest/giant-pink-lily.webp' };
  var HARVEST_TIP_TEXT = 'TAP THE FLOWER · HARVEST SEEDS';
  var SEED_ART = 'assets/ui2/currency/seed.png';
  function harvestInfo(flower) {
    var F = typeof Flowers !== 'undefined' ? Flowers : null, n = F && F.flowerDisplayName ? F.flowerDisplayName(flower) : String(flower);
    return { flower: flower, name: 'Giant ' + n, art: HARVEST_ART[flower] || '' };
  }
                                                                                           
  function harvestReward(tableId) {
    var R = typeof Rewards !== 'undefined' ? Rewards : null, rows = [];
    try { rows = tableId && R && R.previewTable ? R.previewTable(tableId).filter(function (r) { return r.itemId !== 'none'; }) : []; } catch (e) { rows = []; }
    var row = rows[0];
    if (!row || Number(row.maxQty) === 0) return null;
    return { itemId: row.itemId, img: row.img || SEED_ART, name: row.displayName, qty: row.minQty === row.maxQty ? String(row.maxQty) : row.minQty + '–' + row.maxQty,
      tokens: Math.max(1, Math.min(presentation().PARAMS.harvest.tokensMax, Number(row.maxQty) || 1)) };
  }
  function bloomNode(el) { return el.querySelector('.cl-bloom'); }
                                                                                                  
  function bloomParts(el) { return Array.from(el.querySelectorAll('.cl-bloom,.cl-bloom-ui,.cl-web,.cl-web-ui')); }
  function placeBloom(el, parts) {
    var rect = el.getBoundingClientRect(), arenaTop = el.querySelector('#cl-arena').offsetTop;
    var st = el.dataset.stage, flower = presentation().harvestBox(rect.width, rect.height, GROUND_BAND_BY_STAGE[st], SCENE_SCALE_BY_STAGE[st]);
    var web = presentation().webBox(rect.width, rect.height);
    parts.forEach(function (n) {
      var box = /cl-web/.test(n.className) ? web : flower;
      n.style.left = box.left + 'px'; n.style.top = (box.top - arenaTop) + 'px';
      n.style.width = box.width + 'px'; n.style.height = box.height + 'px';
                                                                                              
                                                                                                
      if (n.classList.contains('cl-web')) n.style.zIndex = String(presentation().depth(web.footY));
    });
    current.bloomKey = rect.width + '|' + rect.height;
  }
                                                                         
  function buildBloom(el, h, incoming) {
    bloomParts(el).forEach(function (n) { n.remove(); });
    var arena = el.querySelector('#cl-arena'), info = harvestInfo(h.flower);
    var hand = typeof Assets !== 'undefined' ? Assets.ui('pointClicker01') : '';
    var node = document.createElement('div'), ui = document.createElement('div');
    node.className = 'cl-bloom'; node.dataset.flower = h.flower;
    node.innerHTML = '<div class="cl-bloom-rays" aria-hidden="true"></div><div class="cl-bloom-shadow" aria-hidden="true"></div>'
      + '<div class="cl-bloom-body"><img class="cl-bloom-art" src="' + escHTML(info.art) + '" alt="' + escHTML(info.name) + '" draggable="false"></div>';
    ui.className = 'cl-bloom-ui';
    ui.innerHTML = '<div class="cl-bloom-guide" hidden><span class="cl-bloom-guide__bubble">' + escHTML(text("text_combat_flower_guide", "Tap the flower!")) + '</span>'
      + (hand ? '<img class="cl-bloom-guide__hand" src="' + hand + '" alt="" draggable="false">' : '') + '</div>';
    arena.appendChild(node); arena.appendChild(ui);
    placeBloom(el, [node, ui]);
    [node, ui].forEach(function (n) { n._clIncoming = !!incoming; });
    return node;
  }
                                                                        
  function bloomPoint(node, at) {
    var fx = current.el.querySelector('#cl-fx'), m = fxMap(fx), b = node.getBoundingClientRect();
    return { fx: fx, x: m.x(b.x + b.width * at[0]), y: m.y(b.y + b.height * at[1]), w: b.width * (fx.clientWidth / (fx.getBoundingClientRect().width || 1)), h: b.height * (fx.clientWidth / (fx.getBoundingClientRect().width || 1)) };
  }
  function bloomBody() { var n = bloomNode(current.el); return n && n.querySelector('.cl-bloom-body'); }
                                                                              
  function bloomSquash(a) {
    playMotion(bloomBody(), [{ scale: '1 1', filter: 'brightness(1)' }, { scale: r3(1 + .1 * a) + ' ' + r3(1 - .15 * a), filter: 'brightness(' + r3(1 + .45 * a) + ')', offset: .22 },
      { scale: r3(1 - .045 * a) + ' ' + r3(1 + .07 * a), offset: .55 }, { scale: r3(1 + .015 * a) + ' ' + r3(1 - .02 * a), offset: .8 }, { scale: '1 1', filter: 'brightness(1)' }],
      presentation().PARAMS.harvest.squashMs, '_clSquash');
  }
  function r3(n) { return Math.round(n * 1000) / 1000; }
                                                                             
  function petals(fx, x, y, n, dist) {
    var P = presentation().PARAMS.harvest, box = document.createElement('div');
    box.className = 'cl-petals'; box.style.left = x + 'px'; box.style.top = y + 'px';
    current.petalN = (current.petalN || 0) + 1;
    var rand = presentation().layoutRng(current.layoutSeed + ':petal:' + current.petalN);
    for (var i = 0; i < n; i++) {
      var p = document.createElement('i'); if (rand() < .3) p.className = 'cl-petal--light';
      box.appendChild(p);
      p.animate(presentation().petalFrames(rand, dist), { duration: P.petalMs * (.75 + rand() * .5), delay: i * 8, easing: 'cubic-bezier(.2,.6,.4,1)', fill: 'both' });
    }
    fx.appendChild(box); presentationDelay(function () { box.remove(); }, P.petalMs * 1.3 + n * 8);
  }
                                                                              
  function seedPop(fx, x, y, groundDy) {
    var pile = document.createElement('div'); pile.className = 'cl-bonepile cl-seedpile'; pile._clScroll0 = current.scrollPx;
    pile.style.left = x + 'px'; pile.style.top = y + 'px';
    current.seedN = (current.seedN || 0) + 1;
    var rand = presentation().layoutRng(current.layoutSeed + ':seed:' + current.seedN);
    var seed = document.createElement('img'); seed.className = 'cl-bone cl-seed'; seed.src = SEED_ART; seed.alt = ''; seed.draggable = false;
    pile.appendChild(seed);
    seed.animate(presentation().boneFrames(rand, groundDy), { duration: presentation().PARAMS.boneMs, fill: 'both' });
    fx.appendChild(pile); presentationDelay(function () { pile.remove(); }, presentation().PARAMS.boneMs);
  }
                                                              
  function boing(p, delay, px) {
    var runtime = current;
    presentationDelay(function () {
      if (current !== runtime) return;
      playMotion(p.node.querySelector('.cl-frog-face'), [{ translate: '0px 0px' }, { translate: '0px ' + (-px) + 'px', offset: .38 }, { translate: '0px 0px', offset: .76 }, { translate: '0px 0px' }], 320, '_clBoing');
    }, delay);
  }
  function exclaim(fx, node) {
    var r = node.getBoundingClientRect(), m = fxMap(fx), mark = document.createElement('span');
    if (!r.width) return;
    mark.className = 'cl-exclaim'; mark.textContent = '!';
    mark.style.left = m.x(r.x + r.width * .5) + 'px'; mark.style.top = m.y(r.y + r.height * .2) + 'px';
    fx.appendChild(mark); presentationDelay(function () { mark.remove(); }, 900);
  }
  function showBloomGuide(on) {
    var g = current && current.el.querySelector('.cl-bloom-guide');
    if (g && g.hidden === !!on) g.hidden = !on;
  }

                                                                                 
  function startHarvest(el, hv) {
    var P = presentation().PARAMS.harvest, runtime = current, fight = current.fight;
    current.bloomWave = fight.currentWaveIndex();
    var node = bloomNode(el), popIn = !node || node._clLeaving;
    if (popIn) node = buildBloom(el, hv, false);
    current.bloom = { perched: [], frogTurn: 0, third: 0, tapped: false, info: harvestInfo(hv.flower), reward: harvestReward(hv.reward), got: 0 };
    current.plateKey = null;
    var fx = el.querySelector('#cl-fx'), c = bloomPoint(node, P.center);
    playMotion(node.querySelector('.cl-bloom-body'), popIn
      ? [{ scale: '.2 .05', opacity: 0 }, { scale: '1.15 .82', opacity: 1, offset: .35 }, { scale: '.92 1.12', offset: .6 }, { scale: '1.04 .97', offset: .8 }, { scale: '1 1' }]
      : [{ scale: '1 1' }, { scale: '1.12 .84', offset: .2 }, { scale: '.93 1.12', offset: .45 }, { scale: '1.03 .97', offset: .72 }, { scale: '1 1' }], P.discoverMs + 120, '_clSquash');
    ring(fx, c.x, c.y, 'bloom', c.w * .8);
    sparks(fx, c.x, c.y, 'pollen', 0, 12, c.w * .45);
    var frogs = Array.from(el.querySelectorAll('.cl-frog')).filter(function (n) { return !n.hidden && !n._clGone && !n._clDying; });
    frogs.forEach(function (n, i) {
      presentationDelay(function () { if (current === runtime) exclaim(fx, n); }, 80 + i * 40);
      presentationDelay(function () { if (current === runtime && current.bloom) perchFrog(n, i); }, P.discoverMs + i * P.perchGapMs);
    });
    presentationDelay(function () {
      if (current === runtime && current.bloom && !current.bloom.tapped && fight.harvest() && !fight.harvest().done) showBloomGuide(true);
    }, P.discoverMs + frogs.length * P.perchGapMs + P.perchMs * .5);
  }
                                                                              
                                                                                
  function perchFrog(n, i) {
    var node = bloomNode(current.el), strike = n.querySelector('.cl-strike'), hop = n.querySelector('.cl-hop');
    if (!node || !strike || !hop || n.hidden || n._clGone || n._clDying) return;
    var P = presentation().PARAMS.harvest, seat = presentation().harvestSeat(i), runtime = current;
    var r = n.getBoundingClientRect(), b = node.getBoundingClientRect(), s = r.width / (n.offsetWidth || r.width);
    if (!r.width || !b.width) return;
    rouse(n);                                                             
    var dx = (b.x + seat[0] * b.width - (r.x + r.width / 2)) / s, dy = (b.y + seat[1] * b.height - (r.y + r.height * P.feetFy)) / s;
    n._clPerchZ = 9000 + Math.round(seat[1] * 100) * 10 + i;
    n.style.zIndex = String(n._clPerchZ);
    if (strike._clPerch) strike._clPerch.cancel();
    strike._clPerch = strike.animate(presentation().perchFrames(dx, dy, s), { duration: P.perchMs, easing: 'linear', fill: 'forwards' });
    if (i % 2 && !reducedMotion()) flip(hop, -1, .2, .78, P.perchMs);
    var p = { node: n, dx: dx, dy: dy, s: s, seat: seat, i: i };
    current.bloom.perched.push(p);
    presentationDelay(function () {
      if (current !== runtime || !current.bloom) return;
      bloomSquash(.4);
      var fx = current.el.querySelector('#cl-fx'), at = bloomPoint(node, seat);
      sparks(fx, at.x, at.y, 'pollen', 0, 5, 34);
      petals(fx, at.x, at.y, 1, 40);
      if (!current.fight.harvest() || !current.fight.harvest().done) {
        if (hop._clBounce) hop._clBounce.cancel();
        hop._clBounce = hop.animate(presentation().perchBounceFrames(), { duration: P.bounceMs + (i % 3) * 70, delay: -((i * 137) % P.bounceMs), iterations: Infinity });
      }
    }, P.perchMs * .86);
  }
  function flip(hop, dir, from, to, ms) {
    if (hop._clFlip) hop._clFlip.cancel();
    hop.style.transformOrigin = '50% 55%';
    var a = hop._clFlip = hop.animate(presentation().flipFrames(dir, from, to), { duration: ms, easing: 'linear' });
    a.onfinish = a.oncancel = function () { if (hop._clFlip === a) { hop._clFlip = null; hop.style.transformOrigin = ''; } };
  }
                                                                                  
  var RIPE_WORDS = ['', 'Juicy!', 'Almost!'];
  function harvestMilestone(progress, taps) {
    var hb = current.bloom, node = bloomNode(current.el);
    if (!hb || !node) return;
    var third = Math.floor(progress * 3 / taps);
    if (third <= hb.third || progress >= taps) return;
    hb.third = third;
    var P = presentation().PARAMS.harvest, c = bloomPoint(node, P.center);
    ring(c.fx, c.x, c.y, 'bloom', c.w * .95);
    petals(c.fx, c.x, c.y, P.petalsMilestone, c.w * .5);
    sparks(c.fx, c.x, c.y, 'pollen', 0, 12, c.w * .42);
    if (RIPE_WORDS[third]) abilityLabel(c.fx, RIPE_WORDS[third], c.x, c.y - c.h * .42, 'harvest');
    shake(.34);
    plateBump();
  }
  function plateBump() {
    var plate = current.el.querySelector('.cl-plate--harvest');
    if (plate) playMotion(plate, [{ scale: '1 1' }, { scale: '1.06 1.1', offset: .3 }, { scale: '.98 .97', offset: .65 }, { scale: '1 1' }], 260, '_clBump');
  }
                                                                       
  function presentHarvestTap(res, ev) {
    var hb = current.bloom, node = bloomNode(current.el);
    if (!hb || !node) return;
    var P = presentation().PARAMS.harvest, fx = current.el.querySelector('#cl-fx'), m = fxMap(fx), c = bloomPoint(node, P.center);
    hb.tapped = true; showBloomGuide(false);
    tapStar(fx, m.x(ev.clientX), m.y(ev.clientY));
    bloomSquash(1);
    sparks(fx, c.x, c.y, 'pollen', 0, 8, c.w * .3);
    petals(fx, c.x, c.y, P.petalsTap, c.w * .34);
    seedPop(fx, c.x, c.y, c.h * .5);
    hb.perched.forEach(function (p, k) { boing(p, k * 22, 12 + (k % 3) * 4); });
    shake(.16);
    if (!res.complete) harvestMilestone(res.progress, res.taps);
    plateBump();
  }
                                                                                                          
  function presentFrogHarvest(event) {
    var hb = current.bloom, node = bloomNode(current.el);
    if (!hb || !node) return;
    var P = presentation().PARAMS.harvest, runtime = current, p = hb.perched.length ? hb.perched[hb.frogTurn++ % hb.perched.length] : null;
    if (p) playMotion(p.node.querySelector('.cl-frog-face'), [{ translate: '0px 0px', scale: '1 1' }, { translate: '0px 0px', scale: '1.18 .8', offset: .12 },
      { translate: '0px ' + (-P.stompPx) + 'px', scale: '.9 1.14', offset: .46 }, { translate: '0px 0px', scale: '1.24 .76', offset: .78 }, { translate: '0px 0px', scale: '1 1' }], P.stompMs, '_clBoing');
    presentationDelay(function () {
      if (current !== runtime || !current.bloom || !bloomNode(current.el)) return;
      bloomSquash(.55);
      var at = bloomPoint(node, p ? p.seat : P.center), c = bloomPoint(node, P.center);
      sparks(at.fx, at.x, at.y, 'pollen', 0, 6, 40);
      seedPop(at.fx, c.x, c.y, c.h * .5);
      if (!event.complete) harvestMilestone(event.progress, event.taps);
      plateBump();
    }, p ? P.stompMs * .78 : 0);
  }
                                                                                  
                                                                                  
                                                                        
  function presentHarvestBurst() {
    var hb = current.bloom, el = current.el, node = bloomNode(el);
    if (!hb || !node || hb.burst) return;
    hb.burst = true;
    var P = presentation().PARAMS.harvest, runtime = current, c = bloomPoint(node, P.center);
    showBloomGuide(false);
    hitStop();
    flashScreen('harvest', .9);
    playMotion(node.querySelector('.cl-bloom-body'), [{ scale: '1 1', filter: 'brightness(1)' }, { scale: '1.32 .68', filter: 'brightness(1.9)', offset: .15 },
      { scale: '.84 1.27', filter: 'brightness(1.4)', offset: .38 }, { scale: '1.1 .92', offset: .6 }, { scale: '.97 1.04', offset: .8 }, { scale: '1 1', filter: 'brightness(1)' }], 860, '_clSquash');
    node.classList.add('is-burst');
    ring(c.fx, c.x, c.y, 'bloom', c.w * 1.15);
    presentationDelay(function () { if (current === runtime) ring(c.fx, c.x, c.y, 'kill', c.w * 1.6); }, 120);
    petals(c.fx, c.x, c.y, P.petalsBurst, c.w * .75);
    sparks(c.fx, c.x, c.y, 'pollen', 0, 22, c.w * .6);
    sparks(c.fx, c.x, c.y, 'kill', 0, 10, c.w * .45);
    shake(.85);
    var word = document.createElement('span');
    word.className = 'cl-harvest-word'; word.textContent = 'Harvested!';
    word.style.left = c.x + 'px'; word.style.top = (c.y - c.h * .52) + 'px';
    c.fx.appendChild(word); presentationDelay(function () { word.remove(); }, 1500);
    var rew = hb.reward;
    if (rew) {
      var chip = el.querySelector('.cl-plate--harvest .cl-plate__seeds'), cr = chip && chip.getBoundingClientRect(), m = fxMap(c.fx);
      var tx = cr && cr.width ? m.x(cr.x + cr.width * .3) - c.x : 0, ty = cr && cr.width ? m.y(cr.y + cr.height * .5) - c.y : -c.h;
      for (var k = 0; k < rew.tokens; k++) (function (k) {
        var tok = document.createElement('img'); tok.className = 'cl-seedtoken'; tok.src = rew.img; tok.alt = ''; tok.draggable = false;
        tok.style.left = c.x + 'px'; tok.style.top = c.y + 'px';
        var ax = (k - (rew.tokens - 1) / 2) * c.w * .26, ay = -c.h * (.62 + (k % 2) * .1), delay = 140 + k * P.seedGapMs;
        tok.animate(presentation().seedTokenFrames(ax, ay, tx, ty), { duration: P.seedFlyMs, delay: delay, easing: 'linear', fill: 'both' });
        c.fx.appendChild(tok);
        presentationDelay(function () { if (current === runtime) seedArrived(k, rew); }, delay + P.seedFlyMs);
        presentationDelay(function () { tok.remove(); }, delay + P.seedFlyMs + 60);
      })(k);
    }
    presentationDelay(function () { if (current === runtime) flingFrogs(); }, P.flingAtMs);
    presentationDelay(function () { if (current === runtime && node.isConnected) node.classList.add('is-spent'); }, 1150);
  }
  function seedArrived(k, rew) {
    var hb = current.bloom, chip = current.el.querySelector('.cl-plate--harvest .cl-plate__seeds');
    if (!hb || !chip) return;
    hb.got = k + 1;
    chip.classList.add('is-got');
    var label = chip.querySelector('b'); if (label) label.textContent = '×' + (hb.got >= rew.tokens ? rew.qty : hb.got);
    playMotion(chip, [{ scale: '1 1' }, { scale: '1.45 1.45', offset: .3 }, { scale: '.9 .9', offset: .65 }, { scale: '1 1' }], 300, '_clBump');
    var fx = current.el.querySelector('#cl-fx'), m = fxMap(fx), r = chip.getBoundingClientRect();
    sparks(fx, m.x(r.x + r.width * .3), m.y(r.y + r.height * .5), 'pollen', 0, 7, 30);
  }
  function flingFrogs() {
    var hb = current.bloom, P = presentation().PARAMS.harvest, runtime = current;
    if (!hb) return;
    hb.perched.forEach(function (p, k) {
      presentationDelay(function () {
        if (current !== runtime) return;
        var strike = p.node.querySelector('.cl-strike'), hop = p.node.querySelector('.cl-hop');
        if (!strike) return;
        if (hop && hop._clBounce) { hop._clBounce.cancel(); hop._clBounce = null; }
        var a = strike.animate(presentation().flingFrames(p.dx, p.dy, p.s), { duration: P.flingMs, easing: 'linear', fill: 'forwards' });
        if (strike._clPerch) strike._clPerch.cancel();
        strike._clPerch = a;
        if (hop && !reducedMotion()) flip(hop, k % 2 ? 1 : -1, .08, .82, P.flingMs);
        presentationDelay(function () {
          if (strike._clPerch === a) { a.cancel(); strike._clPerch = null; }
          p.node._clPerchZ = null;
        }, P.flingMs + 20);
      }, k * 55);
    });
    hb.perched = [];
  }
                                                                                    
  function presentHarvest(el) {
    var fight = current.fight, hv = fight.harvest();
    var flag = hv ? (hv.done ? 'done' : 'on') : '', webFlag = hv && hv.web ? flag : '';
    if ((el.dataset.harvest || '') !== flag) { if (flag) el.dataset.harvest = flag; else delete el.dataset.harvest; }
    if ((el.dataset.rescue || '') !== webFlag) { if (webFlag) el.dataset.rescue = webFlag; else delete el.dataset.rescue; }
    if (hv && hv.web) presentRescue(el, hv);
    else if (hv && current.bloomWave !== fight.currentWaveIndex()) startHarvest(el, hv);
    if (!hv && (current.bloom || current.web) && !current.travel) { current.bloom = null; current.web = null; }
    var parts = bloomParts(el);
    if (!parts.length) return;
    var rect = el.getBoundingClientRect();
    if (current.bloomKey !== rect.width + '|' + rect.height) placeBloom(el, parts);
    var bn = hv && !hv.web && bloomNode(el);
    if (bn) bn.style.setProperty('--cl-ripe', (hv.progress / hv.taps).toFixed(3));
  }
  function harvestPlateHTML(hv) {
    var hb = current.bloom, info = (hb && hb.info) || harvestInfo(hv.flower), rew = hb && hb.reward;
    return '<div class="cl-plate cl-plate--harvest" data-key="harvest">'
      + '<span class="cl-plate__art">' + (info.art ? '<img src="' + escHTML(info.art) + '" alt="" draggable="false">' : '') + '</span>'
      + '<span class="cl-plate__info"><span class="cl-plate__name">' + escHTML(info.name) + '</span><span class="cl-plate__bar"><i></i></span></span>'
      + (rew ? '<span class="cl-plate__seeds' + (hb.got ? ' is-got' : '') + '"><img src="' + escHTML(rew.img) + '" alt="" draggable="false"><b>×' + escHTML(hb.got ? (hb.got >= rew.tokens ? rew.qty : hb.got) : rew.qty) + '</b></span>' : '')
      + '</div>';
  }

                                                                                
                                                                                                       
                                                                                                        
                                                                                           
                                                                                                         
                                                                                                      
                                                                                                         
                                                                                                       
                                                                                                        
                                                                                                          
                                                                                                        
                                                                                          
  var STONE_ART = 'assets/ui2/currency/rock.png';
                                                                                                        
                                                                                                  
                                                                                                      
                                                       
  var ROCK_SET_BY_STAGE = { 'reedmarsh-1': 'meadow', 'autumngrove': 'autumn', 'autumngrove-blight': 'autumn' };
  function rockArtSrc(i) { return 'assets/expeditions/rocks/' + presentation().rockSet(current.rockSet).file + (i < 9 ? '0' : '') + (i + 1) + '.webp'; }
  function rockNodes(el) { return Array.from(el.querySelectorAll('.cl-rock')); }
  function standingRuins(el) { return rockNodes(el).filter(function (n) { return !n._clBurst && !n._clSmashing && !n._clIncoming && !n._clLeaving; }); }
                                                                               
                                                                             
                                                                             
                                       
  function rockPay(tableId) {
    var R = typeof Rewards !== 'undefined' ? Rewards : null, row = null;
    try { row = R && R.previewTable ? R.previewTable(tableId).filter(function (r) { return r.itemId !== 'none'; })[0] : null; } catch (e) { row = null; }
    if (!row) return { img: STONE_ART, qty: 0 };
    return { img: row.img || STONE_ART, qty: Math.round((Number(row.minQty) + Number(row.maxQty)) / 2) };
  }
  function placeRock(n, pos, arenaTop) {
    n.style.left = pos.left.toFixed(1) + 'px'; n.style.top = (pos.top - arenaTop).toFixed(1) + 'px';
    n.style.width = pos.width.toFixed(1) + 'px'; n.style.height = pos.height.toFixed(1) + 'px';
    n.style.zIndex = String(pos.z);
  }
  function rockLayoutFor(el, waveIdx) {
    var wave = current.opts.waves[waveIdx], rect = el.getBoundingClientRect();
    var giant = !!(wave && (wave.bosses || []).some(function (b) { return presentation().tier(b.id, true) === 'giant'; }));
                                                                                                              
    var clear = 0;
    ['.cl-payout', '.cl-tapnote'].forEach(function (sel) {
      var n = el.querySelector(sel), b = n && !n.hidden && n.getBoundingClientRect();
      if (b && b.height) clear = Math.max(clear, rect.bottom - b.top + presentation().PARAMS.rocks.stripGapPx);
    });
    return wave && wave.rocks ? presentation().rockLayout(rect.width, rect.height, wave.rocks.count, current.layoutSeed + ':rocks:' + waveIdx, { giant: giant, set: current.rockSet, bottomClear: clear }) : [];
  }
                                                                                           
  function buildRocks(el, waveIdx, incoming, upTo) {
    var arena = el.querySelector('#cl-arena'), arenaTop = arena.offsetTop;
    rockLayoutFor(el, waveIdx).forEach(function (pos, i) {
      if (upTo != null && i >= upTo) return;
      var id = waveIdx + ':' + i, n = document.createElement('div'), src = rockArtSrc(pos.art);
      var cracks = presentation().rockCracks(presentation().layoutRng(current.layoutSeed + ':crack:' + id));
      n.className = 'cl-rock' + (pos.front ? ' cl-rock--front' : '');
      n.dataset.rock = id; n.dataset.crack = '0'; n._clWave = waveIdx; n._clIncoming = !!incoming; n._clHits = 0;
      n.innerHTML = '<div class="cl-rock-shadow" aria-hidden="true"></div><div class="cl-rock-body"><img src="' + src + '" alt="Stone ruin" draggable="false">'
        + '<svg class="cl-rock-cracks" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" style="-webkit-mask-image:url(' + src + ');mask-image:url(' + src + ')">'
        + cracks.map(function (d, k) { return '<path class="k' + (k + 1) + '" d="' + d + '"/>'; }).join('') + '</svg></div>'
        + '<i class="cl-rock-glint" aria-hidden="true" style="' + idleDelay(id, 3.4) + '"></i>';
      placeRock(n, pos, arenaTop);
      arena.appendChild(n);
    });
  }
  function rockPoint(n, fy) {
    var fx = current.el.querySelector('#cl-fx'), m = fxMap(fx), img = n.querySelector('.cl-rock-body img'), b = (img || n).getBoundingClientRect();
    return { fx: fx, m: m, x: m.x(b.x + b.width / 2), y: m.y(b.y + b.height * (fy == null ? .5 : fy)), w: b.width * (fx.clientWidth / (fx.getBoundingClientRect().width || 1)), h: b.height * (fx.clientWidth / (fx.getBoundingClientRect().width || 1)) };
  }
                                                                                                    
                                                        
  function ruinFor(x, y, burst) {
    var best = null, bestKey = Infinity;
    standingRuins(current.el).forEach(function (n) {
      var b = n.querySelector('.cl-rock-body img').getBoundingClientRect();
      var d = x == null ? 0 : Math.hypot(b.x + b.width / 2 - x, b.y + b.height * .6 - y), key = (burst || x == null ? -(n._clHits || 0) * 1e5 : 0) + d;
      if (key < bestKey) { bestKey = key; best = n; }
    });
    return best;
  }
                                                                                            
  function presentRuinChip(event, x, y) {
    var n = ruinFor(x, y, event.burst);
    if (!n) return;
    var P = presentation().PARAMS.rocks, c = rockPoint(n, .45);
                                                             
    if (x != null) {
      var m = fxMap(c.fx), ix = m.x(x), iy = m.y(y);
      sparks(c.fx, ix, iy, 'stone', c.x >= ix ? 1 : -1, 4, Math.min(120, Math.max(40, Math.abs(c.x - ix) * .7)));
    }
    if (event.burst) { burstRuin(n); return; }
    n._clHits = (n._clHits || 0) + 1;
    n.dataset.crack = String(presentation().crackLevel(n._clHits, current.rockHitsN || 2));
    playMotion(n.querySelector('.cl-rock-body'), [{ scale: '1 1', translate: '0px 0px', filter: 'brightness(1)' }, { scale: '1.07 .9', translate: '-3px 0px', filter: 'brightness(1.9)', offset: .16 },
      { scale: '.96 1.05', translate: '3px 0px', filter: 'brightness(1.25)', offset: .45 }, { scale: '1.02 .98', translate: '-1px 0px', offset: .72 }, { scale: '1 1', translate: '0px 0px', filter: 'brightness(1)' }], P.hitMs, '_clSquash');
    sparks(c.fx, c.x, c.y, 'stone', 0, P.chipsHit, Math.max(36, c.w * .45));
    ring(c.fx, c.x, c.y, 'dust', Math.max(50, c.w * .6));
  }
                                                                                                         
                                                                    
  function burstRuin(n) {
    if (!n || n._clBurst) return;
    n._clBurst = true;
    var P = presentation().PARAMS.rocks, runtime = current, c = rockPoint(n, .5), foot = rockPoint(n, P.footFy);
    var pay = rockPay((current.opts.waves[n._clWave] && current.opts.waves[n._clWave].rocks || {}).reward);
    n.classList.add('is-burst');
    playMotion(n.querySelector('.cl-rock-body'), [{ scale: '1 1', filter: 'brightness(1)', opacity: 1 }, { scale: '1.2 .8', filter: 'brightness(2.4)', opacity: 1, offset: .25 },
      { scale: '1.35 1.25', filter: 'brightness(3)', opacity: 0 }], P.burstMs, '_clSquash');
    presentationDelay(function () { n.remove(); }, P.burstMs + 20);
    ring(c.fx, c.x, c.y, 'dust', Math.max(110, c.w * 1.3));
    presentationDelay(function () { if (current === runtime) ring(c.fx, c.x, c.y, 'kill', Math.max(80, c.w * .9)); }, 70);
    sparks(c.fx, c.x, c.y, 'stone', 0, P.chipsBurst, Math.max(60, c.w * .8));
    sparks(c.fx, c.x, c.y, 'dust', 0, 8, Math.max(40, c.w * .5));
    shake(.3);
                                                                              
    var pile = document.createElement('div'); pile.className = 'cl-bonepile cl-rubble'; pile._clScroll0 = current.scrollPx;
    pile.style.left = foot.x + 'px'; pile.style.top = foot.y + 'px';
    var rand = presentation().layoutRng(current.layoutSeed + ':rubble:' + n.dataset.rock);
    for (var i = 0; i < P.rubble; i++) {
      var chunk = document.createElement('i'), s = Math.max(7, c.w * (.06 + rand() * .07));
      chunk.style.width = s.toFixed(1) + 'px'; chunk.style.height = (s * (.7 + rand() * .3)).toFixed(1) + 'px';
      pile.appendChild(chunk);
      chunk.animate(presentation().rubbleFrames(rand, c.w * .5, c.h * .08), { duration: P.rubbleMs, delay: i * 25, easing: 'linear', fill: 'both' });
    }
    c.fx.appendChild(pile); presentationDelay(function () { pile.remove(); }, P.rubbleMs + P.rubble * 25);
    if (!pay.qty) return;
    var gain = document.createElement('span'); gain.className = 'cl-stone-gain'; gain.textContent = '+' + fmt(pay.qty);
    gain.style.left = Math.max(34, Math.min(c.fx.clientWidth - 34, c.x)) + 'px'; gain.style.top = (c.y - c.h * .62 - 6) + 'px';
    c.fx.appendChild(gain); presentationDelay(function () { gain.remove(); }, 1100);
    var chip = current.el.querySelector('.cl-stonechip'), cr = chip && chip.getBoundingClientRect();
    var tx = cr && cr.width ? c.m.x(cr.x + cr.height * .5) - c.x : 0, ty = cr && cr.width ? c.m.y(cr.y + cr.height * .5) - c.y : -c.h;
    var share = 0;
    for (var k = 0; k < P.stones; k++) (function (k) {
      var tok = document.createElement('img'); tok.className = 'cl-stonetoken'; tok.src = pay.img; tok.alt = ''; tok.draggable = false;
      tok.style.left = c.x + 'px'; tok.style.top = c.y + 'px';
      var ax = (k - (P.stones - 1) / 2) * Math.max(30, c.w * .36), ay = -Math.max(28, c.h * (.3 + (k % 2) * .16)), delay = 120 + k * P.stoneGapMs;
      tok.animate(presentation().seedTokenFrames(ax, ay, tx, ty), { duration: P.stoneFlyMs, delay: delay, easing: 'linear', fill: 'both' });
      c.fx.appendChild(tok);
      var part = k === P.stones - 1 ? pay.qty - share : Math.round(pay.qty / P.stones); share += part;
      presentationDelay(function () { if (current === runtime) stoneArrived(part); }, delay + P.stoneFlyMs);
      presentationDelay(function () { tok.remove(); }, delay + P.stoneFlyMs + 60);
    })(k);
  }
  function stoneArrived(qty) {
    current.stoneShown = (current.stoneShown || 0) + qty;
    var chip = current.el.querySelector('.cl-stonechip');
    if (!chip) return;
    chip.querySelector('b').textContent = fmt(current.stoneShown);
    playMotion(chip, [{ scale: '1 1' }, { scale: '1.32 1.32', offset: .3 }, { scale: '.92 .92', offset: .65 }, { scale: '1 1' }], 280, '_clBump');
    var fx = current.el.querySelector('#cl-fx'), m = fxMap(fx), r = chip.getBoundingClientRect();
    sparks(fx, m.x(r.x + r.height * .5), m.y(r.y + r.height * .5), 'stone', 0, 5, 26);
  }
                                                                                                              
  function presentRuinSmash(events) {
    var P = presentation().PARAMS.rocks, runtime = current, used = [];
    events.forEach(function (event, k) {
      var n = ruinFor(null, null, true);
      if (!n) return;
      n._clSmashing = true;
      presentationDelay(function () { smashRuin(n, used, 0, runtime); }, P.smashDelayMs + k * P.smashGapMs);
    });
  }
                                                                                                     
                                                                                                    
                                                                                                  
                                              
  function smashRuin(n, used, waited, runtime) {
    if (current !== runtime || !n.isConnected || n._clBurst) return;
    var P = presentation().PARAMS.rocks, nr = n.getBoundingClientRect(), pick = null, bestD = Infinity;
    current.el.querySelectorAll('.cl-frog').forEach(function (f) {
      var strike = f.querySelector('.cl-strike');
      if (f.hidden || f._clGone || f._clDying || f._clLunging || (strike && strike._clAttack && strike._clAttack.playState === 'running')) return;
      var r = f.getBoundingClientRect(), d = Math.hypot(r.x + r.width / 2 - nr.x - nr.width / 2, r.y + r.height / 2 - nr.y - nr.height / 2) + (used.indexOf(f) >= 0 ? 1e4 : 0);
      if (d < bestD) { bestD = d; pick = f; }
    });
    if (!pick && waited < P.smashWaitMaxMs) {
      presentationDelay(function () { smashRuin(n, used, waited + P.smashWaitStepMs, runtime); }, P.smashWaitStepMs);
      return;
    }
    if (pick) used.push(pick);
    var contact = pick ? frogLeapAt(pick, n) : 0;
    presentationDelay(function () { if (current === runtime) burstRuin(n); }, contact);
  }
                                                                                                       
  function frogLeapAt(source, target) {
    var sr = source.getBoundingClientRect(), img = target.querySelector('img') || target, tr = img.getBoundingClientRect();
    if (!sr.width || !tr.width) return 0;
    var scale = sr.width / (source.offsetWidth || sr.width);
    var dx = (tr.x + tr.width * .35 - sr.x - sr.width * .95) / scale, dy = (tr.y + tr.height * .45 - sr.y - sr.height * .6) / scale;
    var leapMs = frogLeap(source, dx, dy, scale);
    var lunge = {}; source._clLunging = lunge; source.style.zIndex = '90000';
    presentationDelay(function () { if (source._clLunging === lunge) { source._clLunging = null; if (source.isConnected) source.style.zIndex = String(presentation().depth(Number(source.dataset.footY))); } }, leapMs);
    return presentation().contactMs('frog');
  }
                                                                                                          
                                                                                                      
                                                                               
  function settleStoneTally(el) {
    var chip = el.querySelector('.cl-stonechip');
    if (!chip) return;
    current.stoneShown = 0;
    current.fight.harvests().forEach(function (id) {
      if (current.opts.waves.some(function (w) { return w.rocks && w.rocks.reward === id; })) current.stoneShown += rockPay(id).qty;
    });
    chip.querySelector('b').textContent = fmt(current.stoneShown);
    el.querySelectorAll('.cl-stonetoken').forEach(function (t) { t.remove(); });
  }
                                                                                                      
                                                                                 
  function presentRocks(el) {
    var fight = current.fight, wi = fight.currentWaveIndex(), rk = fight.rocks(), rect = el.getBoundingClientRect(), key = rect.width + '|' + rect.height;
    if (rk) current.rockHitsN = rk.hits;
    if (current.rockWave !== wi && !current.travel) {
      current.rockWave = wi;
      var have = rockNodes(el).filter(function (n) { return n._clWave === wi; });
      if (!have.length && rk && rk.count > rk.burst) buildRocks(el, wi, false, rk.count - rk.burst);
    }
    if (current.rockKey !== key) {
      current.rockKey = key;
      var arenaTop = el.querySelector('#cl-arena').offsetTop, lays = {};
      rockNodes(el).forEach(function (n) {
        if (n._clBurst) return;
        var lay = lays[n._clWave] || (lays[n._clWave] = rockLayoutFor(el, n._clWave)), pos = lay[Number(n.dataset.rock.split(':')[1])];
        if (pos) placeRock(n, pos, arenaTop);
      });
    }
    var chip = el.querySelector('.cl-stonechip'), plates = el.querySelector('#cl-plates');
    if (chip && current.stoneShown == null) settleStoneTally(el);                                                        
    if (chip && plates) {
      var top = (plates.offsetTop + plates.offsetHeight + 8) + 'px';
      if (chip.style.top !== top) chip.style.top = top;
    }
  }

                                                                                
                                                                                                       
                                                                                                      
                                                                                                        
                                                                                                      
                                                                                     
                                                                                                      
                                                                                                  
                                                                                                  
                                                                                                  
                                                                                               
  function meadowNodes(el) { return Array.from(el.querySelectorAll('.cl-meadow')); }
  var meadowPreload = {};
  function preloadMeadows(waves) {
    var art = creatureArt(), names = presentation().PARAMS.meadow.art.map(function (a, i) { return 'daisy-' + (i + 1); }).concat(['petal']);
    (waves || []).forEach(function (w) {
      (w.bosses || []).concat(w.enemies || []).forEach(function (b) {
        var dir = art[b.id] && art[b.id].meadow;
        if (!dir || meadowPreload[dir]) return;
        meadowPreload[dir] = names.map(function (n) { var i = new Image(); i.src = dir + n + '.png'; return i; });
      });
    });
  }
                                                                                                 
                                                                        
  function meadowFor(el, waveIdx) {
    var wave = current.opts.waves[waveIdx], art = creatureArt();
    if (!wave || wave.harvest) return null;
    var enemies = buildEnemiesForWave(wave, current.enemyDb, current.bossDb, function () { return 0.5; });
    var host = enemies.filter(function (e) { return art[e.defId] && art[e.defId].meadow; })[0];
    if (!host) return null;
    var rect = el.getBoundingClientRect();
    var roster = presentation().organicRoster(enemies, foeRegion(el, rect, waveIdx), current.layoutSeed + ':' + waveIdx);
    var group = roster.groups.filter(function (g) { return g.members.indexOf(host.id) >= 0; })[0];
    var pos = group && roster.layout.units.filter(function (u) { return u.id === group.id; })[0];
    return pos ? { dir: art[host.defId].meadow, anchor: pos } : null;
  }
                                                                                                    
  function buildMeadow(el, waveIdx, incoming) {
    var m = meadowFor(el, waveIdx);
    if (!m) return null;
    var rect = el.getBoundingClientRect(), arenaTop = el.querySelector('#cl-arena').offsetTop, M = presentation().PARAMS.meadow;
    var lay = presentation().meadowLayout(rect.width, rect.height, m.anchor, current.layoutSeed + ':meadow:' + waveIdx);
    function box(b) { return 'left:' + b.left.toFixed(1) + 'px;top:' + b.top.toFixed(1) + 'px;width:' + b.width.toFixed(1) + 'px;height:' + b.height.toFixed(1) + 'px;'; }
    var node = document.createElement('div');
    node.className = 'cl-meadow';
    node.style.top = -arenaTop + 'px';                                        
    node._clWave = waveIdx; node._clKey = rect.width + '|' + rect.height; node._clIncoming = !!incoming; node._clDir = m.dir;
    node._clBack = lay.back; node._clFeet = m.anchor.footY;
    node.innerHTML = lay.rest.map(function (p) {
                                                                   
      return '<img class="cl-restpetal" src="' + m.dir + 'petal.png" alt="" draggable="false" style="' + box(p) + 'transform:scaleY(.62) rotate(' + p.rot + 'deg)">';
    }).join('') + lay.daisies.map(function (d) {
      return '<div class="cl-daisy" data-x="' + d.x.toFixed(1) + '" data-foot="' + d.footY.toFixed(1) + '" data-w="' + d.width.toFixed(1) + '" style="' + box(d)
        + 'transform:rotate(' + d.rot + 'deg)' + (d.flip ? ' scaleX(-1)' : '') + '"><img src="' + m.dir + 'daisy-' + (d.art + 1) + '.png" alt="" draggable="false" style="--sway:' + M.swayDeg + 'deg;animation-duration:'
        + d.sway + 's;animation-delay:-' + (d.phase * d.sway).toFixed(2) + 's"></div>';
    }).join('');
    if (incoming) node.style.translate = (current.travel ? current.travel.dist : rect.width).toFixed(1) + 'px 0';
    el.querySelector('#cl-arena').appendChild(node);
    return node;
  }
                                                                  
  function shedPetal(el, live) {
    var rng = current.windRng, W = el.clientWidth, picks = [];
    live.forEach(function (m) {
      var off = parseFloat(m.style.translate) || 0;
      Array.from(m.querySelectorAll('.cl-daisy')).forEach(function (d) {
        var x = Number(d.dataset.x) + off;
        if (x > 6 && x < W - 6) picks.push({ d: d, x: x, dir: m._clDir });
      });
    });
    if (!picks.length) return;
    var p = picks[Math.floor(rng() * picks.length)], M = presentation().PARAMS.meadow, arena = el.querySelector('#cl-arena'), arenaTop = arena.offsetTop;
    var foot = Number(p.d.dataset.foot), h = Number(p.d.dataset.w) * M.petalLen, w = h * M.petal[0] / M.petal[1];
    var fl = presentation().windPetalFrames(rng, W, W + 30 - p.x, foot + 30);
    var petal = document.createElement('img');
    petal.className = 'cl-windpetal'; petal.src = p.dir + 'petal.png'; petal.alt = ''; petal.draggable = false;
    petal.style.left = (p.x - w / 2).toFixed(1) + 'px'; petal.style.top = (foot - arenaTop - h / 2).toFixed(1) + 'px';
    petal.style.width = w.toFixed(1) + 'px'; petal.style.height = h.toFixed(1) + 'px';
    petal.style.zIndex = String(presentation().depth(foot) + 1);
    arena.appendChild(petal);
    petal.animate(fl.frames, { duration: fl.ms, easing: 'linear', fill: 'both' });
    presentationDelay(function () { petal.remove(); }, fl.ms + 40);
    playMotion(p.d.querySelector('img'), [{ scale: '1 1' }, { scale: '1.1 .88', offset: .3 }, { scale: '.95 1.06', offset: .65 }, { scale: '1 1' }], 340, '_clShiver');
  }
                                                            
  function windGust(el, live) {
    var rng = current.windRng, M = presentation().PARAMS.meadow, W = el.clientWidth, arena = el.querySelector('#cl-arena'), m = live[0];
    var off = parseFloat(m.style.translate) || 0, len = W * (.26 + rng() * .14), x = W * (.04 + rng() * .5) + off;
    if (x > W) return;
    var y = m._clBack + (m._clFeet - m._clBack) * (.1 + rng() * .85) - arena.offsetTop, dx = W * .34, ang = -Math.atan(M.climb) * 180 / Math.PI;
    var g = document.createElement('i');
    g.className = 'cl-gust'; g.style.left = x.toFixed(1) + 'px'; g.style.top = y.toFixed(1) + 'px'; g.style.width = len.toFixed(1) + 'px';
    arena.appendChild(g);
    function at(k, sx, op) { return { transform: 'translate(' + (dx * k).toFixed(1) + 'px,' + (-dx * M.climb * k).toFixed(1) + 'px) rotate(' + ang.toFixed(1) + 'deg) scaleX(' + sx + ')', opacity: op }; }
    g.animate([at(0, .35, 0), Object.assign(at(.45, 1, 1), { offset: .45 }), at(1, .6, 0)], { duration: M.gustMs, easing: 'ease-in-out', fill: 'both' });
    presentationDelay(function () { g.remove(); }, M.gustMs + 40);
  }
                                                                                                         
                                                                      
  function presentMeadow(el) {
    var wi = current.fight.currentWaveIndex(), rect = el.getBoundingClientRect(), size = rect.width + '|' + rect.height;
    if (!current.travel && current.meadowKey !== wi + '|' + size) {
      current.meadowKey = wi + '|' + size;
      var kept = false;
      meadowNodes(el).forEach(function (n) { if (n._clWave === wi && n._clKey === size && !n._clLeaving) kept = true; else n.remove(); });
      if (!kept) buildMeadow(el, wi, false);
    }
    var live = meadowNodes(el);
    if (!live.length) { current.petalAt = current.gustAt = null; return; }
    var M = presentation().PARAMS.meadow, now = current.clock.now(), rng = current.windRng;
    if (current.petalAt == null || now - current.petalAt > 2000) current.petalAt = now + M.petalEveryMs * rng();
    while (now >= current.petalAt) { shedPetal(el, live); current.petalAt += M.petalEveryMs * (1 + (rng() * 2 - 1) * M.petalJitter); }
    if (current.gustAt == null || now - current.gustAt > 4000) current.gustAt = now + M.gustEveryMs * (.3 + rng() * .7);
    while (now >= current.gustAt) { windGust(el, live); current.gustAt += M.gustEveryMs * (1 + (rng() * 2 - 1) * M.gustJitter); }
  }

                                                                                  
                                                                                                       
                                                                                                    
                                                                                               
                                                                                                        
                                                                                                        
                                                                                                         
                                                                                                 
                                                                                                       
                                                                                                        
                                                                                                       
                                                                                                                   
                                                                                                             
  function crackNodes(el) { return Array.from(el.querySelectorAll('.cl-cracks')); }
                                                                                                                       
                                                                                                                
  function floorLift(el) { var f = el.querySelector('.cl-floor'); return f ? Math.max(0, el.clientHeight * 0.54 - f.offsetTop) : 0; }
                                                                                                                     
                                                                                                         
  var CRACK_SURFACE_BY_STAGE = { lagoon: [259, 748] };
                                                                                                               
                                      
  function crackHost(waves, stage) {
    var art = creatureArt(), host = null;
    (waves || []).forEach(function (w, i) {
      if (host || w.harvest) return;
      (w.bosses || []).concat(w.enemies || []).forEach(function (b) {
        var c = !host && art[b.id] && art[b.id].cracks;
        if (!c) return;
        var name = typeof c === 'string' ? 'hollow' : c.set;
        host = { wave: i, id: b.id, dir: typeof c === 'string' ? c : c.dir, name: name, set: presentation().crackSet(name) };
        if (CRACK_SURFACE_BY_STAGE[stage]) host.set.surface = CRACK_SURFACE_BY_STAGE[stage];
      });
    });
    return host;
  }
  function preloadCracks(host) {
    if (!host) return null;
    var S = host.set;
    return S.big.map(function (a, i) { return 'big-' + (i + 1); }).concat(S.small.map(function (a, i) { return 'small-' + (i + 1); }))
      .map(function (n) { var img = new Image(); img.src = host.dir + n + '.png'; return img; });
  }
  function crackLayer(el, waveIdx) {
    var node = document.createElement('div'), rect = el.getBoundingClientRect();
    node.className = 'cl-cracks cl-cracks--' + current.crackHost.name;
    node.style.top = -el.querySelector('#cl-arena').offsetTop + 'px';                                       
    node._clWave = waveIdx; node._clKey = rect.width + '|' + rect.height; node._clSpots = [];
    el.querySelector('#cl-arena').appendChild(node);
    return node;
  }
                                                                                                            
                                                                                                             
                                                                                                           
                                                                          
  function crackHTML(c, dir, name, size, kind, feetFy, main) {
    function pct(v) { return (v * 100).toFixed(2) + '%'; }
    var fire = '';
    if (size.length > 2) {
      var beat = (Math.abs(Math.sin(c.x * 12.9898 + c.footY * 78.233)) * 43758.5453) % 1;
      fire = '<i class="cl-crack-fire" style="left:' + pct((c.flip ? size[0] - size[2] - size[4] : size[2]) / size[0]) + ';top:' + pct(size[3] / size[1]) + ';width:' + pct(size[4] / size[0])
        + ';height:' + pct(size[5] / size[1]) + ';--fh:' + (c.height * size[5] / size[1]).toFixed(1) + 'px;background-image:url(' + dir + name + '-fire.png);animation-delay:-' + (beat * 2).toFixed(2) + 's,-' + (beat * 0.44).toFixed(2) + 's'
        + (c.flip ? ';transform:scaleX(-1)' : '') + '"><b></b><b></b><b></b><b></b><b></b></i>';
    }
    return '<div class="cl-crack cl-crack--' + kind + '" style="left:' + c.left.toFixed(1) + 'px;top:' + c.top.toFixed(1) + 'px;width:' + c.width.toFixed(1) + 'px;height:'
      + c.height.toFixed(1) + 'px;--cl-fy:' + (feetFy * 100).toFixed(1) + '%"><i class="cl-crack-glow"></i><img src="' + dir + name + '.png" alt="" draggable="false"'
      + (c.flip ? ' style="transform:scaleX(-1)"' : '') + '>' + fire
      + (main ? '<i class="cl-crack-rise"><i></i><b></b><b></b><b></b><b></b><b></b><b></b></i>' : '') + '</div>';
  }
                                                                                                    
  function crackChips(el, node, feetFy, count) {
    var fx = el.querySelector('#cl-fx'), r = node.getBoundingClientRect(), m = fxMap(fx);
    if (fx && r.width) sparks(fx, m.x(r.x + r.width / 2), m.y(r.y + r.height * feetFy), current.crackHost.set.sparks, 0, count, Math.max(36, r.width * .45));
  }
                                                                                                            
                                                                                                              
                               
  function tearCrack(el, layer, waveIdx, i, animate) {
    var host = current.crackHost, C = host.set, rect = el.getBoundingClientRect();
    var c = presentation().bossCrackSpot(rect.width, rect.height, waveIdx, host.wave, i, layer._clSpots, current.layoutSeed, floorLift(el), host.set);
    layer._clSpots.push(c);
    layer.insertAdjacentHTML('beforeend', crackHTML(c, host.dir, 'small-' + (c.art + 1), C.small[c.art], 'small', C.feetFy));
    if (!animate) return;
    var node = layer.lastElementChild, f = presentation().bossCrackPlan(waveIdx, host.wave).f;
    if (C.open === 'well') node.querySelector('img').animate([{ scale: '.15 .08', opacity: 0 },
      { scale: '.7 .5', opacity: 1, offset: .3 }, { scale: '1.12 1.06', offset: .62 }, { scale: '.97 1', offset: .82 }, { scale: '1 1', opacity: 1 }],
      { duration: C.tearMs * 1.3, easing: 'cubic-bezier(.25,.8,.35,1)' });
    else node.querySelector('img').animate([{ clipPath: 'inset(-20% 50% -10% 50%)', scale: '1.06 .45', opacity: .35 },
      { clipPath: 'inset(-20% 6% -10% 6%)', scale: '1.05 1.14', opacity: 1, offset: .42 },
      { clipPath: 'inset(-20% 0% -10% 0%)', scale: '1 1', opacity: 1 }], { duration: C.tearMs, easing: 'cubic-bezier(.2,.8,.3,1)' });
    node.querySelector('.cl-crack-glow').animate([{ opacity: 0, scale: '.3' }, { opacity: 1, scale: '1.5', offset: .25 }, { opacity: .6, scale: '1' }],
      { duration: C.tearMs * 1.8, easing: 'ease-out' });
                                                                  
    var fire = node.querySelector('.cl-crack-fire');
    if (fire) {
      fire.animate([{ opacity: 0 }, { opacity: 0, offset: .3 }, { opacity: 1, offset: .6 }], { duration: C.tearMs * 1.6, easing: 'ease-out' });
      fire.animate([{ translate: '0 12%', scale: '.5 .2' }, { translate: '0 12%', scale: '.5 .2', offset: .3 }, { translate: '0 0', scale: '1.1 1.25', offset: .7 }, { translate: '0 0', scale: '1 1' }],
        { duration: C.tearMs * 1.6, easing: 'ease-out', composite: 'add' });
    }
    shake(C.trauma[0] + (C.trauma[1] - C.trauma[0]) * f);
    crackChips(el, node, C.feetFy, C.chips);
  }
                                                                                                       
                                                                                                
  function buildCrackBed(el, waveIdx, incoming) {
    var host = current.crackHost, fr = foeFrames({ defId: host.id }), C = host.set;
    var node = Array.from(el.querySelectorAll('.cl-foe')).filter(function (n) { return n.dataset.catalog === host.id && n.dataset.wave === String(waveIdx) && !n._clDead; })[0];
    var img = node && node.querySelector('.cl-foe-motion img'), arena = el.querySelector('#cl-arena');
    if (!fr || !img || !img.offsetWidth || !img.offsetHeight) return null;
    var motion = img.parentNode, top = arena.offsetTop + node.offsetTop + motion.offsetTop + img.offsetTop;
    var bodyX = node.offsetLeft + motion.offsetLeft + img.offsetLeft + img.offsetWidth / 2, feetY = top + img.offsetHeight * fr.ground / fr.cell.h;
    var rect = el.getBoundingClientRect(), g = stageGround(rect), layer = crackLayer(el, waveIdx);
    layer.classList.add('cl-cracks--bed'); layer._clBed = true;
    layer.innerHTML = presentation().bossCrackBed(bodyX, feetY, node.offsetWidth, g.bottom - g.top, presentation().crackSurface(rect.width, rect.height, floorLift(el), host.set.surface), rect.width / 2, host.set).map(function (c) {
      return crackHTML(c, host.dir, 'big-' + (c.art + 1), C.big[c.art], 'big', C.bedFeetFy[c.art], c.art === 0 && C.rise);
    }).join('');
    if (incoming) { layer._clIncoming = true; layer.style.translate = (current.travel ? current.travel.dist : el.clientWidth).toFixed(1) + 'px 0'; }
    return layer;
  }
                                                                                                             
  function flareCracks(el, layer) {
    var C = current.crackHost.set, cracks = Array.from(layer.querySelectorAll('.cl-crack'));
    cracks.forEach(function (n, i) {
      n.querySelector('img').animate([{ scale: '1 1', filter: 'brightness(1)' }, { scale: '1.05 1.12', filter: 'brightness(1.9)', offset: .18 }, { scale: '1 1', filter: 'brightness(1)' }],
        { duration: C.flareMs, delay: i * 80, easing: 'ease-out' });
      n.querySelector('.cl-crack-glow').animate([{ opacity: .4, scale: '1' }, { opacity: 1, scale: '1.4', offset: .22 }, { opacity: .6, scale: '1' }],
        { duration: C.flareMs * 1.3, delay: i * 80, easing: 'ease-out' });
                           
      var fire = n.querySelector('.cl-crack-fire');
      if (fire) fire.animate([{ scale: '1 1', filter: 'brightness(1)' }, { scale: '1.15 1.5', filter: 'brightness(1.5)', offset: .25 }, { scale: '1 1', filter: 'brightness(1)' }],
        { duration: C.flareMs * 1.2, delay: i * 80, easing: 'ease-out', composite: 'add' });
    });
    shake(C.flareTrauma);
    if (cracks.length) crackChips(el, cracks[1] || cracks[0], C.bedFeetFy[0], C.flareChips);
  }
                                                                                         
  function glowCracks(contactMs) {
                                                                           
    if (!current.crackHost || !current.crackHost.set) return;
    var C = current.crackHost.set, total = contactMs + C.glowMs;
    crackNodes(current.el).forEach(function (layer) {
      if (!layer._clBed || layer._clLeaving) return;
      layer.querySelectorAll('.cl-crack-glow').forEach(function (g) {
        playMotion(g, [{ opacity: .55, scale: '1' }, { opacity: 1, scale: '1.3', offset: contactMs / total }, { opacity: .55, scale: '1' }], total, '_clGlow', 'ease-in-out');
      });
    });
  }
                                                                                                        
                                                                                                                  
                                                                                                                   
                       
  function setGloom(el, level) {
    if (current.gloom === level || !current.crackHost.set.gloom) return;
    current.gloom = level;
    if (!el.querySelector('.cl-gloom')) { var g = document.createElement('div'); g.className = 'cl-gloom'; el.querySelector('.cl-mid').after(g); }
    el.style.setProperty('--cl-gloom', level.toFixed(3));
  }
                                                                                                    
                                                                                                     
                                                                                                         
                                                                                                         
  function presentCracks(el) {
    var host = current.crackHost;
    if (!host) return;
    var C = host.set, fight = current.fight, wi = fight.currentWaveIndex(), rect = el.getBoundingClientRect(), size = rect.width + '|' + rect.height, now = current.clock.now();
    if (current.travel) {
      var riding = crackNodes(el).some(function (n) { return n._clBed && n._clIncoming; });
      if (riding) setGloom(el, 1);
      if (riding && now - (current.crackRumbleAt || 0) >= C.rumbleMs) { current.crackRumbleAt = now; shake(C.rumble); }
      return;
    }
    var alive = fight.enemies().some(function (e) { return e.defId === host.id && e.hp > 0; });
    if (fight.isDone()) {
                                                                                                            
                                                            
      crackNodes(el).forEach(function (n) { if (n._clBed) n.classList.toggle('is-dormant', !alive); });
      if (current.gloom != null && crackNodes(el).some(function (n) { return n._clBed; })) setGloom(el, alive ? 1 : 0);
      return;
    }
    if (current.crackKey !== wi + '|' + size) {
      var kept = null;
      crackNodes(el).forEach(function (n) { if (n._clWave === wi && n._clKey === size && !n._clLeaving) kept = n; else n.remove(); });
      if (!kept) kept = wi === host.wave ? buildCrackBed(el, wi, false) : wi < host.wave ? crackLayer(el, wi) : null;
      if (kept || wi > host.wave) current.crackKey = wi + '|' + size;                                           
                                                                                           
      var run = current.crackRun, opened = run && run.wave === wi ? run.opened : 0;
      if (kept && !kept._clBed) for (var i = kept.childElementCount; i < opened; i++) tearCrack(el, kept, wi, i, false);
    }
    var layer = crackNodes(el).filter(function (n) { return n._clWave === wi && !n._clLeaving; })[0];
    if (!layer) return;
    if (wi === host.wave) {
                                                              
      layer.classList.toggle('is-dormant', !alive);
      setGloom(el, alive ? 1 : 0);
      if (current.crackFlared !== wi && alive) { current.crackFlared = wi; flareCracks(el, layer); }
    } else if (wi < host.wave) {
      if (!current.crackRun || current.crackRun.wave !== wi) current.crackRun = { wave: wi, start: now, opened: 0 };
      var plan = presentation().bossCrackPlan(wi, host.wave), r = current.crackRun;
      while (r.opened < plan.count && now - r.start >= plan.at[r.opened]) { tearCrack(el, layer, wi, r.opened, true); r.opened++; }
      if (r.opened) setGloom(el, Math.max(current.gloom || 0, C.gloomPre[0] + (C.gloomPre[1] - C.gloomPre[0]) * plan.f));
    }
  }

                                                                                
                                                                         
                                                                          
                                                                                
                                                                               
                                                                              
                                                                             
                                                                         
                                                                                   
                                                                                                  
                                                                               
                                                                              
                                                                 
  var RESCUE_TIP_TEXT = 'TAP THE WEB · FREE THE TADPOLES';
                                                                                        
  var TAD_ART = 'assets/frog2/tadpole/stage_0.png';
  function rescueApi() { return typeof RescueWeb !== 'undefined' ? RescueWeb : null; }
  function webInfo(web) {
    var R = rescueApi();
    return R ? R.webInfo(web) : { web: web, name: 'Spider Web', art: 'assets/expeditions/rescue/spider-web.webp' };
  }
  function webNode(el) { return el.querySelector('.cl-web'); }
  function tadpoleHTML(extra, style, art) {
    return '<span class="cl-tad' + (extra || '') + '"' + (style ? ' style="' + style + '"' : '') + '><span class="cl-tad__wig">'
      + '<img src="' + (art || TAD_ART) + '" alt="" draggable="false"></span></span>';
  }
                                                                                           
                                                                                       
  var PRIZE_RANK = { frog: 0, ticket: 1, gear: 2 };
  function webPrizes(h) {
    var R = rescueApi();
    if (!R) return [];
    return (h.prizes || []).filter(function (p) { return R.prizeOpen(p.table); }).map(function (p) {
      var v = R.prizeView(p.table);
      return v ? Object.assign({ table: p.table }, v) : null;
    }).filter(Boolean).sort(function (a, b) { return (PRIZE_RANK[a.kind] || 0) - (PRIZE_RANK[b.kind] || 0); });
  }
                                                                      
  function buildWeb(el, h, incoming) {
    bloomParts(el).forEach(function (n) { n.remove(); });
    var P = presentation().PARAMS.rescue, arena = el.querySelector('#cl-arena'), info = webInfo(h.web);
    var rect = el.getBoundingClientRect(), box = presentation().webBox(rect.width, rect.height);
    var reward = harvestReward(h.reward), prizes = webPrizes(h).slice(0, 1 + P.prizeSpots.length);
    var at = prizes.map(function (p, i) { return i ? P.prizeSpots[i - 1] : P.hub; });
    var n = Math.max(3, Math.min(P.tokensMax, reward ? Number(String(reward.qty).split('–').pop()) || 3 : 3));
    var spots = presentation().webSpots(n, at), rand = presentation().layoutRng(current.layoutSeed + ':web');
    var hand = typeof Assets !== 'undefined' ? Assets.ui('pointClicker01') : '';
    var tads = spots.map(function (s, i) {
      var flip = rand() < .5 ? -1 : 1, tilt = Math.round((rand() * 2 - 1) * 28);
      return tadpoleHTML(' cl-tad--stuck', 'left:' + (s[0] * 100).toFixed(1) + '%;top:' + (s[1] * 100).toFixed(1) + '%;width:' + (P.tadW * 100).toFixed(1) + '%;'
        + '--tad-flip:' + flip + ';--tad-tilt:' + tilt + 'deg;--tad-d:-' + (rand() * .9).toFixed(2) + 's;--tad-s:' + (.42 + rand() * .2).toFixed(2) + 's', reward && reward.itemId === 'seeds' ? reward.img : null);
    }).join('');
    var prizeHTML = prizes.map(function (prize, i) {
                                                                                                       
                                                                                          
      var R = rescueApi(), frog = prize.kind === 'frog', fs = partyFrogScale();
      var px = frog ? Math.round(PRESENTATION_PARAMS.frogBoxPx * fs) : Math.round(box.width * (prize.kind === 'ticket' ? P.prizeTicket : P.prizeGear));
      return '<span class="cl-web-prize cl-web-prize--' + prize.kind + '" data-prize="' + escHTML(prize.table) + '" style="left:' + (at[i][0] * 100) + '%;top:' + (at[i][1] * 100) + '%;width:' + px + 'px">'
        + '<span class="cl-web-prize__art">' + (frog
          ? '<span class="cl-web-prize__unit" style="transform:scale(' + fs + ')"><span class="cl-frog-face">' + (R ? R.prizeArtHTML(prize, 120) : '') + '</span></span>'
          : (R ? R.prizeArtHTML(prize, px) : '')) + '</span>'
        + '<span class="cl-web-prize__wrap" aria-hidden="true"><i></i><i></i><i></i></span>'
        + (frog ? '<span class="cl-web-help">Help!</span>' : '') + '</span>';
    }).join('');
    var node = document.createElement('div'), ui = document.createElement('div');
    node.className = 'cl-web'; node.dataset.web = h.web;
    node.innerHTML = '<div class="cl-web-shadow" aria-hidden="true"></div>'
      + '<div class="cl-web-body"><img class="cl-web-art" src="' + escHTML(info.art) + '" alt="' + escHTML(info.name) + '" draggable="false">'
      + '<div class="cl-web-catch">' + tads + prizeHTML + '</div></div>';
    ui.className = 'cl-web-ui';
    ui.innerHTML = '<div class="cl-web-guide" hidden><span class="cl-web-guide__bubble">' + escHTML(text("text_combat_web_guide", "Tap the web!")) + '</span>'
      + (hand ? '<img class="cl-web-guide__hand" src="' + hand + '" alt="" draggable="false">' : '') + '</div>';
    arena.appendChild(node); arena.appendChild(ui);
    placeBloom(el, [node, ui]);
    [node, ui].forEach(function (p) { p._clIncoming = !!incoming; });
    return node;
  }
                                                                                                        
  function partyFrogScale() { return battleFrogPx(null) / PRESENTATION_PARAMS.frogBoxPx; }
                                                                     
  function webPoint(node, at) { return bloomPoint(node, at); }
  function webBody() { var n = webNode(current.el); return n && n.querySelector('.cl-web-body'); }
                                                                                      
  function webJolt(a) {
    playMotion(webBody(), [{ transform: 'translateY(0) scale(1,1) skewX(0deg)' }, { transform: 'translateY(' + r3(10 * a) + 'px) scale(' + r3(1 + .03 * a) + ',' + r3(1 - .06 * a) + ') skewX(' + r3(2 * a) + 'deg)', offset: .22 },
      { transform: 'translateY(' + r3(-4 * a) + 'px) scale(' + r3(1 - .02 * a) + ',' + r3(1 + .04 * a) + ') skewX(' + r3(-1.5 * a) + 'deg)', offset: .55 },
      { transform: 'translateY(' + r3(1.5 * a) + 'px) scale(1,1) skewX(' + r3(.6 * a) + 'deg)', offset: .8 }, { transform: 'translateY(0) scale(1,1) skewX(0deg)' }],
      presentation().PARAMS.rescue.joltMs, '_clSquash');
                                                
    var w = webNode(current.el);
    if (w) { w.classList.remove('is-yanked'); void w.offsetWidth; w.classList.add('is-yanked'); }
  }
                                                                               
  function threads(fx, x, y, n, dist) {
    var P = presentation().PARAMS.rescue, box = document.createElement('div');
    box.className = 'cl-threads'; box.style.left = x + 'px'; box.style.top = y + 'px';
    current.threadN = (current.threadN || 0) + 1;
    var rand = presentation().layoutRng(current.layoutSeed + ':thread:' + current.threadN);
    for (var i = 0; i < n; i++) {
      var t = document.createElement('i'); if (rand() < .35) t.className = 'cl-thread--long';
      box.appendChild(t);
      t.animate(presentation().petalFrames(rand, dist), { duration: P.threadMs * (.75 + rand() * .5), delay: i * 6, easing: 'cubic-bezier(.2,.6,.4,1)', fill: 'both' });
    }
    fx.appendChild(box); presentationDelay(function () { box.remove(); }, P.threadMs * 1.3 + n * 6);
  }
  function showWebGuide(on) {
    var g = current && current.el.querySelector('.cl-web-guide');
    if (g && g.hidden === !!on) g.hidden = !on;
  }

                                                                                                 
  function startRescue(el, hv) {
    var P = presentation().PARAMS.rescue, runtime = current, fight = current.fight;
    current.bloomWave = fight.currentWaveIndex();
    var node = webNode(el), popIn = !node || node._clLeaving;
    if (popIn) node = buildWeb(el, hv, false);
    var tads = Array.from(node.querySelectorAll('.cl-tad--stuck'));
    var shown = Array.from(node.querySelectorAll('.cl-web-prize')).map(function (n) { return n.dataset.prize; });
    current.web = { info: webInfo(hv.web), reward: harvestReward(hv.reward), prizes: webPrizes(hv).filter(function (p) { return shown.indexOf(p.table) >= 0; }),
      tads: tads, free: 0, got: 0, tapped: false, third: 0, frogTurn: 0, burst: false };
    current.plateKey = null;
    var fx = el.querySelector('#cl-fx'), c = webPoint(node, P.hub);
    playMotion(node.querySelector('.cl-web-body'), popIn
      ? [{ transform: 'scale(.3,.1)', opacity: 0 }, { transform: 'scale(1.1,.86)', opacity: 1, offset: .35 }, { transform: 'scale(.95,1.08)', offset: .6 }, { transform: 'scale(1.02,.98)', offset: .8 }, { transform: 'scale(1,1)' }]
      : [{ transform: 'scale(1,1)' }, { transform: 'scale(1.06,.9)', offset: .2 }, { transform: 'scale(.97,1.06)', offset: .45 }, { transform: 'scale(1.01,.99)', offset: .72 }, { transform: 'scale(1,1)' }], P.discoverMs + 120, '_clSquash');
    ring(fx, c.x, c.y, 'web', c.w * .7);
    threads(fx, c.x, c.y, 8, c.w * .35);
    node.classList.add('is-crying');
    presentationDelay(function () { if (current === runtime && node.isConnected) node.classList.remove('is-crying'); }, 2200);
    var frogs = Array.from(el.querySelectorAll('.cl-frog')).filter(function (n) { return !n.hidden && !n._clGone && !n._clDying; });
    frogs.forEach(function (n, i) { presentationDelay(function () { if (current === runtime) exclaim(fx, n); }, 80 + i * 40); });
    presentationDelay(function () {
      if (current === runtime && current.web && !current.web.tapped && fight.harvest() && !fight.harvest().done) showWebGuide(true);
    }, P.discoverMs + 260);
  }
                                                                                                 
  function freeTadpoles(progress, taps) {
    var hw = current.web;
    if (!hw) return;
    var want = presentation().tadsFree(hw.tads.length, progress, taps);
    while (hw.free < want) freeTad(hw.free++);
  }
  function freeTad(i) {
    var hw = current.web, P = presentation().PARAMS.rescue, runtime = current, node = hw.tads[i];
    if (!node || node._clFree) return;
    node._clFree = true;
    var fx = current.el.querySelector('#cl-fx'), m = fxMap(fx), r = node.getBoundingClientRect();
    node.classList.add('is-free');
    if (!r.width) return;
    var x = m.x(r.x + r.width / 2), y = m.y(r.y + r.height / 2), w = r.width * (fx.clientWidth / (fx.getBoundingClientRect().width || 1));
    threads(fx, x, y, 4, 34);
    sparks(fx, x, y, 'web', 0, 5, 30);
    var chip = current.el.querySelector('.cl-plate--rescue .cl-plate__seeds'), cr = chip && chip.getBoundingClientRect();
    var tx = cr && cr.width ? m.x(cr.x + cr.width * .3) - x : 0, ty = cr && cr.width ? m.y(cr.y + cr.height * .5) - y : -120;
    var tok = document.createElement('div');
    tok.className = 'cl-tadtoken'; tok.style.left = x + 'px'; tok.style.top = y + 'px'; tok.style.width = Math.max(22, w * .9).toFixed(1) + 'px';
    tok.innerHTML = tadpoleHTML(' cl-tad--flying', '', hw.reward && hw.reward.itemId === 'seeds' ? hw.reward.img : null);
    fx.appendChild(tok);
    var ax = (i % 2 ? 1 : -1) * (14 + (i % 3) * 10), ay = -46 - (i % 2) * 18;
    tok.animate(presentation().seedTokenFrames(ax, ay, tx, ty), { duration: P.tadFlyMs, easing: 'linear', fill: 'both' });
    presentationDelay(function () { if (current === runtime) tadArrived(); }, P.tadFlyMs);
    presentationDelay(function () { tok.remove(); }, P.tadFlyMs + 60);
  }
  function tadArrived() {
    var hw = current.web, chip = current.el.querySelector('.cl-plate--rescue .cl-plate__seeds');
    if (!hw || !chip) return;
    hw.got++;
    chip.classList.add('is-got');
    var label = chip.querySelector('b'), rew = hw.reward;
    if (label && rew) label.textContent = '×' + (hw.got >= hw.tads.length ? rew.qty : Math.max(1, Math.round(Number(String(rew.qty).split('–')[0]) * hw.got / hw.tads.length)));
    playMotion(chip, [{ scale: '1 1' }, { scale: '1.45 1.45', offset: .3 }, { scale: '.9 .9', offset: .65 }, { scale: '1 1' }], 300, '_clBump');
    var fx = current.el.querySelector('#cl-fx'), m = fxMap(fx), r = chip.getBoundingClientRect();
    sparks(fx, m.x(r.x + r.width * .3), m.y(r.y + r.height * .5), 'web', 0, 6, 26);
  }
                                                                                         
  var RIP_WORDS = ['', 'Rip!', 'Almost!'];
  function rescueMilestone(progress, taps) {
    var hw = current.web, node = webNode(current.el);
    if (!hw || !node) return;
    var third = Math.floor(progress * 3 / taps);
    if (third <= hw.third || progress >= taps) return;
    hw.third = third;
    var c = webPoint(node, presentation().PARAMS.rescue.hub);
    ring(c.fx, c.x, c.y, 'web', c.w * .85);
    threads(c.fx, c.x, c.y, 12, c.w * .45);
    if (RIP_WORDS[third]) abilityLabel(c.fx, RIP_WORDS[third], c.x, c.y - c.h * .44, 'rescue');
    shake(.3);
    rescuePlateBump();
  }
  function rescuePlateBump() {
    var plate = current.el.querySelector('.cl-plate--rescue');
    if (plate) playMotion(plate, [{ scale: '1 1' }, { scale: '1.06 1.1', offset: .3 }, { scale: '.98 .97', offset: .65 }, { scale: '1 1' }], 260, '_clBump');
  }
                                                                               
  function presentRescueTap(res, ev) {
    var hw = current.web, node = webNode(current.el);
    if (!hw || !node) return;
    var P = presentation().PARAMS.rescue, fx = current.el.querySelector('#cl-fx'), m = fxMap(fx), c = webPoint(node, P.hub);
    hw.tapped = true; showWebGuide(false);
    var tx = m.x(ev.clientX), ty = m.y(ev.clientY);
    tapStar(fx, tx, ty);
    webJolt(1);
    threads(fx, c.x, c.y, P.threadsTap, c.w * .3);
    sparks(fx, c.x, c.y, 'web', 0, 6, c.w * .25);
    shake(.14);
    freeTadpoles(res.progress, res.taps);
    if (!res.complete) rescueMilestone(res.progress, res.taps);
    rescuePlateBump();
  }
                                                                                                         
  function presentFrogRescue(event) {
    var hw = current.web, node = webNode(current.el);
    if (!hw || !node) return;
    var P = presentation().PARAMS.rescue, runtime = current;
    var frogs = Array.from(current.el.querySelectorAll('.cl-frog')).filter(function (n) { return !n.hidden && !n._clGone && !n._clDying && !n._clLunging; });
    var frog = frogs.length ? frogs[hw.frogTurn++ % frogs.length] : null, bite = P.bites[hw.frogTurn % P.bites.length];
    var land = function () {
      if (current !== runtime || !current.web || !webNode(current.el)) return;
      webJolt(.6);
      var at = webPoint(node, bite);
      threads(at.fx, at.x, at.y, 4, 38);
      sparks(at.fx, at.x, at.y, 'web', 0, 4, 28);
      freeTadpoles(event.progress, event.taps);
      if (!event.complete) rescueMilestone(event.progress, event.taps);
      rescuePlateBump();
    };
    var strike = frog && frog.querySelector('.cl-strike'), r = frog && frog.getBoundingClientRect(), b = node.getBoundingClientRect();
    if (!strike || !r.width || !b.width) { land(); return; }
    var s = r.width / (frog.offsetWidth || r.width);
    var dx = (b.x + bite[0] * b.width - (r.x + r.width * .5)) / s, dy = (b.y + bite[1] * b.height - (r.y + r.height * .45)) / s;
    rouse(frog);                                                       
    playMotion(strike, presentation().pullFrames(dx, dy, s), P.pullMs, '_clAttack');
    var lunge = {}; frog._clLunging = lunge; frog.style.zIndex = '90000';
    presentationDelay(function () { if (frog._clLunging === lunge) { frog._clLunging = null; if (frog.isConnected) frog.style.zIndex = String(presentation().depth(Number(frog.dataset.footY))); } }, P.pullMs);
    presentationDelay(land, P.pullHitMs);
  }
                                                                                         
                                                                                                   
  function presentRescueBurst() {
    var hw = current.web, el = current.el, node = webNode(el);
    if (!hw || !node || hw.burst) return;
    hw.burst = true;
    var P = presentation().PARAMS.rescue, runtime = current, c = webPoint(node, P.hub);
    showWebGuide(false);
    hitStop();
    flashScreen('rescue', .85);
    var art = node.querySelector('.cl-web-art');
    if (art) {
                                                                            
      ['l', 'r'].forEach(function (side) {
        var half = art.cloneNode(); half.className = 'cl-web-half cl-web-half--' + side;
        art.parentNode.insertBefore(half, art.nextSibling);
        half.animate([{ transform: 'translate(0,0) rotate(0deg)', opacity: 1 }, { transform: 'translate(' + (side === 'l' ? -6 : 6) + 'px,-4px) rotate(' + (side === 'l' ? -4 : 4) + 'deg)', opacity: 1, offset: .2 },
          { transform: 'translate(' + (side === 'l' ? -38 : 38) + 'px,22px) rotate(' + (side === 'l' ? -16 : 16) + 'deg)', opacity: .85, offset: .6 },
          { transform: 'translate(' + (side === 'l' ? -60 : 60) + 'px,70px) rotate(' + (side === 'l' ? -24 : 24) + 'deg)', opacity: 0 }], { duration: P.tearMs, easing: 'cubic-bezier(.3,.1,.6,1)', fill: 'forwards' });
      });
      art.style.visibility = 'hidden';
    }
    node.classList.add('is-torn');
    ring(c.fx, c.x, c.y, 'web', c.w * 1.1);
    presentationDelay(function () { if (current === runtime) ring(c.fx, c.x, c.y, 'kill', c.w * 1.5); }, 120);
    threads(c.fx, c.x, c.y, P.threadsBurst, c.w * .7);
    sparks(c.fx, c.x, c.y, 'web', 0, 18, c.w * .55);
    shake(.8);
    var word = document.createElement('span');
    word.className = 'cl-harvest-word cl-rescue-word'; word.textContent = 'Freed!';
    word.style.left = c.x + 'px'; word.style.top = (c.y - c.h * .5) + 'px';
    c.fx.appendChild(word); presentationDelay(function () { word.remove(); }, 1500);
                                                  
    hw.tads.forEach(function (t, i) { if (!t._clFree) presentationDelay(function () { if (current === runtime) freeTad(i); }, 60 + (i - hw.free) * P.tadGapMs); });
    hw.free = hw.tads.length;
                                           
    (hw.prizes || []).forEach(function (prize, i) {
      var prizeNode = node.querySelector('.cl-web-prize[data-prize="' + prize.table + '"]');
      if (prizeNode) presentationDelay(function () { if (current === runtime) ({ frog: frogFreed, ticket: ticketsFreed }[prize.kind] || gearFreed)(prizeNode, prize); }, 180 + i * P.prizeGapMs);
    });
  }
                                        
  function prizeChip(prize) { return current.el.querySelector('.cl-plate--rescue .cl-plate__prize[data-prize="' + prize.table + '"]'); }
                                                                                                 
                                                                          
  function ticketsFreed(prizeNode, prize) {
    var P = presentation().PARAMS.rescue, runtime = current, fx = current.el.querySelector('#cl-fx'), m = fxMap(fx), r = prizeNode.getBoundingClientRect();
    if (!r.width) return;
    var k = fx.clientWidth / (fx.getBoundingClientRect().width || 1), w = r.width * k, x = m.x(r.x + r.width / 2), y = m.y(r.y + r.height / 2);
    prizeNode.classList.add('is-free');
    var chip = prizeChip(prize), cr = chip && chip.getBoundingClientRect();
    var tx = cr && cr.width ? m.x(cr.x + cr.width / 2) - x : 0, ty = cr && cr.width ? m.y(cr.y + cr.height / 2) - y : -160;
    ring(fx, x, y, 'prize', w * 1.6);
    sparks(fx, x, y, 'prize', 0, 16, w);
    abilityLabel(fx, prize.name + '!', x, y - w * .75, 'prize');
    var n = Math.min(prize.qty, 3), size = Math.round(w * .7), flyMs = P.tadFlyMs * 1.5;
    for (var i = 0; i < n; i++) (function (i) {
      var o = i - (n - 1) / 2, ox = o * w * .3, tok = document.createElement('div');
      tok.className = 'cl-prizetoken cl-ticketfly';
      tok.innerHTML = rescueApi() ? rescueApi().ticketsArtHTML(1, size) : '';
      tok.style.left = (x + ox).toFixed(1) + 'px'; tok.style.top = y + 'px';
      tok.style.width = tok.style.height = size + 'px'; tok.style.margin = (-size / 2) + 'px 0 0 ' + (-size / 2) + 'px';
      fx.appendChild(tok);
      tok.animate(presentation().seedTokenFrames(o * 40, -78 + Math.abs(o) * 14, tx - ox, ty), { duration: flyMs, delay: i * P.ticketGapMs, easing: 'linear', fill: 'both' });
      presentationDelay(function () {
        if (current !== runtime || !chip) return;
        chip.classList.add('is-got');
        playMotion(chip, [{ scale: '1 1' }, { scale: '1.6 1.6', offset: .3 }, { scale: '.9 .9', offset: .65 }, { scale: '1 1' }], 360, '_clBump');
        var cr2 = chip.getBoundingClientRect(); ring(fx, m.x(cr2.x + cr2.width / 2), m.y(cr2.y + cr2.height / 2), 'prize', 70);
        sparks(fx, m.x(cr2.x + cr2.width / 2), m.y(cr2.y + cr2.height / 2), 'prize', 0, 6, 26);
      }, i * P.ticketGapMs + flyMs);
      presentationDelay(function () { tok.remove(); }, i * P.ticketGapMs + flyMs + 60);
    })(i);
  }
                                                                                 
  function gearFreed(prizeNode, prize) {
    var P = presentation().PARAMS.rescue, runtime = current, fx = current.el.querySelector('#cl-fx'), m = fxMap(fx), r = prizeNode.getBoundingClientRect();
    if (!r.width) return;
    var x = m.x(r.x + r.width / 2), y = m.y(r.y + r.height / 2), k = fx.clientWidth / (fx.getBoundingClientRect().width || 1);
    prizeNode.classList.add('is-free');
    var chip = prizeChip(prize), cr = chip && chip.getBoundingClientRect();
    var tx = cr && cr.width ? m.x(cr.x + cr.width / 2) - x : 0, ty = cr && cr.width ? m.y(cr.y + cr.height / 2) - y : -160;
    var tok = document.createElement('div');
    tok.className = 'cl-prizetoken'; tok.innerHTML = rescueApi() ? rescueApi().prizeArtHTML(prize, Math.round(r.width * k)) : '';
    tok.style.left = x + 'px'; tok.style.top = y + 'px'; tok.style.width = tok.style.height = (r.width * k).toFixed(1) + 'px';
    tok.style.margin = (-r.width * k / 2).toFixed(1) + 'px 0 0 ' + (-r.width * k / 2).toFixed(1) + 'px';
    fx.appendChild(tok);
    ring(fx, x, y, 'prize', r.width * k * 1.6);
    sparks(fx, x, y, 'prize', 0, 14, r.width * k);
    abilityLabel(fx, prize.name + '!', x, y - r.height * k * .7, 'prize');
    tok.animate(presentation().seedTokenFrames(0, -70, tx, ty), { duration: P.tadFlyMs * 1.5, easing: 'linear', fill: 'both' });
    presentationDelay(function () {
      if (current !== runtime || !chip) return;
      chip.classList.add('is-got');
      playMotion(chip, [{ scale: '1 1' }, { scale: '1.6 1.6', offset: .3 }, { scale: '.9 .9', offset: .65 }, { scale: '1 1' }], 360, '_clBump');
      var cr2 = chip.getBoundingClientRect(); ring(fx, m.x(cr2.x + cr2.width / 2), m.y(cr2.y + cr2.height / 2), 'prize', 70);
    }, P.tadFlyMs * 1.5);
    presentationDelay(function () { tok.remove(); }, P.tadFlyMs * 1.5 + 60);
  }
                                                                                          
  function frogFreed(prizeNode, prize) {
    var P = presentation().PARAMS.rescue, runtime = current, el = current.el, fx = el.querySelector('#cl-fx'), m = fxMap(fx);
    var r = prizeNode.getBoundingClientRect(), wn = webNode(el), wb = wn && wn.getBoundingClientRect();
    if (!r.width || !wb) return;
    prizeNode.classList.add('is-free', 'is-saved');
    var chip = prizeChip(prize);
    if (chip) { chip.classList.add('is-got'); playMotion(chip, [{ scale: '1 1' }, { scale: '1.6 1.6', offset: .3 }, { scale: '.9 .9', offset: .65 }, { scale: '1 1' }], 360, '_clBump'); }
    var k = fx.clientWidth / (fx.getBoundingClientRect().width || 1);
    var dy = (wb.y + wb.height * P.footFy - (r.y + r.height)) * k;                             
    var body = prizeNode.querySelector('.cl-web-prize__art');
    var drop = body.animate(presentation().dropFrames(dy), { duration: P.frogDropMs, easing: 'cubic-bezier(.4,0,.7,1)', fill: 'forwards' });
    presentationDelay(function () {
      if (current !== runtime) return;
      var x = m.x(r.x + r.width / 2), y = m.y(r.y + r.height) + dy;
      ring(fx, x, y - 6, 'prize', r.width * k * 1.3);
      sparks(fx, x, y - r.height * k * .4, 'prize', 0, 14, r.width * k * .9);
      shake(.35);
      var bubble = document.createElement('span');
      bubble.className = 'cl-rescue-bubble'; bubble.textContent = 'Thank you!';
      bubble.style.left = x + 'px'; bubble.style.top = (y - r.height * k * 1.02) + 'px';
      fx.appendChild(bubble); presentationDelay(function () { bubble.remove(); }, P.frogHomeAtMs + 200);
                                                       
      body.animate([{ transform: 'translate(0px,' + dy + 'px) scale(1,1)' }, { transform: 'translate(0px,' + (dy - 40) + 'px) scale(.92,1.1)', offset: .25 }, { transform: 'translate(0px,' + dy + 'px) scale(1.12,.88)', offset: .5 },
        { transform: 'translate(0px,' + (dy - 32) + 'px) scale(.94,1.08)', offset: .75 }, { transform: 'translate(0px,' + dy + 'px) scale(1,1)' }], { duration: P.frogCheerMs, fill: 'forwards' });
      presentationDelay(function () {
        if (current !== runtime || !body.isConnected) return;
        var away = -(r.x + r.width) * k - 40, face = body.querySelector('.cl-frog-face');
        if (face) face.classList.add('is-homeward');                                      
        body.animate(presentation().homeFrames(away, dy), { duration: P.frogHomeMs, easing: 'linear', fill: 'forwards' });
      }, P.frogHomeAtMs);
    }, P.frogDropMs);
  }
                                                       
  function presentRescue(el, hv) {
    if (current.bloomWave !== current.fight.currentWaveIndex()) startRescue(el, hv);
    var node = webNode(el);
    if (node) node.style.setProperty('--cl-torn', (hv.progress / hv.taps).toFixed(3));
  }
  function rescuePlateHTML(hv) {
    var hw = current.web, info = (hw && hw.info) || webInfo(hv.web), rew = hw && hw.reward, prizes = (hw && hw.prizes) || [];
    var tadImg = rescueApi() ? rescueApi().TADPOLE_ICON : 'assets/ui2/currency/tadpoles.png';
    return '<div class="cl-plate cl-plate--harvest cl-plate--rescue' + (prizes.length > 1 ? ' cl-plate--prizes2' : '') + '" data-key="rescue">'
      + '<span class="cl-plate__art"><img src="' + escHTML(info.art) + '" alt="" draggable="false"></span>'
      + '<span class="cl-plate__info"><span class="cl-plate__name">' + escHTML(info.name) + '</span><span class="cl-plate__bar"><i></i></span></span>'
      + (rew ? '<span class="cl-plate__seeds' + (hw.got ? ' is-got' : '') + '"><img src="' + tadImg + '" alt="" draggable="false"><b>×' + escHTML(rew.qty) + '</b></span>' : '')
      + prizes.map(function (prize) {
        return '<span class="cl-plate__prize cl-plate__prize--' + prize.kind + '" data-prize="' + escHTML(prize.table) + '">' + (prize.kind === 'frog' ? '<b>+1</b>' : '')
          + (rescueApi() ? (prize.kind === 'ticket' ? rescueApi().ticketsArtHTML(1, 28) : rescueApi().prizeArtHTML(prize, 28)) : '')
          + (prize.kind === 'ticket' ? '<b>×' + escHTML(prize.qty) + '</b>' : '') + '</span>';
      }).join('')
      + '</div>';
  }

  function unitNode(side, id) {
    if(side==='frog') return Array.from(current.el.querySelectorAll('.cl-frog')).find(function(n){return n.dataset.id===String(id);});
    var enemy=current.fight.enemies().find(function(e){return e.id===id;});
    return enemy && Array.from(current.el.querySelectorAll('.cl-foe')).find(function(n){
      return n.dataset.wave===String(current.fight.currentWaveIndex()) && (current.enemyRoster.individual ? n.dataset.id===String(id) : n.dataset.catalog===enemy.defId);
    });
  }

                                                                                                   
                                                                                                   
                                                                                              
                                                                                                 
                                                                                                  
                                                                                               
                                                         
  function hurtFoe(target, blow, died, crit) {
    var img = target && target.querySelector('.cl-foe-motion img');
    if (!img) return;
    var CP = presentation(), P = CP.PARAMS, now = typeof performance !== 'undefined' ? performance.now() : Date.now();
    if (blow !== 'dot' && !img._clRigid) {
      var tierName = CP.tier(target.dataset.catalog || '', target.classList.contains('cl-foe--boss'));
      playMotion(img, CP.foeHurtMotion(CP.foeHurtAmp(blow, tierName, died, crit, reducedMotion())), P.foeHurt.ms, '_clHit', 'linear');
    }
    if (img._clHitAt && now - img._clHitAt < P.foeHitMs + P.foeHitRestMs) return;
    img._clHitAt = now;
    playMotion(img._clRigid ? img.parentNode : img, CP.foeHurtTint(CP.foeHurtAmp(blow, 'regular', died, crit, false)), P.foeHitMs, '_clTint', 'linear');
  }
                                                                                      
                                                                             
  function swingWeapon(source, leapMs) {
    var sw = presentation().swingFrames(), hold = window.FrogArms && window.FrogArms.holdFrames(source, sw);
    playMotion(source.querySelector('.fs-weapon-arm'), hold ? hold.weapon : sw, leapMs, '_clSwing');
    if (hold) playMotion(hold.armEl, hold.arm, leapMs, '_clSwing');
  }
                                                                                            
                                                                                                
                                                                                              
                                                                                                   
                                                                                            
                                      
  function frogStack(node) { return node && node.querySelector('.frog-stack'); }
  function gaitOf(node) { var st = frogStack(node); return (st && st.dataset.gait) || 'hop'; }
  function artFrame(stack) { var b = stack && stack.querySelector('img.fs-body'); return (b && b.offsetWidth) || 140; }
  function arms() { return typeof FrogArms !== 'undefined' ? FrogArms : null; }
                                                                      
  function rouse(node) {
    var st = frogStack(node);
    if (arms() && st) arms().stopIdle(st);
    if (node && node._clFlop) { node._clFlop.cancel(); node._clFlop = null; }
  }
                                                                                                  
                                                    
  function frogLeap(source, dx, dy, scale) {
    var CP = presentation(), P = CP.PARAMS, leapMs = CP.attackMs(), gait = gaitOf(source), stack = frogStack(source);
    rouse(source);
    playMotion(source.querySelector('.cl-strike'), CP.jumpFrames(dx, dy, scale, gait), leapMs, '_clAttack');
    swingWeapon(source, leapMs);
    if (stack) {
      var sf = (reducedMotion() && (gait === 'roll' || gait === 'leap')) ? null : CP.leapStackFrames(gait, artFrame(stack));                                        
      if (sf) playMotion(stack, sf.frames, sf.ms, '_clGait');
      if (arms()) {
        var tl = { windup: P.windupMs / leapMs, hit: (P.windupMs + P.jumpMs) / leapMs, back: (P.windupMs + P.jumpMs + P.holdMs) / leapMs, land: (leapMs - P.settleMs) / leapMs };
        arms().leapArms(stack, gait, tl).forEach(function (m) { playMotion(m.el, m.frames, leapMs, '_clArm'); });
      }
    }
    return leapMs;
  }
                                                                                                    
                                                                                            
  function marchGait(node, gait, t, dur) {
    var stack = frogStack(node); if (!stack) return;
    if (!stack._clMarch) {
      stack._clMarch = true; rouse(node);
      [stack].concat(Array.from(stack.querySelectorAll('img.fs-arm,.fs-weapon-arm,.fs-shield-arm'))).forEach(function (n) { ['_clGait', '_clArm'].forEach(function (k) { if (n[k]) n[k].cancel(); }); });
    }
    var CP = presentation(), pose = CP.marchPose(gait, t, dur, !!stack.dataset.flop);
    if (pose.spin && reducedMotion()) pose.spin = 0;                                                                       
    var st = CP.stackStyle(pose, artFrame(stack));
    stack.style.translate = st.translate; stack.style.rotate = st.rotate; stack.style.scale = st.scale;
    if (arms() && stack.dataset.arms === 'walk') arms().pose(stack, arms().marchAngles(pose.swing, pose.fling));
    else if (arms() && pose.arms) arms().pose(stack, pose.arms);                                               
    if (arms() && pose.legs && arms().legs) arms().legs(stack, pose.legs);                             
                                                                                                                          
                                                                                                                      
    if (gait === 'crawl' && typeof FrogGait !== 'undefined' && FrogGait.bubble) {
      var every = CP.PARAMS.gait.crawl.bubbleMs / 1000, nth = Math.floor(t / every);
      if (nth > (stack._clBubbleN == null ? -1 : stack._clBubbleN)) {
        stack._clBubbleN = nth;
        var w = node.offsetWidth || 120, h = node.offsetHeight || 120;
        FrogGait.bubble(node, w * (0.06 + 0.08 * Math.random()), h * (0.81 - 0.04 * Math.random()), artFrame(stack) * CP.PARAMS.gait.size, false);
      }
    }
  }
  function endMarch(node) {
    var stack = frogStack(node); if (!stack || !stack._clMarch) return;
    stack._clMarch = false; stack._clBubbleN = null; stack.style.translate = stack.style.rotate = stack.style.scale = '';
    if (arms()) { arms().pose(stack, null); if (arms().legs) arms().legs(stack, null); }
    var G = typeof FrogGait !== 'undefined' ? FrogGait : null;
    if (G && G.flop && !node.hidden && !node._clDying) node._clFlop = G.flop(stack, { holdMs: G.PARAMS.flop.battleHoldMs, onDone: function () { node._clFlop = null; } });
  }
                                                                                              
  function cheerGait(node, opts) {
    var stack = frogStack(node); if (!stack) return;
    rouse(node);
    var sf = reducedMotion() ? null : presentation().cheerStackFrames(gaitOf(node), artFrame(stack));                                                
    if (sf) { if (stack._clCheer) stack._clCheer.cancel(); stack._clCheer = stack.animate(sf, opts); }
    if (arms()) arms().cheerArms(stack).forEach(function (m) { if (m.el._clCheer) m.el._clCheer.cancel(); m.el._clCheer = m.el.animate(m.frames, opts); });
  }
                                                                                            
                                                                                                         
                                 
  function idleActs(el) {
    var A = arms(); if (!A || !A.slap) return;
    var B = A.PARAMS.battle, now = performance.now(), calm = !current.travel && !current.cheering;
    el.querySelectorAll('.cl-frog').forEach(function (node) {
      var stack = frogStack(node); if (!stack) return;
      var slaps = stack.dataset.arms === 'slap', idle = A.idleMove && A.idleMove(stack.dataset.idle);
      if (!slaps && !idle) return;
      var strike = node.querySelector('.cl-strike'), busy = node._clLunging || node._clFlop || (strike && strike._clAttack && strike._clAttack.playState === 'running');
      if (!calm || busy || node.hidden || node._clDying || node._clGone || node._clPerchZ) { node._clStandAt = null; return; }
      if (node._clStandAt == null) { node._clStandAt = now; node._clActAt = now + B.standMs + Math.random() * B.jitterMs; return; }
      if (now < node._clActAt || stack._faBusy) return;
                                          
      var useIdle = idle && (!slaps || Math.random() < 0.5), ms = useIdle ? idle(node, stack) : A.slap(node, stack);
      stack._faBusy = true; presentationDelay(function () { stack._faBusy = false; }, (ms || 0) + 60);
      var gap = useIdle ? A.PARAMS[stack.dataset.idle].gapMs : A.PARAMS.slap.gapMs;
      node._clActAt = now + (ms || 0) + gap[0] + Math.random() * (gap[1] - gap[0]);
    });
  }
  function playMotion(node, frames, duration, key, easing) {
    if (!node) return;
    if (node[key]) node[key].cancel();
    var animation = node.animate(frames, { duration: duration, easing: easing || ((key==='_clAttack'||key==='_clSwing'||key==='_clGait'||key==='_clArm')?'linear':'ease-out') });
    node[key] = animation;
    if (key !== '_clHit' && key !== '_clTint') node.style.willChange = 'transform';
    function releaseHint() {
                                                                     
      if (node[key] === animation) node.style.willChange = '';
    }
    animation.onfinish = releaseHint;
    animation.oncancel = releaseHint;
  }
  function setFlag(node,name,on){if(on){if(node.dataset[name]!=='1')node.dataset[name]='1';}else if(node.dataset[name])delete node.dataset[name];}
                                                                                 
  function unitPoint(side,id,fy){
    var r=current.unitRects[side+':'+id],fx=current.el.querySelector('#cl-fx');
    if(!r||!fx)return null;
    var m=fxMap(fx);return {fx:fx,x:m.x(r.x+r.width*.5),y:m.y(r.y+r.height*fy),w:r.width*(fx.clientWidth/(fx.getBoundingClientRect().width||1))};
  }
                                                                                   
  function abilityLabel(fx,text,x,y,kind){
    var label=document.createElement('span');label.className='cl-dmg cl-ability cl-ability--'+kind;label.textContent=text;
    label.style.left=x+'px';label.style.top=y+'px';fx.appendChild(label);presentationDelay(function(){label.remove();},900);
  }
  var STATUS_WORD={freeze:'Freeze!',slow:'Slow!',burn:'Burn!',stealth:'Sneak!',poison_cloud:'Spores!'};
                                                                             
  function presentAbilityEvent(event,runtime){
    var P=presentation().PARAMS;
    if(event.type==='status'){
                                                                  
      var onHit=event.ability==='freeze'||event.ability==='slow'||event.ability==='burn';
      presentationDelay(function(){
        if(current!==runtime)return;
        if(event.ability==='shield_cycle'){var s=unitPoint('frog',event.to,.5);if(s)ring(s.fx,s.x,s.y,'shield',Math.max(70,s.w*.8));return;}
        if(event.ability==='stealth'){
          var c=unitPoint('frog',event.to,.15),node=unitNode('frog',event.to);
          if(c)abilityLabel(c.fx,STATUS_WORD.stealth,c.x,c.y,'stealth');
          playMotion(node&&node.querySelector('.cl-frog-face'),[{opacity:1},{opacity:.25,offset:.3},{opacity:.25,offset:.7},{opacity:1}],600,'_clStealth');
          return;
        }
        if(event.ability==='poison_cloud'){
          var src=unitPoint('frog',event.from,.15);if(src)abilityLabel(src.fx,STATUS_WORD.poison_cloud,src.x,src.y,'poison');
          current.fight.enemies().forEach(function(e){var q=e.hp>0&&unitPoint('enemy',e.id,.5);if(q){ring(q.fx,q.x,q.y,'poison',Math.max(80,q.w));sparks(q.fx,q.x,q.y,'poison',0,6,46);}});
          return;
        }
        if(!event.fresh)return;
        var p=unitPoint('enemy',event.to,.02);
        if(p)abilityLabel(p.fx,STATUS_WORD[event.ability],p.x,p.y,event.ability);
        if(p&&event.ability==='freeze')sparks(p.fx,p.x,p.y+p.w*.3,'ice',0,7,48);
      },onHit?presentation().contactMs('frog'):0);
    }else if(event.type==='heal'){
      var h=unitPoint('frog',event.to,.2),hb=unitPoint('frog',event.to,.55);
      if(h){var label=damageAt(h.fx,event.amount,h.x,h.y,'heal');label.textContent='+'+fmt(event.amount);}
      if(hb){ring(hb.fx,hb.x,hb.y,'heal',Math.max(70,hb.w*.8));sparks(hb.fx,hb.x,hb.y,'heal',0,6,42);}
    }else if(event.type==='dot'){
      var d=unitPoint('enemy',event.to,.25);
      if(d){damageAt(d.fx,event.dmg,d.x,d.y,event.kind);sparks(d.fx,d.x,d.y+d.w*.2,event.kind,0,4,30);}
      var foe=unitNode('enemy',event.to);
      if(foe&&event.dmg>0)hurtFoe(foe,'dot');
    }
  }
                                                                                                                
                                                                                                                  
                                                                                                      
  function frameBudget(enemyId) {
    var e = current && current.fight.enemies().find(function (u) { return u.id === enemyId; }), C = getFPConfig();
    if (!e || !(e.cadence > 0)) return 0;
    return e.cadence * (1 - C.value('MergeRules', 'combat_attack_jitter_fraction')) / C.value('MergeRules', 'combat_time_scale') * 1000 - PRESENTATION_PARAMS.strikeGapMs;
  }
                                                                                                                     
                                                           
  function frameRoom(node, w, k) {
    var el = current.el, g = stageGround(el.getBoundingClientRect()), foot = Number(node.dataset.footY), left = parseFloat(node.style.left) || 0;
    if (!(foot > 0)) return null;
    return { up: Math.max(0, foot - g.top) / k, down: Math.max(0, g.bottom - foot) / k, left: (left + w * .2) / k, right: (el.clientWidth - left - w + w * .2) / k };
  }
                                                                                             
                                                                                                 
                                                                                                
  function presentFrameLeap(node, fr, event, batch, runtime) {
    var key = event.from + '@' + event.t;
    if (runtime.leaps[key]) return;
    runtime.leaps[key] = true;
    var img = node.querySelector('.cl-foe-motion img');
    if (!img) return;
    if (node._clLeap) node._clLeap.cancel();
    var r = node.getBoundingClientRect(), w = node.offsetWidth || r.width, box = presentation().frameBox(fr), xs = 0, ys = 0, hs = 0, n = 0;
    batch.forEach(function (e) {
      var tr = e.type === 'attack' && e.side === 'enemy' && e.from === event.from && e.t === event.t && current.unitRects['frog:' + e.to];
      if (tr) { xs += tr.x + tr.width / 2; ys += tr.y + tr.height; hs += tr.height; n++; }
    });
    if (!n || !r.width) return;
    if (fr.lash) return presentLash(node, img, fr, xs / n, ys / n, runtime);
                                                                                    
    var k = r.width / w, move = presentation().frameLeap(fr,
      (xs / n - r.x - box.bodyX * r.width) / k, (ys / n - (fr.slash ? hs / n / 2 : 0) - r.y - box.feetY * r.width) / k, w * (fr.arc || presentation().PARAMS.frameLeapArc), w * box.perCell,
      { budget: frameBudget(event.from), room: frameRoom(node, w, k) });
    var token = {};
    node._clFrameMove = node._clLunging = token; node.style.zIndex = '90000';
    node._clLeap = node.animate(move.keyframes, { duration: move.totalMs, easing: 'linear' });
    move.steps.forEach(function (s) {
      function show() {
        if (current !== runtime || node._clFrameMove !== token || node._clDead || !img.isConnected) return;
        img.src = frameSrc(fr, s.name); img.style.transform = s.flip ? 'scaleX(-1)' : '';
      }
      if (s.at) presentationDelay(show, s.at); else show();
    });
    if (fr.shot) presentationDelay(function () { if (current === runtime) presentShot(node, fr, xs / n, ys / n, hs / n); }, move.shotAt);
    if (fr.slash) glowCracks(move.contactMs);
    presentationDelay(function () {
      if (node._clLunging === token) { node._clLunging = null; if (node.isConnected) node.style.zIndex = String(presentation().depth(Number(node.dataset.footY))); }
    }, move.totalMs);
  }
                                                                                                 
                                                                                                   
                                                                                                     
                                                                                                   
                                                                                                  
                                                                                    
  function presentLash(node, img, fr, tx, ty, runtime) {
                                                                                                  
    var CP = presentation(), motion = img.parentNode, r = node.getBoundingClientRect(), s = r.width / (node.offsetWidth || r.width);
    if (!img.offsetWidth || !img.offsetHeight) return;
    var cx = (tx - r.x - img.offsetLeft * s) / (img.offsetWidth * s) * fr.cell.w;
    var cy = (ty - r.y - (motion.offsetTop + img.offsetTop) * s) / (img.offsetHeight * s) * fr.cell.h;
    var head = CP.lashPick(fr, cx, cy, node._clLashHead), bend = CP.lashBend(fr, head, cx, cy);
    node._clLashHead = head;
    var cssX = img.offsetWidth / fr.cell.w, cssY = img.offsetHeight / fr.cell.h, box = CP.frameBox(fr);
    var move = CP.frameLash(fr, head, cssX);
    (node._clLashParts || []).forEach(function (p) { p.remove(); });
    var parts = ['vine', 'head'].map(function (kind) {
      var p = document.createElement('img'); p.className = 'cl-lash cl-lash--' + kind; p.alt = ''; p.draggable = false; p.hidden = true;
      motion.appendChild(p); return p;
    });
    function pct(v) { return (v * 100).toFixed(3) + '%'; }
    function place(p, b) { p.style.left = pct(box.left + b.x * box.perCell); p.style.top = pct(box.top + b.y * box.perCell); p.style.width = pct(b.w * box.perCell); p.style.height = pct(b.h * box.perCell); }
    var token = {};
    node._clFrameMove = node._clLunging = token; node._clLashParts = parts; node.style.zIndex = '90000';
    img._clRigid = true; img.style.animation = 'none';
    if (img._clHit) img._clHit.cancel();                                                     
    if (img._clTint) img._clTint.cancel();                                       
    node._clLeap = node.animate(move.keyframes, { duration: move.totalMs, easing: 'linear' });
    move.steps.forEach(function (s) {
      function show() {
        if (current !== runtime || node._clFrameMove !== token || node._clDead || !img.isConnected) return;
        img.src = frameSrc(fr, s.name);
        var piece = fr.lash.pieces[s.name], pose = piece && CP.lashPose(fr, s.name, bend, cssX, cssY);
        parts.forEach(function (p) { p.hidden = !pose; });
        if (!pose) return;
        parts[0].src = frameSrc(fr, s.name + '_vine'); place(parts[0], piece.vine); parts[0].style.transform = pose.vine;
        parts[1].src = frameSrc(fr, s.name + '_head'); place(parts[1], piece.head); parts[1].style.transform = 'translate(' + pose.dx + 'px,' + pose.dy + 'px)';
      }
      if (s.at) presentationDelay(show, s.at); else show();
    });
    presentationDelay(function () {
      if (node._clFrameMove !== token) return;
      parts.forEach(function (p) { p.remove(); });
      node._clLashParts = null; img._clRigid = false; img.style.animation = ''; img.style.animationDelay = '0s';
      if (node._clLunging === token) { node._clLunging = null; if (node.isConnected) node.style.zIndex = String(presentation().depth(Number(node.dataset.footY))); }
    }, move.totalMs);
  }
                                                                                                 
                                                                                              
                                                                                                
                                                                                               
                                                                                                    
                                                                                
  function presentShot(node, fr, tx, ty, th) {
    var s = fr.shot, S = presentation().PARAMS.frameSpit, img = node.querySelector('.cl-foe-motion img'), fx = current.el.querySelector('#cl-fx');
    if (!img || !fx || !img.isConnected) return;
    var ir = img.getBoundingClientRect(), k = ir.width / fr.cell.w, m = fxMap(fx), fxPx = m.box({ x: 0, y: 0, width: k, height: k }).width;
    if (!fxPx) return;
    var mx = m.x(ir.x + s.mouth.x * k), my = m.y(ir.y + s.mouth.y * k), lx = m.x(tx), gy = m.y(ty), ly = m.y(ty - th * S.aimUp);
    if (s.drop) {                                                                                        
      var dz = function (lyy) { return Math.max(presentation().frameShotScale(fr, Math.hypot(lx - mx, lyy - my), fxPx) * fxPx, S.splashMinScale * fxPx); };
      ly = gy - s.drop * dz(gy - s.drop * fxPx); ly = gy - s.drop * dz(ly);
    }
    var path = presentation().frameShot(fr, lx - mx, ly - my), q = presentation().frameShotScale(fr, Math.hypot(lx - mx, ly - my), fxPx) * fxPx;
    var ball = document.createElement('img');
    ball.className = 'cl-shot'; ball.alt = ''; ball.draggable = false; ball.src = frameSrc(fr, path.steps[0].name);
    ball.style.left = mx + 'px'; ball.style.top = my + 'px';
    ball.style.width = s.cell.w * q + 'px'; ball.style.height = s.cell.h * q + 'px';
    ball.style.marginLeft = -s.head.x * q + 'px'; ball.style.marginTop = -s.head.y * q + 'px';
    ball.style.transformOrigin = s.head.x * q + 'px ' + s.head.y * q + 'px'; ball.style.transform = 'rotate(' + path.angle + 'deg)';
    fx.appendChild(ball);
    ball.animate(path.keyframes, { duration: path.flightMs, easing: 'linear', fill: 'forwards' });
    path.steps.forEach(function (st) { if (st.at) presentationDelay(function () { if (ball.isConnected) ball.src = frameSrc(fr, st.name); }, st.at); });
    presentationDelay(function () {
      ball.remove();
      var i = s.impact, seq = i.seq || [[i.name, i.ms]], ms = 0, z = Math.max(q, S.splashMinScale * fxPx), splash = document.createElement('img');
      splash.className = 'cl-splash'; splash.alt = ''; splash.draggable = false; splash.src = frameSrc(fr, seq[0][0]);
      splash.style.left = lx - i.x * z + 'px'; splash.style.top = gy - i.y * z + 'px';
      splash.style.width = i.w * z + 'px'; splash.style.height = i.h * z + 'px';
      splash.style.transformOrigin = i.x * z + 'px ' + i.y * z + 'px';
      fx.appendChild(splash);
      seq.forEach(function (st) {
        if (ms) presentationDelay(function () { if (splash.isConnected) splash.src = frameSrc(fr, st[0]); }, ms);
        ms += st[1];
      });
                                                                                                            
      splash.animate(i.seq ? [{ transform: 'scale(1.06,.9)', opacity: 1 }, { transform: 'scale(1,1)', opacity: 1, offset: .2 },
        { transform: 'scale(1,1)', opacity: 1, offset: .75 }, { transform: 'scale(1.03,.94)', opacity: 0 }]
        : [{ transform: 'scale(.3,.15)', opacity: 1 }, { transform: 'scale(1.1,1.15)', opacity: 1, offset: .28 },
        { transform: 'scale(1,1)', opacity: 1, offset: .55 }, { transform: 'scale(1.06,.86)', opacity: 0 }], { duration: ms, easing: 'ease-out', fill: 'forwards' });
      presentationDelay(function () { splash.remove(); }, ms);
    }, path.flightMs);
  }
                                                                              
                                                                              
                                                                               
                                                                               
  function orbTierOf(runtime) {
    var t = runtime && runtime.opts && runtime.opts.tier;
    return t && presentation().PARAMS.orbs.tiers[t] ? t : null;
  }
  function fireOrbs(fx, m, sr, tr, event, batch, tierKey, runtime) {
    var CP = presentation(), O = CP.PARAMS.orbs, targets = 0;
    batch.forEach(function (e) { if (e.type === 'attack' && e.side === 'enemy' && e.from === event.from && e.t === event.t) targets++; });
    var n = CP.orbCount(tierKey, targets, runtime.orbLive || 0, reducedMotion());
    var sx = m.x(sr.x + sr.width * .08), sy = m.y(sr.y + sr.height * .45), fb = m.box(tr);
    runtime.orbN = (runtime.orbN || 0) + 1;
    var rand = CP.layoutRng(runtime.layoutSeed + ':orb:' + runtime.orbN);
    var shots = CP.orbVolley(tierKey, n, fb.x + fb.width * .5 - sx, fb.y + fb.height * .55 - sy, CP.contactMs('enemy'), rand, fb.width * .28, fb.height * .22);
    var box = document.createElement('div'), end = 0;
    box.className = 'cl-orbs cl-orbs--' + tierKey;
    box.style.left = sx + 'px'; box.style.top = sy + 'px';
    box.style.setProperty('--orb', Math.round(O.tiers[tierKey].sizePx * CP.unitScale(fx.clientWidth)) + 'px');
    var flash = document.createElement('b'); box.appendChild(flash);                                   
    flash.animate([{ transform: 'scale(.3)', opacity: .95 }, { transform: 'scale(1.35)', opacity: .75, offset: .45 }, { transform: 'scale(.5)', opacity: 0 }],
      { duration: O.tiers[tierKey].sprayMs + 140, fill: 'forwards' });
    shots.forEach(function (s) {
      var orb = document.createElement('i'); box.appendChild(orb);
      orb.animate(s.keyframes, { duration: s.duration, delay: s.delay, fill: 'both', easing: 'linear' });
      end = Math.max(end, s.delay + s.duration);
    });
    fx.appendChild(box);
    runtime.orbLive = (runtime.orbLive || 0) + shots.length;
    presentationDelay(function () { box.remove(); runtime.orbLive = Math.max(0, (runtime.orbLive || 0) - shots.length); }, end + 40);
  }
  function presentEvents() {
    if (!current) return;
    var runtime=current, batch=current.events.splice(0), P=presentation().PARAMS, smashes=[];
    batch.forEach(function(event){
                                                                                                                                 
      if(event.type==='rock'){
        if(event.by==='smash'){smashes.push(event);return;}
        var rr=current.unitRects['enemy:'+event.to],ix=rr?rr.x+rr.width*.5:null,iy=rr?rr.y+rr.height*.55:null;
        presentationDelay(function(){if(current===runtime)presentRuinChip(event,ix,iy);},event.by==='attack'?presentation().contactMs('frog'):0);
        return;
      }
      if(event.type==='status'||event.type==='heal'||event.type==='dot'){presentAbilityEvent(event,runtime);return;}
                                                                                                  
                                                                 
      if(event.type==='harvest'){if(event.by==='frogs'){if(current.web)presentFrogRescue(event);else presentFrogHarvest(event);}return;}
      if(event.type==='harvested'){if(event.web)presentRescueBurst();else presentHarvestBurst();return;}
      if(event.type!=='attack')return;
      var targetSide=event.side==='frog'?'enemy':'frog';
                                                             
      var fr=event.side==='enemy'&&foeFrames(current.fight.enemies().find(function(e){return e.id===event.from;}));
      var contactMs=fr?presentation().frameContactMs(fr,frameBudget(event.from)):presentation().contactMs(event.side)+(event.extra?PRESENTATION_PARAMS.doubleStrikeLagMs:0);
                                                                              
      if(event.side==='enemy')presentationDelay(function(){if(current===runtime)landFrogHit(event);},contactMs);
      var source=unitNode(event.side,event.from),target=unitNode(targetSide,event.to);
      var sr=source&&source.getBoundingClientRect(),tr=current.unitRects[targetSide+':'+event.to];
      if(!tr)return;
      var fx=current.el.querySelector('#cl-fx'),m=fxMap(fx);
      var x=m.x(tr.x+tr.width*.3),y=m.y(tr.y+tr.height*.3);
                                                       
      var headX=m.x(tr.x+tr.width*.5),headY=m.y(tr.y+tr.height*(targetSide==='frog'?.2:.06));
      var unit=(targetSide==='frog'?current.fight.frogs():current.fight.enemies()).find(function(u){return u.id===event.to;});
      var frac=unit&&unit.maxHp>0?event.dmg/unit.maxHp:0,died=event.hpAfter<=0;
                                                                                               
                                                                                        
      var blow=event.side==='enemy'?presentation().blowFrom(fr,m.x(tr.x+tr.width*.5)-(sr?m.x(sr.x+sr.width*.1):m.x(tr.x+tr.width*.5)+1),
        m.y(tr.y+tr.height*.55)-(sr?m.y(sr.y+sr.height*.45):m.y(tr.y+tr.height*.55))):null;
                                                              
      if(source&&sr&&!source.hidden&&!source._clDead&&!event.extra){
        var motion=source.querySelector(event.side==='frog'?'.cl-strike':'.cl-foe-motion');
        if(event.side==='frog'){
          var scale=sr.width/(source.offsetWidth||sr.width);
          var dx=(tr.x+tr.width*.3-sr.x-sr.width*.95)/scale;
          var dy=(tr.y+tr.height*.3-sr.y-sr.height*.6)/scale;
          var leapMs=frogLeap(source,dx,dy,scale);
          var lunge={};source._clLunging=lunge;source.style.zIndex='90000';
          presentationDelay(function(){if(source._clLunging===lunge){source._clLunging=null;if(source.isConnected)source.style.zIndex=String(presentation().depth(Number(source.dataset.footY)));}},leapMs);
        }else if(fr){
          presentFrameLeap(source,fr,event,batch,runtime);
        }else{
                                                                         
                                                                         
                                                                        
                                                      
          playMotion(motion,[{transform:'translateX(0) scale(1,1)'},{transform:'translateX(9px) scale(1.08,.9)',offset:.2},{transform:'translateX(-26px) scale(1.06,.95)',offset:.4},{transform:'translateX(-18px) scale(1,1)',offset:.75},{transform:'translateX(0) scale(1,1)'}],P.stateMs,'_clAttack');
          var enemy=current.fight.enemies().find(function(e){return e.id===event.from;}),img=source.querySelector('img');
          if(img&&enemy){img.src=enemyArtPath(enemy,'attack');presentationDelay(function(){if(img.isConnected&&!source._clDead)img.src=enemyArtPath(enemy);},P.stateMs);}
          var record=enemy&&creatureArt()[enemy.defId],orbTier=orbTierOf(runtime);
          if(orbTier)fireOrbs(fx,m,sr,tr,event,batch,orbTier,runtime);
          else{
          var effect=document.createElement('img');effect.className='cl-projectile';effect.alt='';
          effect.src=record&&record.attack_effect||'assets/expeditions/vfx/creature_attack_fallback.png';
          var startX=m.x(sr.x+sr.width*.05),startY=m.y(sr.y+sr.height*.42),ex=headX-startX,ey=m.y(tr.y+tr.height*.55)-startY;
          effect.style.left=startX+'px';effect.style.top=startY+'px';effect.style.height=Math.max(36,sr.height*.95)+'px';fx.appendChild(effect);
          var hitAt=P.effectTravelMs/(P.effectTravelMs+P.effectFadeMs);
          effect.animate([{transform:'translate(0,0) scale(.6)',opacity:0},{transform:'translate('+ex*.06+'px,'+ey*.06+'px) scale(1)',opacity:.95,offset:hitAt*.18},
            {transform:'translate('+ex*.55+'px,'+ey*.55+'px) scale(1)',opacity:.7,offset:hitAt*.6},{transform:'translate('+ex+'px,'+ey+'px) scale(.95)',opacity:.35,offset:hitAt},
            {transform:'translate('+ex*1.08+'px,'+ey*1.08+'px) scale(.9)',opacity:0}],{duration:P.effectTravelMs+P.effectFadeMs,fill:'forwards'});
          presentationDelay(function(){effect.remove();},P.effectTravelMs+P.effectFadeMs);
          }
        }
      }
                                                                                
      presentationDelay(function(){
        if(current!==runtime)return;
        if(event.dodged&&target){
          playMotion(target.querySelector('.cl-hop'),[{transform:'translateY(0)'},{transform:'translateY(-65px) scale(1.06)',offset:.38},{transform:'translateY(0)'}],PRESENTATION_PARAMS.dodgeDurationMs,'_clDodge');
          var label=document.createElement('span');label.className='cl-dmg cl-dodge';label.textContent='Dodge!';label.style.left=x+'px';label.style.top=(y-tr.height/3)+'px';fx.appendChild(label);presentationDelay(function(){label.remove();},700);
                                                                   
          if(dodgeTipWanted()){var hopNode=target.querySelector('.cl-hop')||target;presentationDelay(function(){if(current===runtime)showDodgeTip(hopNode);},PRESENTATION_PARAMS.dodgeDurationMs*.38);}
        }else if(event.blocked){
          var sb=unitPoint('frog',event.to,.5);if(sb)ring(sb.fx,sb.x,sb.y,'shield',Math.max(80,sb.w));
          abilityLabel(fx,'Blocked!',headX,headY,'shield');
        }else if(event.side==='frog'){
                                                                             
                                                                                 
                                                                               
          burst(fx,x,y,sr?Math.max(56,sr.height*.95):90);
          sparks(fx,x,y,died?'kill':'foe',1,died?10:6,died?78:52);
          damageAt(fx,event.dmg,headX,headY,'foe',frac>=.25||event.crit);
          if(event.crit)abilityLabel(fx,'Crit!',headX,headY-34,'crit');
          else if(event.extra)abilityLabel(fx,'Double!',headX,headY-34,'double');
          if(event.dmg>0)hurtFoe(target,'leap',died,event.crit);
          if(died){
            ring(fx,x,y,'kill',Math.max(100,tr.width*1.2));
            if(unit&&unit.isBoss){hitStop();shake(P.traumaBossKill);flashScreen('boss',.85);}
            else shake(P.traumaFoeKill);
          }else shake(P.traumaFoeHit);
        }else if(event.dmg>0){
                                                                              
                                                                                
                                                                              
                                                                                
                                                                           
                                                                             
          var face=target&&target.querySelector('.cl-frog-face');
          var squish=presentation().squishFrames(blow,presentation().squishAmp(frac,died,reducedMotion()));
          if(face)face.dataset.squish=blow.kind;
          if(!died)playMotion(face,squish,P.squish.ms,'_clHit','linear');
          var hx=m.x(tr.x+tr.width*.5),hy=m.y(tr.y+tr.height*.5);
          sparks(fx,hx,hy,'frog',-1,died?12:7,died?84:56);
          ring(fx,hx,hy,'frog',Math.max(70,tr.width*(died?1.1:.75)));
          damageAt(fx,event.dmg,headX,headY,'frog',frac>=.2||died);
                                                                          
                                          
          var key=event.from+'@'+event.t,trauma=presentation().frogHitTrauma(frac,died);
          shake(runtime.shook[key]?trauma*.2:trauma);runtime.shook[key]=true;
          flashScreen(died?'death':'hit',died?.9:.35+Math.min(1,frac/.3)*.45);
          jolt('.cl-side--party .cl-bar');
          if(died){hitStop();playMotion(face,squish,P.squish.ms,'_clHit','linear');}
        }else damageAt(fx,event.dmg,headX,headY,'frog');
      },contactMs);
    });
    if(smashes.length)presentRuinSmash(smashes);
  }

                                                                                 
                                                                             
                                                                             
                                                                            
                                                                             
                           
  function frogShownHp(f) {
    if (current.inFlight[f.id]) return current.shownHp[f.id];
    current.shownHp[f.id] = Math.max(0, f.hp);
    return current.shownHp[f.id];
  }
  function noteFrogHit(event) {
    if (!current || event.type !== 'attack' || event.side !== 'enemy') return;
    var f = current.fight && current.fight.frogs().find(function (u) { return u.id === event.to; });
                                                                 
    if (current.shownHp[event.to] == null && f) current.shownHp[event.to] = Math.min(f.maxHp, Math.max(0, event.hpAfter + (event.dmg || 0)));
    current.inFlight[event.to] = (current.inFlight[event.to] || 0) + 1;
  }
  function landFrogHit(event) {
    current.inFlight[event.to] = Math.max(0, (current.inFlight[event.to] || 0) - 1);
    current.shownHp[event.to] = Math.max(0, Math.min(current.shownHp[event.to] == null ? event.hpAfter : current.shownHp[event.to], event.hpAfter));
  }
                                                                   
                                                                               
                                                                                    
  function winCheerDue(fight) {
    if (fight.isDone()) return !!fight.isWon();
    var t = fight.clearElapsed();
    return t !== null && fight.currentWaveIndex() === fight.waveCount - 1 && t >= presentation().PARAMS.cheerStartS;
  }
  function startWinCheer(el) {
    var P = presentation().PARAMS, frames = presentation().cheerFrames(), n = 0;
    current.cheering = true;
    el.classList.add('cl-celebrating');
    el.querySelectorAll('.cl-frog').forEach(function (node) {
      var face = node.querySelector('.cl-frog-face');
      if (!face || node.hidden || node._clDying || node._clGone) return;
      if (face._clCheer) face._clCheer.cancel();
      var opts = { duration: P.cheerMs, delay: (n++ * 3 % 5) * P.cheerLagMs, iterations: Infinity, fill: 'backwards' };
      face._clCheer = face.animate(frames, opts);
      cheerGait(node, opts);
    });
  }

  function killFrog(node) {
    if (node._clDying || node._clGone) return;
    node._clDying = true;
    var hop = node.querySelector('.cl-hop'), P = presentation().PARAMS, runtime = current;
    if (hop) hop.animate(presentation().frogDeathFrames(), { duration: P.frogDeathMs, easing: 'cubic-bezier(.3,.6,.45,1)', fill: 'forwards' });
    var fx = current.el.querySelector('#cl-fx'), r = node.getBoundingClientRect();
    if (r.width) {
      var m = fxMap(fx), cx = m.x(r.x + r.width / 2), cy = m.y(r.y + r.height * .6);
      presentationDelay(function () { if (current === runtime) { ring(fx, cx - 40, cy - 20, 'poof', Math.max(90, r.width)); sparks(fx, cx - 40, cy - 20, 'poof', 0, 8, 60); } }, P.frogDeathMs * .55);
    }
    presentationDelay(function () { if (current === runtime && node._clDying) { node._clDying = false; node._clGone = true; node.hidden = true; } }, P.frogDeathMs);
  }

  function renderFrame() {
    if (!current) return;
    var fight = current.fight, el = current.el;
    var wt = waveHpTotals(fight);
                                                                                          
    var hv = fight.harvest(), hvFrac = hv ? hv.progress / hv.taps : 0;
                                                                   
    var shownHp = 0, maxHp = 0;
    fight.frogs().forEach(function (f) { shownHp += frogShownHp(f); maxHp += f.maxHp; });
    var partyFrac = maxHp > 0 ? shownHp / maxHp : 0;
    var pbar = el.querySelector('#cl-partybar'), fbar = el.querySelector('#cl-foebar');
    var pw = Math.max(0, Math.min(100, partyFrac * 100)).toFixed(1) + '%', fw = Math.max(0, Math.min(100, (hv ? hvFrac : wt.frac) * 100)).toFixed(1) + '%';
    if (pbar) pbar.style.width = pw;
    if (fbar) fbar.style.width = fw;
    var ptrail = el.querySelector('#cl-partytrail'), ftrail = el.querySelector('#cl-foetrail');
    if (ptrail && ptrail.style.width !== pw) ptrail.style.width = pw;
    if (ftrail && ftrail.style.width !== fw) ftrail.style.width = fw;
                                                                           
                                            
    var cheering = winCheerDue(fight);
    var danger = maxHp > 0 && !cheering ? presentation().dangerLevel(partyFrac) : 0, dangerStep = String(danger > .66 ? 3 : danger > .33 ? 2 : danger > 0 ? 1 : 0);
    if (el.dataset.danger !== dangerStep) el.dataset.danger = dangerStep;
    el.style.setProperty('--cl-danger', danger);
    var label = el.querySelector('#cl-wavelabel'); if (label) label.textContent = 'WAVE ' + Math.min(fight.currentWaveIndex() + 1, fight.waveCount) + ' / ' + fight.waveCount;
    var pips = el.querySelector('#cl-pips'); if (pips) pips.innerHTML = pipsHTML(fight, current.bossWaveIdx, current.opts.waves);
    var track = el.querySelector('#cl-stagetrack');
    var trackKey = fight.currentWaveIndex() + ':' + (fight.waveClearPhase() !== null);
    if (track && current.trackKey !== trackKey) { track.innerHTML = stageTrackHTML(fight, current.bossWaveIdx, current.opts.waves); current.trackKey = trackKey; }
    var platesEl = el.querySelector('#cl-plates');
    if (platesEl && hv) {
      var hvKey = fight.currentWaveIndex() + (hv.web ? ':rescue' + (current.web ? ':on' : '') : ':harvest');
      if (current.plateKey !== hvKey) { platesEl.innerHTML = hv.web ? rescuePlateHTML(hv) : harvestPlateHTML(hv); current.plateKey = hvKey; }
      var hvBar = platesEl.querySelector('.cl-plate__bar i');
      if (hvBar) hvBar.style.width = (hvFrac * 100).toFixed(1) + '%';
    } else if (platesEl) {
      var groups = enemyPlates(fight), plateKey = fight.currentWaveIndex() + ':' + groups.map(function (gp) { return gp.key; }).join(',');
      if (current.plateKey !== plateKey) { platesEl.innerHTML = platesHTML(groups); current.plateKey = plateKey; }
      groups.forEach(function (gp, i) {
        var bar = platesEl.children[i] && platesEl.children[i].querySelector('.cl-plate__bar i');
        if (bar) bar.style.width = (gp.maxHp > 0 ? Math.max(0, Math.min(100, gp.hp / gp.maxHp * 100)) : 0).toFixed(1) + '%';
      });
    }
    var pstat = el.querySelector('#cl-partystat');
    if (pstat) {
      var frogs = fight.frogs(), alive = frogs.filter(function (f) { return frogShownHp(f) > 0; }).length;
      pstat.textContent = alive + ' / ' + frogs.length + '  FROGS · ' + fmt(shownHp) + ' HP';
    }
    var fname = el.querySelector('#cl-foename'); if (fname) fname.textContent = hv ? (hv.web ? webInfo(hv.web) : harvestInfo(hv.flower)).name : currentFoeLabel(fight);
    var namedBoss = fight.enemies().find(function (e) { return e.isBoss; });
    var fstat = el.querySelector('#cl-foestat');
    if (fstat) fstat.textContent = hv ? Math.round(hvFrac * 100) + (hv.web ? '% FREED' : '% HARVESTED') : fmt(namedBoss ? namedBoss.hp : wt.hp) + ' HP';
    if (fbar) fbar.parentElement.title = hv ? (hv.web ? 'Rescue: ' : 'Harvest: ') + hv.progress + ' / ' + hv.taps : 'Enemy team health: ' + fmt(wt.hp) + ' HP total';
    var foesEl = el.querySelector('#cl-foes');
                                                                            
                                                                              
    var foeHTML = renderFoeRow(fight);
    var ids = fight.currentWaveIndex()+':'+fight.enemies().filter(function (e) { return e.hp > 0; }).map(function (e) { return e.id; }).join(',');
    if (foesEl && ids !== current.foeIds) {
      var template = document.createElement('div'); template.innerHTML = foeHTML;
      var wanted = Array.from(template.children);
      Array.from(foesEl.children).forEach(function (node) {
        if (!wanted.some(function (n) { return n.dataset.unit === node.dataset.unit; }) && !node._clDead && !node._clIncoming) {
          node._clDead=true;node.dataset.dead='true';
          var dead=fight.enemies().find(function(e){return String(e.id)===node.dataset.id;});
          var img=node.querySelector('img'),P=presentation().PARAMS,runtime=current;
                                                                            
                                                                   
          var hit=current.tapKills[node.dataset.id]?0:presentation().contactMs('frog');
          node.animate([{opacity:1},{opacity:.85,offset:.35},{opacity:0}],{delay:hit+140,duration:P.deathMs,fill:'forwards'});
          if(img)img.animate([{filter:'brightness(1)'},{filter:'brightness(.62) sepia(.45)'}],{delay:hit+140,duration:P.deathMs*.6,fill:'forwards'});
          presentationDelay(function(){
            if(current!==runtime||!node.isConnected)return;
            if(img&&dead){img.src=foeArtSrc(dead,'death');img.style.transform='';}
            var fx=el.querySelector('#cl-fx'),r=(img||node).getBoundingClientRect();
            var tier=dead?presentation().tier(dead.defId,dead.isBoss):'regular';
            if(r.width)spillBones(fx,fxMap(fx).box(r),P['bones'+tier.charAt(0).toUpperCase()+tier.slice(1)],current.layoutSeed+':bones:'+node.dataset.unit);
          },hit+200);
          presentationDelay(function(){node.remove();},hit+140+P.deathMs);
        }
      });
      wanted.forEach(function (node) {
        if (!Array.from(foesEl.children).some(function (n) { return n.dataset.unit === node.dataset.unit; })) foesEl.appendChild(node);
      });
      current.foeIds = ids;
    }
    var note = el.querySelector('.cl-tapnote'), noteText = hv && !hv.done ? (hv.web ? (current.web && current.web.reward && current.web.reward.itemId === 'seeds' ? 'TAP THE WEB · FREE THE SEEDS' : current.web && !current.web.reward ? 'TAP THE WEB · FREE THE PRIZE' : RESCUE_TIP_TEXT) : HARVEST_TIP_TEXT) : TIP_PILL_TEXT;
    if (note && note.textContent !== noteText) note.textContent = noteText;
    var banner = el.querySelector('#cl-waveclear');
    if (banner) {
      banner.hidden = fight.waveClearPhase() !== 'banner';
                                                       
                                                                           
      var hold = hv && (hv.web ? current.web : current.bloom), rew = hold && hold.reward;
      var prz = hv && hv.web && current.web && current.web.prizes && current.web.prizes.length ? { name: current.web.prizes.map(function (p) { return p.name; }).join(' + ') } : null;
      var bannerKey = hv ? (hv.web ? 'rescue:' : 'harvest:') + (rew ? rew.qty + rew.name : '') + (prz ? prz.name : '') : 'wave';
      if (banner.dataset.key !== bannerKey) {
        banner.dataset.key = bannerKey;
        banner.classList.toggle('cl-waveclear--harvest', !!hv);
        banner.classList.toggle('cl-waveclear--rescue', !!(hv && hv.web));
        banner.innerHTML = !hv ? 'Wave cleared' : rew ? '<img src="' + escHTML(hv.web && rew.itemId !== 'seeds' && rescueApi() ? rescueApi().TADPOLE_ICON : rew.img) + '" alt="" draggable="false"><span>+' + escHTML(rew.qty) + ' ' + escHTML(rew.name) + (hv.web ? ' freed!' : '!') + (prz ? '<small>+ ' + escHTML(prz.name) + '</small>' : '') + '</span>' : hv.web ? 'Freed!' : 'Harvested!';
      }
    }
    fight.frogs().forEach(function (f) {
      var node = Array.from(el.querySelectorAll('.cl-frog')).find(function (n) { return n.dataset.id === String(f.id); });
      if (!node) return;
      var hp = frogShownHp(f);
                                                                             
                                    
      if (hp > 0) node._clDying = node._clGone = false;
      else killFrog(node);
      node.hidden = !!node._clGone;
      node.style.setProperty('--cl-hurt', (1 - hp / f.maxHp).toFixed(3));
      node.classList.toggle('cl-frog--hurt', hp < f.maxHp);
                                                                             
      var crit = cheering ? '0' : String(presentation().critLevel(hp, f.maxHp));
      if (node.dataset.crit !== crit) node.dataset.crit = crit;
    });
    if (cheering && !current.cheering) startWinCheer(el);
    el.classList.toggle('cl-between-waves', fight.waveClearPhase() !== null);
    presentTravel(el);
    idleActs(el);
    presentHarvest(el);
    presentRocks(el);
    presentMeadow(el);
    presentCracks(el);
    layoutBattleUnits(el);
    Array.from(el.querySelectorAll('.cl-frog,.cl-foe')).forEach(function (node) {
      if (!node.hidden) current.unitRects[(node.classList.contains('cl-frog') ? 'frog:' : 'enemy:') + node.dataset.id] = node.classList.contains('cl-foe') ? foeTargetRect(node) : node.getBoundingClientRect();
    });
    fight.enemies().forEach(function(e){var n=unitNode('enemy',e.id);if(n&&!n.hidden)current.unitRects['enemy:'+e.id]=foeTargetRect(n);else delete current.unitRects['enemy:'+e.id];
                                                                               
      if(n&&current.enemyRoster.individual){setFlag(n,'frozen',e.hp>0&&e.frozenS>0);setFlag(n,'slowed',e.hp>0&&e.slowS>0);setFlag(n,'burning',e.hp>0&&e.burnPulses>0);}});
    fight.frogs().forEach(function(f){if(f.abil==='shield_cycle'){var n=unitNode('frog',f.id);if(n)setFlag(n,'shield',f.hp>0&&f.shield===true);}});
                                                                   
    var guide=el.querySelector('#cl-tap-guide');
    if(guide) guide.hidden=!(current.tapPromptShown && !fight.isPaused() && current.opts.teachTap && !fight.isDone() &&
      fight.currentWaveIndex()===fight.waveCount-1 && fight.tapsThisFight()===current.tapsAtPrompt &&
      fight.waveClearPhase()===null);
    followTapNumbers();

  }

  function showTapPopup() {
    var fight = current.fight;
    if (!shouldShowTapPopup(fight, current.opts.teachTap, current.tapPromptShown)) return;
    renderFrame();                                                         
    current.tapPromptShown = true;
    current.tapsAtPrompt = fight.tapsThisFight();
                                                                          
                                                                         
    current.rewindPoint = fight.snapshot();
    openTapPopup(text("text_combat_tap_title", "Your frogs need backup!"));
  }
  function openTapPopup(title) {
    var fight = current.fight;
    endHitStop(); stillShake();
    current.pausedAt = Date.now();
    fight.setPaused(true);
    paintPlayback();
    stopLoop();                                                             
    var popup = current.el.querySelector('#cl-tappopup');
    popup.querySelector('.ftt-title').textContent = title;
    current.el.querySelector('#cl-tap-guide').hidden = true;
    popup.hidden = false;
    current.inertNodes = Array.from(current.el.children).filter(function (node) { return node !== popup && !node.inert; });
    current.inertNodes.forEach(function (node) { node.inert = true; });
                                                                                                                            
    current.el.querySelectorAll('.cl-frog').forEach(function (n) { rouse(n); n._clStandAt = null; });                                                
                                                                          
    current.pausedAnimations = current.el.getAnimations({ subtree: true }).filter(function (a) {
      return a.playState === 'running' || a.pending;
    });
    current.pausedAnimations.forEach(function (a) { a.pause(); });
    holdTipButton(current.el.querySelector('#cl-tappopup-continue'));
  }

                                                                            
                                                        
  var TIP_CONTINUE_DELAY_MS = 3000;
  function holdTipButton(btn) {
    if (!btn) return;
                                                                               
    if (typeof FtueTooltips !== 'undefined' && FtueTooltips.holdButton) {
      FtueTooltips.holdButton(btn, TIP_CONTINUE_DELAY_MS, function () { btn.focus(); });
      return;
    }
    btn.disabled = true;
    setTimeout(function () { if (btn.isConnected) { btn.disabled = false; btn.focus(); } }, TIP_CONTINUE_DELAY_MS);
  }

                                                                             
                                                               
  function dodgeTipWanted() {
    return typeof state !== 'undefined' && !!state && !state.seenFamilyAbilityTip;
  }
  function showDodgeTip(hopNode) {
    var fight = current && current.fight;
    if (!fight || fight.isDone() || fight.isPaused() || !dodgeTipWanted()) return;
    state.seenFamilyAbilityTip = 1;
    if (typeof queueSave === 'function') queueSave();
    endHitStop(); stillShake();
    current.pausedAt = Date.now();
    fight.setPaused(true);
    paintPlayback();
    stopLoop();
    var popup = current.el.querySelector('#cl-dodgepopup');
    popup.hidden = false;
    placeDodgeTip(popup, hopNode);
    current.inertNodes = Array.from(current.el.children).filter(function (node) { return node !== popup && !node.inert; });
    current.inertNodes.forEach(function (node) { node.inert = true; });
    current.el.querySelectorAll('.cl-frog').forEach(function (n) { rouse(n); n._clStandAt = null; });                                                
    current.pausedAnimations = current.el.getAnimations({ subtree: true }).filter(function (a) {
      return a.playState === 'running' || a.pending;
    });
    current.pausedAnimations.forEach(function (a) { a.pause(); });
    holdTipButton(popup.querySelector('#cl-dodgepopup-continue'));
  }
                                                                         
                                                                                
  function placeDodgeTip(popup, node) {
    var spot = popup.querySelector('.ftt-spot'), card = popup.querySelector('.ftt-card');
    var b = node && node.isConnected && node.getBoundingClientRect(), o = popup.getBoundingClientRect();
    var place = typeof FtueTooltips !== 'undefined' && FtueTooltips.placeCard;
    if (!b || !b.width || !place) return;
    var cx = (b.left + b.right) / 2 - o.left, cy = (b.top + b.bottom) / 2 - o.top, d = Math.max(96, Math.max(b.width, b.height) * 1.5);
    var p = place({ w: o.width, h: o.height }, { x: cx, y: cy, r: d / 2 }, { w: card.offsetWidth, h: card.offsetHeight });
    popup.classList.add('ftt-spotlit');
    spot.hidden = false;
    spot.style.left = (cx - d / 2) + 'px'; spot.style.top = (cy - d / 2) + 'px'; spot.style.width = spot.style.height = d + 'px';
    card.style.left = p.left + 'px'; card.style.top = p.top + 'px';
    card.classList.add('ftt-card--' + p.mode);
    card.querySelector('.ftt-tail').style.left = p.tailX + 'px';
  }

  function continueTapPopup() { continueTip('#cl-tappopup'); }
  function continueDodgeTip() { continueTip('#cl-dodgepopup'); }
  function continueTip(sel) {
    if (!current || !current.fight.isPaused()) return;
    current.el.querySelector(sel).hidden = true;
    current.inertNodes.forEach(function (node) { node.inert = false; });
    current.pausedAnimations.forEach(function (a) { a.play(); });
    current.pausedMs += Date.now() - current.pausedAt;
    current.fight.setPaused(false);
    paintPlayback();
    current.lastTs = null;                                                      
    renderFrame();
    current.el.querySelector('#cl-arena').focus();
    current.raf = requestAnimationFrame(loop);
  }

                                                                        
                                                       
  var REWIND_PARAMS = { holdMs: 700, rewindMs: 1400 };
                                                                             
                                                                            
                                                                            
                                                                          
  function rewindTapLesson() {
    stopLoop();
    endHitStop(); stillShake();
    var runtime = current, el = current.el, fx = el.querySelector('#cl-rewind');
    el.querySelector('#cl-tap-guide').hidden = true;
    setTimeout(function () {
      if (current !== runtime) return;
      el.classList.add('cl-rewinding'); fx.hidden = false;
      setTimeout(function () {
        if (current !== runtime) return;
        resetPresentation();
        current.fight.restore(current.rewindPoint);
        current.fight.setPaused(true);                                       
        renderFrame();
      }, REWIND_PARAMS.rewindMs / 2);
      setTimeout(function () {
        if (current !== runtime) return;
        el.classList.remove('cl-rewinding'); fx.hidden = true;
        openTapPopup(text("text_combat_retry", "Let’s try that again!"));
      }, REWIND_PARAMS.rewindMs);
    }, REWIND_PARAMS.holdMs);
  }
                                                                                    
  function resetPresentation() {
    var el = current.el;
    endHitStop(); stillShake();
    el.getAnimations({ subtree: true }).forEach(function (a) {
      var css = (typeof CSSAnimation !== 'undefined' && a instanceof CSSAnimation) ||
        (typeof CSSTransition !== 'undefined' && a instanceof CSSTransition);
      if (!css) a.cancel();
    });
    el.querySelector('#cl-fx').innerHTML = '';
    current.cheering = false; el.classList.remove('cl-celebrating');
    el.querySelectorAll('.cl-foe').forEach(function (n) { if (n._clDead || n._clIncoming) n.remove(); });
    el.querySelectorAll('.cl-frog').forEach(function (n) { n._clLunging = null; n._clDying = n._clGone = false; });
                                                                                 
    el.querySelectorAll('.cl-foe').forEach(function (n) {
      var fr = foeFrames({ defId: n.dataset.catalog }), img = fr && n.querySelector('.cl-foe-motion img');
      n._clLunging = n._clFrameMove = n._clLeap = null;
      if (img) { img.src = frameSrc(fr, fr.stance); img.style.transform = ''; }
    });
    if (current.travel) { current.travel = null; el.classList.remove('cl-traveling'); }
    el.querySelectorAll('.cl-frog .cl-hop').forEach(function (hop) { hop.style.translate = hop.style.scale = hop.style.rotate = ''; hop.style.transformOrigin = ''; });
                                                                                               
    el.querySelectorAll('.cl-frog').forEach(function (n) {
      var st = frogStack(n);
      if (n._clFlop) { n._clFlop.cancel(); n._clFlop = null; }
      if (st) { st._clMarch = false; st.style.translate = st.style.rotate = st.style.scale = ''; if (arms()) { arms().pose(st, null); arms().stopIdle(st); } }
      n._clStandAt = null;
    });
                                                                 
    bloomParts(el).forEach(function (n) { n.remove(); });
    el.querySelectorAll('.cl-frog').forEach(function (n) { n._clPerchZ = null; var st = n.querySelector('.cl-strike'); if (st) st._clPerch = null; });
    current.bloom = null; current.web = null; current.bloomWave = null; current.plateKey = null;
                                                                                  
    rockNodes(el).forEach(function (n) { n.remove(); });
    current.rockWave = null; current.rockKey = null; current.stoneShown = null;
                                                                                                  
    meadowNodes(el).concat(Array.from(el.querySelectorAll('.cl-windpetal,.cl-gust'))).forEach(function (n) { n.remove(); });
    current.meadowKey = null; current.petalAt = null; current.gustAt = null;
                                                            
    crackNodes(el).forEach(function (n) { n.remove(); });
    current.crackKey = null; current.crackRun = null; current.crackFlared = null; current.gloom = null;
    current.tapKills = {};
    current.inFlight = {}; current.shownHp = {}; current.shook = {}; current.leaps = {}; current.doneAt = null;
    current.clock = createPresentationClock();
    current.events.length = 0;
    current.unitRects = {};
    current.foeIds = null;
    current.lastTs = null;
  }
                                                                   
  function showPhew(el) {
    var side = el.querySelector('.cl-side--party'), bar = side && side.querySelector('.cl-bar');
    if (!bar) return;
    var note = document.createElement('div');
    note.className = 'cl-phew'; note.setAttribute('role', 'status');
    note.innerHTML = '<b>' + escHTML(text("text_combat_phew", "Phew, that was close!")) + '</b><span>' + escHTML(text("text_combat_thanks", "Glad you helped!")) + '</span><i class="cl-phew-tail" aria-hidden="true"></i>';
    el.classList.add('cl-phew-on');
    el.appendChild(note);
                                                             
    var b = bar.getBoundingClientRect(), s = side.getBoundingClientRect(), o = el.getBoundingClientRect();
    var cx = b.left + Math.min(b.width / 2, 60) - o.left;
    var left = Math.max(8, Math.min(o.width - note.offsetWidth - 8, cx - 30));
    note.style.left = left + 'px';
    note.style.top = (s.bottom - o.top + 18) + 'px';
    note.querySelector('.cl-phew-tail').style.left = (cx - left) + 'px';
  }

  function currentFoeLabel(fight) {
    var es = fight.enemies();
    var boss = es.find(function (e) { return e.isBoss; });
    if (boss) return boss.name;
    var names = {};
    es.forEach(function (e) { names[e.name] = true; });
    var keys = Object.keys(names);
    return keys.length ? keys.join(' & ') : 'Enemies';
  }

  function stopLoop() {
    if (current && current.raf) { cancelAnimationFrame(current.raf); current.raf = null; }
  }

                                                                                  
                                                                              
  function createPlayback(fight, timeScale, onAdvance) {
    var pending = 0, quantum = 1 / 120;
    function advance(seconds) {
      if (fight.isPaused()) return;
      pending += seconds;
      while (pending >= quantum - 1e-9 && !fight.isDone() && !fight.isPaused()) {
        pending -= quantum;
        if (fight.waveClearPhase() !== null) fight.advancePresentation(quantum);
        else fight.step(quantum * timeScale);
        if (onAdvance) onAdvance(quantum);
      }
    }
    return { advance: advance, skip: function () {
      var guard = 0;
      while (!fight.isDone() && !fight.isPaused() && guard++ < 2400000) advance(quantum);
      return fight.isDone();
    } };
  }
  function playbackBlocked(fight, opts) {
                                                                                
                                                                                   
    return fight.isPaused() || fight.isDone();
  }
                                                                                
                                                                                 
                                                                                    
  function playbackLessonPending() {
    return (current.opts.teachTap && !current.tapPromptShown) ||
      (dodgeTipWanted() && current.fight.frogs().some(function (f) { return f.dodgeChance > 0; }));
  }
  function paintPlayback() {
    if (!current || !current.playback) return;
    var blocked = playbackBlocked(current.fight, current.opts);
    var lessonPending = playbackLessonPending();
    var speedBtn = current.el.querySelector('[data-cl-speed]'), skipBtn = current.el.querySelector('[data-cl-skip]');
    speedBtn.disabled = blocked;
    skipBtn.disabled = blocked || lessonPending;
    speedBtn.textContent = current.speed + 'x';
    speedBtn.title = blocked ? 'Paused for tutorial' : '';
    skipBtn.title = blocked ? 'Paused for tutorial' : (lessonPending ? 'Skip waits for the tutorial moment' : '');
    var note = current.el.querySelector('.cl-playback-note');
    if (note) note.hidden = !blocked;
    current.el.querySelector('.cl-world').getAnimations({subtree:true}).forEach(function (a) {
      if (a.playbackRate !== current.speed) a.playbackRate = current.speed;
    });
  }
  function skipToResult() {
    if (!current || !current.playback || playbackBlocked(current.fight, current.opts) || playbackLessonPending()) return;
    stopLoop(); endHitStop();
    if (current.playback.skip()) { paintPlayback(); onFightDone(false); }
    else if (!current.fight.isPaused()) { current.lastTs = null; current.raf = requestAnimationFrame(loop); }
  }

  function loop(ts) {
    if (!current) return;
    var last = current.lastTs == null ? ts : current.lastTs;
    var dt = Math.min(0.25, Math.max(0, (ts - last) / 1000));                                                              
    current.lastTs = ts;
    if (current.playback) dt *= current.speed;
    updateShake(dt);
                                                                          
                                     
    if (current.hitStopUntil) {
      if (ts < current.hitStopUntil) { current.raf = requestAnimationFrame(loop); return; }
      endHitStop();
    }
    if (!current.fight.isPaused()) current.clock.advance(dt * 1000);
    if (current.playback) current.playback.advance(dt);
    else if (current.fight.waveClearPhase() !== null) current.fight.advancePresentation(dt);
    else current.fight.step(dt * getFPConfig().value('MergeRules','combat_time_scale'));
    renderFrame();
    presentEvents();
    showTapPopup();
    paintPlayback();
    if (current.fight.isPaused()) { current.raf = null; return; }
    if (current.fight.isDone()) {
                                                                             
                                                                         
      if (current.doneAt == null) current.doneAt = ts;
      if (!current.fight.isWon() && ts - current.doneAt < lossHoldMs() / (current.speed || 1)) { current.raf = requestAnimationFrame(loop); return; }
                                                                               
                                                                                
                                                                              
                                                                            
                                                                             
                                                                               
      if (current.rewindPoint && !current.rewindUsed && !current.fight.isWon()) { current.rewindUsed = true; rewindTapLesson(); }
      else onFightDone();
      return;
    }
    current.raf = requestAnimationFrame(loop);
  }
                                                                                                 
                                                      
  function lossHoldMs() {
    var land = presentation().contactMs('enemy');
    if (current) current.fight.enemies().forEach(function (e) { var fr = foeFrames(e); if (fr) land = Math.max(land, presentation().frameContactMs(fr, frameBudget(e.id))); });
    return land + presentation().PARAMS.frogDeathMs + 150;
  }

  function onFightDone(leftEarly) {
    stopLoop();
    endHitStop(); stillShake();
    var fight = current.fight, opts = current.opts, el = current.el;
    var result = { won: fight.isWon(), expId: opts.expId, waveCount: fight.waveCount, wavesCleared: fight.currentWaveIndex(), tapsThisFight: fight.tapsThisFight(), leftEarly: !!leftEarly, surgeWasActive: !!opts.surgeActive, kills: fight.kills(), harvests: fight.harvests() };
    if (!leftEarly && el) {
      settleStoneTally(el);                                                               
      var r = el.querySelector('#cl-result');
      if (r) {
        var KUI = kitUI(), RJ = isBrowser ? window.ResultJuice : null;
        r.hidden = false;
        if (RJ) {
                                                                                                 
          r.innerHTML = RJ.cardHTML(result.won, KUI);
          RJ.play(r, result.won);
        } else {
          var inner = '<div class="cl-result-title">' + (result.won ? '⭐ Expedition Cleared!' : '☠️ Expedition Failed') + '</div>' +
            '<div class="cl-result-sub">' + (result.won ? 'Your frogs made it through.' : 'Your frogs fought bravely but fell short.') + '</div>' +
            (KUI ? KUI.button({ tone: 'green', shape: 'rounded', size: 'sm', id: 'cl-result-continue', label: 'Continue' }) : '<button id="cl-result-continue" type="button">Continue</button>');
          r.innerHTML = KUI ? KUI.panel('<div class="cl-result-card">' + inner + '</div>') : '<div class="cl-result-card">' + inner + '</div>';
        }
        var btn = r.querySelector('#cl-result-continue');
        if (btn) btn.onclick = function () { close(); if (typeof opts.onEnd === 'function') opts.onEnd(result); };
        if (result.won && current.tapPromptShown && fight.tapsThisFight() > current.tapsAtPrompt) showPhew(el);
        return;
      }
    }
    close();
    if (typeof opts.onEnd === 'function') opts.onEnd(result);
  }

  function close() {
    stopLoop();
    if (current && current.el) current.el.remove();
    current = null;
  }

  function fastForwardAndLeave() {
    if (!current) return;
    var fight = current.fight, guard = 0;
    while (!fight.isDone() && guard < 4000) { fight.advancePresentation(5); fight.step(5); guard++; }                                                                                         
    onFightDone(true);
  }

                                                                             
            
                   
                                                    
                              
                                                                        
                            
                                                                                         
                                                                                                     
                                                                                                                    
                              
         
  function open(opts) {
    if (!isBrowser) throw new Error('CombatLive.open() requires a browser (document is undefined).');
                                                                          
                                                                 
    var node = /^node-(\d+)$/.exec(opts.expId || '');
    var no = node ? Number(node[1]) : opts.expeditionNo;
    var cap = ExpeditionMinParty.maxPartySize(no, typeof window !== 'undefined' ? window.FPConfig : null);
    if ((opts.party || []).length > cap) {
      if (typeof showToast === 'function') showToast('Party limit: '+cap+' frogs');
      return null;
    }
    if (current) close();
    var seed = Math.floor(Math.random() * 0xFFFFFFFF) >>> 0;
    var enemyDb = opts.enemyDb || getEnemyDb(no), bossDb = opts.bossDb || getBossDb(no);
    var events = [];
    var fight = createFight({
      onEvent: function (event) { events.push(event); noteFrogHit(event); },
      party: opts.party, waves: opts.waves, enemyDb: enemyDb, bossDb: bossDb,
      seed: seed,
      tapParams: tapParamsFor(no), surgeActive: !!opts.surgeActive, record: !!opts.record, presentation: true
    });
    var bossWaveIdx = null;
    (opts.waves || []).forEach(function (w, i) { if (w.bosses && w.bosses.length && bossWaveIdx == null) bossWaveIdx = i; });
    var el = buildShell(opts);
    el.dataset.stage = stageFor(no);
    el.querySelector('#cl-party').innerHTML = renderFrogRow(opts.party, opts.frogArt);
    current = { layoutSeed: seed, fight: fight, el: el, opts: opts, lastTs: null, raf: null, bossWaveIdx: bossWaveIdx, events: events, foeIds: null, unitRects: {}, clock: createPresentationClock(), pausedMs: 0, tapPromptShown: false, pausedAnimations: [],
      enemyDb: enemyDb, bossDb: bossDb, scrollPx: 0, travel: null, tapKills: {}, bloom: null, web: null, bloomWave: null,
      inFlight: {}, shownHp: {}, shook: {}, leaps: {}, trauma: 0, shakeT: 0, hitStopUntil: 0, hitStopAnims: null, doneAt: null, cheering: false,
      rockWave: null, rockKey: null, rockHitsN: null, stoneShown: 0, rockSet: ROCK_SET_BY_STAGE[el.dataset.stage] || 'swamp',
      meadowKey: null, petalAt: null, gustAt: null, windRng: presentation().layoutRng(seed + ':wind'),
      crackHost: crackHost(opts.waves, el.dataset.stage), crackKey: null, crackRun: null, crackFlared: null, crackRumbleAt: 0, gloom: null };
    current.speed = 1;
    current.playback = createPlayback(fight, getFPConfig().value('MergeRules','combat_time_scale'));
    el.insertAdjacentHTML('beforeend', '<div class="cl-playback" aria-label="Combat playback"><button type="button" data-cl-speed aria-label="Cycle fight speed">1x</button><button type="button" data-cl-skip>Skip to result</button><span class="cl-playback-note" role="status" hidden>Paused for tutorial</span></div>');
    el.querySelector('[data-cl-speed]').onclick = function () {
      if (playbackBlocked(fight, opts)) return;
      current.speed = current.speed === 4 ? 1 : current.speed * 2;
      paintPlayback();
    };
    el.querySelector('[data-cl-skip]').onclick = skipToResult;
    paintPlayback();
    preloadMeadows(opts.waves);
    current.crackArt = preloadCracks(current.crackHost);
                                                            
    if ((opts.waves || []).some(function (w) { return w.rocks; })) {
      el.insertAdjacentHTML('beforeend', '<div class="cl-stonechip" aria-label="Stone harvested"><img src="' + STONE_ART + '" alt="" draggable="false"><b>0</b></div>');
    }
    renderFrame();

    el.querySelector('#cl-tappopup-continue').onclick = continueTapPopup;
    el.querySelector('#cl-dodgepopup-continue').onclick = continueDodgeTip;
    el.querySelector('#cl-arena').tabIndex = -1;
    el.querySelector('.cl-back').onclick = function () {
      var lc = el.querySelector('#cl-leaveconfirm'); if (lc) lc.hidden = false;
    };
    el.querySelector('#cl-leave-cancel').onclick = function () {
      var lc = el.querySelector('#cl-leaveconfirm'); if (lc) lc.hidden = true;
    };
    el.querySelector('#cl-leave-confirm').onclick = function () { fastForwardAndLeave(); };

    el.querySelector('#cl-arena').addEventListener('pointerdown', function (ev) {
      if (!current) return;
      var res = current.fight.applyTap(performance.now());
      if (res && res.harvest) { if (current.web) presentRescueTap(res, ev); else presentHarvestTap(res, ev); return; }
      if (res) {
        var fx = current.el.querySelector('#cl-fx'), m = fxMap(fx);
        tapStar(fx, m.x(ev.clientX), m.y(ev.clientY));
        presentTap(res);
        showTapPopup();
      }
    });

    current.raf = requestAnimationFrame(loop);
    return fight;
  }

                                                                                
                  
                                                                                
  return {
    PARAMS: PARAMS,
    PRESENTATION_PARAMS: PRESENTATION_PARAMS,
    packFormation: packFormation,
    createPresentationClock: createPresentationClock,
    createPlayback: createPlayback,
    playbackBlocked: playbackBlocked,
    shouldShowTapPopup: shouldShowTapPopup,

                                    
    getSheetParams: getSheetParams,
    tapParamsFor: tapParamsFor,
    enemyAttackMult: enemyAttackMult,
    getEnemyDb: getEnemyDb,
    getBossDb: getBossDb,
    getFtueWaves: getFtueWaves,
    fightFor: fightFor,
    stageFor: stageFor,
                                                                            
    harvestInfo: harvestInfo,
                                                                                        
    rockSetFor: function (no) { return ROCK_SET_BY_STAGE[stageFor(no)] || 'swamp'; },
                                                                     
    webInfo: webInfo,
    getFamilyAbility: getFamilyAbility,
    getFamilyDodgeChance: getFamilyDodgeChance,
    familyAbilityInfo: familyAbilityInfo,
    abilityCopy: abilityCopy,
    ABILITIES: ABILITIES,
    familyAbilityHTML: familyAbilityHTML,
    _resetConfigCacheForTests: _resetConfigCacheForTests,

                                  
    makeRng: makeRng,
    mitigatedDamage: mitigatedDamage,
    createFight: createFight,
    simulateHeadless: simulateHeadless,
    synthWaveFromReq: synthWaveFromReq,
    resolveKillRewards: resolveKillRewards,

                     
    estimate: estimate,
                                                                            
                                                                             
    waveClearHoldS: clearTotalS,

          
    isOpen: isOpen,
    isPresentationPaused: function (node) { return !!(current && current.fight.isPaused() && current.el.contains(node)); },
    presentationNow: function (node) {
      return current && current.el.contains(node)
        ? (current.playback ? current.clock.now() : (current.fight.isPaused() ? current.pausedAt : Date.now()) - current.pausedMs)
        : Date.now();
    },
    open: open,
    close: close
  };
});
