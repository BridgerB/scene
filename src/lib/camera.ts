import { FreeCamera, Vector3 } from '@babylonjs/core';
import type { Scene } from '@babylonjs/core';

export const setupCamera = (
  scene: Scene,
  canvas: HTMLCanvasElement,
  position: Vector3,
  target: Vector3
) => {
  const camera = new FreeCamera('camera', position, scene);
  camera.setTarget(target);
  camera.attachControl(canvas, true);
  camera.speed = 5;
  camera.inertia = 0;
  camera.angularSensibility = 800;
  camera.minZ = 0.1;
  camera.keysUp       = [87];
  camera.keysDown     = [83];
  camera.keysLeft     = [65];
  camera.keysRight    = [68];
  camera.keysUpward   = [69];
  camera.keysDownward = [81];

  canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    camera.speed = Math.max(0.1, camera.speed + (e.deltaY < 0 ? 2 : -2));
  }, { passive: false });
};
