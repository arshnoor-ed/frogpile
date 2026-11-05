                                                                                
                                                                     
                                                                                 
                                                                                  
                                                                              

                                                                                 
                                                                               
                                                                             
                                                                         
                                                                               
                                                                                
                                                                              
                                                                                
                                                                            

                                                                       
                                                                               
                                                                                     
                                                                                   
(function (g) {
  'use strict';

  var PARAMS = {
    precision: 0.01,                                                            
    maxScale: 4096                                                                   
  };

                                                                               
                                            
  function seedOf(i) { return ((i + 1) * 2654435761) >>> 0; }

                                                                               
                                              
  function winsAtLeast(simulate, party, fight, target, trials) {
    var need = Math.max(1, Math.ceil(target * trials - 1e-9)), won = 0;
    for (var i = 0; i < trials; i++) {
      if (simulate(party, fight, seedOf(i)).won) won++;
      if (won >= need) return true;
      if (won + (trials - 1 - i) < need) return false;
    }
    return false;
  }

                                                            
  function refParty(ref, n, k) {
    var out = [];
    for (var i = 0; i < n; i++) {
      out.push({ id: 'ref' + i, attack: ref.atk * k, defense: ref.def * k, hp: ref.hp * k, maxHp: ref.hp * k, attackSpeed: ref.attackSpeed,
        ability: ref.ability || null, dodgeChance: ref.dodgeChance || 0 });
    }
    return out;
  }

                                                                           
                                                                           
                   
  function searchScale(wins, opts) {
    opts = opts || {};
    var precision = opts.precision || PARAMS.precision, maxScale = opts.maxScale || PARAMS.maxScale;
    var lo = 0, hi = 1;
    while (!wins(hi)) { lo = hi; hi *= 2; if (hi > maxScale) return null; }
    while (hi - lo > hi * precision) {
      var mid = (lo + hi) / 2;
      if (wins(mid)) hi = mid; else lo = mid;
    }
    return hi;
  }

                                                                                                     
                                                                    
  function threshold(o) {
    var n = Math.max(1, Math.round(o.n || 1));
    var k = searchScale(function (s) { return winsAtLeast(o.simulate, refParty(o.ref, n, s), o.fight, o.target, o.trials); }, o);
    if (k == null) return null;
    return { atk: Math.ceil(o.ref.atk * k * n), def: Math.ceil(o.ref.def * k * n), hp: Math.ceil(o.ref.hp * k * n), scale: k, n: n };
  }

                                                                                  
  function lib(name) { return g[name] || (typeof window !== 'undefined' ? window[name] : undefined); }

                                                                          
                                                                            
  var _ref = null;
  function referenceFrog() {
    if (_ref) return _ref;
    var FT = lib('FT'), FS = lib('FrogStats'), CL = lib('CombatLive');
    var fam = FT.STARTER_FAMILY, pool = FT.familyTraitPool(fam);
    var pieces = FT.SLOTS.map(function (s) { return pool.filter(function (t) { return t.slot === s; })[0]; }).filter(Boolean);
    var s = FS.statsForFrog({ bodySize: pieces.length, traitDefs: pieces, matchedFamily: pieces.length === FT.SLOTS.length ? FT.familyDefOf(fam) : null });
    var ability = CL.getFamilyAbility(fam) || null;
    _ref = { atk: s.atk, def: s.def, hp: s.hp, attackSpeed: FS.attackSpeed(pieces.length), ability: ability, dodgeChance: CL.getFamilyDodgeChance(fam) || 0 };
    return _ref;
  }

  var _memo = {};
                                                                               
                                                                                
  function forExpedition(no, tier, n) {
    tier = tier || 'normal';
    n = Math.max(1, Math.round(n || 1));
    var key = no + ':' + tier + ':' + n;
    if (Object.prototype.hasOwnProperty.call(_memo, key)) return _memo[key];
    var out = null;
    try {
      var FP = lib('FPConfig'), CL = lib('CombatLive');
      var fight = CL.fightFor(no, tier);
      if (fight && fight.waves && fight.waves.length) {
        out = threshold({
          fight: fight, n: n, ref: referenceFrog(),
          target: FP.value('MergeRules', 'prediction_bar_cutoff_risky_even_pct'),
          trials: FP.value('MergeRules', 'prediction_trials'),
          simulate: function (party, f, seed) { return CL.simulateHeadless(party, f.waves, f.enemyDb, f.bossDb, seed, null); }
        });
      }
    } catch (e) { out = null; }
    _memo[key] = out;
    return out;
  }
  function _resetForTests() { _memo = {}; _ref = null; }

  var mod = { PARAMS: PARAMS, seedOf: seedOf, winsAtLeast: winsAtLeast, refParty: refParty, searchScale: searchScale,
    threshold: threshold, referenceFrog: referenceFrog, forExpedition: forExpedition, _resetForTests: _resetForTests };
  if (typeof module !== 'undefined' && module.exports) module.exports = mod;
  g.PartyThreshold = mod;
})(typeof window !== 'undefined' ? window : globalThis);
