<script lang="ts">
  import { removeOpacity } from "../svelte-actions/intersectionObserver";
  import type { Post } from "fetch-wordpress-api";
  import IndividualNews from "./postCards/IndividualNews.svelte";
  import ButtonAnchor from "@components/ButtonAnchor.svelte";
  import { sliderLeftArrow, sliderRightArrow } from "@assets/icons";
  export let posts: Post[];
  export let childComponent;
  export let gap: string = "1rem";
  let component = childComponent === "individualNews" ? IndividualNews : null;
  let carousel: HTMLDivElement;
  let scrollPosition: number;
  export let itemWidth = 0;
  let scrollAmount: number = itemWidth;
  console.log('scrollAmount', scrollAmount)
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

<div
  class="slider-container"
  style="--gap: {gap}"
  bind:this={carousel}
  on:scroll={updateXScrollPosition}
>
  {#each posts as post (post.id)}
    <div use:removeOpacity class="g-opacity">
      <svelte:component this={component} {post} />
    </div>
  {/each}
</div>


  <div class="slider-controls-container">
    <ButtonAnchor
      text={"veure totes"}
      textColor={"var(--clr-accent)"}
      hoverTextColor={"var(--clr-contrast)"}
    />
    <div class="arrows-container">
      <button on:click={goBack}>
        {@html sliderLeftArrow}
      </button>
      <button on:click={goForward}>
        {@html sliderRightArrow}
      </button>
    </div>
  </div>


<style>
  .slider-container {
    display: flex;
    gap: var(--gap);
    overflow-x: scroll;
    scroll-behavior: smooth;
    scroll-snap-type: x mandatory;
  }

  .slider-controls-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 2rem;
    padding-right: var(--padding-inline-tablet);
  }

  .arrows-container {
    display: flex;
    gap: 1rem;
  }
</style>
