                                                                          
                                                                       
                                                                            
                                                                             
                                                                       
                                                                  

                                                                              
                                                            
(function (g) {
  'use strict';
  var ROOT_ID = 'settings-popup';
  var SOUND_KEY = 'frogpile.soundOff';                                                                
  var soundOff = false;
  try { soundOff = g.localStorage.getItem(SOUND_KEY) === '1'; } catch (e) {}

  function muted() { return soundOff; }
  function isOpen() { return !!document.getElementById(ROOT_ID); }

  function row(label, sub, controlHTML) {
    return '<div class="st-row"><span class="st-row__text"><b>' + KitUI.esc(label) + '</b>'
      + (sub ? '<small>' + KitUI.esc(sub) + '</small>' : '') + '</span>' + controlHTML + '</div>';
  }
  function popupHTML() {
    return KitUI.popup({
      id: 'st-popup', className: 'st-popup', title: 'Settings',
      onClose: 'SettingsUI.close()', closeAriaLabel: 'Close settings',
      bodyHTML: row('Sound', 'Croaks, chimes and splashes', KitUI.button({
          tone: soundOff ? 'violet' : 'green', shape: 'pill', size: 'sm', className: 'st-toggle',
          label: soundOff ? 'Off' : 'On', ariaLabel: 'Sound ' + (soundOff ? 'off' : 'on'),
          onclick: 'SettingsUI.toggleSound()' }))
        + row('Reset game', 'Start over from the very beginning', KitUI.button({
          tone: 'danger', shape: 'pill', size: 'sm', className: 'st-reset', label: 'Reset',
          onclick: 'SettingsUI.askReset()' }))
    });
  }
  function confirmHTML() {
    return KitUI.confirmModal({
      tone: 'danger', id: 'st-reset-confirm', title: 'Reset game?',
      body: 'All your frogs, traits and progress will be lost. This can’t be undone.',
      cancel: { label: 'No', onclick: 'SettingsUI.cancelReset()' },
      confirm: { label: 'Reset', onclick: 'SettingsUI.confirmReset()' }
    });
  }
  function paint(confirming) {
    var root = document.getElementById(ROOT_ID);
    if (!root) return;
    root.classList.toggle('st--confirm', !!confirming);
    root.querySelector('.st-stage').innerHTML = confirming ? confirmHTML() : popupHTML();
    var focus = root.querySelector(confirming ? '#st-reset-confirm .kit-btn' : '.kit-popup__close');
    if (focus) focus.focus({ preventScroll: true });
  }

  function onKey(e) { if (e.key === 'Escape') { e.preventDefault(); close(); } }
  function open() {
    if (isOpen()) return;
    var root = document.createElement('div');
    root.id = ROOT_ID;
    root.innerHTML = '<div class="st-backdrop" onclick="SettingsUI.close()"></div><div class="st-stage"></div>';
    document.body.appendChild(root);
    paint(false);
    document.addEventListener('keydown', onKey, true);
  }
  function close() {
    var root = document.getElementById(ROOT_ID);
    if (root) root.remove();
    document.removeEventListener('keydown', onKey, true);
  }
  function toggleSound() {
    soundOff = !soundOff;
    try { g.localStorage.setItem(SOUND_KEY, soundOff ? '1' : '0'); } catch (e) {}
    paint(false);
    if (!soundOff && typeof g.croak === 'function') { try { g.croak(1, 1); } catch (e) {} }                               
  }
  function askReset() { paint(true); }
  function cancelReset() { paint(false); }
  function confirmReset() { close(); if (typeof g.resetGame === 'function') g.resetGame(true); }

  g.SettingsUI = { open: open, close: close, isOpen: isOpen, muted: muted,
    toggleSound: toggleSound, askReset: askReset, cancelReset: cancelReset, confirmReset: confirmReset };
})(typeof window !== 'undefined' ? window : globalThis);
