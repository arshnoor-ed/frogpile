                                                                               
                        
                                                                               
                                                                              
                                                                      

                  
                                                                              
                                                                             
                                                                   

                                                                       
                                                                               
                                              
                                                                     

         
                                                                                
                                                                               
                                                   
                                                                     
                                                                     
                                                                             
                                                                             
                                                                           
                                                                                
                                                         

                  
                                                                               
                                                                                
                                                                                
                                                                                
                                                                               
                                  

                                                                      
                                                                               
(function (global) {
  "use strict";

                                                                        
  const PLACEHOLDER =
    "data:image/svg+xml," +
    encodeURIComponent(
      "<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64'>" +
      "<rect width='64' height='64' fill='#ff2fd0'/>" +
      "<rect x='4' y='4' width='56' height='56' fill='none' stroke='#fff' stroke-width='3'/>" +
      "<text x='32' y='42' font-family='sans-serif' font-size='34' text-anchor='middle' fill='#fff'>?</text>" +
      "</svg>"
    );

                                                                       
                                                          
                                                                             
                                                                        
                                                                    
                                                               
                                                                       
  const MANIFEST = {
    base: "assets",
    ext: ".png",
    categories: {
      frog:        { pattern: "frog/{0}/{1}" },                                                             
      flower:      { pattern: "flowers/{0}/{1}" },                                                                      
      ui:          { pattern: "icons/{0}" },                  
      button:      { pattern: "buttons/{0}" },                
      cauldron:    { pattern: "cauldron/{0}" },               
      shop:        { pattern: "shop/{0}" },                   
      lilypad:     { pattern: "lilypad/{0}" },                               
      environment: { pattern: "{0}" },                                                  
      env:         { pattern: "env/{0}/{1}" },                                                     
                                                                               
                                                                               
                                                                                 
                                                                    
      scene:       { pattern: "env/scene/{0}.jpg", noExt: true },
                                                                          
                                                                              
      ui2:         { pattern: "ui2/{0}/{1}" },
    },
                                                                               
                                         

                                                                                
                                                                                 
                                                                                
                                                                               
    overrides: {
      "environment/grass": "env/misc/grass",                                         
      "environment/water": "env/texture/water",                                                                      
      "lilypad/alive":     "env/lilypad/01",
    },
  };

                                                                            
                                                                                 
  const PLANNED_TIER_GEAR = {
    tier1_froglet: { base: ["green","blue","coral","violet","gold","mint"], face: ["eyes","fangs","rune"], head: ["horns","hair","crown"], back: ["wings","aura","tail"] },
    tier2_bipedal: { cloak: ["brawn","guile","spark"], tool: ["shovel","net","lantern"], waist: ["default"], foot: ["default"], pack: ["default"], emblem: ["default"] },
    tier3_knight:  { weapon: ["warmaul","trident","lantern_staff"], helm: ["horns","hair","crown"], shield: ["eyes","fangs","rune"], breastplate: ["default"], pauldron: ["default"], gauntlet: ["default"], greave: ["default"], banner: ["default"], warcrest: ["default"], enchant: ["gale","radiant","venom"] },
  };

  function warnMiss(category, keys, expected) {
    try {
      console.warn(
        "[Assets] unresolved " + category + " asset:",
        "key=" + JSON.stringify(keys),
        "expected=" + (expected || "(no pattern match)") + " — using placeholder"
      );
    } catch (e) {}
  }

                                                                       
                                                                       
                                                                            
                                                                       
  function resolve(category, ...keys) {
    const cat = MANIFEST.categories[category];
    if (!cat) { warnMiss(category, keys, "(unknown category)"); return PLACEHOLDER; }

                                                        
    const logical = category + "/" + keys.join("/");
    if (MANIFEST.overrides[logical] != null) {
      return MANIFEST.base + "/" + MANIFEST.overrides[logical] + (cat.noExt ? "" : MANIFEST.ext);
    }

    let rel = cat.pattern;
    keys.forEach((k, i) => { rel = rel.replace("{" + i + "}", k); });
    if (/\{\d+\}/.test(rel)) { warnMiss(category, keys, rel); return PLACEHOLDER; }                 

    return MANIFEST.base + "/" + rel + (cat.noExt ? "" : MANIFEST.ext);
  }

                                                                               
  const ui        = (name) => resolve("ui", name);
  const button    = (name) => resolve("button", name);
  const shop      = (name) => resolve("shop", name);
  const env       = (name) => resolve("environment", name);
                                                                          
                                                                                
                                                         
  const envProp   = (group, name) => resolve("env", group, name);
                                      
  const scene     = (name) => resolve("scene", name);
                                                         
  const uiArt     = (group, name) => resolve("ui2", group, name);
                                                                          
                                                                        
                                                               
  const envVariant = (group, count, seed) =>
    envProp(group, String(1 + (Math.abs(Math.floor(seed)) % count)).padStart(2, "0"));
  const cauldron  = ()     => resolve("cauldron", "cauldron");
  const padSprite = ()     => resolve("lilypad", "alive");
  const cauldronBubble = (n) => resolve("cauldron", "cauldron_BUBBLE_0" + n);
  const pondBase  = (autumn) => (autumn ? shop("floor_base_autumn") : env("water"));                                                 

                                                                       
                                                                                
                                                                                  
                                                                                     
                                                                                     
                                                                                 
                                                                    
                                                                       
  const TIER_MERGE = {
    body: "tier1/body/round",                                                         
    eyes: "tier1/body/eyes",                                                                 
    angryEyes: "tier1/body/angry_eyes",                                                             
    armor: "tier3/merge 1/armor",                                                                                                  
    tiers: {
      1: {
                                                                                                                                    
        1: ["bleh_-5ATKDebuff", "blush", "cat_+3ATKBoost", "frown", "goat_+3ATKBoost", "meh_-5ATKDebuff", "round", "small", "smiling", "sparkle_+3ATKBoost", "spirals_-5ATKDebuff", "teary_-5ATKDebuff", "tongue_+3ATKBoost"],           
        2: ["antlers", "crystal", "devil_+5ATKBoost", "dragon_+2ATKBoost", "goat_+1ATKBoost", "leaves", "mushroom", "mushroom_cap", "ox_+3ATKBoost", "ram", "spiked", "tiny", "unicorn_+3ATKBoost", "viking_+4ATKBoost"],              
        3: ["angel", "arms_+10ATKBoost", "butterfly", "fairy"],
      },
      2: {
        1: ["frog_laborer_TIER2_merge2_01", "frog_laborer_TIER2_merge2_02", "frog_laborer_TIER2_merge2_03"],                                                   
        2: ["frog_laborer_TIER2_merge1_01", "frog_laborer_TIER2_merge1_02", "frog_laborer_TIER2_merge1_03"],                                                   
        3: ["frog_laborer_TIER3_merge1_01", "frog_laborer_TIER3_merge1_02", "frog_laborer_TIER3_merge1_03"],
      },
      3: {},                                                                      
    },
                                                                                                   
    bodies: { 1: "tier1/body/round", 2: "tier2_laborer/body/base_laborer_body", 3: "tier3_knight/body/knight_baseBody" },
                                                                                                        
                                                                                                              
                                                                                                            
    heritage: {
      2: { base: "tier2_laborer", slots: {
        1: ["bleh","blush","cat","frown","goat","meh","round","small","smiling","sparkle","spirals","teary","tongue","deepHolloweyes_newTrait_deepHollow","eyes_newTrait_FrogMarket_Mutant01","mossMarsheyes_newTrait_reedMarsh","sparkleEyes_newTrait_LilyCove"],
        2: ["antlers","crystal","devil","dragon","goat","leaves","mushroom","mushroom_cap","ox","ram","spiked","tiny","unicorn","viking","deepHollow_newTrait_deepHollow","eyeHorns_newTrait_FrogMarket_Mutant01","mossAntlers_newTrait_reedMarsh","whiteLily_newTrait_LilyCove"],
        3: ["angel","arms","butterfly","fairy","whiteLilyWings_newTrait_LilyCove"],
      }},
      3: { base: "tier3_knight", slots: {
        1: ["bleh","blush","cat","frown","goat","meh","round","small","smiling","sparkle","spirals","teary","tongue","deepHolloweyes_newTrait_deepHollow","eyes_newTrait_FrogMarket_Mutant01","mossMarsheyes_newTrait_reedMarsh","sparkleEyes_newTrait_LilyCove"],
        2: ["antlers","crystal","devil","dragon","goat","leaves","mushroom","mushroom_cap","ox","ram","spiked","tiny","unicorn","viking","deepHollow_newTrait_deepHollow","eyeHorns_newTrait_FrogMarket_Mutant01","mossAntlers_newTrait_reedMarsh","whiteLily_newTrait_LilyCove"],
        3: ["angel","arms","butterfly","fairy","whiteLilyWings_newTrait_LilyCove"],
      }},
    },
  };
                                                                                       
  const tierBody = (worldTier) => MANIFEST.base + "/" + (TIER_MERGE.bodies[worldTier] || TIER_MERGE.bodies[1] || TIER_MERGE.body) + MANIFEST.ext;
                                                                                                                      
                                                                                                                        
  const heritageTraitPath = (worldTier, key, slot) => {
    const h = TIER_MERGE.heritage[worldTier]; if (!h) return null;
    const p = (s) => (h.slots[s] && h.slots[s].indexOf(key) >= 0)
      ? encodeURI(MANIFEST.base + "/" + h.base + "/tier1_merge" + s + "_traitHeritage/" + key + MANIFEST.ext) : null;
    return p(slot) || (function(){ for (const s in h.slots) { const r = p(s); if (r) return r; } return null; })();
  };
  const tierEyes = () => MANIFEST.base + "/" + TIER_MERGE.eyes + MANIFEST.ext;
  const tierAngryEyes = () => MANIFEST.base + "/" + TIER_MERGE.angryEyes + MANIFEST.ext;
  const tierArmor = () => encodeURI(MANIFEST.base + "/" + TIER_MERGE.armor + MANIFEST.ext);
  function mergeSlotFor(mergeCount) {
    const n = Math.max(1, mergeCount || 1);
    return { worldTier: Math.floor((n - 1) / 3) + 1, slot: ((n - 1) % 3) + 1 };
  }
                                                                                        
  const mergeTraitPath = (worldTier, slot, file) =>
    encodeURI(MANIFEST.base + "/tier" + worldTier + "/merge " + slot + "/" + file + MANIFEST.ext);
                                                                                     
  const TRAIT_ATK_RE = /_([+-]\d+)ATK(?:Boost|Debuff)?/i;
  const traitKeyOf = (file) => String(file || "").replace(TRAIT_ATK_RE, "");                                                           
  const traitAtkOf = (file) => { const m = String(file || "").match(TRAIT_ATK_RE); return m ? parseInt(m[1], 10) : 0; };                              
  function mergeTraitPool(mergeCount) {
    const { worldTier, slot } = mergeSlotFor(mergeCount);
    const files = ((TIER_MERGE.tiers[worldTier] || {})[slot]) || [];
    return files.map((f) => ({ worldTier, slot, key: traitKeyOf(f), path: mergeTraitPath(worldTier, slot, f), atk: traitAtkOf(f) }));
  }
  function pickMergeTrait(mergeCount, rnd) {
    const pool = mergeTraitPool(mergeCount);
    if (!pool.length) return null;
    const r = rnd != null ? rnd : Math.random();
    return pool[Math.floor(r * pool.length) % pool.length];
  }
  function maxMergeAuthored() {                                                             
    let n = 0; for (let m = 1; m <= 90; m++) { if (mergeTraitPool(m).length) n = m; else break; } return n;
  }

                                                                       
                                                                  
                                                                         
                                                                         
                                                                         
                                                                       
  function getFrogLayers(dna) {
    const F = global.FrogDNA;
    if (!F || !dna || !dna.genes) { warnMiss("frog", ["<dna>"], "FrogDNA not loaded / bad dna"); return []; }
    const T = F.TRAITS, order = F.LAYER_ORDER;
    const expressed = F._internal.expressedAllele, byKey = F._internal.optionByKey, tintOf = F._internal.tintFilterFor;
    const TINT_TARGETS = { bodyColor: "bodyShape", bellyColor: null, patternColor: "pattern", eyeColor: "eyeType" };

    const slot = {};
    order.forEach((l) => (slot[l] = { key: null, filter: "" }));

    for (const gene in T) {
      const g = T[gene], pair = dna.genes[gene];
      if (!pair) continue;
      const visible = expressed(gene, pair.a, pair.b);
      const opt = byKey(gene, visible);
      const kind = opt.kind || g.kind;
      if (kind === "tint") {
        const targetGene = TINT_TARGETS[gene];
        const targetLayer = targetGene ? T[targetGene].layer : g.layer;
        slot[targetLayer].filter = tintOf(opt);
        if (!targetGene && !slot[targetLayer].key) slot[targetLayer].key = "base";
      } else if (kind === "asset") {
        slot[g.layer].key = visible;
      }
    }

    const out = [];
    order.forEach((layer, z) => {
      const s = slot[layer];
      if (!s.key) return;
      out.push({ layer, key: s.key, path: resolve("frog", layer, s.key), z, filter: s.filter });
    });
    return out;
  }

                                                                           
                                                                             
  function getFlowerSprite(type, stage) { return resolve("flower", type, stage); }

                                                                       
                                                                          
                                                                           
                                                  
                                                                       
  const cache = new Map();
  function preload(list) {
    const arr = (list || []).filter(Boolean);
    return Promise.all(arr.map((h) => new Promise((res) => {
      if (typeof h !== "string" || h.slice(0, 5) === "data:") { res(h); return; }
      if (cache.has(h)) { res(h); return; }
      const img = new Image();
      img.onload = () => { cache.set(h, img); res(h); };
      img.onerror = () => { res(h); };
      img.src = h;
    })));
  }

                                                                       
                                                                         
                                                                          
                                                                       
                                                                       
  function injectCSSVars() {
    if (typeof document === "undefined") return;
    const r = document.documentElement.style;
    const set = (name, handle) => r.setProperty(name, "url('" + handle + "')");
    set("--asset-ui-arrow", ui("arrow"));
    set("--asset-ui-textbox", ui("textbox"));
                                                                              
    set("--asset-env-water", env("water"));
  }

                                                                       
                                                                      
                                                                    
                                           
                                                                       
  function frogLayerExpected() {
    const F = global.FrogDNA, out = [];
    if (!F) return out;
    for (const gene in F.TRAITS) {
      const g = F.TRAITS[gene];
      for (const opt of g.options) {
        const kind = opt.kind || g.kind;
        if (kind !== "asset") continue;                                       
        out.push({ group: "frog-layer", layer: g.layer, key: opt.k, path: resolve("frog", g.layer, opt.k) });
      }
    }
                                                                 
    out.push({ group: "frog-layer", layer: "belly", key: "base", path: resolve("frog", "belly", "base") });
    return out;
  }

                                                                    
  function wiredExpected() {
    const w = [];
    ["arrow", "textbox", "pointClicker01", "pointClicker02"].forEach((n) => w.push({ group: "wired", path: ui(n) }));
    w.push({ group: "wired", path: padSprite() });
    ["bud", "bloom", "dead"].forEach((s) => w.push({ group: "wired", path: getFlowerSprite("lily", s) }));
    ["pond", "colony", "frimoire", "shop", "expeditions", "upgrades", "expeditionCave"].forEach((n) => w.push({ group: "wired", path: button(n) }));
    ["laborer", "knight"].forEach((r) => w.push({ group: "wired", path: resolve("frog", "tier", r) }));
    w.push({ group: "wired", path: cauldron() });
    for (let i = 1; i <= 4; i++) w.push({ group: "wired", path: cauldronBubble(i) });
    w.push({ group: "wired", path: shop("floor_base_autumn") });
    return w;
  }

  function plannedExpected() {
    const out = [];
    for (const tier in PLANNED_TIER_GEAR) {
      const slots = PLANNED_TIER_GEAR[tier];
      for (const s in slots) {
        for (const v of slots[s]) {
          out.push({ group: "planned", path: MANIFEST.base + "/frogs/" + tier + "/" + s + "/" + v + MANIFEST.ext });
        }
      }
    }
    return out;
  }

  function expectedManifest() {
    return { wired: wiredExpected(), frogLayers: frogLayerExpected(), planned: plannedExpected() };
  }

  function expectedPaths() {
    const m = expectedManifest();
    return [].concat(m.wired, m.frogLayers, m.planned).map((e) => e.path);
  }

  function dumpExpected() {
                                                                             
    const m = expectedManifest();
    return JSON.stringify(
      { wired: m.wired.map((e) => e.path), frogLayers: m.frogLayers.map((e) => e.path), planned: m.planned.map((e) => e.path) },
      null, 2
    );
  }

                                                                       
                                                                          
                                                                          
                                                                       
                               
                                                                       
  function exists(path) {
    return new Promise((res) => {
      const img = new Image();
      img.onload = () => res(true);
      img.onerror = () => res(false);
      img.src = path;
    });
  }

  async function validate(opts) {
    opts = opts || {};
    const m = expectedManifest();
    const report = { wired: { total: 0, missing: [] }, frogLayers: { total: 0, missing: [] }, planned: { total: 0 } };

    async function check(entries, bucket) {
      bucket.total = entries.length;
      if (opts.probe === false) return;
      const results = await Promise.all(entries.map((e) => exists(e.path)));
      entries.forEach((e, i) => { if (!results[i]) bucket.missing.push(e.path); });
    }

    await check(m.wired, report.wired);
    await check(m.frogLayers, report.frogLayers);
    report.planned.total = m.planned.length;

    try {
      console.group("%c[Assets] validation", "font-weight:bold");
      const okW = report.wired.total - report.wired.missing.length;
      console.log("wired assets: " + okW + "/" + report.wired.total + (report.wired.missing.length ? " — MISSING:" : " ✓"));
      report.wired.missing.forEach((p) => console.warn("  ✗ " + p));
      const okF = report.frogLayers.total - report.frogLayers.missing.length;
      console.log("frog layer art: " + okF + "/" + report.frogLayers.total + " present" + (report.frogLayers.missing.length ? " — missing " + report.frogLayers.missing.length + " (rendered layers silently skipped):" : " ✓"));
      report.frogLayers.missing.forEach((p) => console.log("  · pending " + p));
      console.log("tier-gear (planned): " + report.planned.total + " keys, art not authored yet");
      console.groupEnd();
    } catch (e) {}
    return report;
  }

                               
  const Assets = {
    MANIFEST, PLANNED_TIER_GEAR, PLACEHOLDER, TIER_MERGE,
    resolve, getFrogLayers, getFlowerSprite,
    tierBody, tierEyes, tierAngryEyes, tierArmor, heritageTraitPath, mergeSlotFor, mergeTraitPool, pickMergeTrait, maxMergeAuthored, traitKeyOf, traitAtkOf,
    ui, button, shop, env, envProp, envVariant, scene, uiArt, cauldron, cauldronBubble, pondBase, padSprite,
    preload, injectCSSVars,
    expectedManifest, expectedPaths, dumpExpected, validate,
                                                                          
                                                                             
                                             
    embedded: {
      frogColor: (k) => (typeof FROG_COLOR_IMGS !== "undefined" ? (FROG_COLOR_IMGS[k] || FROG_COLOR_IMGS.green) : PLACEHOLDER),
      butterfly: () => (typeof BUTTERFLY_IMG !== "undefined" ? BUTTERFLY_IMG : PLACEHOLDER),
      lilypad: (i) => (typeof LILYPAD_IMGS !== "undefined" ? LILYPAD_IMGS[i] : PLACEHOLDER),
      flowerSkin: (i) => (typeof FLOWER_IMGS !== "undefined" ? FLOWER_IMGS[i] : PLACEHOLDER),
      witchThumb: (k) => (typeof WITCH_THUMBS !== "undefined" ? (WITCH_THUMBS[k] || WITCH_THUMBS.default) : PLACEHOLDER),
    },
  };

  if (typeof module !== "undefined" && module.exports) module.exports = Assets;
  else global.Assets = Assets;

                                                                                 
  try { injectCSSVars(); } catch (e) {}
})(typeof window !== "undefined" ? window : globalThis);
