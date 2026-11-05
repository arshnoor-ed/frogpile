                                                                             
                                                                                   
(function (g) {
  'use strict';
  const PARAMS={hopMs:420,hopPx:52,restMs:1900};
  const clamp=(v,lo,hi)=>Math.max(lo,Math.min(hi,v));
  function selectTarget(items,last,from,rng=Math.random) {
    let choices=items.filter(item=>item.id!==last);
    if(!choices.length) choices=items;
                                                                            
    choices=choices.slice().sort((a,b)=>Math.hypot(a.x-from.x,a.y-from.y)-Math.hypot(b.x-from.x,b.y-from.y));
    return choices.length ? choices[Math.min(choices.length-1,Math.floor(rng()*Math.min(3,choices.length)))] : null;
  }
  function approach(rect,layer,size,water) {
                                                                             
    return {x:clamp((rect.left+rect.width/2-layer.left)/layer.width*100-size.w*0.5,water.x0*100,water.x1*100-size.w),
      y:clamp((rect.bottom-layer.top)/layer.height*100-size.h*0.2,water.y0*100,water.y1*100-size.h)};
  }
  const api={PARAMS,selectTarget,approach};
  if(typeof module!=='undefined' && module.exports) module.exports=api;
  if(!g.document) return;
  const workers=new Map(),rockIds=new WeakMap();let nextRock=1;
  function resourceOf(id) {
    if(typeof state==='undefined' || !g.Harvest || !state.harvest) return null;
    const job=g.Harvest.isBusyInHarvest(state.harvest,id);
    if(!job) return null;
    const row=g.FPConfig.rows('Harvesting').find(r=>r.job_id===job);
    return row && g.Harvest.RESOURCE_META[row.resource] ? row.resource : null;
  }
  function usable(el,resource) {
    if(!el || !el.isConnected || !el.checkVisibility({checkVisibilityCSS:true,checkOpacity:true})) return false;
    if(resource==='wood') return !logSpent(Number(el.dataset.log));
    const rock=gardenRocks.find(r=>r.img===el);
    return !!rock && !rock.busy;
  }
  function items(resource,layer,size) {
                                                                        
                                                                            
                                                                           
                                                                            
                                                                             
                                                                            
                                                                         
                                                                       
    return Array.from(document.querySelectorAll(resource==='wood'?'.pond-log':'.rock-sprite'))
      .filter(el=>usable(el,resource)).map(el=>{
        const rect=el.getBoundingClientRect();
        if(resource==='stone' && !rockIds.has(el)) rockIds.set(el,'rock-'+nextRock++);
        if(resource==='stone') el.dataset.harvestResource=rockIds.get(el);
        return {id:resource==='wood'?'log-'+el.dataset.log:rockIds.get(el),el,rect,
          ...approach(rect,layer,size,pondWater())};
      });
  }
  function point(spr,layer) {
                                                                             
    const style=getComputedStyle(spr.el);
    return {x:parseFloat(style.left)/layer.clientWidth*100,y:parseFloat(style.top)/layer.clientHeight*100};
  }
  function release(id,worker) {
    workers.delete(id);
    const spr=wanderingSprites[id];
    if(!spr || spr!==worker.spr) return;
    spr.el.classList.remove('harvest-working');spr.el.removeAttribute('data-harvest-target');
    spr.el.querySelector('.harvest-speech')?.remove();
    const inner=spr.el.querySelector('.frog-hop');if(inner)inner.style.scale='';
    if(!spr.presenting && !spr.flying && !(dragState && dragState.frogId===id)) {
      frogRest(inner);
      scheduleWander(id);
    }
  }
  function sync(now) {
    if(typeof state==='undefined' || !g.Harvest || typeof wanderingSprites==='undefined') return;
    if(g.PondPause && PondPause.active()) return;
                                                                             
    if(g.PondPause) now-=performance.now()-PondPause.now();
    const layer=document.getElementById('frog-layer');if(!layer || !layer.clientWidth) return;
    const lr=layer.getBoundingClientRect();if(!lr.width || !lr.height) return;
    for(const [id,worker] of workers) {
      if(!wanderingSprites[id] || worker.spr!==wanderingSprites[id] || resourceOf(id)!==worker.resource) release(id,worker);
    }
    for(const [id,spr] of Object.entries(wanderingSprites)) {
      const resource=resourceOf(id);if(!resource) continue;
      let worker=workers.get(id);
      if(!worker) {worker={spr,resource,last:null,lastEl:null,target:null,leg:null,restUntil:0,paused:true};workers.set(id,worker);}
      spr.el.classList.add('harvest-working');
      if(!spr.el.querySelector('.harvest-speech')) {
        const bubble=document.createElement('span');bubble.className='harvest-speech';
        bubble.setAttribute('role','img');bubble.setAttribute('aria-label','Harvesting '+resource);
        bubble.innerHTML=curIcon(g.Harvest.RESOURCE_META[resource].stateKey);spr.el.appendChild(bubble);
      }
                                                                               
      if((g.PondMotion && PondMotion.heldForDrag(id)) || activeTab!=='pond' || activeSheet || spr.presenting || spr.flying || flowerStationOfFrog(id) || (dragState && dragState.frogId===id)) {
        if(worker.leg && worker.leg.hop) worker.leg.hop.cancel();
        worker.paused=true;worker.leg=null;continue;
      }
      if(worker.paused) {
        if(window.FrogGait) FrogGait.reset(spr.el.querySelector('.frog-hop'),true);                                          
        const start=point(spr,layer);PondPause.cancel(spr.timer);
        spr.el.style.transition='none';spr.el.style.transform='';
        spr.el.style.left=start.x+'%';spr.el.style.top=start.y+'%';
        worker.paused=false;worker.target=null;worker.restUntil=0;
      }
      const inner=spr.el.querySelector('.frog-hop');
      const size={w:spr.el.offsetWidth/layer.clientWidth*100,h:spr.el.offsetHeight/layer.clientHeight*100};
      if(worker.target && !usable(worker.target.el,resource)) {worker.target=null;worker.leg=null;worker.restUntil=0;frogRest(inner);}
      if(now<worker.restUntil && worker.lastEl && !usable(worker.lastEl,resource)) worker.restUntil=0;
      if(now<worker.restUntil) continue;
      if(!worker.target) {
        const from=point(spr,layer);
        worker.target=selectTarget(items(resource,lr,size),worker.last,from);
        if(!worker.target) {spr.el.removeAttribute('data-harvest-target');frogRest(inner);continue;}
        spr.el.dataset.harvestTarget=worker.target.id;
      }
      const dest=approach(worker.target.el.getBoundingClientRect(),lr,size,pondWater());
      if(!worker.leg) {
        const from=point(spr,layer),dx=(dest.x-from.x)/100*layer.clientWidth,dy=(dest.y-from.y)/100*layer.clientHeight;
        const distance=Math.hypot(dx,dy);
        if(distance<4) {
          worker.last=worker.target.id;worker.lastEl=worker.target.el;worker.target=null;worker.restUntil=now+PARAMS.restMs;
          frogRest(inner);continue;
        }
        const fraction=Math.min(1,PARAMS.hopPx/distance);
        worker.leg={at:now,from,to:{x:from.x+(dest.x-from.x)*fraction,y:from.y+(dest.y-from.y)*fraction}};
        if(inner) inner.style.scale=(dx<0?'-1':'1')+' 1';
        if(!g.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          frogMove(inner,PARAMS.hopMs/1000);
                                                                            
                                                                             
                                                                               
          const hop=inner.getAnimations().find(a=>a.animationName==='frogHop');
          if(hop) {hop.pause();worker.leg.hop=hop;}
        }
      }
      const leg=worker.leg,t=clamp((now-leg.at)/PARAMS.hopMs,0,1),e=t*t*(3-2*t);
      if(leg.hop) leg.hop.currentTime=t*PARAMS.hopMs;
      spr.el.style.left=(leg.from.x+(leg.to.x-leg.from.x)*e)+'%';
      spr.el.style.top=(leg.from.y+(leg.to.y-leg.from.y)*e)+'%';
      if(t>=1) {worker.leg=null;frogRest(inner);}
    }
  }
  g.HarvestPondUI=Object.assign(api,{owns:id=>!!resourceOf(id),sync});
  function frame(now) {
    sync(now);
                                                                              
                                                                                 
    if(workers.size && g.GuidedHand) g.GuidedHand.refresh();
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})(typeof window!=='undefined'?window:globalThis);
