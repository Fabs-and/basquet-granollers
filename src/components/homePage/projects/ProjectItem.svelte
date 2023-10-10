<script>
  export let item = {
    title: { rendered: "" },
    slug: "",
    date: "",
    image: { url: "", title: "", alt: "" },
  };
</script>

{#if item.image}
  <article class="slider-item">
    <a href={item.slug}>
      <img class="image" src={item.image.url} alt={item.image.alt} />
    </a>
  </article>
{/if}

<style>
  .slider-item {
    width: 18.6875rem;
    height: 11.0625rem;
    flex-shrink: 0;
    scroll-snap-align: start;
  }

  a {
    display: block;
    height: 100%;
  }

  .image {
    height: 100%;
    object-fit: contain;
    margin: auto;
  }
</style>
