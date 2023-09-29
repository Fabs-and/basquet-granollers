<script lang="ts">
  import type { Post } from "fetch-wordpress-api";
  import NewsItem from "@components/homePage/news/NewsItem.svelte";
  import { sliderLeftArrow, sliderRightArrow } from "@assets/icons";
  import ButtonAnchor from "@components/ButtonAnchor.svelte";
  import { featuredNews } from "@data/featuredNews";
  export let posts: Post[];

  let position = 1;

  const totalNews = Math.ceil(posts.length / 3);

  $: visiblePosts = posts.slice(position * 3 - 3, position * 3);

  function goBack() {
    if (position > 1) {
      position--;
    }
  }

  function goForward() {
    if (position < totalNews) {
      position++;
    }
  }
</script>

<div class="desktop-news-container">
  <NewsItem item={featuredNews[0]} isFeatured={true} />
  <div class="desktop-news-and-controls">
    <div class="news">
      {#each visiblePosts as post, i (post.id)}
        <NewsItem item={post} isDesktopNews={true} />
      {/each}
    </div>
    <div class="controls">
      <div class="arrows-container">
        <button on:click={goBack}>
          {@html sliderLeftArrow}
        </button>
        <span class="position-indicator">
          <span class="first-number">
            {position < 10 ? `0${position}` : position}</span
          >
          /
          <span class="second-number"
            >{totalNews < 10 ? `0${totalNews}` : totalNews}</span
          >
        </span>
        <button on:click={goForward}>
          {@html sliderRightArrow}
        </button>
      </div>
      <ButtonAnchor
        text={"veure totes"}
        textColor={"var(--clr-accent)"}
        hoverTextColor={"var(--clr-contrast)"}
      />
    </div>
  </div>
</div>

<style>
  .desktop-news-container {
    display: flex;
    gap: 1rem;
    padding-right: var(--padding-inline);
  }

  .desktop-news-and-controls {
    display: flex;
    flex-direction: column;
    height: inherit;
    justify-content: space-between;
  }

  .news {
    overflow: hidden;
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: 2rem;
  }

  .controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .arrows-container {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .position-indicator {
    font-size: 0.78125rem;
    font-weight: 550;
  }

  .first-number {
    color: var(--clr-accent);
  }
</style>
