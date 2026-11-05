  
                                                       
  
                                                                           
                                                                          
                                                                            
                                                                      
                                                                             
                                                       
  
                                                                           
                                                                             
                                                                           
                                                         
  
                                                                            
                                                                              
                                                                        
                                                                                    
                                                                              
                
  
                                                                             
                                                                      
                                                                          
                                                                            
                                                                           
                            
   
(function (root) {
  'use strict';

                                                                          
                                                                          
                                                                          
                             
                                                                          
  var RESOURCE_META = {
    wood: {
      stateKey: 'mat',                                                                        
      frogStatCol: 'Base Wood Harvesting',                          
      equipBuffCol: 'buff_harvest_wood',                                
      capCol: 'max wood',                                               
      icon: '\u{1FAB5}'
    },
    stone: {
      stateKey: 'rock',                                                                        
      frogStatCol: 'Base Rocks Harvesting',
      equipBuffCol: 'buff_harvest_stone',
      capCol: 'max stone',
      icon: '\u{1FAA8}'
    }
  };

                                                                          
                                                                      
                                                                          

                                                                         
                                                                         
                                                          
  function nearestRowByKey(rows, keyCol, raw) {
    if (!rows || !rows.length) {
      throw new Error('[Harvest] no rows given for a "' + keyCol + '" lookup');
    }
    var vals = rows.map(function (r) { return r[keyCol]; });
    var lo = Math.min.apply(null, vals), hi = Math.max.apply(null, vals);
    var clamped = Math.max(lo, Math.min(hi, raw));
    var row = rows.filter(function (r) { return r[keyCol] === clamped; })[0];
    if (!row) {
      throw new Error('[Harvest] no row with ' + keyCol + ' === ' + clamped);
    }
    return row;
  }

  function statForLevel(levelRows, statCol, level) {
    var row = nearestRowByKey(levelRows, 'Frog Level', level);
    if (!(statCol in row)) {
      throw new Error('[Harvest] Frogs row has no column "' + statCol + '"');
    }
    return row[statCol];
  }

                                                                         
                                                                        
                                                                        
                                                                        
  function computeEffectiveYield(jobRow, level, levelRows, equipPerMinute) {
    var meta = RESOURCE_META[jobRow.resource];
    if (!meta) {
      throw new Error('[Harvest] unknown resource "' + jobRow.resource + '" on job "' + jobRow.job_id + '"');
    }
    var stat = statForLevel(levelRows, meta.frogStatCol, level);
    var equip = (equipPerMinute || 0) * jobRow.shift_length_s / 60;
    if (!Number.isFinite(jobRow.yield_per_second) || !Number.isFinite(jobRow.shift_length_s)) {
      throw new Error('[Harvest] job "' + jobRow.job_id + '" requires yield_per_second and shift_length_s');
    }
    return jobRow.yield_per_second * jobRow.shift_length_s * stat + equip;
  }

                                                              
                                                                  
  function sortIdleForJob(idleFrogs, jobRow, levelRows, equipPerMinuteFn) {
    return idleFrogs.map(function (f) {
      var equipPerMinute = equipPerMinuteFn ? (equipPerMinuteFn(f) || 0) : 0;
      return {
        id: f.id,
        level: f.level,
        equipPerMinute: equipPerMinute,
        shiftYield: computeEffectiveYield(jobRow, f.level, levelRows, equipPerMinute)
      };
    }).sort(function (a, b) { return b.shiftYield - a.shiftYield; });
  }

  function ensureJobState(harvestState, jobRow) {
    var js = harvestState[jobRow.job_id];
    if (!js) {
      js = harvestState[jobRow.job_id] = { slots: [] };
    }
    while (js.slots.length < jobRow.frogs_per_job) js.slots.push(null);
    return js;
  }

                                                                            
  function isBusyInHarvest(harvestState, frogId) {
    var jobIds = Object.keys(harvestState || {});
    for (var i = 0; i < jobIds.length; i++) {
      var js = harvestState[jobIds[i]];
      if (!js || !js.slots) continue;
      for (var k = 0; k < js.slots.length; k++) {
        if (js.slots[k] && js.slots[k].frogId === frogId) return jobIds[i];
      }
    }
    return null;
  }

                                                                           
                                                                             
  function assignOne(harvestState, jobRow, frog, shiftYield, now) {
    var js = ensureJobState(harvestState, jobRow);
    if (js.slots.some(function (s) { return s && s.frogId === frog.id; })) {
      return { ok: false, reason: 'already-in-job' };
    }
    var idx = -1;
    for (var i = 0; i < js.slots.length; i++) { if (!js.slots[i]) { idx = i; break; } }
    if (idx < 0) return { ok: false, reason: 'full' };
    js.slots[idx] = {
      frogId: frog.id,
      level: frog.level,
      startedAt: now,
      endsAt: now + jobRow.shift_length_s * 1000,
      shiftYield: shiftYield,
      paidSoFar: 0
    };
    return { ok: true, slotIndex: idx };
  }

                                                                         
                                                                          
                                                                          
  function unassignOne(harvestState, jobId, frogId) {
    var js = harvestState[jobId];
    if (!js || !js.slots) return false;
    for (var i = 0; i < js.slots.length; i++) {
      if (js.slots[i] && js.slots[i].frogId === frogId) {
        js.slots[i] = null;
        return true;
      }
    }
    return false;
  }

                                                                             
                                                                           
                                                                         
  function autoAssign(harvestState, jobRow, candidates, now) {
    var assigned = [];
    for (var i = 0; i < candidates.length; i++) {
      var c = candidates[i];
      var res = assignOne(harvestState, jobRow, c, c.shiftYield, now);
      if (res.ok) assigned.push(c.id);
      else if (res.reason === 'full') break;
    }
    return assigned;
  }

                                                                          
                                                                        
                                                
  function pruneMissingFrogs(harvestState, existingFrogIdSet) {
    var freed = [];
    Object.keys(harvestState || {}).forEach(function (jobId) {
      var js = harvestState[jobId];
      if (!js || !js.slots) return;
      js.slots.forEach(function (slot, i) {
        if (slot && !existingFrogIdSet.has(slot.frogId)) {
          freed.push({ jobId: jobId, frogId: slot.frogId, slotIndex: i });
          js.slots[i] = null;
        }
      });
    });
    return freed;
  }

                                                                            
                                                                           
                                                                             
                                                                        
                                                                           
                                                                          
                              
  function tickPayout(harvestState, jobsConfig, now) {
    var deltas = {};
    var freed = [];
    jobsConfig.forEach(function (jobRow) {
      var js = harvestState[jobRow.job_id];
      if (!js || !js.slots) return;
      var shiftMs = jobRow.shift_length_s * 1000;
      js.slots.forEach(function (slot, i) {
        if (!slot) return;
        var elapsed = Math.min(now, slot.endsAt) - slot.startedAt;
        var owed = slot.shiftYield * (elapsed / shiftMs);
        var delta = owed - slot.paidSoFar;
        if (delta > 0) {
          deltas[jobRow.resource] = (deltas[jobRow.resource] || 0) + delta;
          slot.paidSoFar = owed;
        }
        if (now >= slot.endsAt) {
          freed.push({ jobId: jobRow.job_id, frogId: slot.frogId, slotIndex: i });
          js.slots[i] = null;
        }
      });
    });
    return { deltas: deltas, freed: freed };
  }

  var Harvest = {
    RESOURCE_META: RESOURCE_META,
    nearestRowByKey: nearestRowByKey,
    statForLevel: statForLevel,
    computeEffectiveYield: computeEffectiveYield,
    sortIdleForJob: sortIdleForJob,
    ensureJobState: ensureJobState,
    isBusyInHarvest: isBusyInHarvest,
    assignOne: assignOne,
    unassignOne: unassignOne,
    autoAssign: autoAssign,
    pruneMissingFrogs: pruneMissingFrogs,
    tickPayout: tickPayout
  };

                                                                          
                                                                          
                                                                    
                                                                          
  var isBrowser = (typeof window !== 'undefined' && typeof document !== 'undefined');

  if (isBrowser) {
    var _pickerJob = null;                                                             
    var _harvestView = 'list';                                                                   
    var _harvestSheetWasOpen = false;                                                             
    var _armed = null;                                                                                   
    var _sortAsc = false;                                                                         

    function jobsConfig() { return FPConfig.rows('Harvesting'); }
    function levelRows() { return FPConfig.rows('Frogs'); }
    function jobRow(jobId) {
      var rows = jobsConfig();
      var r = rows.filter(function (j) { return j.job_id === jobId; })[0];
      if (!r) throw new Error('[Harvest] unknown job "' + jobId + '" — known jobs: ' + rows.map(function (j) { return j.job_id; }).join(', '));
      return r;
    }
    function harvestState() {
      state.harvest = state.harvest || {};
      return state.harvest;
    }

                                                                         
                                                                            
    function equipPerMinute(frog, resource) {
      if (!frog || typeof Equipment === 'undefined') return 0;
      var col = RESOURCE_META[resource].equipBuffCol;
      var total = 0;
      Equipment.SLOTS.forEach(function (slot) {
        var inst = Equipment.equippedOn(state, frog.id, slot);
        if (!inst) return;
        try { total += Equipment.buffValue(Equipment.itemRow(inst.item_id), col); } catch (e) {                                }
      });
      return total;
    }

                                                                        
                                                                            
                                                                            
                                                                  
                                                             
    var POND_CAP_FN = { wood: 'maxWood', stone: 'maxStone' };
    function resourceCap(resource) {
      var fn = POND_CAP_FN[resource];
      if (!fn || typeof PondTiers === 'undefined' || typeof PondTiers[fn] !== 'function') {
        throw new Error('[Harvest] no PondTiers.' + fn + '() available for resource "' + resource + '"');
      }
      return PondTiers[fn]((state && state.pondTier) || 0);
    }

                                                                           
                                                                       
                                                        
                                                                   
                                                                            
                                                                         
                                                                  
    function frogsSheetLevel(frog) { return FrogStats.frogLevelForBodySize(FT.bodySizeOf(frog)); }

    function idleFrogs() {
      var hs = harvestState();
      return (state.frogs || []).filter(function (f) {
        return !isBusyInHarvest(hs, f.id) && !expFrogBusy(f.id);
      }).map(function (f) { return { id: f.id, level: frogsSheetLevel(f) }; });
    }

                                                                                  
    function busyLabel(frogId) {
      var hs = harvestState();
      var jobId = isBusyInHarvest(hs, frogId);
      if (jobId) { try { return jobRow(jobId).display_name; } catch (e) { return jobId; } }
      if (expFrogBusy(frogId)) return 'on expedition';
      return null;
    }

    function applyDeltas(deltas) {
      var credited={};
      Object.keys(deltas).forEach(function (resource) {
        var meta = RESOURCE_META[resource];
        var max = resourceCap(resource);
        var cur = state[meta.stateKey] || 0;
        var room = Math.max(0, max - cur);
        credited[resource]=Math.min(deltas[resource], room);
        state[meta.stateKey] = cur + credited[resource];
      });
      return credited;
    }

                                                                     
                                                                            
                                                                            
                                                                          
    var _warned = {};
    function warnOnce(key, err) {
      if (_warned[key]) return;
      _warned[key] = true;
      console.warn('[Harvest] ' + key + ' failed — harvesting is unavailable until this is fixed, rest of the game continues.', err);
    }

    function _tick() {
      if (!state) return;
      if (activeSheet !== 'harvesting') _harvestSheetWasOpen = false;                                                     
      try {
        var hs = harvestState();
        var existing = new Set((state.frogs || []).map(function (f) { return f.id; }));
        pruneMissingFrogs(hs, existing);
        var result = tickPayout(hs, jobsConfig(), Date.now());
        if (Object.keys(result.deltas).length) {
          var credited=applyDeltas(result.deltas);
          try { syncHUDResourceCounts(); } catch (e) {}
                                                                              
          if(root.FtueSteps && typeof root.FtueSteps.onHarvestIncome==='function') root.FtueSteps.onHarvestIncome(credited);
          queueSave();
        } else if (result.freed.length) {
          queueSave();
        }
      } catch (e) {
        warnOnce('tick', e);
      }
      if (activeSheet === 'harvesting') {
        var sb = document.querySelector('.sheet-body');
        var st = sb ? sb.scrollTop : 0;
        render();
        var sb2 = document.querySelector('.sheet-body');
        if (sb2) sb2.scrollTop = st;
      }
    }

    function openPicker(jobId) {
      _pickerJob = (_pickerJob === jobId) ? null : jobId;
      render();
    }

                                                                                                     
                                                                                            
                                                                          
    function openJobCrew(jobId) {
      _pickerJob = null;
      _armed = null;
      _harvestView = jobId;
      render();
    }
    function backToSummary() {
      _pickerJob = null;
      _armed = null;
      _harvestView = 'list';
      render();
    }

    function pickFrog(jobId, frogId) {
      var hs = harvestState();
      if (isBusyInHarvest(hs, frogId) || expFrogBusy(frogId)) { showToast('that frog is already busy'); return; }
      var frog = (state.frogs || []).filter(function (f) { return f.id === frogId; })[0];
      if (!frog) return;
      var jr = jobRow(jobId);
      var level = frogsSheetLevel(frog);
      var shiftYield = computeEffectiveYield(jr, level, levelRows(), equipPerMinute(frog, jr.resource));
      var res = assignOne(hs, jr, { id: frog.id, level: level }, shiftYield, Date.now());
      if (!res.ok) { showToast(res.reason === 'full' ? 'that job is full' : 'already assigned'); return; }
      leaveFlowerStationIfAny(frogId);
      state.harvestDispatchDone = true;
      _pickerJob = null;
      _armed = null;
      queueSave();
      render();
    }

    function releaseFrog(jobId, frogId) {
      var hs = harvestState();
      if (isArmed(jobId, frogId)) _armed = null;
      if (isBusyInHarvest(hs, frogId) !== jobId) return;
                                                                             
                                                                             
      _tick();
      unassignOne(hs, jobId, frogId);
      if (root.HarvestPondUI) root.HarvestPondUI.sync(performance.now());
      queueSave();
      render();
    }

                                                                         
                                                                            
                                                                           
                                                                          
                                                                          
    function releaseFrogIfBusy(frogId) {
      var hs = harvestState();
      var jobId = isBusyInHarvest(hs, frogId);
      if (!jobId) return false;
      releaseFrog(jobId, frogId);
      return true;
    }

    function autoAssignOneJob(jr) {
      var hs = harvestState();
                                                                            
                                                                          
      var candidates = sortIdleForJob(idleFrogs(), jr, levelRows(), function (f) {
        var frog = (state.frogs || []).filter(function (x) { return x.id === f.id; })[0];
        return equipPerMinute(frog, jr.resource);
      });
      var assigned = autoAssign(hs, jr, candidates, Date.now());
      assigned.forEach(leaveFlowerStationIfAny);
      return assigned;
    }

                                                                        
                                               
    function autoAssignAll() {
      var any = false;
      jobsConfig().forEach(function (jr) {
        if (autoAssignOneJob(jr).length) any = true;
      });
      if (any) { state.harvestDispatchDone = true; queueSave(); render(); }
      else showToast('no idle frogs to assign');
    }

                                                                             
                                                  
    function fillJob(jobId) {
      var jr = jobRow(jobId);
      var hs = ensureJobState(harvestState(), jr);
      if (hs.slots.every(Boolean)) { showToast('that job is full'); return; }
      _armed = null;
      if (autoAssignOneJob(jr).length) { state.harvestDispatchDone = true; queueSave(); render(); }
      else showToast('no idle frogs to assign');
    }

                                                                            
                                                                             
                                                                            
                                                                          
                                                                                 
                                                                             
                                                                        
                                            
                                                                         
                                                                               
                                                                           
                                                                        
                                                                               

                                              
    function fmtSign(seconds) {
      var s = Math.max(0, Math.ceil(seconds));
      var m = Math.floor(s / 60); s = s % 60;
      return m ? m + 'm ' + (s < 10 ? '0' : '') + s + 's' : s + 's';
    }
                                                                              
    function fmtRate(perMin) {
      var r = perMin >= 10 ? Math.round(perMin) : Math.round(perMin * 10) / 10;
      return '+' + r;
    }
    function perMin(shiftYield, jr) { return shiftYield * 60 / jr.shift_length_s; }

    function frogById(id) { return (state.frogs || []).filter(function (f) { return f.id === id; })[0]; }
    function nameOf(f) { return typeof frogDisplayName === 'function' ? frogDisplayName(f) : 'Frog'; }
    function argJS(v) { return "'" + String(v).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'"; }
    function resIcon(resource, size) { return KitUI.icon('currency/' + resource, { size: size }); }

                                                                             
                                                                           
    function familyTone(f) {
      var body = FT.bodyOf(f);
      var fam = body && body.family ? FT.familyDefOf(body.family) : null;
      if (!fam) return 'none';
      return ((typeof FrogStats !== 'undefined' && FrogStats.CODE_TO_SHEET_RARITY) || {})[fam.r] || 'common';
    }

                                                                          
    function isArmed(jobId, frogId) { return !!_armed && _armed.jobId === jobId && _armed.frogId === frogId; }
    function armRecall(jobId, frogId) {
      _armed = isBusyInHarvest(harvestState(), frogId) === jobId ? { jobId: jobId, frogId: frogId } : null;
      render();
    }
                                                                               
                                                                                
                                                                                  
                                                                                  
                      
    document.addEventListener('click', function (e) {
      var tile = e.target && e.target.closest ? e.target.closest('.hv-tile.harvest-slot--full') : null;
      if (!tile || isArmed(tile.dataset.job, tile.dataset.frog)) return;
      e.stopPropagation();
      e.preventDefault();
      armRecall(tile.dataset.job, tile.dataset.frog);
    }, true);

    function toggleSort() { _sortAsc = !_sortAsc; render(); }

                                                                                   
    function nextBackSeconds(jr) {
      var hs = harvestState();
      var js = hs[jr.job_id];
      if (!js) return null;
      var now = Date.now(), soonest = null;
      js.slots.forEach(function (s) {
        if (!s) return;
        var remaining = Math.max(0, Math.ceil((s.endsAt - now) / 1000));
        if (soonest === null || remaining < soonest) soonest = remaining;
      });
      return soonest;
    }

                                                                              
                                             
    function ratePerMinOf(jr) {
      var hs = ensureJobState(harvestState(), jr);
      return hs.slots.reduce(function (sum, s) { return sum + (s ? perMin(s.shiftYield, jr) : 0); }, 0);
    }

                                                                            
                                                                          
                                                                           
                                                       
    function renderSummaryRow(jr) {
      var hs = ensureJobState(harvestState(), jr);
      var working = hs.slots.filter(Boolean).length;
      var rate = fmtRate(ratePerMinOf(jr));
      var back = nextBackSeconds(jr);
      var chips = hs.slots.map(function (s) {
        var f = s && frogById(s.frogId);
        return f ? KitUI.frogChip({ artHTML: frogArtHTML(f, 34), className: 'hv-chip' })
                 : KitUI.frogChip({ state: 'empty', className: 'hv-chip' });
      }).join('');
      var count = working + '/' + jr.frogs_per_job + ' crew';
      var timer = back === null
        ? KitUI.timerSign(fmtSign(jr.shift_length_s), { className: 'hv-job__timer', ariaLabel: 'Shift length ' + fmtSign(jr.shift_length_s) })
        : KitUI.timerSign(fmtSign(back), { className: 'hv-job__timer', ariaLabel: 'Next frog back in ' + fmtSign(back) });
      return '<button type="button" class="harvest-row hv-job" onclick="Harvest.openJobCrew(' + argJS(jr.job_id) + ')"'
        + ' aria-label="' + KitUI.esc(jr.display_name + ', ' + count + ', ' + rate + ' ' + jr.resource + ' per minute') + '">'
        + KitUI.art(KitUI.ICONS['currency/' + jr.resource], { size: 56, fit: false, className: 'hv-job__art' })
        + '<span class="hv-job__info"><b class="hv-job__name">' + KitUI.esc(jr.display_name) + '</b>'
        + '<span class="hv-job__count">' + count + '</span>'
        + '<span class="hv-job__crew">' + chips + '</span></span>'
        + '<span class="hv-job__status">' + timer
        + KitUI.yieldBox({ amount: rate, unit: '/ min', iconHTML: resIcon(jr.resource, 22), className: 'hv-job__yield' })
        + '</span>'
        + KitUI.chevron({ className: 'hv-job__chev' })
        + '</button>';
    }

    function renderSummary(goalHTML) {
      return '<div class="harvest-summary hv-queue">'
        + '<h2 class="hv-title">HARVESTING</h2>'
        + (goalHTML || '')
        + KitUI.button({ tone: 'gold', shape: 'pill', size: 'sm', className: 'harvest-auto harvest-auto--global hv-auto', label: 'AUTO ASSIGN', onclick: 'Harvest.autoAssignAll()' })
        + jobsConfig().map(renderSummaryRow).join('')
        + '</div>';
    }

                                                                               
                                                                              
                                                                             
                                                                            
                      
    function crewTile(jr, t) {
      var f = t.f, name = nameOf(f), rate = fmtRate(t.rate);
      var armed = t.kind === 'crew' && isArmed(jr.job_id, f.id);
      var art = frogArtHTML(f, 96);
      var card = KitUI.frogCard({
        band: name,
        tone: t.kind === 'crew' ? 'none' : familyTone(f),
        state: t.kind === 'busy' ? 'working' : 'idle',                                                        
        artHTML: art,
        className: 'hv-card' + (t.kind === 'crew' ? ' hv-card--crew' : '')
      });
      var foot = armed
        ? '<span class="hv-recall kit-btn kit-btn--danger kit-shape-pill kit-btn--tag">CALL BACK</span>'
        : '<span class="hv-rate">' + resIcon(jr.resource, 24) + '<b>' + rate + '</b></span>';
      var label;
      if (t.kind === 'crew') {
        label = armed ? 'Call back ' + name : name + ' is working, ' + rate + ' ' + jr.resource + ' per minute. Tap to arm call back';
        return '<button type="button" class="hv-tile harvest-slot harvest-slot--full' + (armed ? ' is-armed' : '') + '"'
          + ' data-job="' + KitUI.esc(jr.job_id) + '" data-frog="' + KitUI.esc(f.id) + '"'
          + ' onclick="Harvest.releaseFrog(' + argJS(jr.job_id) + ',' + argJS(f.id) + ')"'
          + ' aria-label="' + KitUI.esc(label) + '">' + card + foot + '</button>';
      }
      if (t.kind === 'idle') {
        label = 'Send ' + name + ' to ' + jr.display_name + ', ' + rate + ' ' + jr.resource + ' per minute';
        return '<button type="button" class="hv-tile harvest-pick-row' + (t.full ? ' is-disabled' : '') + '"'
          + (t.full ? ' disabled' : ' onclick="Harvest.pickFrog(' + argJS(jr.job_id) + ',' + argJS(f.id) + ')"')
          + ' aria-label="' + KitUI.esc(label) + '">' + card + foot + '</button>';
      }
      return '<div class="hv-tile harvest-pick-row harvest-pick-row--busy" aria-label="' + KitUI.esc(name + ': ' + t.busy) + '">' + card + foot + '</div>';
    }

    function crewTiles(jr) {
      var hs = ensureJobState(harvestState(), jr);
      var full = hs.slots.every(Boolean);
      var dir = _sortAsc ? 1 : -1;
      function byRate(a, b) { return dir * (a.rate - b.rate); }
      var crew = hs.slots.filter(Boolean).map(function (s) {
        var f = frogById(s.frogId);
        return f ? { kind: 'crew', f: f, rate: perMin(s.shiftYield, jr) } : null;
      }).filter(Boolean).sort(byRate);
      var idle = [], busy = [];
      (state.frogs || []).forEach(function (f) {
        if (isBusyInHarvest(harvestState(), f.id) === jr.job_id) return;                         
        var rate = perMin(computeEffectiveYield(jr, frogsSheetLevel(f), levelRows(), equipPerMinute(f, jr.resource)), jr);
        var where = busyLabel(f.id);
        if (where) busy.push({ kind: 'busy', f: f, rate: rate, busy: where });
        else idle.push({ kind: 'idle', f: f, rate: rate, full: full });
      });
      return crew.concat(idle.sort(byRate), busy.sort(byRate));
    }

    function crewHead(jr) {
      var hs = ensureJobState(harvestState(), jr);
      return '<div class="hv-head">'
        + KitUI.backButton({ onclick: 'Harvest.backToSummary()', ariaLabel: 'Back to Harvesting', className: 'harvest-back hv-back' })
        + '<div class="hv-head__titles"><b class="hv-head__name">' + KitUI.esc(jr.display_name) + '</b>'
        + '<span class="hv-head__sub">' + hs.slots.filter(Boolean).length + '/' + jr.frogs_per_job + ' · ' + fmtRate(ratePerMinOf(jr)) + ' / min</span></div>'
        + '</div>';
    }

    function renderCrewScreen(jr, goalHTML) {
      var tiles = crewTiles(jr);
      return '<div class="harvest-crew hv-crew">'
        + (goalHTML || '')
        + '<div class="hv-tools">'
        + KitUI.button({ tone: 'violet', shape: 'pill', size: 'tag', className: 'hv-tool hv-sort', label: '⇅ Output ' + (_sortAsc ? '▴' : '▾'),
            onclick: 'Harvest.toggleSort()', ariaLabel: 'Sort by output, ' + (_sortAsc ? 'lowest' : 'highest') + ' first' })
        + KitUI.button({ tone: 'violet', shape: 'pill', size: 'tag', className: 'hv-tool hv-fill', label: 'FILL TO ' + jr.frogs_per_job,
            onclick: 'Harvest.fillJob(' + argJS(jr.job_id) + ')', ariaLabel: 'Fill ' + jr.display_name + ' with the best frogs by output' })
        + '</div>'
        + '<p class="hv-caption">Each frog’s output per minute</p>'
        + (tiles.length ? '<div class="hv-grid">' + tiles.map(function (t) { return crewTile(jr, t); }).join('') + '</div>'
                        : '<p class="harvest-pick-none">no frogs yet.</p>')
        + '</div>';
    }

                                                                           
                                                           
    function currentJob() {
      var rows = jobsConfig();                                                                     
      if (!_harvestSheetWasOpen) { _harvestView = 'list'; _harvestSheetWasOpen = true; _armed = null; }
      if (_harvestView !== 'list' && rows.some(function (r) { return r.job_id === _harvestView; })) {
        var jr = jobRow(_harvestView);
        if (_armed && (_armed.jobId !== jr.job_id || isBusyInHarvest(harvestState(), _armed.frogId) !== jr.job_id)) _armed = null;
        return jr;
      }
      _harvestView = 'list';
      _armed = null;
      return null;
    }

    function errorHTML(e) {
      warnOnce('renderSheet', e);
      return '<div class="harvest-sheet harvest-sheet--error"><p class="harvest-pick-none">'
        + 'Harvesting isn’t available yet (missing config: ' + KitUI.esc(e.message) + ').</p></div>';
    }

                                                                            
                         
    function renderSheet(goalHTML) {
                                                                            
                                                                           
                                                                           
                                                           
      try {
        var jr = currentJob();
        return jr ? renderCrewScreen(jr, goalHTML) : renderSummary(goalHTML);
      } catch (e) {
        return errorHTML(e);
      }
    }

                                                                         
                                                                             
    function page(goalHTML) {
      var head = '', body;
      try {
        var jr = currentJob();
        if (jr) { head = crewHead(jr); body = renderCrewScreen(jr, goalHTML); }
        else body = renderSummary(goalHTML);
      } catch (e) {
        body = (goalHTML || '') + errorHTML(e);
      }
      return '<section class="hv-page' + (head ? ' hv-page--crew' : '') + '" role="region" aria-label="Harvesting">'
        + head + '<div class="hv-body sheet-body">' + body + '</div></section>';
    }

                                                                
                                                                            
                                                                                   
                                                                           
                                                                        
                                                                      
                                                                          
                                                                             
    function ftueDispatchStep() { return !!(state && state.harvestDispatchDone); }
    function ftueManualStep() { return !!(state && state.harvestManualDone); }
    function notifyManualHarvest(resource) {
      if (!state) return;
      state.harvestManualResources = state.harvestManualResources || {};
      state.harvestManualResources[resource] = true;
      state.harvestManualDone = true;
    }
    function registerFtueHooks() {
      if (typeof FtueSteps === 'undefined' || !FtueSteps.registerHook) return;
      FtueSteps.registerHook('harvestAuto', function () {
                                                                                
        return { ok: true, done: ftueDispatchStep() };
      });
      FtueSteps.registerHook('harvestManual', function () {
                                                                            
                                                                           
                                                                             
        if (typeof activeSheet !== 'undefined' && activeSheet === 'harvesting') closeSheet();
        return { ok: true, done: ftueManualStep() };
      });
    }

    Harvest.openPicker = openPicker;
    Harvest.openJobCrew = openJobCrew;
    Harvest.backToSummary = backToSummary;
    Harvest.pickFrog = pickFrog;
    Harvest.releaseFrog = releaseFrog;
    Harvest.releaseFrogIfBusy = releaseFrogIfBusy;
    Harvest.autoAssignAll = autoAssignAll;
    Harvest.fillJob = fillJob;
    Harvest.toggleSort = toggleSort;
    Harvest.armRecall = armRecall;
    Harvest.renderSheet = renderSheet;
    Harvest.page = page;
    Harvest.assignedResource = function (frogId) {
      var jobId = isBusyInHarvest(harvestState(), frogId);
      return jobId ? jobRow(jobId).resource : null;
    };
    Harvest.isBusy = function (frogId) { return !!isBusyInHarvest(harvestState(), frogId) || expFrogBusy(frogId); };
    Harvest.ftueDispatchStep = ftueDispatchStep;
    Harvest.ftueManualStep = ftueManualStep;
    Harvest.notifyManualHarvest = notifyManualHarvest;

    registerFtueHooks();
    setInterval(_tick, 1000);
  }

  root.Harvest = Harvest;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Harvest;
  }
})(typeof window !== 'undefined' ? window : globalThis);
