                                                                               
                                                                                 
                                                                             
                                                       

                                                                             
                                                                        
                                                           

                                                                         
                                                                           
                                                                        
                                                                          
                                                                      
                                             
                                                                                  
(function (g) {
  'use strict';
  var K = g.KitUI;
  if (!K) throw new Error('[kit/pond] js/ui-kit.js must load first');
  var esc = K.esc, cls = K.cls;

  var ART = {
    pad: 'assets/env/lilypad/01.png',
    signpost: 'assets/ui2/kit/pond/lily-pad-signpost.png',
    spot: 'assets/ui2/kit/pond/lily-pad-spot.png',
    tadpole: { 0: 'assets/frog2/tadpole/stage_0.png', 1: 'assets/frog2/tadpole/stage_1.png', 3: 'assets/frog2/tadpole/stage_3.png' },
    deco: ['assets/env/lilypad/decorative_01.png', 'assets/env/lilypad/decorative_02.png'],
    flower: function (species) {
      return 'assets/env/flower/' + (species === 'reed' ? 'reed' : species + 'lily') + '_open.png';
    }
  };
                                                                                        
  var SPECIES = { pink: 'pink', lily: 'pink', pinklily: 'pink', white: 'white', whitelily: 'white',
    blue: 'blue', bluelily: 'blue', reed: 'reed' };
  var DECO_SIZE = [[90, 59], [63, 38]];

  function img(src, c) { return '<img class="' + c + '" src="' + esc(src) + '" alt="" draggable="false">'; }
                                                                                
  function open(base, o, w, h, label, extraStyle) {
    var style = 'width:' + w + 'px;height:' + h + 'px' + (extraStyle || '');
    var c = cls(base, o.className);
    if (o.onclick) {
      return '<button type="button" class="' + c + '" style="' + style + '" onclick="' + o.onclick + '" aria-label="' + esc(o.ariaLabel || label) + '">';
    }
    return '<span class="' + c + '" style="' + style + '"' + (o.ariaLabel ? ' role="img" aria-label="' + esc(o.ariaLabel) + '"' : ' aria-hidden="true"') + '>';
  }
  function close(o) { return o.onclick ? '</button>' : '</span>'; }

                                                                            
                                                                             
                                                                             
                                                  
                                                                    
  function lilyPad(o) {
    o = typeof o === 'string' ? { type: o } : (o || {});
    var type = o.type === 'hatch' ? 'hatch' : (o.type === 'flower-spot' || o.type === 'spot' || o.type === 'empty flower spot') ? 'flower-spot' : 'plain';
    var w = o.width || 150, k = w / 150;
    var label = type === 'hatch' ? 'Hatching pad' : type === 'flower-spot' ? 'Plant a flower' : 'Lily pad';
    return open(cls('kit-lilypad', 'kit-lilypad--' + type), o, w, 120 * k, label, ';font-size:' + (20 * k) + 'px')
      + img(o.padSrc || ART.pad, 'kit-lilypad__pad')
      + (type === 'hatch' ? img(ART.signpost, 'kit-lilypad__sign') : '')
      + (type === 'flower-spot' ? img(ART.spot, 'kit-lilypad__spot') + '<span class="kit-lilypad__plus" aria-hidden="true">+</span>' : '')
      + close(o);
  }

                                                                            
                                                                         
                                                                        
                                                       
  function tadpole(stage, o) {
    o = o || {};
    var s = Math.max(0, Math.min(3, Math.floor(+stage || 0)));
    if (s === 2) s = 1;
    var w = o.width || 97;
    return open(cls('kit-tadpole', 'kit-tadpole--' + s), o, w, w * 52 / 97, 'Tadpole') + img(ART.tadpole[s], '') + close(o);
  }

                                                                            
                                                                            
                                                                             
                                                                          
                                             
                                                        
  function flower(species, o) {
    o = o || {};
    var sp = SPECIES[String(species || '').toLowerCase()] || 'pink';
    var w = o.width || 90;
    return open(cls('kit-flower', 'kit-flower--' + sp), o, w, w, sp + ' flower')
      + img(ART.flower(sp), '') + close(o);
  }

                                                                            
                                                                            
                                                
  function decoPad(variant, o) {
    o = o || {};
    var v = +variant === 2 ? 2 : 1, size = DECO_SIZE[v - 1];
    var w = o.width || size[0];
    o = { className: o.className, ariaLabel: o.ariaLabel };                    
    return open(cls('kit-decopad', 'kit-decopad--' + v), o, w, w * size[1] / size[0], '') + img(ART.deco[v - 1], '') + close(o);
  }

                                                                            
                                                                            
                                                                            
                                                   
                                                                                 
  function workshop(o) {
    o = o || {};
    var w = o.width || 120, k = w / 120;
    var lines = o.lines || ['WORKSHOP', 'BUILD IN', 'UPGRADES'];
    return open(cls('kit-workshop', 'kit-workshop--outline'), o, w, 130 * k, 'Workshop — build it in Upgrades', ';font-size:' + (12 * k) + 'px')
      + '<span class="kit-workshop__outline"><span class="kit-workshop__glyph" aria-hidden="true">⚒</span>'
      + '<span class="kit-workshop__label">' + lines.map(function (l) { return '<span>' + esc(l) + '</span>'; }).join('') + '</span></span>'
      + close(o);
  }

  K.POND_ART = ART;
  K.lilyPad = lilyPad;
  K.tadpole = tadpole;
  K.flower = flower;
  K.decoPad = decoPad;
  K.workshop = workshop;
})(typeof window !== 'undefined' ? window : globalThis);
