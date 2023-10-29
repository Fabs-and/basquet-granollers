<script>
  import { dateConverter } from "@utils/helperFunctions";
  import { slide } from 'svelte/transition';
  export let noticies;
  import {formatHTMLContent} from '@utils/helperFunctions';
  let index = 9;  // Start index at 9 since initial slice is 0 to 9
  let displayedNews = noticies && noticies.length ? noticies.slice(0, 9) : [];

  $: showButton = displayedNews.length < noticies.length;

  function loadNineMore() {
    displayedNews = noticies.slice(0, index + 9);
    index += 9;
  }
</script>

<div class="allNews-container">
  {#each displayedNews as noticia, i (noticia.date)}
    <article class="noticia" in:slide={{ duration: 300, y: 100 }}>
      <a href={`/noticies/${noticia.slug}`}>
        <div class="image-container">
          {#if noticia.image}
          {#if i < 3}
             <img
              src={noticia.image.url ? noticia.image.url : '/default-pic.avif'}
              alt={noticia.image.alt ? noticia.image.alt : noticia.title.rendered}
              loading='eager'
            />
          {:else}
            <img
              src={noticia.image.url ? noticia.image.url : '/default-pic.avif'}
              alt={noticia.image.alt ? noticia.image.alt : noticia.title.rendered}
              loading='lazy'
            />
            {/if}
          {/if}
        </div>
        <div class="info-container">
          <h4>
            {@html formatHTMLContent(noticia.title.rendered)}
          </h4>
          <p>Publicat {dateConverter(noticia.date)}</p>
        </div>
      </a>
    </article>
  {/each}
</div>
{#if showButton}
  <button class='button-anchor' on:click={loadNineMore}>VEURE MÉS</button>
{/if}

<style>
   h4  { 
    font-weight: 500;
  }

  .button-anchor {
    margin-top: var(--padding-section-big);
    margin-inline: auto;
    color: var(--clr-accent);
  }
   .button-anchor:hover {
    color: var(--clr-contrast);
  }
  .allNews-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
    /* padding-inline: var(--padding-inline); */
  }
  
  p {
    position: absolute;
    bottom: 0;
    background-color: var(--clr-secondary);
    padding-bottom: 0.5rem;
    font-style: italic;
    width: 100%;
    z-index: 2;
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
  }

  .image-container {
    background-color: white;
    z-index: 0;
  }

  .noticia {
    height: 21.87rem;
    width: 24.25rem;
    flex-shrink: 0;
    border-top-left-radius: 2.9375rem;
    overflow: hidden;
  }

  .noticia .image-container {
    height: 67%;
  }

  .noticia .info-container {
    height: 33%;
  }

  @media (width < 1025px) {
    .noticia {
      width: 21.625rem;
      height: 20.93rem;
    }

    .button-anchor {
      margin-top: var(--padding-section-medium);
    }
  }

  @media (width < 648px) {
  
     .button-anchor {
      margin-top: var(--padding-section-small);
    }
      .noticia {
      width: 20.4375rem;
    }
  }

  @media (width < 375px) {
    .noticia {
      width: 100%;
    }
  }
</style>