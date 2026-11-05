                                                                              
                                                                                  
(function(g){
                                                        
var EDGE_MARGIN=40;
                                                                             
                                                                          
function edgeAim(rect, viewport, margin){
  margin = margin==null ? EDGE_MARGIN : Math.max(0,margin);
  var l=viewport.left||0,t=viewport.top||0;
  var r=viewport.right==null?l+viewport.width:viewport.right;
  var b=viewport.bottom==null?t+viewport.height:viewport.bottom;
  var cx=(rect.left+rect.right)/2,cy=(rect.top+rect.bottom)/2;
  var mx=Math.min(margin,Math.max(0,(r-l)/2)),my=Math.min(margin,Math.max(0,(b-t)/2));
  var offLeft=cx<l,offRight=cx>r,offTop=cy<t,offBottom=cy>b;
  if(!offLeft && !offRight && !offTop && !offBottom) return null;
  return {x:Math.max(l+mx,Math.min(r-mx,cx)),y:Math.max(t+my,Math.min(b-my,cy)),
    dir:(offLeft?'left':offRight?'right':'')+(offTop?'up':offBottom?'down':'')};
}
function visibleBounds(target){
  if(typeof innerWidth==='undefined' || typeof innerHeight==='undefined')return null;
  var bounds={left:0,top:0,right:innerWidth,bottom:innerHeight};
  if(typeof document==='undefined' || !target.closest) return bounds;
                                                                                
  var pond=target.closest('#pond-view');
  if(pond){
    var r=pond.getBoundingClientRect();
    bounds.left=Math.max(bounds.left,r.left); bounds.top=Math.max(bounds.top,r.top);
    bounds.right=Math.min(bounds.right,r.right); bounds.bottom=Math.min(bounds.bottom,r.bottom);
    document.querySelectorAll('.hud-top,.task-plate,.bottom-dock').forEach(function(el){
      var box=el.getBoundingClientRect();
      if(!box.width || !box.height || getComputedStyle(el).visibility==='hidden')return;
      if(el.matches('.bottom-dock'))bounds.bottom=Math.min(bounds.bottom,box.top);
      else bounds.top=Math.max(bounds.top,box.bottom);
    });
  }
  return bounds;
}
                                                                             
                                                                         
function panTarget(rect, bounds, camera, layer, clamp, margin){
  margin=margin==null?EDGE_MARGIN:Math.max(0,margin);
  function axis(lo,hi,start,end,size,current){
    var mid=(lo+hi)/2, half=Math.min((hi-lo)/2,(end-start)/2+margin);
    var wanted=Math.max(lo+half,Math.min(hi-half,(start+end)/2));
    return current+((start+end)/2-wanted)/size;
  }
  if(!bounds || bounds.right<=bounds.left || bounds.bottom<=bounds.top || !layer.width || !layer.height)return null;
  return clamp({x:axis(bounds.left,bounds.right,rect.left,rect.right,layer.width,camera.x),
    y:axis(bounds.top,bounds.bottom,rect.top,rect.bottom,layer.height,camera.y)});
}
function revealTarget(){
  var target=g.GuidedHand.target;
  if(!target || !target.isConnected || !target.closest('#pond-view') || !g.PondPresentation)return;
  var layer=document.getElementById('frog-layer'),bounds=visibleBounds(target);
  if(!layer || typeof pondCam==='undefined')return;
                                                                            
  var world=pondWorld(),to=panTarget(target.getBoundingClientRect(),bounds,pondCam,layer.getBoundingClientRect(),function(cam){
    return PondGrow.clampCam(cam,{x:world.vw/world.w/2,y:world.vh/world.h/2},PondGrow.current());
  });
  if(to)g.PondPresentation.glideCamera(to.x,to.y);
}
function edgeButton(pointer){
  if(pointer.querySelector('.guide-edge-button'))return;
  var button=document.createElement('button');
  button.type='button';button.className='guide-edge-button';
  button.setAttribute('aria-label','Bring guided target into view');
  pointer.appendChild(button);
}
g.GuidedHand = {
  edgeAim: edgeAim,
  panTarget: panTarget,
  revealTarget: revealTarget,
  visibleBounds: visibleBounds,
  place: function(pointer, target, aim, localAim){
                                                                        
                                                                             
                                                                         
                                                                        
                                                                            
                                                                           
                                                                            
                                                                            
             
    if(target && target.classList && target.classList.contains('wander-frog') && g.PondRest && typeof wanderingSprites!=='undefined'){
      var frogId=Object.keys(wanderingSprites).find(function(k){return wanderingSprites[k].el===target;});
      if(frogId) g.PondRest.settle(frogId);
    }
    var r=target.getBoundingClientRect();
    var vw=typeof innerWidth!=='undefined'?innerWidth:null, vh=typeof innerHeight!=='undefined'?innerHeight:null;
                                                                             
                                                                               
                                                                         
                                                                            
                                                                          
                                                                     
    var bounds=(vw!=null && vh!=null) ? visibleBounds(target) : null;
    var aimRect=aim ? {left:aim.x,right:aim.x,top:aim.y,bottom:aim.y} : r;
    var edge = bounds ? this.edgeAim(aimRect,bounds) : null;
    this.rect=[r.left,r.top,r.width,r.height].join();
    this.bounds=JSON.stringify(bounds);
    this.aim=edge?null:(aim||null);                                                               
    var x=r.left+r.width/2,y=r.top+r.height/2;
    if(aim && !edge){ x=Math.max(r.left,Math.min(r.left+r.width,aim.x)); y=Math.max(r.top,Math.min(r.top+r.height,aim.y)); }
                                                                           
                                                                             
    this.localAim=(aim && !edge) ? (localAim || {x:(x-r.left)/r.width,y:(y-r.top)/r.height}) : null;
    if(edge){ x=edge.x; y=edge.y; }
    if(pointer.classList.toggle) pointer.classList.toggle('offscreen-hint', !!edge);
    else if(edge && pointer.classList.add) pointer.classList.add('offscreen-hint');
    else if(!edge && pointer.classList.remove) pointer.classList.remove('offscreen-hint');
    if(pointer.dataset){ if(edge) pointer.dataset.hintDir=edge.dir; else delete pointer.dataset.hintDir; }
    pointer.classList.add('on','tap');
    pointer.style.left=x+'px';
    pointer.style.top=y+'px';
                                                                        
                                                                            
                                                                           
    if(typeof document==='undefined' || typeof pointer.getBoundingClientRect!=='function')return;
    edgeButton(pointer);
    var pr=pointer.getBoundingClientRect();
    if(pr.width){
      pointer.style.left=(2*x-pr.left)+'px';
      pointer.style.top=(2*y-pr.top)+'px';
    }
                                                                        
                                                                          
                                                                                
    if(aim && !edge && typeof document.elementFromPoint==='function'){
      pr=pointer.getBoundingClientRect();
      var hit=document.elementFromPoint(Math.round(pr.left),Math.round(pr.top));
      if(hit!==target && !(hit && target.contains(hit))) pointer.classList.remove('on');
    }
    pointer.classList.remove('send-target','row-target','zone-target');
    if(this.target!==target){
      this.target=target;
      if(this.observer)this.observer.disconnect();
      this.observer=new ResizeObserver(this.refresh.bind(this));
      this.observer.observe(target);
      this.labels=null;
    }
                                                                          
                                                                           
                                                                            
                                                                         
    var root=target.closest('.xm-pill-wrap') || target;
    var stale=!this.labels || this.labelText!==root.textContent
      || this.labels.some(function(item){return !root.contains(item.node);})
      || (this.dockArt && !target.contains(this.dockArt.source));
    if(stale){
      pointer.querySelectorAll('.guide-label,.guide-dock-label').forEach(function(e){e.remove();});
      this.labels=[];
      this.dockArt=null;
                                                                              
                                                                              
                                                 
      var art=target.closest('.bottom-dock') && target.querySelector('img:not(.dock-icon)');
      if(art){
        var copy=art.cloneNode();copy.className='guide-dock-label';copy.alt='';
        pointer.appendChild(copy);this.dockArt={source:art,copy:copy};
      }
                                                                            
                                                                              
      this.labelText=root.textContent;
      var walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),node;
      while((node=walker.nextNode())){
        if(!node.textContent.trim())continue;
                                                                          
                                                                              
                                                                             
                                                                          
                                                                            
                                                                
        if(node.parentElement && node.parentElement.closest('.tap-badge,.pad-tap'))continue;
        var label=document.createElement('span'),style=getComputedStyle(node.parentElement);
        label.className='guide-label'; label.textContent=node.textContent;
        label.setAttribute('aria-hidden','true');
                                                                                
                                                                                     
        label.style.font=style.font; label.style.lineHeight='normal'; label.style.color=style.color;
        label.style.letterSpacing=style.letterSpacing;
        label.style.textTransform=style.textTransform;
        label.style.textShadow='0 1px 2px #17102b, 0 0 2px #17102b';
        pointer.appendChild(label);this.labels.push({node:node,label:label});
      }
    }
    if(this.dockArt){
      var ar=this.dockArt.source.getBoundingClientRect(),copy=this.dockArt.copy;
      copy.style.left=(ar.left-r.left-r.width/2)+'px';
      copy.style.top=(ar.top-r.top-r.height/2)+'px';
      copy.style.width=ar.width+'px';copy.style.height=ar.height+'px';
    }
    (this.labels||[]).forEach(function(item){
      var range=document.createRange();range.selectNodeContents(item.node);
      var box=range.getBoundingClientRect();
      item.label.style.left=(box.left-r.left-r.width/2)+'px';
      item.label.style.top=(box.top-r.top-r.height/2)+'px';
    });
  },
  refresh: function(){
    var p=document.querySelector('#tut-pointer.on.tap');
    if(p && this.target && this.target.isConnected){
      var r=this.target.getBoundingClientRect();
      if([r.left,r.top,r.width,r.height].join()!==this.rect || JSON.stringify(visibleBounds(this.target))!==this.bounds){
        var aim=null,local=this.localAim;
        if(local){
                                                                            
                                                                               
          var left=Math.floor(r.left)+1,right=Math.ceil(r.left+r.width)-1;
          var top=Math.floor(r.top)+1,bottom=Math.ceil(r.top+r.height)-1;
          if(left>right || top>bottom){p.classList.remove('on');return;}
          aim={x:Math.max(left,Math.min(right,Math.round(r.left+r.width*local.x))),
            y:Math.max(top,Math.min(bottom,Math.round(r.top+r.height*local.y)))};
        }
        this.place(p,this.target,aim,local);
      } else if(this.aim && typeof document.elementFromPoint==='function'){
        var pr=p.getBoundingClientRect(),hit=document.elementFromPoint(Math.round(pr.left),Math.round(pr.top));
        if(hit!==this.target && !(hit && this.target.contains(hit))) p.classList.remove('on');
      }
    }
  }
};
if(typeof module!=='undefined'&&module.exports)module.exports=g.GuidedHand;
if(typeof addEventListener==='undefined')return;
                                                                           
                                                                              
                                                                            
['pointerdown','pointermove','pointerup','pointercancel','click','dblclick','contextmenu','touchstart','touchmove','touchend','keydown','keyup'].forEach(function(type){
  g.addEventListener(type,function(e){
    var button=e.target.closest && e.target.closest('.guide-edge-button');
    if(!button)return;
    e.stopImmediatePropagation();
    if(type==='keydown' || type==='keyup')return;
                                                                                          
    if(type==='click' || type==='dblclick' || type==='contextmenu')e.preventDefault();
    if(type==='pointerdown'){button.focus({preventScroll:true});button.setPointerCapture(e.pointerId);}
    if(type==='click' && button.closest('#tut-pointer.on.offscreen-hint'))revealTarget();
  },{capture:true,passive:false});
});
(function(){
  var pending=false;
  function schedule(){
    if(pending)return;
    pending=true;
    requestAnimationFrame(function(){pending=false;GuidedHand.refresh();});
  }
  addEventListener('resize',schedule);
  addEventListener('scroll',schedule,true);
  new ResizeObserver(schedule).observe(document.body);
                                                                              
                                                                
  new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true});
                                                                               
                                                                             
  function frame(){GuidedHand.refresh();requestAnimationFrame(frame);}
  requestAnimationFrame(frame);
})();

})(typeof window!=='undefined'?window:globalThis);
