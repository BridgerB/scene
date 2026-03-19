/**
 * Architectural details — organic tendrils and the central aisle markings.
 *
 * Tendrils are vein-like structures that sweep from the walls up toward
 * the ceiling, reinforcing the biological/geological aesthetic described
 * in Herbert's novels — architecture so ancient it feels alive.
 *
 * The central aisle is a dark runner with gold trim down the middle of
 * the hall, guiding the eye (and the figures) from entrance to throne.
 */
import { Scene } from '@babylonjs/core';
import { createBox, createCylinder } from './utils';

const HALL_HEIGHT = 140;
const TENDRIL_COUNT = 16;
const TENDRIL_SPACING_Z = 17;
const TENDRIL_SEGMENTS = 8;
const TENDRIL_WALL_OFFSET_X = 54;

const AISLE_LENGTH = 280;
const AISLE_CENTER_Z = 150;
const AISLE_HALF_WIDTH = 4.2;
const ORNAMENT_COUNT = 20;
const ORNAMENT_SPACING_Z = 13;

/**
 * Adds organic tendrils that arch from the walls toward the ceiling center.
 * Each tendril is built from a series of cylinder segments whose position
 * and thickness interpolate smoothly from wall base to ceiling.
 * @param scene - The Babylon scene to populate.
 */
export const addOrganicTendrils = (scene: Scene) => {
  for (let tendrilIndex = 0; tendrilIndex < TENDRIL_COUNT; tendrilIndex++) {
    const sideSign = tendrilIndex % 2 === 0 ? -1 : 1;
    const tendrilBaseZ = 30 + tendrilIndex * TENDRIL_SPACING_Z;
    const wallAnchorX = sideSign * TENDRIL_WALL_OFFSET_X;

    for (let segment = 0; segment < TENDRIL_SEGMENTS; segment++) {
      const progress = segment / (TENDRIL_SEGMENTS - 1); // 0 at wall, 1 at ceiling

      // Interpolate X from wall toward center, Y from mid-height upward
      const segmentX = wallAnchorX * (1 - progress * 0.6);
      const segmentY = 60 + progress * 60 + Math.sin(progress * Math.PI) * 20;
      const segmentZ = tendrilBaseZ + Math.sin(progress * 3) * 5;

      // Tendrils brighten and thin as they reach the ceiling
      createCylinder(scene,
        0.25 + progress * 0.1, 0.20 + progress * 0.05, 0.30 + progress * 0.08,
        segmentX, segmentY, segmentZ,
        12, 1.2 - progress * 0.6);
    }
  }
};

/**
 * Adds the central aisle — a dark floor runner bordered by gold trim lines,
 * with periodic ornamental cross-markers along its length.
 * @param scene - The Babylon scene to populate.
 */
export const addCentralAisle = (scene: Scene) => {
  // Dark bordered aisle strip running the length of the hall
  createBox(scene, 0.10, 0.08, 0.11,
    0, 0.06, AISLE_CENTER_Z, 8, 0.02, AISLE_LENGTH);

  // Gold trim edges on both sides of the runner
  [-AISLE_HALF_WIDTH, AISLE_HALF_WIDTH].forEach(edgeX => {
    createBox(scene, 0.45, 0.35, 0.12,
      edgeX, 0.07, AISLE_CENTER_Z, 0.3, 0.02, AISLE_LENGTH);
  });

  // Ornamental cross-markers at regular intervals
  for (let ornamentIndex = 0; ornamentIndex < ORNAMENT_COUNT; ornamentIndex++) {
    const ornamentZ = 20 + ornamentIndex * ORNAMENT_SPACING_Z;
    createBox(scene, 0.35, 0.25, 0.10,
      0, 0.07, ornamentZ, 6, 0.02, 0.8);
  }
};
