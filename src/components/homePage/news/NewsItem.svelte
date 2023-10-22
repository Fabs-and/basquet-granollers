<script>
  import {
    dateConverter,
    formatHTMLContent,
  } from "../../../utils/helperFunctions";

  export let item;
  export let isFeatured = false;
  export let isSliderItem = false;
  export let isDesktopNews = false;
  const {
    title: { rendered: title },
    slug,
    date,
    image,
  } = item;
</script>

<article class:isFeatured class:isSliderItem class:isDesktopNews>
  <a href={`/noticies/${slug}`}>
    <div class="image-container">
      {#if image && (image.url !== "")}
        <img src={image.url} alt={image.alt} />
      {:else}
        <img
          src="./default-pic.avif"
          alt="Imatge de recurs amb totes les seccions del Club Bàsquet Granollers"
        />
      {/if}
    </div>
    <div class="info-container">
      <h4>{@html formatHTMLContent(title)}</h4>
      <p class="g-date-style">{`Publicat ${dateConverter(date)}`}</p>
    </div>
  </a>
</article>

<style>
  p {
    position: absolute;
    bottom: 0;
    background-color: var(--clr-secondary);
    width: 100%;
    font-weight: 500;
    /* z-index: 2000; */
    /* padding-top: 0rem; */
  }
  a {
    display: block;
    height: 100%;
  }

  img {
    height: 100%;
    object-fit: cover;
    margin: auto;
  }

  .info-container {
    position: relative; /* so the z-index has effect  */
    padding-inline: 1rem;
    padding-block: 0.5rem;
    color: var(--clr-contrast);
    background-color: var(--clr-secondary);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .image-container {
    background-color: white;
    z-index: 0;
  }

  .isFeatured {
    height: 33.1875rem;
    width: 60%;
    border-top-left-radius: 2.9375rem;
    overflow: hidden;
    flex-shrink: 0;
  }
  .isFeatured p {
    padding-bottom: 0.5rem;
    padding-top: 0.1rem;
  }
  .isFeatured .image-container {
    height: 78%;
  }

  .isFeatured .image-container img {
    object-position: top;
    transition: transform 0.3s;
  }

  .isFeatured img:hover {
    transform: scale(1.1);
  }

  .isFeatured .info-container {
    height: 22%;
  }

  .isDesktopNews {
    height: 25%;
    overflow: hidden;
    flex-shrink: 0;
  }

  .isDesktopNews a {
    color: inherit;
    display: flex;
    gap: 1rem;
  }

  .isDesktopNews .info-container {
    background-color: var(--clr-contrast);
    color: var(--clr-primary);
    padding: 0rem;
    height: 7.375rem;
  }

  .isDesktopNews .image-container {
    width: 40%;
    height: 7.375rem;
    flex-shrink: 0;
  }

  .isDesktopNews img {
    width: 100%;
    object-position: top;
  }

  .isDesktopNews p {
    position: absolute;
    width: 100%;
    bottom: 0;
    z-index: 1;
    background-color: var(--clr-contrast);
  }

  a h4:hover {
    color: var(--clr-accent);
  }

  .isSliderItem {
    height: 18rem;
    width: var(--slider-item-width);
    flex-shrink: 0;
    border-top-left-radius: 2.9375rem;
    overflow: hidden;
    scroll-snap-align: start;
  }

  .isSliderItem .image-container {
    height: 60%;
  }

  .isSliderItem .info-container {
    height: 40%;
  }

  .isSliderItem p {
    font-weight: 400;
    padding-bottom: 0.5rem;
  }
</style>
