                                                                          
                                                                                                     
(function(g,f){if(typeof module!=='undefined'&&module.exports)module.exports=f();else g.CombatPresentation=f();})(typeof window!=='undefined'?window:globalThis,function(){
 'use strict';
                                                                                               
                                                                                               
                                                                                                
                                                                                               
                                                                                                 
                                                                                   
                                                                                                 
                                                                                               
                                                                                             
                                                                                                
                                                                                         
                                                                                                  
                                                                                               
                                                                                                
                                                                                              
                                               
                                                                                                  
                                                                                               
                                                                                            
                                                            
                                                                                                
                                                                                                    
                                                                                                    
                                                                                                       
                                                                                                          
                                                                                                         
                                                                                                                                   
                                                                                                         
                                                                                                
                                                                                                   
                                                                                                 
                                                                                                
                                                                              
                                                                            
                                                                                
                                                                              
                                                                             
                                                                  
                                                                                                
                                                                                           
 var P={refWidthPx:390,minUnitWidthPx:320,maxUnitWidthPx:480,
  frogFramePx:102,frogArtPx:640,frogInk:8,minInk:2,maxInk:2,giantScale:1.5,
  foeFrames:{regular:1,miniboss:1.25,boss:1.6,giant:2.4},tierMin:{regular:0,miniboss:1,boss:1.25,giant:1.6},
  frogScale:1,loneBoss:[.5,.4,.3,.2,.1,0],
  foeHeight:{
             
   reedmarsh_mushroom:49.4,reedmarsh_snail:44.4,reedmarsh_crane:87.5,reedmarsh_boar:73.5,reedmarsh_miniboss_bunny:176, reedmarsh_s1_mosquito:42,reedmarsh_s1_mangleroot:80,reedmarsh_s1_turtle:71,reedmarsh_s1_heron:94,reedmarsh_s1_toad:94,reedmarsh_s1_warden:108,
             
                                                                                                                 
                                                                                                                        
   reedmarsh_mire_slime:55.6,mirewood_bramble_beetle:47.6,mirewood_moss_adder:84.5,reedmarsh_miniboss_stag:150,
   reedmarsh_boss_swampjaw_giant:205,
             
   reedmarsh_autumn_acorn:66.3,reedmarsh_autumn_beetle:54.5,reedmarsh_autumn_pinecone:59.6,reedmarsh_autumn_golem:69,
   reedmarsh_autumn_crow:79.9,reedmarsh_autumn_fox:78.9,reedmarsh_autumn_boar:70,reedmarsh_autumn_stump:105.6,
   reedmarsh_autumn_stag:123.8,reedmarsh_autumn_badger:101.5,reedmarsh_autumn_bandit:53,reedmarsh_boss_mole_giant:134.8,
             
   reedmarsh_reef_slime:55.9,reedmarsh_reef_snail:55.9,reedmarsh_reef_crab:64.2,reedmarsh_reef_turtle:67.4,
   reedmarsh_reef_gull:79.9,reedmarsh_reef_newt:63.2,reedmarsh_reef_rock:73,reedmarsh_reef_seal:70.2,
   reedmarsh_reef_shaman:105.7,reedmarsh_boss_orca_giant:145.5,
             
   reedmarsh_blight_mushroom:50.2,reedmarsh_blight_slime:52.2,reedmarsh_blight_eye:43.5,reedmarsh_blight_snake:84.4,
   reedmarsh_blight_stork:95.1,reedmarsh_blight_crow:78.6,reedmarsh_blight_boar:72.3,reedmarsh_blight_beast:91.7,
   reedmarsh_blight_badger:101.3,reedmarsh_boss_reaper_giant:175.9},
  spreadX:.28,spreadY:.36,crowdSteps:[1,.85,.7,.6,.5],hideMax:.1,gapPx:12,
  windupMs:90,jumpMs:300,holdMs:70,returnMs:460,settleMs:90,jumpArc:46,returnArc:44,
  effectTravelMs:560,effectFadeMs:140,stateMs:380,hitMs:300,deathMs:420,
  boneMs:1350,bonesRegular:3,bonesMiniboss:4,bonesBoss:6,bonesGiant:12,bonesMax:24,
                                                                         
                                                
  travelStartS:.95,hopMs:410,hopPx:42,travelScreens:1.05,
  parallax:{far:.18,mid:.45,floor:1,fore:1.35},
                                                                             
                                                                               
                                                                              
                                                                               
                                                                               
                                                       
  cheerStartS:.95,cheerMs:1150,cheerPx:54,cheerLagMs:120,
                                                                                                      
                                                                                                              
                                                                                                                         
                                                                                               
                                                                                                           
                                                                                                         
                                                                                                    
                                                                                         
                                                                                                     
                                                                                               
                                                                                                     
                                                                                                 
                                                                                                   
                                                                                                 
                     
  gait:{size:.47,rollCentre:.2086,
   roll:{bounceMs:500,height:.75,sit:.26,squash:.22,stretch:.14,crouch:.24,sitTurn:.15,turnsPerBounce:.5,lastBounces:2,decay:.6,
    leapTurns:1,returnTurns:1,cheerFlip:[.09,.38],rockDeg:10},
   stomp:{strideMs:380,lift:.13,sway:9,shift:.055,squash:.16,stopMs:620,stopTip:15,stopLift:.06,
    leapArc:.72,returnArc:.8,landMs:560,landTip:13},
   leap:{leapMs:600,gather:.3,land:.14,height:.62,squash:.2,stretch:.16,tilt:13,leapArc:1.25,returnArc:1.1,cheerFlip:[.09,.38]},
   waddle:{stepMs:240,rock:8,lift:.035,squash:.06,armOut:14,settleMs:520,leapArc:.55,rockDeg:9},
   crawl:{surgeMs:520,stretch:.13,gather:.08,reach:.05,lean:3,leapArc:.22,returnArc:.3,bubbleMs:170}},
                                                                           
                                                                           
                                                                               
                                                                         
                                                                            
                                                                              
                                                                              
                                                                              
                                               
  shakeMaxPx:14,shakeHz:19,shakeDecayPerS:1.7,
  traumaFrogHit:.55,traumaFrogHitMax:.88,traumaFrogDeath:1,traumaFoeHit:.24,traumaFoeKill:.42,traumaBossKill:1,
  hitStopMs:90,critHpFrac:[.35,.2,.1],dangerPartyFrac:.4,
                                                                                 
                                                                                   
  frogDeathMs:760,foeHitMs:300,foeHitRestMs:250,sparkMs:420,
                                                                                            
                                                                                              
                                                                                                  
                                                                                                  
                                                                                        
                                                                                                 
                                                                                                
                                                                                                 
                                                                                                
                                                                                              
                                                                                    
  foeHurt:{ms:420,dim:.78,sepia:.9,saturate:3.2,hue:-50,lift:1.18,rim:3,
   squash:[.15,-.17],stretch:[-.07,.09],knock:.075,lean:4.5,shudder:[.04,-.03,.018,-.008],
   tap:.85,leap:1,dot:.45,kill:1.3,crit:1.2,reducedAmp:.3,
   weight:{regular:1,miniboss:.85,boss:.7,giant:.55}},
                                                                                            
                                                                                          
                                                                                            
                                                                                             
                                                                                              
                                                                                             
                                                                                         
                                                                                         
                                                                                              
                                                                                               
                                                                                            
                                                                                          
                                               
  squish:{ms:640,topDeg:48,ampMin:.8,ampMax:1.1,heavyFrac:.3,ampDeath:1.25,reducedAmp:.35,
   top:[.5,-.46],hop:.1,side:[-.4,.3],body:.6,knock:.07,lean:10,
   spring:[[0,0],[.07,1],[.16,.92],[.32,-.5],[.47,.26],[.62,-.12],[.78,.05],[1,0]]},
                                                                            
                                                                              
                                                                            
                                                                     
  swingRaiseDeg:38,swingStrikeDeg:-104,swingOvershootDeg:-116,swingStrikeMs:110,
                                                                                       
                                                   
  frameLeapArc:.3,
                                                                                              
                                                                                             
                                                                                         
                                                                                           
                                                                                            
  frameSpit:{lean:10,lunge:18,minScale:.5,splashMinScale:.75,aimUp:.3},
                                                                                                  
                                                                                             
                                                                                                     
                                                                                                  
                                                                                                  
                                                                                                     
  frameLash:{kMin:.06,kMax:1.6,lean:6,lunge:12,missMax:120},
                                                                                                  
                                                                                                    
                                                                                                 
                                                                                                 
                                                                                           
                                                                                                    
                                                                                                   
                                                                                                      
                                                                                                  
                                                                                                                 
                                                                                                              
                                                        
                                                                                                   
                                                                                                   
                                                                                                    
                                                                                                      
                                                                                                        
                                                                                                        
                                                                                                      
                                                                                                         
                                                                                                       
                                                                                                     
                                                                                                                                          
                                                                                                 
                                                                                                          
                                                                                                          
                                                                                                            
                                                                                               
                                                                                                                      
                                                                                                                    
                                                                                                                      
                                                                                                                   
                                                                                       
                                                                                                      
                                                                                                                        
                                                                                                                            
                                                                                                                       
                                 
  bossCracks:{sets:{
    hollow:{small:[[221,136,103,9,55,83],[226,134,58,0,73,87],[218,116,81,37,32,35],[204,126,84,5,54,74],[201,120],[178,119,56,0,87,77],[179,110],[160,149,71,0,57,107],[196,96,59,0,79,76],[139,83,40,0,56,67],[112,63]],
     big:[[851,424,117,0,623,387],[457,246,32,0,349,184],[457,158,120,0,166,108]],fireFrames:4,smallPx:.5,feetFy:.64,
     bed:[[1,-.42,-.2,1.15],[0,0,0,2.4],[2,-1.05,.14,1.1]],bedFeetFy:[.63,.66,.57],sparks:'crack',open:'tear',gloom:true,rise:true},
    tide:{small:[[285,128],[281,140],[274,108],[330,92],[261,114],[207,168],[223,100],[228,114],[222,70],[241,67],[207,67],[133,80],[109,53]],
     big:[[886,338]],smallPx:.5,feetFy:.6,bed:[[0,0,0,1.7]],bedFeetFy:[.78],bedOverTop:true,sparks:'splash',open:'well',gloom:false,rise:false,trauma:[.12,.24]}},
   maxPer:4,firstMs:[1500,700],gapMs:[2600,1400],creep:[.8,.42],spreadX:.2,pick:4,grow:[.85,1.15],
   tearMs:560,trauma:[.24,.42],chips:8,surface:[285,1190],bedFlatMin:.6,
   flareMs:1000,flareTrauma:.62,flareChips:16,glowMs:640,rumbleMs:240,rumble:.2,gloomPre:[.15,.45]},
                                                                                   
                                                                                  
                                                                                    
                                                                                    
                                                                                    
                                                                                     
                                                                                  
                                                                                  
                                  
  orbs:{tiers:{hard:{count:5,spreadDeg:36,sprayMs:170,wobblePx:0,sizePx:16},extreme:{count:8,spreadDeg:56,sprayMs:230,wobblePx:15,sizePx:18}},
   minPerTarget:2,arriveSpreadMs:140,popMs:110,minFlightMs:200,budget:84,reducedCount:3},
                                                                                             
                                                                                          
                                                                                         
                                                                                             
                                                                                            
                                                                                            
                                                                                               
                                                                                           
                                                                                        
                                                                                         
                                                                  
  harvest:{flowerPx:300,aspect:.731,footBand:.88,feetFy:.9,
   seats:[[.31,.29],[.68,.31],[.17,.51],[.83,.57],[.47,.67],[.5,.15],[.3,.69],[.66,.74],[.4,.44],[.59,.48]],
   center:[.49,.47],
   discoverMs:560,perchGapMs:130,perchMs:620,perchArc:86,bounceMs:640,bouncePx:9,
   squashMs:300,stompMs:470,stompPx:36,
   flingAtMs:380,flingMs:780,flingArc:150,
   petalsTap:3,petalsMilestone:12,petalsBurst:32,petalMs:1500,
   seedPopMs:950,seedFlyMs:1250,seedGapMs:150,tokensMax:5},
                                                                                                        
                                                                                                     
                                                                                                       
                                                                                                        
                                                                                                                                               
                                                                                                     
                                                                                                     
                                                                                                  
                                                                                                       
                                                                                                    
                                                                                                             
                                                                                                   
                                                                                                           
                                                        
                                                                                                       
                                                                                                        
                                                                                                       
                                                                                            
                                                                 
  rocks:{px:124,footFy:.9,bottomClearPx:104,stripGapPx:5,giantFrontMaxX:.65,
   sets:{swamp:{file:'ruin-',art:[[304,267],[183,304],[304,246],[304,193],[304,228],[304,200],[202,304],[304,268],[304,194],[304,197],[304,231],[304,156]]},
    meadow:{file:'meadow-',art:[[292,304],[294,304],[304,204],[203,304],[300,197],[251,243],[304,158],[224,290],[304,185],[266,167],[196,211],[245,164],[304,192],[249,188],[219,187]]},
    autumn:{file:'autumn-',art:[[304,277],[179,304],[288,255],[304,173],[280,304],[304,219],[292,227],[304,170],[276,250],[213,271],[276,244],[304,140],[263,255],[297,196],[304,229]]}},
   back:[{x:.55,a:165,s:.7},{x:.77,a:150,s:.66},{x:.95,a:175,s:.76}],
   front:[{x:.6,a:1035,s:.9},{x:.86,a:1015,s:.92}],
   hitMs:240,burstMs:320,chipsHit:7,chipsBurst:16,stones:3,stoneFlyMs:1150,stoneGapMs:110,rubble:6,rubbleMs:2600,
   smashDelayMs:420,smashGapMs:160,smashWaitStepMs:60,smashWaitMaxMs:700},
                                                                                                
                                                                                          
                                                                                              
                                                                                               
                                                                                               
                                                                                              
                                                                                                    
                                                                                           
                                                                                                  
                                                                                     
                                                                                                  
                                                                                                    
                                                                                                         
  rescue:{webPx:300,maxW:.84,aspect:.899,footFy:.95,backBand:.1,
   spots:[[.33,.47],[.7,.46],[.28,.67],[.75,.65],[.42,.8],[.62,.79],[.51,.4],[.38,.6],[.65,.58]],
   hub:[.51,.585],tadW:.1,prizeGear:.25,prizeTicket:.36,prizeSpots:[[.72,.36]],prizeClear:.15,prizeGapMs:420,
   bites:[[.3,.62],[.7,.6],[.45,.78],[.58,.36],[.36,.4],[.63,.77]],
   discoverMs:560,pullMs:640,pullHitMs:300,joltMs:320,threadMs:1100,threadsTap:5,threadsBurst:28,
   tokensMax:7,tadFlyMs:1050,tadGapMs:110,tearMs:950,ticketGapMs:170,
   frogDropMs:520,frogCheerMs:900,frogHomeMs:900,frogHomeAtMs:1350},
                                                                                                   
                                                                                                       
                                                                                                       
                                                                                                    
                                                                                                      
                                                                                                   
                                                                                                        
                                                                                                    
                                                                                                     
                                                         
                                                                                                   
                                                                                                   
                                                                                                      
                                                                                                      
                                                                                                   
                                                                            
                                                                                                   
                                                                                                    
                                                                                                  
                                                                                                 
                                       
  meadow:{px:165,unitPx:150,backArtPx:135,heartFy:.45,tall:1.2,refV:1.21,
   art:[[107,40],[76,30],[120,51],[90,38]],petal:[54,78],
   spots:[[.489,.039,.115],[.174,.046,.164],[.932,.046,.135],[.3,.07,.115],[.011,.074,.15],[.642,.081,.129],[-.051,.095,.114],[-.281,.102,.154],
    [.284,.109,.13],[.695,.123,.134],[.489,.148,.136],[.105,.174,.156],[.347,.215,.118],[.926,.225,.134],[.695,.225,.128],[.589,.232,.172],
    [-.232,.244,.121],[-.058,.25,.123],[.151,.287,.136],[.726,.289,.162],[.542,.292,.119],[.421,.313,.142],[-.634,.345,.122],[.679,.345,.131],
    [-.889,.352,.168],[.337,.356,.176],[-.157,.357,.158],[-.332,.359,.135],[.036,.378,.135],[.905,.387,.133],[.989,.423,.147],[-.468,.43,.143],
    [.811,.437,.16],[.916,.44,.127],[.401,.463,.128],[.621,.465,.161],[-.218,.479,.169],[.003,.505,.139],[-.749,.521,.127],[-.983,.528,.16],
    [.779,.535,.19],[-.468,.535,.138],[.255,.549,.152],[.979,.556,.145],[-.12,.585,.155],[.774,.595,.138],[-.591,.602,.145],[.425,.615,.154],
    [-.681,.62,.163],[-.354,.629,.154],[.057,.668,.16],[.979,.687,.158],[.653,.687,.142],[-.176,.694,.168],[.234,.748,.14],[-.42,.751,.174],
    [.495,.765,.182],[.984,.768,.15],[.789,.778,.169],[.895,.785,.13],[-.257,.804,.173],[-.085,.826,.181],[.339,.865,.162],[.134,.867,.15],
    [-.434,.869,.169],[.548,.872,.148],[.753,.877,.199],[.879,.94,.189],[-.05,.949,.144],[.705,.975,.184],[-.226,.985,.158],[-.391,.985,.189],
    [.297,.993,.167],[.989,.993,.171],[-.774,1.004,.189],[.563,1.011,.187],[-.668,1.056,.167],[-1.038,1.067,.215],[.474,1.077,.173],[-.306,1.092,.175],
    [.147,1.092,.145],[.795,1.095,.185],[.411,1.109,.15],[.242,1.18,.158]],
   rest:[[-1.18,.03,-62],[.62,1.14,28]],
   petalEveryMs:620,petalJitter:.55,petalLen:.55,windPxS:.26,climb:.62,flutterPx:9,spinDegS:260,flipHz:1.6,
   gustEveryMs:3400,gustJitter:.4,gustMs:1400,swayDeg:3}};
 function attackMs(){return P.windupMs+P.jumpMs+P.holdMs+P.returnMs+P.settleMs;}
                                                             
 function contactMs(side){return side==='frog'?P.windupMs+P.jumpMs:P.effectTravelMs;}
                                                                                              
                                                                                          
 function tier(id,boss){return /miniboss/.test(id)?'miniboss':/giant/.test(id)?'giant':boss?'boss':'regular';}
                                                                                    
                                                                              
 Object.entries({"ftuestage1_swamp_mushroom": "reedmarsh_mushroom", "ftuestage1_swamp_snail": "reedmarsh_snail", "ftuestage2_bramble_beetle": "mirewood_bramble_beetle", "ftuestage2_bog_slime": "reedmarsh_mire_slime", "ftuestage2_swampjaw_bloom": "reedmarsh_boss_swampjaw_giant", "ftuestage3_cinder_crow": "reedmarsh_autumn_crow", "ftuestage3_acorn_sprite": "reedmarsh_autumn_acorn", "ftuestage3_blaze_beetle": "reedmarsh_autumn_beetle", "ftuestage3_maple_stag": "reedmarsh_autumn_stag", "reedmarsh_miniboss_toadstool_mole": "reedmarsh_boss_mole_giant", "ftuestage4_reef_snail": "reedmarsh_reef_snail", "ftuestage4_coral_newt": "reedmarsh_reef_newt", "ftuestage4_reef_gull": "reedmarsh_reef_gull", "ftuestage4_coral_crab": "reedmarsh_reef_crab", "ftuestage4_orca_corsair": "reedmarsh_boss_orca_giant", "ftuestage5_blight_mushroom": "reedmarsh_blight_mushroom", "ftuestage5_blight_slime": "reedmarsh_blight_slime", "ftuestage5_blight_eye": "reedmarsh_blight_eye", "ftuestage5_hollow_reaper": "reedmarsh_boss_reaper_giant", "ftuestage5_blight_beast": "reedmarsh_blight_beast"}).forEach(function(pair){P.foeHeight[pair[0]]=P.foeHeight[pair[1]];});
 function unitScale(width){return width?Math.max(P.minUnitWidthPx,Math.min(P.maxUnitWidthPx,width))/P.refWidthPx:1;}
                                                                                                       
                                                                    
 var INK=null;
 function inkTable(){
  if(INK)return INK;
  if(typeof CreatureInk!=='undefined')return INK=CreatureInk;
  try{return INK=require('./creature-ink.js');}catch(e){return {};}
 }
                                                                                                
                                                                         
 function sizeTier(id,boss){return /miniboss|boss|giant/.test(id)||!inkTable()[id]?tier(id,boss):'regular';}
                                                                                                     
                                                                                                    
                          
 function foePx(id,boss){
  var t=sizeTier(id,boss),m=inkTable()[id],fp=P.frogFramePx,px=P.foeFrames[t]*fp;
  if(P.foeHeight[id]&&m&&m[2])return P.foeHeight[id]/m[2];
  if(m&&m[0]>=P.minInk)px=Math.min(px,m[1]*P.frogInk*P.maxInk/P.frogArtPx*fp/m[0]*(t==='giant'?P.giantScale:1));
  return Math.max(px,P.tierMin[t]*fp);
 }
                                                                      
 function size(id,boss,scale){return Math.round(foePx(id,boss)*(scale||1));}
                                                                              
 function pack(items,width,height){
  height=height || Infinity;
  var rows=[],row=[],used=0;
  items.forEach(function(it){var s=size(it.defId,it.isBoss);if(row.length&&used+s>width){rows.push(row);row=[];used=0;}row.push({item:it,width:s,height:s+18});used+=s+P.gapPx;});
  if(row.length)rows.push(row);
  var y=0,page=0,units=[];
  rows.forEach(function(r){var w=r.reduce(function(n,u){return n+u.width;},0)+(r.length-1)*P.gapPx,h=Math.max.apply(null,r.map(function(u){return u.height;})),x=(width-w)/2;if(y&&y+h>height){page++;y=0;}r.forEach(function(u){units.push({id:u.item.id,page:page,left:x,top:y+h-u.height,width:u.width,height:u.height});x+=u.width+P.gapPx;});y+=h+P.gapPx;});
  return {units:units,height:Math.max(0,y-P.gapPx),pages:page+1};
 }
                                                                         
                                                                             
 function roster(items,width,height){
  var individual=pack(items,width,height),groups;
  if(individual.pages===1){
   groups=items.map(function(e){return {id:e.id,defId:e.defId,isBoss:e.isBoss,name:e.name,members:[e.id]};});
   return {individual:true,groups:groups,layout:individual};
  }
  var byCatalog={};
  items.forEach(function(e){
   if(!byCatalog[e.defId])byCatalog[e.defId]={id:e.id,defId:e.defId,isBoss:e.isBoss,name:e.name,members:[]};
   byCatalog[e.defId].members.push(e.id);
  });
  groups=Object.keys(byCatalog).map(function(id){return byCatalog[id];});
  return {individual:false,groups:groups,layout:pack(groups,width,height)};
 }
                                                                     
                                                                             
                                                                                             
                                                                                                                       
                                                                                                                           
 function ground(width,height,frogPx,band){
  var scale=width/1400,top=height*.54,unit=(frogPx||P.frogFramePx)/P.frogFramePx,b=band||[420,1080];
  var r={left:8,right:width-8,top:top+b[0]*scale,bottom:Math.min(top+b[1]*scale,height*.86),unit:unit};
  r.polygon=[[r.left,r.top],[r.right,r.top],[r.right,r.bottom],[r.left,r.bottom]];
  r.party={left:r.left,right:width*.48,top:r.top,bottom:r.bottom,unit:unit};
  r.enemy={wideLeft:r.left,left:Math.min(width*.46,width-8-size('boss',true,unit)),right:r.right,top:r.top,bottom:r.bottom,unit:unit};
  return r;
 }
 function layoutRng(seed){
  var n=2166136261;String(seed).split('').forEach(function(c){n=Math.imul(n^c.charCodeAt(0),16777619);});
  return function(){n=(Math.imul(n,1664525)+1013904223)>>>0;return n/4294967296;};
 }
 function depth(footY){return 1+Math.round(footY*10);}
                                                                              
                                                                               
                                                                            
                                                                       
                                                                            
                                                       
 function organic(items,region,seed){
  var rng=layoutRng(seed),units=[],failed=false,spread=region.spread||1;
  items.slice().sort(function(a,b){return (b.isBoss?1:0)-(a.isBoss?1:0);}).forEach(function(it){
   if(failed)return;
   var w=it.width||size(it.defId,it.isBoss,region.unit),h=it.height||w,band=region.bottom-region.top;
                                                                                                     
                                                                     
   var giant=tier(it.defId,it.isBoss)==='giant',lo=giant||w>region.right-region.left?Math.min(region.left,region.right-w):region.left;
   if((w>region.right-lo||band<0)&&!region.force){failed=true;return;}
   var best=null,bestScore=-1,room=Math.max(0,region.right-lo-w);band=Math.max(0,band);
                                                                           
                                                                
   var st=region.stand&&region.stand[it.defId];
   if(st && items.length===1){best={id:it.id,left:st.x-w/2,top:st.y-h,width:w,height:h+(it.width?0:18),spriteHeight:h,footX:st.x,footY:st.y,z:depth(st.y),page:0};units.push(best);return;}
                                                                                                      
                                                                                                          
   if(it.isBoss&&items.length===1&&!giant){
    var cx=(lo+region.right)/2,ys=P.loneBoss.map(function(f){return region.top+band*f;});
    var cover=function(y){return coverage(cx,y,w,h,region.avoid);};
    var fy=ys.filter(function(y){return cover(y)<=P.hideMax;})[0];
    if(fy==null)fy=ys.reduce(function(a,y){return cover(y)<cover(a)?y:a;});
    units.push(placed(it,cx,fy,w,h));return;
   }
   for(var i=0;i<160;i++){
    var x=lo+w/2+rng()*room,y=region.top+rng()*band;
    if(it.isBoss&&i===0){
     x=(lo+region.right)/2;y=region.top+band*.88;
                                                                       
                                                                           
     if(region.readable && items.filter(function(e){return e.isBoss;}).length>1){x=lo+w/2;y=region.top;}
    }
    if(hidden(x,y,w,h,region.avoid)){
     if(items.length===1){
      var cover=coverage(x,y,w,h,region.avoid);
      if(!best || cover<coverage(best.footX,best.footY,w,h,region.avoid)){best=placed(it,x,y,w,h);bestScore=1;}
     }
     continue;
    }
    var score=units.reduce(function(v,u){
     var contains=(x-w/2>=u.left&&x+w/2<=u.left+u.width&&y-h>=u.footY-u.spriteHeight&&y<=u.footY);
     var covers=(u.left>=x-w/2&&u.left+u.width<=x+w/2&&u.footY-u.spriteHeight>=y-h&&u.footY<=y);
     if(contains||covers)return 0;
                                                                          
                                                                          
                                                                      
     if(region.readable){
      var ox=Math.max(0,Math.min(x+w/2,u.left+u.width)-Math.max(x-w/2,u.left));
      var oy=Math.max(0,Math.min(y,u.footY)-Math.max(y-h,u.top));
      if(ox*oy>Math.min(w*h,u.width*u.spriteHeight)*P.spreadY)return 0;
     }
     var dx=(x-u.footX)/((w+u.width)*P.spreadX*spread),dy=(y-u.footY)/(Math.min(h,u.spriteHeight)*P.spreadY*spread);
     return Math.min(v,Math.sqrt(dx*dx+dy*dy));
    },Infinity);
    if(score>bestScore){bestScore=score;best=placed(it,x,y,w,h);}
                                                       
    if(it.isBoss&&i===0&&score>=1)break;
   }
   if(!best||(bestScore<1&&!region.force)){failed=true;return;}units.push(best);
  });
  return {units:units,pages:1,fits:!failed};
 }
                                                            
 function placed(it,x,y,w,h){return {id:it.id,left:x-w/2,top:y-h,width:w,height:h+(it.width?0:18),spriteHeight:h,footX:x,footY:y,z:depth(y),page:0};}
                                                                                                
 function coverage(x,y,w,h,boxes){
  return (boxes||[]).reduce(function(c,b){
   var ox=Math.min(x+w/2,b.left+b.width)-Math.max(x-w/2,b.left),oy=Math.min(y,b.top+b.height)-Math.max(y-h,b.top);
   return ox>0&&oy>0?Math.max(c,ox*oy/(w*h)):c;
  },0);
 }
                                                            
 function hidden(x,y,w,h,boxes){return coverage(x,y,w,h,boxes)>P.hideMax;}
                                                                           
                                                                                  
                                                                                                  
                                                                                                    
                                                                                                   
 function partyLayout(items,region,seed){
  var m=items.reduce(function(a,it){return Math.max(a,it.width||0);},0)*(1-P.gait.size)/2;
  region=Object.assign({},region,{right:region.right+m});
  for(var k=0;k<P.crowdSteps.length;k++){
   var fit=organic(items,Object.assign({},region,{spread:P.crowdSteps[k]}),seed);
   if(fit.fits)return fit;
  }
  return organic(items,Object.assign({},region,{spread:P.crowdSteps[P.crowdSteps.length-1],force:true}),seed);
 }
                                                                            
                                                                             
                                                                           
                                 
 function organicRoster(items,region,seed){
  region=Object.assign({},region,{readable:true});
                                                                            
                                                                             
                                                                              
  var bosses=items.filter(function(e){return e.isBoss;});
  var bossSpan=bosses.reduce(function(n,e){return n+size(e.defId,e.isBoss,region.unit);},0);
  if(bosses.length>1 && bossSpan>region.right-region.left && region.wideLeft!=null)region.left=region.wideLeft;
  var groups=items.map(function(e){return {id:e.id,defId:e.defId,isBoss:e.isBoss,name:e.name,members:[e.id]};});
  for(var k=0;k<P.crowdSteps.length;k++){
   var fit=organic(groups,Object.assign({},region,{spread:P.crowdSteps[k]}),seed);
   if(fit.fits)return {individual:true,groups:groups,layout:fit,spread:P.crowdSteps[k]};
  }
  var byCatalog={};groups=[];
  items.forEach(function(e){var key=e.isBoss?e.id:e.defId;if(!byCatalog[key]){byCatalog[key]={id:e.id,defId:e.defId,isBoss:e.isBoss,name:e.name,members:[]};groups.push(byCatalog[key]);}byCatalog[key].members.push(e.id);});
  var units=[],pageItems=[],page=0;
  groups.forEach(function(e){
   var trial=organic(pageItems.concat([e]),region,seed+':'+page);
   if(!trial.fits&&pageItems.length){
    organic(pageItems,region,seed+':'+page).units.forEach(function(u){u.page=page;units.push(u);});page++;pageItems=[];
   }
   pageItems.push(e);
  });
  organic(pageItems,region,seed+':'+page).units.forEach(function(u){u.page=page;units.push(u);});
  return {individual:false,groups:groups,layout:{units:units,pages:page+1},spread:1};
 }
 function arc(x,y,h,t){var u=1-t;return [x*t,2*u*t*(Math.min(0,y)-h*2)+t*t*y];}
 function r2(n){return Math.round(n*100)/100;}
 function r3(n){return Math.round(n*1000)/1000;}
                                                                             
                                                                               
                                                                             
                                                                              
                                                                            
                                                                                                   
                                                                                                   
                     
 function jumpFrames(dx,dy,scale,gait){
  var frames=[],total=attackMs(),hit=P.windupMs+P.jumpMs,back=hit+P.holdMs,land=back+P.returnMs,roll=gait==='roll',stomp=gait==='stomp',S=P.gait.stomp;
  var leap=gait==='leap',wad=gait==='waddle',crawl=gait==='crawl',L=P.gait.leap,W=P.gait.waddle,C=P.gait.crawl;
  function key(x,y,rot,sx,sy,ms){frames.push({transform:'translate('+r2(x)+'px,'+r2(y)+'px) rotate('+r2(roll||wad?0:rot)+'deg) scale('+sx+','+sy+')',offset:ms/total});}
  key(0,0,0,1,1,0);
  if(stomp||leap)key(0,0,0,1.2,.78,P.windupMs);else if(wad)key(0,0,0,1.16,.86,P.windupMs);else if(crawl)key(0,0,-4,.9,1.1,P.windupMs);else key(0,0,0,1.14,.84,P.windupMs);
  var up=P.jumpArc*(stomp?S.leapArc:leap?L.leapArc:wad?W.leapArc:crawl?C.leapArc:1)/scale,tilt=stomp?8:18;
  for(var i=1;i<=8;i++){var t=i/8,a=arc(dx,dy,up,t),
   st=leap?(i<3?[.9,1.16]:[1.1,.92]):crawl?[1+.25*Math.sin(Math.PI*Math.min(1,t*1.4)),1-.2*Math.sin(Math.PI*Math.min(1,t*1.4))]:i<3?(stomp?[.94,1.08]:wad?[.96,1.05]:[.9,1.14]):[1,1],
   rot=leap?-L.tilt*Math.cos(Math.PI*t):crawl?6*Math.sin(Math.PI*t):tilt*Math.sin(Math.PI*t);
   key(a[0],a[1],rot,r3(st[0]),r3(st[1]),P.windupMs+t*P.jumpMs);}
  frames[frames.length-1].transform='translate('+r2(dx)+'px,'+r2(dy)+'px) rotate('+(leap?L.tilt:0)+'deg) scale('+(stomp?'1.2,0.82':leap?'1.18,0.84':wad?'1.24,0.8':crawl?'1.3,0.72':'.86,1.1')+')';
  if(stomp)key(dx,dy,0,1.1,.9,back);else if(wad)key(dx,dy,0,1.12,.88,back);else if(crawl)key(dx,dy,0,1.14,.86,back);else key(dx,dy,leap?L.tilt*.5:0,.92,1.06,back);
  var down=P.returnArc*(stomp?S.returnArc:leap?L.returnArc:crawl?C.returnArc:1)/scale,tumble=stomp?-16:leap?-26:crawl?-8:-32;
  for(var j=1;j<8;j++){var v=j/8,b=arc(-dx,-dy,down,v);key(dx+b[0],dy+b[1],tumble*Math.sin(Math.PI*Math.pow(v,1.4)),1,1,back+v*P.returnMs);}
  if(stomp)key(0,0,0,1.24,.76,land);else if(leap)key(0,0,0,1.2,.8,land);else if(crawl)key(0,0,0,1.12,.9,land);else key(0,0,0,1.16,.82,land);
  key(0,0,0,1,1,total);
  return frames;
 }
                                                                              
                                                                                
                                                                
 function swingFrames(){
  var total=attackMs(),hit=P.windupMs+P.jumpMs,back=hit+P.holdMs;
  function key(deg,ms,easing){var k={rotate:deg+'deg',offset:ms/total};if(easing)k.easing=easing;return k;}
  return [key(0,0,'ease-out'),key(P.swingRaiseDeg*.7,P.windupMs,'ease-out'),
   key(P.swingRaiseDeg,hit-P.swingStrikeMs,'cubic-bezier(.6,0,.95,.45)'),key(P.swingStrikeDeg,hit,'ease-out'),
   key(P.swingOvershootDeg,hit+P.holdMs*.5),key(P.swingStrikeDeg,back,'ease-in-out'),
   key(6,back+P.returnMs*.75,'ease-in-out'),key(0,total)];
 }
                                                                                    
                                                                                           
                                                                                           
                                                                                               
 function frameBox(fr){
  var s=Math.max(fr.fit.w,fr.fit.h),left=.5-(fr.fit.x+fr.fit.w/2)/s,top=.5-(fr.fit.y+fr.fit.h/2)/s;
  return {left:left,top:top,width:fr.cell.w/s,height:fr.cell.h/s,bodyX:left+fr.cell.w/2/s,feetY:top+fr.ground/s,perCell:1/s};
 }
                                                                                                  
                                                                                                   
                                                                                                        
 function frameContactMs(fr,budget){
  if(fr.slash&&fr.slash.zigzag)return frameZigzagTimes(fr,budget).contact;
  var t=0,s=fr.shot,end=s?shotFrom(fr):-1;
  for(var i=0;i<fr.attack.length&&(s?i<end:fr.attack[i][0]!==fr.contact);i++)t+=fr.attack[i][1];
  if(s)s.fly.forEach(function(f){t+=f[1];});
  return t;
 }
                                                                                                      
                                                                                                          
 function shotFrom(fr){
  var f=fr.shot.from;if(typeof f==='number')return f;
  for(var i=0;i<fr.attack.length;i++)if(fr.attack[i][0]===f)return i;
  return fr.attack.length;
 }
                                                                                              
                                                                                             
                                                                                              
                                                                                               
                                                                                                
                                                                                              
                                                                                                     
                                                                                                
                                                                                                   
 function frameLeap(fr,dx,dy,arc,scale,opts){
  if(fr.slash)return frameSlash(fr,dx,dy,scale,opts);
  if(fr.lash)return frameLash(fr,fr.lash.heads[0],scale);
  if(fr.shot)return frameSpit(fr,dx,scale);
  if(fr.attack.some(function(s){return s[2];}))return framePath(fr,dx,dy,arc);
  var steps=[],keys=[],t=0,lead=fr.lead||{},dist=Math.abs(dx),span=(fr.travel||0)*(scale||0);
                                                                                           
  function along(l){return span&&dist?Math.min(l*span,.85*dist)/dist:l;}
  function key(ms,u,lift){keys.push({ms:ms,x:r2(dx*u),y:r2(dy*u-(lift||0))});}
  function hop(seq,flip,from,to,lift){
   var up=false;
   seq.forEach(function(s){
    var l=lead[s[0]]||0;
    if(l>0&&l<1){
     if(!up){key(t,from);up=true;}
     key(t+s[1]/2,from+(to-from)*along(l),lift*Math.sin(Math.PI*l));
    }else if(up&&l>=1){key(t,to);up=false;}
    steps.push({at:t,name:s[0],flip:flip});t+=s[1];
   });
   key(t,to);
  }
  key(0,0);
  hop(fr.attack,false,0,1,arc||0);
  hop(fr.back,true,1,0,(arc||0)*.6);
  steps.push({at:t,name:fr.stance,flip:false});
  return {steps:steps,contactMs:frameContactMs(fr),totalMs:t,
   keyframes:keys.map(function(k){return {translate:k.x+'px '+k.y+'px',offset:t?k.ms/t:0};})};
 }
                                                                                                 
                                                                                             
                                                                                                
                                                                                                 
                                                                                           
 function framePath(fr,dx,dy,arc){
  var steps=[],keys=[],t=0;
  function key(ms,u,rise){keys.push({ms:ms,x:r2(dx*u),y:r2(dy*u-(arc||0)*(rise||0))});}
  fr.attack.concat(fr.back).forEach(function(s,i){
   var o=s[2]||{},back=i>=fr.attack.length;
   if(!back&&s[0]===fr.contact)key(t,1,0);
   else if(o.u!=null)key(t,o.u,o.rise);
   else if(!i)key(0,0,0);
   steps.push({at:t,name:s[0],flip:o.flip!=null?!!o.flip:back});t+=s[1];
  });
  key(t,0,0);
  steps.push({at:t,name:fr.stance,flip:false});
  return {steps:steps,contactMs:frameContactMs(fr),totalMs:t,
   keyframes:keys.map(function(k){return {translate:k.x+'px '+k.y+'px',offset:t?k.ms/t:0};})};
 }
                                                                                                      
                                                                                                      
                                                                                                      
                                                                                                      
                                                                                                    
                                                                                                      
                                                                                             
 function frameSlash(fr,dx,dy,scale,opts){
  if(fr.slash.zigzag)return frameZigzag(fr,dx,dy,scale,opts);
  var S=fr.slash,k=scale||1,dir=dx<0?-1:1,hit=frameContactMs(fr),wind=Math.min(S.windup,hit*.8),t=0,steps=[];
  var sx=dx-(S.hit.x-fr.cell.w/2)*k,sy=dy-(S.hit.y-fr.ground)*k;
  if(sx*dir<0)sx=0;
  fr.attack.concat(fr.back).forEach(function(s){steps.push({at:t,name:s[0],flip:false});t+=s[1];});
  steps.push({at:t,name:fr.stance,flip:false});
  var held=fr.attack.reduce(function(n,s){return n+s[1];},0);
  function key(ms,x,y,easing){var f={translate:r2(x)+'px '+r2(y)+'px',offset:t?ms/t:0};if(easing)f.easing=easing;return f;}
  return {steps:steps,contactMs:hit,totalMs:t,strike:{x:r2(sx),y:r2(sy)},
   keyframes:[key(0,0,0,'ease-out'),key(wind,-dir*S.lean*k,0,'cubic-bezier(.55,0,.9,.4)'),key(hit,sx,sy,'ease-out'),
    key(held,sx+dir*(S.follow||0)*k,sy,'ease-in-out'),key(t,0,0)]};
 }
                                                                                                                  
                                                                                                                  
                                                                                                                 
                                                                                                                  
                                                                                                                  
                                                                                                                  
                                                                                                                  
                                                                                                                 
                                                                                                                   
                                                                                                                    
                                                                                                                    
                        
 function frameZigzagCount(Z){return 1+Math.max(2,2*Math.round(((Z.zooms||3)-1)/2));}
 function frameZigzagTimes(fr,budget){
  var sum=function(n,s){return n+s[1];},unit=fr.attack.reduce(sum,0),hit=frameZigzagCount(fr.slash.zigzag)*unit,t=hit+fr.back.reduce(sum,0);
  var s=budget>0?Math.min(1,budget/t):1;
  return {scale:s,beat:fr.attack[0][1]*s,zoom:(unit-fr.attack[0][1])*s,stay:fr.back[0][1]*s,home:(t-hit-fr.back[0][1])*s,contact:hit*s,total:t*s};
 }
 function frameZigzag(fr,dx,dy,scale,opts){
  var S=fr.slash,Z=S.zigzag,o=opts||{},R=o.room,T=frameZigzagTimes(fr,o.budget),k=scale||1,dir=dx<0?-1:1,steps=[],keys=[],now=0;
  var still=fr.attack[0][0],run=fr.attack[fr.attack.length-1][0],homeRun=fr.back[fr.back.length-1][0],t=T.total;
  var sx=dx-(S.hit.x-fr.cell.w/2)*k,sy=dy-(S.hit.y-fr.ground)*k;
  if(sx*dir<0)sx=0;
  var A=Z.swing*k,lean=S.lean*k,n=frameZigzagCount(Z)-1,rows=Z.rows||[0,1];
                                                                                                       
  var pts=[[0,0]];
  for(var i=1;i<=n;i++){
   var u=(i-1)/(n-1),x=sx+(i%2?dir:-dir)*A,y=R?-R.up+(R.up+R.down)*(rows[0]+(rows[1]-rows[0])*u):sy+Z.depth*k*(u-.5);
   if(R)x=Math.max(-R.left,Math.min(R.right,x));
   pts.push([x,y]);
  }
  pts.push([sx,sy]);
  function key(ms,x,y,deg){keys.push({translate:r2(x)+'px '+r2(y)+'px',rotate:r2(deg)+'deg',offset:t?Math.min(1,ms/t):0});}
                                                                                                               
                                 
  var turns=[];
  function leg(a,b,beat,zoom,drawing,slide,push){
   var go=b[0]>a[0]?1:b[0]<a[0]?-1:0,lx=a[0]+(push||0)-go*(slide?0:lean);
   steps.push({at:now,name:still,flip:!slide&&go>0});
   key(now,a[0],a[1],0);now+=beat;key(now,lx,a[1],0);
   steps.push({at:now,name:slide?still:drawing,flip:!slide&&go>0});
   key(now+zoom/2,(lx+b[0])/2,(a[1]+b[1])/2,slide?0:go*Z.tilt);now+=zoom;key(now,b[0],b[1],0);
  }
  for(var m=1;m<pts.length;m++){leg(pts[m-1],pts[m],T.beat,T.zoom,run,false);if(m<pts.length-1)turns.push({at:Math.round(now),x:r2(pts[m][0]),y:r2(pts[m][1])});}
  leg([sx,sy],[0,0],T.stay,T.home,homeRun,Math.abs(sx)<=A/2,dir*(S.follow||0)*k);
  steps.push({at:t,name:fr.stance,flip:false});
  return {steps:steps,contactMs:T.contact,totalMs:t,strike:{x:r2(sx),y:r2(sy)},turns:turns,keyframes:keys};
 }
                                                                                                
                                                                                                
                                                                                                 
                                                                         
 function frameSpit(fr,dx,scale){
  var S=P.frameSpit,steps=[],t=0,at=0,dir=dx<0?-1:1,k=scale||1,from=shotFrom(fr);
  fr.attack.forEach(function(s,i){if(i===from)at=t;steps.push({at:t,name:s[0],flip:false});t+=s[1];});
  steps.push({at:t,name:fr.stance,flip:false});
  var lunge=Math.min(t,at+Math.min(90,(t-at)/3));
  var keys=[[0,0],[at,-dir*S.lean*k],[lunge,dir*S.lunge*k],[t,0]];
  return {steps:steps,contactMs:frameContactMs(fr),totalMs:t,shotAt:at,
   keyframes:keys.map(function(q){return {translate:r2(q[1])+'px 0px',offset:t?q[0]/t:0};})};
 }
                                                                                        
                                                                                             
                                                                                             
                                                                                           
 function frameShot(fr,vx,vy){
  var steps=[],keys=[],t=0;
  fr.shot.fly.forEach(function(f){steps.push({at:t,name:f[0]});keys.push([t,f[2]||0]);t+=f[1];});
  keys.push([t,1]);
  return {steps:steps,flightMs:t,angle:r2(Math.atan2(-vy,-vx)*180/Math.PI)||0,
   keyframes:keys.map(function(q){return {translate:r2(vx*q[1])+'px '+r2(vy*q[1])+'px',offset:t?q[0]/t:0};})};
 }
                                                                                             
                                                                                            
 function frameShotScale(fr,way,cellPx){
  var full=fr.shot.reach*cellPx;
  return full>0?Math.max(P.frameSpit.minScale,Math.min(1,way/full)):1;
 }
                                                                               
                                                                                                
                                                                                              
                                                                                                   
                                                                                                  
                                                                                                    
                                                                          
 function lashSpan(fr,name){var p=fr.lash.pieces[name];return p?p.cut-p.edge:0;}
                                                                                                  
 function lashBendRaw(fr,head,tx,ty){
  var name=head+fr.contact,p=fr.lash.pieces[name],span=lashSpan(fr,name);
  return {k:1-(tx-p.bite.x)/span,sy:(ty-p.bite.y)/span};
 }
 function lashBend(fr,head,tx,ty){
  var L=P.frameLash,b=lashBendRaw(fr,head,tx,ty);
  return {k:r2(Math.max(L.kMin,Math.min(L.kMax,b.k))),sy:b.sy};
 }
                                                                                                   
                                                    
 function lashPick(fr,tx,ty,last){
  var L=P.frameLash,heads=fr.lash.heads,next=heads[(heads.indexOf(last)+1)%heads.length];
  function fits(h){var k=lashBendRaw(fr,h,tx,ty).k,c=Math.max(L.kMin,Math.min(L.kMax,k));return Math.abs(k-c)*lashSpan(fr,h+fr.contact)<=L.missMax;}
  if(fits(next))return next;
  for(var i=0;i<heads.length;i++)if(heads[i]!==next&&fits(heads[i]))return heads[i];
  return next;
 }
                                                                                                  
                                                                            
 function lashPose(fr,name,bend,cssX,cssY){
  var p=fr.lash.pieces[name];if(!p)return null;
  var span=p.cut-p.edge;
  return {vine:'matrix('+bend.k+','+r2(-bend.sy*cssY/cssX*1e4)/1e4+',0,1,0,0)',
   dx:r2((1-bend.k)*span*cssX),dy:r2(bend.sy*span*cssY)};
 }
                                                                                                 
                                                       
 function frameLash(fr,head,scale){
  var L=P.frameLash,steps=[],t=0,coil=0,hit=frameContactMs(fr),k=scale||1;
  fr.attack.concat(fr.back).forEach(function(s,i){if(!i)coil=s[1];steps.push({at:t,name:head+s[0]});t+=s[1];});
  steps.push({at:t,name:fr.stance});
  var keys=[[0,0],[coil,L.lean*k],[hit,-L.lunge*k],[Math.min(t,hit+(t-hit)/2),0],[t,0]];
  return {steps:steps,contactMs:hit,totalMs:t,
   keyframes:keys.map(function(q){return {translate:r2(q[1])+'px 0px',offset:t?q[0]/t:0};})};
 }
                                                                        
                                                          
 function travelEase(p){p=Math.max(0,Math.min(1,p));return p<.5?2*p*p:1-2*(1-p)*(1-p);}
                                                                         
                                                                       
 function hopPose(t,dur){
  var rest={y:0,sx:1,sy:1,rot:0};
  if(!(dur>0)||t<0||t>=dur)return rest;
  var n=Math.max(1,Math.round(dur*1000/P.hopMs)),period=dur/n,u=(t%period)/period;
  if(u<.16){var c=Math.sin(Math.PI*u/.16);return {y:0,sx:r2(1+.12*c),sy:r2(1-.14*c),rot:0};}
  if(u>.9){var l=Math.sin(Math.PI*(u-.9)/.1);return {y:0,sx:r2(1+.1*l),sy:r2(1-.12*l),rot:0};}
  var a=(u-.16)/.74,lift=Math.sin(Math.PI*a);
  return {y:r2(P.hopPx*lift),sx:r2(1-.06*(1-a)*lift),sy:r2(1+.1*(1-a)*lift),rot:r2(8*Math.cos(Math.PI*a)*lift)};
 }
                                                                       
                                                                             
                                                                           
                                                           
 function cheerFrames(){
  var h=P.cheerPx,up='cubic-bezier(.2,.7,.4,1)',down='cubic-bezier(.6,0,.8,.4)';
  function k(offset,y,sx,sy,rot,easing){var f={offset:offset,translate:'0px '+r2(-y)+'px',scale:sx+' '+sy,rotate:rot+'deg'};if(easing)f.easing=easing;return f;}
  return [k(0,0,1,1,0),k(.07,0,1.16,.82,0,up),k(.24,h,.92,1.12,-9,down),k(.4,0,1.14,.86,0),k(.47,0,1,1,0),
   k(.53,0,1.1,.88,0,up),k(.68,h*.7,.94,1.08,8,down),k(.82,0,1.1,.9,0),k(.9,0,1,1,0),k(1,0,1,1,0)];
 }
                                                              
                                                                                                    
                                                                                                 
                                                                                                  
 function smooth(a){return a*a*(3-2*a);}
 function eio(a){return a<.5?2*a*a:1-2*(1-a)*(1-a);}
                                                                               
 function jit(k,n){var s=Math.sin((k+1)*12.9898+n*78.233)*43758.5453;return s-Math.floor(s);}
                                                                      
 function between(keys,u){
  for(var i=1;i<keys.length;i++){if(u>keys[i].at&&i<keys.length-1)continue;
   var a=keys[i-1],b=keys[i],w=b.at>a.at?smooth(Math.max(0,Math.min(1,(u-a.at)/(b.at-a.at)))):1,o={};
   for(var k in b)if(k!=='at')o[k]=a[k]+(b[k]-a[k])*w;return o;}
  return keys[0];
 }
                                                                                                     
                                                                                                      
                                                                                                     
                                                           
 function rollPose(t,dur,full){
  var R=P.gait.roll,rest={y:0,x:0,sx:1,sy:1,lean:0,spin:0};
  if(!(dur>0)||t<=0||t>=dur)return rest;
  var B=Math.max(1,Math.round(dur*1000/R.bounceMs)),d=dur/B,k=Math.min(B-1,Math.floor(t/d)),u=(t-k*d)/d;
  var per=360*Math.max(1,Math.round(B*R.turnsPerBounce))/B,L=full?0:Math.min(R.lastBounces,B-1),tail=Math.max(0,k-(B-1-L)),f=1-R.decay*tail/Math.max(1,L);
  if(u<R.sit){var c=Math.sin(Math.PI*u/R.sit),q=k===0?R.crouch:R.squash*f;
   return {y:0,x:0,sx:r3(1+q*c),sy:r3(1-q*c),lean:0,spin:r2(per*(k+R.sitTurn*u/R.sit))};}
  var a=(u-R.sit)/(1-R.sit),st=R.stretch*f*Math.pow(Math.sin(2*Math.PI*a),2);
  return {y:r3(R.height*f*Math.sin(Math.PI*a)),x:0,sx:r3(1-st),sy:r3(1+st),lean:0,spin:r2(per*(k+R.sitTurn+(1-R.sitTurn)*eio(a)))};
 }
                                                                                                     
                                                                                                     
                                                                                                    
                                                                                               
                                             
 function stompPose(t,dur){
  var S=P.gait.stomp,rest={y:0,x:0,sx:1,sy:1,lean:0,spin:0,swing:0,fling:0};
  if(!(dur>0)||t<=0||t>=dur)return rest;
  var stopS=Math.min(S.stopMs/1000,dur*.4),walk=dur-stopS,N=Math.max(1,Math.round(walk*1000/S.strideMs)),D=walk/N;
  function stride(k){var side=k%2?-1:1;return {A:S.sway*side*(.85+.3*jit(k,1)),X:S.shift*side,lift:S.lift*(.75+.5*jit(k,2)),q:S.squash*(.85+.3*jit(k,3))};}
  if(t<walk){
   var k=Math.min(N-1,Math.floor(t/D)),u=(t-k*D)/D,s=stride(k),p=k?stride(k-1):null,A0=p?p.A*.9:0,X0=p?p.X*.9:0,e0=p?[1.02,.98]:[1,1];
   var o=between([{at:0,lean:A0,x:X0,sx:e0[0],sy:e0[1],y:0},{at:.22,lean:A0*.45,x:X0*.45,sx:1.04,sy:.96,y:0},{at:.48,lean:s.A*.55,x:s.X*.4,sx:.95,sy:1.06,y:s.lift},
    {at:.74,lean:s.A,x:s.X,sx:1+s.q,sy:1-s.q,y:0},{at:.87,lean:s.A*1.05,x:s.X,sx:.98,sy:1.02,y:s.lift*.12},{at:1,lean:s.A*.9,x:s.X*.9,sx:1.02,sy:.98,y:0}],u);
   var ph=k+u;
   return {y:r3(o.y),x:r3(o.x),sx:r3(o.sx),sy:r3(o.sy),lean:r2(o.lean),spin:0,swing:r3(Math.sin(Math.PI*(ph-.24))*Math.min(1,ph/.5)),fling:0};
  }
  var v=(t-walk)/stopS,last=stride(N-1),T=S.stopTip,h=S.stopLift;
  var o2=between([{at:0,lean:last.A*.9,x:last.X*.9,sx:1.02,sy:.98,y:0,fl:0},{at:.2,lean:T,x:.06,sx:.96,sy:1.05,y:h,fl:1.35},{at:.34,lean:T*.5,x:.07,sx:1.12,sy:.88,y:0,fl:1.1},
   {at:.52,lean:-T*.5,x:-.02,sx:.97,sy:1.03,y:h*.3,fl:-.25},{at:.68,lean:T*.28,x:.01,sx:1.05,sy:.95,y:0,fl:.17},{at:.82,lean:-T*.12,x:0,sx:.99,sy:1.01,y:0,fl:0},
   {at:.92,lean:T*.04,x:0,sx:1.01,sy:.99,y:0,fl:0},{at:1,lean:0,x:0,sx:1,sy:1,y:0,fl:0}],v);
  return {y:r3(o2.y),x:r3(o2.x),sx:r3(o2.sx),sy:r3(o2.sy),lean:r2(o2.lean),spin:0,swing:r3(Math.sin(Math.PI*(N-.24))*Math.max(0,1-v/.22)),fling:r3(o2.fl)};
 }
                                                                                                     
                                                                                                    
                                                   
 function leapPose(t,dur){
  var L=P.gait.leap,rest={y:0,x:0,sx:1,sy:1,lean:0,spin:0};
  if(!(dur>0)||t<=0||t>=dur)return rest;
  var n=Math.max(1,Math.round(dur*1000/L.leapMs)),d=dur/n,k=Math.min(n-1,Math.floor(t/d)),u=(t-k*d)/d;
  var g=L.gather,ld=1-L.land,q=L.squash,st=L.stretch,tl=L.tilt,h=L.height*(.9+.2*jit(k,5));
  if(u<g){var c=Math.sin(Math.PI*u/g);return {y:0,x:0,sx:r3(1+q*c),sy:r3(1-q*c),lean:r2(-tl*smooth(u/g)),spin:0};}
  if(u<ld){var a=(u-g)/(ld-g),o=between([{at:0,sx:1,sy:1},{at:.15,sx:1-st*.6,sy:1+st},{at:.5,sx:1+st*.55,sy:1-st*.4},{at:.85,sx:1-st*.25,sy:1+st*.3},{at:1,sx:1,sy:1}],a);
   return {y:r3(h*Math.sin(Math.PI*a)),x:0,sx:r3(o.sx),sy:r3(o.sy),lean:r2(-tl*Math.cos(Math.PI*a)),spin:0};}
  var v=(u-ld)/(1-ld),c2=Math.sin(Math.PI*v);
  return {y:0,x:0,sx:r3(1+q*c2),sy:r3(1-q*c2),lean:r2(tl*(1-smooth(v))),spin:0};
 }
                                                                                                       
                                                                                                      
                                                                                                 
                                                                                                         
                                                                                  
 function waddlePose(t,dur){
  var W=P.gait.waddle,rest={y:0,x:0,sx:1,sy:1,lean:0,spin:0,legs:{l:0,r:0},arms:{l:0,r:0}};
  if(!(dur>0)||t<=0||t>=dur)return rest;
  var stopS=Math.min(W.settleMs/1000,dur*.35),walk=dur-stopS,N=Math.max(2,Math.round(walk*1000/W.stepMs)),D=walk/N;
  function rk(k){return W.rock*(k%2?-1:1)*(.85+.3*jit(k,4));}
  if(t<walk){
   var k=Math.min(N-1,Math.floor(t/D)),u=(t-k*D)/D,R=rk(k),R0=k?rk(k-1)*.95:0;
   var o=between([{at:0,lean:R0,y:0,sx:1,sy:1},{at:.45,lean:R*.2,y:W.lift,sx:.98,sy:1.03},{at:.8,lean:R,y:0,sx:1+W.squash,sy:1-W.squash},{at:1,lean:R*.95,y:0,sx:1,sy:1}],u);
   var lift=u<.45?smooth(u/.45):u<.8?1-smooth((u-.45)/.35):0,step=k%2?'r':'l',a=Math.min(1,(k+u)/.6),legs={l:0,r:0};
   legs[step]=r3(lift);
   var hi=1+.3*lift,lo=1-.25*lift;
   return {y:r3(o.y),x:0,sx:r3(o.sx),sy:r3(o.sy),lean:r2(o.lean),spin:0,legs:legs,arms:{l:r2(W.armOut*a*(step==='l'?hi:lo)),r:r2(-W.armOut*a*(step==='r'?hi:lo))}};
  }
  var v=(t-walk)/stopS,last=rk(N-1)*.95;
  var o2=between([{at:0,lean:last,sx:1,sy:1,a:1},{at:.38,lean:-last*.55,sx:1.02,sy:.98,a:.6},{at:.7,lean:last*.22,sx:1,sy:1,a:.25},{at:1,lean:0,sx:1,sy:1,a:0}],v);
  return {y:0,x:0,sx:r3(o2.sx),sy:r3(o2.sy),lean:r2(o2.lean),spin:0,legs:{l:0,r:0},arms:{l:r2(W.armOut*o2.a),r:r2(-W.armOut*o2.a)}};
 }
                                                                                                                    
                                                                                                                     
 function crawlPose(t,dur){
  var C=P.gait.crawl,rest={y:0,x:0,sx:1,sy:1,lean:0,spin:0};
  if(!(dur>0)||t<=0||t>=dur)return rest;
  var n=Math.max(1,Math.round(dur*1000/C.surgeMs)),d=dur/n,k=Math.min(n-1,Math.floor(t/d)),u=(t-k*d)/d,st=C.stretch*(.85+.3*jit(k,6)),g=C.gather*(.85+.3*jit(k,7));
  var o=between([{at:0,sx:1,sy:1,x:0,lean:0},{at:.45,sx:1+st,sy:1-st*.7,x:C.reach,lean:C.lean},{at:.8,sx:1-g,sy:1+g,x:-C.reach*.4,lean:-C.lean*.3},{at:1,sx:1,sy:1,x:0,lean:0}],u);
  return {y:0,x:r3(o.x),sx:r3(o.sx),sy:r3(o.sy),lean:r2(o.lean),spin:0};
 }
                                                                                                        
 function marchPose(gait,t,dur,flop){
  return gait==='roll'?rollPose(t,dur,flop):gait==='leap'?leapPose(t,dur):gait==='waddle'?waddlePose(t,dur):gait==='crawl'?crawlPose(t,dur):stompPose(t,dur);
 }
                                                                                                    
                                                                                                       
                                                                                                     
                                                          
 function stackStyle(pose,frame){
  var G=P.gait,size=frame*G.size,sy=pose.sy==null?1:pose.sy,c=frame*G.rollCentre*sy,sp=-(pose.spin||0)*Math.PI/180;
  var tx=-(pose.x||0)*size-c*Math.sin(sp),ty=-(pose.y||0)*size-c+c*Math.cos(sp);
  return {translate:r2(tx)+'px '+r2(ty)+'px',rotate:r2(-((pose.lean||0)+(pose.spin||0)))+'deg',scale:r3(pose.sx==null?1:pose.sx)+' '+r3(sy)};
 }
 function stackKey(offset,pose,frame,easing){var s=stackStyle(pose,frame),k={offset:r3(offset),translate:s.translate,rotate:s.rotate,scale:s.scale};if(easing)k.easing=easing;return k;}
                                                                                                   
                                                                                                       
                                                                                                       
                                                                                                     
                                         
 function leapStackFrames(gait,frame){
  var total=attackMs(),hit=P.windupMs+P.jumpMs,back=hit+P.holdMs,land=back+P.returnMs,G=P.gait,frames=[];
  if(gait==='roll'){
   var R=G.roll,n=48;
   for(var i=0;i<=n;i++){var m=total*i/n,s;
    if(m<=P.windupMs)s=0;
    else if(m<=hit)s=360*R.leapTurns*eio((m-P.windupMs)/P.jumpMs);
    else if(m<=back)s=360*R.leapTurns;
    else if(m<=land)s=360*(R.leapTurns-R.returnTurns*eio((m-back)/P.returnMs));
    else s=360*(R.leapTurns-R.returnTurns)-R.rockDeg*Math.sin(Math.PI*(m-land)/(total-land));
    frames.push(stackKey(i/n,{spin:s},frame));}
   return {frames:frames,ms:total};
  }
  if(gait==='waddle'){
                                                                                                      
                               
   var W=G.waddle,wm=total+W.settleMs,R=W.rockDeg;
   [[0,0],[P.windupMs*.35,-R],[P.windupMs*.75,R],[P.windupMs,-R*.4],[hit,R*.7],[back,0],[back+P.returnMs*.5,-R],[land,R*.7],
    [land+W.settleMs*.4,-R*.4],[land+W.settleMs*.75,R*.15],[wm,0]].forEach(function(p){frames.push(stackKey(p[0]/wm,{lean:p[1]},frame,'ease-in-out'));});
   return {frames:frames,ms:wm};
  }
  if(gait==='stomp'){
   var S=G.stomp,ms=total+S.landMs,T=S.landTip;
   [[0,0],[P.windupMs,-6],[P.windupMs+P.jumpMs*.5,10],[hit,4],[back,2],[back+P.returnMs*.45,-12],[land,-4],
    [land+S.landMs*.3,T],[land+S.landMs*.55,-T*.45],[land+S.landMs*.78,T*.18],[ms,0]].forEach(function(p){frames.push(stackKey(p[0]/ms,{lean:p[1]},frame,'ease-in-out'));});
   return {frames:frames,ms:ms};
  }
  return null;
 }
                                                                                                      
                                                                                                      
                                      
 function cheerStackFrames(gait,frame){
  if(gait==='waddle'){
   return [[0,0],[.12,-10],[.24,10],[.36,-8],[.47,0],[.56,8],[.68,-8],[.8,6],[.9,0],[1,0]].map(function(p){return stackKey(p[0],{lean:p[1]},frame,'ease-in-out');});
  }
  if(gait==='crawl'){                                   
   return [[0,1,1],[.12,1.12,.9],[.24,.92,1.1],[.36,1.06,.95],[.47,1,1],[.56,1.1,.92],[.68,.94,1.07],[.8,1.03,.98],[.9,1,1],[1,1,1]].map(function(p){return stackKey(p[0],{sx:p[1],sy:p[2]},frame,'ease-in-out');});
  }
  if(gait!=='roll'&&gait!=='leap')return null;
  var dir=gait==='leap'?-1:1,F=gait==='leap'?P.gait.leap.cheerFlip:P.gait.roll.cheerFlip,frames=[stackKey(0,{spin:0},frame)],n=20;
  for(var i=0;i<=n;i++)frames.push(stackKey(F[0]+(F[1]-F[0])*i/n,{spin:dir*360*eio(i/n)},frame));
  frames.push(stackKey(1,{spin:dir*360},frame));
  return frames;
 }
                                                                           
                                                                           
                                                   
 function boneFrames(rand,groundDy){
  var dir=rand()<.5?-1:1,vx=dir*(14+rand()*34),up=26+rand()*30,spin=dir*(140+rand()*220),r0=rand()*360;
  var gy=Math.max(8,groundDy),hop=up*.32,vx2=vx*.45,frames=[],T=P.boneMs;
  function key(x,y,rot,ms,op){frames.push({transform:'translate('+r2(x)+'px,'+r2(y)+'px) rotate('+r2(rot)+'deg)',opacity:op==null?1:op,offset:ms/T});}
  key(0,0,r0,0,0);
  for(var i=1;i<=6;i++){var t=i/6;key(vx*t,-up*4*t*(1-t)+gy*t*t,r0+spin*t,t*430);}
  for(var j=1;j<=4;j++){var v=j/4;key(vx+vx2*v,gy-hop*4*v*(1-v),r0+spin+spin*.3*v,430+v*220);}
  key(vx+vx2,gy,r0+spin*1.3,1100);
  key(vx+vx2,gy,r0+spin*1.3,T,0);
  return frames;
 }
                                                            
                                                                         
                                                                        
 function addTrauma(t,amount){return Math.min(1,Math.max(t||0,amount)+amount*.15);}
 function decayTrauma(t,dtS){return Math.max(0,(t||0)-P.shakeDecayPerS*Math.max(0,dtS));}
                                                                        
 function wobble(t,k){return .5*Math.sin(t*6.283+k*1.7)+.3*Math.sin(t*14.45+k*4.1)+.2*Math.sin(t*29.53+k*2.9);}
                                                                          
                                                                            
 function shakeOffset(trauma,t,width){
  var s=Math.max(0,Math.min(1,trauma||0)),m=P.shakeMaxPx*s*s,f=t*P.shakeHz;
  return {x:r2(m*wobble(f,1)),y:r2(m*wobble(f,7)),zoom:1+(width?2*m/width:0)};
 }
                                                                      
 function frogHitTrauma(frac,died){
  if(died)return P.traumaFrogDeath;
  return P.traumaFrogHit+(P.traumaFrogHitMax-P.traumaFrogHit)*Math.max(0,Math.min(1,(frac||0)/.3));
 }
                                                                                              
                                                                                            
                                                                                            
           
 function blowFrom(fr,vx,vy){
  var sign=vx>0?1:-1;
  if(fr&&!fr.slash&&(!fr.shot||fr.shot.drop))return {kind:'top',sign:sign};
  var down=Math.atan2(vy||0,Math.abs(vx||0))*180/Math.PI;
  return {kind:down>=P.squish.topDeg?'top':'side',sign:sign};
 }
                                                                        
 function squishAmp(frac,died,reduced){
  var S=P.squish,a=died?S.ampDeath:S.ampMin+(S.ampMax-S.ampMin)*Math.max(0,Math.min(1,(frac||0)/S.heavyFrac));
  return r2(reduced?a*S.reducedAmp:a);
 }
                                                                                       
                                                                                            
                                                                     
 function squishFrames(blow,amp){
  var S=P.squish,a=amp==null?1:amp,top=!!blow&&blow.kind==='top',sg=blow&&blow.sign>0?1:-1,sp=top?S.top:S.side;
  var push=-sp[0]/2*S.body+S.knock;                                                                    
  function tint(k){                                                                  
   var w=Math.max(0,1-k/.12),red=k<.07?0:Math.min(1,Math.max(0,1-(k-.16)/.46));
   return 'brightness('+r2(1+2*w+.6*red)+') sepia('+r2(.9*red)+') saturate('+r2(Math.max(0,1-w)+3*red)+') hue-rotate('+r2(-40*red)+'deg)';
  }
  return S.spring.map(function(k,i){
   var f=k[1]*a,o={offset:k[0],scale:r2(1+sp[0]*f)+' '+r2(1+sp[1]*f),filter:tint(k[0])};
   if(top)o.translate='0% '+r2(Math.min(0,f)*S.hop*100)+'%';
   else{o.translate=r2(sg*f*push*100)+'% 0%';o.rotate=r2(sg*f*S.lean)+'deg';}
   if(i<S.spring.length-1)o.easing=i===0?'cubic-bezier(.2,.9,.3,1)':i===1?'ease-out':'ease-in-out';
   return o;
  });
 }
                                                                                              
                                                                                                
                                                        
 function foeHurtTint(k){
  var H=P.foeHurt,s=Math.max(0,Math.min(1,k==null?1:k));
  function key(t,rim){
   return 'brightness('+r2(1-(1-H.dim)*t)+') sepia('+r2(H.sepia*t)+') saturate('+r2(1+(H.saturate-1)*t)+') hue-rotate('+r2(H.hue*t)+'deg) brightness('+r2(1+(H.lift-1)*t)+
    ') drop-shadow(0 0 '+r2(H.rim*rim)+'px rgba(255,255,255,'+r2(.95*rim)+'))';
  }
  return [{offset:0,filter:key(s,s)},{offset:.12,filter:key(s,s*.35)},{offset:.3,filter:key(s*.9,0)},{offset:1,filter:key(0,0)}];
 }
                                                                                                 
                                                                                             
 function foeHurtMotion(amp){
  var H=P.foeHurt,a=amp==null?1:amp,sh=H.shudder;
                                                                               
  var beats=[[0,0,0,[0,0],0],[.09,1,0,H.squash,1],[.24,.8,sh[0],H.stretch,.6],[.38,.55,sh[1],[.03,-.03],-.25],
   [.52,.32,sh[2],[-.012,.012],.15],[.67,.14,sh[3],[0,0],-.05],[.82,.04,0,[0,0],0],[1,0,0,[0,0],0]];
  return beats.map(function(b,i){
   var o={offset:b[0],scale:r3(1+b[3][0]*a)+' '+r3(1+b[3][1]*a),translate:r2((b[1]*H.knock+b[2])*a*100)+'% 0%',rotate:r2(b[4]*H.lean*a)+'deg'};
   if(i<beats.length-1)o.easing=i===0?'cubic-bezier(.2,.9,.3,1)':'ease-in-out';
   return o;
  });
 }
                                                                                       
 function foeHurtAmp(blow,tierName,died,crit,reduced){
  var H=P.foeHurt,a=(H[blow]==null?1:H[blow])*(died?H.kill:1)*(crit?H.crit:1)*(H.weight[tierName]||1);
  return r2(reduced?a*H.reducedAmp:a);
 }
                                                                             
 function critLevel(hp,maxHp){
  if(!(maxHp>0)||hp<=0)return 0;
  var f=hp/maxHp,n=0;P.critHpFrac.forEach(function(c){if(f<=c)n++;});return n;
 }
                                                                        
                                                          
 function dangerLevel(partyFrac){
  return r2(Math.max(0,Math.min(1,(P.dangerPartyFrac-Math.max(0,partyFrac||0))/P.dangerPartyFrac)));
 }
                                                                          
                                       
 function frogDeathFrames(){
  return [
   {transform:'translate(0,0) rotate(0deg) scale(1,1)',filter:'brightness(3) saturate(0)',opacity:1},
   {transform:'translate(-6px,4px) rotate(0deg) scale(1.22,.78)',filter:'brightness(3) saturate(0)',opacity:1,offset:.09},
   {transform:'translate(-34px,-58px) rotate(-150deg) scale(.95,1.05)',filter:'brightness(1.3) sepia(1) saturate(6) hue-rotate(-50deg)',opacity:1,offset:.38},
   {transform:'translate(-62px,-40px) rotate(-300deg) scale(.8,.8)',filter:'brightness(.8) sepia(1) saturate(4) hue-rotate(-50deg)',opacity:.85,offset:.7},
   {transform:'translate(-80px,6px) rotate(-400deg) scale(.55,.55)',filter:'brightness(.6) sepia(1) saturate(3) hue-rotate(-50deg)',opacity:0}
  ];
 }
                                                                           
                                                                 
 function sparkFrames(i,n,rand,dir,dist){
  var a=(i+rand()*.6)/n*Math.PI*2,dx=Math.cos(a),dy=Math.sin(a)-.35;
  if(dir)dx=Math.abs(dx)*dir*.8+dir*.4;
  var d=dist*(.55+rand()*.6);
  return [{transform:'translate(0,0) scale(1)',opacity:1},{transform:'translate('+r2(dx*d*.7)+'px,'+r2(dy*d*.7)+'px) scale(.9)',opacity:1,offset:.45},
   {transform:'translate('+r2(dx*d)+'px,'+r2(dy*d+d*.25)+'px) scale(.2)',opacity:0}];
 }
                                                                                  
                                                                                 
 function orbCount(tierKey,targets,live,reduced){
  var t=P.orbs.tiers[tierKey];if(!t)return 0;
  var n=Math.max(P.orbs.minPerTarget,Math.round(t.count/Math.sqrt(Math.max(1,targets||1))));
  if(reduced)n=Math.min(n,P.orbs.reducedCount);
  return Math.max(1,Math.min(n,P.orbs.budget-(live||0)));
 }
                                                                              
                                                                         
                                                                         
                                                                               
                                                                          
                                                                      
 function orbVolley(tierKey,n,dx,dy,contact,rand,jx,jy){
  var t=P.orbs.tiers[tierKey],O=P.orbs,out=[];
  if(!t||!(n>0))return out;
  var mirror=tierKey==='extreme';
  for(var i=0;i<n;i++){
   var u=n>1?i/(n-1):.5;
                                                                                    
   var side=mirror?(i%2?1:-1):1,mag=mirror?(.3+.7*(n>2?Math.floor(i/2)/Math.max(1,Math.ceil(n/2)-1):1)):(2*u-1);
   var phi=t.spreadDeg*Math.PI/180*side*mag;
   var ex=dx+(rand()*2-1)*jx,ey=dy+(rand()*2-1)*jy;
   var cx=(ex*Math.cos(phi)-ey*Math.sin(phi))*.55,cy=(ex*Math.sin(phi)+ey*Math.cos(phi))*.55;
   var len=Math.sqrt(ex*ex+ey*ey)||1,nx=-ey/len,ny=ex/len,phase=rand()*Math.PI*2;
   var delay=t.sprayMs*u,arrive=contact-O.arriveSpreadMs+O.arriveSpreadMs*1.15*u;
   var flight=Math.max(O.minFlightMs,arrive-delay),dur=flight+O.popMs,hitAt=flight/dur;
   var kf=[{transform:'translate(0px,0px) scale(.35)',opacity:0,offset:0}];
   for(var k=1;k<=8;k++){
    var s=k/8,e=Math.pow(s,1.12),a=2*(1-e)*e,b=e*e;                                                            
    var w=t.wobblePx*Math.sin(phase+s*Math.PI*4)*(1-s);
    kf.push({transform:'translate('+r2(a*cx+b*ex+nx*w)+'px,'+r2(a*cy+b*ey+ny*w)+'px) scale('+(s<.2?r2(.6+s*2):1)+')',opacity:s<.15?r2(.4+s*4):1,offset:r2(hitAt*s)});
   }
   kf.push({transform:'translate('+r2(ex)+'px,'+r2(ey)+'px) scale(1.9)',opacity:0,offset:1});
   out.push({delay:Math.round(delay),duration:Math.round(dur),keyframes:kf});
  }
  return out;
 }
                                      
                                                                                             
                                                                                                                     
                                                                                                                       
                                                   
 function harvestBox(width,height,band,scale){
  var H=P.harvest,g=ground(width,height,undefined,band),w=Math.round(H.flowerPx*unitScale(width)*(scale||1)),h=Math.round(w*H.aspect);
  var cx=Math.min((g.enemy.left+g.enemy.right)/2,width-4-w/2),footY=g.top+(g.bottom-g.top)*H.footBand;
  return {left:r2(cx-w/2),top:r2(footY-h),width:w,height:h,cx:r2(cx),footY:r2(footY)};
 }
                                                                                           
                                                                                  
 function harvestSeat(i){
  var S=P.harvest.seats,s=S[i%S.length],lap=Math.floor(i/S.length);
  return lap?[r2(Math.min(.9,Math.max(.1,s[0]+(lap%2?.07:-.07)*lap))),r2(Math.min(.8,s[1]+.04*lap))]:s.slice();
 }
 function key3(frames,x,y,sx,sy,off){frames.push({transform:'translate('+r2(x)+'px,'+r2(y)+'px) scale('+sx+','+sy+')',offset:r2(off)});}
                                                                                           
                                                                                         
 function perchFrames(dx,dy,scale){
  var f=[],h=P.harvest.perchArc/(scale||1);
  key3(f,0,0,1,1,0);key3(f,0,0,1.18,.78,.16);
  for(var i=1;i<=10;i++){var t=i/10,a=arc(dx,dy,h,t),st=i<3?[.86,1.18]:i>8?[.94,1.08]:[1,1];key3(f,a[0],a[1],st[0],st[1],.16+.62*t);}
  key3(f,dx,dy,1.24,.74,.86);key3(f,dx,dy,.94,1.07,.93);key3(f,dx,dy,1,1,1);
  return f;
 }
                                                                                           
                                                  
 function flingFrames(dx,dy,scale){
  var f=[],h=P.harvest.flingArc/(scale||1);
  key3(f,dx,dy,1.2,.8,0);key3(f,dx,dy,.84,1.22,.08);
  for(var i=1;i<=10;i++){var t=i/10,a=arc(-dx,-dy,h,t);key3(f,dx+a[0],dy+a[1],i<4?.9:1,i<4?1.12:1,.08+.72*t);}
  key3(f,0,0,1.26,.72,.86);key3(f,0,0,.95,1.06,.94);key3(f,0,0,1,1,1);
  return f;
 }
                                                                                       
                                                                                    
 function flipFrames(dir,from,to){
  return [{rotate:'0deg',offset:0},{rotate:'0deg',offset:from,easing:'cubic-bezier(.3,0,.5,1)'},{rotate:(360*(dir||1))+'deg',offset:to},{rotate:(360*(dir||1))+'deg',offset:1}];
 }
                                                                                            
                                     
 function perchBounceFrames(){
  var px=P.harvest.bouncePx;
  return [{translate:'0px 0px',scale:'1 1'},{translate:'0px 0px',scale:'1.08 .9',offset:.14},{translate:'0px '+(-px)+'px',scale:'.95 1.06',offset:.45},
   {translate:'0px 0px',scale:'1.07 .92',offset:.78},{translate:'0px 0px',scale:'1 1'}];
 }
                                                                                            
                                                            
 function petalFrames(rand,dist){
  var a=-Math.PI/2+(rand()*2-1)*Math.PI*.85,d=dist*(.45+rand()*.7),x1=Math.cos(a)*d,y1=Math.sin(a)*d*.85;
  var fall=dist*(.7+rand()*.8),sway=12+rand()*20,spin=(rand()<.5?-1:1)*(160+rand()*260),r0=rand()*360,f=[];
  f.push({transform:'translate(0px,0px) rotate('+r2(r0)+'deg) scale(.4)',opacity:0,offset:0});
  f.push({transform:'translate('+r2(x1*.7)+'px,'+r2(y1*.7)+'px) rotate('+r2(r0+spin*.25)+'deg) scale(1.1)',opacity:1,offset:.12});
  f.push({transform:'translate('+r2(x1)+'px,'+r2(y1)+'px) rotate('+r2(r0+spin*.4)+'deg) scale(1)',opacity:1,offset:.28});
  for(var i=1;i<=4;i++){var t=i/4;f.push({transform:'translate('+r2(x1+sway*Math.sin(t*Math.PI*2.2)*(i%2?1:-1))+'px,'+r2(y1+fall*t)+'px) rotate('+r2(r0+spin*(.4+.6*t))+'deg) scale('+r2(1-.25*t)+')',opacity:i<4?1:0,offset:r2(.28+.72*t)});}
  return f;
 }
                                    
                                                                                            
                                                                     
 function webBox(width,height){
  var W=P.rescue,g=ground(width,height),w=Math.round(Math.min(W.webPx*unitScale(width),width*W.maxW)),h=Math.round(w*W.aspect);
  var cx=width/2,footY=g.top+(g.bottom-g.top)*W.backBand;
  return {left:r2(cx-w/2),top:r2(footY-h*W.footFy),width:w,height:h,cx:r2(cx),footY:r2(footY)};
 }
                                                                                                 
                                                                                                  
                                     
 function webSpots(n,prizes){
  var at=prizes||[],R=P.rescue;
  var S=R.spots.filter(function(s){return at.length<2||at.every(function(p){return Math.hypot(s[0]-p[0],s[1]-p[1])>=R.prizeClear;});});
  S=S.slice(0,Math.max(0,n-(at.length?0:1)));
  if(!at.length&&n>0)S.push(R.hub.slice());
  return S;
 }
                                                                                      
                            
 function tadsFree(n,progress,taps){
  if(progress>=taps)return n;
  return Math.max(0,Math.min(n-1,Math.floor(progress/Math.max(1,taps)*n)));
 }
                                                                                       
                                                    
 function pullFrames(dx,dy,scale){
  var R=P.rescue,f=[],h=60/(scale||1),hit=R.pullHitMs/R.pullMs;
  key3(f,0,0,1,1,0);key3(f,0,0,1.16,.82,.12);
  for(var i=1;i<=6;i++){var t=i/6,a=arc(dx,dy,h,t);key3(f,a[0],a[1],i<3?.9:1,i<3?1.12:1,.12+(hit-.12)*t);}
  key3(f,dx,dy,.84,1.14,hit+.04);key3(f,dx*.86,dy*.86+6,1.14,.86,hit+.16);key3(f,dx*.9,dy*.9,1,1,hit+.24);
  for(var j=1;j<=5;j++){var v=j/5,b=arc(-dx*.9,-dy*.9,h*.7,v);key3(f,dx*.9+b[0],dy*.9+b[1],1,1,hit+.24+(.92-hit-.24)*v);}
  key3(f,0,0,1.14,.86,.95);key3(f,0,0,1,1,1);
  return f;
 }
                                                                                     
                                
 function dropFrames(dy){
  return [{transform:'translate(0px,0px) scale(1,1) rotate(0deg)',offset:0},{transform:'translate(0px,-14px) scale(.92,1.1) rotate(-6deg)',offset:.18},
   {transform:'translate(0px,'+r2(dy*.55)+'px) scale(.95,1.08) rotate(4deg)',offset:.55},{transform:'translate(0px,'+r2(dy)+'px) scale(1.28,.72) rotate(0deg)',offset:.78},
   {transform:'translate(0px,'+r2(dy)+'px) scale(.94,1.07) rotate(0deg)',offset:.9},{transform:'translate(0px,'+r2(dy)+'px) scale(1,1) rotate(0deg)',offset:1}];
 }
                                                                     
 function homeFrames(dx,dy){
  var f=[{transform:'translate(0px,'+r2(dy)+'px) scale(1,1)',offset:0}];
  for(var i=1;i<=3;i++){var x0=dx*(i-1)/3,x1=dx*i/3;f.push({transform:'translate('+r2(x0)+'px,'+r2(dy)+'px) scale(1.14,.86)',offset:r2((i-1)/3+.02)});
   f.push({transform:'translate('+r2((x0+x1)/2)+'px,'+r2(dy-46)+'px) scale(.92,1.1)',offset:r2((i-.5)/3)});f.push({transform:'translate('+r2(x1)+'px,'+r2(dy)+'px) scale(1.1,.9)',offset:r2(i/3)});}
  return f;
 }
                                                                                       
                                                               
 function seedTokenFrames(ax,ay,tx,ty){
  return [{transform:'translate(0px,0px) scale(.2) rotate(0deg)',opacity:0,offset:0},
   {transform:'translate('+r2(ax*.55)+'px,'+r2(ay*.8)+'px) scale(1.35) rotate(-12deg)',opacity:1,offset:.16,easing:'cubic-bezier(.2,.7,.4,1)'},
   {transform:'translate('+r2(ax)+'px,'+r2(ay)+'px) scale(1) rotate(8deg)',opacity:1,offset:.36},
   {transform:'translate('+r2(ax)+'px,'+r2(ay-10)+'px) scale(1.12) rotate(-6deg)',opacity:1,offset:.52,easing:'cubic-bezier(.5,0,.8,.3)'},
   {transform:'translate('+r2((ax+tx)/2)+'px,'+r2(Math.min(ay,ty)-30)+'px) scale(.9) rotate(180deg)',opacity:1,offset:.78},
   {transform:'translate('+r2(tx)+'px,'+r2(ty)+'px) scale(.45) rotate(360deg)',opacity:.9,offset:1}];
 }
                                   
 function shuffled(list,rng){var a=list.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(rng()*(i+1)),t=a[i];a[i]=a[j];a[j]=t;}return a;}
                                                                                                     
                                                                                                        
                                                                                                         
                                                                                                  
                                                                                                               
                                                                                                         
                                                                    
 function rockLayout(width,height,count,seed,opt){
  var R=P.rocks,rng=layoutRng(seed),scale=width/1400,top=height*.54,unit=unitScale(width);
  var back=shuffled(R.back,rng),front=shuffled(R.front.filter(function(sl){return !(opt&&opt.giant)||sl.x<=R.giantFrontMaxX;}),rng),frontFirst=rng()<.5,slots=[];
  for(var i=0;slots.length<count&&(back.length||front.length);i++){
   var wantFront=(i%2===0)===frontFirst,list=wantFront?(front.length?front:back):(back.length?back:front);
   slots.push({slot:list.shift(),front:list===front});
  }
  var art=rockSet(opt&&opt.set).art,arts=shuffled(art.map(function(a,i){return i;}),rng);
  var clear=Math.max(R.bottomClearPx,(opt&&opt.bottomClear)||0);
  return slots.map(function(sl){
   var k=0;if(sl.front)for(k=0;k<arts.length&&art[arts[k]][1]>art[arts[k]][0];k++);
   if(k>=arts.length)k=0;
   var ai=arts.splice(k,1)[0],a=art[ai],size=R.px*unit*sl.slot.s,w=a[0]>=a[1]?size:size*a[0]/a[1],h=w*a[1]/a[0];
   var footY=Math.min(top+sl.slot.a*scale,height-clear-h*(1-R.footFy));
                                                                                                   
   var z=sl.front?Math.max(depth(footY),depth(ground(width,height).bottom)+1):depth(footY);
   return {art:ai,left:width*sl.slot.x-w/2,top:footY-h*R.footFy,width:w,height:h,footY:footY,z:z,front:sl.front};
  });
 }
                                                                            
 function rockSet(name){return P.rocks.sets[name]||P.rocks.sets.swamp;}
                                                                                                
 function crackLevel(hits,taps){return taps>1&&hits>0?Math.min(2,Math.ceil(hits*2/(taps-1))):0;}
                                                                                                  
                                                                         
 function rockCracks(rng){
  function zig(x,y,dx,dy,n){var d='M'+r2(x)+' '+r2(y);for(var i=0;i<n;i++){x+=dx+(rng()*2-1)*9;y+=dy+(rng()*2-1)*5;d+=' L'+r2(Math.max(4,Math.min(96,x)))+' '+r2(Math.max(4,Math.min(96,y)));}return d;}
  var x0=38+rng()*24;
  return [zig(x0,14+rng()*8,(rng()*2-1)*3,13,4),zig(x0+(rng()<.5?-6:6),38+rng()*10,(rng()<.5?-1:1)*11,6,3)];
 }
                                                                                              
 function rubbleFrames(rand,dist,groundDy){
  var dir=rand()<.5?-1:1,vx=dir*dist*(.3+rand()*.7),up=dist*(.5+rand()*.6),spin=dir*(120+rand()*300),gy=Math.max(6,groundDy*(.5+rand()*.5)),f=[];
  function key(x,y,rot,t,op){f.push({transform:'translate('+r2(x)+'px,'+r2(y)+'px) rotate('+r2(rot)+'deg)',opacity:op,offset:r2(t)});}
  key(0,0,0,0,1);
  for(var i=1;i<=5;i++){var t=i/5;key(vx*t,-up*4*t*(1-t)+gy*t*t,spin*t,t*.28,1);}
  key(vx*1.2,gy-up*.18,spin*1.15,.36,1);key(vx*1.3,gy,spin*1.25,.44,1);key(vx*1.3,gy,spin*1.25,.82,1);key(vx*1.3,gy,spin*1.25,1,0);
  return f;
 }
                                                                                                     
 function lerpPair(a,f){return a[0]+(a[1]-a[0])*f;}
                                                                                       
 function crackSet(s){var C=P.bossCracks,set=typeof s==='string'?C.sets[s]:s||C.sets.hollow;return Object.assign({},C,{sets:undefined},set);}
                                                                                                    
                                                            
 function bossCrackPlan(k,n){
  var C=P.bossCracks,f=n>1?Math.max(0,Math.min(1,k/(n-1))):1,count=Math.round(1+(C.maxPer-1)*f),first=lerpPair(C.firstMs,f),gap=lerpPair(C.gapMs,f),at=[];
  for(var i=0;i<count;i++)at.push(Math.round(first+i*gap));
  return {count:count,at:at,f:r3(f)};
 }
                                                                                                                 
                                                                                                               
                                                                                                            
 function crackSurface(width,height,lift,surface){
  var s=surface||P.bossCracks.surface,top=height*.54-(lift||0),k=width/1400;
  return {top:r2(top+s[0]*k),bottom:r2(Math.min(height,top+s[1]*k))};
 }
                                                                                                      
                                                                                                          
                                                                                                        
                                                                                                   
                                                                         
 function onSurface(c,surf,feetFy,flatMin){
  var room=surf.bottom-surf.top,sy=1,k=Math.min(1,room/c.height);
  if(flatMin){
   sy=Math.max(flatMin,Math.min(1,(c.footY-surf.top)/(c.height*feetFy),(surf.bottom-c.footY)/(c.height*(1-feetFy))));
   k=Math.min(1,room/(c.height*sy));
  }
  if(sy<1||k<1){c.left=c.x-c.width*k/2;c.width*=k;c.height*=sy*k;c.top=c.footY-c.height*feetFy;}
  var dy=c.top<surf.top?surf.top-c.top:c.top+c.height>surf.bottom?surf.bottom-c.top-c.height:0;
  c.top+=dy;c.footY+=dy;
  ['x','footY','left','top','width','height'].forEach(function(p){c[p]=r2(c[p]);});
  return c;
 }
                                                                                                
                                                                                                     
                                                                                                 
                                                
 function bossCrackSpot(width,height,k,n,i,taken,seed,lift,set){
  var C=crackSet(set),g=ground(width,height),surf=crackSurface(width,height,lift,C.surface),f=n>1?Math.max(0,Math.min(1,k/(n-1))):1,rng=layoutRng(seed+':crack:'+k+':'+i);
  var lo=Math.round((C.small.length-C.pick)*(1-f)),art=Math.min(C.small.length-1,lo+Math.floor(rng()*C.pick)),a=C.small[art];
  var w=a[0]*C.smallPx*unitScale(width)*lerpPair(C.grow,f),h=w*a[1]/a[0],cx=width*lerpPair(C.creep,f),best=null,bestScore=-1;
  var yTop=Math.max(g.top,surf.top+h*C.feetFy),yBot=Math.max(yTop,Math.min(g.bottom,surf.bottom-h*(1-C.feetFy))),band=yBot-yTop;
  for(var j=0;j<14;j++){
   var x=Math.max(g.left+w*.35,Math.min(g.right-w*.35,cx+(rng()*2-1)*C.spreadX*width)),y=yTop+band*(.05+rng()*.9);
   var score=(taken||[]).reduce(function(v,c){return Math.min(v,Math.hypot((x-c.x)/((w+c.width)/2),(y-c.footY)/((h+c.height)/2)));},Infinity);
   if(score>bestScore){bestScore=score;best={x:x,y:y};}
  }
  return onSurface({art:art,x:best.x,footY:best.y,left:best.x-w/2,top:best.y-h*C.feetFy,width:w,height:h,flip:rng()<.5},surf,C.feetFy);
 }
                                                                                                    
                                                                                                      
                                                                                                            
                                                                                                             
                                                       
 function bossCrackBed(bodyX,feetY,unitW,band,surf,centreX,set){
  var C=crackSet(set);
  return C.bed.map(function(b){
   var a=C.big[b[0]],w=b[3]*unitW,h=w*a[1]/a[0],x=b[0]===0&&centreX!=null?centreX:bodyX+b[1]*unitW,y=feetY+b[2]*band,fy=C.bedFeetFy[b[0]];
   var c={art:b[0],x:x,footY:y,left:x-w/2,top:y-h*fy,width:w,height:h};
   return surf?(C.bedOverTop?onSurface(c,{top:-Infinity,bottom:surf.bottom},fy,1):onSurface(c,surf,fy,C.bedFlatMin)):c;
  });
 }
                                     
                                                                                                    
                                                                                                    
                                                                                                      
                                                    
 function meadowLayout(width,height,anchor,seed){
  var M=P.meadow,rng=layoutRng(seed),px=M.px*anchor.width/M.unitPx,back=height*.54+M.backArtPx*width/1400;
  var cx=anchor.left+anchor.width/2,dv=Math.max(1,anchor.footY-back);
  function x(u){return u<=0?cx+u*anchor.width:cx+u*(width-cx);}
  function daisy(hx,hy,w){
   var art=Math.floor(rng()*M.art.length),a=M.art[art],h=w*M.tall*a[1]/a[0];
   return {art:art,x:hx,footY:hy,left:hx-w/2,top:hy-h*M.heartFy,width:w,height:h,flip:rng()<.5,rot:r2((rng()*2-1)*7),sway:r2(2.4+rng()*1.2),phase:r2(rng())};
  }
  var daisies=M.spots.map(function(s){return daisy(x(s[0]),back+s[1]*dv,s[2]*px);});
                                                                                               
  var grow=Math.round(M.spots.length*(dv/(M.refV*anchor.width)-1)),mock=daisies.slice();
  function room(px2,py2){var best=Infinity;daisies.forEach(function(d){var dd=Math.hypot(d.x-px2,(d.footY-py2)*1.6)/(d.width/2+8);if(dd<best)best=dd;});return best;}
                                                                                                  
                               
  for(var k=0;k<grow;k++){
   for(var t=0;t<12;t++){
    var b=mock[Math.floor(rng()*mock.length)],a2=rng()*Math.PI*2,r=b.width*(.8+rng()*.9),cx2=b.x+Math.cos(a2)*r,cy2=b.footY+Math.sin(a2)*r*.6;
    if(cy2<back+4||room(cx2,cy2)<1.05)continue;
    daisies.push(daisy(cx2,cy2,b.width*(.88+rng()*.24)));break;
   }
  }
  daisies=daisies.filter(function(d){return d.left+d.width>0&&d.left<width&&d.top<height;}).sort(function(a,b){return a.footY-b.footY;});
  var rest=M.rest.map(function(s){
   var h=M.petalLen*.16*px,w=h*M.petal[0]/M.petal[1],hx=x(s[0]),hy=back+s[1]*dv;
   return {x:hx,footY:hy,left:hx-w/2,top:hy-h/2,width:w,height:h,rot:s[2]};
  }).filter(function(p){return p.left+p.width>0&&p.left<width&&p.top<height;});
  return {back:back,daisies:daisies,rest:rest};
 }
                                                                                                    
                                                                                                       
                                                                                                   
                                                                                           
 function windPetalFrames(rng,width,exitX,exitY){
  var M=P.meadow,speed=width*M.windPxS*(.8+rng()*.45),climb=M.climb*(.75+rng()*.5),bob=M.flutterPx*(.6+rng()*.8),
   spin=(rng()<.5?-1:1)*M.spinDegS*(.6+rng()*.8),flip=M.flipHz*(.7+rng()*.6),ph=rng()*Math.PI*2,rot0=rng()*360,ramp=1,lift=14;
  function pos(t){
   var run=t<ramp?t*t/(2*ramp):t-ramp/2;
   return [speed*run,-speed*climb*run-lift*Math.min(1,t/.35)+bob*Math.sin(ph+t*Math.PI*2*.9)*Math.min(1,t/.5)];
  }
  var end=8;
  for(var t=.05;t<8;t+=.05){var p=pos(t);if(p[0]>exitX||-p[1]>exitY){end=t;break;}}
  var n=Math.max(8,Math.round(end*10)),frames=[];
  for(var i=0;i<=n;i++){
   var tt=end*i/n,q=pos(tt),c=Math.cos(ph+tt*Math.PI*2*flip),sx=(c<0?-1:1)*Math.max(.18,Math.abs(c)),pop=Math.min(1,tt/.18);
   frames.push({transform:'translate('+r2(q[0])+'px,'+r2(q[1])+'px) rotate('+r2(rot0+spin*tt)+'deg) scale('+r2(sx*(.35+.65*pop))+','+r2(.35+.65*pop)+')',
    opacity:i===0?0:1,offset:Math.round(i/n*1e4)/1e4});
  }
  return {frames:frames,ms:Math.round(end*1000)};
 }
 return {PARAMS:P,tier:tier,sizeTier:sizeTier,size:size,foePx:foePx,unitScale:unitScale,pack:pack,roster:roster,ground:ground,organic:organic,partyLayout:partyLayout,organicRoster:organicRoster,depth:depth,layoutRng:layoutRng,
  rockLayout:rockLayout,rockSet:rockSet,crackLevel:crackLevel,rockCracks:rockCracks,rubbleFrames:rubbleFrames,meadowLayout:meadowLayout,windPetalFrames:windPetalFrames,
  bossCrackPlan:bossCrackPlan,bossCrackSpot:bossCrackSpot,bossCrackBed:bossCrackBed,crackSurface:crackSurface,crackSet:crackSet,frameSlash:frameSlash,frameZigzag:frameZigzag,frameZigzagTimes:frameZigzagTimes,
  attackMs:attackMs,contactMs:contactMs,jumpFrames:jumpFrames,swingFrames:swingFrames,travelEase:travelEase,hopPose:hopPose,cheerFrames:cheerFrames,boneFrames:boneFrames,
  rollPose:rollPose,stompPose:stompPose,leapPose:leapPose,waddlePose:waddlePose,crawlPose:crawlPose,marchPose:marchPose,stackStyle:stackStyle,leapStackFrames:leapStackFrames,cheerStackFrames:cheerStackFrames,
  frameBox:frameBox,frameContactMs:frameContactMs,frameLeap:frameLeap,frameShot:frameShot,frameShotScale:frameShotScale,
  frameLash:frameLash,lashBend:lashBend,lashPick:lashPick,lashPose:lashPose,
  addTrauma:addTrauma,decayTrauma:decayTrauma,shakeOffset:shakeOffset,frogHitTrauma:frogHitTrauma,critLevel:critLevel,dangerLevel:dangerLevel,
  blowFrom:blowFrom,squishAmp:squishAmp,squishFrames:squishFrames,foeHurtTint:foeHurtTint,foeHurtMotion:foeHurtMotion,foeHurtAmp:foeHurtAmp,
  frogDeathFrames:frogDeathFrames,sparkFrames:sparkFrames,orbCount:orbCount,orbVolley:orbVolley,
  harvestBox:harvestBox,harvestSeat:harvestSeat,perchFrames:perchFrames,flingFrames:flingFrames,flipFrames:flipFrames,perchBounceFrames:perchBounceFrames,
  petalFrames:petalFrames,seedTokenFrames:seedTokenFrames,
  webBox:webBox,webSpots:webSpots,tadsFree:tadsFree,pullFrames:pullFrames,dropFrames:dropFrames,homeFrames:homeFrames};
});
