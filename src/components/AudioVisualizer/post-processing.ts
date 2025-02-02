import { GUI } from 'lil-gui';

export const BLOOM_PASS_CONFIG = {
  radius: 0.8,
  strength: 0.4,
  threshold: 0.5,
} as const;

export const RGB_DEFAULT_CONFIG = {
  red: 1.0,
  green: 1.0,
  blue: 1.0,
};

export const UNIFORMS_CONFIG = {
  u_time: { type: 'f', value: 0.0 },
  u_frequency: { type: 'f', value: 0.0 },
  u_red: { type: 'f', value: RGB_DEFAULT_CONFIG.red },
  u_green: { type: 'f', value: RGB_DEFAULT_CONFIG.green },
  u_blue: { type: 'f', value: RGB_DEFAULT_CONFIG.blue },
};

export function _renderDeveloperTools(uniforms: typeof UNIFORMS_CONFIG): void {
  const gui = new GUI();
  const colorsFolder = gui.addFolder('Colors');

  colorsFolder
    .add(RGB_DEFAULT_CONFIG, 'red', 0, 1)
    .onChange((value: string) => (uniforms.u_red.value = Number(value)));
  colorsFolder
    .add(RGB_DEFAULT_CONFIG, 'green', 0, 1)
    .onChange((value: string) => (uniforms.u_green.value = Number(value)));
  colorsFolder
    .add(RGB_DEFAULT_CONFIG, 'blue', 0, 1)
    .onChange((value: string) => (uniforms.u_blue.value = Number(value)));
}
