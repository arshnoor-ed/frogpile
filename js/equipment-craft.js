                                                                            
                                                                        
                                                                         
                                                               
                                  
(function(g){
  'use strict';
  var upgradeTab='build', slot='weapon', selected=null, lastInstance=null, inspectFrogId=null;
  var WORKSHOP_ART='assets/ui2/screens/upgrades/icon-workshop.png';
  var SLOT_ART={weapon:'assets/ui2/grimoire/tab_sword.png',shield:'assets/ui2/grimoire/tab_shield.png'};                           
                                                                                
  var MATERIAL_ORDER=['wood','stone','seeds','bones','tadpoles'];
  function active(s){ return !s.ftueDone && s.ftueLoop===4 && ['equipment_preview','craft'].includes(s.ftueL4Step); }
                                                                                                          
  function lessonWeapon(s){ return Equipment.itemRow(Equipment.lessonWeaponItemId(s)); }
  function guide(s){
    if(!active(s)) return null;
    var row=lessonWeapon(s);
    if(!row) throw new Error('[EquipmentCraft] Equipment has no sword');
    var receipt=s.ftueEquipmentCraft;
    if(!receipt){
      var frog=(s.frogs||[]).slice().sort(function(a,b){return (b.tier||0)-(a.tier||0);})[0];
      receipt=s.ftueEquipmentCraft={itemId:row.item_id, frogId:frog&&frog.id, instanceId:null, selected:false};
    }
                                                                                      
                                                                                 
    if(!receipt.instanceId && !receipt.chosen && !canMake(s,receipt.itemId)){
      var fresh=Equipment.defaultLessonWeaponItemId(s);
      if(fresh!==receipt.itemId && canMake(s,fresh)) receipt.itemId=fresh;
    }
                                                                            
    if(!(s.frogs||[]).some(function(f){return f.id===receipt.frogId;})){
      var replacement=(s.frogs||[]).slice().sort(function(a,b){return (b.tier||0)-(a.tier||0);})[0];
      receipt.frogId=replacement&&replacement.id;
    }
    return receipt;
  }
                                                                                                   
  function canMake(s,id){ try{ return Equipment.canCraft(s,id) && Equipment.blueprintFor(s,id).count>0; }catch(e){ return false; } }
  function complete(s){
    var r=s.ftueEquipmentCraft, inst=r&&Equipment.findInstance(s,r.instanceId);
                                                                                 
                                                                                 
    return !!(inst && inst.slot==='weapon' && inst.equippedBy
      && (s.frogs||[]).some(function(f){return f.id===inst.equippedBy;}));
  }
                              
  function equipping(s){ var r=active(s)&&s.ftueEquipmentCraft; return !!(r && r.instanceId && !complete(s)); }
                                                                            
                                                             
  function pondFrogs(s){ return (s.frogs||[]).filter(function(f){ return !(typeof expFrogBusy==='function' && expFrogBusy(f.id)); }); }
  function worn(s,f,k){ return Equipment.equippedOn(s,f.id,k); }
  function pairDone(s){ return pondFrogs(s).some(function(f){ return worn(s,f,'weapon') && worn(s,f,'shield'); }); }
                                                                                 
  function shieldReachable(s){
    return Equipment.inventoryFor(s,'shield').length>0 || Equipment.slotBlueprintTotal(s,'shield')>0 ||
      (s.frogs||[]).some(function(f){ return worn(s,f,'shield'); });
  }
                                                                                         
                                                                             
  function weaponReachable(s){
    return Equipment.inventoryFor(s,'weapon').length>0 || pondFrogs(s).some(function(f){ return worn(s,f,'weapon'); });
  }
                                                                                 
                                                                                   
                                                                                
  function releaseOrphans(s){
    var ids={},n=0; (s.frogs||[]).forEach(function(f){ ids[f.id]=1; });
    Equipment.init(s).items.forEach(function(it){ if(it.equippedBy && !ids[it.equippedBy]){ it.equippedBy=null; n++; } });
    return n;
  }
  function shieldActive(s){ return !s.ftueDone && s.ftueLoop===4 && s.ftueL4Step==='shield'; }
                                                                                   
                                                                                  
                                                                             
  function lessonPiece(s){
    var r=guide(s); if(r) return r.chosen||r.itemId;
    return shieldActive(s) ? (s.ftueL4ShieldChosen||Equipment.lessonShieldItemId(s)) : null;
  }
                                                                                             
  function followPick(s,id){
    if(!canMake(s,id)) return;
    var r=guide(s), type;
    try{ type=Equipment.slotFor(Equipment.itemRow(id).item_type); }catch(e){ return; }
    if(r && !r.instanceId && type==='weapon') r.chosen=id;
    else if(!r && shieldActive(s) && type==='shield') s.ftueL4ShieldChosen=id;
  }
                                                                          
                                                      
  function pairFrog(s){
    var frogs=pondFrogs(s), r=s.ftueEquipmentCraft, inst=r&&r.instanceId&&Equipment.findInstance(s,r.instanceId);
    var own=inst&&inst.equippedBy&&frogs.find(function(f){return f.id===inst.equippedBy;});
    return own || frogs.find(function(f){return worn(s,f,'weapon');}) || frogs.find(function(f){return worn(s,f,'shield');})
      || frogs.slice().sort(function(a,b){return (b.tier||0)-(a.tier||0);})[0] || null;
  }
                                                                                              
                                                                                              
                                                                                                 
                                                                               
  function firstCraftPiece(s,k){
    var r=s.ftueEquipmentCraft, id=null;
    if(k==='weapon' && Equipment.ftueFirstCraftActive(s)) id=(r&&(r.chosen||r.itemId))||Equipment.lessonWeaponItemId(s);
    else if(k==='shield' && (Equipment.ftueShieldCraftActive(s) || (Equipment.ftueFirstCraftActive(s) && !s.ftueL4ShieldPaid)))
      id=s.ftueL4ShieldChosen||Equipment.lessonShieldItemId(s);
    return id && canMake(s,id) ? id : null;
  }
                                                                                                
  function guiding(s){ return !!((active(s) && !complete(s)) || (shieldActive(s) && !pairDone(s))); }
  function cost(id,s){ return Equipment.conversionCost(id,s); }
  function esc(v){ return KitUI.esc(v); }
                                                                                
                                                                                 
  function costsHTML(s,c){
    return Object.keys(c).map(function(k){
      var have=Equipment.walletAmount(s,k), need=c[k], ok=have>=need, label=Math.floor(have)+' / '+need+' '+(k==='mat'?'wood':k==='rock'?'stone':k);
      return '<span data-wallet="'+k+'" data-have="'+have+'" data-need="'+need+'" class="ec-cost kit-cost '+(ok?'kit-cost--ok enough':'kit-cost--short short')+'"'
        +' title="'+label+' (have / need)" aria-label="'+label+' (have / need)">'+curIcon(k)+'<b>'+fmtNum(need)+'</b></span>';
    }).join('') || '<span class="ec-cost ec-cost--free">No materials required</span>';
  }
  function button(label,click,cls,disabled,tone,size){
    return KitUI.button({tone:tone||'gold',shape:'pill',size:size||'sm',className:cls||'',onclick:click,disabled:disabled,html:label});
  }
                                                                                    
  function rerender(){ if(typeof renderKeepSheetScroll==='function') renderKeepSheetScroll(); else render(); }

                                                                                 
  function setUpgradeTab(tab,refresh){upgradeTab=tab;if(refresh!==false)render();}
  function upgradeTabValue(){return upgradeTab;}
  function folderTab(key,label){
    var on=upgradeTab===key;
    return '<button type="button" role="tab" aria-selected="'+on+'" class="fp-uftab'+(on?' on':'')+'" onclick="EquipmentCraft.setUpgradeTab(\''+key+'\')">'+label+'</button>';
  }
  function materialsHTML(){
    var ids=MATERIAL_ORDER.filter(function(k){return Currencies.has(k);})
      .concat(Currencies.list().map(function(c){return c.id;}).filter(function(k){return k!=='gems'&&MATERIAL_ORDER.indexOf(k)<0;}));
    return ids.map(function(k){
      var field=k==='wood'?'mat':k==='stone'?'rock':k;
      return KitUI.rewardCountTile({iconHTML:curIcon(field),amount:fmtNum(state[field]||0),prefix:'',name:k,className:'ec-stock'});
    }).join('');
  }
  function gearRowsHTML(){
    var items=(Equipment.init(state).items||[]).map(function(inst){
      var row=null;try{row=Equipment.itemRow(inst.item_id);}catch(e){}
      return row?{inst:inst,row:row}:null;
    }).filter(Boolean);
    var rank=function(r){return ['common','rare','epic','legendary'].indexOf(Equipment.UI.gearTier(r.rarity));};
    items.sort(function(a,b){return (b.inst.equippedBy?1:0)-(a.inst.equippedBy?1:0)||rank(b.row)-rank(a.row)||(b.inst.usesLeft||0)-(a.inst.usesLeft||0);});
    return items.map(function(x){
      var max=Math.max(1,x.inst.usesMax||1),left=Math.max(0,Math.min(max,x.inst.usesLeft||0));
                                                                                   
      return KitUI.gearRow({state:x.inst.equippedBy?'equipped':'better',rarity:Equipment.UI.gearTier(x.row.rarity),
        artHTML:Equipment.UI.itemArt(x.row,{size:37}),name:Equipment.UI.displayName(x.row),
        deltas:Equipment.UI.boosts(x.row).map(function(b){return {kind:b.kind,text:b.text};}),
        equippedLabel:'EQUIPPED',durability:{pct:left/max,label:left+'/'+max},className:'ec-gear'});
    }).join('');
  }
                                                                                                                   
  function blueprintStockHTML(s){
    var full=Equipment.SLOTS.map(function(k){return Equipment.slotBlueprintTotal(s,k)+' '+Equipment.SLOT_META[k].name+' blueprints';}).join(', ');
    return '<span class="ec-bpstock" title="'+full+'" aria-label="'+full+'">'+Equipment.SLOTS.map(function(k){
      return '<span class="ec-bpstock__n" data-blueprint="'+k+'">'+Equipment.blueprintIconHTML(k,'ec-bp-ico')+'<b>'+Equipment.slotBlueprintTotal(s,k)+'</b></span>';
    }).join('')+'<span class="ec-bpstock__word">Blueprints</span></span>';
  }
  function upgradesHTML(build){
    var inventoryShown=!g.UpgradesUI || UpgradesUI.introduced(state,'inventory');
    if(!inventoryShown) upgradeTab='build';
    var tabs='<div class="fp-uftabs" role="tablist">'+folderTab('build','UPGRADES')+(inventoryShown?folderTab('inventory','INVENTORY'):'')+'</div>';
    var body;
    if(upgradeTab==='build') body=build;
    else if(g.UpgradesUI && !UpgradesUI.introduced(state,'workshop')){
      body='<p class="fp-usec">MATERIALS</p><div class="ec-inventory">'+materialsHTML()+'</div>';
    }else{
      var gear=gearRowsHTML();
      body='<p class="fp-usec">MATERIALS</p><div class="ec-inventory">'+materialsHTML()+'</div>'
        +'<p class="fp-usec">GEAR</p>'
        +'<div class="kit-uprow kit-uprow--upgrade ec-entry"><span class="kit-uprow__art"><img src="'+WORKSHOP_ART+'" alt="" draggable="false"></span>'
        +'<span class="kit-uprow__info"><span class="kit-uprow__titlerow"><b class="kit-uprow__name">Workshop</b></span>'
        +'<span class="kit-uprow__desc">'+blueprintStockHTML(state)+'</span></span>'
        +button('Craft','EquipmentCraft.open()','kit-uprow__act ec-open',false,'gold','sm')+'</div>'
        +(gear?'<div class="ec-gearlist">'+gear+'</div>':'<p class="ec-empty">No gear yet — craft some in the Workshop.</p>');
    }
    return '<div class="fp-ufolder fp-ufolder--'+upgradeTab+'">'+tabs+'<div class="fp-usheet fp-upgrades-content">'+body+'</div></div>';
  }

                                                                           
                                                                            
                                                                               
                                                                            
                                                                      
                                                                             
  function open(s,frogId){
    if(g.UpgradesUI && !UpgradesUI.introduced(state,'workshop')) return;
    if(typeof dismissLaborWindow==='function')dismissLaborWindow();
    selected=null;lastInstance=null;slot=s||'weapon';inspectFrogId=frogId||null;openSheet('equipment');
  }
  function frogOf(id){ return id && (state.frogs||[]).find(function(f){return f.id===id;}); }
                                                            
  function backToRack(){
    var f=frogOf(inspectFrogId);
    if(!f || typeof showArmorWindow!=='function') return false;
    showArmorWindow(f.id);
    Equipment.UI.toggleRack(slot);                                                       
    return true;
  }
  function close(){
    if(typeof closeSheet==='function')closeSheet();
    backToRack();
  }
  function setSlot(s){slot=s;selected=null;render();}
                                                                                      
                                                                               
  function materialShort(id){
    var out={};
    if(!canMake(state,id)) return out;
    var short=Equipment.shortfall(state,cost(id,state));
    if(short.mat>0) out.mat=short.mat;
    if(short.rock>0) out.rock=short.rock;
    return out;
  }
  function select(id){
    selected=id;
    followPick(state,id);
    var r=guide(state);
    if(r&&id===(r.chosen||r.itemId)){
      r.selected=true;
      if(state.ftueL4Step==='equipment_preview' && !Object.keys(FtueSteps.equipmentShortfall()).length) state.ftueL4Step='craft';
    }
                                                                                      
                                                                                     
                                                                                             
    var short=materialShort(id), intro=Object.keys(short).length>0 && typeof harvestingUnlocked==='function' && !harvestingUnlocked();
    var guidedDetour=Object.keys(short).length>0 && g.FtueSteps && FtueSteps.beginEquipmentHarvest(id,true);
    if(intro && !guidedDetour) state.harvestingUnlocked=true;
    queueSave();rerender();
                                                                                         
                                                                                        
    if(!guidedDetour && g.FtueTooltips && FtueTooltips.materialsShort) FtueTooltips.materialsShort(state,short,intro);
  }
                                                                            
                                                                                     
  function harvest(){
    if(g.FtueSteps && FtueSteps.beginEquipmentHarvest(selected)) return;
    if(typeof harvestingUnlocked==='function' && !harvestingUnlocked()) return;
    if(typeof dockUnlocked==='function' && !dockUnlocked()) return;                                    
    if(typeof openSheet==='function') openSheet('harvesting');
  }
  function slotWord(s){ return s==='shield'?'SHIELD':'SWORD'; }
  function parts(){
                                                                                            
    var r=guide(state), items=Equipment.craftable(slot==='shield'?'shield':'sword',state);
    var only=firstCraftPiece(state,slot);
    if(only) items=items.filter(function(i){return i.item_id===only;});
    var inst=Equipment.findInstance(state,r?r.instanceId:lastInstance);
    var row=selected&&items.find(function(i){return i.item_id===selected;});
    var blueprints=Equipment.blueprintCount(state,slot);
                                                                                                  
    var bp=row?Equipment.blueprintFor(state,row.item_id):{piece:false,slot:slot,count:blueprints};
                                                                           
    var noteRow=row||(only&&items[0])||null, noteBp=noteRow&&!row?Equipment.blueprintFor(state,noteRow.item_id):bp;
    var result='';
    if(inst && !inst.equippedBy){
                                                                                 
      var made=Equipment.itemRow(inst.item_id), madeSlot=Equipment.slotFor(made.item_type);
      result='<div class="ec-result"><span class="kit-gearrow__item kit-rarity-fill--'+Equipment.UI.gearTier(made.rarity)+'">'+Equipment.UI.itemArt(made,{size:37})+'</span>'
        +'<div class="ec-result__info"><h3>'+esc(Equipment.UI.displayName(made))+' is ready</h3>'
        +'<p class="ec-equip-note">Tap a frog, then its '+Equipment.SLOT_META[madeSlot].name+' slot, to equip it.</p></div></div>';
    }
                                                                         
    var slots=inspectFrogId?'':'<div class="ec-slots" role="tablist">'+Equipment.SLOTS.map(function(s){
      var on=s===slot;
      return '<button type="button" role="tab" aria-selected="'+on+'" aria-label="'+Equipment.SLOT_META[s].name+'" class="ec-slot'+(on?' on':'')+'"'
        +' onclick="EquipmentCraft.setSlot(\''+s+'\')"><img src="'+SLOT_ART[s]+'" alt="" draggable="false"></button>';
    }).join('')+'</div>';
    var note=noteBp.piece
      ? '<div class="ec-note ec-blueprints" data-blueprint="'+noteRow.item_id+'">'+Equipment.blueprintIconHTML(slot,'ec-bp-ico')+' <b>'+noteBp.count+'</b> '+esc(Equipment.UI.blueprintName(noteRow))+(noteBp.count===1?'':'s')+' on hand · crafting uses one</div>'
      : '<div class="ec-note ec-blueprints" data-blueprint="'+slot+'">'+Equipment.blueprintIconHTML(slot,'ec-bp-ico')+' <b>'+blueprints+'</b> '+Equipment.blueprintLabel(slot)+(blueprints===1?'':'s')+' on hand · each craft uses one</div>';
                                                                                                          
    var short=!row || (r && r.instanceId) ? {} : materialShort(row.item_id);
    var needsHarvest=(short.mat>0 || short.rock>0) && (typeof harvestingUnlocked!=='function' || harvestingUnlocked());
    var detour=needsHarvest ? '<p class="ec-shortfall">Send frogs to harvest '+Object.keys(short).filter(function(k){return k==='mat'||k==='rock';}).map(function(k){return Math.ceil(short[k])+' '+(k==='mat'?'wood':'stone');}).join(' and ')+' from the Harvesting screen.</p>'+button('Dispatch frogs to harvest','EquipmentCraft.harvest()','ec-harvest',false,'green','md') : '';
    var detail=row?'<div class="ec-detail"><b>'+esc(Equipment.UI.displayName(row))+'</b><span class="ec-detail__boosts">'+Equipment.UI.boostPillsHTML(row,'sm')+'</span></div>'
      +'<div class="ec-costs">'+costsHTML(state,cost(row.item_id,state))+'</div>'+detour
      :'<p class="ec-pick-note">Choose equipment to see its cost and craft it.</p>';
                                                                                                              
    var buy=blueprints<1 && (row ? !bp.piece : Equipment.slotBlueprintTotal(state,slot)<1)?'<div class="ec-buy">'+(Equipment.blueprintPriced(slot)
      ? '<span class="ec-costs">'+costsHTML(state,Equipment.blueprintCost(slot))+'</span>'+button('Buy '+Equipment.blueprintLabel(slot),'EquipmentCraft.buy()','ec-buy-button',!Equipment.canAffordBlueprint(state,slot),'gold','sm')
      :'<p>Earn '+Equipment.blueprintLabel(slot)+'s from expedition rewards.</p>')+'</div>':'';
    var list='<div class="ec-list">'+items.map(function(i){
      var tier=Equipment.UI.gearTier(i.rarity), own=Equipment.pieceBlueprintCount(state,i.item_id);
      return '<button type="button" class="kit-gearrow kit-gearrow--pick ec-item'+(own?' ec-item--blueprint':'')+(selected===i.item_id?' selected':'')+'" data-item-id="'+i.item_id+'" onclick="EquipmentCraft.select(\''+i.item_id+'\')">'
        +'<span class="kit-gearrow__item kit-rarity-fill--'+tier+'">'+Equipment.UI.itemArt(i,{size:37})+(own?Equipment.UI.blueprintMarkHTML(slot):'')+'</span>'
        +'<span class="kit-gearrow__info"><b>'+esc(Equipment.UI.displayName(i))+'</b><i class="kit-rarity-text--'+tier+'">'+tier.toUpperCase()+'</i>'
        +'<span class="kit-gearrow__deltas">'+Equipment.UI.boostPillsHTML(i,'sm')+'</span>'+(own?'<small class="ec-blueprint-count">'+own+' blueprint'+(own===1?'':'s')+'</small>':'')+'</span>'
        +'<span class="kit-gearrow__right ec-costs ec-costs--row">'+costsHTML(state,cost(i.item_id,state))+'</span></button>';
    }).join('')+'</div>';
                                                                                 
                                                                           
                                                                               
                                                                              
                                                                         
                                                                
    var cantAfford=row&&!(r&&r.instanceId)&&bp.count>=1&&!Equipment.canAfford(state,cost(row.item_id,state));
    var craftOff=!!(r&&r.instanceId)||bp.count<1||!row;
                                                                                   
    var footer=KitUI.button({tone:'gold',shape:'pill',size:'lg',
      className:'kit-popup__cta '+(row?'ec-craft':'ec-craft-idle')+(cantAfford?' ec-craft--short':''),
      label:'CRAFT '+slotWord(slot),onclick:'EquipmentCraft.craft()',disabled:craftOff});
    return {body:result+slots+note+detail+buy+list,footer:footer};
  }
  function renderScreen(){
    try{var p=parts();return '<div class="ec-screen">'+p.body+p.footer+'</div>';}catch(e){return '<p class="ec-error">'+esc(e.message)+'</p>';}
  }
  function popupHTML(justOpened){
    var p;
    try{p=parts();}catch(e){p={body:'<p class="ec-error">'+esc(e.message)+'</p>',footer:''};}
    var f=frogOf(inspectFrogId);
    var sub=f?'Craft a '+Equipment.SLOT_META[slot].name.toLowerCase()+' for '+(typeof frogDisplayName==='function'?frogDisplayName(f):f.name||'your frog'):'Craft gear for your frogs';
    return '<div class="ec-pop-layer'+(justOpened?'':' ec-pop--still')+'">'
      +'<div class="ec-pop-scrim" onclick="EquipmentCraft.close()"></div>'
      +KitUI.popup({id:'ec-workshop',className:'ec-pop',title:'Workshop',subtitle:sub,
        onClose:'EquipmentCraft.close()',closeAriaLabel:'Close Workshop',
        tabsHTML:'<div class="ec-ftabs" role="tablist"><span class="ec-ftab on" role="tab" aria-selected="true">CRAFT</span></div>',
        bodyHTML:'<div class="ec-sheet sheet-body"><div class="ec-screen">'+p.body+'</div></div>',footerHTML:p.footer})
      +'</div>';
  }
  function craft(){
    if(!selected)return;
                                                                        
    if(state.ftueLoop===4 && state.ftueL4HarvestLesson && !state.ftueL4HarvestLesson.done){
      return;
    }
    var r=guide(state), shieldStep=shieldActive(state);
    if(r&&r.instanceId)return;
    var spends=null;try{spends=Equipment.blueprintFor(state,selected);}catch(e){}                                                      
    var result=Equipment.convert(state,selected);
    if(!result.ok){
      if(result.reason==='cant-afford'){
                                                                          
                                                                        
                                                                        
        var short=Equipment.shortfall(state,result.cost||cost(selected,state));
        var key=['mat','rock','bones'].find(function(k){return short[k]>0;})||Object.keys(short)[0];
        if(key && typeof notEnoughResourceNote==='function') notEnoughResourceNote(key,function(){return document.querySelector('.ec-craft,.ec-craft-idle');});
        else showToast('Not enough materials');
      } else {
        showToast(result.reason==='no-blueprint'?'Need a '+Equipment.blueprintLabel(result.slot):'No blueprint for that');
      }
      return;
    }
    lastInstance=result.instance.id;
                                                                                                     
    if(r && result.instance.slot==='weapon'){
      r.instanceId=result.instance.id; r.chosen=result.row.item_id;
      state.ftueL4CraftPaid=true; delete state.ftueL4FirstCraftCost;
    }
    if(shieldStep && result.instance.slot==='shield'){ state.ftueL4ShieldPaid=true; delete state.ftueL4ShieldCost; }
    queueSave();rerender();
                                                                             
    Equipment.UI.playRevealFX(result.row,result.instance,function(){
                                                                                     
      if(frogOf(inspectFrogId)){ Equipment.UI.setFresh(result.instance.id); close(); }
      else rerender();
    },{pieceBlueprint:!!(spends&&spends.piece),guided:guiding(state)});
  }
                                                                      
  function forgeTarget(reveal){
    return reveal.querySelector('.eq-reveal-result:not([hidden]) .eq-reveal-ok')||reveal.querySelector('.eq-forge-bp:not([disabled])');
  }
  function buy(){if(Equipment.buyBlueprint(state,slot))queueSave();rerender();}
                                                                              
                                                                             
                                                                        
                                                                            
                    
  function pointerTarget(){
    if(shieldActive(state))return pairTarget();
    var r=guide(state);if(!r)return null;
    var reveal=document.querySelector('.eq-reveal-overlay');
    if(reveal)return forgeTarget(reveal);
    var win=document.getElementById('labor-window');
    if(r.instanceId)return win?inspectTarget(win,'.eq-pick[onclick*="'+r.instanceId+'"]'):activeSheet?closeTarget():frogTarget(r);
    if(activeSheet==='equipment'){
                                                                                         
      if(slot!=='weapon')return document.querySelector('[onclick="EquipmentCraft.setSlot(\'weapon\')"]')||closeTarget();
      var piece=r.chosen||r.itemId;
      if(selected!==piece)return document.querySelector('[data-item-id="'+piece+'"]');
      return document.querySelector('.ec-harvest') || document.querySelector('.ec-craft');
    }
    if(win)return inspectTarget(win,'.eq-craft');
    return activeSheet?closeTarget():frogTarget(r);
  }
                                                                              
                                                                          
  function inspectTarget(win,pick){
    var list=win.querySelector('.fi-picks');
    if(!list)return win.querySelector('.eq-cell[aria-label="Weapon"]')||win.querySelector('.fi-close');
    return list.dataset.slot==='weapon'?win.querySelector(pick):win.querySelector('.fi-close');
  }
                                                                           
                                                                             
                                                                                                
                                                                          
  function pairTarget(){
    if(pairDone(state))return null;
    var frog=pairFrog(state);if(!frog)return null;
    var reveal=document.querySelector('.eq-reveal-overlay');
    if(reveal)return forgeTarget(reveal);
    var need=worn(state,frog,'weapon')?'shield':'weapon';
    var stray=need==='shield' && !Equipment.inventoryFor(state,'shield').length
      && pondFrogs(state).find(function(f){return f.id!==frog.id && worn(state,f,'shield') && !worn(state,f,'weapon');});
    var target=stray||frog;
    if(activeSheet==='equipment'){
                                                                                                      
      if(Equipment.inventoryFor(state,need).length)return closeTarget();
      if(slot!==need)return document.querySelector('[onclick="EquipmentCraft.setSlot(\''+need+'\')"]')||closeTarget();
      var lesson=need==='shield'?(state.ftueL4ShieldChosen||Equipment.lessonShieldItemId(state)):Equipment.lessonWeaponItemId(state);
      if(selected!==lesson)return document.querySelector('[data-item-id="'+lesson+'"]')||document.querySelector('.ec-item');
      return document.querySelector('.ec-harvest')||document.querySelector('.ec-craft');
    }
    var win=document.getElementById('labor-window');
    if(win){
      if(typeof _inspectFrogId!=='undefined' && _inspectFrogId!==target.id)return win.querySelector('.fi-close');
      var list=win.querySelector('.fi-picks');
      if(!list)return win.querySelector('.eq-cell[aria-label="'+Equipment.SLOT_META[need].name+'"]')||win.querySelector('.fi-close');
      if(list.dataset.slot!==need)return win.querySelector('.fi-close');                                             
      if(stray)return win.querySelector('.fi-takeoff');
                                                                          
      return win.querySelector('.fi-picks .eq-pick:not(.eq-craft)')||win.querySelector('.eq-craft');
    }
    return activeSheet?closeTarget():frogTarget({frogId:target.id},true);
  }
                                                                                                        
  function closeTarget(){ return document.querySelector('#ec-workshop .kit-popup__close, [aria-label="Close Upgrades"], .sheet-x')||dockBtnByLabel('Pond'); }
                                                                                
                                                                              
                                                                            
                                                                  
  function frogTarget(r,only){
    var sprites=typeof wanderingSprites!=='undefined'?wanderingSprites:{};
    var hop=function(id){var spr=sprites[id];return spr&&spr.el.isConnected?(spr.el.querySelector('.frog-hop')||spr.el):null;};
    var A=typeof tutSafeArea==='function'?tutSafeArea():{l:0,t:0,r:innerWidth,b:innerHeight};
    var mid=function(el){var b=el&&el.getBoundingClientRect();return b&&b.width?{x:b.left+b.width/2,y:b.top+b.height/2}:null;};
    var inView=function(el){var m=mid(el);return !!(m&&m.x>=A.l&&m.x<=A.r&&m.y>=A.t&&m.y<=A.b);};
    var own=hop(r.frogId);
    if(only||inView(own))return own;
    var best=null,bd=Infinity;
    (state.frogs||[]).forEach(function(f){
      var el=hop(f.id);
      if(!inView(el)||(typeof expFrogBusy==='function'&&expFrogBusy(f.id)))return;
      var m=mid(el),d=Math.hypot(m.x-(A.l+A.r)/2,m.y-(A.t+A.b)/2);
      if(d<bd){bd=d;best=el;}
    });
    return best||own;
  }
  g.EquipmentCraft={active:active,guide:guide,complete:complete,equipping:equipping,guiding:guiding,pairDone:pairDone,shieldReachable:shieldReachable,weaponReachable:weaponReachable,releaseOrphans:releaseOrphans,lessonPiece:lessonPiece,pairFrog:pairFrog,cost:cost,upgradesHTML:upgradesHTML,setUpgradeTab:setUpgradeTab,upgradeTabValue:upgradeTabValue,
    open:open,close:close,setSlot:setSlot,select:select,renderScreen:renderScreen,popupHTML:popupHTML,craft:craft,harvest:harvest,buy:buy,pointerTarget:pointerTarget};
  if(g.FtueSteps)g.FtueSteps.registerHook('craftWeaponChassis',function(){guide(state);return {ok:complete(state)};});
  if(typeof module!=='undefined'&&module.exports)module.exports=g.EquipmentCraft;
})(typeof window!=='undefined'?window:globalThis);
