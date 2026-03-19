/**
 * Enclosure — the massive hall shell that forms the interior space.
 *
 * "The floor stretches forward in a vast, reflective checkerboard of
 * grey and slate tiles, its perspective lines pulling the eye relentlessly
 * toward the distant focal point."
 *
 * There is no sky sphere; the scene is entirely enclosed to convey the
 * claustrophobic grandeur of the imperial audience chamber. The enclosure
 * is built from multiple layers:
 *
 *   1. **Floor slab** — deep structural base beneath everything.
 *   2. **Checkerboard tiles** — alternating grey and slate tiles with
 *      thin grout lines between them and slight brightness variation
 *      to break up the uniformity.
 *   3. **Floor edge trim** — a darker border strip running along both
 *      wall bases where floor meets stone.
 *   4. **Reflective floor sheen** — faint elongated highlight patches
 *      simulating the polished, mirror-like surface described in the art.
 *   5. **Ceiling void** — a near-black slab with recessed coffered
 *      panels and structural ribs crossing between them.
 *   6. **Ceiling hanging elements** — stalactite-like pendants and
 *      chain-like vertical threads descending from the ceiling.
 *   7. **Rear wall** — the back wall behind the throne with layered
 *      relief panels and a massive carved emblem at its center.
 *   8. **Entrance wall** — a partial wall behind the viewer with the
 *      grand doorway opening framing the hall.
 *   9. **Upper clerestory band** — a narrow strip of slightly lighter
 *      stone running just below the ceiling on both sides, implying
 *      the hidden apertures where divine light enters.
 *  10. **Floor drain channels** — thin dark grooves running lengthwise,
 *      suggesting ancient water or spice-flow channels beneath the tiles.
 */
import { Scene, Vector3, MeshBuilder } from '@babylonjs/core';
import { uniqueName, seededRandom, createMaterial, createBox, createCylinder, createSphere } from './utils';

// ── Hall dimensions ────────────────────────────────────────────────────────
/** Total length of the hall along the Z axis (entrance → throne). */
const HALL_LENGTH = 300;
/** Total width of the hall along the X axis. */
const HALL_WIDTH = 120;
/** Total height from floor to ceiling. */
const HALL_HEIGHT = 140;

// ── Floor tiles ────────────────────────────────────────────────────────────
/** Side length of each checkerboard tile. */
const TILE_SIZE = 6;
/** Slight gap between tiles to imply grout lines. */
const TILE_SCALE = 0.97;
/** Brightness variance applied per-tile for visual texture. */
const TILE_BRIGHTNESS_VARIANCE = 0.02;

// ── Floor trim ─────────────────────────────────────────────────────────────
const FLOOR_TRIM_WIDTH = 1.5;

// ── Floor sheen ────────────────────────────────────────────────────────────
const SHEEN_PATCH_COUNT = 20;

// ── Ceiling ────────────────────────────────────────────────────────────────
const COFFER_COLUMNS = 8;
const COFFER_ROWS = 20;
const CEILING_RIB_COUNT_X = 9;
const CEILING_RIB_COUNT_Z = 21;

// ── Ceiling pendants ───────────────────────────────────────────────────────
const PENDANT_COUNT = 16;
const CHAIN_THREAD_COUNT = 24;

// ── Rear wall ──────────────────────────────────────────────────────────────
const REAR_RELIEF_LAYER_COUNT = 4;
const REAR_EMBLEM_RING_COUNT = 5;

// ── Entrance wall ──────────────────────────────────────────────────────────
const ENTRANCE_DOOR_WIDTH = 20;
const ENTRANCE_DOOR_HEIGHT = 30;

// ── Clerestory ─────────────────────────────────────────────────────────────
const CLERESTORY_HEIGHT = 3;

// ── Drain channels ─────────────────────────────────────────────────────────
const DRAIN_CHANNEL_COUNT = 6;

// ── Layer builders ─────────────────────────────────────────────────────────

/**
 * Adds the deep structural floor slab beneath everything — a single
 * massive dark box that prevents seeing through any tile gaps.
 */
const addFloorSlab = (scene: Scene) => {
  createBox(scene, 0.06, 0.05, 0.07,
    0, -0.5, HALL_LENGTH / 2,
    HALL_WIDTH + 10, 1, HALL_LENGTH + 10);
};

/**
 * Adds the checkerboard tile grid. Each tile has a slight per-tile
 * brightness variance (seeded by position) so the floor reads as
 * real stone rather than a flat texture. The TILE_SCALE < 1 leaves
 * hairline gaps that imply grout lines.
 */
const addCheckerboardTiles = (scene: Scene) => {
  const columnsX = Math.floor(HALL_WIDTH / TILE_SIZE);
  const rowsZ = Math.floor(HALL_LENGTH / TILE_SIZE);

  // Pre-create a small pool of materials with slight brightness offsets
  const lightBaseBrightness = 0.14;
  const darkBaseBrightness = 0.06;
  const lightMaterials = Array.from({ length: 5 }, (_, index) => {
    const offset = (index - 2) * TILE_BRIGHTNESS_VARIANCE;
    return createMaterial(scene,
      lightBaseBrightness + offset,
      lightBaseBrightness - 0.01 + offset,
      lightBaseBrightness + 0.02 + offset);
  });
  const darkMaterials = Array.from({ length: 5 }, (_, index) => {
    const offset = (index - 2) * TILE_BRIGHTNESS_VARIANCE;
    return createMaterial(scene,
      darkBaseBrightness + offset,
      darkBaseBrightness - 0.01 + offset,
      darkBaseBrightness + 0.01 + offset);
  });

  const tileWidth = TILE_SIZE * TILE_SCALE;

  for (let column = 0; column < columnsX; column++) {
    for (let row = 0; row < rowsZ; row++) {
      const tile = MeshBuilder.CreateBox(
        uniqueName('tile'),
        { width: tileWidth, height: 0.05, depth: tileWidth },
        scene,
      );
      tile.position = new Vector3(
        -HALL_WIDTH / 2 + column * TILE_SIZE + TILE_SIZE / 2,
        0.03,
        row * TILE_SIZE + TILE_SIZE / 2,
      );

      const isLight = (column + row) % 2 === 0;
      const materialVariant = Math.floor(seededRandom(column * 97 + row * 31) * 5);
      tile.material = isLight
        ? lightMaterials[materialVariant]
        : darkMaterials[materialVariant];
    }
  }
};

/**
 * Adds a dark border trim strip running along both wall bases where
 * the floor meets the carved stone, grounding the walls visually.
 */
const addFloorEdgeTrim = (scene: Scene) => {
  const wallOffsetX = 58;

  [-1, 1].forEach(sideSign => {
    createBox(scene, 0.04, 0.03, 0.05,
      sideSign * (wallOffsetX - FLOOR_TRIM_WIDTH / 2), 0.04, HALL_LENGTH / 2,
      FLOOR_TRIM_WIDTH, 0.06, HALL_LENGTH);
  });

  // Front edge trim
  createBox(scene, 0.04, 0.03, 0.05,
    0, 0.04, -0.5,
    HALL_WIDTH, 0.06, 1);

  // Rear edge trim (at throne wall)
  createBox(scene, 0.04, 0.03, 0.05,
    0, 0.04, HALL_LENGTH + 0.5,
    HALL_WIDTH, 0.06, 1);
};

/**
 * Adds faint elongated highlight patches on the floor simulating the
 * polished, mirror-like surface — the "reflective" quality described
 * in the concept art where perspective lines pull the eye forward.
 */
const addFloorSheen = (scene: Scene) => {
  for (let index = 0; index < SHEEN_PATCH_COUNT; index++) {
    const sheenX = (seededRandom(index * 83) - 0.5) * 40;
    const sheenZ = 10 + seededRandom(index * 83 + 1) * (HALL_LENGTH - 20);
    const sheenWidth = 4 + seededRandom(index * 83 + 2) * 10;
    const sheenDepth = sheenWidth * (1.5 + seededRandom(index * 83 + 3) * 2);

    createSphere(scene, 0.16, 0.15, 0.18,
      sheenX, 0.06, sheenZ,
      sheenWidth, 0.05, sheenDepth, 0.04);
  }
};

/**
 * Adds the ceiling void — a near-black slab with recessed coffered panels
 * and a grid of structural ribs crossing between them. The coffers deepen
 * the darkness overhead while the ribs imply massive structural engineering.
 */
const addCeiling = (scene: Scene) => {
  // Main ceiling slab
  createBox(scene, 0.025, 0.018, 0.03,
    0, HALL_HEIGHT, HALL_LENGTH / 2,
    HALL_WIDTH + 20, 2, HALL_LENGTH + 20);

  // Coffered panels — recessed dark rectangles in a grid
  const cofferWidth = (HALL_WIDTH - 10) / COFFER_COLUMNS;
  const cofferDepth = (HALL_LENGTH - 10) / COFFER_ROWS;

  for (let col = 0; col < COFFER_COLUMNS; col++) {
    for (let row = 0; row < COFFER_ROWS; row++) {
      const cofferX = -HALL_WIDTH / 2 + 5 + col * cofferWidth + cofferWidth / 2;
      const cofferZ = 5 + row * cofferDepth + cofferDepth / 2;

      // Recessed void — slightly darker than the slab
      createBox(scene, 0.015, 0.01, 0.02,
        cofferX, HALL_HEIGHT - 1.5, cofferZ,
        cofferWidth * 0.85, 1, cofferDepth * 0.85);
    }
  }

  // Structural ribs running in the X direction
  for (let ribIndex = 0; ribIndex < CEILING_RIB_COUNT_Z; ribIndex++) {
    const ribZ = 5 + ribIndex * (HALL_LENGTH / (CEILING_RIB_COUNT_Z - 1));
    createBox(scene, 0.035, 0.025, 0.04,
      0, HALL_HEIGHT - 0.6, ribZ,
      HALL_WIDTH - 8, 1.2, 0.8);
  }

  // Structural ribs running in the Z direction
  for (let ribIndex = 0; ribIndex < CEILING_RIB_COUNT_X; ribIndex++) {
    const ribX = -HALL_WIDTH / 2 + 5 + ribIndex * ((HALL_WIDTH - 10) / (CEILING_RIB_COUNT_X - 1));
    createBox(scene, 0.035, 0.025, 0.04,
      ribX, HALL_HEIGHT - 0.6, HALL_LENGTH / 2,
      0.8, 1.2, HALL_LENGTH - 8);
  }
};

/**
 * Adds stalactite-like pendants and vertical chain threads descending
 * from the ceiling. The pendants are inverted cone-shapes at rib
 * intersections; the chains are thin cylinders hanging into the void.
 */
const addCeilingHangingElements = (scene: Scene) => {
  // Pendants at selected rib intersections
  for (let index = 0; index < PENDANT_COUNT; index++) {
    const pendantX = (seededRandom(index * 61) - 0.5) * (HALL_WIDTH - 20);
    const pendantZ = 20 + seededRandom(index * 61 + 1) * (HALL_LENGTH - 40);
    const pendantLength = 3 + seededRandom(index * 61 + 2) * 6;

    // Inverted cone body
    createCylinder(scene, 0.05, 0.04, 0.06,
      pendantX, HALL_HEIGHT - 2 - pendantLength / 2, pendantZ,
      pendantLength, 0.6);

    // Pointed tip — smaller cylinder
    createCylinder(scene, 0.06, 0.045, 0.07,
      pendantX, HALL_HEIGHT - 2 - pendantLength - 0.5, pendantZ,
      1, 0.15);

    // Mount plate at ceiling
    createBox(scene, 0.04, 0.03, 0.05,
      pendantX, HALL_HEIGHT - 1.2, pendantZ,
      1.5, 0.4, 1.5);
  }

  // Chain threads — thin dark vertical lines descending from the ceiling
  for (let index = 0; index < CHAIN_THREAD_COUNT; index++) {
    const chainX = (seededRandom(index * 79) - 0.5) * (HALL_WIDTH - 30);
    const chainZ = 15 + seededRandom(index * 79 + 1) * (HALL_LENGTH - 30);
    const chainLength = 8 + seededRandom(index * 79 + 2) * 20;

    createCylinder(scene, 0.04, 0.03, 0.05,
      chainX, HALL_HEIGHT - 2 - chainLength / 2, chainZ,
      chainLength, 0.04);
  }
};

/**
 * Adds the rear wall behind the throne — the back wall closing off the
 * far end of the hall. Features layered relief panels stepping forward
 * from the surface and a massive carved emblem at its center (concentric
 * rings suggesting an imperial seal or Guild symbol).
 */
const addRearWall = (scene: Scene) => {
  const rearZ = HALL_LENGTH + 5;

  // Main wall mass
  createBox(scene, 0.10, 0.08, 0.12,
    0, HALL_HEIGHT / 2, rearZ,
    HALL_WIDTH + 20, HALL_HEIGHT, 10);

  // Layered relief panels — each stepping slightly forward and narrower
  for (let layerIndex = 0; layerIndex < REAR_RELIEF_LAYER_COUNT; layerIndex++) {
    const layerWidth = HALL_WIDTH * (0.7 - layerIndex * 0.12);
    const layerHeight = HALL_HEIGHT * (0.8 - layerIndex * 0.1);
    const layerDepth = 1 + layerIndex * 0.5;
    const brightness = 0.12 + layerIndex * 0.03;

    createBox(scene, brightness, brightness - 0.02, brightness + 0.02,
      0, HALL_HEIGHT / 2 + layerIndex * 3, rearZ - 5 - layerIndex * 1.2,
      layerWidth, layerHeight, layerDepth);
  }

  // Central carved emblem — concentric rings of decreasing radius
  const emblemCenterY = HALL_HEIGHT * 0.55;
  const emblemZ = rearZ - 8;

  for (let ringIndex = 0; ringIndex < REAR_EMBLEM_RING_COUNT; ringIndex++) {
    const ringRadius = 18 - ringIndex * 3;
    const ringBrightness = 0.15 + ringIndex * 0.04;
    const ringThickness = 0.8 - ringIndex * 0.1;

    createCylinder(scene,
      ringBrightness, ringBrightness - 0.02, ringBrightness + 0.03,
      0, emblemCenterY, emblemZ,
      ringThickness, ringRadius, 0.7);
  }

  // Emblem center — a bright focal point
  createSphere(scene, 0.35, 0.28, 0.20,
    0, emblemCenterY, emblemZ - 0.5,
    4, 4, 2);

  // Radiating lines from emblem center — like a starburst or imperial seal rays
  for (let rayIndex = 0; rayIndex < 12; rayIndex++) {
    const rayAngle = (rayIndex / 12) * Math.PI * 2;
    const rayLength = 15;
    const rayEndX = Math.cos(rayAngle) * rayLength;
    const rayEndY = Math.sin(rayAngle) * rayLength;

    createBox(scene, 0.20, 0.16, 0.14,
      rayEndX / 2, emblemCenterY + rayEndY / 2, emblemZ - 0.3,
      0.3, rayLength, 0.3);
  }
};

/**
 * Adds a partial entrance wall behind the viewer with a grand doorway
 * opening. The wall flanks frame the opening; a lintel spans above it.
 * This gives the viewer context — they are entering through a gateway.
 */
const addEntranceWall = (scene: Scene) => {
  const entranceZ = -3;

  // Left flank
  createBox(scene, 0.08, 0.06, 0.10,
    -(ENTRANCE_DOOR_WIDTH / 2 + (HALL_WIDTH / 2 - ENTRANCE_DOOR_WIDTH / 2) / 2), HALL_HEIGHT / 2, entranceZ,
    HALL_WIDTH / 2 - ENTRANCE_DOOR_WIDTH / 2, HALL_HEIGHT, 6);

  // Right flank
  createBox(scene, 0.08, 0.06, 0.10,
    (ENTRANCE_DOOR_WIDTH / 2 + (HALL_WIDTH / 2 - ENTRANCE_DOOR_WIDTH / 2) / 2), HALL_HEIGHT / 2, entranceZ,
    HALL_WIDTH / 2 - ENTRANCE_DOOR_WIDTH / 2, HALL_HEIGHT, 6);

  // Lintel above the doorway
  createBox(scene, 0.10, 0.08, 0.12,
    0, ENTRANCE_DOOR_HEIGHT + (HALL_HEIGHT - ENTRANCE_DOOR_HEIGHT) / 2, entranceZ,
    ENTRANCE_DOOR_WIDTH + 4, HALL_HEIGHT - ENTRANCE_DOOR_HEIGHT, 6);

  // Door frame pillars — slightly brighter than flanks
  [-1, 1].forEach(sideSign => {
    createBox(scene, 0.14, 0.11, 0.16,
      sideSign * (ENTRANCE_DOOR_WIDTH / 2 + 0.5), ENTRANCE_DOOR_HEIGHT / 2, entranceZ - 1,
      1.5, ENTRANCE_DOOR_HEIGHT, 2);
  });

  // Lintel keystone
  createBox(scene, 0.18, 0.14, 0.12,
    0, ENTRANCE_DOOR_HEIGHT + 1, entranceZ - 1.5,
    3, 2.5, 2.5);
};

/**
 * Adds a narrow clerestory band just below the ceiling on both sides —
 * a strip of slightly lighter stone implying hidden apertures where
 * the divine light enters the hall from above.
 */
const addClerestoryBand = (scene: Scene) => {
  const wallOffsetX = 58;
  const clerestoryY = HALL_HEIGHT - CLERESTORY_HEIGHT / 2 - 2;

  [-1, 1].forEach(sideSign => {
    // Lighter stone strip
    createBox(scene, 0.08, 0.07, 0.10,
      sideSign * (wallOffsetX - 2), clerestoryY, HALL_LENGTH / 2,
      3, CLERESTORY_HEIGHT, HALL_LENGTH - 10);

    // Implied slit openings — small brighter rectangles spaced along the band
    for (let slitIndex = 0; slitIndex < 20; slitIndex++) {
      const slitZ = 15 + slitIndex * ((HALL_LENGTH - 30) / 19);
      createBox(scene, 0.15, 0.12, 0.10,
        sideSign * (wallOffsetX - 3.5), clerestoryY, slitZ,
        0.5, CLERESTORY_HEIGHT * 0.6, 4);
    }
  });
};

/**
 * Adds thin dark grooves running lengthwise through the floor, suggesting
 * ancient water channels, spice-flow conduits, or drainage systems beneath
 * the polished tiles — a reminder that this architecture serves function
 * as well as ceremony.
 */
const addFloorDrainChannels = (scene: Scene) => {
  for (let channelIndex = 0; channelIndex < DRAIN_CHANNEL_COUNT; channelIndex++) {
    const channelX = (seededRandom(channelIndex * 89) - 0.5) * (HALL_WIDTH - 30);
    const channelWidth = 0.15 + seededRandom(channelIndex * 89 + 1) * 0.2;

    // Main groove
    createBox(scene, 0.03, 0.025, 0.035,
      channelX, 0.01, HALL_LENGTH / 2,
      channelWidth, 0.04, HALL_LENGTH - 20);

    // Periodic drain grates — small cross marks along the channel
    for (let grateIndex = 0; grateIndex < 15; grateIndex++) {
      const grateZ = 15 + grateIndex * ((HALL_LENGTH - 30) / 14);
      createBox(scene, 0.04, 0.03, 0.04,
        channelX, 0.02, grateZ,
        1.2, 0.03, channelWidth * 0.8);
    }
  }
};

// ── Public API ─────────────────────────────────────────────────────────────

/**
 * Adds the complete hall enclosure to the scene — floor, tiles, ceiling,
 * walls, and all architectural detailing.
 * @param scene - The Babylon scene to populate.
 */
export const addEnclosure = (scene: Scene) => {
  addFloorSlab(scene);
  addCheckerboardTiles(scene);
  addFloorEdgeTrim(scene);
  addFloorSheen(scene);
  addCeiling(scene);
  addCeilingHangingElements(scene);
  addRearWall(scene);
  addEntranceWall(scene);
  addClerestoryBand(scene);
  addFloorDrainChannels(scene);
};
