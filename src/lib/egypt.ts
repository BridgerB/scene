import { Scene, Color3, Vector3, StandardMaterial, MeshBuilder, Mesh } from '@babylonjs/core';

const rng = (seed: number) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5;
  return x - Math.floor(x);
};

const unlitMat = (scene: Scene, name: string, r: number, g: number, b: number, alpha = 1) => {
  const m = new StandardMaterial(name, scene);
  m.emissiveColor = new Color3(r, g, b);
  m.disableLighting = true;
  if (alpha < 1) m.alpha = alpha;
  return m;
};

const box = (scene: Scene, name: string, w: number, h: number, d: number, r: number, g: number, b: number, x: number, y: number, z: number) => {
  const mesh = MeshBuilder.CreateBox(name, { width: w, height: h, depth: d }, scene);
  mesh.position = new Vector3(x, y, z);
  mesh.material = unlitMat(scene, `${name}M`, r, g, b);
  return mesh;
};

const sphere = (scene: Scene, name: string, radius: number, r: number, g: number, b: number, x: number, y: number, z: number, alpha = 1) => {
  const mesh = MeshBuilder.CreateSphere(name, { diameter: radius * 2 }, scene);
  mesh.position = new Vector3(x, y, z);
  mesh.material = unlitMat(scene, `${name}M`, r, g, b, alpha);
  return mesh;
};

const cyl = (scene: Scene, name: string, height: number, radius: number, r: number, g: number, b: number, x: number, y: number, z: number) => {
  const mesh = MeshBuilder.CreateCylinder(name, { height, diameter: radius * 2 }, scene);
  mesh.position = new Vector3(x, y, z);
  mesh.material = unlitMat(scene, `${name}M`, r, g, b);
  return mesh;
};

const addSky = (scene: Scene) => {
  const sky = MeshBuilder.CreateSphere('sky', { diameter: 1000, sideOrientation: Mesh.BACKSIDE }, scene);
  sky.material = unlitMat(scene, 'skyM', 0.52, 0.72, 0.92);

  const haze = MeshBuilder.CreateSphere('haze', { diameter: 2 }, scene);
  haze.scaling = new Vector3(1000, 30, 1000);
  haze.position.y = -30;
  haze.material = unlitMat(scene, 'hazeM', 0.88, 0.78, 0.55);
};

const addGround = (scene: Scene) =>
  box(scene, 'ground', 1000, 0.1, 1000, 0.82, 0.70, 0.45, 0, -0.05, 0);

const addDunes = (scene: Scene) => {
  const mat = unlitMat(scene, 'duneM', 0.78, 0.65, 0.38);
  const dunes: [number, number, number, number, number][] = [
    [-80, -50, 40, 4, 30], [90, -60, 35, 5, 25], [-50, -80, 50, 6, 38],
    [0, -90, 45, 4, 35], [120, -40, 30, 3, 22], [-120, -45, 38, 5, 28], [60, -100, 55, 7, 42],
  ];
  dunes.forEach(([px, pz, sx, sy, sz], i) => {
    const dune = MeshBuilder.CreateSphere(`dune${i}`, { diameter: 2 }, scene);
    dune.position = new Vector3(px, 0, -pz);
    dune.scaling = new Vector3(sx, sy, sz);
    dune.material = mat;
  });
};

const addSteppedPyramid = (scene: Scene, x: number, sz: number, height: number, baseWidth: number, layers: number, r: number, g: number, b: number) => {
  const layerH = height / layers;
  Array.from({ length: layers }, (_, i) => {
    const t = i / layers;
    const w = baseWidth * (1 - t) + 0.5;
    const shade = 1 - t * 0.15;
    const layer = MeshBuilder.CreateBox(`pyr_${x}_${sz}_${i}`, { width: w, height: layerH, depth: w }, scene);
    layer.position = new Vector3(x, layerH * 0.5 + i * layerH, -sz);
    layer.material = unlitMat(scene, `pyrM_${x}_${sz}_${i}`, r * shade, g * shade, b * shade);
  });
};

const addPyramids = (scene: Scene) => {
  addSteppedPyramid(scene, 18, -60, 40, 56, 16, 0.80, 0.68, 0.46);
  addSteppedPyramid(scene, -15, -80, 36, 50, 14, 0.75, 0.63, 0.42);
  addSteppedPyramid(scene, -42, -95, 20, 30, 10, 0.72, 0.60, 0.40);
};

const addDetailedSphinx = (scene: Scene) => {
  const cx = 10;
  const stone  = [0.76, 0.64, 0.42] as const;
  const dark   = [0.52, 0.43, 0.28] as const;
  const light  = [0.88, 0.76, 0.54] as const;
  const shadow = [0.45, 0.37, 0.24] as const;

  let idx = 0;
  const b = (w: number, h: number, d: number, [r, g, b]: readonly [number, number, number], x: number, y: number, z: number) =>
    box(scene, `sx${idx++}`, w, h, d, r, g, b, cx + x, y, 16 + z);
  const s = (radius: number, [r, g, bv]: readonly [number, number, number], x: number, y: number, z: number) =>
    sphere(scene, `sx${idx++}`, radius, r, g, bv, cx + x, y, 16 + z);
  const c = (h: number, r: number, [cr, cg, cb]: readonly [number, number, number], x: number, y: number, z: number) =>
    cyl(scene, `sx${idx++}`, h, r, cr, cg, cb, cx + x, y, 16 + z);

  b(8, 0.5, 16, dark, 0, 0.25, 0);
  b(5, 3.5, 11, stone, 0, 2.0, 0);
  [-2.2, 2.2].forEach(dx => b(2, 4.0, 3.5, stone, dx, 2.0, 3.5));
  [-2.0, 2.0].forEach(dx => b(1.8, 4.2, 2.5, stone, dx, 2.1, -2.5));
  b(4.8, 3.8, 0.3, light, 0, 2.2, -5.8);
  [-1.4, 1.4].forEach(dx => {
    b(1.3, 0.9, 5.0, stone, dx, 0.7, -8.0);
    [-0.35, 0, 0.35].forEach(toe => b(0.35, 0.5, 0.6, dark, dx + toe, 0.5, -10.6));
  });
  b(1.4, 0.6, 5.0, shadow, 0, 0.4, -8.0);
  b(0.6, 0.5, 3.0, stone, 1.5, 3.6, 4.5);
  b(0.6, 1.2, 0.5, stone, 1.5, 4.5, 5.8);
  b(2.4, 2.8, 2.0, stone, 0, 4.8, -5.2);
  b(2.6, 2.6, 2.8, stone, 0, 7.0, -5.0);
  b(2.6, 0.4, 0.3, dark, 0, 8.0, -6.3);
  [-0.7, 0.7].forEach(dx => {
    b(0.55, 0.35, 0.25, shadow, dx, 7.6, -6.35);
    b(0.30, 0.20, 0.30, dark, dx, 7.6, -6.5);
  });
  [-1.1, 1.1].forEach(dx => b(0.5, 0.6, 0.25, light, dx, 7.0, -6.3));
  b(0.7, 0.5, 0.2, stone, 0, 6.6, -6.35);
  b(1.0, 0.15, 0.2, shadow, 0, 6.1, -6.35);
  b(1.0, 0.3, 0.25, stone, 0, 6.0, -6.35);
  b(0.7, 1.8, 0.6, dark, 0, 4.8, -6.2);
  b(0.5, 0.5, 0.5, dark, 0, 3.9, -6.1);
  b(3.4, 0.6, 2.6, light, 0, 8.4, -4.9);
  [-1.5, 1.5].forEach(dx => {
    b(0.7, 3.0, 0.4, stone, dx, 6.5, -4.8);
    [0, 0.7, 1.4, 2.1].forEach(sy => b(0.7, 0.12, 0.45, dark, dx, 5.0 + sy, -4.8));
  });
  b(2.0, 2.5, 0.4, stone, 0, 6.5, -3.8);
  c(0.8, 0.15, dark, 0, 8.9, -6.0);
  s(0.22, dark, 0, 9.6, -6.1);
};

const addSun = (scene: Scene) => {
  sphere(scene, 'sun', 8, 1.0, 0.97, 0.75, 80, 120, 200);
  sphere(scene, 'halo', 14, 1.0, 0.90, 0.55, 80, 120, 200, 0.25);
};

const addRubble = (scene: Scene) => {
  const mat = unlitMat(scene, 'rubbleM', 0.68, 0.57, 0.38);
  Array.from({ length: 40 }, (_, i) => {
    const x = (rng(i * 5) - 0.5) * 60;
    const z = 2 + rng(i * 5 + 1) * 50;
    const s = 0.2 + rng(i * 5 + 2) * 0.8;
    const rock = i % 2 === 0
      ? MeshBuilder.CreateBox(`rb${i}`, { size: s }, scene)
      : MeshBuilder.CreateSphere(`rb${i}`, { diameter: s }, scene);
    rock.position = new Vector3(x, s * 0.25, z);
    rock.material = mat;
  });
};

export const buildEgypt = (scene: Scene) => {
  addSky(scene);
  addGround(scene);
  addDunes(scene);
  addPyramids(scene);
  addDetailedSphinx(scene);
  addSun(scene);
  addRubble(scene);
};
