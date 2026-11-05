                                                                          
                                                                          
                                                                              
                                                                          
                                                                             
                                                                     

                                                                          
                                                                             
                                                                          
                                                                  
                                                                     
                                                                          
                                                                           

                                                                         
                                                                          
                                                                      
                                                                        
                      

                                                                         
                                                                           
                                                                              
                                                                              
                                                  
(function (g) {
  'use strict';
  var TITLE_NEW_TRAIT = 'assets/ui2/screens/overlays/title-new-trait.png';                               
  var SLOT = { head: 'Head', mouth: 'Mouth', back: 'Back', aura: 'Aura', weapon: 'Weapon', shield: 'Shield' };

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function kit() { return g.KitUI || {}; }
  function button(o) { var K = kit(); return K.button ? K.button(o) : '<button id="' + esc(o.id || '') + '">' + esc(o.label) + '</button>'; }
  function art(src, size) {
    var K = kit();
    if (!src) return '';
    return K.art ? K.art(src, { size: size, fill: 0.92 }) : '<img src="' + esc(src) + '" alt="" draggable="false">';
  }

                                                                           
                                    
  function pack(R) {
    var sk = null;
    try { sk = EXP_SKINS[R.skin]; } catch (e) { sk = null; }
    sk = sk || {};
    return { id: sk.familyId || R.skin, name: sk.name || '', exactPiece: !!sk.exactPiece, pool: sk.pool || [] };
  }
  function pieces(famId) {
    try {
      return familyPieces(famId).map(function (p) { return { key: p.key, name: p.name, slot: p.slot, img: p.img, owned: !!familyHasPiece(p.key) }; });
    } catch (e) { return []; }
  }
  function traitDef(key) { try { return FT.traitDef(key); } catch (e) { return null; } }
                                                                      
                                                                   
                                                  
  function gearRow(def) {
    try { return def && isGear(def.slot) && g.Equipment && Equipment.UI.pieceRow ? Equipment.UI.pieceRow(def.k) : null; } catch (e) { return null; }
  }
  function tierOf(def) {
    var row = gearRow(def);
    if (row) return row.rarity;
    try { return (def && FrogStats.CODE_TO_SHEET_RARITY[def.r]) || 'rare'; } catch (e) { return 'rare'; }
  }
  function boostOf(def) {
    try {
      if (gearRow(def)) return Equipment.UI.pieceBoost(def.k);
      return def && g.GrimoireUI ? GrimoireUI.traitBoost(def) : null;
    } catch (e) { return null; }
  }
  function boostHTML(def, size) {
    var b = boostOf(def);
    var K = kit();
    return b && K.boostPill ? K.boostPill({ size: size || 'md', kind: b.kind, text: b.label, className: 'xr-boost' }) : '';
  }
  function isGear(slot) { return slot === 'weapon' || slot === 'shield'; }
                                                                                       
  function bpMark(slot) {
    try { return isGear(slot) && g.Equipment && Equipment.UI.blueprintMarkHTML ? Equipment.UI.blueprintMarkHTML(slot) : ''; } catch (e) { return ''; }
  }
                                                                          
  function hl(piece) { return !!(g.FsGearHighlight && FsGearHighlight.is(piece)); }
                                                                               
                                                                            
                                                                 
  function pieceLine(R, fam, def) {
    var slot = R.result && R.result.slot;
    var bits = [SLOT[slot] || '', fam.name, tierOf(def).toUpperCase()].filter(Boolean).join(' · ');
    return bits + (isGear(slot) ? ' — craft it in the Workshop' : ' — lands on a merge');
  }
  function rewardPills(claim) {
    var K = kit(), out = [];
    Object.keys(claim.reward || {}).forEach(function (k) {
      var icon = '';
      try { icon = EXP_CUR[k] || ''; } catch (e) { icon = ''; }
      out.push(K.rewardPill ? K.rewardPill({ type: 'currency', iconHTML: icon, amount: '×' + claim.reward[k] }) : '');
    });
    return out.length ? '<div class="xr-pills">' + out.join('') + '</div>' : '';
  }

                                                                         
                                                                          
                                     
  function sealedHTML(claim, headHTML) {
    var R = claim.roll, fam = pack(R), ps = pieces(fam.id), spin = R.phase === 'spin';
    var missing = ps.filter(function (p) { return !p.owned; }).length;
    var aura = fam.exactPiece ? (fam.pool[0] || {}).img : (ps.filter(function (p) { return p.slot === 'aura'; })[0] || ps[0] || fam.pool[0] || {}).img;
    var cur = fam.pool.length ? fam.pool[(R.idx || 0) % fam.pool.length] : null;
    var sub = fam.exactPiece ? 'This piece joins your merge pool' : ps.length
      ? (missing ? missing + ' of ' + ps.length + ' missing pieces — which one?' : 'Set complete — this one is another copy')
      : 'Which one will it be?';
    return headHTML
      + '<div id="claim-rollpanel" class="xr-sealed-wrap">'
                                                                          
                                                                            
                                                    
        + '<div class="xr-sealed' + (spin ? ' is-spinning' : '') + '" aria-hidden="true">'
          + (aura && !spin ? '<span class="xr-sealed__art xr-sealed__ghost">' + art(aura, 170) + '</span>' : '')
          + ((spin || fam.exactPiece) && cur ? '<span class="xr-sealed__art">' + art(cur.img, 170).replace('<img ', '<img class="crp-pick" ') + '</span>' : '<span class="xr-sealed__q">?</span>')
        + '</div>'
        + '<p class="xr-sealed__name">' + esc(fam.exactPiece && cur ? cur.name : fam.name ? fam.name + ' piece' : 'New trait') + '</p>'
        + '<p class="xr-sealed__sub">' + esc(sub) + '</p>'
        + (spin
          ? button({ tone: 'gold', shape: 'pill', size: 'lg', label: 'REVEALING…', disabled: true, className: 'xr-reveal-btn' })
          : revealRowHTML(claim))
        + rewardPills(claim)
      + '</div>';
  }

                                                                               
  function ticketUI() { return g.FamilyTicket || null; }
  function revealRowHTML(claim) {
    var T = ticketUI(), ticket = T ? T.buttonHTML(claim) : '';
                                                                             
                                                                         
                                                                     
                                                                           
                                                                              
    if (T && T.ticketOnlyStage && T.ticketOnlyStage(claim) && ticket) return '<div class="xr-reveal-row xr-reveal-row--ticket-only">' + ticket + '</div>';
    var reveal = button({ id: 'claim-rollbtn', tone: 'gold', shape: 'pill', size: 'lg', label: 'TAP TO REVEAL', className: 'xr-reveal-btn' });
    return ticket ? '<div class="xr-reveal-row">' + reveal + ticket + '</div>' : reveal;
  }

  function gearCount(T) { return T.gear.length + (T.gear.length === 1 ? ' gear blueprint' : ' gear blueprints'); }
                                                                                
  function ticketRevealHTML(claim) {
    var T = claim.ticket, T2 = ticketUI();
                                                                          
                                                                             
                                                                     
    var landed = Math.min(T.pieces.length + T.gear.length - 1, 6) * 0.08 + 0.42, booms = 0;
    var tile = function (img, name, slot, gear, i, lit) {
      var style = '';
      if (lit) {
        var peak = landed + 0.3 + booms++ * 0.24;
        style = ' style="--fsg-at:' + peak.toFixed(2) + 's;animation-delay:' + (Math.min(i, 6) * 0.08).toFixed(2) + 's,' + (peak - 0.21).toFixed(2) + 's"';
      }
      return '<span class="xr-full__piece' + (gear ? ' xr-full__piece--gear' : '') + (lit ? ' xr-full__piece--fsgear' : '') + '"' + style + '>'
        + (lit ? FsGearHighlight.glossHTML() : '')
        + '<span class="xr-full__art">' + (lit ? FsGearHighlight.burstHTML('sm') : '') + art(img, 74) + (gear ? bpMark(slot) : '') + '</span>'
        + '<span class="xr-full__name">' + esc(name) + '</span>'
        + '<span class="xr-full__slot">' + esc(gear ? 'Blueprint' : SLOT[slot] || '') + '</span></span>';
    };
    var tiles = T.pieces.map(function (R, i) { var r = R.result || {}; return tile(r.img, r.name, r.slot, false, i, false); })
      .concat(T.gear.map(function (it, j) { return tile(it.img, it.name, it.slot, true, T.pieces.length + j, hl(it)); })).join('');
    return '<div id="claim-rollpanel" class="xr-reveal xr-full">'
      + '<p class="xr-full__eyebrow">' + (T2 ? T2.iconHTML() : '') + '<span>FAMILY TICKET</span></p>'
      + '<p class="xr-title-text">Full set!</p>'
      + '<p class="xr-full__fam">' + esc(T.name) + '</p>'
      + '<div class="xr-full__grid">' + tiles + '</div>'
      + '<p class="xr-piece__line">' + T.pieces.length + ' pieces — each lands on a merge' + (T.gear.length ? ' · ' + gearCount(T) + ' to craft' : '') + '</p>'
      + '</div>';
  }

                                                                                
                                                                          
                                                                          
                       
  var TROPHY = '\u{1F3C6}';
  function prizeLine(P) {
    return P.pieces.length + ' pieces — each lands on a merge' + (P.gear.length ? ' · ' + gearCount(P) + ' to craft' : '');
  }
  function prizeRevealHTML(claim) {
    var P = claim.prize;
    var tile = function (img, name, slot, gear) {
      return '<span class="xr-full__piece' + (gear ? ' xr-full__piece--gear' : '') + '">'
        + '<span class="xr-full__art">' + art(img, 74) + (gear ? bpMark(slot) : '') + '</span>'
        + '<span class="xr-full__name">' + esc(name) + '</span>'
        + '<span class="xr-full__slot">' + esc(gear ? 'Blueprint' : SLOT[slot] || '') + '</span></span>';
    };
    var tiles = P.pieces.map(function (R) { var r = R.result || {}; return tile(r.img, r.name, r.slot, false); })
      .concat(P.gear.map(function (it) { return tile(it.img, it.name, it.slot, true); })).join('');
    return '<div id="claim-rollpanel" class="xr-reveal xr-full xr-full--prize">'
      + '<p class="xr-full__eyebrow"><span class="xr-full__trophy" aria-hidden="true">' + TROPHY + '</span><span>EXTREME CLEARED</span></p>'
      + '<p class="xr-title-text">Full set!</p>'
      + '<p class="xr-full__fam">' + esc(P.name) + '</p>'
      + '<div class="xr-full__grid">' + tiles + '</div>'
      + '<p class="xr-piece__line">' + esc(prizeLine(P)) + '</p>'
      + '</div>';
  }
                                                                           
                                                                    
                                                                    
  function prizeFrom(fullSet) {
    var rec = function (p) {
      var res = null;
      try { res = claimRollTrait(fullSet.skin, p.key, { alreadyQueued: true, allowDuplicates: true }); } catch (e) { res = null; }
      var pick = (res && res.pick) || p;
      return { key: pick.key, name: pick.name, slot: pick.slot, img: pick.img, dupe: !!(res && res.dupe) };
    };
    return {
      familyId: fullSet.familyId, name: fullSet.name,
      pieces: fullSet.pieces.map(function (p) { return { result: rec(p) }; }),
      gear: fullSet.gear.map(rec)
    };
  }
                                                                              
                                                                             
  function attachPrize(claim, fullSets) {
    if (!claim || !fullSets || !fullSets.length) return;
    var P = prizeFrom(fullSets[0]);
    claim.prize = P;
    var first = P.pieces[0] ? P.pieces[0].result : P.gear[0];
    var R = { prize: true, skin: 'prize_' + P.familyId, phase: 'done', result: first };
    if (claim.roll) (claim.remainingRolls || (claim.remainingRolls = [])).push(R);
    else claim.roll = R;
  }

  function revealHTML(claim) {
                                                           
    if (claim.roll && claim.roll.rescue && claim.rescue && g.RescueWeb) return RescueWeb.revealHTML(claim);
    if (claim.roll && claim.roll.prize && claim.prize) return prizeRevealHTML(claim);
    if (claim.roll && claim.roll.ticket && claim.ticket) return ticketRevealHTML(claim);
    var R = claim.roll, res = R.result || {}, fam = pack(R), def = traitDef(res.key), lit = hl(res);
    var title = R.dupe
      ? '<p class="xr-title-text">' + (R.allowDuplicates ? 'Another copy!' : 'Already owned') + '</p>'
      : isGear(res.slot) ? '<p class="xr-title-text">New blueprint!</p>'
      : '<img class="xr-title-art" src="' + TITLE_NEW_TRAIT + '" alt="New trait!" draggable="false">';
    var piece = lit
      ? '<div class="fsg-stage">' + FsGearHighlight.burstHTML('lg')
        + '<div class="xr-piece fsg-piece">' + FsGearHighlight.glossHTML() + art(res.img, 160) + bpMark(res.slot) + '</div>'
        + FsGearHighlight.ribbonHTML() + '</div>'
      : '<div class="xr-piece">' + art(res.img, 160) + bpMark(res.slot) + '</div>';
    return '<div id="claim-rollpanel" class="xr-reveal' + (lit ? ' xr-reveal--fsgear' : '') + '">'
      + title
      + piece
      + '<p class="xr-piece__name">' + esc(res.name || '') + '</p>'
      + boostHTML(def)
      + '<p class="xr-piece__line">' + esc(pieceLine(R, fam, def)) + '</p>'
      + '</div>';
  }

                                                                          
                                                                             
                                              
  function screenClass(claim) {
    var R = claim.roll || {}, done = R.phase === 'done';
    return 'kit-feature kit-reward-fullscreen xr-trait' + (done ? ' xr-trait--reveal xr-tone--' + (R.rescue ? 'epic' : tierOf(traitDef(R.result && R.result.key))) + (R.ticket || R.prize || R.rescue ? ' xr-trait--ticket' : '') + (R.rescue ? ' xr-trait--rescue' : '') : ' xr-trait--sealed');
  }
  function screenHTML(claim, headHTML) {
    return claim.roll && claim.roll.phase === 'done' ? revealHTML(claim) : sealedHTML(claim, headHTML);
  }
                                                                          
                                                                        
                                                                          
  function actionsHTML(claim) {
    var R = claim.roll;
    if (!R || R.phase !== 'done') return '';
    var next = (claim.remainingRolls || []).length > 0, auto = '', prize = next && claim.remainingRolls[0].prize, rescue = next && claim.remainingRolls[0].rescue;
    try { auto = g.AutoExpeditions && AutoExpeditions.rerunHTML ? AutoExpeditions.rerunHTML(claim) : ''; } catch (e) { auto = ''; }
                                                                                                       
    return '<div class="kit-reward-collect' + (/^<button/.test(auto) ? ' xr-collect--row' : '') + '">'
      + button({ id: next ? 'claim-nextroll' : 'claim-viewrewards', tone: 'gold', shape: 'pill', size: 'lg', label: prize ? 'Claim your prize!' : rescue ? 'Who did you rescue?' : next ? 'Reveal next trait' : 'Continue', className: 'xr-continue' })
      + auto
      + '</div>';
  }

                                                                            
                                                                         
                                                                            
                                                                         
                                                                   
  var CHECK = 'assets/ui2/kit/traits-gear/family-check.svg';
  function statText(def) {
    var b = boostOf(def);
    return b ? '<span class="xr-newtrait__stat">' + esc(b.label) + '</span>' : '';
  }
                                                                            
  function ticketReceiptHTML(claim) {
    var T = claim.ticket, T2 = ticketUI();
    if (!T) return '';
    var tiles = T.pieces.map(function (R) {
      var r = R.result || {};
      return '<span class="xr-slot is-owned is-won" role="img" aria-label="' + esc(r.name + ', won') + '">' + art(r.img)
        + '<img class="xr-slot__check" src="' + CHECK + '" alt="" draggable="false"></span>';
    }).join('');
    return '<div class="xr-newtrait xr-newtrait--ticket">'
      + '<div class="xr-newtrait__top"><span class="xr-newtrait__art">' + (T2 ? T2.iconHTML('xr-newtrait__ticket') : '') + '</span>'
        + '<span class="xr-newtrait__info"><span class="xr-newtrait__chip">FAMILY TICKET</span>'
          + '<span class="xr-newtrait__name">' + esc(T.name) + ' set</span>'
          + '<span class="xr-newtrait__line">' + esc(T.pieces.length + ' pieces — each lands on a merge' + (T.gear.length ? ' · ' + gearCount(T) + ' for the Workshop' : '')) + '</span></span></div>'
      + '<div class="xr-newtrait__set"><span class="xr-newtrait__setlabel">SET<b>' + T.pieces.length + '/' + T.pieces.length + '</b></span>' + tiles + '</div>'
      + '</div>';
  }
                                                                                       
  function prizeReceiptHTML(claim) {
    var P = claim.prize;
    if (!P) return '';
    var all = P.pieces.map(function (R) { return R.result || {}; }).concat(P.gear);
    var tiles = all.map(function (r) {
      return '<span class="xr-slot is-owned is-won" role="img" aria-label="' + esc(r.name + ', won') + '">' + art(r.img) + bpMark(r.slot)
        + '<img class="xr-slot__check" src="' + CHECK + '" alt="" draggable="false"></span>';
    }).join('');
    return '<div class="xr-newtrait xr-newtrait--ticket xr-newtrait--prize">'
      + '<div class="xr-newtrait__top"><span class="xr-newtrait__art"><span class="xr-newtrait__trophy" aria-hidden="true">' + TROPHY + '</span></span>'
        + '<span class="xr-newtrait__info"><span class="xr-newtrait__chip">EXTREME PRIZE</span>'
          + '<span class="xr-newtrait__name">' + esc(P.name) + ' set</span>'
          + '<span class="xr-newtrait__line">' + esc(P.pieces.length + ' pieces — each lands on a merge' + (P.gear.length ? ' · ' + gearCount(P) + ' for the Workshop' : '')) + '</span></span></div>'
      + '<div class="xr-newtrait__set"><span class="xr-newtrait__setlabel">SET<b>' + all.length + '/' + all.length + '</b></span>' + tiles + '</div>'
      + '</div>';
  }
  function receiptHTML(claim) {
    return prizeReceiptHTML(claim) + (g.RescueWeb ? RescueWeb.receiptHTML(claim) : '') + traitsReceiptHTML(claim);
  }
  function traitsReceiptHTML(claim) {
    var list = (claim.revealed || []).filter(function (R) { return R && R.result && !R.ticket; });
    if (!list.length) return ticketReceiptHTML(claim);
    var no = /^sheet-(\d+)$/.exec(claim.expId || '');
    var fr = null;
    try { fr = no && g.EMap ? EMap.familyReward(Number(no[1])) : null; } catch (e) { fr = null; }
    return list.map(function (R) {
      var res = R.result, fam = pack(R), def = traitDef(res.key), ps = pieces(fam.id);
      var have = ps.filter(function (p) { return p.owned; }).length;
      var tiles = ps.map(function (p) {
        return '<span class="xr-slot' + (p.owned ? ' is-owned' : '') + (p.key === res.key ? ' is-won' : '') + '" role="img" aria-label="' + esc(p.name + (p.owned ? ', owned' : ', missing')) + '">'
          + art(p.img) + (p.owned ? '<img class="xr-slot__check" src="' + CHECK + '" alt="" draggable="false">' : '') + '</span>';
      }).join('');
      var next = '';
      if (fr && fr.id === fam.id && ps.length) {
        var left = ps.length - have, pool = 0;
        try { pool = (g.Rewards && Rewards.familyDropPool ? Rewards.familyDropPool(FT, fam.id, fr.no) : (FT.familyRewardPool || FT.familyTraitPool)(fam.id)).length; } catch (e) { pool = 0; }
        if (fr.target) next = 'Next run: ' + fr.target.n + ' · ' + Math.round(fr.chance * 100) + '%';
        else next = left > 0 && pool
          ? 'Next run: ' + left + ' of ' + ps.length + ' left · ' + Math.round(fr.chance / pool * 100) + '% each'
          : 'Set complete';
      }
      var lit = hl(res);
      var gear = isGear(res.slot);
      return '<div class="xr-newtrait' + (lit ? ' xr-newtrait--fsgear' : '') + (gear ? ' xr-newtrait--blueprint' : '') + '" data-family="' + esc(fam.id) + '">'                                                                       
        + (lit ? FsGearHighlight.glossHTML() : '')
        + '<div class="xr-newtrait__top"><span class="xr-newtrait__art">' + (lit ? FsGearHighlight.burstHTML('md') : '') + art(res.img, 96) + bpMark(res.slot) + '</span>'
          + '<span class="xr-newtrait__info"><span class="xr-newtrait__chip">' + (gear ? (R.dupe ? 'ANOTHER BLUEPRINT' : 'NEW BLUEPRINT') : R.dupe ? 'ANOTHER COPY' : 'NEW TRAIT') + '</span>'
            + '<span class="xr-newtrait__name">' + esc(res.name) + '</span>' + statText(def)
            + '<span class="xr-newtrait__line">' + esc(pieceLine(R, fam, def)) + '</span></span></div>'
        + (tiles ? '<div class="xr-newtrait__set"><span class="xr-newtrait__setlabel">SET<b>' + have + '/' + ps.length + '</b></span>' + tiles + '</div>' : '')
        + (next ? '<p class="xr-newtrait__next">' + esc(next) + '</p>' : '')
        + '</div>';
    }).join('') + ticketReceiptHTML(claim);
  }

  g.TraitRevealUI = { screenClass: screenClass, screenHTML: screenHTML, actionsHTML: actionsHTML, receiptHTML: receiptHTML,
    attachPrize: attachPrize, prizeFrom: prizeFrom };
})(typeof window !== 'undefined' ? window : globalThis);
