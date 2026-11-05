                                                                          
                                                                           
(function(g){
  'use strict';
                                                                                             
  function text(key, fallback, tokens){
    if(typeof FPConfig !== 'undefined' && FPConfig.text) return FPConfig.text(key, fallback, tokens);
    return String(fallback).replace(/\{(\w+)\}/g, function(all, name){ return tokens && Object.prototype.hasOwnProperty.call(tokens,name) ? String(tokens[name]) : all; });
  }

  let dragRAF=null, dragStart=null, focusTimer=null, focusRAF=null, inspectPanAt=0;
  const INSPECT_FOCUS_MS=2000;                                                 
  function planted(){
    return (state.flowerPlots||[]).map((plot,index)=>({plot,index}))
      .filter(p=>p.plot && ['bud','bloom'].includes(p.plot.stage));
  }
  function seats(){
    return planted().flatMap(p=>p.plot.station ? p.plot.station.slots.filter(Boolean).map(seat=>({...p,seat})) : []);
  }
  function earned(){
                                                                             
                                                                      
    for(const frog of state.frogs||[]){
      if(state.ftueFlowerFirstFrog && frog.id!==state.ftueFlowerFirstFrog) continue;
      const buff=(state.frogFlowerBuffs?.[frog.id]||[]).find(b=>b && Flowers.remainingMs(b,Date.now())>0 && (b.atk>0||b.def>0||b.hp>0));
      if(!buff) continue;
      const base=frogStats(frog,{withoutFlowers:true}), boosted=frogStats(frog);
      if(['atk','def','hp'].some(k=>boosted[k]>base[k])) return {frogId:frog.id,flowerId:buff.flowerId,earnedAt:buff.grantedAt};
    }
    return null;
  }
  function sync(){
    const before=state.ftueL5Step;
    if(!state.ftueFlowerFirstFrog && seats().length) seated(seats().sort((a,b)=>a.seat.earnStartAt-b.seat.earnStartAt)[0].seat.frogId);
    if(!state.ftueFlowerLesson){
      const receipt=earned();
      if(receipt){ state.ftueFlowerLesson=receipt; if(typeof queueSave==='function') queueSave(); }
    }
                                                                                                
                                                                                                
                                                                                          
                                                                                       
    const e5=(state.expeditionsCleared||[]).indexOf(g.FtueSteps.expeditionNode('expedition5'))>=0;
    const open=e5 || g.FtueSteps.exp5Lost() || !!state.ftueFlowerLesson;
    state.ftueL5Step=!open ? 'expedition'
      : state.ftueFlowerLesson ? (state.ftueFlowerInspectDone ? 'expedition' : state.ftueFlowerFocusUntil ? 'inspect_focus' : 'inspect')
      : seats().length ? 'charge' : planted().some(p=>p.plot.stage==='bloom') ? 'seat'
      : planted().length ? 'grow' : 'plant';
    if(before!==state.ftueL5Step && typeof queueSave==='function') queueSave();
    if(state.ftueL5Step==='inspect_focus'){
      if(Date.now()>=state.ftueFlowerFocusUntil) finishFocus();
      else if(!document.querySelector('#labor-window') && typeof showArmorWindow==='function') showArmorWindow(state.ftueFlowerLesson.frogId);
    }
  }
  function idleFrogs(){
    return (state.frogs||[]).filter(f=>!expFrogBusy(f.id) && !Harvest.isBusy(f.id) && !flowerStationOfFrog(f.id));
  }
  function label(){
    switch(state.ftueL5Step){
      case 'plant': {
        const found=Flowers.unlockedFlowers(state), ids=found.length ? found : Flowers.allFlowerIds();
        const min=Math.min(...ids.map(id=>Flowers.plantCostFor(id)));
        return (state.seeds||0)<min ? text("text_l5_earn_seeds", "Earn {need} seed{plural} from expedition rewards to plant a flower", {need: min, plural: min===1?'':'s'}) : text("text_l5_plant", "Plant a flower");
      }
      case 'grow': case 'inspect_focus': return '';
      case 'inspect': return text("text_l5_inspect", "Tap your frog to see its flower buffs");
      case 'seat': return idleFrogs().length ? text("text_l5_seat", "Drag a frog onto a flower to earn expedition buffs")
        : (state.frogs||[]).some(f=>Harvest.isBusy(f.id)) ? text("text_l5_recall", "Return a harvest worker to idle for flower buffs")
        : state.frogs.length ? text("text_l5_wait", "Wait for your expedition frogs to return") : text("text_l5_hatch", "Hatch a frog for flower buffs");
      case 'charge': return text("text_l5_charge", "Keep frog seated for flower buffs");
      default: return text("text_l5_expedition", "Clear Expedition 5");
    }
  }
  function seated(frogId){
    if(state.ftueLoop===5 && !state.ftueFlowerFirstFrog){
      state.ftueFlowerFirstFrog=frogId;
      if(typeof queueSave==='function') queueSave();
    }
  }
  function progress(now=Date.now()){
    const p=seats().find(p=>p.seat.frogId===state.ftueFlowerFirstFrog);
    return p ? Flowers.chargeProgress(p.plot.station,p.seat,now) : 0;
  }
  function finishFocus(){
    clearTimeout(focusTimer);focusTimer=null;
    if(focusRAF) cancelAnimationFrame(focusRAF);focusRAF=null;
    document.removeEventListener('pointerdown',finishFocus,true);
    document.removeEventListener('click',finishFocus,true);
    document.querySelector('#flower-inspect-focus')?.remove();
    state.ftueFlowerInspectDone=true;state.ftueL5Step='expedition';
    if(typeof queueSave==='function') queueSave();
    if(typeof render==='function') render();
  }
  function inspected(frogId){
    if(Number(FPConfig.value('FTUE','ftue_flowers_enabled'))===0) return;
    if(state.ftueLoop!==5 || !state.ftueFlowerLesson || state.ftueFlowerInspectDone || frogId!==state.ftueFlowerLesson.frogId) return;
    state.ftueL5Step='inspect_focus';
    if(!state.ftueFlowerFocusUntil) state.ftueFlowerFocusUntil=Date.now()+INSPECT_FOCUS_MS;
    if(typeof queueSave==='function') queueSave();
    if(Date.now()>=state.ftueFlowerFocusUntil){finishFocus();return;}
    document.querySelector('#flower-buff-rows')?.scrollIntoView({block:'nearest'});
    document.querySelector('#flower-inspect-focus')?.remove();
    const overlay=document.createElement('div');overlay.id='flower-inspect-focus';
    overlay.setAttribute('aria-hidden','true');
    for(let i=0;i<4;i++) overlay.appendChild(document.createElement('div'));
    document.body.appendChild(overlay);
    function frame(){
      const section=document.querySelector('#flower-buff-rows');
      if(!section){finishFocus();return;}
      const r=section.getBoundingClientRect(),w=innerWidth,h=innerHeight;
      const l=Math.max(0,r.left),t=Math.max(0,r.top),b=Math.min(h,r.bottom),right=Math.min(w,r.right);
      const rects=[[0,0,w,t],[0,b,w,h-b],[0,t,l,b-t],[right,t,w-right,b-t]];
      [...overlay.children].forEach((el,i)=>{const [x,y,width,height]=rects[i];el.style.cssText=`left:${x}px;top:${y}px;width:${width}px;height:${height}px`;});
      focusRAF=requestAnimationFrame(frame);
    }
    if(focusRAF) cancelAnimationFrame(focusRAF);frame();
    clearTimeout(focusTimer);focusTimer=setTimeout(finishFocus,state.ftueFlowerFocusUntil-Date.now());
    document.addEventListener('pointerdown',finishFocus,true);
                                                                         
                                                                              
    setTimeout(()=>{if(document.querySelector('#flower-inspect-focus')) document.addEventListener('click',finishFocus,true);},0);
  }
  function exposed(el){
    if(!el || !el.checkVisibility({checkVisibilityCSS:true,checkOpacity:true})) return null;
    const r=el.getBoundingClientRect(),a=tutSafeArea();
    const left=Math.ceil(Math.max(r.left,a.l)),right=Math.floor(Math.min(r.right,a.r));
    const top=Math.ceil(Math.max(r.top,a.t)),bottom=Math.floor(Math.min(r.bottom,a.b));
    for(const xf of [.5,.3,.7,.1,.9]) for(const yf of [.5,.3,.7,.1,.9]){
      const x=Math.round(left+(right-left)*xf),y=Math.round(top+(bottom-top)*yf);
      if(right<=left||bottom<=top) continue;
      const hit=document.elementFromPoint(x,y);
      if(hit && (hit===el||el.contains(hit))) return {x,y};
    }
    return null;
  }
  function dragTargets(){
    tutBringIntoView('.flower-pad.flowered','flower-seat');
                                                                             
                                                              
    for(const p of planted().filter(p=>p.plot.stage==='bloom' && p.plot.station && Flowers.emptySlotIndex(p.plot.station)!==-1)){
      const slot=lilypadSprites[p.index]?.flower;
      if(!slot) continue;
      const r=slot.getBoundingClientRect(),a=tutSafeArea(),x=r.left+r.width/2,y=r.top+r.height/2;
      if(!(x>a.l&&x<a.r&&y>a.t&&y<a.b && findFlowerDropTarget(x,y)?.padIndex===p.index)) continue;
      for(const frog of idleFrogs()){
        const spr=wanderingSprites[frog.id];
        if(!spr || spr.presenting || spr.flying) continue;
        const aim=exposed(spr.el);
        if(aim) return {from:spr.el,aim,to:slot};
      }
    }
    if(planted().length && typeof tutBringIntoView==='function') tutBringIntoView('.flower-pad.flowered','flower-seat');
    return null;
  }
  function releaseTarget(){
    const id=(state.frogs||[]).find(f=>Harvest.isBusy(f.id))?.id;
    if(!id) return null;
    if(activeSheet!=='harvesting') return dockBtnByLabel('Harvesting');
    const job=Harvest.isBusyInHarvest(state.harvest,id);
    return document.querySelector('[onclick="Harvest.releaseFrog(\''+job+'\',\''+id+'\')"]')
      || document.querySelector('[onclick="Harvest.openJobCrew(\''+job+'\')"]')
      || document.querySelector('.harvest-back');
  }
  function pointerTarget(){
    if(state.ftueL5Step==='seat' && !idleFrogs().length && (state.frogs||[]).some(f=>Harvest.isBusy(f.id))) return releaseTarget();
    if(activeSheet) return dockBtnByLabel('Pond');
    if(state.ftueL5Step==='inspect'){
      const el=wanderingSprites[state.ftueFlowerLesson.frogId]?.el;
      if(el && !exposed(el) && Date.now()-inspectPanAt>800){
        inspectPanAt=Date.now();
        el.setAttribute('data-flower-inspect-target','');
                                                                                
                                                                                
        delete _tutPanned['flower-inspect'];
        tutBringIntoView('[data-flower-inspect-target]','flower-inspect');
      }
      return el && exposed(el) ? el : null;
    }
    if(state.ftueL5Step==='plant'){
      if(document.querySelector('#flower-chooser')) return FlowerPickerUI.guideTarget();
      tutBringIntoView('.flower-pad.empty','flower-plant');
      const pads=Array.from(document.querySelectorAll('.flower-pad.empty'));
      const target=pads.find(el=>exposed(el));
      if(!target) tutBringIntoView('.flower-pad.empty','flower-plant');
      return target || null;
    }
    if(state.ftueL5Step==='seat' && !(state.frogs||[]).length) return bestOnScreen('.egg-pad.ready','flower-hatch') || bestOnScreen('.egg-pad.empty','flower-hatch');
    return null;
  }
  function stopDrag(){
    if(dragRAF) cancelAnimationFrame(dragRAF);
    dragRAF=null;dragStart=null;
  }
  function updateDrag(pointer){
    if(state.ftueL5Step!=='seat' || activeSheet || !idleFrogs().length || dragState){stopDrag();return false;}
    if(typeof stopMergeDemo==='function') stopMergeDemo();
    if(dragRAF) return true;
    function frame(ts){
      if(!FtueSteps.ftueUiActive() || state.ftueLoop!==5 || state.ftueL5Step!=='seat' || activeSheet || dragState || document.querySelector('#claim-modal,#family-spotlight,.cl-overlay,#labor-window')){
        stopDrag();pointer.classList.remove('on','grabbing');return;
      }
      pointer.classList.remove('tap','send-target','craft-target');
      pointer.querySelectorAll('.guide-label,.guide-dock-label').forEach(el=>el.remove());
      const targets=dragTargets();
      if(targets){
        const r=targets.to.getBoundingClientRect(),end={x:r.left+r.width/2,y:r.top+r.height/2};
        if(dragStart==null) dragStart=ts;
        const time=(ts-dragStart)%2400,t=Math.max(0,Math.min(1,(time-450)/1450)),ease=t*t*(3-2*t);
        const x=targets.aim.x+(end.x-targets.aim.x)*ease,y=targets.aim.y+(end.y-targets.aim.y)*ease;
        pointer.classList.add('on');pointer.classList.toggle('grabbing',time>=225&&time<1950);
        pointer.style.left=x+'px';pointer.style.top=y+'px';
        const pr=pointer.getBoundingClientRect();pointer.style.left=(2*x-pr.left)+'px';pointer.style.top=(2*y-pr.top)+'px';
      }else pointer.classList.remove('on','grabbing');
      dragRAF=requestAnimationFrame(frame);
    }
    dragRAF=requestAnimationFrame(frame);return true;
  }
  function refreshPips(){
    document.querySelectorAll('[data-flower-pips-frog]').forEach(el=>{
      const frog=state.frogs.find(f=>f.id===el.dataset.flowerPipsFrog);
      if(frog) el.innerHTML=Flowers.rowPipsHTML(state.frogFlowerBuffs,frog.id,frogBodySize(frog),Date.now());
    });
  }
  g.FlowerTutorial={sync,label,refreshPips,progress,seated,inspected,finishFocus,pointerTarget,updateDrag,dragTargets,exposed,stopDrag};
})(window);
