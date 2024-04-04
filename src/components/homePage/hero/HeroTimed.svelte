<script>
  import ButtonAnchor from "@components/ButtonAnchor.svelte";
  import { onMount, onDestroy } from "svelte";
  
  export let slides = [];
  
  let totalDots;
  let currentSlideIndex = 0;

  $: totalDots = Array(slides ? slides.length : 0).fill(0);

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
      <div
        data-index={index}
        class="slide {index === currentSlideIndex ? 'active' : ''}"
      >
        {#if slide.video !== null}
          <video
            src={slide.video}
            class="hidden"
            loading={index === 0 ? "eager" : "lazy"}
            autoplay
            muted
            loop
            playsinline
          ></video>
        {:else}
          <img
            src={slide.image}
            class="hidden"
            loading={index === 0 ? "eager" : "lazy"}
            alt={`Imatge de la diapositiva ${index + 1}: ${slide.title}`}
          />
        {/if}
        <div class="hero-info-container">
          <div class="hero-info-flex">
            <h2>{slide.title}</h2>
            <p>
              {slide.description}
            </p>
            {#if slide.link}
              <ButtonAnchor slug={slide.link} text={`veure més`} />
            {/if}
          </div>
        </div>
      </div>
      {#if totalDots && totalDots.length > 1}
        <div class="carousel-dots">
          {#each totalDots as _, index}
            <button
              class="carousel-dot {index === currentSlideIndex
                ? 'active-dot'
                : ''}"
              on:click={() => handleDotClick(index)}
            />
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
  }

  .active-dot {
    background-color: var(--clr-accent);
  }
  section {
    position: relative;
    margin-top: calc(
      (var(--hg-header-bottom-section) + var(--hg-sponsors-all)) * -1
    );
    height: calc(100dvh - var(--hg-header-top-section));
    overflow: hidden;
  }

  img,
  video {
    height: inherit;
    width: 100%;
    object-fit: cover;
  }

  .hero-info-container {
    position: absolute;
    background-color: rgba(0, 0, 0, 0.65);
    top: calc(var(--hg-header-bottom-section) + var(--hg-sponsors-all));
    left: 0;
    width: 37rem;
    bottom: 0rem;
    display: flex;
    padding-inline: var(--pd-x);
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

  @media (max-width: 1184px) {
    .hero-info-container {
      width: 50%;
    }

    .carousel-dots {
      left: 25%;
      transform: translateX(-50%);
    }
  }

  @media (max-width: 1025px) {
    .hero-info-container {
      padding-inline: var(--pd-x-medium);
    }

    h2 {
      font-size: 2.5rem;
      line-height: 2.8125rem;
    }
  }

  @media (max-width: 648px) {
    .hero-info-container {
      padding-inline: var(--pd-x-small);
      width: 100%;
    }
    .carousel-dots {
      left: var(--pd-x-small);
      transform: none;
    }
    section {
      height: 100svh;
    }
  }
</style>
