                                                                              
(function(g){
  'use strict';
                                                                                                                                                                                             
                                                                           
                                                                             
                                                                            
                                                                          
                                                                  
  var PARAMS={hatchHoldMs:300,hatchHopMs:700,mergeTravelMs:700,mergePopMs:640,readingGapMs:500,guideGatherMs:700,celebrateMs:1900,cameraGlideMs:1200,padBuiltGlowMs:1600,padPopInMs:550,padPopDelayMs:600};
  function travelParams(){
    return g.FtueSteps && g.FtueSteps.cinematicActive() ? g.FtueSteps.CINEMATIC_PARAMS : PARAMS;
  }
  var hatches=Object.create(null), movingMerge=false, readingUntil=0, previousTask=null, celebration=null, completedTasks=[];
  function hatchOrigin(padIndex){
    var pad=lilypadSprites[padIndex];
    return pad ? {x:parseFloat(pad.el.style.left),y:parseFloat(pad.el.style.top)} : null;
  }
                                                                         
  function tvLive(){ return !!(g.FtueSteps && g.FtueSteps.cinematicActive()); }
                                                                              
                                                                              
                                                                                     
  var glide=null;
  function smooth(t){ return t*t*t*(t*(t*6-15)+10); }
  function glideCamera(x,y){
    var from={x:pondCam.x,y:pondCam.y}, W=pondWorld();
    pondCam.x=x; pondCam.y=y; pondCamClamp();
    var to={x:pondCam.x,y:pondCam.y};
    pondCam.x=from.x; pondCam.y=from.y;
    if(Math.abs(to.x-from.x)*W.w<1 && Math.abs(to.y-from.y)*W.h<1){ glide=null; return; }
    if(g.matchMedia && g.matchMedia('(prefers-reduced-motion: reduce)').matches){
      glide=null;pondCam.x=to.x;pondCam.y=to.y;syncPondCamera();return;
    }
    var run={to:to,start:null,at:from};
    glide=run;
    requestAnimationFrame(function step(now){
      if(glide!==run) return;
      if(pondCam.x!==run.at.x || pondCam.y!==run.at.y){ glide=null; return; }
      if(run.start===null) run.start=now;
      var t=Math.min(1,(now-run.start)/PARAMS.cameraGlideMs), e=smooth(t);
      pondCam.x=from.x+(to.x-from.x)*e; pondCam.y=from.y+(to.y-from.y)*e;
      syncPondCamera();
      run.at={x:pondCam.x,y:pondCam.y};
      if(t<1) requestAnimationFrame(step); else glide=null;
    });
  }
                                                                                                 
  function cameraLead(layer){
    return glide ? {x:(glide.to.x-pondCam.x)*layer.width,y:(glide.to.y-pondCam.y)*layer.height} : {x:0,y:0};
  }
  function focusHatchPad(index){
    if(tvLive() || glide) return;
    var pad=lilypadSprites[index], stage=document.querySelector('.pond-stage');
    if(!pad || !stage) return;
    var r=pad.el.getBoundingClientRect(), view=stage.getBoundingClientRect();
    if(r.left>=view.left && r.right<=view.right && r.top>=view.top+140 && r.bottom<=view.bottom-100) return;
    var layer=document.getElementById('frog-layer').getBoundingClientRect();
    glideCamera(pondCam.x+(r.left+r.width/2-(view.left+view.width/2))/layer.width,
      pondCam.y+(r.top+r.height/2-(view.top+view.height*.6))/layer.height);
  }
                                                                        
                                                                         
                                                                    
                                                                     
                                                                        
                                                                            
                                                                           
                                                                             
                                                                            
                                                                            
                                                                        
                                                                       
                 
  function popInNewPad(index, onDone){
    var pad=lilypadSprites[index];
    if(!pad || !pad.el){ if(onDone) onDone(); return; }
    focusHatchPad(index);
    var glow=function(){
      pad.el.classList.add('pad-built-glow');
      setTimeout(function(){ pad.el.classList.remove('pad-built-glow'); }, PARAMS.padBuiltGlowMs);
      if(onDone) onDone();
    };
    var reveal=function(){
      var el=pad.el;
      el.style.opacity=''; el.style.pointerEvents='';                                            
      if(g.NewPadGlow && g.NewPadGlow.isNew(state,index)){
        g.NewPadGlow.reveal(index,onDone); return;
      }
      if(typeof g.padRipple==='function') g.padRipple(el);
      var reduced=g.matchMedia && g.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if(reduced || typeof el.animate!=='function'){ glow(); return; }
                                                                      
                                                                 
                                                                           
                                                                         
      var anim=el.animate([
        {opacity:0, scale:'.15', offset:0},
        {opacity:1, scale:'1.18', offset:.55},
        {scale:'.94', offset:.78},
        {opacity:1, scale:'1', offset:1}
      ], {duration:PARAMS.padPopInMs, easing:'cubic-bezier(.25,1.4,.4,1)'});
      anim.onfinish=glow; anim.oncancel=glow;
    };
    var delayedReveal=function(){ setTimeout(reveal, PARAMS.padPopDelayMs); };
    if(glide){
      var waitForGlide=function(){
        if(glide) requestAnimationFrame(waitForGlide); else delayedReveal();
      };
      requestAnimationFrame(waitForGlide);
    } else delayedReveal();
  }
                                                                                                       
                                                                                        
  function queueHatch(id,origin,landing){ if(origin || landing) hatches[id]={origin:origin||null,landing:landing||null}; }
  function spawnHatch(frog,spr){
    var queued=hatches[frog.id]; delete hatches[frog.id];
    if(!queued) return false;
    var origin=queued.origin, p=travelParams(), el=spr.el;
    var layer=document.getElementById('frog-layer').getBoundingClientRect(), r=el.getBoundingClientRect();
    var destination=queued.landing
      ? {x:queued.landing.x-r.width/layer.width*50, y:queued.landing.y-r.height/layer.height*50}
      : {x:parseFloat(el.style.left),y:parseFloat(el.style.top)};
    if(!origin){
      el.style.transition='none'; el.style.left=destination.x+'%'; el.style.top=destination.y+'%';
      if(g.PondRest) g.PondRest.settle(frog.id);
      frogRest(el.querySelector('.frog-hop'));
      spr.timer=PondPause.later(function(){ scheduleWander(frog.id); },2500);
      return true;
    }
    var stage=document.querySelector('.pond-stage').getBoundingClientRect();
    var tv=tvLive() && typeof ftueTvBox==='function' && ftueTvBox(el);
    if(tv){                                             
      destination.x=Math.max(tv.x0,Math.min(tv.x1,destination.x));
      destination.y=Math.max(tv.y0,Math.min(tv.y1,destination.y));
    } else {                                                                                 
      var lead=cameraLead(layer), lx=layer.left-lead.x, ly=layer.top-lead.y;                                    
      destination.x=Math.max((stage.left+24-lx)/layer.width*100,Math.min((stage.right-r.width-24-lx)/layer.width*100,destination.x));
      destination.y=Math.max((stage.top+140-ly)/layer.height*100,Math.min((stage.bottom-r.height-100-ly)/layer.height*100,destination.y));
    }
                                                                           
    var start={x:origin.x-r.width/layer.width*50,y:origin.y-r.height/layer.height*65};
    if(g.PondMotion && !queued.landing){
      destination=g.PondMotion.limit(start,destination,g.PondMotion.PARAMS.hopMaxPct,layer.height/layer.width);
      spr.hatchHome=start; spr.hatchWanders=g.PondMotion.PARAMS.hatchWanders;
    }
    el.style.transition='none'; el.style.left=(origin.x-r.width/layer.width*50)+'%'; el.style.top=(origin.y-r.height/layer.height*65)+'%';
    el.classList.add('hatch-travel'); spr.presenting=true;
    frogRest(el.querySelector('.frog-hop'));
    var hops=g.PondMotion ? g.PondMotion.hopCount(start,destination,layer.height/layer.width) : 1;
    function travel(i){
      if(wanderingSprites[frog.id]!==spr) return;
      if(i>=hops){
        spr.presenting=false; el.classList.remove('hatch-travel');
        if(g.PondRest) g.PondRest.settle(frog.id);
        readingUntil=Date.now()+p.readingGapMs;
        frogRest(el.querySelector('.frog-hop'));
        spr.timer=PondPause.later(function(){scheduleWander(frog.id);},2500);
        return;
      }
      void el.offsetWidth;
      el.style.transition='left '+p.hatchHopMs+'ms ease-in-out, top '+p.hatchHopMs+'ms ease-in-out';
      el.style.left=(start.x+(destination.x-start.x)*(i+1)/hops)+'%';
      el.style.top=(start.y+(destination.y-start.y)*(i+1)/hops)+'%';
      frogMove(el.querySelector('.frog-hop'),p.hatchHopMs/1000);
      spr.timer=PondPause.later(function(){travel(i+1);},p.hatchHopMs);
    }
    spr.timer=PondPause.later(function(){travel(0);},p.hatchHoldMs);
    return true;
  }
  function mergeTravel(fromId,toId,done){
    var p=travelParams();
    frameMergePair([fromId,toId]);
    var a=wanderingSprites[fromId], b=wanderingSprites[toId];
    if(movingMerge || !a || !b || a.presenting || b.presenting) return false;
    movingMerge=true;
                                                                                        
    var layer=document.getElementById('frog-layer').getBoundingClientRect();
    [a,b].forEach(function(s){
      if(window.FrogGait) FrogGait.reset(s.el.querySelector('.frog-hop'),true);                                          
      var r=s.el.getBoundingClientRect();
      PondPause.cancel(s.timer);s.presenting=true;s.el.style.transition='none';
      s.el.style.left=((r.left-layer.left)/layer.width*100)+'%';
      s.el.style.top=((r.top-layer.top)/layer.height*100)+'%';
    });
    PondMotion.beginSnap(fromId,toId);
    void a.el.offsetWidth;
    a.el.classList.add('cinematic-merge-travel');
    a.el.style.transition='left '+p.mergeTravelMs+'ms ease-in-out, top '+p.mergeTravelMs+'ms ease-in-out';
    a.el.style.left=b.el.style.left; a.el.style.top=b.el.style.top;
    frogMove(a.el.querySelector('.frog-hop'),p.mergeTravelMs/1000);
    setTimeout(function(){
      movingMerge=false;
      PondMotion.endSnap(fromId);
      [a,b].forEach(function(s){s.presenting=false;s.el.classList.remove('cinematic-merge-travel');});
                                                                               
      if(FtueSteps.cinematicActive() && wanderingSprites[fromId]===a && wanderingSprites[toId]===b){
        done(); readingUntil=Date.now()+p.mergePopMs+p.readingGapMs;
      }
      else [fromId,toId].forEach(function(id){if(wanderingSprites[id]) scheduleWander(id);});
    },p.mergeTravelMs);
    return true;
  }
  function frameMergePair(ids){
    if(g.PondPause && PondPause.active()) return;
    var p=travelParams();
    if(!ids || ids.some(function(id){return !wanderingSprites[id] || wanderingSprites[id].presenting;})) return;
    var boxes=ids.map(function(id){return wanderingSprites[id].el.getBoundingClientRect();});
    var stage=document.querySelector('.pond-stage').getBoundingClientRect();
    if(boxes.every(function(r){return r.left>=stage.left+24 && r.right<=stage.right-54 && r.top>=stage.top+140 && r.bottom<=stage.bottom-100;})) return;
    var layer=document.getElementById('frog-layer').getBoundingClientRect();
    if(Math.abs(boxes[0].left-boxes[1].left)>stage.width-130){
      ids.forEach(function(id,i){
        var spr=wanderingSprites[id];PondPause.cancel(spr.timer);spr.presenting=true;
        if(window.FrogGait) FrogGait.reset(spr.el.querySelector('.frog-hop'),true);                                          
        spr.el.style.transition='left '+p.guideGatherMs+'ms ease-in-out, top '+p.guideGatherMs+'ms ease-in-out';
        spr.el.style.left=((stage.left+stage.width*(i?0.6:0.3)-layer.left)/layer.width*100)+'%';
        spr.el.style.top=((stage.top+stage.height*.6-layer.top)/layer.height*100)+'%';
        frogMove(spr.el.querySelector('.frog-hop'),p.guideGatherMs/1000);
        spr.timer=PondPause.later(function(){if(wanderingSprites[id]===spr){spr.presenting=false;frogRest(spr.el.querySelector('.frog-hop'));}},p.guideGatherMs);
      });
      return;
    }
                                                                                                                
    if(tvLive() || glide || dragState) return;
    var cx=(boxes[0].left+boxes[0].width/2+boxes[1].left+boxes[1].width/2)/2;
    var cy=(boxes[0].top+boxes[0].height/2+boxes[1].top+boxes[1].height/2)/2;
    glideCamera(pondCam.x+(cx-(stage.left+stage.width/2))/layer.width,
      pondCam.y+(cy-(stage.top+stage.height*.6))/layer.height);
  }
                                                                          
  function completedPlate(args,build,elapsed){
    var old=args.slice();old[1]=old[2];old[3]=true;old[4]=true;
    return build.apply(null,old).replace(/ tp-enter/g,'').replace('task-plate-done','task-plate-done tp-celebrate').replace('<img class="tp-mega"','<span class="tp-success" style="--success-t:-'+Math.round(elapsed)+'ms"><b>✓</b></span><img class="tp-mega"').replace('style="','style="--success-t:-'+Math.round(elapsed)+'ms;');
  }
  function taskPlate(args,build){
    if(typeof ftueCinematicActive==='function' && ftueCinematicActive()) return build.apply(null,args);
    var now=performance.now(), label=args[0];
                                                                     
    var identity=args[6] || label,previousIdentity=previousTask && (previousTask[6] || previousTask[0]);
    if(previousTask && identity!==previousIdentity && previousTask[0]){
      completedTasks.push(previousTask.slice());
    }
    previousTask=args.slice();
    if(celebration && now-celebration.at>=PARAMS.celebrateMs) celebration=null;
    if(!celebration && completedTasks.length){
      celebration={args:completedTasks.shift(),at:now};
      setTimeout(function(){if(typeof render==='function') render();},PARAMS.celebrateMs);
    }
    if(celebration){
      var elapsed=now-celebration.at;
      if(elapsed<PARAMS.celebrateMs){
        return completedPlate(celebration.args,build,elapsed);
      }
      celebration=null;
    }
    return build.apply(null,args);
  }
  function clearTask(build){
    if(!previousTask && !celebration) return '';
    var html=taskPlate(['',0,1,false,false,null],build);
    if(!celebration){previousTask=null;return '';}
    return html;
  }
  g.PondPresentation={PARAMS:PARAMS,hatchOrigin:hatchOrigin,focusHatchPad:focusHatchPad,popInNewPad:popInNewPad,queueHatch:queueHatch,spawnHatch:spawnHatch,mergeTravel:mergeTravel,mergeBusy:function(){return movingMerge;},cinematicBusy:function(){return movingMerge || Date.now()<readingUntil || Object.keys(wanderingSprites).some(function(id){return wanderingSprites[id].presenting;});},taskPlate:taskPlate,completedPlate:completedPlate,resetTask:function(){previousTask=null;celebration=null;completedTasks.length=0;},clearTask:clearTask,frameMergePair:frameMergePair,glideCamera:glideCamera,cameraGliding:function(){return !!glide;}};
})(window);
