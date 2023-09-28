<script lang="ts">
  import { removeOpacity } from "../svelte-actions/intersectionObserver";
  import type { Post } from "fetch-wordpress-api";
  import NewsItem from "./homePage/news/NewsItem.svelte";
  import ProjectItem from "./homePage/projects/ProjectItem.svelte";
  import MembershipItem from "./homePage/memberships/MembershipItem.svelte";
  import ButtonAnchor from "@components/ButtonAnchor.svelte";
  import { sliderLeftArrow, sliderRightArrow } from "@assets/icons";

  //Props
  export let sliderItems: any;
  export let childComponent;
  export let gap: string = "1rem";
  export let itemWidth = 0;

  console.log("childComponent", childComponent);
  let component =
    childComponent === "NewsItem"
      ? NewsItem
      : childComponent === "MembershipItem"
      ? MembershipItem
      : ProjectItem;
  let carousel: HTMLDivElement;
  let scrollPosition: number;
  let scrollAmount: number = itemWidth;

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
  {#each sliderItems as sliderItem (sliderItem.id)}
    <div use:removeOpacity class="g-opacity">
      <svelte:component this={component} item={sliderItem} />
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

  .slider-container > :last-child {
    padding-right: var(--padding-inline-mobile);
  }

  .slider-controls-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 2rem;
    padding-right: var(--padding-inline-mobile);
  }

  .arrows-container {
    display: flex;
    gap: 1rem;
  }
</style>
