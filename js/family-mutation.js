                                                                        
                                                                               
                                                                                 
                                    
                                                                             
                                                                              
                                                                            
                                                                            
                                                                 
                                                                          
                                                                   
(function(g){
  'use strict';
                                                                              
                                                                               
                                                                                  
  var PARAMS={cycles:3, leadMs:250, preloadMs:600, pondSettleMs:700};
                                                                      
  function stepMs(fps){ return Math.max(45,Math.round(1000/(fps||12))); }
                                                                     
  function buildMs(frameCount,cycles,fps){ return frameCount*cycles*stepMs(fps); }
  var api={PARAMS:PARAMS,stepMs:stepMs,buildMs:buildMs};
  if(typeof module!=='undefined' && module.exports) module.exports=api;
  if(!g.document) return;
  g.FamilyMutation=api;

                                                                          
                                                                              
                                             
  api.capture=function(frog){
    if(!frog || !g.FT || !FT.mutateFrames) return null;
    var frames=FT.mutateFrames(frog);
    if(!frames || frames.length<2) return null;
    return {frog:JSON.parse(JSON.stringify(frog)), frames:frames};
  };
                                                                             
                                                                          
  function stackFrames(stage,frames){
    var base=stage.querySelector('img[data-dz-base]');
    if(base){ base._dzNext=Date.now()+1e9; return base; }                                                 
    base=stage.querySelector('.frog-stack img.fs-body'); if(!base) return null;
    base.setAttribute('data-dz-base','1');
    base._dzNext=Date.now()+1e9;                                                                       
    var after=base.nextSibling;
    frames.forEach(function(src,i){
      var im=document.createElement('img');
      im.className='fs-body fs-dz'; im.setAttribute('data-dz',i); im.src=src; im.alt='';
      im.draggable=false; im.decoding='async'; im.style.visibility='hidden';
      im.onerror=function(){ if(typeof frogImgError==='function') frogImgError(im); };
      base.parentNode.insertBefore(im,after);
    });
    return base;
  }
  function decoded(imgs){
    var all=Promise.all(imgs.map(function(im){ return im.decode ? im.decode().catch(function(){}) : null; }));
    return Promise.race([all,new Promise(function(r){ setTimeout(r,PARAMS.preloadMs); })]);
  }
                                                                                         
  function fromHTML(html){ var d=document.createElement('div'); d.innerHTML=html; return d.firstElementChild; }
  function sound(pitch,intensity){ try{ ac(); croak(pitch,intensity); }catch(e){} }

                                                                       
                                                                            
  api.play=function(wrap,frames,afterHTML,done){
    var stage=wrap.querySelector('.fs-stage'), stack=stage && stage.querySelector('.frog-stack');
    var next=fromHTML(afterHTML);
    var base=stack && stackFrames(stage,frames);
    var finished=false;
    function swap(){
      if(finished) return; finished=true;
      stage.classList.remove('fm-build');
      var flash=document.createElement('span'); flash.className='fm-flash';
      flash.addEventListener('animationend',function(){ flash.remove(); });
      stage.appendChild(flash);
      var cur=stage.querySelector('.frog-stack');
      if(next){ next.classList.add('fm-pop'); if(cur) cur.replaceWith(next); else stage.appendChild(next); }
      wrap.classList.remove('fs-mutating'); wrap.classList.add('fm-revealed');
      sound(760,1.5);
      if(done) done();
    }
    if(!base || !next){ swap(); return; }
                                                                                 
    var waits=Array.prototype.slice.call(stack.querySelectorAll('img.fs-dz')).concat(Array.prototype.slice.call(next.querySelectorAll('img')));
    var fps=typeof DISTORT_FPS!=='undefined' ? DISTORT_FPS : 12;
    stage.style.setProperty('--fm-build',buildMs(frames.length,PARAMS.cycles,fps)+'ms');
    Promise.all([decoded(waits),new Promise(function(r){ setTimeout(r,PARAMS.leadMs); })]).then(function(){
      if(finished) return;
      stage.classList.add('fm-build'); sound(300,1.1);
      if(typeof ftuePlayWobbleSprite==='function') ftuePlayWobbleSprite(stage,PARAMS.cycles,swap);
      else setTimeout(swap,buildMs(frames.length,PARAMS.cycles,fps));
    });
  };

                                                                               
                                                                                
                                                                               
                                                                               
                                                     
  api.playInPond=function(el,frames,swap,done){
    var base=stackFrames(el,frames), finished=false;
    var halo=document.createElement('span'); halo.className='fm-halo';
    el.insertBefore(halo,el.firstChild);
    function land(){
      if(finished) return; finished=true;
      el.classList.remove('fm-build');
      swap();
                                                                                        
      if(!halo.isConnected) el.insertBefore(halo,el.firstChild);
      var flash=document.createElement('span'); flash.className='fm-flash';
      flash.addEventListener('animationend',function(){ flash.remove(); });
      el.appendChild(flash);
      halo.classList.add('fm-halo-out');
      halo.addEventListener('animationend',function(e){ if(e.animationName==='fmHaloOut') halo.remove(); });
      sound(760,1.5);
      setTimeout(done,PARAMS.pondSettleMs);
    }
    if(!base){ land(); return; }
    var fps=typeof DISTORT_FPS!=='undefined' ? DISTORT_FPS : 12;
    el.style.setProperty('--fm-build',buildMs(frames.length,PARAMS.cycles,fps)+'ms');
    var waits=Array.prototype.slice.call(el.querySelectorAll('img.fs-dz'));
    Promise.all([decoded(waits),new Promise(function(r){ setTimeout(r,PARAMS.leadMs); })]).then(function(){
      if(finished) return;
      el.classList.add('fm-build'); sound(300,1.1);
      if(typeof ftuePlayWobbleSprite==='function') ftuePlayWobbleSprite(el,PARAMS.cycles,land);
      else setTimeout(land,buildMs(frames.length,PARAMS.cycles,fps));
    });
  };
})(typeof window!=='undefined'?window:globalThis);
