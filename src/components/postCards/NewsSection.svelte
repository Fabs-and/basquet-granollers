<script lang='ts'>
import type { Post } from "fetch-wordpress-api"
import IndividualNews from "./IndividualNews.svelte";
    import { sliderLeftArrow, sliderRightArrow } from "@assets/icons";

export let posts: Post[];

const firstPost = posts[0];
const isFirstPost = true;
</script>


<section class="noticies-container">
  <h2>CBG Notícies</h2>
  <div class="postCard-container">
    <IndividualNews post={firstPost} {isFirstPost}/>

    <div class="older-posts">
      {#each posts as post, i}
        {#if i > 0 && i < 4}
          <IndividualNews {post}/>
        {/if}
      {/each}
      <div class="position-container">
        <div class="position-controls-container">
          <button id="left-arrow">
            {@html sliderLeftArrow}
          </button>
          <span class="position-indicator">
            <span class="first-number"> 01</span>
             /
            <span class="second-number"> 04</span>
          </span>
          <button id="right-arrow">
          {@html sliderRightArrow}
          </button>
        </div>
        <!-- <ButtonAnchor
          text={"veure totes"}
          textColor={"var(--clr-accent)"}
          hoverTextColor={"var(--clr-contrast)"}
        /> -->
      </div>
    </div>
  </div>
</section>

<style>
  section.noticies-container {
    padding-inline: var(--padding-inline);
    background-color: var(--clr-contrast);
    color: var(--clr-primary);
  }

  div.postCard-container {
    display: flex;
    padding-block: 2rem;
    gap: 1rem;
  }

  div.older-posts {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    /* margin-inline-start: 2rem; */
  }

  .position-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    /* gap: 1rem; */
  }

  .position-controls-container {
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

  .button:hover {
    fill: var(--clr-accent);
  }
</style>