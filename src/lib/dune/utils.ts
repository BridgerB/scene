/**
 * Shared primitive helpers for the Dune imperial throne room scene.
 *
 * Every mesh in this scene is unlit (emissive-only) so that colour values
 * translate directly to on-screen brightness, giving full artistic control
 * over the palette without needing a light rig.
 */
import {
  Scene, Color3, Vector3,
  StandardMaterial, MeshBuilder, Mesh,
} from '@babylonjs/core';

/** Auto-incrementing counter used to guarantee unique mesh/material names. */
let meshCounter = 0;

/** Resets the mesh counter — call once at the start of each build. */
export const resetMeshCounter = () => { meshCounter = 0; };

/** Returns a unique name by appending the current counter to `prefix`. */
export const uniqueName = (prefix: string) => `${prefix}${meshCounter++}`;

/**
 * Deterministic pseudo-random number generator (hash-based).
 * Returns a value in [0, 1) for a given integer seed.
 * Used to place procedural geometry consistently across rebuilds.
 */
export const seededRandom = (seed: number): number => {
  const hash = Math.sin(seed * 127.1 + 311.7) * 43758.5;
  return hash - Math.floor(hash);
};

/**
 * Creates an unlit StandardMaterial with the given emissive colour.
 * @param scene   - The Babylon scene to register the material in.
 * @param red     - Red channel (0–1).
 * @param green   - Green channel (0–1).
 * @param blue    - Blue channel (0–1).
 * @param alpha   - Opacity (0–1, default 1 = fully opaque).
 */
export const createMaterial = (
  scene: Scene,
  red: number,
  green: number,
  blue: number,
  alpha = 1,
): StandardMaterial => {
  const material = new StandardMaterial(uniqueName('mat'), scene);
  material.emissiveColor = new Color3(red, green, blue);
  material.disableLighting = true;
  if (alpha < 1) material.alpha = alpha;
  return material;
};

/**
 * Creates a box mesh with an unlit emissive material and positions it.
 * @param scene  - The Babylon scene.
 * @param red    - Emissive red channel.
 * @param green  - Emissive green channel.
 * @param blue   - Emissive blue channel.
 * @param posX   - World X position.
 * @param posY   - World Y position.
 * @param posZ   - World Z position.
 * @param width  - Box width (X axis).
 * @param height - Box height (Y axis).
 * @param depth  - Box depth (Z axis).
 * @param alpha  - Opacity (0–1).
 */
export const createBox = (
  scene: Scene,
  red: number, green: number, blue: number,
  posX: number, posY: number, posZ: number,
  width: number, height: number, depth: number,
  alpha = 1,
): Mesh => {
  const mesh = MeshBuilder.CreateBox(uniqueName('box'), { width, height, depth }, scene);
  mesh.position = new Vector3(posX, posY, posZ);
  mesh.material = createMaterial(scene, red, green, blue, alpha);
  return mesh;
};

/**
 * Creates a cylinder mesh with an unlit emissive material and positions it.
 * @param scene  - The Babylon scene.
 * @param red    - Emissive red channel.
 * @param green  - Emissive green channel.
 * @param blue   - Emissive blue channel.
 * @param posX   - World X position.
 * @param posY   - World Y position.
 * @param posZ   - World Z position.
 * @param height - Cylinder height.
 * @param radius - Cylinder radius.
 * @param alpha  - Opacity (0–1).
 */
export const createCylinder = (
  scene: Scene,
  red: number, green: number, blue: number,
  posX: number, posY: number, posZ: number,
  height: number, radius: number,
  alpha = 1,
): Mesh => {
  const mesh = MeshBuilder.CreateCylinder(uniqueName('cyl'), { height, diameter: radius * 2 }, scene);
  mesh.position = new Vector3(posX, posY, posZ);
  mesh.material = createMaterial(scene, red, green, blue, alpha);
  return mesh;
};

/**
 * Creates a sphere mesh with an unlit emissive material, positioned and scaled.
 * @param scene  - The Babylon scene.
 * @param red    - Emissive red channel.
 * @param green  - Emissive green channel.
 * @param blue   - Emissive blue channel.
 * @param posX   - World X position.
 * @param posY   - World Y position.
 * @param posZ   - World Z position.
 * @param scaleX - Scale on X axis (default 1).
 * @param scaleY - Scale on Y axis (default 1).
 * @param scaleZ - Scale on Z axis (default 1).
 * @param alpha  - Opacity (0–1).
 */
export const createSphere = (
  scene: Scene,
  red: number, green: number, blue: number,
  posX: number, posY: number, posZ: number,
  scaleX = 1, scaleY = 1, scaleZ = 1,
  alpha = 1,
): Mesh => {
  const mesh = MeshBuilder.CreateSphere(uniqueName('sph'), { diameter: 1 }, scene);
  mesh.position = new Vector3(posX, posY, posZ);
  mesh.scaling = new Vector3(scaleX, scaleY, scaleZ);
  mesh.material = createMaterial(scene, red, green, blue, alpha);
  return mesh;
};
