                                                                                     
(function(g){
  'use strict';
                                                                             
                                                                              
                                                                
                                                                       
                                                               
  var TIMING={complete:450,promote:450,
    interruptNextArrive:350,interruptNextDisable:200,interruptActiveArrive:350,interruptDemote:350};
  function esc(v){return String(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  function interruptDuration(){return TIMING.interruptNextArrive+TIMING.interruptNextDisable+TIMING.interruptActiveArrive+TIMING.interruptDemote;}
  function duration(kind){
    if(typeof matchMedia==='function' && matchMedia('(prefers-reduced-motion: reduce)').matches) return 0;
    return kind==='interrupt' ? interruptDuration() : TIMING.complete+TIMING.promote;
  }
  function transition(now,kind){return {at:now==null?Date.now():now,duration:duration(kind),kind:kind||'promote'};}
  function transitioning(t,now){return !!t && (now==null?Date.now():now)-t.at<t.duration;}
  function progress(need,income){
    var total=0,have=0;
    ['wood','stone'].forEach(function(k){var n=Math.max(0,need[k]||0);total+=n;have+=Math.min(n,Math.max(0,income[k]||0));});
    return {have:have,need:Math.max(1,total),done:have>=total-1e-7};
  }
  function render(steps,index,id,t){
    var elapsed=t?Math.max(0,Date.now()-t.at):0, moving=transitioning(t);
    var interrupt=moving && t.kind==='interrupt', entering=moving && t.kind==='enter';
    var front=moving && !interrupt && !entering?index-1:index, next=steps[front+1];
    var number=function(n){return FPConfig.text('text_objective_step','Step {number}',{number:n});};
    function card(i,cls,done){
      var step=steps[i],label='<span class="os-step">'+esc(number(i+1))+'</span><span>'+esc(step.text)+'</span>';
                                                                                 
                                                                                      
      var build=typeof buildTaskPlateHTML==='function'?buildTaskPlateHTML:taskPlateHTML;
      return build(label,done?step.need:step.have,step.need,!!done,!!done,null,id)
        .replace('task-plate','task-plate '+cls).replace(/ tp-enter/g,'')
        .replace(/<\/div>\s*$/, (cls==='os-next'?'<span class="os-lock" aria-hidden="true">&#128274;</span>':'')+'</div>');
    }
    return '<div class="objective-stack'+(next?' os-pending':'')+(moving?' os-'+(interrupt?'interrupt':entering?'enter':'transition'):'')+'" data-stack="'+esc(id)+'" style="--os-elapsed:-'+elapsed+'ms">'+
      (next?card(front+1,'os-next',false):'')+card(front,'os-active',moving && !interrupt && !entering)+
      '<span class="os-current">'+esc(FPConfig.text('text_objective_current','Current Objective'))+'</span></div>';
  }
                                                                                  
                                                                                       
  function dispatchPlan(frogs,jobs,harvest,busy){
    var seated=new Set();
    var plan=jobs.map(function(job){
      var ids=((harvest[job.job_id]||{}).slots||[]).filter(Boolean).map(function(s){seated.add(s.frogId);return s.frogId;});
      return {job:job,ids:ids};
    });
    var remaining=frogs.filter(function(f){return !seated.has(f.id) && !busy(f.id);})
      .sort(function(a,b){return (b.tier||0)-(a.tier||0) || String(a.id).localeCompare(String(b.id));});
    remaining.forEach(function(f){
      var seat=plan.filter(function(p){return p.ids.length<Number(p.job.frogs_per_job);})
        .sort(function(a,b){return a.ids.length-b.ids.length || jobs.indexOf(a.job)-jobs.indexOf(b.job);})[0];
      if(seat) seat.ids.push(f.id);
    });
    return plan;
  }
  var api={render:render,dispatchPlan:dispatchPlan,progress:progress,transition:transition,transitioning:transitioning,TIMING:TIMING};
  g.ObjectiveStack=api;
  if(typeof module!=='undefined') module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
