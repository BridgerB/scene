/**
 * Figures — the human elements populating the throne room.
 *
 * "At the foreground, three small figures stand at the threshold of this
 * colossal space, their silhouettes rendered in near-total darkness against
 * the luminous vastness ahead. Their diminutive scale is not accidental —
 * it is the entire point. They are insects before a cathedral built for gods."
 *
 * "On either side of the central path, rows upon rows of tiny uniformed
 * figures line the hall in perfect military formation — hundreds of them,
 * guards or courtiers standing at rigid attention."
 *
 * Contains multiple figure groups:
 *
 *   1. **Sardaukar formation** — hundreds of soldiers in rigid ranks with
 *      detailed anatomy: helmeted heads, armored torsos, shoulder plates,
 *      greaves, and upright spears held at attention.
 *   2. **Officer figures** — slightly taller and brighter soldiers at the
 *      front of each rank block, distinguishable as unit commanders.
 *   3. **Paul Muad'Dib** — the central robed figure with layered robe,
 *      hood shadow, trailing hem, and the subtle suggestion of a crysknife
 *      hidden at the belt.
 *   4. **Fedaykin death commandos** — the two flanking escorts with
 *      stillsuit body armor, face-masked helmets, long spears, hip-slung
 *      maula pistols, and combat stances slightly forward of Paul.
 *   5. **Figure reflections** — faint elongated silhouettes on the
 *      polished floor beneath each foreground figure, as described:
 *      "Their reflections stretch long and clear beneath them."
 *   6. **Figure shadows** — dark pools cast behind each foreground figure,
 *      thrown by the distant light beams ahead.
 */
import { Scene, Vector3, MeshBuilder } from '@babylonjs/core';
import { uniqueName, seededRandom, createMaterial, createBox, createCylinder, createSphere } from './utils';

// ── Sardaukar formation ────────────────────────────────────────────────────
const SOLDIER_RANKS = 4;
const SOLDIERS_PER_RANK = 45;
const SOLDIER_SPACING_Z = 4.8;
const SOLDIER_FORMATION_START_Z = 35;
const SOLDIER_INNER_OFFSET_X = 10;
const SOLDIER_RANK_SPACING_X = 2.5;

// ── Officers ───────────────────────────────────────────────────────────────
/** Officers stand at the front of each rank block (first soldier position). */
const OFFICER_SCALE = 1.15;

// ── Foreground figures ─────────────────────────────────────────────────────
/** Z position where the three foreground figures stand. */
const FOREGROUND_Z = 15;
/** X offset of the flanking Fedaykin guards from center. */
const GUARD_OFFSET_X = 3.5;
/** Guards stand slightly ahead of Paul (lower Z = closer to entrance). */
const GUARD_FORWARD_Z = 1.0;

// ── Colours ────────────────────────────────────────────────────────────────
/** Near-black silhouette tones for the foreground figures. */
const SILHOUETTE_DARK:   [number, number, number] = [0.06, 0.05, 0.04];
const SILHOUETTE_MID:    [number, number, number] = [0.09, 0.07, 0.05];
/** Slightly warmer tones for Paul's robe suggesting desert-worn fabric. */
const ROBE_OUTER:        [number, number, number] = [0.08, 0.06, 0.04];
const ROBE_INNER:        [number, number, number] = [0.05, 0.04, 0.03];
/** Armor tones for Sardaukar. */
const SARDAUKAR_BODY:    [number, number, number] = [0.11, 0.09, 0.07];
const SARDAUKAR_ARMOR:   [number, number, number] = [0.22, 0.18, 0.13];
const SARDAUKAR_HELMET:  [number, number, number] = [0.26, 0.22, 0.16];
/** Officers are slightly brighter to stand out from ranks. */
const OFFICER_ARMOR:     [number, number, number] = [0.30, 0.25, 0.18];
/** Weapon metal. */
const WEAPON_METAL:      [number, number, number] = [0.20, 0.17, 0.12];

// ── Layer builders ─────────────────────────────────────────────────────────

/**
 * Builds a single Sardaukar soldier at the given position.
 * Each soldier has: boots, greaves, torso, shoulder armor, neck guard,
 * helmeted head, and an upright spear held at the right side.
 */
const buildSoldier = (
  scene: Scene,
  posX: number,
  posZ: number,
  bodyMat: ReturnType<typeof createMaterial>,
  armorMat: ReturnType<typeof createMaterial>,
  helmetMat: ReturnType<typeof createMaterial>,
  weaponMat: ReturnType<typeof createMaterial>,
  scale: number,
  soldierSeed: number,
) => {
  const s = scale;
  // Slight random stance variation so they don't look perfectly cloned
  const stanceOffset = (seededRandom(soldierSeed) - 0.5) * 0.1;

  // Boots
  [-0.15, 0.15].forEach(footOffset => {
    const boot = MeshBuilder.CreateBox(uniqueName('boot'), { width: 0.25 * s, height: 0.35 * s, depth: 0.35 * s }, scene);
    boot.position = new Vector3(posX + footOffset * s, 0.175 * s, posZ + stanceOffset);
    boot.material = bodyMat;
  });

  // Greaves / legs
  const legs = MeshBuilder.CreateCylinder(uniqueName('legs'), { height: 0.8 * s, diameter: 0.4 * s }, scene);
  legs.position = new Vector3(posX, 0.75 * s, posZ + stanceOffset);
  legs.material = bodyMat;

  // Torso
  const torso = MeshBuilder.CreateCylinder(uniqueName('torso'), { height: 1.2 * s, diameter: 0.6 * s }, scene);
  torso.position = new Vector3(posX, 1.55 * s, posZ + stanceOffset);
  torso.material = bodyMat;

  // Chest armor plate
  const chestPlate = MeshBuilder.CreateBox(uniqueName('chest'), { width: 0.65 * s, height: 0.7 * s, depth: 0.35 * s }, scene);
  chestPlate.position = new Vector3(posX, 1.65 * s, posZ + stanceOffset - 0.05 * s);
  chestPlate.material = armorMat;

  // Shoulder pauldrons
  [-0.38, 0.38].forEach(shoulderOffset => {
    const pauldron = MeshBuilder.CreateSphere(uniqueName('pauldron'), { diameter: 0.32 * s }, scene);
    pauldron.position = new Vector3(posX + shoulderOffset * s, 2.0 * s, posZ + stanceOffset);
    pauldron.material = armorMat;
  });

  // Neck guard
  const neckGuard = MeshBuilder.CreateCylinder(uniqueName('neck'), { height: 0.2 * s, diameter: 0.35 * s }, scene);
  neckGuard.position = new Vector3(posX, 2.2 * s, posZ + stanceOffset);
  neckGuard.material = armorMat;

  // Helmeted head
  const helmet = MeshBuilder.CreateSphere(uniqueName('helmet'), { diameter: 0.5 * s }, scene);
  helmet.position = new Vector3(posX, 2.5 * s, posZ + stanceOffset);
  helmet.material = helmetMat;

  // Helmet crest — thin ridge on top
  const crest = MeshBuilder.CreateBox(uniqueName('crest'), { width: 0.05 * s, height: 0.15 * s, depth: 0.3 * s }, scene);
  crest.position = new Vector3(posX, 2.75 * s, posZ + stanceOffset);
  crest.material = helmetMat;

  // Spear — held upright at the right side
  const spear = MeshBuilder.CreateCylinder(uniqueName('spear'), { height: 3.5 * s, diameter: 0.05 * s }, scene);
  spear.position = new Vector3(posX + 0.35 * s, 2.0 * s, posZ + stanceOffset);
  spear.material = weaponMat;

  // Spear tip
  const spearTip = MeshBuilder.CreateCylinder(uniqueName('spearTip'),
    { height: 0.25 * s, diameterBottom: 0.12 * s, diameterTop: 0 }, scene);
  spearTip.position = new Vector3(posX + 0.35 * s, 3.8 * s, posZ + stanceOffset);
  spearTip.material = weaponMat;
};

/**
 * Adds the Sardaukar formation — 4 ranks of 45 soldiers on each side
 * of the aisle. The front soldier in each rank block is rendered as an
 * officer with a slightly larger scale and brighter armor.
 */
export const addSoldierRows = (scene: Scene) => {
  const bodyMat = createMaterial(scene, ...SARDAUKAR_BODY);
  const armorMat = createMaterial(scene, ...SARDAUKAR_ARMOR);
  const helmetMat = createMaterial(scene, ...SARDAUKAR_HELMET);
  const weaponMat = createMaterial(scene, ...WEAPON_METAL);
  const officerArmorMat = createMaterial(scene, ...OFFICER_ARMOR);

  [-1, 1].forEach(sideSign => {
    for (let rank = 0; rank < SOLDIER_RANKS; rank++) {
      const rankOffsetX = sideSign * (SOLDIER_INNER_OFFSET_X + rank * SOLDIER_RANK_SPACING_X);

      for (let soldierIndex = 0; soldierIndex < SOLDIERS_PER_RANK; soldierIndex++) {
        const soldierZ = SOLDIER_FORMATION_START_Z + soldierIndex * SOLDIER_SPACING_Z;
        const isOfficer = soldierIndex === 0;
        const scale = isOfficer ? OFFICER_SCALE : 1.0;
        const soldierArmorMat = isOfficer ? officerArmorMat : armorMat;
        const soldierSeed = rank * 1000 + soldierIndex * 10 + sideSign * 5000;

        buildSoldier(scene, rankOffsetX, soldierZ,
          bodyMat, soldierArmorMat, helmetMat, weaponMat,
          scale, soldierSeed);
      }
    }
  });
};

/**
 * Builds Paul Muad'Dib — the central robed figure. His robe is layered:
 * an outer cloak, inner robe visible beneath, a deep hood casting shadow
 * over the face, trailing hem that pools behind, and a crysknife hilt
 * suggested at the belt.
 */
const buildPaul = (scene: Scene) => {
  const paulX = 0;
  const paulZ = FOREGROUND_Z;

  // Outer cloak — wider cylinder, slightly flared at base
  createCylinder(scene, ROBE_OUTER[0], ROBE_OUTER[1], ROBE_OUTER[2],
    paulX, 1.5, paulZ, 3.0, 0.8);

  // Inner robe visible at the front opening
  createCylinder(scene, ROBE_INNER[0], ROBE_INNER[1], ROBE_INNER[2],
    paulX, 1.4, paulZ - 0.15, 2.6, 0.5);

  // Trailing hem pooling behind
  createSphere(scene, ROBE_OUTER[0], ROBE_OUTER[1], ROBE_OUTER[2],
    paulX, 0.15, paulZ + 0.8,
    1.8, 0.2, 2.5, 0.6);

  // Robe hem spread at the base
  createSphere(scene, ROBE_OUTER[0] * 1.1, ROBE_OUTER[1] * 1.1, ROBE_OUTER[2] * 1.1,
    paulX, 0.2, paulZ,
    2.2, 0.25, 2.0, 0.5);

  // Belt
  createCylinder(scene, SILHOUETTE_MID[0], SILHOUETTE_MID[1], SILHOUETTE_MID[2],
    paulX, 1.8, paulZ, 0.15, 0.75);

  // Crysknife hilt at the belt — a small vertical box
  createBox(scene, WEAPON_METAL[0], WEAPON_METAL[1], WEAPON_METAL[2],
    paulX + 0.6, 1.8, paulZ - 0.2,
    0.1, 0.4, 0.1);

  // Shoulders
  createBox(scene, ROBE_OUTER[0], ROBE_OUTER[1], ROBE_OUTER[2],
    paulX, 2.7, paulZ,
    1.6, 0.3, 0.8);

  // Hood — a half-sphere casting shadow over the face
  createSphere(scene, ROBE_OUTER[0] * 0.8, ROBE_OUTER[1] * 0.8, ROBE_OUTER[2] * 0.8,
    paulX, 3.4, paulZ + 0.1,
    0.9, 1.0, 1.0);

  // Face in hood shadow — very dark, barely visible
  createSphere(scene, 0.03, 0.025, 0.02,
    paulX, 3.3, paulZ - 0.3,
    0.5, 0.6, 0.4);

  // Head beneath hood
  createSphere(scene, SILHOUETTE_DARK[0], SILHOUETTE_DARK[1], SILHOUETTE_DARK[2],
    paulX, 3.35, paulZ,
    0.65, 0.75, 0.65);

  // Arms held at sides beneath the cloak — subtle bulges
  [-0.65, 0.65].forEach(armX => {
    createCylinder(scene, ROBE_OUTER[0] * 0.9, ROBE_OUTER[1] * 0.9, ROBE_OUTER[2] * 0.9,
      paulX + armX, 1.8, paulZ,
      2.0, 0.25);
  });
};

/**
 * Builds a single Fedaykin death commando escort at the given side.
 * Each guard has: stillsuit body armor with segmented plating, a
 * face-masked helmet with breathing apparatus, a long spear, and a
 * maula pistol holstered at the hip.
 */
const buildFedaykin = (scene: Scene, sideSign: number) => {
  const guardX = sideSign * GUARD_OFFSET_X;
  const guardZ = FOREGROUND_Z - GUARD_FORWARD_Z;

  // Legs — slightly spread combat stance
  [-0.18, 0.18].forEach(legOffset => {
    createCylinder(scene, SILHOUETTE_DARK[0], SILHOUETTE_DARK[1], SILHOUETTE_DARK[2],
      guardX + legOffset, 0.55, guardZ,
      1.1, 0.2);
  });

  // Boots
  [-0.18, 0.18].forEach(footOffset => {
    createBox(scene, SILHOUETTE_DARK[0], SILHOUETTE_DARK[1], SILHOUETTE_DARK[2],
      guardX + footOffset, 0.15, guardZ,
      0.25, 0.3, 0.4);
  });

  // Stillsuit torso — segmented armor
  createCylinder(scene, SILHOUETTE_MID[0], SILHOUETTE_MID[1], SILHOUETTE_MID[2],
    guardX, 1.5, guardZ, 1.5, 0.55);

  // Armor chest plate segments — 3 horizontal bands
  [1.15, 1.5, 1.85].forEach(segY => {
    createBox(scene, SARDAUKAR_ARMOR[0] * 0.7, SARDAUKAR_ARMOR[1] * 0.7, SARDAUKAR_ARMOR[2] * 0.7,
      guardX, segY, guardZ - 0.08,
      0.9, 0.2, 0.4);
  });

  // Shoulder pauldrons — asymmetric, the outer one is larger
  createSphere(scene, SILHOUETTE_MID[0] * 1.2, SILHOUETTE_MID[1] * 1.2, SILHOUETTE_MID[2] * 1.2,
    guardX - sideSign * 0.4, 2.1, guardZ,
    0.4, 0.3, 0.35);
  createSphere(scene, SILHOUETTE_MID[0] * 1.1, SILHOUETTE_MID[1] * 1.1, SILHOUETTE_MID[2] * 1.1,
    guardX + sideSign * 0.4, 2.15, guardZ,
    0.35, 0.28, 0.3);

  // Neck / face-masked helmet
  createCylinder(scene, SILHOUETTE_DARK[0], SILHOUETTE_DARK[1], SILHOUETTE_DARK[2],
    guardX, 2.35, guardZ, 0.2, 0.22);

  // Helmet
  createSphere(scene, SILHOUETTE_MID[0] * 1.3, SILHOUETTE_MID[1] * 1.3, SILHOUETTE_MID[2] * 1.3,
    guardX, 2.6, guardZ,
    0.6, 0.7, 0.6);

  // Face mask / breathing apparatus — darker strip across face
  createBox(scene, 0.03, 0.025, 0.02,
    guardX, 2.5, guardZ - 0.25,
    0.45, 0.15, 0.1);

  // Breathing tube — thin cylinder from mask downward
  createCylinder(scene, SILHOUETTE_DARK[0], SILHOUETTE_DARK[1], SILHOUETTE_DARK[2],
    guardX + sideSign * 0.15, 2.2, guardZ - 0.2,
    0.5, 0.03);

  // Belt with equipment
  createCylinder(scene, SILHOUETTE_MID[0], SILHOUETTE_MID[1], SILHOUETTE_MID[2],
    guardX, 1.0, guardZ, 0.12, 0.58);

  // Maula pistol holster — small box at the hip
  createBox(scene, WEAPON_METAL[0] * 0.8, WEAPON_METAL[1] * 0.8, WEAPON_METAL[2] * 0.8,
    guardX + sideSign * 0.5, 1.0, guardZ - 0.15,
    0.15, 0.25, 0.3);

  // Long spear — held angled slightly forward
  const spearX = guardX + sideSign * 0.55;
  createCylinder(scene, WEAPON_METAL[0], WEAPON_METAL[1], WEAPON_METAL[2],
    spearX, 2.5, guardZ + 0.1,
    5.5, 0.05);

  // Spear blade tip
  createBox(scene, WEAPON_METAL[0] * 1.2, WEAPON_METAL[1] * 1.2, WEAPON_METAL[2] * 1.1,
    spearX, 5.3, guardZ + 0.1,
    0.06, 0.4, 0.15);

  // Arms — one gripping the spear, one at the side
  // Spear arm
  createCylinder(scene, SILHOUETTE_DARK[0], SILHOUETTE_DARK[1], SILHOUETTE_DARK[2],
    spearX - sideSign * 0.15, 1.9, guardZ,
    1.4, 0.15);
  // Off arm
  createCylinder(scene, SILHOUETTE_DARK[0], SILHOUETTE_DARK[1], SILHOUETTE_DARK[2],
    guardX - sideSign * 0.35, 1.6, guardZ,
    1.5, 0.14);
};

/**
 * Adds elongated silhouette reflections on the polished floor beneath
 * each of the three foreground figures — "Their reflections stretch
 * long and clear beneath them, creating a symmetrical duality between
 * the material world and its ethereal duplicate."
 */
const addFigureReflections = (scene: Scene) => {
  // Paul's reflection — longest, stretching forward toward the throne
  createSphere(scene, SILHOUETTE_DARK[0] * 0.5, SILHOUETTE_DARK[1] * 0.5, SILHOUETTE_DARK[2] * 0.5,
    0, 0.02, FOREGROUND_Z + 4,
    1.0, 0.04, 10, 0.06);

  // Left guard reflection
  createSphere(scene, SILHOUETTE_DARK[0] * 0.4, SILHOUETTE_DARK[1] * 0.4, SILHOUETTE_DARK[2] * 0.4,
    -GUARD_OFFSET_X, 0.02, FOREGROUND_Z - GUARD_FORWARD_Z + 3.5,
    0.8, 0.04, 8, 0.05);

  // Right guard reflection
  createSphere(scene, SILHOUETTE_DARK[0] * 0.4, SILHOUETTE_DARK[1] * 0.4, SILHOUETTE_DARK[2] * 0.4,
    GUARD_OFFSET_X, 0.02, FOREGROUND_Z - GUARD_FORWARD_Z + 3.5,
    0.8, 0.04, 8, 0.05);
};

/**
 * Adds dark shadow pools cast behind each foreground figure — thrown by
 * the distant divine light beams ahead of them. The shadows stretch
 * backward (toward the entrance) since the light source is ahead.
 */
const addFigureShadows = (scene: Scene) => {
  // Paul's shadow — widest, stretching back behind the robe
  createSphere(scene, 0.02, 0.015, 0.02,
    0, 0.02, FOREGROUND_Z - 4,
    2.0, 0.05, 8, 0.10);

  // Guard shadows
  [-GUARD_OFFSET_X, GUARD_OFFSET_X].forEach(guardX => {
    createSphere(scene, 0.02, 0.015, 0.02,
      guardX, 0.02, FOREGROUND_Z - GUARD_FORWARD_Z - 3.5,
      1.5, 0.05, 7, 0.08);
  });
};

// ── Public API ─────────────────────────────────────────────────────────────

/**
 * Adds the three foreground silhouettes — Paul and two Fedaykin escorts —
 * with their floor reflections and cast shadows.
 * @param scene - The Babylon scene to populate.
 */
export const addForegroundFigures = (scene: Scene) => {
  buildPaul(scene);
  buildFedaykin(scene, -1);
  buildFedaykin(scene, 1);
  addFigureReflections(scene);
  addFigureShadows(scene);
};
