  
                                                             
  
                                                                           
                                                            
                                             
                                                                             
                                                                        
                                                                         
  
                                                                        
                                                                          
                                                                           
                                                             
  
                                                                   
                                                                    
                                                                        
  
                                                                           
                                                              
                                                                        
                                                                        
                                                                      
   
(function (g) {
  'use strict';

                                                                      
                                                                            
                                                                           
                                                                          
                                                                           
                                                                       
                                         
  var TAB_NAMES = [
    'TapAttack', 'PondTiers', 'Equipment', 'Expeditions', 'ExpeditionsHard', 'ExpeditionsExtreme', 'Enemies',
    'Bosses', 'DropTables', 'MergeRules', 'Traits', 'TraitFamilies', 'Frogs',
    'Harvesting', 'Flowers',
    'Currencies', 'StartingState', 'FTUE', 'FamilyRewards', 'HatchMilestones', 'PondLayout',
    'Items-Packs', 'Purchasables', 'Sacrifice',
  ];

  var READ_TAG = '[build read]';
  var KEY_HEADER_NAMES = { key: true, constant: true, knob_constant: true, parameter: true };
  var VALUE_HEADER_NAMES = { value: true, knob_value: true };

                                                                          
                                                                           
                                                                         
                                
                                                                          
  function parseCsv(text) {
    var rows = [];
    var row = [];
    var field = '';
    var inQuotes = false;
    var i = 0;
    var n = text.length;
    while (i < n) {
      var c = text[i];
      if (inQuotes) {
        if (c === '"') {
          if (text[i + 1] === '"') { field += '"'; i += 2; continue; }
          inQuotes = false; i++; continue;
        }
        field += c; i++; continue;
      }
      if (c === '"') { inQuotes = true; i++; continue; }
      if (c === ',') { row.push(field); field = ''; i++; continue; }
      if (c === '\r') { i++; continue; }
      if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; i++; continue; }
      field += c; i++;
    }
    if (field !== '' || row.length > 0) { row.push(field); rows.push(row); }
                                                                   
    if (rows.length > 0) {
      var last = rows[rows.length - 1];
      if (last.length === 1 && last[0] === '') rows.pop();
    }
    return rows;
  }

                                                                          
                                                              
                                                                           
                                                                         
                                                                       
                                                                        
                                                          
                                                                          
  function cell(row, i) { return i < row.length ? row[i] : ''; }
  function isBlank(v) { return v === undefined || v === null || String(v).trim() === ''; }
  function looksNumeric(v) {
    var s = String(v).trim();
    if (s === '') return false;
    return /^-?[\d,]+(\.\d+)?%?$/.test(s);
  }

  function numCols(rows) {
    var w = 0;
    for (var i = 0; i < rows.length; i++) w = Math.max(w, rows[i].length);
    return w;
  }

  function nonEmptyCount(row, cols) {
    var count = 0;
    for (var c = 0; c < cols; c++) if (!isBlank(cell(row, c))) count++;
    return count;
  }

  function numericFraction(row, cols) {
    var nonEmpty = 0, numeric = 0;
    for (var c = 0; c < cols; c++) {
      var v = cell(row, c);
      if (isBlank(v)) continue;
      nonEmpty++;
      if (looksNumeric(v)) numeric++;
    }
    return nonEmpty === 0 ? 0 : numeric / nonEmpty;
  }

  function isProseRow(row, cols) {
    var lens = [], colons = 0;
    for (var c = 0; c < cols; c++) {
      var s = String(cell(row, c) || '').trim();
      if (s === '') continue;
      lens.push(s.length);
      if (s.indexOf(': ') > 0) colons++;
    }
    if (lens.length === 0) return false;
    if (colons * 2 > lens.length) return true;
    lens.sort(function (a, b) { return a - b; });
    return lens[Math.floor(lens.length / 2)] > 80;
  }

  function isBuildTagRow(row, cols) {
    var tags = 0, lastTag = -1, firstOther = cols;
    for (var c = 0; c < cols; c++) {
      var s = String(cell(row, c) || '').trim().toLowerCase();
      if (s === '') continue;
      if (s === '[build read]' || s === '[build skip]') {
        tags++;
        lastTag = c;
      } else if (firstOther === cols) firstOther = c;
    }
                                                                         
                                                                           
                                                              
    return tags >= 2 && (firstOther === cols ||
      (firstOther > lastTag + 1 && String(cell(row, lastTag + 1) || '').trim() === ''));
  }

                                                                      
                                                                       
  function findTagRow(rows, cols, maxScan) {
    var limit = Math.min(maxScan, rows.length);
    for (var i = 0; i < limit; i++) {
      if (isBuildTagRow(rows[i], cols)) return i;
    }
    return null;
  }

  function findHeaderRow(rows, cols) {
    var numRows = rows.length;
    var firstContent = 0;
    while (firstContent < numRows && nonEmptyCount(rows[firstContent], cols) === 0) firstContent++;
    if (firstContent >= numRows) return firstContent;

    var scanEnd = Math.min(firstContent + 15, numRows);
    var maxWidth = 0;
    for (var r = firstContent; r < scanEnd; r++) maxWidth = Math.max(maxWidth, nonEmptyCount(rows[r], cols));

    var blockStart = firstContent;
    while (blockStart < numRows &&
      (nonEmptyCount(rows[blockStart], cols) < maxWidth * 0.6 ||
        isProseRow(rows[blockStart], cols) ||
        isBuildTagRow(rows[blockStart], cols))) {
      blockStart++;
    }
    if (blockStart >= numRows) blockStart = firstContent;

    var headerRow = blockStart;
    var bestFraction = numericFraction(rows[blockStart], cols);
    var lookEnd = Math.min(blockStart + 5, numRows);
    for (var h = blockStart + 1; h < lookEnd; h++) {
      if (isProseRow(rows[h], cols) || isBuildTagRow(rows[h], cols)) continue;
      var frac = numericFraction(rows[h], cols);
      if (frac < bestFraction) { bestFraction = frac; headerRow = h; }
    }
    return headerRow;
  }

                                                                          
                                                                           
                                                                        
                                                                          
                                                                          
                                                                       
                                          
                                                                          
  function convertValue(raw) {
    if (raw === undefined || raw === null) return '';
    var s = String(raw).trim();
    if (s === '') return '';
    var percentMatch = /^(-?[\d,]+(?:\.\d+)?)%$/.exec(s);
    if (percentMatch) return parseFloat(percentMatch[1].replace(/,/g, '')) / 100;
    if (/^-?[\d,]+(?:\.\d+)?$/.test(s)) return parseFloat(s.replace(/,/g, ''));
    return s;
  }

     
                                                                            
                                                                           
                          
     
  function parseTabCsv(csvText, tabName) {
    var rawRows = parseCsv(csvText);
    if (rawRows.length === 0) {
      throw new Error('[FPConfig] tab "' + tabName + '" CSV is empty');
    }
    var width = numCols(rawRows);

    var tagRowIdx = findTagRow(rawRows, width, 10);
    var readCols;
    if (tagRowIdx !== null) {
      var tagRow = rawRows[tagRowIdx];
      readCols = [];
      for (var c = 0; c < width; c++) {
        if (String(cell(tagRow, c) || '').trim().toLowerCase() === READ_TAG) readCols.push(c);
      }
      if (readCols.length === 0) {
        throw new Error('[FPConfig] tab "' + tabName + '" has a tag row but zero [BUILD READ] columns — nothing to read yet');
      }
    } else {
      readCols = [];
      for (var c2 = 0; c2 < width; c2++) readCols.push(c2);
    }

    var headerRowIdx = findHeaderRow(rawRows, width);
    var headerRow = rawRows[headerRowIdx];
                                                                                 
    if(tabName === 'Equipment'){
      var displayCol=headerRow.indexOf('display_name');
      if(displayCol >= 0 && readCols.indexOf(displayCol) < 0)readCols.push(displayCol);
    }
    var columns = [];
    for (var ci = 0; ci < readCols.length; ci++) {
      var colIdx = readCols[ci];
      var name = cell(headerRow, colIdx);
      if (typeof name === 'string' && name.trim()) columns.push([colIdx, name.trim()]);
    }
    if (columns.length === 0) {
      throw new Error('[FPConfig] tab "' + tabName + '" header row ' + (headerRowIdx + 1) + ' has no named READ columns');
    }

    var keyCol = null, valCol = null;
    for (var cj = 0; cj < columns.length; cj++) {
      var lname = columns[cj][1].toLowerCase();
      if (keyCol === null && KEY_HEADER_NAMES[lname]) keyCol = columns[cj][0];
      if (valCol === null && VALUE_HEADER_NAMES[lname]) valCol = columns[cj][0];
    }

    var outRows = [];
    var knobs = {};
    var secondaryKnobs = false, trailingProse = 0;
    for (var r = headerRowIdx + 1; r < rawRows.length; r++) {
      var dataRow = rawRows[r];
                                                                            
                                                                            
                                                                       
      if(keyCol === null && valCol === null){
        var nextKey=null, nextVal=null;
        readCols.forEach(function(c){
          var heading=String(cell(dataRow,c)||'').trim().toLowerCase();
          if(KEY_HEADER_NAMES[heading]) nextKey=c;
          if(VALUE_HEADER_NAMES[heading]) nextVal=c;
        });
        if(nextKey!==null && nextVal!==null){
          keyCol=nextKey; valCol=nextVal; secondaryKnobs=true;
                                                                        
          outRows.length-=trailingProse;
          continue;
        }
      }
      var vals = [];
      var anyNonBlank = false;
      for (var k = 0; k < columns.length; k++) {
        var raw = cell(dataRow, columns[k][0]);
        if (!isBlank(raw)) anyNonBlank = true;
        vals.push(raw);
      }
      if (!anyNonBlank) continue;                                                       

      var obj = {};
      for (var m = 0; m < columns.length; m++) obj[columns[m][1]] = convertValue(vals[m]);
                                                                                
                                                                                 
      if (tabName === 'Purchasables' && typeof obj.effect_value === 'string' && /^[{\[]/.test(obj.effect_value)) {
        try { obj.effect_value = JSON.parse(obj.effect_value); }
        catch (e) { throw new Error('[FPConfig] Purchasables invalid effect_value JSON for ' + obj.item_id); }
      }
      if(tabName === 'FTUE' && keyCol !== null && /^text_/.test(String(cell(dataRow,keyCol)).trim())){
        for(var tc=0;tc<columns.length;tc++) if(columns[tc][0] === valCol) obj[columns[tc][1]] = String(cell(dataRow,valCol));
      }
      if(!secondaryKnobs){
        outRows.push(obj);
        trailingProse=nonEmptyCount(dataRow,width)===1 && isProseRow(dataRow,width) ? trailingProse+1 : 0;
      }

      if (keyCol !== null && valCol !== null) {
        var kRaw = cell(dataRow, keyCol), vRaw = cell(dataRow, valCol);
        if (!isBlank(kRaw) && !isBlank(vRaw)) knobs[String(kRaw).trim()] = tabName === 'FTUE' && /^text_/.test(String(kRaw).trim()) ? String(vRaw) : convertValue(vRaw);
      }
    }

    return { rows: outRows, knobs: knobs };
  }

                                                                          
                                                                
                                                                          
  var configData = {};

  function tabData(tab) {
    var t = configData[tab];
    if (!t) {
      throw new Error('[FPConfig] unknown config tab "' + tab + '" — exported tabs: ' + Object.keys(configData).join(', '));
    }
    return t;
  }

  function rows(tab) {
    return tabData(tab).rows;
  }

  function row(tab, keyCol, keyVal) {
    var rs = rows(tab);
    if (rs.length === 0) {
      throw new Error('[FPConfig] tab "' + tab + '" has no rows');
    }
    if (!(keyCol in rs[0])) {
      throw new Error('[FPConfig] tab "' + tab + '" has no column "' + keyCol + '" — known columns: ' + Object.keys(rs[0]).join(', '));
    }
    for (var i = 0; i < rs.length; i++) {
      var v = rs[i][keyCol];
      if (v === keyVal || String(v) === String(keyVal)) return rs[i];
    }
    throw new Error('[FPConfig] tab "' + tab + '" has no row where ' + keyCol + ' === ' + JSON.stringify(keyVal));
  }

  function value(tab, name) {
    var knobs = tabData(tab).knobs;
    if (!(name in knobs)) {
      throw new Error('[FPConfig] tab "' + tab + '" has no knob "' + name + '" — known knobs: ' + Object.keys(knobs).join(', '));
    }
    return knobs[name];
  }

                                                                           
                                                                             
                                                                                    
  function text(key, fallback, tokens) {
    var copy;
    try { copy = value('FTUE', key); } catch (e) { copy = fallback; }
    if (copy === undefined || copy === null || String(copy).trim() === '') copy = fallback;
    return String(copy).replace(/\{(\w+)\}/g, function (all, name) {
      return tokens && Object.prototype.hasOwnProperty.call(tokens, name) ? String(tokens[name]) : all;
    });
  }

     
                                                                             
                                                                     
                                                                         
                                           
     
  function loadFromSources(sourcesByTab) {
    var names = Object.keys(sourcesByTab);
    for (var i = 0; i < names.length; i++) {
      var name = names[i];
      var src = sourcesByTab[name];
      configData[name] = (typeof src === 'string') ? parseTabCsv(src, name) : src;
    }
  }

  function fetchAllTabs() {
    var tasks = TAB_NAMES.map(function (name) {
      var url = 'data/sheets/' + name + '.csv';
                                                                                
                                                                          
      return fetch(url, { cache: 'no-cache' }).then(function (res) {
        if (!res.ok) {
          console.warn('[FPConfig] tab "' + name + '" not found at ' + url + ' (status ' + res.status + ') — skipping; FPConfig.rows("' + name + '") will throw if used');
          return;
        }
        return res.text().then(function (text) {
          try {
            configData[name] = parseTabCsv(text, name);
          } catch (err) {
            console.error('[FPConfig] failed to parse tab "' + name + '": ' + err.message);
          }
        });
      }, function (err) {
        console.error('[FPConfig] failed to fetch tab "' + name + '" from ' + url + ': ' + err.message);
      });
    });
    return Promise.all(tasks);
  }

  var ready;
  if (typeof g.document !== 'undefined' && typeof g.fetch === 'function') {
    ready = fetchAllTabs();
  } else {
                                                                            
                                                                             
                                                                          
                            
    ready = Promise.resolve();
  }

  g.FPConfig = {
    rows: rows,
    row: row,
    value: value,
    text: text,
    ready: ready,
    loadFromSources: loadFromSources,
    parseTabCsv: parseTabCsv,
    TAB_NAMES: TAB_NAMES,
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = g.FPConfig;
  }
})(typeof window !== 'undefined' ? window : globalThis);
