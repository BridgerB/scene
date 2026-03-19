<script lang="ts">
  const scenes = [
    { href: '/egypt', label: 'Ancient Egypt', description: 'Pyramids, Sphinx, desert sun' },
    { href: '/cherry-blossom', label: 'Cherry Blossom Garden', description: 'Torii gates, pagoda, sakura trees' },
    { href: '/dune', label: 'Dune: Imperial Throne Room', description: 'Colossal pillars, soldiers, teal throne' },
  ];
</script>

<main>
  <h1>Immersive Scenes</h1>
  <nav>
    {#each scenes as { href, label, description }}
      <a {href}>
        <span class="label">{label}</span>
        <span class="desc">{description}</span>
      </a>
    {/each}
  </nav>
</main>

<style>
  main {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #0a0a0a;
    color: #fff;
    font-family: system-ui, sans-serif;
    gap: 2rem;
  }

  h1 {
    font-size: 2rem;
    font-weight: 300;
    letter-spacing: 0.1em;
    margin: 0;
    opacity: 0.9;
  }

  nav {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
    max-width: 420px;
    padding: 0 1.5rem;
  }

  a {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding: 1.25rem 1.5rem;
    border: 1px solid #333;
    border-radius: 8px;
    text-decoration: none;
    color: inherit;
    transition: border-color 0.15s, background 0.15s;
  }

  a:hover {
    border-color: #666;
    background: #111;
  }

  .label {
    font-size: 1.1rem;
    font-weight: 500;
  }

  .desc {
    font-size: 0.85rem;
    opacity: 0.5;
  }
</style>
