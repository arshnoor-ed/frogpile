                                                                               
                                                                              

                                                                            
                                                                            
                                                                            
                                                                            
                                                                              
                                                                          
                                                                             
                                                                           
                                                                       
                                                                            
                                                                              
                    

                                                                             
                                                                           
                                                                           
                                     
                                                                                  
(function (root) {
  'use strict';

  var SLOTS = ['head', 'mouth', 'back', 'aura'];
  var NON_AURA_SLOTS = ['head', 'mouth', 'back'];
  var MAX_SIZE = 4;                                               

                                                                            

                                                                           
                                                                          
                                                                             
  var DEFAULT_PARAMS = {
                                                                  
                                                                                
    familyLeanNewRoll: 0.60,

                                                                
                                                                    
    starterFamilyLean: 0.78,
    starterFamilyId: 'bunny',                                          

                                                                            
                                                                             
                                                                    
    goalFamilyLean: 0,

                                                                            
                                                                   
    sharedSlotFamilyLean: 0.60,
                                                                         
                                                                           
                                                                              
                                                                             
                                                                        
                                                                           
                                                 
    sharedSlotCoinFlip: 0.50,

                                                                             
                                                          
                                                                          
                                                                             
                           
    lockCostBones: 20,

                                                                             
                                                                             
                                        
    rerollCostGems: 5,

                                                                             
                                                                      
                              
    rarityOrder: ['common', 'rare', 'epic', 'legendary'],

                                                                      
                                                                          
                                                                          
                                         
    rarityWeight: { common: 10, rare: 5, epic: 2, legendary: 1 }
  };

  function mergeParams(overrides) {
    var p = {};
    var k;
    for (k in DEFAULT_PARAMS) if (DEFAULT_PARAMS.hasOwnProperty(k)) p[k] = DEFAULT_PARAMS[k];
    if (overrides) for (k in overrides) if (overrides.hasOwnProperty(k)) p[k] = overrides[k];
    return p;
  }

                                                                              

  function sizeOf(traits) {
    if (!traits) return 0;
    var n = 0;
    for (var i = 0; i < SLOTS.length; i++) if (traits[SLOTS[i]]) n++;
    return n;
  }

                                                                    
  function canMerge(traitsA, traitsB) {
    var a = sizeOf(traitsA), b = sizeOf(traitsB);
    return a === b && a < MAX_SIZE;
  }

                                                                             
                                                    
  function canLock(slot) { return NON_AURA_SLOTS.indexOf(slot) >= 0; }
  function canReroll(slot) { return SLOTS.indexOf(slot) >= 0; }
  function lockCost(params) { return mergeParams(params).lockCostBones; }
  function rerollCost(params) { return mergeParams(params).rerollCostGems; }

  function rarityRank(rarity, params) {
    var ix = params.rarityOrder.indexOf(rarity);
    return ix < 0 ? 0 : ix;
  }

  function countFamilyMatches(familyId, decidedFamilies) {
    if (!familyId) return 0;
    var n = 0;
    for (var i = 0; i < decidedFamilies.length; i++) if (decidedFamilies[i] === familyId) n++;
    return n;
  }

                                                                           

                                                              
                              
                                         
                                                                             
                                                                         
                                                                          
                                                                           
                                                                            
                                                           

                                                                            
                                                                           
                                                                             
                                                                             
  function resolveSlot(mine, their, ctx) {
    if (!mine && !their) return null;
    if (!mine) return their;
    if (!their) return mine;
    if (mine.key === their.key) {
      return { key: mine.key, locked: !!(mine.locked || their.locked), source: 'identical' };
    }

    if (mine.locked && !their.locked) return { key: mine.key, locked: true, source: 'lock' };
    if (their.locked && !mine.locked) return { key: their.key, locked: true, source: 'lock' };
                                                                            
                                                                              

    var params = ctx.params;
    var mineInfo = ctx.traitInfo(mine.key), theirInfo = ctx.traitInfo(their.key);
    var mineRank = rarityRank(mineInfo.rarity, params), theirRank = rarityRank(theirInfo.rarity, params);
    if (mineRank !== theirRank) {
      var byRarity = mineRank > theirRank ? mine : their;
      return { key: byRarity.key, locked: byRarity.locked, source: 'rarity' };
    }

    var matchMine = countFamilyMatches(mineInfo.family, ctx.decidedFamilies);
    var matchTheir = countFamilyMatches(theirInfo.family, ctx.decidedFamilies);
    var roll = ctx.rng();
    var winner;
    if (matchMine > matchTheir) winner = (roll < params.sharedSlotFamilyLean) ? mine : their;
    else if (matchTheir > matchMine) winner = (roll < params.sharedSlotFamilyLean) ? their : mine;
    else winner = (roll < params.sharedSlotCoinFlip) ? mine : their;
    return {
      key: winner.key, locked: winner.locked,
      source: (matchMine === matchTheir) ? 'coinflip' : 'familyLean'
    };
  }

                                                                           

                                                                          
                                                              
                                                                           
                                 
                                                               
                                                                         
                                                                    
                                    

                                                                             
                                                                
                                                                           
                                    

                                                                           
                                                                           
                                                                         
                                       
  function leadingFamilyOf(traits, ctx) {
    var best = null, bestN = 0;
    var families = ctx.familyList || [];
    for (var i = 0; i < families.length; i++) {
      var fam = families[i], n = 0;
      for (var j = 0; j < SLOTS.length; j++) {
        var key = traits[SLOTS[j]];
        if (key && ctx.traitInfo(key).family === fam) n++;
      }
      if (n > bestN) { bestN = n; best = fam; }
    }
    return bestN ? best : null;
  }

  function weightedPick(pool, rng, rarityWeight) {
    if (!pool || !pool.length) return null;
    var total = 0, i;
    for (i = 0; i < pool.length; i++) total += rarityWeight[pool[i].rarity] || 0;
    if (total <= 0) return pool[0];
    var r = rng() * total;
    for (i = 0; i < pool.length; i++) {
      r -= rarityWeight[pool[i].rarity] || 0;
      if (r <= 0) return pool[i];
    }
    return pool[pool.length - 1];
  }

  function pickNewTrait(slot, traitsSoFar, ctx) {
    var params = ctx.params;
    var pool = (ctx.pool(slot) || []).map(function (t) { return t; });
    function inPool(key) {
      for (var i = 0; i < pool.length; i++) if (pool[i].key === key) return true;
      return false;
    }
                                                                               
                                                                               
                                                                             
                                                                             
    if (ctx.goalFamily && params.goalFamilyLean > 0) {
      var goalKey = ctx.familyPieceFor(ctx.goalFamily, slot);
      if (goalKey && inPool(goalKey) && ctx.rng() < params.goalFamilyLean) {
        return { key: goalKey, source: 'goalFamily' };
      }
    }
    if (!ctx.starterDone) {
      var starterKey = ctx.familyPieceFor(params.starterFamilyId, slot);
      if (starterKey && inPool(starterKey) && ctx.rng() < params.starterFamilyLean) {
        return { key: starterKey, source: 'starterBias' };
      }
    }
    var lead = leadingFamilyOf(traitsSoFar, ctx);
    if (lead) {
      var leadKey = ctx.familyPieceFor(lead, slot);
      if (leadKey && inPool(leadKey) && ctx.rng() < params.familyLeanNewRoll) {
        return { key: leadKey, source: 'familyLean' };
      }
    }
    var pick = weightedPick(pool, ctx.rng, params.rarityWeight);
    return pick ? { key: pick.key, source: 'pool' } : null;
  }

                                                                            

                                                                         
                                                                           
                                                                       

                                                                  
                                                                           
                                                              
  function queueWin(slot, traitKey) {
    return { slot: slot, traitKey: traitKey, kind: 'expedition' };
  }

                                                                         
                                                                         
                                                                    
  function queueGuaranteedAura(familyId) {
    return { slot: 'aura', family: familyId, kind: 'guaranteedAura' };
  }

                                                                                    
                                                                                
  function completeFamilyTraits(familyId, ctx) {
    var traits={};
    SLOTS.forEach(function(slot){
      var key=ctx.familyPieceFor(familyId, slot);
      if(!key) throw new Error('Missing guaranteed family piece: '+familyId+'/'+slot);
      traits[slot]=key;
    });
    return traits;
  }

  function enqueue(queue, entry) {
    var q = (queue || []).slice();
    q.push(entry);
    return q;
  }

                                                                          
                                                                          
  function migrateLegacyPendingTrait(pendingTraitKey, traitInfo) {
    if (!pendingTraitKey) return [];
    var info = traitInfo(pendingTraitKey);
    if (!info || !info.slot) return [];
    return [queueWin(info.slot, pendingTraitKey)];
  }

                                                                         
                                                                         
  function claimEligible(queue, eligible, ctx) {
    for (var i = 0; i < queue.length; i++) {
      var entry = queue[i];
      if (eligible.indexOf(entry.slot) < 0) continue;
      var key = entry.traitKey || ctx.familyPieceFor(entry.family, entry.slot);
      if (!key) continue;                                                        
      var rest = queue.slice(0, i).concat(queue.slice(i + 1));
      return { slot: entry.slot, key: key, kind: entry.kind, queue: rest };
    }
    return null;
  }

                                                                           

                       
                                                
                                                                         
                                                              
                                                                             
                                                                   
                                                                    
                                                                           
                                                                       

                                                                       
                                                                          
  function merge(frogA, frogB, ctx) {
    if (!canMerge(frogA.traits, frogB.traits)) return null;
    var params = mergeParams(ctx.params);
    var rng = ctx.rng || Math.random;

    var mergedTraits = {}, mergedLocked = {};
    var decidedFamilies = [];
    var resolved = [];

    for (var i = 0; i < SLOTS.length; i++) {
      var slot = SLOTS[i];
      var mine = frogA.traits[slot] ? { key: frogA.traits[slot], locked: !!(frogA.locked && frogA.locked[slot]) } : null;
      var their = frogB.traits[slot] ? { key: frogB.traits[slot], locked: !!(frogB.locked && frogB.locked[slot]) } : null;
      var result = resolveSlot(mine, their, {
        params: params, rng: rng, traitInfo: ctx.traitInfo, decidedFamilies: decidedFamilies
      });
      if (result) {
        mergedTraits[slot] = result.key;
                                                                           
                                                                             
                                                               
        mergedLocked[slot] = (slot !== 'aura') && !!result.locked;
        var info = ctx.traitInfo(result.key);
        if (info && info.family) decidedFamilies.push(info.family);
        resolved.push({ slot: slot, key: result.key, source: result.source });
      } else {
        mergedTraits[slot] = null;
        mergedLocked[slot] = false;
      }
    }

    var targetSize = sizeOf(frogA.traits) + 1;
    var rollReport = null;
    var queueAfter = ctx.queue || [];

    if (sizeOf(mergedTraits) < targetSize) {
      var open = [];
      for (i = 0; i < SLOTS.length; i++) if (!mergedTraits[SLOTS[i]]) open.push(SLOTS[i]);
      var nonAuraOpen = open.filter(function (s) { return s !== 'aura'; });
                                                                        
                                                 
      var eligible = nonAuraOpen.length ? nonAuraOpen : open;

      var claim = claimEligible(queueAfter, eligible, ctx);
      var targetSlot, pickedKey, source;
      if (claim) {
        targetSlot = claim.slot;
        pickedKey = claim.key;
        source = claim.kind;
        queueAfter = claim.queue;
      } else {
        targetSlot = eligible[Math.floor(rng() * eligible.length) % eligible.length];
        var picked = pickNewTrait(targetSlot, mergedTraits, ctx);
        pickedKey = picked && picked.key;
        source = picked && picked.source;
      }
      if (targetSlot && pickedKey) {
        mergedTraits[targetSlot] = pickedKey;
        mergedLocked[targetSlot] = false;
        rollReport = { slot: targetSlot, key: pickedKey, source: source };
      }
    }

    return {
      traits: mergedTraits,
      locked: mergedLocked,
      size: sizeOf(mergedTraits),
      queue: queueAfter,
      report: { resolved: resolved, rolled: rollReport }
    };
  }

  var MergeRules = {
    SLOTS: SLOTS, NON_AURA_SLOTS: NON_AURA_SLOTS, MAX_SIZE: MAX_SIZE,
    DEFAULT_PARAMS: DEFAULT_PARAMS, mergeParams: mergeParams,
    sizeOf: sizeOf, canMerge: canMerge,
    canLock: canLock, canReroll: canReroll, lockCost: lockCost, rerollCost: rerollCost,
    resolveSlot: resolveSlot, pickNewTrait: pickNewTrait, leadingFamilyOf: leadingFamilyOf,
    weightedPick: weightedPick,
    queueWin: queueWin, queueGuaranteedAura: queueGuaranteedAura, enqueue: enqueue,
    migrateLegacyPendingTrait: migrateLegacyPendingTrait, claimEligible: claimEligible,
    completeFamilyTraits: completeFamilyTraits,
    merge: merge
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = MergeRules;
  } else {
    root.MergeRules = MergeRules;
  }
})(typeof window !== 'undefined' ? window : globalThis);
