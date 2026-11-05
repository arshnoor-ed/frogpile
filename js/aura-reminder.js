                                                                              
  
                                                                              
                                                                           
                                                                       
                                                                              
                                                                           
                                                                          
                                                          
  
                                                                             
   
(function (g) {
  'use strict';
                                                                                             
  function text(key, fallback, tokens){
    if(typeof FPConfig !== 'undefined' && FPConfig.text) return FPConfig.text(key, fallback, tokens);
    return String(fallback).replace(/\{(\w+)\}/g, function(all, name){ return tokens && Object.prototype.hasOwnProperty.call(tokens,name) ? String(tokens[name]) : all; });
  }

  function esc(v){return String(v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  var ART = 'assets/tooltips/tooltip-3a.png';
  var ART_TEXT = 'It completes your Bunny family! Full family = Dodge in combat!';

  function baseKey(k) { return String(k).replace(/_evolution\d+$/, ''); }
                                                                          
  function auraKey(ft) {
    var fam = ft && ft.familyDefOf ? ft.familyDefOf('bunny') : null;
    return (fam && fam.traits && fam.traits.aura) || null;
  }
                                                                               
                                                                       
  function waiting(st, ft) {
    var key = auraKey(ft);
    if (!st || !key) return false;
    var won = (st.unlockedSetPieces || []).indexOf(key) >= 0 || (st.traitUnlocks || []).indexOf(key) >= 0
      || (st.pendingWinQueue || []).some(function (e) { return !!e && e.traitKey === key; });
    var worn = (st.frogs || []).some(function (f) { return !!(f && f.traits && f.traits.aura) && baseKey(f.traits.aura) === key; });
    return won && !worn;
  }
                                                                                  
  function receiptHTML(claim, st, ft) {
    if (!claim || claim.outcome !== 'loss' || claim.auto || !waiting(st, ft)) return '';
    var caption = text('text_aura_reminder_caption', ART_TEXT);
    var art = '<img class="xr-aura-remind__art" src="' + ART + '" alt="' + esc(caption) + '" draggable="false">';
    if(g.FtueArtText) art=FtueArtText.html(ART,art);
    if(caption !== ART_TEXT) art = '<div class="ftt-edited-art"><div class="ftt-edited-picture">'+art+'</div><p>'+esc(caption)+'</p></div>';
    return '<div class="xr-aura-remind" role="note">'
      + '<p class="xr-aura-remind__q">' + esc(text("text_aura_reminder_title", "Remember the Bunny Aura?")) + '</p>'
      + art
      + '</div>';
  }

  var api = { auraKey: auraKey, waiting: waiting, receiptHTML: receiptHTML, ART: ART };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  g.AuraReminder = api;
})(typeof window !== 'undefined' ? window : globalThis);
