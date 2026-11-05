                                                                              
                                                                            
                                                                           
                                                                           
                                                                           
                                                                              
                                                                              
                                                                            
                                                                           
                                                                           
                     

                                                                              
                                                                              
                                                                               
                                                                              
                        

                                                                               
                                            

                                                                          
                                                                             
                                                                           
                                                                         
                                                                          
                                                                              
                                                                  
                                                                              
                                                                               
                    

                                                                                   
                                                                            
(function (g) {
  'use strict';

                                                                          
  function list(s) { return s.autoExpeditions || (s.autoExpeditions = []); }
  function running(s) { return (s.autoExpeditions || []).filter(function (a) { return a.status === 'running'; }); }
  function runningOn(s, no) { return running(s).filter(function (a) { return a.no === no; })[0] || null; }
                                                                          
  function busy(s, frogId) { return running(s).some(function (a) { return a.frogs.indexOf(frogId) >= 0; }); }

                                                                           
  function ftueRunning(s) { return !s.ftueDone && (s.ftueLoop != null ? s.ftueLoop < 6 : !s.pondExpanded); }
                                                                            
  function loopAllows(s) { return !ftueRunning(s) || s.ftueLoop === 3; }
                                                                     
  function introduced(s) { return !!(s.ftueTooltips && s.ftueTooltips.seen && s.ftueTooltips.seen['tooltip-auto']); }
                                                                       
                                                                            
                                                                            
                                                                  
  function purchased(s) { return !!(s && s.autoRunUnlocked); }
  function allowed(s) { return purchased(s) && (!ftueRunning(s) || (s.ftueLoop === 3 && introduced(s))); }
                                                                           
                                                                                
  function introDue(s) { return purchased(s) && !!(s.ftueTooltips && s.ftueTooltips.autoFamily) && !introduced(s); }

  function runMs(run) { return Math.max(1, Math.round(((run && run.runS) || 0) * 1000)); }
  function emptyHaul() { return { reward: {}, drops: [], revealed: [] }; }

                                                                             
                                                                             
                                                                         
                                                                              
  var COST_SLOTS = [['auto_cost_1_type', 'auto_cost_1_count'], ['auto_cost_2_type', 'auto_cost_2_count']];
  var PLACEHOLDER = 'tbd';
  function costFromRow(row) {
    var items = [];
    COST_SLOTS.forEach(function (c) {
      var id = String((row && row[c[0]]) || '').trim(), qty = Math.floor(Number(row && row[c[1]]) || 0);
      if (!id || id.toLowerCase() === PLACEHOLDER || qty < 1) return;
      var same = items.filter(function (x) { return x.id === id; })[0];
      if (same) same.qty += qty; else items.push({ id: id, qty: qty });
    });
    return { items: items, placeholder: !items.length };
  }
                                                                          
  function shortOf(cost, have) {
    return ((cost && cost.items) || []).map(function (it) { return { id: it.id, need: it.qty, have: Number(have(it.id)) || 0 }; })
      .filter(function (x) { return x.have < x.need; });
  }
  function affordable(cost, have) { return !shortOf(cost, have).length; }

                                                                                 
  function start(s, no, frogs, now, first, id) {
    if (!frogs || !frogs.length || runningOn(s, no)) return null;
    var a = {
      id: id, no: no, frogs: frogs.slice(), status: 'running', startedAt: now,
      runStart: now, runEnd: now + runMs(first), next: first,
      runs: 0, wins: 0, losses: 0, haul: emptyHaul()
    };
    list(s).push(a);
    return a;
  }
  function finish(a, reason, at) { a.status = 'done'; a.reason = reason; a.endedAt = at; delete a.next; }

                                                                            
                                                                              
                                                                           
                                                                           
                                                                                 
  function advance(s, now, env, maxSteps) {
    var ended = [], steps = 0;
    running(s).forEach(function (a) {
      if (now < a.runEnd || steps >= maxSteps) return;
      steps++;
      var run = a.next || { won: false };
      addPay(a.haul, env.grant(a, run));                                                        
      a.runs++;
      if (run.won) a.wins++; else a.losses++;
      finish(a, run.won ? 'win' : 'loss', a.runEnd);
      ended.push(a);
    });
    return ended;
  }
                                                                              
                                                                            
                                                                   
  function halt(s, a, reason, now) {
    finish(a, reason, now);
    if (!a.runs) { var l = list(s); l.splice(l.indexOf(a), 1); }
    return a;
  }
  function stop(s, no, reason, now) {
    var a = runningOn(s, no);
    return a ? halt(s, a, reason, now) : null;
  }
  function stopAll(s, reason, now) { return running(s).map(function (a) { return halt(s, a, reason, now); }); }

  function haulWaiting(s) { return (s.autoExpeditions || []).some(function (a) { return a.status === 'done'; }); }
  function takeHaul(s, no) {
    var l = list(s);
    for (var i = 0; i < l.length; i++) {
      if (l[i].status === 'done' && (no == null || l[i].no === no)) return l.splice(i, 1)[0];
    }
    return null;
  }
  function addPay(haul, pay) {
    pay = pay || {};
    Object.keys(pay.reward || {}).forEach(function (k) { haul.reward[k] = (haul.reward[k] || 0) + pay.reward[k]; });
    (pay.drops || []).forEach(function (d) {
      var same = haul.drops.filter(function (x) { return x.itemId === d.itemId; })[0];
      if (same) same.amount += d.amount;
      else haul.drops.push({ itemId: d.itemId, name: d.name, img: d.img || null, amount: d.amount });
    });
    (pay.revealed || []).forEach(function (R) { haul.revealed.push(R); });
    if (pay.prize) haul.prize = pay.prize;                                                        
  }
  function progress(a, now) {
    var span = a.runEnd - a.runStart;
    return span > 0 ? Math.max(0, Math.min(1, (now - a.runStart) / span)) : 1;
  }
  function secondsLeft(a, now) { return Math.max(0, Math.ceil((a.runEnd - now) / 1000)); }
  function clock(sec) { return Math.floor(sec / 60) + ':' + ('0' + (sec % 60)).slice(-2); }

  var core = {
    list: list, running: running, runningOn: runningOn, busy: busy, ftueRunning: ftueRunning, loopAllows: loopAllows, introduced: introduced, allowed: allowed, introDue: introDue,
    start: start, advance: advance, stop: stop, stopAll: stopAll, haulWaiting: haulWaiting, takeHaul: takeHaul,
    addPay: addPay, progress: progress, secondsLeft: secondsLeft, clock: clock, runMs: runMs,
    COST_SLOTS: COST_SLOTS, PLACEHOLDER: PLACEHOLDER, costFromRow: costFromRow, shortOf: shortOf, affordable: affordable
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = core;
  if (!g.document) return;

                                                                          
  var api = g.AutoExpeditions = Object.assign({}, core);
                                                                            
                                                                          
  var MAX_RUNS_PER_TICK = 20;
  var TICK_MS = 1000;
  var ICON = '<svg class="ax-icon" viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">'
    + '<path d="M19.5 9.5A8 8 0 0 0 5.2 7.4"/><path d="M4.5 14.5a8 8 0 0 0 14.3 2.1"/><path d="M19.8 3.8v5.9h-5.9"/><path d="M4.2 20.2v-5.9h5.9"/></g></svg>';
  api.ICON = ICON;

  function S() { return typeof state !== 'undefined' ? state : null; }
  function esc(v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  var warned = {};
  function warnOnce(key, msg) { if (warned[key]) return; warned[key] = true; if (g.console) console.warn(msg); }

                                                                           
                                                                           
                                                                             
                                                                            
                                                                
  var WALLET = { wood: 'mat', stone: 'rock', mat: 'mat', rock: 'rock', tadpoles: 'tadpoles', gems: 'gems', seeds: 'seeds', bones: 'bones',
    family_ticket: 'familyTickets', family_tickets: 'familyTickets', familyTickets: 'familyTickets' };
  function walletKey(id) {
    if (WALLET[id]) return WALLET[id];
    var s = S();
    return s && typeof s[id] === 'number' ? id : null;
  }
  function have(id) { var s = S(), k = walletKey(id); return s && k ? Number(s[k]) || 0 : 0; }
                                                                               
  function finalRow(no) {
    var rows = [];
    try { rows = FPConfig.rows('Expeditions').filter(function (r) { return String(r.expedition_no) === String(no); }); } catch (e) { rows = []; }
    return rows.sort(function (a, b) { return Number(a.wave_no) - Number(b.wave_no); })[rows.length - 1] || null;
  }
  function costOf(no) {
    var row = finalRow(no);
    if (row && !(COST_SLOTS[0][0] in row)) warnOnce('cost-column', '[AutoExpeditions] "Expeditions.auto_cost_1_type" is missing from the current config export — every auto run shows the "?" placeholder price until a fresh export adds it.');
    var cost = costFromRow(row);
    cost.items = cost.items.filter(function (it) {
      if (walletKey(it.id)) return true;
      warnOnce('cost-id:' + it.id, '[AutoExpeditions] Expedition ' + no + ' auto run cost "' + it.id + '" is not a wallet — left out of the price.');
      return false;
    });
    cost.placeholder = !cost.items.length;
    return cost;
  }
  api.costOf = costOf;
  function canPay(no) { return affordable(costOf(no), have); }
  api.canPay = canPay;
  function charge(items, sign) {
    var s = S();
    (items || []).forEach(function (it) { var k = walletKey(it.id); if (k) s[k] = Math.max(0, (Number(s[k]) || 0) + sign * it.qty); });
    try { syncHUDResourceCounts(); } catch (e) {}
  }
  function costIcon(id) {
    var k = walletKey(id);
    if (k === 'familyTickets' && g.FamilyTicket && FamilyTicket.iconHTML) return FamilyTicket.iconHTML('ax-cost-ticket');
    try { var ic = curIcon(k || id); if (ic) return ic; } catch (e) {}
    return '<span class="ax-cost-name">' + esc(id) + '</span>';
  }
                                                                   
  function costHTML(cost) {
    if (cost.placeholder) return '<span class="ax-cost ax-cost--tbd" title="Auto run cost: not decided yet">?</span>';
    return '<span class="ax-cost">' + cost.items.map(function (it) { return KitUI.costChip(costIcon(it.id), it.qty, have(it.id)); }).join('') + '</span>';
  }
  function costWords(cost) {
    return cost.placeholder ? 'cost not decided yet' : cost.items.map(function (it) { return it.qty + ' ' + it.id; }).join(' and ');
  }
  api.costHTML = function (no) { return costHTML(costOf(no)); };

                                                                         
                                                                           
                                                                              
                                                                          
  function simulate(a) {
    var party = [];
    try { party = liveExpeditionPartyStats(a.frogs); } catch (e) { party = []; }
    if (!party.length) return { won: false, runS: 0, kills: {} };
    var waves = CombatLive.getFtueWaves(a.no, a.tier);
    if (g.RescueWeb && RescueWeb.rollCatch) waves = RescueWeb.rollCatch(waves);                                                
    var res = CombatLive.simulateHeadless(party, waves, CombatLive.getEnemyDb(a.no, a.tier), CombatLive.getBossDb(a.no, a.tier),
      (Math.random() * 0x7fffffff) >>> 0, 0);
    var holds = Math.min(res.wavesCleared || 0, waves.length - 1);
                                                                                                
    return { won: !!res.won, runS: (res.simTime || 0) + holds * CombatLive.waveClearHoldS(), kills: res.kills || {}, harvests: res.harvests || [] };
  }
                                                                           
                                                                              
                                                                          
  function grant(a, run) {
    var pay = { reward: {}, drops: [], revealed: [] }, s = S();
    a.frogs.forEach(function (id) { try { Equipment.consumeUse(s, id); } catch (e) {} });
                                                                                       
    if (!run.won && g.FrogWounds) { try { FrogWounds.onLoss(a.frogs, a.runEnd); } catch (e) {} }
    var env = { state: s, gainWood: gainWood, gainStone: gainStone, gainTadpoles: gainTadpoles, queueSave: queueSave };
    try {
      var kills = CombatLive.resolveKillRewards(run.kills || {}, CombatLive.getEnemyDb());
      if (kills.length) pay.reward = Rewards.buildClaimRewardObject(Rewards._applyCredits(kills.map(function (k) { return { itemId: k.currencyId, qty: k.qty }; }), env));
    } catch (e) {}
    var outcome = run.won ? 'win' : 'loss';
                                                               
    if (run.won && g.ExpeditionDifficulty) ExpeditionDifficulty.recordWin(s, a.no, a.tier || 'normal');
    if (!Rewards.forExpedition(a.no, outcome).length) return pay;
    var results = Rewards.grantForExpedition(a.no, outcome, 'auto-expedition:' + a.no + ':' + outcome, undefined, { tier: a.tier, harvests: run.harvests || [] });
    var table = Rewards.buildClaimRewardObject(results);
    Object.keys(table).forEach(function (k) { pay.reward[k] = (pay.reward[k] || 0) + table[k]; });
    pay.drops = Rewards.nonCurrencyCreditedItems(results).map(function (it) { return { itemId: it.itemId, name: it.displayName, img: it.img || null, amount: it.granted }; });
    Rewards.buildClaimRolls(results).forEach(function (R) {
      var res = claimRollTrait(R.skin, R.force, { alreadyQueued: R.alreadyQueued, allowDuplicates: true });
      pay.revealed.push({ skin: R.skin, phase: 'done', allowDuplicates: true, dupe: !!res.dupe,
        result: { key: res.pick.key, name: res.pick.name, slot: res.pick.slot, img: res.pick.img } });
    });
                                                                                                
    if (Rewards.fullSetsOf && g.TraitRevealUI) Rewards.fullSetsOf(results).forEach(function (fs) { pay.prize = TraitRevealUI.prizeFrom(fs); });
    return pay;
  }

                                                                              
                                                                         
                                                                               
                                                                     
                                                                               
                                                              
  function setDone(familyId) {
    var s = S(), pool = [];
    try { pool = FT.familyTraitPool(familyId); } catch (e) { pool = []; }
    var won = (s && s.unlockedSetPieces) || [];
    var have = typeof familyHasPiece === 'function'
      ? function (k) { try { return !!familyHasPiece(k); } catch (e) { return won.indexOf(k) >= 0; } }
      : function (k) { return won.indexOf(k) >= 0; };
    return pool.length > 0 && pool.every(function (t) { return have(t.k); });
  }
  api.setDone = setDone;

  function calmForTick() {
    if (g.FtueTooltips && FtueTooltips.paused()) return false;
    if (g.CombatLive && CombatLive.isOpen()) return false;
    return !document.querySelector('#claim-modal');
  }
  function onExpeditionScreen() {
    return typeof activeSheet !== 'undefined' && activeSheet === 'expeditions'
      && typeof expeditionView !== 'undefined' && (expeditionView === 'map' || expeditionView === 'ladder');
  }

                                                                 
  var configReady = false;
  if (g.FPConfig && FPConfig.ready) FPConfig.ready.then(function () { configReady = true; }, function () {});
  api.tick = function () {
    var s = S(); if (!configReady || !s || !s.autoExpeditions || !s.autoExpeditions.length) return;
    var changed = false, now = Date.now();
    if (running(s).length && !allowed(s)) { stopAll(s, 'ftue', now).forEach(refundUnpaid); changed = true; }
    if (calmForTick() && running(s).length) {
      if (advance(s, now, { grant: grant }, MAX_RUNS_PER_TICK).length) changed = true;
    }
    if (changed) {
      try { syncHUDResourceCounts(); } catch (e) {}
      queueSave();
                                                                              
      if (!document.getElementById('ftue-tooltip')) renderKeepSheetScroll();
    }
                                                                                  
    if (haulWaiting(s) && onExpeditionScreen() && calmForTick()) { api.openHaul(); return; }
    refreshLive(s, now);
  };
                                                                    
  function refundUnpaid(a) { if (a && !a.runs && a.cost) { charge(a.cost, +1); delete a.cost; } }
                                                                          
                                                       
  function refreshLive(s, now) {
    running(s).forEach(function (a) {
      var left = clock(secondsLeft(a, now)), pct = Math.round(progress(a, now) * 100) + '%';
      Array.prototype.forEach.call(document.querySelectorAll('[data-auto-timer="' + a.no + '"]'), function (el) { el.textContent = left; });
      Array.prototype.forEach.call(document.querySelectorAll('[data-auto-bar="' + a.no + '"]'), function (el) { el.style.width = pct; });
    });
  }

                                                                             
                                                                                
  api.startFromCard = function (no) {
    var s = S(); if (!s || !allowed(s) || runningOn(s, no) || !canPay(no)) return;
    var ids = EMap.bestParty(no);
    if (!ids.length) { expeditionPlayNode(no); return; }
    expeditionSelNo = no; expeditionCardNo = null; expeditionParty = ids;
    if (expeditionDispatchBlockReason()) { expeditionView = 'detail'; activeSheet = 'expeditions'; render(); return; }
    expeditionParty = []; expeditionSelNo = null; expeditionCardNo = no;
    if (launch(no, ids, tierPick(no))) renderKeepSheetScroll();
  };
                                                                
  function tierPick(no) { return g.ExpeditionDifficulty ? ExpeditionDifficulty.pickOf(S(), no) : 'normal'; }
  function tierWord(tier) { return tier && tier !== 'normal' ? ' · ' + tier.toUpperCase() : ''; }
                                                                 
  function launch(no, ids, tier) {
    var s = S(), cost = costOf(no);
    if (runningOn(s, no) || !affordable(cost, have)) return null;
    ids.forEach(leaveFlowerStationIfAny);                                                         
    var a = start(s, no, ids, Date.now(), null, makeId());
    if (!a) return null;
    a.tier = tier || 'normal';
    if (cost.items.length) { a.cost = cost.items.map(function (it) { return { id: it.id, qty: it.qty }; }); charge(a.cost, -1); }
    a.next = simulate(a); a.runEnd = a.runStart + runMs(a.next);
    endGuide();
    try { ac(); } catch (e) {}
    queueSave();
    return a;
  }

                                                                             
                                                                               
                                                                                
  function claimStage(claim) {
    var m = claim && !claim.auto && /^sheet-(\d+)$/.exec(claim.expId || '');
    return m ? Number(m[1]) : null;
  }
  function rerunOpen(s, no) {
    return !!s && no != null && allowed(s) && !runningOn(s, no)
      && (s.expeditionsCleared || []).indexOf('node-' + no) >= 0;
  }
                                                                            
  function blockOf(no, ids) {
    var sel = expeditionSelNo, party = expeditionParty, block = null;
    expeditionSelNo = no; expeditionParty = ids.slice();
    try { block = expeditionDispatchBlockReason(); } finally { expeditionSelNo = sel; expeditionParty = party; }
    return block;
  }
  function blockText(b) {
    if (b.reason === 'min_party') return 'Auto rerun needs ' + b.min + ' free frogs';
    if (b.reason === 'power') return 'Not enough power for an auto rerun';
    return "Can't send that party right now";
  }
                                                                        
  api.rerunFromClaim = function (claim) {
    var s = S(), no = claimStage(claim);
    if (!rerunOpen(s, no)) return "Auto rerun isn't available right now";
    if (!canPay(no)) return 'Not enough for an auto rerun';
    var ids = EMap.bestParty(no);
    if (!ids.length) return 'No frogs are free to send';
    var block = blockOf(no, ids);
    if (block) return blockText(block);
                                                                      
    var tier = (g.ExpeditionDifficulty && claim.tier && ExpeditionDifficulty.unlocked(s, no, claim.tier)) ? claim.tier : tierPick(no);
    if (!launch(no, ids, tier)) return "Auto rerun isn't available right now";
    claim.autoRerun = { no: no };
    return '';
  };
                                                                             
                                                             
  api.rerunHTML = function (claim) {
    var s = S(), no = claimStage(claim);
    if (!s || no == null) return '';
    if (runningOn(s, no)) return '<p class="xr-autorerun-on">' + ICON + '<span>AUTO RERUN ON · your frogs are playing it once more</span></p>';
    if (!rerunOpen(s, no) || !EMap.bestParty(no).length) return '';
    var cost = costOf(no);
    return KitUI.button({ id: 'claim-autorerun', tone: 'green', shape: 'pill', size: 'lg', className: 'xr-autorerun', disabled: !affordable(cost, have),
      html: ICON + '<span class="xr-autorerun__text"><b>AUTO RERUN</b><small>once · ' + costHTML(cost) + '</small></span>',
      ariaLabel: 'Send your best frogs to play Expedition ' + no + ' once more on their own (' + costWords(cost) + ')' });
  };
                                                                           
  api.stopFromCard = function (no) {
    var s = S(), a = s && stop(s, no, 'stop', Date.now());
    if (!a) return;
    refundUnpaid(a);
    queueSave(); renderKeepSheetScroll(); api.openHaul(no);
  };
                                                                             
  api.openHaul = function (no) {
    var s = S(); if (!s || document.querySelector('#claim-modal')) return;
    var a = takeHaul(s, no); if (!a) return;
    var names = [];
    a.frogs.forEach(function (id) { var f = (s.frogs || []).filter(function (x) { return x.id === id; })[0]; if (f) { try { names.push(frogDisplayName(f)); } catch (e) {} } });
                                                                               
    var tally = a.runs > 1 ? a.wins + (a.wins === 1 ? ' win' : ' wins') + (a.losses ? ', ' + a.losses + (a.losses === 1 ? ' loss' : ' losses') : '') : (a.wins ? 'win' : 'loss');
    var why = a.runs > 1 && a.reason === 'loss' ? ' · STOPPED BY A LOSS' : a.reason === 'ftue' ? ' · CALLED HOME' : a.reason === 'set' ? ' · SET COMPLETE' : '';
    var claim = {
      expId: 'sheet-' + a.no, outcome: a.wins ? 'win' : 'loss', auto: true,
                                                                                                      
      name: 'Expedition ' + a.no + (a.tier && a.tier !== 'normal' ? ' · ' + ExpeditionDifficulty.label(a.tier) : '') + ' · Auto' + (a.runs > 1 ? ' · ' + tally : ''),
      eyebrow: 'AUTO RUN' + tierWord(a.tier) + ' · ' + tally.toUpperCase() + why,
      reward: a.haul.reward,
      drops: a.haul.drops.map(function (d) { return { img: d.img, icon: d.img ? null : rewardTileIcon(d.itemId), name: d.name, amount: d.amount }; }),
      revealed: a.haul.revealed, prize: a.haul.prize || null, bonus: null, crew: names, roll: null
    };
    queueSave(); render();
    openClaimModal(claim);
  };

                                                                          
                                                                              
                                                                         
                                                                              
                                                                                   
  api.introFamily = function (no) {
    var s = S(), fr = null;
    if (!s || no == null || !introDue(s) || !loopAllows(s) || runningOn(s, no)) return null;
    if ((s.expeditionsCleared || []).indexOf('node-' + no) < 0 || !canPay(no)) return null;
    try { fr = EMap.familyReward(no); } catch (e) { fr = null; }
    return fr && !setDone(fr.id) ? fr.id : null;
  };
                                                                            
                                                                             
                                                                              
                                                                          
                                                                          
                                                                          
  api.cardRowHTML = function (no, opts) {
    var s = S(); opts = opts || {};
    if (!s || opts.locked || opts.guided || !(allowed(s) || api.introFamily(no))) return '';
    if ((s.expeditionsCleared || []).indexOf('node-' + no) < 0) return '';
    var a = runningOn(s, no), now = Date.now();
    if (a) {
      return '<div class="xm-auto xm-auto--on">'
        + '<span class="xm-auto__icon is-spinning">' + ICON + '</span>'
        + '<span class="xm-auto__text"><span class="xm-card-eyebrow">AUTO RUN' + tierWord(a.tier) + ' · AWAY</span>'
          + '<span class="xm-auto__sub"><b data-auto-timer="' + no + '">' + clock(secondsLeft(a, now)) + '</b> · back with the haul</span>'
          + '<span class="xm-auto__bar"><i data-auto-bar="' + no + '" style="width:' + Math.round(progress(a, now) * 100) + '%"></i></span></span>'
        + KitUI.button({ tone: 'danger', shape: 'pill', size: 'sm', label: 'STOP', onclick: 'AutoExpeditions.stopFromCard(' + no + ')', ariaLabel: 'Stop the auto run and bring the frogs home (its cost is given back)', className: 'xm-card-autostop' })
      + '</div>';
    }
    if (!opts.best || !opts.best.length) return '';
    var cost = costOf(no), ok = affordable(cost, have);
    return '<div class="xm-auto' + (ok ? '' : ' xm-auto--short') + '">'
      + '<span class="xm-auto__icon">' + ICON + '</span>'
      + '<span class="xm-auto__text"><span class="xm-card-eyebrow">AUTO RUN' + tierWord(tierPick(no)) + '</span>'
        + '<span class="xm-auto__sub">Plays it once</span></span>'
      + KitUI.button({ tone: 'green', shape: 'pill', size: 'sm', disabled: !ok, html: ICON + '<span>AUTO</span>' + costHTML(cost), onclick: 'AutoExpeditions.startFromCard(' + no + ')',
        ariaLabel: 'Send your best ' + opts.best.length + ' to play it once on their own (' + costWords(cost) + ')', className: 'xm-card-auto' })
    + '</div>';
  };
                                                             
  api.coinBadgeHTML = function (no) {
    var s = S();
    return s && runningOn(s, no) ? '<span class="xm-coin-auto" aria-label="Auto run">' + ICON + 'AUTO</span>' : '';
  };
                                                               
  api.dockBadgeHTML = function () {
    var s = S();
    return s && running(s).length ? '<span class="dock-auto" aria-label="Auto expedition running">' + ICON + '</span>' : '';
  };

                                                                           
                                                                           
                                                                              
                                                                         
                                                                            
                                                                          
                                                      
  function guideState() { var s = S(); return s && s.ftueTooltips && s.ftueTooltips.autoGuide; }
  function endGuide() { var s = S(); if (s && s.ftueTooltips && s.ftueTooltips.autoGuide) { delete s.ftueTooltips.autoGuide; queueSave(); } }
                                                                          
  api.startGuide = function (no) {
    var s = S();
    if (!s || no == null) return;
    (s.ftueTooltips || (s.ftueTooltips = { merges: 0, seen: {}, pending: [] })).autoGuide = { no: no, entered: true };
    queueSave();
  };
  api.guide = function (p) {
    var s = S(), gd = guideState(); if (!gd) return false;
    if (runningOn(s, gd.no) || !allowed(s)) { endGuide(); return false; }
    var hide = function () { p.classList.remove('on', 'tap', 'grabbing', 'send-target', 'craft-target'); return true; };
    if ((g.FtueTooltips && FtueTooltips.paused()) || document.querySelector('#claim-modal,#family-spotlight,.big-unlock,.cl-overlay,#body-hint,.showcase-overlay,.evo-overlay')) return hide();
    var target = null;
    if (typeof activeSheet === 'undefined' || activeSheet !== 'expeditions') {
      if (activeSheet || gd.entered) { endGuide(); return false; }                               
      target = dockBtnByLabel('Expeditions');
    } else {
      if (!gd.entered) { gd.entered = true; queueSave(); }
      var zone = EMap.zoneOfNode(gd.no);
      if (expeditionView === 'map') {
        target = Array.prototype.filter.call(document.querySelectorAll('[data-zone]'), function (el) { return el.dataset.zone === zone; })[0];
      } else if (expeditionView === 'ladder') {
        if (expeditionZoneSel !== zone || (expeditionCardNo != null && expeditionCardNo !== gd.no)) target = q1('.xm-fs-back');
        else if (expeditionCardNo === gd.no) target = q1('.xm-card-auto');
        else target = q1('[data-expedition-no="' + gd.no + '"]');
      } else {
        target = q1('.xps-back') || q1('.xb-back') || q1('[onclick*="expeditionBriefBack"]');
      }
    }
    if (!target || typeof GuidedHand === 'undefined') return hide();
    GuidedHand.place(p, target);
    return true;
  };

  setInterval(function () { try { api.tick(); } catch (e) { if (g.console) console.warn('[auto-expeditions] tick', e); } }, TICK_MS);
})(typeof window !== 'undefined' ? window : globalThis);
