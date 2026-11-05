                                                                              
                                                                            
                                                                            
                                                                            
                                                                     

                                                                      
                                                                           
                                                                              
                                                                            
                                                                               
                                                                             
                                                                            
                                                                                
         

                                                                                  
                                                                              
                                                                              
                                                                             
(function (g) {
  'use strict';
                                                                                             
  function text(key, fallback, tokens){
    if(typeof FPConfig !== 'undefined' && FPConfig.text) return FPConfig.text(key, fallback, tokens);
    return String(fallback).replace(/\{(\w+)\}/g, function(all, name){ return tokens && Object.prototype.hasOwnProperty.call(tokens,name) ? String(tokens[name]) : all; });
  }

  var ROOT_ID = 'pond-flag-prompt';
  var NAME_MAX = 14;                                                               
  var BLOCKERS = '#ftue-tooltip,#family-spotlight,.fm-assimilating,#claim-modal,.cl-overlay,.evo-overlay,.showcase-overlay,'
    + '.big-unlock,.modal-overlay,#body-hint,#labor-window,#flower-chooser,#settings-popup,.xm-fullscreen,.xps-stage';
  var WAVE_HOLD_MS = 900;                                                            
  var PARAMS = {
    settleMs: 1800                                                                                    
  };
  var draft = null, settleUntil = 0, calmSince = 0;

  function st() { return typeof state !== 'undefined' ? state : null; }
  function isOpen() { return !!document.getElementById(ROOT_ID); }
  function isDue(s) { return !!(s && s.pondFlagDue); }
                                                                               
                                             
  function waiting() { return isDue(st()) || isOpen() || (!!settleUntil && Date.now() < settleUntil); }
                                         
  function due(s, fromTier) { if (s && fromTier === 0) s.pondFlagDue = true; }
                                                                                
                                                                             
                                                                      
  function raised(s) { return !!s && (s.pondTier || 0) >= 1 && !s.pondFlagDue; }

  function colors() { return typeof POD_COLORS !== 'undefined' ? POD_COLORS : []; }
  function current() {
    var p = typeof g.podFlag === 'function' ? g.podFlag() : { color: 'green', name: 'My Pod' };
    return { color: p.color, name: p.name, icon: p.icon };
  }
  function esc(v) { return g.KitUI ? KitUI.esc(v) : String(v).replace(/[&<>"]/g, ''); }

                                                                               
                                                         
  function ready(s) {
    if (!isDue(s) || isOpen()) return false;
    if (typeof activeSheet !== 'undefined' && activeSheet) return false;
    if (typeof activeTab !== 'undefined' && activeTab !== 'pond') return false;
    if (typeof showcaseFrog !== 'undefined' && showcaseFrog) return false;
    if (typeof evoShowcase !== 'undefined' && evoShowcase) return false;
    if (g.PondExpansionCamera && PondExpansionCamera.active()) return false;
    if (document.body.classList.contains('pond-growing') || document.body.classList.contains('ftue-tv')) return false;
    return !document.querySelector(BLOCKERS);
  }

  function swatchesHTML() {
    return colors().map(function (c) {
      var bg = c.c.indexOf('gradient') >= 0 ? 'background-image:' + c.c : 'background-color:' + c.c;
      return '<button type="button" class="pfp-sw' + (draft.color === c.k ? ' on' : '') + '" style="' + bg + '"'
        + ' data-color="' + esc(c.k) + '" aria-label="' + esc(c.k) + ' flag" aria-pressed="' + (draft.color === c.k) + '"'
        + ' onclick="PondFlagPrompt.pick(\'' + esc(c.k) + '\')"></button>';
    }).join('');
  }
  function previewHTML() {
    return typeof g.podMonumentHTML === 'function' ? g.podMonumentHTML(draft) : '';
  }
  function popupHTML() {
    return KitUI.popup({
      id: 'pfp-popup', className: 'pfp-popup', title: text("text_flag_title", "Your pond grew!"),
      subtitle: text("text_flag_subtitle", "Make it yours: pick a flag and name your pond."),
      bodyHTML: '<div class="pfp-preview" aria-hidden="true"><span class="pfp-rays"></span>'
          + '<div class="pfp-crop"><div class="pfp-mon">' + previewHTML() + '</div></div></div>'
        + '<div class="pfp-sec">' + esc(text("text_flag_colour", "Flag colour")) + '</div>'
        + '<div class="pfp-swatches" role="group" aria-label="' + esc(text("text_flag_colour", "Flag colour")) + '">' + swatchesHTML() + '</div>'
        + '<label class="pfp-sec" for="pfp-name">' + esc(text("text_flag_name", "Pond name")) + '</label>'
        + '<input id="pfp-name" class="pfp-name" type="text" maxlength="' + NAME_MAX + '" autocomplete="off" spellcheck="false"'
        + ' enterkeyhint="done" value="' + esc(draft.name || '') + '" placeholder="' + esc(text("text_flag_placeholder", "My Pod")) + '">',
      primary: { label: text("text_flag_button", "Raise the flag!"), tone: 'gold', onclick: 'PondFlagPrompt.raise()' }
    });
  }

  function paintPreview(wave) {
    var mon = document.querySelector('#' + ROOT_ID + ' .pfp-mon');
    if (!mon) return;
    mon.innerHTML = previewHTML();
    if (wave && mon.animate && !reduced()) {
      mon.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.06) rotate(-1.2deg)', offset: 0.35 },
        { transform: 'scale(.98) rotate(.6deg)', offset: 0.7 }, { transform: 'scale(1)' }],
      { duration: 380, easing: 'cubic-bezier(.3,1.4,.5,1)' });
    }
  }
  function reduced() { return !!(g.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches); }

  function open() {
    var s = st();
    if (!s || isOpen() || !g.KitUI) return false;
    draft = current();
    var root = document.createElement('div');
    root.id = ROOT_ID;
    root.innerHTML = '<div class="pfp-backdrop"></div><div class="pfp-stage">' + popupHTML() + '</div>';
    document.body.appendChild(root);
    document.body.classList.add('pfp-open');
    var input = root.querySelector('#pfp-name');
    if (input) {
      input.addEventListener('input', function () {
        draft.name = input.value.slice(0, NAME_MAX);
        var board = root.querySelector('.pfp-mon .pdm-name span');
        if (board) {
          board.textContent = (draft.name.trim() || 'My Pod').replace(/[<>&]/g, '');
          board.style.setProperty('--pdm-n', board.textContent.length);                                  
        }
      });
      input.addEventListener('focus', function () { try { input.select(); } catch (e) {} });
                                                                 
      input.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); input.blur(); } });
    }
    if (typeof g.ac === 'function') { try { g.ac(); } catch (e) {} }
    return true;
  }

  function pick(key) {
    if (!draft || !colors().some(function (c) { return c.k === key; })) return;
    var changed = draft.color !== key;
    draft.color = key;
    Array.prototype.forEach.call(document.querySelectorAll('#' + ROOT_ID + ' .pfp-sw'), function (b) {
      var on = b.dataset.color === key;
      b.classList.toggle('on', on); b.setAttribute('aria-pressed', String(on));
    });
    paintPreview(changed);
    if (changed && typeof g.croak === 'function') { try { g.croak(1.4, 0.6); } catch (e) {} }
  }

  function close() {
    var root = document.getElementById(ROOT_ID);
    if (root) root.remove();
    document.body.classList.remove('pfp-open');
    draft = null;
  }

                                                                            
                                                                               
  function raise() {
    var s = st();
    if (!s || !draft) { close(); return; }
    var input = document.getElementById('pfp-name');
    var name = input ? input.value : draft.name;
    var p = typeof g.podFlag === 'function' ? g.podFlag() : (s.pod || (s.pod = {}));
    p.color = draft.color;
    p.name = (name || '').trim().slice(0, NAME_MAX) || 'My Pod';
    delete s.pondFlagDue;
    close();
    if (typeof g.queueSave === 'function') g.queueSave();
    if (typeof g.mergeArp === 'function') { try { g.mergeArp(4); } catch (e) {} }
                                                                               
                                                                    
    if (typeof g.syncPondScene === 'function') { try { g.syncPondScene(); } catch (e) {} }
    settleUntil = waveOnPond() ? Date.now() + WAVE_HOLD_MS : 0;
    if (typeof g.render === 'function') g.render();
    if (!settleUntil) release();
  }
  function release() {
    settleUntil = 0;
    if (g.FtueTooltips) FtueTooltips.sync();
    if (typeof g.showNextFamilySpotlight === 'function') g.showNextFamilySpotlight();
  }
                                                                             
                                                                          
  function waveOnPond() {
    var pf = document.querySelector('#pond-landmarks .pod-flag'), mon = pf && pf.querySelector('.pod-mon');
    if (!mon || !mon.animate || reduced() || !document.elementFromPoint) return false;
    var r = mon.getBoundingClientRect();
    var x = r.left + r.width * 0.53, y = r.top + r.height * 0.4;                                                            
    var top = document.elementFromPoint(x, y);
    if (!r.width || !top || !pf.contains(top)) return false;
    mon.animate([{ transform: 'scale(1)', filter: 'brightness(1)' },
      { transform: 'scale(1.08) translateY(-2%)', filter: 'brightness(1.5)', offset: 0.3 },
      { transform: 'scale(.97)', filter: 'brightness(1.1)', offset: 0.65 },
      { transform: 'scale(1)', filter: 'brightness(1)' }],
    { duration: 700, easing: 'cubic-bezier(.3,1.4,.5,1)' });
    return true;
  }

                                                                            
                                                                               
  function sync(now) {
    var s = st();
    now = now || Date.now();
    if (settleUntil && now >= settleUntil) release();
    if (!ready(s)) { calmSince = 0; return; }
    if (!calmSince) calmSince = now;
    if (now - calmSince >= PARAMS.settleMs) { calmSince = 0; open(); }
  }
  if (typeof document !== 'undefined' && typeof setInterval === 'function') setInterval(function () { sync(); }, 300);

  g.PondFlagPrompt = { PARAMS: PARAMS, due: due, isDue: isDue, raised: raised, waiting: waiting, ready: ready, sync: sync, open: open,
    isOpen: isOpen, pick: pick, raise: raise, close: close };
  if (typeof module !== 'undefined' && module.exports) module.exports = g.PondFlagPrompt;
})(typeof window !== 'undefined' ? window : globalThis);
