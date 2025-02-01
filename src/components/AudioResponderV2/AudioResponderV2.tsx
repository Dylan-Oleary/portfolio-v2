'use client';

import { GUI } from 'lil-gui';
import { ReactElement, useEffect, useRef } from 'react';
import {
  Audio,
  AudioAnalyser,
  AudioListener,
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

export type AudioRepsonderV2Props = {
  buffer?: AudioBuffer;
};

export function AudioResponderV2({ buffer }: AudioRepsonderV2Props): ReactElement {
  const mountRef = useRef<HTMLDivElement>(null);
  const soundRef = useRef<Audio>(null);

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

    const params = {
      red: 1.0,
      green: 1.0,
      blue: 1.0,
      threshold: 0.5,
      strength: 0.4,
      radius: 0.8,
    };

    const bloomPass = new UnrealBloomPass(
      new Vector2(window.innerWidth, window.innerHeight),
      params.strength,
      params.radius,
      params.threshold,
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

    soundRef.current = new Audio(audioListener);

    const audioAnalyser = new AudioAnalyser(soundRef.current, 32);

    const orbit = new OrbitControls(camera, renderer.domElement);

    orbit.update();
    orbit.enableZoom = false;

    const clock = new Clock();

    if (process.env.NEXT_PUBLIC_FEATURE_ENABLE_BLOB_GUI === '1') {
      const gui = new GUI();

      const colorsFolder = gui.addFolder('Colors');
      colorsFolder.add(params, 'red', 0, 1).onChange((value: string) => {
        uniforms.u_red.value = Number(value);
      });
      colorsFolder.add(params, 'green', 0, 1).onChange((value: string) => {
        uniforms.u_green.value = Number(value);
      });
      colorsFolder.add(params, 'blue', 0, 1).onChange((value: string) => {
        uniforms.u_blue.value = Number(value);
      });
    }

    function animate() {
      const avgFrequencency = audioAnalyser.getAverageFrequency();

      uniforms.u_frequency.value = avgFrequencency <= 21 ? 20 : avgFrequencency * 1.2;
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

  useEffect(() => {
    if (!buffer || !soundRef.current) return;

    soundRef.current.setBuffer(buffer);
    soundRef.current.play();
  }, [buffer]);

  return <div ref={mountRef} className="w-full flex-grow" />;
}
