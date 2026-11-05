                                                                          
                                                                              
                                                                            
                                                                              
                                       
  
                                                                            
                                                                           
                                                     
   
(function (g) {
  'use strict';
  var K = g.KitUI;
  if (!K) throw new Error('[kit/frog] js/ui-kit.js must load first');
  var esc = K.esc, cls = K.cls;
  var ART = 'assets/ui2/kit/frog/';
  var POWER_ICON = 'assets/ui2/grimoire/icon_power.png';

                                                            
  var STAT_ICON = {
    atk: 'assets/ui2/icon/atk_icon.png', def: 'assets/ui2/icon/def_icon.png', hp: 'assets/ui2/icon/hp_icon.png',
    wood: 'assets/ui2/currency/wood.png', stone: 'assets/ui2/currency/rock.png', tend: 'assets/ui2/currency/seed.png'
  };
  var STAT_LABEL = { atk: 'ATK', def: 'DEF', hp: 'HP', wood: 'WOOD', stone: 'STONE', tend: 'TEND' };
  function statIcon(kind, cl) {
    var src = STAT_ICON[kind];
    return src ? '<img class="' + cls('kit-staticon', cl) + '" src="' + src + '" alt="" draggable="false">' : '';
  }

                                                                     
                                                                            
                                                                             
                                                                           
                                                                  
                            
  var _box = {}, _loads = {};
  function fitArt(img) {
    if (!img) return;
    var src = img.getAttribute('src'); if (!src) return;
    if (img.dataset.fit && img.dataset.fitSrc === src) return;
    var apply = function (bb) {
      if (!bb || img.getAttribute('src') !== src) return;
      var host = img.parentElement; if (!host) return;
      var tw = host.clientWidth, th = host.clientHeight; if (!tw || !th) return;
      var s = Math.min(tw / bb.w, th / bb.h) * (parseFloat(img.dataset.fill) || 0.88);
      img.style.position = 'absolute';
      img.style.width = (bb.cw * s) + 'px'; img.style.height = (bb.ch * s) + 'px';
      img.style.left = (-bb.x * s + (tw - bb.w * s) / 2) + 'px';
      img.style.top = (-bb.y * s + (th - bb.h * s) / 2) + 'px';
      img.style.maxWidth = 'none'; img.style.maxHeight = 'none';
      img.dataset.fit = '1'; img.dataset.fitSrc = src;
    };
    if (_box[src]) { apply(_box[src]); return; }
    if (!_loads[src]) {
      var source = new Image(); source.src = src;
      _loads[src] = source.decode().then(function () {
        var N = 96, c = document.createElement('canvas'); c.width = N; c.height = N;
        var x = c.getContext('2d', { willReadFrequently: true });
        x.drawImage(source, 0, 0, N, N);
        var d = x.getImageData(0, 0, N, N).data, x0 = N, y0 = N, x1 = -1, y1 = -1;
        for (var py = 0; py < N; py++) for (var px = 0; px < N; px++) {
          if (d[(py * N + px) * 4 + 3] > 16) { if (px < x0) x0 = px; if (px > x1) x1 = px; if (py < y0) y0 = py; if (py > y1) y1 = py; }
        }
        if (x1 < 0) return null;
        var k = source.naturalWidth / N, k2 = source.naturalHeight / N;
        return (_box[src] = { x: x0 * k, y: y0 * k2, w: (x1 - x0 + 1) * k, h: (y1 - y0 + 1) * k2, cw: source.naturalWidth, ch: source.naturalHeight });
      }).catch(function () { return null; }).finally(function () { delete _loads[src]; });
    }
    _loads[src].then(apply);
  }
                                                                             
                                                                                     
  function art(src, opts) {
    opts = opts || {};
    var size = opts.size, w = Array.isArray(size) ? size[0] : size, h = Array.isArray(size) ? size[1] : size;
    var style = w ? ' style="width:' + w + 'px;height:' + h + 'px"' : '';
    var c = cls('kit-art', opts.ring === false ? '' : 'kit-art--ring', opts.sil ? 'kit-art--sil' : '', opts.aura ? 'kit-art--aura' : '', opts.className);
    var inner = src
      ? '<img src="' + esc(src) + '" alt="" draggable="false"' + (opts.fill ? ' data-fill="' + opts.fill + '"' : '')
        + (opts.fit === false ? '' : ' onload="' + (opts.onload || 'KitUI.fitArt(this)') + '"')
        + ' onerror="' + (opts.onerror || 'this.style.visibility=\'hidden\'') + '">'
      : '<span class="kit-art__emoji">' + (opts.emoji || '') + '</span>';
    return '<span class="' + c + '"' + style + '>' + inner + '</span>';
  }

                                                                          
                                                                           
  function frogStandIn(opts) {
    opts = opts || {};
    var w = opts.width || 76, h = opts.height || Math.round(w * 101 / 120);
    return '<span class="kit-frogstandin" style="width:' + w + 'px;height:' + h + 'px"><img src="assets/ui2/kit/frog/frog-body-01.png" alt="" draggable="false"></span>';
  }

  function attrs(o) {
    return (o.id ? ' id="' + esc(o.id) + '"' : '') + (o.attrs || '');
  }
  function tappable(o, label) {
    return o.onclick ? ' role="button" tabindex="0" onclick="' + o.onclick + '"' + (label ? ' aria-label="' + esc(label) + '"' : '') : '';
  }

                                                                        
                                                                           
                                                                            
                                                    
                                                                          
                                                                           
                                                                    
  function frogCard(o) {
    o = o || {};
    var tone = o.tone || 'none', state = o.state || 'idle';
    var stats = (o.stats || []).map(function (s) {
      return '<span class="kit-frogcard__stat">' + (s.iconHTML || statIcon(s.kind)) + '<b>' + esc(s.value) + '</b></span>';
    }).join('');
    return '<div class="' + cls('kit-frogcard', 'kit-tone--' + tone, state === 'working' ? 'is-working' : '', state === 'locked' ? 'is-locked' : '', o.className) + '"'
      + attrs(o) + tappable(o, o.ariaLabel || o.band) + '>'
      + '<b class="kit-frogcard__band">' + esc(o.band || '') + '</b>'
      + '<div class="kit-frogcard__portrait">' + (o.artHTML || frogStandIn())
        + (state === 'working' ? '<span class="kit-frogcard__status">' + esc(o.statusLabel || 'Working') + '</span>' : '')
        + (state === 'locked' ? '<span class="kit-frogcard__lock" aria-label="' + esc(o.lockLabel || 'Locked') + '">\u{1F512}</span>' : '')
      + '</div>'
      + '<div class="kit-frogcard__stats">' + stats + '</div></div>';
  }

                                                                         
                                                                            
  function frogChip(o) {
    o = o || {};
    var state = o.state || 'default';
    return '<span class="' + cls('kit-frogchip', 'kit-frogchip--' + state, o.className) + '"' + attrs(o) + tappable(o, o.ariaLabel) + '>'
      + (state === 'empty' ? '' : (o.artHTML || frogStandIn({ width: 46 })))
      + (state === 'selected' ? '<span class="kit-frogchip__check" aria-hidden="true">✓</span>' : '') + '</span>';
  }

                                                                          
                                                                           
                                                                         
                                            
  function powerIcon() { return '<img class="kit-power__icon" src="' + POWER_ICON + '" alt="" draggable="false">'; }
  function powerBadge(o) {
    o = o || {};
    return '<span class="' + cls('kit-powerbadge', o.className) + '" aria-label="Power ' + esc(o.power) + '">'
      + powerIcon() + '<b>' + esc(o.power) + '</b></span>';
  }
  function powerPill(o) {
    o = o || {};
    return '<span class="' + cls('kit-powerpill', 'kit-powerpill--' + (o.size || 'sm'), o.worse ? 'is-worse' : '', o.className) + '" aria-label="Power ' + esc(o.value) + '">'
      + powerIcon() + '<b>' + esc(o.value) + '</b></span>';
  }

                                                                         
                                                                           
  function pondFrog(o) {
    o = o || {};
    return '<span class="' + cls('kit-pondfrog', o.className) + '"' + tappable(o, o.ariaLabel) + '>' + esc(o.level) + '</span>';
  }

                                                                          
                                                                        
                                                                         
                                                        
  function statCell(o) {
    o = o || {};
    var kind = o.stat || 'hp';
    return '<span class="' + cls('kit-statcell', o.compact ? 'kit-statcell--compact' : '', o.className) + '"' + attrs(o) + '>'
      + (o.iconHTML || statIcon(kind, 'kit-statcell__icon'))
      + '<span class="kit-statcell__text"><i>' + esc(o.label || STAT_LABEL[kind] || kind) + '</i><b>' + esc(o.value) + '</b></span>'
      + (o.note ? '<small class="kit-statcell__note">' + esc(o.note) + '</small>' : '') + '</span>';
  }

                                                                          
                                                                             
                                                                         
                                              
  function boostPill(o) {
    o = o || {};
    var kind = o.kind;
    return '<span class="' + cls('kit-boost', 'kit-boost--' + (o.size || 'md'), o.tone ? 'kit-boost--' + o.tone : '', o.worse ? 'kit-boost--worse' : '', o.className) + '">'
      + (o.iconHTML || (kind ? statIcon(kind) : '')) + '<b>' + esc(o.text) + '</b></span>';
  }

                                                                          
                                                                              
                                   
  function arrow(dir, onclick) {
    return '<button type="button" class="kit-froghero__nav kit-froghero__nav--' + dir + '"'
      + (onclick ? ' onclick="' + onclick + '"' : ' disabled') + ' aria-label="' + (dir === 'prev' ? 'Previous frog' : 'Next frog') + '">'
      + '<img src="' + ART + 'hero-chevron.svg" alt="" draggable="false"></button>';
  }
  function renameButton(onclick, label) {
    return '<button type="button" class="kit-rename"' + (onclick ? ' onclick="' + onclick + '"' : '') + ' aria-label="' + esc(label || 'Rename') + '">'
      + '<img src="' + ART + 'ui-pencil.svg" alt="" draggable="false"></button>';
  }
  function frogHero(o) {
    o = o || {};
    return '<div class="' + cls('kit-froghero', o.className) + '">'
      + '<span class="kit-froghero__art">' + (o.artHTML || frogStandIn({ width: 119 })) + '</span>'
      + ((o.onPrev || o.onNext || o.arrows) ? arrow('prev', o.onPrev) + arrow('next', o.onNext) : '')
      + '<span class="kit-froghero__title"><b>' + esc(o.name || '') + '</b>' + (o.onRename !== false ? renameButton(o.onRename, 'Rename ' + (o.name || 'frog')) : '') + '</span>'
      + (o.detail ? '<span class="kit-froghero__detail">' + esc(o.detail) + '</span>' : '') + '</div>';
  }

  K.fitArt = fitArt;
  K.art = art;
  K.frogStandIn = frogStandIn;
  K.statIconHTML = statIcon;
  K.STAT_ICON = STAT_ICON;
  K.frogCard = frogCard;
  K.frogChip = frogChip;
  K.powerBadge = powerBadge;
  K.powerPill = powerPill;
  K.pondFrog = pondFrog;
  K.statCell = statCell;
  K.boostPill = boostPill;
  K.frogHero = frogHero;
  K.renameButton = renameButton;
})(typeof window !== 'undefined' ? window : globalThis);
