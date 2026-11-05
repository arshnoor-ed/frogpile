  
                                                                          
                                                                       
                           
  
                                                                 
                                                                           
                                                                          
                                                                          
                                                                        
                                                                              
                                                                
                                                                           
                                                                         
                                                                    
                                                                            
                                                                     
                                                             
                                                                             
  
                                                                          
                                                                             
                                                                    
                                                                             
                                                                          
                                                                           
                                                                 
                                                                  
                                                                        
                                                                        
                                                                        
                                                                             
                                                                                  
                                                                          
                                                                          
                                                                    
                                                                        
                                                                     
                                                                     
                                                                           
                                              
  
                                                                          
                                                                      
                                                                         
                                                                        
                                                                         
                                                                        
                                                                      
                                                                   
                                    
   
(function (g) {
  'use strict';

                                                                             

                                                                          
                                                                             
                                                                     
                                                                             
                                                                            
                                                                         
                                                                             
                                                                       
                                                                   
  var TIER_REWARD_TAB = { hard: 'ExpeditionsHard', extreme: 'ExpeditionsExtreme' };
  function finalWaveRow(expeditionNo, tab) {
    tab = tab || 'Expeditions';
    var rows = g.FPConfig.rows(tab).filter(function (r) {
      return String(r.expedition_no) === String(expeditionNo);
    });
    if (!rows.length) {
      throw new Error('[Rewards] forExpedition: no [EXPORT] ' + tab + ' row for expedition_no ' + expeditionNo);
    }
    rows = rows.slice().sort(function (a, b) { return Number(a.wave_no) - Number(b.wave_no); });
    return rows[rows.length - 1];
  }

                                                                                   
  var WIN_REWARD_SLOTS = [
    ['w_reward_01', 'w_reward_01_count'],
    ['win_reward_2_type', 'win_reward_2_count'],
    ['win_reward_3_type', 'win_reward_3_count'],
    ['win_reward_4_type', 'win_reward_4_count']
  ];

     
                                                                            
                                                                            
                                                                   
                                                                    
                                                                        
                                                                          
                                                               
                                                                 
                                                                           
                                                                            
                                                                           
                      
     
  function forExpedition(expeditionNo, outcome, opts) {
    if (outcome !== 'win' && outcome !== 'loss') {
      throw new Error('[Rewards] forExpedition: outcome must be "win" or "loss", got ' + JSON.stringify(outcome));
    }
    var tier = opts && opts.tier;
    if (tier != null && tier !== 'normal') {
      var tab = TIER_REWARD_TAB[tier];
      if (!tab) throw new Error('[Rewards] forExpedition: unknown difficulty tier "' + tier + '"');
      var trow = finalWaveRow(expeditionNo, tab);
      if (outcome === 'loss') {
        var tLossType = trow.exp_loss_table;
        return tLossType ? [{ dropTableId: String(tLossType), count: Number(trow.exp_loss_table_count) || 1 }] : [];
      }
      var tWinType = trow.exp_win_table;
      return tWinType ? [{ dropTableId: String(tWinType), count: Number(trow.exp_win_table_count) || 1 }] : [];
    }
    var row = finalWaveRow(expeditionNo);
    if (outcome === 'loss') {
      var lossType = row.loss_reward_1_type;
      if (!lossType) return [];
      return [{ dropTableId: String(lossType), count: Number(row.loss_reward_1_count) || 1 }];
    }
    var out = [];
    for (var i = 0; i < WIN_REWARD_SLOTS.length; i++) {
      var type = row[WIN_REWARD_SLOTS[i][0]];
      if (!type) continue;
      out.push({ dropTableId: String(type), count: Number(row[WIN_REWARD_SLOTS[i][1]]) || 1 });
    }
    return out;
  }

                                                                       
                                                                      
                                                                             
                                                                            
                                                           
  function extremePrize(expeditionNo) {
    var row = finalWaveRow(expeditionNo);
    if (!('extreme_first_win_reward' in row)) {
      warnOnce('extreme-prize-column', '[Rewards] "Expeditions.extreme_first_win_reward" is missing from the current config export — no stage pays an Extreme prize until a fresh export adds it.');
      return null;
    }
    var id = String(row.extreme_first_win_reward || '').trim();
    return id ? { dropTableId: id, count: 1 } : null;
  }
                                                                                  
  function extremePrizeDue(s, expeditionNo, outcome, tier) {
    if (outcome !== 'win' || tier !== 'extreme' || !s) return null;
    if ((s.extremePrizesWon || []).indexOf(Number(expeditionNo)) >= 0) return null;
    return extremePrize(expeditionNo);
  }

     
                                                                          
                                                                           
                                                              
     
  function rollExpedition(expeditionNo, outcome, rng, opts) {
    var slots = forExpedition(expeditionNo, outcome, opts);
    if (!slots.length) return [];
    var dropRows = g.FPConfig.rows('DropTables');
    var out = [];
    for (var i = 0; i < slots.length; i++) {
      var items = g.DropTables.rollTableById(dropRows, slots[i].dropTableId, slots[i].count, rng);
      if (slots[i].tierBonus) items.forEach(function (it) { it.tierBonus = true; });                                            
      out = out.concat(items);
    }
    return out;
  }

                                                                             
                                                                           
                                                                          
                                                                            
     
                                                                           
  function seedsDisabled(s, id) {
    return s && !s.ftueDone && Number.isFinite(s.ftueLoop) && s.ftueLoop<=5 &&
      ['seeds','flower_seed','lily_seed'].indexOf(id)>=0 &&
      Number(g.FPConfig.value('FTUE','ftue_flowers_enabled'))===0;
  }
  function previewExpedition(expeditionNo, outcome, opts) {
    var tables = g.DropTables.groupRowsByTable(g.FPConfig.rows('DropTables'));
    var out = [];
    forExpedition(expeditionNo, outcome || 'win', opts).forEach(function (slot) {
      out = out.concat(previewRowsOf(tables, slot.dropTableId, slot.count).map(function (r) { if (slot.tierBonus) r.tierBonus = true; return r; }));
    });
                                                                                                    
                                                                                                 
                                                                                                    
    if ((outcome || 'win') === 'win') {
      harvestTables(expeditionNo, opts && opts.tier).forEach(function (id) {
        out = out.concat(previewRowsOf(tables, id, 1).map(function (r) { r.harvest = true; return r; }));
      });
      rockTables(expeditionNo, opts && opts.tier).forEach(function (slot) {
        out = out.concat(previewRowsOf(tables, slot.dropTableId, slot.count).map(function (r) { r.harvest = true; r.rock = true; return r; }));
      });
      rescueTables(expeditionNo, opts && opts.tier).forEach(function (id) {
        var paidId = Number(expeditionNo) === 1 && e1Cleared(previewState(opts)) ? 'exp1_web_replay' : id;
        out = out.concat(previewRowsOf(tables, paidId, 1).map(function (r) { r.rescue = true; return r; }));
      });
    }
    return out.filter(function(r){ return !seedsDisabled(previewState(opts),r.itemId); });
  }
  function previewRowsOf(tables, tableId, count) {
    var rows = tables[tableId];
    if (!rows) throw new Error('[Rewards] unknown drop_table_id "' + tableId + '"');
    return rows.map(function (row) {
      var group = Number(row.group_id);
      var total = rows.filter(function (r) { return Number(r.group_id) === group; })
        .reduce(function (sum, r) { return sum + Number(r.weight); }, 0);
      return { dropTableId: tableId, count: count,
        itemId: row.item_id, displayName: rewardLabel(row.item_id),
        img: rewardImage(row.item_id), groupId: group, guaranteed: group === 0,
        chance: group === 0 ? 1 : Number(row.weight) / total,
        minQty: Number(row.min_qty), maxQty: Number(row.max_qty) };
    });
  }
                                                                         
                                                                              
  function previewTable(tableId) {
    return previewRowsOf(g.DropTables.groupRowsByTable(g.FPConfig.rows('DropTables')), String(tableId) === 'exp1_web' && e1Cleared(previewState()) ? 'exp1_web_replay' : String(tableId), 1).filter(function(r){ return !seedsDisabled(previewState(),r.itemId); });
  }
                                                                               
                                                                                 
                                                                                      
                                                                              
                                                                               
                                                                            
                                                              
  function expTab(tier) {
    if (tier == null || tier === 'normal') return 'Expeditions';
    var tab = TIER_REWARD_TAB[tier];
    if (!tab) throw new Error('[Rewards] unknown difficulty tier "' + tier + '"');
    return tab;
  }
  function harvestTables(expeditionNo, tier) {
    if (g.FtueSteps && typeof g.FtueSteps.flowersPaused === 'function' && g.FtueSteps.flowersPaused()) return [];
    return g.FPConfig.rows(expTab(tier)).filter(function (r) {
      return String(r.expedition_no) === String(expeditionNo) && r.harvest_flower && r.harvest_reward;
    }).sort(function (a, b) { return Number(a.wave_no) - Number(b.wave_no); }).map(function (r) { return String(r.harvest_reward).trim(); });
  }
                                                                                                  
                                                                                                     
                                                                                                
                                                                               
                                                                                 
                                                           
  function rockTables(expeditionNo, tier) {
    var by = {}, out = [];
    g.FPConfig.rows(expTab(tier)).forEach(function (r) {
      if (String(r.expedition_no) !== String(expeditionNo) || r.harvest_flower || r.rescue_web || !r.rock_reward) return;
      var n = Math.max(0, Math.round(Number(r.rock_count) || 0)), id = String(r.rock_reward).trim();
      if (!n || !id) return;
      if (!by[id]) out.push(by[id] = { dropTableId: id, count: 0 });
      by[id].count += n;
    });
    return out;
  }
                                                                               
                                                                              
                                                                                 
                                                                             
                                                                             
  function rescueRows(expeditionNo, tier) {
    return g.FPConfig.rows(expTab(tier)).filter(function (r) {
      return String(r.expedition_no) === String(expeditionNo) && r.rescue_web;
    }).sort(function (a, b) { return Number(a.wave_no) - Number(b.wave_no); }).map(function (r) {
      var prizes = [];
      for (var n = 1; ; n++) {
        var col = n === 1 ? 'rescue_prize' : 'rescue_prize_' + n;
        if (!(col in r)) break;
        var table = String(r[col] || '').trim();
        if (!table) continue;
        var chance = r[col + '_chance'] === '' || r[col + '_chance'] == null ? 1 : Number(r[col + '_chance']);
        prizes.push({ table: table, winOnly: Number(r[col + '_win_only']) === 1, chance: isFinite(chance) ? Math.max(0, Math.min(1, chance)) : 1 });
      }
      return { reward: String(r.rescue_reward || '').trim() || null, prizes: prizes };
    });
  }
                                                                              
  function rescueTables(expeditionNo, tier) {
    return rescueRows(expeditionNo, tier).map(function (r) { return r.reward; }).filter(Boolean);
  }
                                                                                   
                                                                                 
  function rescuePrizeOpen(s, tableId) {
    return !!tableId && ((s && s.rescuePrizesWon) || []).indexOf(String(tableId)) < 0;
  }
                                                                                
                                                                          
                                                                            
  function rescuePrizeWaiting(s, tableId) {
    return !!tableId && ((s && s.rescuePrizesWaiting) || []).indexOf(String(tableId)) >= 0;
  }
                                                                           
                                                                              
                                                                              
                                                                               
                                              
  function rescuePrizesFor(s, expeditionNo, outcome, harvests) {
    var freed = (harvests || []).map(String), out = [];
    rescueRows(expeditionNo).forEach(function (r) {
      r.prizes.forEach(function (p) {
        if (freed.indexOf(p.table) < 0 || !rescuePrizeOpen(s, p.table)) return;
        out.push({ dropTableId: p.table, winOnly: p.winOnly, waiting: p.winOnly && outcome !== 'win' });
      });
    });
    return out;
  }

                                                                            

                                                                           
                                                                     
                                                                  
                                                                        
                                             
                                                                                   
                                                                                    
                                                                                   
                                                                                      
                                                   
  var SHEET_TO_STATE_FIELD = { tadpoles: 'tadpoles', gems: 'gems', seeds: 'seeds', wood: 'mat', stone: 'rock', bones: 'bones', flower_seed: 'seeds' };
  var CAPPED_GAIN_FN = { wood: 'gainWood', stone: 'gainStone', tadpoles: 'gainTadpoles' };
                                                                                                    
                                                                                                      
                                                                                                   
                                                                                                  
  var DIRECT_CREDIT_FIELD = { seeds: 'seeds', bones: 'bones', gems: 'gems', flower_seed: 'seeds', lily_seed: 'seeds', family_ticket: 'familyTickets' };
                                                                                          
                                                                                                    
  var SEED_ITEM_FLOWER = { lily_seed: 'lily' };
  var EQUIPMENT_ITEM_IDS = { equipment: true, equipment_common: true, equipment_rare: true, equipment_epic: true, equipment_legendary: true };
                                                                               
                                                                               
                                                             
  var BLUEPRINT_ITEM_SLOT = { weapon_blueprint: 'weapon', shield_blueprint: 'shield', weapon_chassis: 'weapon' };
  var BLUEPRINT_IMG = { weapon: 'assets/ui2/rewards/blueprint-weapon.png', shield: 'assets/ui2/rewards/blueprint-shield.png' };
                                                                   
  function blueprintSlotFor(itemId) { return BLUEPRINT_ITEM_SLOT[itemId] || (EQUIPMENT_ITEM_IDS[itemId] ? 'weapon' : null); }

                                                                              
                                                                            
                                                                       
                                                                 
  var ITEM_DISPLAY_NAME = {
    wood: 'Wood', stone: 'Stone', tadpoles: 'Tadpoles', bones: 'Bones',
    seeds: 'Seeds', gems: 'Gems', flower_seed: 'Flower Seed', lily_seed: 'Pink Lily Seeds', family_ticket: 'Family Ticket',
    weapon_blueprint: 'Weapon Blueprint', shield_blueprint: 'Shield Blueprint', weapon_chassis: 'Weapon Blueprint',
    trait_bunny_guaranteed: 'Bunny Trait', trait: 'Trait', equipment: 'Equipment',
    equipment_common: 'Common Equipment', equipment_rare: 'Rare Equipment',
    equipment_epic: 'Epic Equipment', equipment_legendary: 'Legendary Equipment'
  };
  function rewardLabel(itemId) {
    if (isTraitPiece(itemId)) return traitPiece(itemId).n;
    if (itemId === 'nothing' || itemId === 'none') return 'No drop';
    if (ITEM_DISPLAY_NAME[itemId]) return ITEM_DISPLAY_NAME[itemId];
    if (isGearPiece(itemId)) {
      var row = gearPieceRow(itemId);
      return row && g.Equipment.UI && g.Equipment.UI.displayName ? g.Equipment.UI.displayName(row) : 'Gear';
    }
    if (isRescueFrog(itemId)) {
      var fam = null, ft = g.FT || (typeof FT !== 'undefined' ? FT : null);                                  
      try { fam = ft && ft.familyDefOf(itemId.slice(RESCUE_FROG.length)); } catch (e) { fam = null; }
      return ((fam && fam.n) || 'Rescued') + ' Frog';
    }
    if (itemId.indexOf('trait_') === 0) {
      var family = itemId.slice(6);
      return family.charAt(0).toUpperCase() + family.slice(1) + ' Trait';
    }
    return itemId;
  }
  var ITEM_IMG = { lily_seed: 'assets/flowers/flower-picker/pink-open.webp' };
  function rewardImage(itemId) {
    if (isTraitPiece(itemId)) return traitPiece(itemId).path;
    if (ITEM_IMG[itemId]) return ITEM_IMG[itemId];
    if (isGearPiece(itemId)) {
      var row = gearPieceRow(itemId);
      try { return row && g.Equipment.UI && g.Equipment.UI.itemArtSrc ? g.Equipment.UI.itemArtSrc(row) : undefined; } catch (e) { return undefined; }
    }
    var slot = blueprintSlotFor(itemId);
    return slot ? BLUEPRINT_IMG[slot] : undefined;
  }

                                                                                
                                                                              
                                                                            
                                                                               
                                                                               
  function familyGearAllowed(expeditionNo, ftueActive) {
    if (!ftueActive || expeditionNo == null) return true;
    return Number(expeditionNo) >= Number(g.FPConfig.value('FTUE', 'ftue_family_gear_from_expedition'));
  }
  function ftueRunning() { return !!(g.FtueSteps && typeof g.FtueSteps.ftueUiActive === 'function' && g.FtueSteps.ftueUiActive()); }
                                                                                 
                                                                                
                                    
  function familyDropPool(FT, family, expeditionNo, ftueActive) {
    var pool = (FT.familyRewardPool || FT.familyTraitPool)(family) || [];
    if (familyGearAllowed(expeditionNo, ftueActive === undefined ? ftueRunning() : ftueActive)) return pool;
    return pool.filter(function (t) { return t.slot !== 'weapon' && t.slot !== 'shield'; });
  }
                                                                       
                                                                                      
  function familyPool(family, env) {
    var def = env.FT && env.FT.familyDefOf(family);
    if (!def) throw new Error('[Rewards] unknown trait family "' + family + '"');
    var pool = familyDropPool(env.FT, family, env.expeditionNo, !!env.ftueActive).map(function (t) {
      return { key: t.k, name: t.n, slot: t.slot, img: t.path };
    });
    if (!pool.length) throw new Error('[Rewards] no trait pieces for family "' + family + '"');
    return { name: def.n || family, familyId: family, pool: pool };
  }

                                                                             
                                                                          
  function unlockTrait(env, key) {
    var ft = env.FT || g.FT;
    if (env.state && ft && typeof ft.unlockTraits === 'function') ft.unlockTraits(env.state, [key]);
  }

  function creditFamilyTrait(id, qty, env, rng) {
    if (!env.state || !env.MergeRules || !env.EXP_SKINS) {
      throw new Error('[Rewards] family traits require state, MergeRules and EXP_SKINS');
    }
                                                                        
                                                                             
                          
    var family = id.slice(6), skin = 'reward_' + family;
    var pack = familyPool(family, env);
    env.EXP_SKINS[skin] = pack;
    var rolls = [], gear = [];
    for (var i = 0; i < qty; i++) {
      var pick = pack.pool[Math.floor(rng() * pack.pool.length)];
      if (pick.slot === 'weapon' || pick.slot === 'shield') {
                                                                                
                                                                      
        var eq = env.Equipment || g.Equipment;
        if (!eq || typeof eq.grantPieceBlueprint !== 'function') throw new Error('[Rewards] gear "' + pick.key + '" needs Equipment.grantPieceBlueprint');
        eq.grantPieceBlueprint(env.state, pick.key);
        gear.push({ key: pick.key, slot: pick.slot });
      } else {
        env.state.pendingWinQueue = env.MergeRules.enqueue(env.state.pendingWinQueue || [],
          env.MergeRules.queueWin(pick.slot, pick.key));
        unlockTrait(env, pick.key);
      }
      rolls.push({ skin: skin, phase: 'ready', idx: 0, force: pick.key,
        alreadyQueued: true, allowDuplicates: true });
    }
    var out = { itemId: id, requested: qty, granted: qty, status: 'queued-mergerules', rolls: rolls };
    if (gear.length) out.gearBlueprints = gear;
    return out;
  }
  function isTraitPiece(id) { return id.indexOf('trait_piece_') === 0; }
  function traitPiece(id, ft) {
    return (ft || g.FT).traitForSheetId(id.slice('trait_piece_'.length));
  }
  function creditTraitPiece(id, qty, env) {
    var t = traitPiece(id, env.FT), skin = 'reward_' + id;
    if (!env.state || !env.MergeRules || !env.EXP_SKINS) throw new Error('[Rewards] trait pieces require state, MergeRules and EXP_SKINS');
    var family = env.FT.families().find(function (f) { return env.FT.familyTraitPool(f.id).some(function (p) { return p.k === t.k; }); });
    var ticketSkin = family ? 'reward_' + family.id : null;
    if (ticketSkin) env.EXP_SKINS[ticketSkin] = familyPool(family.id, env);
    env.EXP_SKINS[skin] = { ticketSkin: ticketSkin, name: family ? family.n : t.n, familyId: family && family.id, exactPiece: true, pool: [{ key: t.k, name: t.n, slot: t.slot, img: t.path }] };
    var rolls = [];
    for (var i = 0; i < qty; i++) {
      env.state.pendingWinQueue = env.MergeRules.enqueue(env.state.pendingWinQueue || [], env.MergeRules.queueWin(t.slot, t.k));
      unlockTrait(env, t.k);
      rolls.push({ skin: skin, phase: 'ready', idx: 0, force: t.k, alreadyQueued: true, allowDuplicates: true });
    }
    return { itemId: id, requested: qty, granted: qty, status: 'queued-mergerules', rolls: rolls };
  }
  function isFamilyDrop(itemId) { return itemId.indexOf('trait_') === 0 && !isTraitPiece(itemId) && itemId !== 'trait_bunny_guaranteed'; }

                                                                          
                                                                              
                                                                             
                                                                          
  function isFullSet(itemId) { return itemId.indexOf('set_') === 0; }
  function creditFullSet(id, qty, env) {
    if (!env.state || !env.MergeRules || !env.EXP_SKINS) throw new Error('[Rewards] a full set requires state, MergeRules and EXP_SKINS');
    var family = id.slice(4), skin = 'reward_' + family;
    var pack = familyPool(family, env);
    env.EXP_SKINS[skin] = pack;
    var eq = env.Equipment || g.Equipment, pieces = [], gear = [];
    for (var n = 0; n < qty; n++) {
      pack.pool.forEach(function (p) {
        if (p.slot === 'weapon' || p.slot === 'shield') {
          if (!eq || typeof eq.grantPieceBlueprint !== 'function') throw new Error('[Rewards] gear "' + p.key + '" needs Equipment.grantPieceBlueprint');
          eq.grantPieceBlueprint(env.state, p.key);
          gear.push(p);
        } else {
          env.state.pendingWinQueue = env.MergeRules.enqueue(env.state.pendingWinQueue || [], env.MergeRules.queueWin(p.slot, p.key));
          unlockTrait(env, p.key);
          pieces.push(p);
        }
      });
    }
    return { itemId: id, requested: qty, granted: qty, status: 'queued-mergerules',
      fullSet: { familyId: family, name: pack.name, skin: skin, pieces: pieces, gear: gear } };
  }

                                                                             
                                                                             
                                                                            
                                                                   
  var GEAR_PIECE = 'gear_';
  function isGearPiece(itemId) { return String(itemId).indexOf(GEAR_PIECE) === 0; }
  function gearPieceRow(itemId) {
    try { return g.Equipment ? g.Equipment.itemRow(String(itemId).slice(GEAR_PIECE.length)) : null; } catch (e) { return null; }
  }
  function creditGearPiece(id, qty, env) {
    var eq = env.Equipment || g.Equipment, itemId = id.slice(GEAR_PIECE.length);
    if (!eq || typeof eq.grantPiece !== 'function' || !env.state) return pendingHook(id, qty, 'Equipment.grantPiece');
    var piece = eq.pieceFor(itemId);
    if (!piece) throw new Error('[Rewards] "' + id + '": no gear piece is drawn for Equipment row "' + itemId + '"');
    var made = [];
    for (var i = 0; i < qty; i++) made.push(eq.grantPiece(env.state, piece).instance);
    return { itemId: id, requested: qty, granted: qty, status: 'credited',
      gearPiece: { itemId: itemId, slot: made[0] ? made[0].slot : null, instanceIds: made.map(function (m) { return m.id; }) } };
  }
                                                                             
                                                                            
                                                                             
                                                                                 
  var RESCUE_FROG = 'rescue_frog_';
  function isRescueFrog(itemId) { return String(itemId).indexOf(RESCUE_FROG) === 0; }
  function creditRescueFrog(id, qty, env) {
    if (typeof env.rescueFrog !== 'function' || !env.state) return pendingHook(id, qty, 'RescueWeb.rescueFrog');
    var family = id.slice(RESCUE_FROG.length), frogs = [];
    for (var i = 0; i < qty; i++) frogs.push(env.rescueFrog(env.state, family));
    return { itemId: id, requested: qty, granted: qty, status: 'rescued', familyId: family,
      rescuedFrogs: frogs.map(function (f) { return f.id; }) };
  }

  var _warned = {};
  function warnOnce(key, msg) {
    if (_warned[key]) return;
    _warned[key] = true;
    if (typeof console !== 'undefined' && console.warn) console.warn(msg);
  }

  function pendingHook(itemId, qty, hookName) {
    warnOnce('grant-pending-' + itemId, '[Rewards] grant(): ' + hookName + '() isn\'t available yet (its lane hasn\'t landed on main) — "' + itemId + '" x' + qty + ' was not credited');
    return { itemId: itemId, requested: qty, granted: 0, status: 'pending-hook', hook: hookName };
  }

                                                                             
                                                                              
                                                                        
                                                                         
                                                           
  function ensureBunnyGuaranteedSkin(env) {
    if (!env.EXP_SKINS || env.EXP_SKINS.bunny_guaranteed || !env.FT) return;
    var famTraits = (env.FT.familyDefOf(g.FPConfig.value('FTUE','exp1_guaranteed_trait_family')) || {}).traits || {};
    var pool = ['head', 'mouth', 'back', 'aura'].map(function (slot) {
      var key = famTraits[slot];
      if (!key) return null;
      var entries = env.FT.accessiblePool(slot, []) || [];
      var hit = null;
      for (var i = 0; i < entries.length; i++) if (entries[i].k === key) { hit = entries[i]; break; }
      return hit ? { key: hit.k, name: slot==='aura' ? 'Bunny Aura' : hit.n, slot: slot, img: hit.path } : null;
    }).filter(Boolean);
    if (pool.length) env.EXP_SKINS.bunny_guaranteed = { name: 'Bunny', pool: pool };
  }

                                                                              
                                                                           
                                                                            
                                                                             
                                                                          
                                                                        
                                                                           
                   
  function bunnyRollFields(env, key) {
    ensureBunnyGuaranteedSkin(env);
    var registered = !!(env.EXP_SKINS && env.EXP_SKINS.bunny_guaranteed);
    return { rollSkin: registered ? 'bunny_guaranteed' : null, rollForce: registered ? key : null };
  }

  function creditBunnyGuaranteedTrait(qty, env) {
    var family=g.FPConfig.value('FTUE','exp1_guaranteed_trait_family');
    var slot=g.FPConfig.value('FTUE','exp1_guaranteed_trait_slot');
    var key=((env.FT||g.FT).familyDefOf(family)||{traits:{}}).traits[slot];
    if(!key) throw new Error('[Rewards] missing guaranteed trait '+family+'/'+slot);
    if (env.MergeRules && typeof env.MergeRules.queueWin === 'function' && env.state) {
      var entry = env.MergeRules.queueWin(slot, key);
      env.state.pendingWinQueue = env.MergeRules.enqueue(env.state.pendingWinQueue, entry);
      unlockTrait(env, key);
      var rollM = bunnyRollFields(env, key);
      return { itemId: 'trait_bunny_guaranteed', requested: qty, granted: 1, status: 'queued-mergerules', slot: slot, key: key, rollSkin: rollM.rollSkin, rollForce: rollM.rollForce };
    }
                                                                                  
                                                                            
                                                                                 
                                                                                 
                                                                              
                                                  
    if (env.state && env.state.pendingTrait && env.state.pendingTrait !== key) {
      warnOnce('bunny-guaranteed-pendingtrait-collision',
        '[Rewards] grant(): state.pendingTrait already holds "' + env.state.pendingTrait + '" — refusing to overwrite it with the guaranteed Bunny trait "' + key + '" (no MergeRules queue to hold both yet); this grant was blocked, not silently dropped');
      return { itemId: 'trait_bunny_guaranteed', requested: qty, granted: 0, status: 'blocked-pending-trait-collision', slot: slot, key: key, blockedBy: env.state.pendingTrait };
    }
    if (env.state) env.state.pendingTrait = key;
    unlockTrait(env, key);
    var rollL = bunnyRollFields(env, key);
    return {
      itemId: 'trait_bunny_guaranteed', requested: qty, granted: 1, status: 'queued-legacy-pending',
      slot: slot, key: key, rollSkin: rollL.rollSkin, rollForce: rollL.rollForce
    };
  }

  function creditOne(item, env, rng) {
    var id = item.itemId, qty = item.qty;
    if(seedsDisabled(env.state,id)) return {itemId:id,requested:qty,granted:0,status:'ftue-disabled'};

    if (id === 'none' || id === 'nothing') {
                                                                             
      return { itemId: id, requested: qty, granted: 0, status: 'none' };
    }
    if (CAPPED_GAIN_FN[id]) {
      var fn = env[CAPPED_GAIN_FN[id]];
      if (typeof fn !== 'function') {
        warnOnce('grant-missing-' + CAPPED_GAIN_FN[id], '[Rewards] grant(): ' + CAPPED_GAIN_FN[id] + '() not available — "' + id + '" x' + qty + ' was dropped');
        return { itemId: id, requested: qty, granted: 0, status: 'unroutable' };
      }
      return { itemId: id, requested: qty, granted: fn(qty), status: 'credited' };
    }
    if (DIRECT_CREDIT_FIELD[id]) {
      if (!env.state) throw new Error('[Rewards] grant(): no state object available to credit "' + id + '" into');
      var field = DIRECT_CREDIT_FIELD[id];
      env.state[field] = (env.state[field] || 0) + qty;
      var flower = SEED_ITEM_FLOWER[id];
      if (flower && qty > 0) {
        var found = Array.isArray(env.state.flowerSeedsFound) ? env.state.flowerSeedsFound : (env.state.flowerSeedsFound = []);
        if (found.indexOf(flower) < 0) found.push(flower);
      }
      return { itemId: id, requested: qty, granted: qty, status: 'credited' };
    }
    var blueprintSlot = blueprintSlotFor(id);
    if (blueprintSlot) {
                                                                                 
                                                                          
                                                                          
                                                         
      if (env.Equipment && typeof env.Equipment.grantBlueprint === 'function' && env.state) {
        env.Equipment.grantBlueprint(env.state, blueprintSlot, qty);
        return { itemId: id, requested: qty, granted: qty, status: BLUEPRINT_ITEM_SLOT[id] ? 'credited' : 'credited-as-blueprint' };
      }
      return pendingHook(id, qty, 'Equipment.grantBlueprint');
    }
    if (isTraitPiece(id)) return creditTraitPiece(id, qty, env);
    if (id === 'trait_bunny_guaranteed') {
      return creditBunnyGuaranteedTrait(qty, env);
    }
    if (isGearPiece(id)) return creditGearPiece(id, qty, env);
    if (isRescueFrog(id)) return creditRescueFrog(id, qty, env);
    if (id.indexOf('trait_') === 0) return creditFamilyTrait(id, qty, env, rng);
    if (isFullSet(id)) return creditFullSet(id, qty, env);
    if (id === 'trait') {
      return {
        itemId: id, requested: qty, granted: 0, status: 'trait-roll-generic',
        note: 'generic random-trait reward: no live call site needs this yet; left for the caller to route through an existing per-expedition EXP_SKINS pack roll.'
      };
    }
    if (/^\(spare_\d+\)$/.test(id)) {
      return { itemId: id, requested: qty, granted: 0, status: 'placeholder' };
    }
    warnOnce('grant-unroutable-' + id, '[Rewards] grant(): no grant target wired for reward item "' + id + '" — dropped ' + qty);
    return { itemId: id, requested: qty, granted: 0, status: 'unroutable' };
  }

  function applyCredits(items, env, rng) {
    rng = rng || Math.random;
                                                                           
                                                                           
    items.forEach(function (it) {
      if (isTraitPiece(it.itemId)) traitPiece(it.itemId, env.FT);
      if (isFamilyDrop(it.itemId) || isFullSet(it.itemId)) {
        familyPool(it.itemId.slice(isFullSet(it.itemId) ? 4 : 6), env);
        if (!env.state || !env.MergeRules || !env.EXP_SKINS) throw new Error('[Rewards] family traits require state, MergeRules and EXP_SKINS');
      }
      if (isRescueFrog(it.itemId) && env.FT && !env.FT.familyDefOf(it.itemId.slice(RESCUE_FROG.length))) {
        throw new Error('[Rewards] unknown trait family in "' + it.itemId + '"');
      }
    });
                                                                                 
                                                                           
                                                                              
                                                                            
                                                                             
                                                                           
                                                                             
                                                         
    var results = new Array(items.length), covered = { weapon: 0, shield: 0 };
    items.forEach(function (it, i) {
      if (!isFamilyDrop(it.itemId)) return;
      results[i] = creditOne(it, env, rng);
      (results[i].gearBlueprints || []).forEach(function (b) { covered[b.slot] += 1; });
    });
    items.forEach(function (it, i) {
      if (results[i]) return;
      var slot = blueprintSlotFor(it.itemId), swap = (slot && !it.tierBonus) ? Math.min(covered[slot], it.qty) : 0;
      if (!swap) { results[i] = creditOne(it, env, rng); return; }
      covered[slot] -= swap;
      results[i] = swap < it.qty ? creditOne({ itemId: it.itemId, qty: it.qty - swap }, env, rng)
        : { itemId: it.itemId, requested: it.qty, granted: 0, status: 'replaced-by-set-blueprint' };
      results[i].requested = it.qty;
      results[i].replaced = swap;
    });
                                                                                                     
    items.forEach(function (it, i) { if (it.web && results[i]) results[i].web = it.web; });
    items.forEach(function (it, i) { if (it.tierBonus && results[i]) results[i].tierBonus = true; });                                      
    if (typeof env.queueSave === 'function') { try { env.queueSave(); } catch (e) {                                                   } }
    return results;
  }

  function liveEnv() {
                                 
    return {
      state: (typeof state !== 'undefined') ? state : undefined,
      gainWood: (typeof gainWood === 'function') ? gainWood : undefined,
      gainStone: (typeof gainStone === 'function') ? gainStone : undefined,
      gainTadpoles: (typeof gainTadpoles === 'function') ? gainTadpoles : undefined,
      queueSave: (typeof queueSave === 'function') ? queueSave : undefined,
      FT: (typeof FT !== 'undefined') ? FT : undefined,
      EXP_SKINS: (typeof EXP_SKINS !== 'undefined') ? EXP_SKINS : undefined,
      MergeRules: g.MergeRules,
      Equipment: g.Equipment,
      rescueFrog: g.RescueWeb && typeof g.RescueWeb.rescueFrog === 'function' ? g.RescueWeb.rescueFrog : undefined,
      ftueActive: ftueRunning()
    };
                                
  }

     
                                                                         
                                                                            
                                                                            
                                                                        
     
  function e1Cleared(s) {
    return !!s && (s.claimedExpeditionRewards || []).indexOf('1:win') >= 0;
  }
  function previewState(opts) {
    if (opts && opts.state) return opts.state;
    return typeof state !== 'undefined' ? state : null;
  }
  function grantForExpedition(expeditionNo, outcome, source, rng, opts) {
    var items = rollExpedition(expeditionNo, outcome, rng, opts);
    var env = liveEnv();
    env.expeditionNo = expeditionNo;                                                                        
                                                                                                                            
                                                                                                    
                                                                                
                                                                               
                                                                              
                                                                              
                                                             
    var harvests = (opts && opts.harvests) || [], prizeIds = {}, webIds = {};
    rescueRows(expeditionNo, opts && opts.tier).forEach(function (r) { r.prizes.forEach(function (p) { prizeIds[p.table] = true; }); if (r.reward) webIds[r.reward] = true; });
    rockTables(expeditionNo, opts && opts.tier).forEach(function (t) { webIds[t.dropTableId] = true; });                                                           
    harvests.forEach(function (id) {
      if (prizeIds[id]) return;
      var paidId = Number(expeditionNo) === 1 && e1Cleared(env.state) && webIds[id] && rescueTables(1).indexOf(String(id)) >= 0 ? 'exp1_web_replay' : id;
      items = items.concat(g.DropTables.rollTableById(g.FPConfig.rows('DropTables'), paidId, 1, rng));
    });
                                                                              
                                                                               
    if (Number(expeditionNo) === 1 && e1Cleared(env.state)) {
      items = items.filter(function (it) { return it.itemId !== 'tadpoles'; });
    }
    var webPrizes = rescuePrizesFor(env.state, expeditionNo, outcome, harvests);
    webPrizes.forEach(function (p) {
      if (p.waiting) return;
      items = items.concat(g.DropTables.rollTableById(g.FPConfig.rows('DropTables'), p.dropTableId, 1, rng).map(function (it) { it.web = p.dropTableId; return it; }));
    });
                                                                                     
    var prize = extremePrizeDue(env.state, expeditionNo, outcome, opts && opts.tier);
    if (prize) items = items.concat(g.DropTables.rollTableById(g.FPConfig.rows('DropTables'), prize.dropTableId, prize.count, rng));
    var results = applyCredits(items, env, rng);
    if (prize) (env.state.extremePrizesWon || (env.state.extremePrizesWon = [])).push(Number(expeditionNo));
    webPrizes.forEach(function (p) {
                                                                                                               
      var waiting = env.state.rescuePrizesWaiting || [];
      if (p.waiting) {
        if (waiting.indexOf(p.dropTableId) < 0) env.state.rescuePrizesWaiting = waiting.concat([p.dropTableId]);
        results.push({ itemId: 'rescue_waiting', requested: 0, granted: 0, status: 'rescue-waiting', web: p.dropTableId });
        return;
      }
      (env.state.rescuePrizesWon || (env.state.rescuePrizesWon = [])).push(p.dropTableId);
      if (waiting.indexOf(p.dropTableId) >= 0) env.state.rescuePrizesWaiting = waiting.filter(function (id) { return id !== p.dropTableId; });
    });
    return results;
  }
                                                                                
                                                                          
  function extremePrizeFamily(expeditionNo, s) {
    if (s && (s.extremePrizesWon || []).indexOf(Number(expeditionNo)) >= 0) return null;
    var slot = extremePrize(expeditionNo);
    if (!slot) return null;
    var rows = g.DropTables.groupRowsByTable(g.FPConfig.rows('DropTables'))[slot.dropTableId] || [];
    var set = rows.map(function (r) { return String(r.item_id || ''); }).filter(isFullSet)[0];
    if (!set) return null;
    var ft = (typeof FT !== 'undefined') ? FT : g.FT, def = null;                                  
    try { def = ft && ft.familyDefOf(set.slice(4)); } catch (e) { def = null; }
    return { familyId: set.slice(4), name: (def && def.n) || set.slice(4) };
  }
                                                                             
  function fullSetsOf(results) {
    return results.filter(function (r) { return r && r.fullSet; }).map(function (r) { return r.fullSet; });
  }

                                                                              

  function buildClaimRewardObject(results) {
    var reward = {};
    results.forEach(function (r) {
      if (r.status !== 'credited') return;
      var field = SHEET_TO_STATE_FIELD[r.itemId];
      if (!field) return;
      reward[field] = (reward[field] || 0) + (r.granted || 0);
    });
    return reward;
  }

                                                                       
                                                                             
                                             
  function nonCurrencyToastLines(results) {
    return results.map(function (r) {
      if ((r.status === 'credited' || r.status === 'credited-as-blueprint') && !SHEET_TO_STATE_FIELD[r.itemId]) {
        return '+' + r.granted + ' ' + rewardLabel(r.itemId);
      }
      if (r.status === 'pending-hook') {
        return '+' + r.requested + ' ' + rewardLabel(r.itemId) + ' (coming soon)';
      }
      if (r.status === 'blocked-pending-trait-collision') {
        return '⚠️ Bunny trait reward blocked — another trait is already pending';
      }
      return null;
    }).filter(Boolean);
  }

                                                                       
                                                                        
                                                                      
                                                                           
                                                                                            
  function nonCurrencyCreditedItems(results) {
    return results.filter(function (r) {
      return (r.status === 'credited' || r.status === 'credited-as-blueprint') && !SHEET_TO_STATE_FIELD[r.itemId] && !r.web;
    }).map(function (r) {
      var item = { itemId: r.itemId, granted: r.granted, displayName: rewardLabel(r.itemId) };
      if (r.tierBonus) item.tierBonus = true;
      var img = rewardImage(r.itemId);
      if (img) item.img = img;
      return item;
    });
  }

                                                                              
                                                                              
                                                                             
                                                               
  function plainBlueprintCredits(results) {
    return results.filter(function (r) {
      return (r.status === 'credited' || r.status === 'credited-as-blueprint') && r.granted > 0 && blueprintSlotFor(r.itemId) && !r.tierBonus;
    }).map(function (r) { return { itemId: r.itemId, slot: blueprintSlotFor(r.itemId), qty: r.granted }; });
  }

                                                                           
                                                                            
                                                                        
                                                                         
                                                                              
                                                                            
                                                        
  function buildClaimRolls(results) {
    var rolls = [];
    results.forEach(function (r) {
      if (r.rolls) rolls = rolls.concat(r.rolls);
      else if (r.rollSkin) rolls.push({ skin: r.rollSkin, phase: 'ready', idx: 0,
        force: r.rollForce || null, alreadyQueued: r.status === 'queued-mergerules' });
    });
    return rolls;
  }
  function buildClaimRoll(results) { return buildClaimRolls(results)[0] || null; }

                                                                            

                                                                     
                                                                              
                                                                 
                                                                            
                                                                           
                                                                           
  var FTUE_ONE_TIME_CLAIM_KEYS = { '1:win': true, '2:loss': true, '2:win': true, '3:win': true, '5:loss': true };

  function claimOutcomeKey(expeditionNo, outcome) { return expeditionNo + ':' + outcome; }
  function isFtueOneTimeClaim(expeditionNo, outcome) { return !!FTUE_ONE_TIME_CLAIM_KEYS[claimOutcomeKey(expeditionNo, outcome)]; }

     
                                                                             
                                                                          
                                                                          
                                                                       
                                                                                 
                                                                            
                                                                   
                                                                             
                                  
    
                                                                             
                                                                            
                                                                   
    
                                                                     
                                                                          
                                                                       
                                                                            
                                                                             
                                                                             
                            
                                                                            
                                                                            
                                                                      
                                           
                                                      
                                                                          
                                                                             
                                                                       
                          
                                                                             
                                                                         
                             
     
  function claimGuard(claimState, expeditionNo, outcome, runId) {
    var outcomeKey = claimOutcomeKey(expeditionNo, outcome);
    var ledgerName = 'claimedExpeditionRunIds';
    var permanentKey = 'run:' + runId;
    var ftueMarkerKey = isFtueOneTimeClaim(expeditionNo, outcome) &&
      (claimState.claimedExpeditionRewards || []).indexOf(outcomeKey) < 0 ? outcomeKey : null;
    var out = { blocked: false, claimOutcomeKey: outcomeKey, ledgerName: ledgerName, permanentKey: permanentKey, ftueMarkerKey: ftueMarkerKey };
    if ((claimState[ledgerName] || []).indexOf(permanentKey) >= 0) {
      out.blocked = true; out.reason = 'already-claimed';
    } else if (claimState.claimingKeys && claimState.claimingKeys[outcomeKey]) {
      out.blocked = true; out.reason = 'claim-in-flight';
    }
    return out;
  }

                                                                            

  g.Rewards = {
    forExpedition: forExpedition,
    rollExpedition: rollExpedition,
    previewExpedition: previewExpedition,
    previewTable: previewTable,
    harvestTables: harvestTables,
    rockTables: rockTables,
    rescueRows: rescueRows,
    rescueTables: rescueTables,
    rescuePrizeOpen: rescuePrizeOpen,
    rescuePrizeWaiting: rescuePrizeWaiting,
    rescuePrizesFor: rescuePrizesFor,
    rewardLabel: rewardLabel,
    rewardImage: rewardImage,
    grantForExpedition: grantForExpedition,
    buildClaimRewardObject: buildClaimRewardObject,
    nonCurrencyToastLines: nonCurrencyToastLines,
    nonCurrencyCreditedItems: nonCurrencyCreditedItems,
    plainBlueprintCredits: plainBlueprintCredits,
    buildClaimRoll: buildClaimRoll,
    buildClaimRolls: buildClaimRolls,
    isFtueOneTimeClaim: isFtueOneTimeClaim,
    claimGuard: claimGuard,
    familyGearAllowed: familyGearAllowed,
    familyDropPool: familyDropPool,
    extremePrize: extremePrize,
    extremePrizeDue: extremePrizeDue,
    extremePrizeFamily: extremePrizeFamily,
    fullSetsOf: fullSetsOf,
                                                                         
    _applyCredits: applyCredits
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = g.Rewards;
  }
})(typeof window !== 'undefined' ? window : globalThis);
