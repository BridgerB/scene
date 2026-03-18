<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<style>html, body { margin: 0; padding: 0; overflow: hidden; background: #000; }</style>
</svelte:head>

{@render children()}
