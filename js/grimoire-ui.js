                                                                                 
  
                                                                         
                                                                       
                                                                        
                                       
  
                                                                            
                                                                             
                                                                              
                                                                               
                                                                             
  
                                                                              
                                                                             
                                                                          
            
   
(function (g) {
  'use strict';
  var ART = 'assets/ui2/grimoire/';
  var esc = function (v) { return KitUI.esc(String(v == null ? '' : v)); };
                                                                           
  var arg = function (v) { return esc(JSON.stringify(v)); };

  var TABS = [['frogs', 'Frogs'], ['traits', 'Traits'], ['equipment', 'Gear'], ['families', 'Families']];
  var TIERS = ['common', 'rare', 'epic', 'legendary'];

                                                                             
                                                                            
                                                                          
                                                                             
                                                           
  function traitTier(r) { return (FrogStats.CODE_TO_SHEET_RARITY || {})[r] || 'common'; }
  function gearTier(r) { return TIERS.indexOf(r) >= 0 ? r : 'common'; }

                                                                           

  function iconFor(kind) {
    if (kind === 'atk' || kind === 'def' || kind === 'hp') return statIcon(kind);
    if (kind === 'wood') return curIcon('mat');
    if (kind === 'stone') return curIcon('rock');
    return '';
  }
                                                                
  function boostPill(b) {
    return b ? KitUI.boostPill({ size: 'sm', iconHTML: iconFor(b.kind), text: b.label }) : '';
  }
                                                                              
  function traitBoost(t) {
    var b = FrogStats.traitBoostForCatalogTrait(t), best = null;
    ['atk', 'def', 'hp'].forEach(function (k) {
      if (b[k] && (!best || Math.abs(b[k]) > Math.abs(b[best]))) best = k;
    });
    return best ? { kind: best, label: (b[best] > 0 ? '+' : '') + b[best] + ' ' + best.toUpperCase() } : null;
  }
  var GEAR_STATS = [['buff_attack', 'atk', 'ATK'], ['buff_defense', 'def', 'DEF'], ['buff_hp', 'hp', 'HP'],
                    ['buff_harvest_wood', 'wood', 'Wood'], ['buff_harvest_stone', 'stone', 'Stone']];
  function gearBoosts(row) {
    return GEAR_STATS.filter(function (s) { return row[s[0]]; }).map(function (s) {
      return { kind: s[1], label: '+' + Equipment.buffValue(row, s[0]) + ' ' + s[2] + (s[1]==='wood'||s[1]==='stone'?'/min':'') };
    });
  }
                                                                             
                                                                          
                                                                          
                                                                                  
  function gearArt(row) {
    return row ? Equipment.UI.drawnArtSrc(row) : null;
  }

                                                                            
                                                                         
                                                
  function artHTML(src, opts) {
    opts = opts || {};
    return KitUI.art(src, { size: opts.size, sil: opts.sil, aura: opts.aura, fill: opts.fill || 0.8, emoji: opts.emoji || '?', onerror: 'frogImgError(this)' });
  }

  function sortButton(label, onclick) {
    return '<button type="button" class="gp-sort" onclick="' + onclick + '">⇅ Sort: ' + esc(label) + ' ▾</button>';
  }
  function cycle(list, key) {
    var i = list.findIndex(function (s) { return s.k === key; });
    return list[(i + 1) % list.length].k;
  }

                                                                           

  var FROG_SORTS = [
    { k: 'level',  n: 'Level',  v: function (f) { return FT.bodySizeOf(f); } },
    { k: 'merges', n: 'Merges', v: function (f) { return FT.mergesOf(f); } },
    { k: 'atk',    n: 'ATK',    v: function (f) { return frogStats(f).atk; } },
    { k: 'def',    n: 'DEF',    v: function (f) { return frogStats(f).def; } },
    { k: 'hp',     n: 'HP',     v: function (f) { return frogStats(f).hp; } }
  ];
  var _frogSort = 'level';
  function cycleFrogSort() { _frogSort = cycle(FROG_SORTS, _frogSort); renderKeepSheetScroll(); }

                                                                            
                                                                             
                                                                            
  function frogCard(f) {
    FT.adopt(f);
    var s = frogStats(f), body = FT.bodyOf(f);
    var fam = body && body.family ? FT.familyDefOf(body.family) : null;
    var busy = !!(g.Harvest && Harvest.isBusy && Harvest.isBusy(f.id));
    var locked = FT.SLOTS.some(function (sl) { return f.locked && f.locked[sl]; });
    var name = frogDisplayName(f);
    return KitUI.frogCard({
      band: name, tone: fam ? traitTier(fam.r) : 'none', state: busy ? 'working' : locked ? 'locked' : 'idle',
      artHTML: frogArtHTML(f, 96), lockLabel: 'Has a locked trait',
      stats: ['atk', 'def', 'hp'].map(function (k) { return { kind: k, value: s[k], iconHTML: statIcon(k) }; }),
      onclick: 'showArmorWindow(' + arg(f.id) + ')', ariaLabel: name + (busy ? ', working' : ''), className: 'gr-card'
    });
  }
  function frogsTab() {
    var sort = FROG_SORTS.find(function (x) { return x.k === _frogSort; }) || FROG_SORTS[0];
    var frogs = state.frogs.slice().sort(function (a, b) { return sort.v(b) - sort.v(a); });
    var n = frogs.length;
    var bar = '<div class="gp-bar">' + sortButton(sort.n, 'GrimoireUI.cycleFrogSort()')
      + '<span class="gp-count">' + n + ' frog' + (n === 1 ? '' : 's') + '</span></div>';
    if (!n) return bar + '<div class="gp-empty">No frogs yet — hatch one to start the collection.</div>';
    return bar + '<div class="gp-grid gp-grid--frogs">' + frogs.map(frogCard).join('') + '</div>';
  }

                                                                           

  var SLOT_ART = { head: 'tab_head.png', mouth: 'tab_mouth.png', back: 'tab_back.png', aura: 'tab_aura.png',
                   weapon: 'tab_sword.png', shield: 'tab_shield.png' };
  var SLOT_NAME = { head: 'Head', mouth: 'Mouth', back: 'Back', aura: 'Aura', weapon: 'Sword', shield: 'Shield' };
                                                                          
                                   
  function slotTabs(slots, active, setter, cls) {
    return '<div class="gp-itabs ' + cls + '">' + slots.map(function (k) {
      var on = k === active;
      return '<button type="button" class="gp-itab' + (on ? ' on' : '') + '" data-slot="' + esc(k) + '" onclick="GrimoireUI.' + setter + '(' + arg(k) + ')"'
        + ' aria-pressed="' + on + '" aria-label="' + esc(SLOT_NAME[k]) + '"><img src="' + ART + SLOT_ART[k] + '" alt="" draggable="false"></button>';
    }).join('') + '</div>';
  }

  var TRAIT_SORTS = [
    { k: 'rarity', n: 'Rarity', v: function (t) { return FrogStats.rarityRank(traitTier(t.r)); } },
    { k: 'name',   n: 'Name',   v: null }
  ];
  var _traitSlot = 'head', _traitSort = 'rarity';
  function setTraitSlot(slot) { _traitSlot = slot; renderKeepSheetScroll(); }
  function cycleTraitSort() { _traitSort = cycle(TRAIT_SORTS, _traitSort); renderKeepSheetScroll(); }
  function traitPool(slot) {
    return FT.accessiblePool(slot, FT.SETS.map(function (s) { return s.id; }), []);
  }
                                                                             
  function sortTraits(pool) {
    var sort = TRAIT_SORTS.find(function (x) { return x.k === _traitSort; }) || TRAIT_SORTS[0];
    return pool.map(function (t, i) { return { t: t, i: i, found: grimSeen(t.k) }; }).sort(function (a, b) {
      if (a.found !== b.found) return a.found ? -1 : 1;
      if (sort.v) { var d = sort.v(b.t) - sort.v(a.t); if (d) return d; }
      else { var c = a.t.n.localeCompare(b.t.n); if (c) return c; }
      return a.i - b.i;
    });
  }
  function traitTile(t, found) {
    return KitUI.traitTile({
      rarity: traitTier(t.r), found: found, name: t.n, boost: found ? traitBoostChip(t) : null,
      artHTML: artHTML(t.path, { size: 54, sil: !found, aura: t.slot === 'aura', fill: 0.78 }),
      onclick: found ? 'GrimoireUI.openTrait(' + arg(t.k) + ')' : '', ariaLabel: found ? t.n : 'Undiscovered ' + traitTier(t.r) + ' trait'
    });
  }
  function traitBoostChip(t) { var b = traitBoost(t); return b ? { iconHTML: iconFor(b.kind), text: b.label } : null; }
  function traitsTab() {
    var pool = traitPool(_traitSlot), list = sortTraits(pool);
    var found = list.filter(function (x) { return x.found; }).length;
    var sort = TRAIT_SORTS.find(function (x) { return x.k === _traitSort; }) || TRAIT_SORTS[0];
    return slotTabs(FT.SLOTS, _traitSlot, 'setTraitSlot', 'gp-itabs--traits')
      + '<div class="gp-bar">' + sortButton(sort.n, 'GrimoireUI.cycleTraitSort()')
        + '<span class="gp-count">' + found + ' / ' + pool.length + ' found</span></div>'
      + '<div class="gp-grid gp-grid--tiles">' + list.map(function (x) { return traitTile(x.t, x.found); }).join('') + '</div>';
  }

                                                                           

  var _gearSlot = 'weapon';
  function setGearSlot(slot) { _gearSlot = slot; renderKeepSheetScroll(); }
                                                                             
                                                                           
                                                                                 
  function noteSeenGear() {
    var seen = state.seenGear || (state.seenGear = []), added = false, eq = Equipment.init(state);
    eq.items.map(function (it) { return it.item_id; }).concat(Object.keys(eq.pieceBlueprints)).forEach(function (id) {
      if (seen.indexOf(id) < 0) { seen.push(id); added = true; }
    });
    if (added && typeof queueSave === 'function') queueSave();
    return seen;
  }
                                                                             
  function durabilityBar(inst, tone) {
    var max = Math.max(1, inst.usesMax || 1), left = Math.max(0, Math.min(max, inst.usesLeft || 0));
    return KitUI.durabilityBar({ pct: left / max, label: left + '/' + max, tone: tone || 'ink', ariaLabel: left + ' of ' + max + ' uses left' });
  }
  function slotIcon(row) { return Equipment.SLOT_META[Equipment.slotFor(row.item_type)].icon; }
  function gearCell(row, inst) {
    var b = gearBoosts(row)[0];
    return KitUI.equipCell({
      state: 'equipped', rarity: gearTier(row.rarity), slot: row.item_type, name: Equipment.UI.displayName(row),
      artHTML: artHTML(gearArt(row), { size: [77, 85], emoji: slotIcon(row), fill: 0.72 }),
      boost: b ? { iconHTML: iconFor(b.kind), text: b.label } : null,
      durability: inst ? { pct: Math.max(0, inst.usesLeft || 0) / Math.max(1, inst.usesMax || 1), label: (inst.usesLeft || 0) + '/' + (inst.usesMax || 1) } : null,
      note: inst ? '' : Equipment.pieceBlueprintCount(state, row.item_id) ? 'Blueprint' : 'None left', onclick: 'GrimoireUI.openGear(' + arg(row.item_id) + ')', ariaLabel: Equipment.UI.displayName(row)
    });
  }
  function missingCell(row) {
    return KitUI.equipCell({ state: 'missing', rarity: gearTier(row.rarity), slot: row.item_type,
      artHTML: artHTML(gearArt(row), { size: [77, 85], sil: true, emoji: slotIcon(row), fill: 0.72 }) });
  }
  function gearTab() {
    var slot = _gearSlot, type = slot === 'shield' ? 'shield' : 'sword';
    var rows = Equipment.catalog(type), seen = noteSeenGear();
    var copies = Equipment.init(state).items.filter(function (it) { return it.slot === slot; });
    var rank = function (r) { return TIERS.indexOf(gearTier(r.rarity)); };
    var owned = copies.map(function (inst) {
      var row = rows.find(function (r) { return r.item_id === inst.item_id; });
      return row ? { row: row, inst: inst } : null;
    }).filter(Boolean).sort(function (a, b) {
      return rank(b.row) - rank(a.row) || (b.inst.usesLeft || 0) - (a.inst.usesLeft || 0);
    });
    var ownedIds = owned.map(function (x) { return x.row.item_id; });
    var gone = rows.filter(function (r) { return seen.indexOf(r.item_id) >= 0 && ownedIds.indexOf(r.item_id) < 0; });
    var unseen = rows.filter(function (r) { return seen.indexOf(r.item_id) < 0; })
      .sort(function (a, b) { return rank(a) - rank(b); });
    var found = rows.length - unseen.length;
    return slotTabs(Equipment.SLOTS, slot, 'setGearSlot', 'gp-itabs--gear')
      + '<div class="gp-bar"><span class="gp-count gp-count--grow">' + found + ' / ' + rows.length + ' seen</span>'
        + KitUI.button({ tone: 'gold', size: 'tag', className: 'gp-craft', onclick: esc('Equipment.UI.openConvert(' + JSON.stringify(slot) + ')'),
            ariaLabel: 'Craft a ' + SLOT_NAME[slot], html: '<img src="' + ART + 'icon_hammer.png" alt="">Craft' })
      + '</div>'
      + '<div class="gp-grid gp-grid--gear">'
        + owned.map(function (x) { return gearCell(x.row, x.inst); }).join('')
        + gone.map(function (r) { return gearCell(r, null); }).join('')
        + unseen.map(missingCell).join('')
      + '</div>';
  }

                                                                            

                                                                            
                                                                           
                                                                          
                                                                            
                                                                 
  function visibleTabs() {
    if (typeof FtueSteps !== 'undefined' && FtueSteps.gearIntroduced && !FtueSteps.gearIntroduced(state))
      return TABS.filter(function (t) { return t[0] !== 'equipment'; });
    return TABS;
  }
  function tabsHTML(active) {
    return '<div class="gp-ftabs" role="tablist">' + visibleTabs().map(function (t) {
      var on = active === t[0];
                                                                            
      var dot = (t[0] === 'families' && familyRewardWaiting()) ? '<span class="gr-tab-dot"></span>' : '';
      return '<button type="button" role="tab" aria-selected="' + on + '" class="gr-tab gp-ftab' + (on ? ' on' : '') + '"'
        + ' onclick="grimSetTab(\'' + t[0] + '\')">' + t[1] + dot + '</button>';
    }).join('') + '</div>';
  }
  function bodyHTML(tab) {
    if (tab === 'traits') return traitsTab();
    if (tab === 'equipment') return gearTab();
    if (tab === 'families') return '<div class="gp-families">' + grimFamiliesHTML() + '</div>';
    return frogsTab();
  }
  function render() {
                                                                             
    if (typeof document !== 'undefined' && !document.querySelector('.gp-page')) _detail = null;
                                                                                 
    setTimeout(function () { var p = document.querySelector('.gp-page'); if (p) fitAllTraitThumbs(p); }, 0);
    if (_detail) { var page = detailHTML(_detail); if (page) return page; _detail = null; }
    var tabs = visibleTabs();
    var tab = tabs.some(function (t) { return t[0] === grimTab; }) ? grimTab : 'frogs';
    return '<div class="gp-page" role="region" aria-label="Codex"><div class="gp-folder">'
      + tabsHTML(tab)
      + '<div class="gp-sheet sheet-body' + (tab === TABS[0][0] ? ' gp-sheet--first' : '') + '" role="tabpanel">'
        + bodyHTML(tab)
      + '</div></div></div>';
  }

                                                                          
                                                                     
                                                                             
  function hud() {
    return '<div class="hud-top gp-hud"><div class="hud-rail">'
      + hudPill(hudIcon('currency', 'bone', curEmoji('bones')), Math.floor(state.bones || 0), 0, 'bone', null, null, 'bones-val')
      + (tutVisible('gemPill') ? hudPill(hudIcon('currency', 'bluediamond', curEmoji('gems')), state.gems || 0, 0, 'gem', shopPlus(), null, 'gems-val') : '')
      + '<button type="button" class="hud-cog gp-cog" onclick="SettingsUI.open()" aria-label="Settings">'
        + '<img src="' + ART + 'btn_settings.png" alt="" draggable="false"></button>'
      + '</div></div>';
  }

                                                                      
                                                                            
                                                                           
                                               
  var _detail = null;
  function openDetail(d) {
    _detail = d; render_();
    var sb = document.querySelector('.gp-page .sheet-body'); if (sb) sb.scrollTop = 0;
  }
  function back() { _detail = null; render_(); }
  function render_() { if (typeof g.render === 'function') g.render(); }
  function openTrait(key) { if (FT.traitDef(key)) openDetail({ kind: 'trait', key: key }); }
  function openGear(itemId) { openDetail({ kind: 'gear', id: itemId }); }

  var STAT_NAME = { atk: 'Attack', def: 'Defense', hp: 'Health', wood: 'Wood', stone: 'Stone' };
  var SLOT_WORD = { head: 'head', mouth: 'mouth', back: 'back', aura: 'aura' };

  function detailPage(title, body) {
    return '<div class="gp-page gp-page--detail" role="region" aria-label="' + esc(title) + '">'
      + '<div class="gp-dhead"><button type="button" class="gp-back" onclick="GrimoireUI.back()" aria-label="Back to the Codex">‹</button>'
        + '<h2 class="gp-dtitle">' + esc(title) + '</h2></div>'
      + '<div class="gp-dbody sheet-body">' + body + '</div></div>';
  }
                                                                          
  function hero(tier, art, sign, extra, opts) {
    opts = opts || {};
    var sparkles = [[21.8, 17, 26, 24, 0], [74.3, 13, 28, 26, 0.6], [78.7, 56, 20, 19, 1.2], [19.3, 65, 16, 15, 0.9]];
    return '<div class="gp-hero gp-hero--' + tier + (opts.gear ? ' gp-hero--gear' : '') + '">'
      + '<span class="gp-hero__burst" aria-hidden="true"></span>'
      + sparkles.map(function (s) {
          return '<span class="gp-sparkle" aria-hidden="true" style="left:' + s[0] + '%;top:' + s[1] + '%;width:' + s[2] + 'px;height:' + s[3] + 'px;animation-delay:' + s[4] + 's"></span>';
        }).join('')
      + '<span class="gp-hero__frame kit-tone--' + tier + '">' + art + '</span>'
      + '<span class="gp-sign">' + esc(sign) + '</span>' + (extra || '') + '</div>';
  }
  function section(tone, iconHTML, title, note, inner) {
    return '<section class="gp-sec">'
      + '<div class="gp-sec__head gp-sec__head--' + tone + '">' + (iconHTML || '') + '<b>' + esc(title) + '</b>'
        + (note ? '<span>' + esc(note) + '</span>' : '') + '</div>' + inner + '</section>';
  }
  function img(file, cls) { return '<img class="' + (cls || 'gp-ico') + '" src="' + ART + file + '" alt="" draggable="false">'; }
  function frogChip(f) {
    return '<span class="gp-chip">' + (f ? frogArtHTML(f, 46) : '') + '</span>';
  }
  function wearingRow(f, badge) {
    return '<button type="button" class="gp-row gp-row--frog" onclick="showArmorWindow(' + arg(f.id) + ')">'
      + frogChip(f) + '<b class="gp-row__name">' + esc(frogDisplayName(f)) + '</b>'
      + '<span class="gp-badge">' + esc(badge) + '</span><span class="gp-row__go" aria-hidden="true">›</span></button>';
  }

                               
  function traitDetail(key) {
    var t = FT.traitDef(key); if (!t) return '';
    var tier = traitTier(t.r), b = FrogStats.traitBoostForCatalogTrait(t), boost = traitBoost(t);
    var fam = typeof familyOfTraitKey === 'function' ? familyOfTraitKey(key) : null;
    var slotName = SLOT_WORD[t.slot] || t.slot;
    var lore = 'A ' + (FT.RARITY[t.r] ? FT.RARITY[t.r].name.toLowerCase() : '') + ' ' + slotName + ' trait'
      + (fam ? ' from the ' + fam.n + ' family.' : '.')
      + (boost ? ' Worn in the ' + slotName + ' slot it adds ' + boost.label + '.' : '');

    var rows = ['atk', 'def', 'hp'].filter(function (k) { return b[k]; }).map(function (k) {
      return '<div class="gp-row"><span class="gp-row__ico">' + statIcon(k) + '</span>'
        + '<span class="gp-row__txt"><b>' + STAT_NAME[k] + '</b><small>combat</small></span>'
        + '<span class="gp-val">' + (b[k] > 0 ? '+' : '') + b[k] + '</span></div>';
    }).join('') || '<div class="gp-row gp-row--note">No stat change.</div>';

    var wearers = state.frogs.filter(function (f) {
      return f.traits && FT.SLOTS.some(function (s) { return f.traits[s] === key; });
    });

    return detailPage(t.n,
      hero(tier, artHTML(t.path, { size: 100, aura: t.slot === 'aura', fill: 0.76 }), slotName.toUpperCase() + ' TRAIT')
      + '<div class="gp-lore"><span class="gp-lore__q" aria-hidden="true">❝</span><p>' + esc(lore) + '</p></div>'
      + section('green', statIcon(boost ? boost.kind : 'atk'), 'What it affects', '', rows)
      + (fam ? familySection(fam) : '')
      + section('violet', curIcon('tadpoles'), 'On your frogs', wearers.length + ' wearing it',
          wearers.length ? wearers.map(function (f) { return wearingRow(f, 'Wearing'); }).join('')
                         : '<div class="gp-row gp-row--note">No frog is wearing it right now.</div>'));
  }
  function familySection(fam) {
    var p = familyProgress(fam.id), claimed = familyClaimed(fam.id);
    var bySlot = {}; p.pool.forEach(function (q) { bySlot[q.slot] = q; });
    var pieces = FT.SLOTS.map(function (slot) {
      var q = bySlot[slot];
      if (!q) return '';
      var has = familyHasPiece(q.key);
      return '<span class="gp-piece' + (has ? ' on' : '') + '">' + artHTML(q.img, { size: 40, aura: slot === 'aura', fill: 0.86 })
        + '<i>' + slot.toUpperCase() + '</i></span>';
    }).join('');
    var stub = familyShowcaseFrog(fam.id);
    var body = '<span class="gp-piece gp-piece--body' + (claimed ? ' on' : '') + '"><span class="gp-piece__frog">' + (stub ? frogArtHTML(stub, 40) : '') + '</span><i>BODY</i></span>';
    var ability = g.CombatLive && CombatLive.familyAbilityInfo ? CombatLive.familyAbilityInfo(fam.id) : null;
    var abilityHTML = ability ? '<div class="gp-ability"><span class="gp-ability__ico"><img src="' + ability.icon + '" alt="" draggable="false"></span>'
        + '<span class="gp-ability__txt"><i>FAMILY ABILITY</i><b>' + esc(ability.name) + '</b>'
        + '<small>' + esc(ability.text) + '</small></span>'
        + '<span class="gp-unlock">' + (p.have >= p.need ? '✓' : img('icon_lock.png', 'gp-unlock__ico')) + p.have + '/' + p.need + '</span></div>' : '';
    var pct = FrogStats.familyBonusPctForMatchedFamily(fam);
    return section('pink', '<span class="gp-sec__frog">' + (stub ? frogArtHTML(stub, 26) : '') + '</span>', 'Family set', p.have + ' / ' + p.need + ' collected',
      '<div class="gp-pieces">' + pieces + body + '</div>' + abilityHTML
      + (pct ? '<div class="gp-setbonus"><span>Full set bonus</span><b>+' + Math.round(pct) + '% ATK · DEF · HP</b></div>' : ''));
  }

                                   
  function gearDetail(itemId) {
    var row; try { row = Equipment.itemRow(itemId); } catch (e) { return ''; }
    var tier = gearTier(row.rarity), name = Equipment.UI.displayName(row), slot = Equipment.slotFor(row.item_type);
    var copies = Equipment.init(state).items.filter(function (it) { return it.item_id === itemId; })
      .sort(function (a, b) { return (b.usesLeft || 0) - (a.usesLeft || 0); });
    var boosts = gearBoosts(row);
                                                                                             
    var piece = Equipment.UI.pieceDef ? Equipment.UI.pieceDef(row) : null, setId = piece && piece.set;
    var famName = setId ? piece.setName : row.family ? (FT.familyDefOf(row.family) || {}).n || row.family.charAt(0).toUpperCase() + row.family.slice(1) : 'Standard issue';
    var famArt = gearArt(row) ? artHTML(gearArt(row), { size: 36, fill: 0.9 }) : img('icon_hammer.png');
    var heroBar = copies.length ? '<span class="gp-hero__dur">' + durabilityBar(copies[0], 'hero') + '</span>' : '';

    var cells = boosts.map(function (b) {
      return KitUI.statCell({ compact: true, stat: b.kind, iconHTML: iconFor(b.kind),
        label: b.label.split(' ').slice(1).join(' ').toUpperCase(), value: b.label.split(' ')[0] });
    }).join('') || '<div class="gp-row gp-row--note">No stat change.</div>';

    var other = Equipment.catalog(row.item_type === 'shield' ? 'sword' : 'shield');
    var partner = setId
      ? other.filter(function (r) { var p = Equipment.UI.pieceDef(r); return p && p.set === setId; })[0] || null
      : row.family ? other.filter(function (r) { return r.family === row.family; })[0] : null;
    var owns = function (id) { return Equipment.init(state).items.some(function (it) { return it.item_id === id; }); };
    var pairCard = function (r, label) {
      var on = owns(r.item_id);
      return '<span class="gp-pair' + (on ? ' on' : '') + '">' + artHTML(gearArt(r), { size: 44, emoji: slotIcon(r), fill: 0.9 }) + '<i>' + esc(label) + '</i></span>';
    };
    var setHTML = partner ? section('pink', famArt, 'Family set', famName,
      '<div class="gp-combo">' + pairCard(row, owns(row.item_id) ? 'OWNED' : row.item_type.toUpperCase()) + '<b>+</b>'
        + pairCard(partner, owns(partner.item_id) ? 'OWNED' : partner.item_type.toUpperCase()) + '</div>'
      + '<p class="gp-sec__copy">' + esc(Equipment.UI.displayName(row) + ' and ' + Equipment.UI.displayName(partner) + ' are the ' + famName + ' pair.') + '</p>') : '';

    var copyRows = copies.map(function (inst) {
      var f = inst.equippedBy ? state.frogs.find(function (x) { return x.id === inst.equippedBy; }) : null;
      var left = Math.max(0, inst.usesLeft || 0), max = Math.max(1, inst.usesMax || 1);
      var inner = frogChip(f) + '<span class="gp-row__txt"><b>' + esc(f ? frogDisplayName(f) : 'In the bag') + '</b>'
        + '<small>' + left + ' of ' + max + ' uses left</small></span>' + durabilityBar(inst, 'muted');
      return f ? '<button type="button" class="gp-row gp-row--frog" onclick="showArmorWindow(' + arg(f.id) + ')">' + inner + '</button>'
               : '<div class="gp-row">' + inner + '</div>';
    }).join('');

    return detailPage(name,
      hero(tier, artHTML(gearArt(row), { size: 100, emoji: slotIcon(row), fill: 0.76 }), tier.toUpperCase() + ' ' + row.item_type.toUpperCase(), heroBar, { gear: true })
      + '<div class="gp-facts">'
        + '<span class="gp-fact gp-fact--slot"><span class="gp-fact__ico">' + img(SLOT_ART[slot]) + '</span><span><i>SLOT</i><b>' + esc(SLOT_NAME[slot]) + '</b></span></span>'
        + '<span class="gp-fact gp-fact--family"><span class="gp-fact__ico">' + famArt + '</span><span><i>FAMILY</i><b>' + esc(famName) + '</b></span></span>'
      + '</div>'
      + section('green', img('icon_power.png'), 'What it boosts', 'While equipped', '<div class="gp-statcells">' + cells + '</div>')
      + setHTML
      + section('violet', img('icon_backpack.png'), 'Your copies', copies.length + ' owned',
          copyRows || '<div class="gp-row gp-row--note">None left — craft another in the Workshop.</div>'));
  }

  function detailHTML(d) {
    if (d.kind === 'trait') return traitDetail(d.key);
    if (d.kind === 'gear') return gearDetail(d.id);
    return '';
  }

  g.GrimoireUI = {
    render: render, hud: hud, back: back,
    cycleFrogSort: cycleFrogSort, setTraitSlot: setTraitSlot, cycleTraitSort: cycleTraitSort, setGearSlot: setGearSlot,
    traitSlot: function () { return _traitSlot; },
    openTrait: openTrait, openGear: openGear,
    traitTier: traitTier, gearTier: gearTier, traitBoost: traitBoost, gearBoosts: gearBoosts, gearArt: gearArt,
    artHTML: artHTML, boostPill: boostPill, durabilityBar: durabilityBar
  };
})(typeof window !== 'undefined' ? window : globalThis);
