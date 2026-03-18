<script lang="ts">
  import { onMount } from 'svelte';
  import { Engine, Scene, FreeCamera, Vector3, Color4 } from '@babylonjs/core';
  import { buildEgypt } from '$lib/egypt';

  let canvas: HTMLCanvasElement;

  const setupCamera = (scene: Scene) => {
    const camera = new FreeCamera('camera', new Vector3(5, 2, -3), scene);
    camera.setTarget(new Vector3(10, 5, 65));
    camera.attachControl(canvas, true);
    camera.speed = 5;
    camera.minZ = 0.1;
    camera.keysUp       = [87];
    camera.keysDown     = [83];
    camera.keysLeft     = [65];
    camera.keysRight    = [68];
    camera.keysUpward   = [69];
    camera.keysDownward = [81];
  };

  onMount(() => {
    (async () => {
      const engine = new Engine(canvas, true, { preserveDrawingBuffer: true });
      const scene = new Scene(engine);
      scene.clearColor = new Color4(0, 0, 0, 1);
      setupCamera(scene);
      buildEgypt(scene);
      engine.runRenderLoop(() => scene.render());
      window.addEventListener('resize', () => engine.resize());
    })();
  });
</script>

<svelte:head>
  <link rel="spatial-backdrop" href="/egypt.usdz">
</svelte:head>

<canvas
  bind:this={canvas}
  style="width:100vw;height:100vh;display:block;touch-action:none;outline:none"
></canvas>
