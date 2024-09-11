<script>
  import ButtonAnchor from "@components/ButtonAnchor.svelte";
  export let slides;
  let totalDots;

  $: totalDots = Array(slides ? slides.length : 0).fill(0);

  let startX;

  function handleTouchStart(event) {
    startX = event.touches[0].clientX;
  }

  function handleTouchEnd(event) {
    const endX = event.changedTouches[0].clientX;
    if (startX - endX > 50) {
      nextSlide(); // swiped left
    } else if (endX - startX > 50) {
      prevSlide(); // swiped right
    }
  }

  let transitionDirection = "";
  let currentSlideIndex = 0;
  let prevSlideIndex = 0;

  function prevSlide() {
    transitionDirection = "prev";
    prevSlideIndex = currentSlideIndex;
    currentSlideIndex =
      currentSlideIndex === 0 ? slides.length - 1 : currentSlideIndex - 1;
  }

  function nextSlide() {
    transitionDirection = "next";
    prevSlideIndex = currentSlideIndex;
    currentSlideIndex =
      currentSlideIndex === slides.length - 1 ? 0 : currentSlideIndex + 1;
  }

  function handleDotClick(index) {
    if (!isNaN(index)) {
      currentSlideIndex = index;
    }
  }
</script>

{#if slides && slides.length > 0}
  <section
    class="hero-section"
    on:touchstart={handleTouchStart}
    on:touchend={handleTouchEnd}
  >
    {#each slides as slide, index}
      <div
        data-index={index}
        class="slide {index === 0 ? 'active' : ''}"
        class:active={index === currentSlideIndex}
        class:outgoing={index === prevSlideIndex && index !== currentSlideIndex}
        class:transition-next={transitionDirection === "next"}
        class:transition-prev={transitionDirection === "prev"}
      >
        {#if slide.video !== null}
          <video
            src={slide.video}
            class="hidden"
            loading={index === 0 ? "eager" : "lazy"}
            muted
            loop
            playsinline
            autoplay
          ></video>
        {:else}
          <img src={slide.image} class="hidden" loading="eager" />
        {/if}

        <div class="hero-info-container">
          <div class="hero-info-flex">
            <h2>{slide.title}</h2>
            <p>
              {slide.description}
            </p>
            {#if slide.link}
              <ButtonAnchor slug={slide.link.trim()} text={`veure més`} />
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
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: none;
  }

  .slide.active,
  .slide.outgoing {
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

  @keyframes slide-in-from-right {
    0% {
      transform: translateX(100%);
    }
    100% {
      transform: translateX(0);
    }
  }

  @keyframes slide-out-to-left {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-100%);
    }
  }

  @keyframes slide-in-from-left {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(0);
    }
  }

  @keyframes slide-out-to-right {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(100%);
    }
  }

  .slide.transition-next.active {
    animation: slide-in-from-right 0.5s forwards ease-in-out;
  }

  .slide.transition-next.outgoing {
    animation: slide-out-to-left 0.5s forwards ease-in-out;
  }

  .slide.transition-prev.active {
    animation: slide-in-from-left 0.5s forwards ease-in-out;
  }

  .slide.transition-prev.outgoing {
    animation: slide-out-to-right 0.5s forwards ease-in-out;
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
      height: 101svh;
    }
  }
</style>
