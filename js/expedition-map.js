                                                                             
                                                                      
                                                                         
                                                              

                                                                           
                                                                        
                                                                       
                                                                       
                                                                   
                                                                          

                                                                           
                                                                                       
                                      
                                                                        
                    

                                                                           
                                                            
                                                                            
                                                                  
                                                                            
                                                                          
                                                                             
                                                                          
                                                                      
                      

                                                                        
                                                                         
                                                       
                                                                             
                                                                     
                                                                 
                                                                         
                                                                          
                                                                       
                                                    
                                                                                
(function (g) {
  'use strict';

                                                                                
                                                                      
                                                                                

                                                                               
                                                                             
                                                                           
                                                                        
  function groupZones(rows) {
    var byNo = {}, order = [];
    (rows || []).forEach(function (r) {
      var no = Number(r.expedition_no);
      if (!no) return;
      if (!byNo[no]) { byNo[no] = { no: no, zoneName: r.zone_name, waveCount: 0, bossId: null, bossId2: null }; order.push(no); }
      var node = byNo[no];
      node.waveCount++;
      if (r['Boss Type 1 ID']) node.bossId = r['Boss Type 1 ID'];
      if (r['Boss Type 2 ID']) node.bossId2 = r['Boss Type 2 ID'];
    });
    order.sort(function (a, b) { return a - b; });
    var zones = [], byZone = {};
    order.forEach(function (no) {
      var node = byNo[no], zn = node.zoneName;
      if (!byZone[zn]) { byZone[zn] = { name: zn, nodes: [] }; zones.push(byZone[zn]); }
      byZone[zn].nodes.push(node);
    });
    return zones;
  }

                                                                          
                                                                             
  function clearedNodeSet(expeditionsCleared) {
    var set = {};
    (expeditionsCleared || []).forEach(function (id) {
      var m = /^node-(\d+)$/.exec(String(id || ''));
      if (m) set[Number(m[1])] = true;
    });
    return set;
  }

                                                                             
                                                                           
  function currentNode(clearedSet) {
    var n = 1;
    while (clearedSet[n]) n++;
    return n;
  }

  function nodeState(no, clearedSet) {
    if (clearedSet[no]) return 'cleared';
    return (no === currentNode(clearedSet)) ? 'current' : 'locked';
  }

  function zoneState(zone, clearedSet) {
    var cur = currentNode(clearedSet);
    var first = zone.nodes[0].no, last = zone.nodes[zone.nodes.length - 1].no;
    if (cur > last) return 'cleared';
    if (cur >= first) return 'current';
    return 'locked';
  }

  function zoneProgress(zone, clearedSet) {
    var have = zone.nodes.filter(function (n) { return !!clearedSet[n.no]; }).length;
    return { have: have, need: zone.nodes.length };
  }

  function findZoneOfNode(zones, no) {
    for (var i = 0; i < zones.length; i++) {
      for (var j = 0; j < zones[i].nodes.length; j++) {
        if (zones[i].nodes[j].no === no) return zones[i].name;
      }
    }
    return null;
  }

                                                                          
                                                               
                                                                             
                                                                          
                                                                            
                                                                         
                                                                             
                                                                          
                                                                   
                                                                      
                                                                          
  var LADDER_AT = [
    [44.32, 84.42], [50.45, 76.13], [48.18, 67.94], [62.05, 61.65], [51.36, 55.04],
    [62.50, 48.74], [47.05, 41.40], [62.50, 35.10], [55.00, 28.91], [70.45, 22.61]
  ];
  var LADDER_W = 440, LADDER_H = 953;                                                    
  function levelPoint(i) {
    var p = LADDER_AT[Math.max(0, Math.min(i, LADDER_AT.length - 1))];
    return { x: p[0], y: p[1] };
  }
                                                                           
                                                                             
                                                                          
                                  
  function ladderSlot(i, count) {
    var last = LADDER_AT.length - 1;
    if (!(count > 1) || count >= LADDER_AT.length) return i;
    return Math.round(i * last / (count - 1));
  }
                                                                          
  function ladderAspect() { return LADDER_H / LADDER_W; }

                                                                             
                                                                          
                                                        
                                                                       
                                                                              
                                                                       
                                                                            
                                                                         
                                                
  var ZONE_LADDERS = {
    'Reed Marsh': { art: 'reedmarsh', coin: 1.154,
      at: [[41.84, 73.65], [59.26, 59.42], [50.13, 45.84], [59.91, 33.13], [67.29, 21.02]] }
  };
  function zoneLadder(zoneName, count) {
    var zl = Object.prototype.hasOwnProperty.call(ZONE_LADDERS, zoneName) ? ZONE_LADDERS[zoneName] : null;
    return zl && zl.at.length === count ? zl : null;
  }
                                                                        
                                                                            
  function ladderPoint(zoneName, i, count) {
    var zl = zoneLadder(zoneName, count);
    if (zl) {
      var p = zl.at[Math.max(0, Math.min(i, zl.at.length - 1))];
      return { x: p[0], y: p[1], coin: zl.coin };
    }
    var q = levelPoint(ladderSlot(i, count));
    return { x: q.x, y: q.y, coin: 1 };
  }
                                                                           
                                                                            
                                                                           
                                                       
                                              
  var COIN_STARS_BELOW = 10;                                                              
  function ladderBand(zl) {
    var ys = zl.at.map(function (p) { return p[1]; });
    var half = 34.5 * zl.coin / LADDER_H * 100, below = COIN_STARS_BELOW * zl.coin / LADDER_H * 100;
    var r = function (v) { return Math.round(v * 100) / 100; };
    return { top: r(Math.min.apply(null, ys) - half), bottom: r(Math.max.apply(null, ys) + half + below) };
  }

                                                                          
                                                                             
                                                                             
                                                                          
                                                                          
                                                                                 
                                                                       
                                                                             
                                                         
                                                                               
                                                      
                                                
                                                                          
  var ZONE_PIN_AT = [
    [45.6, 85], [30.5, 68.6], [73, 63.2], [36.8, 51.7], [71.8, 44.1],
    [33.6, 23], [71.8, 16.5]
  ];
  function zonePinAt(i) { return ZONE_PIN_AT[Math.min(i, ZONE_PIN_AT.length - 1)]; }

                                                                                
                                                                           
                                                                           
              
                                                                                

  var FTUE_L4_GATE_NODE = 3;                                                                                   
                                                                          
                                                                     
                                                                           
                                                                          
                                                           
  var FTUE_L4_GATE_REQ = { atk: 172, def: 94, hp: 330 };

  var _zonesCache = null;
  function zones() {
    if (_zonesCache) return _zonesCache;
    return (_zonesCache = groupZones(FPConfig.rows('Expeditions')));
  }
  function nodeByNo(no) {
    var zs = zones();
    for (var i = 0; i < zs.length; i++) {
      for (var j = 0; j < zs[i].nodes.length; j++) if (zs[i].nodes[j].no === no) return zs[i].nodes[j];
    }
    return null;
  }
  function bossDisplayName(node) {
    if (!node || !node.bossId) return null;
    try { var db = CombatLive.getBossDb(); return (db[node.bossId] || {}).name || node.bossId; }
    catch (e) { return node.bossId; }
  }
  function clearedSetFromState(state) { return clearedNodeSet(state && state.expeditionsCleared); }
  function nextCurrentNode(state) { return currentNode(clearedSetFromState(state)); }
  function zoneOfNode(no) { return findZoneOfNode(zones(), no); }
  function zoneProgressLabel(state, zoneName) {
    var z = zones().filter(function (x) { return x.name === zoneName; })[0];
    if (!z) return '';
    var p = zoneProgress(z, clearedSetFromState(state));
    return p.have + '/' + p.need;
  }

                                                                      
                                                                      
                                                                             
                                                                       
                                                                    
                                                                           
                                  
  function sel(no) {
    var node = nodeByNo(no) || { no: no, zoneName: '', waveCount: null, bossId: null };
    var boss = bossDisplayName(node);
    return {
      id: 'node-' + no, isNode: true, no: no, zone: node.zoneName,
      name: boss || ('Expedition ' + no),
      req: (no === FTUE_L4_GATE_NODE) ? FTUE_L4_GATE_REQ : null,
      tier: tierOf(no)
    };
  }
                                                                          
                                                                                 
  function tierOf(no) {
    try { return (g.ExpeditionDifficulty && typeof state !== 'undefined' && state) ? ExpeditionDifficulty.pickOf(state, no) : 'normal'; }
    catch (e) { return 'normal'; }
  }

  function num(v) { var n = Number(v); return isFinite(n) ? n : null; }

                                                                              
                                                                           
                                                                           
                                                                     
                                                                              
                                                                          
                                                                     
  function expeditionSummary(no) {
    var waves = [], tier = tierOf(no);
    try { waves = CombatLive.getFtueWaves(no, tier) || []; } catch (e) { waves = []; }
    var edb = {}, bdb = {};
    try { edb = CombatLive.getEnemyDb(no, tier) || {}; } catch (e) { edb = {}; }
    try { bdb = CombatLive.getBossDb(no, tier) || {}; } catch (e) { bdb = {}; }
    var art = (typeof CreatureArt !== 'undefined' && CreatureArt) ? CreatureArt : {};
    function info(id, boss) {
      var d = (boss ? bdb : edb)[id] || {}, a = art[id];
      return {
        id: id, boss: boss, name: d.name || prettyItemName(id), art: (a && a.idle) || null,
        hp: num(d.hp), attack: num(d.attack), defense: num(d.defense),
        cadence: num(d.cadence), hits: num(d.hitsPerAttack), count: 0
      };
    }
    var stages = waves.map(function (w, i) {
      var foes = [];
      function add(id, count, boss) {
        var ex = foes.filter(function (x) { return x.id === id && x.boss === boss; })[0];
        if (!ex) { ex = info(id, boss); foes.push(ex); }
        ex.count += Number(count) || 0;
      }
      (w.enemies || []).forEach(function (e) { add(e.id, e.count, false); });
      (w.bosses || []).forEach(function (b) { add(b.id, b.count, true); });
                                                                          
      var harvest = w.harvest && CombatLive.harvestInfo ? CombatLive.harvestInfo(w.harvest.flower) : null;
                                                                                                     
      if (w.harvest && w.harvest.web && CombatLive.webInfo) {
        harvest = CombatLive.webInfo(w.harvest.web);
        harvest.rescue = true;
        try { harvest.prize = !!(g.RescueWeb && (w.harvest.prizes || []).some(function (p) { return RescueWeb.prizeOpen(p.table); })); } catch (e) { harvest.prize = false; }
        try { harvest.prizeNote = g.RescueWeb && RescueWeb.stageNote ? RescueWeb.stageNote(w) : ''; } catch (e) { harvest.prizeNote = ''; }
      }
      return { no: i + 1, foes: foes, boss: foes.filter(function (f) { return f.boss; })[0] || null, harvest: harvest };
    });
    var roster = [], seen = {};
    stages.forEach(function (s) {
      s.foes.forEach(function (f) {
        var k = (f.boss ? 'b:' : 'e:') + f.id;
        if (seen[k]) return;
        seen[k] = 1;
        var copy = {}; for (var p in f) copy[p] = f[p];
        copy.stage = s.no;
        roster.push(copy);
      });
    });
    roster.sort(function (a, b) { return (a.boss ? 1 : 0) - (b.boss ? 1 : 0); });
    return { stages: stages, roster: roster, boss: roster.filter(function (r) { return r.boss; })[0] || null };
  }

                                                                            
                                                                        
                                                                             
                                                                              
                                                                              
                                                                            
                                                                              
                                                                            
                                                           
                                                                            
  function previewRows(no) {
    try { return Rewards.previewExpedition(no, 'win', { tier: tierOf(no) }).filter(function (r) { return r.itemId !== 'none' && r.itemId !== 'nothing' && !r.tierBonus; }); }
    catch (e) { if (/trait_id/.test(e.message)) throw e; return null; }
  }

                                                                           
                                                                              
                                                                          
                                                                             
                                                                            
                                                  
  function familyReward(no) {
    var rows = previewRows(no) || [];
                                                                            
                                                  
    var traitRows = rows.filter(function (r) { return /^trait_/.test(r.itemId); });
    var row = traitRows.filter(function (r) { return r.guaranteed; })[0] || traitRows[0];
    var m = row && /^trait_(.+?)(_guaranteed)?$/.exec(row.itemId);
    var target = row && /^trait_piece_/.test(row.itemId) ? FT.traitForSheetId(row.itemId.slice(12)) : null;
    var fam = null;
    try { fam = target ? FT.families().filter(function (f) { return FT.familyTraitPool(f.id).some(function (t) { return t.k === target.k; }); })[0] : m && FT.familyDefOf(m[1]); } catch (e) { fam = null; }
    if (!fam) return null;
    var pieces = [];
    try {
      pieces = familyPieces(fam.id).map(function (p) {
        return { key: p.key, name: p.name, slot: p.slot, img: p.img, owned: !!familyHasPiece(p.key) };
      });
    } catch (e) { pieces = []; }
    var have = pieces.filter(function (p) { return p.owned; }).length;
    var tier = 'rare';
    try { tier = (g.FrogStats && FrogStats.CODE_TO_SHEET_RARITY && FrogStats.CODE_TO_SHEET_RARITY[fam.r]) || tier; } catch (e) {                 }
    return {
      id: fam.id, no: no, name: fam.n, target: target, tier: tier, row: row, pieces: pieces, have: have, need: pieces.length,
      guaranteed: !!(row.guaranteed || (!target && m[2])), chance: row.chance, complete: pieces.length > 0 && have >= pieces.length,
      rolls: row.count || 1                                                                      
    };
  }
  function piecesWord(n) { return n === 1 ? 'piece' : 'pieces'; }
                                                                       
                                                                         
  function familyRewardEyebrow(fr) {
    if (fr.complete) return 'SET COMPLETE';
    if (fr.guaranteed) return fr.rolls > 1 ? fr.rolls + ' NEW TRAITS GUARANTEED' : 'NEW TRAIT GUARANTEED';
    if (fr.need - fr.have === 1) return 'LAST PIECE!';
    return 'TRAIT DROP · ' + pctLabel(fr.chance) + (fr.rolls > 1 ? ' ×' + fr.rolls : '') + ' A WIN';
  }
                                                                        
                                                                  
                                                                                 
                                                                                
                                                                                
                                                                               
                                                                   
  var DOLL = { scale: 0.935, feet: 0.755, standX: 354, standY: 488 };                                                                                             
  function paperDollHTML(fr, size) {
    var owned = {}, art = {}, traits = { head: null, mouth: null, back: null, aura: null }, seat = {}, bodySrc = null, frame = null;
    fr.pieces.forEach(function (p) { art[p.slot] = p.img; owned[p.slot] = true; traits[p.slot] = p.key; });
    try {
      var frog = { id: 'paper-doll', traits: traits, merges: FT.MAX_MERGES }, body = FT.bodyOf(frog);
      FT.layersOf(frog).forEach(function (l) { if (l.layer !== 'body' && l.anchor && !seat[l.layer]) seat[l.layer] = FT.anchorCSS(l.anchor); });
      bodySrc = FT.bodyPath(body.key);
      var s = DOLL.scale, cx = DOLL.standX + (body.ox || 0) * 640, feet = DOLL.standY + (body.oy || 0) * 640;
      frame = 'translate(' + ((320 - s * cx) / 6.4).toFixed(2) + '%,' + ((DOLL.feet * 640 - s * feet) / 6.4).toFixed(2) + '%) scale(' + s + ')';
    } catch (e) { seat = {}; bodySrc = null; frame = null; }
    return KitUI.setPaperDoll({ owned: owned, art: art, size: size, seat: seat, bodySrc: bodySrc, frame: frame });
  }

                                                                            
                                                                                
  function onWinPayout(no) {
    var fr = familyReward(no), rows = previewRows(no) || [], parts = [];
    if (fr) parts.push((fr.rolls > 1 ? fr.rolls + ' ' : '') + (fr.target ? fr.target.n : fr.name + ' ' + piecesWord(fr.rolls)) + (fr.guaranteed ? '' : ' (' + pctLabel(fr.chance) + (fr.rolls > 1 ? ' each' : '') + ')'));
    rows.filter(function (r) { return r.guaranteed && (!fr || r.itemId !== fr.row.itemId); }).slice(0, 2).forEach(function (r) {
      parts.push('+' + qtyLabel(r.minQty * r.count, r.maxQty * r.count) + ' ' + rewardName(r).toLowerCase());
    });
    if (!parts.length) return null;
    var aura = fr && (fr.target ? { img: fr.target.path } : (fr.pieces.filter(function (p) { return p.slot === 'aura'; })[0] || fr.pieces[0]));
    return { text: 'ON WIN: ' + parts.join(' · '), artSrc: aura ? aura.img : null };
  }

                                                                           
                                                                           
                                                         
  function bestParty(no) {
    var cap = 10;
    try { cap = ExpeditionMinParty.maxPartySize(no, g.FPConfig); } catch (e) {                   }
    var list = [];
    try {
      list = (state.frogs || []).filter(function (f) { return expPartyCanPick(f); })
        .map(function (f) { return { id: f.id, p: expPartyPowerOf(f) }; });
    } catch (e) { list = []; }
    list.sort(function (a, b) { return b.p - a.p; });
    return list.slice(0, cap).map(function (x) { return x.id; });
  }
                                                                         
                                                                           
                                                                             
                                                                 
  var _readyMemo = { key: null, value: null };
  function readiness(no, ids) {
    if (!ids.length || !g.PredictionBar) return null;
    var stats, tier = tierOf(no);
    try { stats = liveExpeditionPartyStats(ids); } catch (e) { return null; }
    var key = no + ':' + tier + ':' + JSON.stringify(stats);
    if (_readyMemo.key === key) return _readyMemo.value;
    var r = null;
    try { r = PredictionBar.compute(stats, tier === 'normal' ? no : CombatLive.fightFor(no, tier)); } catch (e) { r = null; }
    _readyMemo = { key: key, value: r };
    return r;
  }

                                                                          
                                                                          
                                                                         
                                               
  function guidedNow() {
    try { return !!(g.FtueSteps && FtueSteps.guidedExpeditionNo && FtueSteps.guidedExpeditionNo() != null); }
    catch (e) { return false; }
  }

                                                                                
                                                                              
                                                                             
                                                                     
                                                                                

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
                                                                      
  function jsStr(s) { return String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'"); }
                                                                      
  function attr(s) { return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;'); }
  var LOCKED_TOAST = "showToast('\\u{1F512} clear the previous expedition first')";
  var ART_BASE = 'assets/ui2/expedition-map/';
  var SCREEN_ART = 'assets/ui2/screens/expedition/';

  function rangeLabel(z) { return z.nodes[0].no + ' – ' + z.nodes[z.nodes.length - 1].no; }
  function pctLabel(chance) {
    var p = Math.round(chance * 100);
    return (p < 1 && chance > 0) ? '<1%' : p + '%';
  }
  function qtyLabel(min, max) { return min === max ? String(min) : min + '–' + max; }
  function stageWord(n) { return n === 1 ? 'stage' : 'stages'; }

                                                                         
                                                                            
                                                                    
                                                                            
                                                                     
                                                                       
                                                                                                  
  function plateHTML(z, st, at, ride) {
    var locked = st === 'locked', range = rangeLabel(z);
    return '<div class="xm-pill-wrap xm-pill-wrap--' + st + (ride ? ' ma-ride' : '') + '" data-zone="' + esc(z.name) + '" style="left:' + at[0] + '%;top:' + at[1] + '%;' + (ride || '') + '">'
      + KitUI.mapPlate({
        state: locked ? 'locked' : 'playable', zone: z.name, detail: range, showZone: !locked,
        onclick: attr(locked ? LOCKED_TOAST : "expeditionOpenZone('" + jsStr(z.name) + "')"),
        ariaLabel: z.name + (locked ? ', locked' : ', expeditions ' + range),
        className: 'xm-pill xm-pill--' + st
      })
      + '</div>';
  }

                                                                            
                                                       
                                                                               
                                                                           
                                                                             
                                                                             
                                                                  
  var _zonesSheet = { open: false, by: 'set' };
  function zoneRowHTML(z, st) {
    var fr = familyReward(z.nodes[0].no), locked = st === 'locked';
    var aura = fr && (fr.target ? { img: fr.target.path } : (fr.pieces.filter(function (p) { return p.slot === 'aura'; })[0] || fr.pieces[0]));
    var bySet = _zonesSheet.by === 'set' && fr;
    var title = bySet ? fr.name : z.name;
    var where = bySet ? z.name : (fr ? fr.name : '');
    var status = locked ? '🔒 clear the previous zone' : (st === 'cleared' ? 'Cleared' : 'Open');
    var bar = (!locked && fr && fr.need)
      ? '<span class="xm-zrow__prog"><span class="xm-zrow__bar"><i style="width:' + Math.round(fr.have / fr.need * 100) + '%"></i></span>'
        + '<span class="xm-zrow__count">' + fr.have + '/' + fr.need + '</span></span>'
      : '';
    var tag = locked ? 'div' : 'button';
    return '<' + tag + (locked ? '' : ' type="button" onclick="' + attr("expeditionZonesSheet(false);expeditionOpenZone('" + jsStr(z.name) + "')") + '"')
      + ' class="xm-zrow' + (locked ? ' is-locked' : '') + '" data-zone-row="' + esc(z.name) + '">'
      + '<span class="xm-zrow__icon" style="--xm-tier:var(--rarity-' + (fr ? fr.tier : 'rare') + ',#72c7ff)">' + (aura ? KitUI.art(aura.img, { size: 46, fill: 0.92 }) : '') + '</span>'
      + '<span class="xm-zrow__text"><span class="xm-zrow__title">' + esc(title) + '</span>'
        + '<span class="xm-zrow__sub">' + esc([where, status].filter(Boolean).join(' · ')) + '</span>' + bar + '</span>'
      + '</' + tag + '>';
  }
  function zonesSheetHTML(zs, clearedSet) {
    var list = zs.map(function (z, i) { return { z: z, i: i, fr: familyReward(z.nodes[0].no) }; });
    if (_zonesSheet.by === 'set') {
      var firstOf = {};
      list.forEach(function (x) { var k = x.fr ? x.fr.id : '~' + x.i; if (firstOf[k] == null) firstOf[k] = x.i; });
      list.sort(function (a, b) {
        return firstOf[a.fr ? a.fr.id : '~' + a.i] - firstOf[b.fr ? b.fr.id : '~' + b.i] || a.i - b.i;
      });
    }
    function tab(key, label) {
      var on = _zonesSheet.by === key;
      return KitUI.button({ tone: on ? 'gold' : 'violet', shape: 'pill', size: 'tag', label: label, onclick: "expeditionZonesBy('" + key + "')", className: 'xm-zones-tab' });
    }
    if (!_zonesSheet.open) {
      return '<button type="button" class="xm-zones-handle" onclick="expeditionZonesSheet(true)" aria-label="Show all zones"><i></i>ZONES</button>';
    }
    return '<div class="xm-zones-scrim" onclick="if(event.target===this)expeditionZonesSheet(false)">'
      + '<div class="xm-zones-sheet" role="dialog" aria-label="Zones">'
        + '<button type="button" class="xm-zones-grab" onclick="expeditionZonesSheet(false)" aria-label="Hide zones"></button>'
        + '<div class="xm-zones-head"><span class="xm-zones-title">ZONES</span>' + tab('set', 'BY TRAIT SET') + tab('order', 'BY ORDER') + '</div>'
        + '<div class="xm-zones-list">' + list.map(function (x) { return zoneRowHTML(x.z, zoneState(x.z, clearedSet)); }).join('') + '</div>'
      + '</div></div>';
  }

                                                                           
                                                                         
                                                                           
                                                                            
                                             
  function renderMapHTML(state) {
    var zs = zones(), clearedSet = clearedSetFromState(state);
    if (!zs.length) return '<p class="xd-empty">No expeditions configured yet.</p>';
    var now = Date.now(), alive = g.MapAmbient;
    var pins = zs.map(function (z, i) { return plateHTML(z, zoneState(z, clearedSet), zonePinAt(i), alive ? MapAmbient.plateRide(i, now) : ''); }).join('');
    return '<div class="xm-map">'
      + (alive ? MapAmbient.stageHTML(now) : '<img class="xm-map-art" src="' + ART_BASE + 'worldmap.webp" alt="" draggable="false">')
      + '<div class="xm-zones"' + (alive ? ' style="--ma-plate-at:' + MapAmbient.plateDelay(now) + '"' : '') + '>' + pins + '</div>'
      + '</div>';
  }

                                                                         
                                                                        
                                                                      
                                                            
                                                             
  function nodeCoinHTML(node, st, pt) {
    return '<div class="xm-coin xm-coin--' + st + '" data-expedition-no="' + node.no + '" style="left:' + pt.x + '%;top:' + pt.y + '%;">'
      + KitUI.ladderNode({
        level: node.no, state: st, ariaLabel: 'Expedition ' + node.no + ', ' + st,
        onclick: attr(st === 'locked' ? LOCKED_TOAST : 'expeditionOpenCard(' + node.no + ')')
      })
      + (g.FlagBearer ? FlagBearer.coinStampHTML(node.no, st) : '')                                                 
      + (g.AutoExpeditions ? AutoExpeditions.coinBadgeHTML(node.no) : '')
      + (g.ExpeditionDifficulty && ExpeditionDifficulty.coinPipsHTML ? ExpeditionDifficulty.coinPipsHTML(node.no) : '')                        
      + '</div>';
  }

  function renderLadderHTML(state, zoneName, cardNo) {
    var zs = zones();
    var z = zs.filter(function (x) { return x.name === zoneName; })[0] || zs[0];
    if (!z) return '<p class="xd-empty">No expeditions configured yet.</p>';
    var clearedSet = clearedSetFromState(state), count = z.nodes.length;
    var coins = z.nodes.map(function (n, i) { return nodeCoinHTML(n, nodeState(n.no, clearedSet), ladderPoint(z.name, i, count)); }).join('');
    var card = '';
    if (cardNo != null) {
      var idx = -1;
      for (var k = 0; k < count; k++) if (z.nodes[k].no === cardNo) { idx = k; break; }
      var zl0 = zoneLadder(z.name, count);
      card = renderCardHTML(state, cardNo, idx < 0 ? null : Object.assign(ladderPoint(z.name, idx, count), { fit: !!zl0 }));
    }
                                                                               
                                                           
    var zl = zoneLadder(z.name, count), band = zl && ladderBand(zl);
    var art = zl ? ' data-ladder-art="' + attr(zl.art) + '"' : '';
    var fit = zl ? ' xm-ladder--fit" style="--xm-coin:' + zl.coin + ';--xm-band-top:' + band.top + ';--xm-band-bot:' + band.bottom : '';
                                                                          
                                                                           
    var pad = card && _cardPad && !zl ? ' style="padding-bottom:calc(' + _cardPad + 'px + var(--dock-clear,96px))"' : '';
                                                                                 
    var close = card ? ' onclick="if(event.target===this)expeditionCloseCard()"' : '';
    return '<div class="xm-ladder' + fit + '"' + pad + '><div class="xm-ladder-path"' + art + close + '>' + coins + card + '</div></div>';
  }

                                                                           
                                                                           
                                                                         
                                                                             
                                                                            
                                                                           
                                                    
                                                                          
                                                                             
                                                                                          
                                                                          
                                                                          
                                                                        
                                         
                                                                           
                                                                            
  function nodeHalf(coin) { return 'calc(' + Math.round(34.5 * (coin || 1) * 1000) / 1000 + ' * var(--xu))'; }
  var GAP = 'calc(10 * var(--xu))';                                                

  function rewardIconSrc(itemId, img) {
    var CUR = { wood: 'currency/wood', stone: 'currency/stone', seeds: 'currency/seeds', flower_seed: 'currency/seeds',
      bones: 'currency/bones', flies: 'currency/flies', tadpoles: 'currency/tadpoles', gems: 'currency/gems' };
    if (CUR[itemId] && KitUI.ICONS && KitUI.ICONS[CUR[itemId]]) return { src: KitUI.ICONS[CUR[itemId]], trait: false };
    if (img) return { src: img, trait: false };
    var m = /^trait_(.+?)(_guaranteed)?$/.exec(itemId);
    if (m && typeof FT !== 'undefined' && FT.familyTraitPool) {
      try {
        var pool = FT.familyTraitPool(m[1]) || [];
        var t = pool.filter(function (p) { return p.slot === 'aura'; })[0] || pool[0];
        if (t && t.path) return { src: t.path, trait: true };
      } catch (e) {                               }
    }
    return null;
  }
                                                                             
                                                                            
  function rewardIconHTML(row, size) {
    var ic = rewardIconSrc(row.itemId, row.img);
    if (!ic) return (typeof rewardTileIcon === 'function') ? rewardTileIcon(row.itemId) : '';
    if (ic.trait && KitUI.art) return KitUI.art(ic.src, { size: size, fill: 0.92, ring: false });
    return '<img src="' + esc(ic.src) + '" alt="" draggable="false">';
  }
  function rewardName(row) {
    return shortRewardName(String(row.displayName || prettyItemName(row.itemId)).replace(/([a-z])([A-Z])/g, '$1 $2'));
  }
                                                                  
                                                                          
                                   
  function rewardPillHTML(row, withName) {
    var name = withName ? ' ' + rewardName(row) : '';
    if (row.guaranteed) {
      return KitUI.rewardPill({ type: 'currency', iconHTML: rewardIconHTML(row, 24),
        amount: '×' + qtyLabel(row.minQty * row.count, row.maxQty * row.count) + name });
    }
    return KitUI.rewardPill({ type: 'rare', iconHTML: rewardIconHTML(row, 24),
      amount: (row.count > 1 ? row.count + '× ' : '') + '+' + qtyLabel(row.minQty, row.maxQty) + name, chance: pctLabel(row.chance) });
  }

  function enemyChipHTML(f) {
                                                                         
                                                                      
    return KitUI.enemyChip({ kind: f.boss ? 'boss' : 'normal', name: f.name, weak: 'unknown',
      artHTML: f.art ? '<img src="' + esc(f.art) + '" alt="" draggable="false">' : '' });
  }

                                                                             
                                                                            
                                                                             
                                                                 
  function renderFaceHTML(no) {
    var sum = expeditionSummary(no);
    if (!sum.roster.length) return '';
    return '<section class="xp-face" aria-label="Enemies you will face">'
      + '<div class="xp-face__head"><span class="xm-card-eyebrow">YOU’LL FACE</span><span class="xm-card-meta">' + esc(faceLine(sum)) + '</span></div>'
      + '<div class="xm-card-chips xp-face__chips">' + sum.roster.map(enemyChipHTML).join('') + '</div>'
      + '</section>';
  }

  function faceLine(sum) {
    var n = sum.stages.length;
    return n ? n + ' ' + stageWord(n) + (sum.boss ? ' · boss' : '') : '';
  }

                                                                    
                                                                        
                          
                                                                          
  function cardHeightGuess(W, chips, pills, trait) {
    var inner = W * 0.909 - 10 - 20 - 28;
    var pillRows = Math.max(1, Math.ceil((pills * 80 + 50) / Math.max(80, inner)));
    return 74 + 28 + (trait ? 236 : 0) + (chips ? 19 + 58 : 0) + 10 + pillRows * 28 + 20 + 22 + 52 + 12;
  }
  var _cardPad = 0;                                                                  
  var _flipBelow = null;                                                                        
  var _fitPlace = {};                                                                                             
  var _placedCard = null;                                                                               
                                                                             
                                                                               
                                                                             
                                                                     
  function frameWidth() {
    var d = typeof document !== 'undefined' ? document : null;
    var el = d && (d.querySelector('.xm-ladder-path') || d.body);
    var w = el ? el.getBoundingClientRect().width : 0;
    if (!(w > 0)) w = (typeof innerWidth === 'number' && innerWidth > 0) ? innerWidth : 390;
    return w;
  }
  var AUTO_ROW_H = 58;                                                              
  var TIER_ROW_H = 66;                                                                                        

                                                                          
                                                                            
                                                                            
                                                                         
                                                                          
                                                                          
                                                               
  var CHECK_SRC = 'assets/ui2/kit/traits-gear/family-check.svg';
  var SPARK_SRC = 'assets/ui2/kit/expedition/set-reward-sparkle.svg';
  var RAYS_MS = 40000;                                                            
  function traitRewardBoxHTML(fr) {
    var pieces = fr.pieces.map(function (p) {
      return '<span class="xm-tr__piece ' + (p.owned ? 'is-owned' : 'is-missing') + '" role="img" aria-label="' + esc(p.name + (p.owned ? ', found' : ', still to find')) + '">'
        + KitUI.art(p.img, { fill: 0.94 })
        + (p.owned ? '<img class="xm-tr__check" src="' + CHECK_SRC + '" alt="" draggable="false">' : '')
        + '</span>';
    }).join('');
    var spark = '<img class="xm-tr__spark" src="' + SPARK_SRC + '" alt="" draggable="false">';
                                                                                        
    var turn = ' style="animation-delay:-' + (Date.now() % RAYS_MS) + 'ms"';
    return '<section class="xm-tr' + (fr.complete ? ' xm-tr--complete' : '') + '" aria-label="Trait reward: ' + esc(fr.name) + ', ' + fr.have + ' of ' + fr.need + ' pieces">'
      + '<p class="xm-tr__eyebrow">' + spark + '<span>' + esc(familyRewardEyebrow(fr)) + '</span>' + spark + '</p>'
      + '<div class="xm-tr__stage" aria-hidden="true"><span class="xm-tr__rays"' + turn + '></span>'
        + '<span class="xm-tr__doll">' + (fr.target ? KitUI.art(fr.target.path, { fill: 0.94 }) : paperDollHTML(fr)) + '</span></div>'
      + '<p class="xm-tr__head"><span class="xm-tr__set">' + esc(fr.target ? fr.target.n : fr.name) + '</span><span class="xm-tr__count">' + fr.have + '/' + fr.need + '</span></p>'
      + '<div class="xm-tr__pieces">' + pieces + '</div>'
    + '</section>';
  }

                                                                          
                                                                           
                                                 
  function rewardChipHTML(row) {
    var amount = row.guaranteed ? '×' + qtyLabel(row.minQty * row.count, row.maxQty * row.count)
      : (row.count > 1 ? row.count + '× ' : '') + '+' + qtyLabel(row.minQty, row.maxQty);
    return '<span class="xm-also' + (row.guaranteed ? '' : ' xm-also--chance') + '" title="' + esc(rewardName(row)) + '">'
      + '<span class="xm-also__icon">' + rewardIconHTML(row, 22) + '</span>'
      + '<span class="xm-also__amt">' + esc(amount) + '</span>'
      + (row.guaranteed ? '' : '<span class="xm-also__pct">' + esc(pctLabel(row.chance)) + '</span>')
      + '</span>';
  }

                                                                           
                                                                             
  function readinessRowHTML(no, ids) {
    var r = readiness(no, ids);
    var pct = r ? Math.round(Math.max(0, Math.min(1, r.winRate)) * 100) : 0;
    var band = r ? r.band : 'none';
    var mark = r && r.cutoffs ? Math.round(r.cutoffs.evenStrong * 1000) / 10 : null;
    return '<div class="xm-ready xm-ready--' + band + '">'
      + '<span class="xm-card-eyebrow">YOUR BEST' + (ids.length ? ' ' + ids.length : '') + '</span>'
      + '<span class="xm-ready__bar" role="meter" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + pct + '" aria-label="Win chance with your best frogs">'
        + '<span class="xm-ready__fill" style="width:' + pct + '%"></span>'
        + (mark != null ? '<span class="xm-ready__mark" style="left:' + mark + '%"></span>' : '')
      + '</span>'
      + '<span class="xm-ready__pct">' + (r ? pct + '%' : 'NO FROGS') + '</span>'
    + '</div>';
  }

                                                                       
  function renderCardHTML(state, no, at) {
    _placedCard = null;                                                       
    var node = nodeByNo(no) || { no: no, zoneName: '', waveCount: null };
    var locked = nodeState(no, clearedSetFromState(state)) === 'locked';
    var guided = guidedNow();
    var sum = expeditionSummary(no), rows = previewRows(no);
    var fr = familyReward(no);
    var rest = (rows || []).filter(function (r) { return !fr || r.itemId !== fr.row.itemId; });
    var pills = rest.map(rewardChipHTML).join('');
    var best = locked ? [] : bestParty(no);

    var play;
    if (locked) play = KitUI.button({ tone: 'neutral', shape: 'pill', size: 'md', label: 'LOCKED', disabled: true, className: 'xm-card-play xd-card-play' });
    else if (guided || !best.length) play = KitUI.button({ tone: 'gold', shape: 'pill', size: 'md', label: 'CHOOSE PARTY', onclick: 'expeditionPlayNode(' + no + ')', className: 'xm-card-play xd-card-play' });
    else play = KitUI.button({ tone: 'gold', shape: 'pill', size: 'md', label: 'QUICK SEND', iconSrc: (KitUI.ICONS && KitUI.ICONS['stat/attack']) || 'assets/ui2/icon/atk_icon.png',
      onclick: 'expeditionQuickSend(' + no + ')', ariaLabel: 'Quick send your best ' + best.length, className: 'xm-card-quick' });
    var brief = (locked || guided) ? ''
      : KitUI.button({ tone: 'violet', shape: 'pill', size: 'md', label: 'BRIEF', onclick: 'expeditionOpenBrief(' + no + ')', className: 'xm-card-brief' });
                                                                                              
    var auto = g.AutoExpeditions ? AutoExpeditions.cardRowHTML(no, { locked: locked, guided: guided, best: best }) : '';
                                                                             
                                                              
    var tiers = (!locked && !guided && g.ExpeditionDifficulty && ExpeditionDifficulty.tabsHTML) ? ExpeditionDifficulty.tabsHTML(no) : '';

    var body = '<div class="xm-card-inner">'
      + tiers
      + (fr ? traitRewardBoxHTML(fr) : '')
      + ((pills || !fr) ? '<div class="xm-card-rewards"><span class="xm-card-eyebrow">' + (fr ? 'ALSO' : 'REWARDS') + '</span>'
        + (pills || '<span class="xm-card-norewards">Rewards not revealed yet</span>') + '</div>' : '')
      + (locked ? '' : readinessRowHTML(no, best))
      + auto
      + '<div class="xm-card-actions' + (brief ? '' : ' xm-card-actions--one') + '">' + brief + play + '</div>'
      + '</div>';

                                                                        
                                                                       
                                                                           
                                                                       
                                                                         
                                                                                  
    var side = 'above', pos = '', tail = '', shift = 0, tailed = true;
    _cardPad = 0;
    if (at) {
      var pt = at, coin = pt.coin || 1, half = nodeHalf(coin);
      if (at.fit) {
        var fp = _fitPlace[no];
        side = fp ? fp.side : (pt.y > 50 ? 'above' : 'below');
        shift = fp ? fp.shift : 0;
        tailed = !fp || fp.tail;
      } else {
        var W = frameWidth();
        var s = Math.min(1, W / LADDER_W), nodeTop = pt.y / 100 * W * ladderAspect() - 34.5 * coin * s;
        var est = cardHeightGuess(W, 0, rest.length, !!fr) + (auto ? AUTO_ROW_H : 0) + (tiers ? TIER_ROW_H : 0);
        side = (_flipBelow !== no && nodeTop - 10 * s - est >= 64) ? 'above' : 'below';
        if (side === 'below') {
          var canvasH = W * ladderAspect();
          _cardPad = Math.max(0, Math.round(nodeTop + 69 * coin * s + 10 * s + est * 1.15 - canvasH));
        }
      }
      var nudge = shift ? ' - ' + shift + 'px' : '';                                  
      pos = side === 'above'
        ? 'bottom:calc(100% - ' + pt.y + '% + ' + half + ' + ' + GAP + nudge + ');'
        : 'top:calc(' + pt.y + '% + ' + half + ' + ' + GAP + nudge + ');';
                                                                           
                                                                            
      var tx = 'left:calc(' + pt.x + '% + 19 * var(--xu));';
      var lineTop = side === 'above' ? 'top:calc(' + pt.y + '% - ' + half + ' - 13.5 * var(--xu));'
        : 'top:calc(' + pt.y + '% + ' + half + ' - 17.5 * var(--xu));';
      var fillTop = side === 'above' ? 'top:calc(' + pt.y + '% - ' + half + ' - 13 * var(--xu));'
        : 'top:calc(' + pt.y + '% + ' + half + ' - 12 * var(--xu));';
      tail = !tailed ? '' : '<img class="xm-card-tailline xm-card-tailline--' + side + '" src="' + SCREEN_ART + 'bubble-tail-outline.svg" alt="" draggable="false" style="' + tx + lineTop + '">'
        + '<img class="xm-card-tail xm-card-tail--' + side + '" src="' + SCREEN_ART + 'bubble-tail.svg" alt="" draggable="false" style="' + tx + fillTop + '">';
    }
    return tail + '<div class="xm-card xm-card--' + side + (snugLevel(no) ? ' xm-card--snug' + snugLevel(no) : '') + '"' + (pos ? ' style="' + pos + '"' : '') + ' role="dialog" aria-label="Expedition ' + no + '">'
      + '<p class="xm-card-title">Expedition ' + no + ' – ' + esc(node.zoneName || '') + '</p>'
      + body
      + '</div>';
  }

                                                                         
                                                                              
                                                                              
                                                                            
                                                                             
                                                                          
                                                                             
                                                                           
                                                                  
                                                                     
                                                                                          
  var _brief = { no: null, tab: 'rewards', stage: 0, enemy: null, odds: false };

  function briefTabs(no, sum) {
    var cap = null;
    try { cap = (g.ExpeditionMinParty && g.FPConfig) ? ExpeditionMinParty.maxPartySize(no, g.FPConfig) : null; } catch (e) { cap = null; }
    var picked = (typeof expeditionParty !== 'undefined' && expeditionParty) ? expeditionParty.length : 0;
    var foes = sum.roster.length;
    function tab(key, label, onclick) {
      var on = _brief.tab === key;
      return KitUI.button({ tone: on ? 'gold' : 'violet', shape: 'pill', size: 'sm', label: label,
        onclick: onclick, ariaLabel: label, className: 'xb-tab' + (on ? ' is-on' : '') });
    }
    return '<div class="xb-tabs" role="tablist">'
      + tab('rewards', 'REWARDS', "expeditionBriefTab('rewards')")
      + tab('enemies', 'ENEMIES · ' + foes, "expeditionBriefTab('enemies')")
      + tab('party', 'PARTY ' + picked + (cap ? '/' + cap : ''), 'expeditionPlayNode(' + no + ')')
      + '</div>';
  }

                                                                            
                                                                            
                                                                        
                                                                           
                                     
  function familyDropOdds(fr) {
    if (fr.target) return { pool: [fr.target], each: fr.chance };
    var pool = [];
    try {
      pool = (g.Rewards && Rewards.familyDropPool ? Rewards.familyDropPool(FT, fr.id, fr.no) : (FT.familyRewardPool || FT.familyTraitPool)(fr.id)) || [];
    } catch (e) { pool = []; }
    if (/_guaranteed$/.test(fr.row.itemId)) {
      try {
        var key = FT.familyDefOf(FPConfig.value('FTUE', 'exp1_guaranteed_trait_family')).traits[FPConfig.value('FTUE', 'exp1_guaranteed_trait_slot')];
        var forced = pool.filter(function (t) { return t.k === key; });
        if (forced.length) return { pool: forced, each: 1 };
      } catch (e) {                                   }
    }
    return { pool: pool, each: pool.length ? fr.chance / pool.length : 0 };
  }
  var SLOT_WORD = { head: 'Head', mouth: 'Mouth', back: 'Back', aura: 'Aura', weapon: 'Weapon', shield: 'Shield' };
                                                                       
  function pieceBoost(t) {
    if (t.slot === 'weapon' || t.slot === 'shield') return (g.Equipment && Equipment.UI && Equipment.UI.pieceBoost) ? Equipment.UI.pieceBoost(t.k) : null;
    return (g.GrimoireUI && GrimoireUI.traitBoost) ? GrimoireUI.traitBoost(t) : null;
  }

                                                                             
                                                                        
                                                       
  function briefRewardsHTML(no) {
    var rows = previewRows(no) || [];
    var fr = familyReward(no);
    var rest = rows.filter(function (r) { return !fr || r.itemId !== fr.row.itemId; });
    var out = '';
    if (fr) {
      var left = fr.need - fr.have;
      out += KitUI.setRewardPanel({
        set: fr.name, rarity: fr.tier.toUpperCase(), rarityTone: fr.tier, count: fr.have + '/' + fr.need,
        dollHTML: fr.target ? KitUI.art(fr.target.path, { size: 170, fill: 0.94 }) : paperDollHTML(fr, 170), caption: fr.target ? fr.target.n : '',
        pieces: fr.pieces.map(function (p) { return { imgSrc: p.img, owned: p.owned, name: p.name }; }),
        rule: fr.target ? pctLabel(fr.chance) + ' per win: ' + fr.target.n : fr.guaranteed ? 'Every win drops ' + fr.rolls + ' ' + piecesWord(fr.rolls)
          : (fr.rolls > 1 ? fr.rolls + ' rolls a win, ' + pctLabel(fr.chance) + ' each to drop a piece' : pctLabel(fr.chance) + ' of wins drop 1 piece'),
        className: 'xb-setreward'
      });
      var od = familyDropOdds(fr);
      if (od.pool.length) {
        var each = od.pool.length + (od.pool.length === 1 ? ' piece · ' : ' pieces · ') + pctLabel(od.each) + ' each';
        var owned = fr.pieces.filter(function (p) { return p.owned; }).map(function (p) { return p.name; });
        out += KitUI.dropOdds({
          open: _brief.odds, onclick: 'expeditionBriefToggleOdds()', summary: '1 piece per drop', closedSummary: each,
          rows: od.pool.map(function (t) {
            var b = pieceBoost(t);
            return { imgSrc: t.path, name: t.n, stat: (SLOT_WORD[t.slot] || '') + (b ? ' · ' + b.label : ''), pct: pctLabel(od.each) };
          }),
          owned: owned.length ? 'Owned: ' + owned.join(', ') : '',
          className: 'xb-odds'
        });
      }
      if (!fr.complete && !fr.target) {
        out += '<section class="xb-setgoal"><p class="xb-setgoal__eyebrow">COMPLETE THE SET</p>'
          + '<p class="xb-setgoal__title">Unlock the ' + esc(fr.name) + ' family</p>'
          + '<p class="xb-setgoal__note">' + Math.ceil(left / fr.rolls) + (Math.ceil(left / fr.rolls) === 1 ? ' win' : ' wins') + ' at best — pieces can repeat</p></section>';
      }
    }
                                                                                              
                                                                                                        
    try { if (g.RescueWeb && RescueWeb.briefHTML) out += RescueWeb.briefHTML(CombatLive.getFtueWaves(no, tierOf(no))); } catch (e) {               }
    var every = rest.filter(function (r) { return r.guaranteed; });
    var odds = rest.filter(function (r) { return !r.guaranteed; });
    if (fr) {
      if (rest.length) {
        out += '<section class="xb-panel xb-every"><p class="xb-eyebrow">ALSO EVERY WIN</p>'
          + '<div class="xb-pills">' + every.concat(odds).map(function (r) { return rewardPillHTML(r, true); }).join('') + '</div></section>';
      }
    } else if (odds.length) {
      var rolls = odds[0].count;
      out += KitUI.dropOdds({
        open: _brief.odds, onclick: 'expeditionBriefToggleOdds()',
        summary: 'chance per roll' + (rolls > 1 ? ' · ' + rolls + ' rolls' : ''),
        closedSummary: odds.length + (odds.length === 1 ? ' drop' : ' drops'),
        rows: odds.map(function (r) {
          var ic = rewardIconSrc(r.itemId, r.img);
          return { imgSrc: ic ? ic.src : '', name: rewardName(r), stat: '+' + qtyLabel(r.minQty, r.maxQty), pct: pctLabel(r.chance) };
        }),
        className: 'xb-odds'
      });
    }
    if (!fr) {
      out += '<section class="xb-panel xb-every"><p class="xb-eyebrow">EVERY WIN</p>'
        + (every.length
          ? '<div class="xb-pills">' + every.map(function (r) { return rewardPillHTML(r, true); }).join('') + '</div>'
          : '<p class="xb-note">' + (rows.length ? 'Nothing guaranteed — see the drop odds' : 'Rewards not revealed yet') + '</p>')
        + '</section>';
    }
    if (g.ExpeditionDifficulty && ExpeditionDifficulty.bonusHTML) out += ExpeditionDifficulty.bonusHTML(tierOf(no));                                            
    return out;
  }

                                                                                     
                                                                                   
                                                                                     
                                                                               
  function briefThresholdHTML(no) {
    var s = sel(no), need = null, gate = null, ids = [], t = null;
    try {
      gate = expPartyNeeds(s); need = expPartyThreshold(s);
      if (!need) return '';
      ids = bestParty(no); t = expTotalsOf(ids);
      return '<section class="xb-panel xb-thr" aria-label="Stats to win">'
        + '<div class="xb-panel__head"><p class="xb-eyebrow">' + (gate ? 'NEEDS' : 'TO WIN') + '</p>'
        + '<span class="xb-meta">' + (ids.length ? 'Your best ' + ids.length : 'No frogs free') + '</span></div>'
        + '<div class="xb-thr__meters">' + expStatMetersHTML(t, need, null, !ids.length) + '</div></section>';
    } catch (e) { return ''; }
  }

                                                                         
                                                                        
                            
                                                                       
                                                   
  function statNum(v) { return v == null ? '–' : (Number.isInteger(v) ? String(v) : String(Math.abs(v) >= 10 ? Math.round(v) : Math.round(v * 10) / 10)); }
  function statBar(label, value, max, tone) {
    var w = (value != null && max) ? Math.max(4, Math.round(value / max * 100)) : 0;
    return '<div class="xb-bar"><span class="xb-bar__label">' + label + '</span>'
      + '<span class="xb-bar__track"><span class="xb-bar__fill xb-bar__fill--' + tone + '" style="width:' + w + '%"></span></span>'
      + '<span class="xb-bar__value">' + statNum(value) + '</span></div>';
  }
  function maxOf(list, key) { return list.reduce(function (m, f) { return Math.max(m, f[key] || 0); }, 0); }
  function enemyArtHTML(f) { return f.art ? '<img src="' + esc(f.art) + '" alt="" draggable="false">' : ''; }

  function briefEnemiesHTML(no, sum) {
    if (!sum.stages.length) return '<section class="xb-panel"><p class="xb-note">No enemy data for this expedition yet.</p></section>';
    var cur = Math.max(0, Math.min(_brief.stage, sum.stages.length - 1));
    var maxAtk = maxOf(sum.roster, 'attack'), maxHp = maxOf(sum.roster, 'hp');
    var steps = sum.stages.map(function (s, i) {
      var on = i === cur;
      return '<button type="button" class="xb-step' + (on ? ' is-on' : '') + (s.boss ? ' xb-step--boss' : '') + '"'
        + ' onclick="expeditionBriefStage(' + i + ')" aria-label="Stage ' + s.no + (s.boss ? ', boss' : '') + '" aria-pressed="' + on + '">'
        + (s.boss && s.boss.art ? '<span class="xb-step__art">' + enemyArtHTML(s.boss) + '</span>'
          : s.harvest && s.harvest.art ? '<span class="xb-step__art">' + enemyArtHTML(s.harvest) + '</span>' : '<span class="xb-step__n">' + s.no + '</span>')
        + '</button>';
    }).join('');
    var stage = sum.stages[cur];
    if (stage.harvest) {
      return '<section class="xb-panel"><p class="xb-eyebrow">STAGES</p><div class="xb-steps" style="--xb-n:' + sum.stages.length + '">' + steps + '</div></section>'
        + '<section class="xb-panel"><div class="xb-panel__head"><p class="xb-eyebrow">STAGE ' + stage.no + '</p><span class="xb-meta">No enemies</span></div>'
          + '<div class="xb-harvest"><span class="xb-harvest__art">' + enemyArtHTML(stage.harvest) + '</span>'
          + '<p class="xb-note"><b>' + esc(stage.harvest.name) + '</b><br>' + (stage.harvest.rescue
            ? 'Tadpoles are stuck in it! Your frogs pull at it. Tap it to set them free!' + (stage.harvest.prizeNote ? esc(stage.harvest.prizeNote) : stage.harvest.prize ? ' Something else is caught in it too…' : '')
            : 'Your frogs hop on it. Tap it to harvest its seeds!') + '</p></div></section>';
    }
    var total = stage.foes.reduce(function (n, f) { return n + f.count; }, 0);
    var cards = stage.foes.map(function (f) {
      return '<button type="button" class="xb-foe' + (f.boss ? ' xb-foe--boss' : '') + '" onclick="expeditionBriefEnemy(\'' + attr(jsStr(f.id)) + '\',' + (f.boss ? 1 : 0) + ')" aria-label="' + esc(f.name) + ' details">'
        + '<span class="xb-foe__art">' + enemyArtHTML(f) + '</span>'
        + '<span class="xb-foe__name">' + esc(f.name) + '</span>'
        + '<span class="xb-foe__chips"><span class="xb-chip">×' + f.count + '</span>' + (f.boss ? '<span class="xb-chip xb-chip--boss">BOSS</span>' : '') + '</span>'
        + statBar('THREAT', f.attack, maxAtk, 'threat')
        + statBar('TOUGH', f.hp, maxHp, 'tough')
        + KitUI.weaknessSlot({ state: 'unknown', className: 'xb-foe__weak' })
        + '</button>';
    }).join('');
    var bossRow = '';
    if (sum.boss) {
      var b = sum.boss;
      bossRow = '<button type="button" class="xb-bossrow" onclick="expeditionBriefEnemy(\'' + attr(jsStr(b.id)) + '\',1)" aria-label="' + esc(b.name) + ' details">'
        + KitUI.enemyRow({ kind: 'boss', name: b.name, count: '×' + b.count, weakness: { state: 'unknown' },
          artHTML: enemyArtHTML(b), stage: 'Stage ' + b.stage + (b.attack != null ? ' · hits for ' + statNum(b.attack) : '') })
        + '</button>';
    }
    return '<section class="xb-panel"><p class="xb-eyebrow">STAGES</p><div class="xb-steps" style="--xb-n:' + sum.stages.length + '">' + steps + '</div></section>'
      + '<section class="xb-panel"><div class="xb-panel__head"><p class="xb-eyebrow">STAGE ' + stage.no + '</p>'
        + '<span class="xb-meta">' + total + (total === 1 ? ' enemy' : ' enemies') + '</span></div>'
        + '<div class="xb-foes">' + cards + '</div></section>'
      + bossRow;
  }

  function renderBriefHTML(state, no) {
    var node = nodeByNo(no) || { no: no, zoneName: '' };
    var sum = expeditionSummary(no);
    var sub = sum.stages.length ? sum.stages.length + ' ' + stageWord(sum.stages.length) + (sum.boss ? ' · ' + sum.boss.name : '') : '';
    var body = _brief.tab === 'enemies' ? briefEnemiesHTML(no, sum) : briefRewardsHTML(no);
                                                                              
    var tierTag = (g.ExpeditionDifficulty && ExpeditionDifficulty.tagHTML && typeof state !== 'undefined' && ExpeditionDifficulty.available(state))
      ? ExpeditionDifficulty.tagHTML(tierOf(no)) + ' ' : '';
    return '<header class="xb-head">'
      + KitUI.backButton({ onclick: 'expeditionBriefBack()', ariaLabel: 'Back to the ladder', className: 'xb-back' })
      + '<div class="xb-titles"><p class="xb-title">' + esc(node.zoneName) + ' · Exp ' + no + '</p>'
        + ((sub || tierTag) ? '<p class="xb-sub">' + tierTag + esc(sub) + '</p>' : '') + '</div>'
      + '</header>'
      + '<div class="xb-body">'
        + briefTabs(no, sum)
        + briefThresholdHTML(no)
        + body
        + KitUI.button({ tone: 'gold', shape: 'pill', size: 'lg', label: 'CHOOSE PARTY', onclick: 'expeditionPlayNode(' + no + ')', className: 'xb-choose' })
      + '</div>';
  }

                                                                           
                                                                        
  function renderBriefSheetHTML(state) {
    var e = _brief.enemy;
    if (!e || _brief.no == null) return '';
    var sum = expeditionSummary(_brief.no), f = null, stages = [];
    sum.stages.forEach(function (s) {
      s.foes.forEach(function (x) { if (x.id === e.id && x.boss === e.boss) { if (!f) f = x; stages.push(s.no); } });
    });
    if (!f) return '';
    var node = nodeByNo(_brief.no) || { zoneName: '' };
    var where = 'Stage ' + stages.join(', ') + ' · ×' + f.count;
    var maxAtk = maxOf(sum.roster, 'attack'), maxHp = maxOf(sum.roster, 'hp');
    var how = [];
    if (f.cadence != null) how.push('Attacks every ' + statNum(f.cadence) + 's');
    if (f.hits != null) how.push('hits ' + f.hits + (f.hits === 1 ? ' frog' : ' frogs'));
    return '<div class="xb-sheet-scrim" onclick="if(event.target===this)expeditionBriefEnemy(null)">'
      + '<div class="xb-sheet" role="dialog" aria-label="' + esc(f.name) + '">'
        + '<span class="xb-sheet__grab" aria-hidden="true"></span>'
        + '<div class="xb-sheet__inner">'
          + '<div class="xb-sheet__top"><span class="xb-sheet__art">' + enemyArtHTML(f) + '</span>'
            + '<div class="xb-sheet__id"><p class="xb-sheet__name">' + esc(f.name) + '</p>'
              + '<span class="xb-foe__chips">' + (f.boss ? '<span class="xb-chip xb-chip--boss">BOSS</span>' : '') + '<span class="xb-chip">' + esc(where) + '</span></span>'
              + (how.length ? '<p class="xb-sheet__how">' + esc(how.join(' · ')) + '</p>' : '')
            + '</div></div>'
          + '<section class="xb-panel xb-panel--inset"><p class="xb-eyebrow">THREAT</p>'
            + statBar('ATTACK', f.attack, maxAtk, 'threat') + statBar('TOUGH', f.hp, maxHp, 'tough')
            + (f.defense != null ? statBar('DEFENSE', f.defense, maxOf(sum.roster, 'defense'), 'tough') : '')
          + '</section>'
          + '<section class="xb-panel xb-panel--inset xb-sheet__weak"><p class="xb-eyebrow">WEAKNESS</p>'
            + KitUI.weaknessSlot({ state: 'unknown' }) + '</section>'
          + '<div class="xb-sheet__tags"><span class="xb-chip">Seen in: ' + esc(node.zoneName) + '</span></div>'
        + '</div>'
        + KitUI.button({ tone: 'violet', shape: 'pill', size: 'lg', label: 'CLOSE', onclick: 'expeditionBriefEnemy(null)', className: 'xb-sheet__close' })
      + '</div></div>';
  }

                                                                           
                                                                          
                                                                          
                                                                          
                                             
  function rerender() { if (typeof renderKeepSheetScroll === 'function') renderKeepSheetScroll(); else if (typeof render === 'function') render(); }
  function openBrief(no) {
    _brief = { no: no, tab: 'rewards', stage: 0, enemy: null, odds: false };
    expeditionCardNo = null; expeditionView = 'brief';
    if (typeof render === 'function') render();
    var fs = typeof document !== 'undefined' && document.querySelector('.xm-fullscreen');
    if (fs) fs.scrollTop = 0;
  }
  function briefBack() {
    var no = _brief.no;
    _brief.enemy = null;
    if (no != null) { expeditionZoneSel = zoneOfNode(no) || expeditionZoneSel; expeditionCardNo = no; }
    expeditionView = 'ladder'; _shownCard = null;
    if (typeof render === 'function') render();
  }
  function briefTab(tab) { _brief.tab = tab === 'enemies' ? 'enemies' : 'rewards'; _brief.enemy = null; rerender(); }
  function briefStage(i) { _brief.stage = i; rerender(); }
  function briefEnemy(id, boss) { _brief.enemy = id == null ? null : { id: id, boss: !!boss }; rerender(); }
  function briefToggleOdds() { _brief.odds = !_brief.odds; rerender(); }
  function briefNo() { return _brief.no; }
  function zonesSheet(open) { _zonesSheet.open = !!open; rerender(); }
  function zonesBy(mode) { _zonesSheet.by = mode === 'order' ? 'order' : 'set'; rerender(); }

                                                                             
                                                                           
                                                                        
                                                                           
                                                                          
                                                                            
                                                                              
                                                                           
                                                                        
                                                                               
                                                                          
  var _shownCard = null;
  var _snug = { band: 0, levels: {} };                                              
  function snugLevel(no) { return _snug.levels[no] || 0; }
                                                                                
                                                                        
                                                                             
                                                            
  function cardPlaced(no) { return no != null && _placedCard === no; }
  function afterRender(cardNo) {
    _placedCard = null;
    if (typeof document === 'undefined') return;
    if (cardNo == null) { _shownCard = null; _flipBelow = null; return; }
    var card = document.querySelector('.xm-card'), fs = document.querySelector('.xm-fullscreen');
    var ladder = document.querySelector('.xm-ladder'), path = document.querySelector('.xm-ladder-path');
    if (!card || !fs || !ladder || !path) return;
    if (_flipBelow !== null && _flipBelow !== cardNo) _flipBelow = null;
    var head = document.querySelector('.xm-fs-head'), dock = document.querySelector('.bottom-dock');
    var headH = head ? head.offsetHeight : 56;
    var top = head ? head.getBoundingClientRect().bottom + 4 : 8;
    var bottom = dock && dock.getBoundingClientRect().height ? dock.getBoundingClientRect().top - 4 : fs.getBoundingClientRect().bottom;
    var band = Math.round(bottom - top);
    var r = card.getBoundingClientRect(), pr = path.getBoundingClientRect();
    if (_snug.band !== band) {
      var was = snugLevel(cardNo), placed = _fitPlace[cardNo];
      _snug = { band: band, levels: {} }; _fitPlace = {};
      if (was || placed) { _shownCard = null; rerender(); return; }
    }
    if (r.height > band && snugLevel(cardNo) < 2) {
      _snug.levels[cardNo] = snugLevel(cardNo) + 1; _shownCard = null;
      rerender();
      return;
    }
                                                                         
                                                                         
                                       
    if (ladder.classList.contains('xm-ladder--fit')) {
      var coinEl = document.querySelector('.xm-coin[data-expedition-no="' + cardNo + '"]');
      if (!coinEl) return;
      var c = coinEl.getBoundingClientRect(), h = r.height;
      var unit = c.height / (69 * (parseFloat(getComputedStyle(ladder).getPropertyValue('--xm-coin')) || 1));
      var gap = 10 * unit, above = c.top - gap - top, below = bottom - (c.bottom + gap), want;
      if (h <= above) want = { side: 'above', shift: 0 };
      else if (h <= below) want = { side: 'below', shift: 0 };
      else if (snugLevel(cardNo) < 2) { _snug.levels[cardNo] = snugLevel(cardNo) + 1; rerender(); return; }
      else if (above >= below) want = { side: 'above', shift: Math.ceil(h - above) };
      else want = { side: 'below', shift: Math.ceil(h - below) };
      want.tail = want.shift <= gap;                                                  
      var cur = _fitPlace[cardNo];
      if (!cur || cur.side !== want.side || cur.tail !== want.tail || Math.abs(cur.shift - want.shift) > 2) { _fitPlace[cardNo] = want; rerender(); }
      else _placedCard = cardNo;
      return;
    }
    if (card.classList.contains('xm-card--above') && r.top - pr.top < headH + 4 && _flipBelow !== cardNo) {
      _flipBelow = cardNo; _shownCard = null;
      rerender();
      return;
    }
                                                     
    if (card.classList.contains('xm-card--below')) ladder.style.paddingBottom = 'calc(' + Math.ceil(r.bottom - pr.bottom + 12) + 'px + var(--dock-clear,96px))';
    _placedCard = cardNo;
    if (_shownCard === cardNo) return;
    _shownCard = cardNo;
    r = card.getBoundingClientRect();
    if (r.top < top) fs.scrollTop += r.top - top;
    else if (r.bottom > bottom) fs.scrollTop += Math.min(r.bottom - bottom, r.top - top);
  }

  var EMap = {
                                                                                    
    groupZones: groupZones, clearedNodeSet: clearedNodeSet, currentNode: currentNode,
    nodeState: nodeState, zoneState: zoneState, zoneProgress: zoneProgress, findZoneOfNode: findZoneOfNode,
    levelPoint: levelPoint, ladderSlot: ladderSlot, ladderAspect: ladderAspect, zoneLadder: zoneLadder, ladderPoint: ladderPoint, ladderBand: ladderBand,
    zonePinAt: zonePinAt, shortRewardName: shortRewardName,
    pctLabel: pctLabel, qtyLabel: qtyLabel,
           
    zones: zones, nodeByNo: nodeByNo, sel: sel, tierOf: tierOf, nextCurrentNode: nextCurrentNode,
    zoneOfNode: zoneOfNode, zoneProgressLabel: zoneProgressLabel, expeditionSummary: expeditionSummary,
    familyReward: familyReward, familyDropOdds: familyDropOdds, paperDollHTML: paperDollHTML, bestParty: bestParty, readiness: readiness, onWinPayout: onWinPayout,
    FTUE_L4_GATE_NODE: FTUE_L4_GATE_NODE,
             
    renderMapHTML: renderMapHTML, renderLadderHTML: renderLadderHTML, renderCardHTML: renderCardHTML,
    renderBriefHTML: renderBriefHTML, renderBriefSheetHTML: renderBriefSheetHTML, briefNo: briefNo,
    enemyChipHTML: enemyChipHTML, renderFaceHTML: renderFaceHTML, afterRender: afterRender, cardPlaced: cardPlaced,
                                                                                                
    _resetCacheForTests: function () { _zonesCache = null; }
  };

                                                                            
                                                                            
                                                                             
                                   
  function shortRewardName(rawName) { return String(rawName).replace(/\s*\([^)]*\)\s*$/, '').trim(); }
  function prettyItemName(itemId) { return String(itemId).replace(/_/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); }); }

  if (typeof module !== 'undefined' && module.exports) module.exports = EMap;
  else {
    g.EMap = EMap;
    g.expeditionOpenBrief = openBrief;
    g.expeditionBriefBack = briefBack;
    g.expeditionBriefTab = briefTab;
    g.expeditionBriefStage = briefStage;
    g.expeditionBriefEnemy = briefEnemy;
    g.expeditionBriefToggleOdds = briefToggleOdds;
    g.expeditionZonesSheet = zonesSheet;
    g.expeditionZonesBy = zonesBy;
  }
})(typeof window !== 'undefined' ? window : globalThis);
