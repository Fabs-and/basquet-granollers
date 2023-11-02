<script lang="ts">
  import { removeOpacity } from "../svelte/intersectionObserver";
  import NewsItem from "./homePage/news/NewsItem.svelte";
  import ProjectItem from "./homePage/projects/ProjectItem.svelte";
  import MembershipItem from "./homePage/join/MembershipItem.svelte";
  import SponsorshipItem from "./homePage/join/SponsorshipItem.svelte";
  import ButtonAnchor from "@components/ButtonAnchor.svelte";

  import {
    sliderLeftArrow,
    sliderRightArrow,
    sliderLeftArrowWhite,
    sliderRightArrowWhite,
  } from "@assets/icons";
  import { toggleDialog } from "@utils/helperFunctions";

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
      : childComponent === "SponsorshipItem"
      ? SponsorshipItem
      : ProjectItem;

  const buttonText = childComponent === "NewsItem" ? "veure totes" : "contacta";

  const textColor = childComponent === "NewsItem" && "var(--clr-accent)";

  const arrowsColor = childComponent !== "NewsItem" && "white";

  const forProjects = childComponent === "ProjectItem";

  const isSliderItem = childComponent === "NewsItem";
  const slug = childComponent === "NewsItem" ? "/noticies" : "";

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
  {#each sliderItems as sliderItem, i (sliderItem.date)}
    <div use:removeOpacity={i} class:g-opacity={i > 0}>
      <svelte:component this={component} item={sliderItem} {isSliderItem} />
    </div>
  {/each}
</div>

<div class="slider-controls-container">
  {#if component === NewsItem}
    <ButtonAnchor
      text={buttonText}
      {slug}
      {textColor}
      hoverTextColor={"var(--clr-contrast)"}
      hidden={childComponent === "ProjectItem"}
    />
  {:else if component === MembershipItem || component === SponsorshipItem}
    <button on:click={toggleDialog} class="g-button-anchor">
      {buttonText.toUpperCase()}
    </button>
  {/if}
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
    padding-right: var(--pd-x-small);
  }

  .slider-controls-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 2rem;
    padding-right: var(--pd-x);
  }

  .arrows-container {
    display: flex;
    gap: 0.6rem;
  }

  .forProjects {
    width: 100%;
    justify-content: space-between;
  }

  @media (width < 1025px) {
    .slider-controls-container {
      padding-right: var(--pd-x-medium);
    }
  }

  @media (width < 648px) {
    .slider-controls-container {
      padding-right: var(--pd-x-small);
    }
  }
</style>
