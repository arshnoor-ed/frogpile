                                                                               
                                                                             
                                                                            
                                                               
                                                                         
                                                                             
                                                                             
                                                                          

                                                                          
                                                                    
                                                              
                                                                                  
(function (g) {
  'use strict';
  var K = g.KitUI;
  if (!K) throw new Error('[kit/art] js/ui-kit.js must load first');
  var esc = K.esc, cls = K.cls;

  K.ART = {
    'insect/butterfly-red': 'assets/butterfly_red_atkBoost.png',                                    
    'insect/firefly-blue': 'assets/firefly_blue_defBoost.png',                                     
    'insect/dragonfly-green': 'assets/dragonfly_green_hpBoost.png',                                   
    'frog/body-01': 'assets/ui2/kit/frog/frog-body-01.png',                                                  
    'frog/bunny': 'assets/ui2/kit/art/frog-bunny.png',                                                    
    'flower/white-lily': 'assets/env/flower/whitelily_open.png',                                
    'currency/seeds': 'assets/ui2/currency/seed.png',
    'texture/stars': 'assets/ui2/kit/art/star-texture.jpg'                                                                  
  };
  var ART = K.ART;

                                                             
  var INSECT = { butterfly: 'insect/butterfly-red', atk: 'insect/butterfly-red', red: 'insect/butterfly-red',
    firefly: 'insect/firefly-blue', def: 'insect/firefly-blue', blue: 'insect/firefly-blue',
    dragonfly: 'insect/dragonfly-green', hp: 'insect/dragonfly-green', green: 'insect/dragonfly-green' };

                                                                            
                                                                            
                                                                      
  function sign(label, o) {
    o = o || {};
    return '<span class="' + cls('kit-sign', o.className) + '">' + esc(label == null ? 'MUTANT FROG' : label) + '</span>';
  }

                                                                            
                                                                             
                                                                  
                                                                    
  function badge(kind, label, o) {
    o = o || {};
    var k = kind === 'equipped' || kind === 'wearing' ? 'equipped' : 'new';
    var text = label != null ? label : (kind === 'wearing' ? 'WEARING' : k === 'equipped' ? 'EQUIPPED' : 'NEW');
    return '<span class="' + cls('kit-badge', 'kit-badge--' + k, o.className) + '">' + esc(text) + '</span>';
  }

                                                                            
                                             
                                                                           
                                                                     
  function insectArt(kind, o) {
    o = o || {};
    var key = INSECT[kind];
    if (!key) return '';
    var size = o.size || 64;
    return '<img class="' + cls('kit-insect', o.className) + '" src="' + ART[key] + '" alt="' + esc(o.alt || '') + '"'
      + ' style="width:' + size + 'px;height:' + size + 'px" draggable="false">';
  }

                                                                           
                                                                          
                                                                          
  function flowerPlaceholder(o) {
    o = o || {};
    var s = o.size || 90;
    return '<span class="' + cls('kit-artph', o.className) + '" style="width:' + s + 'px;height:' + s + 'px" aria-hidden="true"></span>';
  }

                                                                        
                                                                            
                                                                         
                                                                           
                                                                          
  function frogPlaceholder(o) {
    o = o || {};
    var w = o.width || 120;
    if (K.frogStandIn) return K.frogStandIn({ width: w, height: o.height });
    return '<span class="kit-frogstandin" style="width:' + w + 'px;height:' + (o.height || Math.round(w * 101 / 120)) + 'px">'
      + '<img src="' + ART['frog/body-01'] + '" alt="" draggable="false"></span>';
  }
                                                                          
                                                                            
                                                                   
  function bunnyArt(o) {
    o = o || {};
    var w = o.width || 120, h = w * 135 / 120;
    return '<span class="' + cls('kit-frogart', 'kit-frogart--bunny', o.className) + '" style="width:' + w + 'px;height:' + h + 'px"'
      + (o.alt ? ' role="img" aria-label="' + esc(o.alt) + '"' : ' aria-hidden="true"') + '>'
      + '<img src="' + ART['frog/bunny'] + '" alt="" draggable="false"></span>';
  }

                                                                           
                                                                         
                                                                           
                                                                          
                                                                       
                                                           
                                                                          
                                                     
                                                                          
                                                                            
                                                                     
                                               
  function flowerCard(o) {
    o = o || {};
    var state = o.state === 'selected' || o.state === 'locked' ? o.state : 'default';
    var rarity = o.rarity || 'common';
    var locked = state === 'locked';
    var name = o.name == null ? 'White Lily' : o.name;
    var effect = o.effect == null ? '+4% ATK' : o.effect;
    var seeds = o.seeds == null ? '×5' : o.seeds;
    var art = locked ? (o.imgSrc
        ? '<span class="kit-flowercard__sil" style="-webkit-mask-image:url(&quot;' + esc(o.imgSrc) + '&quot;);mask-image:url(&quot;' + esc(o.imgSrc) + '&quot;)"></span>'
        : flowerPlaceholder({ size: 52 }))
      : (o.artHTML || '<img src="' + esc(o.imgSrc || ART['flower/white-lily']) + '" alt="" draggable="false">');
    var insect = o.showInsect === false ? '' : (o.insectHTML || insectArt(o.insect || 'butterfly', { size: 18 }));
    var body = '<span class="kit-flowercard__art">' + art + '</span>'
      + (locked ? '<b class="kit-flowercard__name">???</b>'
        : '<b class="kit-flowercard__name">' + esc(name) + '</b>'
          + (effect !== '' ? '<span class="kit-flowercard__effect">' + insect + '<b>' + esc(effect) + '</b></span>' : '')
          + (seeds !== '' ? '<span class="kit-flowercard__seeds"><img src="' + ART['currency/seeds'] + '" alt="" draggable="false"><b>' + esc(seeds) + '</b></span>' : ''));
    var c = cls('kit-flowercard', 'kit-flowercard--' + state, 'kit-flowercard--' + rarity, o.className);
    var label = o.ariaLabel || (locked ? 'Undiscovered flower' : name + (effect ? ', ' + effect : '') + (seeds ? ', ' + seeds + ' seeds' : ''));
    if (o.onclick && !locked) {
      return '<button type="button" class="' + c + '" onclick="' + o.onclick + '" aria-label="' + esc(label) + '"'
        + ' aria-pressed="' + (state === 'selected') + '">' + body + '</button>';
    }
    return '<div class="' + c + '" role="group" aria-label="' + esc(label) + '">' + body + '</div>';
  }

  K.sign = sign;
  K.badge = badge;
  K.insectArt = insectArt;
  K.flowerPlaceholder = flowerPlaceholder;
  K.frogPlaceholder = frogPlaceholder;
  K.bunnyArt = bunnyArt;
  K.flowerCard = flowerCard;
})(typeof window !== 'undefined' ? window : globalThis);
