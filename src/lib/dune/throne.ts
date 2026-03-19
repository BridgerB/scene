/**
 * Throne — the teal-green seat of power at the far end of the hall.
 *
 * "A small, glowing teal-green structure far in the middle distance,
 * raised on what appears to be a dais or throne platform. That single
 * emerald beacon is the only cool color in the composition, a deliberate
 * contrast to the warm, burning orange and gold of the light columns."
 *
 * The throne complex is the focal point the entire hall converges upon.
 * It is built from many layers:
 *
 *   1. **Approach stairway** — wide stone steps narrowing as they rise,
 *      with carved riser faces and worn edges.
 *   2. **Three-tiered dais** — each level narrower, brighter, and edged
 *      with teal-veined inlay strips.
 *   3. **Dais floor mosaic** — a subtle radial pattern on the top tier
 *      implying a ceremonial diagram or Guild navigation symbol.
 *   4. **Throne seat** — the teal-green emissive chair with carved legs,
 *      sculpted armrests, a tall backrest, and a crown finial.
 *   5. **Teal aura** — nested concentric glow spheres radiating outward,
 *      the only cool light in the warm amber hall.
 *   6. **Flanking obelisks** — tall tapered columns on each side of the
 *      throne with carved band detailing and teal-glowing capstones.
 *   7. **Ceremonial braziers** — stone bowls atop pillars flanking the
 *      approach, glowing faintly with amber embers.
 *   8. **Banner pylons** — tall thin pillars at the outer dais edge,
 *      with horizontal crossbars implying hanging banners.
 *   9. **Rear alcove** — a shallow carved niche in the back wall directly
 *      behind the throne, framing the seat of power with shadow.
 *  10. **Floor inscription ring** — a circle of glyphs carved into the
 *      top dais tier surrounding the throne base.
 */
import { Scene } from '@babylonjs/core';
import { seededRandom, createBox, createCylinder, createSphere } from './utils';

// ── Positioning ────────────────────────────────────────────────────────────
/** Z position of the throne center. */
const THRONE_Z = 270;
/** Y position of the top dais surface. */
const DAIS_TOP_Y = 3;

// ── Approach steps ─────────────────────────────────────────────────────────
const APPROACH_STEP_COUNT = 8;
const STEP_DEPTH = 1.8;
const STEP_HEIGHT = 0.4;
const STEP_START_Z = THRONE_Z - 14;
const STEP_START_WIDTH = 34;

// ── Dais ───────────────────────────────────────────────────────────────────
const DAIS_TIER_COUNT = 3;
const DAIS_INLAY_STRIP_HEIGHT = 0.15;

// ── Dais mosaic ────────────────────────────────────────────────────────────
const MOSAIC_RAY_COUNT = 16;
const MOSAIC_RING_COUNT = 4;

// ── Throne seat ────────────────────────────────────────────────────────────
const TEAL_BRIGHT: [number, number, number] = [0.10, 0.78, 0.65];
const TEAL_MID:    [number, number, number] = [0.08, 0.65, 0.55];
const TEAL_DIM:    [number, number, number] = [0.06, 0.50, 0.42];
const TEAL_DARK:   [number, number, number] = [0.04, 0.35, 0.30];

// ── Aura ───────────────────────────────────────────────────────────────────
const AURA_LAYER_COUNT = 5;

// ── Obelisks ───────────────────────────────────────────────────────────────
const OBELISK_OFFSET_X = 7;
const OBELISK_HEIGHT = 25;
const OBELISK_BAND_COUNT = 6;

// ── Braziers ───────────────────────────────────────────────────────────────
const BRAZIER_OFFSET_X = 5;
const BRAZIER_SPACING_Z = 4;
const BRAZIER_PAIR_COUNT = 4;

// ── Banner pylons ──────────────────────────────────────────────────────────
const PYLON_OFFSET_X = 12;
const PYLON_COUNT_PER_SIDE = 3;

// ── Inscription ring ───────────────────────────────────────────────────────
const INSCRIPTION_GLYPH_COUNT = 24;
const INSCRIPTION_RADIUS = 6;

// ── Layer builders ─────────────────────────────────────────────────────────

/**
 * Adds the approach stairway — wide stone steps narrowing as they rise
 * toward the dais. Each step has a carved riser face (slightly recessed
 * darker strip) and subtly worn edges (small highlight spheres at corners).
 */
const addApproachSteps = (scene: Scene) => {
  for (let stepIndex = 0; stepIndex < APPROACH_STEP_COUNT; stepIndex++) {
    const stepWidth = STEP_START_WIDTH - stepIndex * 2;
    const stepY = stepIndex * STEP_HEIGHT + STEP_HEIGHT / 2;
    const stepZ = STEP_START_Z + stepIndex * STEP_DEPTH;
    const brightness = 0.11 + stepIndex * 0.012;

    // Step tread
    createBox(scene, brightness, brightness - 0.02, brightness + 0.02,
      0, stepY, stepZ,
      stepWidth, STEP_HEIGHT, STEP_DEPTH);

    // Carved riser face — a thin darker strip on the front of each step
    createBox(scene, brightness * 0.6, brightness * 0.5, brightness * 0.65,
      0, stepY - STEP_HEIGHT * 0.3, stepZ - STEP_DEPTH / 2 + 0.1,
      stepWidth * 0.95, STEP_HEIGHT * 0.4, 0.15);

    // Worn edge highlights — small bright patches at the step nose
    [-stepWidth * 0.4, -stepWidth * 0.15, stepWidth * 0.15, stepWidth * 0.4].forEach(edgeX => {
      createSphere(scene, brightness + 0.04, brightness + 0.02, brightness + 0.04,
        edgeX, stepY + STEP_HEIGHT * 0.3, stepZ - STEP_DEPTH / 2 + 0.3,
        0.8, 0.15, 0.5, 0.3);
    });
  }
};

/**
 * Adds the three-tiered dais platform. Each tier is narrower, slightly
 * brighter, and edged with teal-veined inlay strips that hint at the
 * throne's colour before you reach it.
 */
const addDaisTiers = (scene: Scene) => {
  const tiers: [number, number, number, number][] = [
    // [width, depth, height, brightness]
    [28, 20, 1.0, 0.15],
    [22, 16, 0.9, 0.18],
    [16, 12, 0.8, 0.21],
  ];

  let currentY = APPROACH_STEP_COUNT * STEP_HEIGHT;

  tiers.forEach(([tierWidth, tierDepth, tierHeight, brightness], tierIndex) => {
    // Main tier slab
    createBox(scene, brightness, brightness - 0.03, brightness + 0.02,
      0, currentY + tierHeight / 2, THRONE_Z,
      tierWidth, tierHeight, tierDepth);

    // Teal-veined inlay strip around the edge of each tier
    const inlayInset = 0.5;
    // Front edge
    createBox(scene, TEAL_DARK[0], TEAL_DARK[1], TEAL_DARK[2],
      0, currentY + tierHeight - DAIS_INLAY_STRIP_HEIGHT / 2, THRONE_Z - tierDepth / 2 + inlayInset,
      tierWidth - 2, DAIS_INLAY_STRIP_HEIGHT, 0.3);
    // Left edge
    createBox(scene, TEAL_DARK[0], TEAL_DARK[1], TEAL_DARK[2],
      -tierWidth / 2 + inlayInset, currentY + tierHeight - DAIS_INLAY_STRIP_HEIGHT / 2, THRONE_Z,
      0.3, DAIS_INLAY_STRIP_HEIGHT, tierDepth - 2);
    // Right edge
    createBox(scene, TEAL_DARK[0], TEAL_DARK[1], TEAL_DARK[2],
      tierWidth / 2 - inlayInset, currentY + tierHeight - DAIS_INLAY_STRIP_HEIGHT / 2, THRONE_Z,
      0.3, DAIS_INLAY_STRIP_HEIGHT, tierDepth - 2);

    currentY += tierHeight;
  });
};

/**
 * Adds a radial mosaic pattern on the top dais tier — concentric rings
 * with radiating ray lines implying a ceremonial diagram, Guild navigation
 * symbol, or spice-trance mandala.
 */
const addDaisMosaic = (scene: Scene) => {
  const mosaicY = DAIS_TOP_Y + 0.02;

  // Concentric rings
  for (let ringIndex = 0; ringIndex < MOSAIC_RING_COUNT; ringIndex++) {
    const ringRadius = 2.5 + ringIndex * 1.5;
    const ringBrightness = 0.06 - ringIndex * 0.01;

    createCylinder(scene,
      TEAL_DARK[0] * 0.8, TEAL_DARK[1] * ringBrightness * 8, TEAL_DARK[2] * ringBrightness * 7,
      0, mosaicY, THRONE_Z,
      0.03, ringRadius, 0.3);
  }

  // Radiating ray lines
  for (let rayIndex = 0; rayIndex < MOSAIC_RAY_COUNT; rayIndex++) {
    const rayAngle = (rayIndex / MOSAIC_RAY_COUNT) * Math.PI * 2;
    const rayLength = 6;
    const rayMidX = Math.cos(rayAngle) * rayLength / 2;
    const rayMidZ = THRONE_Z + Math.sin(rayAngle) * rayLength / 2;

    createBox(scene, TEAL_DARK[0] * 0.7, TEAL_DARK[1] * 0.5, TEAL_DARK[2] * 0.5,
      rayMidX, mosaicY, rayMidZ,
      0.12, 0.03, rayLength, 0.25);
  }
};

/**
 * Adds the throne seat itself — the teal-green glowing chair.
 * Built from: four carved legs, a seat slab, two sculpted armrests
 * with sphere terminals, a tall backrest with layered panels, and a
 * crown finial at the apex.
 */
const addThroneSeat = (scene: Scene) => {
  const seatY = DAIS_TOP_Y + 1.5;

  // Four legs — slightly tapered cylinders
  [[-1.5, -0.8], [1.5, -0.8], [-1.5, 0.8], [1.5, 0.8]].forEach(([legX, legZ]) => {
    createCylinder(scene, TEAL_DIM[0], TEAL_DIM[1], TEAL_DIM[2],
      legX, DAIS_TOP_Y + 0.75, THRONE_Z + legZ,
      1.5, 0.25);
  });

  // Seat slab
  createBox(scene, TEAL_MID[0], TEAL_MID[1], TEAL_MID[2],
    0, seatY, THRONE_Z,
    4, 0.5, 3);

  // Armrests — elongated boxes with sphere terminals
  [-2.3, 2.3].forEach(armX => {
    // Armrest body
    createBox(scene, TEAL_MID[0], TEAL_MID[1] * 0.9, TEAL_MID[2],
      armX, seatY + 1.2, THRONE_Z - 0.3,
      0.6, 0.5, 2.8);
    // Armrest support column
    createBox(scene, TEAL_DIM[0], TEAL_DIM[1], TEAL_DIM[2],
      armX, seatY + 0.5, THRONE_Z - 1.2,
      0.5, 1.0, 0.5);
    // Front terminal sphere
    createSphere(scene, TEAL_BRIGHT[0], TEAL_BRIGHT[1], TEAL_BRIGHT[2],
      armX, seatY + 1.4, THRONE_Z - 1.5,
      0.5, 0.5, 0.5);
  });

  // Backrest — layered panels rising behind the seat
  const backrestZ = THRONE_Z + 1.2;
  // Main panel
  createBox(scene, TEAL_MID[0], TEAL_MID[1], TEAL_MID[2],
    0, seatY + 4, backrestZ,
    4.5, 7, 0.8);
  // Inner recessed panel — slightly brighter
  createBox(scene, TEAL_BRIGHT[0], TEAL_BRIGHT[1], TEAL_BRIGHT[2],
    0, seatY + 4.5, backrestZ - 0.2,
    3.5, 5.5, 0.3);
  // Carved border around inner panel
  createBox(scene, TEAL_DIM[0], TEAL_DIM[1], TEAL_DIM[2],
    0, seatY + 4.5, backrestZ - 0.3,
    4.0, 6.0, 0.1);

  // Crown finial — pointed ornament at the apex
  const crownY = seatY + 8;
  createCylinder(scene, TEAL_BRIGHT[0], TEAL_BRIGHT[1], TEAL_BRIGHT[2],
    0, crownY, backrestZ,
    2, 0.8);
  // Finial tip — bright sphere
  createSphere(scene, TEAL_BRIGHT[0] * 1.3, TEAL_BRIGHT[1] * 1.2, TEAL_BRIGHT[2],
    0, crownY + 1.3, backrestZ,
    0.8, 1.2, 0.8);
  // Finial wings — small horizontal bars
  [-1.5, 1.5].forEach(wingX => {
    createBox(scene, TEAL_MID[0], TEAL_MID[1], TEAL_MID[2],
      wingX, crownY + 0.5, backrestZ,
      1.5, 0.2, 0.3);
  });
};

/**
 * Adds nested concentric glow spheres radiating from the throne — the
 * teal aura that makes this single cold colour beacon visible from
 * the far end of the hall. Layers range from bright and tight to
 * faint and enormous.
 */
const addTealAura = (scene: Scene) => {
  const auraY = DAIS_TOP_Y + 5;

  for (let layerIndex = 0; layerIndex < AURA_LAYER_COUNT; layerIndex++) {
    const layerScale = 6 + layerIndex * 5;
    const layerAlpha = 0.20 - layerIndex * 0.035;
    const layerBrightness = 1.0 - layerIndex * 0.15;

    createSphere(scene,
      TEAL_MID[0] * layerBrightness,
      TEAL_MID[1] * layerBrightness,
      TEAL_MID[2] * layerBrightness,
      0, auraY, THRONE_Z,
      layerScale, layerScale * 0.9, layerScale * 0.8, layerAlpha);
  }

  // Upward teal spill — a soft column of cold light rising from the throne
  createCylinder(scene, TEAL_DIM[0], TEAL_DIM[1] * 0.6, TEAL_DIM[2] * 0.5,
    0, auraY + 20, THRONE_Z,
    35, 6, 0.04);
};

/**
 * Adds flanking obelisks — tall tapered columns on each side of the
 * throne with horizontal carved band detailing, stepped bases, and
 * teal-glowing capstones that echo the throne colour.
 */
const addObelisks = (scene: Scene) => {
  [-OBELISK_OFFSET_X, OBELISK_OFFSET_X].forEach(offsetX => {
    // Stepped base — 3 tiers
    [0, 1, 2].forEach(baseTier => {
      const baseWidth = 3.5 - baseTier * 0.6;
      createBox(scene, 0.18 + baseTier * 0.02, 0.15 + baseTier * 0.01, 0.20 + baseTier * 0.02,
        offsetX, DAIS_TOP_Y + baseTier * 0.6 + 0.3, THRONE_Z,
        baseWidth, 0.6, baseWidth);
    });

    // Main tapered shaft
    const shaftBaseY = DAIS_TOP_Y + 2;
    createCylinder(scene, 0.22, 0.18, 0.24,
      offsetX, shaftBaseY + OBELISK_HEIGHT / 2, THRONE_Z,
      OBELISK_HEIGHT, 1.3);

    // Horizontal carved bands
    for (let bandIndex = 0; bandIndex < OBELISK_BAND_COUNT; bandIndex++) {
      const bandY = shaftBaseY + 3 + bandIndex * (OBELISK_HEIGHT / (OBELISK_BAND_COUNT + 1));
      createCylinder(scene, 0.28, 0.24, 0.30,
        offsetX, bandY, THRONE_Z,
        0.4, 1.6);
      // Teal inlay within each band
      createCylinder(scene, TEAL_DARK[0], TEAL_DARK[1] * 0.6, TEAL_DARK[2] * 0.6,
        offsetX, bandY, THRONE_Z,
        0.2, 1.65, 0.5);
    }

    // Capstone — teal-glowing sphere atop a small pedestal
    const capY = shaftBaseY + OBELISK_HEIGHT + 0.5;
    createCylinder(scene, 0.25, 0.20, 0.26,
      offsetX, capY, THRONE_Z, 1, 1.5);
    createSphere(scene, TEAL_BRIGHT[0], TEAL_BRIGHT[1], TEAL_BRIGHT[2],
      offsetX, capY + 1.5, THRONE_Z,
      2.2, 2.5, 2.2);
    // Capstone glow halo
    createSphere(scene, TEAL_DIM[0], TEAL_DIM[1], TEAL_DIM[2],
      offsetX, capY + 1.5, THRONE_Z,
      4, 4, 4, 0.1);
  });
};

/**
 * Adds ceremonial braziers flanking the approach — stone bowls atop
 * short pillars, glowing faintly with warm amber embers. These create
 * a warm-cool tension as you walk the last stretch toward the teal throne.
 */
const addBraziers = (scene: Scene) => {
  for (let pairIndex = 0; pairIndex < BRAZIER_PAIR_COUNT; pairIndex++) {
    const brazierZ = THRONE_Z - 8 - pairIndex * BRAZIER_SPACING_Z;

    [-BRAZIER_OFFSET_X, BRAZIER_OFFSET_X].forEach(sideX => {
      // Pillar
      createCylinder(scene, 0.16, 0.13, 0.17,
        sideX, DAIS_TOP_Y - 0.5, brazierZ,
        3, 0.5);
      // Bowl
      createSphere(scene, 0.20, 0.16, 0.14,
        sideX, DAIS_TOP_Y + 1.2, brazierZ,
        1.8, 1.0, 1.8);
      // Ember glow
      createSphere(scene, 0.80, 0.45, 0.10,
        sideX, DAIS_TOP_Y + 1.6, brazierZ,
        1.0, 0.6, 1.0, 0.25);
      // Ember halo
      createSphere(scene, 0.55, 0.30, 0.08,
        sideX, DAIS_TOP_Y + 1.8, brazierZ,
        2.5, 2.0, 2.5, 0.06);
    });
  }
};

/**
 * Adds banner pylons — tall thin pillars at the outer edges of the dais
 * with horizontal crossbars implying hanging ceremonial banners. The
 * banners themselves are suggested by flat translucent boxes.
 */
const addBannerPylons = (scene: Scene) => {
  for (let pylonIndex = 0; pylonIndex < PYLON_COUNT_PER_SIDE; pylonIndex++) {
    const pylonZ = THRONE_Z - 6 + pylonIndex * 6;

    [-PYLON_OFFSET_X, PYLON_OFFSET_X].forEach(sideX => {
      const pylonHeight = 18 + seededRandom(pylonIndex * 51 + sideX * 3) * 5;

      // Pylon shaft
      createCylinder(scene, 0.18, 0.14, 0.20,
        sideX, DAIS_TOP_Y + pylonHeight / 2, pylonZ,
        pylonHeight, 0.3);

      // Crossbar
      createBox(scene, 0.20, 0.16, 0.22,
        sideX, DAIS_TOP_Y + pylonHeight - 2, pylonZ,
        0.2, 0.2, 3);

      // Banner — translucent flat box hanging from crossbar
      const bannerHeight = pylonHeight * 0.5;
      createBox(scene, 0.14, 0.10, 0.12,
        sideX, DAIS_TOP_Y + pylonHeight - 2 - bannerHeight / 2, pylonZ,
        0.05, bannerHeight, 2.5, 0.15);
    });
  }
};

/**
 * Adds a shallow carved niche in the back wall directly behind the throne.
 * This alcove frames the seat of power with deep shadow, making the teal
 * glow stand out even more dramatically against the darkness.
 */
const addRearAlcove = (scene: Scene) => {
  const alcoveZ = THRONE_Z + 4;
  const alcoveWidth = 14;
  const alcoveHeight = 30;

  // Deep recess
  createBox(scene, 0.03, 0.025, 0.035,
    0, DAIS_TOP_Y + alcoveHeight / 2, alcoveZ,
    alcoveWidth, alcoveHeight, 3);

  // Arch top
  createSphere(scene, 0.06, 0.05, 0.07,
    0, DAIS_TOP_Y + alcoveHeight, alcoveZ,
    alcoveWidth * 0.6, 4, 3);

  // Pilaster frames on each side
  [-alcoveWidth / 2 - 0.8, alcoveWidth / 2 + 0.8].forEach(pilX => {
    createCylinder(scene, 0.16, 0.13, 0.18,
      pilX, DAIS_TOP_Y + alcoveHeight / 2, alcoveZ,
      alcoveHeight, 0.6);
    // Capital
    createBox(scene, 0.20, 0.16, 0.22,
      pilX, DAIS_TOP_Y + alcoveHeight - 0.5, alcoveZ,
      1.5, 1, 1.5);
  });
};

/**
 * Adds a ring of carved glyphs on the top dais tier encircling the
 * throne base — ancient script or a warding circle. Each glyph is a
 * small teal-tinted box raised slightly from the floor.
 */
const addInscriptionRing = (scene: Scene) => {
  const ringY = DAIS_TOP_Y + 0.04;

  for (let glyphIndex = 0; glyphIndex < INSCRIPTION_GLYPH_COUNT; glyphIndex++) {
    const glyphAngle = (glyphIndex / INSCRIPTION_GLYPH_COUNT) * Math.PI * 2;
    const glyphX = Math.cos(glyphAngle) * INSCRIPTION_RADIUS;
    const glyphZ = THRONE_Z + Math.sin(glyphAngle) * INSCRIPTION_RADIUS;
    const glyphWidth = 0.3 + seededRandom(glyphIndex * 43) * 0.5;
    const glyphDepth = 0.2 + seededRandom(glyphIndex * 43 + 1) * 0.4;

    createBox(scene, TEAL_DARK[0] * 0.9, TEAL_DARK[1] * 0.7, TEAL_DARK[2] * 0.7,
      glyphX, ringY, glyphZ,
      glyphWidth, 0.06, glyphDepth, 0.5);
  }
};

// ── Public API ─────────────────────────────────────────────────────────────

/**
 * Adds the complete throne complex to the scene.
 * @param scene - The Babylon scene to populate.
 */
export const addThrone = (scene: Scene) => {
  addApproachSteps(scene);
  addDaisTiers(scene);
  addDaisMosaic(scene);
  addThroneSeat(scene);
  addTealAura(scene);
  addObelisks(scene);
  addBraziers(scene);
  addBannerPylons(scene);
  addRearAlcove(scene);
  addInscriptionRing(scene);
};
