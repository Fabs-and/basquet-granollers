<script lang="ts">
  import { removeOpacity } from "../../svelte-actions/intersectionObserver";
  import type { Post } from "fetch-wordpress-api";
  import IndividualNews from "./IndividualNews.svelte";
  import ButtonAnchor from "@components/ButtonAnchor.svelte";
  import { sliderLeftArrow, sliderRightArrow } from "@assets/icons";
  export let posts: Post[];
  export let title: string;

  let carousel: HTMLDivElement;
  let scrollPosition: number;
  const INDIVIDUALNEWSWIDTH = 312;
  let scrollAmount: number = INDIVIDUALNEWSWIDTH;

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

<section class="responsive-news">
  <h2>{title}</h2>
  <div
    class="responsive-news-container"
    bind:this={carousel}
    on:scroll={updateXScrollPosition}
  >
    {#each posts as post (post.id)}
      <div use:removeOpacity class="opacity">
        <IndividualNews {post} isResponsive={true} />
      </div>
    {/each}
  </div>
  <div class="controls-container">
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
</section>

<style>
  .opacity {
    opacity: 0.5;
    transition: opacity 0.3s;
  }
  .responsive-news {
    width: 99.9vw;
    background-color: var(--clr-contrast);
    color: var(--clr-primary);
    padding-left: var(--padding-inline-tablet);
    padding-block: 2rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
  .responsive-news-container {
    display: flex;
    gap: 1rem;
    overflow-x: scroll;
    scroll-behavior: smooth;
    scroll-snap-type: x mandatory;
  }

  .controls-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: var(--padding-inline-tablet);
  }

  .arrows-container {
    display: flex;
    gap: 1rem;
  }
</style>
