  
                                                                                     
  
                                                                                
                                                                
  
                      
  
                               
                                 
                                                                                                         
                                                           
  
                                                 
                                                          
                                                  
                                                                                  
                                                          
                                                        
                                                                    
           
                                                            
                                                                      
  
        
                                                                                
                                                                                       
                                                                                          
                                                                            
   

const VERT = `attribute vec2 p; varying vec2 vUv;
  void main(){ vUv = p*0.5+0.5; gl_Position = vec4(p,0.0,1.0); }`;

const FRAG = `precision highp float;
  uniform sampler2D tex; uniform float t; uniform float amp; uniform float sparkle;
  varying vec2 vUv;
  void main(){
    vec2 uv = vUv;
    vec2 d;
    d.x = sin(uv.y*8.0 + t*0.70) + 0.5*sin(uv.y*17.0 - t*0.53) + 0.35*sin(uv.x*5.0 + t*0.3);
    d.y = sin(uv.x*9.0 - t*0.62) + 0.5*sin(uv.x*15.0 + t*0.47) + 0.35*sin(uv.y*6.0 - t*0.28);
    uv += d * amp;
    uv += 0.004*vec2(sin(t*0.20), cos(t*0.17));
    vec3 col = texture2D(tex, uv).rgb;
    float sh = sin(uv.x*42.0 + t*2.1)*sin(uv.y*39.0 - t*1.7);
    sh += 0.5*sin(uv.x*70.0 - t*1.3)*sin(uv.y*66.0 + t*1.1);
    col += sparkle * sh;
    gl_FragColor = vec4(col, 1.0);
  }`;

                                                                     
const AMP_BASE = 0.014;                                     
const SPARKLE_BASE = 0.06;                                       

function compile(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
  return s;
}

function program(gl, vs, fs) {
  const p = gl.createProgram();
  gl.attachShader(p, compile(gl, gl.VERTEX_SHADER, vs));
  gl.attachShader(p, compile(gl, gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
  return p;
}

function loadImage(src) {
  if (src instanceof HTMLImageElement) {
    return src.complete && src.naturalWidth
      ? Promise.resolve(src)
      : new Promise((res, rej) => { src.onload = () => res(src); src.onerror = rej; });
  }
  if (src instanceof HTMLCanvasElement || (typeof ImageBitmap !== 'undefined' && src instanceof ImageBitmap)) {
    return Promise.resolve(src);
  }
  return new Promise((res, rej) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => res(img);
    img.onerror = rej;
    img.src = src;
  });
}

export function createWaterFlow(canvas, opts = {}) {
  const state = {
    flowSpeed: opts.flowSpeed ?? 1,
    distortion: opts.distortion ?? 1,
    sparkle: opts.sparkle ?? 1
  };
  let raf = null, gl = null, destroyed = false, start = 0;
  const maxDpr = opts.maxDpr ?? 2;

  const resize = () => {
    if (!gl) return;
    const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
    const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
    const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w; canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
  };

  loadImage(opts.image).then((img) => {
    if (destroyed) return;
    gl = canvas.getContext('webgl', { antialias: true });
    if (!gl) {                                          
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      return;
    }

    const prog = program(gl, VERT, FRAG);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
    const p = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(p);
    gl.vertexAttribPointer(p, 2, gl.FLOAT, false, 0, 0);

                                                       
    const pot = document.createElement('canvas');
    pot.width = pot.height = 1024;
    pot.getContext('2d').drawImage(img, 0, 0, 1024, 1024);
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, pot);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    const uT = gl.getUniformLocation(prog, 't');
    const uAmp = gl.getUniformLocation(prog, 'amp');
    const uSparkle = gl.getUniformLocation(prog, 'sparkle');

    resize();
    window.addEventListener('resize', resize);

    start = performance.now();
    const loop = (now) => {
      if (destroyed) return;
      resize();
      const t = (now - start) / 1000 * state.flowSpeed;
      gl.uniform1f(uT, t);
      gl.uniform1f(uAmp, AMP_BASE * state.distortion);
      gl.uniform1f(uSparkle, SPARKLE_BASE * state.sparkle);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
  }).catch((e) => console.error('[water-flow] failed to load image', e));

  return {
    set(next = {}) { Object.assign(state, next); },
    get() { return { ...state }; },
    destroy() {
      destroyed = true;
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      const lose = gl && gl.getExtension('WEBGL_lose_context');
      if (lose) lose.loseContext();
    }
  };
}

                                                                                
class WaterFlowElement extends HTMLElement {
  static get observedAttributes() { return ['src', 'flow-speed', 'distortion', 'sparkle']; }
  connectedCallback() {
    if (this._handle) return;
    this.style.display = this.style.display || 'block';
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'display:block;width:100%;height:100%;';
    this.appendChild(canvas);
    this._handle = createWaterFlow(canvas, {
      image: this.getAttribute('src'),
      flowSpeed: this._num('flow-speed', 1),
      distortion: this._num('distortion', 1),
      sparkle: this._num('sparkle', 1)
    });
  }
  disconnectedCallback() { this._handle && this._handle.destroy(); this._handle = null; }
  attributeChangedCallback() {
    if (!this._handle) return;
    this._handle.set({
      flowSpeed: this._num('flow-speed', 1),
      distortion: this._num('distortion', 1),
      sparkle: this._num('sparkle', 1)
    });
  }
  _num(attr, dflt) { const v = parseFloat(this.getAttribute(attr)); return isNaN(v) ? dflt : v; }
}
if (typeof customElements !== 'undefined' && !customElements.get('water-flow')) {
  customElements.define('water-flow', WaterFlowElement);
}
