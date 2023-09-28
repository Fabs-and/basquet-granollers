<script lang="ts">
  import { removeOpacity } from "../../svelte-actions/intersectionObserver";
  import type { Post } from "fetch-wordpress-api";
  import IndividualNews from "./IndividualNews.svelte";
  import ButtonAnchor from "@components/ButtonAnchor.svelte";
  import { sliderLeftArrow, sliderRightArrow } from "@assets/icons";
  export let posts: Post[];
  export let childComponent;

  let component = childComponent === "individualNews" ? IndividualNews : null;
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


  <div
    class="responsive-news-container"
    bind:this={carousel}
    on:scroll={updateXScrollPosition}
  >
    {#each posts as post (post.id)}
      <svelte:component this={component} {post}/>
    {/each}
  </div>


<!-- <section class="responsive-news">
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
</section> -->

<style>

  .responsive-news {
    /* width: 99.9vw; */
    /* width: 100%; */
    width: 100vw;
    background-color: var(--clr-contrast);
    color: var(--clr-primary);
    padding-left: var(--padding-inline-tablet);
    padding-block: 2rem;
    /* display: flex;
    flex-direction: column;
    gap: 2rem; */
  }
  .responsive-news-container {
    display: flex;
    overflow-x: scroll;
    /* flex-direction: column; */
    /* justify-content: flex-; */
    justify-content: flex-start;
    /*
    gap: 1rem;
    overflow-x: scroll;
    scroll-behavior: smooth;
    scroll-snap-type: x mandatory; */
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
