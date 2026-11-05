                                                                                     
                                                                                 
                                                                      
                                                                               
                                                                         
(function(g){
  'use strict';
  function overlaps(a,b,margin=0){
    return a.left < b.right+margin && a.right+margin > b.left &&
      a.top < b.bottom+margin && a.bottom+margin > b.top;
  }
  function contains(a,b){
    return b.left>=a.left && b.right<=a.right && b.top>=a.top && b.bottom<=a.bottom;
  }
  function box(x,y,width,height){
    return {left:x-width/2, right:x+width/2, top:y-height/2, bottom:y+height/2};
  }
  function needsPlacement(record,now,epoch,regrowAt=0){
    if(now<record.retryAt) return false;
    return !record.placed || record.epoch!==epoch ||
      (regrowAt>record.regrowAt && now>=regrowAt);
  }
                                                                                              
                                                                                                 
                                                                                                
                                                                                              
                                                                                                   
                                                                        
  const PARAMS={frontDepth:3, sideStrip:0.13};
  function frontOf(door,world,depth=PARAMS.frontDepth,strip=PARAMS.sideStrip){
    const mid=world.left+world.width/2, left=(door.left+door.right)/2<mid;
    return {left:left?world.left+world.width*strip:mid, right:left?mid:world.right-world.width*strip,
      top:door.top, bottom:door.bottom+(door.bottom-door.top)*depth, side:left?'left':'right'};
  }
                                                                      
  function stripX(front,strip=PARAMS.sideStrip){ return front.side==='left'?strip/2:1-strip/2; }
  const api={overlaps,contains,box,needsPlacement,frontOf,stripX,PARAMS};
  if(typeof module!=='undefined' && module.exports) module.exports=api;
  if(!g.document) return;
  g.PondSpawn=api;
  const records=new WeakMap(), logs=new Map();
  const interactive='button, [onclick], [onpointerdown], a[href], input, [role="button"], .pond-mark, .wander-frog, .lilypad, .fb-station, .fb-slot, .hud-top, .bottom-dock, .tutorial-tip, .mission-banner, .g-skull, .skull-sprite, .g-fpad, .g-sprite, .gacha-tadpole, .frog-boat, .frog-market, .pond-lantern, .lilypad .label, .lilypad .pad-tap, .pad-plank, #whirlpool';
  function exclusions(){
    return Array.from(document.querySelectorAll(interactive)).filter(el=>
      !el.closest('.pond-log,.g-rock') && el.checkVisibility({checkVisibilityCSS:true,checkOpacity:true})
    ).map(el=>el.getBoundingClientRect()).filter(r=>r.width && r.height);
  }
  function concealBehindFixedUI(items){
                                                                                  
                                                                                    
                                                                                
                                                                   
    const zones=Array.from(document.querySelectorAll('.hud-top,.bottom-dock,.tutorial-tip,.mission-banner'))
      .filter(el=>el.checkVisibility({checkVisibilityCSS:true,checkOpacity:true}))
      .map(el=>el.getBoundingClientRect());
    items.forEach(item=>{
      item.el.style.visibility=!item.record.placed || zones.some(r=>contains(r,item.rect))?'hidden':'';
    });
  }
  let epoch=0, layoutSignature='', layoutDue=0, pointerDown=false, quietUntil=0;
  const layoutPoints=(rows,type,tier)=>g.PondGrow ? g.PondGrow.points(rows,type,tier) : g.PondLayout.pointsFor(rows,type,tier);
  const pushedHome=(p,tier)=>g.PondGrow ? g.PondGrow.home(p,tier) : p;
                                                                           
                                                                          
                                                                           
                                                                        
                                                       
  let placedTier=null;
  function followTier(){
    if(typeof state==='undefined' || !state) return;
    const tier=state.pondTier||0;
    if(placedTier===null){ placedTier=tier; return; }
    if(tier===placedTier || !g.PondGrow) return;
    const rows=(typeof FPConfig!=='undefined' && FPConfig.rows) ? FPConfig.rows('PondLayout') : [];
    const pts={};
    ['wood','stone'].forEach(type=>{ pts[type]={from:layoutPoints(rows,type,placedTier), to:layoutPoints(rows,type,tier)}; });
    const placed=[];
    logs.forEach(record=>placed.push({record,type:'wood'}));
    gardenRocks.forEach(rock=>{ const record=rock.el && records.get(rock.el); if(record) placed.push({record,type:'stone',rock}); });
    placed.forEach(({record,type,rock})=>{
      if(!record.placed || !record.el) return;
      const to=g.PondGrow.carry(record,pts[type].from,pts[type].to);
      if(!to){ record.epoch=-1; return; }                                                         
      record.x=to.x; record.y=to.y;
      record.el.style.left=(to.x*100)+'%'; record.el.style.top=(to.y*100)+'%';
      if(rock){ rock.x=to.x*100; rock.y=to.y*100; }
    });
    placedTier=tier;
  }
  function sync(){
    const layer=document.getElementById('frog-layer');
    if(!layer || !layer.clientWidth || typeof state==='undefined' || activeTab!=='pond') return;
    followTier();
    if(g.PondExpansionCamera && g.PondExpansionCamera.active()) return;
    const now=Date.now();
    const signature=[innerWidth,innerHeight,layer.clientWidth,layer.clientHeight,state.pondExpanded,POND_SCENE.artFrac].join('|');
    if(signature!==layoutSignature){
      if(layoutSignature) layoutDue=now+1200;                                            
      layoutSignature=signature;
    }
    if(pointerDown || now<quietUntil) return;                                             
    if(layoutDue && now>=layoutDue){ epoch++; layoutDue=0; }
    const lr=layer.getBoundingClientRect();
                                                                               
                                                                      
                                                                         
                                                                         
                                                                            
                                                                          
                                                                        
                                                                             
    const stations=g.FlowerPondUI ? g.FlowerPondUI.footprints() : [];
    const padFootprints=stations.concat(
      Array.from(document.querySelectorAll('.lilypad'))
        .filter(el=>!el.querySelector('.fb-station') && el.checkVisibility({checkVisibilityCSS:true,checkOpacity:true}))
        .map(el=>el.getBoundingClientRect()).filter(r=>r.width && r.height));
    const resources=Array.from(document.querySelectorAll('.pond-log')).concat(gardenRocks.map(r=>r.el));
    const water=g.WaterTexture && g.WaterTexture.propInWater ? g.WaterTexture : null;
                                                                                             
                                                                                             
                                                                                               
                                                                                                  
    const taps=Array.from(document.querySelectorAll('#pond-landmarks .pond-mark'))
      .map(el=>el.getBoundingClientRect()).filter(r=>r.width && r.height);
    const fronts=taps.map(r=>frontOf(r,lr)), doors=taps.concat(fronts);
    const onDoor=r=>doors.some(d=>overlaps(r,d,6));
    const items=[];
    for(const el of resources){
      if(!el || !el.isConnected) continue;
      const log=el.matches('.pond-log'), id=Number(el.dataset.log);
      const image=log?el:el.querySelector('.rock-sprite');
      if(!image || !image.complete || !image.naturalWidth){ el.style.visibility='hidden'; continue; }
      const parent=el.parentElement, pr=parent.getBoundingClientRect();
      if(!pr.width || !pr.height) continue;
      let record=log?logs.get(id):records.get(el);
      if(!record){ record={x:parseFloat(el.style.left)/100,y:parseFloat(el.style.top)/100,
        retryAt:0,placed:false,epoch,regrowAt:0};
        if(log) logs.set(id,record); else records.set(el,record); }
                                                                         
      if(record.el!==el && record.placed){
        el.style.left=(record.x*100)+'%'; el.style.top=(record.y*100)+'%'; el.style.visibility='';
      }
      record.el=el;
      const width=image.offsetWidth*(pr.width/parent.clientWidth)*1.12;
      const height=image.offsetHeight*(pr.height/parent.clientHeight)*1.12;
      const rect=box(pr.left+record.x*pr.width,pr.top+record.y*pr.height,width,height);
      const regrowAt=log?(_logReady[id]||0):0;
                                                                         
      const fw=width/1.12/pr.width, fh=height/1.12/pr.height;
                                                                                        
                                                                                            
                                                              
      if(water && record.placed && record.waterV!==water.waterVersion()){
        record.waterV=water.waterVersion();
        if(!water.propInWater(record.x,record.y,fw,fh)) record.epoch=-1;
      }
                                             
      if(record.placed && onDoor(box(pr.left+record.x*pr.width,pr.top+record.y*pr.height,width/1.12,height/1.12))) record.epoch=-1;
      items.push({el,log,id,record,pr,width,height,fw,fh,rect,regrowAt,
        due:needsPlacement(record,now,epoch,regrowAt)});
    }
    if(!items.some(item=>item.due)){ concealBehindFixedUI(items); return; }
    const excluded=exclusions().concat(padFootprints);
    const tier=(typeof state!=='undefined' && state.pondTier)||0;
    const layoutRows=(typeof FPConfig!=='undefined' && FPConfig.rows) ? FPConfig.rows('PondLayout') : [];
                                                                                              
                                                                                            
    const homeAt=item=>item.log && typeof POND_LOGS!=='undefined' && POND_LOGS[item.id] && pushedHome(POND_LOGS[item.id],tier);
    const displaced=item=>{ const h=homeAt(item);
      return h ? fronts.some(f=>overlaps(box(lr.left+h.x*lr.width,lr.top+h.y*lr.height,item.width/1.12,item.height/1.12),f,6)) : false; };
    for(const item of items.slice().sort((a,b)=>(displaced(a)-displaced(b)) || (b.width*b.height-a.width*a.height))){
      if(!item.due) continue;
      const {el,log,record,pr,width,height,regrowAt}=item;
      const type=log?'wood':'stone';
                                                                                            
                                                                                           
                                                                                               
                                                                                     
      const rectAt=(x,y)=>box(lr.left+x*lr.width,lr.top+y*lr.height,width/1.12,height/1.12);
      const keep=(x,y)=>!onDoor(rectAt(x,y));
      const place=(x,y)=>{ const r=rectAt(x,y);
        return !items.some(o=>o!==item && o.record.placed && overlaps(r,o.rect,-2)); };
                                                                                                  
                                                                                                   
                                                                                                      
      const inFront=p=>water && fronts.find(fr=>overlaps(rectAt(p.x,p.y),fr,6));
      const moved=(x,y)=>keep(x,y) && place(x,y);
      const toSide=(p,f)=>{
        for(let y=p.y;y<=0.95;y+=0.12){ const q=water.propToWater(stripX(f),y,item.fw,item.fh,moved,place); if(q) return q; }
        return water.propToWater(p.x,p.y,item.fw,item.fh,keep,place,0.6);
      };
      const spot=p=>water ? (water.propToWater(p.x,p.y,item.fw,item.fh,keep,place) ||
          water.propToWater(p.x,p.y,item.fw,item.fh,keep,place,0.6)) : (keep(p.x,p.y) ? p : null);
      const onScreen=p=>({ x:lr.left+p.x*lr.width, y:lr.top+p.y*lr.height });
                                                                                                
                                                                                               
                                                               
      const points=layoutPoints(layoutRows,type,tier), sides=new Map();
      const clear=points.filter(p=>{ const f=inFront(p); if(!f) return true;
        if(!log && (!sides.has(f) || p.y<sides.get(f).y)) sides.set(f,p);
        return false; });
      const candidates=clear.map(spot).concat([...sides].map(([f,p])=>toSide(p,f)))
        .filter(Boolean).map(onScreen);
      if(water) record.waterV=water.waterVersion();
      let chosen;
      const home=homeAt(item);
      const homeFront=home && inFront(home);
      if(homeFront){
                                                                                 
        const q=toSide(home,homeFront); chosen=q && onScreen(q);
      } else if(home){
                                                                          
                                                                                 
                                                                               
                                                                                   
                                                               
        const hx=lr.left+home.x*lr.width, hy=lr.top+home.y*lr.height;
        const others=items.filter(other=>other!==item && other.log && other.record.placed);
        const held=others.map(other=>({x:lr.left+other.record.x*lr.width, y:lr.top+other.record.y*lr.height}));
        const trunks=others.map(other=>other.rect);
        chosen=candidates.filter(c=>!held.some(h=>Math.hypot(h.x-c.x,h.y-c.y)<2) &&
            g.PondLayout.maxOverlapFrac(box(c.x,c.y,width/1.12,height/1.12),trunks)<=0.25)
          .sort((a,b)=>Math.hypot(a.x-hx,a.y-hy)-Math.hypot(b.x-hx,b.y-hy))[0]||null;
      } else {
                                                                               
                                                                              
                                                                              
                                                                          
        const rocks=items.filter(other=>other!==item && !other.log && other.record.placed);
        const free=candidates.filter(c=>!rocks.some(o=>Math.hypot(lr.left+o.record.x*lr.width-c.x,lr.top+o.record.y*lr.height-c.y)<2));
        chosen=g.PondLayout.pickFreePoint(free,rocks.map(other=>other.rect).concat(excluded),{w:width,h:height},{toleranceFrac:0.25});
      }
      if(!chosen){
        record.placed=false; record.retryAt=now+FPConfig.value('Harvesting',item.log?'manual_wood_regrow_s':'manual_stone_regrow_s')*1000;
        el.style.visibility='hidden'; continue;
      }
      record.x=(chosen.x-pr.left)/pr.width; record.y=(chosen.y-pr.top)/pr.height;
      item.rect=box(chosen.x,chosen.y,width,height);
      record.placed=true; record.epoch=epoch; record.regrowAt=regrowAt; record.retryAt=0;
      el.style.left=(record.x*100)+'%'; el.style.top=(record.y*100)+'%';
      if(!log){ const rock=gardenRocks.find(r=>r.el===el); if(rock){rock.x=record.x*100;rock.y=record.y*100;} }
      el.style.visibility='';
    }
    concealBehindFixedUI(items);
    g.PondLayout.ySortLayer(layer);
  }
  api.sync=sync;
  api.followTier=followTier;
  api.start=function(){
    if(api.started) return; api.started=true;
    document.addEventListener('pointerdown',()=>{pointerDown=true;},true);
    const release=()=>{pointerDown=false;quietUntil=Date.now()+500;};
    document.addEventListener('pointerup',release,true);
    document.addEventListener('pointercancel',release,true);
    g.addEventListener('blur',release);
                                                                                      
    setInterval(sync,250);
    sync();
  };
})(typeof window!=='undefined'?window:globalThis);
