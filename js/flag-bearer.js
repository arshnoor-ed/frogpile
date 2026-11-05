                                                   

                                                                             
                                                                          
                                                                           
                                                                       
                                                                        
                                                                                                               
                                                                          
                 

                                                                            
                                                                         
                                        

                                                                           
                                                                           
                                                                           
                                                                

                                                                            
                        
(function (g) {
  'use strict';
  var ART = 'assets/expeditions/flag/';
  var STAMP_MS = 900, STAMP_GAP_MS = 140;                                            
  var stampAt = {};                                                                                    

  function S() { try { return state; } catch (e) { return null; } }                              
  function now() { return (g.performance && performance.now) ? performance.now() : Date.now(); }
  function frogById(s, id) { return (s && s.frogs || []).filter(function (f) { return f.id === id; })[0] || null; }

  function bearerId() {
    var s = S();
    return s && s.flagBearer && frogById(s, s.flagBearer) ? s.flagBearer : null;
  }
                                                                    
  function pickBearer(s, partyIds) {
    var best = null;
    (partyIds || []).forEach(function (id) {
      var f = frogById(s, id);
      if (f && (!best || (f.tier || 0) > (best.tier || 0))) best = f;
    });
    return best ? best.id : null;
  }
  function clearedNos(s) {
    return ((s && s.expeditionsCleared) || []).map(function (k) { var m = /^node-(\d+)$/.exec(k); return m ? +m[1] : null; })
      .filter(function (n) { return n != null; });
  }
                                                                         
                                                                     
  function stamps(s) {
    if (!s) return [];
    if (!Array.isArray(s.flagStamps)) s.flagStamps = clearedNos(s);
    return s.flagStamps;
  }

                                                 
  function onDispatch(no, partyIds) {
    var s = S(); if (!s) return;
    stamps(s);
    if (!bearerId()) { var id = pickBearer(s, partyIds); if (id) s.flagBearer = id; }
  }
                                                
  function onMerged(fromId, toId) {
    var s = S();
    if (s && s.flagBearer === fromId) s.flagBearer = toId;
  }

  function tintCSS() {
    var c = '#3f9f4f';
    try { c = g.podColorCSS(g.podFlag().color); } catch (e) {                                      }
    return c.indexOf('gradient') >= 0 ? 'background-image:' + c : 'background-color:' + c;
  }
                                                           
  function flagHTML(cls) {
    var tint = tintCSS();
    return '<span class="fb-flag' + (cls ? ' ' + cls : '') + '" aria-hidden="true">'
      + [1, 2].map(function (n) {
        var cloth = ART + 'flag_' + n + '_cloth.png';
        return '<span class="fb-frame fb-frame--' + n + '">'
          + '<img src="' + ART + 'flag_' + n + '.png" alt="" draggable="false" decoding="async">'
          + '<span class="fb-tint" style="' + tint + ';-webkit-mask-image:url(\'' + cloth + '\');mask-image:url(\'' + cloth + '\')"></span>'
          + '</span>';
      }).join('')
      + '</span>';
  }
                                                                                               
  function flagIntroduced() {
    return !!(g.PondFlagPrompt && g.PondFlagPrompt.raised(S()));
  }
                                                                                                                
  function frogFlagHTML(frogId) {
    return frogId != null && frogId === bearerId() && flagIntroduced() ? flagHTML('fb-held') : '';
  }

                                                                     
  function coinStampHTML(no, st) {
    if (st !== 'cleared') return '';
    var s = S(), list = stamps(s);
    if (list.indexOf(no) < 0) return '<span class="fb-stamp is-due" data-flag-due="' + no + '">' + flagHTML() + '</span>';
    var t = stampAt[no] != null ? now() - stampAt[no] : Infinity;
    if (t < STAMP_MS + 50) {                                                               
      return '<span class="fb-stamp is-stamping" style="--fb-at:' + Math.round(-t) + 'ms">' + flagHTML() + '</span>';
    }
    return '<span class="fb-stamp">' + flagHTML() + '</span>';
  }

                                                                       
  function onScreen(el) {
    var coin = el.closest('.xm-coin'); if (!coin) return false;
    var r = coin.getBoundingClientRect(); if (!r.width) return false;
    var hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    return !!hit && coin.contains(hit);
  }
  var poll = null;
  function check() {
    var due = document.querySelectorAll('.fb-stamp[data-flag-due]');
    if (!due.length) { if (poll) { clearInterval(poll); poll = null; } return; }
    if (!poll) poll = setInterval(check, 300);
    var s = S(), list = stamps(s), landed = 0;
    Array.prototype.forEach.call(due, function (el) {
      if (!onScreen(el)) return;
      var no = +el.getAttribute('data-flag-due'), gap = landed * STAMP_GAP_MS;
      el.removeAttribute('data-flag-due');
      if (list.indexOf(no) < 0) list.push(no);
      stampAt[no] = now() + gap;
      el.style.setProperty('--fb-at', gap + 'ms');
      el.classList.remove('is-due'); el.classList.add('is-stamping');
      setTimeout(thud, gap + STAMP_MS * 0.42);
      landed++;
    });
    if (landed) { try { g.queueSave(); } catch (e) {} }
  }
                                           
  function thud() {
    var c = null; try { c = g.ac(); } catch (e) {}
    if (!c) return;
    var t0 = c.currentTime, o = c.createOscillator(), v = c.createGain();
    o.type = 'sine'; o.frequency.setValueAtTime(170, t0); o.frequency.exponentialRampToValueAtTime(55, t0 + 0.16);
    v.gain.setValueAtTime(0.0001, t0); v.gain.exponentialRampToValueAtTime(0.5, t0 + 0.01); v.gain.exponentialRampToValueAtTime(0.001, t0 + 0.22);
    o.connect(v); v.connect(c.destination); o.start(t0); o.stop(t0 + 0.24);
  }
  function watch() {
    var app = document.getElementById('app');
    if (!app || typeof MutationObserver === 'undefined') return;
    new MutationObserver(function () { setTimeout(check, 0); }).observe(app, { childList: true });
  }
  if (g.document) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', watch); else watch();
  }

  var api = { bearerId: bearerId, pickBearer: pickBearer, onDispatch: onDispatch, onMerged: onMerged,
    flagIntroduced: flagIntroduced, flagHTML: flagHTML, frogFlagHTML: frogFlagHTML, coinStampHTML: coinStampHTML, check: check };
  g.FlagBearer = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
