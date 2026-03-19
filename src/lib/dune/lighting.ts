/**
 * Lighting — the divine, theatrical illumination of the throne room.
 *
 * "Three enormous vertical columns of warm amber and rose-gold light
 * pour straight down from an unseen opening far above, like the fingers
 * of a god pressing into the room. They illuminate the swirling mist or
 * incense smoke that drifts through the space, giving the air itself a
 * sacred, volatile quality."
 *
 * Since the scene uses only emissive materials (no Babylon light sources),
 * all "lighting" is faked with semi-transparent glowing geometry:
 *
 *   1. **Primary divine beams** — multi-layered columns of light descending
 *      from ceiling to floor, each built from 5 concentric cylinders plus
 *      internal luminous striations and a bright floor pool.
 *   2. **Beam-edge caustics** — small bright patches scattered on the floor
 *      at the beam perimeter where light refracts off dust.
 *   3. **Secondary shafts** — thinner stray beams leaking through cracks
 *      in the unseen ceiling above.
 *   4. **Ceiling apertures** — glowing ellipsoids on the ceiling surface
 *      implying the openings the beams pour through.
 *   5. **Throne halo** — a warm glow concentrated above the throne,
 *      as if the architecture itself focuses light on the seat of power.
 *   6. **Incense fog** — large flattened ellipsoids of warm amber haze
 *      drifting in stratified layers through the hall.
 *   7. **Dust motes** — hundreds of tiny bright gold specks catching the
 *      beams, concentrated within beam columns but scattered throughout.
 *   8. **Floor reflections** — faint elongated glow patches on the
 *      polished tile surface beneath each beam.
 *   9. **Wall wash** — soft warm ellipsoids pressed against the walls
 *      where beam light spills sideways, suggesting indirect illumination.
 *  10. **Shadow pools** — dark negative-space ellipsoids between the lit
 *      areas, deepening the contrast and reinforcing the chiaroscuro.
 */
import { Scene } from '@babylonjs/core';
import { seededRandom, createCylinder, createSphere, createBox } from './utils';

// ── Hall dimensions (must match enclosure.ts) ──────────────────────────────
const HALL_HEIGHT = 140;
const HALL_LENGTH = 300;
const HALL_WIDTH = 120;
const WALL_OFFSET_X = 58;
const THRONE_DEPTH_Z = 260;

// ── Primary beams ──────────────────────────────────────────────────────────

interface BeamDefinition {
  posX: number;
  posZ: number;
  /** Brightness multiplier — the center beam is the strongest. */
  intensity: number;
}

const PRIMARY_BEAMS: BeamDefinition[] = [
  { posX: 0,   posZ: THRONE_DEPTH_Z - 30, intensity: 1.0 },   // center — strongest
  { posX: -22, posZ: THRONE_DEPTH_Z - 45, intensity: 0.85 },  // left
  { posX: 22,  posZ: THRONE_DEPTH_Z - 45, intensity: 0.85 },  // right
];

/** Number of internal luminous striations within each beam. */
const BEAM_STRIATION_COUNT = 8;
/** Bright caustic patches around each beam's floor pool. */
const CAUSTIC_PATCHES_PER_BEAM = 10;
/** Concentrated dust motes within each beam column. */
const MOTES_PER_BEAM = 30;

// ── Secondary shafts ───────────────────────────────────────────────────────
const SECONDARY_SHAFT_COUNT = 10;

// ── Ceiling ────────────────────────────────────────────────────────────────
const CEILING_APERTURE_RING_COUNT = 3;
const SCATTERED_CEILING_LIGHT_COUNT = 14;

// ── Fog ────────────────────────────────────────────────────────────────────
const FOG_LAYER_COUNT = 5;
const FOG_VOLUMES_PER_LAYER = 14;
const AMBIENT_DUST_MOTE_COUNT = 120;

// ── Floor reflections ──────────────────────────────────────────────────────
const FLOOR_REFLECTION_COUNT_PER_BEAM = 6;

// ── Wall wash ──────────────────────────────────────────────────────────────
const WALL_WASH_COUNT = 8;

// ── Shadow pools ───────────────────────────────────────────────────────────
const SHADOW_POOL_COUNT = 12;

// ── Colour constants ───────────────────────────────────────────────────────
const AMBER_BRIGHT: [number, number, number] = [1.00, 0.92, 0.60];
const AMBER_WARM:   [number, number, number] = [1.00, 0.82, 0.45];
const AMBER_DIM:    [number, number, number] = [0.90, 0.70, 0.35];
const ROSE_GOLD:    [number, number, number] = [0.95, 0.75, 0.50];
const FOG_AMBER:    [number, number, number] = [0.70, 0.55, 0.30];
const FOG_ROSE:     [number, number, number] = [0.60, 0.45, 0.35];
const MOTE_GOLD:    [number, number, number] = [1.00, 0.88, 0.55];
/** Pure white daylight — sunlight pouring through the ceiling apertures. */
const DAYLIGHT:     [number, number, number] = [1.00, 1.00, 1.00];

// ── Layer builders ─────────────────────────────────────────────────────────

/**
 * Adds the three primary divine light beams. Each beam is built from
 * five concentric cylinders (hot core → atmospheric wash), internal
 * luminous striations, and a widened floor pool with caustic patches.
 */
const addPrimaryBeams = (scene: Scene) => {
  PRIMARY_BEAMS.forEach(({ posX, posZ, intensity }) => {
    const centerY = HALL_HEIGHT / 2;

    // Layer 1: hot core — near-white, tight
    createCylinder(scene,
      AMBER_BRIGHT[0] * intensity, AMBER_BRIGHT[1] * intensity, AMBER_BRIGHT[2] * intensity,
      posX, centerY, posZ, HALL_HEIGHT, 4, 0.22 * intensity);

    // Layer 2: bright amber — the dominant visible beam
    createCylinder(scene,
      AMBER_WARM[0] * intensity, AMBER_WARM[1] * intensity, AMBER_WARM[2] * intensity,
      posX, centerY, posZ, HALL_HEIGHT, 7, 0.15 * intensity);

    // Layer 3: rose-gold mid glow
    createCylinder(scene,
      ROSE_GOLD[0] * intensity, ROSE_GOLD[1] * intensity, ROSE_GOLD[2] * intensity,
      posX, centerY, posZ, HALL_HEIGHT, 11, 0.09 * intensity);

    // Layer 4: wide soft wash
    createCylinder(scene,
      AMBER_DIM[0] * intensity, AMBER_DIM[1] * intensity, AMBER_DIM[2] * intensity,
      posX, centerY, posZ, HALL_HEIGHT, 16, 0.05 * intensity);

    // Layer 5: atmospheric bloom — wide ambient wash
    createCylinder(scene,
      AMBER_DIM[0] * 0.7, AMBER_DIM[1] * 0.7, AMBER_DIM[2] * 0.6,
      posX, centerY, posZ, HALL_HEIGHT, 23, 0.025 * intensity);

    // Internal luminous striations — vertical bright threads within the beam
    for (let striationIndex = 0; striationIndex < BEAM_STRIATION_COUNT; striationIndex++) {
      const angle = (striationIndex / BEAM_STRIATION_COUNT) * Math.PI * 2;
      const striationRadius = 2.5 + seededRandom(striationIndex * 47 + posX * 3) * 4;
      const striationX = posX + Math.cos(angle) * striationRadius;
      const striationZ = posZ + Math.sin(angle) * striationRadius;
      const striationHeight = HALL_HEIGHT * (0.6 + seededRandom(striationIndex * 47 + 1) * 0.4);
      const striationY = centerY + (seededRandom(striationIndex * 47 + 2) - 0.5) * 20;

      createCylinder(scene,
        AMBER_BRIGHT[0] * intensity, AMBER_BRIGHT[1] * intensity * 0.9, AMBER_BRIGHT[2] * intensity * 0.7,
        striationX, striationY, striationZ,
        striationHeight, 0.3 + seededRandom(striationIndex * 47 + 3) * 0.5,
        0.18 * intensity);
    }

    // Floor pool — widened glow where the beam meets the ground
    createCylinder(scene,
      AMBER_WARM[0] * 0.9, AMBER_WARM[1] * 0.85, AMBER_WARM[2] * 0.7,
      posX, 2, posZ, 4, 20, 0.09 * intensity);
    // Brighter core of floor pool
    createCylinder(scene,
      AMBER_BRIGHT[0], AMBER_BRIGHT[1] * 0.95, AMBER_BRIGHT[2] * 0.8,
      posX, 1, posZ, 2, 9, 0.15 * intensity);

    // Caustic patches — small bright spots scattered at beam edge on the floor
    for (let causticIndex = 0; causticIndex < CAUSTIC_PATCHES_PER_BEAM; causticIndex++) {
      const causticAngle = seededRandom(causticIndex * 59 + posX * 7) * Math.PI * 2;
      const causticDist = 8 + seededRandom(causticIndex * 59 + 1) * 12;
      const causticX = posX + Math.cos(causticAngle) * causticDist;
      const causticZ = posZ + Math.sin(causticAngle) * causticDist;
      const causticSize = 1 + seededRandom(causticIndex * 59 + 2) * 2.5;

      createSphere(scene,
        AMBER_BRIGHT[0] * 0.7, AMBER_BRIGHT[1] * 0.65, AMBER_BRIGHT[2] * 0.4,
        causticX, 0.08, causticZ,
        causticSize, 0.1, causticSize * 0.8, 0.12 * intensity);
    }

    // Concentrated dust motes within the beam column
    for (let moteIndex = 0; moteIndex < MOTES_PER_BEAM; moteIndex++) {
      const moteAngle = seededRandom(moteIndex * 37 + posX * 11) * Math.PI * 2;
      const moteDist = seededRandom(moteIndex * 37 + 1) * 8;
      const moteX = posX + Math.cos(moteAngle) * moteDist;
      const moteZ = posZ + Math.sin(moteAngle) * moteDist;
      const moteY = 3 + seededRandom(moteIndex * 37 + 2) * (HALL_HEIGHT - 6);
      const moteSize = 0.15 + seededRandom(moteIndex * 37 + 3) * 0.6;

      createSphere(scene,
        MOTE_GOLD[0], MOTE_GOLD[1], MOTE_GOLD[2],
        moteX, moteY, moteZ,
        moteSize, moteSize, moteSize, 0.20 * intensity);
    }
  });
};

/**
 * Adds thinner secondary light shafts — stray beams leaking through
 * cracks in the ceiling structure, scattered throughout the hall.
 * Each shaft is slightly tilted and varies in width and brightness.
 */
const addSecondaryShafts = (scene: Scene) => {
  for (let index = 0; index < SECONDARY_SHAFT_COUNT; index++) {
    const shaftX = (seededRandom(index * 17) - 0.5) * 80;
    const shaftZ = 40 + seededRandom(index * 17 + 1) * 200;
    const shaftRadius = 1.5 + seededRandom(index * 17 + 2) * 3;
    const shaftHeight = 80 + seededRandom(index * 17 + 3) * 50;
    const shaftY = HALL_HEIGHT / 2 + (seededRandom(index * 17 + 4) - 0.5) * 30;
    const shaftBrightness = 0.4 + seededRandom(index * 17 + 5) * 0.4;

    // Outer glow
    createCylinder(scene,
      AMBER_DIM[0] * shaftBrightness, AMBER_DIM[1] * shaftBrightness, AMBER_DIM[2] * shaftBrightness,
      shaftX, shaftY, shaftZ,
      shaftHeight, shaftRadius * 1.8, 0.05);

    // Bright core
    createCylinder(scene,
      AMBER_WARM[0] * shaftBrightness, AMBER_WARM[1] * shaftBrightness, AMBER_WARM[2] * shaftBrightness,
      shaftX, shaftY, shaftZ,
      shaftHeight, shaftRadius, 0.08);
  }
};

/**
 * Adds glowing ellipsoids on the ceiling surface to imply the openings
 * the beams pour through. Each aperture has concentric rings fading
 * outward — the brightest center implying the hole, the dimmer rings
 * implying reflected light on the ceiling stone around it.
 */
const addCeilingApertures = (scene: Scene) => {
  PRIMARY_BEAMS.forEach(({ posX, posZ, intensity }) => {
    for (let ring = 0; ring < CEILING_APERTURE_RING_COUNT; ring++) {
      const ringRadius = 6 + ring * 8;
      const ringBrightness = intensity * (1 - ring * 0.3);
      const ringAlpha = 0.35 - ring * 0.10;

      createSphere(scene,
        AMBER_WARM[0] * ringBrightness, AMBER_WARM[1] * ringBrightness, AMBER_WARM[2] * ringBrightness,
        posX, HALL_HEIGHT - 1, posZ,
        ringRadius, 2, ringRadius, ringAlpha);
    }
  });

  // Scattered dim ceiling lights along the hall
  for (let index = 0; index < SCATTERED_CEILING_LIGHT_COUNT; index++) {
    const lightX = (seededRandom(index * 31) - 0.5) * 80;
    const lightZ = 30 + seededRandom(index * 31 + 1) * 240;
    const lightSize = 8 + seededRandom(index * 31 + 2) * 8;
    createSphere(scene,
      AMBER_DIM[0] * 0.5, AMBER_DIM[1] * 0.5, AMBER_DIM[2] * 0.4,
      lightX, HALL_HEIGHT - 2, lightZ,
      lightSize, 3, lightSize, 0.10);
  }
};

/**
 * Adds a warm halo glow concentrated above the throne — as if the
 * architecture itself focuses all available light on the seat of power.
 * Built from nested ellipsoids of decreasing size and increasing brightness.
 */
const addThroneHalo = (scene: Scene) => {
  const throneGlowZ = THRONE_DEPTH_Z - 30;

  // Outermost wash
  createSphere(scene, 0.55, 0.38, 0.12,
    0, HALL_HEIGHT - 5, throneGlowZ, 70, 10, 50, 0.15);
  // Mid glow
  createSphere(scene, 0.70, 0.48, 0.16,
    0, HALL_HEIGHT - 4, throneGlowZ, 45, 7, 35, 0.22);
  // Bright core
  createSphere(scene, 0.88, 0.60, 0.22,
    0, HALL_HEIGHT - 3, throneGlowZ, 25, 4, 20, 0.30);
  // Hot center
  createSphere(scene, 1.0, 0.75, 0.30,
    0, HALL_HEIGHT - 2, throneGlowZ, 10, 2, 8, 0.40);

  // Downward spill — light pooling down from the ceiling toward the throne
  createCylinder(scene,
    0.65, 0.45, 0.15,
    0, HALL_HEIGHT - 20, throneGlowZ,
    30, 20, 0.05);
};

/**
 * Adds stratified incense fog — warm amber and rose-tinted haze layers
 * at different heights through the hall. Each layer is built from a row
 * of overlapping flattened ellipsoids that drift slightly off-center
 * to avoid looking uniform.
 */
const addIncenseFog = (scene: Scene) => {
  for (let layerIndex = 0; layerIndex < FOG_LAYER_COUNT; layerIndex++) {
    const layerY = 8 + layerIndex * 18;
    const fogColor = layerIndex % 2 === 0 ? FOG_AMBER : FOG_ROSE;
    const layerAlpha = 0.05 + (layerIndex % 3) * 0.015;

    for (let volumeIndex = 0; volumeIndex < FOG_VOLUMES_PER_LAYER; volumeIndex++) {
      const fogX = (seededRandom(layerIndex * 100 + volumeIndex * 19) - 0.5) * 100;
      const fogZ = seededRandom(layerIndex * 100 + volumeIndex * 19 + 1) * HALL_LENGTH;
      const fogDriftY = (seededRandom(layerIndex * 100 + volumeIndex * 19 + 2) - 0.5) * 6;
      const fogWidth = 12 + seededRandom(layerIndex * 100 + volumeIndex * 19 + 3) * 25;
      const fogDepth = fogWidth * (0.5 + seededRandom(layerIndex * 100 + volumeIndex * 19 + 4) * 0.5);
      const fogHeight = fogWidth * 0.25;

      createSphere(scene,
        fogColor[0], fogColor[1], fogColor[2],
        fogX, layerY + fogDriftY, fogZ,
        fogWidth, fogHeight, fogDepth, layerAlpha);
    }
  }

  // Denser fog concentrated within the primary beam columns
  PRIMARY_BEAMS.forEach(({ posX, posZ, intensity }) => {
    for (let cloudIndex = 0; cloudIndex < 8; cloudIndex++) {
      const cloudY = 10 + cloudIndex * 15;
      const cloudSize = 8 + seededRandom(cloudIndex * 53 + posX * 3) * 10;
      const cloudDriftX = (seededRandom(cloudIndex * 53 + 1) - 0.5) * 8;
      const cloudDriftZ = (seededRandom(cloudIndex * 53 + 2) - 0.5) * 8;

      createSphere(scene,
        AMBER_WARM[0] * 0.7, AMBER_WARM[1] * 0.6, AMBER_WARM[2] * 0.5,
        posX + cloudDriftX, cloudY, posZ + cloudDriftZ,
        cloudSize, cloudSize * 0.3, cloudSize * 0.7,
        0.07 * intensity);
    }
  });
};

/**
 * Adds hundreds of tiny dust motes scattered through the hall.
 * Motes are denser near the beams and sparser in the dark areas,
 * catching the amber light and giving the air a sacred, volatile quality.
 */
const addDustMotes = (scene: Scene) => {
  for (let index = 0; index < AMBIENT_DUST_MOTE_COUNT; index++) {
    const moteX = (seededRandom(index * 23) - 0.5) * 90;
    const moteY = 2 + seededRandom(index * 23 + 1) * (HALL_HEIGHT - 4);
    const moteZ = 10 + seededRandom(index * 23 + 2) * (HALL_LENGTH - 20);
    const moteSize = 0.1 + seededRandom(index * 23 + 3) * 0.8;

    // Check proximity to any beam — motes near beams are brighter
    let nearBeam = false;
    for (const beam of PRIMARY_BEAMS) {
      const distX = moteX - beam.posX;
      const distZ = moteZ - beam.posZ;
      if (distX * distX + distZ * distZ < 20 * 20) {
        nearBeam = true;
        break;
      }
    }

    const brightness = nearBeam ? 1.0 : 0.4;
    const moteAlpha = nearBeam ? 0.15 : 0.05;

    createSphere(scene,
      MOTE_GOLD[0] * brightness, MOTE_GOLD[1] * brightness, MOTE_GOLD[2] * brightness,
      moteX, moteY, moteZ,
      moteSize, moteSize, moteSize, moteAlpha);
  }
};

/**
 * Adds elongated glow patches on the polished floor surface beneath
 * each primary beam — the reflective checkerboard tiles catching and
 * mirroring the amber light above.
 */
const addFloorReflections = (scene: Scene) => {
  PRIMARY_BEAMS.forEach(({ posX, posZ, intensity }) => {
    // Central reflection pool
    createSphere(scene,
      AMBER_WARM[0] * 0.5, AMBER_WARM[1] * 0.45, AMBER_WARM[2] * 0.3,
      posX, 0.05, posZ,
      22, 0.08, 18, 0.08 * intensity);

    // Scattered smaller reflections radiating outward
    for (let refIndex = 0; refIndex < FLOOR_REFLECTION_COUNT_PER_BEAM; refIndex++) {
      const refAngle = seededRandom(refIndex * 67 + posX * 9) * Math.PI * 2;
      const refDist = 10 + seededRandom(refIndex * 67 + 1) * 15;
      const refX = posX + Math.cos(refAngle) * refDist;
      const refZ = posZ + Math.sin(refAngle) * refDist;
      const refSize = 3 + seededRandom(refIndex * 67 + 2) * 5;

      createSphere(scene,
        AMBER_DIM[0] * 0.4, AMBER_DIM[1] * 0.35, AMBER_DIM[2] * 0.25,
        refX, 0.05, refZ,
        refSize, 0.06, refSize * 0.7, 0.06 * intensity);
    }
  });
};

/**
 * Adds soft warm ellipsoids pressed against the walls where beam light
 * spills sideways, suggesting indirect illumination bouncing off the
 * carved stonework.
 */
const addWallWash = (scene: Scene) => {
  for (let index = 0; index < WALL_WASH_COUNT; index++) {
    const washZ = 80 + index * 25;
    const washY = 15 + seededRandom(index * 73) * 40;
    const washSize = 10 + seededRandom(index * 73 + 1) * 15;

    [-1, 1].forEach(sideSign => {
      const wallX = sideSign * (WALL_OFFSET_X - 5);

      createSphere(scene,
        AMBER_DIM[0] * 0.4, AMBER_DIM[1] * 0.35, AMBER_DIM[2] * 0.25,
        wallX, washY, washZ,
        7, washSize, washSize * 0.8, 0.06);
    });
  }
};

/**
 * Adds dark shadow pool ellipsoids between the lit areas. These are
 * very dim near-black volumes that deepen the contrast in unlit zones,
 * reinforcing the dramatic chiaroscuro of the divine beams.
 */
const addShadowPools = (scene: Scene) => {
  for (let index = 0; index < SHADOW_POOL_COUNT; index++) {
    const shadowX = (seededRandom(index * 41) - 0.5) * 80;
    const shadowZ = 20 + seededRandom(index * 41 + 1) * 220;
    const shadowY = 0.04;
    const shadowWidth = 10 + seededRandom(index * 41 + 2) * 20;
    const shadowDepth = shadowWidth * (0.6 + seededRandom(index * 41 + 3) * 0.4);

    createSphere(scene,
      0.02, 0.015, 0.025,
      shadowX, shadowY, shadowZ,
      shadowWidth, 0.1, shadowDepth, 0.08);
  }
};

/**
 * Adds a bright daylight flood pouring through the same ceiling openings
 * as the golden beams. This is warm sunlight — not sterile white — that
 * fills the upper hall with visible brightness and spills a general
 * ambient wash across the entire floor, lifting the overall scene out
 * of darkness while preserving the golden beam drama.
 */
const addDaylightFlood = (scene: Scene) => {
  PRIMARY_BEAMS.forEach(({ posX, posZ, intensity }) => {
    // Broad white daylight column — wider than the golden beams
    createCylinder(scene,
      DAYLIGHT[0], DAYLIGHT[1], DAYLIGHT[2],
      posX, HALL_HEIGHT / 2, posZ,
      HALL_HEIGHT, 18, 0.10 * intensity);

    // Even wider white daylight wash
    createCylinder(scene,
      DAYLIGHT[0] * 0.95, DAYLIGHT[1] * 0.95, DAYLIGHT[2] * 0.90,
      posX, HALL_HEIGHT / 2, posZ,
      HALL_HEIGHT, 32, 0.05 * intensity);
  });

  // General ambient white fill — a huge sphere lifting baseline brightness
  createSphere(scene,
    DAYLIGHT[0] * 0.5, DAYLIGHT[1] * 0.5, DAYLIGHT[2] * 0.5,
    0, HALL_HEIGHT * 0.4, HALL_LENGTH / 2,
    HALL_WIDTH, HALL_HEIGHT * 0.8, HALL_LENGTH, 0.04);

  // Brighter white ambient near the throne where all 3 beams converge
  createSphere(scene,
    DAYLIGHT[0] * 0.6, DAYLIGHT[1] * 0.6, DAYLIGHT[2] * 0.6,
    0, HALL_HEIGHT * 0.35, THRONE_DEPTH_Z - 35,
    60, 50, 60, 0.07);

  // White floor wash beneath the beams
  createSphere(scene,
    DAYLIGHT[0] * 0.45, DAYLIGHT[1] * 0.45, DAYLIGHT[2] * 0.45,
    0, 0.08, THRONE_DEPTH_Z - 35,
    70, 0.15, 50, 0.08);

  // Upper hall white haze near the ceiling
  createSphere(scene,
    DAYLIGHT[0] * 0.6, DAYLIGHT[1] * 0.6, DAYLIGHT[2] * 0.6,
    0, HALL_HEIGHT - 10, THRONE_DEPTH_Z - 35,
    80, 15, 60, 0.08);
};

// ── Public API ─────────────────────────────────────────────────────────────

/**
 * Adds the three primary divine light beams, secondary shafts, and
 * the broad daylight flood pouring through the ceiling apertures.
 * @param scene - The Babylon scene to populate.
 */
export const addLightBeams = (scene: Scene) => {
  addDaylightFlood(scene);
  addPrimaryBeams(scene);
  addSecondaryShafts(scene);
};

/**
 * Adds all ceiling glow effects — apertures, throne halo, and scattered lights.
 * @param scene - The Babylon scene to populate.
 */
export const addCeilingGlow = (scene: Scene) => {
  addCeilingApertures(scene);
  addThroneHalo(scene);
};

/**
 * Adds all atmospheric effects — incense fog, dust motes, floor reflections,
 * wall wash, and shadow pools.
 * @param scene - The Babylon scene to populate.
 */
export const addMist = (scene: Scene) => {
  addIncenseFog(scene);
  addDustMotes(scene);
  addFloorReflections(scene);
  addWallWash(scene);
  addShadowPools(scene);
};
