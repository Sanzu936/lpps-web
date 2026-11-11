"use client";
import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { watchPointer } from "@/lib/pointer";
import { heroState } from "./heroState";
import LensPass from "./LensPass";

const vertexShader = /* glsl */ `
  attribute vec3 aInfo; // x: columna 0-1, y: fila 0-1, z: aleatorio
  uniform float uTime;
  uniform float uIntro;
  uniform float uPress;
  uniform float uFlat;
  uniform vec2 uPointer;
  varying vec3 vLocal;
  varying vec3 vNormal;
  varying float vLift;
  varying float vH;
  varying float vDepth;
  varying float vRand;

  void main() {
    vec3 p = position;
    vec3 center = (instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;

    float d = distance(center.xy, uPointer);
    float lift = exp(-(d * d) / 7.5) * uPress;
    float wave = sin(center.x * 0.33 + uTime * 0.55) * cos(center.y * 0.41 - uTime * 0.45) * 0.5 + 0.5;
    float delay = aInfo.z * 0.45 + aInfo.y * 0.35;
    float intro = smoothstep(delay, delay + 0.35, uIntro);

    float h = (0.12 + wave * 0.55 + lift * 3.4) * intro * (1.0 - uFlat) + 0.025;
    p.z = (p.z + 0.5) * h;

    vLocal = position;
    vNormal = normal;
    vLift = lift;
    vH = h;
    vRand = aInfo.z;

    vec4 mv = modelViewMatrix * instanceMatrix * vec4(p, 1.0);
    vDepth = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uBg;
  uniform vec3 uFace;
  uniform vec3 uLine;
  uniform vec3 uSignal;
  uniform float uFill;
  uniform float uTime;
  varying vec3 vLocal;
  varying vec3 vNormal;
  varying float vLift;
  varying float vH;
  varying float vDepth;
  varying float vRand;

  void main() {
    vec3 a = abs(vLocal) * 2.0;
    float top = step(0.5, vNormal.z);
    // aristas: en la cara superior, cerca del borde x/y; en los laterales, borde vertical y superior
    float edgeTop = max(a.x, a.y);
    float edgeSide = max(abs(vNormal.x) > 0.5 ? a.y : a.x, smoothstep(0.86, 1.0, a.z));
    float edge = mix(edgeSide, edgeTop, top);
    float line = smoothstep(0.86, 0.97, edge);

    vec3 light = normalize(vec3(-0.35, -0.55, 0.9));
    float diff = clamp(dot(normalize(vNormal), light), 0.0, 1.0);
    vec3 face = uFace * (0.55 + diff * 0.65);
    float hot = smoothstep(0.35, 0.9, vLift);
    face = mix(face, mix(uLine, uSignal, 0.45) * (0.62 + 0.38 * diff), hot * top);
    face = mix(uBg, face, uFill);

    vec3 lineCol = mix(uLine, uSignal, hot);
    float lineAmt = line * mix(0.45, 0.85, top) * (0.5 + 0.5 * (1.0 - uFill) + hot);
    vec3 col = mix(face, lineCol, clamp(lineAmt, 0.0, 1.0));
    // halo celeste en las baldosas levantadas
    col += uLine * hot * 0.22 + uSignal * hot * top * 0.12;

    // niebla hacia el fondo
    float fog = smoothstep(9.0, 26.0, vDepth);
    col = mix(col, uBg, fog);

    gl_FragColor = vec4(col, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

type Props = { onReady?: () => void; lite?: boolean };

function Field({ cols, rows, mobile, lite, onReady }: { cols: number; rows: number; mobile: boolean; lite: boolean; onReady?: () => void }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const { camera, gl, size, invalidate } = useThree();
  /** En modo ligero solo se renderiza hasta este instante (se amplía con cada gesto). */
  const activeUntil = useRef(performance.now() + 2600);
  const reduce = useMemo(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches, []);
  // Con movimiento reducido el campo solo se redibuja cuando el usuario mueve el puntero o hace scroll.
  const demand = lite || reduce;

  const geometry = useMemo(() => {
    const g = new THREE.BoxGeometry(0.9, 0.9, 1);
    const info = new Float32Array(cols * rows * 3);
    let k = 0;
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        info[k++] = x / (cols - 1);
        info[k++] = y / (rows - 1);
        info[k++] = Math.random();
      }
    }
    g.setAttribute("aInfo", new THREE.InstancedBufferAttribute(info, 3));
    return g;
  }, [cols, rows]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uIntro: { value: reduce ? 1 : 0 },
          uFill: { value: reduce ? 1 : 0 },
          uPress: { value: 0 },
          uFlat: { value: 0 },
          uPointer: { value: new THREE.Vector2(6, 2) },
          uBg: { value: new THREE.Color("#03050b") },
          uFace: { value: new THREE.Color("#122a55") },
          uLine: { value: new THREE.Color("#5bc4e2") },
          uSignal: { value: new THREE.Color("#bfe9f7") },
        },
      }),
    [reduce]
  );

  // Colocar las baldosas en rejilla
  useEffect(() => {
    const m = mesh.current;
    if (!m) return;
    const o = new THREE.Object3D();
    let i = 0;
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        o.position.set(x - (cols - 1) / 2, y - (rows - 1) / 2, 0);
        o.updateMatrix();
        m.setMatrixAt(i++, o.matrix);
      }
    }
    m.instanceMatrix.needsUpdate = true;
    m.computeBoundingSphere();
    onReady?.();
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [cols, rows, geometry, material, onReady]);

  // Cuando el muro de baldosas se vuelve a abrir, se dibuja enseguida (sin esperar a un gesto)
  useEffect(() => {
    heroState.wake = () => {
      activeUntil.current = performance.now() + 900;
      invalidate();
    };
    return () => {
      heroState.wake = null;
    };
  }, [invalidate]);

  // Entrada del puntero (ratón, toque) en coordenadas de pantalla normalizadas
  const pointer = useRef({ ndc: new THREE.Vector2(0.45, 0.1), active: 0, last: 0 });
  useEffect(() => {
    const el = gl.domElement.parentElement?.parentElement?.parentElement ?? window;
    const onMove = (e: PointerEvent, rect?: DOMRect | null) => {
      const r = rect ?? gl.domElement.getBoundingClientRect();
      pointer.current.ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      pointer.current.active = 1;
      pointer.current.last = performance.now();
      if (demand && !heroState.covered) {
        // en móvil se sigue dibujando hasta después de que la lente se retire (ver lensOn)
        activeUntil.current = performance.now() + (mobile ? 3400 : 1500);
        invalidate();
      }
    };
    const onScroll = () => {
      if (!demand || heroState.covered) return;
      activeUntil.current = performance.now() + 900;
      invalidate();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    // movimiento: gestor compartido (una pasada por fotograma, sin recálculos forzados)
    const stopMove = watchPointer(gl.domElement, (e, r) => r && onMove(e, r));
    const onDown = (e: PointerEvent) => onMove(e);
    window.addEventListener("pointerdown", onDown, { passive: true });
    return () => {
      stopMove();
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("scroll", onScroll);
      void el;
    };
  }, [gl, demand, mobile, invalidate]);

  const ray = useMemo(() => new THREE.Raycaster(), []);
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []);
  const hit = useMemo(() => new THREE.Vector3(), []);
  const auto = useMemo(() => new THREE.Vector2(), []);
  const camBase = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => {
    camBase.copy(camera.position);
  }, [camera, camBase]);

  useFrame((state, delta) => {
    const u = material.uniforms;
    const dt = Math.min(delta, 1 / 30);
    const t = state.clock.elapsedTime;
    if (!reduce) {
      u.uTime.value += dt;
      u.uIntro.value = Math.min(1, u.uIntro.value + dt / 1.7);
      if (u.uIntro.value > 0.45) u.uFill.value = Math.min(1, u.uFill.value + dt / 0.9);
    }

    // Sin interacción reciente: el "foco" recorre la rejilla solo (útil en móvil)
    const idle = performance.now() - pointer.current.last > 2600;
    let target: THREE.Vector2;
    if (reduce) {
      // Sin recorrido automático: el foco se queda quieto o sigue al puntero.
      target = pointer.current.ndc;
    } else if (idle) {
      auto.set(Math.sin(t * 0.37) * (window.innerWidth < window.innerHeight ? 0.45 : 0.75) + (window.innerWidth < window.innerHeight ? 0.05 : 0.15), Math.cos(t * 0.29) * 0.45 + (mobile ? -0.1 : 0.15));
      target = auto;
    } else {
      target = pointer.current.ndc;
    }
    // En móvil el texto ocupa casi toda la pantalla: la lente solo aparece mientras tocas.
    heroState.lensOn = !(mobile && idle);
    ray.setFromCamera(target, camera);
    heroState.lens.x = target.x * 0.5 + 0.5;
    heroState.lens.y = target.y * 0.5 + 0.5;
    if (ray.ray.intersectPlane(plane, hit)) {
      const k = 1 - Math.pow(0.0015, dt);
      u.uPointer.value.x += (hit.x - u.uPointer.value.x) * k;
      u.uPointer.value.y += (hit.y - u.uPointer.value.y) * k;
    }
    const pressTarget = reduce ? 0.6 : idle ? 0.75 : 1;
    u.uPress.value += (pressTarget - u.uPress.value) * (1 - Math.pow(0.02, dt));

    // Scroll: la cámara se inclina y las baldosas se aplanan mientras se voltea el muro
    const p = heroState.progress;
    const scrollY = mobile ? Math.min(window.scrollY / window.innerHeight, 1) : 0;
    u.uFlat.value = p * 0.9;
    camera.position.set(camBase.x, camBase.y - p * 4 - scrollY * 2, camBase.z - p * 3);
    camera.lookAt(0, p * 2, 0);
    if (demand && performance.now() < activeUntil.current && heroState.visible && !heroState.covered) state.invalidate();
  });

  void size;
  return <instancedMesh ref={mesh} args={[geometry, material, cols * rows]} frustumCulled={false} />;
}

/** Pausa el render cuando el hero no está a la vista. */
function Pauser() {
  const setFrameloop = useThree((s) => s.setFrameloop);
  useFrame(() => {
    if (!heroState.visible || heroState.covered) setFrameloop("never");
  });
  useEffect(() => {
    const id = window.setInterval(() => {
      if (heroState.visible && !heroState.covered && !document.hidden) setFrameloop("always");
    }, 250);
    const onVis = () => setFrameloop(document.hidden || !heroState.visible || heroState.covered ? "never" : "always");
    document.addEventListener("visibilitychange", onVis);
    // en modo continuo, al abrirse el muro se reanuda el bucle en el acto (no a los 250 ms)
    const prevWake = heroState.wake;
    heroState.wake = () => {
      prevWake?.();
      if (!document.hidden) setFrameloop("always");
    };
    return () => {
      heroState.wake = prevWake;
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [setFrameloop]);
  return null;
}

export default function TileField({ onReady, lite = false }: Props) {
  const mobile = useMemo(() => window.matchMedia("(max-width: 759px), (pointer: coarse)").matches, []);
  const cols = mobile ? 20 : lite ? 30 : 40;
  const rows = mobile ? 26 : lite ? 18 : 24;
  const demand = lite || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return (
    <Canvas
      flat
      frameloop={demand ? "demand" : "always"}
      // Resolución 1× (antes hasta 1,75×): el fondo se dibuja con muchos menos píxeles por fotograma.
      // Sin antialias: la escena se pinta en el buffer de LensPass, que nunca lo tuvo; en el lienzo solo
      // se pinta un rectángulo a pantalla completa, así que pedirlo solo gastaba memoria.
      dpr={lite ? 0.75 : 1}
      gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
      camera={{ position: mobile ? [0, -13, 14] : [2, -12, 10.5], fov: mobile ? 52 : 42, near: 0.1, far: 80 }}
      onCreated={({ gl }) => gl.setClearColor("#03050b")}
    >
      <Field cols={cols} rows={rows} mobile={mobile} lite={lite} onReady={onReady} />
      <LensPass radius={mobile ? 78 : 124} />
      {demand ? null : <Pauser />}
    </Canvas>
  );
}
