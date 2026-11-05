                                                                                  
                                                                               
(function(g){
  'use strict';
  var layer=null, locked=[], frame=null, SPOT_MIN=96;
  var controls='button,[onclick],[role="button"],summary,a[href]';
  function active(){
    return typeof state!=='undefined' && g.FtueSteps && FtueSteps.ftueUiActive() &&
      state.ftueLoop===2 && state.ftueL2Step==='attempt2' && !state.ftueExp2AId &&
      !(g.FtueTooltips && FtueTooltips.paused()) &&
      typeof activeSheet!=='undefined' && activeSheet==='expeditions' &&
      expeditionView!=='detail' &&
      !document.querySelector('#claim-modal,.cl-overlay,#family-spotlight,#ftue-tooltip');
  }
  function target(){
    return document.querySelector(expeditionCardNo===2 ? '.xm-card-play' : '[data-expedition-no="2"]');
  }
  function clear(){
    if(frame!==null){cancelAnimationFrame(frame);frame=null;}
    if(layer){layer.remove();layer=null;}
    locked.forEach(function(entry){
      if(entry.aria===null)entry.el.removeAttribute('aria-disabled');
      else entry.el.setAttribute('aria-disabled',entry.aria);
      entry.el.classList.remove('e2-focus-locked');
    });
    locked=[];
    document.body.classList.remove('e2-focus-active');
  }
  function rect(el){return el.getBoundingClientRect();}
  function position(){
    frame=null;
    if(!active()){clear();return;}
    var t=target();if(!t || !layer)return;
    var r=rect(t),w=innerWidth,h=innerHeight;
                                                                            
                                                                                
                                                                            
    var ring=layer.querySelector('.e2-focus-ring');
    var pill=r.width>r.height*1.6, d=pill ? r.height+16 : Math.max(SPOT_MIN,Math.max(r.width,r.height)*1.2), dw=pill ? r.width+16 : d;
    ring.style.left=(r.left+r.width/2-dw/2)+'px';ring.style.top=(r.top+r.height/2-d/2)+'px';
    ring.style.width=dw+'px';ring.style.height=d+'px';ring.style.borderRadius=pill ? d/2+'px' : '';
    locked.forEach(function(entry){
      var b=rect(entry.el);
      entry.badge.style.left=(Math.min(w-24,Math.max(0,b.right-21)))+'px';
      entry.badge.style.top=(Math.max(0,b.top-3))+'px';
      entry.badge.hidden=!entry.el.isConnected || b.width===0 || b.height===0 || b.bottom<0 || b.top>h;
    });
    frame=requestAnimationFrame(position);
  }
  function sync(){
    clear();if(!active())return;
                                                                            
                                                                   
    if(expeditionView!=='ladder' || expeditionZoneSel!==EMap.zoneOfNode(2)){
      expeditionView='ladder';expeditionZoneSel=EMap.zoneOfNode(2);expeditionCardNo=null;
      render();return;
    }
    var t=target();if(!t)return;
                                                                             
    var r=rect(t),dock=document.querySelector('.bottom-dock'),head=document.querySelector('.xm-fs-head');
    if(r.top-6<(head ? rect(head).bottom : 0) || r.bottom+6>(dock ? rect(dock).top : innerHeight))
      t.scrollIntoView({block:'center',inline:'nearest'});
    document.body.classList.add('e2-focus-active');
    layer=document.createElement('div');layer.id='e2-focus-mask';layer.setAttribute('aria-hidden','true');
    layer.innerHTML='<div class="e2-focus-ring"></div>';
    var navigation=['.xm-fullscreen','.bottom-dock','.hud-top'].map(function(root){
      return root+' '+controls.split(',').join(','+root+' ');
    }).join(',');
    document.querySelectorAll(navigation).forEach(function(el){
      if(el===t || t.contains(el))return;
      var badge=document.createElement('span');badge.className='e2-focus-lock';badge.textContent='🔒';
      layer.insertBefore(badge,layer.firstChild);                            
      locked.push({el:el,aria:el.getAttribute('aria-disabled'),badge:badge});
      el.setAttribute('aria-disabled','true');el.classList.add('e2-focus-locked');
    });
    document.body.appendChild(layer);position();
  }
  function guard(e){
    if(!active())return;
    var t=target(),el=e.target instanceof Element ? e.target : null;
    if(t && el && t.contains(el)){
      if(e.type==='click' && t.matches('[data-expedition-no="2"]')){
        e.preventDefault();e.stopImmediatePropagation();expeditionPlayNode(2);
      }
      return;
    }
    if(e.type==='keydown' && e.key!=='Enter' && e.key!==' ')return;
    e.preventDefault();e.stopImmediatePropagation();
    if(e.type==='click' || e.type==='keydown'){
      var control=el && el.closest(controls),entry=locked.find(function(x){return x.el===control;});
      if(entry)entry.badge.animate([{transform:'rotate(0)'},{transform:'rotate(-18deg)'},{transform:'rotate(18deg)'},{transform:'rotate(0)'}],{duration:260});
    }
  }
  ['pointerdown','pointerup','click','keydown'].forEach(function(type){g.addEventListener(type,guard,true);});
  g.ExpeditionFocus={sync:sync,active:active};
})(window);
