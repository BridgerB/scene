import {
  Scene, Color3, Vector3, Quaternion,
  StandardMaterial, MeshBuilder, Mesh,
} from '@babylonjs/core';

let _id = 0;
const uid = (prefix: string) => `${prefix}${_id++}`;

const rng = (seed: number) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5;
  return x - Math.floor(x);
};

const mat = (scene: Scene, r: number, g: number, b: number): StandardMaterial => {
  const m = new StandardMaterial(uid('m'), scene);
  m.emissiveColor = new Color3(r, g, b);
  m.disableLighting = true;
  return m;
};

const sphere = (scene: Scene, r: number, g: number, b: number, x: number, y: number, z: number, sx = 1, sy = 1, sz = 1): Mesh => {
  const mesh = MeshBuilder.CreateSphere(uid('s'), { diameter: 1 }, scene);
  mesh.position = new Vector3(x, y, z);
  mesh.scaling = new Vector3(sx, sy, sz);
  mesh.material = mat(scene, r, g, b);
  return mesh;
};

const box = (scene: Scene, r: number, g: number, b: number, x: number, y: number, z: number, w: number, h: number, d: number): Mesh => {
  const mesh = MeshBuilder.CreateBox(uid('b'), { width: w, height: h, depth: d }, scene);
  mesh.position = new Vector3(x, y, z);
  mesh.material = mat(scene, r, g, b);
  return mesh;
};

const cyl = (scene: Scene, r: number, g: number, b: number, x: number, y: number, z: number, height: number, radius: number): Mesh => {
  const mesh = MeshBuilder.CreateCylinder(uid('c'), { height, diameter: radius * 2 }, scene);
  mesh.position = new Vector3(x, y, z);
  mesh.material = mat(scene, r, g, b);
  return mesh;
};

const cone = (scene: Scene, r: number, g: number, b: number, x: number, y: number, z: number, height: number, radius: number): Mesh => {
  const mesh = MeshBuilder.CreateCylinder(uid('cn'), { height, diameterBottom: radius * 2, diameterTop: 0 }, scene);
  mesh.position = new Vector3(x, y, z);
  mesh.material = mat(scene, r, g, b);
  return mesh;
};

const addSky = (scene: Scene) => {
  const sky = MeshBuilder.CreateSphere(uid('sky'), { diameter: 1000, sideOrientation: Mesh.BACKSIDE }, scene);
  sky.material = mat(scene, 0.90, 0.82, 0.88);

  const haze = MeshBuilder.CreateSphere(uid('haze'), { diameter: 2 }, scene);
  haze.scaling = new Vector3(1000, 18, 1000);
  haze.position = new Vector3(0, -18, 0);
  haze.material = mat(scene, 0.96, 0.90, 0.93);
};

const addGround = (scene: Scene) => {
  box(scene, 0.30, 0.46, 0.22, 0, -0.05, 0, 200, 0.1, 200);

  const gravelMat = mat(scene, 0.72, 0.68, 0.60);
  const gravelBox = (x: number, y: number, z: number, w: number, h: number, d: number, ry = 0) => {
    const mesh = MeshBuilder.CreateBox(uid('grav'), { width: w, height: h, depth: d }, scene);
    mesh.position = new Vector3(x, y, z);
    mesh.rotation.y = ry;
    mesh.material = gravelMat;
    return mesh;
  };

  gravelBox(0, 0.02, 14, 1.8, 0.08, 40);
  gravelBox(-7, 0.02, 22, 16, 0.08, 1.6);
  gravelBox(6, 0.02, 15, 14, 0.08, 1.6);
  gravelBox(-6, 0.02, 30, 1.4, 0.08, 10, 0.35);

  const darkMossMat = mat(scene, 0.22, 0.38, 0.16);

  Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * Math.PI * 2;
    const r = 8.5;
    const seg = MeshBuilder.CreateBox(uid('gcirc'), { width: 1.4, height: 0.07, depth: 1.6 }, scene);
    seg.position = new Vector3(-6 + Math.cos(angle) * r, 0.02, 15 - Math.sin(angle) * r);
    seg.rotation.y = angle;
    seg.material = gravelMat;
  });

  Array.from({ length: 25 }, (_, i) => {
    const patch = MeshBuilder.CreateSphere(uid('moss'), { diameter: 2 }, scene);
    patch.position = new Vector3((rng(i * 3) - 0.5) * 40, 0.02, rng(i * 3 + 1) * 40);
    patch.scaling = new Vector3(1.5 + rng(i * 3 + 2) * 2.5, 0.05, 1.2 + rng(i * 3 + 2) * 2.0);
    patch.material = darkMossMat;
  });
};

const addPonds = (scene: Scene) => {
  const waterMat = mat(scene, 0.16, 0.35, 0.42);
  const stoneMat = mat(scene, 0.52, 0.50, 0.46);
  const lilyMat = mat(scene, 0.20, 0.46, 0.18);
  const lotusMat = mat(scene, 0.98, 0.72, 0.78);
  const koiMats = [
    mat(scene, 0.95, 0.45, 0.10),
    mat(scene, 0.95, 0.95, 0.95),
    mat(scene, 0.80, 0.15, 0.10),
  ];

  const addPond = (cx: number, cz: number, sw: number, sd: number) => {
    const pond = MeshBuilder.CreateSphere(uid('pond'), { diameter: 2 }, scene);
    pond.position = new Vector3(cx, 0.03, cz);
    pond.scaling = new Vector3(sw, 0.06, sd);
    pond.material = waterMat;

    const rippleMat = mat(scene, 0.25, 0.48, 0.55);
    [0.4, 0.65, 0.85].forEach(r => {
      const ring = MeshBuilder.CreateCylinder(uid('rip'), { height: 0.02, diameter: r * 2 }, scene);
      ring.position = new Vector3(cx, 0.05, cz);
      ring.scaling = new Vector3(sw * 0.9, 1, sd * 0.9);
      ring.material = rippleMat;
    });

    Array.from({ length: 14 }, (_, i) => {
      const a = (i / 14) * Math.PI * 2;
      const ex = cx + Math.cos(a) * sw * 0.95;
      const ez = cz + Math.sin(a) * sd * 0.95;
      const s = MeshBuilder.CreateSphere(uid('pstone'), { diameter: 2 }, scene);
      s.position = new Vector3(ex, 0.1, ez);
      s.scaling = new Vector3(0.35 + rng(i * 5) * 0.3, 0.15, 0.28 + rng(i * 5 + 1) * 0.25);
      s.material = stoneMat;
    });

    Array.from({ length: 8 }, (_, i) => {
      const lx = cx + (rng(i * 7) - 0.5) * sw * 1.4;
      const lz = cz + (rng(i * 7 + 1) - 0.5) * sd * 1.4;
      const lily = MeshBuilder.CreateSphere(uid('lily'), { diameter: 2 }, scene);
      lily.position = new Vector3(lx, 0.06, lz);
      lily.scaling = new Vector3(0.32, 0.04, 0.28);
      lily.material = lilyMat;
      if (i % 3 === 0) {
        const lotus = MeshBuilder.CreateSphere(uid('lotus'), { diameter: 0.24 }, scene);
        lotus.position = new Vector3(lx, 0.18, lz);
        lotus.material = lotusMat;
      }
    });

    Array.from({ length: 4 }, (_, i) => {
      const koi = MeshBuilder.CreateSphere(uid('koi'), { diameter: 2 }, scene);
      koi.position = new Vector3(cx + (rng(i * 11) - 0.5) * sw, 0.10, cz + (rng(i * 11 + 1) - 0.5) * sd);
      koi.scaling = new Vector3(0.28, 0.10, 0.12);
      koi.material = koiMats[i % koiMats.length];
    });
  };

  addPond(-6, 16, 6.0, 4.2);
  addPond(9, 20, 3.5, 2.5);
};

const addBridge = (scene: Scene) => {
  const woodMat = mat(scene, 0.45, 0.28, 0.14);
  const railMat = mat(scene, 0.38, 0.22, 0.10);

  const bridgeLen = 14.5;
  const deck = MeshBuilder.CreateBox(uid('deck'), { width: bridgeLen, height: 0.15, depth: 1.6 }, scene);
  deck.position = new Vector3(-6, 0.2, 14);
  deck.material = woodMat;

  Array.from({ length: 10 }, (_, i) => {
    const plank = MeshBuilder.CreateBox(uid('plank'), { width: bridgeLen, height: 0.08, depth: 0.12 }, scene);
    plank.position = new Vector3(-6, 0.28, 13.2 + i * 0.16);
    plank.material = railMat;
  });

  [-0.7, 0.7].forEach(dz => {
    const rail = MeshBuilder.CreateBox(uid('rail'), { width: bridgeLen, height: 0.08, depth: 0.08 }, scene);
    rail.position = new Vector3(-6, 0.65, 14 + dz);
    rail.material = railMat;

    Array.from({ length: 8 }, (_, i) => {
      const post = MeshBuilder.CreateCylinder(uid('post'), { height: 0.65, diameter: 0.08 }, scene);
      post.position = new Vector3(-13 + i * 2.0, 0.4, 14 + dz);
      post.material = railMat;
    });
  });
};

const addSteppingStones = (scene: Scene) => {
  const stoneMat = mat(scene, 0.56, 0.53, 0.48);
  const stones: [number, number][] = [
    [0.2, 2], [-0.1, 4], [0.3, 6], [0, 8], [-0.2, 10],
    [0.1, 12], [0, 14], [0.2, 16], [-0.1, 18], [0, 20],
    [2, 15], [4, 15.2], [6, 14.8], [8, 15], [10, 14.5],
    [-2, 22], [-4, 22.2], [-6, 22], [-8, 21.8], [-10, 22],
    [-3, 26], [-5, 28], [-7, 30], [-8, 32],
  ];
  stones.forEach(([sx, sz]) => {
    const stone = MeshBuilder.CreateSphere(uid('step'), { diameter: 2 }, scene);
    stone.position = new Vector3(sx, 0.05, sz);
    stone.scaling = new Vector3(0.42 + rng(Math.floor(sx * 7 + sz)) * 0.2, 0.09, 0.38 + rng(Math.floor(sz * 5)) * 0.18);
    stone.material = stoneMat;
  });
};

const addCherryTrees = (scene: Scene) => {
  const blossomColors: [number, number, number][] = [
    [0.98, 0.72, 0.80],
    [0.96, 0.80, 0.87],
    [1.00, 0.88, 0.91],
    [0.95, 0.68, 0.76],
  ];
  const trunkMat = mat(scene, 0.26, 0.16, 0.10);

  const trees: [number, number, number][] = [
    [ 3.5,  5,  1.1], [-3.5,  6,  1.0], [ 6.5, 10,  1.3],
    [-5.0, 11,  0.9], [ 2.0, 18,  1.0], [-7.5, 17,  1.2],
    [ 9.5,  4,  0.8], [10.0, 19,  1.0], [-11,   7,  1.1],
    [-10,  22,  0.9], [ 5.0, 25,  1.2], [-4.5, 26,  1.0],
    [14.0, 13,  1.4], [-14,  14,  1.3], [ 1.0, 30,  1.1],
    [-8,   30,  1.0], [12.0, 26,  1.2], [-16,  20,  1.0],
    [ 7.0, 33,  0.9], [-3,   35,  1.1], [ 16,   6,  1.0],
    [-18,   8,  1.2], [ 4.0,  2,  0.9], [-2,    3,  0.8],
    [18.0, 18,  1.3], [-18,  28,  1.1], [ 11,  35,  1.0],
    [-12,  35,  1.2], [ 0,   38,  1.1], [8,    22,  0.9],
    [-6,   40,  1.0], [15,   30,  1.2], [-15,  32,  0.9],
    [ 3,   42,  1.0], [-10,  42,  1.1],
  ];

  const clusterOffsets: [number, number, number][] = [
    [0, 0, 0], [-0.7, 0.4, -0.2], [0.7, 0.3, 0.2],
    [0.2, 0.6, -0.5], [-0.4, 0.5, 0.4], [0.5, 0.2, -0.6],
    [-0.3, 0.7, -0.3], [0.4, 0.8, 0.5],
  ];

  trees.forEach(([tx, tz, s], i) => {
    const trunkH = 2.0 * s;

    const trunk = MeshBuilder.CreateCylinder(uid('trunk'), { height: trunkH, diameter: 0.26 * s }, scene);
    trunk.position = new Vector3(tx, trunkH / 2, tz);
    trunk.material = trunkMat;

    ([ [-0.5, 0.4], [0.45, -0.35] ] as [number, number][]).forEach(([bx, ba]) => {
      const branch = MeshBuilder.CreateCylinder(uid('branch'), { height: 1.1 * s, diameter: 0.14 * s }, scene);
      branch.position = new Vector3(tx + bx * s, trunkH + 0.25 * s, tz);
      branch.rotation.z = ba;
      branch.material = trunkMat;
    });

    const [br, bg, bb] = blossomColors[i % blossomColors.length];
    const blossomMat = mat(scene, br, bg, bb);
    const canopyY = trunkH + 1.1 * s;

    clusterOffsets.forEach(([ox, oy, oz]) => {
      const blossom = MeshBuilder.CreateSphere(uid('blossom'), { diameter: 2.1 * s }, scene);
      blossom.position = new Vector3(tx + ox * s, canopyY + oy * s, tz + oz * s);
      blossom.material = blossomMat;
    });
  });
};

const addEvergreens = (scene: Scene) => {
  const darkMat = mat(scene, 0.12, 0.28, 0.14);
  const trunkMat = mat(scene, 0.28, 0.18, 0.10);

  const positions: [number, number, number][] = [
    [ 12,  8,  1.0], [-13, 10, 1.1], [17, 22, 0.9],
    [-17, 18, 1.0], [  8, 28, 1.2], [-9, 32, 0.8],
    [ 14, 38, 1.0], [-14, 38, 1.1], [20, 12, 0.9],
    [-20, 12, 1.0],
  ];

  positions.forEach(([tx, tz, s]) => {
    const trunk = MeshBuilder.CreateCylinder(uid('evtrunk'), { height: 1.5 * s, diameter: 0.20 * s }, scene);
    trunk.position = new Vector3(tx, 0.75 * s, tz);
    trunk.material = trunkMat;

    ([[ 0, 2.0, 0.9], [0.9, 1.5, 0.65], [1.7, 1.0, 0.40]] as [number, number, number][]).forEach(([tier, h, r]) => {
      const c = MeshBuilder.CreateCylinder(uid('evcone'), { height: h * s, diameterBottom: r * s * 2, diameterTop: 0 }, scene);
      c.position = new Vector3(tx, 1.5 * s + tier * s, tz);
      c.material = darkMat;
    });
  });
};

const addPetals = (scene: Scene) => {
  const petalColors: [number, number, number][] = [
    [0.99, 0.80, 0.85],
    [1.00, 0.88, 0.90],
    [1.00, 1.00, 1.00],
  ];

  Array.from({ length: 300 }, (_, i) => {
    const [r, g, b] = petalColors[i % petalColors.length];
    const size = (0.035 + rng(i * 4 + 3) * 0.07) * 2;
    const petal = MeshBuilder.CreateSphere(uid('petal'), { diameter: size }, scene);
    petal.position = new Vector3((rng(i * 4) - 0.5) * 44, rng(i * 4 + 1) * 5.0, rng(i * 4 + 2) * 44);
    petal.scaling = new Vector3(1.0, 0.25, 1.3);
    petal.material = mat(scene, r, g, b);
  });

  Array.from({ length: 15 }, (_, i) => {
    const [r, g, b] = petalColors[i % petalColors.length];
    const drift = MeshBuilder.CreateSphere(uid('drift'), { diameter: 2 }, scene);
    drift.position = new Vector3((rng(i * 6) - 0.5) * 30, 0.03, 2 + rng(i * 6 + 1) * 35);
    drift.scaling = new Vector3(0.8 + rng(i * 6 + 2) * 1.2, 0.04, 0.6 + rng(i * 6 + 3) * 1.0);
    drift.material = mat(scene, r, g, b);
  });
};

const addFlowerBushes = (scene: Scene) => {
  const bushColors: [number, number, number][] = [
    [0.95, 0.50, 0.65],
    [0.98, 0.90, 0.92],
    [0.80, 0.15, 0.20],
    [0.90, 0.75, 0.20],
    [0.55, 0.28, 0.70],
  ];

  const positions: [number, number][] = [
    [ 1.5,  4], [-1.5,  4], [3,  9], [-3,  9], [2, 14],
    [-2,  14], [4, 20], [-4, 20], [6, 24], [-6, 24],
    [8,   10], [-8, 12], [10, 28], [-10, 28], [5, 32],
    [-5,  32], [12, 16], [-12, 18], [3, 36], [-3, 36],
    [7,    6], [-7,  6], [11, 22], [-11, 22], [2, 40],
    [-8,  38], [14, 32], [-14, 30], [6, 42], [-6, 42],
  ];

  positions.forEach(([bx, bz], i) => {
    const [r, g, b] = bushColors[i % bushColors.length];
    const bushMat = mat(scene, r, g, b);
    const s = 0.25 + rng(i * 3) * 0.25;
    Array.from({ length: 3 }, (_, j) => {
      const bush = MeshBuilder.CreateSphere(uid('bush'), { diameter: s * 2 }, scene);
      bush.position = new Vector3(bx + (rng(i * 3 + j) - 0.5) * 0.4, s * 0.8, bz + (rng(i * 3 + j + 1) - 0.5) * 0.4);
      bush.material = bushMat;
    });
  });
};

const addToriiGates = (scene: Scene) => {
  const redMat = mat(scene, 0.80, 0.12, 0.08);
  const darkRedMat = mat(scene, 0.52, 0.07, 0.04);

  const addTorii = (x: number, z: number, scale: number, angle = 0) => {
    const s = scale;
    const pillarH = 5.5 * s;
    const span = 2.0 * s;

    [-span, span].forEach(dx => {
      const pillar = MeshBuilder.CreateCylinder(uid('tpillar'), { height: pillarH, diameter: 0.44 * s }, scene);
      pillar.position = new Vector3(x + dx, pillarH / 2, z);
      pillar.rotation.y = angle;
      pillar.material = redMat;

      const base = MeshBuilder.CreateBox(uid('tbase'), { width: 0.6 * s, height: 0.4 * s, depth: 0.6 * s }, scene);
      base.position = new Vector3(x + dx, 0.2 * s, z);
      base.material = darkRedMat;
    });

    const kasagi = MeshBuilder.CreateBox(uid('kasagi'), { width: (span * 2 + 1.4) * s, height: 0.35 * s, depth: 0.45 * s }, scene);
    kasagi.position = new Vector3(x, pillarH + 0.15 * s, z);
    kasagi.material = redMat;

    [-(span + 0.5) * s, (span + 0.5) * s].forEach(dx => {
      const up = MeshBuilder.CreateBox(uid('tup'), { width: 0.45 * s, height: 0.25 * s, depth: 0.45 * s }, scene);
      up.position = new Vector3(x + dx, pillarH + 0.28 * s, z);
      up.material = redMat;
    });

    const shimagi = MeshBuilder.CreateBox(uid('shimagi'), { width: span * 2.0 * s, height: 0.22 * s, depth: 0.30 * s }, scene);
    shimagi.position = new Vector3(x, pillarH - 0.7 * s, z);
    shimagi.material = darkRedMat;

    const nuki = MeshBuilder.CreateBox(uid('nuki'), { width: span * 1.8 * s, height: 0.20 * s, depth: 0.25 * s }, scene);
    nuki.position = new Vector3(x, pillarH * 0.55, z);
    nuki.material = darkRedMat;
  };

  addTorii(0,  22, 1.0);
  addTorii(5,  10, 0.7);
  addTorii(-8, 34, 0.85, 0.3);
};

const addLanterns = (scene: Scene) => {
  const stoneMat = mat(scene, 0.56, 0.53, 0.48);
  const glowMat = mat(scene, 1.0, 0.88, 0.55);

  const positions: [number, number][] = [
    [ 2.5,  22], [-2.5,  22],
    [ 3.5,  10], [ 6.5,  10],
    [-6,   34], [-10,   34],
    [ 1.5,   5], [-1.5,   5],
    [ 1.5,  12], [-1.5,  12],
    [ 1.5,  18], [-1.5,  18],
    [ 1.5,  28], [-1.5,  28],
    [-2,   14], [-10,   14], [-6,  10], [-6,  20],
    [ 7,   20], [ 11,   20],
  ];

  positions.forEach(([lx, lz]) => {
    const base = MeshBuilder.CreateCylinder(uid('lbase'), { height: 0.3, diameter: 0.64 }, scene);
    base.position = new Vector3(lx, 0.15, lz);
    base.material = stoneMat;

    const shaft = MeshBuilder.CreateCylinder(uid('lshaft'), { height: 1.0, diameter: 0.22 }, scene);
    shaft.position = new Vector3(lx, 0.8, lz);
    shaft.material = stoneMat;

    const mid = MeshBuilder.CreateBox(uid('lmid'), { width: 0.40, height: 0.16, depth: 0.40 }, scene);
    mid.position = new Vector3(lx, 1.38, lz);
    mid.material = stoneMat;

    const glow = MeshBuilder.CreateBox(uid('lglow'), { width: 0.36, height: 0.40, depth: 0.36 }, scene);
    glow.position = new Vector3(lx, 1.72, lz);
    glow.material = glowMat;

    const roof = MeshBuilder.CreateBox(uid('lroof'), { width: 0.52, height: 0.09, depth: 0.52 }, scene);
    roof.position = new Vector3(lx, 1.96, lz);
    roof.material = stoneMat;

    const cap = MeshBuilder.CreateCylinder(uid('lcap'), { height: 0.20, diameterBottom: 0.52, diameterTop: 0 }, scene);
    cap.position = new Vector3(lx, 2.12, lz);
    cap.material = stoneMat;
  });
};

const addBambooFence = (scene: Scene) => {
  const bamMat = mat(scene, 0.50, 0.56, 0.26);
  const ropeMat = mat(scene, 0.42, 0.32, 0.20);

  const fenceRow = (start: Vector3, end: Vector3, count: number) => {
    const total = count;
    const diff = end.subtract(start);
    const len = diff.length();
    const dir = diff.normalize();

    Array.from({ length: total }, (_, i) => {
      const t = i / (total - 1);
      const pos = start.add(diff.scale(t));

      const post = MeshBuilder.CreateCylinder(uid('fpost'), { height: 1.4, diameter: 0.13 }, scene);
      post.position = new Vector3(pos.x, 0.7, pos.z);
      post.material = bamMat;
    });

    [0.5, 1.0].forEach(ry => {
      const rail = MeshBuilder.CreateCylinder(uid('frail'), { height: len, diameter: 0.08 }, scene);
      const mid = start.add(end).scale(0.5);
      rail.position = new Vector3(mid.x, ry, mid.z);

      const up = Vector3.Up();
      const cross = Vector3.Cross(up, dir).normalize();
      const dot = Math.max(-1, Math.min(1, Vector3.Dot(up, dir)));
      rail.rotationQuaternion = Quaternion.RotationAxis(cross, Math.acos(dot));

      rail.material = ropeMat;
    });
  };

  fenceRow(new Vector3(-22, 0, -3),  new Vector3( 22, 0, -3),  20);
  fenceRow(new Vector3(-22, 0,  45), new Vector3( 22, 0,  45), 20);
  fenceRow(new Vector3(-22, 0, -3),  new Vector3(-22, 0,  45), 22);
  fenceRow(new Vector3( 22, 0, -3),  new Vector3( 22, 0,  45), 22);
};

const addPagoda = (scene: Scene) => {
  const wallMat = mat(scene, 0.55, 0.20, 0.08);
  const roofMat = mat(scene, 0.20, 0.28, 0.18);
  const stoneMat = mat(scene, 0.55, 0.52, 0.46);

  const px = 0, pz = 40;

  const platform = MeshBuilder.CreateBox(uid('platform'), { width: 5, height: 0.5, depth: 5 }, scene);
  platform.position = new Vector3(px, 0.25, pz);
  platform.material = stoneMat;

  const tiers: [number, number][] = [[3.6, 1.4], [2.9, 1.2], [2.3, 1.0], [1.8, 0.9], [1.3, 0.8]];
  let y = 0.5;

  tiers.forEach(([w, h], ti) => {
    const wall = MeshBuilder.CreateBox(uid('pwall'), { width: w, height: h, depth: w }, scene);
    wall.position = new Vector3(px, y + h / 2, pz);
    wall.material = wallMat;
    y += h;

    const eave = MeshBuilder.CreateBox(uid('eave'), { width: w + 1.2, height: 0.18, depth: w + 1.2 }, scene);
    eave.position = new Vector3(px, y + 0.09, pz);
    eave.material = roofMat;
    y += 0.28;

    const hw = (w + 1.2) / 2;
    [[-hw, -hw], [hw, -hw], [-hw, hw], [hw, hw]].forEach(([cx, cz]) => {
      const corner = MeshBuilder.CreateBox(uid('corner'), { width: 0.25, height: 0.18, depth: 0.25 }, scene);
      corner.position = new Vector3(px + cx, y - 0.19, pz + cz);
      corner.material = roofMat;
    });

    if (ti < tiers.length - 1) y += 0.1;
  });

  const spire = MeshBuilder.CreateCylinder(uid('spire'), { height: 1.5, diameter: 0.16 }, scene);
  spire.position = new Vector3(px, y + 0.75, pz);
  spire.material = wallMat;

  const finial = MeshBuilder.CreateSphere(uid('finial'), { diameter: 0.36 }, scene);
  finial.position = new Vector3(px, y + 1.5, pz);
  finial.material = roofMat;
};

const addRockGarden = (scene: Scene) => {
  const gravelMat = mat(scene, 0.80, 0.76, 0.68);
  const rakeMat = mat(scene, 0.68, 0.64, 0.56);
  const rockMat = mat(scene, 0.45, 0.43, 0.40);

  const gravel = MeshBuilder.CreateBox(uid('rgravel'), { width: 10, height: 0.06, depth: 8 }, scene);
  gravel.position = new Vector3(8, 0.02, 38);
  gravel.material = gravelMat;

  Array.from({ length: 8 }, (_, i) => {
    const rake = MeshBuilder.CreateBox(uid('rake'), { width: 10, height: 0.04, depth: 0.08 }, scene);
    rake.position = new Vector3(8, 0.05, 35 + i * 0.9);
    rake.material = rakeMat;
  });

  const rocks: [number, number, number, number, number][] = [
    [6,  36, 1.2, 0.9, 1.0],
    [10, 39, 0.7, 0.6, 0.8],
    [8,  41, 1.4, 1.0, 1.2],
    [5,  40, 0.5, 0.4, 0.6],
    [11, 37, 0.9, 0.7, 0.8],
    [9,  35, 0.6, 0.5, 0.7],
  ];

  rocks.forEach(([rx, rz, sx, sy, sz]) => {
    const rock = MeshBuilder.CreateSphere(uid('rock'), { diameter: 2 }, scene);
    rock.position = new Vector3(rx, 0.3, rz);
    rock.scaling = new Vector3(sx, sy, sz);
    rock.material = rockMat;
  });
};

export const buildCherryBlossom = (scene: Scene) => {
  _id = 0;
  addSky(scene);
  addGround(scene);
  addPonds(scene);
  addBridge(scene);
  addSteppingStones(scene);
  addCherryTrees(scene);
  addEvergreens(scene);
  addPetals(scene);
  addFlowerBushes(scene);
  addToriiGates(scene);
  addLanterns(scene);
  addBambooFence(scene);
  addPagoda(scene);
  addRockGarden(scene);
};
