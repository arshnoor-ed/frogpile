                                                                              
                                                                              
(function(g){
  'use strict';
  var PARAMS=Object.freeze({
    get mergeRadiusFactor(){return mergeRadiusFactor();},                                       
    get dragHoldMs(){return dragHoldMs();},                                                  
    get tripMaxViewportShare(){return tripMaxViewportShare();},                                                             
    spacingBodyWidths:1.1,spacingIntervalMs:500,escapeDirections:8,
    hopMaxPct:4.5,hatchRadiusPct:8,hatchWanders:3,
    gateShare:0.33,gateVisitChance:0.5,
    dropStunMs:3000                                                                    
  });
  function mergeRadiusFactor(){
    if(!g.FPConfig)throw new Error('[PondMotion] Missing FPConfig for MergeRules merge_radius_factor');
    var value=g.FPConfig.value('MergeRules','merge_radius_factor');
    if((typeof value!=='number' && typeof value!=='string') || String(value).trim()==='' || !Number.isFinite(Number(value)) || Number(value)<=0)
      throw new Error('[PondMotion] Invalid MergeRules merge_radius_factor: '+value);
    return Number(value);
  }
  function dragHoldMs(){
    try{
      var value=g.FPConfig.value('MergeRules','pond_drag_hold_ms');
      if(value!==null && String(value).trim()!=='' && Number.isFinite(Number(value)) && Number(value)>=0)return Number(value);
    }catch(e){}                                                          
    return 3000;
  }
  function tripMaxViewportShare(){
    if(!g.FPConfig)throw new Error('[PondMotion] Missing FPConfig for MergeRules pond_trip_max_viewport_share');
    var value=g.FPConfig.value('MergeRules','pond_trip_max_viewport_share');
    if((typeof value!=='number' && typeof value!=='string') || String(value).trim()==='' || !Number.isFinite(Number(value)) || Number(value)<=0)
      throw new Error('[PondMotion] Invalid MergeRules pond_trip_max_viewport_share: '+value);
    return Number(value);
  }
  function gateResident(id){
    var h=2166136261;
    for(var i=0;i<String(id).length;i++) h=Math.imul(h^String(id).charCodeAt(i),16777619);
    return (h>>>0)/4294967296<PARAMS.gateShare;
  }
  function distance(a,b,aspect){return Math.hypot(b.x-a.x,(b.y-a.y)*aspect);}
  function limit(a,b,max,aspect){var d=distance(a,b,aspect),t=d>max?max/d:1;return {x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t};}
  function hopCount(a,b,aspect){return Math.max(1,Math.ceil(distance(a,b,aspect)/PARAMS.hopMaxPct));}
                                                                            
                                                                             
                                                                            
                                                                         
                                                                            
                                                                           
  function tripCap(a,b,aspect,layerWidthPx,viewportMinPx){
    var capPct=PARAMS.tripMaxViewportShare*viewportMinPx/layerWidthPx*100;
    return limit(a,b,capPct,aspect);
  }
                                                                          
                                                                              
  function escape(from,neighbours,bounds,valid,phase){
    function score(p){
      var edge=Math.min(p.x-bounds.x0,bounds.x1-p.x,p.y-bounds.y0,bounds.y1-p.y);
      var nearest=neighbours.reduce(function(best,b){return Math.min(best,Math.hypot(p.x-b.x,p.y-b.y)/((from.width+b.width)/2));},Infinity);
      return Math.min(nearest,1+edge/Math.max(from.width,1));
    }
    var best=null,bestScore=score(from);
    for(var i=0;i<PARAMS.escapeDirections;i++){
      var angle=(phase||0)+i*Math.PI*2/PARAMS.escapeDirections;
      var p={x:Math.max(bounds.x0,Math.min(bounds.x1,from.x+Math.cos(angle)*PARAMS.hopMaxPct)),
        y:Math.max(bounds.y0,Math.min(bounds.y1,from.y+Math.sin(angle)*PARAMS.hopMaxPct))};
      if(!valid(p))continue;
      var next=score(p);
      if(next>bestScore+0.001){best=p;bestScore=next;}
    }
    return best;
  }
  function inReach(point,rect){return Math.hypot(point.x-(rect.left+rect.width/2),point.y-(rect.top+rect.height/2))<=rect.width/2*PARAMS.mergeRadiusFactor;}
                                                                        
  function dragCandidates(bodies,carried,targets){
    return Object.keys(bodies).filter(function(id){
      return carried.indexOf(id)!==-1 || targets.indexOf(id)!==-1 || carried.some(function(source){
        var a=bodies[source],b=bodies[id];
                                                                         
        return a && Math.hypot(a.x-b.x,a.y-b.y)<=b.width*PARAMS.mergeRadiusFactor;
      });
    });
  }
                                                                                   
  var bounds=Object.create(null);
  function bodyRect(el){
    var img=el.querySelector('.fs-body'), fallback=el.querySelector('.frog-stack')||el;
    if(!img || !img.complete || !img.naturalWidth) return fallback.getBoundingClientRect();
    var key=img.currentSrc||img.src, b=bounds[key];
    if(!b){
      var c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;
      var ctx=c.getContext('2d',{willReadFrequently:true});ctx.drawImage(img,0,0);
      var data=ctx.getImageData(0,0,c.width,c.height).data,x0=c.width,y0=c.height,x1=0,y1=0;
      for(var y=0;y<c.height;y++)for(var x=0;x<c.width;x++)if(data[(y*c.width+x)*4+3]>32){x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);}
      b=bounds[key]={x:x0/c.width,y:y0/c.height,w:(x1-x0+1)/c.width,h:(y1-y0+1)/c.height};
    }
    var r=img.getBoundingClientRect(),flip=getComputedStyle(el).transform;
    var mirrored=flip && /^matrix\(-/.test(flip);
    return {left:r.left+(mirrored?1-b.x-b.w:b.x)*r.width,top:r.top+b.y*r.height,width:b.w*r.width,height:b.h*r.height};
  }
  function mergeDistance(from,to,point){
    var a=bodyRect(from),b=bodyRect(to);
    point=point||{x:a.left+a.width/2,y:a.top+a.height/2};
    return inReach(point,b)?Math.hypot(point.x-b.left-b.width/2,point.y-b.top-b.height/2):Infinity;
  }
                                                                                
  function stun(spr,now){spr.stunUntil=(now==null?Date.now():now)+PARAMS.dropStunMs;}
  function stunLeft(spr,now){return spr && spr.stunUntil ? Math.max(0,spr.stunUntil-(now==null?Date.now():now)) : 0;}
  var api={PARAMS:PARAMS,dragCandidates:dragCandidates,escape:escape,gateResident:gateResident,distance:distance,limit:limit,hopCount:hopCount,tripCap:tripCap,inReach:inReach,bodyRect:bodyRect,mergeDistance:mergeDistance,stun:stun,stunLeft:stunLeft};
  if(typeof module!=='undefined')module.exports=api;
                                                                           
                                                                                  
  api.dropPoint=function(id,cx,cy){
    if(typeof dragState==='undefined' || !dragState || dragState.frogId!==id)return {x:cx,y:cy};
    var el=wanderingSprites[id].el,lr=document.getElementById('frog-layer').getBoundingClientRect();
    var x=Math.max(3,Math.min(86,(cx-lr.left)/lr.width*100+(dragState.offL||0)));
    var y=Math.max(12,Math.min(84,(cy-lr.top)/lr.height*100+(dragState.offT||0)));
    var tv=ftueCinematicActive() && ftueTvBox(el);
    if(tv){x=Math.max(tv.x0,Math.min(tv.x1,x));y=Math.max(tv.y0,Math.min(tv.y1,y));}
    var b=bodyRect(el);
    return {x:b.left+b.width/2+(x-parseFloat(el.style.left))/100*lr.width,y:b.top+b.height/2+(y-parseFloat(el.style.top))/100*lr.height};
  };
  api.mergeAim=function(from,to,pickup){
    var a=bodyRect(from),b=bodyRect(to);
                                                                         
    if(typeof dragState!=='undefined' && dragState && wanderingSprites[dragState.frogId] && wanderingSprites[dragState.frogId].el===from && dragState.clientX!=null)
      pickup={x:dragState.clientX,y:dragState.clientY};
    return {x:b.left+b.width/2+pickup.x-a.left-a.width/2,y:b.top+b.height/2+pickup.y-a.top-a.height/2};
  };
  g.PondMotion=api;
})(typeof window!=='undefined'?window:globalThis);

                                                                           
                                                                                  
(function(){
  'use strict';
  if(typeof window==='undefined')return;
  var held=new Set(),snaps=new Map(),frame=0,hover=null;
  function carriedIds(){
    var ids=Array.from(snaps.keys());
    if(typeof dragState!=='undefined' && dragState)ids.push(dragState.frogId);
    return ids;
  }
  function settle(id){
    if(PondPause.active())return;
    var s=wanderingSprites[id];if(!s)return;
                                                                                                     
    if(window.FrogGait) FrogGait.reset(s.el.querySelector('.frog-hop'),true);
                                                                                
                                                                                
    var style=getComputedStyle(s.el),layer=getComputedStyle(s.el.offsetParent);
    var left=parseFloat(style.left)/parseFloat(layer.width)*100+'%',top=parseFloat(style.top)/parseFloat(layer.height)*100+'%';
    PondPause.cancel(s.timer);delete s.spacingTarget;
    s.el.style.transition='none';s.el.style.left=left;s.el.style.top=top;
    s.moving=false;s.separating=false;s.presenting=false;s.flying=false;
    s.el.classList.remove('hatch-travel');frogRest(s.el.querySelector('.frog-hop'));
  }
                                                                               
  function hold(id){
    var s=wanderingSprites[id];if(!s)return;
    settle(id);
    var holdMs=PondMotion.PARAMS.dragHoldMs;
    s.holdUntil=Date.now()+holdMs;
    PondPause.cancel(s.holdTimer);
    s.holdTimer=PondPause.later(function wake(){
      if(wanderingSprites[id]!==s)return;
      var remaining=s.holdUntil-Date.now();
      if(remaining>0){s.holdTimer=PondPause.later(wake,remaining);return;}
      delete s.holdUntil;delete s.holdTimer;
      if(window.PondRest && !held.has(id) && !PondMotion.isCarried(id)) PondRest.settle(id);
      scheduleWander(id);
    },holdMs);
  }
  function sync(mergedId){
    var carried=carriedIds(),targets=Array.from(snaps.values());
    var nextHover=typeof dragState!=='undefined' && dragState ? dragState._tgt||null : null;
    if(hover && hover!==nextHover && hover!==mergedId)hold(hover);
    hover=nextHover;
    if(hover)targets.push(hover);
    var bodies={};
    if(carried.length)Object.keys(wanderingSprites).forEach(function(id){
      var r=PondMotion.bodyRect(wanderingSprites[id].el);
      bodies[id]={x:r.left+r.width/2,y:r.top+r.height/2,width:r.width};
    });
    var next=new Set(PondMotion.dragCandidates(bodies,carried,targets).filter(function(id){return carried.indexOf(id)===-1;}));
    var released=[];
    held.forEach(function(id){if(!next.has(id) && id!==mergedId && id!==nextHover)released.push(id);});
    var previous=held;held=next;
    next.forEach(function(id){if(!previous.has(id))settle(id);});
    released.forEach(hold);
    if(carried.length && !frame)frame=requestAnimationFrame(function(){frame=0;sync();});
  }
  PondMotion.hold=hold;
  PondMotion.syncDragProtection=sync;
  PondMotion.heldForDrag=function(id){sync();var s=wanderingSprites[id];return held.has(id) || !!(s && s.holdUntil>Date.now());};
  PondMotion.isCarried=function(id){return carriedIds().indexOf(id)!==-1;};
  PondMotion.beginSnap=function(from,to){snaps.set(from,to);sync();};
  PondMotion.endSnap=function(from){snaps.delete(from);sync();};
})();

                                                                        
(function(){
  'use strict';
  if(typeof window==='undefined')return;
  function free(id,s){
    return s && !PondMotion.heldForDrag(id) && !PondMotion.isCarried(id) && !s.moving && !s.presenting && !s.ftueSpot && !s.flying && !s.tonguing && !PondMotion.stunLeft(s) &&
      !s.el.querySelector('.frog-hop.fg-moving') &&                                                               
      !(dragState && dragState.frogId===id) && !expFrogBusy(id) &&
      !(window.HarvestPondUI && HarvestPondUI.owns(id)) && !flowerStationOfFrog(id);
  }
  setInterval(function(){
    if(typeof state==='undefined' || !state || activeTab!=='pond' || PondPause.active() || document.hidden || ftueCinematicActive())return;
    var layer=document.getElementById('frog-layer');if(!layer)return;
    var lr=layer.getBoundingClientRect(),aspect=lr.height/lr.width;
    PondMotion.syncDragProtection();
    var ids=Object.keys(wanderingSprites),bodies={},plans=[];
    ids.forEach(function(id){
      var r=PondMotion.bodyRect(wanderingSprites[id].el);
      bodies[id]={x:(r.left+r.width/2-lr.left)/lr.width*100,y:(r.top+r.height/2-lr.top)/lr.width*100,width:r.width/lr.width*100};
    });
    ids.forEach(function(id,index){
      var s=wanderingSprites[id];if(!free(id,s))return;
      var body=bodies[id],neighbours=ids.filter(function(other){return other!==id && !PondMotion.isCarried(other);}).map(function(other){return bodies[other];});
      if(!neighbours.some(function(b){return Math.hypot(body.x-b.x,body.y-b.y)<(body.width+b.width)/2*PondMotion.PARAMS.spacingBodyWidths;}))return;
      var from={x:parseFloat(s.el.style.left),y:parseFloat(s.el.style.top)};
      var ox=body.x-from.x,oy=body.y-from.y*aspect;
      var X=PondGrow.widen(6,92,0,0,PondGrow.current());                                        
      var bounds={x0:X.x0+ox,x1:X.x1+ox,y0:GATE_BAND.y0*aspect+oy,y1:MERGE_AREA.y1*aspect+oy};
      function anchor(p){return {x:p.x-ox,y:(p.y-oy)/aspect};}
      var escape=PondMotion.escape(body,neighbours,bounds,function(p){
        var t=anchor(p);
        if(s.hatchHome && s.hatchWanders>0 && PondMotion.distance(s.hatchHome,t,aspect)>PondMotion.PARAMS.hatchRadiusPct)return false;
        return !isPathOverCauldron(from.x,from.y,t.x,t.y);
      },index*Math.PI*(3-Math.sqrt(5)));
      if(escape)plans.push({id:id,target:anchor(escape)});
    });
    plans.forEach(function(plan){
      var s=wanderingSprites[plan.id];
      PondPause.cancel(s.timer);s.spacingTarget=plan.target;scheduleWander(plan.id);
    });
  },PondMotion.PARAMS.spacingIntervalMs);
})();
(function(){
  if(typeof window==='undefined')return;
  PondMotion.hopBlocked=function(id,x,y){
    var spr=wanderingSprites[id],r=PondMotion.bodyRect(spr.el),lr=document.getElementById('frog-layer').getBoundingClientRect();
    var dx=(x-parseFloat(spr.el.style.left))/100*lr.width,dy=(y-parseFloat(spr.el.style.top))/100*lr.height;
    var cx=r.left+r.width/2,cy=r.top+r.height/2;
    return Object.keys(wanderingSprites).some(function(other){
      if(other===id || PondMotion.isCarried(other))return false;
      var s=wanderingSprites[other],b=PondMotion.bodyRect(s.el),bx=b.left+b.width/2,by=b.top+b.height/2;
      var min=(r.width+b.width)/2*PondMotion.PARAMS.spacingBodyWidths;
      var before=Math.hypot(cx-bx,cy-by),after=Math.hypot(cx+dx-bx,cy+dy-by);
      return after<min && after<before;
    });
  };
})();
