'use client';

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

import { BLOOM_PASS_CONFIG, UNIFORMS_CONFIG, _renderDeveloperTools } from './post-processing';
import { FRAGMENT_SHADER, VERTEX_SHADER } from './shaders';

export type AudioVisualizerProps = {
  buffer?: AudioBuffer;
};

export function AudioVisualizer({ buffer }: AudioVisualizerProps): ReactElement {
  const mountRef = useRef<HTMLDivElement>(null);
  const soundRef = useRef<Audio>(null);

  useEffect(() => {
    if (!window) return;

    const root = mountRef.current;
    if (!root) return;

    const height = window.innerHeight;
    const width = window.innerWidth;

    const renderer = new WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setClearColor('#0a0a0a');
    renderer.outputColorSpace = SRGBColorSpace;
    root.appendChild(renderer.domElement);

    const scene = new Scene();
    const camera = new PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, -2, 14);
    camera.lookAt(0, 0, 0);

    const renderScene = new RenderPass(scene, camera);

    const { radius, strength, threshold } = BLOOM_PASS_CONFIG;
    const bloomPass = new UnrealBloomPass(new Vector2(width, height), strength, radius, threshold);

    const bloomComposer = new EffectComposer(renderer);
    bloomComposer.addPass(renderScene);
    bloomComposer.addPass(bloomPass);

    const outputPass = new OutputPass();
    bloomComposer.addPass(outputPass);

    const uniforms = { ...UNIFORMS_CONFIG };
    const material = new ShaderMaterial({
      fragmentShader: FRAGMENT_SHADER,
      uniforms,
      vertexShader: VERTEX_SHADER,
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
    const enableDevTools = process.env.NEXT_PUBLIC_ENABLE_AUDIO_VISUALIZER_DEV_TOOLS === '1';

    if (enableDevTools) _renderDeveloperTools(uniforms);

    function animate() {
      if (!enableDevTools) {
        const isSoundPlaying = soundRef.current?.isPlaying;

        uniforms.u_red.value = isSoundPlaying ? 0 : 1;
        uniforms.u_blue.value = isSoundPlaying ? 0 : 1;
      }

      const averageFrequency = audioAnalyser.getAverageFrequency();
      const baseFrequency = 20;
      const frequencyMultiplier = 1.2;

      uniforms.u_frequency.value =
        averageFrequency <= baseFrequency ? baseFrequency : averageFrequency * frequencyMultiplier;
      uniforms.u_time.value = clock.getElapsedTime();

      renderer.render(scene, camera);
    }

    renderer.setAnimationLoop(animate);

    function handleResize() {
      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
    }

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

  return <div ref={mountRef} className="w-full" />;
}
