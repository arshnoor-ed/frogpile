                                                                     
                                                                              
                                                                   
                                                                               
                                                                             
                                                                            
                                                                            
                                                                            
                                                                           
  
                                                                         
                                                                              
                                                                            
                                                                        
                                               
   
(function (g) {
  'use strict';
  var STATS = [['atk', 'ATK'], ['def', 'DEF'], ['hp', 'HP']];
  var KIT = 'assets/ui2/kit/frog/';
  var INSECT = { ATK: 'insect/butterfly-red', DEF: 'insect/firefly-blue', HP: 'insect/dragonfly-green' };
  var esc = function (v) { return KitUI.esc(String(v == null ? '' : v)); };
                                                                           
  var arg = function (v) { return esc(JSON.stringify(v)); };
  var K = function () { return g.KitUI; };
                                                                                        

                                                                            
  function header(title, sub, back, backLabel, right) {
    return '<div class="fi-top">'
      + '<button type="button" class="fi-close" onclick="' + back + '" aria-label="' + esc(backLabel) + '">‹</button>'
      + '<div class="fi-titles">' + title + (sub ? '<div class="fi-sub">' + sub + '</div>' : '') + '</div>'
      + (right || '') + '</div>';
  }

                                                                             
  function traitArt(t) {
    return K().art(t.path, { size: 54, aura: t.slot === 'aura', fill: 0.78, onerror: 'frogImgError(this)' });
  }
                                                                              
                                                 
  function lockBadge(f, slot) {
    if (f.locked && f.locked[slot]) {
      return '<span class="fi-lockpill fi-locked" aria-label="Locked">' + K().icon('ui/lock-closed', { size: 18, alt: '' }) + '</span>';
    }
    if (!FT.canLock(slot)) return '';
    var cost = FT.lockCost(f, slot);
    if (!cost) return '<span class="fi-lockpill" aria-label="Lock for free">' + K().icon('ui/lock-open', { size: 18, alt: '' }) + '<b>FREE</b></span>';
    return '<span class="fi-lockpill" aria-label="Lock for ' + cost + ' bones">' + K().icon('ui/lock-open', { size: 18, alt: '' })
      + curIcon('bones') + '<b>' + cost + '</b></span>';
  }
  function traitHTML(f, slot) {
    var t = FT.traitDef(f.traits[slot]);
    var cls = 'fi-trait fi-' + slot;
    if (!t) {
      return '<button type="button" class="' + cls + ' fi-empty kit-traittile is-missing" disabled aria-label="' + esc(slot.toUpperCase() + ': empty') + '">'
        + '<span class="kit-art fi-empty-art" style="width:54px;height:54px">+</span>'
        + '<b class="kit-traittile__name">' + slot.toUpperCase() + '</b><span class="fi-trait-stat">No trait yet</span></button>';
    }
    var b = g.GrimoireUI ? GrimoireUI.traitBoost(t) : null;
    var lock = lockBadge(f, slot);
    return K().traitTile({
      found: true, rarity: g.GrimoireUI ? GrimoireUI.traitTier(t.r) : 'common', artHTML: traitArt(t), name: t.n,
      boost: b ? { iconHTML: statIcon(b.kind), text: b.label } : null, badgeHTML: lock,
      onclick: 'traitRowTap(' + arg(f.id) + ',' + arg(slot) + ')',
      ariaLabel: slot.toUpperCase() + ': ' + t.n + '. Manage trait', className: cls + (_traitOpen.frog === f.id && _traitOpen.slot === slot ? ' is-open' : '')
    });
  }

  function traitActionsHTML(f) {
    if (_traitOpen.frog !== f.id || !f.traits[_traitOpen.slot]) return '';
    var slot = _traitOpen.slot, t = FT.traitDef(f.traits[slot]);
                                                                                             
    if (FT.ascendedOf(f)) return '<section class="fi-sec fi-trait-actions"><b>' + esc(t.n) + '</b><div><span class="fi-hint">Ascended: its traits are final</span></div></section>';
    var locked = f.locked && f.locked[slot];
    var lockClick = 'toggleTraitLock(' + JSON.stringify(f.id) + ',' + JSON.stringify(slot) + ')';
    var lock = !FT.canLock(slot) ? '<span class="fi-hint">Aura cannot be locked</span>' : locked
      ? KitUI.button({tone:'gold', size:'sm', label:'🔒 Unlock', onclick:esc(lockClick)})
      : !FT.lockCost(f, slot) ? KitUI.button({tone:'gold', size:'sm', label:'Lock · Free', onclick:esc(lockClick)})                                 
      : KitUI.priceButton({tone:'gold', size:'sm', need:FT.lockCost(f, slot), have:state.bones || 0,
          priceIconHTML:curIcon('bones'), label:'Lock', onclick:esc(lockClick)});
    return '<section class="fi-sec fi-trait-actions"><b>' + esc(t.n) + '</b><div>' + lock
      + KitUI.priceButton({tone:'gold', size:'sm', need:FT.rerollCost(f, slot), have:state.gems || 0,
          priceIconHTML:curIcon('gems'), label:'Reroll', onclick:esc('rerollTrait(' + JSON.stringify(f.id) + ',' + JSON.stringify(slot) + ')')})
      + '</div></section>';
  }

                                                                             
  function statsHTML(f) {
    var total = frogStats(f), withoutFlowers = frogStats(f, {withoutFlowers:true});
                                                                                            
    var wound = g.FrogWounds ? FrogWounds.hpOf(f, total.hp) : { hurt: false };
    return STATS.map(function (s) {
      var d = total[s[0]] - withoutFlowers[s[0]], note = d ? '+' + d + ' flowers' : '';
      if (s[0] === 'hp' && wound.hurt) {
        return K().statCell({ stat: s[0], value: wound.hp + '/' + total.hp, label: s[1], iconHTML: statIcon(s[0]),
          note: FrogWounds.statusText(f), className: 'fi-stat fi-stat--wounded' });
      }
      return K().statCell({ stat: s[0], value: total[s[0]], label: s[1], iconHTML: statIcon(s[0]),
        note: note, className: 'fi-stat' });
    }).join('');
  }

                                                                            
  function gearRowOf(inst) { try { return Equipment.itemRow(inst.item_id); } catch (e) { return null; } }
  function gearArtHTML(row, size) {
    var src = row && g.GrimoireUI ? GrimoireUI.gearArt(row) : null;
    return K().art(src, { size: size, fill: 0.78, emoji: row ? Equipment.SLOT_META[Equipment.slotFor(row.item_type)].icon : '', onerror: 'frogImgError(this)' });
  }
  function usesLabel(inst) { return Math.max(0, inst.usesLeft || 0) + '/' + Math.max(1, inst.usesMax || 1) + ' uses'; }
  function usesPct(inst) { return Math.max(0, inst.usesLeft || 0) / Math.max(1, inst.usesMax || 1); }
  function firstBoost(row) {
    var b = row && g.GrimoireUI ? GrimoireUI.gearBoosts(row)[0] : null;
    return b ? { iconHTML: b.kind === 'atk' || b.kind === 'def' || b.kind === 'hp' ? statIcon(b.kind) : '', text: b.label } : null;
  }
  function slotWord(slot) { return slot === 'shield' ? 'SHIELD' : 'WEAPON'; }

                                                                             
  function gearShown(f) {
    return !g.UpgradesUI || UpgradesUI.introduced(state,'workshop');
  }

  function cellsHTML(f) {
    if(g.UpgradesUI && !UpgradesUI.introduced(state,'workshop')) return '';
    var cells = Equipment.SLOTS.map(function (slot) {
      var meta = Equipment.SLOT_META[slot];
      var worn = Equipment.equippedOn(state, f.id, slot), row = worn ? gearRowOf(worn) : null;
      var stock = Equipment.inventoryFor(state, slot).length;
                                                                                       
      if (!worn) {
        return K().equipCell({ state: 'empty', slot: slotWord(slot), emptyLabel: stock ? 'Tap to equip' : 'Tap to craft',
          onclick: "Equipment.UI.toggleRack('" + slot + "')", ariaLabel: meta.name, className: 'eq-cell' });
      }
      return K().equipCell({ state: 'equipped', rarity: row && g.GrimoireUI ? GrimoireUI.gearTier(row.rarity) : 'common', slot: slotWord(slot),
        artHTML: gearArtHTML(row, [77, 85]), name: row ? Equipment.UI.displayName(row) : worn.item_id, boost: firstBoost(row),
        durability: { pct: usesPct(worn), label: usesLabel(worn) },
        onclick: "Equipment.UI.toggleRack('" + slot + "')", ariaLabel: meta.name, className: 'eq-cell worn' });
    }).join('');
    return '<section class="fi-sec fi-gear"><div class="eq-cells">' + cells + '</div></section>';
  }

                                                                               
                                                                            
                                                                            
                                                                            
                                       
  function pickerHTML(f, slot) {
    var meta = Equipment.SLOT_META[slot], word = slot === 'shield' ? 'Shield' : 'Sword';
    var worn = Equipment.equippedOn(state, f.id, slot), row = worn ? gearRowOf(worn) : null;
    var fresh = Equipment.UI.freshId();
    var spares = Equipment.inventoryFor(state, slot).slice().sort(function (a, b) { return (b.id === fresh) - (a.id === fresh); });
    var freshRow = spares[0] && spares[0].id === fresh ? gearRowOf(spares[0]) : null;
    var wearing = '<section class="fi-wearing eq-rack">'
      + '<div class="fi-wearing__head"><b>' + word + ' slot</b>' + (worn ? '<span class="fi-badge">Equipped</span>' : '') + '</div>'
      + (worn
        ? '<div class="fi-wearing__item"><span class="fi-wearing__art kit-tone--' + (row ? GrimoireUI.gearTier(row.rarity) : 'common') + '">' + gearArtHTML(row, 72) + '</span>'
          + '<span class="fi-wearing__info"><b>' + esc(row ? Equipment.UI.displayName(row) : worn.item_id) + '</b>'
            + '<span class="fi-wearing__pills">' + (firstBoost(row) ? K().boostPill({ size: 'md', text: firstBoost(row).text, iconHTML: firstBoost(row).iconHTML, className: 'fi-wearing__boost' }) : '') + '</span>'
            + K().durabilityBar({ pct: usesPct(worn), label: usesLabel(worn), className: 'fi-wearing__dur' }) + '</span></div>'
                                                                                 
          + '<div class="eq-pick on fi-takeoff-wrap">' + KitUI.button({ tone: 'gold', size: 'md', className: 'fi-takeoff', label: 'Take off',
              onclick: esc('Equipment.UI.equipFromRack(' + JSON.stringify(f.id) + ',' + JSON.stringify(slot) + ',' + JSON.stringify(worn.id) + ')') }) + '</div>'
        : '<p class="fi-wearing__empty">' + (freshRow ? 'Tap your new ' + esc(Equipment.UI.displayName(freshRow)) + ' to equip it!' : 'Nothing in this slot yet — pick a spare below or craft one.') + '</p>')
      + '</section>';
    var picks = spares.map(function (inst) {
      var r = gearRowOf(inst), isNew = inst.id === fresh;
      return K().equipCell({ state: 'equipped', rarity: r ? GrimoireUI.gearTier(r.rarity) : 'common', slot: word,
        artHTML: gearArtHTML(r, [77, 85]), name: r ? Equipment.UI.displayName(r) : inst.item_id, boost: firstBoost(r),
        durability: { pct: usesPct(inst), label: usesLabel(inst) }, note: isNew ? 'NEW!' : '',
        onclick: esc('Equipment.UI.equipFromRack(' + JSON.stringify(f.id) + ',' + JSON.stringify(slot) + ',' + JSON.stringify(inst.id) + ')'),
        ariaLabel: 'Equip ' + (r ? Equipment.UI.displayName(r) : inst.item_id), className: 'eq-pick' + (isNew ? ' fi-pick--new' : '') });
    }).join('');
    var blueprints = Equipment.slotBlueprintTotal(state, slot);                                                         
                                                                               
    picks += K().equipCell({ state: 'empty', slot: 'Craft gear', emptyLabel: blueprints + (blueprints === 1 ? ' blueprint' : ' blueprints'),
      onclick: esc("Equipment.UI.openConvert('" + slot + "','" + f.id + "')"), ariaLabel: 'Craft a ' + meta.name, className: 'eq-pick eq-craft' });
    return header('<h2 class="fi-name">' + esc(word.toUpperCase()) + '</h2>', 'for ' + esc(frogDisplayName(f)),
        "Equipment.UI.toggleRack('" + slot + "')", 'Back to ' + frogDisplayName(f))
      + '<div class="fi-body">' + wearing + '<div class="fi-picks" data-slot="' + slot + '">' + picks + '</div></div>';
  }

                                                                             
  function familyHTML(f) {
    var fam = FT.familyOf(f); if (!fam || fam.ftue) return '';
    var pct = FrogStats.familyBonusPctForMatchedFamily(fam);
    var ability = g.CombatLive && CombatLive.familyAbilityInfo ? CombatLive.familyAbilityInfo(fam.id) : null;
    var icon = ability ? '<img src="' + ability.icon + '" alt="" draggable="false">'
      : '<span>' + ((typeof FAMILY_ICON !== 'undefined' && FAMILY_ICON[fam.id]) || '✨') + '</span>';
                                                                        
                                                                              
    return '<section class="fi-sec fi-family"' + (ability ? ' title="' + esc(ability.name + ': ' + ability.text) + '"' : '') + '><span class="fi-family-art">' + icon + '</span><span class="fi-family__txt">'
      + '<b>' + esc(ability ? ability.name : fam.n + ' family') + '</b>'
      + '<small>' + (ability ? esc(ability.short) + ' · ' : '') + '+' + Math.round(pct * 100) + '% ATK · DEF · HP</small>'
      + '</span></section>';
  }

                                                                               
                                                                            
                                                                           
                                                                         
                                                                              
                                                                       
  var FILL_MS = 560, FILL_GAP_MS = 420;
  var _fills = { frog: null, at: {} };                                                           
  function fillDelays(f, views, now, live) {
    var buffs = (state.frogFlowerBuffs && state.frogFlowerBuffs[f.id]) || [];
    var keys = views.map(function (v, i) { var b = !v.empty && buffs[i]; return b ? i + ':' + b.flowerId + ':' + b.grantedAt : null; });
    var known = _fills.frog === f.id, prev = known ? _fills.at : {}, at = {}, next = now;
    Object.keys(prev).forEach(function (k) { if (prev[k] != null) next = Math.max(next, prev[k] + FILL_GAP_MS); });
    keys.forEach(function (k) {
      if (!k) return;
      if (k in prev) at[k] = prev[k];
      else if (live && known) { at[k] = next; next += FILL_GAP_MS; }
      else at[k] = null;
    });
    _fills = { frog: f.id, at: at };
    return keys.map(function (k) { return k && at[k] != null && now < at[k] + FILL_MS ? at[k] - now : null; });
  }
                                                                           
                                                                                
  function mainStat(v) {
    var s = !v.empty && v.parts && v.parts[0] ? v.parts[0].stat : '';
    return s === 'atk' || s === 'def' || s === 'hp' ? s : 'atk';
  }
                                                                              
  function buffTag(cls, delay) {
    return '<div class="' + cls + (delay == null ? '">' : ' fi-buff-new" style="--fi-fill-delay:' + Math.round(delay) + 'ms">');
  }
  function buffsHTML(f, now, live) {
    var views = Flowers.frogBuffSlotsView(state.frogFlowerBuffs, f.id, frogBodySize(f), now);
    var delays = fillDelays(f, views, now, live);
    var cells = views.map(function (v, i) {
      var stat = mainStat(v);
                                                                                       
      var art = !v.empty ? K().ART[INSECT[stat.toUpperCase()]] : null;
      return buffTag('fi-buff' + (v.empty ? ' fi-buff-empty' : ' fi-buff--' + stat), delays[i])
        + '<span class="fi-buff-art">'
          + (art ? '<img src="' + esc(art) + '" alt="' + esc(v.flowerId) + '">'
                 : '<img class="fi-buff-ghost" src="' + KIT + 'snack-empty-insect.png" alt="" aria-label="Empty flower buff slot">') + '</span>'
        + '<small>' + (v.empty ? 'empty' : Flowers.fmtMMSS(v.expiresInS)) + '</small></div>';
    }).join('');
    var lines = views.map(function (v, i) {
      if (v.empty) return '';
      return buffTag('fi-buff-line fi-buff--' + mainStat(v), delays[i]) + K().boostPill({ size: 'md', iconHTML: statIcon(mainStat(v)),
        text: v.parts.map(function (p) { return p.formattedValue + ' ' + p.label; }).join(' · ') }) + '</div>';
    }).join('');
    var total = Flowers.statBoost(state.frogFlowerBuffs, f.id, now);
    var totalLabel = STATS.filter(function (s) { return total[s[0]]; }).map(function (s) {
      return '+' + total[s[0]] + ' ' + s[1];
    }).join(' · ');
    return '<div class="fi-buff-slots">' + cells + '</div><div class="fi-buff-summary">'
      + (lines || '<span class="fi-hint">Sit on a flower<br>to earn buffs</span>')
      + (totalLabel && lines ? '<small class="fi-buff-total">Total ' + esc(totalLabel) + '</small>' : '')
      + (views.some(function(v){return v.paused;}) ? '<small>Paused while seated</small>' : '') + '</div>';
  }

                                                                                    
                                                          
  function buffsSectionHTML(f) {
    var now = Date.now(), held = Flowers.statBoost(state.frogFlowerBuffs, f.id, now);
    if (g.FtueSteps && FtueSteps.flowersPaused() && !(held.atk || held.def || held.hp)) return '';
    return '<section class="fi-sec fi-buffs" id="flower-buff-rows" aria-label="Flower buffs">' + buffsHTML(f, now) + '</section>';
  }

                                                                               
                                                                           
                                                          
  function isPopup(f) {
    return !(typeof activeSheet !== 'undefined' && activeSheet === 'grimoire') && !(f && Equipment.UI.rackOpenFor(f));
  }
  function heroHTML(f) {
    return '<div class="fi-portrait-grid"><span class="fi-glow" aria-hidden="true"></span>'
      + traitHTML(f, 'head') + traitHTML(f, 'aura')
      + '<div class="fi-portrait">' + frogArtHTML(f, 140) + '</div>'
      + traitHTML(f, 'mouth') + traitHTML(f, 'back') + '</div>';
  }
                                                                                
  function sacrificeButton(f, size, label) {
    var n = sacrificeBones(f);
    return KitUI.button({tone:'danger', size:size, className:'fi-sacrifice', ariaLabel:'Sacrifice for ' + n + ' bones',
      html:esc(label) + ' <span class="fi-sac-pay">' + curIcon('bones') + '+' + n + '</span>',
      onclick:esc('sacrificeFromInspect(' + JSON.stringify(f.id) + ')')});
  }
  function workButton(f, busy, size) {
                                                                                  
    return g.Harvest && (typeof harvestingUnlocked !== 'function' || harvestingUnlocked()) ? KitUI.button({tone:'green', size:size, label:busy ? (size === 'lg' ? 'Already at work or away' : 'Working') : 'Send to work',
      disabled:busy, onclick:esc('FrogInspect.toggleWork(' + JSON.stringify(f.id) + ')'), className:'fi-work'}) : '';
  }
  function sacrificeUnlocked() {
                                                                               
    var seen = state.ftueTooltips && state.ftueTooltips.seen || {};
    return !!(state.ftueDone || state.ftueLoop > 5 || seen['tooltip-4b'] || seen['tooltip-goal-lock'] || seen['tooltip-lock-safety']);
  }
  function popupHTML(f) {
    var busy = g.Harvest && Harvest.isBusy(f.id);
    var codex = typeof grimoireUnlocked !== 'function' || grimoireUnlocked();
    return '<h2 class="fi-name fi-pop-title" id="fi-name">' + esc(frogDisplayName(f)) + '</h2>'
      + K().closeButton({ onclick: 'dismissLaborWindow()', ariaLabel: 'Close frog details', className: 'fi-close' })
      + '<div class="fi-body">' + heroHTML(f) + traitActionsHTML(f)
        + '<section class="fi-sec fi-combat"><div class="fi-stats" id="fi-live-stats">' + statsHTML(f) + '</div></section>'
        + cellsHTML(f)
        + buffsSectionHTML(f)
      + '</div>'
      + '<div class="fi-actions fi-pop-actions">'
        + (codex ? KitUI.button({tone:'violet', size:'sm', label:'Grimoire', iconHTML:K().icon('nav/grimoire', { size: 20, alt: '' }),
            onclick:esc('FrogInspect.openInCodex(' + JSON.stringify(f.id) + ')'), className:'fi-codex'}) : '')
        + workButton(f, busy, 'sm')
        + (sacrificeUnlocked() ? sacrificeButton(f, 'sm', 'Sacrifice') : '')
      + '</div><div id="fi-work-picker"></div>';
  }
                                                                        
  function openInCodex(frogId) {
    dismissLaborWindow();
    if (typeof grimSetTab === 'function') grimTab = 'frogs';
    openSheet('grimoire');
    showArmorWindow(frogId);
  }

                                                                              
  function html(f) {
    FT.adopt(f);
    var openSlot = Equipment.UI.rackOpenFor(f);
    if (openSlot) return pickerHTML(f, openSlot);
    if (isPopup(f)) return popupHTML(f);
    var busy = g.Harvest && Harvest.isBusy(f.id);
    var name = frogDisplayName(f);
    var title = '<div class="fi-titlerow"><h2 class="fi-name" id="fi-name">' + esc(name) + '</h2>'
      + K().renameButton(esc('FrogInspect.rename(' + JSON.stringify(f.id) + ')'), 'Rename ' + name) + '</div>';
    var sub = '<span class="fi-level">Level ' + FrogStats.frogLevelForBodySize(frogBodySize(f)) + '</span>' + (busy ? ' · Working' : ' · Idle');
    return header(title, sub, 'dismissLaborWindow()', 'Close frog details')
      + '<div class="fi-body">'
        + heroHTML(f)
        + traitActionsHTML(f)
        + '<section class="fi-sec fi-combat"><div class="fi-stats" id="fi-live-stats">' + statsHTML(f) + '</div></section>'
        + cellsHTML(f)
        + familyHTML(f)
        + buffsSectionHTML(f)
        + '<div class="fi-actions">' + workButton(f, busy, 'lg')
          + '<div id="fi-work-picker"></div>'
          + (sacrificeUnlocked() ? sacrificeButton(f, 'lg', 'Sacrifice for') : '') + '</div>'
      + '</div>';
  }

  function refresh(win, f) {
    var rows = win.querySelector('#flower-buff-rows'), live = win.querySelector('#fi-live-stats');
    if (rows) rows.innerHTML = buffsHTML(f, Date.now(), true);
    if (live) live.innerHTML = statsHTML(f);
  }

                                                                           
  function rename(frogId) {
    var f = state.frogs.find(function (x) { return x.id === frogId; }), title = document.getElementById('fi-name');
    if (!f || !title) return;
    var input = document.createElement('input');
    input.className = 'fi-rename'; input.value = frogDisplayName(f); input.maxLength = 24; input.setAttribute('aria-label', 'Frog name');
    title.replaceWith(input); input.focus(); input.select();
    var done = false;
    var commit = function (save) {
      if (done) return; done = true;
      if (save) setFrogName(frogId, input.value);
      if (typeof _refreshInspect === 'function') _refreshInspect();
    };
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') commit(true); else if (e.key === 'Escape') commit(false); });
    input.addEventListener('blur', function () { commit(true); });
  }

  function toggleWork(frogId) {
    var host = document.getElementById('fi-work-picker'); if (!host) return;
    if (host.innerHTML) { host.innerHTML = ''; return; }
    try {
      host.innerHTML = FPConfig.rows('Harvesting').map(function (job) {
        return KitUI.button({tone:'gold', size:'sm', label:'Gather ' + job.resource,
          onclick:esc('FrogInspect.sendToWork(' + JSON.stringify(frogId) + ',' + JSON.stringify(job.job_id) + ')')});
      }).join('');
    } catch (e) { showToast(e.message); }
  }
  function sendToWork(frogId, jobId) {
    Harvest.pickFrog(jobId, frogId);
    if (Harvest.isBusy(frogId)) dismissLaborWindow();
  }
  g.FrogInspect = {html:html, refresh:refresh, toggleWork:toggleWork, sendToWork:sendToWork, rename:rename, isPopup:isPopup, openInCodex:openInCodex, gearShown:gearShown};
})(window);
