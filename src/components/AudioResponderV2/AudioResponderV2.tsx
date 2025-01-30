'use client';

import { ReactElement, useEffect, useRef } from 'react';
import {
  Clock,
  IcosahedronGeometry,
  Mesh,
  PerspectiveCamera,
  Scene,
  ShaderMaterial,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Basic vertex shader - handles position
const vertexShader = `
  void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Basic fragment shader - sets color
const fragmentShader = `
  void main() {
      gl_FragColor = vec4(255, 255, 255, 1.0);
  }
`;

export function AudioResponderV2(): ReactElement {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = mountRef.current;
    if (!root) return;

    const renderer = new WebGLRenderer({ antialias: true });
    renderer.setSize(root.clientHeight, root.clientWidth);
    renderer.setClearColor('#0A0A0A');
    root.appendChild(renderer.domElement);

    const scene = new Scene();
    const camera = new PerspectiveCamera(45, root.clientWidth / root.clientHeight, 0.1, 1000);
    const orbit = new OrbitControls(camera, renderer.domElement);

    camera.position.set(6, 8, 14);
    orbit.update();

    const uniforms = { u_time: { value: 0.0 } };
    const material = new ShaderMaterial({
      wireframe: true,
      uniforms,
      vertexShader,
      fragmentShader,
    });
    const geometry = new IcosahedronGeometry(4, 30);
    const mesh = new Mesh(geometry, material);
    const clock = new Clock();

    function animate() {
      uniforms.u_time.value = clock.getElapsedTime();
      renderer.render(scene, camera);
    }

    renderer.setAnimationLoop(animate);

    scene.add(mesh);

    return () => {
      root.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full flex-grow" />;
}
