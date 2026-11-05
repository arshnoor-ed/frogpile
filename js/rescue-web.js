                                                                            
                                                                               
                                                                                
                                                                               
                                                                         
                                                                     
                                                                             
                                                                            
                                                                            
                                                                           
                       

                                                                            
                                                                            
                              
                                                                              
                                                                             
                                                                            
                                                                             
                                                                            
                                       
                                                                              
                                                                            
                                                                             
                   
                                                                            
                                                                              
                                                                        
                                                                    
                                                                            
                                                                   
(function (g) {
  'use strict';
  var WEB_ART = { web: 'assets/expeditions/rescue/spider-web.webp' };
  var TADPOLE_ICON = 'assets/frog2/tadpole/stage_0.png';                                                
  var RESCUE_FROG = 'rescue_frog_', GEAR_PIECE = 'gear_', TICKET = 'family_ticket';

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function S() { return typeof state !== 'undefined' ? state : null; }                                  
  function ft() { return g.FT || (typeof FT !== 'undefined' ? FT : null); }                                  
  function kit() { return g.KitUI || {}; }

                                                        
  function webInfo(web) { return { web: web, name: 'Spider Web', art: WEB_ART[web] || WEB_ART.web }; }

  function tableRows(tableId) {
    try { return g.DropTables.groupRowsByTable(g.FPConfig.rows('DropTables'))[String(tableId)] || []; }
    catch (e) { return []; }
  }
  function tableItems(tableId) { return tableRows(tableId).map(function (r) { return String(r.item_id || ''); }); }
  function ticketsName(n) { return n + ' Family Ticket' + (n === 1 ? '' : 's'); }
  function familyOfItem(itemId) { return itemId.indexOf(RESCUE_FROG) === 0 ? itemId.slice(RESCUE_FROG.length) : null; }

                                                                            
                                                                             
                                                                             
  function familyFrog(family, id) {
    var F = ft(), fam = F && F.familyDefOf(family);
    if (!fam) throw new Error('[RescueWeb] unknown trait family "' + family + '"');
    var frog = { id: id || 'rescue-' + family, tier: F.MAX_MERGES, xp: 0, skillSeed: 0.5, color: 'green', headwear: 'none', rarity: 'common' };
    F.adopt(frog);
    F.SLOTS.forEach(function (slot) { frog.traits[slot] = fam.traits[slot] || null; });
    F.adopt(frog);
    return frog;
  }
                                                                                                        
  function familyGear(family) {
    var F = ft(), eq = g.Equipment, pool = [];
    try { pool = (F.familyRewardPool || F.familyTraitPool)(family) || []; } catch (e) { pool = []; }
    var out = {};
    pool.forEach(function (p) {
      if ((p.slot === 'weapon' || p.slot === 'shield') && !out[p.slot] && eq && eq.itemForPiece && eq.itemForPiece(p.k)) out[p.slot] = p.k;
    });
    return out;
  }

                                                                            
                                                                                
                                                                              
  function rescueFrog(s, family) {
    var base = typeof newFrog === 'function' ? newFrog() : { id: 'f' + Date.now().toString(36) };                                  
    var frog = familyFrog(family, base.id);
    Object.keys(base).forEach(function (k) { if (!(k in frog)) frog[k] = base[k]; });
    frog.rescued = family;
    try { if (typeof frogRarity === 'function') frog.rarity = frogRarity(frog); } catch (e) {                   }                                  
    (s.frogs || (s.frogs = [])).push(frog);
    s.totalHatched = (s.totalHatched || 0) + 1;
    try { if (typeof noteFrogDiscoveries === 'function') noteFrogDiscoveries(frog); } catch (e) {                                          }                                  
    var gear = familyGear(family), eq = g.Equipment;
    ['weapon', 'shield'].forEach(function (slot) {
      if (!gear[slot] || !eq) return;
      var made = eq.grantPiece(s, gear[slot]);
      if (made && made.instance) eq.equip(s, frog.id, made.instance.id);
    });
    return frog;
  }

                                                                         
                                                                           
                                                                   
  function prizeView(tableId) {
    var row = tableRows(tableId)[0], id = row ? String(row.item_id || '') : '';
    if (!id) return null;
    if (id === TICKET) {
      var qty = Math.max(1, Math.round(Number(row.max_qty) || 1));
      return { kind: 'ticket', itemId: id, qty: qty, name: ticketsName(qty) };
    }
    var R = g.Rewards;
    if (id.indexOf(GEAR_PIECE) === 0) {
      var row = null, slot = null;
      try { row = g.Equipment.itemRow(id.slice(GEAR_PIECE.length)); slot = g.Equipment.slotFor(row.item_type); } catch (e) { row = null; }
      return { kind: 'gear', itemId: id, slot: slot, name: R ? R.rewardLabel(id) : 'Gear', img: R ? R.rewardImage(id) : null };
    }
    var family = familyOfItem(id);
    if (family) return { kind: 'frog', itemId: id, family: family, name: R ? R.rewardLabel(id) : 'Frog' };
    return null;
  }
                                                                                
                                                   
  function ticketsArtHTML(n, px) {
    var icon = g.FamilyTicket && g.FamilyTicket.iconHTML ? g.FamilyTicket.iconHTML() : '';
    var out = [];
    for (var i = 0; i < n; i++) {
      var o = i - (n - 1) / 2;
      out.push({ o: o, html: '<i style="transform:translate(' + (o * 26).toFixed(1) + '%,' + (Math.abs(o) * 9).toFixed(1) + '%) rotate(' + (o * 15).toFixed(1) + 'deg)">' + icon + '</i>' });
    }
    out.sort(function (a, b) { return Math.abs(b.o) - Math.abs(a.o); });
    return '<span class="rw-tickets" style="width:' + px + 'px;height:' + px + 'px">' + out.map(function (t) { return t.html; }).join('') + '</span>';
  }
                                                                                                 
  function prizeArtHTML(view, px) {
    if (!view) return '';
    if (view.kind === 'ticket') return ticketsArtHTML(Math.min(view.qty, 3), px);
    if (view.kind === 'frog') {
      try { return frogArtHTML(familyFrog(view.family, 'rescue-view-' + view.family), px); }                                  
      catch (e) { return ''; }
    }
                                                                              
    if (!view.img) return '';
    var K = kit();
    return K.art ? K.art(view.img, { size: px, ring: false, fill: 0.96 }) : '<img src="' + esc(view.img) + '" alt="" draggable="false">';
  }
                                                                                 
  function prizeOpen(tableId) { return !!(g.Rewards && g.Rewards.rescuePrizeOpen(S(), tableId)); }
                                                                                                
  function prizeWaiting(tableId) { return !!(g.Rewards && g.Rewards.rescuePrizeWaiting && g.Rewards.rescuePrizeWaiting(S(), tableId)); }

                                                                             
                                                                          
                                                                             
                                                                                        
                                                                         
                                                                              
                                                                             
                                                                         
                                                                                     
  function rollCatch(waves, rng) {
    var rand = rng || Math.random, changed = false;
    var out = (waves || []).map(function (w) {
      var h = w && w.harvest;
      if (!h || !h.web || !h.prizes) return w;
      var kept = h.prizes.filter(function (p) {
        return p.chance == null || !prizeOpen(p.table) || prizeWaiting(p.table) || rand() < p.chance;
      });
      if (kept.length === h.prizes.length) return w;
      changed = true;
      var hc = Object.assign({}, h);
      if (kept.length) hc.prizes = kept; else delete hc.prizes;
      return Object.assign({}, w, { harvest: hc });
    });
    return changed ? out : waves;
  }

                                                                             
                                                                       
  function chancePrizes(waves) {
    var out = [];
    (waves || []).forEach(function (w) {
      var h = w && w.harvest;
      if (!h || !h.web) return;
      (h.prizes || []).forEach(function (p) {
        if (p.chance == null || !prizeOpen(p.table)) return;
        var v = prizeView(p.table);
        if (v) out.push({ view: v, chance: p.chance, waiting: prizeWaiting(p.table), tableId: p.table });
      });
    });
    return out;
  }
  function pctText(p) { var n = p * 100; return (n >= 10 || n === Math.round(n) ? Math.round(n) : Math.round(n * 10) / 10) + '%'; }
                                                                                                 
  function familyPieces(family) {
    var F = ft(), pool = [];
    try { pool = (F.familyRewardPool || F.familyTraitPool)(family) || []; } catch (e) { pool = []; }
    var gear = familyGear(family);
    return pool.filter(function (p) { return p.slot === 'weapon' || p.slot === 'shield' ? gear[p.slot] === p.k : true; });
  }
                                                                            
                                                                        
  function briefHTML(waves) {
    return chancePrizes(waves).map(function (c) {
      var v = c.view, frog = v.kind === 'frog', fam = frog ? familyName(v.family) : '';
      var title = frog ? 'Rescue a ' + fam + ' frog' : v.name;
      var line = c.waiting
        ? 'It is still caught in the web from your last run. Clear the stage to bring it home!'
        : frog ? 'Sometimes a frog is caught in the web. Free it and clear the stage to win a whole new family set!'
          : 'Sometimes it is caught in the web. Free it to take it home!';
      var pieces = frog ? familyPieces(v.family) : [];
      var K = kit();
      var icons = pieces.map(function (p) {
        var art = p.path ? (K.art ? K.art(p.path, { size: 34, ring: false, fill: 0.94 }) : '<img src="' + esc(p.path) + '" alt="" draggable="false">') : '';
        return '<span class="xb-rescue__piece" title="' + esc(p.n || '') + '">' + art + '</span>';
      }).join('');
      return '<section class="xb-rescue' + (c.waiting ? ' xb-rescue--waiting' : '') + '" data-prize="' + esc(c.tableId) + '">'
        + '<div class="xb-rescue__head"><p class="xb-rescue__eyebrow">' + (c.waiting ? 'STILL IN THE WEB' : 'RESCUE CHANCE') + '</p>'
          + '<span class="xb-rescue__pct">' + (c.waiting ? 'NEXT RUN' : pctText(c.chance) + ' A RUN') + '</span></div>'
        + '<div class="xb-rescue__row"><span class="xb-rescue__art"><img class="xb-rescue__web" src="' + esc(webInfo('web').art) + '" alt="" draggable="false">'
          + '<span class="xb-rescue__catch">' + prizeArtHTML(v, 64) + '</span></span>'
          + '<span class="xb-rescue__info"><span class="xb-rescue__title">' + esc(title) + '</span>'
            + '<span class="xb-rescue__line">' + esc(line) + '</span></span></div>'
        + (icons ? '<div class="xb-rescue__pieces" aria-label="' + esc('The ' + fam + ' set') + '">' + icons + '</div>' : '')
        + '</section>';
    }).join('');
  }
                                                                                
                                                            
  function stageNote(w) {
    var h = w && w.harvest, open = ((h && h.prizes) || []).filter(function (p) { return prizeOpen(p.table); });
    open.sort(function (a, b) { return (a.chance != null) - (b.chance != null); });                         
    return open.map(function (p) {
      if (p.chance == null) return ' Something else is caught in it too…';
      var v = prizeView(p.table), what = v ? (v.kind === 'frog' ? 'a ' + familyName(v.family) + ' frog' : v.name) : 'something else';
      return prizeWaiting(p.table) ? ' ' + what.charAt(0).toUpperCase() + what.slice(1) + ' is still caught in it!'
        : ' Sometimes ' + what + ' is caught in it too (' + pctText(p.chance) + ' a run)!';
    }).filter(function (s, i, all) { return all.indexOf(s) === i; }).join('');
  }

                                                                         
  function frogById(id) { var s = S(); return s && (s.frogs || []).find(function (f) { return f.id === id; }); }
  function nameOf(f) { try { return frogDisplayName(f); } catch (e) { return 'Frog'; } }                                  
  function familyName(family) { var F = ft(), d = null; try { d = F && F.familyDefOf(family); } catch (e) { d = null; } return (d && d.n) || family; }

                                                                           
                                                                           
                                                                       
  function attach(claim, results) {
    if (!claim || !results) return;
    var frogs = [], gear = [], waiting = [], tickets = [];
    results.forEach(function (r) {
      if (!r || !r.web) return;
      if (r.status === 'rescue-waiting') { var v = prizeView(r.web); if (v) waiting.push(v); return; }
      if (r.itemId === TICKET && r.granted > 0) { tickets.push({ itemId: r.itemId, qty: r.granted, name: ticketsName(r.granted) }); return; }
      (r.rescuedFrogs || []).forEach(function (id) {
        var f = frogById(id);
        if (f) frogs.push({ id: id, name: nameOf(f), family: r.familyId, familyName: familyName(r.familyId) });
      });
      if (r.gearPiece && r.granted > 0) {
        var R = g.Rewards;
        gear.push({ itemId: r.gearPiece.itemId, slot: r.gearPiece.slot, name: R ? R.rewardLabel(r.itemId) : 'Gear', img: R ? R.rewardImage(r.itemId) : null });
      }
    });
    if (!frogs.length && !gear.length && !waiting.length && !tickets.length) return;
    claim.rescue = { frogs: frogs, gear: gear, waiting: waiting, tickets: tickets };
    if (!frogs.length) return;
    var Rr = { rescue: true, skin: 'rescue', phase: 'done', result: { key: null, name: frogs[0].name } };
    if (claim.roll) (claim.remainingRolls || (claim.remainingRolls = [])).push(Rr);
    else claim.roll = Rr;
  }

  var SLOT_WORD = { weapon: 'weapon', shield: 'shield' };
  function gearLine(gear) {
    return gear.map(function (it) { return it.name; }).join(' and ');
  }
                                                                                             
  function revealHTML(claim) {
    var Rs = claim.rescue, fr = Rs && Rs.frogs[0];
    if (!fr) return '';
    var f = frogById(fr.id), art = '';
    try { art = f ? frogArtHTML(f, 140) : ''; } catch (e) { art = ''; }                                  
    var worn = [];
    try {
      ['weapon', 'shield'].forEach(function (slot) {
        var inst = g.Equipment.equippedOn(S(), fr.id, slot);
        if (inst) worn.push(g.Equipment.UI.displayName(g.Equipment.itemRow(inst.item_id)));
      });
    } catch (e) { worn = []; }
    return '<div id="claim-rollpanel" class="xr-reveal xr-rescue">'
      + '<p class="xr-rescue__eyebrow"><span class="xr-rescue__web" aria-hidden="true"></span><span>FREED FROM THE WEB</span></p>'
      + '<p class="xr-title-text">Rescued!</p>'
      + '<div class="xr-rescue__stage"><span class="xr-rescue__rays" aria-hidden="true"></span>'
        + '<span class="xr-rescue__strands" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></span>'
        + '<div class="xr-rescue__frog">' + art + '</div>'
        + '<span class="xr-rescue__bubble">Thank you!</span></div>'
      + '<p class="xr-piece__name">' + esc(fr.name) + '</p>'
      + '<p class="xr-rescue__joined">Joined your pod!</p>'
      + '<p class="xr-piece__line">' + esc('All four ' + fr.familyName + ' traits' + (worn.length ? ' · wearing its ' + worn.join(' and ') : '')) + '</p>'
      + '<p class="xr-rescue__claim">Evolve it into a ' + esc(fr.familyName) + ' frog in the Grimoire</p>'
      + '</div>';
  }
                                                                              
                                                                    
  function receiptHTML(claim) {
    var Rs = claim && claim.rescue;
    if (!Rs) return '';
    var K = kit(), out = '';
    Rs.frogs.forEach(function (fr) {
      var f = frogById(fr.id), art = '';
      try { art = f ? frogArtHTML(f, 76) : ''; } catch (e) { art = ''; }                                  
      out += '<div class="xr-newtrait xr-newtrait--rescue">'
        + '<div class="xr-newtrait__top"><span class="xr-newtrait__art xr-rescue__chipart">' + art + '</span>'
          + '<span class="xr-newtrait__info"><span class="xr-newtrait__chip">RESCUED</span>'
            + '<span class="xr-newtrait__name">' + esc(fr.name) + '</span>'
            + '<span class="xr-newtrait__line">Joined your pod · evolve it in the Grimoire</span></span></div></div>';
    });
    Rs.gear.forEach(function (it) {
      var art = it.img ? (K.art ? K.art(it.img, { size: 70, fill: 0.92 }) : '<img src="' + esc(it.img) + '" alt="" draggable="false">') : '';
      out += '<div class="xr-newtrait xr-newtrait--rescue" data-reward="' + esc(it.itemId) + '">'
        + '<div class="xr-newtrait__top"><span class="xr-newtrait__art">' + art + '</span>'
          + '<span class="xr-newtrait__info"><span class="xr-newtrait__chip">FREED FROM THE WEB</span>'
            + '<span class="xr-newtrait__name">' + esc(it.name) + '</span>'
            + '<span class="xr-newtrait__line">Crafted and ready to wear · tap a frog, then its ' + esc(SLOT_WORD[it.slot] || 'gear') + ' slot</span></span></div></div>';
    });
    (Rs.tickets || []).forEach(function (it) {
      out += '<div class="xr-newtrait xr-newtrait--rescue xr-newtrait--tickets" data-reward="' + esc(it.itemId) + '">'
        + '<div class="xr-newtrait__top"><span class="xr-newtrait__art">' + ticketsArtHTML(Math.min(it.qty, 3), 76) + '</span>'
          + '<span class="xr-newtrait__info"><span class="xr-newtrait__chip">FREED FROM THE WEB</span>'
            + '<span class="xr-newtrait__name">' + esc(it.name) + '</span>'
            + '<span class="xr-newtrait__line">Use one on a sealed trait drop to win the whole family at once</span></span></div></div>';
    });
    Rs.waiting.forEach(function (v) {
      var art = prizeArtHTML(v, 70);
      out += '<div class="xr-newtrait xr-newtrait--rescue xr-newtrait--waiting">'
        + '<div class="xr-newtrait__top"><span class="xr-newtrait__art xr-rescue__chipart">' + art + '</span>'
          + '<span class="xr-newtrait__info"><span class="xr-newtrait__chip">STILL IN THE WEB</span>'
            + '<span class="xr-newtrait__name">' + esc(v.name) + '</span>'
            + '<span class="xr-newtrait__line">Clear the stage to bring it home to your pod</span></span></div></div>';
    });
    return out;
  }

  var api = { WEB_ART: WEB_ART, TADPOLE_ICON: TADPOLE_ICON, webInfo: webInfo, familyFrog: familyFrog, familyGear: familyGear,
    rescueFrog: rescueFrog, prizeView: prizeView, prizeArtHTML: prizeArtHTML, ticketsArtHTML: ticketsArtHTML, prizeOpen: prizeOpen,
    prizeWaiting: prizeWaiting, rollCatch: rollCatch, chancePrizes: chancePrizes, briefHTML: briefHTML, stageNote: stageNote,
    attach: attach, revealHTML: revealHTML, receiptHTML: receiptHTML, gearLine: gearLine };
  g.RescueWeb = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
