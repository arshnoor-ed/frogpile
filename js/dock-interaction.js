                                                                              
                                                                               
(function(g){
  var held=null, pending=false;
  g.DockInteraction={
    deferRender:function(){
      if(held!==null){pending=true;return true;}
      pending=false;return false;
    }
  };
  document.addEventListener('pointerdown',function(e){
    if(!e.isPrimary || e.button!==0 || held!==null)return;
    var button=e.target.closest('button,summary,[role="button"],[onclick]');
    if(button && (button.closest('#app') || button.matches('.bottom-dock .dock-btn')))held=e.pointerId;
  },true);
  function release(e){
    if(held===null || (e && e.pointerId!==held))return;
    held=null;
                                                                               
                                                                               
    setTimeout(function(){if(pending){pending=false;if(typeof g.render==='function')g.render();}},0);
  }
  document.addEventListener('pointerup',release,true);
  document.addEventListener('pointercancel',release,true);
  g.addEventListener('blur',function(){release();});
})(window);
