import * as fflate from 'fflate';
import { NullEngine, Scene, Tools } from '@babylonjs/core';
import { USDZExportAsync } from '@babylonjs/serializers/USDZ/index.js';
import { writeFileSync } from 'fs';
import { buildEgypt } from '../src/lib/egypt.ts';

(globalThis as any).fflate = fflate;
(Tools as any).LoadScriptAsync = () => Promise.resolve();

const exportScene = async (name: string, builder: (scene: Scene) => void) => {
  const engine = new NullEngine();
  const scene = new Scene(engine);
  builder(scene);
  const data = await USDZExportAsync(scene, {});
  writeFileSync(`./static/${name}.usdz`, data);
  engine.dispose();
  console.log(`✓ static/${name}.usdz`);
};

await exportScene('egypt', buildEgypt);
