                                                                       
                                                                          
(function(g){
  'use strict';
                                                                              
                                                                              
                                                                            
  function nearest(point,bounds,zones){
    if(bounds.left>bounds.right || bounds.top>bounds.bottom)return null;
    var clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
    if(!zones.some(r=>point.x>r.left && point.x<r.right && point.y>r.top && point.y<r.bottom) && point.x>=bounds.left && point.x<=bounds.right && point.y>=bounds.top && point.y<=bounds.bottom)return {x:point.x,y:point.y};
    var xs=[clamp(point.x,bounds.left,bounds.right),bounds.left,bounds.right];
    var ys=[clamp(point.y,bounds.top,bounds.bottom),bounds.top,bounds.bottom];
    zones.forEach(r=>{xs.push(clamp(r.left,bounds.left,bounds.right),clamp(r.right,bounds.left,bounds.right));ys.push(clamp(r.top,bounds.top,bounds.bottom),clamp(r.bottom,bounds.top,bounds.bottom));});
    var best=null,score=Infinity;
    xs.forEach(x=>ys.forEach(y=>{
      var d=(x-point.x)**2+(y-point.y)**2;
      if(d>=score)return;
      if(zones.some(r=>x>r.left && x<r.right && y>r.top && y<r.bottom))return;
      if(d<score){best={x,y};score=d;}
    }));
    return best;
  }
  var api={nearest};
  if(typeof module!=='undefined')module.exports=api;
  if(!g.document)return;
  g.PondRest=api;
  function owned(id){return flowerStationOfFrog(id) || (g.HarvestPondUI && HarvestPondUI.owns(id));}
                                                                          
                                                                            
  var shapes=new WeakMap();
  function standing(s,layer,lr){
    var el=s.el,img=el.querySelector('.fs-body'),cs=getComputedStyle(el);
    var key=[img && img.src,img && img.naturalWidth,el.offsetWidth,el.offsetHeight,cs.transform].join('|'),cached=shapes.get(el);
    if(!cached || cached.key!==key){
      var probe=el.cloneNode(true);
      probe.removeAttribute('id');probe.querySelectorAll('[id]').forEach(n=>n.removeAttribute('id'));
      Object.assign(probe.style,{visibility:'hidden',pointerEvents:'none',left:'0px',top:'0px',translate:'none',transition:'none'});
      probe.querySelectorAll('.frog-hop,.frog-art,.frog-stack,.fs-body').forEach(n=>{
        n.style.setProperty('animation','none','important');
        ['transform','translate','rotate','scale'].forEach(p=>n.style.setProperty(p,'none','important'));
        n.classList.remove('fs-flopped');
      });
      layer.appendChild(probe);
      var outer=probe.getBoundingClientRect(),body=PondMotion.bodyRect(probe),scale=lr.width/layer.clientWidth;
      cached={key,x:(body.left-outer.left)/scale,y:(body.top-outer.top)/scale,width:body.width/scale,height:body.height/scale};
      probe.remove();shapes.set(el,cached);
    }
    var scale=lr.width/layer.clientWidth;
    return {x:cached.x*scale,y:cached.y*scale,width:cached.width*scale,height:cached.height*scale};
  }
  function scene(id){
    var s=wanderingSprites[id],layer=document.getElementById('frog-layer');
    if(!s || !layer || owned(id))return null;
    var lr=layer.getBoundingClientRect(),r=standing(s,layer,lr),style=getComputedStyle(s.el);
    if(!lr.width || !r.width)return null;
    var parent=getComputedStyle(s.el.offsetParent);
    var anchor={x:parseFloat(style.left)/parseFloat(parent.width)*100,y:parseFloat(style.top)/parseFloat(parent.height)*100};
    var offset={x:r.x,y:r.y};
    var stage=document.querySelector('.pond-stage').getBoundingClientRect();
    var X=PondGrow.widen(6,92,0,0,PondGrow.current());
    var bounds={left:Math.max(stage.left,lr.left+X.x0/100*lr.width+offset.x),right:Math.min(stage.right-r.width,lr.left+X.x1/100*lr.width+offset.x),top:Math.max(stage.top,lr.top+GATE_BAND.y0/100*lr.height+offset.y),bottom:Math.min(stage.bottom-r.height,lr.top+MERGE_AREA.y1/100*lr.height+offset.y)};
                                                                         
                                                                             
                                                                          
    var frame=s.el.offsetHeight*lr.height/layer.clientHeight;
    document.querySelectorAll('.hud-top,.bottom-dock').forEach(el=>{
      if(!el.checkVisibility({checkVisibilityCSS:true,checkOpacity:true}))return;
      var b=el.getBoundingClientRect();if(!b.width || !b.height)return;
      if(el.matches('.hud-top'))bounds.top=Math.max(bounds.top,b.bottom+frame);
      else bounds.bottom=Math.min(bounds.bottom,b.top-r.height-frame);
    });
    bounds.left=Math.max(bounds.left,frame);bounds.right=Math.min(bounds.right,innerWidth-r.width-frame);
    bounds.top=Math.max(bounds.top,0);bounds.bottom=Math.min(bounds.bottom,innerHeight-r.height);
    var zones=[];
                                                                              
                                                                           
    document.querySelectorAll('.lilypad,.fb-station,.hud-top,.bottom-dock,.bottom-dock .dock-btn,.bottom-dock .dock-icon,.tutorial-tip,.mission-banner,.pond-mark,#whirlpool,.game-sheet,.fp-dsheet,.modal,.frog-inspect,.kit-popup,.st-popup,.bh-card,#ftue-tooltip,[role="dialog"]').forEach(el=>{
      if(el.contains(s.el) || !el.checkVisibility({checkVisibilityCSS:true,checkOpacity:true}))return;
      var b=el.getBoundingClientRect();
      var pad=el.closest('.lilypad');
      if(pad){
        var st=getComputedStyle(pad),v=st.translate.split(' ').map(parseFloat),radius=(parseFloat(st.getPropertyValue('--float-size'))||10)*lr.width/layer.clientWidth;
                                                                            
        var angle=parseFloat(st.getPropertyValue('--float-rotate'))||2;
        var turn=2*Math.sin(Math.abs(angle)*Math.PI/180)*Math.hypot(b.width,b.height);
        b={left:b.left-(v[0]||0)-radius-turn/2,top:b.top-(v[1]||0)-radius-turn/2,right:b.right-(v[0]||0)+radius+turn/2,bottom:b.bottom-(v[1]||0)+radius+turn/2,width:b.width,height:b.height};
      }
      if(b.width && b.height)zones.push(b);
    });
    Object.keys(wanderingSprites).forEach(other=>{
      if(other===id || PondMotion.isCarried(other))return;
      var t=wanderingSprites[other],b=PondMotion.bodyRect(t.el);
      zones.push({left:b.left,top:b.top,right:b.left+b.width,bottom:b.top+b.height});
                                                                          
      if(t.moving){
        var st=getComputedStyle(t.el),slide=st.translate.split(' ').map(parseFloat),scale=lr.width/layer.clientWidth,dx=(parseFloat(t.el.style.left)-parseFloat(st.left)/parseFloat(parent.width)*100)/100*lr.width-(slide[0]||0)*scale,dy=(parseFloat(t.el.style.top)-parseFloat(st.top)/parseFloat(parent.height)*100)/100*lr.height-(slide[1]||0)*scale;
        zones.push({left:b.left+dx,top:b.top+dy,right:b.left+b.width+dx,bottom:b.top+b.height+dy});
      }
    });
                                                                              
                                                                            
    zones=zones.filter(b=>PondSpawn.overlaps({left:stage.left,top:stage.top,right:stage.right,bottom:stage.bottom},b)).map(b=>({left:b.left-r.width-r.width*.04-1,right:b.right+r.width*.04+1,top:b.top-r.height-r.height*.04-1,bottom:b.bottom+r.height*.04+1}));
    return {lr,offset,bounds,zones,anchor};
  }
  api.target=function(id,x,y){
    var c=scene(id);if(!c)return {x,y};
    var p=nearest({x:c.lr.left+x/100*c.lr.width+c.offset.x,y:c.lr.top+y/100*c.lr.height+c.offset.y},c.bounds,c.zones);
    return p && {x:(p.x-c.lr.left-c.offset.x)/c.lr.width*100,y:(p.y-c.lr.top-c.offset.y)/c.lr.height*100};
  };
  api.settle=function(id){
    var s=wanderingSprites[id];if(!s || owned(id) || PondPause.active() || ftueCinematicActive())return;
    var p=api.target(id,parseFloat(s.el.style.left),parseFloat(s.el.style.top));
    if(!p || Math.hypot(p.x-parseFloat(s.el.style.left),p.y-parseFloat(s.el.style.top))<.001)return;
    if(g.FrogGait)FrogGait.reset(s.el.querySelector('.frog-hop'),true);
    p=api.target(id,p.x,p.y);if(!p)return;
    s.el.style.transition='none';s.el.style.left=p.x+'%';s.el.style.top=p.y+'%';
  };
  setInterval(function(){
    if(typeof state==='undefined' || !state || activeTab!=='pond' || PondPause.active() || document.hidden || ftueCinematicActive() || (g.PondExpansionCamera && PondExpansionCamera.active()))return;
    Object.keys(wanderingSprites).forEach(id=>{
      var s=wanderingSprites[id];
      if(s.moving || s.presenting || s.flying || s.tonguing || s.ftueSpot || PondMotion.isCarried(id) || PondMotion.heldForDrag(id) || s.el.querySelector('.frog-hop.fg-moving'))return;
      api.settle(id);
    });
  },PondMotion.PARAMS.spacingIntervalMs);
})(typeof window!=='undefined'?window:globalThis);
