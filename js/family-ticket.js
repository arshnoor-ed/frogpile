                                                           

                                                                         
                                                                         
                                                                          
                                                                                       
                                                                     

                                                                         
                                          
                                                                     
                                                                        
                                                                       
                                                                              
                                                                           
                                                                             
                         

                                                                            
                                                                             
                                                                            
                                                                            
                                                   

                                                                            
                                                                    
                                                   
(function (g) {
  'use strict';
                                                                                             
  function text(key, fallback, tokens){
    if(typeof FPConfig !== 'undefined' && FPConfig.text) return FPConfig.text(key, fallback, tokens);
    return String(fallback).replace(/\{(\w+)\}/g, function(all, name){ return tokens && Object.prototype.hasOwnProperty.call(tokens,name) ? String(tokens[name]) : all; });
  }


                                                                          
  function count(s) { return Math.max(0, Math.floor((s && s.familyTickets) || 0)); }
                                                                        
  function buy(s, price) {
    if (!(price > 0) || (s.gems || 0) < price) return false;
    s.gems -= price;
    s.familyTickets = count(s) + 1;
    return true;
  }
                                                                             
                                                                              
  function familyOfRoll(R, skins) {
    if (!R || R.phase !== 'ready' || !/^reward_/.test(R.skin || '')) return null;
    var sk = skins && skins[R.skin];
    var id = sk && sk.familyId;
    var pick = sk && sk.pool && sk.pool.filter(function (p) { return p.key === R.force; })[0];
    return ticketPiece(pick) && id && id !== 'bunny' && sk.pool && sk.pool.length ? id : null;
  }
                                                                           
                                                                             
                                                                          
                                 
  function grantsBlueprints() {
    try { return Number(FPConfig.row("Purchasables", "item_id", "family_ticket").effect_value.grants_blueprints) === 1; }
    catch (e) { return false; }
  }
  function ticketPiece(p) { return p && (grantsBlueprints() || !isGear(p.slot)); }
  function plan(claim, skins) {
    var R = claim && claim.roll, fam = familyOfRoll(R, skins);
    if (!fam) return null;
    function skPiece(x) { return ticketPiece(skins[R.skin].pool.filter(function (p) { return p.key === x.force; })[0]); }
    var own = [R], rest = [];
    (claim.remainingRolls || []).forEach(function (x) { (x && x.skin === R.skin && skPiece(x) ? own : rest).push(x); });
    var have = own.map(function (x) { return x.force; });
    var fullSkin = skins[R.skin].ticketSkin || R.skin;
    var extra = skins[fullSkin].pool.filter(function (p) { return ticketPiece(p) && have.indexOf(p.key) < 0; }).map(function (p) { return p.key; });
    return { familyId: fam, skin: fullSkin, own: own, rest: rest, extra: extra };
  }
                                                 
  function spend(s) {
    if (count(s) < 1) return false;
    s.familyTickets = count(s) - 1;
    return true;
  }
                                                                              
  function usedOn(s, no) {
    return ((s && s.familyTicketLog) || []).some(function (e) { return e && e.no === no; });
  }

                                                                            
                                                                            
                                                                           
                                                                           
                                                                          
  var core = { count: count, buy: buy, spend: spend, familyOfRoll: familyOfRoll, plan: plan, usedOn: usedOn, grantsBlueprints: grantsBlueprints, PROMPT_STAGES: [2, 3], TICKET_ONLY_STAGES: [2] };
  if (typeof module !== 'undefined' && module.exports) module.exports = core;
  if (!g.document) return;

                                                                          
  var api = g.FamilyTicket = Object.assign({}, core);
  function S() { return typeof state !== 'undefined' ? state : null; }
  function esc(v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function skins() { try { return EXP_SKINS; } catch (e) { return null; } }

                                                                            
                                                                           
  api.price = function () {
    try { var row = FPConfig.row('Items-Packs', 'Name', 'family ticket'); return Number(row.gems) || null; }
    catch (e) { return null; }
  };
                                                                    
  api.startingCount = function () {
    try { return Math.max(0, Math.floor(Number(FPConfig.value('StartingState', 'family_tickets')) || 0)); }
    catch (e) { if (g.console) console.warn('[family-ticket] no StartingState family_tickets row — a new save starts with none', e); return 0; }
  };

                                                                           
                                                                            
                                                                             
                                                                             
  api.TICKET_ITEM = 'family_ticket';
  api.webTables = function () {
    try {
      var holds = {}, cur = null;
      FPConfig.rows('DropTables').forEach(function (r) {
        if (r.drop_table_id) cur = String(r.drop_table_id).trim();
        if (cur && String(r.item_id || '').trim() === api.TICKET_ITEM) holds[cur] = true;
      });
      return FPConfig.rows('Expeditions').map(function (r) { return String(r.rescue_prize || '').trim(); })
        .filter(function (id, i, all) { return holds[id] && all.indexOf(id) === i; });
    } catch (e) { return []; }
  };
                                                                         
  api.freedFromWeb = function (s) {
    var won = (s && s.rescuePrizesWon) || [];
    return api.webTables().some(function (id) { return won.indexOf(id) >= 0; });
  };
                                                                                
                                                                               
                                                                      
                                                             
  api.migrateSave = function (s, parsed) {
    if (!s || !parsed || parsed.ticketsFromWeb) return;
    if (parsed.familyTickets !== undefined) {
      var won = s.rescuePrizesWon || (s.rescuePrizesWon = []);
      api.webTables().forEach(function (id) { if (won.indexOf(id) < 0) won.push(id); });
    }
    s.ticketsFromWeb = 1;
  };

                                                                            
                                                                           
  api.iconHTML = function (cls) {
    return '<svg class="ft-ticket' + (cls ? ' ' + cls : '') + '" viewBox="0 0 64 44" aria-hidden="true">'
      + '<path d="M7 3h50a3 3 0 0 1 3 3v9.5a6.5 6.5 0 0 0 0 13V38a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-9.5a6.5 6.5 0 0 0 0-13V6a3 3 0 0 1 3-3z" fill="#2a1d0e"/>'
      + '<path d="M8.5 6.5h47v7.2a9.4 9.4 0 0 0 0 16.6v7.2h-47v-7.2a9.4 9.4 0 0 0 0-16.6z" fill="#ffc83a"/>'
      + '<path d="M8.5 6.5h47v5h-47z" fill="#ffe08a"/>'
      + '<path d="M45 8v28" stroke="#b9791a" stroke-width="2.2" stroke-dasharray="3.2 3"/>'
      + '<path d="M26 11.5l2.9 6 6.5.9-4.7 4.5 1.1 6.5-5.8-3.1-5.8 3.1 1.1-6.5-4.7-4.5 6.5-.9z" fill="#ff7a2f" stroke="#2a1d0e" stroke-width="2" stroke-linejoin="round"/>'
      + '</svg>';
  };

  function familyName(id) { var d = null; try { d = FT.familyDefOf(id); } catch (e) { d = null; } return (d && d.n) || id; }
  function stageOf(claim) { var m = claim && /^sheet-(\d+)$/.exec(claim.expId || ''); return m ? Number(m[1]) : null; }
                                                                          
  api.prompted = function (claim) {
    var s = S(), no = stageOf(claim);
    return !!s && no != null && core.PROMPT_STAGES.indexOf(no) >= 0 && !usedOn(s, no);
  };
                                                         
  api.available = function (claim) {
    var s = S();
    return !!s && !!claim && !claim.auto && count(s) > 0 && !!familyOfRoll(claim.roll, skins());
  };
                                                                             
                                                                          
                                                                            
                                                                          
                                                                          
                                            
  api.ticketOnlyStage = function (claim) {
    var no = stageOf(claim);
    return no != null && core.TICKET_ONLY_STAGES.indexOf(no) >= 0 && api.available(claim);
  };
                                                              
  api.buttonHTML = function (claim) {
    if (!api.available(claim)) return '';
    var s = S(), n = count(s), fam = familyName(familyOfRoll(claim.roll, skins())), no = stageOf(claim);
                                                          
    var pack = skins()[claim.roll.skin], gear = grantsBlueprints() && !!(pack && pack.pool.some(function (p) { return isGear(p.slot); }));
    return '<button type="button" id="claim-ticket" class="kit-btn kit-btn--pink kit-shape-pill kit-btn--lg xr-ticket-btn' + (api.prompted(claim) ? ' is-prompted' : '') + '"'
      + (no != null ? ' data-stage="' + no + '"' : '')
      + ' aria-label="Use a Family Ticket (' + n + ' left): every ' + esc(fam) + ' piece' + (gear ? ' and its gear' : '') + ' at once">'
      + '<span class="xr-ticket-btn__icon">' + api.iconHTML() + '</span>'
      + '<span class="xr-ticket-btn__text"><b>USE TICKET</b><small>' + n + ' left · full set</small></span>'
      + (api.prompted(claim) ? '<span class="xr-ticket-btn__try" aria-hidden="true">' + esc(text("text_ticket_try", "TRY IT!")) + '</span>' : '')
      + '</button>';
  };

                                                                              
                                                                            
                                                                                                
                                                                            
                                                                            
                                                                       
                                                      
  var SLOT_ORDER = ['head', 'mouth', 'back', 'aura', 'weapon', 'shield'];
  function isGear(slot) { return slot === 'weapon' || slot === 'shield'; }
                                                                                                                     
  function gearShown(pick) {
    var row = null, U = null;
    try { row = Equipment.itemRow(Equipment.itemForPiece(pick.key)); U = Equipment.UI; } catch (e) { row = null; }
    return { key: pick.key, slot: pick.slot, name: pick.name, img: pick.img, rarity: (row && row.rarity) || 'rare',
      artHTML: row && U && U.itemArt ? U.itemArt(row, { size: 58 }) + (U.blueprintMarkHTML ? U.blueprintMarkHTML(pick.slot) : '') : '' };
  }
                                                                              
                                                                            
                                          
  function settlePlain(claim, s, slot) {
    var hit = (claim.plainBlueprints || []).filter(function (b) { return b.slot === slot && b.qty > 0; })[0];
    if (!hit || !Equipment.takeBlueprint(s, slot, 1)) return;
    hit.qty -= 1;
    var tile = (claim.drops || []).filter(function (d) { return d.key === hit.itemId && d.amount > 0 && !d.tierBonus; })[0];
    if (tile && !(tile.amount -= 1)) claim.drops.splice(claim.drops.indexOf(tile), 1);
  }
  api.use = function (claim) {
    var s = S(), sk = skins(), P = plan(claim, sk);
    if (!s || !P || !spend(s)) return false;
    var won = [];
    P.own.forEach(function (R) {                                                          
      var res = claimRollTrait(R.skin, R.force, { alreadyQueued: R.alreadyQueued, allowDuplicates: true });
      R.phase = 'done'; R.result = res.pick; R.dupe = res.dupe; R.ticket = true;
      won.push(R);
    });
    P.extra.forEach(function (key) {
      var piece = (sk[P.skin].pool.filter(function (p) { return p.key === key; })[0]) || {};
      if (isGear(piece.slot)) {
        try { Equipment.grantPieceBlueprint(s, key); }
        catch (e) { if (g.console) console.warn('[family-ticket] no gear row for ' + key, e); return; }
        settlePlain(claim, s, piece.slot);
      }
      var res = claimRollTrait(P.skin, key, { allowDuplicates: true });                                  
      won.push({ skin: P.skin, phase: 'done', force: key, allowDuplicates: true, ticket: true, result: res.pick, dupe: res.dupe });
    });
    won.sort(function (a, b) { return SLOT_ORDER.indexOf(a.result.slot) - SLOT_ORDER.indexOf(b.result.slot); });
    var pieces = won.filter(function (R) { return !isGear(R.result.slot); });
    var gear = won.filter(function (R) { return isGear(R.result.slot); }).map(function (R) { return gearShown(R.result); });
    claim.remainingRolls = P.rest;
    claim.revealed = (claim.revealed || []).concat(won);
    claim.ticket = { familyId: P.familyId, name: familyName(P.familyId), skin: P.skin, pieces: pieces, gear: gear };
                                                                                                     
    claim.drops = (claim.drops || []).concat(gear.map(function (it) {
      var name = it.name + ' Blueprint';
                                                                          
      if (g.FsGearHighlight && FsGearHighlight.is(it)) {
        return { key: it.key, img: null, name: name, amount: 1, rarity: it.rarity,
          icon: FsGearHighlight.burstHTML('sm') + (it.artHTML || '<img src="' + esc(it.img) + '" alt="" draggable="false">') };
      }
      return it.artHTML ? { key: it.key, img: null, icon: it.artHTML, name: name, amount: 1, rarity: it.rarity }
        : { key: it.key, img: it.img, name: name, amount: 1, rarity: it.rarity };
    }));
    claim.roll = { skin: P.skin, phase: 'done', ticket: true, result: pieces[0].result, idx: 0 };
    (s.familyTicketLog || (s.familyTicketLog = [])).push({ no: stageOf(claim), familyId: P.familyId, at: Date.now() });
    try { queueSave(); } catch (e) {}
    return true;
  };

                                                               
  api.buyFromShop = function () {
    var s = S(), price = api.price();
    if (!s || !price) return;
    if (!buy(s, price)) { try { showToast('not enough gems'); } catch (e) {} return; }
    try { showToast('\u{1F39F}️ Family Ticket ×1 — you have ' + count(s)); } catch (e) {}
    try { syncHUDResourceCounts(); } catch (e) {}
    try { queueSave(); } catch (e) {}
    try { render(); } catch (e) {}
  };
})(typeof window !== 'undefined' ? window : globalThis);
