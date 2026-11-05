                                                                                   

                                                                                               
                                                                                       
                                                                                                      
                                                                                                   
                                                                                                 
                                                                                               
                                                                                                 
                                                                                               
                                          
                                                                                                   
                                                                                                   
                                                                             

             
                            
                                                                                       
                                                                                            
                                                                              
                                                                                          
                                                  
                                                                                             
                                                                  
                                                                                                 
                                                                                           
                                                                              
                                                                                    
                                                                                                    
                                                                                                      
                                                                                                       
                                                                                                
                                                                                                 
                                                       
                                                                                                            
                                                         
                                                      
                                                                                                 
                                                                                                
                                                                                            
                                                                                            
                                                                                            
                                                                                              
                                                                                  
                                                                           

                                                                                            
                                                                                                
(function(g){
  'use strict';

  var A = 'assets/cinematic/animatic/', W = 1440, H = 3200;
  function img(name, x, y, w, h, more){
    var L = {src:A+name+'.webp', x:x, y:y, w:w, h:h};
    for(var k in more) L[k] = more[k];
    return L;
  }
  function frame(name, more){ return img(name, 0, 0, W, H, more); }
                                                                                                      
                                                                                                   
                                         
                                                                                                    
                                                                                                 
  function flipbook(frames, frameMs, loopMs, delayMs){
    var t=0;
    return frames.map(function(f){
      var from=t/loopMs; t+=frameMs*(f.hold||1);
      return {src:f.src, x:f.x, y:f.y, w:f.w, h:f.h, hidden:true, move:'flip', show:[from, t/loopMs], ms:loopMs, delayMs:delayMs};
    });
  }
                                                                                                       
                                                                                                      
                                                                                                   
                                                                                                     
                                                             
  function waterFrog(L, at, riseMs, o){
    o=o||{};
    var x=L.x, y=L.y, w=L.w, h=L.h, up=0.6*h, side=0.2*w,
      frog={src:L.src, x:x, y:y, w:w, h:h, move:'surface', ms:riseMs, delayMs:at};
    if(o.treadMs) frog={x:x, y:y, w:w, h:h, move:'tread', ms:o.treadMs, delayMs:at+riseMs+250, deco:true, layers:[frog]};
    if(o.takeAt!=null){ var t=o.takeAt; frog={x:x, y:y, w:w, h:h, origin:'50% 100%', tl:[[0, {transform:'scale(1,1)'}],
      [t, {transform:'scale(1,1)'}, 'cubic-bezier(.2,.8,.3,1)'], [t+90, {transform:'scale(.92,1.13)'}, 'ease-in-out'],
      [t+200, {transform:'scale(1.07,.94)'}, 'ease-in-out'], [t+310, {transform:'scale(.98,1.03)'}, 'ease-out'],
      [t+420, {transform:'scale(1,1)'}]], layers:[frog]}; }
    return [
      {x:x-side, y:y-up, w:w+2*side, h:h+up, clip:true, layers:[frog]},
      {ring:true, x:x-0.1*w, y:y+0.78*h, w:1.2*w, h:0.44*h, move:'ripple', ms:riseMs, delayMs:at}
    ];
  }

                                                                                        
                                                                                                       
                                                                                                      
                                                                                                   
                                                                                                  
                                                                                                    
                                                                
  var GOO = 'assets/cinematic/pond/';
  var GOO_BEATS = { fadeMs:900, frogAtMs:4000, frogPopMs:550, lookAfterMs:300, lookMs:3600,
    crowdAfterLookMs:300, crowdGapMs:700, crowdRiseMs:1400, crowdSettleMs:1300 };
  var GOO_FROG_AT = GOO_BEATS.frogAtMs, GOO_LOOK_AT = GOO_FROG_AT + GOO_BEATS.frogPopMs + GOO_BEATS.lookAfterMs;
  var GOO_CROWD_AT = function(k){ return GOO_LOOK_AT + GOO_BEATS.crowdAfterLookMs + k*GOO_BEATS.crowdGapMs; };
  var GOO_ENDS_AT = GOO_CROWD_AT(3) + GOO_BEATS.crowdRiseMs + GOO_BEATS.crowdSettleMs;
  function gooFrog(name, x, y, w, h, k){
    return waterFrog({src:GOO+name, x:x, y:y, w:w, h:h}, GOO_CROWD_AT(k), GOO_BEATS.crowdRiseMs, {treadMs:1800+k*230});
  }
                                                                                                     
                                                                     
  var L0=GOO_LOOK_AT,
    GOO_LEAN=[[0, {transform:'rotate(0deg)'}], [L0, {transform:'rotate(0deg)'}, 'cubic-bezier(.3,0,.2,1)'],
      [L0+300, {transform:'rotate(-3deg)'}, 'ease-in-out'], [L0+460, {transform:'rotate(-2deg)'}],
      [L0+1368, {transform:'rotate(-2deg)'}, 'cubic-bezier(.3,0,.2,1)'], [L0+1740, {transform:'rotate(2.6deg)'}, 'ease-in-out'],
      [L0+1900, {transform:'rotate(1.7deg)'}], [L0+2808, {transform:'rotate(1.7deg)'}, 'cubic-bezier(.3,0,.2,1)'],
      [L0+3110, {transform:'rotate(-.6deg)'}, 'ease-out'], [L0+3260, {transform:'rotate(0deg)'}]];
                                                                                                   
                                                                                                  
  var SLUDGE = { pourFrameMs:200, bubbleFrameMs:120 };
  function sludgeBubble(n, boxes, loopMs, delayMs){
    return flipbook(boxes.map(function(b, k){
      return {src:GOO+'bubble'+n+'_'+(k+1)+'.png', x:b[0], y:b[1], w:b[2], h:b[3], hold:k===0 ? 2 : 1};
    }), SLUDGE.bubbleFrameMs, loopMs, delayMs);
  }
                                                                                                      
                                                                                                     
                                                                  
  var GOO_SCENE = { w:841, h:1870, layers:[
    {src:GOO+'bg.jpg',            x:0,   y:0,    w:841, h:1409}
  ].concat(
                                                                                     
    flipbook([{src:GOO+'pour_1.png', x:236, y:845, w:275, h:274},
              {src:GOO+'pour_2.png', x:255, y:847, w:264, h:282}], SLUDGE.pourFrameMs, 2*SLUDGE.pourFrameMs, 0),
    [{src:GOO+'cloud.png',         x:682, y:77,   w:159, h:182, move:'float', dx:2.5, dy:-1.5, ms:9000},
                                                                                                
     {src:GOO+'tree.png',          x:0,   y:0,    w:506, h:221, move:'hang',  deg:-1.6, ms:6200, delayMs:-1500},
                                                                                  
     {src:GOO+'sludge_stream.png', x:231, y:1066, w:401, h:106, move:'ooze',  ms:5200},
     {src:GOO+'sludge_bubble.png', x:394, y:1172, w:134, h:36,  move:'bob',   ms:3700},
                                                                                                   
                                                                                                  
     {x:281, y:1142, w:348, h:201, move:'pop', ms:GOO_BEATS.frogPopMs, delayMs:GOO_FROG_AT, layers:[
       {x:281, y:1142, w:348, h:201, origin:'50% 100%', tl:GOO_LEAN, layers:[
         {x:281, y:1142, w:348, h:201, move:'breathe', ms:1900, delayMs:GOO_FROG_AT+GOO_BEATS.frogPopMs+150, deco:true, layers:[
           {src:GOO+'frog.png',    x:281, y:1142, w:348, h:201},
           {src:GOO+'pupils.png',  x:440, y:1173, w:144, h:41,  move:'look', ms:GOO_BEATS.lookMs, delayMs:GOO_LOOK_AT}]}]}
     ]}],
                                                                                               
    sludgeBubble(1, [[364,1067,78,35], [371,1056,70,46], [369,1050,78,55], [363,1036,84,65]], 2600, -1400),
    sludgeBubble(2, [[471,1071,87,40], [476,1058,82,53], [473,1052,89,62], [467,1036,95,74]], 3300, -300),
    sludgeBubble(3, [[471,1049,65,30], [475,1039,61,40], [473,1035,67,46], [469,1031,71,47]], 4100, -2600),
                                                                                                    
                                             
    gooFrog('frog01.png', 592, 1090, 93,  38, 2),
    gooFrog('frog02.png', 185, 1168, 127, 52, 0),
    [{src:GOO+'fg.png',           x:0,   y:1100, w:841, h:770},                                                
                                                                                                   
                                                  
     {src:GOO+'reed02.png',       x:703, y:1320, w:138, h:550, move:'sway', origin:'100% 100%', deg:2.2,  ms:3900},
     {src:GOO+'leaf.png',         x:0,   y:1406, w:223, h:335, move:'sway', origin:'0% 74%',    deg:-1.6, ms:4600, delayMs:-2000},
     {src:GOO+'reed01.png',       x:0,   y:1124, w:208, h:383, move:'sway', origin:'1% 99%',    deg:2.4,  ms:3400, delayMs:-900}],
    gooFrog('frog03.png', 542, 1476, 202, 91, 3),
    gooFrog('frog04.png', 524, 1021, 43,  18, 1)
  )};

                                                                                                      
                                                                                                       
                                                              
  var POND = { inMs:400, hopAt:1000, kickMs:250, airMs:240, frogsAt:2100, frogGapMs:250, riseMs:700, markAfterMs:120, endMs:4300 };
  var POND_AIR_AT = POND.hopAt + POND.kickMs, POND_LAND_AT = POND_AIR_AT + POND.airMs;
  var POND_FROG_AT = function(k){ return POND.frogsAt + k*POND.frogGapMs; };
                                                                                          
  function pondFrog(name, x, y, w, h, k){
    return waterFrog(img(name, x, y, w, h), POND_FROG_AT(k), POND.riseMs,
      {treadMs:1800+k*230, takeAt:POND_FROG_AT(k)+POND.riseMs+POND.markAfterMs-60});
  }
  function marks(name, x, y, w, h, at){
    return {x:x, y:y, w:w, h:h, move:'popUp', ms:400, delayMs:at, layers:[
      img(name, x, y, w, h, {move:'buzz', ms:420, delayMs:at+400})]};
  }
  var P_ = function(dx, dy, sx, sy, sk){ return 'translate('+dx+'%,'+dy+'%) scale('+sx+','+sy+')'+(sk!=null ? ' skewX('+sk+'deg)' : ''); };
  var POND_SCENE = { w:W, h:H, layers:[
    frame('f01'),
                                                                                                     
                             
    {x:476, y:1114, w:577, h:549, origin:'50% 100%', tl:[[0, {opacity:0, transform:P_(-4,-10,.94,1.08,0)}],
      [POND_LAND_AT, {opacity:0, transform:P_(-4,-10,.94,1.08,0)}],
      [POND_LAND_AT+1, {opacity:1, transform:P_(-4,-10,.94,1.08,0)}, 'ease-in'],
      [POND_LAND_AT+110, {opacity:1, transform:P_(0,0,1.16,.84,7)}, 'ease-out'],
      [POND_LAND_AT+250, {opacity:1, transform:P_(0,0,.96,1.06,-4)}, 'ease-in-out'],
      [POND_LAND_AT+380, {opacity:1, transform:P_(0,0,1.02,.98,2)}, 'ease-in-out'],
      [POND_LAND_AT+500, {opacity:1, transform:P_(0,0,1,1,0)}]], layers:[
      img('f01_hop1', 476, 1114, 577, 549, {move:'breathe', ms:1700, delayMs:POND_LAND_AT+520})]},
                                                                               
    img('f01_hop2', 481, 1105, 878, 470, {origin:'50% 100%', tl:[[0, {opacity:0, transform:P_(16,-12,1.08,.94)}],
      [POND_AIR_AT, {opacity:0, transform:P_(16,-12,1.08,.94)}],
      [POND_AIR_AT+1, {opacity:1, transform:P_(16,-12,1.08,.94)}, 'cubic-bezier(.2,.6,.4,1)'],
      [POND_AIR_AT+110, {opacity:1, transform:P_(8,-22,1.04,.97)}, 'cubic-bezier(.6,0,.8,.4)'],
      [POND_LAND_AT, {opacity:1, transform:P_(-2,0,.97,1.05)}], [POND_LAND_AT+1, {opacity:0, transform:P_(-2,0,.97,1.05)}]]}),
                                                                 
    img('f01_hop3', 960, 890, 728, 641, {origin:'50% 100%', tl:[[0, {opacity:0, transform:P_(26,10,1,1)}],
      [POND.hopAt, {opacity:0, transform:P_(26,10,1,1)}],
      [POND.hopAt+1, {opacity:1, transform:P_(26,10,1,1)}, 'cubic-bezier(.2,.7,.3,1)'],
      [POND.hopAt+100, {opacity:1, transform:P_(11,3,1,1)}, 'ease-in-out'],
      [POND.hopAt+160, {opacity:1, transform:P_(11,5,1.08,.9)}],
      [POND.hopAt+200, {opacity:1, transform:P_(11,5,1.08,.9)}, 'cubic-bezier(.2,.9,.3,1)'],
      [POND_AIR_AT, {opacity:1, transform:P_(0,-8,.92,1.1)}], [POND_AIR_AT+1, {opacity:0, transform:P_(0,-8,.92,1.1)}]]}),
    img('f01_bush', 837, 1239, 603, 980)
  ].concat(
                                                                           
    pondFrog('f01_frog2', 560, 2371, 441, 226, 0),
    pondFrog('f01_frog1', -26, 2301, 371, 285, 1),
    pondFrog('f01_frog3', 940, 2706, 489, 365, 2),
    [marks('f01_mark2', 776, 2242, 127, 122, POND_FROG_AT(0)+POND.riseMs+POND.markAfterMs),
     marks('f01_mark1', 159, 2150, 140, 148, POND_FROG_AT(1)+POND.riseMs+POND.markAfterMs),
     marks('f01_mark3', 1051, 2548, 156, 144, POND_FROG_AT(2)+POND.riseMs+POND.markAfterMs)]
  )};

                                                                                                     
                                                                               
  function ear(name, x, y, w, h, at, twitchMs, deg){
    var up=0.35*h, side=0.2*w;
    return {x:x-side, y:y-up, w:w+2*side, h:h+up, clip:true, layers:[
      {x:x, y:y, w:w, h:h, move:'rise', ms:500, delayMs:at, layers:[
        img(name, x, y, w, h, {move:'twitch', origin:'50% 100%', deg:deg, ms:twitchMs, delayMs:at+500})]}]};
  }
                                                                  
  function starGlint(cx, cy, k){
    return img('f02_sparkle', cx-55, cy-75, 110, 150, {hidden:true, move:'glint', ms:1000, delayMs:1000+70*k, deco:true});
  }
  var EARS_SCENE = { w:W, h:H, layers:[
    frame('f02'),
                                                               
    sparkle(367, 1133, 156, -300, true), sparkle(342, 1353, 136, -750, true), sparkle(1158, 1345, 134, -150, true), sparkle(1072, 1697, 138, -550, true),
    ear('f02_ear_l', 423, 936, 323, 513, 450, 1300, -7),
    ear('f02_ear_r', 757, 984, 348, 520, 560, 1500, 7),
    img('f02_sparkle', 1186, 1045, 152, 207, {move:'twinkle', ms:900, delayMs:200}),
                                                                                                             
    starGlint(110, 2190, 0), starGlint(340, 2106, 1), starGlint(600, 2390, 2), starGlint(868, 2430, 3), starGlint(1096, 2668, 4)
  ]};

                                                                            
                                                                                                    
                                                           
  var SHOCK_SCENE = { w:W, h:H, layers:[
    frame('f03'),
    {x:95, y:1355, w:280, h:323, move:'popUp', origin:'100% 100%', ms:340, delayMs:180, layers:[
      img('f03_mark_l', 95, 1355, 280, 323, {move:'buzz', ms:380, delayMs:520})]},
    {x:1062, y:1355, w:280, h:323, move:'popUp', origin:'0% 100%', ms:340, delayMs:180, layers:[
      img('f03_mark_r', 1062, 1355, 280, 323, {move:'buzz', ms:380, delayMs:560})]}
  ]};

                                                                                                  
                                                                          
  var EYES_BG = 'rgb(1,1,0)';
  var LID_TL = [[0, {transform:'scaleY(1)'}], [250, {transform:'scaleY(1)'}, 'ease-out'], [360, {transform:'scaleY(0)'}],
    [1150, {transform:'scaleY(0)'}, 'ease-in'], [1220, {transform:'scaleY(1)'}, 'ease-out'], [1300, {transform:'scaleY(0)'}],
    [1450, {transform:'scaleY(0)'}, 'ease-in'], [1520, {transform:'scaleY(1)'}, 'ease-out'], [1600, {transform:'scaleY(0)'}],
    [2000, {transform:'scaleY(0)'}, 'ease-in'], [2160, {transform:'scaleY(1)'}]];
                                                                                                    
                                
  var S_=function(sx, sy){ return {transform:'scale('+sx+','+sy+')'}; };
  var EYES_SQUASH=[[0, S_(1,.92)], [250, S_(1,.92), 'cubic-bezier(.2,.8,.3,1)'], [380, S_(.96,1.1), 'ease-in-out'], [520, S_(1.02,.97), 'ease-out'],
    [640, S_(1,1)], [1150, S_(1,1), 'ease-in'], [1220, S_(1.02,.9), 'ease-out'], [1320, S_(.98,1.06), 'ease-out'], [1450, S_(1,1), 'ease-in'],
    [1520, S_(1.02,.9), 'ease-out'], [1620, S_(.98,1.06), 'ease-out'], [1750, S_(1,1)], [2000, S_(1,1), 'ease-in'], [2160, S_(1.02,.82)]];
  var EYES_SCENE = { w:W, h:H, bg:EYES_BG, layers:[
    {x:120, y:900, w:1200, h:640, move:'tremble', ms:320, layers:[
      img('f07_eyes', 120, 900, 1200, 640, {origin:'50% 55%', tl:EYES_SQUASH}),
      {fill:EYES_BG, x:140, y:955, w:500, h:545, origin:'50% 0%', tl:LID_TL},
      {fill:EYES_BG, x:815, y:940, w:480, h:545, origin:'50% 0%', tl:LID_TL}]}
  ]};

                                                                                                      
                                                                                                      
                                                                                                  
                                                                                                    
                                                                                                     
                                                                                        
  var PUPIL_DART_MS = 140;
  function pupil(name, x, y, w, h, dx, dy, at){
    var t=function(a, b){ return 'translate('+(a/w*100).toFixed(2)+'%,'+(b/h*100).toFixed(2)+'%)'; };
    return img(name, x, y, w, h, {tl:[[0, {transform:t(0,0)}], [at, {transform:t(0,0)}, 'cubic-bezier(.3,0,.2,1)'],
      [at+PUPIL_DART_MS, {transform:t(dx,dy)}]]});
  }
  var SPROUT_LOOK_AT = 1350, TAIL_LOOK_AT = 760;
  var FROG = {x:323, y:1885, w:851, h:636};
                                                                                                   
                                                                
  var DIGEST_SCENE = { w:W, h:H, layers:[frame('f08'),
    {x:323, y:1854, w:851, h:667, origin:'50% 100%', tl:[[0, S_(1,1)], [2450, S_(1,1), 'cubic-bezier(.5,0,.9,.6)'],
      [2850, S_(1.05,1.08), 'linear'], [2920, S_(1.07,1.07)], [2990, S_(1.05,1.1)], [3060, S_(1.08,1.09)], [3130, S_(1.06,1.12)],
      [3200, S_(1.09,1.12)]], layers:flipbook([
      img('f08_wob1', 323, 1854, 851, 667), img('f08_wob2', 323, 1885, 851, 636),
      img('f08_wob3', 323, 1885, 851, 636), img('f08_wob4', 323, 1862, 851, 659),
      img('f08_wob5', 323, 1885, 851, 642), img('f08_wob0', 323, 1885, 851, 636, {hold:2})
    ], 140, 980, 700)}] };
                                                                                                    
                                                               
  var EARS_POP_SCENE = { w:W, h:H, layers:[
    frame('f09'),
    {x:FROG.x, y:FROG.y, w:FROG.w, h:FROG.h, origin:'50% 100%', tl:[[0, S_(1.09,1.12), 'ease-out'],
      [90, S_(1.2,1.02), 'ease-in-out'], [230, S_(1.03,1.14), 'ease-in-out'], [370, S_(1.08,1.03), 'ease-in-out'],
      [500, S_(1.01,1.03), 'ease-out'], [620, S_(1,1)],
      [SPROUT_LOOK_AT-140, S_(1,1), 'ease-out'], [SPROUT_LOOK_AT-20, S_(1.05,1), 'ease-in'], [SPROUT_LOOK_AT+90, S_(1,1.07), 'ease-out'],
      [SPROUT_LOOK_AT+210, S_(1.03,1.01), 'ease-in-out'], [SPROUT_LOOK_AT+330, S_(1,1)]], layers:[
      img('f09_frog', FROG.x, FROG.y, FROG.w, FROG.h),
      img('f09_whites', 504, 1900, 512, 194),
      pupil('f09_pupil_l', 537, 1920, 104, 100, 46, 25, SPROUT_LOOK_AT),
      pupil('f09_pupil_r', 894, 1912, 95, 90, 19, 28, SPROUT_LOOK_AT)]}
  ]};
  var TAIL_SCENE = { w:W, h:H, layers:[
    frame('f09c'),
    {x:271, y:1885, w:851, h:636, origin:'50% 100%', tl:[[0, S_(1,1)], [TAIL_LOOK_AT-140, S_(1,1), 'ease-out'],
      [TAIL_LOOK_AT-20, S_(1.05,1), 'ease-in'], [TAIL_LOOK_AT+90, S_(1,1.07), 'ease-out'], [TAIL_LOOK_AT+210, S_(1.03,1.01), 'ease-in-out'],
      [TAIL_LOOK_AT+330, S_(1,1)]], layers:[
      img('f09c_frog', 271, 1885, 851, 636),
      img('f09c_whites', 429, 1900, 512, 194),
      pupil('f09c_pupil_l', 456, 1912, 95, 90, -19, 28, TAIL_LOOK_AT),
      pupil('f09c_pupil_r', 804, 1920, 104, 100, -47, 25, TAIL_LOOK_AT)]}
  ]};

                                                                                                 
                                                                                           
                                                                                                          
                                                                                                    
                                                                                                         
                                                                                                 
                                                                               
  var WORLD = { inMs:260, huhAt:450, huhGapMs:120, bannerAt:1500, cheerGapMs:70, jumpAt:1700, jumpMs:440,
    loadingAt:2000, loadingMs:3000, endMs:6100 };
  var BANNER_Y = 330;                                                                           
  function sparkle(cx, cy, w, delayMs, deco){
    var h=w*207/152;
    return img('f02_sparkle', cx-w/2, cy-h/2, w, h, {move:'twinkleOver', ms:1100, delayMs:delayMs, deco:!!deco});
  }
                                                                                                       
                                                                  
  function huh(n, w0, h0, cx, bottom, scale, k){
    var w=w0*scale, h=h0*scale, x=cx-w/2, y=bottom-h, at=WORLD.huhAt+k*WORLD.huhGapMs;
    return {x:x, y:y, w:w, h:h, origin:'50% 100%', tl:[[0, {transform:'scale(0,0)', opacity:0}],
      [at, {transform:'scale(0,0)', opacity:0}, 'cubic-bezier(.2,.8,.3,1)'], [at+120, {transform:'scale(.8,1.3)', opacity:1}, 'ease-in-out'],
      [at+210, {transform:'scale(1.15,.85)', opacity:1}, 'ease-in-out'], [at+290, {transform:'scale(.97,1.05)', opacity:1}, 'ease-out'],
      [at+360, {transform:'scale(1,1)', opacity:1}], [WORLD.bannerAt-60, {transform:'scale(1,1)', opacity:1}, 'ease-in'],
      [WORLD.bannerAt+90, {transform:'scale(0,0)', opacity:0}]], layers:[
      img('f16_huh'+n, x, y, w, h, {move:'buzz', ms:520, delayMs:at+360})]};
  }
  function cheer(n, x, y, w, h, k){
    var at=WORLD.bannerAt+90+k*WORLD.cheerGapMs;
    return {x:x, y:y, w:w, h:h, move:'popUp', ms:380, delayMs:at, layers:[
      img('f16_cheer'+n, x, y, w, h, {move:'buzz', ms:380, delayMs:at+380+k*60})]};
  }
  var CONQUER_SCENE = { w:W, h:H, layers:[
    frame('f16'),
    sparkle(237, 211, 74, 0), sparkle(117, 333, 104, -500), sparkle(47, 420, 62, -250), sparkle(69, 563, 70, -800),
    sparkle(193, 667, 82, -150), sparkle(1224, 211, 80, -650), sparkle(1300, 273, 58, -350), sparkle(1353, 344, 108, -900),
    sparkle(1371, 563, 72, -100), sparkle(1227, 660, 80, -550),
                                                                                                     
                                                                                              
                                                                                                       
    {x:65, y:BANNER_Y, w:1324, h:487, keepTop:58, tl:[[0, {opacity:0, transform:'scale(2.6,2.6)'}], [WORLD.bannerAt, {opacity:0, transform:'scale(2.6,2.6)'}],
      [WORLD.bannerAt+1, {opacity:1, transform:'scale(2.6,2.6)'}, 'cubic-bezier(.55,0,.9,.45)'], [WORLD.bannerAt+200, {opacity:1, transform:'scale(1.16,.8)'}, 'ease-out'],
      [WORLD.bannerAt+290, {opacity:1, transform:'scale(.94,1.09)'}, 'ease-in-out'], [WORLD.bannerAt+390, {opacity:1, transform:'scale(1.04,.97)'}, 'ease-in-out'],
      [WORLD.bannerAt+490, {opacity:1, transform:'scale(.99,1.01)'}, 'ease-out'], [WORLD.bannerAt+580, {opacity:1, transform:'scale(1,1)'}]], layers:[
      img('f16_banner', 65, BANNER_Y, 1324, 487, {move:'float', dy:-4, ms:2400, delayMs:WORLD.bannerAt+600})]},
                                                                                                       
                                                                                                   
    {x:0, y:2034, w:W, h:1121, origin:'50% 100%', tl:[[0, {transform:'translateY(0) scale(1,1)'}],
      [WORLD.jumpAt-200, {transform:'translateY(0) scale(1,1)'}, 'ease-out'],
      [WORLD.jumpAt-30, {transform:'translateY(2.5%) scale(1.02,.96)'}, 'cubic-bezier(.5,0,.9,.5)'],
      [WORLD.jumpAt+40, {transform:'translateY(0) scale(1,1)'}]], layers:[
      {x:0, y:2034, w:W, h:1121, move:'hop', ms:WORLD.jumpMs, delayMs:WORLD.jumpAt, layers:[
        img('f16_crowd', 0, 2367, 1440, 788),
        cheer(1, 141, 2199, 309, 216, 0), cheer(2, 587, 2358, 236, 159, 1), cheer(3, 998, 2199, 306, 213, 2),
        huh(1, 173, 189, 295, 2405, 1.2, 0), huh(2, 162, 169, 705, 2507, .95, 1), huh(3, 171, 183, 1151, 2402, 1.2, 2)]}]},
    img('f16_bushes', 0, 2676, 1440, 524)
  ]};
                                                                                                        
                                                                                                       
                                                                                                      
                                                                                                   
                                                                                               
                                                                                                     
                                                                                                    
                                                                                                        
                                                                                                      
                                                                                                    
  var BONK = { hitAt:320, endMs:1500, liftPx:240 };                                       
  var T_=function(x, y){ return {transform:'translate('+x+'%,'+(y||0)+'%)'}; };
                                                                                                       
                                                                                                          
  function across(dx){ return [[0, T_(dx)], [BONK.hitAt, T_(0)]]; }
  function arc(h){ var C=BONK.hitAt, up=-BONK.liftPx/h*100;
    return [[0, T_(0,0), 'cubic-bezier(.33,.66,.6,1)'], [C*.48, T_(0,up), 'cubic-bezier(.4,0,.67,.34)'], [C, T_(0,0)]]; }
  function pitch(deg){ var C=BONK.hitAt;
    return [[0, {transform:'rotate('+(-deg)+'deg)'}, 'ease-in-out'], [C*.55, {transform:'rotate('+(.3*deg)+'deg)'}, 'ease-in'], [C, {transform:'rotate(0deg)'}]]; }
                                                                  
  function streak(){ var C=BONK.hitAt; return [[0, S_(1.1,.93)], [C-30, S_(1.1,.93), 'ease-out'], [C, S_(1,1)]]; }
                                                                                           
  function recoil(){ var C=BONK.hitAt; return [[0, S_(1,1)], [C, S_(1,1), 'cubic-bezier(.2,.8,.3,1)'], [C+50, S_(.9,1.08), 'ease-in-out'],
    [C+170, S_(1.03,.98), 'ease-in-out'], [C+280, S_(.99,1.01), 'ease-out'], [C+360, S_(1,1)]]; }
  function flyIn(dx, dy, deg, at){                                                         
    var from='translate('+dx+'%,'+dy+'%) rotate('+deg+'deg) scale(.5)', to='translate(0%,0%) rotate(0deg) scale(1)';
    return [[0, {opacity:0, transform:from}], [at-1, {opacity:0, transform:from}], [at, {opacity:1, transform:from}, 'cubic-bezier(.15,.8,.3,1)'],
      [at+300, {opacity:1, transform:to}]];
  }
  var BONK_CRACKLE = (function(){                                                           
    var C=BONK.hitAt, keys=[[0, {transform:'scale(1) rotate(0deg)'}]];
    for(var t=C+340, k=0; t<BONK.endMs; t+=70, k++) keys.push([t, {transform:k%2 ? 'scale(1) rotate(0deg)' : 'scale(1.035) rotate('+(k%4 ? -.8 : .8)+'deg)'}, 'ease-out']);
    return keys;
  })();
  var BONK_SCENE = { w:W, h:H, layers:[
    frame('f11'),
                                                                                            
    {x:0, y:828, w:1440, h:1541, origin:'51% 47%', tl:[[0, {opacity:0, transform:'scale(.3) rotate(-10deg)'}],
      [BONK.hitAt-1, {opacity:0, transform:'scale(.3) rotate(-10deg)'}], [BONK.hitAt, {opacity:1, transform:'scale(.3) rotate(-10deg)'}, 'cubic-bezier(.1,.8,.3,1)'],
      [BONK.hitAt+90, {opacity:1, transform:'scale(1.14) rotate(3deg)'}, 'ease-in-out'], [BONK.hitAt+180, {opacity:1, transform:'scale(.96) rotate(-1deg)'}, 'ease-in-out'],
      [BONK.hitAt+260, {opacity:1, transform:'scale(1.02) rotate(0deg)'}, 'ease-out'], [BONK.hitAt+340, {opacity:1, transform:'scale(1) rotate(0deg)'}]], layers:[
      img('f11_boom', 0, 828, 1440, 1541, {origin:'51% 47%', tl:BONK_CRACKLE, deco:true})]},
    img('f11_rock_l', 18, 2138, 48, 55, {tl:flyIn(1350, -740, 260, BONK.hitAt+30)}),
    img('f11_rock_r', 1233, 1960, 207, 304, {tl:flyIn(-300, -110, -220, BONK.hitAt+30)}),
                                                                              
    {x:697, y:1487, w:743, h:534, tl:across(106), layers:[
      {x:697, y:1487, w:743, h:534, tl:arc(534), layers:[
        {x:697, y:1487, w:743, h:534, origin:'40% 60%', tl:pitch(-9), layers:[
          {x:697, y:1487, w:743, h:534, origin:'0% 60%', tl:streak(), layers:[
            img('f11_frog_r', 697, 1487, 743, 534, {origin:'100% 60%', tl:recoil()})]}]}]}]},
                                                                                                    
                                                                
    {x:0, y:1175, w:688, h:810, tl:across(-106), layers:[
      {x:0, y:1175, w:688, h:810, tl:arc(810), layers:[
        {x:0, y:1175, w:688, h:810, origin:'60% 72%', tl:pitch(9), layers:[
          {x:0, y:1175, w:688, h:810, origin:'100% 72%', tl:streak(), layers:[
            {x:0, y:1175, w:688, h:810, origin:'0% 72%', tl:recoil(), layers:[
              img('f11_frog_l', 0, 1544, 688, 441),
              img('f11_ears', 125, 1175, 515, 427, {origin:'92% 95%', tl:[[0, {transform:'rotate(-4deg)'}, 'ease-in-out'],
                [BONK.hitAt*.4, {transform:'rotate(-15deg)'}, 'ease-in-out'], [BONK.hitAt*.7, {transform:'rotate(-3deg)'}, 'ease-in-out'],
                [BONK.hitAt, {transform:'rotate(-10deg)'}, 'cubic-bezier(.2,.9,.3,1)'], [BONK.hitAt+90, {transform:'rotate(16deg)'}, 'ease-in-out'],
            [BONK.hitAt+220, {transform:'rotate(-7deg)'}, 'ease-in-out'], [BONK.hitAt+350, {transform:'rotate(4deg)'}, 'ease-in-out'],
            [BONK.hitAt+470, {transform:'rotate(-2deg)'}, 'ease-out'], [BONK.hitAt+580, {transform:'rotate(0deg)'}]]})]}]}]}]}]},
    img('f11_front', 0, 2304, 1440, 896)
  ]};
                                                                                                  
                                         
                                                                                                       
                                                                                                       
                                                                                                   
                                                                                                       
                                                                                                  
  var MERGED = { tailAt:2100, camAt:2950, endMs:4300 };
  function look(name, x, y, w, h, darts){
    var t=function(a, b){ return {transform:'translate('+(a/w*100).toFixed(2)+'%,'+(b/h*100).toFixed(2)+'%)'}; }, keys=[[0, t(0,0)]];
    darts.forEach(function(d){ keys.push([d[0], keys[keys.length-1][1], 'cubic-bezier(.3,0,.2,1)'], [d[0]+PUPIL_DART_MS, t(d[1],d[2])]); });
    return img(name, x, y, w, h, {tl:keys});
  }
  var MERGED_SCENE = { w:W, h:H, layers:[frame('f11b'),
    img('f11b_whites', 536, 1869, 485, 200),
    look('f11b_pupil_l', 592, 1897, 110, 103, [[MERGED.tailAt, -46, 54], [MERGED.camAt, -10, 32]]),
    look('f11b_pupil_r', 910, 1878, 92, 87, [[MERGED.tailAt+20, -45, 44], [MERGED.camAt+20, -21, 24]]),
    sparkle(600, 1208, 96, -300, true), sparkle(1192, 1667, 156, -700, true)] };

  var SCENE_MOVES = {
                                                                                                   
                 
    flip: { loop:true, ease:'linear', keysFor:function(L){
      var a=L.show[0], b=L.show[1], k=[{offset:0, opacity:a>0 ? 0 : 1, easing:'step-end'}];
      if(a>0) k.push({offset:a, opacity:1, easing:'step-end'});
      if(b<1) k.push({offset:b, opacity:0, easing:'step-end'});
      k.push({offset:1, opacity:b<1 ? 0 : 1});
      return k; } },
                                                                                        
    ripple:{ ease:'ease-out', keys:[{transform:'scale(.3)', opacity:0}, {offset:.08, transform:'scale(.4)', opacity:.9},
      {transform:'scale(1.6)', opacity:0}] },
                                                                                                      
    surface: { ease:'linear', origin:'50% 100%', keys:[
      {transform:'translateY(100%) scale(.97,1.03)', easing:'cubic-bezier(.45,.05,.4,1)'},
      {offset:.75, transform:'translateY(-5%) scale(.98,1.03)', easing:'ease-in-out'},
      {transform:'translateY(0) scale(1,1)'}] },
                                                                                                   
                      
    rise: { ease:'linear', origin:'50% 100%', keys:[
      {transform:'translateY(100%) scale(.9,1.15)', easing:'cubic-bezier(.2,.7,.3,1)'},
      {offset:.6, transform:'translateY(-7%) scale(.94,1.1)', easing:'ease-in-out'},
      {offset:.8, transform:'translateY(1%) scale(1.07,.93)', easing:'ease-in-out'},
      {transform:'translateY(0) scale(1,1)'}] },
                                                                                               
                              
    popUp: { ease:'linear', origin:'50% 100%', keys:[
      {transform:'scale(0,0)', opacity:0, easing:'cubic-bezier(.2,.8,.3,1)'},
      {offset:.4, transform:'scale(.85,1.35)', opacity:1, easing:'ease-in-out'},
      {offset:.65, transform:'scale(1.18,.84)', opacity:1, easing:'ease-in-out'},
      {offset:.83, transform:'scale(.96,1.06)', opacity:1, easing:'ease-out'},
      {transform:'scale(1,1)', opacity:1}] },
                                                
    buzz: { loop:true, ease:'linear', keys:[{transform:'rotate(0deg)'}, {transform:'rotate(-4deg) translate(-1%,0)'},
      {transform:'rotate(3deg) translate(1%,0)'}, {transform:'rotate(0deg)'}] },
                                                                                             
    twitch: { loop:true, ease:'linear', keysFor:function(L){ return [{transform:'rotate(0deg)', easing:'ease-out'},
      {offset:.08, transform:'rotate('+L.deg+'deg)', easing:'ease-in-out'}, {offset:.16, transform:'rotate('+(-L.deg*.4)+'deg)', easing:'ease-out'},
      {offset:.24, transform:'rotate(0deg)'}, {transform:'rotate(0deg)'}]; } },
                                        
    twinkle: { loop:true, keys:[{transform:'scale(1) rotate(0deg)', opacity:1}, {transform:'scale(.45) rotate(25deg)', opacity:.6},
      {transform:'scale(1) rotate(0deg)', opacity:1}] },
                                                                                                    
    twinkleOver: { loop:true, keys:[{transform:'scale(1) rotate(0deg)'}, {transform:'scale(1.35) rotate(20deg)'},
      {transform:'scale(1) rotate(0deg)'}] },
    breathe: { loop:true, origin:'50% 100%', keys:[{transform:'scale(1,1)'}, {transform:'scale(1.015,.98)'}, {transform:'scale(1,1)'}] },
                                                                                                      
    tread: { loop:true, origin:'50% 100%', keys:[{transform:'translateY(0) scale(1,1)'}, {transform:'translateY(4%) scale(1.015,.99)'},
      {transform:'translateY(0) scale(1,1)'}] },
                                                                                            
    glint: { loop:true, ease:'linear', keys:[{offset:0, transform:'scale(0) rotate(0deg)', opacity:0, easing:'ease-out'},
      {offset:.1, transform:'scale(1.2) rotate(45deg)', opacity:1, easing:'ease-in'}, {offset:.22, transform:'scale(0) rotate(90deg)', opacity:0},
      {offset:1, transform:'scale(0) rotate(90deg)', opacity:0}] },
                                                                                                       
                                                                
    hop: { loop:true, ease:'linear', origin:'50% 100%', keys:[
      {transform:'translateY(0) scale(1,1)', easing:'cubic-bezier(.2,.6,.4,1)'},
      {offset:.42, transform:'translateY(-5%) scale(1,1.02)', easing:'cubic-bezier(.6,0,.8,.4)'},
      {offset:.8, transform:'translateY(0) scale(1.02,.97)', easing:'ease-out'},
      {transform:'translateY(0) scale(1,1)'}] },
                                                  
    float:{ loop:true, keysFor:function(L){ return [{transform:'translate(0,0)'}, {transform:'translate('+(L.dx||0)+'%,'+(L.dy||0)+'%)'}, {transform:'translate(0,0)'}]; } },
                                                                                                  
                                                                                                    
    ooze: { loop:true, origin:'51% 0%', keys:[{transform:'scale(1,1)'}, {transform:'scale(1.015,1.08)'},
      {transform:'scale(.995,.97)'}, {transform:'scale(1,1)'}] },
    bob:  { loop:true, keys:[{transform:'translate(0,0) scale(1,1)'}, {transform:'translate(-3%,12%) scale(1.06,.94)'},
      {transform:'translate(0,0) scale(1,1)'}] },
                                                                                                    
    sway: { loop:true, keysFor:function(L){ return [{transform:'rotate(0deg)'}, {transform:'rotate('+L.deg+'deg)'}, {transform:'rotate(0deg)'}]; } },
    hang: { loop:true, origin:'50% 0%', keysFor:function(L){ return [{transform:'skewX(0deg)'}, {transform:'skewX('+L.deg+'deg)'}, {transform:'skewX(0deg)'}]; } },
                                                                                                   
                                                                     
    pop:  { ease:'linear', origin:'50% 100%', keys:[
      {transform:'translateY(100%) scale(.9,1.12)', easing:'cubic-bezier(.2,.7,.3,1)'},
      {offset:.38, transform:'translateY(-16%) scale(.84,1.2)', easing:'cubic-bezier(.5,0,.8,.4)'},
      {offset:.56, transform:'translateY(0) scale(1.18,.8)', easing:'ease-out'},
      {offset:.74, transform:'translateY(-3%) scale(.95,1.06)', easing:'ease-in-out'},
      {offset:.88, transform:'translateY(0) scale(1.03,.97)', easing:'ease-out'},
      {transform:'translateY(0) scale(1,1)'}] },
                                                                                                   
                                                                                     
    look: { ease:'linear', keys:[
      {transform:'translateX(0)', easing:'cubic-bezier(.3,0,.2,1)'},
      {offset:.08, transform:'translateX(-9.7%)', easing:'linear'},
      {offset:.38, transform:'translateX(-9.7%)', easing:'cubic-bezier(.3,0,.2,1)'},
      {offset:.48, transform:'translateX(4.2%)', easing:'linear'},
      {offset:.78, transform:'translateX(4.2%)', easing:'cubic-bezier(.3,0,.2,1)'},
      {offset:.86, transform:'translateX(0)'},
      {transform:'translateX(0)'}] },
                                             
    tremble: { loop:true, ease:'linear', keys:[
      {transform:'translate(0,0)'}, {transform:'translate(.25%,-.35%)'}, {transform:'translate(-.2%,.3%)'},
      {transform:'translate(.3%,.2%)'}, {transform:'translate(-.25%,-.3%)'}, {transform:'translate(.1%,.35%)'},
      {transform:'translate(0,0)'}] }
  };
                                                                                          
  function splash(x, y, n, size, reach, more){
    var o={at:{x:x, y:y}, type:'drop', n:n, ang:[-130,-50], reach:reach||[.02,.06], lift:.07, fall:.1, size:size||[.012,.02], ms:480};
    for(var k in more) o[k]=more[k];
    return o;
  }
  var SLAM=WORLD.bannerAt+200-WORLD.inMs;                                                            
  var FRAMES = [
                                                                                                      
                                                                                                       
                      
    {id:'goo',       num:1,  scene:GOO_SCENE,      in:'fade',  inMs:GOO_BEATS.fadeMs, holdMs:GOO_ENDS_AT - GOO_BEATS.fadeMs,
      hits:[[4080,'spray',{at:{x:53.9, y:69.5}, type:'goo', n:9, ang:[-160,-20], reach:[.06,.16], lift:.1, fall:.2, size:[.018,.034], ms:620}],
        [4300,'punch',{zoom:1.02, ms:240}], [4300,'pip',{x:54.1, y:61, size:.5, n:5, arc:[-150,-30]}],
        [5450,'spray',splash(29.5, 65.2, 5)], [6150,'spray',splash(64.9, 55.6, 3, [.008,.012])],
        [6850,'spray',splash(75.9, 60.3, 4)], [7550,'spray',splash(76.5, 83.8, 7, [.017,.028])]]},
                                                                                                        
                                                                                                      
                                                            
    {id:'pond',      num:2,  scene:POND_SCENE,     in:'slide', inMs:POND.inMs, holdMs:POND.endMs - POND.inMs,
      hits:[[1100,'punch',{zoom:1.015, ms:200}],
        [1110,'spray',{at:{x:53, y:51.5}, type:'puff', n:3, ang:[160,200], reach:[.07,.13], lift:.015, fall:-.02, size:[.045,.07], ms:560, endScale:1.4}],
        [1110,'spray',{at:{x:53, y:51.5}, type:'puff', n:3, ang:[-20,20], reach:[.07,.13], lift:.015, fall:-.02, size:[.045,.07], ms:560, endScale:1.4}],
        [1875,'spray',splash(54.2, 81.2, 6, [.014,.024], [.03,.08], {lift:.1, fall:.14, ms:520, ang:[-135,-45]})],
        [2125,'spray',splash(11.1, 80.8, 6, [.014,.024], [.03,.08], {lift:.1, fall:.14, ms:520, ang:[-135,-45]})],
        [2375,'spray',splash(82.3, 96, 8, [.018,.03], [.03,.08], {lift:.1, fall:.14, ms:520, ang:[-135,-45]})],
        [2680,'pip',{x:58.3, y:72, size:.22}], [2680,'punch',{zoom:1.012, ms:200}],
        [2930,'pip',{x:15.9, y:69.5, size:.22}], [2930,'punch',{zoom:1.02, ms:200}],
        [3180,'pip',{x:78.4, y:81.9, size:.26}], [3180,'punch',{zoom:1.03, ms:240}]]},
                                                             
    {id:'ears',      num:3,  scene:EARS_SCENE,     in:'slide', inMs:350, holdMs:2100,
      hits:[[400,'punch',{zoom:1.015, ms:110}], [510,'punch',{zoom:1.022, ms:220}]]},
                                                                                                    
                                                                                                    
    {id:'shock',     num:4,  scene:SHOCK_SCENE,    in:'cut',   inMs:0,   holdMs:1300,
      camTl:[[0, {zoom:1, x:49, y:54}], [180, {zoom:1, x:49, y:54}, 'cubic-bezier(.15,.9,.25,1)'], [270, {zoom:1.12, x:49, y:54}], [1300, {zoom:1.12, x:49, y:54}]],
      hits:[[180,'trauma',.5], [180,'focus',{x:49, y:54, r:.4, ms:900, alpha:.85}],
        [230,'spray',{at:{x:48.6, y:46.9}, type:'sweat', n:4, ang:[-160,-20], reach:[.14,.22], lift:.08, fall:.1, size:[.03,.042], ms:560, align:true}]]},
                                                                                                          
                                                      
    {id:'pounce',    num:5,  src:A+'f04.webp',     in:'cut',   inMs:0,   holdMs:900,
      camTl:[[0, {zoom:1.22, x:57.8, y:57.5}, 'cubic-bezier(.1,.9,.2,1)'], [130, {zoom:1, x:50, y:50}], [900, {zoom:1, x:50, y:50}]],
      hits:[[0,'flash',{peak:.55, ms:140}], [0,'stop',50], [0,'trauma',.85], [30,'pop',{x:55, y:61, size:.8, glow:false, rings:false, sparks:0, rocks:12}]]},
    {id:'swarm',     num:6,  src:A+'f05.webp',     in:'cut',   inMs:0,   holdMs:800,
      camTl:[[0, {zoom:1, x:56, y:53}, 'cubic-bezier(.15,.9,.25,1)'], [80, {zoom:1.08, x:56, y:53}], [800, {zoom:1.08, x:56, y:53}]],
      hits:[[0,'trauma',.6]]},
                                                                                                       
    {id:'horror',    num:7,  src:A+'f06.webp',     in:'cut',   inMs:0,   holdMs:1100, rumble:true,
      camTl:[[0, {zoom:1, x:54, y:51}, 'cubic-bezier(.15,.9,.25,1)'], [80, {zoom:1.12, x:54, y:51}], [1100, {zoom:1.12, x:54, y:51}]],
      hits:[[0,'trauma',.45], [120,'spray',{at:{x:60, y:30}, type:'sweat', n:3, ang:[-150,-30], reach:[.12,.2], lift:.05, fall:.12, size:[.035,.045], ms:620, align:true}],
        [150,'gloom',{ms:300}], [800,'iris',{x:53, y:50, ms:300}]]},
                                                                                                      
                            
    {id:'gulp',      num:8,  scene:EYES_SCENE,     in:'cut',   inMs:0,   holdMs:2400,
      camTl:[[0, {zoom:1, x:50, y:38}], [2000, {zoom:1, x:50, y:38}, 'cubic-bezier(.5,0,.8,.4)'], [2160, {zoom:1.12, x:50, y:38}], [2400, {zoom:1.12, x:50, y:38}]],
      hits:[[380,'thump'], [1640,'thump']]},
                                                                                                   
                                                                                                    
                                                                                                    
                                                                                         
    {id:'digest',    num:9,  scene:DIGEST_SCENE,   in:'fade',  inMs:500, holdMs:2700, impact:{x:52, y:68},
      hits:[[650,'punch'], [2600,'charge',{ms:600}], [2700,'trauma',{t:.5, ms:500, build:true}]]},
    {id:'sprout',    num:10, scene:EARS_POP_SCENE, in:'cut',   inMs:280, holdMs:1900, reveal:{x:52, y:62}, impact:{x:52, y:59},
      hits:[[0,'flash',{peak:.95, ms:420}], [0,'stop',70], [0,'pop',{size:.7}], [0,'trauma',.6],
        [1480,'glint',{x:68.75, y:60.5, size:.09}], [2030,'windup']]},
    {id:'whip',      num:11, src:A+'f09b.webp',    in:'whip',  inMs:170, holdMs:0,    slideEase:'cubic-bezier(.55,0,1,.45)'},
                                                                                               
    {id:'tail',      num:12, scene:TAIL_SCENE,     in:'whip',  inMs:260, holdMs:1300, slideEase:'cubic-bezier(0,.55,.45,1)',
      rumble:true, rumbleAt:1000, rumbleMs:90,
      hits:[[-70,'settle'], [630,'glint',{x:31.4, y:60.3, size:.09}], [1230,'black',{ms:100}]]},
                                                                                                        
                                                                                                   
                                                                                                      
                                                                                                       
                                                                                       
    {id:'bonk',      num:13, scene:BONK_SCENE,     in:'cut',   inMs:0,   holdMs:BONK.endMs, impact:{x:48, y:55},
      camTl:[[0, {zoom:1, x:48, y:55}], [BONK.hitAt, {zoom:1, x:48, y:55}, 'cubic-bezier(.2,.8,.3,1)'],
        [BONK.hitAt+60, {zoom:1.1, x:48, y:55}, 'cubic-bezier(.3,0,.2,1)'], [BONK.hitAt+420, {zoom:1, x:48, y:55}]],
      hits:[[BONK.hitAt,'trauma',.6], [BONK.hitAt,'stop',70], [BONK.hitAt,'flash',{peak:.85, ms:150}], [BONK.hitAt+60,'invert'],
        [BONK.hitAt+90,'impact',{glow:false, rings:false, lines:false, sparks:10, rocks:0}], [BONK.endMs - 130,'whiteout']]},
                                                                                                               
                                                                                                
    {id:'merged',    num:14, scene:MERGED_SCENE,   in:'cut',   inMs:0,   holdMs:MERGED.endMs, impact:{x:48, y:58},
      camTl:[[0, {zoom:2.3, cx:48, cy:60}], [300, {zoom:2.3, cx:48, cy:60}, 'cubic-bezier(.45,0,.2,1)'], [1600, {zoom:1, x:50, y:50}]],
      hits:[[0,'bigflash'], [220,'pop',{rocks:0}], [220,'shake'], [1600,'punch',{zoom:1.025, ms:280}],
        [1600,'spray',{at:{x:52, y:56}, type:'sparkle', n:8, ang:[-165,-15], reach:[.2,.34], lift:.06, fall:-.03, size:[.04,.07], spin:180, ms:900}],
        [1800,'glint',{x:38.9, y:45.3, size:.08}], [1900,'glint',{x:61.5, y:45.9, size:.08}]]},
                                                                              
    {id:'horde',     num:15, src:A+'f12.webp',     in:'cut',   inMs:0,   holdMs:1800, bounce:3,
      hits:[[0,'punch'], [529,'pip',{x:16.2, y:34.6, size:.3}], [529,'pip',{x:83.3, y:36.3, size:.3}], [909,'pip',{x:47.8, y:39.1, size:.28}],
        [1289,'pip',{x:27.8, y:56.4, size:.34}], [1289,'pip',{x:88, y:58.2, size:.34}]]},
                                                                                                        
                                                                                                          
                                                                                                       
                                                                                          
                                                                                                         
                                             
    {id:'forest',    num:16, src:A+'f13.webp',     in:'slide', inMs:400, holdMs:1500,
      hits:[[-70,'settle'], [360,'punch',{zoom:1.03, ms:260}], [360,'focus',{x:47, y:44, r:.55, ms:550, alpha:.8}],
        [360,'pip',{x:24.3, y:65.9, size:.3}], [430,'pip',{x:49.3, y:69.1, size:.24}], [500,'pip',{x:85.4, y:67.5, size:.3}], [1350,'windup']]},
    {id:'whip2',     num:17, src:A+'f09b.webp',    in:'whip',  inMs:170, holdMs:0,    slideEase:'cubic-bezier(.55,0,1,.45)'},
    {id:'river',     num:18, src:A+'f14.webp',     in:'whip',  inMs:260, holdMs:1400, slideEase:'cubic-bezier(0,.55,.45,1)',
      hits:[[-70,'settle'], [360,'punch',{zoom:1.03, ms:260}], [360,'focus',{x:45, y:40, r:.55, ms:550, alpha:.8}],
        [360,'pip',{x:22.2, y:67.8, size:.3}], [430,'pip',{x:85.4, y:69.7, size:.3}], [1250,'windup']]},
    {id:'whip3',     num:19, src:A+'f09b.webp',    in:'whip',  inMs:170, holdMs:0,    slideEase:'cubic-bezier(.55,0,1,.45)'},
    {id:'arctic',    num:20, src:A+'f14b.webp',    in:'whip',  inMs:260, holdMs:1400, slideEase:'cubic-bezier(0,.55,.45,1)',
      hits:[[-70,'settle'], [360,'punch',{zoom:1.03, ms:260}], [360,'focus',{x:48, y:41, r:.55, ms:550, alpha:.8}],
        [360,'pip',{x:22.9, y:67.1, size:.3}], [430,'pip',{x:85.1, y:69.4, size:.3}], [1250,'windup']]},
    {id:'whip4',     num:21, src:A+'f09b.webp',    in:'whip',  inMs:170, holdMs:0,    slideEase:'cubic-bezier(.55,0,1,.45)'},
                                                                                                        
                                                                                                       
                                                         
    {id:'conquer',   num:22, scene:CONQUER_SCENE,  in:'whip',  inMs:WORLD.inMs, holdMs:WORLD.endMs - WORLD.inMs,
      slideEase:'cubic-bezier(0,.55,.45,1)',
      hits:[[-70,'settle'],
        [310,'pip',{x:20.5, y:71.6, size:.24}], [430,'pip',{x:49, y:75.8, size:.2}], [550,'pip',{x:79.9, y:71.6, size:.24}],
        [SLAM,'flash',{peak:.7, ms:300}], [SLAM,'stop',90], [SLAM,'trauma',.9],
        [SLAM,'pop',{x:50.5, y:16.5, size:1.1, lines:true, rocks:0, sparks:10, followTop:true}],
        [SLAM,'spray',{at:{x:10.4, y:21.9}, type:'confetti', n:18, ang:[-80,-25], reach:[.25,.55], lift:.35, fall:1.5, size:[.018,.026], spin:540, tumble:true, ms:2300, followTop:true}],
        [SLAM,'spray',{at:{x:89.6, y:21.9}, type:'confetti', n:18, ang:[-155,-100], reach:[.25,.55], lift:.35, fall:1.5, size:[.018,.026], spin:540, tumble:true, ms:2300, followTop:true}],
        [SLAM+300,'spray',{rain:true, type:'confetti', n:28, fall:1.1, sway:.05, ms:[2600,3400], over:2800, size:[.016,.024], spin:360, tumble:true}],
        [1482,'pip',{x:20.5, y:72.1, size:.28}], [1552,'pip',{x:49, y:76.2, size:.24}], [1622,'pip',{x:80, y:72, size:.28}],
        [4740,'barDone'], [4740,'punch',{zoom:1.02, ms:240}]],
      loading:{atMs:WORLD.loadingAt - WORLD.inMs, ms:WORLD.loadingMs}, blackoutMs:700, blackHoldMs:400}
  ];
  var PARAMS = {
    endFadeMs:800, punchMs:320, punchZoom:1.035, flashMs:380, flashPeak:.85,
    bounceMs:340, rumbleMs:180, loadingInMs:300, decodeWaitMs:300, readyWaitMs:1000, buildLeadMs:250, chainLeadMs:60,
    trauma:{ zoom:.085, x:2.2, y:1.6, rot:.9, stepMs:33 },                                                  
    slideEase:'cubic-bezier(.22,.8,.24,1)', slideUnderX:-28, slideUnderDim:.5,
    carouselScale:.88, carouselRadius:22, carouselWhipEase:'cubic-bezier(.75,0,.25,1)',
    bigFlashHoldMs:60, bigFlashMs:520, whiteoutMs:130, whiteoutHoldMs:120, invertMs:110,
    impact:{ glowMs:600, ringMs:780, ringGapMs:110, linesMs:700, sparks:18, sparkMs:950, rocks:10, rockMs:850, cleanupMs:1800 },
    preloadAhead:4,                                                                           
                                                                                
                                                                                                    
                                                                                                    
    newsReport:false
  };

  var _root=null, _shot=null, _flash=null, _gold=null, _black=null, _timer=null, _playing=false;

  function reducedMotion(){
    try{ return g.matchMedia('(prefers-reduced-motion: reduce)').matches; }catch(e){ return false; }
  }

                                         
  function forcedStart(){
    try{
      var q=new URLSearchParams(g.location.search);
      if(!q.has('intro')) return 0;
      var n=parseInt(q.get('intro'),10);
      return n>0 ? n : 1;
    }catch(e){ return 0; }
  }

  function shouldPlay(){
    if(forcedStart()) return true;
    try{ if(new URLSearchParams(g.location.search).get('loop0')==='auto') return false; }catch(e){}                                     
    if(typeof state==='undefined' || !state || state.introCinematicSeen) return false;
    if(!(g.FtueSteps && FtueSteps.cinematicActive())) return false;                                
    return !(state.totalHatched>0) && !(state.frogs||[]).length;                                                   
  }

  function camTransform(c){
    var z=c.zoom||1, x=c.x, y=c.y;
                                                                                                  
                                                                  
    if(c.cx!=null && z>1){
      x=Math.max(0,Math.min(100,(c.cx*z-50)/(z-1)));
      y=Math.max(0,Math.min(100,(c.cy*z-50)/(z-1)));
    }
    var tx=-(x-50)*(z-1), ty=-(y-50)*(z-1);
    return 'translate('+tx.toFixed(3)+'%,'+ty.toFixed(3)+'%) scale('+z+')';
  }

  function load(f){ return f.scene ? loadScene(f.scene) : loadImage(f.src); }

                                                                                                      
                                                                                                    
  function loaded(img, src){
    return new Promise(function(resolve){
      img.onload=function(){
        var done=function(){ resolve(true); };
        if(img.decode) img.decode().then(done, done);
        setTimeout(done, PARAMS.decodeWaitMs);
      };
      img.onerror=function(){ console.warn('[intro-cinematic] scene layer missing:', src); resolve(false); };
      img.src=src;
    });
  }
                                                                                                    
                                                                                                   
                                                                                     
  function loadScene(S){
    var el=document.createElement('div'), loads=[];
    el.className='ic-frame ic-scene'; el.dataset.w=S.w; el.dataset.h=S.h;
    if(S.bg) el.style.background=S.bg;
    (function place(layers, parent, box){
      layers.forEach(function(L){
        var node;
        if(L.layers){ node=document.createElement('div'); node.className='sc-layer sc-group'+(L.clip?' sc-clip':''); }
        else if(L.ring){ node=document.createElement('div'); node.className='sc-layer sc-ring'; }
        else if(L.fill){ node=document.createElement('div'); node.className='sc-layer'; node.style.background=L.fill; }
        else {
          node=new Image(); node.alt=''; node.draggable=false; node.className='sc-layer';
          loads.push(loaded(node, L.src));
        }
        node.style.left=((L.x-box.x)/box.w*100)+'%'; node.style.top=((L.y-box.y)/box.h*100)+'%';
        node.style.width=(L.w/box.w*100)+'%'; node.style.height=(L.h/box.h*100)+'%';
        if(L.hidden) node.style.opacity=0;
        node._move=L;
        parent.appendChild(node);
        if(L.layers) place(L.layers, node, L);
      });
    })(S.layers, el, {x:0, y:0, w:S.w, h:S.h});
    return Promise.all(loads).then(function(ok){ return ok.every(Boolean) ? el : null; });
  }
                                                                                                         
                                                                                                  
  function fitScene(el){
    var r=_root.getBoundingClientRect(), w=+el.dataset.w, h=+el.dataset.h, k=Math.max(r.width/w, r.height/h),
      cropTop=(h*k-r.height)/2;
    el.style.width=(w*k)+'px'; el.style.height=(h*k)+'px';
    el._keepDy=0;                                                                      
    Array.prototype.forEach.call(el.children, function(node){
      var L=node._move;
      if(!L || L.keepTop==null) return;
      var top=Math.max(L.y, (cropTop+L.keepTop)/k);
      el._keepDy=top-L.y; node.style.top=(top/h*100)+'%';
    });
  }
                                                                                         
  function timelineKeys(tl){
    var end=tl[tl.length-1][0]||1;
    return { ms:end, keys:tl.map(function(k){
      var o={offset:k[0]/end};
      for(var p in k[1]) o[p]=k[1][p];
      if(k[2]) o.easing=k[2];
      return o;
    }) };
  }
                                                                                                 
                                                                                                     
                                                                                                       
  function startSceneMoves(el){
    var reduce=reducedMotion();
    Array.prototype.forEach.call(el.querySelectorAll('.sc-layer'), function(node){
      var L=node._move;
      if(!L || (L.deco && reduce)) return;                                                              
      if(L.tl){
        var T=timelineKeys(L.tl);
        if(L.origin) node.style.transformOrigin=L.origin;
        node.animate(T.keys, {duration:T.ms, easing:'linear', fill:'both'});
        return;
      }
      var M=SCENE_MOVES[L.move];
      if(!M) return;
      if(L.origin || M.origin) node.style.transformOrigin=L.origin || M.origin;
                                                                                        
      node.animate(M.keysFor ? M.keysFor(L) : M.keys, {duration:L.ms, delay:L.delayMs||0, easing:M.ease||'ease-in-out',
        iterations:M.loop?Infinity:1, fill:M.loop?'none':'both'});
    });
  }

  function loadImage(src){
    return new Promise(function(resolve){
      var img=new Image();
      img.alt=''; img.draggable=false; img.className='ic-frame';
                                                                                             
                                                                                              
      img.onload=function(){
        var done=function(){ resolve(img); };
        if(img.decode) img.decode().then(done, done);
        setTimeout(done, PARAMS.decodeWaitMs);
      };
      img.onerror=function(){ console.warn('[intro-cinematic] no art yet, skipping frame:', src); resolve(null); };
      img.src=src;
    });
  }

  function mount(){
    _root=document.createElement('div');
    _root.id='intro-cine';
    _root.setAttribute('role','dialog');
    _root.setAttribute('aria-label','Intro');
                                                                                                        
    _root.innerHTML='<div class="ic-flash ic-flash--black"></div><div class="ic-flash ic-flash--gold"></div><div class="ic-flash"></div>'
      +'<button class="ic-skip" type="button">Skip \u{23ED}</button>';
    _black=_root.querySelector('.ic-flash--black'); _gold=_root.querySelector('.ic-flash--gold');
    _flash=_root.querySelector('.ic-flash:not(.ic-flash--black):not(.ic-flash--gold)');
    _root.querySelector('.ic-skip').addEventListener('click', finish);
    document.body.appendChild(_root);
  }

                                                                                       
  function newShot(){
    var shot=document.createElement('div'), cam=document.createElement('div'), fx=document.createElement('div');
    shot.className='ic-shot'; cam.className='ic-cam'; fx.className='ic-fx';
    cam.appendChild(fx); shot.appendChild(cam); _root.insertBefore(shot, _black);
    return {el:shot, cam:cam, fx:fx, anim:null};
  }

                                                                                                    
  function carouselKeys(fromX, toX){
    var card=' scale('+PARAMS.carouselScale+')', r=PARAMS.carouselRadius+'px';
    return [
      {transform:'translateX('+fromX+'%) scale(1)', borderRadius:'0px', easing:'ease-out'},
      {offset:.22, transform:'translateX('+fromX+'%)'+card, borderRadius:r, easing:PARAMS.carouselWhipEase},
      {offset:.78, transform:'translateX('+toX+'%)'+card, borderRadius:r, easing:'ease-out'},
      {transform:'translateX('+toX+'%) scale(1)', borderRadius:'0px'}
    ];
  }

                                                                                                       
                                                        
  function picturePoint(img, px, py){
    var r=_root.getBoundingClientRect(), w=+(img.dataset.w||img.naturalWidth), h=+(img.dataset.h||img.naturalHeight),
      k=Math.max(r.width/w, r.height/h);
    return {x:(r.width-w*k)/2 + px/100*w*k, y:(r.height-h*k)/2 + py/100*h*k, W:r.width};
  }
                                                                                                      
                                                                                                        
                                                                                                      
                         
  function fxBox(host, x, y, after){
    var box=document.createElement('div');
    box.className='ic-impact'; box.style.left=x+'px'; box.style.top=y+'px';
    host.appendChild(box);
    setTimeout(function(){ box.remove(); }, after);
    return box;
  }
                                                                      
  var SPARK=A+'f02_sparkle.webp', FX_GLOW=A+'fx_glow.webp', FX_LINES=A+'fx_lines.webp', FX_GLOOM=A+'fx_gloom.webp', SPARK_H=207/152;
  function fxPiece(box, cls, w, h, src){
    var e=document.createElement(src ? 'img' : 'div'); e.className=cls;
    if(src){ e.src=src; e.alt=''; }
    e.style.width=w+'px'; e.style.height=h+'px'; e.style.marginLeft=(-w/2)+'px'; e.style.marginTop=(-h/2)+'px';
    box.appendChild(e); return e;
  }
                                                                                                     
                                                                                                    
                                                                                                       
                                                                               
  function impactFX(shot, img, pt, delay, size, o){
    var P=picturePoint(img, pt.x, pt.y), W=P.W*size, I=PARAMS.impact, box=fxBox(shot.fx, P.x, P.y, delay+I.cleanupMs),
      sparks=o.sparks!=null ? o.sparks : I.sparks, rocks=o.rocks!=null ? o.rocks : I.rocks;
    function piece(cls, d, src){ return fxPiece(box, cls, d, d, src); }
    if(o.glow!==false) piece('ic-imp-glow', W*1.3, FX_GLOW).animate([{transform:'scale(.15)', opacity:1}, {offset:.25, transform:'scale(1)', opacity:.95},
      {transform:'scale(1.5)', opacity:0}], {duration:I.glowMs, delay:delay, easing:'ease-out'});
    if(o.rings!==false) ['', ' ic-imp-ring--gold', ' ic-imp-ring--thin'].forEach(function(mod, k){
      var ring=piece('ic-imp-ring'+mod, W*.7);
      ring.style.borderWidth=(W*.7*(k===2 ? .022 : .051)).toFixed(1)+'px';                               
      ring.animate([{transform:'scale(.1)', opacity:1}, {offset:.6, opacity:.9}, {transform:'scale(2.6)', opacity:0}],
        {duration:I.ringMs, delay:delay+k*I.ringGapMs, easing:'cubic-bezier(.1,.7,.3,1)'});
    });
    if(o.lines) piece('ic-imp-lines', P.W*2.6, FX_LINES).animate([{opacity:0, transform:'rotate(0deg) scale(.8)'},
      {offset:.08, opacity:1, transform:'rotate(4deg) scale(1)'}, {offset:.25, opacity:.6, transform:'rotate(-3deg) scale(1.04)'},
      {offset:.4, opacity:1, transform:'rotate(6deg) scale(1.07)'}, {offset:.6, opacity:.55, transform:'rotate(-2deg) scale(1.1)'},
      {offset:.72, opacity:.9, transform:'rotate(3deg) scale(1.12)'}, {opacity:0, transform:'rotate(0deg) scale(1.18)'}],
      {duration:I.linesMs, delay:delay, easing:'linear'});
    var i, ang, reach, d, dx, dy;
    for(i=0; i<sparks; i++){                                                                         
      ang=(i/sparks*360 + ((i*53)%25-12))*Math.PI/180; reach=W*(.45+((i*37)%30)/100); d=W*(.08+((i*17)%5)*.012);
      dx=Math.cos(ang)*reach; dy=Math.sin(ang)*reach;
      fxPiece(box, 'ic-imp-spark', d, d*SPARK_H, SPARK).animate([{transform:'translate(0,0) scale(.2) rotate(0deg)', opacity:1}, {offset:.65, opacity:1},
        {transform:'translate('+dx.toFixed(1)+'px,'+dy.toFixed(1)+'px) scale(1) rotate('+(i%2 ? 220 : -220)+'deg)', opacity:0}],
        {duration:I.sparkMs+(i%4)*120, delay:delay, easing:'cubic-bezier(.1,.8,.3,1)'});
    }
    for(i=0; i<rocks; i++){                                                 
      ang=(i/rocks*360 + 17 + ((i*41)%30-15))*Math.PI/180; reach=W*(.3+((i*29)%25)/100); d=W*(.025+(i%3)*.012);
      dx=Math.cos(ang)*reach; dy=Math.sin(ang)*reach;
      piece('ic-imp-rock', d).animate([{transform:'translate(0,0) rotate(0deg)', opacity:1},
        {offset:.4, transform:'translate('+(dx*.6).toFixed(1)+'px,'+(dy*.6-W*.14).toFixed(1)+'px) rotate('+(i%2 ? 140 : -140)+'deg)', opacity:1},
        {offset:.85, opacity:1}, {transform:'translate('+dx.toFixed(1)+'px,'+(dy+W*.28).toFixed(1)+'px) rotate('+(i%2 ? 320 : -320)+'deg)', opacity:0}],
        {duration:I.rockMs+(i%3)*100, delay:delay, easing:'cubic-bezier(.2,.6,.6,1)'});
    }
  }
                                                                                       
                                                                                                     
                                                                                                        
                                                                                                     
                                                                                                       
                                                                                                   
                                                                                                         
                                                               
  var SPRAY_H={confetti:1.7, sparkle:207/152, drop:1.15}, CONFETTI=['#ffd84a','#59de1c','#ff6fa8','#4fc3ff','#ffffff','#ff9f2e'];
  function sprayFX(shot, img, o, delay){
    var r=_root.getBoundingClientRect(), Wd=r.width, Hd=r.height, n=o.n, host=shot.fx, x0=0, y0=0;
    if(o.host==='loading'){ host=shot.el.querySelector('.ic-loading'); if(!host) return; x0=o.px.x; y0=o.px.y; }
    else if(!o.rain){ var P=picturePoint(img, o.at.x, o.at.y); x0=P.x; y0=P.y; }
    var longest=o.rain ? o.ms[1]+(o.over||0) : o.ms+160+(o.over||0), box=fxBox(host, x0, y0, delay+longest+400);
    for(var i=0; i<n; i++){
      var j=function(k){ return ((i*37+k*17)%29)/28; },
        w=Wd*(o.size[0]+(o.size[1]-o.size[0])*j(2)), h=w*(SPRAY_H[o.type]||1),
        e=fxPiece(box, 'ic-sp'+(o.type==='sparkle' ? '' : ' ic-sp--'+o.type), w, h, o.type==='sparkle' ? SPARK : null),
        spin=(o.spin||0)*(i%2 ? 1 : -1), del=delay+(o.over ? i/n*o.over : 0),
        tum=function(off){ return o.tumble ? ' rotateX('+(1.5*spin*off).toFixed(0)+'deg)' : ''; };
      if(o.type==='confetti') e.style.background=CONFETTI[i%6];
      if(o.rain){
        var x=j(0)*Wd, y=-.03*Hd, sw=(i%2 ? 1 : -1)*o.sway*Wd, F=o.fall*Hd,
          tr=function(px, py, off){ return 'translate('+px.toFixed(1)+'px,'+py.toFixed(1)+'px) rotate('+(spin*off).toFixed(0)+'deg)'+tum(off); };
        e.animate([{transform:tr(x, y, 0), opacity:1}, {offset:.33, transform:tr(x+sw, y+.33*F, .33), opacity:1},
          {offset:.66, transform:tr(x-sw, y+.66*F, .66), opacity:1}, {transform:tr(x, y+F, 1), opacity:1}],
          {duration:o.ms[0]+(o.ms[1]-o.ms[0])*j(1), delay:del, easing:'linear'});
      } else {
        var a=o.ang[0]+(o.ang[1]-o.ang[0])*(n>1 ? i/(n-1) : .5)+6*(2*j(0)-1), ra=a*Math.PI/180,
          reach=Wd*(o.reach[0]+(o.reach[1]-o.reach[0])*j(1)), dx=Math.cos(ra)*reach, dy=Math.sin(ra)*reach,
          r0=o.align ? a+225 : 0, lift=(o.lift||0)*Wd, fall=(o.fall||0)*Wd,
          t=function(px, py, rot, sc, off){ return 'translate('+px.toFixed(1)+'px,'+py.toFixed(1)+'px) rotate('+rot.toFixed(0)+'deg) scale('+sc+')'+tum(off); };
        e.animate([{transform:t(0, 0, r0, .4, 0), opacity:1}, {offset:.4, transform:t(.6*dx, .6*dy-lift, r0+.4*spin, 1, .4), opacity:1},
          {offset:.85, opacity:1}, {transform:t(dx, dy+fall, r0+spin, o.endScale||.8, 1), opacity:0}],
          {duration:o.ms+(i%3)*80, delay:del, easing:'cubic-bezier(.2,.6,.6,1)'});
      }
    }
  }
                                                                                                        
                                            
  function pipFX(shot, img, o, delay){
    var P=picturePoint(img, o.x, o.y), W=P.W*o.size, n=o.n||7, box=fxBox(shot.fx, P.x, P.y, delay+900);
    if(!o.arc){
      var d=.5*W, ring=fxPiece(box, 'ic-imp-ring ic-imp-ring--thin', d, d);
      ring.style.borderWidth=Math.max(2, .08*d)+'px';
      ring.animate([{transform:'scale(.2)', opacity:1}, {transform:'scale(1.6)', opacity:0}], {duration:300, delay:delay, easing:'cubic-bezier(.1,.7,.3,1)'});
    }
    for(var i=0; i<n; i++){
      var a=o.arc ? o.arc[0]+(o.arc[1]-o.arc[0])*i/(n-1) : i*360/n-77, R='rotate('+(a+90)+'deg) ';
      fxPiece(box, 'ic-pip-tick', .075*W, .24*W).animate([{transform:R+'translateY('+(-.2*W).toFixed(1)+'px) scaleY(.3)', opacity:1},
        {offset:.35, transform:R+'translateY('+(-.45*W).toFixed(1)+'px) scaleY(1)', opacity:1},
        {transform:R+'translateY('+(-.62*W).toFixed(1)+'px) scaleY(.15)', opacity:0}], {duration:300, delay:delay, easing:'cubic-bezier(.2,.8,.3,1)'});
    }
  }
                                                                                        
  function glintFX(shot, img, o, delay){
    var P=picturePoint(img, o.x, o.y), d=P.W*o.size, box=fxBox(shot.fx, P.x, P.y, delay+800);
    fxPiece(box, 'ic-glint', d, d*SPARK_H, SPARK).animate([{transform:'scale(0) rotate(-40deg)', opacity:1},
      {offset:.35, transform:'scale(1.2) rotate(10deg)', opacity:1}, {offset:.6, transform:'scale(.9) rotate(25deg)', opacity:1},
      {transform:'scale(0) rotate(60deg)', opacity:0}], {duration:340, delay:delay, easing:'ease-out'});
    var ring=fxPiece(box, 'ic-imp-ring ic-imp-ring--thin', 1.4*d, 1.4*d);
    ring.style.borderWidth='2px';
    ring.animate([{transform:'scale(.3)', opacity:.9}, {transform:'scale(1.3)', opacity:0}], {duration:260, delay:delay});
  }
                                                                                                     
                                                                                                      
                                                
  function focusFX(shot, img, o, delay){
    var P=picturePoint(img, o.x, o.y), alpha=o.alpha||.9, ms=o.ms, step=70, d=2*P.W*o.r/.3,
      box=fxBox(shot.fx, P.x, P.y, delay+ms+60);
    [0, 1].forEach(function(k){
      var keys=[], e=fxPiece(box, 'ic-focus', d, d, FX_LINES);
      for(var s=0; s*step<ms-120; s++) keys.push({offset:s*step/ms, opacity:(s+k)%2 ? .2*alpha : alpha, easing:'step-end'});
      keys.push({offset:(ms-120)/ms, opacity:.8*alpha}, {offset:1, opacity:0});
      e.style.transform='rotate('+(k ? 3.25 : 0)+'deg)';
      e.animate(keys, {duration:ms, delay:delay, easing:'linear'});
    });
  }
                                                                                                    
                                                                                                       
  function traumaFX(shot, delay, opt){
    var o=typeof opt==='number' ? {t:opt} : opt, t=o.t, T=PARAMS.trauma, dur=o.ms||Math.round(220+480*t),
      n=Math.max(6, Math.round(dur/T.stepMs)), keys=[],
      N=function(i, k){ var v=Math.sin(i*12.9898+k*78.233)*43758.5453; return (v-Math.floor(v))*2-1; };
    for(var i=0; i<n; i++){
      var p=i/n, env=o.build ? p*p : (1-p)*(1-p), A=t*t*env;
      keys.push({offset:p, transform:'scale('+(1+T.zoom*A).toFixed(4)+') translate('+(T.x*A*N(i,1)).toFixed(3)+'%,'+
        (T.y*A*N(i,2)).toFixed(3)+'%) rotate('+(T.rot*A*N(i,3)).toFixed(3)+'deg)'});
    }
    keys.push({offset:1, transform:'scale(1) translate(0%,0%) rotate(0deg)'});
    beat(shot.fx, keys, {duration:dur, delay:delay, easing:'linear'});
  }

                                                                                                    
                                                                                                      
                                                                                                  
                                                                                                      
                                                                                            
                                                                                                       
                                                                                                      
               
  var BUILDS={spray:1, pip:1, glint:1, focus:1, charge:1, impact:1, pop:1, barDone:1};
  function schedule(shot, at, kind, f, img, opt){
    var lead=BUILDS[kind] ? PARAMS.buildLeadMs : 0;
    if(at<=lead) return hit(shot, kind, Math.max(0, at), f, img, opt);
    var s=shot.fx.animate([], {duration:1, delay:at-lead-1});
    s.onfinish=function(){
      if(!_playing || !shot.el.isConnected) return;
      var left=(s.startTime!=null && document.timeline.currentTime!=null) ? s.startTime+at-document.timeline.currentTime : 0;
      hit(shot, kind, Math.max(0, left), f, img, opt);
    };
  }
  function beat(el, keys, o){
    var props=keys.reduce(function(p, k){ for(var q in k) if(q!=='offset' && q!=='easing' && q!=='composite') p[q]=1; return p; }, {});
    el.getAnimations().forEach(function(a){
      if(a.playState!=='running' || !a.effect) return;
      if(a.effect.getKeyframes().some(function(k){ for(var q in props) if(k[q]!=null) return true; return false; })) a.cancel();
    });
    return el.animate(keys, o);
  }

                                                                                           
  function hit(shot, kind, delay, f, img, opt){
    opt=opt||{};
    if(opt.followTop && img._keepDy){                                                         
      var dy=img._keepDy/(+img.dataset.h)*100;
      opt=Object.assign({}, opt);
      if(opt.at) opt.at={x:opt.at.x, y:opt.at.y+dy}; else if(opt.y!=null) opt.y+=dy;
    }
    if(kind==='flash'){
      beat(_flash, [{opacity:opt.peak||PARAMS.flashPeak}, {opacity:0}], {duration:opt.ms||PARAMS.flashMs, delay:delay, easing:'ease-out'});
      return;
    }
    if(kind==='black'){                                          
      beat(_black, [{opacity:1}, {opacity:1}], {duration:opt.ms, delay:delay});
      return;
    }
    if(kind==='trauma' || kind==='shake' || kind==='bigshake'){
      traumaFX(shot, delay, kind==='trauma' ? opt : (kind==='shake' ? .56 : .84));
      return;
    }
    if(kind==='stop'){                                                                                    
      var freeze=function(){                                                           
        if(!_playing || !shot.el.isConnected) return;
        var held=shot.el.getAnimations({subtree:true}).filter(function(a){
          return a.playState==='running' && a.effect && a.effect.target!==shot.el; });
        held.forEach(function(a){ a.pause(); });
        setTimeout(function(){ held.forEach(function(a){ if(a.playState==='paused') a.play(); }); }, opt);
      };
      if(delay>0) shot.fx.animate([], {duration:1, delay:delay-1}).onfinish=freeze; else freeze();
      return;
    }
    if(kind==='bounce'){                                                                                     
      var n=f.bounce, crouch='translateY(.5%) scale(1.06,1.02)', up='translateY(-1.6%) scale(1.03,1.07)',                 
        down='translateY(0) scale(1.07,1.025)', keys=[{offset:0, transform:'translateY(0) scale(1,1)', easing:'ease-out'}];          
      for(var b=0; b<n; b++){ var o0=b/n, s1=1/n;                                                                   
        keys.push({offset:o0+.16*s1, transform:crouch, easing:'cubic-bezier(.2,.6,.4,1)'}, {offset:o0+.55*s1, transform:up, easing:'cubic-bezier(.6,0,.8,.4)'},
          {offset:o0+.84*s1, transform:down, easing:'ease-out'});
      }
      keys.push({offset:1, transform:'translateY(0) scale(1,1)'});
      beat(shot.fx, keys, {duration:PARAMS.bounceMs*n+120, delay:delay, easing:'linear'});
      return;
    }
    if(kind==='spray'){ sprayFX(shot, img, opt, delay); return; }
    if(kind==='pip'){ pipFX(shot, img, opt, delay); return; }
    if(kind==='glint'){ glintFX(shot, img, opt, delay); return; }
    if(kind==='focus'){ focusFX(shot, img, opt, delay); return; }
    if(kind==='charge'){                                                                      
      var C=picturePoint(img, f.impact.x, f.impact.y), cb=fxBox(shot.fx, C.x, C.y, delay+opt.ms+3000), cd=C.W*1.2;
      fxPiece(cb, 'ic-imp-glow', cd, cd, FX_GLOW).animate([{transform:'scale(.15)', opacity:0}, {offset:.75, transform:'scale(.85)', opacity:.6},
        {transform:'scale(1.1)', opacity:.85}], {duration:opt.ms, delay:delay, easing:'ease-in', fill:'forwards'});
      return;
    }
    if(kind==='gloom'){                                                                          
      var gl=new Image(); gl.className='ic-gloom'; gl.alt=''; gl.src=FX_GLOOM; shot.fx.appendChild(gl); shot.gloom=gl;
      beat(gl, [{transform:'scaleY(0)', opacity:.5}, {transform:'scaleY(1)', opacity:1}], {duration:opt.ms, delay:delay, easing:'cubic-bezier(.2,.7,.3,1)', fill:'both'});
      return;
    }
    if(kind==='iris'){                                                                                     
      var at=' at '+opt.x+'% '+opt.y+'%';                                                                  
      img.animate([{clipPath:'circle('+(opt.r||72)+'%'+at+')'}, {clipPath:'circle(0%'+at+')'}],
        {duration:opt.ms, delay:delay, easing:'cubic-bezier(.45,0,.75,.55)', fill:'forwards'});
      if(shot.gloom) beat(shot.gloom, [{opacity:1}, {opacity:0}], {duration:opt.ms, delay:delay, fill:'forwards'});
      return;
    }
    if(kind==='thump'){                          
      beat(shot.fx, [{transform:'scale(1)', easing:'ease-out'}, {offset:.1, transform:'scale(1.045)', easing:'ease-in'},
        {offset:.3, transform:'scale(1.008)', easing:'ease-out'}, {offset:.42, transform:'scale(1.03)', easing:'ease-in-out'},
        {offset:.75, transform:'scale(1)'}, {transform:'scale(1)'}], {duration:650, delay:delay});
      return;
    }
    if(kind==='settle'){                                                          
      beat(shot.fx, [{transform:'translateX(0) scale(1)', easing:'cubic-bezier(.2,.7,.4,1)'},
        {offset:.35, transform:'translateX(-2.2%) scale(1.05)', easing:'ease-in-out'}, {offset:.7, transform:'translateX(.6%) scale(1.02)', easing:'ease-out'},
        {transform:'translateX(0) scale(1)'}], {duration:420, delay:delay, easing:'linear'});
      return;
    }
    if(kind==='windup'){                                                                         
      beat(shot.fx, [{transform:'translateX(0) scale(1)'}, {transform:'translateX(2.4%) scale(1.05)'}],
        {duration:140, delay:delay, easing:'cubic-bezier(.3,0,.25,1)', fill:'forwards'});
      return;
    }
    if(kind==='barDone'){                                                                                
      var bar=shot.el.querySelector('.ic-loading__bar'), fill=shot.el.querySelector('.ic-loading__fill'), over=shot.el.querySelector('.ic-loading');
      if(!bar || !fill) return;
      var gli=document.createElement('i'); gli.className='ic-loading__glint'; fill.appendChild(gli);
      gli.animate([{transform:'translateX(-110%)'}, {transform:'translateX(250%)'}], {duration:380, delay:delay, easing:'ease-in-out'});
      bar.animate([{transform:'translateX(-50%) scale(1)'}, {offset:.35, transform:'translateX(-50%) scale(1.07)'}, {transform:'translateX(-50%) scale(1)'}],
        {duration:260, delay:delay, easing:'ease-out'});
      sprayFX(shot, img, {host:'loading', px:{x:over.offsetWidth/2+bar.offsetWidth/2-8, y:bar.offsetTop+13}, type:'sparkle', n:8,
        ang:[-180,180], reach:[.04,.09], size:[.03,.05], lift:0, fall:.02, ms:600}, delay);
      return;
    }
    if(kind==='bigflash'){                                                                              
      var t=PARAMS.bigFlashHoldMs+PARAMS.bigFlashMs, ho=PARAMS.bigFlashHoldMs/t;                                      
      beat(_flash, [{opacity:1}, {opacity:1, offset:ho}, {opacity:0, offset:.45}, {opacity:0}], {duration:t, delay:delay, easing:'ease-out'});
      beat(_gold, [{opacity:0}, {opacity:0, offset:ho}, {opacity:.45, offset:.45}, {opacity:0}], {duration:t, delay:delay, easing:'ease-out'});
      return;                                                                       
    }
    if(kind==='whiteout'){                                                                             
      var w=PARAMS.whiteoutMs, h=PARAMS.whiteoutHoldMs;                                                  
      beat(_flash, [{opacity:0, easing:'ease-in'}, {opacity:1, offset:w/(w+h)}, {opacity:1}], {duration:w+h, delay:delay});
      return;
    }
    if(kind==='invert'){                                                                 
      beat(shot.fx, [{filter:'none'}, {filter:'invert(1) grayscale(1) contrast(1.4)', offset:.01},
        {filter:'invert(1) grayscale(1) contrast(1.4)', offset:.99}, {filter:'none'}], {duration:PARAMS.invertMs, delay:delay});
      return;
    }
    if(kind==='impact' || kind==='pop'){                                                        
      var pt=opt.x!=null ? opt : (f && f.impact);
                                                                                              
      if(pt) impactFX(shot, img, pt, delay, opt.size || (kind==='impact' ? 1 : .4),
        {lines:opt.lines!=null ? opt.lines : kind==='impact', glow:opt.glow, rings:opt.rings, sparks:opt.sparks, rocks:opt.rocks});
      return;
    }
    if(kind==='punch'){
      beat(shot.fx, [{transform:'scale(1)'},{transform:'scale('+(opt.zoom||PARAMS.punchZoom)+')', offset:.3},{transform:'scale(1)'}],
        {duration:opt.ms||PARAMS.punchMs, delay:delay, easing:'ease-out'});
      return;
    }
  }

  function showFrame(f, img, prevCam){
    var reduce=reducedMotion(), how=f.in||'fade';
    if((how==='slide' || how==='carousel' || how==='whip') && reduce) how='fade';
    if(!_shot && how==='cut') how='fade';
    var old=_shot, shot=(how==='cut') ? _shot : (_shot=newShot());
    if(f.pos) img.style.objectPosition=f.pos;
    shot.fx.appendChild(img);
    if(f.scene){ fitScene(img); startSceneMoves(img); }

    var arrive;
    if(how==='whip'){                                                                                  
      img.style.opacity=1; shot.el.style.boxShadow='none';
      var whip={duration:f.inMs, easing:f.slideEase||'linear'};
      arrive=shot.el.animate([{transform:'translateX(100%)'},{transform:'translateX(0)'}], whip);
      if(old) old.el.animate([{transform:'translateX(0)'},{transform:'translateX(-100%)'}], Object.assign({fill:'forwards'}, whip));
    } else if(how==='slide'){
      img.style.opacity=1;
      arrive=shot.el.animate([{transform:'translateX(100%)'},{transform:'translateX(0)'}],
        {duration:f.inMs, easing:PARAMS.slideEase});
      if(old) old.el.animate([{transform:'translateX(0)', filter:'brightness(1)'},
        {transform:'translateX('+PARAMS.slideUnderX+'%)', filter:'brightness('+PARAMS.slideUnderDim+')'}],
        {duration:f.inMs, easing:PARAMS.slideEase, fill:'forwards'});
    } else if(how==='carousel'){
      img.style.opacity=1;
      arrive=shot.el.animate(carouselKeys(100, 0), {duration:f.inMs});
      if(old) old.el.animate(carouselKeys(0, -100), {duration:f.inMs, fill:'forwards'});
    } else if(how==='cut' && f.reveal && !reduce){
                                                         
      img.style.opacity=1;
      var at=' at '+f.reveal.x+'% '+f.reveal.y+'%';
      arrive=img.animate([{clipPath:'circle(0%'+at+')'}, {clipPath:'circle(150%'+at+')'}],
        {duration:f.inMs, easing:'cubic-bezier(.3,.7,.4,1)'});
    } else {
      arrive=img.animate([{opacity:0},{opacity:1}], {duration:f.inMs, easing:'ease-out', fill:'forwards'});
    }
                                                                                                         
                                                                                                     
    arrive.finished.then(function(){
      while(shot.fx.firstChild && shot.fx.firstChild!==img) shot.fx.removeChild(shot.fx.firstChild);
      for(var s=shot.el.previousElementSibling, p; s; s=p){ p=s.previousElementSibling; if(s.classList.contains('ic-shot')) s.remove(); }
    }, function(){});

    if(f.blackoutMs) shot.el.animate([{opacity:1},{opacity:0}],
      {duration:f.blackoutMs, delay:Math.max(0, f.inMs+f.holdMs-f.blackoutMs), easing:'ease-in', fill:'forwards'});

    var land=(how==='slide' || how==='carousel' || how==='whip') ? f.inMs : 0;                                           
    if(f.loading){                                                                                              
      var bar=document.createElement('div'), at=land+f.loading.atMs;
      bar.className='ic-loading';
      bar.innerHTML='<div class="ic-loading__bar"><i class="ic-loading__fill"></i></div><div class="ic-loading__status">Preparing your pond…</div>';
      shot.el.appendChild(bar);
      bar.animate([{opacity:0}, {opacity:1}], {duration:PARAMS.loadingInMs, delay:at, easing:'ease-out', fill:'both'});
                                            
      bar.querySelector('.ic-loading__fill').animate([{width:'4%'}, {offset:.3, width:'38%'}, {offset:.45, width:'46%'},
        {offset:.7, width:'71%'}, {offset:.82, width:'86%'}, {width:'100%'}], {duration:f.loading.ms, delay:at, easing:'ease-in-out', fill:'both'});
    }

                                                                                                       
                                                                           
    if(how==='cut' && shot.anim && (reduce || !(f.cam || f.camTl))){ shot.anim.cancel(); shot.anim=null; }
    if(reduce) return arrive;
    if(f.cam){                                                 
      var from=(how==='cut') ? (prevCam||f.cam) : (f.start||f.cam), prev=shot.anim, wait=f.camDelayMs||0;
      shot.anim=shot.cam.animate([{transform:camTransform(from)},{transform:camTransform(f.cam)}],
        {duration:f.camMs||(f.inMs+f.holdMs-wait), delay:wait, easing:f.ease||'ease-in-out', fill:'both'});
      if(prev) prev.cancel();
    } else if(f.camTl){                                                                     
      var T=f.camTl, end=T[T.length-1][0]||1, prev2=shot.anim;
      shot.anim=shot.cam.animate(T.map(function(k){
        var o={offset:k[0]/end, transform:camTransform(k[1])}; if(k[2]) o.easing=k[2]; return o;
      }), {duration:end, delay:land, fill:'both'});
      if(prev2) prev2.cancel();
    }
    (f.hits||[]).forEach(function(h){ schedule(shot, land+h[0], h[1], f, img, h[2]); });
    if(f.bounce) schedule(shot, land+PARAMS.punchMs, 'bounce', f, img);
    if(f.rumble){                                                                              
      var c=f.scene ? 'translate(-50%,-50%) ' : '', r=function(x,y){ return {transform:c+'scale(1.02) translate('+x+'%,'+y+'%)'}; };
      img.animate([r(0,0), r(.3,-.25), r(-.25,.3), r(.2,.2), r(0,0)],
        {duration:f.rumbleMs||PARAMS.rumbleMs, delay:land+(f.rumbleAt||0), iterations:Infinity});
    }
    return arrive;
  }

  function play(fromFrame){
    if(_playing) return;
    _playing=true;
    mount();
                                                                                             
    var first=FRAMES.findIndex(function(f){ return (f.num||0) >= (fromFrame||1); });
    var frames=FRAMES.slice(Math.max(0,first));
                                                                                                      
    var loads=[];
    frames.forEach(function(f,i){
      var gate=loads[i-PARAMS.preloadAhead] || Promise.resolve();
      loads[i]=gate.then(function(){ return load(f); });
    });
                                                                                                     
                                                           
    if(loads[0]) loads[0].then(function(){ [FX_LINES, FX_GLOOM].forEach(function(s){ var im=new Image(); im.src=s; }); });
    var i=0, prevCam=null;
    function step(){
      if(!_playing) return;
      if(i>=frames.length) return finish();
      var f=frames[i], p=loads[i]; i++;
      p.then(function(img){
        if(!_playing) return;
        if(!img) return step();
        var arrive=showFrame(f, img, prevCam), ms=f.inMs+f.holdMs+(f.blackHoldMs||0), started=false;
        prevCam=f.cam;
                                                                                                   
                                                                                                    
                                                                                                       
                                                                                                           
                                                                                
        var go=function(){ if(started || !_playing) return; started=true;
          var el=(arrive.startTime!=null && document.timeline.currentTime!=null) ? Math.max(0, document.timeline.currentTime-arrive.startTime) : 0;
          _timer=setTimeout(step, Math.max(0, ms-el-(f.holdMs ? 0 : PARAMS.chainLeadMs))); };
        arrive.ready.then(go, go);
        setTimeout(go, PARAMS.readyWaitMs);
      });
    }
    step();
  }

                                                                                          
  function finish(){
    if(!_playing) return;
    _playing=false;
    clearTimeout(_timer);
    if(typeof state!=='undefined' && state){
      state.introCinematicSeen=1;
      if(typeof queueSave==='function') queueSave();
    }
    var root=_root;
    _root=_shot=_flash=_gold=_black=null;
                                                                                                    
                                                                               
    if(!PARAMS.newsReport && typeof g.ftueSkipToExpansion==='function') g.ftueSkipToExpansion();
                                                                                                            
    else if(g.FtueSteps) setTimeout(function(){ FtueSteps.cinematicTick(); }, 0);
    if(!root) return;
    root.classList.add('out');
    setTimeout(function(){ root.remove(); }, PARAMS.endFadeMs);
  }

                                                                                               
                                                                                      
  function whenLandingLeaves(cb){
    var ls=document.getElementById('landing-screen');
    if(!ls || ls.classList.contains('hide')) return cb();
    var mo=new MutationObserver(function(){
      if(ls.classList.contains('hide')){ mo.disconnect(); cb(); }
    });
    mo.observe(ls, {attributes:true, attributeFilter:['class']});
  }
  whenLandingLeaves(function(){ if(shouldPlay()) play(forcedStart()||1); });

  g.IntroCinematic = {
    FRAMES: FRAMES,
    PARAMS: PARAMS,
    playing: function(){ return _playing; },
    play: play,
    skip: finish
  };
})(window);
