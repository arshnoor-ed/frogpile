                                                                                  
(function(g){
  'use strict';
  function validateOdds(p1,p2,p3){
    [p1,p2,p3].forEach(function(p,i){
      if(typeof p!=='number' || !Number.isFinite(p) || p<0 || p>1)
        throw new Error('[HatchRoll] missing or invalid hatch_pad_roll_p'+(i+1)+': '+p);
    });
    var sum=p1+p2+p3;
    if(Math.abs(sum-1)>1e-9) throw new Error('[HatchRoll] odds p1+p2+p3 must sum to 1, got '+sum);
  }
  function roll(p1,p2,p3,rng){
    validateOdds(p1,p2,p3);
    var r=(rng || Math.random)();
    return r<p1?1:r<p1+p2?2:3;
  }
  function fromConfig(config,rng){
    return roll(config.value('MergeRules','hatch_pad_roll_p1'),
      config.value('MergeRules','hatch_pad_roll_p2'),config.value('MergeRules','hatch_pad_roll_p3'),rng);
  }
                                                                             
                                                                            
  function minimumForBudget(budget){
    if(!budget) return 1;
    return Math.max(1,Math.min(budget.maxYield,Math.ceil(budget.target-budget.equivalents-budget.futureEggs)));
  }
  function withBudget(count,budget){
    if(budget) count=Math.min(count,budget.maxYield);
    if(!budget || !budget.exact)return Math.max(count,minimumForBudget(budget));
    var remaining=budget.target-budget.equivalents, eggs=budget.futureEggs+1;
    var low=Math.max(1,remaining-budget.futureEggs*budget.maxYield);
    var high=Math.min(budget.maxYield,remaining-budget.futureEggs);
                                                                             
                                                                             
    if(low>high)return count;
    return Math.max(low,Math.min(high,Math.ceil(remaining/eggs)));
  }
  var api={validateOdds:validateOdds,roll:roll,fromConfig:fromConfig,minimumForBudget:minimumForBudget,withBudget:withBudget};
  if(typeof module!=='undefined' && module.exports) module.exports=api;
  g.HatchRoll=api;
})(typeof window!=='undefined'?window:globalThis);
