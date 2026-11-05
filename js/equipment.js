  
                                                                                                
  
                                                                      
                                                                            
                                                                        
                                                                              
                                                                            
                                                                  
                                                                   
                                                                        
                                                     
  
                                                                         
                                                                            
                                                                       
                                                                           
                                                                         
                                                         
  
                                                                             
  
                                                                   
                                                                    
                         
   
(function (g) {
  'use strict';

  var SLOTS = ['weapon', 'shield'];
  var SLOT_META = {
    weapon: { name: 'Weapon', icon: '⚔️' },
    shield: { name: 'Shield', icon: '\u{1F6E1}️' }
  };
                                                                            
                                                                             
                                                          
  var BLUEPRINTS = {
    weapon: { itemId: 'weapon_blueprint', get name(){return displayName(blueprintRow('weapon'));}, icon: 'assets/ui2/rewards/blueprint-weapon.png' },
    shield: { itemId: 'shield_blueprint', get name(){return displayName(blueprintRow('shield'));}, icon: 'assets/ui2/rewards/blueprint-shield.png' }
  };
  var LEGACY_BLUEPRINT_IDS = { weapon_chassis: 'weapon' };

                                                                         
  var WALLET_FIELDS = { wood: 'mat', stone: 'rock' };
                                                                          
  function buffValue(row, column) { return Number(row[column]) || 0; }

  function FPC() {
    var fpc = g.FPConfig;
    if (!fpc) throw new Error('[Equipment] FPConfig is missing — load js/fp-config.js before js/equipment.js');
    return fpc;
  }

  function slotFor(itemType) { return itemType === 'shield' ? 'shield' : 'weapon'; }

                                                                                       
  function init(state) {
    if (!state.equipment || typeof state.equipment !== 'object') {
      state.equipment = { blueprints: { weapon: 0, shield: 0 }, pieceBlueprints: {}, seq: 0, items: [], recipes: [] };
    }
    var eq = state.equipment;
                                                                           
                                                                          
                               
    if (Array.isArray(eq.blueprints)) {
      var known = Array.isArray(eq.recipes) ? eq.recipes : [];
      eq.recipes = known.concat(eq.blueprints.filter(function (id) { return known.indexOf(id) < 0; }));
      eq.blueprints = null;
    }
    if (!eq.blueprints || typeof eq.blueprints !== 'object') eq.blueprints = { weapon: 0, shield: 0 };
    SLOTS.forEach(function (slot) {
      var n = eq.blueprints[slot];
      if (typeof n !== 'number' || !(n >= 0)) eq.blueprints[slot] = 0;
    });
    if ('chassisCount' in eq) {
      if (typeof eq.chassisCount === 'number' && eq.chassisCount > 0) eq.blueprints.weapon += Math.floor(eq.chassisCount);
      delete eq.chassisCount;
    }
    if (!eq.pieceBlueprints || typeof eq.pieceBlueprints !== 'object' || Array.isArray(eq.pieceBlueprints)) eq.pieceBlueprints = {};
    Object.keys(eq.pieceBlueprints).forEach(function (id) {
      var n = eq.pieceBlueprints[id];
      if (typeof n !== 'number' || !(n >= 1)) delete eq.pieceBlueprints[id];
    });
    if (typeof eq.seq !== 'number') eq.seq = 0;
    if (!Array.isArray(eq.items)) eq.items = [];
    if (!Array.isArray(eq.recipes)) eq.recipes = [];
    return eq;
  }

  function blueprintMeta(slot) {
    var meta = BLUEPRINTS[slot];
    if (!meta) throw new Error('[Equipment] no blueprint for slot "' + slot + '"');
    return meta;
  }
                                                                                     
  function blueprintSlotOf(itemId) {
    if (LEGACY_BLUEPRINT_IDS[itemId]) return LEGACY_BLUEPRINT_IDS[itemId];
    return SLOTS.filter(function (slot) { return BLUEPRINTS[slot].itemId === itemId; })[0] || null;
  }
  function blueprintRow(slot) {
    var meta = blueprintMeta(slot);
    var legacy = Object.keys(LEGACY_BLUEPRINT_IDS).filter(function (id) { return LEGACY_BLUEPRINT_IDS[id] === slot; });
    var ids = [meta.itemId].concat(legacy);
    for (var i = 0; i < ids.length; i++) {
      var row = FPC().rows('Equipment').find(function (r) { return r.item_id === ids[i]; });
      if (row && isItemRow(row)) return row;
    }
    throw new Error('[Equipment] Equipment has no "' + meta.itemId + '" row');
  }
                                               
  function blueprintLabel(slot, n) {
    var name = displayName(blueprintRow(slot));
    return n == null ? name : n + ' ' + name + (n === 1 ? '' : 's');
  }
  function blueprintIconHTML(slot, cls) {
    var meta = blueprintMeta(slot);
    return '<img class="eq-bp-icon' + (cls ? ' ' + cls : '') + '" src="' + meta.icon + '" alt="' + displayName(blueprintRow(slot)) + '" draggable="false">';
  }

                                                                         
                                                                           
                                                                      
  function isItemRow(row) {
    return !!String(row.item_id || '').trim()
      && ['common', 'rare', 'epic', 'legendary'].indexOf(row.rarity) !== -1
      && ['sword', 'shield', 'blueprint', 'chassis'].indexOf(row.item_type) !== -1;
  }

                                                                                
  function catalog(itemType) {
    return FPC().rows('Equipment').filter(function (r) { return isItemRow(r) && r.item_type === itemType; });
  }

                                                                           
                                                                           
                                                                               
                                                                           
                                                                             
                                                                                                         
                                                                        
                                                                            
                                                                        
                                         
  var STARTER_GEAR = [
    { item_id: 'common_sword_twig_sword',         piece: 'weapon_01' },                 
    { item_id: 'common_sword_toothpick_rapier',   piece: 'weapon_02' },                  
    { item_id: 'common_sword_reed_switch',        piece: 'weapon_03' },                  
    { item_id: 'common_sword_fly_swatter',        piece: 'weapon_04' },                 
    { item_id: 'common_shield_wicker_round',      piece: 'shield_01' },                
    { item_id: 'common_shield_mussel_half',       piece: 'shield_02' },                 
    { item_id: 'common_shield_bark_slab',         piece: 'shield_03' },                  
    { item_id: 'common_shield_plate_shield',      piece: 'shield_04' },               
    { item_id: 'common_shield_pebble_guard',      piece: 'shield_08' }                    
  ];
  function starterPiece(itemId) {
    for (var i = 0; i < STARTER_GEAR.length; i++) if (STARTER_GEAR[i].item_id === itemId) return STARTER_GEAR[i].piece;
    return null;
  }

                                                                             
                                                                             
                                                                          
                                                                         
                                                                          
                                                                            
                                                                             
                                                            
                                                                           
                                                                             
                                                                            
                                                                            
                                   
  var SET_GEAR = [
    { item_id: 'fern_sword',      piece: 'set:forestSpirit:weapon' },                    
    { item_id: 'fern_shield',     piece: 'set:forestSpirit:shield' },                 
    { item_id: 'ice_sword',       piece: 'set:ice:weapon' },                              
    { item_id: 'ice_shield',      piece: 'set:ice:shield' },                            
    { item_id: 'storm_sword',     piece: 'set:lightning:weapon' },                     
    { item_id: 'storm_shield',    piece: 'set:lightning:shield' },                         
    { item_id: 'raven_sword',     piece: 'set:demon:weapon' },                            
    { item_id: 'raven_shield',    piece: 'set:demon:shield' },                        
    { item_id: 'mushroom_sword',  piece: 'set:mushroom:weapon' },                        
    { item_id: 'mushroom_shield', piece: 'set:mushroom:shield' },                      
    { item_id: 'pirate_sword',    piece: 'set:pirate:weapon' },                           
    { item_id: 'pirate_shield',   piece: 'set:pirate:shield' },                           
    { item_id: 'timber_sword',    piece: 'set:autumnGrove:weapon_01' },                  
    { item_id: 'acorn_sword',     piece: 'set:autumnGrove:weapon_02' },                
    { item_id: 'acorn_shield',    piece: 'set:autumnGrove:shield_01' },                  
    { item_id: 'timber_shield',   piece: 'set:autumnGrove:shield_02' },                  
    { item_id: 'pinecone_sword',  piece: 'set:mirewood:weapon_01' },                      
    { item_id: 'moon_sword',      piece: 'set:mirewood:weapon_02' },                    
    { item_id: 'pinecone_shield', piece: 'set:mirewood:shield_01' },                     
    { item_id: 'kitchen_shield',  piece: 'set:mirewood:shield_02' },                    
    { item_id: 'mine_shield',     piece: 'set:mirewood:shield_03' }                       
  ];
  function setPiece(itemId) {
    for (var i = 0; i < SET_GEAR.length; i++) if (SET_GEAR[i].item_id === itemId) return SET_GEAR[i].piece;
    return null;
  }
                                                                                            
  function pieceFor(itemId) { return starterPiece(itemId) || setPiece(itemId); }
  function itemForPiece(pieceKey) {
    var all = STARTER_GEAR.concat(SET_GEAR);
    for (var i = 0; i < all.length; i++) if (all[i].piece === pieceKey) return all[i].item_id;
    return null;
  }
  function hasRecipe(state, itemId) { return init(state).recipes.indexOf(itemId) >= 0; }
                                                                                          
  function learnRecipe(state, itemId) {
    itemRow(itemId);
    if (hasRecipe(state, itemId)) return false;
    init(state).recipes.push(itemId);
    return true;
  }
  function pieceBlueprintCount(state, itemId) { var n = init(state).pieceBlueprints[itemId]; return n >= 1 ? n : 0; }
                                                                     
  function usesPieceBlueprint(state, itemId) { return !!setPiece(itemId) && pieceBlueprintCount(state, itemId) > 0; }
  function canCraft(state, itemId) { return !!starterPiece(itemId) || hasRecipe(state, itemId) || usesPieceBlueprint(state, itemId); }
                                                                                
                                                                      
  function craftable(itemType, state) {
    var rows = catalog(itemType);
    var pick = function (list) {
      return list.map(function (s) { return rows.find(function (r) { return r.item_id === s.item_id; }); }).filter(Boolean);
    };
    var won = pick(SET_GEAR.filter(function (s) { return pieceBlueprintCount(state, s.item_id) > 0; }));
    return won.concat(pick(STARTER_GEAR), rows.filter(function (r) {
      return !starterPiece(r.item_id) && !usesPieceBlueprint(state, r.item_id) && hasRecipe(state, r.item_id);
    }));
  }

  function itemRow(itemId) {
    var row = FPC().row('Equipment', 'item_id', itemId);
    if (!isItemRow(row)) throw new Error('[Equipment] "' + itemId + '" is not a catalogue item');
    return row;
  }

  function displayName(row) {
    if (!row || typeof row.display_name !== 'string' || !row.display_name.trim())
      throw new Error('[Equipment] "' + (row && row.item_id) + '" has no usable display_name in the sheet');
    return row.display_name.trim();
  }

  function usesFor(row) {
    var column = 'Durability';
    var n = Number(row[column]);
    if (!Number.isInteger(n) || n < 1) throw new Error('[Equipment] "' + row.item_id + '" has no usable "' + column + '" value in the sheet');
    return n;
  }

  function costOf(row) {
    var cost = {};
    function add(id, value, column) {
      var amt = Number(value);
      if (!Number.isInteger(amt) || amt < 0) throw new Error('[Equipment] invalid cost in ' + row.item_id + '.' + column);
      if (!g.Currencies.has(id)) throw new Error('[Equipment] unknown currency id "' + id + '" in ' + column);
      var key = WALLET_FIELDS[id] || id;
      if (amt > 0) cost[key] = (cost[key] || 0) + amt;
    }
    if (!Object.prototype.hasOwnProperty.call(row, 'cost_1_type')) {
      throw new Error('[Equipment] "' + row.item_id + '" is missing cost_1_type');
    }
    Object.keys(row).filter(function (col) { return /^cost_\d+_(type|count)$/.test(col); })
      .map(function (col) { return col.replace(/_(type|count)$/, '_type'); })
      .filter(function (col, i, cols) { return cols.indexOf(col) === i; })
      .forEach(function (col) {
        var countCol = col.replace(/_type$/, '_count');
        var id = String(row[col] || '').trim(), count = row[countCol];
        if (!id && (count == null || String(count).trim() === '')) return;
        if (!id || count == null || String(count).trim() === '') throw new Error('[Equipment] incomplete cost pair in ' + row.item_id + '.' + col);
        add(id, count, col);
      });
    return cost;
  }

                                                                              
                                                                            
  function walletAmount(state,key) { return Math.round((state[key]||0)*1e9)/1e9; }
  function shortfall(state, cost) {
    var short={};
    Object.keys(cost).forEach(function(key){
      var missing=Math.round(Math.max(0,cost[key]-walletAmount(state,key))*1e9)/1e9;
      if(missing>0) short[key]=missing;
    });
    return short;
  }
  function canAfford(state, cost) { return Object.keys(shortfall(state,cost)).length===0; }

  function spend(state, cost) {
    Object.keys(cost).forEach(function (key) { state[key] = Math.max(0,(state[key] || 0) - cost[key]); });
  }

  function blueprintCount(state, slot) { blueprintMeta(slot); return init(state).blueprints[slot]; }

                                                                            
                                                                  
  function grantBlueprint(state, slot, qty) {
    blueprintMeta(slot);
    var eq = init(state);
    eq.blueprints[slot] += (qty == null ? 1 : qty);
    return eq.blueprints[slot];
  }
                                                                                
                                                                                 
  function takeBlueprint(state, slot, qty) {
    blueprintMeta(slot);
    var eq = init(state), n = Math.min(eq.blueprints[slot], qty == null ? 1 : qty);
    eq.blueprints[slot] -= n;
    return n;
  }

                                                                              
                                                                 
  function grantPieceBlueprint(state, pieceKey, qty) {
    var itemId = itemForPiece(pieceKey);
    if (!itemId || !setPiece(itemId)) throw new Error('[Equipment] no set gear row backs piece "' + pieceKey + '"');
    var row = itemRow(itemId), eq = init(state);
    eq.pieceBlueprints[itemId] = pieceBlueprintCount(state, itemId) + (qty == null ? 1 : qty);
    return { itemId: itemId, slot: slotFor(row.item_type), count: eq.pieceBlueprints[itemId] };
  }
                                                                                        
  function slotBlueprintTotal(state, slot) {
    var n = blueprintCount(state, slot);
    SET_GEAR.forEach(function (s) {
      var count = pieceBlueprintCount(state, s.item_id);
      if (!count) return;
      try { if (slotFor(itemRow(s.item_id).item_type) === slot) n += count; } catch (e) {                                         }
    });
    return n;
  }
                                                                               
                                                                           
  function blueprintFor(state, itemId) {
    if (usesPieceBlueprint(state, itemId)) return { piece: true, itemId: itemId, count: pieceBlueprintCount(state, itemId) };
    var slot = slotFor(itemRow(itemId).item_type);
    return { piece: false, slot: slot, count: blueprintCount(state, slot) };
  }

  function blueprintCost(slot) { return costOf(blueprintRow(slot)); }
                                                                           
                                                                    
                                                                             
                                                                   
  function blueprintPriced(slot) {
    var row;
    try { row = blueprintRow(slot); } catch (e) { return false; }
    return Object.keys(costOf(row)).length > 0;
  }
  function canAffordBlueprint(state, slot) { return blueprintPriced(slot) && canAfford(state, blueprintCost(slot)); }

  function buyBlueprint(state, slot) {
    if (!blueprintPriced(slot)) return false;
    var cost = blueprintCost(slot);
    if (!canAfford(state, cost)) return false;
    spend(state, cost);
    grantBlueprint(state, slot, 1);
    return true;
  }

  function firstWeaponItemId() { return itemRow(FPC().value('FTUE','first_weapon_item_id')).item_id; }
                                                                           
                                                                            
                                                                               
                                                                              
                              
  function lessonWeaponItemId(state) {
    var saved = state && state.ftueEquipmentCraft && state.ftueEquipmentCraft.itemId;
    return saved || defaultLessonWeaponItemId(state);
  }
                                              
  function defaultLessonWeaponItemId(state) {
    var won = SET_GEAR.filter(function (s) { return /:weapon(_\d+)?$/.test(s.piece) && pieceBlueprintCount(state || {}, s.item_id) > 0; })[0];
    return won ? won.item_id : firstWeaponItemId();
  }
  function ftueFirstCraftActive(state) {
    return !!(state && state.ftueLoop===4 && ['equipment_preview','auto_harvest','harvest_resources','craft'].includes(state.ftueL4Step) && !state.ftueL4CraftPaid);
  }
                                                                                
                                                                            
                                                                               
                                                                      
  function firstShieldItemId() { return itemRow(FPC().value('FTUE','first_shield_item_id')).item_id; }
  function lessonShieldItemId(state) {
    var saved = state && state.ftueL4ShieldItem;
    if (saved) return saved;
    var won = SET_GEAR.filter(function (s) { return /:shield(_\d+)?$/.test(s.piece) && pieceBlueprintCount(state || {}, s.item_id) > 0; })[0];
    return won ? won.item_id : firstShieldItemId();
  }
                                                                                                           
  function ftueShieldCraftActive(state) {
    return !!(state && state.ftueLoop===4 && !state.ftueL4ShieldPaid && (state.ftueL4Step==='shield' ||
      (['auto_harvest','harvest_resources'].includes(state.ftueL4Step) && state.ftueL4HarvestFor==='shield')));
  }
                                                                              
                                                                               
                                                                                   
                                                                             
  function firstCraftMaterialCost(wallet, extra, multiple, cap) {
    var cost = Math.floor((wallet + extra) / multiple) * multiple;
    return cap == null ? cost : Math.min(cost, cap);
  }
  function lessonQuote(state, field, sheetItemId) {
    var sheet=costOf(itemRow(sheetItemId)), quote=state[field];
    var next={mat:sheet.mat||0,rock:sheet.rock||0};
    if(quote && quote.mat===next.mat && quote.rock===next.rock) return quote;
    state[field]=next;
    if(typeof g.queueSave==='function') g.queueSave();
    return next;
  }
  function ensureFirstCraftCost(state) {
    if (!ftueFirstCraftActive(state)) return null;
    return lessonQuote(state, 'ftueL4FirstCraftCost', firstWeaponItemId(), FPC().value('FTUE','first_weapon_material_extra'));
  }
  function ensureFirstShieldCost(state) {
    if (!ftueShieldCraftActive(state)) return null;
    return lessonQuote(state, 'ftueL4ShieldCost', firstShieldItemId(), FPC().value('FTUE','first_shield_material_extra'));
  }
  function conversionCost(itemId, state) {
    var weapon=ftueFirstCraftActive(state) && itemId===lessonWeaponItemId(state);
    var shield=!weapon && ftueShieldCraftActive(state) && itemId===lessonShieldItemId(state);
                                                                                                                       
    var cost=costOf(itemRow(weapon ? firstWeaponItemId() : shield ? firstShieldItemId() : itemId));
    var quote=weapon ? ensureFirstCraftCost(state) : shield ? ensureFirstShieldCost(state) : null;
    if(quote) ['mat','rock'].forEach(function(k){cost[k]=quote[k];});
                                                                               
                                                                                 
                                                                  
    if(shield && cost.bones){
      cost.bones=Math.min(cost.bones, Math.floor(walletAmount(state,'bones')));
      if(!cost.bones) delete cost.bones;
    }
    return cost;
  }
  function canAffordConversion(state, itemId) { return canAfford(state, conversionCost(itemId,state)); }

                                                                              
                                                                             
                                                                       
                                                                          
                                                            
                                                         
  function convert(state, itemId) {
    var row = itemRow(itemId);
    if (row.item_type !== 'sword' && row.item_type !== 'shield') {
      throw new Error('[Equipment] "' + itemId + '" is not a convertible item (item_type=' + row.item_type + ')');
    }
    if (!canCraft(state, itemId)) return { ok: false, reason: 'no-recipe' };
    var eq = init(state), slot = slotFor(row.item_type), piece = usesPieceBlueprint(state, itemId);
    if (!piece && eq.blueprints[slot] < 1) return { ok: false, reason: 'no-blueprint', slot: slot };
    var firstCraft=ftueFirstCraftActive(state) && itemId===lessonWeaponItemId(state);
    var firstShield=!firstCraft && ftueShieldCraftActive(state) && itemId===lessonShieldItemId(state);
    var cost = conversionCost(itemId,state);
    if (!canAfford(state, cost)) return { ok: false, reason: 'cant-afford', cost: cost };
    var uses = usesFor(row);
    if (piece) { if (!(eq.pieceBlueprints[itemId] -= 1)) delete eq.pieceBlueprints[itemId]; }
    else eq.blueprints[slot] -= 1;
    spend(state, cost);
    if(firstCraft) {
      state.ftueL4CraftPaid=true;
      delete state.ftueL4FirstCraftCost;
    }
    if(firstShield) {
      state.ftueL4ShieldPaid=true;
      delete state.ftueL4ShieldCost;
    }
    return { ok: true, instance: addInstance(eq, row, uses), row: row };
  }
  function addInstance(eq, row, uses) {
    eq.seq += 1;
    var instance = {
      id: 'eq' + eq.seq,
      item_id: row.item_id,
      item_type: row.item_type,
      slot: slotFor(row.item_type),
      rarity: row.rarity,
      usesLeft: uses,
      usesMax: uses,
      equippedBy: null
    };
    eq.items.push(instance);
    return instance;
  }

                                                                              
                                                                      
                                                                  
  function grantPiece(state, pieceKey) {
    var itemId = itemForPiece(pieceKey);
    if (!itemId) throw new Error('[Equipment] no Equipment row backs gear piece "' + pieceKey + '"');
    var row = itemRow(itemId);
    return { ok: true, instance: addInstance(init(state), row, usesFor(row)), row: row };
  }

  function findInstance(state, instanceId) {
    return init(state).items.find(function (it) { return it.id === instanceId; }) || null;
  }

  function equippedOn(state, frogId, slot) {
    return init(state).items.find(function (it) { return it.equippedBy === frogId && it.slot === slot; }) || null;
  }

  function unequip(state, frogId, slot) {
    var worn = equippedOn(state, frogId, slot);
    if (!worn) return false;
    worn.equippedBy = null;
    return true;
  }

                                                                        
                                                                         
                                                     
  function equip(state, frogId, instanceId) {
    var inst = findInstance(state, instanceId);
    if (!inst) return false;
    if (inst.equippedBy === frogId) { inst.equippedBy = null; return true; }
    if (inst.equippedBy) return false;                                  
    unequip(state, frogId, inst.slot);                                
    inst.equippedBy = frogId;
    return true;
  }

                                                                               
  function inventoryFor(state, slot) {
    return init(state).items.filter(function (it) { return it.slot === slot && !it.equippedBy; });
  }

                                                                           
                                                                        
                                                                              

                                                                           
                                                                      
                                                                            
                                                                      
                                                                         
                                                                          
                                                              
  function consumeUse(state, frogId) {
    var eq = init(state);
    var broken = [];
    SLOTS.forEach(function (slot) {
      var inst = equippedOn(state, frogId, slot);
      if (!inst) return;
      inst.usesLeft -= 1;
      if (inst.usesLeft <= 0) {
        eq.items = eq.items.filter(function (it) { return it.id !== inst.id; });
        broken.push({ slot: slot, item_id: inst.item_id });
      }
    });
    return broken;
  }

                                                                               
                                            
  function gearSnapshotFor(state, frogId) {
    var snap = {};
    SLOTS.forEach(function (slot) {
      var inst = equippedOn(state, frogId, slot);
      snap[slot] = inst ? inst.id : null;
    });
    return snap;
  }

                                                                          
                                                                            
                                                                             
                                                                            
                                                                             
                                                                          
                                                                
                                                                        
  function consumeSnapshot(state, snapshot) {
    var eq = init(state);
    var broken = [];
    if (!snapshot) return broken;
    SLOTS.forEach(function (slot) {
      var id = snapshot[slot];
      if (!id) return;
      var inst = findInstance(state, id);
      if (!inst) return;
      inst.usesLeft -= 1;
      if (inst.usesLeft <= 0) {
        eq.items = eq.items.filter(function (it) { return it.id !== inst.id; });
        broken.push({ slot: slot, item_id: inst.item_id });
      }
    });
    return broken;
  }

                                                          
  function statBonusFor(state, frogId) {
    var bonus = { atk: 0, def: 0, hp: 0 };
    SLOTS.forEach(function (slot) {
      var inst = equippedOn(state, frogId, slot);
      if (!inst) return;
      var row;
      try { row = itemRow(inst.item_id); } catch (e) { return; }
      bonus.atk += buffValue(row, 'buff_attack');
      bonus.def += buffValue(row, 'buff_defense');
      bonus.hp += buffValue(row, 'buff_hp');
    });
    return bonus;
  }

                                                                           
  function attackSpeedBonusFor(state, frogId) {
    return SLOTS.reduce(function (sum, slot) {
      var inst = equippedOn(state, frogId, slot);
      return sum + (inst ? buffValue(itemRow(inst.item_id), 'buff_attack_speed') / 60 : 0);
    }, 0);
  }

                                                                               
                                                                      
                                                                               
                        
  function ftueCraftStep(state, itemId) {
    return convert(state, itemId);
  }

                                                                                  
                                                                         
  function ringHtml(usesLeft, usesMax) {
    usesMax = usesMax || 1;
    var segs = [];
    for (var i = 0; i < usesMax; i++) {
      segs.push('<span class="eq-ring-seg' + (i < usesLeft ? ' filled' : '') + '"></span>');
    }
    return '<span class="eq-ring" style="--eq-ring-n:' + usesMax + '">' + segs.join('') + '</span>';
  }

  var Equipment = {
    SLOTS: SLOTS, SLOT_META: SLOT_META,
    BLUEPRINTS: BLUEPRINTS, LEGACY_BLUEPRINT_IDS: LEGACY_BLUEPRINT_IDS,
    buffValue: buffValue, buffFraction: buffValue,
    init: init, slotFor: slotFor,
    blueprintSlotOf: blueprintSlotOf, blueprintRow: blueprintRow, blueprintLabel: blueprintLabel, blueprintIconHTML: blueprintIconHTML,
    catalog: catalog, itemRow: itemRow, usesFor: usesFor,
    displayName: displayName, STARTER_GEAR: STARTER_GEAR, starterPiece: starterPiece, craftable: craftable, canCraft: canCraft,
    SET_GEAR: SET_GEAR, setPiece: setPiece, pieceFor: pieceFor, itemForPiece: itemForPiece, grantPiece: grantPiece,
    hasRecipe: hasRecipe, learnRecipe: learnRecipe,
    costOf: costOf, walletAmount:walletAmount, shortfall:shortfall, canAfford: canAfford,
    blueprintCount: blueprintCount, grantBlueprint: grantBlueprint, takeBlueprint: takeBlueprint,
    pieceBlueprintCount: pieceBlueprintCount, grantPieceBlueprint: grantPieceBlueprint,
    slotBlueprintTotal: slotBlueprintTotal, blueprintFor: blueprintFor, lessonWeaponItemId: lessonWeaponItemId, defaultLessonWeaponItemId: defaultLessonWeaponItemId,
    blueprintCost: blueprintCost, blueprintPriced: blueprintPriced, canAffordBlueprint: canAffordBlueprint, buyBlueprint: buyBlueprint,
    firstCraftMaterialCost:firstCraftMaterialCost, ensureFirstCraftCost:ensureFirstCraftCost,
    conversionCost: conversionCost, canAffordConversion: canAffordConversion, convert: convert,
    firstWeaponItemId:firstWeaponItemId, ftueFirstCraftActive:ftueFirstCraftActive,
    firstShieldItemId:firstShieldItemId, lessonShieldItemId:lessonShieldItemId,
    ftueShieldCraftActive:ftueShieldCraftActive, ensureFirstShieldCost:ensureFirstShieldCost,
    findInstance: findInstance, equippedOn: equippedOn, equip: equip, unequip: unequip,
    inventoryFor: inventoryFor, consumeUse: consumeUse,
    gearSnapshotFor: gearSnapshotFor, consumeSnapshot: consumeSnapshot, statBonusFor: statBonusFor, attackSpeedBonusFor: attackSpeedBonusFor,
    ftueCraftStep: ftueCraftStep, ringHtml: ringHtml
  };

  g.Equipment = Equipment;
  if (typeof module !== 'undefined' && module.exports) module.exports = Equipment;
})(typeof window !== 'undefined' ? window : globalThis);
