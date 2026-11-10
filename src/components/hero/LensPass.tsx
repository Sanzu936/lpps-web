"use client";
import { useEffect, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { heroState } from "./heroState";

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

/**
 * Lente de cristal líquido: amplía y curva lo que hay debajo como una gota de vidrio,
 * con dispersión cromática, filo de luz y reflejo. Se estira en la dirección en la que
 * se mueve, como un líquido.
 */
const fragmentShader = /* glsl */ `
  uniform sampler2D tScene;
  uniform vec2 uRes;
  uniform vec2 uCenter;
  uniform vec2 uVel;
  uniform float uRadius;
  uniform float uAmt;
  uniform float uTime;
  varying vec2 vUv;

  void main() {
    vec4 base = texture2D(tScene, vUv);
    vec3 col = base.rgb;
    vec2 p = vUv * uRes;
    vec2 c = uCenter * uRes;
    vec2 d = p - c;

    // deformación líquida: estiramiento según la velocidad y ondulación del borde
    float speed = clamp(length(uVel) * 2.2, 0.0, 0.45);
    vec2 vd = length(uVel) > 1e-5 ? normalize(uVel) : vec2(1.0, 0.0);
    vec2 vp = vec2(-vd.y, vd.x);
    vec2 dl = vd * dot(d, vd) / (1.0 + speed) + vp * dot(d, vp) * (1.0 + speed * 0.45);
    float ang = atan(dl.y, dl.x);
    float wobble = 1.0 + 0.035 * sin(ang * 3.0 + uTime * 1.7) + 0.02 * sin(ang * 5.0 - uTime * 2.3);
    float r = length(dl) / (uRadius * wobble);

    if (r < 1.0 && uAmt > 0.001) {
      float z = sqrt(1.0 - r * r);
      vec2 n = dl / uRadius;
      // refracción: el centro amplía y el borde curva la imagen hacia dentro
      float s = mix(0.62, 0.92, z);
      vec2 uvR = (c + d * (s - 0.035)) / uRes;
      vec2 uvG = (c + d * s) / uRes;
      vec2 uvB = (c + d * (s + 0.035)) / uRes;
      vec3 refr = vec3(texture2D(tScene, uvR).r, texture2D(tScene, uvG).g, texture2D(tScene, uvB).b);
      refr *= 1.12;
      refr += vec3(0.015, 0.045, 0.07) * z;
      // filo de luz (fresnel) y reflejo especular arriba a la izquierda
      float rim = smoothstep(0.78, 1.0, r);
      refr += vec3(0.72, 0.92, 1.0) * rim * 0.42;
      float spec = smoothstep(0.42, 0.0, length(n - vec2(-0.32, 0.38)));
      refr += vec3(1.0) * spec * spec * 0.35;
      float edge = smoothstep(1.0, 0.965, r);
      col = mix(col, refr, edge * uAmt);
    } else if (uAmt > 0.001) {
      // sombra suave alrededor de la gota
      float sh = smoothstep(1.35, 1.0, r);
      col *= 1.0 - sh * 0.28 * uAmt;
    }

    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`;

export default function LensPass({ radius = 120 }: { radius?: number }) {
  const gl = useThree((s) => s.gl);
  const size = useThree((s) => s.size);
  const dpr = useThree((s) => s.viewport.dpr);

  const rt = useMemo(
    () =>
      new THREE.WebGLRenderTarget(1, 1, {
        type: THREE.HalfFloatType,
        depthBuffer: true,
      }),
    []
  );
  const quad = useMemo(() => {
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        tScene: { value: rt.texture },
        uRes: { value: new THREE.Vector2(1, 1) },
        uCenter: { value: new THREE.Vector2(heroState.lens.x, heroState.lens.y) },
        uVel: { value: new THREE.Vector2() },
        uRadius: { value: radius },
        uAmt: { value: 0 },
        uTime: { value: 0 },
      },
      depthTest: false,
      depthWrite: false,
    });
    const scene = new THREE.Scene();
    scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material));
    return { scene, material, camera: new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1) };
  }, [rt, radius]);

  useEffect(() => {
    const v = new THREE.Vector2();
    gl.getDrawingBufferSize(v);
    rt.setSize(v.x, v.y);
    quad.material.uniforms.uRes.value.copy(v);
    quad.material.uniforms.uRadius.value = radius * dpr;
  }, [gl, size, dpr, rt, quad, radius]);

  useEffect(
    () => () => {
      rt.dispose();
      quad.material.dispose();
    },
    [rt, quad]
  );

  const prev = useMemo(() => new THREE.Vector2(heroState.lens.x, heroState.lens.y), []);

  useFrame((state, delta) => {
    const u = quad.material.uniforms;
    const dt = Math.min(delta, 1 / 30);
    u.uTime.value += dt;
    // la gota persigue al objetivo con retraso (sensación líquida)
    const k = 1 - Math.pow(0.004, dt);
    const cx = u.uCenter.value.x + (heroState.lens.x - u.uCenter.value.x) * k;
    const cy = u.uCenter.value.y + (heroState.lens.y - u.uCenter.value.y) * k;
    u.uCenter.value.set(cx, cy);
    const vx = (cx - prev.x) / Math.max(dt, 1e-3);
    const vy = (cy - prev.y) / Math.max(dt, 1e-3);
    u.uVel.value.x += (vx * 0.12 - u.uVel.value.x) * 0.2;
    u.uVel.value.y += (vy * 0.12 * (u.uRes.value.y / u.uRes.value.x) - u.uVel.value.y) * 0.2;
    prev.set(cx, cy);
    // aparece tras la entrada y se desvanece con la transición a la siguiente sección
    // (el póster estático del hero se genera sin lente: scripts/poster.mjs activa __lppsPoster)
    const noLens = (window as Window & { __lppsPoster?: boolean }).__lppsPoster === true;
    const target = noLens ? 0 : Math.max(0, 1 - heroState.progress * 2.2);
    u.uAmt.value += (target * Math.min(1, state.clock.elapsedTime / 1.6) - u.uAmt.value) * 0.08;

    state.gl.setRenderTarget(rt);
    state.gl.render(state.scene, state.camera);
    state.gl.setRenderTarget(null);
    state.gl.render(quad.scene, quad.camera);
  }, 1);

  return null;
}
