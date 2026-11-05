                                                                             
                                                            
                                                              

                                                                      
                                                                           
                                                                            
                                                                      
                                                                         
                                                                   
                                                                  
                                                            
                                                                       
                                                                           
                                                                         
                                                                           
                                                                         
                                                                           
                   

                                                                            
                                                                         
                                                                       
                                                                      
                                                                        
                                              
                                                                                
(function(){
  'use strict';
                                                                                             
  function text(key, fallback, tokens){
    if(typeof FPConfig !== 'undefined' && FPConfig.text) return FPConfig.text(key, fallback, tokens);
    return String(fallback).replace(/\{(\w+)\}/g, function(all, name){ return tokens && Object.prototype.hasOwnProperty.call(tokens,name) ? String(tokens[name]) : all; });
  }


                                                                              
                                                                           
                                                                        
                                                                           
                                                                             
                                                                             
                                                                   
                                                                             
                    
  var HOOK_NAMES = [
    'expeditionLaunch',                                                                                                        
    'expeditionTapPrompt',                                                                                                                     
    'expeditionResult',                                                            
    'mergeQueueGuaranteedAura',                                                                     
    'pondExpand',                                                                             
    'harvestAuto',                                                                                    
    'harvestManual',                                                                                                                                                             
    'craftWeaponChassis',                                                                              
    'flowerStation'                                                                                
  ];
  var HOOK_RESOLVERS = {
    expeditionLaunch: function(){ return (typeof openLiveExpedition === 'function') ? openLiveExpedition : null; },
    mergeQueueGuaranteedAura: function(){
      return (typeof MergeRules !== 'undefined' && MergeRules && typeof MergeRules.queueGuaranteedAura === 'function')
        ? function(){ return {ftueFinishFamily:MergeRules.queueGuaranteedAura('bunny').family}; } : null;
    },
    pondExpand: function(){
      return (typeof PondTiers !== 'undefined' && PondTiers && typeof PondTiers.expand === 'function')
        ? PondTiers.expand.bind(PondTiers) : null;
    },
    harvestAuto: function(){
      return (typeof Harvest !== 'undefined' && Harvest && typeof Harvest.ftueDispatchStep === 'function')
        ? Harvest.ftueDispatchStep.bind(Harvest) : null;
    },
    harvestManual: function(){
      return (typeof Harvest !== 'undefined' && Harvest && typeof Harvest.ftueManualStep === 'function')
        ? Harvest.ftueManualStep.bind(Harvest) : null;
    },
    craftWeaponChassis: function(){
      return (typeof EquipmentCraft !== 'undefined')
        ? function(){ return {ok:EquipmentCraft.complete(state)}; } : null;
    },
    flowerStation: function(){
      return (typeof Flowers !== 'undefined' && Flowers && typeof Flowers.ftuePlantStep === 'function')
        ? Flowers.ftuePlantStep.bind(Flowers) : null;
    }
  };
  var impl = {};
  var _warned = {};
  function resolveHook(name){
    if(typeof impl[name] === 'function') return impl[name];
    var r = HOOK_RESOLVERS[name];
    try{ return r ? r() : null; }catch(e){ return null; }                                                               
  }
  function callHook(name, ctx){
    var fn = resolveHook(name);
    if(typeof fn === 'function'){
      try{ return fn(ctx) || {ok:true}; }
      catch(e){ console.warn('[ftue-steps] hook "'+name+'" threw — FTUE continues without it.', e); return {ok:false, error:e}; }
    }
    if(!_warned[name]){
      _warned[name] = true;
      console.warn('[ftue-steps] hook "'+name+'" has no implementation yet — logging once and letting the FTUE continue.', ctx||{});
    }
    return {ok:false, missing:true};
  }
  function registerHook(name, fn){
    if(HOOK_NAMES.indexOf(name) < 0) console.warn('[ftue-steps] registering unknown hook name "'+name+'" — check the spelling against HOOK_NAMES.');
    impl[name] = fn;
  }
                                                                                                      
                                                                                                     
                                                                                                
                                                                                                     
                                                                                                        
                                                                                                                 
                                                                                                     
                                                                                                      
                                                                                            
  function tryHookStep(hookName, latchField, onAdvance, opts){
    if(state[latchField]) return;
    opts = opts || {};
    var fn = resolveHook(hookName);
    if(typeof fn !== 'function'){
      if(!_warned[hookName]){
        _warned[hookName] = true;
        console.warn('[ftue-steps] hook "'+hookName+'" has no implementation yet — skipping this beat so the FTUE can continue.');
      }
      state[latchField] = true;
      onAdvance();
      return;
    }
    var advanced = false;
    function done(){ if(advanced) return; advanced = true; state[latchField] = true; onAdvance(); }
                                                                                                  
                                                                                                     
                                                                                                     
                                                                                                      
                                                                                                      
                                                                                   
    if(opts.promptField && state[opts.promptField] && typeof opts.poll === 'function'){
      try{ if(opts.poll()) done(); }
      catch(e){ console.warn('[ftue-steps] hook "'+hookName+'"\'s poll threw — advancing past this beat.', e); done(); }
      return;
    }
    try{
      var result = fn(Object.assign({},opts.ctx||{},{onDone: done}));
      if(opts.promptField) state[opts.promptField] = true;
                                                                                                  
                                                                                                    
                                                                                                      
                                                                                                   
                                                                                            
      var complete = result && (typeof result.done !== 'undefined' ? result.done : result.ok);
      if(complete) done();
                                                                                                     
                                                                                                
                                                                                
    }catch(e){
      console.warn('[ftue-steps] hook "'+hookName+'" threw — advancing past this beat.', e);
      done();
    }
  }
                                                                                                     
                                                                                                 
                                                                                       
                                                                                      
                                                                                                       
                                                                                                      
                                                                                   
    
                                                                                                     
                                                                                                   
                                                                                            
                                                                                                    
  function watchExpeditionClear(idField){
    return !!(state[idField] && (state.expeditionsCleared||[]).indexOf(state[idField]) >= 0);
  }

                                                                             
                                                                           
                                                                      
                                                                         
                                                                         
                                                                
                                                                            
                                  
  var LOOP0_STEPS = [
    {id:'plant',  label:'tadpoles are planted on hatching pads (auto)'},
    {id:'hatch',  label:'tadpoles hatch on their own (auto, after the normal incubation timer)'},
    {id:'merge',  label:'frogs merge on their own, binary-tree style, until one frog remains (auto)'},
    {id:'ljfill', label:"the Lumberjack's 3-piece trait-fill plays in its existing fixed order (mouth, back, head — auto)"},
    {id:'walkoff',label:'the Lumberjack walks off the broadcast; the pond uncrops and Loop 1 begins'}
  ];

                                                                                       
                                                                                                
                                                                                                
                                                                                                   
                                                                                                
                                                                                                   
                                                                                               
                                                                                                     
                                       

                                                                                                   
                                                                                                     
                                                                                                  
                                                                                                 
                                                                                                     
                                                                                                     
                                                                                                      
                                                                                                    
                                                                                                       
                                                                                                    
                                                                    

                                                                                             
                                                                                                
                                                                                       
                                                                                                    
                                                                                                 
                                                                                                  
                                                                                                     
                                                                                                    
                                                                                                     
                                                                                                     
                                                                                                 
                                                                                               
                                                                                                                   
                                                                                       
                                                                                                
                                 
  var CINEMATIC_PARAMS = {
    tickMs: null,                                                                                                           
    hatchReadyDelayMs: null,                                                                   
    hatchHoldMs:150, hatchHopMs:350, mergeTravelMs:350, mergePopMs:320,
    readingGapMs:250, guideGatherMs:350,
    lumberjackLeadMs:40, lumberjackStandMs:1300, bunnyHopMs:360, bunnyHopReach:1.1,                                                   
    lumberjackTailMs:30, wobbleFallbackMs:575,
    tvCrackHoldMs:700, tvOffMs:650, tvOffBlackMs:300,                                                     
    breakingHoldMs:1400, breakingGapMs:300, breakingOutMs:300,
    uncropMs:550, uncropZoomMs:500, cavePeekDelayMs:650, cavePeekMs:1200
  };
  var _cineTimer = null;

  function cinematicActive(){
    return !!(typeof state !== 'undefined' && state && typeof ftueActive === 'function'
      && ftueActive() && !state.pondExpanded && !state.ftueLoop);
  }

                                                                                            
                                                                                                
                                                                                                    
                                                                                              

                                                                                                 
                                                                                              
                                                                                                 
                                                                                                   
                                                                                                   
                                                                                                  
                                                                                       

                                                                                                
                                                       
  function textPlate(label){
    var args=Array.prototype.slice.call(arguments); args[0]=escText(label);
    return taskPlateHTML.apply(null,args);
  }
  function escText(v){return String(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  var LOOP0_PLAY = {};
  function ftueKnob(key){return FPConfig.value('FTUE',key);}
  function expeditionStep(step,field){return ftueKnob('step_'+step+'_'+field);}
  function expeditionNode(step){return 'node-'+expeditionStep(step,'expedition_no');}
  function startDriver(){
    CINEMATIC_PARAMS.tickMs=ftueKnob('loop0_autoplay_tick_ms');
    CINEMATIC_PARAMS.hatchReadyDelayMs=ftueKnob('loop0_autoplay_hatch_ready_ms');
    LOOP0_PLAY.playerMerges=ftueKnob('loop0_player_merges');
    LOOP0_PLAY.dragFrogs=ftueKnob('loop0_direct_frogs');
    LOOP0_PLAY.leapIn=ftueKnob('loop0_direct_batch_size');
    LOOP0_PLAY.totalFrogs=ftueKnob('loop0_total_frogs');
    if(_cineTimer!==null) clearInterval(_cineTimer);
    _cineTimer=setInterval(cinematicTick,CINEMATIC_PARAMS.tickMs);
  }
  var LOOP0_PROMPTS = {
    get drag(){ return '<b>'+escText(text("text_intro_drag_verb", "Drag"))+'</b>'+escText(text("text_intro_drag_instruction", " frogs together to merge them!")); },
    get pop(){ return '<b>'+escText(text("text_intro_pop_verb", "Tap"))+'</b>'+escText(text("text_intro_pop_instruction", " the tadpoles to pop them!")); }
  };
  function loop0Auto(){
    try{ return new URLSearchParams(location.search).get('loop0') === 'auto'; }catch(e){ return false; }
  }
                                                                            
  function loop0Merges(){ return Math.max(0, (state.totalHatched||0) - (state.frogs||[]).length); }
                                                                                                  
                                                       
  function loop0Phase(){
    if(!cinematicActive() || loop0Auto()) return null;
    return loop0Merges() < LOOP0_PLAY.playerMerges ? 'drag' : 'pop';
  }
                                                                                                 
  function sameTierPair(){
    var byTier = {};
    (state.frogs||[]).forEach(function(f){
      if(!f) return;
      if(typeof expFrogBusy === 'function' && expFrogBusy(f.id)) return;
      if(typeof FT !== 'undefined' && FT.isRetired && FT.isRetired(f)) return;
      var t = f.tier||0; (byTier[t] = byTier[t]||[]).push(f.id);
    });
    for(var t in byTier){ if(byTier[t].length>=2) return [byTier[t][0], byTier[t][1]]; }
    return null;
  }
                                                                                            
  function syncLoop0Prompt(){
    var crop = document.getElementById('ftue-crop'); if(!crop) return;
    var phase = loop0Phase(), html = null;
    if(phase === 'drag' && sameTierPair()) html = LOOP0_PROMPTS.drag;
    else if(phase === 'pop' && (state.eggs||[]).some(function(e){ return e && e.tapOnly; })) html = LOOP0_PROMPTS.pop;
    var el = crop.querySelector('.crt-prompt');
    if(!html){ if(el) el.remove(); return; }
    if(!el){ el = document.createElement('div'); el.className = 'crt-prompt'; crop.appendChild(el); }
    if(el.innerHTML !== html) el.innerHTML = html;
  }
                                                                                                   
                                                                                                    
                                                                                                    
                                                        
  function plantTadpolesToPop(){
    if(typeof firstFreePad !== 'function' || typeof layEgg !== 'function') return;
    var planted = (state.totalHatched||0) + (state.eggs||[]).filter(Boolean).length, n = 0;
    while(planted < LOOP0_PLAY.totalFrogs && (state.tadpoles||0) > 0){
      var slot = firstFreePad(); if(slot < 0) break;
      layEgg(slot);
      var egg = state.eggs[slot]; if(!egg) break;
      egg.tapOnly = true; egg.readyAt = Date.now(); egg.duration = 1;
      planted++; n++;
    }
    if(n && typeof render === 'function') render();
  }

                                                                                                    
                                                                                                     
                                                                                                   
                                                                                                      
  function cinematicTick(){
    try{
      if(typeof state === 'undefined' || !state) return;
      var ls = document.getElementById('landing-screen');
      if(ls && !ls.classList.contains('hide')) return;                                 
      if(window.IntroCinematic && IntroCinematic.playing()) return;                                       
      if(!cinematicActive()) return;
      if(window.PondPresentation && PondPresentation.cinematicBusy()) return;
      if(typeof activeSheet !== 'undefined' && activeSheet) return;                                                     
      if(document.getElementById('ftue-lumberjack')) return;                                                                  
                                                                                                                 
      if(document.querySelector('#body-hint,#ftue-tooltip,#family-spotlight,.big-unlock,.modal-overlay')) return;

      if(state.ftueLumberjackGone){ enterLoop1(); return; }

                                                                                                 
                                                                                   
      if(typeof showcaseFrog !== 'undefined' && showcaseFrog) return;
      if(typeof evoShowcase !== 'undefined' && evoShowcase) return;

      var phase = loop0Phase(), eggs = state.eggs || [];
                                                                                                     
                                              
      if(phase === 'drag' && !sameTierPair() && typeof ftueFrogsLeapIn === 'function'){
        var due = Math.min(LOOP0_PLAY.leapIn, LOOP0_PLAY.dragFrogs - (state.totalHatched||0));
        if(due > 0){ ftueFrogsLeapIn(due, !(state.totalHatched > 0)); return; }
      }
      if(phase === 'pop'){ plantTadpolesToPop(); eggs = state.eggs || []; }

                                                                                                    
                                                            
      if(phase !== 'pop'){
        for(var i=0;i<eggs.length;i++){
          var e = eggs[i];
          if(e && e.readyAt <= Date.now()){ hatchEgg(e.id); return; }
        }
      }

                                                                                                      
      var ids = (phase === 'drag') ? null : sameTierPair();
      if(ids){
        if(window.PondPresentation){ PondPresentation.mergeTravel(ids[0],ids[1],function(){doMerge(ids[0],ids[1]);}); }
        else doMerge(ids[0],ids[1]);
        return;
      }
      if(phase) return;                                                                                                               

                                                                                                      
                                                                                                   
                                                                                                    
                                                                                                     
                                                                                                      
                                                                                                   
                                                                                                  
                                                                                                     
                                                                                                   
      if(typeof firstFreePad === 'function' && typeof layEgg === 'function' && (state.tadpoles||0) > 0){
        var slot = firstFreePad();
        if(slot >= 0){
          layEgg(slot);
          var egg = state.eggs[slot];
          if(egg){
            egg.readyAt = Date.now() + CINEMATIC_PARAMS.hatchReadyDelayMs;
            egg.duration = CINEMATIC_PARAMS.hatchReadyDelayMs;
            if(typeof render === 'function') render();
          }
          return;
        }
      }

                                                                                                
    }catch(err){
      console.warn('[ftue-steps] cinematic autoplay tick threw — will retry next tick.', err);
    }
  }

                                                                              
                                                                          
                                                                            
                                                                           
                                                                             
                                                                             
                                                                           
                                                                          
                                                                          
                                                                        
                                                                           
                                                                         
                                                                           
                                                                       
                                                                      
                                                                           
                                                                 

                                                                      
                                                                                
                                                                           
                                                                           
                                                                         
                                                                       
                                                                       
                                                                              
                                                                          
                                                                         
                                                                      
  function enterLoop1(){
    if(!state || state.ftueLoop) return;
    state.ftueLoop = 1;
    state.ftueL1Step = 'hatch1';
    state.ftueL1Base = { hatched: state.totalHatched||0 };
    state.ftueL1HatchDone = false;
    state.ftueL1MergeDone = false;
    state.ftueL1Body3Done = false;
    state.ftueFirstEarsDue = true;                                                                        
    state.tutorialStep = 'done';                                                                                         
    state.seenBodyHint = 1;                                                                                                                 
    try{
      if(typeof pondUncrop === 'function') pondUncrop();                                               
      else expandPond();
    }catch(e){ console.warn('[ftue-steps] the Loop 0→1 pond uncrop threw', e); }
    if(typeof queueSave === 'function') queueSave();
    if(typeof render === 'function') render();
  }

                                                                                             
  function skipIntro(){
    if(!state || state.pondExpanded || state.ftueLoop) return;
    state.ftueMutating = false;
    if(typeof showcaseFrog !== 'undefined') showcaseFrog = null;
    var lj = document.getElementById('ftue-lumberjack');
    if(lj){
      var departing=(state.frogs||[]).filter(function(f){return f.id===lj.dataset.frogId;})[0];
      lj.remove();
                                                                               
      if(departing && typeof ftueLumberjackGone==='function') ftueLumberjackGone(departing);
    }
    var com = document.getElementById('ftue-commentator'); if(com) com.remove();
    state.ftueLumberjackGone = 1;
    try{ ftueRetireLumberjackPieces(); }catch(e){}
    enterLoop1();
  }

                                                                                                     
                                                                                                   
                                                                                                  
                                                                                                     
                                
  function ftueUiActive(){ return !!(state && state.ftueLoop >= 1 && state.ftueLoop <= 5 && !state.ftueDone); }
                                                                                                 
                                                                                      
  function loop1BannerActive(){ return !!(state && state.ftueLoop === 1 && !state.ftueLoop1HandedOff); }

                                                                                                
                                                      
                                                                                                 
                                                                                                
                                                                                             
                                                                                         
                                                                                             
                                                                  
                                                                                                   
  var LOOP1_PLAN = [
                                                                                                   
                                                                                                    
                                                                                                     
                                                                                                   
                                                                                               
                                                                                                  
                                                                                             
    {row:'1.1',  phase:'empty',  banner:null,                               note:'Empty Pond — no objective shown yet (not reached in practice; see comment above)'},
    {row:'1.2',  phase:'hatch1', get banner(){return text("text_l1_hatch", "Hatch a tadpole");},                   note:'guided tap: plant a tadpole'},
    {row:'1.3',  phase:'hatch1', get banner(){return text("text_l1_hatch", "Hatch a tadpole");},                   note:'wait for the hatch timer (no triple-tap)'},
    {row:'1.4',  phase:'hatch1', get banner(){return text("text_l1_hatch", "Hatch a tadpole");},                   note:'guided tap hatches the frog'},
    {row:'1.5',  phase:'merge1', get banner(){return text("text_l1_merge", "Merge a frog");},                     note:'guided merge telegraph (hand moves frog to frog)'},
    {row:'1.6',  phase:'build3', get banner(){return text("text_l1_level", "Hatch and merge a stronger party");},      note:'hatch more'},
    {row:'1.7',  phase:'build3', get banner(){return text("text_l1_level", "Hatch and merge a stronger party");},      note:'merge more'},
    {row:'1.8',  phase:'build3', get banner(){return text("text_l1_level", "Hatch and merge a stronger party");},      note:'hatch more'},
    {row:'1.9',  phase:'build3', get banner(){return text("text_l1_level", "Hatch and merge a stronger party");},      note:'merge more — aura is the only open slot left'},
    {row:'1.10', phase:'launch', get banner(){return text("text_l1_launch", "Clear an Expedition");},             note:'guided tap reveals the expedition button; party is forced to exactly the body-3 frog + the body-0 leftover, min-party gate overridden'},
    {row:'1.11', phase:'combat', banner:null, hook:'expeditionLaunch',      note:'Expedition Start — owned by ovh-combat'},
    {row:'1.12', phase:'combat', banner:null, hook:'expeditionLaunch',      note:'Wave 1'},
    {row:'1.13', phase:'combat', banner:null, hook:'expeditionLaunch',      note:'Wave 2 — soft "you can help by tapping" CTA'},
    {row:'1.14', phase:'combat', banner:null, hook:'expeditionTapPrompt',     note:'non-blocking tap prompt on final-wave start'},
    {row:'1.15', phase:'combat', banner:null, hook:'expeditionTapPrompt',     note:'tap response / surge VFX'},
    {row:'1.16', phase:'combat', banner:null, hook:'expeditionResult',      note:'Expedition End'},
    {row:'1.17', phase:'combat', banner:null, hook:'expeditionResult',      note:'reward reveal; Bunny aura queues via mergeQueueGuaranteedAura'}
  ];

  function bestBodySize(){
    var best = 0;
    (state.frogs||[]).forEach(function(f){ if(f && (f.tier||0) > best) best = f.tier||0; });
    return best;
  }

  function retryCompanions(){return ftueKnob('loop2_retry_min_companions');}
  function bunnyHatchBudget(eggId){
    return FtueTadflow.budget(state,eggId);
  }

  function loop2RetryPartyActive(){
    return ftueUiActive() && state.ftueLoop===2 && state.ftueL2Step==='reattempt' && !state.ftueL2RetryHandedOff;
  }
  function loop2Party(){
    return (state.frogs||[]).filter(function(f){
      return f.id===state.ftueL2BunnyFrogId && isFinished(f) && frogFamilyId(f)==='bunny';
    }).map(function(f){ return f.id; });
  }

  function partySelectionActive(){ return (loop1BannerActive() && state.ftueL1Step === 'launch') || loop2RetryPartyActive(); }
  function tutorialParty(){ return loop2RetryPartyActive() ? loop2Party() : suggestedParty(); }
  function partyFrogAllowed(id){ return loop2RetryPartyActive() || !partySelectionActive() || tutorialParty().indexOf(id)>=0; }
  function validTutorialParty(ids){
    var allowed=tutorialParty();
    if(loop2RetryPartyActive()) return allowed.length===ftueKnob('loop2_finished_bunny_count') && ids.indexOf(allowed[0])>=0 &&
      ids.length>=allowed.length+retryCompanions() &&
      ids.length===new Set(ids).size && ids.every(function(id){ return (state.frogs||[]).some(function(f){return f.id===id;}); });
    return allowed.length===ftueKnob('loop1_party_count') && allowed[0]!==allowed[1] && ids.length===ftueKnob('loop1_party_count') && ids[0]!==ids[1] && allowed.every(function(id){return ids.indexOf(id)>=0;});
  }
                                                                              
                                                                                     
  function partyMergeAllowed(id){
    return !(ftueUiActive() && state.ftueLoop===2 && !state.ftueL2RetryHandedOff &&
      id===state.ftueL2BunnyFrogId);
  }
  function mergeOptions(a,b){
    if(familyGoalActive()){
      var opts=familyGoalMergeOptions(), step=FT.nextStep(a);
      if(step && step.n===FT.MAX_MERGES)opts.ftueFinishFamily=familyGoalId();
      return opts;
    }
    if(!ftueUiActive() || state.ftueLoop!==2 || state.ftueL2Step!=='grow2x4') return {};
    syncLoop2();                                                                        
    if(state.ftueL2BunnyFrogId || !FT.canMergePair(a,b)) return {};
    var next=FT.nextStep(a);
    if(!next || next.n!==FT.MAX_MERGES) return {};
                                                                               
                                                                                          
    return callHook('mergeQueueGuaranteedAura', {reason:'loop2-first-finished-frog-is-bunny'}) || {};
  }

  function suggestedParty(){
    var veteran=null, fresh=null;
    (state.frogs||[]).forEach(function(f){
      if(!f) return;
      if((f.tier||0) >= ftueKnob('loop1_target_body_size') && !veteran) veteran = f.id;
      else if((f.tier||0) >= ftueKnob('loop1_companion_body_size') && !fresh) fresh = f.id;
    });
    return [veteran, fresh].filter(Boolean);
  }

                                                                                                 
                                                                                                  
                                                                                                     
                                                                                                      
                                                                                                     
                                                                                                      
                                                                                                      
                                                                                                 
                                                                                                     
                                                       
  function ensurePartyForLaunch(){
    if(state.ftueL1PartyForced) return;
    var party = suggestedParty();
    if(party.length === ftueKnob('loop1_party_count')){
      if(typeof expeditionParty !== 'undefined') expeditionParty = party;
      state.ftueL1PartyForced = true;
      return;
    }
                                                                                                      
                                                                                                   
    var eggs = state.eggs || [];
    for(var i=0;i<eggs.length;i++){
      if(eggs[i] && eggs[i].readyAt <= Date.now()){ if(typeof hatchEgg === 'function') hatchEgg(eggs[i].id); return; }
    }
    var incubating = eggs.some(function(e){ return !!e; });
    if(!incubating && typeof firstFreePad === 'function' && firstFreePad() >= 0 && (state.tadpoles||0) > 0 && typeof layEgg === 'function'){
      layEgg();
    }
  }

  function syncLoop1(){
    if(state.ftueLoop1HandedOff){
                                                                                                      
      if(watchExpeditionClear('ftueExp1Id')) enterLoop2();
      return;
    }
    var base = state.ftueL1Base || {hatched:0};
    var hatch=state.ftueHatchObjective;
    if(hatch && hatch.key==='l1-hatch' && hatch.complete && !hatchCompletionPending()) state.ftueL1HatchDone=true;
    if(!state.ftueL1HatchDone && (state.totalHatched||0) > base.hatched) state.ftueL1HatchDone = true;
    if(!state.ftueL1MergeDone && (state.frogs||[]).some(function(f){ return (f.tier||0) >= 1; })) state.ftueL1MergeDone = true;
    if(!state.ftueL1Body3Done && (state.frogs||[]).some(function(f){ return (f.tier||0) >= ftueKnob('loop1_target_body_size'); })) state.ftueL1Body3Done = true;

    if(state.ftueL1Step === 'hatch1' && state.ftueL1HatchDone) state.ftueL1Step = 'merge1';
    if(state.ftueL1Step === 'merge1' && state.ftueL1MergeDone) state.ftueL1Step = 'build3';
    if(state.ftueL1Step === 'build3' && state.ftueL1Body3Done && suggestedParty().length===ftueKnob('loop1_party_count')) state.ftueL1Step = 'launch';
    if(state.ftueL1Step === 'launch') ensurePartyForLaunch();
  }

  function renderLoop1Banner(){
    switch(state.ftueL1Step){
      case 'hatch1': return hatchObjectiveBanner(text("text_l1_hatch", "Hatch a tadpole"), 0, 1,
        {text:text('text_l1_merge','Merge a frog'),have:0,need:1});
      case 'merge1': return textPlate(text("text_l1_merge", "Merge a frog"), 0, 1, false, false, null);
      case 'build3': return textPlate(text("text_l1_level", "Hatch and merge a stronger party"), bestBodySize(), ftueKnob('loop1_target_body_size'), false, false, null);
      case 'launch': return textPlate(text("text_l1_launch", "Clear an Expedition"), 0, 1, false, false, null);
      default: return '';
    }
  }

                                                                                                         
                                                                                                     
                                                                       
  function loop1PointerTarget(){
    switch(state.ftueL1Step){
      case 'hatch1':
                                                                                                    
                                                                                             
      case 'merge1':
        return (typeof bestOnScreen === 'function')
          ? hatchPointerTarget('ftue-l1-hatch')
          : null;
      case 'launch': return expeditionPointerTarget(1);
      default:
        return null;                                         
    }
  }

                                                                                                   
                                                                                        
                                                                                                         
                                                                                                       
                                                                                                      
                                                                                                       
                                                                                                     
                                
  function onExpeditionDispatch(ctx){
    if(!state) return;
    var party = (ctx && ctx.party) || (typeof expeditionParty !== 'undefined' ? expeditionParty.slice() : []);
                                                                           
    var expId = ctx && ctx.expId;
    if(state.ftueLoop === 1 && state.ftueL1Step === 'launch' && !state.ftueLoop1HandedOff && expId === expeditionNode('launch')){
      if(typeof COMBAT_TEST_MODE!=='undefined' && COMBAT_TEST_MODE) state.combatTestForcedParty=party.slice();
      state.ftueLoop1HandedOff = true;
      state.ftueExp1Id = expId;
      callHook('expeditionLaunch', {step:'1.10', party: party});
    } else if(state.ftueLoop === 2 && state.ftueL2Step === 'attempt2' && expId === expeditionNode('attempt2')){
      state.ftueExp2AId = expId;
      callHook('expeditionLaunch', {step:'attempt2', party: party});
    } else if(state.ftueLoop === 2 && state.ftueL2Step === 'reattempt' && expId === expeditionNode('reattempt')){
      state.ftueExp2BId = expId;
      state.ftueL2RetryHandedOff = true;
      callHook('expeditionLaunch', {step:'reattempt', party: party});
    } else if(state.ftueLoop === 4 && state.ftueL4Step === 'expedition' && expId === expeditionNode('expedition3')){
      state.ftueExp3Id = expId;
      callHook('expeditionLaunch', {step:'expedition3', party: party});
    } else if(state.ftueLoop === 5 && state.ftueL5Step === 'expedition' && expId === expeditionNode('expedition5')){
      state.ftueExp5Id = expId;
      callHook('expeditionLaunch', {step:exp5LossDue() ? 'expedition5-loss' : 'expedition', party: party});
    }
  }
  var handOffToExpedition = onExpeditionDispatch;                                                                   

                                                                                                
                                                                 
                                                                                      
                                                                                                  
                                                                                                 
                                                                                                   
                                                                                                   
  var LOOP2_PLAN = [
    {row:'2.1',  phase:'attempt2', get banner(){return text("text_l2_expedition", "Clear Expedition 2");}, hook:'expeditionLaunch', note:'a real fight — difficulty decides win/loss (captain, 2026-10-22), no forced outcome'},
    {row:'2.2',  phase:'attempt2', banner:null,                 hook:'expeditionLaunch', note:'prediction bar shown, never gates SEND (plan §4)'},
    {row:'2.3',  phase:'attempt2', banner:null,                 hook:'expeditionLaunch', note:'boss wave — a real fight, live-tap-dependent like any other'},
    {row:'2.4',  phase:'grow2x4',  get banner(){return text("text_l2_evolve", "Completely evolve 1 frog");}, note:'loss-tip popup, frogs intact'},
    {row:'2.5',  phase:'grow2x4',  get banner(){return text("text_l2_evolve", "Completely evolve 1 frog");}, note:'first completely evolved Level 4 Bunny'},
    {row:'2.6',  phase:'grow2x4',  get banner(){return text("text_l2_evolve", "Completely evolve 1 frog");}, hook:'mergeQueueGuaranteedAura', note:'first finished frog is guaranteed Bunny'},
    {row:'2.7',  phase:'codex',    get banner(){return text("text_l2_codex", "Check your codex");},   note:'Bunny family complete'},
    {row:'2.8',  phase:'codex',    banner:null,                 note:'not visible in codex screen — claim the family'},
    {row:'2.9',  phase:'codex',    banner:null,                 note:'not visible in codex screen — Bunny ability (<30% dodge) legible in Codex'},
    {row:'2.10', phase:'reattempt',get banner(){return text("text_l2_expedition", "Clear Expedition 2");}, note:'guided tap to re-send'},
    {row:'2.11', phase:'reattempt',get banner(){return text("text_l2_expedition", "Clear Expedition 2");}, hook:'expeditionLaunch', note:'retry requires the completed Bunny plus a companion, up to the sheet cap'},
    {row:'2.12', phase:'reattempt',get banner(){return text("text_l2_expedition", "Clear Expedition 2");}, hook:'expeditionLaunch', note:'genuine win, real (<30%) Bunny dodge rate'},
    {row:'2.13', phase:'reattempt',banner:null,                 hook:'expeditionResult', note:'reward reveal'}
  ];

  function enterLoop2(){
    if(!state || state.ftueLoop !== 1) return;
    state.ftueLoop = 2;
    state.ftueL2Step = 'attempt2';
    state.ftueL2FirstBody4 = false;
    state.ftueL2BunnyBody4 = false;
    state.ftueL2FirstFrogId = null;
    state.ftueL2BunnyFrogId = null;
    state.ftueL2RetryHandedOff = false;
    state.ftueL2RetryPopulationReached = false;
    if(typeof queueSave === 'function') queueSave();
    if(typeof render === 'function') render();
  }

  function frogFamilyId(f){
    if(!f) return null;
    try{ var fam = (typeof FT !== 'undefined' && FT.familyOf) ? FT.familyOf(f) : null; return fam ? fam.id : null; }
    catch(e){ return null; }
  }
  function isFinished(f){ try{ return !!(f && typeof FT !== 'undefined' && FT.isRetired && FT.isRetired(f)); }catch(e){ return false; } }

                                                                               
                                                                           
  function hatchWorkAvailable(){
    var room=typeof lilypadCap!=='function' || (state.frogs||[]).length<lilypadCap(state);
    return !!(room && (state.eggs||[]).some(Boolean)) ||
      ((state.tadpoles||0)>=FPConfig.value('MergeRules','hatch_tadpole_cost') &&
       typeof firstFreePad==='function' && firstFreePad()>=0);
  }
  function hatchPointerTarget(id){
    var room=typeof lilypadCap!=='function' || (state.frogs||[]).length<lilypadCap(state);
    var ready=room && bestOnScreen('.lilypad.egg-pad.ready',id);
    return ready || ((state.tadpoles||0)>=FPConfig.value('MergeRules','hatch_tadpole_cost') &&
      typeof firstFreePad==='function' && firstFreePad()>=0 ? bestOnScreen('.lilypad.egg-pad.empty',id) : null);
  }
  function hatchObjectiveKey(){
    if(state.ftueLoop===1 && state.ftueL1Step==='hatch1') return 'l1-hatch';
    if(state.ftueLoop===2 && state.ftueL2Step==='retry_population') return 'l2-retry-hatch';
    return null;
  }
  function remainingHatchMerges(){
    if(typeof FT==='undefined')return 0;
    var levels=[],remaining=0;
    (state.frogs||[]).forEach(function(f){
      if(isFinished(f) || !partyMergeAllowed(f.id) || (typeof expFrogBusy==='function' && expFrogBusy(f.id))) return;
      var n=FT.mergesOf(f);levels[n]=(levels[n]||0)+1;
    });
                                                                              
    for(var n=0;n<FT.MAX_MERGES;n++){
      var pairs=Math.floor((levels[n]||0)/2);remaining+=pairs;
      levels[n+1]=(levels[n+1]||0)+pairs;
    }
    return remaining;
  }
  function syncHatchObjective(){
    var key=hatchObjectiveKey(),r=state.ftueHatchObjective;
    if(!key || hatchWorkAvailable()){ delete state.ftueHatchObjective;return; }
    var left=remainingHatchMerges();
    if(left && (!r || r.key!==key)){
      state.ftueHatchObjective={key:key,total:left,arrival:ObjectiveStack.transition()};
                                                                              
                                                                           
      if(typeof PondPresentation!=='undefined') PondPresentation.resetTask();
      if(typeof queueSave==='function')queueSave();
    }
    else if(r && r.key===key){
      r.total=Math.max(r.total,left);
      if(!left && !r.complete){
        r.complete=ObjectiveStack.transition();
        if(typeof PondPresentation!=='undefined' && r.complete.duration)r.complete.duration=PondPresentation.PARAMS.celebrateMs;
        r.complete.at=null;                                                       
        if(typeof queueSave==='function')queueSave();
      }
      if(r.complete && r.complete.at==null && hatchCompletionVisible()){
        r.complete.at=Date.now();
        if(typeof queueSave==='function')queueSave();
        if(typeof setTimeout==='function')setTimeout(function(){if(typeof render==='function')render();},r.complete.duration);
      }
    }
  }
  function hatchCompletionVisible(){
    return !(typeof activeSheet!=='undefined' && activeSheet) &&
      !(typeof evoShowcase!=='undefined' && evoShowcase) && !(typeof showcaseFrog!=='undefined' && showcaseFrog) &&
      (typeof document.querySelector!=='function' || !document.querySelector('#body-hint,.modal-overlay,#family-spotlight,.big-unlock,.cl-overlay,#claim-modal,#labor-window,#ftue-tooltip,.sheet-scrim'));
  }
  function hatchCompletionPending(){
    var t=state.ftueHatchObjective && state.ftueHatchObjective.complete;
    return !!(t && (t.at==null || ObjectiveStack.transitioning(t)));
  }
  function hatchMergeGuidanceActive(){
    return !!(ftueUiActive() && hatchObjectiveKey() && !hatchWorkAvailable() && remainingHatchMerges());
  }
  function hatchObjectiveBanner(label,have,need,next){
    var r=state.ftueHatchObjective;
    if(!r || r.key!==hatchObjectiveKey())return textPlate(label,have,need,false,false,null);
    var left=remainingHatchMerges();
    if(r.complete && r.complete.at!=null && typeof PondPresentation!=='undefined'){
      return PondPresentation.completedPlate([text('text_hatch_remaining_merges','Complete all possible merges'),r.total,r.total,true,true,null,r.key],
        buildTaskPlateHTML,Date.now()-r.complete.at).replace('tp-celebrate','tp-celebrate tp-complete-held');
    }
    var steps=[{text:label,have:need,need:need},
      {text:text('text_hatch_remaining_merges','Complete all possible merges'),have:r.total-left,need:r.total},next];
    return ObjectiveStack.render(steps,r.complete && r.complete.at!=null?2:1,r.key,r.complete && r.complete.at!=null?r.complete:r.arrival);
  }

  function syncLoop2(){
                                                                           
                                                                  
    state.ftueL2RetryPopulationReached=loop2Party().length===ftueKnob('loop2_finished_bunny_count') &&
      (state.frogs||[]).filter(function(f){return f.id!==state.ftueL2BunnyFrogId && FT.mergesOf(f)>=ftueKnob('loop2_companion_body_size');}).length>=retryCompanions();
    switch(state.ftueL2Step){
      case 'attempt2':
                                                                                               
                                                                                             
                                                                                               
                                                                                            
        if(typeof COMBAT_TEST_MODE!=='undefined' && COMBAT_TEST_MODE && state.combatTestExp2FirstResolved && (state.claimedExpeditionRewards||[]).indexOf('2:win')>=0){
          state.ftueL2Step = 'return_pond';
        } else if(watchExpeditionClear('ftueExp2AId')){
                                                                           
                                                                           
          state.ftueL2Step = 'return_pond';
        } else if(state.ftueExp2AId && (state.claimedExpeditionRewards||[]).indexOf('2:loss')>=0){
                                                                                                
          state.ftueL2Step = 'return_pond';
        }
        break;
      case 'grow2x4':
        var finished=(state.frogs||[]).filter(isFinished);
        if(!state.ftueL2FirstFrogId && finished.length>=ftueKnob('loop2_finished_bunny_count')) state.ftueL2FirstFrogId=finished[0].id;
        if(!state.ftueL2BunnyFrogId){
          var bunny=finished.find(function(f){ return frogFamilyId(f)==='bunny'; });
          if(bunny) state.ftueL2BunnyFrogId=bunny.id;
        }
        state.ftueL2FirstBody4=!!state.ftueL2FirstFrogId;
        state.ftueL2BunnyBody4=!!state.ftueL2BunnyFrogId;
        if(loop2Party().length===ftueKnob('loop2_finished_bunny_count')) state.ftueL2Step = 'codex';
        break;
      case 'codex':
        if((state.familiesClaimed||[]).indexOf('bunny') >= 0 &&
          (state.frogs||[]).some(function(f){ return f.id===state.ftueL2BunnyFrogId && f.assimilated==='bunny'; })) {
          state.ftueL2Step = state.ftueL2RetryPopulationReached && !hatchWorkAvailable() && !remainingHatchMerges() ? 'reattempt' : 'retry_population';
        }
        break;
      case 'retry_population':
        if(!hatchWorkAvailable() && !remainingHatchMerges() &&
          !hatchCompletionPending()) state.ftueL2Step='reattempt';
        break;
      case 'reattempt':
        if(loop2RetryPartyActive() && typeof expeditionParty!=='undefined'){
          expeditionParty=expeditionParty.filter(function(id){ return partyFrogAllowed(id); });
        }
        if(watchExpeditionClear('ftueExp2BId')) enterLoop3();
        break;
    }
  }

  var _populationConfigWarning=false;
  function retryPopulationTarget(){
    try{
      var target=Number(FPConfig.value('FTUE','ftue_a8_frog_count_target'));
      if(!Number.isInteger(target) || target<=0) throw new Error('FTUE.ftue_a8_frog_count_target must be a positive integer');
      return target;
    }catch(error){
                                                                         
                                                                                 
      if(!_populationConfigWarning){ console.warn('[ftue-steps] skipping retry population gate:',error); _populationConfigWarning=true; }
      return null;
    }
  }
  function onPondOpened(){
    if(familyClaimReturnDue() && typeof activeSheet!=='undefined' && activeSheet) return;
    if(window.FtueTooltips){ FtueTooltips.sync(); if(FtueTooltips.paused()) return; }
    if(ftueUiActive() && state.ftueLoop===2 && state.ftueL2Step==='return_pond'){
      state.ftueL2Step='grow2x4';
      if(typeof queueSave==='function') queueSave();
    }
    if(ftueUiActive() && state.ftueLoop===5 && state.ftueL5Step==='return_pond' && loop5PondShown()) enterShop();
  }

                                                                                         
                                                                                  
                                                                                            
                                                                                         
                                                                                           
                                                                                   
                                                                                        
                                                                                         
                                                                                            
                                                                                     
                                                                          
                                                                                        
                                                                                        
                        
  function renderRetryPopulationBanner(){
    var label = text("text_l2_retry_population", "Hatch and merge a stronger party");
    var r = state.ftueHatchObjective;
    if(!r || r.key !== hatchObjectiveKey()) return textPlate(label, 0, 1, false, false, null);
    var left = remainingHatchMerges();
    if(r.complete && r.complete.at != null && typeof PondPresentation !== 'undefined'){
      return PondPresentation.completedPlate([label, r.total, r.total, true, true, null, r.key],
        buildTaskPlateHTML, Date.now()-r.complete.at).replace('tp-celebrate', 'tp-celebrate tp-complete-held');
    }
    return textPlate(label, r.total-left, r.total, false, false, null, r.key);
  }

  function renderLoop2Banner(){
    switch(state.ftueL2Step){
      case 'attempt2': return textPlate(text("text_l2_expedition", "Clear Expedition 2"), 0, 1, false, false, null);
      case 'return_pond': return textPlate(text("text_return_pond", "Return to your pond"), 0, 1, false, false, null);
      case 'retry_population': return renderRetryPopulationBanner();
      case 'grow2x4':
        var have = state.ftueL2BunnyBody4?1:0;
        return textPlate(text("text_l2_evolve", "Completely evolve 1 frog"), have, 1, false, false, null);
      case 'codex':
                                                                                                     
                                                                                       
        if(typeof activeSheet !== 'undefined' && activeSheet === 'grimoire') return '';
        return textPlate(text("text_l2_codex", "Check your codex"), 0, 1, false, false, null);
      case 'reattempt':
        if(rematchPending()) return '';                                             
        return textPlate(text("text_l2_expedition", "Clear Expedition 2"), 0, 1, false, false, null);
      default: return '';
    }
  }
                                                                              
                                                                         
  function rematchPending(){
    return typeof FtueTooltips!=='undefined' && !!FtueTooltips.rematchDue && FtueTooltips.rematchDue(state);
  }

                                                                                                
                                                                                           
                                                                                            
                                                                                               
                                                                                            
                                                                                           
                                                                                          
                                                                                              
                                                                                              
                                                                                          
                                                                                            
                                                                                         
                                                           
                                                                                                   
  var _familyGoalWarned=false;
  function familyGoalKnob(key){
    try{ return ftueKnob(key); }
    catch(error){
                                                                                               
      if(!_familyGoalWarned){ console.warn('[ftue-steps] family goal off:',error); _familyGoalWarned=true; }
      return null;
    }
  }
  function familyGoalId(){
    var id=familyGoalKnob('goal_family_id');
    return id && typeof FT!=='undefined' && FT.familyDefOf(id) ? id : null;
  }
                                                                                  
  function keepGrimoireOpen(){
    if(!ftueUiActive() || typeof activeSheet==='undefined' || activeSheet!=='grimoire') return false;
    state.ftueFamilyClaimReturn=true;
    return true;
  }
  function keepFamilyClaimOpen(id){
    if(!ftueUiActive() || typeof activeSheet==='undefined' || activeSheet!=='grimoire') return false;
    var loop2Bunny=state.ftueLoop===2 && state.ftueL2Step==='codex' && id==='bunny';
    if(!loop2Bunny) return false;
    return keepGrimoireOpen();
  }
                                                                             
                                                                           
                                                                             
                                                                            
                                                                    
  function gearIntroduced(s){
    s=s||state;
    if(!ftueUiActive()) return true;                                                  
    return s.ftueLoop>4 || (s.ftueLoop===4 && s.ftueL4Step!=='expedition');
  }
  function familyClaimReturnDue(){
    return !!(ftueUiActive() && state.ftueFamilyClaimReturn);
  }
  function familyGoalLean(){
    var v=Number(familyGoalKnob('goal_family_roll_lean'));
    return v>0 && v<=1 ? v : 0;
  }
                                                                                     
  function familyGoalOpen(id){
                                                                                     
                                                                                  
                                                                                         
                                                                                           
                                                                                          
                                                                                            
                        
    if(!ftueUiActive() || (state.familiesClaimed||[]).indexOf('bunny')<0) return false;
    var won=(state.claimedExpeditionRewards||[]).indexOf(expeditionStep('reattempt','expedition_no')+':win')>=0;
    var p=won && typeof familyProgress==='function' ? familyProgress(id) : null;
    return !!(p && p.need>0 && p.have>=p.need);
  }
                                                                           
                                                                                  
  function familyGoalStep(){
    if(!state || state.ftueFamilyGoalDone) return null;
    var id=familyGoalId();
    if(!id || !familyGoalOpen(id)) return null;
    var whole=(state.frogs||[]).filter(function(f){ return frogFamilyId(f)===id; });
    if(!whole.length) return 'merge';
    return whole.some(function(f){ return f.assimilated===id; }) ? null : 'evolve';
  }
  function familyGoalActive(){
    if(!state || state.ftueFamilyGoalDone) return false;
    var id=familyGoalId();
    return !!id && familyGoalOpen(id) && !(state.frogs||[]).some(function(f){ return frogFamilyId(f)===id; });
  }
  function syncFamilyGoal(){
    if(!state || state.ftueFamilyGoalDone) return;
    var id=familyGoalId();
    if(!id || !familyGoalOpen(id)) return;
    if((state.frogs||[]).some(function(f){ return frogFamilyId(f)===id; })){
      state.ftueFamilyGoalDone=true;
      if(typeof queueSave==='function') queueSave();
      return;
    }
  }
                                                                       
  function pondExpansionLocked(){
    return !!(state && ftueUiActive() && (state.pondTier||0)<1 && !pondExpandGuidanceActive());
  }
  function hatchPadGuidanceActive(){
    return ftueUiActive() && state.ftueLoop===5 && state.ftueL5Step==='hatch_pad';
  }
  function buildPointerTarget(selector){
    var close=document.querySelector('.fi-close');
    if(close) return close;
    if(typeof activeSheet!=='undefined' && activeSheet==='upgrades'){
      if(typeof EquipmentCraft!=='undefined' && EquipmentCraft.upgradeTabValue()!=='build')
        return document.querySelector('[onclick="EquipmentCraft.setUpgradeTab(\'build\')"]');
      return document.querySelector(selector);
    }
    return dockBtnByLabel('Upgrades');
  }
                                                                          
                                                                             
                                                              
                                                                              
                                                                         
  function pondExpandPointerTarget(){
    var close=document.querySelector('.fi-close');
    if(close) return close;
    if(typeof activeSheet!=='undefined' && activeSheet==='upgrades'){
      if(typeof EquipmentCraft!=='undefined' && EquipmentCraft.upgradeTabValue()!=='build')
        return document.querySelector('[onclick="EquipmentCraft.setUpgradeTab(\'build\')"]');
      return document.querySelector('.pond-expand-buy');
    }
    return document.querySelector('.hud-pill.pond .hp-plus') || dockBtnByLabel('Upgrades');
  }
                                                                              
                                                                          
                                                                          
                                                                            
                                                                       
                                       
  function familyGoalMergeOptions(){
    var lean=familyGoalLean();
    return lean>0 ? {goalFamily:familyGoalId(), goalFamilyLean:lean} : {};
  }
                                                                             
                                                                              
  function familyGoalFamily(){ return familyGoalStep()==='merge' ? familyGoalId() : null; }
                                                                                
                                                  
  function familyGoalLockPrice(){
    var v=familyGoalKnob('goal_lock_lesson_price_bones');
    return v===null || v==='' || !(Number(v)>=0) ? null : Number(v);
  }
                                                       
  function familyGoalBest(id){
    var fam=FT.familyDefOf(id), best=0;
    (state.frogs||[]).forEach(function(f){ var p=FT.familyProgressOn(f,fam); if(p.have>best) best=p.have; });
    return best;
  }
                                                                                 
                                                                            
                                                                              
                                                                                
  var EVOLVE_HAND_HOLD_MS=1000, _evolveStepAt=0;
  function familyEvolvePointerTarget(){
    var now=Date.now();
    if(!_evolveStepAt) _evolveStepAt=now;
    if(now-_evolveStepAt<EVOLVE_HAND_HOLD_MS) return null;
    if(typeof familySpotlightQueue!=='undefined' && familySpotlightQueue.length) return null;
    if(typeof activeSheet==='undefined' || activeSheet!=='grimoire') return dockBtnByLabel('Codex');
    return grimTab!=='families' ? q1('.gr-tab[onclick*="families"]') : q1('.fam-cta[onclick*="'+familyGoalId()+'"]');
  }
  function renderFamilyGoalBanner(){
    var id=familyGoalId(), fam=FT.familyDefOf(id);
    return textPlate(text("text_family_goal", "Complete the {family} frog by matching traits", {family: fam.n}), familyGoalBest(id), (fam.slots||FT.SLOTS).length, false, false, null, 'family-goal');
  }

                                                                                      
  var LOOP3_PLAN = [
    {row:'3.only', phase:'family_goal', banner:null, note:'Loop 3 has no row of its own any more — see renderFamilyGoalBanner(); it simply waits for the family goal to finish, then enters Loop 4'}
  ];

  function enterLoop3(){
    if(!state || state.ftueLoop !== 2) return;
    state.ftueLoop = 3;
    state.ftueL3Step = 'family_goal';
                                                                                    
    if(typeof closeSheet === 'function') closeSheet();
    if(typeof queueSave === 'function') queueSave();
    if(typeof render === 'function') render();
  }
  function syncLoop3(){
                                                                              
                                                                      
                                                                            
                                                          
    if(['pond_preview','manual_harvest','pond_expand','auto_harvest','harvest_resources'].indexOf(state.ftueL3Step)>=0) state.ftueL3Step='family_goal';
    if(state.ftueFamilyGoalDone && !(window.FamilyGoalReturn && FamilyGoalReturn.awaitingClaim())) enterLoop4();
  }
  function renderLoop3Banner(){ return ''; }                                                                               

                                                                            
                                                                               
  function capExpansionTriggerEnabled(){
    var v=familyGoalKnob('cap_trigger_pond_expansion_enabled');
    return v===null || v==='' || Number(v)!==0;
  }
  function capExpansionActive(){ return pondExpandGuidanceActive(); }
  function capExpansionDone(){ return !!state.ftueCapExpansionDone; }
  function capExpansionEligible(){
    if(!state || !ftueUiActive() || state.ftueCapExpand || capExpansionDone()) return false;
    if((state.pondTier||0)>=ftueKnob('pond_expansion_target_tier')) return false;
    if((state.expeditionsCleared||[]).indexOf(expeditionNode('expedition4'))<0) return false;
    return (state.ftueLoop===4 || (state.ftueLoop===5 && ['hatch_pad','grow_roster'].indexOf(state.ftueL5Step)>=0)) && capExpansionTriggerEnabled();
  }
  function onFrogCapHatchBlocked(){
    if(!capExpansionEligible()) return false;
    state.ftueCapExpand={step:'pond_expand'};
    if(!hatchPadGuidanceActive() && typeof closeSheet==='function') closeSheet();
    if(typeof PondPresentation!=='undefined') PondPresentation.resetTask();
    if(typeof queueSave==='function') queueSave();
    return true;
  }
  function harvestGuidanceActive(){
    return ftueUiActive() && state.ftueLoop===4 && ['auto_harvest','harvest_resources'].indexOf(state.ftueL4Step)>=0;
  }
                                                                             
                                                                           
                                                                             
                                                                      
                                                                        
                                                                             
                                                                          
                                                                          
  function firstHarvestRemaining(){
    var lesson=state.ftueL4HarvestLesson;
    return lesson && !lesson.done ? Math.max(0,lesson.goal-lesson.stone) : 0;
  }
  function harvestShortfall(){
    var short=equipmentShortfall();
    return {mat:short.mat||0,rock:Math.max(short.rock||0,firstHarvestRemaining())};
  }
  function firstHarvestTitle(){
    return text('text_l4_first_harvest','Harvest {amount} stone with your frogs').replace('{amount}',((state.ftueL4HarvestProgress||{}).need||{}).stone || state.ftueL4HarvestLesson.goal);
  }
  function harvestNeeds(){
    var short=harvestShortfall();
    return materialsShort(short) ? short : {mat:1, rock:1};
  }
  function harvestGoalHTML(){
    if(!harvestGuidanceActive() || !window.KitUI) return '';
    var short=harvestShortfall();
    if(!materialsShort(short))
      return '<div class="ftue-harvest-goal"><b>'+escText(text("text_l4_harvest_title", "Put your frogs to work"))+ '</b><span>'+escText(text("text_l4_harvest_explanation", "Send frogs to gather wood and mine stone. It speeds up crafting!"))+ '</span></div>';
    return '<div class="ftue-harvest-goal"><b>'+escText(firstHarvestRemaining()>0 ? firstHarvestTitle() : text('text_l4_harvest', 'Harvest for equipment crafting'))+'</b><div>'+
      ['mat','rock'].filter(function(k){return short[k]>0;}).map(function(k){
        var have=Math.floor(state[k]||0), need=have+Math.ceil(short[k]);
        return '<span class="ftue-harvest-wallet">'+KitUI.costChip(curIcon(k),need,have)+'<span>'+have+' / '+need+'</span></span>';
      }).join('')+
      '</div><span>'+escText(text("text_l4_harvest_instruction", "Send frogs to gather wood and mine stone."))+ '</span></div>';
  }
  function equipmentDispatchPlan(){
    var jobs=FPConfig.rows('Harvesting').filter(function(j){return j.resource==='wood' || j.resource==='stone';})
      .sort(function(a,b){return (a.resource==='wood'?0:1)-(b.resource==='wood'?0:1);});
    return ObjectiveStack.dispatchPlan(state.frogs||[],jobs,state.harvest||{},function(id){return Harvest.isBusy(id);});
  }
                                                                              
                                                                           
                                                                               
                                                                          
                                                                       
  function equipmentDispatchDone(){
    if(state.ftueL4DispatchTaught) return true;
    if(typeof Harvest==='undefined') return false;
    var plan=equipmentDispatchPlan();
    var done=plan.some(function(p){return p.ids.length;}) && plan.every(function(p){return p.ids.every(function(id){return Harvest.isBusy(id);});});
    if(done) state.ftueL4DispatchTaught=true;
    return done;
  }
  function harvestPointerTarget(){
    if(!harvestIntroRead()) return null;
    if(typeof activeSheet==='undefined' || activeSheet!=='harvesting'){
      if(!equipmentPondSettled()) return null;
      return document.querySelector('.dock-btn[onclick="openSheet(\'harvesting\')"]');
    }
                                                                       
                                                                         
                                                                        
                                                                           
                                                                       
                                                                     
                                                                      
    if(typeof Harvest==='undefined' || !(state.frogs||[]).some(function(f){return !Harvest.isBusy(f.id);}))
      return equipmentDispatchDone() ? dockBtnByLabel('Pond') : null;
    var plan=equipmentDispatchPlan();
    var ready=plan.filter(function(p){return p.ids.some(function(id){return !Harvest.isBusy(id);});});
    if(!ready.length) return equipmentDispatchDone() ? dockBtnByLabel('Pond') : null;
                                                                              
                                                                               
                                                                            
                                                                               
                                                                            
                                                                       
                                                            
    var short=harvestShortfall(), wantResource=(short.rock||0)>(short.mat||0) ? 'stone' : 'wood';
    var next=ready.filter(function(p){return p.job.resource===wantResource;})[0] || ready[0];
    if(!next) return equipmentDispatchDone() ? dockBtnByLabel('Pond') : null;
    var job=next.job, id=next.ids.filter(function(id){return !Harvest.isBusy(id);})[0];
    var pick=Array.from(document.querySelectorAll('.harvest-pick-row[onclick]')).filter(function(el){
      return el.getAttribute('onclick')==="Harvest.pickFrog('"+job.job_id+"','"+id+"')";
    })[0];
    if(pick){
      var r=pick.getBoundingClientRect && pick.getBoundingClientRect();
      if(r && (r.top<120 || r.bottom>innerHeight-96)) pick.scrollIntoView({block:'center',inline:'nearest'});
      return pick;
    }
    if(document.querySelector('.harvest-crew')) return document.querySelector('.harvest-back');
    return Array.from(document.querySelectorAll('.harvest-row')).filter(function(el){return el.getAttribute('onclick')==="Harvest.openJobCrew('"+job.job_id+"')";})[0] || null;
  }

                                                                                              
                                                                           
                                                                              
                                                                     
  var LOOP4_PLAN = [
    {row:'4.a', phase:'expedition', get banner(){return text("text_l4_expedition3", "Clear Expedition 3");}, note:'ordinary combat; losses leave this objective active; the win pays a Weapon and a Shield Blueprint'},
    {row:'4.b', phase:'equipment_preview', get banner(){return text("text_l4_craft_preview", "Craft equipment");}, note:'frog → its Weapon slot → the blueprint tile opens the Workshop: the actual first weapon price'},
    {row:'4.c', phase:'craft', get banner(){return text("text_l4_craft", "Finish making Equipment");}, hook:'craftWeaponChassis', note:'craft from the earned Weapon Blueprint, then equip'},
    {row:'4.c2',phase:'shield', get banner(){return text("text_l4_shield", "Equip a shield");}, note:'the sword\'s frog → its Shield slot → the Bark Round freed from Expedition 3\'s web (else craft the first shield) → equip it; done once a frog wears both'},
    {row:'4.d', phase:'auto_harvest',get banner(){return text("text_l4_dispatch", "Dispatch frogs to harvest");},hook:'harvestAuto', note:'mandatory automatic wood lesson before the first weapon; later short crafts reuse the dispatch detour'},
    {row:'4.d2',phase:'harvest_resources',get banner(){return text("text_l4_harvest", "Harvest for equipment crafting");},note:'real automatic payouts cover the piece\'s wood/stone, then back to its step'},
    {row:'4.e', phase:'next_expedition', get banner(){return text("text_l4_expedition4", "Clear Expedition 4");}, note:'only once a frog wears a weapon and a shield; real clear hands off to flower guidance'}
  ];
                                                                               
                                                                             
                                                       
  function lessonPieceId(){
    if(['auto_harvest','harvest_resources'].indexOf(state.ftueL4Step)>=0){
      if(state.ftueL4HarvestItem) return state.ftueL4HarvestItem;
      if(state.ftueL4CraftPaid) return null;
    }
    return guidedPiece(state.ftueL4Step==='shield');
  }
                                                                                      
                                                   
  function guidedPiece(forShield){
    if(forShield) return state.ftueL4ShieldChosen || Equipment.lessonShieldItemId(state);
    return (state.ftueEquipmentCraft && state.ftueEquipmentCraft.chosen) || Equipment.lessonWeaponItemId(state);
  }
  function equipmentShortfall(){
    var id=lessonPieceId();
    return id ? Equipment.shortfall(state,Equipment.conversionCost(id,state)) : {};
  }
                                                                  
  function materialsShort(short){ return !!(short && (short.mat>0 || short.rock>0)); }
                                                                                 
                                                                              
                                                                               
                                                                                         
  function gearLessonStep(){
    if(typeof EquipmentCraft==='undefined' || typeof EquipmentCraft.pairDone!=='function') return 'next_expedition';
    if(EquipmentCraft.releaseOrphans && EquipmentCraft.releaseOrphans(state) && typeof queueSave==='function') queueSave();
    if(EquipmentCraft.pairDone(state) || !EquipmentCraft.shieldReachable(state) ||
      (EquipmentCraft.weaponReachable && !EquipmentCraft.weaponReachable(state))) return 'next_expedition';
    return 'shield';
  }
                                                                                         
  function harvestPieceMade(){
    if(state.ftueL4HarvestFor==='shield') return !!state.ftueL4ShieldPaid || (typeof EquipmentCraft!=='undefined' && !!EquipmentCraft.pairDone && EquipmentCraft.pairDone(state));
    return state.ftueL4HarvestFor==='weapon' && !!state.ftueL4CraftPaid;
  }
  function enterGearStep(step){
    state.ftueL4Step=step;
                                                                                                   
    if(step==='shield' && !state.ftueL4ShieldItem && typeof Equipment!=='undefined') state.ftueL4ShieldItem=Equipment.lessonShieldItemId(state);
  }
                                                             
  function harvestReturnStep(){
    if(state.ftueL4HarvestFor==='shield' || state.ftueL4CraftPaid) return gearLessonStep();
    return 'craft';
  }
                                                                             
                                                                              
                                                                             
  function beginEquipmentHarvest(itemId,fromSync){
    if(!state || !ftueUiActive() || state.ftueLoop!==4 || !['equipment_preview','craft','shield'].includes(state.ftueL4Step)) return false;
    var forShield=state.ftueL4Step==='shield';
    var lesson=guidedPiece(forShield);
    if(itemId && itemId!==lesson) return false;
    var short=Equipment.shortfall(state,Equipment.conversionCost(lesson,state));
    if(!materialsShort(short)) return false;
    if(!state.ftueL4CraftPaid && !state.ftueL4HarvestLesson){
      state.ftueL4HarvestLesson={goal:Number(ftueKnob('first_craft_harvest_stone')),stone:0,done:false};
    }
    if(!state.harvestingUnlocked && !harvestIntroRead()) state.ftueL4HarvestAwaitIntro=true;
    state.ftueL4ObjectiveStack=true;
    state.ftueL4HarvestFor=forShield?'shield':'weapon';
    state.ftueL4HarvestItem=lesson;
    state.ftueL4HarvestNeed={mat:short.mat||0,rock:short.rock||0};
    state.ftueL4HarvestProgress={need:{wood:short.mat||0,stone:Math.max(short.rock||0,firstHarvestRemaining())},income:{wood:0,stone:0}};
    delete state.ftueL4HarvestTransition;
    _craftPondReady=false;
    state.ftueL4HarvestPending=true;
                                                                      
    if(typeof queueSave==='function') queueSave();
    if(!fromSync && typeof render==='function') render();
    return true;
  }
  function enterLoop4(){
    if(!state || state.ftueLoop !== 3) return;
    state.ftueLoop = 4;
    state.ftueL4FlowVersion = 4;
    state.ftueL4Step = 'expedition';
    if(typeof closeSheet==='function') closeSheet();
    if(typeof queueSave === 'function') queueSave();
    if(typeof render === 'function') render();
  }
                                                                                
                        
  function finishEquipmentLesson(){
    enterGearStep(gearLessonStep());
    if(typeof closeSheet==='function') closeSheet();
    if(typeof queueSave==='function') queueSave();
  }
                                                                                 
                                                                                     
  function harvestIntroRead(){
    if(!window.FtueTooltips) return true;
    return !!(((state.ftueTooltips||{}).seen||{})['tooltip-harvest']);
  }
  function syncLoop4(){
                                                                           
                                                                                       
    if(!(state.ftueL4FlowVersion>=2)){
      state.ftueL4FlowVersion=2;
      if((state.expeditionsCleared||[]).indexOf(expeditionNode('expedition3'))<0) state.ftueL4Step='expedition';
      else state.ftueL4Step=typeof EquipmentCraft!=='undefined' && EquipmentCraft.complete(state)
        ? 'next_expedition':'equipment_preview';
      if(typeof queueSave==='function') queueSave();
    }
                                                                          
                                                                              
    if(state.ftueL4FlowVersion===2){
      state.ftueL4FlowVersion=3;
      if(['auto_harvest','harvest_resources'].indexOf(state.ftueL4Step)>=0 && !state.ftueL4CraftPaid){
        state.ftueL4Step='equipment_preview';
        delete state.ftueL4FirstCraftCost;
      }
      if(typeof queueSave==='function') queueSave();
    }
                                                                          
                                                                             
                                                                                
                                                                              
                                                    
    if(state.ftueL4FlowVersion===3 && typeof EquipmentCraft!=='undefined'){                                       
      state.ftueL4FlowVersion=4;
      if(['auto_harvest','harvest_resources','next_expedition'].indexOf(state.ftueL4Step)>=0) state.harvestingUnlocked=true;
      if(state.ftueL4Step==='next_expedition' && state.ftueL4CraftPaid && gearLessonStep()==='shield') enterGearStep('shield');
      if(typeof queueSave==='function') queueSave();
    }
                                                                          
                                                                                     
    if(state.ftueL4Step==='manual_harvest') state.ftueL4Step=state.harvestDispatchDone?'harvest_resources':'auto_harvest';
    if(typeof Equipment!=='undefined' && Equipment.ensureFirstCraftCost) Equipment.ensureFirstCraftCost(state);
    if(typeof Equipment!=='undefined' && Equipment.ensureFirstShieldCost) Equipment.ensureFirstShieldCost(state);
                                                                             
                                                                
    if(state.ftueL4HarvestPending){
      if(!equipmentPondSettled()) return;
      delete state.ftueL4HarvestPending;
      state.ftueL4Step=equipmentDispatchDone()?'harvest_resources':'auto_harvest';
      state.harvestingUnlocked=true;
      state.ftueL4ObjectiveArrival=ObjectiveStack.transition(null,'interrupt');
                                                                           
                                                                             
                                                                              
                                                                             
                                                                          
                                                                          
                                                                            
                                                                           
                                                                             
                                                                            
                                                                           
                                  
      var arrivalMs=state.ftueL4ObjectiveArrival.duration;
      if(arrivalMs==null) arrivalMs=900;
      state.ftueL4ObjectiveArrival.readyAt=Date.now()+arrivalMs;
      if(typeof render==='function'){ setTimeout(render,arrivalMs); }
      if(typeof queueSave==='function') queueSave();
    }
    if(['equipment_preview','craft'].includes(state.ftueL4Step) && !state.ftueL4CraftPaid && !state.ftueL4CraftArrival){
      if(!equipmentPondSettled()) return;
      state.ftueL4CraftArrival=ObjectiveStack.transition(null,'enter');
      if(typeof PondPresentation!=='undefined') PondPresentation.resetTask();
      if(typeof queueSave==='function') queueSave();
      if(typeof render==='function'){setTimeout(render,0);setTimeout(render,state.ftueL4CraftArrival.duration);}
    }
    if(ObjectiveStack.transitioning(state.ftueL4CraftArrival) || ObjectiveStack.transitioning(state.ftueL4ObjectiveArrival)) return;
                                                                         
                                                                               
    if(harvestGuidanceActive() && !state.harvestingUnlocked){state.harvestingUnlocked=true;if(typeof queueSave==='function') queueSave();}
    if(harvestGuidanceActive() && !state.ftueL4HarvestProgress){
      var old=state.ftueL4HarvestLesson, n=state.ftueL4HarvestNeed||equipmentShortfall();
      if(old && old.done) old=null;
      state.ftueL4HarvestProgress={need:{wood:n.mat||0,stone:Math.max(n.rock||0,old?old.goal:0)},income:{wood:0,stone:old?old.stone||0:0}};
      if(typeof queueSave==='function') queueSave();
    }
    if(harvestGuidanceActive() && state.ftueL4HarvestTransition){
      if(ObjectiveStack.transitioning(state.ftueL4HarvestTransition)) return;
      if(state.ftueL4HarvestLesson) state.ftueL4HarvestLesson.done=true;
      enterGearStep(state.ftueL4HarvestTransition.to||harvestReturnStep());
      if(typeof queueSave==='function') queueSave();
      return;
    }
    switch(state.ftueL4Step){
      case 'expedition':
        if((state.expeditionsCleared||[]).indexOf(expeditionNode('expedition3'))>=0){
          if(typeof EquipmentCraft!=='undefined' && EquipmentCraft.complete(state)) enterGearStep(gearLessonStep());
          else state.ftueL4Step='equipment_preview';
          if(typeof Equipment!=='undefined' && Equipment.ensureFirstCraftCost) Equipment.ensureFirstCraftCost(state);
          if(typeof queueSave==='function') queueSave();
        }
        break;
      case 'equipment_preview':
        if(typeof EquipmentCraft!=='undefined' && EquipmentCraft.complete(state)) finishEquipmentLesson();
        break;
      case 'shield':
                                                                                                        
                                                                                           
        if(typeof EquipmentCraft==='undefined') break;
        if(gearLessonStep()!=='shield'){ state.ftueL4Step='next_expedition'; if(typeof queueSave==='function') queueSave(); }
        break;
      case 'auto_harvest':
        if(!harvestIntroRead()) break;                                                                        
                                                                                            
                                                                                        
        if(!equipmentDispatchDone()) { harvestPointerTarget(); break; }
        tryHookStep('harvestAuto', 'ftueL4HarvestAttempted', function(){
          state.ftueL4Step='harvest_resources';
        }, {
          promptField: 'ftueL4HarvestPrompted',
          poll: function(){
            return equipmentDispatchDone();
          }
        });
        break;
      case 'harvest_resources':
        var receipt=state.ftueL4HarvestProgress;
        if(equipmentDispatchDone() && receipt && ((ObjectiveStack.progress(receipt.need,receipt.income).done &&
          !materialsShort(equipmentShortfall())) || (harvestPieceMade() && !firstHarvestRemaining())) && equipmentPondSettled()){
          state.ftueL4HarvestTransition=ObjectiveStack.transition();
          state.ftueL4HarvestTransition.to=harvestReturnStep();
          if(typeof queueSave==='function') queueSave();
          if(typeof setTimeout==='function') setTimeout(function(){if(typeof render==='function') render();},state.ftueL4HarvestTransition.duration);
        }
        break;
      case 'craft': {
        var frog=(state.frogs||[]).slice().sort(function(a,b){return (b.tier||0)-(a.tier||0);})[0];
        tryHookStep('craftWeaponChassis', 'ftueL4CraftAttempted', finishEquipmentLesson, {ctx:{frogId:frog&&frog.id}});
        break;
      }
      case 'next_expedition':
        if((state.expeditionsCleared||[]).indexOf(expeditionNode('expedition4'))>=0) enterLoop5();
        break;
    }
  }
  function renderLoop4Banner(){
    if(state.ftueL4HarvestPending) return '';
                                                                           
                                                                                
    if(state.ftueL4ObjectiveStack && (harvestGuidanceActive() || (state.ftueL4HarvestTransition && state.ftueL4Step===state.ftueL4HarvestTransition.to))){
      var receipt=state.ftueL4HarvestProgress||{need:{stone:firstHarvestRemaining()},income:{}};
      var progress=ObjectiveStack.progress(receipt.need,receipt.income);
      var nextPhase=state.ftueL4HarvestTransition?state.ftueL4HarvestTransition.to:harvestReturnStep();
      var nextText=nextPhase==='shield'?text('text_l4_shield','Equip a shield')
        :nextPhase==='next_expedition'?text('text_l4_expedition4','Clear Expedition 4')
        :text('text_l4_craft_preview','Craft equipment');
      return ObjectiveStack.render([
        {text:state.ftueL4HarvestLesson && !receipt.need.wood?firstHarvestTitle():text('text_l4_harvest','Harvest for equipment crafting'),have:progress.have,need:progress.need},
        {text:nextText,have:0,need:1}
      ],state.ftueL4HarvestTransition?1:0,'l4-equipment',state.ftueL4HarvestTransition||state.ftueL4ObjectiveArrival);
    }
    if(['equipment_preview','craft'].includes(state.ftueL4Step) && !state.ftueL4CraftPaid){
      if(!state.ftueL4CraftArrival) return '';
      return ObjectiveStack.render([{text:text('text_l4_craft_preview','Craft equipment'),have:0,need:1}],0,'l4-craft',state.ftueL4CraftArrival);
    }
    switch(state.ftueL4Step){
      case 'expedition': return textPlate(text("text_l4_expedition3", "Clear Expedition 3"),0,1,false,false,null);
      case 'equipment_preview': return textPlate(text("text_l4_craft_preview", "Craft equipment"),0,1,false,false,null);
      case 'shield': return textPlate(text("text_l4_shield", "Equip a shield"),0,1,false,false,null);
      case 'auto_harvest': return textPlate(text("text_l4_dispatch", "Dispatch frogs to harvest"),0,1,false,false,null);
      case 'harvest_resources': {
        if(firstHarvestRemaining()>0){ var lesson=state.ftueL4HarvestLesson; return textPlate(firstHarvestTitle(),Math.min(lesson.stone,lesson.goal),lesson.goal,false,false,null); }
        var id=lessonPieceId(); if(!id) return '';
        var cost=Equipment.conversionCost(id,state), have=0, need=0;
        ['mat','rock'].forEach(function(k){ if(cost[k]){ have+=Math.min(state[k]||0,cost[k]); need+=cost[k]; } });
        return textPlate(text("text_l4_harvest", "Harvest for equipment crafting"),have,need,false,false,null);
      }
      case 'craft': return textPlate(text("text_l4_craft", "Finish making Equipment"),0,1,false,false,null);
      case 'next_expedition': return textPlate(text("text_l4_expedition4", "Clear Expedition 4"),0,1,false,false,null);
      default: return '';
    }
  }

                                                                        
                                                                       
                                                                                             
                                                                                                
                                                                                          
                                                                                               
                                                                                                
                                                                                              
                                                                                              
                                                                                             
                                                                                                
                                                                                               
                   
  var LOOP5_PLAN = [
    {row:'5.0', phase:'expedition', banner:'Clear Expedition 5', hook:'expeditionLaunch', note:'a real fight — losing it on the Monarch opens "Power up with flowers!"; winning it continues normally'},
    {row:'5.1', phase:'plant', banner:'Plant a flower'},
    {row:'5.2', phase:'grow', banner:''},
    {row:'5.3', phase:'seat', banner:'Drag a frog onto a flower'},
    {row:'5.4', phase:'charge', banner:'Keep frog seated for flower buffs'},
    {row:'5.5', phase:'inspect', banner:'Tap your frog to see its flower buffs'},
    {row:'5.6', phase:'inspect_focus', banner:''},
    {row:'5.7', phase:'expedition', banner:'Clear Expedition 5', hook:'expeditionLaunch', note:'the retry, a real fight; the hand picks the buffed frog first'},
    {row:'5.8', phase:'return_pond', get banner(){return text("text_return_pond", "Return to your pond");}, note:'the hand on the Pond button; the Shop unlocks only on the pond'},
    {row:'5.9', phase:'shop', get banner(){return text("text_l5_shop", "Visit the Shop");}, note:'Shop unlocked! card, then the Shop tour; its last card ends the FTUE'}
  ];
                                                                                        
                                                                                    
                                                                                       
                                                                                       
                                                                                          
                                                                                       
                                                                                         
                                                   
  var FLOWERS_PAUSED = true;
  function flowersPaused(){ return FLOWERS_PAUSED && ftueUiActive(); }
                                                                     
  function exp5Lost(){ return (state.claimedExpeditionRewards||[]).indexOf('5:loss')>=0; }
                                                                                          
                                                                                            
                                                                                           
                                                               
  function exp5LossDue(){
    return state.ftueLoop===5 && !flowersPaused() && !exp5Lost() && !state.ftueFlowerLesson &&
      (state.expeditionsCleared||[]).indexOf(expeditionNode('expedition5'))<0;
  }
                                                                             
  function loop5BuffedFrog(){
    if(state.ftueLoop!==5 || state.ftueL5Step!=='expedition' || !state.ftueFlowerInspectDone || !state.ftueFlowerLesson) return null;
    var id=state.ftueFlowerLesson.frogId;
    return (state.frogs||[]).some(function(f){ return f.id===id; }) ? id : null;
  }

  function enterLoop5(){
    if(!state || state.ftueLoop !== 4) return;
    state.ftueLoop = 5;
    state.ftueL5Step = (state.builtEggPads||0)>0 ? 'grow_roster' : 'hatch_pad';
    if(typeof queueSave === 'function') queueSave();
    if(typeof render === 'function') render();
  }
                                                                                 
  function growthObjective(){
    return {text:text('text_l5_grow_roster','Hatch and merge a stronger party'),have:FtueTadflow.mass(state),need:FtueTadflow.target(state)};
  }
  function padObjective(){ return {text:text('text_l3_hatchpad_build','Build a hatching pad to hatch more frogs'),have:0,need:1}; }
  function expandObjective(){ return {text:text('text_l3_expand','Expand your pond'),have:0,need:1}; }
                                                                          
                                                                             
                                                                              
                                                                            
                                                                             
                                                                             
                                                                           
                                                                              
                                                                              
                                  
                                                                              
                                                                          
                                                                     
                                                                             
                                                                            
                          
  var PAD_ARRIVAL_MIN_VISIBLE_MS=900;
  function padArrivalReady(){
    var a=state.ftueL5PadArrival;
    return !!(a && Date.now()>=a.readyAt);
  }
  function promoteLoop5Build(steps){
    state.ftueL5BuildTransition=Object.assign(ObjectiveStack.transition(),{steps:steps});
    if(typeof queueSave==='function') queueSave();
    if(typeof setTimeout==='function') setTimeout(function(){ if(typeof render==='function') render(); },state.ftueL5BuildTransition.duration);
  }
  function syncLoop5Build(){
    var t=state.ftueL5BuildTransition;
    if(t){
      if(ObjectiveStack.transitioning(t)) return true;
      delete state.ftueL5BuildTransition;
    }
    if(state.ftueL5Step==='hatch_pad'){
                                                                             
                                                                              
                                                                            
                                                                          
                                                                            
                                                                          
                                                                            
              
      if(!state.ftueL5PadArrival){
        if(!equipmentPondSettled()) return true;
        state.ftueL5PadArrival=ObjectiveStack.transition(null,'enter');
        state.ftueL5PadArrival.readyAt=Date.now()+PAD_ARRIVAL_MIN_VISIBLE_MS;
        if(typeof PondPresentation!=='undefined') PondPresentation.resetTask();
        if(typeof queueSave==='function') queueSave();
        if(typeof render==='function'){ setTimeout(render,0); setTimeout(render,PAD_ARRIVAL_MIN_VISIBLE_MS); }
        return true;
      }
      if(!padArrivalReady()) return true;
      if(!(state.builtEggPads>0)) return true;
                                                                               
                                                                          
                                                                            
                                                                        
                                          
      if(state.ftueL5PadPopPending) return true;
      delete state.ftueL5PadArrival;
      state.ftueL5Step='grow_roster';
      var steps=[padObjective()];
      if(state.ftueCapExpand) steps.push(expandObjective());
      steps.push(growthObjective());
      promoteLoop5Build(steps);
      return true;
    }
    if(state.ftueCapExpand){
      if((state.pondTier||0)<ftueKnob('pond_expansion_target_tier')) return true;
      delete state.ftueCapExpand;
      state.ftueCapExpansionDone=true;
      promoteLoop5Build([expandObjective(),growthObjective()]);
      return true;
    }
    return false;
  }
  function renderLoop5BuildBanner(){
    var t=state.ftueL5BuildTransition;
    if(t && ObjectiveStack.transitioning(t)) return ObjectiveStack.render(t.steps,1,'loop5-build',t);
    if(hatchPadGuidanceActive()){
      if(!state.ftueL5PadArrival) return '';                                                     
      return ObjectiveStack.render([padObjective(),state.ftueCapExpand?expandObjective():growthObjective()],0,'loop5-build',state.ftueL5PadArrival);
    }
    if(pondExpandGuidanceActive()) return ObjectiveStack.render([expandObjective(),growthObjective()],0,'loop5-build');
    return '';
  }
                                                                                  
  function migrateBuildLessons(){
    if(state.ftueBuildFlowVersion===1) return;
    ['ftueGoalUpgrades','ftueHatchPadStep','ftueHatchPadGoal','ftueHatchPadTransition','ftueHatchPadTaught',
     'ftueCapExpandFree','ftueManualHarvestClear'].forEach(function(k){ delete state[k]; });
    if(state.ftueCapExpand){
      if((state.expeditionsCleared||[]).indexOf(expeditionNode('expedition4'))<0) delete state.ftueCapExpand;
      else state.ftueCapExpand={step:'pond_expand'};
    }
    if(state.ftueLoop===5 && state.ftueL5Step==='grow_roster' && !(state.builtEggPads>0)) state.ftueL5Step='hatch_pad';
    state.ftueBuildFlowVersion=1;
    if(typeof queueSave==='function') queueSave();
  }
  function flowersEnabled(){ return Number(ftueKnob('ftue_flowers_enabled'))!==0; }
  function syncLoop5(){
    if(syncLoop5Build()) return;
                                                                                
    if(!flowersEnabled() && ['plant','grow','seat','charge','inspect','inspect_focus'].includes(state.ftueL5Step)) state.ftueL5Step='expedition';
    if(state.ftueL5Step==='grow_roster'){
      if(FtueTadflow.ready(state,'loop5'))state.ftueL5Step='expedition';
      else return;
    }
    if(state.ftueL5Step==='shop'){ if(shopTourDone()) enterFtueDone(); return; }
                                                                                              
    if(state.ftueL5Step==='return_pond'){ if(loop5PondShown()) enterShop(); return; }
    if(flowersEnabled() && typeof FlowerTutorial!=='undefined') FlowerTutorial.sync();
    if(state.ftueL5Step==='expedition' && (state.expeditionsCleared||[]).indexOf(expeditionNode('expedition5'))>=0){
      state.ftueL5Step = 'return_pond';
      if(typeof queueSave === 'function') queueSave();
    }
  }
                                                                                  
                                                                                     
  function loop5PondShown(){
    return typeof activeSheet!=='undefined' && !activeSheet && !(typeof claimInFlight==='function' && claimInFlight()) &&
      !(typeof document!=='undefined' && document.querySelector('#claim-modal,.cl-overlay,.xm-fullscreen,.xps-stage,.gp-page'));
  }
                                                                            
                                                                             
                                  
  function enterShop(){
    state.ftueL5Step = 'shop';
    state.shopUnlocked = true;
    if(typeof queueSave === 'function') queueSave();
  }
  function shopStepActive(){ return ftueUiActive() && state.ftueLoop===5 && state.ftueL5Step==='shop'; }
                                                                             
  function shopTourDone(){
    var r=state.ftueTooltips;
    return !!(r && r.seen && r.seen['tooltip-shop-packs']);
  }
  function renderLoop5Banner(){
    var build=renderLoop5BuildBanner(); if(build) return build;
                                                                            
                                                                             
                                                                         
    if(hatchPadGuidanceActive()) return '';
    if(state.ftueL5Step==='grow_roster')return textPlate(text("text_l5_grow_roster", "Hatch and merge a stronger party"),FtueTadflow.mass(state),FtueTadflow.target(state),false,false,null,'grow-roster');
    if(state.ftueL5Step==='shop') return typeof activeSheet!=='undefined' && activeSheet==='shop' ? '' : textPlate(text("text_l5_shop", "Visit the Shop"),0,1,false,false,null,'shop');
    if(state.ftueL5Step==='return_pond') return textPlate(text("text_return_pond", "Return to your pond"),0,1,false,false,null,'loop5-return-pond');
    const label=FlowerTutorial.label();
    if(!label){ if(typeof PondPresentation!=='undefined') PondPresentation.resetTask(); return ''; }
    const html=textPlate(label,state.ftueL5Step==='charge' ? FlowerTutorial.progress() : 0,1,false,false,null,'flower-'+state.ftueL5Step);
    return state.ftueL5Step==='charge' ? html.replace(/<span class="tp-count">.*?<\/span>/,'') : html;
  }

                                                                                               
                                                                                                   
                        
  function enterFtueDone(){
    state.ftueDone = true;
    if(typeof queueSave === 'function') queueSave();
    if(typeof render === 'function') render();
  }

                                                                                                
  function sync(){
    if(window.FtueTooltips && FtueTooltips.paused()) return;
    if(!ftueUiActive()) return;
    if(window.FamilyGoalReturn && FamilyGoalReturn.sync()) return;
    if(familyClaimReturnDue()){
      if(typeof activeSheet!=='undefined' && activeSheet) return;
      delete state.ftueFamilyClaimReturn;
      if(typeof queueSave==='function') queueSave();
    }
    migrateBuildLessons();
    syncHatchObjective();
    switch(state.ftueLoop){
      case 1: syncLoop1(); break;
      case 2: syncLoop2(); break;
      case 3: syncLoop3(); break;
      case 4: syncLoop4(); break;
      case 5: syncLoop5(); break;
    }
    syncFamilyGoal();
  }

  var _bannerStep=null, _familyGoalShown=false;
  function loopStepKey(){ return state.ftueLoop+':'+(state['ftueL'+state.ftueLoop+'Step']||''); }
  function renderBanner(){
    if((window.FtueTooltips && FtueTooltips.paused() && !(FtueTooltips.bannerSpotlit && FtueTooltips.bannerSpotlit())) || !ftueUiActive() || typeof taskPlateHTML !== 'function') return '';
    if(window.FamilyGoalReturn && FamilyGoalReturn.active()) return FamilyGoalReturn.banner(renderLoop4Banner);
    if(window.FamilyGoalReturn && FamilyGoalReturn.awaitingClaim()) return renderFamilyGoalBanner();
    if(familyClaimReturnDue()) return textPlate(text('text_return_pond', 'Return to your pond'),0,1,false,false,null);
                                                                          
                                                                           
                                                                          
                                                                        
                                                                          
                                                                            
                                                                              
    if(window.FtueTooltips && FtueTooltips.lockObjectiveActive()) return FtueTooltips.lockObjectiveBannerHTML();
    if(familyGoalActive()){                                         
                                                                           
                                                                           
      if(!_familyGoalShown && _bannerStep===loopStepKey() && typeof PondPresentation!=='undefined') PondPresentation.resetTask();
      _familyGoalShown=true;
      return renderFamilyGoalBanner();
    }
    _familyGoalShown=false; _bannerStep=loopStepKey();
    switch(state.ftueLoop){
      case 1: return loop1BannerActive() ? renderLoop1Banner() : '';
      case 2: return renderLoop2Banner();
      case 3: return renderLoop3Banner();
      case 4: return renderLoop4Banner();
      case 5: return renderLoop5Banner();
      default: return '';
    }
  }

  function pondExpandGuidanceActive(){
    return !!(state && state.ftueCapExpand && ftueUiActive() && state.ftueLoop===5 && state.ftueL5Step!=='hatch_pad' &&
      !ObjectiveStack.transitioning(state.ftueL5BuildTransition));
  }
  function expansionGuidanceActive(){ return pondExpandGuidanceActive(); }
  function guidedExpeditionNo(){
    if(!ftueUiActive()) return null;
    if(loop1BannerActive() && state.ftueL1Step==='launch') return expeditionStep('launch','expedition_no');
    if(state.ftueLoop===2 && !state.ftueL2RetryHandedOff &&
      (state.ftueL2Step==='attempt2' || (state.ftueL2Step==='reattempt' && !rematchPending()))) return expeditionStep(state.ftueL2Step,'expedition_no');
    if(state.ftueLoop===4 && state.ftueL4Step==='expedition') return expeditionStep('expedition3','expedition_no');
    if(state.ftueLoop===4 && state.ftueL4Step==='next_expedition') return expeditionStep('expedition4','expedition_no');
    if(state.ftueLoop===5 && state.ftueL5Step==='expedition') return expeditionStep('expedition5','expedition_no');
    return null;
  }
                                                                         
                                                                      
                                                                           
                                                                           
                                                                        
                                                                          
                                      
  function pondReturnDue(){
    if(!ftueUiActive() || guidedExpeditionNo()!=null) return false;
    if(familyGoalActive()) return true;                                   
    switch(state.ftueLoop){
      case 2: return ['return_pond','grow2x4','retry_population'].indexOf(state.ftueL2Step)>=0;
      case 3: return true;                                                                         
      case 4: return true;                                                  
      case 5: {
        var seen=(state.ftueTooltips||{}).seen||{};
        var boostCard=flowersEnabled() && (state.claimedExpeditionRewards||[]).indexOf('5:loss')>=0 && !state.ftueFlowerLesson && !seen['tooltip-flower-boost'];
        return state.ftueL5Step!=='shop' && !boostCard;
      }
    }
    return false;
  }
  function expeditionPointerTarget(no){
    if(typeof q1!=='function') return null;
    if(typeof activeSheet==='undefined' || activeSheet!=='expeditions') return dockBtnByLabel('Expeditions');
    if(expeditionView==='map'){
      var zone=EMap.zoneOfNode(no);
      return Array.from(document.querySelectorAll('[data-zone]')).find(function(el){ return el.dataset.zone===zone; }) || null;
    }
    if(expeditionView==='ladder'){
      if(expeditionZoneSel!==EMap.zoneOfNode(no)) return q1('.xm-fs-back');
      if(expeditionCardNo===no) return q1('.xm-card-play:not([disabled])');
      if(expeditionCardNo!=null) return q1('.xm-fs-back');                                                          
      return q1('[data-expedition-no="'+no+'"]');
    }
    if(expeditionView==='detail'){
      if(typeof expeditionSelNo!=='undefined' && expeditionSelNo!==no) return q1('.xps-back');
                                                                            
                                                                   
      if(loop2RetryPartyActive()){
        var bunny=loop2Party()[0];
        if(bunny && expeditionParty.indexOf(bunny)<0)
          return q1('.xp-row[onclick*="'+bunny+'"]');
        if((typeof expeditionParty==='undefined'?0:expeditionParty.length)<loop2Party().length+retryCompanions())
          return q1('.xp-row:not(.is-picked):not(.is-busy):not(.is-full)');
        return q1('.xp-send:not(.off)');
      }
                                                                          
      var buffed=loop5BuffedFrog();
      if(buffed && typeof expeditionParty!=='undefined' && expeditionParty.indexOf(buffed)<0){
        var buffedRow=q1('.xp-row[onclick*="'+buffed+'"]:not(.is-busy):not(.is-full)');
        if(buffedRow) return buffedRow;
      }
      var unpicked=q1('.xp-row:not(.is-picked):not(.is-busy):not(.is-full)');
      return unpicked || q1('.xp-send:not(.off)');
    }
    return null;
  }
  var _craftPondReady=false,_craftPondPending=false;
  function equipmentPondSettled(){
                                                                         
                                                                        
    var covered=document.querySelector('.sheet-scrim,.hv-page,.xm-fullscreen,.xps-stage,.gp-page,#labor-window,.ec-pop,.eq-reveal-overlay,#ftue-tooltip,#family-spotlight,#pond-flag-prompt,.big-unlock');
    if(!loop5PondShown() || covered){_craftPondReady=false;return false;}
    if(typeof requestAnimationFrame!=='function') return true;
    if(!_craftPondReady && !_craftPondPending){
      _craftPondPending=true;
      requestAnimationFrame(function(){requestAnimationFrame(function(){
        _craftPondPending=false;
        if(loop5PondShown() && !document.querySelector('.sheet-scrim,.hv-page,#labor-window,.ec-pop,.eq-reveal-overlay,#ftue-tooltip,#family-spotlight,#pond-flag-prompt,.big-unlock')) _craftPondReady=true;
                                                                                 
                                                                              
                                                                        
                                
        if((state.ftueLoop===4 || state.ftueLoop===5) && typeof render==='function') render();
        else if(typeof updateTutorialPointer==='function') updateTutorialPointer();
      });});
    }
    return _craftPondReady;
  }
  function craftPointerTarget(){
    if(typeof activeSheet!=='undefined' && activeSheet){
      _craftPondReady=false;
      return activeSheet==='harvesting'?null:EquipmentCraft.pointerTarget();
    }
    if(document.querySelector('#labor-window,.eq-reveal-overlay')) return EquipmentCraft.pointerTarget();
    return equipmentPondSettled()?EquipmentCraft.pointerTarget():null;
  }
  function pointerTarget(){
    if(window.FamilyGoalReturn && (FamilyGoalReturn.active() || FamilyGoalReturn.awaitingClaim())) return null;
    if(state.ftueLoop===4){
      if(state.ftueL4HarvestPending) return (typeof activeSheet!=='undefined' && activeSheet) || document.querySelector('#labor-window,.ec-pop,.sheet-scrim') ? dockBtnByLabel('Pond') : null;
      if(ObjectiveStack.transitioning(state.ftueL4CraftArrival) || ObjectiveStack.transitioning(state.ftueL4ObjectiveArrival)) return null;
      if(['equipment_preview','craft'].includes(state.ftueL4Step) && !state.ftueL4CraftPaid && !state.ftueL4CraftArrival) return null;
    }
    if(state.ftueLoop===4 && state.ftueL4HarvestTransition && ObjectiveStack.transitioning(state.ftueL4HarvestTransition)) return null;
    if(ObjectiveStack.transitioning(state.ftueL5BuildTransition)) return null;
    if(state.ftueL5PadArrival && !padArrivalReady()) return null;
                                                                            
                                                                              
                                                                           
                                                                               
    if(state.ftueL5PadPopPending) return null;
    if(familyClaimReturnDue()) return dockBtnByLabel('Pond');
                                                                               
                                                                           
                                                                              
                                                                       
    if(hatchPadGuidanceActive()) return padArrivalReady() ? buildPointerTarget('.fp-uprow[data-upgrade="hatching-pad"] [onclick="buyEggPad()"], .fp-uprow[data-upgrade="hatching-pad"] .fp-uprow__act') : null;
    if(pondExpandGuidanceActive()) return pondExpandPointerTarget();
    if(state.ftueLoop===5 && state.ftueL5Step==='grow_roster') return typeof activeSheet!=='undefined' && activeSheet ? dockBtnByLabel('Pond') : null;
                                                                             
                                                                               
    if(familyGoalActive() && !state.ftueCapExpand) return null;                                                                 
                                                                            
    if(state.ftueLoop===5 && state.ftueL5Step==='shop') return typeof activeSheet!=='undefined' && activeSheet==='shop' ? null : dockBtnByLabel('Shop');
                                                                            
    if(state.ftueLoop===5 && state.ftueL5Step==='return_pond') return typeof activeSheet!=='undefined' && activeSheet ? dockBtnByLabel('Pond') : null;
    if(state.ftueLoop===5 && state.ftueL5Step!=='expedition' && typeof FlowerTutorial!=='undefined') return FlowerTutorial.pointerTarget();
    if(state.ftueLoop===4 && ['equipment_preview','craft','shield'].includes(state.ftueL4Step) && typeof EquipmentCraft!=='undefined') return craftPointerTarget();
    if(harvestGuidanceActive()) return harvestPointerTarget();
    var no=guidedExpeditionNo();
    if(no!=null) return expeditionPointerTarget(no);
    if(state.ftueLoop===2){
      if(state.ftueL2Step==='grow2x4') return null;
      if(state.ftueL2Step==='return_pond') return dockBtnByLabel('Pond');
      if(state.ftueL2Step==='codex'){
        if(activeSheet!=='grimoire') return dockBtnByLabel('Codex');
        return grimTab!=='families' ? q1('.gr-tab[onclick*="families"]') : q1('.fam-cta[onclick*="bunny"]');
      }
                                                                                  
                                                                                        
                                                                                        
                                                                                    
                                                          
      if(state.ftueL2Step==='retry_population') return null;
    }
    return loop1BannerActive() ? loop1PointerTarget() : null;
  }
  function updatePointer(p){
    if(window.FtueTooltips && FtueTooltips.paused()){ p.classList.remove('on','tap','grabbing'); if(typeof stopMergeDemo==='function')stopMergeDemo(); return true; }
    if(!ftueUiActive()) return false;
    var hide = function(){ p.classList.remove('on','tap','grabbing','send-target','craft-target'); if(typeof stopMergeDemo==='function') stopMergeDemo(); if(typeof placeCaption==='function') placeCaption(null); };
                                                                                  
                                                                                 
                                                                                  
                                                                                      
                                                                                        
                                                                                        
                                                                               
    if(!familyClaimReturnDue() && !state.ftueCapExpand && state.ftueLoop===2 && (state.ftueL2Step==='grow2x4' || state.ftueL2Step==='retry_population')){ hide(); return true; }
                                                                                       
                                                     
    if(!familyClaimReturnDue() && familyGoalActive() && !state.ftueCapExpand && !hatchPadGuidanceActive()){ hide(); return true; }
                                                                                                 
    var equipping=state.ftueLoop===4 && typeof EquipmentCraft!=='undefined' && EquipmentCraft.guiding && EquipmentCraft.guiding(state);
                                                                                  
                                                                         
    if((typeof evoShowcase !== 'undefined' && evoShowcase) || (typeof showcaseFrog !== 'undefined' && showcaseFrog) ||
      document.querySelector('#claim-modal,#family-spotlight,.big-unlock,.cl-overlay,#meadow-combat,.showcase-overlay'+(equipping?'':',#labor-window'))){ hide(); return true; }
    if(!state.ftueCapExpand && state.ftueLoop===5 && ['hatch_pad','grow_roster','expedition','return_pond','shop'].indexOf(state.ftueL5Step)<0 && typeof FlowerTutorial!=='undefined' && FlowerTutorial.updateDrag(p)) return true;
    if(!state.ftueCapExpand && !activeSheet && (hatchMergeGuidanceActive() || (state.ftueLoop===1 && state.ftueL1Step === 'merge1' && sameTierPair()))){                                        
      p.classList.remove('tap');
      if(typeof mergeDemoRAF !== 'undefined' && !mergeDemoRAF && typeof runMergeDemo === 'function') runMergeDemo();
      return true;
    }
    if(typeof stopMergeDemo === 'function') stopMergeDemo();
    p.classList.remove('grabbing');
    var el = pointerTarget();
                                                                                 
                                                                           
    var r = el && el.getBoundingClientRect();
    var scroller=el && el.closest('.xm-fullscreen,.xp-list,.sheet-body,.fp-upgrades__list,.fp-upgrades-content,.eq-reveal-card,.frog-inspect .fi-body');
    if(scroller && r){
      var sr=scroller.getBoundingClientRect();
      var dock=document.querySelector('.bottom-dock');
      var bottom=Math.min(sr.bottom, dock ? dock.getBoundingClientRect().top : innerHeight);
      var top=sr.top+(scroller.matches('.xm-fullscreen') && expeditionView==='ladder' ? 60 : 8);
      if(r.top<top || r.bottom>bottom){
        scroller.scrollTop+=r.top+r.height/2-(top+bottom)/2;
        r=el.getBoundingClientRect();
      }
    }
    if(!r || (r.width===0 && r.height===0) || (el.checkVisibility && !el.checkVisibility())){ hide(); return true; }
    var cxp = r.left+r.width/2, cyp = r.top+r.height/2;
    p.classList.add('on','tap');
                                                                              
                                                                          
    var aim=null;
    if(state.ftueLoop===5 && el.matches('.flower-pad.empty,.wander-frog')) aim=FlowerTutorial.exposed(el);
    GuidedHand.place(p, el, aim);
    if(aim){cxp=aim.x;cyp=aim.y;}
    if(typeof placeCaption === 'function') placeCaption(null, cxp, cyp);
    return true;
  }

  window.FtueSteps = {
    HOOK_NAMES: HOOK_NAMES,
    HOOKS: impl,
    callHook: callHook,
    registerHook: registerHook,
    startDriver: startDriver,
    expeditionStep: expeditionStep,
    resolveHook: resolveHook,
    LOOP0_STEPS: LOOP0_STEPS,
    LOOP1_PLAN: LOOP1_PLAN,
    LOOP2_PLAN: LOOP2_PLAN,
    LOOP3_PLAN: LOOP3_PLAN,
    LOOP4_PLAN: LOOP4_PLAN,
    LOOP5_PLAN: LOOP5_PLAN,
    cinematicActive: cinematicActive,
    cinematicTick: cinematicTick,
    loop0Phase: loop0Phase,
    syncLoop0Prompt: syncLoop0Prompt,
    LOOP0_PLAY: LOOP0_PLAY,
    pondExpandGuidanceActive: pondExpandGuidanceActive,
    expansionGuidanceActive: expansionGuidanceActive,
    CINEMATIC_PARAMS: CINEMATIC_PARAMS,
    enterLoop1: enterLoop1,
    enterLoop2: enterLoop2,
    enterLoop3: enterLoop3,
    enterLoop4: enterLoop4,
    enterLoop5: enterLoop5,
    shopStepActive: shopStepActive,
    exp5Lost: exp5Lost,
    exp5LossDue: exp5LossDue,
    FLOWERS_PAUSED: FLOWERS_PAUSED,
    flowersPaused: flowersPaused,
    skipIntro: skipIntro,
    loop1Active: ftueUiActive,                                                                               
    ftueUiActive: ftueUiActive,
    loop1BannerActive: loop1BannerActive,
    sync: sync,
    renderBanner: renderBanner,
    pointerTarget: pointerTarget,
    harvestGoalHTML:harvestGoalHTML,
    harvestGuidanceActive:harvestGuidanceActive,
    equipmentObjectiveReady:function(){
                                                                           
                                                                         
                                                                          
                                                                       
                                                                           
                                                                              
      var a=state.ftueL4ObjectiveArrival;
      return !state.ftueL4HarvestPending && !ObjectiveStack.transitioning(state.ftueL4CraftArrival) &&
        !ObjectiveStack.transitioning(a) && (!a || !a.readyAt || Date.now()>=a.readyAt) &&
        !ObjectiveStack.transitioning(state.ftueL4HarvestTransition);
    },
    equipmentPondSettled:equipmentPondSettled,
    onHarvestIncome:function(deltas){
      var receipt=state && state.ftueL4HarvestProgress;
                                                                           
                                                                         
      var earning=state && (state.harvestDispatchDone || state.ftueL4Step==='harvest_resources');
      if(receipt && harvestGuidanceActive() && earning && deltas){
        ['wood','stone'].forEach(function(k){receipt.income[k]=(receipt.income[k]||0)+Math.max(0,deltas[k]||0);});
      }
      var lesson=state && state.ftueL4HarvestLesson;
      if(lesson && !lesson.done && harvestGuidanceActive() && earning && deltas && deltas.stone>0) lesson.stone+=deltas.stone;
                                                                                        
                                                                                         
      if(!state || familyClaimReturnDue()) return;
      if(state.ftueLoop===4 && ['auto_harvest','harvest_resources'].indexOf(state.ftueL4Step)>=0){ syncLoop4(); if(typeof render==='function') render(); }
    },
    equipmentShortfall:equipmentShortfall,
    beginEquipmentHarvest:beginEquipmentHarvest,
    guidedExpeditionNo: guidedExpeditionNo,
    pondReturnDue: pondReturnDue,
    expeditionNode: expeditionNode,
    retryPopulationTarget: retryPopulationTarget,
    bunnyHatchBudget: bunnyHatchBudget,
    onPondOpened: onPondOpened,
    updatePointer: updatePointer,
    hatchMergeGuidanceActive:hatchMergeGuidanceActive,
    onExpeditionDispatch: onExpeditionDispatch,
    handOffToExpedition: handOffToExpedition,
    suggestedParty: suggestedParty,
    mergeOptions: mergeOptions,
    familyGoalActive: familyGoalActive,
    familyGoalStep: familyGoalStep,
    familyGoalFamily: familyGoalFamily,
    keepFamilyClaimOpen: keepFamilyClaimOpen,
    keepGrimoireOpen: keepGrimoireOpen,
    gearIntroduced: gearIntroduced,
    pondExpansionLocked: pondExpansionLocked,
    hatchPadGuidanceActive: hatchPadGuidanceActive,
    onFrogCapHatchBlocked: onFrogCapHatchBlocked,
    capExpansionActive: capExpansionActive,
    capExpansionDone: capExpansionDone,
    capExpansionEligible: capExpansionEligible,
    familyGoalLockPrice: familyGoalLockPrice,
    partyMergeAllowed: partyMergeAllowed,
    partySelectionActive: partySelectionActive,
    partyFrogAllowed: partyFrogAllowed,
    validTutorialParty: validTutorialParty,
    watchExpeditionClear: watchExpeditionClear
  };


  FPConfig.ready.then(startDriver).catch(function(error){console.error('[FtueSteps] driver config unavailable',error);});
})();
