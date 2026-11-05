  
                                                                                 
  
                                                                               
                                                                         
                                                                            
                                                                      
                                                  
  
                                                                              
                                                                           
                                                                                      
  
                                                                           
                                                                              
                                                                             
                                                                           
                                                                         
  
                                                                           
                                                                             
                                                                                
   
(function (g) {
  'use strict';

  var TAB = 'PondTiers';
  var COST_COLS = ['tadpoles', 'gems', 'seeds', 'wood', 'stone', 'bones'];
  var COST_FIELDS = {tadpoles:'tadpoles',gems:'gems',seeds:'seeds',wood:'mat',stone:'rock',bones:'bones'};
                                                                          
  var CAP_COLS = {
    'max frogs': 'r_MaxFrogs',
    'max tadpoles': 'r_MaxTadpoles',
    'max hatching pads': 'r_MaxHatchingPads',
    'max flower pads': 'r_MaxFlowerPads'
  };

  function allRows() {
    return g.FPConfig.rows(TAB);
  }

  function maxTier() {
    var rows = allRows();
    var max = rows[0].Tier;
    for (var i = 1; i < rows.length; i++) if (rows[i].Tier > max) max = rows[i].Tier;
    return max;
  }

  function tierRow(tier) {
    return g.FPConfig.row(TAB, 'Tier', tier);
  }

  function cap(colName, tier) {
    var row = tierRow(tier);
    if (!(colName in row) && CAP_COLS[colName] in row) colName = CAP_COLS[colName];
    if (!(colName in row)) {
      throw new Error('[PondTiers] tab "PondTiers" has no column "' + colName + '" — known columns: ' + Object.keys(row).join(', '));
    }
    return row[colName];
  }

  function maxFrogs(tier) { return cap('max frogs', tier); }
  function maxTadpoles(tier) { return cap('max tadpoles', tier); }
  function maxHatchingPads(tier) { return cap('max hatching pads', tier); }
  function maxWood(tier) { return cap('max wood', tier); }
  function maxStone(tier) { return cap('max stone', tier); }
  function maxFlowerPads(tier) { return cap('max flower pads', tier); }

  function canExpand(tier) { return tier < maxTier(); }

                                                                           
  function expandCost(tier) {
    var row = tierRow(tier + 1);
    var out = {};
    for (var i = 0; i < COST_COLS.length; i++) {
      var c = COST_COLS[i];
      out[c] = row['cost_' + c] === undefined ? row[c] : row['cost_' + c];
    }
    return out;
  }

  function expand() {
    if (typeof g.pondTierUp !== 'function') {
      throw new Error('[PondTiers] expand() needs window.pondTierUp() from index.html, which was not found');
    }
    return g.pondTierUp();
  }

                                                                             
                                                                   
  function shortfallForCost(cost, wallet) {
    var out = {};
    Object.keys(cost).forEach(function(k){
      var have=wallet[COST_FIELDS[k]]||0;
      if(have<cost[k]) out[k]=cost[k]-have;
    });
    return out;
  }
  function expandShortfall(tier, wallet) { return shortfallForCost(expandCost(tier), wallet); }

  g.PondTiers = {
    maxTier: maxTier,
    tierRow: tierRow,
    maxFrogs: maxFrogs,
    maxTadpoles: maxTadpoles,
    maxHatchingPads: maxHatchingPads,
    maxWood: maxWood,
    maxStone: maxStone,
    maxFlowerPads: maxFlowerPads,
    canExpand: canExpand,
    expandCost: expandCost,
    COST_FIELDS: COST_FIELDS,
    shortfallForCost: shortfallForCost,
    expandShortfall: expandShortfall,
    expand: expand
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = g.PondTiers;
  }
})(typeof window !== 'undefined' ? window : globalThis);
