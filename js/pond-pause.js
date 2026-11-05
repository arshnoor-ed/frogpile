                                                                            
                                                                            
                                                                                  
(function(g){
  'use strict';
  var stopped=false,at=0,elapsed=0,next=0,timers=new Map(),animations=new Set();
  var overlays='#labor-window,#ftue-tooltip,#family-spotlight,#claim-modal,#pond-flag-prompt,#body-hint,#trait-roll,#market-window,.modal-overlay,.evo-overlay,.showcase-overlay,.big-unlock,.cl-overlay,.eq-reveal-overlay,.kit-popup,[role="dialog"]';
  function covered(){
    if(typeof activeSheet!=='undefined' && activeSheet)return true;
    if(typeof activeTab!=='undefined' && activeTab!=='pond')return true;
    return Array.from(document.querySelectorAll(overlays)).some(el=>el.checkVisibility({checkVisibilityCSS:true}));
  }
  function now(){return (stopped?at:performance.now())-elapsed;}
  function arm(id,t){
    t.native=g.setTimeout(function(){
      sync();
      if(!timers.has(id) || stopped)return;
      timers.delete(id);t.fn();
    },Math.max(0,t.due-now()));
  }
  function later(fn,ms){
    sync();var id=--next,t={fn:fn,due:now()+Math.max(0,ms||0)};
    timers.set(id,t);if(!stopped)arm(id,t);return id;
  }
  function cancel(id){
    var t=timers.get(id);if(t){g.clearTimeout(t.native);timers.delete(id);}
    else g.clearTimeout(id);
  }
  function sync(){
    var want=covered();
    if(want!==stopped){
      if(want){at=performance.now();stopped=true;timers.forEach(t=>g.clearTimeout(t.native));}
      else {
        elapsed+=performance.now()-at;stopped=false;
        animations.forEach(a=>{if(a.playState==='paused')a.play();});animations.clear();
        timers.forEach((t,id)=>arm(id,t));
      }
    }
    if(stopped){
      var layer=document.getElementById('frog-layer');
      if(layer)layer.getAnimations({subtree:true}).forEach(a=>{
                                                                              
                                                                         
                                                                      
        if(a.animationName==='mergePop')return;
        if(a.playState==='running'){
          var current=a.currentTime;animations.add(a);a.pause();
          if(current!==null)a.currentTime=current;                                                                 
        }
      });
    }
    return stopped;
  }
  g.PondPause={active:sync,sync:sync,now:now,later:later,cancel:cancel};
                                                                            
                                                                              
  new MutationObserver(sync).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['class','hidden','open']});
})(window);
