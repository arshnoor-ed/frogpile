                                                                               
                                                                             
                                                                            
                                                                   
                                                                                  
(function(g){
  'use strict';
  var ART='assets/ui2/screens/upgrades/';
  var BOAT='assets/env/structure/frog_boat/boat.png';                                                          
                                                                          
                                                                          
  var LINGER_MS=700, leaving={};
                                                                             
                                                                            
  function introduced(s,id){
    if(!s || s.ftueDone || s.ftueLoop>5 || (!s.ftueLoop && (!s.tutorialStep || s.tutorialStep==='done'))) return true;
    switch(id){
      case 'inventory': return true;
      case 'pond-expansion': return s.ftueLoop===5 && ((s.pondTier||0)>=1 || (!!s.ftueCapExpand && s.ftueL5Step!=='hatch_pad'));
      case 'hatching-pad': return s.ftueLoop>=5;
      case 'flower-pad': return Number(FPConfig.value('FTUE','ftue_flowers_enabled'))!==0 && s.ftueLoop===5 &&
        (['plant','grow','seat','charge','inspect','inspect_focus'].includes(s.ftueL5Step) || !!s.ftueFlowerLesson || ['return_pond','shop'].includes(s.ftueL5Step));
      case 'workshop': return s.ftueLoop>4 || (s.ftueLoop===4 &&
        ['equipment_preview','shield','auto_harvest','harvest_resources','craft','power_gate','next_expedition'].includes(s.ftueL4Step));
      default: return false;                                                      
    }
  }
  function affordable(s){
    var tier=s.pondTier||0;
    return PondTiers.canExpand(tier) && Object.keys(PondTiers.expandShortfall(tier,s)).length===0;
  }
  function open(){ EquipmentCraft.setUpgradeTab('build',false);openSheet('upgrades'); }
  function buyPond(){ return pondTierUp(); }
  function currencies(s){
                                                                                      
                                                                      
    var ids=['wood','stone','bones','gems'];
    return ids.filter(function(k){return Currencies.has(k);}).map(function(k){
      var field=PondTiers.COST_FIELDS[k]||k, have=s[field]||0;
                                                                                                
                                                                                             
                                                                                          
                                                                                              
                                                                     
      var shopReachable=typeof shopPlus==='function' ? !!shopPlus() : (typeof dockUnlocked!=='function' || dockUnlocked()) && (typeof shopUnlocked!=='function' || shopUnlocked());
      var plus=k==='bones' || !shopReachable?'':KitUI.button({tone:'green',size:'sm',className:'fp-pill__plus',label:'+',onclick:"openSheet('shop')",ariaLabel:'Buy more '+k});
      return '<div class="fp-pill'+(plus?'':' fp-pill--noplus')+'" data-wallet="'+k+'" data-value="'+have+'" aria-label="'+k+': '+Math.floor(have)+'">'
        +'<span class="fp-pill__well">'+curIcon(field)+'</span><span class="fp-pill__amount" id="'+(field==='tadpoles'?'tad':field)+'-val">'+fmtNum(have)+'</span>'+plus+'</div>';
    }).join('');
  }
  function syncWallet(s){
    document.querySelectorAll('.upgrades-wallet [data-wallet]').forEach(function(el){
      var field=PondTiers.COST_FIELDS[el.dataset.wallet]||el.dataset.wallet,have=s[field]||0;
      el.dataset.value=have;el.setAttribute('aria-label',el.dataset.wallet+': '+Math.floor(have));
      el.querySelector('.fp-pill__amount').textContent=fmtNum(have);
    });
    document.querySelectorAll('.fp-uprow[data-buy]').forEach(function(el){
      var can=true;
      el.querySelectorAll('[data-cost-field]').forEach(function(chip){
        var have=s[chip.dataset.costField]||0,need=Number(chip.dataset.need);
        can=can&&have>=need;chip.outerHTML=costChip({cur:chip.dataset.costField,need:need,have:have});
      });
      var button=el.querySelector('.fp-uprow__act');
      if(button){
        button.disabled=!can;button.classList.toggle('kit-btn--gold',can);button.classList.toggle('kit-btn--violet',!can);
        if(can)button.setAttribute('onclick',el.dataset.buy);else button.removeAttribute('onclick');
      }
                                                                                    
      if(!el.classList.contains('kit-uprow--new')){el.classList.toggle('kit-uprow--upgrade',can);el.classList.toggle('kit-uprow--short',!can);}
    });
  }
                                                                             
                                                   
  function costChip(c){
    var ok=(c.have||0)>=c.need, label=Math.floor(c.have||0)+' / '+c.need;
    return '<span class="fp-cost kit-cost '+(ok?'fp-cost--ok kit-cost--ok':'fp-cost--short kit-cost--short')+'" data-cost-field="'+c.cur+'" data-need="'+c.need+'" title="'+label+' '+c.cur+' (have / need)" aria-label="'+label+' '+c.cur+' (have / need)">'
      +'<span class="fp-cost__art">'+curIcon(c.cur)+'</span><b>'+fmtNum(c.need)+'</b></span>';
  }
                                                                       
  function count(bar){ return '<span class="fp-upmeter__count">'+bar.have+' / '+bar.need+'</span>'; }
  function sheen(){ return KitUI.sheen?KitUI.sheen({className:'fp-uprow__sheen'}):''; }
                                                                               
                                                                              
  function rowState(o){
    if(!o.cta||o.done||o.cta.blocked) return 'blocked';
    if(o.newBuild) return 'new';
    return (o.cta.tone||(o.cta.disabled?'violet':'gold'))==='gold'?'upgrade':'short';
  }
  function lingers(o){
    var now=Date.now(), prev=typeof document!=='undefined' && document.querySelector('.fp-uprow[data-upgrade="'+o.id+'"]');
    if(prev && !prev.classList.contains('fp-uprow--done') && !leaving[o.id]){
      leaving[o.id]=now+LINGER_MS;
      setTimeout(function(){ if(typeof activeSheet!=='undefined' && activeSheet==='upgrades' && typeof render==='function') render(); },LINGER_MS+20);
    }
    return leaving[o.id]>now;
  }
  function row(o){
    if(typeof state!=='undefined' && !introduced(state,o.id)) return '';
    if(o.done && o.leave && o.id && !lingers(o)) return '';
    var st=rowState(o), costs=(o.costs||[]).filter(function(c){return c.need>0;});
    var icon=o.iconImg?'<img src="'+o.iconImg+'" alt="" draggable="false">':'<span class="fp-uprow__emoji">'+(o.icon||'')+'</span>';
    var tone=o.cta?(o.cta.tone||(o.cta.disabled?'violet':'gold')):'violet';
    var action=o.cta?KitUI.button({tone:tone,shape:'pill',size:'sm',className:'fp-uprow__act kit-uprow__act'+(o.id==='pond-expansion'?' pond-expand-buy':''),
      html:KitUI.esc(o.cta.label)+sheen(),onclick:o.cta.onclick,disabled:o.cta.disabled,
      ariaLabel:o.cta.label+' '+o.name}):'';
                                                                               
    var details=typeof document!=='undefined' && o.id && document.querySelector('.fp-uprow[data-upgrade="'+o.id+'"] .fp-uprow__details');
    var detailsOpen=details && details.open;
    var payable=o.cta&&!o.done&&!o.cta.blocked&&o.cta.label!=='Max'&&o.cta.label!=='Owned';
    var desc=(o.level?'<span class="kit-uprow__lv">'+o.level+'</span>'+(o.desc?' <span class="fp-uprow__gain">'+o.desc+'</span>':''):(o.desc||''))
      +(o.bar?(o.desc||o.level?' · ':'')+count(o.bar)+' built':'');
    return '<div class="fp-uprow kit-uprow kit-uprow--'+st+(o.done?' fp-uprow--done':'')+(o.done&&o.leave?' fp-uprow--leaving':'')+'"'
      +(o.id?' data-upgrade="'+o.id+'"':'')+(payable?' data-buy="'+KitUI.esc(o.cta.onclick)+'"':'')+'>'
      +'<span class="fp-uprow__art kit-uprow__art">'+icon+'</span><div class="fp-uprow__body kit-uprow__info">'
      +'<span class="kit-uprow__titlerow"><b class="fp-uprow__name kit-uprow__name">'+o.name+'</b>'
      +(st==='new'?'<span class="fp-uprow__new kit-uprow__tag">NEW</span>':'')+'</span>'
      +(desc?'<span class="fp-uprow__blurb kit-uprow__desc">'+desc+'</span>':'')
      +(costs.length?'<span class="fp-uprow__costs kit-uprow__costs">'+costs.map(costChip).join('')+'</span>':'')
      +(o.details?'<details class="fp-uprow__details"'+(detailsOpen?' open':'')+'><summary>Next tier details</summary><span>'+o.details+'</span></details>':'')
      +'</div><div class="fp-uprow__right">'+action+'</div></div>';
  }
  function pondRow(s){
    if(!introduced(s,'pond-expansion')) return '';
    var tier=s.pondTier||0, can=PondTiers.canExpand(tier), max=PondTiers.maxTier();
    var cost=can?PondTiers.expandCost(tier):{};
    var caps=can?[
      ['Frogs',PondTiers.maxFrogs],['Tadpoles',PondTiers.maxTadpoles],['Hatching pads',PondTiers.maxHatchingPads],
      ['Flower pads',PondTiers.maxFlowerPads],['Wood storage',PondTiers.maxWood],['Stone storage',PondTiers.maxStone]
    ].map(function(c){return c[0]+' '+c[1](tier)+' → '+c[1](tier+1);}).join(' · '):'';
    var html=row({id:'pond-expansion',iconImg:ART+'icon-pond.png',name:'Pond',
      level:'LV '+tier+(can?' → '+(tier+1):''),
      desc:can?'+'+(PondTiers.maxFrogs(tier+1)-PondTiers.maxFrogs(tier))+' frog cap':'The pond is at its full size.',
      details:can?'Pond tier '+count({have:tier,need:max})+'<br>'+caps:null,
      done:!can,costs:Object.keys(cost).filter(function(k){return cost[k]>0;}).map(function(k){return {cur:PondTiers.COST_FIELDS[k],have:s[PondTiers.COST_FIELDS[k]]||0,need:cost[k]};}),
      cta:{label:can?'Upgrade':'Max',onclick:'UpgradesUI.buyPond()',tone:affordable(s)?'gold':'violet',disabled:!can||!affordable(s)}});
    return html;
  }
  function destination(inner){
    return '<div class="fp-dsheet__scrim fp-dsheet__scrim--medium"></div>'
      +'<section class="fp-dsheet fp-dsheet--glass-dense fp-dsheet--padded fp-upage" aria-label="Upgrades">'
      +'<img class="fp-upage__boat" src="'+BOAT+'" alt="" draggable="false">'+inner+'</section>';
  }
  g.UpgradesUI={introduced:introduced,open:open,buyPond:buyPond,affordable:affordable,currencies:currencies,syncWallet:syncWallet,row:row,pondRow:pondRow,destination:destination,ART:ART};
  if(typeof module!=='undefined'&&module.exports)module.exports=g.UpgradesUI;
})(typeof window!=='undefined'?window:globalThis);
