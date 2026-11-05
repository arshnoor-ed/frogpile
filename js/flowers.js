  
                                                                              
                                                            
  
                                                                            
                                                                           
                                                                         
                                                                            
                                                                          
                                                                        
                                                                             
                                                                             
                                                                             
                                                                          
                                                           
                                                                          
                                                                      
                                                                         
                                                      
                                                                         
                                                                         
                                                                            
                                                                             
                                                                     
                                                                             
                                                                       
                                                                    
                                                
                                                                        
                                                                       
                                                               
                                                                       
                                                                           
                                                                        
                                                                           
                                                                       
                                                                             
                                                                          
                                               
                                                                    
                                                                           
                                                                          
                                                                            
                                                                          
                                                                          
                                                                            
                                                                          
                                                                             
                                                                             
                                                             
  
                                                                          
                                                                  
                                                                          
                                                                            
                                                                          
                                                            
                                                                     
                                                                             
                                                             
                                                
                                                                        
                                                                   
                                                                          
                                                                             
                                                                 
                                                       
                                                       
                                                      
                                                                            
                                                           
                                                                        
                                                                            
                                                                          
                                                                           
                                                                         
                                                                            
                                                                           
                                                                           
                                                                           
                                                                            
                                                                            
                                                                      
                                                                           
                                                   
  
                                                                             
                                                                         
                                                                            
                                                                         
                                                                            
                                                                        
                                                                     
                                                                           
                                                                              
                                                                              
                                                                            
                                                                              
                                                                          
                                                        
  
                                                                        
                                                                             
                                                                           
                                                                           
                                                                         
                                                                       
                                               
   
(function (g) {
  'use strict';

  var FLOWERS_TAB = 'Flowers';
  var FROGS_TAB = 'Frogs';

  function cfg() {
    if (!g.FPConfig) {
      throw new Error('[Flowers] FPConfig is missing — load js/fp-config.js before js/flowers.js, and call this after boot (FPConfig.ready)');
    }
    return g.FPConfig;
  }

  function kit() {
    if (!g.KitUI) {
      throw new Error('[Flowers] KitUI is missing — load js/ui-kit.js before js/flowers.js');
    }
    return g.KitUI;
  }

  function allFlowerDefs() { return cfg().rows(FLOWERS_TAB); }
  function allFlowerIds() { return allFlowerDefs().map(function (r) { return r.Name; }); }
  function flowerDef(flowerId) { return cfg().row(FLOWERS_TAB, 'Name', flowerId); }

  function reqCol(def, col, flowerId) {
    if (!(col in def) || def[col] === '' || def[col] == null) {
      throw new Error('[Flowers] flower "' + flowerId + '" is missing its "' + col + '" column on the "' + FLOWERS_TAB + '" tab — re-export [EXPORT] Flowers');
    }
    return def[col];
  }

    
                                                                         
                                                                         
                                                                          
                                                                       
                                                                        
                   
     
  function flowerBuffSpec(flowerId) {
    var def = flowerDef(flowerId);                                                         
    return {
      flowerId: def.Name,
      stationSlotCount: reqCol(def, 'Frog Slots', flowerId),
      earnTimeS: reqCol(def, 'Buff Earning Time', flowerId),
      durationS: reqCol(def, 'Buff Duration', flowerId),
      atk: reqCol(def, 'buff_attack', flowerId),
      def: reqCol(def, 'buff_defense', flowerId),
      hp: reqCol(def, 'buff_HP', flowerId),
      lifetimeS: reqCol(def, 'flower lifetime (s)', flowerId),
      tendingCost: reqCol(def, 'cost tending seed', flowerId),
      plantCost: reqCol(def, 'cost new seed', flowerId),
      desiredFlyCount: reqCol(def, 'desired fly count', flowerId),
      flySpawnCooldownS: reqCol(def, 'fly spawn cooldown', flowerId),
      flyEatCooldownS: reqCol(def, 'fly eating cooldown', flowerId),
      flyDrawn: reqCol(def, 'fly_drawn', flowerId),
    };
  }

  function plantCostFor(flowerId) { return flowerBuffSpec(flowerId).plantCost; }
  function tendingCostFor(flowerId) { return flowerBuffSpec(flowerId).tendingCost; }

                                                                                  
    
                                                                                
                                                                                
                                                                               
                                                                               
                                                                                
                                                                                 
                                                                                
                                                                             
  var FIRST_SEED_FLOWER = 'lily', FIRST_SEED_NODE = 'node-4';
  function seedsFoundList(state) {
    if (!Array.isArray(state.flowerSeedsFound)) {
      var paid = (state.seeds || 0) > 0 || (state.expeditionsCleared || []).indexOf(FIRST_SEED_NODE) >= 0;
      state.flowerSeedsFound = paid ? [FIRST_SEED_FLOWER] : [];
    }
    return state.flowerSeedsFound;
  }
  function unlockedFlowers(state) {
    if (!state) return [];
    var out = seedsFoundList(state).slice();
    (state.flowerPlots || []).forEach(function (p) {
      if (p && p.flowerId && (p.stage === 'bud' || p.stage === 'bloom') && out.indexOf(p.flowerId) < 0) out.push(p.flowerId);
    });
    return out;
  }
  function isFlowerUnlocked(state, flowerId) { return unlockedFlowers(state).indexOf(flowerId) >= 0; }
  function unlockFlower(state, flowerId) {
    flowerDef(flowerId);                                                         
    var found = seedsFoundList(state);
    if (found.indexOf(flowerId) >= 0) return false;
    found.push(flowerId);
    return true;
  }

                                                                                  
    
                                                                             
  var FROG_BUFF_SLOTS_COLUMN = 'Flower Buff Slots';

                                                                              
                                                                            
                                                                              
                                                                               
                                                                        
                                                                             
  function frogLevelForBodySize(bodySize) {
    return Math.max(0, Math.min(4, bodySize || 0));
  }

  function frogsRowForLevel(level) {
    var rows = cfg().rows(FROGS_TAB);
    for (var i = 0; i < rows.length; i++) {
      if (rows[i]['Frog Level'] === level) return rows[i];
    }
    throw new Error('[Flowers] "' + FROGS_TAB + '" tab has no "Frog Level" row for ' + level);
  }

  function frogBuffSlotCount(bodySize) {
    var row = frogsRowForLevel(frogLevelForBodySize(bodySize));
    if (!(FROG_BUFF_SLOTS_COLUMN in row) || row[FROG_BUFF_SLOTS_COLUMN] === '' || row[FROG_BUFF_SLOTS_COLUMN] == null) {
      throw new Error('[Flowers] "' + FROGS_TAB + '" tab is missing its "' + FROG_BUFF_SLOTS_COLUMN + '" column — re-export [EXPORT] Frogs');
    }
    return row[FROG_BUFF_SLOTS_COLUMN];
  }

                                                                                  

  function mkFrogBuffs(bodySize) { return new Array(frogBuffSlotCount(bodySize)).fill(null); }

  function pruneFrogBuffs(buffs, now) {
    if (!buffs) return;
    for (var i = 0; i < buffs.length; i++) {
      if (buffs[i] && remainingMs(buffs[i], now) <= 0) buffs[i] = null;
    }
  }

  function pruneAllBuffs(frogBuffsMap, now) {
    now = now == null ? Date.now() : now;
    if (!frogBuffsMap) return;
    Object.keys(frogBuffsMap).forEach(function (fid) { pruneFrogBuffs(frogBuffsMap[fid], now); });
  }

  function freeBuffSlotIndex(buffs) {
    return (buffs || []).findIndex(function (b) { return !b; });
  }

  function activeBuffCount(buffs, now) {
    now = now == null ? Date.now() : now;
    return (buffs || []).filter(function (b) { return b && remainingMs(b, now) > 0; }).length;
  }

  function grantBuffInto(buffs, entry) {
    var idx = freeBuffSlotIndex(buffs);
    if (idx === -1) return -1;
    buffs[idx] = entry;
    return idx;
  }

                                                                           
                                                                          
                                                                        
                                                                         
                                            
  function ensureFrogBuffs(frogBuffsMap, frogId, bodySize) {
    var n = frogBuffSlotCount(bodySize);
    var cur = frogBuffsMap[frogId];
    if (!cur) { frogBuffsMap[frogId] = new Array(n).fill(null); return frogBuffsMap[frogId]; }
    while (cur.length < n) cur.push(null);
    return cur;
  }

                                                                                  

  function mkStation(flowerId) {
    var spec = flowerBuffSpec(flowerId);                                                                                      
    return { flowerId: flowerId, slots: new Array(spec.stationSlotCount).fill(null) };
  }

  function emptySlotIndex(station) {
    return station.slots.findIndex(function (s) { return !s; });
  }

  function slotOfFrog(station, frogId) {
    return station.slots.findIndex(function (s) { return s && s.frogId === frogId; });
  }

    
                                                                            
                                                          
                                                                            
                                                                            
                                                                           
                          
    
                                                                            
                                                                        
                                      
                                                                         
                                                                        
                                                                        
                                                                
     
  function dropFrog(station, frogId, targetSlot, now) {
    if (!station) throw new Error('[Flowers] dropFrog requires a station');
    now = now == null ? Date.now() : now;
    var existingIdx = slotOfFrog(station, frogId);
    var carried = existingIdx !== -1 ? station.slots[existingIdx] : null;
    function place(idx) {
      station.slots[idx] = carried || { frogId: frogId, earnStartAt: now };
    }

    if (targetSlot == null) {
      var idx = emptySlotIndex(station);
      if (idx === -1) return false;                                                     
      if (existingIdx !== -1 && existingIdx !== idx) station.slots[existingIdx] = null;
      place(idx);
      return true;
    }

    if (typeof targetSlot !== 'number' || targetSlot < 0 || targetSlot >= station.slots.length) {
      throw new Error('[Flowers] bad slot index ' + targetSlot + ' — this station has ' + station.slots.length + ' slots');
    }
    if (existingIdx === targetSlot) return true;                          

    var occupant = station.slots[targetSlot];
    if (existingIdx !== -1) station.slots[existingIdx] = null;

    if (!occupant) {
      place(targetSlot);
      return true;
    }

                                                                                                         
    station.slots[targetSlot] = null;
    place(targetSlot);
    var freeIdx = emptySlotIndex(station);
    if (freeIdx !== -1) station.slots[freeIdx] = occupant;
    return true;
  }

                                                                         
                                                                        
                                                                     
                                                                 
                                                                           
                                                                           
                      
  function removeFrog(station, frogId) {
    var idx = slotOfFrog(station, frogId);
    if (idx !== -1) station.slots[idx] = null;
    return idx !== -1;
  }

                                                                       
                                                                             
                                             
  function killFlower(station) {
    var frogIds = station.slots.filter(Boolean).map(function (s) { return s.frogId; });
    for (var i = 0; i < station.slots.length; i++) station.slots[i] = null;
    return frogIds;
  }

                                                                                  

                                                                       
                                                                   
  function remainingMs(entry, now) {
    return entry.pausedRemainingMs != null ? entry.pausedRemainingMs : Math.max(0, entry.expiresAt - now);
  }
  function pauseBuffs(buffs, now) {
    pruneFrogBuffs(buffs, now);
    (buffs || []).forEach(function (b) {
      if (b && b.pausedRemainingMs == null) b.pausedRemainingMs = remainingMs(b, now);
    });
  }
  function resumeBuffs(buffs, now) {
    (buffs || []).forEach(function (b) {
      if (b && b.pausedRemainingMs != null) {
        b.expiresAt = now + b.pausedRemainingMs;
        delete b.pausedRemainingMs;
      }
    });
  }
  function syncBuffTimers(stations, frogBuffsMap, now) {
    now = now == null ? Date.now() : now;
    var seated = new Set();
    (stations || []).forEach(function (st) { if (st) st.slots.forEach(function (seat) { if (seat) seated.add(seat.frogId); }); });
    Object.keys(frogBuffsMap || {}).forEach(function (id) {
      if (seated.has(id)) pauseBuffs(frogBuffsMap[id], now);
      else resumeBuffs(frogBuffsMap[id], now);
    });
  }

  function grantCopy(buffs, spec, now) {
    return grantBuffInto(buffs, {
      flowerId: spec.flowerId,
      atk: spec.atk, def: spec.def, hp: spec.hp,
      grantedAt: now,
      expiresAt: now + spec.durationS * 1000,
      pausedRemainingMs: spec.durationS * 1000,
    });
  }

                                                                            
                                                                            
                                                                      
  var SNACK_GRACE_MS = 4000;

                                                                            
                                                                 
                                                                           
                                    
                                                                            
                                                                         
                                                                           
                                                                            
                                                                              
  function tickSeat(seat, buffs, spec, now) {
    if (seat.earnStartAt == null) seat.earnStartAt = now;                                                       
    pauseBuffs(buffs, now);
    if (freeBuffSlotIndex(buffs) === -1) return 'leave';
    if (now - seat.earnStartAt < spec.earnTimeS * 1000) return null;
    if (seat.snackAt == null) seat.snackAt = now;
    if (now - seat.snackAt < SNACK_GRACE_MS) return 'snack';
    grantCopy(buffs, spec, now);
    return 'leave';
  }

                                                                              
                                                                            
                                                                            
                       
  function feedSeat(station, frogId, frogBuffsMap, now, bodySize) {
    now = now == null ? Date.now() : now;
    var idx = slotOfFrog(station, frogId);
    if (idx === -1) return null;
    var buffs = ensureFrogBuffs(frogBuffsMap, frogId, bodySize);
    var at = grantCopy(buffs, flowerBuffSpec(station.flowerId), now);
    station.slots[idx] = null;
    resumeBuffs(buffs, now);
    return at === -1 ? null : buffs[at];
  }

  function tickStation(station, frogBuffsMap, now, getBodySize) {
    now = now == null ? Date.now() : now;
    if (!frogBuffsMap) throw new Error('[Flowers] tickStation requires frogBuffsMap (state.frogFlowerBuffs)');
    var spec = flowerBuffSpec(station.flowerId);
    var result = {changed:false, ejected:[], snacks:[]};
    station.slots.forEach(function (seat, index) {
      if (!seat) return;
      var bodySize = typeof getBodySize === 'function' ? getBodySize(seat.frogId) : 0;
      var buffs = ensureFrogBuffs(frogBuffsMap, seat.frogId, bodySize);
      var before = activeBuffCount(buffs, now);
      var next = tickSeat(seat, buffs, spec, now);
      if (next === 'snack') result.snacks.push(seat.frogId);
      if (next === 'leave') {
        result.ejected.push(seat.frogId);
        station.slots[index] = null;
        resumeBuffs(buffs, now);
      }
      if (before !== activeBuffCount(buffs, now) || next === 'leave') result.changed = true;
    });
    return result;
  }

  function tickAll(stations, frogBuffsMap, now, getBodySize) {
    now = now == null ? Date.now() : now;
    syncBuffTimers(stations, frogBuffsMap, now);
    pruneAllBuffs(frogBuffsMap, now);                                                                              
    var result = {changed:false, ejected:[], snacks:[]};
    (stations || []).forEach(function (st) {
      if (!st) return;
      var tick = tickStation(st, frogBuffsMap, now, getBodySize);
      result.changed = result.changed || tick.changed;
      result.ejected = result.ejected.concat(tick.ejected);
      result.snacks = result.snacks.concat(tick.snacks);
    });
    return result;
  }

                                                                                      
    
                                                                             
                                                                            
                                                                            
                                                                            
                                                                            

  function mkFlyState() { return { flies: [], lastSpawnAt: null }; }

  function tickFlyState(flyState, spec, now) {
    now = now == null ? Date.now() : now;
    if (flyState.flies.length >= spec.desiredFlyCount) return false;
    if (flyState.lastSpawnAt != null && now - flyState.lastSpawnAt < spec.flySpawnCooldownS * 1000) return false;
    flyState.flies.push({ spawnedAt: now });
    flyState.lastSpawnAt = now;
    return true;                                                  
  }

  function consumeFly(flyState) {
    if (!flyState.flies.length) return false;
    flyState.flies.shift();
    return true;
  }

  function flyCount(flyState) { return flyState.flies.length; }

                                                                                          
    
                                                                    
                                                                             
                                                              

  function bloomFlower(plot, now) {
    now = now == null ? Date.now() : now;
    var spec = flowerBuffSpec(plot.flowerId);
    plot.lifetimeEndsAt = now + spec.lifetimeS * 1000;
  }

  function lifetimeRemainingS(plot, now) {
    now = now == null ? Date.now() : now;
    if (plot.lifetimeEndsAt == null) return null;
    return Math.max(0, (plot.lifetimeEndsAt - now) / 1000);
  }

                                                                         
                                                                         
                                                        
  function tendFlower(plot, now) {
    now = now == null ? Date.now() : now;
    var spec = flowerBuffSpec(plot.flowerId);
    plot.lifetimeEndsAt = now + spec.lifetimeS * 1000;
  }

  function isFlowerDead(plot, now) {
    now = now == null ? Date.now() : now;
    return plot.lifetimeEndsAt != null && now >= plot.lifetimeEndsAt;
  }

                                                                                  

  function emptyBoost() { return { atk: 0, def: 0, hp: 0 }; }

    
                                                                       
                                                                     
                                                                         
                                                                      
                                                                       
                                                                
     
  function statBoost(frogBuffsMap, frogId, now) {
    now = now == null ? Date.now() : now;
    var buffs = (frogBuffsMap && frogBuffsMap[frogId]) || [];
    var out = emptyBoost();
    buffs.forEach(function (entry) {
      if (!entry || remainingMs(entry, now) <= 0) return;
      out.atk += entry.atk || 0;
      out.def += entry.def || 0;
      out.hp += entry.hp || 0;
    });
    return out;
  }

  function formatStatValue(value) { return (value >= 0 ? '+' : '') + Math.round(value); }

  function fmtMMSS(totalSeconds) {
    var s = Math.max(0, Math.round(totalSeconds || 0));
    var m = Math.floor(s / 60);
    s = s % 60;
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

                                                                                  

  var STAT_ICON = { atk: '⚔️', def: '\u{1F6E1}️', hp: '\u{1F49A}' };
  var STAT_LABEL = { atk: 'ATK', def: 'DEF', hp: 'HP' };
  var STAT_KEYS = ['atk', 'def', 'hp'];

                                                                         
                                                                          
                                                                      
                                                                             
  function frogBuffSlotsView(frogBuffsMap, frogId, bodySize, now) {
    now = now == null ? Date.now() : now;
    var buffs = (frogBuffsMap && frogBuffsMap[frogId]) || mkFrogBuffs(bodySize);
    return buffs.map(function (entry) {
      if (!entry || remainingMs(entry, now) <= 0) return { empty: true };
      var parts = STAT_KEYS.filter(function (k) { return entry[k]; }).map(function (k) {
        return { stat: k, icon: STAT_ICON[k], label: STAT_LABEL[k], formattedValue: formatStatValue(entry[k]) };
      });
      return {
        empty: false,
        flowerId: entry.flowerId,
        paused: entry.pausedRemainingMs != null,
        parts: parts,
        expiresInS: remainingMs(entry, now) / 1000,
      };
    });
  }

                                                                        
                                                                      
  function seatView(station, slotIndex, frogBuffsMap, now) {
    now = now == null ? Date.now() : now;
    var seat = station.slots[slotIndex];
    if (!seat) return { empty: true };
    var spec = flowerBuffSpec(station.flowerId);
    var buffs = (frogBuffsMap && frogBuffsMap[seat.frogId]) || [];
    var full = buffs.length > 0 && freeBuffSlotIndex(buffs) === -1;
    var elapsedS = Math.max(0, (now - (seat.earnStartAt == null ? now : seat.earnStartAt)) / 1000);
    return {
      empty: false,
      frogId: seat.frogId,
      full: full,
      snackInS: full ? null : Math.max(0, spec.earnTimeS - elapsedS),
    };
  }

                                                                       
                                                                              
                                                                             
                                                                           
                                                                          
                                                                              
  function flowerRingGeometry(padWidth, total) {
    var spread = Math.max(1, total / 6);
    var rx = padWidth * 0.90625 * spread;
    var ry = padWidth * 0.75 * spread;
    var seatWidth = padWidth;
    var seatHeight = seatWidth / 2;
    return { rx: rx, ry: ry, seatWidth: seatWidth, seatHeight: seatHeight,
      width: 2 * rx + seatWidth, height: 2 * ry + seatHeight };
  }

  function radialSlotOffset(index, total, padWidth) {
    var angle = (index / total) * 2 * Math.PI;
    var ring = flowerRingGeometry(padWidth, total);
    return { x: ring.rx * Math.sin(angle), y: -ring.ry * Math.cos(angle) };
  }

  function pointInOval(x, y, rect) {
    if (!rect.width || !rect.height) return false;
    var dx = (x - rect.left - rect.width / 2) / (rect.width / 2);
    var dy = (y - rect.top - rect.height / 2) / (rect.height / 2);
    return dx * dx + dy * dy <= 1;
  }

                                                                            
  function radialSlotTransform(index, total, padWidth) {
    var p = radialSlotOffset(index, total, padWidth == null ? 1 : padWidth);
    if (padWidth == null) {
      return 'translate(-50%,-50%) translate(calc(var(--fb-pad-width) * ' + p.x.toFixed(6)
        + '),calc(var(--fb-pad-width) * ' + p.y.toFixed(6) + '))';
    }
    return 'translate(-50%,-50%) translate(' + p.x.toFixed(3) + 'px,' + p.y.toFixed(3) + 'px)';
  }

                                                                        
                                                                             
                                                                     
                                                    
  function chargeProgress(station, seat, now) {
    return Math.max(0, Math.min(1, (now - (seat.earnStartAt == null ? now : seat.earnStartAt)) / (flowerBuffSpec(station.flowerId).earnTimeS * 1000)));
  }
  function rowPipsHTML(frogBuffsMap, frogId, bodySize, now) {
    var views = frogBuffSlotsView(frogBuffsMap,frogId,bodySize,now);
    var count = views.filter(function(v){ return !v.empty; }).length;
    if (!count) return '';
    return '<span class="xp-gear flower-buff-pips" title="Flower buffs: ' + count + '/' + views.length + '" aria-label="Flower buffs: ' + count + ' of ' + views.length + '">🌸<span class="eq-ring">'
      + views.map(function(v){return '<span class="eq-ring-seg' + (v.empty ? '' : ' filled') + '"></span>';}).join('') + '</span></span>';
  }
  function stationHTML(station, frogBuffsMap, now, frogHtmlFor) {
    var total = station.slots.length;
    var cells = station.slots.map(function (seat, i) {
      var posStyle = ' style="transform:' + radialSlotTransform(i, total) + '"';
      if (!seat) return '<div class="fb-slot fb-slot-' + i + ' empty" data-slot="' + i + '"' + posStyle + '></div>';
      var content = typeof frogHtmlFor === 'function' ? frogHtmlFor(seat.frogId) : '';
      return '<div class="fb-slot fb-slot-' + i + ' filled"'
        + ' data-slot="' + i + '" data-frog="' + seat.frogId + '"' + posStyle + '>' + content + '</div>';
    }).join('');
    var full = emptySlotIndex(station) === -1;
    return '<div class="fb-station" data-flower="' + station.flowerId + '">' + cells
      + (full ? '<span class="fb-station-full">FULL</span>' : '') + '</div>';
  }

                                                                           
                                                                          
                                                                            
                                   
  function inspectRowsHTML(frogBuffsMap, frogId, bodySize, now) {
    now = now == null ? Date.now() : now;
    var KitUI = kit();
    var views = frogBuffSlotsView(frogBuffsMap, frogId, bodySize, now);
    var cells = views.map(function (v) {
      if (v.empty) return '<div class="fb-bslot fb-bslot-empty"><span class="fb-bslot-ghost">+</span></div>';
      var pillsHTML = v.parts.map(function (p) {
        return KitUI.pill({ icon: p.icon, label: p.label, value: p.formattedValue, className: 'fb-pill' });
      }).join('');
      return '<div class="fb-bslot fb-bslot-filled" data-flower="' + v.flowerId + '">'
        + '<span class="fb-bslot-pills">' + pillsHTML + '</span>'
        + '<span class="fb-bslot-timer">' + fmtMMSS(v.expiresInS) + (v.paused ? ' · paused while seated' : '') + '</span></div>';
    }).join('');
    return '<div class="lw-sub fb-sub" style="margin-top:10px;">Flower buffs</div><div class="fb-bslots" id="flower-buff-rows">' + cells + '</div>';
  }

                                                                           
                                                                     
                                                                           
                                                                         
                              
  var FLOWER_DISPLAY_NAMES = {
    lily: 'Pink Lily', whitelily: 'White Lily', bluelily: 'Blue Lily', reed: 'Reed',
    daisy: 'Daisy', bluebell: 'Bluebell', marigold: 'Marigold', lotus: 'Lotus',
    orchid: 'Orchid', emberbloom: 'Emberbloom',
  };
  function flowerDisplayName(id) { return FLOWER_DISPLAY_NAMES[id] || String(id).replace(/_/g, ' '); }

                                                                    
                                                                             
                                                                            
                                                                         
                                                                            
                                                                         
                                                                            
                                                                             
                                                                          
                                      
  var PICKER_DISPLAY_ORDER = { lily: 0, whitelily: 1, bluelily: 2, reed: 3 };
  function pickerOrderedDefs() {
    return allFlowerDefs().slice().sort(function (a, b) {
      var oa = PICKER_DISPLAY_ORDER.hasOwnProperty(a.Name) ? PICKER_DISPLAY_ORDER[a.Name] : 99;
      var ob = PICKER_DISPLAY_ORDER.hasOwnProperty(b.Name) ? PICKER_DISPLAY_ORDER[b.Name] : 99;
      return oa - ob;
    });
  }

                                                                                 
                                                                             
                                                                             
                                                                          
                                                               
                                                                         
                                                                             
                                                                             
                                                             
                                                                             
                                                                     
                                   
  function chooserBuffParts(spec) {
    return [['atk', 'ATK', spec.atk], ['def', 'DEF', spec.def], ['hp', 'HP', spec.hp]]
      .filter(function (v) { return v[2] !== 0; });
  }
                                                                            
                                                                              
                                                                      
  function chooserHTML(seedsAvailable, artFor, onPickAttr, selected, isLocked) {
    var K = kit(), esc = K.esc;
    if (typeof K.flowerCard !== 'function') {
      throw new Error('[Flowers] KitUI.flowerCard is missing — load js/kit/art.js before using chooserHTML');
    }
    var locked = typeof isLocked === 'function' ? isLocked : function () { return false; };
    if (selected && locked(selected)) selected = null;
    var open = 0;
    var tiles = pickerOrderedDefs().map(function (def) {
      var id = def.Name, art = artFor(id) || {};
      if (art.hide) return '';
      if (locked(id)) {
        return K.flowerCard({ state: 'locked', imgSrc: art.src || '', className: 'fp-flowerpick__tile fp-flowerpick__tile--locked' })
          .replace(/^<div\b/, '<div data-flower="' + esc(id) + '" data-affordable="false" data-locked="true"');
      }
      open++;
      var cost = plantCostFor(id), on = id === selected, name = flowerDisplayName(id);
      var parts = chooserBuffParts(flowerBuffSpec(id));
                                                                            
                                                                                    
      var main = parts.slice().sort(function (a, b) { return Math.abs(b[2]) - Math.abs(a[2]); })[0];
      var card = K.flowerCard({
        state: on ? 'selected' : 'default',
        name: name,
        effect: parts.map(function (v) { return '+' + v[2] + ' ' + v[1]; }).join(' · '),
        insect: main ? main[0] : null, showInsect: !!main,
        seeds: '×' + cost,
        imgSrc: art.src || '',
        onclick: onPickAttr(id) || 'void 0',                                                              
        ariaLabel: name + ', ' + cost + ' seeds' + (on ? ', selected' : ''),
        className: 'fp-flowerpick__tile' + (on ? ' fp-flowerpick__tile--on' : ''),
      });
      return card.replace(/^<button\b/, '<button data-flower="' + esc(id) + '" data-affordable="' + (seedsAvailable >= cost) + '"');
    }).join('');
    var detail = '<span class="fp-flowerpick__hint">' + (open ? 'Tap a species to see its buff and lifetime.'
      : 'Win flower seeds on expeditions to plant here.') + '</span>';
    if (selected) {
      var spec = flowerBuffSpec(selected);
      var buffs = chooserBuffParts(spec).map(function (v) { return '+' + v[2] + ' ' + v[1]; }).join(', ');
      detail = '<b class="fp-flowerpick__name">' + esc(flowerDisplayName(selected)) + '</b>'
        + '<span class="fp-flowerpick__desc">' + esc(buffs || 'No stat buff') + ' per copy · seat a frog for '
        + fmtMMSS(spec.earnTimeS) + ' to earn a ' + fmtMMSS(spec.durationS) + ' buff. Bloom lasts ' + fmtMMSS(spec.lifetimeS) + '.</span>';
    }
    return '<div class="fp-flowerpick__grid">' + tiles + '</div><div class="fp-flowerpick__detail" aria-live="polite">' + detail + '</div>';
  }

    
                                                                            
                                                                          
                                                                               
                                                                           
                                                                              
                                                                       
    
                                                                               
                                                                         
                                                                        
     
  function ftuePlantStep(state, emptyPadFinder, defaultFlowerId) {
    if (!state) throw new Error('[Flowers] ftuePlantStep requires state');
    var flowerId = defaultFlowerId || allFlowerIds()[0];
    flowerDef(flowerId);            
    if (!(state.seeds > 0)) state.seeds = Math.max(state.seeds || 0, 1);
    var emptyPadIndex = typeof emptyPadFinder === 'function' ? emptyPadFinder() : null;
    return { flowerId: flowerId, seedsAvailable: state.seeds, emptyPadIndex: emptyPadIndex };
  }

  var Flowers = {
    allFlowerIds: allFlowerIds,
    allFlowerDefs: allFlowerDefs,
    flowerDef: flowerDef,
    flowerBuffSpec: flowerBuffSpec,
    plantCostFor: plantCostFor,
    tendingCostFor: tendingCostFor,
    unlockedFlowers: unlockedFlowers,
    isFlowerUnlocked: isFlowerUnlocked,
    unlockFlower: unlockFlower,
    frogLevelForBodySize: frogLevelForBodySize,
    frogBuffSlotCount: frogBuffSlotCount,
    mkStation: mkStation,
    emptySlotIndex: emptySlotIndex,
    slotOfFrog: slotOfFrog,
    dropFrog: dropFrog,
    removeFrog: removeFrog,
    killFlower: killFlower,
    mkFrogBuffs: mkFrogBuffs,
    pruneAllBuffs: pruneAllBuffs,
    syncBuffTimers: syncBuffTimers,
    remainingMs: remainingMs,
    freeBuffSlotIndex: freeBuffSlotIndex,
    activeBuffCount: activeBuffCount,
    tickStation: tickStation,
    tickAll: tickAll,
    feedSeat: feedSeat,
    SNACK_GRACE_MS: SNACK_GRACE_MS,
    mkFlyState: mkFlyState,
    tickFlyState: tickFlyState,
    consumeFly: consumeFly,
    flyCount: flyCount,
    bloomFlower: bloomFlower,
    lifetimeRemainingS: lifetimeRemainingS,
    tendFlower: tendFlower,
    isFlowerDead: isFlowerDead,
    statBoost: statBoost,
    frogBuffSlotsView: frogBuffSlotsView,
    seatView: seatView,
    flowerRingGeometry: flowerRingGeometry,
    pointInOval: pointInOval,
    radialSlotOffset: radialSlotOffset,
    radialSlotTransform: radialSlotTransform,
    stationHTML: stationHTML,
    chargeProgress: chargeProgress, rowPipsHTML: rowPipsHTML,
    inspectRowsHTML: inspectRowsHTML,
    chooserHTML: chooserHTML,
    flowerDisplayName: flowerDisplayName,
    formatStatValue: formatStatValue,
    fmtMMSS: fmtMMSS,
    ftuePlantStep: ftuePlantStep,
  };

  g.Flowers = Flowers;
  if (typeof module !== 'undefined' && module.exports) module.exports = Flowers;
})(typeof window !== 'undefined' ? window : globalThis);
