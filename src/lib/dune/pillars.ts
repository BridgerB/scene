/**
 * Pillars — four colossal luminous monoliths of radiant energy.
 *
 * "These pillars are not mere supports; they are luminous monoliths of
 * radiant energy. Their surfaces alive with intricate, flowing patterns
 * that resemble molten calligraphy or ancient script carved in fire."
 *
 * Each pillar is built from many concentric layers:
 *
 *   1. **Molten core** — the brightest inner cylinder, white-hot.
 *   2. **Primary glow** — the dominant colour (orange-gold or rose-violet).
 *   3. **Secondary glow** — wider, more diffuse, semi-transparent.
 *   4. **Outer bloom** — the faintest atmospheric wash bleeding into the hall.
 *   5. **Calligraphy bands** — alternating wide/narrow rings that undulate
 *      in radius, simulating flowing script carved in fire.
 *   6. **Spiral veins** — helical ridges that wind up the pillar surface,
 *      like the vascular system of some colossal living organism.
 *   7. **Ember nodes** — bright spots where veins cross calligraphy bands,
 *      pulsing brighter as if the intersection is molten.
 *   8. **Organic dissolution zone** — between and around the pillars, the
 *      architecture dissolves into biological forms: twisting tendrils,
 *      vein-like structures, and swirling filaments that bridge pillar
 *      to wall and pillar to pillar.
 *   9. **Tiered pedestal base** — three stacked rings flaring outward,
 *      carved with radiating fin details.
 *  10. **Crown flare** — the pillar top blooms outward where it meets
 *      the ceiling void, light spilling upward.
 *
 * The inner pair burns orange-gold; the outer pair pulses deep rose-violet.
 * Together they frame the approach to the throne in columns of sacred fire.
 */
import { Scene } from '@babylonjs/core';
import { seededRandom, createCylinder, createSphere, createBox } from './utils';

// ── Dimensions ─────────────────────────────────────────────────────────────
const PILLAR_HEIGHT = 120;
const THRONE_DEPTH_Z = 260;

// ── Core layer radii ───────────────────────────────────────────────────────
const MOLTEN_CORE_RADIUS = 2.5;
const PRIMARY_GLOW_RADIUS = 5;
const SECONDARY_GLOW_RADIUS = 7;
const OUTER_BLOOM_RADIUS = 10;
const ATMOSPHERIC_WASH_RADIUS = 14;

// ── Calligraphy ────────────────────────────────────────────────────────────
const CALLIGRAPHY_BAND_COUNT = 30;
/** Bands alternate between wide ceremonial bands and thin divider lines. */
const WIDE_BAND_HEIGHT = 1.2;
const THIN_BAND_HEIGHT = 0.3;

// ── Spiral veins ───────────────────────────────────────────────────────────
const SPIRAL_VEIN_COUNT = 4;
const SPIRAL_SEGMENTS_PER_VEIN = 40;
const SPIRAL_TURNS = 3;

// ── Ember nodes ────────────────────────────────────────────────────────────
const EMBER_NODES_PER_PILLAR = 20;

// ── Organic dissolution ────────────────────────────────────────────────────
const TENDRIL_COUNT_BETWEEN_PILLARS = 8;
const TENDRIL_SEGMENTS = 10;
const FILAMENT_COUNT_PER_PILLAR = 12;

// ── Pedestal base ──────────────────────────────────────────────────────────
const BASE_TIERS = 3;
const BASE_FIN_COUNT = 12;

// ── Crown flare ────────────────────────────────────────────────────────────
const CROWN_LAYERS = 4;

// ── Pillar definitions ─────────────────────────────────────────────────────

interface PillarDefinition {
  posX: number;
  posZ: number;
  red: number;
  green: number;
  blue: number;
  label: string;
}

const PILLAR_DEFINITIONS: PillarDefinition[] = [
  { posX: -16, posZ: THRONE_DEPTH_Z - 30, red: 0.90, green: 0.55, blue: 0.12, label: 'innerLeft' },
  { posX:  16, posZ: THRONE_DEPTH_Z - 30, red: 0.90, green: 0.55, blue: 0.12, label: 'innerRight' },
  { posX: -32, posZ: THRONE_DEPTH_Z - 50, red: 0.55, green: 0.18, blue: 0.35, label: 'outerLeft' },
  { posX:  32, posZ: THRONE_DEPTH_Z - 50, red: 0.55, green: 0.18, blue: 0.35, label: 'outerRight' },
];

// ── Layer builders ─────────────────────────────────────────────────────────

/**
 * Builds the concentric glow layers — from white-hot molten core outward
 * through the primary colour to a faint atmospheric wash.
 */
const addGlowLayers = (scene: Scene, pillar: PillarDefinition) => {
  const { posX, posZ, red, green, blue } = pillar;
  const centerY = PILLAR_HEIGHT / 2;

  // Molten core — near-white, very bright
  createCylinder(scene,
    Math.min(red * 1.6, 1), Math.min(green * 1.6, 1), Math.min(blue * 1.4, 1),
    posX, centerY, posZ, PILLAR_HEIGHT, MOLTEN_CORE_RADIUS, 0.9);

  // Primary glow — the dominant colour at full strength
  createCylinder(scene, red, green, blue,
    posX, centerY, posZ, PILLAR_HEIGHT, PRIMARY_GLOW_RADIUS);

  // Secondary glow — dimmer, wider, translucent
  createCylinder(scene, red * 0.85, green * 0.85, blue * 0.8,
    posX, centerY, posZ, PILLAR_HEIGHT, SECONDARY_GLOW_RADIUS, 0.25);

  // Outer bloom — very faint
  createCylinder(scene, red * 0.6, green * 0.6, blue * 0.5,
    posX, centerY, posZ, PILLAR_HEIGHT, OUTER_BLOOM_RADIUS, 0.1);

  // Atmospheric wash — barely visible, bleeds colour into the surrounding hall
  createCylinder(scene, red * 0.4, green * 0.4, blue * 0.3,
    posX, centerY, posZ, PILLAR_HEIGHT, ATMOSPHERIC_WASH_RADIUS, 0.04);
};

/**
 * Adds calligraphy bands — alternating wide ceremonial rings and thin
 * divider lines that undulate in radius, simulating flowing script
 * carved in fire. Wide bands pulse brighter; thin bands are dimmer.
 */
const addCalligraphyBands = (scene: Scene, pillar: PillarDefinition) => {
  const { posX, posZ, red, green, blue } = pillar;

  for (let bandIndex = 0; bandIndex < CALLIGRAPHY_BAND_COUNT; bandIndex++) {
    const bandY = 3 + bandIndex * (PILLAR_HEIGHT / CALLIGRAPHY_BAND_COUNT);
    const isWideBand = bandIndex % 3 !== 2;
    const bandHeight = isWideBand ? WIDE_BAND_HEIGHT : THIN_BAND_HEIGHT;

    // Radius undulates along height — the script "breathes"
    const breathFactor = Math.sin(bandIndex * 0.6) * 0.8 + Math.sin(bandIndex * 1.7) * 0.4;
    const bandRadius = PRIMARY_GLOW_RADIUS + 0.8 + breathFactor;

    // Wide bands glow brighter than thin divider lines
    const brightness = isWideBand ? 1.35 : 1.1;
    const bandAlpha = isWideBand ? 0.55 : 0.35;

    createCylinder(scene,
      red * brightness, green * brightness, blue * (brightness * 0.8),
      posX, bandY, posZ,
      bandHeight, bandRadius, bandAlpha);

    // Every wide band gets small notch marks — individual "glyphs"
    if (isWideBand) {
      const glyphCount = 8 + Math.floor(seededRandom(bandIndex * 43) * 6);
      for (let glyphIndex = 0; glyphIndex < glyphCount; glyphIndex++) {
        const glyphAngle = (glyphIndex / glyphCount) * Math.PI * 2;
        const glyphX = posX + Math.cos(glyphAngle) * (bandRadius + 0.3);
        const glyphZ = posZ + Math.sin(glyphAngle) * (bandRadius + 0.3);
        const glyphHeight = 0.3 + seededRandom(bandIndex * 43 + glyphIndex * 7) * 0.6;

        createBox(scene,
          red * 1.5, green * 1.4, blue * 1.0,
          glyphX, bandY, glyphZ,
          0.15, glyphHeight, 0.15, 0.6);
      }
    }
  }
};

/**
 * Adds helical spiral veins winding up each pillar — like the vascular
 * system of a colossal living organism. Each vein is a chain of small
 * bright spheres tracing a helix around the pillar surface.
 */
const addSpiralVeins = (scene: Scene, pillar: PillarDefinition) => {
  const { posX, posZ, red, green, blue } = pillar;

  for (let veinIndex = 0; veinIndex < SPIRAL_VEIN_COUNT; veinIndex++) {
    const veinPhaseOffset = (veinIndex / SPIRAL_VEIN_COUNT) * Math.PI * 2;
    const veinRadius = PRIMARY_GLOW_RADIUS + 0.4;

    for (let segment = 0; segment < SPIRAL_SEGMENTS_PER_VEIN; segment++) {
      const progress = segment / SPIRAL_SEGMENTS_PER_VEIN;
      const angle = veinPhaseOffset + progress * Math.PI * 2 * SPIRAL_TURNS;
      const segmentY = 2 + progress * (PILLAR_HEIGHT - 4);

      const segmentX = posX + Math.cos(angle) * veinRadius;
      const segmentZ = posZ + Math.sin(angle) * veinRadius;

      // Veins brighten toward the top of the pillar
      const heightBrightness = 0.8 + progress * 0.5;
      const segmentSize = 0.3 + Math.sin(progress * Math.PI) * 0.15;

      createSphere(scene,
        red * heightBrightness * 1.2, green * heightBrightness * 1.1, blue * heightBrightness * 0.8,
        segmentX, segmentY, segmentZ,
        segmentSize, segmentSize, segmentSize, 0.7);
    }
  }
};

/**
 * Adds ember nodes — bright hot spots where spiral veins cross calligraphy
 * bands. These flare brighter as if the intersections are molten, creating
 * focal points of intensity scattered across the pillar surface.
 */
const addEmberNodes = (scene: Scene, pillar: PillarDefinition) => {
  const { posX, posZ, red, green, blue } = pillar;

  for (let nodeIndex = 0; nodeIndex < EMBER_NODES_PER_PILLAR; nodeIndex++) {
    const nodeAngle = seededRandom(nodeIndex * 61) * Math.PI * 2;
    const nodeY = 5 + seededRandom(nodeIndex * 61 + 1) * (PILLAR_HEIGHT - 10);
    const nodeRadius = PRIMARY_GLOW_RADIUS + 0.6;

    const nodeX = posX + Math.cos(nodeAngle) * nodeRadius;
    const nodeZ = posZ + Math.sin(nodeAngle) * nodeRadius;
    const nodeSize = 0.5 + seededRandom(nodeIndex * 61 + 2) * 0.8;

    // Bright flare — near white
    createSphere(scene,
      Math.min(red * 1.8, 1), Math.min(green * 1.7, 1), Math.min(blue * 1.3, 1),
      nodeX, nodeY, nodeZ,
      nodeSize, nodeSize, nodeSize, 0.6);

    // Soft halo around each ember
    createSphere(scene,
      red * 1.2, green * 1.1, blue * 0.8,
      nodeX, nodeY, nodeZ,
      nodeSize * 2.5, nodeSize * 2.5, nodeSize * 2.5, 0.1);
  }
};

/**
 * Adds the organic dissolution zone — between and around the pillars,
 * the architecture dissolves into biological forms. Tendrils bridge
 * between pillar pairs, and loose filaments curl outward into the hall.
 */
const addOrganicDissolution = (scene: Scene) => {
  // Tendrils bridging between inner pair of pillars
  const innerLeft = PILLAR_DEFINITIONS[0];
  const innerRight = PILLAR_DEFINITIONS[1];

  for (let tendrilIndex = 0; tendrilIndex < TENDRIL_COUNT_BETWEEN_PILLARS; tendrilIndex++) {
    const tendrilBaseY = 15 + tendrilIndex * (PILLAR_HEIGHT / TENDRIL_COUNT_BETWEEN_PILLARS);
    const sag = 3 + seededRandom(tendrilIndex * 71) * 6;

    for (let segment = 0; segment < TENDRIL_SEGMENTS; segment++) {
      const progress = segment / (TENDRIL_SEGMENTS - 1);
      const segmentX = innerLeft.posX + (innerRight.posX - innerLeft.posX) * progress;
      const catenary = Math.sin(progress * Math.PI) * sag;
      const segmentY = tendrilBaseY - catenary;
      const segmentZ = innerLeft.posZ + (seededRandom(tendrilIndex * 71 + segment) - 0.5) * 3;
      const thickness = 0.3 + Math.sin(progress * Math.PI) * 0.4;

      // Colour interpolates from left pillar to right pillar
      const mixedRed = innerLeft.red * (1 - progress) + innerRight.red * progress;
      const mixedGreen = innerLeft.green * (1 - progress) + innerRight.green * progress;
      const mixedBlue = innerLeft.blue * (1 - progress) + innerRight.blue * progress;

      createSphere(scene,
        mixedRed * 0.7, mixedGreen * 0.7, mixedBlue * 0.6,
        segmentX, segmentY, segmentZ,
        thickness, thickness, thickness * 1.5, 0.3);
    }
  }

  // Tendrils bridging between outer pair of pillars
  const outerLeft = PILLAR_DEFINITIONS[2];
  const outerRight = PILLAR_DEFINITIONS[3];

  for (let tendrilIndex = 0; tendrilIndex < TENDRIL_COUNT_BETWEEN_PILLARS / 2; tendrilIndex++) {
    const tendrilBaseY = 25 + tendrilIndex * (PILLAR_HEIGHT / (TENDRIL_COUNT_BETWEEN_PILLARS / 2));
    const sag = 4 + seededRandom(tendrilIndex * 83) * 8;

    for (let segment = 0; segment < TENDRIL_SEGMENTS; segment++) {
      const progress = segment / (TENDRIL_SEGMENTS - 1);
      const segmentX = outerLeft.posX + (outerRight.posX - outerLeft.posX) * progress;
      const catenary = Math.sin(progress * Math.PI) * sag;
      const segmentY = tendrilBaseY - catenary;
      const segmentZ = outerLeft.posZ + (seededRandom(tendrilIndex * 83 + segment) - 0.5) * 4;
      const thickness = 0.25 + Math.sin(progress * Math.PI) * 0.3;

      createSphere(scene,
        outerLeft.red * 0.6, outerLeft.green * 0.6, outerLeft.blue * 0.5,
        segmentX, segmentY, segmentZ,
        thickness, thickness, thickness * 1.3, 0.2);
    }
  }

  // Loose filaments curling outward from each pillar into the surrounding hall
  PILLAR_DEFINITIONS.forEach((pillar, pillarIndex) => {
    for (let filIndex = 0; filIndex < FILAMENT_COUNT_PER_PILLAR; filIndex++) {
      const startAngle = seededRandom(pillarIndex * 97 + filIndex * 13) * Math.PI * 2;
      const filamentLength = 6 + seededRandom(pillarIndex * 97 + filIndex * 13 + 1) * 10;
      const filamentBaseY = 10 + seededRandom(pillarIndex * 97 + filIndex * 13 + 2) * (PILLAR_HEIGHT - 20);
      const curlRate = 0.5 + seededRandom(pillarIndex * 97 + filIndex * 13 + 3) * 1.5;

      for (let segment = 0; segment < 6; segment++) {
        const progress = segment / 5;
        const angle = startAngle + progress * curlRate;
        const reach = PRIMARY_GLOW_RADIUS + 1 + progress * filamentLength;

        const segmentX = pillar.posX + Math.cos(angle) * reach;
        const segmentZ = pillar.posZ + Math.sin(angle) * reach;
        const segmentY = filamentBaseY + progress * 3 * (seededRandom(filIndex * 7 + segment) - 0.3);
        const thickness = 0.35 * (1 - progress * 0.6);

        createSphere(scene,
          pillar.red * 0.5, pillar.green * 0.5, pillar.blue * 0.4,
          segmentX, segmentY, segmentZ,
          thickness, thickness, thickness, 0.2 * (1 - progress * 0.5));
      }
    }
  });
};

/**
 * Adds a three-tiered pedestal base with radiating carved fins.
 * Each tier is wider than the one above it, anchoring the luminous
 * column to the dark floor with increasing visual weight.
 */
const addPedestalBase = (scene: Scene, pillar: PillarDefinition) => {
  const { posX, posZ, red, green, blue } = pillar;

  for (let tier = 0; tier < BASE_TIERS; tier++) {
    const tierRadius = PRIMARY_GLOW_RADIUS + 2 + tier * 2.5;
    const tierHeight = 2.5 - tier * 0.5;
    const tierY = tierHeight / 2 + tier * 1.8;
    const tierDimming = 0.5 - tier * 0.1;

    // Tier ring
    createCylinder(scene,
      red * tierDimming, green * tierDimming, blue * tierDimming,
      posX, tierY, posZ, tierHeight, tierRadius);

    // Radiating fins carved into each tier
    for (let finIndex = 0; finIndex < BASE_FIN_COUNT; finIndex++) {
      const finAngle = (finIndex / BASE_FIN_COUNT) * Math.PI * 2;
      const finX = posX + Math.cos(finAngle) * (tierRadius * 0.7);
      const finZ = posZ + Math.sin(finAngle) * (tierRadius * 0.7);
      const finLength = tierRadius * 0.6;

      createBox(scene,
        red * (tierDimming + 0.1), green * (tierDimming + 0.05), blue * tierDimming,
        finX + Math.cos(finAngle) * finLength / 2,
        tierY,
        finZ + Math.sin(finAngle) * finLength / 2,
        0.2, tierHeight * 0.6, finLength);

      // Rotate the fin to point outward — approximate with a box aligned along angle
      // (since boxes don't rotate easily in our helper, we use position to fake it)
    }
  }
};

/**
 * Adds a crown flare at the top of each pillar — concentric expanding
 * rings where the column meets the ceiling void, as if the light is
 * spilling upward and outward into the darkness above.
 */
const addCrownFlare = (scene: Scene, pillar: PillarDefinition) => {
  const { posX, posZ, red, green, blue } = pillar;

  for (let layer = 0; layer < CROWN_LAYERS; layer++) {
    const layerY = PILLAR_HEIGHT - 2 + layer * 2;
    const expansion = 1 + layer * 0.5;
    const layerRadius = PRIMARY_GLOW_RADIUS + expansion * 3;
    const layerAlpha = 0.3 - layer * 0.06;
    const layerBrightness = 1.1 - layer * 0.15;

    createCylinder(scene,
      red * layerBrightness, green * layerBrightness, blue * (layerBrightness * 0.8),
      posX, layerY, posZ,
      1.5, layerRadius, layerAlpha);
  }

  // Final bloom sphere at the very top
  createSphere(scene,
    red * 0.7, green * 0.7, blue * 0.5,
    posX, PILLAR_HEIGHT + 3, posZ,
    PRIMARY_GLOW_RADIUS * 3, 5, PRIMARY_GLOW_RADIUS * 3, 0.08);
};

// ── Public API ─────────────────────────────────────────────────────────────

/**
 * Adds all four luminous pillar monoliths with full detail to the scene.
 * @param scene - The Babylon scene to populate.
 */
export const addPillars = (scene: Scene) => {
  PILLAR_DEFINITIONS.forEach(pillar => {
    addGlowLayers(scene, pillar);
    addCalligraphyBands(scene, pillar);
    addSpiralVeins(scene, pillar);
    addEmberNodes(scene, pillar);
    addPedestalBase(scene, pillar);
    addCrownFlare(scene, pillar);
  });

  // Organic dissolution bridges between and around all pillars
  addOrganicDissolution(scene);
};
