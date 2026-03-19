/**
 * Dune: Imperial Throne Room — scene orchestrator.
 *
 * Assembles all sub-modules into the complete Muad'Dib audience chamber,
 * inspired by Marc Simonetti's concept art for Frank Herbert's Dune.
 *
 * The scene depicts the climactic moment when Paul Atreides, flanked by
 * two Fedaykin death commandos, walks across the vast ceremonial hall
 * toward the teal-green throne — insignificant figures dwarfed by the
 * colossal architecture of empire.
 */
import { Scene } from '@babylonjs/core';
import { resetMeshCounter } from './utils';
import { addEnclosure } from './enclosure';
import { addWalls } from './walls';
import { addPillars } from './pillars';
import { addLightBeams, addCeilingGlow, addMist } from './lighting';
import { addThrone } from './throne';
import { addSoldierRows, addForegroundFigures } from './figures';
import { addOrganicTendrils, addCentralAisle } from './details';

/**
 * Builds the complete Dune imperial throne room scene.
 * @param scene - The Babylon scene to populate with all geometry.
 */
export const buildDune = (scene: Scene) => {
  resetMeshCounter();
  addEnclosure(scene);
  addWalls(scene);
  addPillars(scene);
  addLightBeams(scene);
  addThrone(scene);
  addSoldierRows(scene);
  addForegroundFigures(scene);
  addMist(scene);
  addOrganicTendrils(scene);
  addCentralAisle(scene);
  addCeilingGlow(scene);
};
