<script lang="ts">
  import { onMount } from 'svelte';
  import { Engine, Scene, FreeCamera, Vector3, Color4 } from '@babylonjs/core';
  import { buildCherryBlossom } from '$lib/cherry-blossom';

  let canvas: HTMLCanvasElement;

  const setupCamera = (scene: Scene) => {
    const camera = new FreeCamera('camera', new Vector3(0, 2, -3), scene);
    camera.setTarget(new Vector3(0, 3, 22));
    camera.attachControl(canvas, true);
    camera.speed = 5;
    camera.inertia = 0;
    camera.angularSensibility = 800;
    camera.minZ = 0.1;
    camera.keysUp       = [87];
    camera.keysDown     = [83];
    camera.keysLeft     = [65];
    camera.keysRight    = [68];
    camera.keysUpward   = [69];
    camera.keysDownward = [81];

    canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      camera.speed = Math.max(0.1, camera.speed + (e.deltaY < 0 ? 2 : -2));
    }, { passive: false });
  };

  let error = $state('');

  onMount(() => {
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) {
      error = 'WebGL is not supported in this browser. Please enable hardware acceleration or use a supported browser.';
      return;
    }

    const engine = new Engine(canvas, true, { preserveDrawingBuffer: true });
    const scene = new Scene(engine);
    scene.clearColor = new Color4(0, 0, 0, 1);
    setupCamera(scene);
    buildCherryBlossom(scene);
    engine.runRenderLoop(() => scene.render());
    window.addEventListener('resize', () => engine.resize());
    canvas.addEventListener('click', () => canvas.requestPointerLock());
  });
</script>

{#if error}
  <div class="error">{error}</div>
{/if}
<canvas
  bind:this={canvas}
  style="width:100vw;height:100vh;touch-action:none;outline:none"
  style:display={error ? 'none' : 'block'}
></canvas>
