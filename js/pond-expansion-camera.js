                                                                            
                                                                              
(function (g) {
  'use strict';
  const PARAMS = {outMs:600, holdMs:300, inMs:600, scale:0.8, overscan:0.2};
  const smooth = t => { t=Math.max(0,Math.min(1,t)); return t*t*t*(t*(t*6-15)+10); };
  function pulseScale(ms, minimum=PARAMS.scale) {
    if(ms <= PARAMS.outMs) return 1-(1-minimum)*smooth(ms/PARAMS.outMs);
    const back=ms-PARAMS.outMs-PARAMS.holdMs;
    return minimum+(1-minimum)*smooth(back/PARAMS.inMs);
  }
  function coverage(world, camera, scale, room) {
                                                                         
                                                                             
                                                                         
                                                                 
    const m=room||{l:0,r:0,b:0};
    const x=world.vw/2*(1-scale)-(camera.x*world.w-world.vw/2)*scale;
    const y=world.vh/2*(1-scale)-(camera.y*world.h-world.vh/2)*scale;
    const clamp=(v,lo,hi=0)=>Math.max(lo,Math.min(hi,v));
    return {x:clamp(x,world.vw-world.w*(1+m.r)*scale,world.w*m.l*scale)-x,
      y:clamp(y,world.vh-world.h*(1+m.b+PARAMS.overscan)*scale,world.h*PARAMS.overscan*scale)-y};
  }
                                                                             
  function floorScale(world, room) {
    const m=room||{l:0,r:0,b:0};
    return Math.min(1,Math.max(world.vw/(world.w*(1+m.l+m.r)),world.vh/(world.h*(1+m.b+2*PARAMS.overscan))));
  }
  const room=()=>(g.PondGrow?g.PondGrow.current():null);
  const api={PARAMS,smooth,pulseScale,coverage,floorScale};
  if(typeof module!=='undefined' && module.exports) module.exports=api;
  if(!g.document) return;
  let frame=null, running=false;
                                                                                                    
  const zoom=()=>(g.PondZoom?g.PondZoom.level():1);
  function paint(scale) {
    if(!Number.isFinite(scale)) scale=1;
    const offset=coverage(pondWorld(),pondCam,scale*zoom(),room()),style=document.documentElement.style;
                                                                                            
    const px=v=>(Number.isFinite(v)?v:0)+'px';
    style.setProperty('--pond-pulse',scale);
    style.setProperty('--pond-pulse-x',px(offset.x));
    style.setProperty('--pond-pulse-y',px(offset.y));
  }
  function finish() { running=false;frame=null;paint(1);document.body.classList.remove('pond-expansion-zoom'); }
                                                                            
  function blockInput(e) {
    if(!running) return;
    e.preventDefault();e.stopImmediatePropagation();
  }
  ['pointerdown','pointermove','pointerup','click','dblclick','contextmenu','wheel','keydown','keyup'].forEach(type=>
    g.addEventListener(type,blockInput,{capture:true,passive:false}));
  function pulse() {
    if(frame!==null) cancelAnimationFrame(frame);
    if(g.matchMedia('(prefers-reduced-motion: reduce)').matches) {finish();return;}
    let start=null;
                                                                       
    ['pond-scene','frog-layer','pond-landmarks'].forEach(id=>{
      const el=document.getElementById(id);if(el) el.style.transition='';
    });
    if(g.PondZoom) g.PondZoom.stop();
    const minimum=Math.min(1,Math.max(PARAMS.scale,floorScale(pondWorld(),room())/zoom()));
    running=true;document.body.classList.add('pond-expansion-zoom');paint(1);
    function step(now) {
      if(start===null) start=now;
      const elapsed=now-start;
      if(elapsed>=PARAMS.outMs+PARAMS.holdMs+PARAMS.inMs) {finish();return;}
      const floor=Math.min(1,Math.max(minimum,floorScale(pondWorld(),room())/zoom()));
      paint(Math.max(floor,pulseScale(elapsed,minimum)));
      frame=requestAnimationFrame(step);
    }
    frame=requestAnimationFrame(step);
  }
  g.PondExpansionCamera=Object.assign(api,{pulse,active:()=>running});
})(typeof window!=='undefined'?window:globalThis);
