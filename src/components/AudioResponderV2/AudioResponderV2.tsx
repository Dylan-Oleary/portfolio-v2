'use client';

import { ReactElement, useEffect, useRef } from 'react';
import {
  Audio,
  AudioAnalyser,
  AudioListener,
  AudioLoader,
  Clock,
  IcosahedronGeometry,
  Mesh,
  PerspectiveCamera,
  SRGBColorSpace,
  Scene,
  ShaderMaterial,
  Vector2,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

import { fragmentShader, vertexShader } from './shaders';

export function AudioResponderV2(): ReactElement {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window) return;

    const root = mountRef.current;
    if (!root) return;

    const renderer = new WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor('#0A0A0A');
    root.appendChild(renderer.domElement);

    const scene = new Scene();
    const camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

    renderer.outputColorSpace = SRGBColorSpace;

    const renderScene = new RenderPass(scene, camera);

    const bloomPass = new UnrealBloomPass(
      new Vector2(window.innerWidth, window.innerHeight),
      0.5,
      0.8,
      0.5,
    );

    const bloomComposer = new EffectComposer(renderer);
    bloomComposer.addPass(renderScene);
    bloomComposer.addPass(bloomPass);

    const outputPass = new OutputPass();
    bloomComposer.addPass(outputPass);

    camera.position.set(0, -2, 14);
    camera.lookAt(0, 0, 0);

    const uniforms = {
      u_time: { type: 'f', value: 0.0 },
      u_frequency: { type: 'f', value: 0.0 },
      u_red: { type: 'f', value: 1.0 },
      u_green: { type: 'f', value: 1.0 },
      u_blue: { type: 'f', value: 1.0 },
    };

    const material = new ShaderMaterial({
      fragmentShader,
      uniforms,
      vertexShader,
      wireframe: true,
    });

    const geometry = new IcosahedronGeometry(4, 30);
    const mesh = new Mesh(geometry, material);
    scene.add(mesh);

    const audioListener = new AudioListener();
    camera.add(audioListener);

    const sound = new Audio(audioListener);

    const audioLoader = new AudioLoader();
    audioLoader.load('/_mock-tts-response.mp3', function (buffer) {
      sound.setBuffer(buffer);
      window.addEventListener('click', function () {
        sound.play();
      });
    });

    const audioAnalyser = new AudioAnalyser(sound, 32);

    const orbit = new OrbitControls(camera, renderer.domElement);

    orbit.update();
    orbit.enableZoom = true;

    const clock = new Clock();

    // function animate() {
    //   camera.position.x += (mouseX - camera.position.x) * 0.05;
    //   camera.position.y += (-mouseY - camera.position.y) * 0.5;
    //   camera.lookAt(scene.position);
    //   uniforms.u_time.value = clock.getElapsedTime();
    //   uniforms.u_frequency.value = audioAnalyser.getAverageFrequency();
    //   bloomComposer.render();
    //   requestAnimationFrame(animate);
    // }
    // animate();

    // const handleResize = () => {
    //   camera.aspect = window.innerWidth / window.innerHeight;
    //   camera.updateProjectionMatrix();
    //   renderer.setSize(window.innerWidth, window.innerHeight);
    //   bloomComposer.setSize(window.innerWidth, window.innerHeight);
    // };

    // V1
    function animate() {
      uniforms.u_frequency.value = audioAnalyser.getAverageFrequency();

      uniforms.u_time.value = clock.getElapsedTime();
      renderer.render(scene, camera);
    }

    renderer.setAnimationLoop(animate);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      root.removeChild(renderer.domElement);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <div ref={mountRef} className="w-full flex-grow" />;
}
