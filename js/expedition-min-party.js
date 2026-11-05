  
                                                                           
                                                                             
                                               
                                                         
  
                                                                      
                                                                            
                                                                               
                                                                             
                                                                          
                                                        
  
                                                                         
                                                                            
                                                                              
                                                                       
   
(function (g) {
  'use strict';

                                                                              
                                                                  
  function parseMinPartySize(raw) {
    if (raw === undefined || raw === null) return 0;
    var s = String(raw).trim();
    if (s === '') return 0;
    var n = Number(s);
    return (isFinite(n) && n > 0) ? n : 0;
  }

  function isBlockedByMinPartySize(partyLength, minPartySize, ftueOver) {
    if (!ftueOver) return false;
    if (!minPartySize || minPartySize <= 0) return false;
    return partyLength < minPartySize;
  }

                                                                         
                                                                            
                                                                                
  function maxPartySize(expeditionNo, config) {
    var cap = 10;
    try {
      config.rows('Expeditions').forEach(function (row) {
        if (Number(row.expedition_no) !== Number(expeditionNo)) return;
        var raw = row.party_cap;
        if ((typeof raw !== 'number' && typeof raw !== 'string') || String(raw).trim() === '') return;
        var n = Number(raw);
        if (Number.isInteger(n) && n > 0) cap = Math.min(cap, n);
      });
    } catch (e) {                                                         }
    return cap;
  }

  var api = {
    maxPartySize: maxPartySize,
    parseMinPartySize: parseMinPartySize,
    isBlockedByMinPartySize: isBlockedByMinPartySize
  };

  g.ExpeditionMinParty = api;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
})(typeof window !== 'undefined' ? window : globalThis);
