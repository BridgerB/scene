<script lang="ts">
  import { onMount } from 'svelte';
  import { Engine, Scene, Vector3, Color4 } from '@babylonjs/core';
  import { setupCamera } from '$lib/camera';
  import { buildDune } from '$lib/dune/main';

  let canvas: HTMLCanvasElement;
  let error = $state('');

  onMount(() => {
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) {
      error = 'WebGL is not supported in this browser. Please enable hardware acceleration or use a supported browser.';
      return;
    }

    const engine = new Engine(canvas, true, { preserveDrawingBuffer: true });
    const scene = new Scene(engine);
    scene.clearColor = new Color4(0.02, 0.015, 0.03, 1);
    setupCamera(scene, canvas, new Vector3(0, 4, -5), new Vector3(0, 8, 270));
    buildDune(scene);
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
