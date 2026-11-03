import { useEffect, useRef } from 'react';

export default function ThreeCanvas() {
  const mountRef = useRef(null);

  useEffect(() => {
    let animationFrameId;
    let scene, camera, renderer, mesh;
    let originalPositions; // Saved for cloud vertex morphing
    
    // Physics & Interaction state
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let velocity = { x: 0, y: 0 };
    let dragIntensity = 0;
    let targetDragIntensity = 0;

    const getDimensions = () => ({
      width: mountRef.current?.clientWidth || 400,
      height: mountRef.current?.clientHeight || 400
    });

    const setupScene = () => {
      const THREE = window.THREE;
      if (!THREE || !mountRef.current) return;

      const { width, height } = getDimensions();

      // 1. Scene & Camera
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      camera.position.z = 4.5;

      // 2. Renderer
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      mountRef.current.innerHTML = '';
      mountRef.current.appendChild(renderer.domElement);

      // 3. Cloud-like Organic Shape (High-detail Icosahedron for soft vertex displacement)
      const geometry = new THREE.IcosahedronGeometry(1.3, 32);
      
      // Save original vertex positions to calculate organic wave morphing
      const positionAttribute = geometry.attributes.position;
      originalPositions = new Float32Array(positionAttribute.array);

      // Custom MeshPhysicalMaterial for a soft, translucent, glowing cloud/nebula look
      const material = new THREE.MeshPhysicalMaterial({
        color: 0x00f2fe,
        emissive: 0x051020,
        roughness: 0.3,
        metalness: 0.1,
        transmission: 0.6, // Soft glass/cloud translucency
        thickness: 1.2,
        transparent: true,
        opacity: 0.9,
        wireframe: false,
      });

      mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      // 4. Studio Lighting (Cyan, Purple & Soft White gradients)
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);

      const light1 = new THREE.PointLight(0x00f2fe, 3, 20);
      light1.position.set(4, 4, 4);
      scene.add(light1);

      const light2 = new THREE.PointLight(0x7928ca, 3, 20); // Deep violet accent
      light2.position.set(-4, -4, 2);
      scene.add(light2);

      // 5. Drag & Touch Interaction Handlers
      const onPointerDown = (e) => {
        isDragging = true;
        targetDragIntensity = 1;
        previousMousePosition = { x: e.clientX, y: e.clientY };
      };

      const onPointerMove = (e) => {
        if (!isDragging) return;

        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;

        velocity.x = deltaY * 0.005;
        velocity.y = deltaX * 0.005;

        previousMousePosition = { x: e.clientX, y: e.clientY };
      };

      const onPointerUp = () => {
        isDragging = false;
        targetDragIntensity = 0;
      };

      const domEl = mountRef.current;
      domEl.addEventListener('pointerdown', onPointerDown);
      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);

      const handleResize = () => {
        if (!mountRef.current || !renderer || !camera) return;
        const newW = mountRef.current.clientWidth;
        const newH = mountRef.current.clientHeight;
        camera.aspect = newW / newH;
        camera.updateProjectionMatrix();
        renderer.setSize(newW, newH);
      };
      window.addEventListener('resize', handleResize);

      // 6. Animation Loop with Organic Vertex Wave & Color Reactivity
      const clock = new THREE.Clock();

      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);

        const elapsedTime = clock.getElapsedTime();

        if (mesh) {
          // Smooth continuous idle rotation
          mesh.rotation.y += 0.003;
          mesh.rotation.x += 0.0015;

          // Inertia damping from drag
          mesh.rotation.x += velocity.x;
          mesh.rotation.y += velocity.y;
          velocity.x *= 0.92;
          velocity.y *= 0.92;

          // Interpolate drag feedback
          dragIntensity += (targetDragIntensity - dragIntensity) * 0.06;

          // Organic Cloud Morphing (Simulating shifting pillowy cloud geometry)
          const positions = mesh.geometry.attributes.position;
          const speedFactor = 1.5 + dragIntensity * 2.5; // Speeds up when touched/dragged

          for (let i = 0; i < positions.count; i++) {
            const ox = originalPositions[i * 3];
            const oy = originalPositions[i * 3 + 1];
            const oz = originalPositions[i * 3 + 2];

            // Create soft undulating wave effect using sine waves mapped to vertex coordinates
            const distance = Math.sin(elapsedTime * speedFactor + ox * 2 + oy * 2 + oz * 2);
            const waveOffset = 1 + distance * (0.08 + dragIntensity * 0.12); // Expands/contracts dynamically on touch

            positions.setXYZ(i, ox * waveOffset, oy * waveOffset, oz * waveOffset);
          }
          positions.needsUpdate = true;

          // Dynamic Color Shifting matching website theme (Cyan -> Electric Indigo -> Violet)
          const colorA = new THREE.Color(0x00f2fe); // Cyan
          const colorB = new THREE.Color(0x7928ca); // Deep Violet
          const touchColor = new THREE.Color(0xff007f); // Hot Pink/Magenta highlight on touch

          const mixedBase = colorA.clone().lerp(colorB, 0.5 + Math.sin(elapsedTime * 0.8) * 0.5);
          mesh.material.color.lerpColors(mixedBase, touchColor, dragIntensity);

          // Subtle scaling pulse when interacted with
          mesh.scale.setScalar(1 + dragIntensity * 0.1);
        }

        renderer.render(scene, camera);
      };

      animate();

      return () => {
        domEl.removeEventListener('pointerdown', onPointerDown);
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
        window.removeEventListener('resize', handleResize);
      };
    };

    let cleanupListeners;

    if (!window.THREE) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
      script.onload = () => { cleanupListeners = setupScene(); };
      document.head.appendChild(script);
    } else {
      cleanupListeners = setupScene();
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (cleanupListeners) cleanupListeners();
      if (mountRef.current) mountRef.current.innerHTML = '';
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className="w-full h-full min-h-[400px] cursor-grab active:cursor-grabbing select-none" 
    />
  );
}
