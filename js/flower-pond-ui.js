                                                                            
                                                                           
                                                                              
                                                                      
(function (g) {
  'use strict';
  const seated = new Set();
                                                                        
                                                                   
  function footprints() {
    return Array.from(document.querySelectorAll('.fb-station'))
      .filter(el => el.checkVisibility({checkVisibilityCSS:true,checkOpacity:true}))
      .map(el => el.getBoundingClientRect()).filter(r => r.width && r.height);
  }
                                                                            
                                                                            
                                       
  function hopOff(id, spr, lr) {
    const fromX=parseFloat(spr.el.style.left), fromY=parseFloat(spr.el.style.top);
    const r=spr.el.getBoundingClientRect(), safe=g.tutSafeArea();
    const obstacles=Array.from(document.querySelectorAll('.wander-frog,.lilypad,.pond-log,.g-rock,#whirlpool'))
      .filter(el=>el!==spr.el && el.checkVisibility({checkVisibilityCSS:true,checkOpacity:true}))
      .map(el=>el.getBoundingClientRect());
    for (const distance of [70,100,130,160]) for(let i=0;i<16;i++) {
      const angle=i*Math.PI/8, dx=Math.cos(angle)*distance, dy=Math.sin(angle)*distance;
      const target={left:r.left+dx,top:r.top+dy,right:r.right+dx,bottom:r.bottom+dy};
      if(target.left<safe.l || target.right>safe.r || target.top<safe.t || target.bottom>safe.b) continue;
      if(obstacles.some(o=>g.PondSpawn.overlaps(target,o,4))) continue;
      const toX=fromX+dx/lr.width*100, toY=fromY+dy/lr.height*100;
      if(typeof g.frogFacing==='function') spr.el.style.transform=g.frogFacing(id,fromX,toX);                                      
      g.hopStep(id,fromX,fromY,toX,toY,1,0);
      return;
    }
    g.scheduleWander(id);
  }
  function sync() {
    if (typeof state === 'undefined' || !g.Flowers || (g.PondPause && PondPause.active())) return;
    const layer = document.getElementById('frog-layer');
    if (!layer || !layer.clientWidth) return;
    const lr = layer.getBoundingClientRect();
    if (!lr.width || !lr.height) return;
    const zoom = lr.width / layer.clientWidth;
    const counts = (state.flowerPlots || []).filter(p => p && p.station).map(p => p.station.slots.length);
    const widest = g.Flowers.flowerRingGeometry(64, Math.max(6, ...counts)).width;
    const scale = Math.min(widest, innerWidth - 24) / (widest * zoom);
    const size = 48 * (typeof POND_FROG_SCALE !== 'undefined' ? POND_FROG_SCALE : 1) * scale;
    const current = new Set();
    const dragging = typeof dragState !== 'undefined' && dragState && dragState.moved;
    document.body.classList.toggle('frog-dragging', !!dragging);
    const hover = dragging && dragState.clientX != null ? g.findFlowerDropTarget(dragState.clientX, dragState.clientY) : null;
    for (const i in lilypadSprites) {
      const pad = lilypadSprites[i], plot = state.flowerPlots && state.flowerPlots[i];
      if (!plot || (plot.stage !== 'bud' && plot.stage !== 'bloom')) {
        continue;
      }
      pad.el.style.setProperty('--fb-scale', scale);
      pad.el.classList.toggle('fb-drop-hover', !!hover && hover.padIndex === Number(i));
      if (!plot.station || plot.stage !== 'bloom') continue;
                                                                                 
      const padWidth = parseFloat(getComputedStyle(pad.el).width);
      const ring = g.Flowers.flowerRingGeometry(padWidth, plot.station.slots.length);
      pad.el.style.setProperty('--fb-pad-width', padWidth + 'px');
      pad.el.style.setProperty('--fb-ring-width', ring.width + 'px');
      pad.el.style.setProperty('--fb-ring-height', ring.height + 'px');
      pad.el.style.setProperty('--fb-seat-width', ring.seatWidth + 'px');
      pad.el.style.setProperty('--fb-seat-height', ring.seatHeight + 'px');
      const station = pad.el.querySelector('.fb-station');
      if (!station) continue;
      for (const slot of station.querySelectorAll('.fb-slot')) {
        const slotIndex = Number(slot.dataset.slot);
        const seat = plot.station.slots[slotIndex];
        if (!seat) continue;
        const spr = wanderingSprites[seat.frogId], frog = state.frogs.find(f => f.id === seat.frogId);
        if (!spr || !frog) continue;
        current.add(seat.frogId);
        if (dragState && dragState.frogId === seat.frogId) continue;
        PondPause.cancel(spr.timer);
        if (!seated.has(seat.frogId) || spr.flowerSize !== size || !spr.el.querySelector('.frog-stack') || Math.abs(parseFloat(spr.el.querySelector('.frog-stack').style.width) - size) > 0.1) {
          spr.el.innerHTML = g.frogSpriteInner(frog, size);
          spr.flowerSize = size;
        }
        spr.el.classList.add('flower-seated');
        spr.el.style.setProperty('--fb-frog-size', size + 'px');
        const r = slot.getBoundingClientRect();
        spr.el.style.transition = 'none';
        spr.el.style.transform = '';
        spr.el.style.left = ((r.left + r.width / 2 - lr.left) / lr.width * 100 - size / layer.clientWidth * 50) + '%';
        spr.el.style.top = ((r.top + r.height / 2 - lr.top) / lr.height * 100 - size / layer.clientHeight * 50) + '%';
      }
    }
    for (const id of seated) {
      if (current.has(id)) continue;
      const spr = wanderingSprites[id], frog = state.frogs.find(f => f.id === id);
      if (!spr || !frog) continue;
      PondPause.cancel(spr.timer);
                                                                  
      if (spr.flowerLeaveAt && Date.now() < spr.flowerLeaveAt && !(dragState && dragState.frogId === id)) { current.add(id); continue; }
      delete spr.flowerLeaveAt;
      spr.el.classList.remove('flower-seated');
      spr.el.innerHTML = g.frogSpriteInner(frog);
      delete spr.flowerSize;
      if (!dragState || dragState.frogId !== id) {
        if(spr.flowerEjected) hopOff(id,spr,lr);
        else g.scheduleWander(id);
      }
      delete spr.flowerEjected;
    }
    seated.clear(); current.forEach(id => seated.add(id));
  }
  g.FlowerPondUI = { sync, footprints };
  function frame() { sync(); requestAnimationFrame(frame); }
  requestAnimationFrame(frame);
})(window);
