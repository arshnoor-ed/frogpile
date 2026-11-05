  
                                                                                
                                                                      
  
                                                                         
                                                                        
                                                                        
                                                                            
                                                                     
                                                                             
                       
  
                                                                          
                                                                            
                                                                            
                     
                                                               
                                                                              
                                                                         
                                                                       
  
                                                                         
                                                                           
                                                                            
                                                                             
                                                                
   
(function (g) {
  'use strict';

     
                                                                         
                                                                           
                                                                       
                                                                     
     
  function groupRowsByTable(rows) {
    var out = {};
    var currentId = null;
    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      var id = (row.drop_table_id !== undefined && row.drop_table_id !== null && row.drop_table_id !== '')
        ? String(row.drop_table_id) : null;
      if (id) currentId = id;
      if (!currentId) {
        throw new Error('[DropTables] row ' + i + ' has a blank drop_table_id with no preceding table to belong to');
      }
      if (!out[currentId]) out[currentId] = [];
      out[currentId].push(row);
    }
    return out;
  }

  function rollQty(row, rng) {
    var min = Number(row.min_qty), max = Number(row.max_qty);
    if (isNaN(min) || isNaN(max)) {
      throw new Error('[DropTables] item "' + row.item_id + '" has a non-numeric min_qty/max_qty (' + row.min_qty + '/' + row.max_qty + ')');
    }
    if (max < min) {
      throw new Error('[DropTables] item "' + row.item_id + '" has max_qty (' + max + ') less than min_qty (' + min + ')');
    }
    var qty = (min === max) ? min : (min + Math.floor(rng() * (max - min + 1)));
    return { itemId: row.item_id, qty: qty };
  }

  function weightedPick(rows, rng) {
    var total = 0;
    for (var i = 0; i < rows.length; i++) total += (Number(rows[i].weight) || 0);
    if (total <= 0) {
      throw new Error('[DropTables] a weighted group has zero total weight across ' + rows.length + ' row(s) — cannot pick');
    }
    var r = rng() * total;
    for (var j = 0; j < rows.length; j++) {
      r -= (Number(rows[j].weight) || 0);
      if (r <= 0) return rows[j];
    }
    return rows[rows.length - 1];
  }

     
                                                                            
                                                                            
                                                                         
                                                                 
                                                                         
                                                       
     
  function rollTable(tableRows, rng) {
    rng = rng || Math.random;
    if (!tableRows || !tableRows.length) {
      throw new Error('[DropTables] rollTable() called with no rows');
    }
    var byGroup = {};
    var groupOrder = [];
    for (var i = 0; i < tableRows.length; i++) {
      var row = tableRows[i];
      var group = Number(row.group_id);
      if (isNaN(group)) {
        throw new Error('[DropTables] item "' + row.item_id + '" has a non-numeric group_id (' + row.group_id + ')');
      }
      if (!byGroup[group]) { byGroup[group] = []; groupOrder.push(group); }
      byGroup[group].push(row);
    }
    var out = [];
    for (var gi = 0; gi < groupOrder.length; gi++) {
      var g2 = groupOrder[gi];
      var rows = byGroup[g2];
      if (g2 === 0) {
        for (var k = 0; k < rows.length; k++) out.push(rollQty(rows[k], rng));
      } else {
        out.push(rollQty(weightedPick(rows, rng), rng));
      }
    }
    return out;
  }

     
                                                                      
                                                                           
                                                           
     
  function rollTableN(tableRows, count, rng) {
    if (!(count >= 1)) {
      throw new Error('[DropTables] rollTableN() needs count >= 1, got ' + JSON.stringify(count));
    }
    var out = [];
    for (var i = 0; i < count; i++) out = out.concat(rollTable(tableRows, rng));
    return out;
  }

     
                                                                          
                                                                      
                                   
     
  function rollTableById(allRows, tableId, count, rng) {
    var grouped = groupRowsByTable(allRows);
    var tableRows = grouped[String(tableId)];
    if (!tableRows) {
      throw new Error('[DropTables] unknown drop_table_id "' + tableId + '" — known tables: ' + Object.keys(grouped).join(', '));
    }
    return (count === undefined || count === null) ? rollTable(tableRows, rng) : rollTableN(tableRows, count, rng);
  }

  g.DropTables = {
    groupRowsByTable: groupRowsByTable,
    rollTable: rollTable,
    rollTableN: rollTableN,
    rollTableById: rollTableById
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = g.DropTables;
  }
})(typeof window !== 'undefined' ? window : globalThis);
