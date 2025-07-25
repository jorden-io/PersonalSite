// import React, { useRef, useEffect } from 'react';
// import * as THREE from 'three';

// const FrogChats: React.FC = () => {
//   const mountRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const mount = mountRef.current!;
//     const width = mount.clientWidth;
//     const height = mount.clientHeight;
//     const aspect = width / height;
    
//     // 1) Scene / Camera / Renderer (transparent BG)
//     const scene = new THREE.Scene();
//     const camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 100);
//     camera.position.set(0, 2, 8);

//     const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
//     renderer.setSize(width, height);
//     renderer.setClearColor(0x000000, 0); // alpha = 0
//     mount.appendChild(renderer.domElement);

//     // 2) Lighting
//     scene.add(new THREE.AmbientLight(0xffffff, 0.7));
//     const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
//     dirLight.position.set(5, 5, 5);
//     scene.add(dirLight);

//     // 3) Geometry & Material
//     const cubeGeo = new THREE.BoxGeometry(0.6, 0.6, 0.6);
//     const baseMats = [
//       new THREE.MeshStandardMaterial({ color: 0x00ffa0, metalness: 0.3, roughness: 0.4 }),
//       new THREE.MeshStandardMaterial({ color: 0x00ccff, metalness: 0.3, roughness: 0.4 }),
//     ];

//     // 4) Compute view-width in world units at y=0 plane
//     //    verticalRange = 4 (from y=-2 to y=+2)
//     const verticalRange = 3;
//     const widthRange = 80;

//     // 5) Spawn cubes bottom-heavy (t² bias)
//     const cubes: THREE.Mesh[] = [];
//     const COUNT = 100;
//     for (let i = 0; i < COUNT; i++) {
//       const mat = baseMats[i % baseMats.length].clone();
//       const mesh = new THREE.Mesh(cubeGeo, mat);

//       const t = Math.random() ** 2;             // bias towards 0 (bottom)
//       const y = -2 + t * verticalRange;        // ∈ [-2, +2]
//       const x = (Math.random() - 0.5) * widthRange;
//       const z = (Math.random() - 0.5) * 6;

//       mesh.position.set(x, y, z);
//       scene.add(mesh);
//       cubes.push(mesh);
//     }

//     // 6) Handle resize
//     const onResize = () => {
//       const w = mount.clientWidth;
//       const h = mount.clientHeight;
//       const asp = w / h;
//       camera.aspect = asp;
//       camera.updateProjectionMatrix();
//       renderer.setSize(w, h);
//     };
//     window.addEventListener('resize', onResize);

//     // 7) Animation (spin & bob)
//     const clock = new THREE.Clock();
//     let reqId: number;
//     const animate = () => {
//       const t = clock.getElapsedTime();
//       cubes.forEach((c, idx) => {
//         c.rotation.x = t * 0.5 + idx * 0.1;
//         c.rotation.y = t * 0.3 + idx * 0.07;
//         c.position.y += Math.sin(t + idx) * 0.002;
//       });
//       renderer.render(scene, camera);
//       reqId = requestAnimationFrame(animate);
//     };
//     animate();

//     // 8) Cleanup
//     return () => {
//       cancelAnimationFrame(reqId);
//       window.removeEventListener('resize', onResize);
//       mount.removeChild(renderer.domElement);
//       cubeGeo.dispose();
//       baseMats.forEach((m) => m.dispose());
//     };
//   }, []);

//   return (
//     <div ref={mountRef} className="canvas-wrap">
//       <div className="ui-card">
//         <h1>FrogChats</h1>
//         <p>Chats cluster at the bottom and thin out above—each cube spins and bobs across the full width.</p>
//         <button onClick={() => window.open('https://frogchats.com', '_blank')}>
//           Join the Hive
//         </button>
//       </div>

//       <style jsx>{`
//         .canvas-wrap {
//         z-index: -10;
//           position: fixed;
//           top: 0;
//           left: 0;
//           width: 100vw;
//           height: 100vh;
//           overflow: hidden;
//           background: transparent;
//         }
//         .ui-card {
//         display: none;
//           position: absolute;
//           bottom: 40px;
//           left: 40px;
//           max-width: 300px;
//           padding: 1.5rem;
//           background: rgba(255, 255, 255, 0.08);
//           backdrop-filter: blur(10px);
//           border: 1px solid rgba(255, 255, 255, 0.15);
//           border-radius: 12px;
//           color: #e0f7fa;
//           box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
//         }
//         .ui-card h1 {
//           margin: 0 0 0.5rem;
//           font-size: 1.8rem;
//           text-shadow: 0 0 6px #00ffa0;
//         }
//         .ui-card p {
//           margin: 0 0 1rem;
//           line-height: 1.4;
//         }
//         .ui-card button {
//           padding: 0.6rem 1.2rem;
//           background: #00ffa0;
//           color: #10131a;
//           border: none;
//           border-radius: 8px;
//           font-weight: bold;
//           cursor: pointer;
//           transition: background 0.2s ease;
//         }
//         .ui-card button:hover {
//           background: #00dd88;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default FrogChats;


//second

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

import { EffectComposer }   from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass }        from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass }   from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

const FrogChats: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current!;
    const { clientWidth: width, clientHeight: height } = mount;

    // 1) renderer + composer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const composer = new EffectComposer(renderer);
    composer.setSize(width, height);
    composer.setPixelRatio(window.devicePixelRatio || 1);

    // 2) scene & camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.set(0, 2, 8);

    // 3) passes
    composer.addPass(new RenderPass(scene, camera));
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(width, height),
      0.8,   // strength
      0.5,   // radius
      0.2    // threshold
    );
    composer.addPass(bloomPass);

    // 4) lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.3));
    const d = new THREE.DirectionalLight(0xffffff, 0.4);
    d.position.set(5, 5, 5);
    scene.add(d);

    // 5) geometries & materials
    const geometries = [
      new THREE.BoxGeometry(0.6, 0.6, 0.6),
      new THREE.SphereGeometry(0.4, 16, 12),
      new THREE.ConeGeometry(0.4, 0.8, 12),
      new THREE.TorusGeometry(0.3, 0.1, 16, 100),
      new THREE.CylinderGeometry(0.3, 0.3, 0.8, 12),
    ];

    const baseColors = [0x00ffa0, 0x00ccff];
    const materials = baseColors.map((col) =>
      new THREE.MeshStandardMaterial({
        color: col,
        metalness: 0.3,
        roughness: 0.4,
        emissive: col,
        emissiveIntensity: 0.6,
      })
    );

    // 6) spawn meshes
    const meshes: THREE.Mesh[] = [];
    for (let i = 0; i < 100; i++) {
      const geo = geometries[Math.floor(Math.random() * geometries.length)];
      const mat = materials[i % materials.length].clone();
      const m = new THREE.Mesh(geo, mat);

      const t = Math.random() ** 2;
      m.position.set(
        (Math.random() - 0.5) * 100,
        0 + t * 3,
        (Math.random() - 0.5) * 6
      );

      scene.add(m);
      meshes.push(m);
    }

    // 7) handle resize
    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      composer.setSize(w, h);
      bloomPass.resolution.set(w, h);
    };
    window.addEventListener('resize', onResize);

    // 8) animate
    const clock = new THREE.Clock();
    let req: number;
    const animate = () => {
      const t = clock.getElapsedTime();
      meshes.forEach((m, idx) => {
        m.rotation.x = t * 0.5 + idx * 0.1;
        m.rotation.y = t * 0.3 + idx * 0.07;
        m.position.y += Math.sin(t + idx) * 0.002;
      });

      composer.render();
      req = requestAnimationFrame(animate);
    };
    animate();

    // 9) cleanup
    return () => {
      cancelAnimationFrame(req);
      window.removeEventListener('resize', onResize);
      mount.removeChild(renderer.domElement);
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      composer.dispose();
    };
  }, []);

  return (
    <div ref={mountRef} style={{bottom: "0", position: "absolute", height: "100vh", inset: 0, zIndex: -10 }} />
  );
};

export default FrogChats;

