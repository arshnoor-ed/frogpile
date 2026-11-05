                                                                   
                                                                             
                                                                              
                                                                              
                                                                                
                                                                           
                                                                           
                                                                          
                                                                      
                 
(function(g){
  'use strict';
                                                                                 
  var PARAMS={sparks:10, sparkFar:54, sparkNear:38};
  function esc(s){
    return String(s==null?'':s).replace(/[&<>"']/g,function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }
                                                                           
                                          
  function html(setId,familyName,info){
    if(info===undefined) info=g.CombatLive && g.CombatLive.familyAbilityInfo ? g.CombatLive.familyAbilityInfo(setId) : null;
    if(!info) return '';
    var sparks='';
    for(var i=0;i<PARAMS.sparks;i++){
      var far=i%2===0;
      sparks+='<i class="fs-ab-spark" style="--a:'+Math.round(i*360/PARAMS.sparks+(far?0:14))+'deg;--d:'+(far?PARAMS.sparkFar:PARAMS.sparkNear)+'px"></i>';
    }
    return '<div class="fs-ability" data-ability="'+esc(info.id)+'">'
      +'<span class="fs-ab-gloss"></span>'
      +'<span class="fs-ab-ico"><span class="fs-ab-rays"></span><span class="fs-ab-ring"></span>'
        +'<span class="fs-ab-tile"><img src="'+esc(info.icon)+'" alt="" draggable="false"></span>'+sparks+'</span>'
      +'<span class="fs-ab-txt"><i>'+esc(familyName)+' family ability</i>'
        +'<b>'+esc(info.name)+'</b><small>'+esc(info.text)+'</small></span>'
      +'</div>';
  }
                                                                            
                                                                             
  function play(wrap){
    var ring=wrap && wrap.querySelector('.fs-ab-ring'); if(!ring) return;
    ring.addEventListener('animationstart',function(){
      try{ if(typeof mergeArp==='function') mergeArp(4); }catch(e){}
    },{once:true});
  }
  var api={PARAMS:PARAMS,html:html,play:play};
  if(typeof module!=='undefined' && module.exports) module.exports=api;
  if(g.document) g.AssimilationAbility=api;
})(typeof window!=='undefined'?window:globalThis);
