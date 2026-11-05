  
                                                                         
                                                                                
                                                                               
                                                                        
  
                      
                                                                                   
                                                                                            
                                                                             
  
                                              
                               
                                                                                         
                                                             
                   
                         
  
                                                      
                                                        
                                                      
                                                                         
                                                       
                                                    
                                                   
                                                               
                                                              
        
                                              
                                                                     
  
        
                                                                              
                                                                                
                                                                                   
                                                                      
   

let UID = 0;

export function applyCotlFilter(target, opts = {}) {
  const cfg = {
    intensity: opts.intensity ?? 1,
    grain: opts.grain ?? 0.16,
    vignette: opts.vignette ?? 0.62,
    scanlines: opts.scanlines ?? 0.45,
    warmth: opts.warmth ?? 1,
    zIndex: opts.zIndex ?? 50,
  };
  const uid = 'cotl' + UID++;

  const cs = getComputedStyle(target);
  if (cs.position === 'static') target.style.position = 'relative';
  const prevOverflow = target.style.overflow;
  target.style.overflow = 'hidden';
  const prevFilter = target.style.filter;

                      
  const wrap = document.createElement('div');
  wrap.dataset.cotl = uid;
  wrap.style.cssText = 'position:absolute;inset:0;pointer-events:none;';

  const grade1 = mk('mix-blend-mode:soft-light;background:linear-gradient(180deg,#5a3a1e,#160c07);');
  const grade2 = mk('mix-blend-mode:multiply;background:radial-gradient(120% 95% at 50% 42%,#fff5e6 0%,#caa27a 45%,#4a2e1c 100%);');
  const scan = mk('background:repeating-linear-gradient(0deg,rgba(0,0,0,.32) 0 1px,transparent 1px 3px);');
  const vig = mk('background:radial-gradient(115% 100% at 50% 46%,transparent 52%,rgba(12,7,4,1) 100%);');
  const frame = mk('box-shadow:inset 0 0 60px 12px rgba(10,5,3,.55);');

                                  
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('preserveAspectRatio', 'none');
  svg.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;mix-blend-mode:overlay;';
  const filter = document.createElementNS(svgNS, 'filter');
  filter.setAttribute('id', uid + '-grain');
  const turb = document.createElementNS(svgNS, 'feTurbulence');
  turb.setAttribute('type', 'fractalNoise');
  turb.setAttribute('baseFrequency', '0.85');
  turb.setAttribute('numOctaves', '2');
  turb.setAttribute('stitchTiles', 'stitch');
  const anim = document.createElementNS(svgNS, 'animate');
  anim.setAttribute('attributeName', 'seed');
  anim.setAttribute('values', '1;7;14;22;31;40');
  anim.setAttribute('dur', '0.9s');
  anim.setAttribute('repeatCount', 'indefinite');
  anim.setAttribute('calcMode', 'discrete');
  turb.appendChild(anim);
  const desat = document.createElementNS(svgNS, 'feColorMatrix');
  desat.setAttribute('type', 'saturate');
  desat.setAttribute('values', '0');
  filter.appendChild(turb); filter.appendChild(desat);
  const rect = document.createElementNS(svgNS, 'rect');
  rect.setAttribute('width', '100%'); rect.setAttribute('height', '100%');
  rect.setAttribute('filter', `url(#${uid}-grain)`);
  svg.appendChild(filter); svg.appendChild(rect);

  wrap.append(grade1, grade2, scan, svg, vig, frame);
  target.appendChild(wrap);

  function mk(css) { const d = document.createElement('div'); d.style.cssText = 'position:absolute;inset:0;' + css; return d; }

  function paint() {
    const k = cfg.intensity;
    target.style.filter = `contrast(${(1 + 0.12 * k).toFixed(3)}) saturate(${(1 - 0.2 * k).toFixed(3)}) sepia(${(0.14 * cfg.warmth * k).toFixed(3)}) brightness(${(1 + 0.02 * k).toFixed(3)})`;
    wrap.style.zIndex = cfg.zIndex;
    grade1.style.opacity = 0.6 * k;
    grade2.style.opacity = 0.28 * k;
    scan.style.opacity = cfg.scanlines;
    svg.style.opacity = cfg.grain;
    vig.style.opacity = cfg.vignette;
    frame.style.opacity = Math.min(1, k);
  }
  paint();

  return {
    set(next = {}) { Object.assign(cfg, next); paint(); },
    get() { return { ...cfg }; },
    destroy() {
      wrap.remove();
      target.style.filter = prevFilter;
      target.style.overflow = prevOverflow;
    },
  };
}

                                                    
class CotlFilterElement extends HTMLElement {
  static get observedAttributes() { return ['intensity', 'grain', 'vignette', 'scanlines', 'warmth']; }
  connectedCallback() {
    if (this._fx) return;
    if (getComputedStyle(this).display === 'inline') this.style.display = 'block';
    this._fx = applyCotlFilter(this, this._opts());
  }
  disconnectedCallback() { this._fx && this._fx.destroy(); this._fx = null; }
  attributeChangedCallback() { this._fx && this._fx.set(this._opts()); }
  _opts() {
    return {
      intensity: this._num('intensity', 1),
      grain: this._num('grain', 0.16),
      vignette: this._num('vignette', 0.62),
      scanlines: this._num('scanlines', 0.45),
      warmth: this._num('warmth', 1),
    };
  }
  _num(a, d) { const v = parseFloat(this.getAttribute(a)); return isNaN(v) ? d : v; }
}
if (typeof customElements !== 'undefined' && !customElements.get('cotl-filter')) {
  customElements.define('cotl-filter', CotlFilterElement);
}
