                                                                                    
(function(g){
  'use strict';
  function goalId(){return FPConfig.value('FTUE','goal_family_id');}
  function active(){return !!(typeof state!=='undefined' && state && state.ftueFamilyGoalReturn);}
  function beforeExpedition3(){
    return state && !state.ftueDone && (state.ftueLoop===3 ||
      (state.ftueLoop===4 && state.ftueL4Step==='expedition' &&
       (state.expeditionsCleared||[]).indexOf(FtueSteps.expeditionNode('expedition3'))<0));
  }
  function awaitingClaim(){
    if(typeof state==='undefined' || !state || state.ftueLoop!==3 || !state.ftueFamilyGoalDone || active())return false;
    if(typeof pendingFamilyFrogs==='function')return pendingFamilyFrogs(goalId()).length>0;
    return (state.frogs||[]).some(function(f){var fam=FT.familyOf(f);return fam && fam.id===goalId() && f.assimilated!==fam.id;});
  }
  function save(){if(typeof queueSave==='function')queueSave();}
  function reset(){if(g.PondPresentation)PondPresentation.resetTask();}
  var wakeTimer=null;
  function wake(ms){
    if(wakeTimer!==null)clearTimeout(wakeTimer);
    wakeTimer=setTimeout(function(){wakeTimer=null;if(typeof render==='function')render();},Math.max(0,ms));
  }
  function begin(id){
    if(id!==goalId() || !beforeExpedition3() || state.ftueFamilyGoalReturnDone)return false;
    var fam=FT.familyDefOf(id),need=(fam.slots||FT.SLOTS).length;
    state.ftueFamilyGoalReturn={phase:'assimilation',family:id,plate:[FPConfig.text('text_family_goal','Complete the {family} frog by matching traits',{family:fam.n}),need,need,false,false,null,'family-goal']};
    delete state.ftueFamilyClaimReturn;
    reset();save();return true;
  }
  function pondShown(){
    return typeof activeSheet!=='undefined' && !activeSheet && !!document.querySelector('.pond-stage') &&
      !document.querySelector('.gp-page,.xm-fullscreen,.sheet-scrim,.cl-overlay,#claim-modal,#family-spotlight,#ftue-tooltip');
  }
  function dismissed(id){
    if(!active() || state.ftueFamilyGoalReturn.family!==id)return;
    state.ftueFamilyGoalReturn.phase='complete';state.ftueFamilyGoalReturn.at=null;
    reset();save();
  }
  function duration(phase){return phase==='complete'?PondPresentation.PARAMS.celebrateMs:TASK_ENTER_MS;}
                                                                                  
  function sync(){
    if(!active())return false;
    var r=state.ftueFamilyGoalReturn;
    if(r.phase==='assimilation'){
                                                                                      
      if(document.querySelector('#family-spotlight') || (typeof familySpotlightQueue!=='undefined' && familySpotlightQueue.length))return true;
      if(!pondShown())return true;
      dismissed(r.family);
    }
    if(r.at==null){if(!pondShown())return true;r.at=Date.now();save();}
    var left=duration(r.phase)-(Date.now()-r.at);
    if(left>0){wake(left);return true;}
    if(r.phase==='complete'){
      r.phase='next';r.at=null;reset();save();
      if(state.ftueLoop===3)FtueSteps.enterLoop4();
      wake(0);return true;
    }
    delete state.ftueFamilyGoalReturn;state.ftueFamilyGoalReturnDone=true;save();return false;
  }
  function banner(next){
    if(!active())return '';
    var r=state.ftueFamilyGoalReturn;
    if(r.phase==='next')return next();
    if(r.phase==='complete' && r.at!=null)return PondPresentation.completedPlate(r.plate,buildTaskPlateHTML,Date.now()-r.at);
    return buildTaskPlateHTML.apply(null,r.plate).replace(/ tp-enter/g,'');
  }
  g.FamilyGoalReturn={active:active,awaitingClaim:awaitingClaim,begin:begin,dismissed:dismissed,sync:sync,banner:banner};
})(window);
