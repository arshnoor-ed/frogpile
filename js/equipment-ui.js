  
                                                                                
                                                              
  
                                                                         
                                                                           
                                                                              
                                                                             
                                                                              
                                                                         
                                                                         
  
                                                                              
                                                                    
                                                                             
                                                                             
                                                                             
                                                                            
                                              
  
                                                                             
                                                                           
                                                                          
                                                          
   
(function (g) {
  'use strict';

  function Eq() {
    var e = g.Equipment;
    if (!e) throw new Error('[Equipment.UI] js/equipment.js must load first');
    return e;
  }

  var RARITY_COLOR = {
    common: '#9db3ba',
    rare: '#4fa8d8',
    epic: '#b06fe0',
    legendary: '#ffb63d'
  };
  function rarityColor(rarity) { return RARITY_COLOR[rarity] || RARITY_COLOR.common; }

                                                                                              
  function starterDef(row) {
    var key = row && Eq().pieceFor(row.item_id), FT = g.FT;
    return key && FT && typeof FT.traitDef === 'function' ? FT.traitDef(key) : null;
  }

  function displayName(row) { return Eq().displayName(row); }

                                                                         
  function boostLabel(row) {
    var parts = [];
    if (row.buff_attack) parts.push('+' + Eq().buffValue(row, 'buff_attack') + ' ATK');
    if (row.buff_defense) parts.push('+' + Eq().buffValue(row, 'buff_defense') + ' DEF');
    if (row.buff_hp) parts.push('+' + Eq().buffValue(row, 'buff_hp') + ' HP');
    if (row.buff_harvest_wood) parts.push('+' + Eq().buffValue(row, 'buff_harvest_wood') + ' Wood/min');
    if (row.buff_harvest_stone) parts.push('+' + Eq().buffValue(row, 'buff_harvest_stone') + ' Stone/min');
    return parts.join(' · ');
  }

  function rowForInstanceSafe(inst) {
    try { return Eq().itemRow(inst.item_id); } catch (e) { return null; }
  }

  function costChipsHTML(state, cost) {
    if (!Object.keys(cost).length) return '<span class="eq-cost-chip eq-cost-unpriced">not yet priced</span>';
    return Object.keys(cost).map(function (key) {
      var have = state[key] || 0, need = cost[key];
      var icon = (typeof curIcon === 'function') ? curIcon(key) : '';
      if (typeof KitUI !== 'undefined') return KitUI.costChip(icon, need, have);
      return '<span class="eq-cost-chip' + (have >= need ? '' : ' short') + '">' + icon + ' ' + need + '</span>';
    }).join('');
  }

                                                                              
                                                               
  function badgeHTML(row, extraCls) {
    var slot = Eq().slotFor(row.item_type);
    var icon = Eq().SLOT_META[slot].icon;
    return '<span class="eq-badge' + (extraCls ? ' ' + extraCls : '') + '" style="--eq-badge-color:' + rarityColor(row.rarity) + '">' + icon + '</span>';
  }

                                                                             
                                                                            
                                                                            
                                                                            
                                                                      
                                                                           
  function rackOpenFor(frog) { return (typeof g.equipRackOpen === 'function') ? g.equipRackOpen(frog) : null; }
  function toggleRack(slot) { if (typeof g.toggleEquipRack === 'function') g.toggleEquipRack(slot); }

                                                                          
                                                                        
  function cellsHTML(frog, compact) {
    var openSlot = rackOpenFor(frog);
    var cells = Eq().SLOTS.map(function (slot) {
      var meta = Eq().SLOT_META[slot];
      var worn = Eq().equippedOn(state, frog.id, slot);
      var wornRow = worn ? rowForInstanceSafe(worn) : null;
      var inner = worn
        ? (wornRow ? badgeHTML(wornRow, 'worn') : '<span class="eq-badge worn">' + meta.icon + '</span>')
          + Eq().ringHtml(worn.usesLeft, worn.usesMax)
        : '<span class="eq-badge ghost">' + meta.icon + '</span>';
      var detail = compact ? '<b class="fi-gear-name">' + KitUI.esc(wornRow ? displayName(wornRow) : meta.name) + '</b>'
        + '<span class="fi-gear-info">' + (worn ? (wornRow ? KitUI.esc(boostLabel(wornRow)) + '<br>' : '')
          + worn.usesLeft + '/' + worn.usesMax + ' uses' : 'Tap to ' + (Eq().inventoryFor(state, slot).length ? 'equip' : 'craft')) + '</span>' : '';
      var click = compact && !worn && !Eq().inventoryFor(state, slot).length
        ? "Equipment.UI.openConvert('" + slot + "','" + frog.id + "')"
        : "Equipment.UI.toggleRack('" + slot + "')";
      return '<button class="eq-cell' + (worn ? ' worn' : '') + (openSlot === slot ? ' open' : '') + '"'
        + ' onclick="' + KitUI.esc(click) + '" aria-label="' + meta.name + '">'
        + inner + detail + '</button>';
    }).join('');
    var rack = openSlot ? rackHTML(frog, openSlot) : '';
    return '<div class="eq-cells">' + cells + '</div>' + rack;
  }

                                                                             
                                                                              
                                                                              
  function rackHTML(frog, slot) {
    var meta = Eq().SLOT_META[slot];
    var worn = Eq().equippedOn(state, frog.id, slot);
    var pool = Eq().inventoryFor(state, slot);
    var picks = pool.map(function (inst) {
      var row = rowForInstanceSafe(inst);
      var name = row ? displayName(row) : inst.item_id;
      var boost = row ? boostLabel(row) : '';
      return '<button class="eq-pick" onclick="Equipment.UI.equipFromRack(\'' + frog.id + '\',\'' + slot + '\',\'' + inst.id + '\')">'
        + (row ? badgeHTML(row) : '<span class="eq-badge">' + meta.icon + '</span>')
        + Eq().ringHtml(inst.usesLeft, inst.usesMax)
        + '<span class="eq-nm">' + name + '</span>'
        + '<span class="eq-bo">' + boost + '</span></button>';
    }).join('');
    var wornBtn = worn
      ? '<button class="eq-pick on" onclick="Equipment.UI.equipFromRack(\'' + frog.id + '\',\'' + slot + '\',\'' + worn.id + '\')">'
        + (rowForInstanceSafe(worn) ? badgeHTML(rowForInstanceSafe(worn)) : '<span class="eq-badge">' + meta.icon + '</span>')
        + Eq().ringHtml(worn.usesLeft, worn.usesMax)
        + '<span class="eq-nm">' + (rowForInstanceSafe(worn) ? displayName(rowForInstanceSafe(worn)) : worn.item_id) + '</span>'
        + '<span class="eq-on">WORN — tap to remove</span></button>'
      : '';
    var blueprintN = Eq().slotBlueprintTotal(state, slot);
    var convertBtn = '<button class="eq-pick eq-craft" onclick="Equipment.UI.openConvert(\'' + slot + '\',\'' + frog.id + '\')">'
      + '<span class="eq-craft-ico">' + Eq().blueprintIconHTML(slot) + '</span>'
      + '<span class="eq-nm">Use a ' + Eq().blueprintLabel(slot) + '</span>'
      + '<span class="eq-bo">' + blueprintN + ' on hand</span></button>';
    return '<div class="eq-rack">' + wornBtn + picks + convertBtn + '</div>';
  }

                                                                              
                                                                       
  var _freshId = null;
  function setFresh(instanceId) { _freshId = instanceId || null; }
  function freshId() { return _freshId; }

  function equipFromRack(frogId, slot, instanceId) {
                                                                                               
    var frog = (state.frogs || []).find(function (f) { return f.id === frogId; });
    var before = frog && typeof frogStats === 'function' ? frogStats(frog) : null;
    var hadGear = Eq().init(state).items.some(function (it) { return !!it.equippedBy; });
    var ok = Eq().equip(state, frogId, instanceId);
    if (!ok) { if (typeof showToast === 'function') showToast('\u{1F512} that piece is already worn elsewhere'); return; }
    var worn = Eq().equippedOn(state, frogId, slot);
    if (worn && worn.id === _freshId) _freshId = null;
                                                                      
    try { if (typeof ac === 'function' && typeof croak === 'function') { ac(); croak(worn ? 620 : 480, 1.0); } } catch (e) {}
    if (typeof showToast === 'function') {
      showToast(worn ? (Eq().SLOT_META[slot].icon + ' equipped') : (Eq().SLOT_META[slot].icon + ' removed'));
    }
    try { if (typeof queueSave === 'function') queueSave(); } catch (e) {}
    try { if (typeof refreshFrogSprite === 'function') refreshFrogSprite(frogId); } catch (e) {}
    toggleRack(slot);                                                                                         
    try { if (worn && g.FtueTooltips && FtueTooltips.gearEquipped) FtueTooltips.gearEquipped(frogId, slot, before, hadGear); } catch (e) {}
    try { if (g.FtueSteps && FtueSteps.sync) FtueSteps.sync(); } catch (e) {}                                            
  }

                                                                            
                                                                             
                                                                             
                                                  
  var _convertCtx = { slot: null, frogId: null };
  var _convertSel = null;

  function openConvert(slot, frogId) {
    if(g.EquipmentCraft) return g.EquipmentCraft.open(slot,frogId);
    if(Eq().ftueFirstCraftActive(state)){slot='weapon';_convertSel=Eq().lessonWeaponItemId(state);}
    try { if (typeof dismissLaborWindow === 'function') dismissLaborWindow(); } catch (e) {}
    try { if (typeof activeSheet !== 'undefined' && activeSheet && typeof closeSheet === 'function') closeSheet(); } catch (e) {}
    _convertCtx = { slot: slot || null, frogId: frogId || null };
    var list = Eq().craftable(slot === 'shield' ? 'shield' : 'sword', state);
    if (!_convertSel || !list.some(function (r) { return r.item_id === _convertSel; })) {
      _convertSel = list.length ? list[0].item_id : null;
    }
    drawConvertWindow();
  }
  function closeConvert() {
    var w = document.getElementById('equip-convert-window'); if (w) w.remove();
    if (_convertCtx.frogId && typeof showArmorWindow === 'function'
        && state.frogs.some(function (f) { return f.id === _convertCtx.frogId; })) {
      showArmorWindow(_convertCtx.frogId);
    } else if (typeof render === 'function') render();
  }
  function selectConvertItem(itemId) { _convertSel = itemId; drawConvertWindow(); }

                                                                              
                                                 
                                                                           
                                                                         
  function drawConvertWindow() {
    try { drawConvertWindowUnsafe(); }
    catch (err) {
      var w = document.getElementById('equip-convert-window');
      if (!w) { w = document.createElement('div'); w.id = 'equip-convert-window'; document.body.appendChild(w); }
      w.innerHTML = '<div class="cw-card eq-convert-card">'
        + '<button class="cw-x" onclick="Equipment.UI.closeConvert()" aria-label="Close">✕</button>'
        + '<div class="cw-title">Not configured yet</div>'
        + '<div class="eq-note">' + (err && err.message ? err.message.replace(/[<>]/g, '') : 'The Equipment catalogue is missing data it needs.') + '</div>'
        + '</div>';
    }
  }
  function drawConvertWindowUnsafe() {
    var w = document.getElementById('equip-convert-window');
    if (!w) { w = document.createElement('div'); w.id = 'equip-convert-window'; document.body.appendChild(w); }
    var slot = _convertCtx.slot || 'weapon';
    var all = Eq().craftable(slot === 'shield' ? 'shield' : 'sword', state);
    if(Eq().ftueFirstCraftActive(state)) all=all.filter(function(r){return r.item_id===Eq().lessonWeaponItemId(state);});
    var sel = all.find(function (r) { return r.item_id === _convertSel; }) || all[0];
    var blueprintN = Eq().blueprintCount(state, slot);
    var blueprintName = Eq().blueprintLabel(slot);
    var anvil = '';
    if (sel) {
      var cost = Eq().conversionCost(sel.item_id,state);
      var afford = Eq().canAfford(state, cost);
      var canGo = blueprintN > 0 && afford;
      anvil = '<div class="cw-anvil eq-convert-anvil">'
        + '<button class="cw-piece eq-convert-piece" onclick="Equipment.UI.doConvert()" aria-label="Convert ' + displayName(sel) + '"'
          + (canGo ? '' : ' disabled') + '>' + badgeHTML(sel, 'big') + '</button>'
        + '<div class="cw-name">' + displayName(sel) + ' <span class="cw-boost">' + boostLabel(sel) + '</span></div>'
        + '<div class="cw-costs">' + costChipsHTML(state, cost) + '</div>'
        + '<div class="cw-hint' + (canGo ? '' : ' short') + '">'
          + (blueprintN < 1 ? 'Need a ' + blueprintName : (afford ? 'Tap to convert' : 'Not enough materials'))
        + '</div></div>';
    }
    var grid = all.map(function (r) {
      return '<button class="cw-item' + (r.item_id === (sel && sel.item_id) ? ' sel' : '') + '" onclick="Equipment.UI.selectConvertItem(\'' + r.item_id + '\')">'
        + badgeHTML(r) + '</button>';
    }).join('');
    var buyBtn = blueprintN < 1
      ? (Eq().blueprintPriced(slot)
          ? (typeof KitUI !== 'undefined'
              ? KitUI.button({ tone: 'gold', shape: 'pill', size: 'sm', className: 'eq-buy-blueprint',
                  onclick: 'Equipment.UI.buyBlueprint()', disabled: !Eq().canAffordBlueprint(state, slot),
                  html: 'Buy a ' + blueprintName + ' &middot; ' + costChipsHTML(state, Eq().blueprintCost(slot)) })
              : '<button class="eq-buy-blueprint" onclick="Equipment.UI.buyBlueprint()">Buy a ' + blueprintName + ' · ' + costChipsHTML(state, Eq().blueprintCost(slot)) + '</button>')
          : '<div class="eq-note">' + blueprintName + ' has no shop price authored yet.</div>')
      : '';
    w.innerHTML = '<div class="cw-card eq-convert-card">'
      + '<button class="cw-x" onclick="Equipment.UI.closeConvert()" aria-label="Close">✕</button>'
      + '<div class="cw-title">Convert a ' + Eq().SLOT_META[slot].name + '</div>'
      + '<div class="cw-have">' + Eq().blueprintIconHTML(slot) + ' ' + Eq().blueprintLabel(slot, blueprintN) + ' on hand</div>'
      + buyBtn + anvil + '<div class="cw-grid">' + grid + '</div></div>';
  }

  function buyBlueprint() {
    var slot = _convertCtx.slot || 'weapon';
    var ok = Eq().buyBlueprint(state, slot);
    if (typeof showToast === 'function') showToast(ok ? (Eq().blueprintLabel(slot) + ' bought!') : 'not enough to buy a ' + Eq().blueprintLabel(slot));
    if (ok) { try { if (typeof queueSave === 'function') queueSave(); } catch (e) {} }
    drawConvertWindow();
  }

  function doConvert() {
    var slot = _convertCtx.slot || 'weapon';
    var all = Eq().craftable(slot === 'shield' ? 'shield' : 'sword', state);
    var sel = all.find(function (r) { return r.item_id === _convertSel; }); if (!sel) return;
    var result;
    try { result = Eq().convert(state, sel.item_id); }
    catch (err) {
                                                                                   
      if (typeof showToast === 'function') showToast('⚠️ not configured yet: ' + err.message);
      return;
    }
    if (!result.ok) {
      if (typeof showToast === 'function') {
        showToast(result.reason === 'no-blueprint' ? ('need a ' + Eq().blueprintLabel(result.slot) + ' first') : 'not enough materials');
      }
      return;
    }
    var pieceEl = document.querySelector('#equip-convert-window .eq-convert-piece');
    playConvertFX(pieceEl);
                                                                                         
    if (_convertCtx.frogId) {
      var f = state.frogs && state.frogs.find(function (x) { return x.id === _convertCtx.frogId; });
      if (f) Eq().equip(state, f.id, result.instance.id);
    }
    try { if (typeof queueSave === 'function') queueSave(); } catch (e) {}
    try { if (typeof syncHUDResourceCounts === 'function') syncHUDResourceCounts(); } catch (e) {}
    playRevealFX(result.row, result.instance, function () {
      drawConvertWindow();
      if (_convertCtx.frogId && typeof refreshFrogSprite === 'function') { try { refreshFrogSprite(_convertCtx.frogId); } catch (e) {} }
    });
  }

                                                                             
                                                                           
                                                                             
                                                                   
  function playConvertFX(targetEl) {
    if (!targetEl) return;
    var r = targetEl.getBoundingClientRect();
    var cx = r.left + r.width / 2, cy = r.top + r.height * 0.5;
    var layer = document.getElementById('fx-layer') || document.body;
    ['wp-bloom', 'wp-beam'].forEach(function (cls) {
      var d = document.createElement('div'); d.className = cls;
      d.style.left = cx + 'px'; d.style.top = cy + 'px';
      layer.appendChild(d); d.addEventListener('animationend', function () { d.remove(); });
    });
    for (var i = 0; i < 14; i++) {
      var e = document.createElement('div'); e.className = 'wp-ember';
      e.style.left = (cx + (Math.random() - 0.5) * r.width * 0.6) + 'px'; e.style.top = cy + 'px';
      e.style.setProperty('--rise', (-(60 + Math.random() * 120)).toFixed(0) + 'px');
      e.style.setProperty('--drift', ((Math.random() - 0.5) * 50).toFixed(0) + 'px');
      e.style.animationDelay = (Math.random() * 0.1).toFixed(2) + 's';
      layer.appendChild(e); e.addEventListener('animationend', function () { this.remove(); });
    }
    var dust = document.createElement('span'); dust.className = 'tinker-dust eq-fx-dust';
    dust.style.left = cx + 'px'; dust.style.top = cy + 'px';
    layer.appendChild(dust);
    [-10, 10].forEach(function (dx, idx) {
      var sp = document.createElement('span'); sp.className = 'tinker-spark eq-fx-spark';
      sp.style.left = (cx + dx) + 'px'; sp.style.top = cy + 'px'; sp.style.animationDelay = (idx * 0.1) + 's';
      layer.appendChild(sp); setTimeout(function () { sp.remove(); }, 900);
    });
    setTimeout(function () { dust.remove(); }, 900);
  }

                                                                           
                                                                             
                                                                              
                                                                         
                                                                         
                                                                           
                
  var STAND_IN = { weapon: 'assets/ui2/icon/atk_icon.png', shield: 'assets/ui2/icon/def_icon.png' };
  var TIERS = ['common', 'rare', 'epic', 'legendary'];
  function gearTier(rarity) { return TIERS.indexOf(rarity) >= 0 ? rarity : 'common'; }
                                                                                                       
                                                                                               
                                                                                             
                                                                                                
                                                                                   
                                                                                                
                                                                                         
                                                                                              
                                                                                              
                                                                                               
                       
  function pieceDef(row) {
    var piece = starterDef(row);
    if (piece && piece.path) return piece;
    var FT = g.FT;
    if (!row || !FT || typeof FT.traitDef !== 'function') return null;
    var key = (row.item_id && Eq().setPiece(row.item_id)) ||
      (row.family ? 'set:' + row.family + ':' + (row.item_type === 'shield' ? 'shield' : 'weapon') : null);
    if (!key) return null;
    var t = FT.traitDef(key);
    return t && t.path ? t : null;
  }
  function setArtSrc(row) { var t = pieceDef(row); return t ? t.path : null; }
                                                                                  
                                                                             
  function wornPieces(state, frogId) {
    var out = {};
    Eq().SLOTS.forEach(function (slot) {
      var inst = Eq().equippedOn(state, frogId, slot), row = null;
      if (!inst) return;
      try { row = Eq().itemRow(inst.item_id); } catch (e) { return; }
      var t = pieceDef(row);
      if (t) out[slot] = t.k;
    });
    return out;
  }
  function itemArtSrc(row) { return setArtSrc(row) || STAND_IN[Eq().slotFor(row.item_type)] || STAND_IN.weapon; }
                                                                              
                                                                             
                                                                                
  function blueprintMarkHTML(slot) {
    var meta = Eq().BLUEPRINTS[slot === 'shield' ? 'shield' : 'weapon'];
    return '<img class="eq-bpmark" src="' + meta.icon + '" alt="Blueprint" draggable="false">';
  }
  function blueprintName(row) { return displayName(row) + ' Blueprint'; }
                                                                                             
  function itemArt(row, opts) {
    opts = opts || {};
    var src = itemArtSrc(row), set = !!setArtSrc(row);
    if (g.KitUI && KitUI.art) return KitUI.art(src, { size: opts.size, ring: opts.ring != null ? opts.ring : set, fill: opts.fill || (set ? 0.86 : 0.92) });
    return '<img src="' + src + '" alt="">';
  }
                                                                                   
  var BOOSTS = [['buff_attack', 'atk', 'ATK'], ['buff_defense', 'def', 'DEF'], ['buff_hp', 'hp', 'HP'],
                ['buff_harvest_wood', 'wood', 'WOOD'], ['buff_harvest_stone', 'stone', 'STONE']];
  function boosts(row) {
    return BOOSTS.filter(function (b) { return row[b[0]]; }).map(function (b) {
      return { kind: b[1], text: '+' + Eq().buffValue(row, b[0]) + ' ' + b[2] + (b[1]==='wood'||b[1]==='stone'?'/min':'') };
    });
  }
                                                                                        
                                                                                              
  function pieceRow(pieceKey) {
    var id = Eq().itemForPiece(pieceKey);
    try { return id ? Eq().itemRow(id) : null; } catch (e) { return null; }
  }
  function pieceBoost(pieceKey) {
    var row = pieceRow(pieceKey), best = null;
    if (!row) return null;
    BOOSTS.forEach(function (b) {
      var v = Eq().buffValue(row, b[0]);
      if (v > 0 && (!best || v > best.v)) best = { v: v, kind: b[1], label: '+' + v + ' ' + b[2] + (b[1]==='wood'||b[1]==='stone'?'/min':'') };
    });
    return best && { kind: best.kind, label: best.label };
  }
  function boostPillsHTML(row, size) {
    return boosts(row).map(function (b) {
      return g.KitUI && KitUI.boostPill ? KitUI.boostPill({ size: size || 'md', kind: b.kind, text: b.text }) : '<span>' + b.text + '</span>';
    }).join('');
  }

                                                                            
                                                                           
                                                                                  
                                                                               
                                                                                 
                                                                                
                                                                              
                                                                                
                                                                               
                                                                              
                                                                             
                                                                               
                                                                                
                                      
  var FORGE = {
    hits: 3,
    strikeMs: 90,                                 
    swingMs: 360,                                        
    hitStopMs: 190,                                                            
    readyMs: 450,                                                             
    shakePx: [5, 8, 6],                                                           
    sparks: [12, 18, 34],
    shreds: 16,
    words: ['CLINK!', 'CLANK!', 'BOOM!'],
    titles: ['Tap the blueprint!', 'Keep tapping!', 'One more!'],
    hammer: { rest: 34, wind: 46, strike: -21 },                                
    impact: { x: 0.55, y: 0.46 }                                                                       
  };
  var HAMMER_ART = 'assets/ui2/grimoire/icon_hammer.png', STAR_ART = 'assets/ui2/grimoire/sparkle.png';
                                                                              
  var CRACKS = [
    ['M52 50 L46 43 L48 37 L42 30', 'M52 50 L60 46 L65 48 L71 42'],
    ['M52 50 L57 58 L54 64 L59 71', 'M52 50 L43 55 L38 53 L31 59', 'M46 43 L39 44 L35 40'],
    ['M52 50 L62 54 L67 62 L73 61', 'M52 50 L54 40 L60 34 L59 27', 'M57 58 L64 64', 'M43 55 L41 63']
  ];
  var STARS = [[-10, 14], [106, 8], [-16, 72], [110, 80], [28, -18], [78, 108]];
  function reduceMotion() { try { return g.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } }
  function anim(el, frames, o) { try { return el.animate(frames, o); } catch (e) { return null; } }
  function rnd(a, b) { return a + Math.random() * (b - a); }
                                                                           
  function buzz(p) {
    try {
      var n = g.navigator;
      if (n && n.vibrate && (!n.userActivation || n.userActivation.hasBeenActive)) n.vibrate(p);
    } catch (e) {}
  }
                                                                               
                                                           
  function fxNode(layer, cls, x, y, ms) {
    var n = document.createElement('span'); n.className = cls;
    n.style.left = x + 'px'; n.style.top = y + 'px';
    layer.appendChild(n);
    setTimeout(function () { n.remove(); }, ms + 120);
    return n;
  }
                                                                                                            
  function noiseBurst(c, out, t0, dur, freq, vol) {
    var len = Math.floor(c.sampleRate * dur), buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0);
    for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    var src = c.createBufferSource(); src.buffer = buf;
    var bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = freq; bp.Q.value = 1.2;
    var ng = c.createGain(); ng.gain.value = vol;
    src.connect(bp); bp.connect(ng); ng.connect(out); src.start(t0);
  }
  function forgeClink(n) {
    var c = typeof ac === 'function' ? ac() : null; if (!c) return;
    var t0 = c.currentTime, up = 1 + (n - 1) * 0.09;
    var out = c.createGain(); out.gain.value = 0.5; out.connect(c.destination);
    [[1850, 0.9, 0.22], [2780, 0.5, 0.16], [4120, 0.25, 0.1]].forEach(function (p) {
      var o = c.createOscillator(), gn = c.createGain(); o.type = 'sine'; o.frequency.value = p[0] * up;
      gn.gain.setValueAtTime(p[1], t0); gn.gain.exponentialRampToValueAtTime(0.0001, t0 + p[2]);
      o.connect(gn); gn.connect(out); o.start(t0); o.stop(t0 + p[2] + 0.02);
    });
    noiseBurst(c, out, t0, 0.04, 3200, 0.35);
  }
                                                               
  function forgeBoom() {
    var c = typeof ac === 'function' ? ac() : null; if (!c) return;
    var t0 = c.currentTime, out = c.createGain(); out.gain.value = 0.6; out.connect(c.destination);
    var o = c.createOscillator(), gn = c.createGain(); o.type = 'sine';
    o.frequency.setValueAtTime(160, t0); o.frequency.exponentialRampToValueAtTime(42, t0 + 0.38);
    gn.gain.setValueAtTime(1, t0); gn.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.42);
    o.connect(gn); gn.connect(out); o.start(t0); o.stop(t0 + 0.45);
    noiseBurst(c, out, t0, 0.2, 1400, 0.55);
    setTimeout(function () { try { if (typeof mergeArp === 'function') mergeArp(4); } catch (e) {} }, 120);
  }

  function playRevealFX(row, instance, onDone, opts) {
    opts = opts || {};
    var reduce = reduceMotion(), tier = gearTier(row.rarity), slot = Eq().slotFor(row.item_type), name = displayName(row);
    var overlay = document.createElement('div');
    overlay.className = 'eq-reveal-overlay eq-forge eq-r-' + tier + (opts.guided ? ' eq-forge--guided' : '');
    overlay.setAttribute('data-hits', '0');
    overlay.setAttribute('data-phase', 'forge');
    var hand = function (k) { return typeof Assets !== 'undefined' && Assets.ui ? Assets.ui(k) : 'assets/icons/' + k + '.png'; };
    var art = opts.pieceBlueprint
      ? '<span class="eq-forge-sheet"></span><span class="eq-forge-piece">' + itemArt(row, { ring: false }) + '</span>' + blueprintMarkHTML(slot)
      : '<img class="eq-forge-scroll" src="' + Eq().BLUEPRINTS[slot === 'shield' ? 'shield' : 'weapon'].icon + '" alt="" draggable="false">';
    var cracks = '<svg class="eq-forge-cracks" viewBox="0 0 100 100" aria-hidden="true">' + CRACKS.map(function (paths, i) {
      return '<g class="eq-forge-crack" data-hit="' + (i + 1) + '">' + paths.map(function (d) { return '<path pathLength="1" d="' + d + '"/>'; }).join('') + '</g>';
    }).join('') + '</svg>';
    var pips = ''; for (var p = 0; p < FORGE.hits; p++) pips += '<i></i>';
    var stars = STARS.map(function (s, i) {
      return '<img class="eq-forge-star" src="' + STAR_ART + '" alt="" draggable="false" style="left:' + s[0] + '%;top:' + s[1] + '%;animation-delay:' + (0.55 + i * 0.23).toFixed(2) + 's">';
    }).join('');
    var ok = g.KitUI ? KitUI.button({ tone: 'gold', shape: 'pill', size: 'md', className: 'eq-reveal-ok', label: 'COLLECT', onclick: 'Equipment.UI._closeReveal()' })
      : '<button class="eq-reveal-ok" onclick="Equipment.UI._closeReveal()">COLLECT</button>';
    overlay.innerHTML = '<div class="eq-reveal-card">'
      + '<div class="eq-forge-stage">'
        + '<div class="eq-forge-title">' + FORGE.titles[0] + '</div>'
        + '<button type="button" class="eq-forge-bp" aria-label="Tap the blueprint to craft ' + name + ': 0 of ' + FORGE.hits + '">'
          + '<span class="eq-forge-glow" aria-hidden="true"></span>'
          + '<span class="eq-forge-bpart"><span class="eq-forge-squash">' + art + cracks + '</span></span>'
          + '<span class="eq-forge-hammer"><img src="' + HAMMER_ART + '" alt="" draggable="false"></span>'
          + '<span class="eq-forge-tap" aria-hidden="true"><span class="eq-forge-hand"><img class="f1" src="' + hand('pointClicker01') + '" alt=""><img class="f2" src="' + hand('pointClicker02') + '" alt=""></span><b>TAP TAP!</b></span>'
        + '</button>'
        + '<div class="eq-forge-pips" aria-hidden="true">' + pips + '</div>'
        + '<div class="eq-forge-make"><small>CRAFTING</small>' + name + '</div>'
      + '</div>'
      + '<div class="eq-reveal-result eq-r-' + tier + '" hidden>'
        + '<span class="eq-forge-itemwrap"><span class="eq-forge-rays" aria-hidden="true"></span>'
          + '<span class="eq-reveal-item eq-reveal-tile kit-rarity-fill--' + tier + '">' + itemArt(row) + '</span>' + stars + '</span>'
        + '<div class="eq-reveal-rarity">' + tier + '</div>'
        + '<div class="eq-reveal-name">' + name + '</div>'
        + '<div class="eq-reveal-boost" aria-label="' + boostLabel(row) + '">' + boostPillsHTML(row, 'md') + '</div>'
        + ok
      + '</div></div>'
      + '<div class="eq-forge-fx" aria-hidden="true"></div><div class="eq-forge-flash" aria-hidden="true"></div>';
    document.body.appendChild(overlay);
    if (g.KitUI && KitUI.fitArt) overlay.querySelectorAll('.eq-forge-piece .kit-art img').forEach(function (img) { KitUI.fitArt(img); });

    var card = overlay.querySelector('.eq-reveal-card'), bp = overlay.querySelector('.eq-forge-bp');
    var squash = overlay.querySelector('.eq-forge-squash'), hammer = overlay.querySelector('.eq-forge-hammer');
    var fx = overlay.querySelector('.eq-forge-fx'), title = overlay.querySelector('.eq-forge-title');
    var pipEls = overlay.querySelectorAll('.eq-forge-pips i');
    var tierColor = getComputedStyle(overlay).getPropertyValue('--eq-forge-tier').trim() || '#fff';
    var hits = 0, timers = [], hammerAnim = null, shakeAnim = null;
    function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
                                                                                               
    function impact() {
      var r = bp.getBoundingClientRect(), o = overlay.getBoundingClientRect();
      return { x: r.left - o.left + r.width * FORGE.impact.x, y: r.top - o.top + r.height * FORGE.impact.y, w: r.width };
    }

    function swing(final) {
      if (reduce) return;
      var H = FORGE.hammer, total = final ? FORGE.strikeMs + FORGE.hitStopMs : FORGE.swingMs, at = FORGE.strikeMs / total;
      var frames = [
        { transform: 'rotate(' + H.rest + 'deg)', easing: 'ease-out' },
        { transform: 'rotate(' + H.wind + 'deg)', offset: at * 0.35, easing: 'cubic-bezier(.6,0,1,.5)' },
        { transform: 'rotate(' + H.strike + 'deg)', offset: at, easing: 'ease-out' }
      ];
                                                                                            
      frames = frames.concat(final ? [{ transform: 'rotate(' + H.strike + 'deg)' }]
        : [{ transform: 'rotate(' + (H.strike + 8) + 'deg)', offset: at + 0.09, easing: 'ease-in-out' }, { transform: 'rotate(' + H.rest + 'deg)' }]);
      if (hammerAnim) hammerAnim.cancel();
      hammerAnim = anim(hammer, frames, { duration: total, fill: final ? 'forwards' : 'none' });
    }
    function shake(px, ms) {
      if (reduce || !px) return;
      var f = [], k = 7;
      for (var i = 0; i < k; i++) { var m = px * (1 - i / k); f.push({ transform: 'translate(' + rnd(-m, m).toFixed(1) + 'px,' + rnd(-m, m).toFixed(1) + 'px)' }); }
      f.push({ transform: 'translate(0,0)' });
      if (shakeAnim) shakeAnim.cancel();
      shakeAnim = anim(card, f, { duration: ms || 260 });
    }
    function ring(pt, color, scale, delay) {
      var ms = 380 + scale * 90, r = fxNode(fx, 'eq-forge-ring', pt.x, pt.y, ms + (delay || 0));
      r.style.borderColor = color;
      anim(r, [{ transform: 'scale(.15)', opacity: 1 }, { transform: 'scale(' + scale + ')', opacity: 0 }],
        { duration: ms, delay: delay || 0, easing: 'cubic-bezier(.1,.7,.3,1)', fill: 'both' });
    }
                                                                                       
    function sparks(pt, n, all) {
      if (reduce) n = Math.ceil(n / 3);
      for (var i = 0; i < n; i++) {
        var a = all ? rnd(0, Math.PI * 2) : -Math.PI / 2 + rnd(-1.45, 1.45);
        var d = rnd(0.18, 0.5) * pt.w * (all ? 1.5 : 1), deg = a * 180 / Math.PI, ms = rnd(380, 680);
        var x1 = Math.cos(a) * d, y1 = Math.sin(a) * d;
        var s = fxNode(fx, 'eq-forge-spark' + (i % 3 ? '' : ' eq-forge-spark--hot'), pt.x, pt.y, ms);
        anim(s, [
          { transform: 'translate(0,0) rotate(' + deg + 'deg) scaleX(1.5)', opacity: 1, easing: 'cubic-bezier(.1,.8,.3,1)' },
          { transform: 'translate(' + x1.toFixed(1) + 'px,' + y1.toFixed(1) + 'px) rotate(' + deg + 'deg) scaleX(.9)', opacity: 1, offset: 0.6, easing: 'cubic-bezier(.5,0,1,.7)' },
          { transform: 'translate(' + (x1 * 1.15).toFixed(1) + 'px,' + (y1 + 0.2 * pt.w).toFixed(1) + 'px) rotate(' + (deg + (x1 < 0 ? -60 : 60)) + 'deg) scaleX(.2)', opacity: 0 }
        ], { duration: ms, fill: 'forwards' });
      }
    }
    function word(pt, text, n) {
      if (reduce) return;
      var side = n % 2 ? 1 : -1, tilt = 12 * side, ms = 720;
      var w = fxNode(fx, 'eq-forge-word eq-forge-word--' + n, pt.x + side * pt.w * 0.36, pt.y - pt.w * 0.34, ms);
      w.textContent = text;
      anim(w, [
        { transform: 'translate(-50%,-50%) scale(.2) rotate(' + tilt + 'deg)', opacity: 0 },
        { transform: 'translate(-50%,-50%) scale(1.35) rotate(' + tilt + 'deg)', opacity: 1, offset: 0.2 },
        { transform: 'translate(-50%,-62%) scale(1) rotate(' + tilt * 0.6 + 'deg)', opacity: 1, offset: 0.62 },
        { transform: 'translate(-50%,-120%) scale(.9) rotate(' + tilt * 0.6 + 'deg)', opacity: 0 }
      ], { duration: ms, easing: 'ease-out', fill: 'forwards' });
    }
                                                                                          
    function shreds(pt, n) {
      if (reduce) return;
      for (var i = 0; i < n; i++) {
        var a = rnd(0, Math.PI * 2), d = rnd(0.32, 0.8) * pt.w, r0 = rnd(-40, 40), r1 = r0 + rnd(-560, 560), ms = rnd(760, 1180);
        var x1 = Math.cos(a) * d, y1 = Math.sin(a) * d * 0.8 - pt.w * 0.12;
        var s = fxNode(fx, 'eq-forge-shred' + (opts.pieceBlueprint ? ' eq-forge-shred--blue' : ''), pt.x, pt.y, ms);
        anim(s, [
          { transform: 'translate(0,0) rotate(' + r0.toFixed(0) + 'deg) scale(' + rnd(0.7, 1.25).toFixed(2) + ')', opacity: 1, easing: 'cubic-bezier(.1,.8,.3,1)' },
          { transform: 'translate(' + x1.toFixed(1) + 'px,' + y1.toFixed(1) + 'px) rotate(' + ((r0 + r1) / 2).toFixed(0) + 'deg)', opacity: 1, offset: 0.42, easing: 'cubic-bezier(.45,0,.9,.6)' },
          { transform: 'translate(' + (x1 * 1.2).toFixed(1) + 'px,' + (y1 + pt.w * 0.7).toFixed(1) + 'px) rotate(' + r1.toFixed(0) + 'deg) scale(.55)', opacity: 0 }
        ], { duration: ms, fill: 'forwards' });
      }
    }

    function tap(e) {
      if (e) e.stopPropagation();
      if (hits >= FORGE.hits) return;
      var n = ++hits, final = n >= FORGE.hits;
      if (final) bp.disabled = true;                                                  
      swing(final);
      later(function () { strike(n, final); }, reduce ? 0 : FORGE.strikeMs);
    }
    function strike(n, final) {
      var pt = impact();
      overlay.setAttribute('data-hits', String(n));
      if (pipEls[n - 1]) pipEls[n - 1].classList.add('on');
      bp.setAttribute('aria-label', 'Tap the blueprint to craft ' + name + ': ' + n + ' of ' + FORGE.hits);
      forgeClink(n);
      buzz(final ? 25 : 12);
      ring(pt, '#fff', 1.1 + n * 0.3);
      shake(FORGE.shakePx[n - 1]);
      if (!final) {
        title.textContent = FORGE.titles[n];
        anim(title, [{ transform: 'scale(1.3) rotate(-3deg)' }, { transform: 'scale(1)' }], { duration: 300, easing: 'cubic-bezier(.2,1.6,.4,1)' });
        anim(squash, [
          { transform: 'scale(1.16,.8) rotate(' + (n % 2 ? -4 : 4) + 'deg)' },
          { transform: 'scale(.93,1.08) rotate(' + (n % 2 ? 2 : -2) + 'deg)', offset: 0.45 },
          { transform: 'none' }
        ], { duration: 320, easing: 'cubic-bezier(.2,.9,.3,1)' });
        sparks(pt, FORGE.sparks[n - 1]);
        word(pt, FORGE.words[n - 1], n);
        return;
      }
                                                                                   
      overlay.classList.add('eq-forge--stop');
      anim(squash, [{ transform: 'scale(1.22,.74)' }, { transform: 'scale(1.22,.74)' }], { duration: FORGE.hitStopMs + 60, fill: 'forwards' });
      later(burst, reduce ? 0 : FORGE.hitStopMs);
    }
    function burst() {
      var pt = impact(), stage = overlay.querySelector('.eq-forge-stage'), res = overlay.querySelector('.eq-reveal-result');
      overlay.classList.remove('eq-forge--stop');
      forgeBoom();
      buzz([40, 30, 70]);
      anim(overlay.querySelector('.eq-forge-flash'), [{ opacity: reduce ? 0.45 : 0.95 }, { opacity: 0 }], { duration: 520, easing: 'ease-out' });
      shreds(pt, FORGE.shreds);
      sparks(pt, FORGE.sparks[FORGE.hits - 1], true);
      word(pt, FORGE.words[FORGE.hits - 1], FORGE.hits);
      ring(pt, '#fff', 2.6);
      ring(pt, tierColor, 3.6, 110);
      overlay.setAttribute('data-phase', 'result');
      stage.hidden = true;
      res.hidden = false;
      if (g.KitUI && KitUI.fitArt) res.querySelectorAll('.kit-art img').forEach(function (img) { KitUI.fitArt(img); });
                                                                               
      var item = res.querySelector('.eq-reveal-item'), ir = item.getBoundingClientRect(), o = overlay.getBoundingClientRect();
      var dx = (pt.x - (ir.left - o.left + ir.width / 2)).toFixed(1), dy = (pt.y - (ir.top - o.top + ir.height / 2)).toFixed(1);
      anim(item, reduce ? [{ opacity: 0, transform: 'scale(.9)' }, { opacity: 1, transform: 'none' }] : [
        { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(.25) rotate(-22deg)', opacity: 0 },
        { transform: 'translate(' + (dx * 0.35).toFixed(1) + 'px,' + (dy * 0.35).toFixed(1) + 'px) scale(1.32) rotate(8deg)', opacity: 1, offset: 0.36 },
        { transform: 'translate(0,0) scale(.9) rotate(-4deg)', offset: 0.6 },
        { transform: 'scale(1.06) rotate(2deg)', offset: 0.8 },
        { transform: 'none' }
      ], { duration: reduce ? 300 : 720, easing: 'cubic-bezier(.25,.8,.35,1)' });
      shake(18, 380);
      later(function () { res.classList.add('eq-forge-ready'); }, FORGE.readyMs);
    }

    bp.addEventListener('click', tap);
                                                                     
    overlay.addEventListener('click', function () {
      if (hits || overlay.getAttribute('data-phase') !== 'forge' || reduce) return;
      anim(bp, [{ transform: 'rotate(0)' }, { transform: 'rotate(-6deg) scale(1.04)' }, { transform: 'rotate(5deg)' }, { transform: 'none' }], { duration: 320 });
    });
    _revealCloseHandler = function () {
      timers.forEach(clearTimeout);
      overlay.remove();
      _revealCloseHandler = null;
      if (onDone) onDone();
    };
  }
  var _revealCloseHandler = null;
  function closeReveal() { if (_revealCloseHandler) _revealCloseHandler(); }

                                                                            
                                                                         
                                                                           
  var _catTab = 'weapon';
  function setCatalogTab(slot) { _catTab = slot; if (typeof render === 'function') render(); }
  function catalogHTML() {
    var tabs;
    if (typeof KitUI !== 'undefined') {
      tabs = KitUI.tabRow(Eq().SLOTS.map(function (slot) {
        return { key: slot, label: Eq().SLOT_META[slot].icon + ' ' + Eq().SLOT_META[slot].name, onclick: "Equipment.UI.setCatalogTab('" + slot + "')" };
      }), _catTab);
    } else {
      tabs = '<div class="eq-cat-tabs">' + Eq().SLOTS.map(function (slot) {
        return '<button class="eq-cat-tab' + (_catTab === slot ? ' on' : '') + '" onclick="Equipment.UI.setCatalogTab(\'' + slot + '\')">'
          + Eq().SLOT_META[slot].icon + ' ' + Eq().SLOT_META[slot].name + '</button>';
      }).join('') + '</div>';
    }
    var itemType = _catTab === 'shield' ? 'shield' : 'sword';
    var rows = Eq().catalog(itemType);
    var owned = {};
    (Eq().init(state).items || []).forEach(function (it) { owned[it.item_id] = true; });
    var grid = rows.map(function (r) {
      var isOwned = !!owned[r.item_id];
      return '<div class="gr-piece eq-cat-piece' + (isOwned ? ' owned' : '') + '">'
        + badgeHTML(r, isOwned ? '' : 'locked')
        + '<div class="gr-piece-name">' + displayName(r) + '</div>'
        + '<div class="gr-piece-sub">' + boostLabel(r) + '</div>'
      + '</div>';
    }).join('');
    return tabs + '<div class="eq-cat-grid">' + grid + '</div>';
  }

  g.Equipment = Eq();
  g.Equipment.UI = {
    displayName: displayName, boostLabel: boostLabel, rarityColor: rarityColor, badgeHTML: badgeHTML,
    cellsHTML: cellsHTML, toggleRack: toggleRack, rackOpenFor: rackOpenFor, rackHTML: rackHTML, equipFromRack: equipFromRack,
    setFresh: setFresh, freshId: freshId,
    openConvert: openConvert, closeConvert: closeConvert, selectConvertItem: selectConvertItem,
    doConvert: doConvert, buyBlueprint: buyBlueprint, _closeReveal: closeReveal,
    catalogHTML: catalogHTML, setCatalogTab: setCatalogTab,
    playConvertFX: playConvertFX, playRevealFX: playRevealFX,
    gearTier: gearTier, itemArt: itemArt, itemArtSrc: itemArtSrc, drawnArtSrc: setArtSrc, boosts: boosts, boostPillsHTML: boostPillsHTML,
    wornPieces: wornPieces, pieceDef: pieceDef, pieceRow: pieceRow, pieceBoost: pieceBoost,
    blueprintMarkHTML: blueprintMarkHTML, blueprintName: blueprintName
  };
})(typeof window !== 'undefined' ? window : globalThis);
