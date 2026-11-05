                                                                             
                                                                             
                                                                                    
(function(g){
  'use strict';
  function esc(v){return String(v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function overlays(art){
    if(typeof FPConfig === 'undefined' || !FPConfig.text) return '';
    var labels=[];
    if(art.endsWith("/tooltip-1.png")) labels.push(["text_art_tooltip_1_new", "NEW!", [77, 3, 18, 16]]);
    if(art.endsWith("/tooltip-3a.png")) labels.push(["text_art_tooltip_3a_loot", "EXPEDITION LOOT", [11, 54, 34, 11]]);
    if(art.endsWith("/tooltip-bones.png")) labels.push(["text_art_tooltip_bones_empty", "NO BONES!", [11, 54, 21, 11]]);
    if(art.endsWith("/tooltip-bones.png")) labels.push(["text_art_tooltip_bones_sacrifice", "Sacrifice for bones", [70, 11, 25, 17]]);
    if(art.endsWith("/tooltip-exp.png")) labels.push(["text_art_tooltip_exp_empty", "ALL GONE!", [11, 54, 21, 11]]);
    if(art.endsWith("/tooltip-gear.png")) labels.push(["text_art_tooltip_gear_blueprint", "BLUEPRINT", [10, 54, 22, 11]]);
    if(art.endsWith("/tooltip-gear.png")) labels.push(["text_art_tooltip_gear_atk", "+ATK", [57, 9, 14, 11]]);
    if(art.endsWith("/tooltip-mats.png")) labels.push(["text_art_tooltip_mats_short", "NOT ENOUGH!", [9, 54, 26, 11]]);
    if(art.endsWith("/tooltip-rematch.png")) labels.push(["text_art_tooltip_rematch_frog", "BUNNY FROG", [13, 54, 25, 11]]);
    if(art.endsWith("/tooltip-rematch.png")) labels.push(["text_art_tooltip_rematch_versus", "VS", [48, 27, 12, 17]]);
    if(art.endsWith("/tooltip-upgrades.png")) labels.push(["text_art_tooltip_upgrades_pond", "BIGGER POND", [11, 53, 26, 11]]);
    if(art.endsWith("/tooltip-upgrades.png")) labels.push(["text_art_tooltip_upgrades_gear", "NEW GEAR", [76, 53, 20, 11]]);
    if(art.endsWith("/tooltip-upgrades.png")) labels.push(["text_art_tooltip_upgrades_new", "NEW!", [58, 9, 14, 11]]);
    if(art.endsWith("/combat-tap.png")) labels.push(["text_art_combat_tap_help", "Help!", [31, 12, 13, 10]]);
    if(art.endsWith("/combat-dodge.png")) labels.push(["text_art_combat_dodge_dodge", "Dodge!", [42, 5, 26, 17]]);
    return labels.map(function(row){
      var copy=FPConfig.text(row[0],row[1]); if(copy===row[1]) return '';
      var r=row[2];return '<span class="ftt-raster-label" style="left:'+r[0]+'%;top:'+r[1]+'%;width:'+r[2]+'%;height:'+r[3]+'%">'+esc(copy)+'</span>';
    }).join('');
  }
  function html(art,picture){
    var tags=overlays(art);return tags ? '<div class="ftt-raster-art">'+picture+tags+'</div>' : picture;
  }
  function node(art,img){
    var tags=overlays(art);if(!tags) return img;
    var box=document.createElement('div');box.className='ftt-raster-art';box.innerHTML=tags;box.prepend(img);return box;
  }
  g.FtueArtText={html:html,node:node};
})(typeof window !== 'undefined' ? window : globalThis);
