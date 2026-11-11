(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,53122,e=>{"use strict";var o=e.i(43476),t=e.i(75056),i=e.i(98903),a=e.i(71645),s=e.i(90072);e.i(43087);let n=`
varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position.xy, 0.999, 1.0); }
`,r=`
precision highp float;
uniform float uTime; uniform vec2 uMouse; uniform vec2 uRes; uniform float uScroll; uniform float uOct; uniform float uEnergy;
varying vec2 vUv;
vec3 permute(vec3 x){ return mod(((x*34.0)+1.0)*x, 289.0); }
float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy)); vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz; x12.xy -= i1; i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m; m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0; vec3 h = abs(x) - 0.5; vec3 ox = floor(x + 0.5); vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g; g.x = a0.x * x0.x + h.x * x0.y; g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
float fbm(vec2 p){
  float a = 0.5, s = 0.0;
  for (int i = 0; i < 4; i++) { if (float(i) >= uOct) break; s += a * snoise(p); p *= 2.03; a *= 0.5; }
  return s;
}
void main(){
  float asp = uRes.x / uRes.y;
  vec2 p = (vUv - 0.5) * vec2(asp, 1.0);
  vec2 m = uMouse * 0.5 * vec2(asp, 1.0);
  float d = length(p - m);
  p += (p - m) / max(d, 1e-3) * (0.035 + 0.05 * uEnergy) * sin(d * 22.0 - uTime * 5.0) * exp(-d * 4.0);
  float t = uTime * 0.07;
  vec2 q = vec2(fbm(p * 1.2 + vec2(0.0, t)), fbm(p * 1.2 + vec2(5.2, -t)));
  float f = fbm(p * 1.5 + q * 1.7 + vec2(t * 2.0, uScroll * 1.6));
  vec3 brasa = vec3(1.0, 0.31, 0.12), naranja = vec3(1.0, 0.47, 0.22), mostaza = vec3(1.0, 0.776, 0.16), chicle = vec3(1.0, 0.62, 0.78);
  vec3 col = mix(brasa, naranja, smoothstep(-0.45, 0.45, f));
  col = mix(col, mostaza, smoothstep(0.2, 0.75, q.x) * 0.7);
  col = mix(col, chicle, smoothstep(0.25, 0.8, q.y) * 0.55);
  col += sin(d * 42.0 - uTime * 6.0) * exp(-d * 3.2) * (0.035 + 0.05 * uEnergy);
  float g = fract(sin(dot(vUv * uRes + uTime, vec2(12.9898, 78.233))) * 43758.5453);
  col += (g - 0.5) * 0.045;
  gl_FragColor = vec4(col, 1.0);
}
`,l=`
uniform float uTime; uniform float uAmp; uniform float uScroll; uniform vec2 uMouse; uniform float uPhase;
varying vec3 vPos; varying vec2 vUv;
void main(){
  vUv = uv;
  vec3 p = position; float x = p.x;
  float env = smoothstep(-7.0, -3.5, x) * (1.0 - smoothstep(3.5, 7.0, x));
  float infl = exp(-pow((x - uMouse.x * 5.0) * 0.55, 2.0));
  float amp = (0.32 + uAmp * 1.1 * infl + uScroll * 0.7) * env;
  float w = sin(x * 1.25 + uTime * 1.5 + uPhase) * amp + sin(x * 2.9 - uTime * 1.15 + uPhase * 2.0) * amp * 0.35;
  float tw = x * 0.42 + uTime * 0.55 + uPhase + infl * uAmp * 2.4;
  vec3 q = vec3(x, p.y * cos(tw), p.y * sin(tw));
  q.y += w + uMouse.y * infl * 0.6;
  vec4 wp = modelMatrix * vec4(q, 1.0);
  vPos = wp.xyz;
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`,u=`
uniform vec3 uC1; uniform vec3 uC2; uniform vec3 uC3; uniform float uTime;
varying vec3 vPos; varying vec2 vUv;
void main(){
  vec3 n = normalize(cross(dFdx(vPos), dFdy(vPos)));
  vec3 v = normalize(cameraPosition - vPos);
  float fres = pow(1.0 - abs(dot(n, v)), 2.0);
  float light = 0.62 + 0.38 * abs(dot(n, normalize(vec3(0.3, 0.8, 0.6))));
  vec3 base = mix(uC1, uC2, smoothstep(0.1, 0.9, vUv.x));
  base = mix(base, uC3, smoothstep(0.0, 1.0, vUv.y) * 0.35);
  float lines = smoothstep(0.92, 1.0, fract(vUv.x * 44.0 - uTime * 0.35)) * 0.12;
  vec3 col = base * light + fres * vec3(1.0, 0.95, 0.9) * 0.55 - lines;
  gl_FragColor = vec4(col, 1.0);
}
`,v=["#ffc629","#ff9fc8","#fff2ec"],c=["#ff9fc8","#fff2ec","#ffc629"],m=["#fff2ec","#ffc629","#ff9fc8"];function f({s:e,oct:t}){let l=(0,a.useMemo)(()=>new s.Zg({vertexShader:n,fragmentShader:r,depthWrite:!1,depthTest:!1,uniforms:{uTime:{value:0},uMouse:{value:new s.wq},uRes:{value:new s.wq(1,1)},uScroll:{value:0},uOct:{value:t},uEnergy:{value:0}}}),[t]);return(0,i.f)((o,t)=>{let i=l.uniforms;i.uTime.value+=Math.min(t,.05),i.uMouse.value.copy(e.mouse),i.uRes.value.set(o.size.width,o.size.height),i.uScroll.value=e.scroll.v,i.uEnergy.value=e.energy.v}),(0,o.jsx)("mesh",{frustumCulled:!1,renderOrder:-1,material:l,children:(0,o.jsx)("planeGeometry",{args:[2,2]})})}function x({s:e,seg:t,colors:n,phase:r,y:v,z:c,width:m}){let f=(0,a.useMemo)(()=>new s.Zg({vertexShader:l,fragmentShader:u,side:s.Vs,uniforms:{uTime:{value:0},uAmp:{value:0},uScroll:{value:0},uMouse:{value:new s.wq},uPhase:{value:r},uC1:{value:new s.Es().setStyle(n[0],s.Rg)},uC2:{value:new s.Es().setStyle(n[1],s.Rg)},uC3:{value:new s.Es().setStyle(n[2],s.Rg)}}}),[n,r]);return(0,i.f)((o,t)=>{let i=f.uniforms;i.uTime.value+=Math.min(t,.05),i.uAmp.value=e.energy.v,i.uScroll.value=e.scroll.v,i.uMouse.value.copy(e.mouse)}),(0,o.jsx)("mesh",{position:[0,v,c],rotation:[.18,-.25,-.12],material:f,frustumCulled:!1,children:(0,o.jsx)("planeGeometry",{args:[14,m,t,6]})})}function p({s:e}){let o=(0,a.useRef)(new s.wq);return(0,i.f)((t,i)=>{let a=1-Math.pow(.002,Math.min(i,.05));e.mouse.lerp(e.target,a);let s=o.current.distanceTo(e.target)/Math.max(i,.001);o.current.copy(e.target),e.energy.v+=(Math.min(.35*s,1.4)-e.energy.v)*Math.min(3*i,1),e.scroll.v+=(Math.min(window.scrollY/window.innerHeight,1.5)-e.scroll.v)*Math.min(6*i,1)}),null}e.s(["default",0,function({onReady:e,lite:i}){let n=(0,a.useRef)(null),[r,l]=(0,a.useState)(!0),u=(0,a.useMemo)(()=>({mouse:new s.wq(.4,.1),target:new s.wq(.4,.1),energy:{v:.15},scroll:{v:0}}),[]);(0,a.useEffect)(()=>{let e=e=>u.target.set(e.clientX/window.innerWidth*2-1,-(e.clientY/window.innerHeight*2-1));window.addEventListener("pointermove",e,{passive:!0});let o=0;if(i){let e=t=>{u.target.set(.7*Math.sin(t/2600),.4*Math.cos(t/3400)),o=requestAnimationFrame(e)};o=requestAnimationFrame(e)}let t=new IntersectionObserver(([e])=>l(e.isIntersecting),{threshold:0});return t.observe(n.current),()=>{window.removeEventListener("pointermove",e),cancelAnimationFrame(o),t.disconnect()}},[u,i]);let h=i?120:280;return(0,o.jsx)("div",{ref:n,style:{position:"absolute",inset:0},children:(0,o.jsxs)(t.f,{dpr:i?[1,1.5]:[1,1.75],flat:!0,linear:!0,frameloop:r?"always":"never",camera:{position:[0,0,7],fov:42},gl:{antialias:!0,alpha:!1,powerPreference:"high-performance"},onCreated:()=>requestAnimationFrame(e),"aria-hidden":"true",children:[(0,o.jsx)(p,{s:u}),(0,o.jsx)(f,{s:u,oct:i?2:4}),(0,o.jsx)(x,{s:u,seg:h,colors:v,phase:0,y:-1.55,z:0,width:.95}),(0,o.jsx)(x,{s:u,seg:h,colors:c,phase:2.1,y:-2.05,z:-1.2,width:.45}),!i&&(0,o.jsx)(x,{s:u,seg:h,colors:m,phase:4.2,y:-.6,z:-2.4,width:.35})]})})}])},58798,function(e){e.n(e.i(53122))}]);