<script lang="ts">
  import {removeOpacity} from "../../svelte-actions/intersectionObserver";
  import { sliderLeftArrowWhite, sliderRightArrowWhite } from "@assets/icons";
  export let projects;

  let carousel: HTMLDivElement;
  let scrollPosition: number;
  const PROJECTIMAGEWIDTH = 331;
  let scrollAmount: number = PROJECTIMAGEWIDTH;

  function updateXScrollPosition() {
    scrollPosition = carousel.scrollLeft;
  }

  function goBack() {
    if (scrollPosition === 0) return;
    scrollPosition = carousel.scrollLeft;
    carousel.scrollLeft = scrollPosition - scrollAmount;
  }

  function goForward() {
    if (scrollPosition === carousel.scrollWidth - carousel.clientWidth) return;
    scrollPosition = carousel.scrollLeft;
    carousel.scrollLeft = scrollPosition + scrollAmount;
  }
</script>

<div class="projects-container-mobile" bind:this={carousel} on:scroll={updateXScrollPosition}>
  {#each projects as project}
    <a use:removeOpacity class='opacity'href={project.link}>
      <img class="image" src={project.image} alt={project.alt} />
    </a>
  {/each}
</div>

<div class="arrows-container">
  <button on:click={goBack}>
    {@html sliderLeftArrowWhite}
  </button>
  <button on:click={goForward}>
    {@html sliderRightArrowWhite}
  </button>
</div>

<style>
  .projects-container-mobile {
    margin-left: var(--padding-inline-mobile);
    /* padding-inline: 0rem; */
    /* padding-block: 0rem; */
    display: flex;
    overflow-x: scroll;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
    gap: var(--padding-inline-mobile);
    padding-block: 2rem;
  }

  .projects-container-mobile a {
    /* width: 5.6875rem; */
    /* height: 11.0625rem; */
    flex-shrink: 0;
    /* display: flex; */
    /* gap: 1rem; */
    /* height: 100%; */
    /* flex-basis: auto; */
  }
  .image {
    width: 18.6875rem;
    height: 11.0625rem;
    object-fit: contain;
    scroll-snap-align: start;
  }

  .projects-container-mobile a:last-child {
    padding-right: var(--padding-inline-mobile);
  }

  .arrows-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-inline: var(--padding-inline-mobile);
    padding-bottom: 2rem;
  }
</style>
