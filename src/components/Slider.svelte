<script lang="ts">
  import { removeOpacity } from "../svelte-actions/intersectionObserver";
  import NewsItem from "./homePage/news/NewsItem.svelte";
  import ProjectItem from "./homePage/projects/ProjectItem.svelte";
  import MembershipItem from "./homePage/memberships/MembershipItem.svelte";
  import ButtonAnchor from "@components/ButtonAnchor.svelte";
  import {
    sliderLeftArrow,
    sliderRightArrow,
    sliderLeftArrowWhite,
    sliderRightArrowWhite,
  } from "@assets/icons";

  //Props
  export let sliderItems: any;
  export let childComponent: string;
  export let gap: string = "1rem";
  export let itemWidth = 0;

  const component =
    childComponent === "NewsItem"
      ? NewsItem
      : childComponent === "MembershipItem"
      ? MembershipItem
      : ProjectItem;

  const buttonText = childComponent === "NewsItem" ? "veure totes" : "contacta";

  const textColor = childComponent === "NewsItem" && "var(--clr-accent)";

  const arrowsColor = childComponent !== "NewsItem" && "white";

  const forProjects = childComponent === "ProjectItem";

  const isSliderItem = childComponent === "NewsItem";
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
      <svelte:component this={component} item={sliderItem} {isSliderItem}/>
    </div>
  {/each}
</div>

<div class="slider-controls-container">
  <ButtonAnchor
    text={buttonText}
    {textColor}
    hoverTextColor={"var(--clr-contrast)"}
    hidden={childComponent === "ProjectItem"}
  />
  <div class="arrows-container" class:forProjects>
    <button on:click={goBack}>
      {#if arrowsColor === "white"}
        {@html sliderLeftArrowWhite}
      {:else}
        {@html sliderLeftArrow}
      {/if}
    </button>
    <button on:click={goForward}>
      {#if arrowsColor === "white"}
        {@html sliderRightArrowWhite}
      {:else}
        {@html sliderRightArrow}
      {/if}
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
    padding-right: var(--padding-inline-tablet);
  }

  .arrows-container {
    display: flex;
    gap: 0.6rem;
  }
  
  .forProjects {
    width: 100%;
    justify-content: space-between;
  }

  @media (width < 648px) {
    .slider-controls-container {
      padding-right: var(--padding-inline-mobile);
    }
  }
</style>
