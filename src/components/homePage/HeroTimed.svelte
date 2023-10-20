<script>
  import { onMount, onDestroy } from 'svelte';
  import ButtonAnchor from '../ButtonAnchor.svelte';
  export let slides;
  let totalDots;
  let currentSlideIndex = 0;

  import {
    formatHTMLContent,
    extractSlideDescriptionAndLink,
  } from "@utils/helperFunctions";

  $: totalDots = Array((slides ? slides.length : 0)).fill(0);

let intervalId;

onMount(() => {
    intervalId = setInterval(() => {
        if (slides && slides.length > 0) {
        currentSlideIndex = (currentSlideIndex + 1) % slides.length;
    }
    }, 10000);
});

onDestroy(() => {
    clearInterval(intervalId);
});
  function handleDotClick(index) {
    if (!isNaN(index)) {
      currentSlideIndex = index;
    }
  }

</script>

{#if slides && slides.length > 0}
   <section class="hero-section">
    {#each slides as slide, index}

    <div data-index={index} class="slide {index === currentSlideIndex ? 'active' : ''}">
      {#if index === 0}
        <img src={slide.image.url} class="hidden" alt={slide.image.alt} loading='eager'/>
      {:else}
        <img src={slide.image.url} class="hidden" alt={slide.image.alt} loading='lazy' />
      {/if}
      
      <div class="hero-info-container">
        <div class="hero-info-flex">
          <h2>{formatHTMLContent(slide.title.rendered)}</h2>
          <p>{formatHTMLContent(extractSlideDescriptionAndLink(slide.content.rendered).description)}</p>
          {#if extractSlideDescriptionAndLink(slide.content.rendered).link}
            <ButtonAnchor slug={extractSlideDescriptionAndLink(slide.content.rendered).link} text={`veure més`} />
          {/if}

        </div>
      </div>
    </div>
    {#if totalDots && totalDots.length > 1}
    <div class="carousel-dots">
      {#each totalDots as _, index}
       <button class="carousel-dot {index === currentSlideIndex ? 'active-dot' : ''}" on:click={() => handleDotClick(index)} />
      {/each}
    </div>
  {/if}

    {/each}
    
     
    </section>
{/if}

<style>
    h2 {
    font-size: 2.75rem;
    line-height: 3.25rem;
  }
  .hero-section {
    position: relative;
  }
  .slide {
    display: none;
    height: 100%;
  }

  .slide.active {
    display: block;
  }

  .carousel-dots {
    position: absolute;
    bottom: 2.5rem;
    left: 18.5rem;
    transform: translateX(-50%);
    width: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
  }

  .carousel-dot {
    width: 0.6875rem;
    height: 0.6875rem;
    border-radius: 50%;
    border: 1px solid var(--clr-accent);
    /* background-color: var(--color-white);
    cursor: pointer; */
  }

  .active-dot {
    background-color: var(--clr-accent);
  }
  section {
    position: relative;
    margin-top: calc(
      (var(--bottom-header-hg) + var(--header-separator-line-hg)) * -1
    );
    height: calc(100dvh - var(--top-header-hg));
    overflow: hidden;
  }

  img {
    height: inherit;
    width: 100%;
    object-fit: cover;
  }

  .hero-info-container {
    position: absolute;
    background-color: rgba(0, 0, 0, 0.65);
    top: calc(var(--bottom-header-hg) + var(--header-separator-line-hg));
    left: 0;
    width: 37rem;
    bottom: 0rem;
    display: flex;
    padding-inline: var(--padding-inline);
    /* justify-content: center; */
    align-items: center;
  }

  .hero-info-flex {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    gap: 1.5rem;
    text-wrap: balance;
  }

  @media (width < 1184px) {
    .hero-info-container {
      width: 50%;
    }

    .carousel-dots {
      left: 25%;
      transform: translateX(-50%);
    }
  }

  @media (width < 1025px) {
    .hero-info-container {
      padding-inline: var(--padding-inline-tablet);
    }

    h2 {
      font-size: 2.5rem;
      line-height: 2.8125rem;
    }
  }

  @media (width < 648px) {
    .hero-info-container {
      padding-inline: var(--padding-inline-mobile);
      width: 100%;
    }
    .carousel-dots {
      left: var(--padding-inline-mobile);
      transform: none;
    }
    section {
      height: 100svh;
    }
  }
</style>