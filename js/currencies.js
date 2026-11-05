  
                                                                      
                                                                             
                                                                          
                                                      
  
                                                                
                                                                             
                                                                           
  
                                                                     
                                                                         
                                                                     
                                                                   
                                                                            
                                                                             
                                                                   
   
(function (g) {
  'use strict';

                                                                            
                                                                           
                                                                       
                                                                        
                                                                          
                                                                         
                                                      
  var LEGACY_NON_WALLET_IDS = { frogs: true, happiness: true };

  var registry = null;                                

  function build() {
    if (registry) return registry;
    var rows = g.FPConfig.rows('Currencies');
    var reg = {};
    for (var i = 0; i < rows.length; i++) {
      var id = String(rows[i].Name || '').trim();
      if (!id || LEGACY_NON_WALLET_IDS[id]) continue;
      reg[id] = { id: id, symbol: String(rows[i].Symbol || '').trim() };
    }
    registry = reg;
    return registry;
  }

  function list() {
    var reg = build();
    return Object.keys(reg).map(function (id) { return reg[id]; });
  }

  function has(id) {
    return Object.prototype.hasOwnProperty.call(build(), id);
  }

  function symbol(id) {
    var reg = build();
    if (!reg[id]) {
      throw new Error('[Currencies] unknown currency id "' + id + '" — known ids: ' + Object.keys(reg).join(', '));
    }
    return reg[id].symbol;
  }

                                                                          
                                                                          
                                                                         
                                                                         
                                                                         
                                                                         
                                                                             
                                                                          
                                                    
                                                                          
                                                                          
                                                                         
                                                                         
                                                     
  var NON_CURRENCY_REWARD_IDS = {
    equipment: true, equipment_common: true, equipment_rare: true, equipment_epic: true, equipment_legendary: true,
    trait: true, '(spare_1)': true, '(spare_2)': true,
    trait_bunny_guaranteed: true, weapon_blueprint: true, shield_blueprint: true, weapon_chassis: true, flower_seed: true, lily_seed: true, family_ticket: true, nothing: true, none: true,
  };

  function reportUnknown(problems, seen, tab, column, value) {
    var key = tab + '|' + column + '|' + value;
    if (seen[key]) return;                                                                                            
    seen[key] = true;
    problems.push({ tab: tab, column: column, value: value });
  }

                                                                         
  function checkEquipmentCosts(problems, seen) {
    var rows;
    try { rows = g.FPConfig.rows('Equipment'); } catch (e) { return; }
    rows.forEach(function (row) {
      Object.keys(row).filter(function (col) { return /^cost_\d+_type$/.test(col); }).forEach(function (col) {
        var id = String(row[col] || '').trim();
        if (id && !has(id)) reportUnknown(problems, seen, 'Equipment', col, id);
      });
    });
  }

  function checkStartingState(problems, seen) {
    var rows;
    try { rows = g.FPConfig.rows('StartingState'); } catch (e) { return; }
    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      if (row.section !== 'currency') continue;
      var id = String(row.key || '').trim();
      if (id && !has(id)) reportUnknown(problems, seen, 'StartingState', 'key', id);
    }
  }

                                                                           
                                                                            
                                                                              
  function checkEnemyKillRewards(problems, seen) {
    var rows;
    try { rows = g.FPConfig.rows('Enemies'); } catch (e) { return; }
    for (var i = 0; i < rows.length; i++) {
      var id = String(rows[i]['Enemy Kill Reward 1'] || '').trim();
      if (id && !has(id)) reportUnknown(problems, seen, 'Enemies', 'Enemy Kill Reward 1', id);
    }
  }

  function checkDropTables(problems, seen) {
    var rows;
    try { rows = g.FPConfig.rows('DropTables'); } catch (e) { return; }
    for (var i = 0; i < rows.length; i++) {
      var id = String(rows[i].item_id || '').trim();
                                                                              
      if (!id || NON_CURRENCY_REWARD_IDS[id] || id.indexOf('trait_') === 0 || id.indexOf('set_') === 0) continue;                                                  
      if (id.indexOf('flower_unlock_') === 0) continue;                                                                        
      if (id.indexOf('gear_') === 0 || id.indexOf('rescue_frog_') === 0) continue;                                                                           
      if (!has(id)) reportUnknown(problems, seen, 'DropTables', 'item_id', id);
    }
  }

  function validateBoot() {
    var problems = [], seen = {};
    checkEquipmentCosts(problems, seen);
    checkStartingState(problems, seen);
    checkEnemyKillRewards(problems, seen);
    checkDropTables(problems, seen);
    if (problems.length && typeof console !== 'undefined' && console.error) {
      problems.forEach(function (p) {
        console.error('[Currencies] unknown currency id "' + p.value + '" in [EXPORT] ' + p.tab + '.' + p.column + ' — not in [EXPORT] Currencies');
      });
    }
    return problems;
  }

  g.Currencies = { list: list, has: has, symbol: symbol, validateBoot: validateBoot };
  if (typeof module !== 'undefined' && module.exports) module.exports = g.Currencies;
})(typeof window !== 'undefined' ? window : globalThis);
