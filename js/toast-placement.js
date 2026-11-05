                                                                            
                                                                                      
(function(g){
  'use strict';
  function bounds(height, dockTop, headerBottom){
    var bottom = Math.max(24, height - dockTop + 12);
    return { bottom: bottom, maxHeight: Math.max(0, height - bottom - headerBottom - 12) };
  }
  function visibleRect(el){
    if(!el) return null;
    var r = el.getBoundingClientRect(), style = getComputedStyle(el);
    return r.width && r.height && style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0' ? r : null;
  }
  function overlaps(a, b){
    return !!(a && b && a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top);
  }
  var pending = [], frame = null;
  function update(){
    if(!g.document) return;
    var toast = document.getElementById('toast');
    if(!toast) return;
                                                                               
                                                                       
    var body = document.body.getBoundingClientRect();
    var dock = visibleRect(document.querySelector('.bottom-dock'));
    var top = 0;
    document.querySelectorAll('.hud-top, .tutorial-tip, .mission-banner').forEach(function(el){
      var r = visibleRect(el); if(r) top = Math.max(top, r.bottom);
    });
    var b = bounds(body.height, dock ? dock.top-body.top : body.height, top-body.top);
    toast.style.bottom = b.bottom+'px';
    toast.style.maxHeight = b.maxHeight+'px';
                                                                    
    var target = g.FtueSteps && FtueSteps.pointerTarget();
    if(!target && typeof g.tutorialTarget === 'function') target = g.tutorialTarget();
    var protectedRects = [visibleRect(target), visibleRect(document.getElementById('tut-pointer'))];
    var used = 0, blocked = false, shown = 0;
    pending.forEach(function(item){
      item.el.hidden = false;
      var height = item.el.getBoundingClientRect().height;
      var bottom = body.bottom-b.bottom-used;
      var r = {left:body.left+(body.width-item.el.offsetWidth)/2, right:body.left+(body.width+item.el.offsetWidth)/2,
        top:bottom-height, bottom:bottom};
      var safe = !blocked && used+height <= b.maxHeight && !protectedRects.some(function(p){ return overlaps(r,p); });
      item.el.hidden = !safe;
      if(!safe){
        if(item.timer){ clearTimeout(item.timer); item.timer=null; item.remaining-=Date.now()-item.started; }
        blocked = true; return;
      }
      shown++; used += height+6;
      if(!item.timer){
        item.started = Date.now();
        item.timer = setTimeout(function(){
          item.el.remove(); pending = pending.filter(function(p){ return p!==item; }); update();
        },item.remaining);
      }
    });
    toast.classList.toggle('show', shown>0);
  }
  function followLayout(){
    frame = null; update();
    if(pending.length) frame = requestAnimationFrame(followLayout);
  }
  function show(msg){
    var toast = document.getElementById('toast');
                                                                           
                                                                                
                                                                                 
    var el = pending.length ? pending[0].el : document.createElement('div');
    pending.forEach(function(item){
      if(item.timer) clearTimeout(item.timer);
      if(item.el!==el) item.el.remove();
    });
    el.className = 'toast-message'; el.textContent = msg;
    if(!el.isConnected) toast.appendChild(el);
    pending = [{el:el, timer:null, remaining:2200}]; update();
    if(frame===null) frame = requestAnimationFrame(followLayout);
  }
  var api = { bounds: bounds, overlaps: overlaps, update: update, show: show };
  if(typeof module !== 'undefined' && module.exports) module.exports = api;
  g.ToastPlacement = api;
  if(g.document){
    g.addEventListener('resize', update);
                                                                              
                                                                                      
  }
})(typeof window !== 'undefined' ? window : globalThis);
