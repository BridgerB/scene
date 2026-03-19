/**
 * Walls — towering cliff-faces of carved, organic stonework.
 *
 * "The walls are where Simonetti's artistry truly erupts."
 *
 * Each wall is a multi-layered composition built from back to front:
 *
 *   1. **Base mass** — the deep structural slab of lavender stone.
 *   2. **Layered relief shelves** — stepped slabs protruding at varying
 *      depths, creating a geological cliff-face effect.
 *   3. **Vertical buttresses** — soaring columns with organic flared
 *      capitals that bloom like fossilised flora at the top.
 *   4. **Baroque scrollwork** — S-curves, spirals, and arabesques carved
 *      into the surface, evoking both biological forms and ancient scripture.
 *   5. **Dome structures** — clinging to the wall at mid-height like
 *      barnacles on a sea cliff, with ribbed detailing and lantern caps.
 *   6. **Embedded statues** — figural carvings half-absorbed into the stone
 *      as though the architecture is alive and slowly consuming them.
 *   7. **Fossilised organic shapes** — ammonite spirals and petrified
 *      tendrils embedded in the relief layers.
 *   8. **Glyph bands** — horizontal strips of ancient script running
 *      between the buttresses.
 *   9. **Arched recesses** — deep niches along the base with sculpted
 *      archways framing shadow.
 *  10. **Sinuous carved veins** — thin vertical ridges flowing up the
 *      wall face like the nervous system of the stone itself.
 *
 * The colour palette uses lavender, pearl, muted violet, and warm amber
 * highlights to suggest stone so ancient it has calcified into something
 * geological — civilisation fused with the living rock of Arrakis.
 */
import { Scene } from '@babylonjs/core';
import { seededRandom, createBox, createCylinder, createSphere } from './utils';

// ── Hall dimensions (must match enclosure.ts) ──────────────────────────────
const HALL_LENGTH = 300;
const HALL_HEIGHT = 140;

// ── Wall positioning ───────────────────────────────────────────────────────
/** Distance from the hall center-line to each wall face. */
const WALL_OFFSET_X = 58;
/** Thickness of the main structural wall slab. */
const WALL_THICKNESS = 8;

// ── Buttresses ─────────────────────────────────────────────────────────────
const BUTTRESS_COUNT = 24;
const BUTTRESS_SPACING_Z = 12;
const BUTTRESS_START_Z = 6;

// ── Relief shelves ─────────────────────────────────────────────────────────
const RELIEF_LAYER_COUNT = 5;

// ── Scrollwork ─────────────────────────────────────────────────────────────
const SCROLLWORK_PAIRS_PER_BUTTRESS = 3;
const SCROLL_ARC_SEGMENTS = 6;

// ── Domes ──────────────────────────────────────────────────────────────────
/** Domes appear every Nth buttress. */
const DOME_FREQUENCY = 3;
const DOME_RIB_COUNT = 6;

// ── Statues ────────────────────────────────────────────────────────────────
/** Statues appear every Nth buttress (offset by 1). */
const STATUE_FREQUENCY = 4;

// ── Fossils ────────────────────────────────────────────────────────────────
const FOSSIL_COUNT_PER_SIDE = 18;
const FOSSIL_SPIRAL_SEGMENTS = 8;

// ── Glyph bands ────────────────────────────────────────────────────────────
const GLYPH_BAND_COUNT = 6;

// ── Arched recesses ────────────────────────────────────────────────────────
const ARCH_RECESS_COUNT = 14;
const ARCH_RECESS_SPACING_Z = 20;

// ── Sinuous veins ──────────────────────────────────────────────────────────
const CARVED_VEIN_COUNT = 50;

// ── Colour palettes ────────────────────────────────────────────────────────

/** Rotating palette of lavender-stone tones for primary wall details. */
const STONE_COLORS: [number, number, number][] = [
  [0.32, 0.26, 0.36],
  [0.38, 0.32, 0.42],
  [0.28, 0.22, 0.32],
  [0.42, 0.36, 0.46],
  [0.35, 0.29, 0.39],
];

/** Lighter pearl tones used for raised relief and highlights. */
const PEARL_COLORS: [number, number, number][] = [
  [0.50, 0.46, 0.54],
  [0.55, 0.50, 0.58],
  [0.48, 0.44, 0.52],
];

/** Warm amber accent used for glyph bands and scroll highlights. */
const AMBER_ACCENT: [number, number, number] = [0.52, 0.38, 0.18];

// ── Helpers ────────────────────────────────────────────────────────────────

/** Picks a colour from a palette based on an index. */
const pickColor = (palette: [number, number, number][], index: number): [number, number, number] =>
  palette[index % palette.length];

// ── Layer builders ─────────────────────────────────────────────────────────

/**
 * Adds the main structural wall slab on one side of the hall.
 * This is the deepest layer — everything else is overlaid on top.
 */
const addWallMass = (scene: Scene, wallCenterX: number) => {
  createBox(scene, 0.26, 0.20, 0.30,
    wallCenterX, HALL_HEIGHT / 2, HALL_LENGTH / 2,
    WALL_THICKNESS, HALL_HEIGHT, HALL_LENGTH);
};

/**
 * Adds stepped relief shelves that protrude from the wall at varying depths,
 * creating a cliff-face layering effect. Each shelf is a long horizontal
 * slab at a different height band, slightly brighter than the layer behind.
 */
const addReliefShelves = (scene: Scene, wallCenterX: number, sideSign: number) => {
  for (let layerIndex = 0; layerIndex < RELIEF_LAYER_COUNT; layerIndex++) {
    const [red, green, blue] = pickColor(PEARL_COLORS, layerIndex);
    const shelfDepth = 1.5 + layerIndex * 0.6;
    const shelfHeight = 12 + seededRandom(layerIndex * 41) * 18;
    const shelfY = 8 + layerIndex * 22 + seededRandom(layerIndex * 41 + 1) * 10;
    const shelfLength = HALL_LENGTH * (0.6 + seededRandom(layerIndex * 41 + 2) * 0.35);
    const shelfZ = HALL_LENGTH / 2 + (seededRandom(layerIndex * 41 + 3) - 0.5) * 40;

    createBox(scene, red * 0.85, green * 0.85, blue * 0.85,
      wallCenterX - sideSign * (WALL_THICKNESS / 2 + shelfDepth / 2),
      shelfY, shelfZ,
      shelfDepth, shelfHeight, shelfLength);
  }
};

/**
 * Adds soaring vertical buttresses with organic flared capitals.
 * The capitals bloom outward like fossilised flora — a cluster of
 * overlapping ellipsoids fanning from the column top.
 */
const addButtresses = (scene: Scene, wallCenterX: number, sideSign: number) => {
  for (let index = 0; index < BUTTRESS_COUNT; index++) {
    const depthZ = BUTTRESS_START_Z + index * BUTTRESS_SPACING_Z;
    const [red, green, blue] = pickColor(STONE_COLORS, index);
    const buttressHeight = 75 + seededRandom(index * 3) * 55;
    const buttressWidth = 2.5 + seededRandom(index * 3 + 1) * 2.5;
    const buttressProtrusion = sideSign * 3;

    // Vertical column
    createBox(scene, red, green, blue,
      wallCenterX - buttressProtrusion, buttressHeight / 2, depthZ,
      buttressWidth, buttressHeight, 3.5);

    // Flared capital — cluster of overlapping organic forms
    const capitalY = buttressHeight * 0.85;
    const capitalSpread = buttressWidth * 0.6;
    const capitalOffsets: [number, number, number][] = [
      [0, 0, 0],
      [-capitalSpread, capitalSpread * 0.5, -1],
      [capitalSpread, capitalSpread * 0.4, 1],
      [0, capitalSpread * 0.8, -0.5],
      [-capitalSpread * 0.5, capitalSpread * 0.3, 0.8],
    ];
    capitalOffsets.forEach(([offsetZ, offsetY, offsetX], capIndex) => {
      const brightness = 1.05 + capIndex * 0.02;
      createSphere(scene, red * brightness, green * brightness, blue * brightness,
        wallCenterX - buttressProtrusion - sideSign * (1 + offsetX),
        capitalY + offsetY, depthZ + offsetZ,
        buttressWidth * 0.7, buttressHeight * 0.12, 4.5,
        0.65 + capIndex * 0.03);
    });

    // Narrow capital stem connecting column to bloom
    createCylinder(scene, red * 0.9, green * 0.9, blue * 0.9,
      wallCenterX - buttressProtrusion, buttressHeight * 0.75, depthZ,
      buttressHeight * 0.2, buttressWidth * 0.3);
  }
};

/**
 * Adds baroque scrollwork — S-curves and spiral arabesques between
 * buttresses. Each scroll is approximated as an arc of small spheres
 * that curl outward from the wall surface.
 */
const addScrollwork = (scene: Scene, wallCenterX: number, sideSign: number) => {
  for (let buttressIndex = 0; buttressIndex < BUTTRESS_COUNT - 1; buttressIndex++) {
    const spanStartZ = BUTTRESS_START_Z + buttressIndex * BUTTRESS_SPACING_Z;
    const spanCenterZ = spanStartZ + BUTTRESS_SPACING_Z / 2;

    for (let pairIndex = 0; pairIndex < SCROLLWORK_PAIRS_PER_BUTTRESS; pairIndex++) {
      const scrollBaseY = 15 + pairIndex * 25 + seededRandom(buttressIndex * 37 + pairIndex) * 8;
      const scrollRadius = 2 + seededRandom(buttressIndex * 37 + pairIndex + 1) * 2;
      const [red, green, blue] = pickColor(PEARL_COLORS, buttressIndex + pairIndex);

      // Each scroll is a half-arc of small spheres curling outward
      [-1, 1].forEach(curlDirection => {
        for (let segment = 0; segment < SCROLL_ARC_SEGMENTS; segment++) {
          const angle = (segment / SCROLL_ARC_SEGMENTS) * Math.PI * 0.8;
          const sphereZ = spanCenterZ + curlDirection * Math.cos(angle) * scrollRadius;
          const sphereY = scrollBaseY + Math.sin(angle) * scrollRadius;
          const protrusion = Math.sin(angle) * 1.5;
          const sphereSize = 0.8 + Math.sin(angle) * 0.5;

          createSphere(scene, red * 0.95, green * 0.95, blue * 0.95,
            wallCenterX - sideSign * (4 + protrusion), sphereY, sphereZ,
            sphereSize, sphereSize, sphereSize * 1.2, 0.8);
        }
      });
    }
  }
};

/**
 * Adds dome structures clinging to the wall at mid-height, like barnacles
 * on a sea cliff. Each dome has a hemispherical shell, vertical ribs
 * radiating down its surface, and a small lantern cap on top.
 */
const addDomes = (scene: Scene, wallCenterX: number, sideSign: number) => {
  for (let buttressIndex = 0; buttressIndex < BUTTRESS_COUNT; buttressIndex++) {
    if (buttressIndex % DOME_FREQUENCY !== 0) continue;

    const depthZ = BUTTRESS_START_Z + buttressIndex * BUTTRESS_SPACING_Z;
    const domeBaseY = 30 + seededRandom(buttressIndex * 7) * 25;
    const domeRadius = 4 + seededRandom(buttressIndex * 7 + 1) * 3;
    const domeProtrusion = sideSign * 6;

    // Hemispherical shell
    createSphere(scene, 0.38, 0.33, 0.43,
      wallCenterX - domeProtrusion, domeBaseY, depthZ,
      domeRadius * 2, domeRadius * 1.4, domeRadius * 2);

    // Dome cap — brighter crown
    createSphere(scene, 0.45, 0.40, 0.50,
      wallCenterX - domeProtrusion, domeBaseY + domeRadius * 0.9, depthZ,
      domeRadius * 1.2, domeRadius * 0.6, domeRadius * 1.2);

    // Vertical ribs radiating over the dome surface
    for (let ribIndex = 0; ribIndex < DOME_RIB_COUNT; ribIndex++) {
      const ribAngle = (ribIndex / DOME_RIB_COUNT) * Math.PI;
      const ribOffsetZ = Math.cos(ribAngle) * domeRadius * 0.9;
      const ribOffsetX = Math.sin(ribAngle) * domeRadius * 0.3;

      createCylinder(scene, 0.42, 0.37, 0.48,
        wallCenterX - domeProtrusion - sideSign * ribOffsetX,
        domeBaseY, depthZ + ribOffsetZ,
        domeRadius * 1.8, 0.2);
    }

    // Lantern cap — small bright sphere sitting on the apex
    createSphere(scene, 0.55, 0.45, 0.30,
      wallCenterX - domeProtrusion,
      domeBaseY + domeRadius * 1.3, depthZ,
      1.2, 1.5, 1.2);

    // Shadow ledge beneath the dome
    createBox(scene, 0.15, 0.12, 0.18,
      wallCenterX - domeProtrusion, domeBaseY - domeRadius * 0.8, depthZ,
      domeRadius * 2.2, 0.5, domeRadius * 2.2);
  }
};

/**
 * Adds statue figures half-absorbed into the wall. Each statue has a
 * cylindrical torso sinking into the stone, a head emerging forward,
 * outstretched arms, draped robes pooling at the base, and a halo ring
 * behind the head — suggesting deified rulers or religious icons.
 */
const addEmbeddedStatues = (scene: Scene, wallCenterX: number, sideSign: number) => {
  for (let buttressIndex = 0; buttressIndex < BUTTRESS_COUNT; buttressIndex++) {
    if (buttressIndex % STATUE_FREQUENCY !== 1) continue;

    const depthZ = BUTTRESS_START_Z + buttressIndex * BUTTRESS_SPACING_Z;
    const statueBaseY = 18 + seededRandom(buttressIndex * 11) * 35;
    const statueProtrusion = sideSign * 5;
    const statueScale = 0.8 + seededRandom(buttressIndex * 11 + 1) * 0.5;

    // Torso — cylinder sinking into the wall
    createCylinder(scene, 0.36, 0.30, 0.38,
      wallCenterX - statueProtrusion, statueBaseY, depthZ,
      9 * statueScale, 1.6 * statueScale);

    // Head — slightly brighter, protruding forward
    createSphere(scene, 0.42, 0.36, 0.44,
      wallCenterX - statueProtrusion - sideSign * 0.5,
      statueBaseY + 5.5 * statueScale, depthZ,
      2.8 * statueScale, 3.2 * statueScale, 2.8 * statueScale);

    // Halo ring behind the head
    createCylinder(scene, 0.48, 0.40, 0.30,
      wallCenterX - statueProtrusion + sideSign * 0.3,
      statueBaseY + 6 * statueScale, depthZ,
      0.2, 2.5 * statueScale, 0.4);

    // Left arm reaching outward
    createBox(scene, 0.34, 0.28, 0.36,
      wallCenterX - statueProtrusion - sideSign * 1.5,
      statueBaseY + 1.5 * statueScale, depthZ - 1.8 * statueScale,
      0.8 * statueScale, 5.5 * statueScale, 0.8 * statueScale);

    // Right arm reaching outward
    createBox(scene, 0.34, 0.28, 0.36,
      wallCenterX - statueProtrusion - sideSign * 1.5,
      statueBaseY + 1.5 * statueScale, depthZ + 1.8 * statueScale,
      0.8 * statueScale, 5.5 * statueScale, 0.8 * statueScale);

    // Draped robe pooling at the base
    createSphere(scene, 0.30, 0.24, 0.32,
      wallCenterX - statueProtrusion,
      statueBaseY - 4.5 * statueScale, depthZ,
      3.5 * statueScale, 2 * statueScale, 3.5 * statueScale, 0.7);

    // Hands — small spheres at arm ends
    createSphere(scene, 0.40, 0.34, 0.42,
      wallCenterX - statueProtrusion - sideSign * 1.8,
      statueBaseY - 1.2 * statueScale, depthZ - 1.8 * statueScale,
      0.6 * statueScale, 0.7 * statueScale, 0.6 * statueScale);
    createSphere(scene, 0.40, 0.34, 0.42,
      wallCenterX - statueProtrusion - sideSign * 1.8,
      statueBaseY - 1.2 * statueScale, depthZ + 1.8 * statueScale,
      0.6 * statueScale, 0.7 * statueScale, 0.6 * statueScale);
  }
};

/**
 * Adds fossilised organic shapes embedded in the relief layers —
 * ammonite spirals and petrified tendrils that suggest the wall is
 * part-stone, part-living-organism.
 */
const addFossils = (scene: Scene, wallCenterX: number, sideSign: number) => {
  for (let fossilIndex = 0; fossilIndex < FOSSIL_COUNT_PER_SIDE; fossilIndex++) {
    const fossilZ = 15 + seededRandom(fossilIndex * 29) * (HALL_LENGTH - 30);
    const fossilY = 5 + seededRandom(fossilIndex * 29 + 1) * 70;
    const fossilSize = 1.5 + seededRandom(fossilIndex * 29 + 2) * 3;
    const fossilProtrusion = sideSign * (4 + seededRandom(fossilIndex * 29 + 3) * 2);

    if (fossilIndex % 3 === 0) {
      // Ammonite spiral — a coil of increasingly small spheres
      for (let segment = 0; segment < FOSSIL_SPIRAL_SEGMENTS; segment++) {
        const angle = (segment / FOSSIL_SPIRAL_SEGMENTS) * Math.PI * 2.5;
        const spiralRadius = fossilSize * (1 - segment / FOSSIL_SPIRAL_SEGMENTS * 0.7);
        const segmentSize = fossilSize * 0.3 * (1 - segment / FOSSIL_SPIRAL_SEGMENTS * 0.5);

        createSphere(scene, 0.40, 0.35, 0.42,
          wallCenterX - fossilProtrusion,
          fossilY + Math.sin(angle) * spiralRadius,
          fossilZ + Math.cos(angle) * spiralRadius,
          segmentSize, segmentSize, segmentSize * 0.6, 0.6);
      }
    } else {
      // Petrified tendril — an elongated ellipsoid with a curled tip
      const tendrilLength = fossilSize * 3;
      createSphere(scene, 0.35, 0.30, 0.38,
        wallCenterX - fossilProtrusion, fossilY, fossilZ,
        fossilSize * 0.4, tendrilLength, fossilSize * 0.4, 0.5);

      // Curled tip
      createSphere(scene, 0.38, 0.33, 0.40,
        wallCenterX - fossilProtrusion - sideSign * 0.5,
        fossilY + tendrilLength * 0.4, fossilZ + 0.8,
        fossilSize * 0.5, fossilSize * 0.8, fossilSize * 0.5, 0.5);
    }
  }
};

/**
 * Adds horizontal glyph bands — strips of ancient script running between
 * buttress bays. Each band is a narrow horizontal box in warm amber tones
 * with small raised glyphs represented as periodic bumps.
 */
const addGlyphBands = (scene: Scene, wallCenterX: number, sideSign: number) => {
  for (let bandIndex = 0; bandIndex < GLYPH_BAND_COUNT; bandIndex++) {
    const bandY = 12 + bandIndex * 18;
    const bandProtrusion = sideSign * 4.5;

    // Background strip
    createBox(scene, AMBER_ACCENT[0] * 0.5, AMBER_ACCENT[1] * 0.5, AMBER_ACCENT[2] * 0.5,
      wallCenterX - bandProtrusion, bandY, HALL_LENGTH / 2,
      0.3, 1.5, HALL_LENGTH * 0.85);

    // Raised glyphs — small periodic boxes along the band
    const glyphCount = 30 + Math.floor(seededRandom(bandIndex * 53) * 20);
    const glyphSpacing = (HALL_LENGTH * 0.8) / glyphCount;

    for (let glyphIndex = 0; glyphIndex < glyphCount; glyphIndex++) {
      const glyphZ = 20 + glyphIndex * glyphSpacing;
      const glyphWidth = 0.4 + seededRandom(bandIndex * 53 + glyphIndex * 7) * 0.8;
      const glyphHeight = 0.6 + seededRandom(bandIndex * 53 + glyphIndex * 7 + 1) * 0.8;

      createBox(scene, AMBER_ACCENT[0] * 0.7, AMBER_ACCENT[1] * 0.7, AMBER_ACCENT[2] * 0.7,
        wallCenterX - bandProtrusion - sideSign * 0.2, bandY, glyphZ,
        0.15, glyphHeight, glyphWidth);
    }
  }
};

/**
 * Adds deep arched recesses along the base of each wall. Each recess is
 * a dark rectangular void topped with a sculpted arch, flanked by thin
 * pilasters that frame the darkness.
 */
const addArchedRecesses = (scene: Scene, wallCenterX: number, sideSign: number) => {
  for (let archIndex = 0; archIndex < ARCH_RECESS_COUNT; archIndex++) {
    const archZ = 15 + archIndex * ARCH_RECESS_SPACING_Z;
    const recessProtrusion = sideSign * 2.5;
    const recessWidth = 3.5;
    const recessHeight = 18;

    // Dark rectangular void
    createBox(scene, 0.04, 0.03, 0.05,
      wallCenterX - recessProtrusion, recessHeight / 2, archZ,
      recessWidth, recessHeight, 7);

    // Rounded archway top
    createSphere(scene, 0.30, 0.24, 0.32,
      wallCenterX - recessProtrusion, recessHeight, archZ,
      recessWidth + 1, 3, 7.5);

    // Thin pilasters flanking the recess
    [-4, 4].forEach(pilasterOffsetZ => {
      createCylinder(scene, 0.36, 0.30, 0.38,
        wallCenterX - recessProtrusion - sideSign * 0.3,
        recessHeight / 2, archZ + pilasterOffsetZ,
        recessHeight, 0.35);
    });

    // Keystone at arch apex
    createBox(scene, 0.44, 0.38, 0.46,
      wallCenterX - recessProtrusion - sideSign * 0.5,
      recessHeight + 1.5, archZ,
      1.2, 1.5, 1.8);
  }
};

/**
 * Adds sinuous carved veins — thin vertical ridges flowing up the wall
 * face like the nervous system of the stone itself. These are denser and
 * more varied than the previous implementation, with slight curves.
 */
const addCarvedVeins = (scene: Scene, wallCenterX: number, sideSign: number) => {
  for (let veinIndex = 0; veinIndex < CARVED_VEIN_COUNT; veinIndex++) {
    const veinZ = 3 + veinIndex * (HALL_LENGTH / CARVED_VEIN_COUNT);
    const veinBaseY = 5 + seededRandom(veinIndex * 13) * 50;
    const veinHeight = 12 + seededRandom(veinIndex * 13 + 1) * 35;
    const [veinRed, veinGreen, veinBlue] = pickColor(STONE_COLORS, veinIndex);
    const veinRadius = 0.4 + seededRandom(veinIndex * 13 + 2) * 0.7;
    const veinProtrusion = sideSign * (1 + seededRandom(veinIndex * 13 + 3) * 2);

    createCylinder(scene,
      veinRed * 0.85, veinGreen * 0.85, veinBlue * 0.85,
      wallCenterX - veinProtrusion, veinBaseY + veinHeight / 2, veinZ,
      veinHeight, veinRadius);

    // Some veins fork into a second branch
    if (veinIndex % 5 === 0) {
      const forkY = veinBaseY + veinHeight * 0.6;
      const forkHeight = veinHeight * 0.5;
      const forkZ = veinZ + (seededRandom(veinIndex * 13 + 4) - 0.5) * 4;

      createCylinder(scene,
        veinRed * 0.8, veinGreen * 0.8, veinBlue * 0.8,
        wallCenterX - veinProtrusion - sideSign * 0.5,
        forkY + forkHeight / 2, forkZ,
        forkHeight, veinRadius * 0.6);
    }
  }
};

// ── Public API ─────────────────────────────────────────────────────────────

/**
 * Adds both side walls with all ten layers of carved detail to the scene.
 * @param scene - The Babylon scene to populate.
 */
export const addWalls = (scene: Scene) => {
  [-1, 1].forEach(sideSign => {
    const wallCenterX = sideSign * WALL_OFFSET_X;

    addWallMass(scene, wallCenterX);
    addReliefShelves(scene, wallCenterX, sideSign);
    addButtresses(scene, wallCenterX, sideSign);
    addScrollwork(scene, wallCenterX, sideSign);
    addDomes(scene, wallCenterX, sideSign);
    addEmbeddedStatues(scene, wallCenterX, sideSign);
    addFossils(scene, wallCenterX, sideSign);
    addGlyphBands(scene, wallCenterX, sideSign);
    addArchedRecesses(scene, wallCenterX, sideSign);
    addCarvedVeins(scene, wallCenterX, sideSign);
  });
};
