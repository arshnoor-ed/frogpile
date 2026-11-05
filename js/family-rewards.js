                                                                                    
(function(g){
  'use strict';
  var aliases={bunny:'bunny',forestSpirit:'forest_spirit',ice:'frostbound',lightning:'stormcalled',demon:'hollowborn',mushroom:'sporekin',pirate:'pond_corsair',autumnGrove:'autumn_grove',mirewood:'mirewood',catBurglar:'cat_burglar'};
  var wallets={flies:'flies',wood:'mat',stone:'rock',gems:'gems',bones:'bones',seeds:'seeds',tadpoles:'tadpoles'};
  function fail(id,key){throw new Error('[FamilyRewards] '+id+': invalid or missing '+key);}
  function number(row,key,id){var n=row[key];if(n==='' || n==null || !Number.isSafeInteger(Number(n)) || Number(n)<0) fail(id,key);return Number(n);}
  function flag(row,key,id){var n=number(row,key,id);if(n>1) fail(id,key);return !!n;}
  function resolve(rows,id,ftue){
    var matches=rows.filter(function(r){return r.code_family_id===id;});
    if(matches.length!==1 || !aliases[id] || matches[0].family!==aliases[id]) fail(id,'unique family/code_family_id');
    var r=matches[0];
    if(r.currency_cap_policy!=='uncapped') fail(id,'currency_cap_policy');
    if(r.pool_policy!=='existing_global_after_exp1') fail(id,'pool_policy');
    if(r.body_id!=='family_'+id) fail(id,'body_id');
    if(!['inherit','replace'].includes(r.ftue_first_claim_mode)) fail(id,'ftue_first_claim_mode');
    var result={currencyFirst:flag(r,'currency_first_claim_only',id),packFirst:flag(r,'pack_first_claim_only',id),bodyOnComplete:flag(r,'body_art_on_complete',id),recordBody:flag(r,'record_body_claim',id),repeatBody:flag(r,'repeat_body_claim',id),mode:ftue?r.ftue_first_claim_mode:'inherit',currencies:{}};
                                                                                    
    function bundle(prefix){
      var b={currencies:{}};
      function add(k,n){if(n) b.currencies[wallets[k]]=(b.currencies[wallets[k]]||0)+n;}
                                                                              
                                                                                
      if(Object.prototype.hasOwnProperty.call(r,prefix+'reward_1_type')){
        for(var i=1;i<=3;i++){
          var key=prefix+'reward_'+i, type=r[key+'_type'], count=r[key+'_count'];
          if((type===''||type==null) && (count===''||count==null)) continue;
          if(!Object.prototype.hasOwnProperty.call(wallets,type)) fail(id,key+'_type');
          add(type,number(r,key+'_count',id));
        }
                                                                      
        if(prefix) add('tadpoles',number(r,prefix+'tadpoles',id));
      }else Object.keys(wallets).forEach(function(k){add(k,number(r,prefix+k,id));});
      b.packCount=number(r,prefix+'pack_count',id);b.packFrogs=number(r,prefix+'pack_frogs',id);
      if(b.packCount && !b.packFrogs) fail(id,prefix+'pack_frogs');return b;
    }
    var normal=bundle(''), replacement=r.ftue_first_claim_mode==='replace'?bundle('ftue_first_'):null;
    return Object.assign(result,result.mode==='replace'?replacement:normal);
  }
  function plan(rows,state,id,pending,ftue){
    var first=(state.familiesClaimed||[]).indexOf(id)<0, reward=resolve(rows,id,first&&ftue);
                                                                            
    if(ftue || state.ftueLoop>=1 && state.ftueLoop<=5 && !state.ftueDone) delete reward.currencies.tadpoles;
    return {id:id,first:first,mode:reward.mode,frogs:reward.recordBody&&(first||reward.repeatBody)?pending.slice():[],currencies:first||!reward.currencyFirst?reward.currencies:{},packCount:first||!reward.packFirst?reward.packCount:0,packFrogs:reward.packFrogs};
  }
  function claim(rows,state,id,pending,ftue,why){
    var p=plan(rows,state,id,pending,ftue);if(!pending.length) return null;
    p.frogs.forEach(function(f){f.assimilated=id;});
    Object.keys(p.currencies).forEach(function(k){state[k]=(state[k]||0)+p.currencies[k];});
    if(p.first){state.familiesClaimed=(state.familiesClaimed||[]).concat(id);state.familyRewardReceipts=state.familyRewardReceipts||{};state.familyRewardReceipts[id]={mode:p.mode};}
    for(var i=0;i<p.packCount;i++){state.freePacks=state.freePacks||[];state.freePacks.push({n:p.packFrogs,why:why});}
    return p;
  }
  var api={resolve:resolve,plan:plan,claim:claim,aliases:aliases};
  if(typeof module!=='undefined'&&module.exports) module.exports=api;
  g.FamilyRewards=api;
})(typeof window!=='undefined'?window:globalThis);
