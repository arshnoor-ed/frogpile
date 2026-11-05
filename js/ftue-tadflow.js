                                                                                  
(function(g){
  'use strict';
  function knob(key){return FPConfig.value('FTUE',key);}
  function active(s){return !!s && s.ftueLoop>=1 && s.ftueLoop<=5 && !s.ftueDone;}
  function mass(s){return (s.frogs||[]).reduce(function(n,f){return n+Math.pow(2,FT.mergesOf(f));},0);}
  function phase(s){
    if(s.ftueLoop===1 || s.ftueLoop===2 && s.ftueL2Step==='attempt2') return 'opening';
    if(s.ftueLoop===2) return 'bunny';
    if(s.ftueLoop<5 && (s.claimedExpeditionRewards||[]).indexOf('3:win')<0) return 'forest';
    return 'final';
  }
  function target(s){
    var p=phase(s);
    if(p==='opening')return Math.pow(2,knob('loop1_target_body_size'))+Math.pow(2,knob('loop1_companion_body_size'));
    if(p==='bunny')return Math.pow(2,FT.MAX_MERGES)*knob('loop2_finished_bunny_count')+Math.pow(2,knob('loop2_companion_body_size'))*knob('loop2_retry_min_companions');
    var prefix=p==='forest'?'loop3':'loop5', total=0;
    for(var level=0;level<=FT.MAX_MERGES;level++)total+=Math.pow(2,level)*knob(prefix+'_target_l'+level);
    return total;
  }
  function maxYield(){return FPConfig.value('MergeRules','hatch_pad_roll_p3')>0?3:FPConfig.value('MergeRules','hatch_pad_roll_p2')>0?2:1;}
  function budget(s,eggId){
    if(!active(s))return null;
    var future=0;
                                                                    
                                                                               
    if(phase(s)==='final' && s.ftueLoop===4 && !(s.claimedExpeditionRewards||[]).includes('4:win'))future=Rewards.previewExpedition(4,'win').reduce(function(n,r){return n+(r.itemId==='tadpoles' && r.guaranteed?r.minQty*r.count:0);},0);
    var goal=target(s), held=mass(s), remaining=goal-held;
    if(remaining<=0)return null;
    var available=1+(s.eggs||[]).filter(function(e){return e && e.id!==eggId;}).length+Math.floor(((s.tadpoles||0)+future)/FPConfig.value('MergeRules','hatch_tadpole_cost'));
                                                                              
                                                                            
    var yieldPerEgg=0;
    for(var n=1;n<=3;n++)yieldPerEgg+=n*FPConfig.value('MergeRules','hatch_pad_roll_p'+n);
    var eggs=Math.min(available,Math.ceil(remaining/yieldPerEgg));
    return {target:goal,equivalents:held,futureEggs:eggs-1,maxYield:maxYield(),exact:true};
  }
  function empty(s){return !(s.tadpoles||0) && !(s.eggs||[]).some(Boolean);}
  function ready(s,prefix){
    var counts=Array(FT.MAX_MERGES+1).fill(0);
    (s.frogs||[]).forEach(function(f){counts[FT.mergesOf(f)]++;});
                                                                            
                                                                           
    for(var wanted=FT.MAX_MERGES;wanted>=0;wanted--){
      for(var need=knob(prefix+'_target_l'+wanted);need>0;need--){
        var found=wanted;while(found<=FT.MAX_MERGES && !counts[found])found++;
        if(found>FT.MAX_MERGES)return false;counts[found]--;
      }
    }
    return true;
  }
  g.FtueTadflow={active:active,mass:mass,phase:phase,target:target,budget:budget,empty:empty,ready:ready};
})(typeof window!=='undefined'?window:globalThis);
