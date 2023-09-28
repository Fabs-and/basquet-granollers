<script>
  export let item = { title: { rendered: "" }, slug: "", date: "", image: "" };
</script>

<article class="slider-item">
  <a href={item.link}>
    <img class="image" src={item.image} alt={item.alt} />
  </a>
</article>

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
