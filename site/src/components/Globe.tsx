import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Globe: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene, camera, renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.9,
      1000
    );
    camera.position.set(0, 0, 5);
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true          // ← enable transparency
});
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    // // OrbitControls
    // const controls = new OrbitControls(camera, renderer.domElement);
    // controls.enableDamping = true;
    // controls.dampingFactor = 0.1;
    // controls.enableZoom = true;

    // Shaders (paste your shader code strings here)
    const vertexShader = `varying vec3 vPosition;
  varying vec3 vNormal;
  varying float vHeight;
  
  uniform float time;
  uniform float displacementScale;
  
  vec3 fade(vec3 t) {
    return t*t*t*(t*(t*6.0 - 15.0) + 10.0);
  }
  
  vec3 random3(vec3 c) {
    float j = 4096.0 * sin(dot(c, vec3(17.0, 59.4, 15.0)));
    return normalize(fract(vec3(j, j * 1.2154, j * 1.345)) * 2.0 - 1.0);
  }
  
  float perlinNoise(vec3 pos) {
    vec3 i = floor(pos);
    vec3 f = fract(pos);
    vec3 u = fade(f);
    
    float n000 = dot(random3(i + vec3(0.0, 0.0, 0.0)), f - vec3(0.0));
    float n100 = dot(random3(i + vec3(1.0, 0.0, 0.0)), f - vec3(1.0, 0.0, 0.0));
    float n010 = dot(random3(i + vec3(0.0, 1.0, 0.0)), f - vec3(0.0, 1.0, 0.0));
    float n110 = dot(random3(i + vec3(1.0, 1.0, 0.0)), f - vec3(1.0, 1.0, 0.0));
    float n001 = dot(random3(i + vec3(0.0, 0.0, 1.0)), f - vec3(0.0, 0.0, 1.0));
    float n101 = dot(random3(i + vec3(1.0, 0.0, 1.0)), f - vec3(1.0, 0.0, 1.0));
    float n011 = dot(random3(i + vec3(0.0, 1.0, 1.0)), f - vec3(0.0, 1.0, 1.0));
    float n111 = dot(random3(i + vec3(1.0, 1.0, 1.0)), f - vec3(1.0, 1.0, 1.0));
    
    float nx00 = mix(n000, n100, u.x);
    float nx01 = mix(n001, n101, u.x);
    float nx10 = mix(n010, n110, u.x);
    float nx11 = mix(n011, n111, u.x);
    
    float nxy0 = mix(nx00, nx10, u.y);
    float nxy1 = mix(nx01, nx11, u.y);
    
    return mix(nxy0, nxy1, u.z);
  }
  
  float fbm(vec3 pos) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    for (int i = 0; i < 20; i++) {
      value += amplitude * perlinNoise(pos * frequency);
      frequency *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }
  
  void main() {
    vec3 originalPos = position;
    vec3 noiseInput = normalize(originalPos) * 2.0 + vec3(time * 0.2);
    float noiseValue = fbm(noiseInput);
    noiseValue = noiseValue * 0.5 + 0.5;
    
    float height = pow(noiseValue, 0.65);
    vHeight = height;
    
    vec3 displacedPosition = originalPos + normalize(originalPos) * displacementScale * height;
    vPosition = displacedPosition;
    
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displacedPosition, 1.0);
  }`;
    const fragmentShader = `
  precision mediump float;

  varying vec3 vPosition;
  varying vec3 vNormal;
  varying float vHeight;
  
  uniform float time;
  
  void main() {
    vec3 pos = normalize(vPosition);
    float landMask = smoothstep(0.3, 0.9, vHeight);

    vec3 landColor  = vec3(0.2, 0.2, 0.7);
    vec3 oceanColor = vec3(0.0, 0.0, 0.0);

    if(vHeight > 0.58){ landColor = vec3(0.3, 0.3, 0.7); }
    if(vHeight > 0.612){ landColor = vec3(0.8, 0.6, 0.4); }
    if(vHeight > 0.62){ landColor = vec3(0.0, 0.6, 0.0); }
    if(vHeight > 0.67){ landColor = vec3(0.6, 0.6, 0.6); }
    if(vHeight > 0.7){ landColor = vec3(1.0, 1.0, 1.0); }

    landColor = mix(landColor, vec3(1.0), 0.00001);
    vec3 baseColor = mix(oceanColor, landColor, landMask);
    float brightnessFactor = 0.8 + 0.5 * vHeight;
    baseColor *= brightnessFactor;

    vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
    float diffuse = max(dot(pos, lightDir), 1.0);

    gl_FragColor = vec4(baseColor * diffuse, 1.0);
  }`;

    // Globe mesh
    const globeMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        time: { value: 0.0 },
        displacementScale: { value: 0.0 }
      }
    });

    const globeGeometry = new THREE.SphereGeometry(0.9, 200, 200);
    const globeMesh = new THREE.Mesh(globeGeometry, globeMaterial);
    scene.add(globeMesh);

    // Atmosphere shaders
    const atmosphereVertex = `/* atmosphere vertex shader */`;
    const atmosphereFragment = `/* atmosphere fragment shader */`;

    const atmMaterial = new THREE.ShaderMaterial({
      vertexShader: atmosphereVertex,
      fragmentShader: atmosphereFragment,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true
    });

    const atmGeometry = new THREE.SphereGeometry(1.09, 200, 200);
    const atmosphereMesh = new THREE.Mesh(atmGeometry, atmMaterial);
    atmosphereMesh.renderOrder = 1;
    scene.add(atmosphereMesh);

    // Starfield
    const starGeo = new THREE.BufferGeometry();
    const starCount = 10000;
    const starVertices: number[] = [];
    for (let i = 0; i < starCount; i++) {
      starVertices.push(
        THREE.MathUtils.randFloatSpread(1000),
        THREE.MathUtils.randFloatSpread(100),
        THREE.MathUtils.randFloatSpread(1500)
      );
    }
    starGeo.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(starVertices, 3)
    );
    const starMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 1.6,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.8
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // Moon
    const moonPivot = new THREE.Object3D();
    scene.add(moonPivot);
    const moonGeo = new THREE.SphereGeometry(0.015, 12, 12);
    const moonMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const moonMesh = new THREE.Mesh(moonGeo, moonMat);
    moonMesh.position.set(1, 0, 0);
    moonPivot.add(moonMesh);

    // Handle resize

    // Animation loop
    let dv = 0;
    const animate = () => {
      dv += 0.02;
      moonMesh.position.set(Math.cos(dv), Math.sin(dv), 0);
      globeMaterial.uniforms.time.value += 0.0000005;

      globeMesh.rotation.y -= 0.0005;
      globeMesh.rotation.z -= 0.0005;

      moonPivot.rotation.y += 0.005;
      moonMesh.rotation.y += 0.003;

      stars.rotation.y += 0.0001;

      //controls.update();
      renderer.render(scene, camera);

      requestAnimationFrame(animate);
    };
    animate();

    // Cleanup on unmount
    return () => {
      renderer.dispose();
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <>
    <a href='https://rgrammar.com' style={{fontSize: "40px", color: "indigo", fontWeight: "100", textDecoration: "none"}}>Rgrammar.com</a>
    <p style={{color: "grey"}}>Used all around the world to help people communicate.</p>
    <div
      ref={containerRef}
      style={{ width: '100vw', height: '100vh', background: 'transparent' }}
    ></div>
    <br></br>
    <div style={{position: "relative", zIndex: "100000", display: "none"}}>
    <div id="imgholder" style={{ display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap", cursor: "pointer"}}>
    <img style={{width: "9%", border: "solid 1px grey"}} src="https://flagcdn.com/w640/de.webp"/>
    <img style={{width: "9%", border: "solid 1px grey"}} src="https://flagcdn.com/w640/ru.webp"/>
    <img style={{width: "9%", border: "solid 1px grey"}} src="https://flagcdn.com/w640/es.webp"/>
    <img style={{width: "9%", border: "solid 1px grey"}} src="https://flagcdn.com/w640/sa.webp"/>
    <img style={{width: "9%", border: "solid 1px grey"}} src="https://flagcdn.com/w640/kr.webp"/>
    <img style={{width: "9%", border: "solid 1px grey"}} src="https://flagcdn.com/w640/jp.webp"/>
    <img style={{width: "9%", border: "solid 1px grey"}} src="https://flagcdn.com/w640/cn.webp"/>
</div>
</div>
    </>
  );
};

export default Globe;
