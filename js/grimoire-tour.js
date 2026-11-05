                                                                                
                                                                             
                                                                      
  
                                                                             
                                                                               
                                                                              
                                                                        
                                                                              
                                                                                
                                                                      
  
                                                                        
                                                                          
                                                                            
                
                                                                            
                                                                        
                                                         
   
(function (g) {
  'use strict';
  var SLOTS = ['head', 'mouth', 'back', 'aura'];
  var SLOTS_TIP = 'tooltip-grimoire-slots', POOL_TIP = 'tooltip-aura-pool';
  var PARAMS = {
    dwellMs: 1500,                                                            
    poolDwellMs: 700,                                             
    idleMs: 5000                                                                                
  };

  function create() { return { at: {} }; }
  function nextSlot(tour) {
    for (var i = 0; i < SLOTS.length; i++) if (tour.at[SLOTS[i]] == null) return SLOTS[i];
    return null;
  }
                                                                          
                                                                          
                                                             
  function update(tour, view, now) {
    var changed = false;
    if (view.slotsRead && tour.read == null) { tour.read = now; changed = true; }
    if (view.poolRead && tour.browse == null) { tour.browse = now; changed = true; }
    if (view.grimoire && !view.detail && view.tab === 'traits' && view.tabs &&
      SLOTS.indexOf(view.slot) >= 0 && tour.at[view.slot] == null) { tour.at[view.slot] = now; changed = true; }
    return changed;
  }
                                                                               
                                                                                    
                                                        
  function decide(tour, view, now, lastTap) {
    if (!tour) return { end: true };
    if (tour.browse != null) {
      if (!view.grimoire) return { end: true };
      return now - Math.max(tour.browse, lastTap || 0) >= PARAMS.idleMs ? { hand: 'pond' } : {};
    }
    if (!view.grimoire) return { hand: 'codex' };
    if (view.detail) return { hand: 'back' };
    if (view.tab !== 'traits' || !view.tabs) return { hand: 'traits' };
    if (!view.slotsRead) return { ask: 'slots' };
    var since = tour.at[view.slot] != null ? now - Math.max(tour.at[view.slot], tour.read || 0) : 0;
    var next = nextSlot(tour);
    if (!next && view.slot === 'aura') return since >= PARAMS.poolDwellMs ? { ask: 'pool' } : {};
    return since >= PARAMS.dwellMs ? { hand: 'slot', slot: next || 'aura' } : {};
  }

  var api = { SLOTS: SLOTS, SLOTS_TIP: SLOTS_TIP, POOL_TIP: POOL_TIP, PARAMS: PARAMS,
    create: create, nextSlot: nextSlot, update: update, decide: decide };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (!g.document) return;
  g.GrimoireTour = api;

                                                                           
  var lastTap = 0;
  ['pointerdown', 'wheel', 'scroll', 'keydown'].forEach(function (type) {
    document.addEventListener(type, function () { lastTap = Date.now(); }, { capture: true, passive: true });
  });
  function S() { return typeof state !== 'undefined' ? state : null; }
  function save() { if (typeof queueSave === 'function') queueSave(); }
  function q(sel) { return document.querySelector(sel); }
  function dockBtn(label) { return q('.bottom-dock .dock-btn[aria-label="' + label + '"]'); }
                                                        
  function lessonDue(s) {
    var T = g.FtueTooltips;
    var waiting = !!(g.AuraReminder && typeof FT !== 'undefined' && AuraReminder.waiting(s, FT));
    return !!(T && T.auraLessonDue(s, waiting));
  }
                                                                    
  api.start = function (s) {
    var r = s && g.FtueTooltips ? FtueTooltips.receipt(s) : null;
    if (!r || r.slotTour) return;
    r.slotTour = create(); save();
  };
  function view(r) {
    var grim = typeof activeSheet !== 'undefined' && activeSheet === 'grimoire' && !!q('.gp-page');
    return {
      grimoire: grim,
      detail: grim && !!q('.gp-page--detail'),
      tab: typeof grimTab !== 'undefined' ? grimTab : null,
      tabs: grim && !!q('.gp-page .gp-itabs--traits'),
      slot: g.GrimoireUI && GrimoireUI.traitSlot ? GrimoireUI.traitSlot() : null,
      slotsRead: !!r.seen[SLOTS_TIP],
      poolRead: !!r.seen[POOL_TIP]
    };
  }
  function target(d) {
    if (d.hand === 'codex') return dockBtn('Codex');
    if (d.hand === 'traits') return q('.gp-page .gr-tab[onclick*="traits"]');
    if (d.hand === 'back') return q('.gp-page .gp-back');
    if (d.hand === 'slot') return q('.gp-page .gp-itabs--traits .gp-itab[data-slot="' + d.slot + '"]');
    if (d.hand === 'pond') return dockBtn('Pond');
    return null;
  }
                                                                             
                                                         
  api.guide = function (p) {
    var s = S(), T = g.FtueTooltips;
    if (!s || !T) return false;
    var r = T.receipt(s), due = lessonDue(s);
                                                                                
    if (!r.slotTour && due && r.seen['tooltip-grimoire']) { r.slotTour = create(); save(); }
    var tour = r.slotTour;
    if (!tour) return false;
    var now = Date.now(), v = view(r);
    if (update(tour, v, now)) save();
                                                                              
    if (tour.browse == null && !due) { delete r.slotTour; save(); return false; }
    var d = decide(tour, v, now, lastTap);
    if (d.end) { delete r.slotTour; save(); return false; }
    var hide = function () { p.classList.remove('on', 'tap', 'grabbing', 'send-target', 'craft-target'); return true; };
    if (T.paused() || q('#claim-modal,#family-spotlight,.big-unlock,.cl-overlay,#body-hint,.showcase-overlay,.evo-overlay,.modal-overlay')) return hide();
                                                                                 
    if (q('#labor-window')) {
      var x = tour.browse == null && q('#labor-window .fi-close');
      if (!x || typeof GuidedHand === 'undefined') return hide();
      GuidedHand.place(p, x); return true;
    }
    if (d.ask) {
      if (T.request(s, d.ask === 'slots' ? SLOTS_TIP : POOL_TIP)) { save(); T.sync(); }
      return hide();
    }
    var el = target(d);
    if (!el || typeof GuidedHand === 'undefined') return hide();
    GuidedHand.place(p, el);
    return true;
  };
})(typeof window !== 'undefined' ? window : globalThis);
