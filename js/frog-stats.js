  
                                                                                
                              
  
                   
                                                                                 
                                                      
                                                                                
                                                            
                                                                            
                                                                               
                                                                            
               
                                                                             
                                                           
                                                                             
                                                                       
                                                                 
  
                                                                           
                                                                            
                                                                  
                                                                                  
                                                                                       
                                               
                                                                    
                                                                           
                                                                           
                                                                       
                                                                       
                                                                              
                                                                           
                                                                             
  
                                                                     
                                                                           
                                     
  
                                                                            
                                                                          
                                                                           
                                                                            
                                                                           
                                                                        
                                                                    
                                                                         
                                                                          
                                                                            
                                                                             
                                                                   
                                                                             
                                    
                                                                                
                                                                      
                                                                        
                                                                             
                                                                              
                                                                               
                                                                               
                                                                           
                                                                      
                                                                             
                                                             
                                                                              
                                                                            
                                                                   
  
                                                                          
                                                                           
                                                                            
                                                                           
                                                                            
                     
   
(function (g) {
  'use strict';

  var FROGS_TAB = 'Frogs';
  var MERGE_RULES_TAB = 'MergeRules';
  var FAMILIES_TAB = 'TraitFamilies';

  var SHEET_RARITIES = ['common', 'rare', 'epic', 'legendary'];
                                                                                   
  var CODE_TO_SHEET_RARITY = { common: 'common', uncommon: 'rare', rare: 'epic', mythic: 'legendary' };

  function sheetRarityForCodeRarity(codeRarity) {
    var r = CODE_TO_SHEET_RARITY[codeRarity];
    if (!r) {
      throw new Error('[FrogStats] unknown code rarity "' + codeRarity + '" — known: ' + Object.keys(CODE_TO_SHEET_RARITY).join(', '));
    }
    return r;
  }

  function rarityRank(sheetRarity) {
    var i = SHEET_RARITIES.indexOf(sheetRarity);
    if (i < 0) {
      throw new Error('[FrogStats] unknown sheet rarity "' + sheetRarity + '" — known: ' + SHEET_RARITIES.join(', '));
    }
    return i;
  }

                                                                           
                                                                             
                                                                         
                                                                            
                                                                     
                                                                           
                                                                        
                                                                     
                                                                             
                               
  function frogLevelForBodySize(bodySize) {
    return Math.max(0, Math.min(4, bodySize || 0));
  }

                                                                            
                                                                             
                                                                             
                                                                           
                                                                              
                                                
  function bodyBaseStatsFromFrogsRows(rows, bodySize) {
    var level = frogLevelForBodySize(bodySize);
    var row = null;
    for (var i = 0; i < rows.length; i++) {
      if (rows[i]['Frog Level'] === level) { row = rows[i]; break; }
    }
    if (!row) {
      throw new Error('[FrogStats] "' + FROGS_TAB + '" tab has no "Frog Level" row for ' + level);
    }
    return { atk: row['Base Attack'], def: row['Base Defense'], hp: row['Base HP'] };
  }

  function bodyBaseStats(bodySize) {
    return bodyBaseStatsFromFrogsRows(g.FPConfig.rows(FROGS_TAB), bodySize);
  }

                                                                            
                                                                       
  function attackSpeedFromFrogsRows(rows, bodySize) {
    var level = frogLevelForBodySize(bodySize);
    var row = rows.find(function (r) { return r['Frog Level'] === level; });
    if (!row) throw new Error('[FrogStats] Frogs has no Frog Level row for ' + level);
    var speed = row['Attack Speed'];
    if (typeof speed !== 'number' || !Number.isFinite(speed) || speed <= 0) {
      throw new Error('[FrogStats] Frogs level ' + level + ' needs a positive Attack Speed column; refresh the sheet export');
    }
    return speed;
  }

  function attackSpeed(bodySize) {
    return attackSpeedFromFrogsRows(g.FPConfig.rows(FROGS_TAB), bodySize);
  }

                                                                             
                                                                    
                                                                          
                                                                            
                                                                             
  function traitFlatStats(themedStat, budget) {
    var out = { atk: 0, def: 0, hp: 0 };
    if (themedStat === 'attack') out.atk = budget;
    else if (themedStat === 'defense') out.def = budget;
    else if (themedStat === 'hp') out.hp = budget;
    return out;
  }

  function flatBudgetForRarity(sheetRarity) {
    return g.FPConfig.value(MERGE_RULES_TAB, 'flat_trait_stat_budget_' + sheetRarity);
  }

                                                                           
                                                                             
                                                  
  function dominantStatOfLegacyBoost(b) {
    if (!b) return null;
    var cands = [['attack', Math.abs(b.atk || 0)], ['defense', Math.abs(b.def || 0)], ['hp', Math.abs(b.hp || 0)]];
    cands.sort(function (x, y) { return y[1] - x[1]; });
    return cands[0][1] > 0 ? cands[0][0] : null;
  }

                                                                             
                                                                          
                                                                               
  function traitBoostForCatalogTrait(t) {
    if (!t) return { atk: 0, def: 0, hp: 0 };
    if (t.sheetId) {
      var row = g.FPConfig.rows('Traits').find(function (r) { return r.trait_id === t.sheetId; });
      if (!row) throw new Error('[FrogStats] missing Traits row for ' + t.sheetId);
      var out = {};
      [['atk', 'buff_attack'], ['def', 'buff_defense'], ['hp', 'buff_hp']].forEach(function (pair) {
        var value = row[pair[1]];
        if (typeof value !== 'number' || !Number.isFinite(value)) throw new Error('[FrogStats] invalid ' + pair[1] + ' for ' + t.sheetId);
        out[pair[0]] = value;
      });
      return out;
    }
    var stat = dominantStatOfLegacyBoost(t.b);
    if (!stat) return { atk: 0, def: 0, hp: 0 };
    var sheetRarity = sheetRarityForCodeRarity(t.r);
    var budget = flatBudgetForRarity(sheetRarity);
    return traitFlatStats(stat, budget);
  }

                                                                           

                                                                            
                                                                             
                                                                     
                                                                              
                                                                          
                                                                         
                                                                             
                                                                             
                                                                         
                                                                            
                                                                     
                                                                         
                                                                             
                                                                          
                                      

                                                                         
                                                                             
                                                                         
                                                                     
                                                                             
                                                                            
                                                                         
                                                                             
                                                                           
                                                                            
                                                                           
                                        
  function slugifyFamilyName(name) {
    return String(name || '').trim().toLowerCase().replace(/\s+/g, '_');
  }
  function familyRow(fam) {
    if (!fam || fam.ftue) return null;
    return g.FPConfig.row(FAMILIES_TAB, 'family', slugifyFamilyName(fam.n));
  }
  function familySheetRarity(fam) {
    var row = familyRow(fam);
    return row ? row.rarity : null;
  }
  function familyBonusPctForMatchedFamily(fam) {
    var row = familyRow(fam);
    return row ? (row.set_bonus_4_match - 1) : 0;
  }

                                                                          
                                                                            
                                                                             
                                                                              
                         
  function combine(base, traitBoosts, familyBonusPct) {
    var flat = { atk: 0, def: 0, hp: 0 };
    (traitBoosts || []).forEach(function (b) {
      flat.atk += (b && b.atk) || 0; flat.def += (b && b.def) || 0; flat.hp += (b && b.hp) || 0;
    });
    var pct = 1 + (familyBonusPct || 0);
    return {
      atk: Math.round((base.atk + flat.atk) * pct),
      def: Math.round((base.def + flat.def) * pct),
      hp: Math.round((base.hp + flat.hp) * pct)
    };
  }

                                                                           
                                                                     
  function computeStats(opts) {
    opts = opts || {};
    return combine(opts.base || { atk: 0, def: 0, hp: 0 }, opts.traitBoosts, opts.familyBonusPct);
  }

                                                                           
                                                                                
  function statsForFrog(opts) {
    opts = opts || {};
    var base = bodyBaseStats(opts.bodySize);
    var traitBoosts = (opts.traitDefs || []).map(traitBoostForCatalogTrait);
    var familyBonusPct = familyBonusPctForMatchedFamily(opts.matchedFamily || null);
    return combine(base, traitBoosts, familyBonusPct);
  }

  g.FrogStats = {
    SHEET_RARITIES: SHEET_RARITIES,
    CODE_TO_SHEET_RARITY: CODE_TO_SHEET_RARITY,
    sheetRarityForCodeRarity: sheetRarityForCodeRarity,
    rarityRank: rarityRank,
    frogLevelForBodySize: frogLevelForBodySize,
    bodyBaseStatsFromFrogsRows: bodyBaseStatsFromFrogsRows,
    bodyBaseStats: bodyBaseStats,
    attackSpeedFromFrogsRows: attackSpeedFromFrogsRows,
    attackSpeed: attackSpeed,
    traitFlatStats: traitFlatStats,
    flatBudgetForRarity: flatBudgetForRarity,
    dominantStatOfLegacyBoost: dominantStatOfLegacyBoost,
    traitBoostForCatalogTrait: traitBoostForCatalogTrait,
    slugifyFamilyName: slugifyFamilyName,
    familyRow: familyRow,
    familySheetRarity: familySheetRarity,
    familyBonusPctForMatchedFamily: familyBonusPctForMatchedFamily,
    computeStats: computeStats,
    statsForFrog: statsForFrog
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = g.FrogStats;
  }
})(typeof window !== 'undefined' ? window : globalThis);
