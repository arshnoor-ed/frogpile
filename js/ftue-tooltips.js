                                                                        
(function(g){
  'use strict';
                                                                                             
  var defaults = {};
  function text(key, fallback, tokens){
    defaults[key] = fallback;
    if(typeof FPConfig !== 'undefined' && FPConfig.text) return FPConfig.text(key, fallback, tokens);
    return String(fallback).replace(/\{(\w+)\}/g, function(all, name){ return tokens && Object.prototype.hasOwnProperty.call(tokens,name) ? String(tokens[name]) : all; });
  }

                                                                               
                                                                           
                                                                          
                                                                       
                                                                          
  var registry = [
    {id:'tooltip-1', spot:true, name:'Tooltip 1', get title(){ return text("text_tooltip_1_title", "New trait, unlocked!"); }, get button(){ return text("text_tooltip_1_button", "Nice!"); }, traits:true, art:'assets/tooltips/tooltip-1.png', trigger:'player-merge-1', get caption(){ return text("text_tooltip_1_caption", "Every merge sprouts a brand-new trait. Freaky and stronger!"); }},
    {id:'tooltip-2', spot:true, name:'Tooltip 2', get title(){ return text("text_tooltip_2_title", "Traits stack up!"); }, get button(){ return text("text_tooltip_2_button", "Got it!"); }, traits:true, art:'assets/tooltips/tooltip-2.png', trigger:'first-two-trait-merge', get caption(){ return text("text_tooltip_2_caption", "Merge two trait-y frogs and the new one keeps both!"); }},
                                                                              
                                                                                    
    {id:'tooltip-3a', off:true, name:'Tooltip 3a', get title(){ return text("text_tooltip_3a_title", "Remember the Bunny Aura?"); }, get button(){ return text("text_tooltip_3a_button", "Got it!"); }, art:'assets/tooltips/tooltip-3a.png', trigger:'expedition-2-loss-pond', get caption(){ return text("text_tooltip_3a_caption", "It completes your Bunny family! Full family = Dodge in combat!"); }},
    {id:'tooltip-4a', spot:true, name:'Tooltip 4a', get title(){ return text("text_tooltip_4a_title", "Every merge is a roll!"); }, get button(){ return text("text_tooltip_4a_button", "Got it!"); }, art:'assets/tooltips/tooltip-4a.png', trigger:'first-new-family-trait', get caption(){ return text("text_tooltip_4a_caption", "Which trait sprouts is totally random. Every merge could be the rare one!"); }},
                                                                          
    {id:'tooltip-4b', spot:true, clash:true, name:'Tooltip 4b', get title(){ return text("text_tooltip_4b_title", "Same slot! One will disappear!"); }, get button(){ return text("text_tooltip_4b_button", "Lock it!"); }, art:'assets/tooltips/tooltip-4b.png', trigger:'first-same-slot-merge', get caption(){ return text("text_tooltip_4b_caption", "Locked traits always survive the merge."); }},
                                                                                  
    goalLockTip(),
                                                                            
                                                               
                                                                          
    lockSafetyTip(),
    {id:'tooltip-3b', spot:true, name:'Tooltip 3b', get title(){ return text("text_tooltip_3b_title", "Full family!"); }, get button(){ return text("text_tooltip_3b_button", "Got it!"); }, art:'assets/tooltips/tooltip-3b.png', trigger:'bunny-complete', get caption(){ return text("text_tooltip_3b_caption", "4 matching Bunny traits! Evolve your frog in the Grimoire!"); }},
                                                                               
                                                                           
    {id:'tooltip-exp', target:['.dock-btn[aria-label="Expeditions"]:not(.locked)','.hud-top .hud-pill.tad'], name:'Expedition call', get title(){ return text("text_tooltip_exp_title", "Out of tadpoles!"); }, get button(){ return text("text_tooltip_exp_button", "Let’s explore!"); }, art:'assets/tooltips/tooltip-exp.png', trigger:'first-empty-tadpole-plant-attempt', get caption(){ return text("text_tooltip_exp_caption", "Our pile is hungry to level up! Find new tadpoles on an expedition!"); }},
                                                                              
                                                                      
    {id:'tooltip-exp-unlock', target:'.dock-btn[aria-label="Expeditions"]', name:'Expedition unlocked', get title(){ return text("text_tooltip_exp_unlock_title", "Expedition unlocked!"); }, get button(){ return text("text_tooltip_exp_unlock_button", "Let’s go!"); }, art:'assets/tooltips/tooltip-exp-unlock.png', trigger:'loop1-launch', get caption(){ return text("text_tooltip_exp_unlock_caption", "Expedition unlocked!"); },
      get artHTML(){ return '<div class="ftt-yart ftt-unlock-art"><span class="ftt-yart-rays"></span><img class="ftt-unlock-lock" src="assets/ui2/kit/icons/ui-lock-open.png" alt="">'
        +'<img class="ftt-unlock-cave" src="assets/ui2/kit/icons/nav-expedition.png" alt=""><span class="ftt-unlock-plate">' + esc(text("text_art_expedition", "Expedition")) + '</span><span class="ftt-unlock-banner">' + esc(text("text_art_unlocked", "UNLOCKED!")) + '</span></div>'; }},
    {id:'tooltip-tadpoles', overReceipt:true, target:'#claim-modal .kit-reward-tile[data-reward="tadpoles"]', name:'New tadpoles', get title(){ return text("text_tooltip_tadpoles_title", "New tadpoles!"); }, get button(){ return text("text_tooltip_tadpoles_button", "Let’s conquer!"); }, art:'assets/tooltips/tooltip-tadpoles.png', trigger:'first-tadpole-reward-receipt', get caption(){ return text("text_tooltip_tadpoles_caption", "Later we can use them to hatch more frogs. For now, let’s conquer more territory!"); },
      get artHTML(){ return '<div class="ftt-yart ftt-later-art"><span class="ftt-yart-rays"></span>'
        +'<span class="ftt-later-col ftt-later-then"><img src="assets/ui2/currency/tadpoles.png" alt=""><span class="ftt-yart-tag">' + esc(text("text_art_later", "LATER")) + '</span></span><span class="ftt-yart-arrow"></span>'
        +'<span class="ftt-later-col ftt-later-now"><img src="assets/ui2/kit/icons/nav-expedition.png" alt=""><span class="ftt-yart-tag">' + esc(text("text_art_now", "NOW!")) + '</span></span>'
        +'<span class="ftt-yart-plate"><b>' + esc(text("text_art_later_use_them_to_hatch_more_frogs", "Later, use them to hatch more frogs!")) + '</b><em>' + esc(text("text_art_for_now_let_s_conquer_more_territory", "For now, let’s conquer more territory!")) + '</em></span></div>'; }},
                                                                              
                                                                      
                                                                           
                                                                              
                                                                             
                                                                              
                                                                   
    {id:'tooltip-grimoire', pond:true, target:'.bottom-dock .dock-btn[aria-label="Codex"]', name:'Grimoire unlocked', get title(){ return text("text_tooltip_grimoire_title", "Grimoire unlocked!"); }, get button(){ return text("text_tooltip_grimoire_button", "Let’s look!"); }, art:'assets/tooltips/tooltip-grimoire.png', trigger:'expedition-2-loss-pond-aura-waiting', get caption(){ return text("text_tooltip_grimoire_caption", "Every trait you find is kept in the Grimoire!"); },
      get artHTML(){ return '<div class="ftt-yart ftt-unlock-art"><span class="ftt-yart-rays"></span><img class="ftt-unlock-lock" src="assets/ui2/kit/icons/ui-lock-open.png" alt="">'
        +'<img class="ftt-unlock-cave" src="assets/ui2/kit/icons/nav-grimoire.png" alt=""><span class="ftt-unlock-plate">' + esc(text("text_art_grimoire", "Grimoire")) + '</span><span class="ftt-unlock-banner">' + esc(text("text_art_unlocked", "UNLOCKED!")) + '</span></div>'; }},
                                                                             
                                                                             
    {id:'tooltip-grimoire-slots', rect:true, radius:18, sheet:'grimoire', target:'.gp-page .gp-itabs--traits', name:'Grimoire slot pages', title:'A page for every slot!', button:'Show me!', art:'assets/tooltips/tooltip-grimoire-slots.png', trigger:'grimoire-unlocked-continue',
      caption:'Head, mouth, back and aura: every trait slot has its own page. Tap through them to see what you’ve found!',
      artHTML:'<div class="ftt-yart ftt-slots-art"><span class="ftt-yart-rays"></span><span class="ftt-slot-tabs">'
        +['head','mouth','back','aura'].map(function(sl,i){ return '<span class="ftt-slot-tab ftt-slot-tab--'+i+'"><img src="assets/ui2/grimoire/tab_'+sl+'.png" alt=""></span>'; }).join('')
        +'</span><span class="ftt-yart-plate"><b>Every slot has its own page!</b><em>Tap through them all</em></span></div>'},
    auraPoolTip(),
                                                                              
                                                                                
                                                                           
                                                                              
                                                                               
                                                                                      
    familyFoundTip(),
    familyUnlockedTip(),
                                                                            
    {id:'tooltip-hatch', pond:true, target:['.lilypad.egg-pad.empty','.lilypad.egg-pad','.hud-top .hud-pill.tad'], name:'Hatch again', get title(){ return text("text_tooltip_hatch_title", "Time to hatch!"); }, get button(){ return text("text_tooltip_hatch_button", "Let’s hatch!"); }, art:'assets/tooltips/tooltip-hatch.png', trigger:'expedition-2-loss-pond-tadpoles', get caption(){ return text("text_tooltip_hatch_caption", "You have new tadpoles! Start hatching again to grow more frogs."); },
      get artHTML(){ return '<div class="ftt-yart ftt-hatch-art"><span class="ftt-yart-rays"></span>'
        +'<span class="ftt-later-col ftt-later-then"><img src="assets/ui2/currency/tadpoles.png" alt=""><span class="ftt-yart-tag">' + esc(text("text_art_new", "NEW!")) + '</span></span><span class="ftt-yart-arrow"></span>'
        +'<span class="ftt-later-col ftt-later-now"><img class="ftt-hatch-pad" src="assets/lilypad/sludge_pad_base.png" alt=""><img class="ftt-hatch-egg" src="assets/frog2/tadpole/stage_0.png" alt=""><span class="ftt-yart-tag">' + esc(text("text_art_now", "NOW!")) + '</span></span>'
        +'<span class="ftt-yart-plate"><b>' + esc(text("text_art_you_have_new_tadpoles", "You have new tadpoles!")) + '</b><em>' + esc(text("text_art_start_hatching_again", "Start hatching again!")) + '</em></span></div>'; }},
                                                                                             
    {id:'tooltip-gear', pond:true, spot:true, name:'Equipment', get title(){ return text("text_tooltip_gear_title", "Let’s gear up to come back stronger!"); }, get button(){ return text("text_tooltip_gear_button", "Let’s craft!"); }, art:'assets/tooltips/tooltip-gear.png', trigger:'loop4-craft-equipment', get caption(){ return text("text_tooltip_gear_caption", "Craft your blueprint into a weapon! Equip it and your frog hits harder!"); }},
                                                                           
                                                                             
                                                                       
    gearBoostTip(),
    {id:'tooltip-mats', target:['.ec-harvest','.ec-detail + .ec-costs .ec-cost.short'], name:'Short on materials', get title(){ return text("text_tooltip_mats_title", "Need materials!"); }, get button(){ return text("text_tooltip_mats_button", "Let’s harvest!"); }, art:'assets/tooltips/tooltip-mats.png', trigger:'first-material-shortfall', get caption(){ return text("text_tooltip_mats_caption", "Not enough wood and stone! Send frogs to harvest more!"); }},
    {id:'tooltip-bones', target:'#labor-window .fi-trait-actions button:disabled', name:'Need bones', get title(){ return text("text_tooltip_bones_title", "Need bones!"); }, get button(){ return text("text_tooltip_bones_button", "Got it!"); }, art:'assets/tooltips/tooltip-bones.png', trigger:'lock-guide-short-of-bones', get caption(){ return text("text_tooltip_bones_caption", "Locking a trait costs bones! Sacrifice a spare frog to get some!"); }},
                                                                                
                                                                        
                                                                            
                                                                          
                                                                        
                                                              
    {id:'tooltip-pond-mats', pond:true, target:'.hud-top .hud-pill.pond', name:'Pond limit', get title(){ return text("text_tooltip_pond_mats_title", "Your pond is full!"); }, get button(){ return text("text_tooltip_pond_mats_button", "Let’s expand!"); }, art:'assets/tooltips/tooltip-pond-mats.png', trigger:'post-e4-frog-cap', get caption(){ return text("text_tooltip_pond_mats_caption", "Our frog army has filled the pond! Expand it to make room for more."); },
      get artHTML(){ return '<div class="ftt-yart ftt-pond-art"><span class="ftt-yart-rays"></span>'
        +'<span class="ftt-later-col ftt-later-then"><img src="assets/ui2/kit/navigation/pond-chip-frog.png" alt=""><span class="ftt-yart-tag">' + esc(text("text_art_pond_full", "FULL!")) + '</span></span><span class="ftt-yart-arrow"></span>'
        +'<span class="ftt-later-col ftt-later-now"><img src="assets/ui2/screens/upgrades/icon-pond.png" alt=""><span class="ftt-yart-tag">' + esc(text("text_art_bigger_pond", "BIGGER POND!")) + '</span></span>'
        +'<span class="ftt-yart-plate"><b>' + esc(text("text_art_our_frog_army_is_growing", "Our frog army has filled the pond!")) + '</b><em>' + esc(text("text_art_harvest_wood_amp_stone_to_grow_the_pond", "Expand it to make room for more!")) + '</em></span></div>'; }},
                                                                         
                                                       
                                                                           
                                                                          
                                                                      
                                                                      
    {id:'tooltip-upgrades', pond:true, target:'.objective-stack .tutorial-tip.task-plate.os-active', rect:true, name:'Upgrades unlocked', get title(){ return text("text_tooltip_upgrades_title", "Upgrades unlocked!"); }, get button(){ return text("text_tooltip_upgrades_button", "Let’s look!"); }, art:'assets/tooltips/tooltip-upgrades.png', trigger:'upgrades-dock-button-appears', get caption(){ return text("text_tooltip_upgrades_caption", "Grow your pond and craft gear! Spend wood and stone in Upgrades!"); }},
                                                                                     
    {id:'tooltip-pads', off:true, target:'.fp-uprow[data-upgrade="hatching-pad"]', name:'Hatching pads', get title(){ return text("text_tooltip_pads_title", "More hatching pads!"); }, get button(){ return text("text_tooltip_pads_button", "Got it!"); }, art:'assets/tooltips/tooltip-pads.png', trigger:'upgrades-first-open', get caption(){ return text("text_tooltip_pads_caption", "Build more hatching pads to hatch more tadpoles at once!"); },
      get artHTML(){ return '<div class="ftt-yart ftt-pads-art"><span class="ftt-yart-rays"></span>'
        +'<span class="ftt-later-col ftt-later-then"><img src="assets/ui2/screens/upgrades/icon-hatchery.png" alt=""><span class="ftt-yart-tag">' + esc(text("text_art_build", "BUILD")) + '</span></span><span class="ftt-yart-arrow"></span>'
        +'<span class="ftt-later-col ftt-later-now ftt-pads-trio">'
          +[2,0,1].map(function(i){ return '<img class="ftt-hatch-pad ftt-pad-'+i+'" src="assets/lilypad/sludge_pad_base.png" alt=""><img class="ftt-hatch-egg ftt-egg-'+i+'" src="assets/frog2/tadpole/stage_0.png" alt="">'; }).join('')
          +'<span class="ftt-yart-tag">' + esc(text("text_art_more_frogs", "MORE FROGS!")) + '</span></span>'
        +'<span class="ftt-yart-plate"><b>' + esc(text("text_art_build_more_hatching_pads", "Build more hatching pads!")) + '</b><em>' + esc(text("text_art_hatch_more_tadpoles_at_once", "Hatch more tadpoles at once!")) + '</em></span></div>'; }},
                                                                              
                                                                       
                                                                               
    {id:'tooltip-blueprint', overReceipt:true, target:['#claim-modal .kit-reward-tile[data-reward="weapon_blueprint"]','#claim-modal .kit-reward-tile[data-reward="shield_blueprint"]','#claim-modal .kit-reward-tile[data-reward="weapon_chassis"]','#claim-modal .kit-reward-tile[data-reward^="set:"]','#claim-modal .xr-newtrait--blueprint'], name:'New blueprint', get title(){ return text("text_tooltip_blueprint_title", "You’re on a roll!"); }, get button(){ return text("text_tooltip_blueprint_button", "Nice!"); }, art:'assets/tooltips/tooltip-blueprint.png', trigger:'first-blueprint-reward-receipt', get caption(){ return text("text_tooltip_blueprint_caption", "Equip gear to hit even harder! Blueprints craft new gear!"); },
      get artHTML(){ return blueprintArtHTML(); }},
                                                                              
                                                                            
                                                                  
    {id:'tooltip-seeds', overReceipt:true, target:['#claim-modal .kit-reward-tile[data-reward="lily_seed"]','#claim-modal .kit-reward-tile[data-reward="seeds"]'], name:'First seeds', get title(){ return text("text_tooltip_seeds_title", "Pink Lily seeds!"); }, get button(){ return text("text_tooltip_seeds_button", "Nice!"); }, art:'assets/tooltips/tooltip-seeds.png', trigger:'first-seed-reward-receipt', get caption(){ return text("text_tooltip_seeds_caption", "Seeds grow flowers! Flowers power up your frogs!"); },
      get artHTML(){ return '<div class="ftt-yart ftt-seeds-art"><span class="ftt-yart-rays"></span>'
        +'<span class="ftt-later-col ftt-later-then"><img src="assets/ui2/currency/seed.png" alt=""><span class="ftt-yart-tag">' + esc(text("text_art_seeds", "SEEDS")) + '</span></span><span class="ftt-yart-arrow"></span>'
        +'<span class="ftt-later-col ftt-later-now"><img src="assets/flowers/flower-picker/pink-open.webp" alt=""><span class="ftt-yart-tag">' + esc(text("text_art_pink_lily", "PINK LILY!")) + '</span></span>'
        +'<span class="ftt-yart-plate"><b>' + esc(text("text_art_seeds_grow_flowers", "Seeds grow flowers!")) + '</b><em>' + esc(text("text_art_flowers_power_up_your_frogs", "Flowers power up your frogs!")) + '</em></span></div>'; }},
                                                                        
                                                                              
                                                                            
                                                                           
                                                                 
                                                                   
                                                                               
                                                                              
                                                                           
                               
    {id:'tooltip-flower-boost', name:'Power up with flowers', get title(){ return text("text_tooltip_flower_boost_title", "Power up with flowers!"); }, get button(){ return text("text_tooltip_flower_boost_button", "Back to the pond!"); }, art:'assets/tooltips/tooltip-flower-boost.png', trigger:'loop5-exp5-scripted-loss', get caption(){ return text("text_tooltip_flower_boost_caption", "That boss is too tough! Plant your Pink Lily seeds, seat a frog on the flower and take its buffs into the fight!"); },
      get artHTML(){ return '<div class="ftt-yart ftt-boost-art"><span class="ftt-yart-rays"></span>'
        +'<span class="ftt-later-col ftt-later-then"><img src="assets/expeditions/creatures/autumngrove_boss_monarch/idle.png" alt=""><span class="ftt-yart-tag">' + esc(text("text_art_too_tough", "TOO TOUGH!")) + '</span></span><span class="ftt-yart-arrow"></span>'
        +'<span class="ftt-later-col ftt-later-now"><img src="assets/flowers/flower-picker/pink-open.webp" alt=""><span class="ftt-yart-tag">' + esc(text("text_art_buffs", "BUFFS!")) + '</span></span>'
        +'<span class="ftt-yart-plate"><b>' + esc(text("text_art_plant_your_pink_lily_seeds", "Plant your Pink Lily seeds!")) + '</b><em>' + esc(text("text_art_take_flower_buffs_into_the_fight", "Take flower buffs into the fight!")) + '</em></span></div>'; }},
    {id:'tooltip-plant', pond:true, target:['.lilypad.flower-pad.empty','.flower-pad.empty'], name:'Plant a flower', get title(){ return text("text_tooltip_plant_title", "Plant your seeds!"); }, get button(){ return text("text_tooltip_plant_button", "Let’s plant!"); }, art:'assets/tooltips/tooltip-plant.png', trigger:'loop5-plant-on-pond', get caption(){ return text("text_tooltip_plant_caption", "Frogs sitting on flowers get stronger for expeditions! Plant a Pink Lily, then seat a frog on it!"); },
      get artHTML(){ return '<div class="ftt-yart ftt-plant-art"><span class="ftt-yart-rays"></span>'
        +'<span class="ftt-later-col ftt-later-then"><img src="assets/flowers/flower-picker/pink-open.webp" alt=""><span class="ftt-yart-tag">' + esc(text("text_art_plant", "PLANT")) + '</span></span><span class="ftt-yart-arrow"></span>'
        +'<span class="ftt-later-col ftt-later-now"><img class="ftt-plant-lily" src="assets/flowers/flower-picker/pink-open.webp" alt=""><span class="ftt-fitbox ftt-plant-frog"><img class="ftt-fit" src="assets/frog2/body/body_05.png" alt=""></span><span class="ftt-yart-tag">' + esc(text("text_art_stronger", "STRONGER!")) + '</span></span>'
        +'<span class="ftt-yart-plate"><b>' + esc(text("text_art_frogs_on_flowers_get_stronger", "Frogs on flowers get stronger!")) + '</b><em>' + esc(text("text_art_seat_one_there_before_expeditions", "Seat one there before expeditions!")) + '</em></span></div>'; }},
    {id:'tooltip-rematch', pond:true, spot:true, name:'Rematch', get title(){ return text("text_tooltip_rematch_title", "Payback time!"); }, get button(){ return text("text_tooltip_rematch_button", "Let’s go!"); }, art:'assets/tooltips/tooltip-rematch.png', trigger:'loop2-bunny-claimed', get caption(){ return text("text_tooltip_rematch_caption", "Our new special frog is ready! Let’s go beat this guy’s butt!"); }},
                                                                             
                                                                         
    autoTip(),
                                                                               
                                                                           
                                                                         
    ticketTip(2, 'Forest Spirit', ['sets/forestSpirit/head','sets/forestSpirit/back','sets/forestSpirit/mouth','sets/forestSpirit/aura']),
                                                                                                                 
    ticketTip(3, 'Sporekin', ['sets/mushroom/head','sets/mushroom/back','sets/mushroom/mouth','sets/mushroom/aura']),
                                                                           
                                                                              
    {id:'tooltip-shop', pond:'shop', target:'.bottom-dock .dock-btn[aria-label="Shop"]', name:'Shop unlocked', get title(){ return text("text_tooltip_shop_title", "Shop unlocked!"); }, get button(){ return text("text_tooltip_shop_button", "Let’s look!"); }, art:'assets/tooltips/tooltip-shop.png', trigger:'loop5-shop-step', get caption(){ return text("text_tooltip_shop_caption", "The Shop is open! Get Family Tickets, special frogs and frog packs!"); },
      get artHTML(){ return '<div class="ftt-yart ftt-unlock-art"><span class="ftt-yart-rays"></span><img class="ftt-unlock-lock" src="assets/ui2/kit/icons/ui-lock-open.png" alt="">'
        +'<img class="ftt-unlock-cave" src="assets/ui2/kit/icons/nav-shop.png" alt=""><span class="ftt-unlock-plate">' + esc(text("text_art_shop", "Shop")) + '</span><span class="ftt-unlock-banner">' + esc(text("text_art_unlocked", "UNLOCKED!")) + '</span></div>'; }},
                                                                          
                                                                         
                                                                        
                                                                          
                                                                       
                                                                          
                                                                    
                                                                         
    {id:'tooltip-shop-ticket', rect:true, sheet:'shop', target:'.fp-shop__card--ticket', name:'Shop: Family Tickets', get title(){ return text("text_tooltip_shop_ticket_title", "Family Tickets!"); }, get button(){ return text("text_tooltip_shop_ticket_button", "Nice!"); }, art:'assets/tooltips/tooltip-shop-ticket.png', trigger:'shop-tour-1', get caption(){ return text("text_tooltip_shop_ticket_caption", "Use one on an expedition’s trait drop to get a whole family’s traits{gear}!", {gear: ticketGear()?text('text_ticket_gear', ' and its gear'):''}); },
      get artHTML(){ return ticketArtHTML(['sets/pirate/head','sets/pirate/mouth','sets/pirate/back','sets/pirate/aura'],text("text_shop_ticket_art_title", "One ticket, a whole family!"),text("text_shop_ticket_art_subtitle", "Every trait{gear}", {gear: ticketGear()?text('text_ticket_art_gear', ' + its gear'):''})); }},
    {id:'tooltip-shop-mutant', rect:true, sheet:'shop', target:'.fp-shop__card--featured', name:'Shop: Mutant Frog', get title(){ return text("text_tooltip_shop_mutant_title", "Special families!"); }, get button(){ return text("text_tooltip_shop_mutant_button", "Cool!"); }, art:'assets/tooltips/tooltip-shop-mutant.png', trigger:'shop-tour-2', get caption(){ return text("text_tooltip_shop_mutant_caption", "Mutant frogs bring family traits you can’t find anywhere else!"); },
      get artHTML(){ return '<div class="ftt-yart ftt-mutant-art"><span class="ftt-yart-rays"></span>'
        +'<span class="ftt-later-col ftt-later-then"><span class="ftt-fitbox"><img class="ftt-fit" src="assets/frog2/body/family_catBurglar.png" alt=""></span><span class="ftt-yart-tag">' + esc(text("text_art_mutant", "MUTANT")) + '</span></span><span class="ftt-yart-arrow"></span>'
        +'<span class="ftt-later-col ftt-later-now"><span class="ftt-auto-set">'
          +['head/head_04','mouth/mouth_11','back/back_04','aura/aura_07/f0'].map(function(p){ return '<span><img class="ftt-fit" src="assets/frog2/'+p+'.png" alt=""></span>'; }).join('')
          +'</span><span class="ftt-yart-tag">' + esc(text("text_art_shop_only", "SHOP ONLY!")) + '</span></span>'
        +'<span class="ftt-yart-plate"><b>' + esc(text("text_art_special_family_traits", "Special family traits!")) + '</b><em>' + esc(text("text_art_only_in_the_shop", "Only in the Shop")) + '</em></span></div>'; }},
    {id:'tooltip-shop-packs', rect:true, sheet:'shop', target:'.fp-shop__card--boat', name:'Shop: Frog packs', get title(){ return text("text_tooltip_shop_packs_title", "Frog packs!"); }, get button(){ return text("text_tooltip_shop_packs_button", "Let’s go!"); }, art:'assets/tooltips/tooltip-shop-packs.png', trigger:'shop-tour-3', get caption(){ return text("text_tooltip_shop_packs_caption", "Grab packs of frogs to merge and grow your army!"); },
      get artHTML(){ return '<div class="ftt-yart ftt-packs-art"><span class="ftt-yart-rays"></span>'
        +'<span class="ftt-later-col ftt-later-then"><img class="ftt-packs-boat" src="assets/env/structure/frog_boat/boat.png" alt=""><span class="ftt-yart-tag">' + esc(text("text_art_packs", "PACKS")) + '</span></span><span class="ftt-yart-arrow"></span>'
        +'<span class="ftt-later-col ftt-later-now ftt-packs-frogs">'
          +[1,2,0].map(function(i){ return '<span class="ftt-fitbox ftt-pack-frog-'+i+'"><img class="ftt-fit" src="assets/frog2/body/body_0'+(i+1)+'.png" alt=""></span>'; }).join('')
          +'<span class="ftt-yart-tag">' + esc(text("text_art_more_frogs", "MORE FROGS!")) + '</span></span>'
        +'<span class="ftt-yart-plate"><b>' + esc(text("text_art_packs_of_frogs_to_merge", "Packs of frogs to merge!")) + '</b><em>' + esc(text("text_art_grow_your_army_faster", "Grow your army faster")) + '</em></span></div>'; }},
                                                                                
                                                                                    
                                                                                      
                                                                                      
                                                                                  
                                                                                 
                                                                      
    {id:'tooltip-harvest', target:['.ec-harvest','.bottom-dock .dock-btn[aria-label="Harvesting"]'], name:'Harvesting unlocked', get title(){ return text("text_tooltip_harvest_title", "To speed up crafting, put your frogs to work!"); }, get button(){ return text("text_tooltip_harvest_button", "Let’s harvest!"); }, art:'assets/tooltips/tooltip-harvest.png', trigger:'first-short-craft', get caption(){ return text("text_tooltip_harvest_caption", "Harvesting unlocked! Send frogs to gather wood and stone for you!"); },
      get artHTML(){ return '<div class="ftt-yart ftt-unlock-art"><span class="ftt-yart-rays"></span><img class="ftt-unlock-lock" src="assets/ui2/kit/icons/ui-lock-open.png" alt="">'
        +'<img class="ftt-unlock-cave" src="assets/ui2/kit/icons/nav-harvesting.png" alt=""><span class="ftt-unlock-plate">' + esc(text("text_art_harvesting", "Harvesting")) + '</span><span class="ftt-unlock-banner">' + esc(text("text_art_unlocked", "UNLOCKED!")) + '</span></div>'; }}
  ];
                                                                      
  var SHOP_TOUR=['tooltip-shop-ticket','tooltip-shop-mutant','tooltip-shop-packs'];
                                                                   
  function ticketGear(stage){
    try{ return !!(g.FamilyTicket && FamilyTicket.grantsBlueprints && FamilyTicket.grantsBlueprints()); }
    catch(e){ return false; }
  }
                                                                                                     
  function ticketsFromWeb(){
    try{ return !!(g.FamilyTicket && FamilyTicket.freedFromWeb && typeof state!=='undefined' && FamilyTicket.freedFromWeb(state)); }
    catch(e){ return false; }
  }
  function ticketTip(stage, famName, art){
    var t={id:'tooltip-ticket-'+stage, overReceipt:true, target:'#claim-modal #claim-ticket[data-stage="'+stage+'"]', name:'Family Ticket (stage '+stage+')',
      get title(){ return text("text_ticket_tip_title", "Family Ticket!"); }, get button(){ return text("text_ticket_tip_button", "Got it!"); }, art:'assets/tooltips/tooltip-ticket-'+stage+'.png', trigger:'stage-'+stage+'-sealed-drop'};
    Object.defineProperties(t,{
      caption:{enumerable:true, get:function(){
        var which = stage===2 && ticketsFromWeb() ? text("text_ticket_from_web", "a ticket you freed from the web") : text("text_ticket_source", "a ticket");
        return text("text_ticket_caption", "Use {ticket} to get every {family} piece{gear} at once!", {ticket: which, family: famName, gear: ticketGear(stage) ? text('text_ticket_gear', ' and its gear') : ''});
      }},
      artHTML:{enumerable:true, get:function(){
        return ticketArtHTML(art,text("text_ticket_art_title", "One ticket, the whole set!"),text("text_ticket_art_subtitle", "Every {family} piece{gear}", {family: famName, gear: ticketGear(stage)?text('text_ticket_art_gear', ' + its gear'):''}),
          stage===2 && ticketsFromWeb() ? text("text_ticket_web_tag", "FROM THE WEB") : null);
      }}
    });
    return t;
  }
                                                                             
                                                                             
                                                                              
                                                                           
                           
  function autoTip(){
    var t={id:'tooltip-auto', rect:true, sheet:'expeditions', target:'.xm-card .xm-card-auto', name:'Auto expeditions', get title(){ return text("text_auto_tip_title", "Auto expeditions!"); }, get button(){ return text("text_auto_tip_button", "Show me!"); }, art:'assets/tooltips/tooltip-auto.png', trigger:'stage-popup-after-no-ticket-family-drop'};
    Object.defineProperties(t,{
      guide:{enumerable:true, get:function(){ return typeof state!=='undefined' && state && state.ftueTooltips ? state.ftueTooltips.autoStage : null; }},
      caption:{enumerable:true, get:function(){ return text("text_auto_caption", "Send your frogs on auto! They replay the stage and bring back more {family} pieces!", {family: autoFamilyName()}); }},
      artHTML:{enumerable:true, get:function(){ return autoArtHTML(); }}
    });
    return t;
  }
  function savedAutoFamily(){ return typeof state!=='undefined' && state && state.ftueTooltips ? state.ftueTooltips.autoFamily || null : null; }
  function autoFamilyName(){
    var d=null; try{ d=g.FT && FT.familyDefOf(savedAutoFamily()); }catch(e){ d=null; }
    return (d && d.n) || 'set';
  }
                                                                           
                                              
  function autoArtHTML(){
    var pool=[]; try{ pool=g.FT && savedAutoFamily() ? FT.familyRewardPool(savedAutoFamily()) : []; }catch(e){ pool=[]; }
    return '<div class="ftt-yart ftt-auto-art"><span class="ftt-yart-rays"></span>'
      +'<span class="ftt-later-col ftt-later-then"><svg class="ftt-auto-ring" viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M19.5 9.5A8 8 0 0 0 5.2 7.4M4.5 14.5a8 8 0 0 0 14.3 2.1M19.8 3.8v5.9h-5.9M4.2 20.2v-5.9h5.9" stroke="#2a1d0e" stroke-width="4.6"/><path d="M19.5 9.5A8 8 0 0 0 5.2 7.4M4.5 14.5a8 8 0 0 0 14.3 2.1M19.8 3.8v5.9h-5.9M4.2 20.2v-5.9h5.9" stroke="#5ed33a" stroke-width="2.4"/></g></svg>'
        +'<img class="ftt-auto-cave" src="assets/ui2/kit/icons/nav-expedition.png" alt=""><span class="ftt-yart-tag">' + esc(text("text_art_auto", "AUTO")) + '</span></span><span class="ftt-yart-arrow"></span>'
      +'<span class="ftt-later-col ftt-later-now"><span class="ftt-auto-set">'
        +pool.slice(0,4).map(function(p){ return '<span><img class="ftt-fit" src="'+esc(p.path)+'" alt=""></span>'; }).join('')
        +'</span><span class="ftt-yart-tag">' + esc(text("text_art_more", "MORE!")) + '</span></span>'
      +'<span class="ftt-yart-plate"><b>' + esc(text("text_art_your_frogs_replay_it_on_their_own", "Your frogs replay it on their own!")) + '</b><em>' + esc(text("text_auto_art_subtitle", "More {family} pieces!", {family: autoFamilyName()})) + '</em></span></div>';
  }
                                                                           
                                                                              
                                                                               
                                                                              
                                                                     
  function goalLockTip(){
    var t={id:'tooltip-goal-lock', spot:true, clash:'goalClash', name:'Goal lock', get button(){ return text("text_goal_lock_tip_button", "Lock it!"); }, art:'assets/tooltips/tooltip-goal-lock.png', trigger:'family-goal-same-slot-merge'};
    Object.defineProperties(t,{
      title:{enumerable:true, get:function(){ return text("text_goal_lock_title", "Lock the {family} trait!", {family: goalFamilyName()}); }},
      caption:{enumerable:true, get:function(){ return text("text_goal_lock_caption", "Only one trait stays in a slot. Lock the {family} one and the merge keeps it!", {family: goalFamilyName()}); }},
      artHTML:{enumerable:true, get:function(){ return goalLockArtHTML(); }}
    });
    return t;
  }
  function savedGoalClash(){ return typeof state!=='undefined' && state && state.ftueTooltips ? state.ftueTooltips.goalClash || null : null; }
  function goalFamilyName(){
    var c=savedGoalClash(), d=null; try{ d=c && g.FT && FT.familyDefOf(c.family); }catch(e){ d=null; }
    return (d && d.n) || 'family';
  }
                                                                                
  function goalLockArtHTML(){
    var c=savedGoalClash(), keep=null, pieces=[];
    try{
      keep=c && g.FT ? FT.traitDef(c.keep) : null;
      var fam=c && g.FT ? FT.familyDefOf(c.family) : null;
      pieces=fam ? (FT.SLOTS||[]).map(function(sl){ return FT.traitDef(fam.traits[sl]); }).filter(Boolean) : [];
    }catch(e){ keep=null; pieces=[]; }
    return '<div class="ftt-yart ftt-goal-lock-art"><span class="ftt-yart-rays"></span>'
      +'<span class="ftt-later-col ftt-later-then"><span class="ftt-goal-piece">'+(keep?'<img class="ftt-fit" src="'+esc(keep.path)+'" alt="">':'')+'</span>'
        +'<img class="ftt-goal-lockicon" src="assets/ui2/kit/icons/ui-locked.png" alt=""><span class="ftt-yart-tag">' + esc(text("text_art_lock_it", "LOCK IT!")) + '</span></span><span class="ftt-yart-arrow"></span>'
      +'<span class="ftt-later-col ftt-later-now"><span class="ftt-auto-set">'
        +pieces.slice(0,4).map(function(p){ return '<span><img class="ftt-fit" src="'+esc(p.path)+'" alt=""></span>'; }).join('')
        +'</span><span class="ftt-yart-tag">' + esc(text("text_art_full_set", "FULL SET!")) + '</span></span>'
      +'<span class="ftt-yart-plate"><b>' + esc(text("text_art_locked_traits_always_stay", "Locked traits always stay!")) + '</b><em>' + esc(text("text_goal_lock_art_subtitle", "Keep every {family} trait", {family: goalFamilyName()})) + '</em></span></div>';
  }
                                                                              
                                                                        
                                                                             
                                                                           
                                                                            
                                                                              
                                     
  function lockSafetyTip(){
    var t={id:'tooltip-lock-safety', spot:true, clash:'lockSafety', name:'Lock safety net', get button(){ return text("text_lock_safety_button", "Lock it!"); }, art:'assets/tooltips/tooltip-lock-safety.png', trigger:'family-goal-completed-no-clash'};
    Object.defineProperties(t,{
      title:{enumerable:true, get:function(){ return text("text_lock_safety_title", "Don't forget to lock!"); }},
      caption:{enumerable:true, get:function(){ return text("text_lock_safety_caption", "Lock a {family} trait so a future merge can never take it away.", {family: lockSafetyFamilyName()}); }},
      artHTML:{enumerable:true, get:function(){ return lockSafetyArtHTML(); }}
    });
    return t;
  }
  function savedLockSafety(){ return typeof state!=='undefined' && state && state.ftueTooltips ? state.ftueTooltips.lockSafety || null : null; }
  function lockSafetyFamilyName(){
    var c=savedLockSafety(), d=null; try{ d=c && g.FT && FT.familyDefOf(c.family); }catch(e){ d=null; }
    return (d && d.n) || 'family';
  }
  function lockSafetyArtHTML(){
    var c=savedLockSafety(), keep=null, pieces=[];
    try{
      keep=c && g.FT ? FT.traitDef(c.keep) : null;
      var fam=c && g.FT ? FT.familyDefOf(c.family) : null;
      pieces=fam ? (FT.SLOTS||[]).map(function(sl){ return FT.traitDef(fam.traits[sl]); }).filter(Boolean) : [];
    }catch(e){ keep=null; pieces=[]; }
    return '<div class="ftt-yart ftt-goal-lock-art"><span class="ftt-yart-rays"></span>'
      +'<span class="ftt-later-col ftt-later-then"><span class="ftt-goal-piece">'+(keep?'<img class="ftt-fit" src="'+esc(keep.path)+'" alt="">':'')+'</span>'
        +'<img class="ftt-goal-lockicon" src="assets/ui2/kit/icons/ui-locked.png" alt=""><span class="ftt-yart-tag">' + esc(text("text_art_lock_it", "LOCK IT!")) + '</span></span><span class="ftt-yart-arrow"></span>'
      +'<span class="ftt-later-col ftt-later-now"><span class="ftt-auto-set">'
        +pieces.slice(0,4).map(function(p){ return '<span><img class="ftt-fit" src="'+esc(p.path)+'" alt=""></span>'; }).join('')
        +'</span><span class="ftt-yart-tag">' + esc(text("text_art_full_set", "FULL SET!")) + '</span></span>'
      +'<span class="ftt-yart-plate"><b>' + esc(text("text_art_locked_traits_always_stay", "Locked traits always stay!")) + '</b><em>' + esc(text("text_lock_safety_art_subtitle", "Keep your {family} trait safe", {family: lockSafetyFamilyName()})) + '</em></span></div>';
  }
                                                                                   
                                                                           
                                                                          
  function gearBoostTip(){
    var t={id:'tooltip-gear-boost', rect:true, radius:18, overInspect:true, name:'Gear boost', title:'Gear boost!', button:'Nice!', art:'assets/tooltips/tooltip-gear-boost.png', trigger:'first-gear-equipped'};
    Object.defineProperties(t,{
      target:{enumerable:true, get:function(){ var b=savedGearBoost(); return '#labor-window .eq-cell.worn'+(b && b.slot ? '[onclick*="\''+b.slot+'\'"]' : ''); }},
      caption:{enumerable:true, get:function(){
        var b=savedGearBoost();
        return (b && b.name && b.label ? 'Your '+b.name+' gives '+b.label+'! ' : '')+'Gear boosts your frog’s stats!';
      }},
      artHTML:{enumerable:true, get:function(){ return gearBoostArtHTML(); }}
    });
    return t;
  }
  function savedGearBoost(){ return typeof state!=='undefined' && state && state.ftueTooltips ? state.ftueTooltips.gearBoost || null : null; }
  var STAT_NAMES={atk:'ATK',def:'DEF',hp:'HP'};
                                                                           
                                                                
  function gearBoostArtHTML(){
    var b=savedGearBoost()||{}, stat=STAT_NAMES[b.stat] ? b.stat : null;
    var nums=stat && b.from!=null && b.to!=null && b.to!==b.from;
    return '<div class="ftt-yart ftt-gearboost-art"><span class="ftt-yart-rays"></span>'
      +'<span class="ftt-later-col ftt-later-then"><span class="ftt-goal-piece">'+(b.art?'<img class="ftt-fit" src="'+esc(b.art)+'" alt="">':'')+'</span>'
        +'<span class="ftt-yart-tag ftt-gb-boost'+(stat?' ftt-gb-boost--'+stat:'')+'">'+esc(b.label||'BOOST!')+'</span></span><span class="ftt-yart-arrow"></span>'
      +'<span class="ftt-later-col ftt-later-now"><img class="ftt-gb-stat" src="'+(stat?'assets/ui2/icon/'+stat+'_icon.png':'assets/ui2/prediction/FrogFace_Happy.png')+'" alt="">'
        +'<span class="ftt-yart-tag ftt-gb-up">'+(nums ? STAT_NAMES[stat]+' '+esc(b.from)+' <i>→</i> <b>'+esc(b.to)+'</b>' : 'STRONGER!')+'</span></span>'
      +'<span class="ftt-yart-plate"><b>Gear boosts your frog’s stats!</b><em>'
        +(stat==='atk' ? 'Your frog hits harder now!' : stat ? 'Your frog is tougher now!' : 'Your frog is stronger now!')+'</em></span></div>';
  }
                                                                                
                                                                               
                                                                     
  function auraPoolTip(){
    var t={id:'tooltip-aura-pool', sheet:'grimoire', name:'Aura in the gene pool', get title(){ return text("text_aura_pool_tip_title", "In your gene pool!"); }, get button(){ return text("text_aura_pool_tip_button", "Got it!"); }, art:'assets/tooltips/tooltip-aura-pool.png', trigger:'grimoire-slot-tour-aura',
      get caption(){ return text("text_aura_pool_tip_caption", "Your Bunny Aura can sprout in merges now, but only as a frog’s 4th trait. Evolve a frog all the way to get it!"); }};
    Object.defineProperties(t,{
      target:{enumerable:true, get:function(){ return '.gp-page [onclick*=\'openTrait("'+(bunnyAuraKey()||'aura_10')+'")\']'; }},
      artHTML:{enumerable:true, get:function(){ return auraPoolArtHTML(); }}
    });
    return t;
  }
  function bunnyAuraKey(){ try{ return g.AuraReminder && g.FT ? AuraReminder.auraKey(FT) : null; }catch(e){ return null; } }
                                                                            
                                           
  function auraPoolArtHTML(){
    var fam=null;
    try{ fam=g.FT ? FT.familyDefOf('bunny') : null; }catch(e){ fam=null; }
    function art(sl){ var d=null; try{ d=fam && FT.traitDef(fam.traits[sl]); }catch(e){ d=null; } return d ? '<img class="ftt-fit" src="'+esc(d.path)+'" alt="">' : ''; }
    return '<div class="ftt-yart ftt-aura-art"><span class="ftt-yart-rays"></span>'
      +'<span class="ftt-later-col ftt-later-then"><span class="ftt-goal-piece">'+art('aura')+'</span><span class="ftt-yart-tag">' + esc(text("text_art_gene_pool", "GENE POOL")) + '</span></span><span class="ftt-yart-arrow"></span>'
      +'<span class="ftt-later-col ftt-later-now"><span class="ftt-auto-set">'
        +['head','mouth','back','aura'].map(function(sl){ return '<span'+(sl==='aura'?' class="ftt-aura-4th"':'')+'>'+art(sl)+'</span>'; }).join('')
        +'</span><span class="ftt-yart-tag">' + esc(text("text_art_4th_trait", "4TH TRAIT!")) + '</span></span>'
      +'<span class="ftt-yart-plate"><b>' + esc(text("text_art_it_sprouts_as_a_frog_s_4th_trait", "It sprouts as a frog’s 4th trait!")) + '</b><em>' + esc(text("text_art_evolve_a_frog_all_the_way", "Evolve a frog all the way")) + '</em></span></div>';
  }
                                                                             
                                                                               
  function familyFoundTip(){
    var t={id:'tooltip-family-found', pond:true, target:'.bottom-dock .dock-btn[aria-label="Codex"]', name:'New trait family found', get title(){ return text("text_family_found_tip_title", "New trait family found!"); }, get button(){ return text("text_family_found_tip_button", "Let’s look!"); }, art:'assets/tooltips/tooltip-family-found.png', trigger:'family-goal-open-pond'};
    Object.defineProperties(t,{
      caption:{enumerable:true, get:function(){ return text("text_family_found_caption", "You found every {family} trait! Meet your new family in the Grimoire!", {family: foundFamilyName()}); }},
      artHTML:{enumerable:true, get:function(){ return familyFoundArtHTML(); }}
    });
    return t;
  }
                                                                            
                                                                    
                                                                            
                                                          
  function familyUnlockedTip(){
    var t={id:'tooltip-family-unlocked', rect:true, radius:18, sheet:'grimoire', name:'Trait family unlocked', get button(){ return text("text_family_unlocked_tip_button", "Let’s merge!"); }, art:'assets/tooltips/tooltip-family-unlocked.png', trigger:'grimoire-families-after-family-found'};
    Object.defineProperties(t,{
      title:{enumerable:true, get:function(){ return text("text_family_unlocked_title", "{family} unlocked!", {family: foundFamilyName()}); }},
      caption:{enumerable:true, get:function(){ return text("text_family_unlocked_caption", "All {count} {family} traits are in your gene pool! Merge them onto one frog to complete the family.", {count: foundPieces().length, family: foundFamilyName()}); }},
      target:{enumerable:true, get:function(){ return '.gp-page .fam-card[data-family="'+(savedFoundFamily()||'')+'"] .fam-top'; }},
      artHTML:{enumerable:true, get:function(){ return familyUnlockedArtHTML(); }}
    });
    return t;
  }
  function savedFoundFamily(){ return typeof state!=='undefined' && state && state.ftueTooltips ? state.ftueTooltips.foundFamily || null : null; }
  function foundFamilyDef(){ var d=null; try{ d=g.FT && savedFoundFamily() ? FT.familyDefOf(savedFoundFamily()) : null; }catch(e){ d=null; } return d; }
  function foundFamilyName(){ var d=foundFamilyDef(); return (d && d.n) || 'Family'; }
  function foundPieces(){
    var d=foundFamilyDef(), slots=d ? (d.slots||FT.SLOTS||[]) : ['head','mouth','back','aura'];
    return slots.map(function(sl){ var p=null; try{ p=d && FT.traitDef(d.traits[sl]); }catch(e){ p=null; } return p; });
  }
  function foundSetHTML(){
    return '<span class="ftt-auto-set">'+foundPieces().slice(0,4).map(function(p){ return '<span>'+(p && p.path?'<img class="ftt-fit" src="'+esc(p.path)+'" alt="">':'')+'</span>'; }).join('')+'</span>';
  }
                                                                     
  function familyFoundArtHTML(){
    return '<div class="ftt-yart ftt-family-art"><span class="ftt-yart-rays"></span>'
      +'<span class="ftt-later-col ftt-later-then">'+foundSetHTML()+'<span class="ftt-yart-tag">' + esc(text("text_art_all_found", "ALL FOUND!")) + '</span></span><span class="ftt-yart-arrow"></span>'
      +'<span class="ftt-later-col ftt-later-now"><img src="assets/ui2/kit/icons/nav-grimoire.png" alt=""><span class="ftt-yart-tag">' + esc(text("text_art_new_family", "NEW FAMILY!")) + '</span></span>'
      +'<span class="ftt-yart-plate"><b>' + esc(text("text_family_found_art_title", "Every {family} trait found!", {family: foundFamilyName()})) + '</b><em>' + esc(text("text_art_meet_your_new_family_in_the_grimoire", "Meet your new family in the Grimoire")) + '</em></span></div>';
  }
                                                             
  function familyUnlockedArtHTML(){
    var d=foundFamilyDef(), n=foundPieces().length;
    return '<div class="ftt-yart ftt-family-art"><span class="ftt-yart-rays"></span>'
      +'<span class="ftt-later-col ftt-later-then">'+foundSetHTML()+'<span class="ftt-yart-tag">'+esc(text('text_family_unlocked_count', '{count} TRAITS', {count:n}))+'</span></span><span class="ftt-yart-arrow"></span>'
      +'<span class="ftt-later-col ftt-later-now"><span class="ftt-fitbox">'+(d && d.body?'<img class="ftt-fit" src="assets/frog2/body/'+esc(d.body)+'.png" alt="">':'')+'</span><span class="ftt-yart-tag">' + esc(text("text_art_one_frog", "ONE FROG!")) + '</span></span>'
      +'<span class="ftt-yart-plate"><b>' + esc(text("text_family_unlocked_art_title", "Merge all {count} onto one frog!", {count: n})) + '</b><em>' + esc(text("text_family_unlocked_art_subtitle", "Complete the {family} frog", {family: foundFamilyName()})) + '</em></span></div>';
  }
                                                                                                   
  function ticketArtHTML(art,plate,sub,tag){
    var icon=g.FamilyTicket ? g.FamilyTicket.iconHTML() : '';
    return '<div class="ftt-yart ftt-ticket-art"><span class="ftt-yart-rays"></span>'
      +'<span class="ftt-later-col ftt-later-then">'+icon+'<span class="ftt-yart-tag">'+esc(tag||text("text_ticket_tag", "TICKET"))+'</span></span><span class="ftt-yart-arrow"></span>'
      +'<span class="ftt-later-col ftt-later-now"><span class="ftt-auto-set">'
        +art.map(function(p){ return '<span><img class="ftt-fit" src="assets/frog2/'+p+'.png" alt=""></span>'; }).join('')
        +'</span><span class="ftt-yart-tag">' + esc(text("text_art_full_set", "FULL SET!")) + '</span></span>'
      +'<span class="ftt-yart-plate"><b>'+esc(plate)+'</b><em>'+esc(sub)+'</em></span></div>';
  }
                                                                           
  var CONTINUE_DELAY_MS = 3000;
  function find(id){ return registry.find(function(t){return t.id===id;}); }
  function flowerCardDisabled(id){
    return ['tooltip-seeds','tooltip-flower-boost','tooltip-plant'].indexOf(id)>=0 &&
      typeof FPConfig!=='undefined' && Number(FPConfig.value('FTUE','ftue_flowers_enabled'))===0;
  }
  function lockLesson(id){ return id==='tooltip-4b' || id==='tooltip-goal-lock'; }
  function receipt(s){
    var r=s.ftueTooltips || (s.ftueTooltips={merges:0, seen:{}, pending:[]});
    var beforeCount=r.pending.length;
                                                                                   
    r.pending=r.pending.filter(function(id){ return !!find(id) && !flowerCardDisabled(id) && !(id==='tooltip-upgrades' && s.ftueLoop!=null && !upgradesNeeded(s)); });
                                                                           
                                                                              
                                                                              
                                                                            
                                                                           
                                                                            
                                                                           
                                                                        
    var queuedLock=false;
    r.pending=r.pending.filter(function(id){
      if(!lockLesson(id)) return true;
      if(queuedLock){
        delete r[id==='tooltip-4b'?'clash':'goalClash'];
        if(r.frogs) delete r.frogs[id];
        return false;
      }
      queuedLock=true; return true;
    });
    if(r.pending.length<beforeCount) releaseHold(r,s);
    return r;
  }
  function request(s,id){
    var r=receipt(s);
    var t=find(id);
    if(lockLesson(id) && r.pending.some(lockLesson)) return false;
    if(id==='tooltip-4b' && !expedition2WinClaimed(s)) return false;
    if(!t || t.off || flowerCardDisabled(id) || r.seen[id] || r.pending.indexOf(id)>=0) return false;
    r.pending.push(id); return true;
  }
                                                                             
                                                                               
                                                                             
                                                                          
                                                                            
                                                     
  function playerMerge(s,opts,ctx){
    opts=opts||{}; ctx=ctx||{};
    if(opts.cinematic || opts.ftueForce || opts.scripted) return false;
    var r=receipt(s), asked=false;
    r.merges++;
    if(r.merges===1) asked=request(s,'tooltip-1');
    if(ctx.stacked) asked=request(s,'tooltip-2') || asked;
    if(ctx.newTraits && !opts.claimed) asked=request(s,'tooltip-4a') || asked;
    return asked;
  }
  function expedition2WinClaimed(s){ return (s.claimedExpeditionRewards||[]).indexOf('2:win')>=0; }
                                                                                
                                                                              
                                                                                
                                                                              
                                                                            
                                                                                   
                                                                                   
                                                                                
                                                                               
                                                                             
                                                                                 
                                                                               
                                                                            
                                                                            
  function sameSlotClash(a,b,index,canLock,slots,rank,bunnyDone){
    if(!a || !b || !a.traits || !b.traits) return null;
    for(var i=0;i<(slots||[]).length;i++){
      var sl=slots[i], ka=a.traits[sl], kb=b.traits[sl];
      if(!ka || !kb || baseKey(ka)===baseKey(kb) || !canLock(sl)) continue;
      if((a.locked && a.locked[sl]) || (b.locked && b.locked[sl])) continue;
      var aBunny=!bunnyDone && index[baseKey(ka)]==='bunny', bBunny=!bunnyDone && index[baseKey(kb)]==='bunny';
      var lockA=aBunny!==bBunny ? aBunny : rank(ka)<=rank(kb);
      return {slot:sl, frog:lockA?a.id:b.id, keep:lockA?ka:kb, lose:lockA?kb:ka};
    }
    return null;
  }
                                                                             
                                                                              
                                                                                
                                                                           
                                                                             
  function goalSlotClash(a,b,goal,index,canLock,slots,rank){
    if(!goal || !a || !b || !a.traits || !b.traits) return null;
    var first=null;
    for(var i=0;i<(slots||[]).length;i++){
      var sl=slots[i], ka=a.traits[sl], kb=b.traits[sl];
      if(!ka || !kb || baseKey(ka)===baseKey(kb) || !canLock(sl)) continue;
      var aGoal=index[baseKey(ka)]===goal;
      if(aGoal===(index[baseKey(kb)]===goal)) continue;
      var wearer=aGoal?a:b, other=aGoal?b:a, keep=aGoal?ka:kb, lose=aGoal?kb:ka;
      if(wearer.locked && wearer.locked[sl]) continue;
      var c={slot:sl, frog:wearer.id, keep:keep, lose:lose, family:goal};
      if((other.locked && other.locked[sl]) || rank(lose)>=rank(keep)) return c;
      if(!first) first=c;
    }
    return first;
  }
                                                               
  function familyIndex(families,slots){
    var m={};
    (families||[]).forEach(function(f){ (slots||[]).forEach(function(sl){ if(f.traits && f.traits[sl]) m[f.traits[sl]]=f.id; }); });
    return m;
  }
                                                                               
                                                                             
  function lockSlotFor(traits,index,canLock,slots){
    var filled=(slots||[]).filter(function(sl){ return traits && traits[sl] && canLock(sl); });
    var fresh=filled.filter(function(sl){ var f=index[baseKey(traits[sl])]; return !!f && f!=='bunny'; });
    return fresh[0] || filled[0] || null;
  }
  function baseKey(k){ return String(k).replace(/_evolution\d+$/,''); }
  function traitCount(traits){ return Object.keys(traits||{}).filter(function(sl){ return !!traits[sl]; }).length; }
                                                                             
                                      
  function stackedTraits(parents,result){
    return !!(parents && parents.length===2 && traitCount(parents[0])>=1 && traitCount(parents[1])>=1 && traitCount(result)>=2);
  }
                                                                          
                                                                               
  function sproutedNewFamily(parents,result,index){
    var had={};
    (parents||[]).forEach(function(p){ Object.keys(p||{}).forEach(function(sl){ if(p[sl]) had[baseKey(p[sl])]=true; }); });
    return Object.keys(result||{}).some(function(sl){
      var k=result[sl] && baseKey(result[sl]), f=k && index[k];
      return !!f && f!=='bunny' && !had[k];
    });
  }
  function exp2FirstAttemptPaid(s){var paid=s.claimedExpeditionRewards||[];return paid.indexOf('2:loss')>=0 || (!!s.combatTestExp2FirstResolved && paid.indexOf('2:win')>=0);}
  function pondReturn(s,pondVisible){
    return !!(pondVisible && s.ftueLoop===2 && s.ftueL2Step==='return_pond' &&
      exp2FirstAttemptPaid(s) && request(s,'tooltip-3a'));
  }
                                                                         
                                                                         
  function outOfTadpoles(s,plantingAttempt){
    return !!(plantingAttempt && s.pondExpanded && typeof s.tadpoles==='number' && s.tadpoles<=0 && request(s,'tooltip-exp'));
  }
                                                                      
                                                                           
                                                                             
  function expeditionUnlocked(s,outOfFight){
    return !!(outOfFight && s.ftueLoop===1 && s.ftueL1Step==='launch' && !s.ftueLoop1HandedOff &&
      (s.expeditionsCleared||[]).indexOf('node-1')<0 && request(s,'tooltip-exp-unlock'));
  }
                                                                              
                                                                    
  function tadpolesWon(s,tileShown){
    return !!(tileShown && s.ftueLoop>=1 && !s.ftueDone && request(s,'tooltip-tadpoles'));
  }
                                                                               
                                                                         
                                                                            
                                                                          
                                                                               
  var HATCH_STEPS=['return_pond','grow2x4'];
                                                              
  function hatchAgain(s,pondShown,auraWaiting){
    return !!(pondShown && s.ftueLoop===2 && HATCH_STEPS.indexOf(s.ftueL2Step)>=0 &&
      exp2FirstAttemptPaid(s) && (s.tadpoles||0)>=1 &&
      !auraLessonDue(s,auraWaiting) && request(s,'tooltip-hatch'));
  }
                                                                              
                                                                         
                                                                              
                                   
  function auraLessonDue(s,auraWaiting){
    return !!(auraWaiting && s.ftueLoop===2 && HATCH_STEPS.indexOf(s.ftueL2Step)>=0 &&
      exp2FirstAttemptPaid(s) && !receipt(s).seen['tooltip-aura-pool']);
  }
                                                                             
                                                                       
  function grimoireIntro(s,buttonShown,auraWaiting){
    return !!(buttonShown && auraLessonDue(s,auraWaiting) && request(s,'tooltip-grimoire'));
  }
                                                                                  
                                                                              
                                                                                     
  function familyFound(s,pondShown,family){
    if(!(pondShown && family && request(s,'tooltip-family-found'))) return false;
    receipt(s).foundFamily=family;
    return true;
  }
                                                                              
                                                                            
                                                      
  function familyIntro(s,goalFamily){
    var r=s && s.ftueTooltips;
    return r && r.foundFamily && r.foundFamily===goalFamily && !r.seen['tooltip-family-unlocked'] ? r.foundFamily : null;
  }
                                                                                 
                                                                             
                                                                  
  function familyUnlockedShown(s,cardShown,goalFamily){
    return !!(cardShown && receipt(s).seen['tooltip-family-found'] && familyIntro(s,goalFamily) && request(s,'tooltip-family-unlocked'));
  }
                                                                      
                                                                             
                                                                             
                                                                             
                              
  var GEAR_STEPS=['craft'];
  function gearReady(s,onPond,frogId){
                                                                         
    if(s.ftueL4HarvestLesson && !s.ftueL4HarvestLesson.done) return false;
    if(!(onPond && s.ftueLoop===4 && GEAR_STEPS.indexOf(s.ftueL4Step)>=0 && !s.ftueL4CraftPaid && request(s,'tooltip-gear'))) return false;
    if(frogId) (receipt(s).frogs||(receipt(s).frogs={}))['tooltip-gear']=frogId;
    return true;
  }
                                                                     
                                                                              
                                                                              
                                                                                
                                                                              
  function gearEquipped(s,boost,veteran){
    var r=receipt(s), id='tooltip-gear-boost';
    if(!boost || r.seen[id] || r.pending.indexOf(id)>=0) return false;
    if(veteran){ r.seen[id]=true; return false; }
    if(!request(s,id)) return false;
    r.gearBoost=boost;
    return true;
  }
                                                                              
                                                                             
                                                                                  
                                                                                 
                                                    
  function materialsShort(s,short,intro){
    if(!(short && (short.mat>0 || short.rock>0))) return false;
    if(intro){ receipt(s).seen['tooltip-mats']=true; return request(s,'tooltip-harvest'); }
    return request(s,'tooltip-mats');
  }
                                                                                
  function expansionIntro(s,active){
    return !!(active && request(s,'tooltip-pond-mats'));
  }
                                                                          
                                                                           
                                                      
  function padsShown(s,rowShown){
                                                                                                        
    return !!(rowShown && (s.pondTier||0)>=1 && upgradesIntroduced(receipt(s)) && request(s,'tooltip-pads'));
  }
  function upgradesIntroduced(r){ return !!r.seen['tooltip-upgrades']; }
                                                                                  
  function seedsWon(s,tileShown){
    return !!(tileShown && !s.ftueDone && request(s,'tooltip-seeds'));
  }
                                                                            
                                                                                  
  function flowerBoostDue(s,calm){
    return !!(calm && s.ftueLoop===5 && !s.ftueDone && !s.ftueFlowerLesson &&
      (s.claimedExpeditionRewards||[]).indexOf('5:loss')>=0 &&
      ['plant','grow','seat','charge'].indexOf(s.ftueL5Step)>=0 && request(s,'tooltip-flower-boost'));
  }
                                                                             
  function plantReady(s,pondShown){
    return !!(pondShown && s.ftueLoop===5 && s.ftueL5Step==='plant' && (s.seeds||0)>=1 && request(s,'tooltip-plant'));
  }
                                                                               
                                                                     
                                                                            
                                                                             
  function blueprintReward(tile){
    if(!tile || !g.Equipment)return null;
    var key=tile.getAttribute('data-reward'),slot=Equipment.blueprintSlotOf(key);
    if(slot)return {name:Equipment.blueprintLabel(slot),icon:Equipment.blueprintIconHTML(slot)};
    var name=tile.querySelector('.xr-newtrait__name,.kit-reward-tile__name');
    var art=tile.querySelector('.xr-newtrait__art,.kit-reward-tile__icon,.kit-reward-tile__img');
    return name && art ? {name:name.textContent,icon:art.tagName==='IMG'?art.outerHTML:art.innerHTML} : null;
  }
  function blueprintArtHTML(){
    var won=typeof state!=='undefined' && state && receipt(state).blueprintReward;
    if(!won && g.document)won=blueprintReward(firstMatch(find('tooltip-blueprint').target));
    return '<div class="ftt-yart ftt-blueprint-art"><span class="ftt-yart-rays"></span>'
      +'<span class="ftt-later-col ftt-later-then"><span class="ftt-won-blueprint">'+(won?won.icon:'')+'</span><span class="ftt-yart-tag">'+esc(won?won.name:text('text_art_blueprint','BLUEPRINT'))+'</span></span><span class="ftt-yart-arrow"></span>'
      +'<span class="ftt-later-col ftt-later-now"><img src="assets/ui2/screens/upgrades/icon-workshop.png" alt=""><span class="ftt-yart-tag">'+esc(text('text_art_craft_gear','CRAFT GEAR!'))+'</span></span>'
      +'<span class="ftt-yart-plate"><b>'+esc(text('text_art_equip_gear_to_hit_even_harder','Equip gear to hit even harder!'))+'</b><em>'+esc(text('text_art_blueprints_craft_new_gear','Blueprints craft new gear!'))+'</em></span></div>';
  }
  function blueprintWon(s,tileShown){
    if(!tileShown || !request(s,'tooltip-blueprint'))return false;
    var won=typeof tileShown==='object' ? blueprintReward(tileShown) : null;
    if(won)receipt(s).blueprintReward=won;
    return true;
  }
  function bunnyComplete(s,family){
    return !!(s.ftueLoop===2 && family && family.id==='bunny' && request(s,'tooltip-3b'));
  }
                                                                              
                                                                         
                                                                           
                                                                             
                                                                   
                                           
                                                                           
                                                                           
  function upgradesNeeded(s){
    if(!(s && !s.ftueDone && s.ftueLoop===5)) return false;
    if(s.ftueCapExpand) return true;
                                                                         
                                                                           
                                                                          
                                                                              
                                                                             
                                                                     
                                                                          
                                                                            
    return !!(s.ftueL5Step==='hatch_pad' && s.ftueL5PadArrival && s.ftueL5PadArrival.readyAt!=null && Date.now()>=s.ftueL5PadArrival.readyAt);
  }
  function upgradesUnlocked(s,dock,calm){
    var r=receipt(s);
    if(dock==='locked'){
      if(r.upgradesLocked || upgradesIntroduced(r)) return false;
      r.upgradesLocked=true; return true;
    }
    return !!(upgradesNeeded(s) && dock==='open' && calm && r.upgradesLocked && !upgradesIntroduced(r) && request(s,'tooltip-upgrades'));
  }
                                                                                
                                                                                
                                                                               
                                                                               
                                                                       
  function rematchDue(s){
    return !!(s && s.ftueLoop===2 && s.ftueL2Step==='reattempt' && !s.ftueL2RetryHandedOff && !receipt(s).seen['tooltip-rematch']);
  }
  function rematchReady(s,pondVisible){
    if(!pondVisible || !rematchDue(s) || !request(s,'tooltip-rematch')) return false;
    if(s.ftueL2BunnyFrogId){ var r=receipt(s); (r.frogs||(r.frogs={}))['tooltip-rematch']=s.ftueL2BunnyFrogId; }
    return true;
  }
                                                                               
                                                                                
                                                                             
                                                                               
                                                                          
                                                         
  function noTicketReveal(s,familyId,setDone){
    var r=receipt(s);
    if(!familyId || setDone || r.autoFamily || r.seen['tooltip-auto'] || r.pending.indexOf('tooltip-auto')>=0) return false;
    r.autoFamily=familyId; return true;
  }
                                                                            
                                                                                
                                                                              
                                                                           
                                                                              
                                                                         
                           
                                                                 
  function autoRunReady(s,no,family){
    var r=receipt(s);
    if(no==null || !family || !r.autoFamily || !request(s,'tooltip-auto')) return false;
    r.autoFamily=family; r.autoStage=no;
    return true;
  }
                                                                             
                                                                
  function ticketPrompt(s,stage){
    return (stage===2 || stage===3) && request(s,'tooltip-ticket-'+stage);
  }
                                                                              
                                                                                                        
                                                                                      
  function onShopStep(s){ return s.ftueLoop===5 && s.ftueL5Step==='shop' && !s.ftueDone; }
  function shopIntroReady(s,calm){
    return !!(calm && onShopStep(s) && request(s,'tooltip-shop'));
  }
                                                                             
                                                                               
                                                                     
  function harvestIntroReady(s,shown){
    return !!(shown && s.ftueLoop>=4 && !s.ftueDone &&
      (s.ftueLoop!==4 || (['auto_harvest','harvest_resources'].includes(s.ftueL4Step) &&
        (!g.FtueSteps || FtueSteps.equipmentObjectiveReady()))) && request(s,'tooltip-harvest'));
  }
                                                                  
  function shopTourReady(s,shopShown){
    if(!shopShown || !onShopStep(s) || !receipt(s).seen['tooltip-shop']) return false;
    var asked=false;
    SHOP_TOUR.forEach(function(id){ asked=request(s,id) || asked; });
    return asked;
  }
  function acknowledge(s,id){
    var r=receipt(s); if(r.pending[0]!==id) return false;
    r.seen[id]=true; r.pending.shift();
    if(r.frogs) delete r.frogs[id];
    return true;
  }
  function held(s){ return !!(s && s.ftueTooltips && s.ftueTooltips.pending.length); }
                                                                            
                                                                        
                                                                    
                                                                     
                                                                           
                                                                            
                                                                             
                                                                           
                                                         
  function bannerSpotlit(){
    if(typeof state==='undefined' || !state) return false;
    var shown=typeof document!=='undefined' && document.getElementById('ftue-tooltip');
    var id=shown ? shown.dataset.tooltip : (receipt(state).pending||[])[0];
    var t=id && find(id);
    return !!(t && typeof t.target==='string' && t.target.indexOf('.objective-stack')>=0);
  }
  function esc(v){return String(v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function placeholder(t){
    return '<div class="ftt-placeholder"><strong>'+esc(t.name)+' (art pending)</strong><p>'+esc(t.caption||'')+'</p></div>';
  }
                                                                            
  function rememberFrog(s,before,frogId){
    var r=receipt(s);
    r.pending.forEach(function(id){
      var t=find(id);
      if(t && t.clash && r.frogs && r.frogs[id]) return;                                          
      if(frogId && t && (t.traits || t.spot) && before.indexOf(id)<0) (r.frogs||(r.frogs={}))[id]=frogId;
    });
  }
                                                                             
                                                                    
  function traitsHTML(t,frog,ft){
    if(!t.traits || !frog || !frog.traits || !ft) return '';
    var slots=ft.SLOTS||['head','mouth','back','aura'], have=0;
    var cells=slots.map(function(slot){
      var d=ft.traitDef(frog.traits[slot]);
      if(!d) return '<span class="ftt-slot"></span>';
      have++;
      return '<span class="ftt-slot ftt-slot--found"><span class="ftt-slot-art"><img src="'+esc(d.path)+'" alt="'+esc(d.n)+'" onload="if(window.fitTraitThumb)fitTraitThumb(this)"></span>'
        +'<img class="ftt-check" src="assets/tooltips/check.svg" alt=""></span>';
    }).join('');
    return '<div class="ftt-traits" role="group" aria-label="Traits '+have+' of '+slots.length+'">'
      +'<span class="ftt-traits-label"><span>' + esc(text("text_art_traits", "Traits")) + '</span><b>'+have+'/'+slots.length+'</b></span>'
      +'<span class="ftt-slots">'+cells+'</span></div>';
  }
                                                                         
                                                       
  function clashHTML(t,clash,ft){
    if(!t.clash || !clash || !ft) return '';
    var keep=ft.traitDef(clash.keep), lose=ft.traitDef(clash.lose);
    if(!keep || !lose) return '';
    var meta=ft.SLOT_META && ft.SLOT_META[clash.slot], slotName=meta ? meta.name : clash.slot;
    function cell(d,lock){
      return '<span class="ftt-slot ftt-slot--found"><span class="ftt-slot-art"><img src="'+esc(d.path)+'" alt="'+esc(d.n)+'" onload="if(window.fitTraitThumb)fitTraitThumb(this)"></span>'
        +(lock?'<img class="ftt-check ftt-lock" src="assets/ui2/kit/icons/ui-locked.png" alt="">':'')+'</span>';
    }
    return '<div class="ftt-traits ftt-clash" role="group" aria-label="'+esc(slotName)+': '+esc(keep.n)+' or '+esc(lose.n)+', one stays">'
      +'<span class="ftt-traits-label"><span>'+esc(slotName)+'</span><b>' + esc(text("text_art_1_stays", "1 stays")) + '</b></span>'
      +'<span class="ftt-slots">'+cell(keep,true)+'<span class="ftt-vs">' + esc(text("text_art_vs", "VS")) + '</span>'+cell(lose,false)+'</span></div>';
  }
                                                                                
                                                                               
                                                                           
                                                                            
                            
                                                                                   
  var GAP=26, BADGE=69, EDGE=8, TAIL=22;
  function placeCard(view,spot,card){
    var left=Math.max(EDGE,(view.w-card.w)/2);
    var tailX=Math.max(34,Math.min(card.w-34,spot.x-left));
    var above=spot.y-spot.r-GAP-card.h, below=spot.y+spot.r+GAP, tight=Math.max(EDGE,above);
    if(above-BADGE>=EDGE) return {mode:'above',left:left,top:above,tailX:tailX};
    if(below+card.h<=view.h-EDGE) return {mode:'below',left:left,top:below,tailX:tailX};
    if(tight+card.h+TAIL<=spot.y-spot.r) return {mode:'tight',left:left,top:tight,tailX:tailX};
    var top=spot.y>view.h/2 ? EDGE+BADGE : view.h-EDGE-card.h;
    return {mode:'over',left:left,top:Math.max(EDGE,top),tailX:tailX};
  }
  var api={sameSlotClash:sameSlotClash,goalSlotClash:goalSlotClash,clashHTML:clashHTML,registry:registry,receipt:receipt,request:request,playerMerge:playerMerge,pondReturn:pondReturn,bunnyComplete:bunnyComplete,upgradesUnlocked:upgradesUnlocked,rematchDue:rematchDue,rematchReady:rematchReady,outOfTadpoles:outOfTadpoles,expeditionUnlocked:expeditionUnlocked,autoRunReady:autoRunReady,noTicketReveal:noTicketReveal,tadpolesWon:tadpolesWon,hatchAgain:hatchAgain,auraLessonDue:auraLessonDue,grimoireIntro:grimoireIntro,familyFound:familyFound,familyIntro:familyIntro,familyUnlockedShown:familyUnlockedShown,gearReady:gearReady,materialsShort:materialsShort,expansionIntro:expansionIntro,padsShown:padsShown,blueprintWon:blueprintWon,seedsWon:seedsWon,flowerBoostDue:flowerBoostDue,plantReady:plantReady,ticketPrompt:ticketPrompt,shopIntroReady:shopIntroReady,shopTourReady:shopTourReady,SHOP_TOUR:SHOP_TOUR,harvestIntroReady:harvestIntroReady,acknowledge:acknowledge,held:held,bannerSpotlit:bannerSpotlit,placeholder:placeholder,rememberFrog:rememberFrog,traitsHTML:traitsHTML,placeCard:placeCard,familyIndex:familyIndex,lockSlotFor:lockSlotFor,sproutedNewFamily:sproutedNewFamily,stackedTraits:stackedTraits,CONTINUE_DELAY_MS:CONTINUE_DELAY_MS};
  if(typeof module!=='undefined' && module.exports) module.exports=api;
  if(!g.document) return;
  g.FtueTooltips=api;
  var queued=null, oldFocus=null, inertNodes=[], followupQueued=false;
  var tadTileSince=0, bpTileSince=0, seedTileSince=0, TILE_SETTLE_MS=1200;
  function save(){if(typeof queueSave==='function')queueSave();}
                                                                        
  function releaseHold(r,s){
    if(r.pending.length || !r.heldAt) return;
    s=s || state;
    var dt=Date.now()-r.heldAt;
    (s.eggs||[]).forEach(function(e){if(e && e.readyAt)e.readyAt+=dt;});
    if(s.tadpoleResetAt) s.tadpoleResetAt+=dt;
    delete r.heldAt;
  }
  function persist(){
                                                                              
                                                                                
    if(g.storage && typeof SAVE_KEY!=='undefined'){
      Promise.resolve(g.storage.set(SAVE_KEY,JSON.stringify(state),false)).catch(function(){});
    }
    save();
  }
                                                                              
                                                                           
                                                                
  api.revealedWithoutTicket=function(claim,R){
    if(typeof state==='undefined' || !state || !claim || claim.auto || claim.ticket || !R || !g.FamilyTicket) return;
    var fam=null;
    try{ fam=FamilyTicket.familyOfRoll({phase:'ready',skin:R.skin},EXP_SKINS); }catch(e){ fam=null; }
    if(noTicketReveal(state,fam,!!(fam && g.AutoExpeditions && AutoExpeditions.setDone(fam)))) save();
  };
                                                                           
                                                                                
                                                                          
                                                                               
                                                                             
                                                                  
  api.holdReceipt=function(){
    if(typeof state==='undefined' || !state) return false;
    var asked=tadpolesWon(state,!!document.querySelector(find('tooltip-tadpoles').target));
    asked=blueprintWon(state,firstMatch(find('tooltip-blueprint').target)) || asked;
    asked=seedsWon(state,!!firstMatch(find('tooltip-seeds').target)) || asked;
    if(!asked) return false;
    save(); api.sync();
    return !!document.getElementById('ftue-tooltip');
  };
                                                                               
                                                                           
                                                                               
  api.gearEquipped=function(frogId,slot,before,hadGear){
    if(typeof state==='undefined' || !state || !g.Equipment || !Equipment.UI) return false;
    var r=receipt(state);
    if(r.seen['tooltip-gear-boost'] || r.pending.indexOf('tooltip-gear-boost')>=0) return false;
    var f=(state.frogs||[]).find(function(x){return x.id===frogId;}), inst=Equipment.equippedOn(state,frogId,slot), row=null;
    try{ row=inst && Equipment.itemRow(inst.item_id); }catch(e){ row=null; }
    if(!f || !row) return false;
    var b=g.GrimoireUI ? GrimoireUI.gearBoosts(row)[0] : null, stat=b && STAT_NAMES[b.kind] ? b.kind : null;
    var after=stat && typeof frogStats==='function' ? frogStats(f) : null;
    var asked=gearEquipped(state,{frog:frogId, slot:slot, item:inst.item_id, name:Equipment.UI.displayName(row), art:Equipment.UI.itemArtSrc(row),
      stat:stat, label:b ? b.label : '', from:before && after ? before[stat] : null, to:after ? after[stat] : null},
      !!hadGear || !!state.ftueDone || (state.ftueLoop||0)>=5);
    if(!asked){ save(); return false; }
    persist(); api.sync();
    return true;
  };
                                                                                 
                                                                                
                                                                        
                                                                        
  function pondVisibleNow(){
    return typeof activeSheet!=='undefined' && !activeSheet && !document.querySelector('#claim-modal,.cl-overlay') &&
      !(typeof claimInFlight==='function' && claimInFlight()) && !(g.PondFlagPrompt && PondFlagPrompt.waiting());
  }
                                                                                 
                                                                                 
                                                                            
                                                                           
  function pondDrawnNow(){ return pondVisibleNow() && !document.querySelector('.xm-fullscreen,.xps-stage,.gp-page'); }
                                                                                      
  function onPondCardScreen(t){
    if(pondDrawnNow()) return true;
    return t.pond==='shop' && typeof activeSheet!=='undefined' && activeSheet==='shop' && !!document.querySelector('.fp-shop') &&
      !document.querySelector('#claim-modal,.cl-overlay');
  }
                                                                               
                                                                            
  api.sync=function(){
    if(typeof state==='undefined' || !state) return;
    if(queued==='tooltip-upgrades' && !upgradesNeeded(state)) queued=null;
                                                                                    
    var pondVisible=pondVisibleNow();
                                                                                   
                                                                                   
                                                                              
                                                                             
    var pondDrawn=pondVisible && !document.querySelector('.sheet-scrim,.hv-page,.xm-fullscreen,.xps-stage,.gp-page');
    var gearPond=pondDrawn && state.ftueLoop===4 && state.ftueL4Step==='craft' && g.FtueSteps && FtueSteps.equipmentPondSettled();
    if(pondReturn(state,pondDrawn)) save();
                                                                               
                                                                                
                                                                              
                                                                              
                                                                              
                                                          
    if(pondDrawn && typeof FtueSteps!=='undefined' && FtueSteps.expansionGuidanceActive && FtueSteps.expansionGuidanceActive() &&
      expansionIntro(state,true)) save();
                                                                               
                                                                              
                                                                         
                                                                         
    var ticketBtn=document.querySelector('#claim-modal #claim-ticket[data-stage]');
    if(ticketBtn && !document.getElementById('ftue-tooltip') && ticketPrompt(state,Number(ticketBtn.dataset.stage))){
      var tq=receipt(state).pending, tid=tq.pop();
      tq.unshift(tid); queued=null; save();
    }
    var outOfFight=!document.querySelector('.cl-overlay');
                                                                                 
                                                                            
    var expBtn=document.querySelector(find('tooltip-exp-unlock').target);
    if(expeditionUnlocked(state,outOfFight && !!expBtn && expBtn.getBoundingClientRect().width>0)) save();
                                                                                   
                                                                                 
                                                                                               
    var foundRq=receipt(state);
    if(pondDrawn && !(typeof PondExpansionCamera!=='undefined' && PondExpansionCamera.active()) && !foundRq.seen['tooltip-family-found'] && foundRq.pending.indexOf('tooltip-family-found')<0 && typeof FtueSteps!=='undefined' && FtueSteps.familyGoalFamily){
      var famCodex=document.querySelector(find('tooltip-family-found').target);
      if(famCodex && famCodex.getBoundingClientRect().width>0 && familyFound(state,true,FtueSteps.familyGoalFamily())) save();
    }
    var gearCraft=pondDrawn && state.ftueLoop===4 && g.EquipmentCraft && EquipmentCraft.active(state) && EquipmentCraft.guide(state);
    if(gearReady(state,gearPond && (!g.FtueSteps || FtueSteps.equipmentObjectiveReady()),gearCraft ? gearCraft.frogId : (state.ftueEquipmentCraft||{}).frogId)) save();
    var dock=document.querySelector('.bottom-dock'), upg=dock && dock.querySelector('.dock-btn[aria-label="Upgrades"]');
                                                                                    
    var zooming=typeof PondExpansionCamera!=='undefined' && PondExpansionCamera.active();
    var upgDock=!dock?'':!upg?'locked':upg.getBoundingClientRect().width?'open':'';
    if(upgradesUnlocked(state,upgDock,pondDrawn && !zooming)) save();
    if(padsShown(state,typeof activeSheet!=='undefined' && activeSheet==='upgrades' &&
      !!document.querySelector('.fp-uprow[data-upgrade="hatching-pad"]:not(.kit-uprow--blocked)'))) save();
                                                                         
                                                          
    var spotlightsIdle=!document.querySelector('#family-spotlight,.fm-assimilating') &&
      !(typeof familySpotlightQueue!=='undefined' && familySpotlightQueue.length);
    if(rematchReady(state,pondDrawn && spotlightsIdle)) save();
                                                                           
                                                                          
                                                                             
    var tadTile=document.querySelector(find('tooltip-tadpoles').target);
    if(tadTile && tadTile.classList.contains('xr-pending')) tadTile=null;
    if(!tadTile) tadTileSince=0;
    else if(!tadTileSince) tadTileSince=Date.now();
    if(tadpolesWon(state,!!tadTile && (tadTile.classList.contains('xr-landed') || Date.now()-tadTileSince>=TILE_SETTLE_MS))) save();
    var bpTile=firstMatch(find('tooltip-blueprint').target);
    if(!bpTile) bpTileSince=0;
    else if(!bpTileSince) bpTileSince=Date.now();
    if(blueprintWon(state,Date.now()-bpTileSince>=TILE_SETTLE_MS && bpTile)) save();
    var seedTile=firstMatch(find('tooltip-seeds').target);
    if(!seedTile) seedTileSince=0;
    else if(!seedTileSince) seedTileSince=Date.now();
    if(seedsWon(state,!!seedTile && Date.now()-seedTileSince>=TILE_SETTLE_MS)) save();
                                                                                       
    if(flowerBoostDue(state,outOfFight && !document.querySelector('#claim-modal'))) save();
    if(plantReady(state,pondVisible && !document.querySelector('.xm-fullscreen,.xps-stage,#flower-chooser') && !!document.querySelector('.flower-pad.empty'))) save();
                                                                                   
                                                                                 
                                  
    var auraWaiting=!!(g.AuraReminder && typeof FT!=='undefined' && AuraReminder.waiting(state,FT));
    if(pondDrawn && !state.grimoireUnlocked && auraLessonDue(state,auraWaiting)){ state.grimoireUnlocked=true; save(); }
    var codexBtn=document.querySelector(find('tooltip-grimoire').target);
    if(grimoireIntro(state,pondDrawn && !!codexBtn && codexBtn.getBoundingClientRect().width>0,auraWaiting)) save();
    if(hatchAgain(state,pondDrawn && !!document.querySelector('.lilypad.egg-pad'),auraWaiting)) save();
                                                                                        
                                                                                  
    var famCardShown=typeof activeSheet!=='undefined' && activeSheet==='grimoire' && typeof grimTab!=='undefined' && grimTab==='families' && !!foundRq.foundFamily &&
      !!document.querySelector(find('tooltip-family-unlocked').target) && !document.querySelector('#family-spotlight');
    if(famCardShown && !foundRq.seen['tooltip-family-unlocked'] && typeof FtueSteps!=='undefined' && FtueSteps.familyGoalFamily &&
      familyUnlockedShown(state,true,FtueSteps.familyGoalFamily())) save();
                                                                               
                                                                             
    if(pondDrawn && lockLessonGuarantee(state)) save();
                                                                            
    var shopShown=typeof activeSheet!=='undefined' && activeSheet==='shop' && !!document.querySelector('.fp-shop');
    if(shopIntroReady(state,(pondDrawn || shopShown) && !!document.querySelector(find('tooltip-shop').target) &&
      !document.querySelector('#labor-window,#flower-inspect-focus,#family-spotlight'))) save();
    if(shopTourReady(state,shopShown)) save();
    var harvestBtn=document.querySelector('.bottom-dock .dock-btn[aria-label="Harvesting"]'), harvestShown=typeof activeSheet!=='undefined' && activeSheet==='harvesting' && !!document.querySelector('.hv-page');
    if(harvestIntroReady(state,((!!harvestBtn && harvestBtn.getBoundingClientRect().width>0) || (state.ftueL4HarvestAwaitIntro && pondDrawn)) && (pondDrawn || harvestShown) &&
      !document.querySelector('#claim-modal,.cl-overlay,#labor-window,#family-spotlight'))) save();
                                                                                       
                                                                                      
                                                                                            
    var AX=g.AutoExpeditions, rq=receipt(state);
    var autoCardOpen=typeof activeSheet!=='undefined' && activeSheet==='expeditions' && typeof expeditionView!=='undefined' && expeditionView==='ladder' &&
      typeof expeditionCardNo!=='undefined' && expeditionCardNo!=null && !!document.querySelector(find('tooltip-auto').target) &&
      !document.querySelector('#claim-modal,.cl-overlay,#family-spotlight');
    var autoCardShown=autoCardOpen && !(g.EMap && EMap.cardPlaced && !EMap.cardPlaced(expeditionCardNo));
                                                             
    if(AX && autoCardShown && rq.autoFamily && !rq.seen['tooltip-auto'] && !rq.pending.length && !document.getElementById('ftue-tooltip')){
      if(autoRunReady(state,expeditionCardNo,AX.introFamily(expeditionCardNo))) save();
    }
    var r=receipt(state);
    if(r.pending.indexOf('tooltip-gear')>=0 && !(gearPond && state.ftueL4Step==='craft') &&
      !document.querySelector('#ftue-tooltip[data-tooltip="tooltip-gear"]')){
      r.pending=r.pending.filter(function(id){return id!=='tooltip-gear';});
      if(queued==='tooltip-gear') queued=null;
      releaseHold(r); save();
    }
                                                                               
                                                                              
    if(!queued && r.pending.length && /^tooltip-ticket-/.test(r.pending[0]) && !firstMatch(find(r.pending[0]).target)){
      r.pending.shift();
      if(!r.pending.length && r.heldAt){
        var heldFor=Date.now()-r.heldAt;
        (state.eggs||[]).forEach(function(e){if(e && e.readyAt)e.readyAt+=heldFor;});
        if(state.tadpoleResetAt) state.tadpoleResetAt+=heldFor;
        delete r.heldAt;
      }
      save();
    }
                                                                               
                                   
    if(r.pending.some(function(id){ var t=find(id); return t && t.off; })){
      r.pending=r.pending.filter(function(id){
        var t=find(id); if(!(t && t.off)) return true;
        if(r.frogs) delete r.frogs[id];
        if(t.clash) delete r[t.clash===true?'clash':t.clash];
        return false;
      });
      releaseHold(r);
      save();
    }
                                                                                 
                                                                               
                                                                                
                                                                                  
    var head=!queued && r.pending.length && find(r.pending[0]);
    var upgShown=typeof activeSheet!=='undefined' && activeSheet==='upgrades' && !!document.querySelector('.fp-upgrades-content');
    var grimShown=typeof activeSheet!=='undefined' && activeSheet==='grimoire' && !!document.querySelector('.gp-page') && !document.querySelector('#family-spotlight');
    if(head && head.sheet && !(head.sheet==='shop' ? shopShown : head.sheet==='upgrades' ? upgShown : head.sheet==='grimoire' ? grimShown && !!firstMatch(head.target) : head.sheet==='expeditions' && autoCardOpen)){
      r.pending=r.pending.filter(function(id){ var t=find(id); return !(t && t.sheet); });
      releaseHold(r);
      save();
    }
                                                                               
                                                                             
    if(r.deferredLockTip){ delete r.deferredLockTip; save(); }
    if(r.pending.indexOf('tooltip-4b')>=0 && (!r.clash || !expedition2WinClaimed(state))){
      delete r.clash; delete r.lockObjective;
      r.pending=r.pending.filter(function(id){return id!=='tooltip-4b';});
      if(r.frogs) delete r.frogs['tooltip-4b'];
      if(!r.pending.length && r.heldAt){
        var heldMs=Date.now()-r.heldAt;
        (state.eggs||[]).forEach(function(e){if(e && e.readyAt)e.readyAt+=heldMs;});
        if(state.tadpoleResetAt) state.tadpoleResetAt+=heldMs;
        delete r.heldAt;
      }
      save();
    }
                                                                             
    if(r.pending.indexOf('tooltip-goal-lock')>=0 && !r.goalClash){
      delete r.lockObjective;
      r.pending=r.pending.filter(function(id){return id!=='tooltip-goal-lock';});
      if(r.frogs) delete r.frogs['tooltip-goal-lock'];
      releaseHold(r);
      save();
    }
                                                                                
    if(r.pending.indexOf('tooltip-lock-safety')>=0 && !r.lockSafety){
      r.pending=r.pending.filter(function(id){return id!=='tooltip-lock-safety';});
      if(r.frogs) delete r.frogs['tooltip-lock-safety'];
      releaseHold(r);
      save();
    }
    if(r.pending.length && !queued){
      queued=r.pending[0];
      if(!r.heldAt){r.heldAt=Date.now();save();}
                                                                               
                                                                                
                                                                              
                                                                                     
      var qt=find(queued);
      if(qt && (qt.overReceipt || qt.overInspect || qt.sheet==='grimoire') && firstMatch(qt.target)) show(queued);
      else queueFamilySpotlight(function(){show(queued);});
    }
    if(!r.bunnyFollowup) followupQueued=false;
    if(r.bunnyFollowup && !followupQueued){
      followupQueued=true;
      var f=state.frogs.find(function(f){return f.id===r.bunnyFollowup;});
      if(f){
        familySpotlight('bunny',f);
        queueFamilySpotlight(function(){
          delete r.bunnyFollowup; save(); showFirstExpeditionReady();
        });
      }else{delete r.bunnyFollowup; save();}
    }
  };
                                                                           
                   
  function mergeContext(parents,frog){
    if(typeof FT==='undefined' || !FT.families || !FT.SLOTS) return {};
    var index=familyIndex(FT.families(),FT.SLOTS), ctx={};
    ctx.newTraits=!!frog && sproutedNewFamily(parents,frog.traits,index);
    if(frog) ctx.stacked=stackedTraits(parents,frog.traits);
    return ctx;
  }
                                                                              
                                                                              
                                                                              
                                                                          
                                                                             
                                                                            
                                                                              
                                                                               
                                                                              
                                                                            
                                                                          
                                                                       
                                                                              
                            
  function lockLessonWindow(s){
    return !!(s && (s.ftueLoop||0)>=2 && (s.ftueLoop||0)<=3);
  }
                                                                             
                                                                               
                                                                              
                                                                              
                                                                           
                                                                               
                                                                           
                                                                           
  api.sameSlotPause=function(fromId,toId){
    if(typeof state==='undefined' || !state || typeof FT==='undefined' || !FT.families || !lockLessonWindow(state)) return false;
    var r=receipt(state);
    var a=(state.frogs||[]).find(function(f){return f.id===fromId;}), b=(state.frogs||[]).find(function(f){return f.id===toId;});
    var index=familyIndex(FT.families(),FT.SLOTS), rank=function(k){
      var d=FT.traitDef(k); return d && FT.RARITY[d.r] ? FT.RARITY[d.r].rank : 0;
    };
    var goal=typeof FtueSteps!=='undefined' && FtueSteps.familyGoalFamily ? FtueSteps.familyGoalFamily() : null;
    var goalClash=goal && goalSlotClash(a,b,goal,index,FT.canLock,FT.SLOTS,rank);
    if(goalClash){
      if(!request(state,'tooltip-goal-lock')) return false;
      r.goalClash=goalClash; (r.frogs||(r.frogs={}))['tooltip-goal-lock']=goalClash.frog;
      r.lockObjective={frog:goalClash.frog, slot:goalClash.slot, family:goalClash.family};
      persist();
      return true;
    }
    if(r.seen['tooltip-4b'] || r.pending.indexOf('tooltip-4b')>=0 || !expedition2WinClaimed(state)) return false;
    var bunnyDone=(state.familiesClaimed||[]).indexOf('bunny')>=0;
    var clash=sameSlotClash(a,b,index,FT.canLock,FT.SLOTS,rank,bunnyDone);
    if(!clash || !request(state,'tooltip-4b')) return false;
    r.clash=clash; (r.frogs||(r.frogs={}))['tooltip-4b']=clash.frog;
    r.lockObjective={frog:clash.frog, slot:clash.slot, family:index[baseKey(clash.keep)]};
    persist();
    return true;
  };
                                                                            
                                                                           
                                                                              
                                                                     
                                                                           
                                                                           
                                                                       
                                                                               
                                                                        
                                                                           
                                                                               
                                                                        
                                                                           
                                                                     
                                                                            
                                                                         
                                                                            
                                                                        
                                     
  function lockLessonGuarantee(s){
    if(!s || !s.ftueFamilyGoalDone || typeof FT==='undefined' || !FT.families || !lockLessonWindow(s)) return false;
    var r=receipt(s);
    if(r.seen['tooltip-4b'] || r.seen['tooltip-goal-lock']) return false;
    var famId=r.foundFamily; if(!famId) return false;
    var frog=(s.frogs||[]).find(function(f){ var fam=FT.familyOf && FT.familyOf(f); return fam && fam.id===famId; });
    if(!frog) return false;
    var index=familyIndex(FT.families(),FT.SLOTS);
    var slot=lockSlotFor(frog.traits,index,FT.canLock,FT.SLOTS);
    if(!slot || (frog.locked && frog.locked[slot])) return false;
    if(!request(s,'tooltip-lock-safety')) return false;
    r.lockSafety={frog:frog.id, slot:slot, keep:frog.traits[slot]};
    (r.frogs||(r.frogs={}))['tooltip-lock-safety']=frog.id;
    persist();
    return true;
  }
  api.lockLessonGuarantee=lockLessonGuarantee;
  api.onMerge=function(opts,family,frog,parents){
    var before=receipt(state).pending.slice();
    playerMerge(state,opts,mergeContext(parents,frog));
    var bunny=!(opts.cinematic || opts.ftueForce || opts.scripted) && bunnyComplete(state,family);
    rememberFrog(state,before,frog && frog.id);
    if(bunny){
      receipt(state).bunnyFollowup=frog.id;
      state.sentFirstNudge=1;
    }
    save();
                                                                    
    return !!receipt(state).bunnyFollowup;
  };
  api.paused=function(){return typeof state!=='undefined' && held(state);};
                                                                      
  function holdContinue(wrap){
    var btn=wrap.querySelector('#ftt-continue');
    if(!btn || typeof setTimeout!=='function') return;
    holdButton(btn,CONTINUE_DELAY_MS,function(){
      if(document.getElementById('ftue-tooltip')===wrap) btn.focus();
    });
  }
                                                                              
                                                     
  function holdButton(btn,ms,done){
    var end=Date.now()+ms, badge=document.createElement('span');
    badge.className='ftt-count'; badge.setAttribute('aria-hidden','true');
    btn.disabled=true; btn.appendChild(badge);
    (function tick(){
      if(!btn.isConnected) return;
      var left=end-Date.now();
      if(left<=0){ badge.remove(); btn.disabled=false; if(done) done(); return; }
      badge.textContent=Math.ceil(left/1000);
      setTimeout(tick,Math.min(250,left));
    })();
  }
  api.holdButton=holdButton;
                                                                             
                                                                             
                                                                               
                                                                              
                                                                                 
                                                                               
                                                                                 
  function startLockGuide(frogId,slot,price){
    var f=(state.frogs||[]).find(function(x){return x.id===frogId;});
    if(!f || typeof FT==='undefined' || !FT.families) return;
    if(!slot || !f.traits[slot]) slot=lockSlotFor(f.traits,familyIndex(FT.families(),FT.SLOTS),FT.canLock,FT.SLOTS);
    if(!slot) return;
    var gd=receipt(state).lockGuide={frog:frogId,slot:slot,key:f.traits[slot]};
    if(price!=null) gd.price=price;
    save();
  }
                                                                          
                                                                         
  api.lessonLockPrice=function(frog,slot){
    var gd=typeof state!=='undefined' && state && state.ftueTooltips && state.ftueTooltips.lockGuide;
    return gd && gd.price!=null && frog && gd.frog===frog.id && gd.slot===slot && frog.traits && frog.traits[slot]===gd.key ? gd.price : null;
  };
  var guideSprite=null;
  function parkGuideFrog(id,spr){
    if(guideSprite && guideSprite.spr===spr) return;
    releaseGuideFrog(); guideSprite={id:id,spr:spr};
    if(!spr.ftueSpot) spr.ftueSpot=true;
  }
  function releaseGuideFrog(){
    var g2=guideSprite; guideSprite=null; if(!g2) return;
    var parked=g2.spr.ftueSpot==='parked'; delete g2.spr.ftueSpot;
    if(parked && typeof scheduleWander==='function') scheduleWander(g2.id);
  }
  function endLockGuide(){
    var r=receipt(state); if(r.lockGuide){ delete r.lockGuide; save(); }
    releaseGuideFrog();
  }
  function isLockButton(b){ return /\bLock\b/.test(b.textContent||''); }
  api.lockGuide=function(p){
    if(typeof state==='undefined' || !state) return false;
                                                                                   
    if(!lockLessonWindow(state)){ if(receipt(state).lockGuide) endLockGuide(); return false; }
    var objective=currentLockObjective();
    if(objective && g.ObjectiveStack && g.ObjectiveStack.transitioning(objective.transition)){
      p.classList.remove('on','tap','grabbing','send-target','craft-target');
      if(typeof stopMergeDemo==='function') stopMergeDemo();
      return true;
    }
    var gd=receipt(state).lockGuide; if(!gd) return false;
    var f=(state.frogs||[]).find(function(x){return x.id===gd.frog;});
                                                                         
    if(!f || !f.traits || !f.traits[gd.slot] || (gd.key && f.traits[gd.slot]!==gd.key) || (f.locked && f.locked[gd.slot])){ endLockGuide(); return false; }
    var hide=function(){ p.classList.remove('on','tap','grabbing','send-target','craft-target'); return true; };
    if(held(state) || document.querySelector('#claim-modal,#family-spotlight,.big-unlock,.cl-overlay,#body-hint,.showcase-overlay,.evo-overlay')) return hide();
    var win=document.getElementById('labor-window'), target=null;
    if(win){
      releaseGuideFrog();
      var tile=win.querySelector('.fi-trait.fi-'+gd.slot);
      if(!tile || (tile.getAttribute('onclick')||'').indexOf(gd.frog)<0) target=win.querySelector('.fi-close');                                              
      else{
        var lock=Array.prototype.filter.call(win.querySelectorAll('.fi-trait-actions button'),isLockButton)[0];
        var open=typeof _traitOpen!=='undefined' && _traitOpen.frog===gd.frog && _traitOpen.slot===gd.slot;
        target=open && lock ? lock : tile;
                                                                               
                                                                   
                                                                                     
        if(target===lock && lock.disabled && !gd.shownLock){ gd.shownLock=true; request(state,'tooltip-bones'); save(); }
      }
    }else{
      if(gd.shownLock){ endLockGuide(); return false; }
      if(typeof activeSheet!=='undefined' && activeSheet) return hide();
      var spr=typeof wanderingSprites!=='undefined' && wanderingSprites[gd.frog];
      if(!spr || !spr.el.isConnected) return hide();
      parkGuideFrog(gd.frog,spr);
      target=spr.el.querySelector('.frog-hop')||spr.el;
    }
    if(!target || typeof GuidedHand==='undefined') return hide();
    GuidedHand.place(p,target);
    return true;
  };
                                                                      
  document.addEventListener('click',function(e){
    if(typeof state==='undefined' || !state || !receipt(state).lockGuide) return;
    var b=e.target && e.target.closest && e.target.closest('#labor-window .fi-trait-actions button');
    if(b && isLockButton(b)) setTimeout(endLockGuide,0);
  },true);
                                                                              
                                                                          
                                                                     
                                                                        
                                                                         
                                                                       
                                                                           
                                                                              
                                                                     
                                                                          
                                                                            
                                                 
  function currentLockObjective(){
    var r=receipt(state), o=r.lockObjective;
    if(!o) return null;
                                                                              
                                                                    
                                                                              
                                                                          
                                                                          
    if(!lockLessonWindow(state)){ delete r.lockObjective; save(); return null; }
    var f=(state.frogs||[]).find(function(x){return x.id===o.frog;});
                                                                               
                                                                              
                                                             
    if(!f){ delete r.lockObjective; save(); return null; }
    var locked=!!(f.locked && f.locked[o.slot]);
    if(locked && o.mergesAtLock==null){
      o.mergesAtLock=r.merges;
      if(g.ObjectiveStack){
        o.transition=g.ObjectiveStack.transition();
        if(typeof setTimeout==='function') setTimeout(function(){if(typeof render==='function') render();},o.transition.duration);
      }
      save();
    }
    if(o.mergesAtLock!=null && r.merges>o.mergesAtLock){ delete r.lockObjective; save(); return null; }
    return {slot:o.slot, family:o.family, locked:locked, transition:o.transition};
  }
  function lockObjectiveFamilyName(id){
    var d=null; try{ d=id && g.FT && FT.familyDefOf(id); }catch(e){ d=null; }
    return (d && d.n) || '';
  }
  function lockObjectiveBannerHTML(){
    var o=currentLockObjective();
    if(!o || typeof g.ObjectiveStack==='undefined' || typeof taskPlateHTML!=='function') return '';
    var step1=text('text_lock_objective_step1','Lock the {family} trait',{family:lockObjectiveFamilyName(o.family)});
    var step2=text('text_lock_objective_step2','Merge the frogs');
    return g.ObjectiveStack.render([
      {text:step1, have:o.locked?1:0, need:1},
      {text:step2, have:0, need:1}
    ], o.locked?1:0, 'lock-trait',o.transition);
  }
  api.lockObjectiveActive=function(){ return !!currentLockObjective(); };
  api.lockObjectiveBannerHTML=lockObjectiveBannerHTML;
                                                                              
                                                                         
                                                                        
                                                                              
                                                                         
  var spotSprites=[], SPOT_MIN=96;
  function holdSprite(id,spr){
    if(!spotSprites.some(function(e){return e.spr===spr;})) spotSprites.push({id:id,spr:spr});
    if(!spr.ftueSpot) spr.ftueSpot=true;
    spr.el.classList.add('ftt-spotlit');
    if(!spr.el.querySelector('.ftt-shine')){
      var img=document.createElement('img');img.className='ftt-shine';img.src='assets/tooltips/shine.svg';img.alt='';
      spr.el.insertBefore(img,spr.el.firstChild);
    }
  }
                                                                         
  function releaseSprites(old){
    old.forEach(function(e){
      if(spotSprites.some(function(n){return n.spr===e.spr;})) return;
      var parked=e.spr.ftueSpot==='parked';
      delete e.spr.ftueSpot;
      e.spr.el.classList.remove('ftt-spotlit');
      var shine=e.spr.el.querySelector('.ftt-shine'); if(shine) shine.remove();
      if(parked && typeof scheduleWander==='function') scheduleWander(e.id);
    });
  }
                                                                       
                                                       
                                                              
  function firstMatch(selector){
    var list=[].concat(selector);
    for(var i=0;i<list.length;i++){ var el=document.querySelector(list[i]); if(el) return el; }
    return null;
  }
                                                                               
                                                                            
                                                           
  function onScreen(el){
    var b=el.getBoundingClientRect();
    return b.width>0 && b.right>0 && b.bottom>0 && b.left<innerWidth && b.top<innerHeight;
  }
  function pickTarget(selector,prev){
    if(prev && prev.isConnected && onScreen(prev)) return prev;
    var list=[].concat(selector);
    for(var i=0;i<list.length;i++){
      var best=null, dist=Infinity;
      Array.prototype.forEach.call(document.querySelectorAll(list[i]),function(el){
        if(!onScreen(el)) return;
        var b=el.getBoundingClientRect(), d=Math.hypot((b.left+b.right)/2-innerWidth/2,(b.top+b.bottom)/2-innerHeight/2);
        if(d<dist){ dist=d; best=el; }
      });
      if(best) return best;
    }
    return firstMatch(selector);
  }
                                                                           
                                                                            
  function glideToFrog(b){
    var P=g.PondPresentation, stage=document.querySelector('.pond-stage'), layer=document.getElementById('frog-layer');
    if(!P || !P.glideCamera || !stage || !layer || typeof pondCam==='undefined') return;
    var view=stage.getBoundingClientRect(), L=layer.getBoundingClientRect();
    if(!L.width || !L.height) return;
    P.glideCamera(pondCam.x+(b.left+b.width/2-(view.left+view.width/2))/L.width,
      pondCam.y+(b.top+b.height/2-(view.top+view.height/2))/L.height);
  }
                                                                             
  var RECT_PAD=6, RECT_RADIUS=26;
                                                                            
                                                                         
  function fitScroll(el,cardH){
    var sc=el.parentElement;
    while(sc && !(sc.scrollHeight>sc.clientHeight+1 && /auto|scroll/.test(getComputedStyle(sc).overflowY))) sc=sc.parentElement;
    if(!sc) return;
    var hud=document.querySelector('.hud-top'), dock=document.querySelector('.bottom-dock');
    var dockR=dock && dock.getBoundingClientRect();
    var top=(hud ? hud.getBoundingClientRect().bottom : 0)+EDGE, bottom=(dockR && dockR.height ? dockR.top : innerHeight)-EDGE;
    var b=el.getBoundingClientRect(), s0=sc.scrollTop, max=sc.scrollHeight-sc.clientHeight;
    function at(delta){ var to=Math.max(0,Math.min(max,s0+delta)); return {to:to, top:b.top-(to-s0)-RECT_PAD, bottom:b.bottom-(to-s0)+RECT_PAD}; }
    var above=at(b.bottom+RECT_PAD-bottom), below=at(b.top-RECT_PAD-top);
    var fitsAbove=above.top-GAP-cardH-BADGE>=EDGE && above.bottom<=bottom;
    sc.scrollTop=(fitsAbove ? above : below).to;
  }
  function startSpot(wrap,target){
    var frogId=target.frogId, chosen=null, glided=false, fitted=!target.rect;
    var card=wrap.querySelector('.ftt-card'), spot=document.createElement('div'), tail=document.createElement('div');
    spot.className='ftt-spot';spot.setAttribute('aria-hidden','true');spot.hidden=true;
    tail.className='ftt-tail';tail.setAttribute('aria-hidden','true');tail.innerHTML='<i class="o"></i><i class="i"></i>';
    wrap.insertBefore(spot,card);card.appendChild(tail);
    var last='';
    function frame(){
      if(!wrap.isConnected) return;
      var spr=frogId && typeof wanderingSprites!=='undefined' ? wanderingSprites[frogId] : null;
      var art=frogId ? (spr && spr.el.isConnected ? (spr.el.querySelector('.frog-hop')||spr.el) : null)
                     : (chosen=pickTarget(target.selector,chosen));
      if(art && !fitted){ fitted=true; fitScroll(art,card.offsetHeight); }
      var b=art && art.getBoundingClientRect(), o=wrap.getBoundingClientRect();
      var cx=b ? (b.left+b.right)/2-o.left : -1, cy=b ? (b.top+b.bottom)/2-o.top : -1;
      var onScreen=!!(b && b.width && cx>=0 && cx<=o.width && cy>=0 && cy<=o.height);
      if(spr && b && b.width && !onScreen && !glided){ glided=true; glideToFrog(b); }
      var key='off', p=null, d=0, w=0, pill=false;
      if(onScreen){
        if(spr) holdSprite(frogId,spr);
                                                                         
                                                           
        pill=!spr && b.width>b.height*1.6;
        d=pill ? b.height+16 : Math.max(SPOT_MIN,Math.max(b.width,b.height)*(spr?1.6:1.2));
        w=pill ? b.width+16 : d;
        if(target.rect){ d=b.height+RECT_PAD*2; w=b.width+RECT_PAD*2; }
        p=placeCard({w:o.width,h:o.height},{x:cx,y:cy,r:d/2},{w:card.offsetWidth,h:card.offsetHeight});
        key=[cx,cy,d,w,p.left,p.top,p.tailX].map(Math.round).join()+p.mode;
      }
      if(key!==last){
        last=key;
        wrap.classList.toggle('ftt-spotlit',onScreen);spot.hidden=!onScreen;
        card.classList.remove('ftt-card--above','ftt-card--below','ftt-card--tight','ftt-card--over');
        if(onScreen){
          spot.style.left=(cx-w/2)+'px';spot.style.top=(cy-d/2)+'px';spot.style.width=w+'px';spot.style.height=d+'px';
          spot.style.borderRadius=target.radius ? target.radius+'px' : pill ? d/2+'px' : target.rect ? RECT_RADIUS+'px' : '';
          card.style.left=p.left+'px';card.style.top=p.top+'px';tail.style.left=p.tailX+'px';
          card.classList.add('ftt-card--'+p.mode);
                                                                                  
          var shine=spr && spr.el.querySelector('.ftt-shine'), scale=spr && b.width/(spr.el.offsetWidth||b.width);
          if(shine) shine.style.width=shine.style.height=(d*1.2/scale)+'px';
        }else{card.style.left=card.style.top='';}
      }
      requestAnimationFrame(frame);
    }
    frame();
  }
  function show(id){
    if(id==='tooltip-upgrades' && !upgradesNeeded(state)) return;
    if(id==='tooltip-4b' && !expedition2WinClaimed(state)) return;
    if(id==='tooltip-gear' && !(state.ftueL4Step==='craft' && g.FtueSteps && FtueSteps.equipmentPondSettled())) return;
    var t=find(id);
    if(!t || document.getElementById('ftue-tooltip')) return;
                                                                         
                                                                           
                                         
    if(receipt(state).pending[0]!==id) return;
                                                                           
                                                                            
                                                                                
                                                                                 
    if(t.pond && !onPondCardScreen(t)){ if(queued===id) queued=null; return; }
    if(id==='tooltip-harvest' && state.ftueL4HarvestAwaitIntro){
      delete state.ftueL4HarvestAwaitIntro;state.harvestingUnlocked=true;save();
                                                                            
                                                                             
      if(typeof render==='function') render();
    }
                                                                             
                                                                
                                                                           
                                                                             
                                                                         
                                                                              
                                                                            
                                                                          
                                                                         
                                       
    if(typeof render==='function') render();
    oldFocus=document.activeElement;
    var r=receipt(state), fid=r.frogs && r.frogs[id];
    var frog=fid ? (state.frogs||[]).find(function(f){return f.id===fid;}) : null;
    var wrap=document.createElement('div'); wrap.id='ftue-tooltip'; wrap.dataset.tooltip=id;
    wrap.setAttribute('role','dialog');wrap.setAttribute('aria-modal','true');wrap.setAttribute('aria-labelledby','ftt-title');
    wrap.innerHTML='<div class="ftt-card"><img class="ftt-badge" src="assets/tooltips/badge.png" alt="">'
      +'<h2 id="ftt-title" class="ftt-title">'+esc(t.title||t.name)+'</h2>'
      +'<div class="ftt-art">'+(t.artHTML||placeholder(t))+'</div>'
      +traitsHTML(t,frog,typeof FT!=='undefined'?FT:null)
      +clashHTML(t,t.clash ? r[t.clash===true?'clash':t.clash] : null,typeof FT!=='undefined'?FT:null)
      +KitUI.button({id:'ftt-continue',label:t.button||'Continue',tone:'gold',size:'sm',onclick:'FtueTooltips.continue()'})+'</div>';
    document.body.appendChild(wrap); document.body.classList.add('ftt-held');
                                                                        
                                                                         
                                                                            
                                                                            
                                                                              
                                     
    document.body.classList.toggle('ftt-banner-shown', typeof t.target==='string' && t.target.indexOf('.objective-stack')>=0);
                                                                              
                                                                               
                                       
    if(id==='tooltip-pond-mats' && typeof flashCapPill==='function') flashCapPill(true);
                                                                            
                                                                     
    if(typeof fitTraitThumb==='function') Array.prototype.forEach.call(wrap.querySelectorAll('.ftt-art img.ftt-fit'),fitTraitThumb);
    if(typeof requestAnimationFrame==='function'){
      if(t.spot && fid) startSpot(wrap,{frogId:fid});
      else if(t.target) startSpot(wrap,{selector:t.target,rect:!!t.rect,radius:t.radius});
    }
    holdContinue(wrap);
    if(typeof stopMergeDemo==='function')stopMergeDemo();
                                                                              
                                                                                         
    if(!t.artHTML) fetch(t.art).then(function(r){return r.ok?r.blob():null;}).then(function(blob){
      if(!blob || !wrap.isConnected) return;
      var src=URL.createObjectURL(blob),img=new Image();img.alt=t.caption||t.name;
      img.onload=function(){if(wrap.isConnected){
        var slot=wrap.querySelector('.ftt-placeholder');
        var picture=g.FtueArtText ? FtueArtText.node(t.art,img) : img;
        var key='text_'+t.id.replace(/-/g,'_')+'_caption';
        if(defaults[key] !== undefined && t.caption !== defaults[key]){
          slot.className='ftt-edited-art'; slot.innerHTML='<div class="ftt-edited-picture"></div><p>'+esc(t.caption)+'</p>';
          slot.querySelector('.ftt-edited-picture').appendChild(picture);
        }else slot.replaceWith(picture);
      }URL.revokeObjectURL(src);};
      img.onerror=function(){URL.revokeObjectURL(src);};img.src=src;
    }).catch(function(){});
    inertNodes=Array.from(document.body.children).filter(function(n){return n!==wrap && n.tagName!=='SCRIPT' && !n.inert;});
    inertNodes.forEach(function(n){n.inert=true;});
    wrap.querySelector('button').focus();persist();
  }
  api.continue=function(){
    var wrap=document.getElementById('ftue-tooltip'); if(!wrap) return;
    var r=receipt(state),id=wrap.dataset.tooltip;
                                                                                                 
    var ft=find(id), clashKey=ft && ft.clash ? (ft.clash===true?'clash':ft.clash) : null, clash=clashKey && r[clashKey];
    var guideFrog=clashKey && r.frogs && r.frogs[id];
    var guideSlot=guideFrog && clash && clash.frog===guideFrog ? clash.slot : null;
    if(!acknowledge(state,id)) return;
    if(clashKey) delete r[clashKey];
    if(id==='tooltip-gear-boost') delete r.gearBoost;
    if(guideFrog) startLockGuide(guideFrog,guideSlot,id==='tooltip-goal-lock' && typeof FtueSteps!=='undefined' && FtueSteps.familyGoalLockPrice ? FtueSteps.familyGoalLockPrice() : null);
    if(ft && ft.guide!=null && g.AutoExpeditions) AutoExpeditions.startGuide(ft.guide);
                                                                            
                                                                           
    if(!r.pending.length && r.heldAt){
      var dt=Date.now()-r.heldAt;
      (state.eggs||[]).forEach(function(e){if(e && e.readyAt)e.readyAt+=dt;});
      if(state.tadpoleResetAt)state.tadpoleResetAt+=dt;
      delete r.heldAt;
    }
    var oldSpots=spotSprites; spotSprites=[];
    wrap.remove();document.body.classList.remove('ftt-held','ftt-banner-shown');
    if(id==='tooltip-pond-mats' && typeof unflashCapPill==='function') unflashCapPill();
    inertNodes.forEach(function(n){n.inert=false;});inertNodes=[];queued=null;
                                                                           
                                                                  
                                                                           
                                                                           
                                                                       
                                               
    if((id==='tooltip-aura-pool' || id==='tooltip-family-unlocked') && typeof FtueSteps!=='undefined') FtueSteps.keepGrimoireOpen();
    persist();
                                                                              
                                                                                  
                                                                             
    if(id==='tooltip-grimoire') openGrimoireOnSlots();
                                                                                 
                                                                         
    if(id==='tooltip-family-found') openGrimoireOnFamilies();
                                                                               
                                                                               
                                                                               
    if(r.pending.length){
      queued=r.pending[0];
                                                                              
                                                                             
      var nextTip=find(queued);
      if(!(document.querySelector('#claim-modal') && !(nextTip && nextTip.overReceipt))){
        show(queued);
                                                                                    
        if(document.getElementById('ftue-tooltip')){releaseSprites(oldSpots);return;}
      }else{ var waiting=queued; queueFamilySpotlight(function(){show(waiting);}); }
    }
    releaseSprites(oldSpots);
    if(oldFocus && oldFocus.isConnected)oldFocus.focus();
    api.sync();showNextFamilySpotlight();
    if(typeof FtueSteps!=='undefined' && !held(state))FtueSteps.onPondOpened();
    if(typeof render==='function')render();
                                                                                 
                                                                              
                                                                                
                                                                                 
                                                                                
                                                                              
                                                                    
                                                                                       
    if(id==='tooltip-shop' && !held(state) && typeof openSheet==='function') openSheet('shop');
                                                                                
                                                                                    
                                           
    if(id==='tooltip-harvest' && !held(state) && typeof activeSheet!=='undefined'){
      if(activeSheet==='equipment' && g.EquipmentCraft) EquipmentCraft.harvest();
      else if(activeSheet!=='harvesting' && typeof FtueSteps!=='undefined' && FtueSteps.harvestGuidanceActive()) openSheet('harvesting');
    }
                                                                             
                                                                               
                                                                                    
    if(id==='tooltip-family-unlocked' && !held(state) && typeof activeSheet!=='undefined' && activeSheet==='grimoire' && typeof openPond==='function') openPond();
                                                                                            
    if(id==='tooltip-flower-boost' && !held(state) && typeof activeSheet!=='undefined' && activeSheet && typeof openPond==='function') openPond();
  };
                                                                              
                                                                       
  function openGrimoireOnSlots(){
    if(g.GrimoireTour) GrimoireTour.start(state);
    if(typeof openSheet==='function' && typeof grimSetTab==='function'){
      openSheet('grimoire');
      if(g.GrimoireUI) GrimoireUI.setTraitSlot('head');
      grimSetTab('traits');
    }
  }
  function openGrimoireOnFamilies(){
    if(typeof openSheet==='function' && typeof grimSetTab==='function'){
      openSheet('grimoire');
      grimSetTab('families');
    }
  }
  ['pointerdown','pointerup','click','dblclick','contextmenu','wheel','touchstart','touchmove','keydown','keyup'].forEach(function(type){
    document.addEventListener(type,function(e){
      if(typeof COMBAT_TEST_MODE!=='undefined' && COMBAT_TEST_MODE && e.target.closest && e.target.closest('#combat-test')) return;
      var wrap=document.getElementById('ftue-tooltip');if(!wrap)return;
      var button=wrap.querySelector('button');
      if(!button.contains(e.target) || (type==='keydown' && ['Tab','Escape'].indexOf(e.key)>=0)){
        e.preventDefault();e.stopImmediatePropagation();button.focus();
      }else if(type==='pointerdown' && (find(wrap.dataset.tooltip)||{}).overInspect){
                                                                        
                                                                               
                                                                          
        e.stopImmediatePropagation();
      }
    },{capture:true,passive:false});
  });
  setInterval(function(){if(typeof state!=='undefined' && state){api.sync();showNextFamilySpotlight();}},100);
})(typeof window!=='undefined'?window:globalThis);
