                                                                                   
                                                                              
                                                                            
                                                                          
                                                                               
                                                                               
                                                  
                                                                              
                                                                              
                                                                                
                                                                            
                                                                                        
(function(g){
  'use strict';
  function levelBones(level){
    var row=g.FPConfig.row('Sacrifice','frog_level',level);
    if(typeof row.bones !== 'number' || !Number.isFinite(row.bones) || row.bones<0){
      throw new Error('bones must be a non-negative number');
    }
    return row.bones;
  }
  function rarityBones(sheetRarity){
    var row=g.FPConfig.row('Sacrifice','rarity',sheetRarity);
    if(typeof row.rarity_bones !== 'number' || !Number.isFinite(row.rarity_bones) || row.rarity_bones<0){
      throw new Error('rarity_bones must be a non-negative number');
    }
    return row.rarity_bones;
  }
  function bonusBones(bonusType){
    var row=g.FPConfig.row('Sacrifice','bonus_type',bonusType);
    if(typeof row.bonus_bones !== 'number' || !Number.isFinite(row.bonus_bones) || row.bonus_bones<0){
      throw new Error('bonus_bones must be a non-negative number');
    }
    return row.bonus_bones;
  }
  function isEvolved(frog){
    var fam=g.FT.familyOf && g.FT.familyOf(frog);
    return !!(fam && fam.body && frog && frog.assimilated===fam.id);
  }
  function isAscended(frog){
    return !!(g.FT.ascendedOf && g.FT.ascendedOf(frog));
  }
  function bonesFor(frog){
    var level=g.FT.mergesOf(frog);
    var bones;
    try {
      bones=levelBones(level);
    } catch(err){
      console.warn('[Sacrifice] Missing/invalid bones for frog_level '+level+' in Sacrifice.csv; paying 0. '+err.message);
      return 0;
    }
    var slots=g.FT.SLOTS||['head','mouth','back','aura'];
    slots.forEach(function(slot){
      var key=frog && frog.traits && frog.traits[slot];
      if(!key) return;
      var def=g.FT.traitDef(key);
      if(!def || !def.r) return;
      var sheetRarity;
      try {
        sheetRarity=g.FrogStats.sheetRarityForCodeRarity(def.r);
      } catch(err){
        console.warn('[Sacrifice] '+err.message+'; adding 0 bones for trait "'+key+'".');
        return;
      }
      try {
        bones+=rarityBones(sheetRarity);
      } catch(err){
        console.warn('[Sacrifice] Missing/invalid rarity_bones for rarity "'+sheetRarity+'" in Sacrifice.csv; adding 0. '+err.message);
      }
    });
    var ascended=isAscended(frog);
    if(ascended || isEvolved(frog)){
      try {
        bones+=bonusBones('evolved');
      } catch(err){
        console.warn('[Sacrifice] Missing/invalid bonus_bones for bonus_type "evolved" in Sacrifice.csv; adding 0. '+err.message);
      }
    }
    if(ascended){
      try {
        bones+=bonusBones('ascended');
      } catch(err){
        console.warn('[Sacrifice] Missing/invalid bonus_bones for bonus_type "ascended" in Sacrifice.csv; adding 0. '+err.message);
      }
    }
    return bones;
  }
  g.Sacrifice={bonesFor:bonesFor};
  if(typeof module!=='undefined' && module.exports) module.exports=g.Sacrifice;
})(typeof window!=='undefined'?window:globalThis);
