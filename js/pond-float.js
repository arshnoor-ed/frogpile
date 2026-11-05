                                                                             
                                                                           
                                                                          
                                                              
(function(g){
  'use strict';
  const TAU=Math.PI*2;
  function motion(at,params){
    const angle=TAU*(at/params.period+params.phase);
    return {x:params.radius*Math.cos(angle),y:params.radius*.75*Math.sin(angle),
      rotate:params.rotation*Math.cos(angle)};
  }
  const api={motion};
  if(typeof module!=='undefined'&&module.exports) module.exports=api;
  g.PondFloat=api;
  if(!g.document)return;
  const selector='.lilypad,.pond-log,.g-rock,.g-skull,.g-fpad,.pond-lantern,.frog-market',objects=new Map();
  const reduced=g.matchMedia('(prefers-reduced-motion: reduce)');
  function sync(){
    document.querySelectorAll(selector).forEach(el=>{
      if(objects.has(el))return;
      const pad=el.matches('.lilypad'),style=el.style;
                                                                           
                                                                         
      const params={radius:pad?parseFloat(style.getPropertyValue('--float-size'))||10:el.matches('.g-skull')?4:1.2,
        period:pad?(parseFloat(style.getPropertyValue('--float-speed'))||6)*1000:6000+Math.random()*3000,
        phase:pad?(parseFloat(style.getPropertyValue('--float-delay'))||0)/(parseFloat(style.getPropertyValue('--float-speed'))||6):Math.random(),
        rotation:pad?parseFloat(style.getPropertyValue('--float-rotate'))||2:.5};
      objects.set(el,params);el.dataset.floatPeriod=params.period;
    });
    objects.forEach((params,el)=>{if(!el.isConnected)objects.delete(el);});
  }
  api.sync=sync;
  function frame(at){
    objects.forEach((params,el)=>{
      const p=reduced.matches?{x:0,y:0,rotate:0}:motion(at,params);
      el.style.translate=p.x.toFixed(4)+'px '+p.y.toFixed(4)+'px';
      el.style.rotate=p.rotate.toFixed(4)+'deg';
    });
    requestAnimationFrame(frame);
  }
  function start(){
    sync();
                                                                              
                                                                
    new MutationObserver(sync).observe(document.getElementById('frog-layer'),{childList:true,subtree:true});
    requestAnimationFrame(frame);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})(typeof window!=='undefined'?window:globalThis);
