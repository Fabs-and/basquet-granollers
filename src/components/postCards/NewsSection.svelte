<script lang='ts'>
import type { Post } from "fetch-wordpress-api"
import IndividualNews from "./IndividualNews.svelte";
    import { sliderLeftArrow, sliderRightArrow } from "@assets/icons";

export let posts: Post[];



let position = 1;
const totalNews = Math.ceil(posts.length / 4);

$: visiblePosts = posts.slice(position * 4 - 4 , position * 4); 
$: firstPost = visiblePosts[0];


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


<section class="news-section-container">
  <h2>CBG Notícies</h2>
  <div class="news-container">
    {#each visiblePosts as post, i (post.id)}
      {#if i === 0}
      <IndividualNews post={firstPost} isFirstPost={true}/>
      {/if}
    {/each}

    <div class="older-news-and-slider-controls-container">
      <div class='older-news'>
        {#each visiblePosts as post, i (post.id)}
          {#if i > 0}
              <IndividualNews {post}/>
          {/if}
        {/each}
      </div>
      <div class="position-controls-and-button-container">
        <div class="position-controls-container">
          <button on:click={goBack}>
            {@html sliderLeftArrow}
          </button>
          <span class="position-indicator">
            <span class="first-number"> {position < 10 ? `0${position}` : position}</span>
             /
            <span class="second-number">{totalNews < 10 ? `0${totalNews}` : totalNews}</span>
          </span>
          <button on:click={goForward}>
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
  section.news-section-container {
    height: calc(100dvh - var(--top-header-hg) - (var(--bottom-header-hg) - var(--header-separator-line-hg)));
    padding-inline: var(--padding-inline);
   padding-block: 3rem;
    background-color: var(--clr-contrast);
    color: var(--clr-primary);
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
  
  div.news-container {
    display: flex;
    gap: 1rem;
    max-height: 80%;
    align-items: center;
  }
  
  div.older-news-and-slider-controls-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    flex: 1;
    justify-content: space-between;
  }
  
  .older-news {
    overflow: hidden;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .position-controls-and-button-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .position-controls-container {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  button {
    display: flex;
    /* align-items: center; */
  }
  .position-indicator {
    font-size: 0.78125rem;
    font-weight: 550;
  }

  .first-number {
    color: var(--clr-accent);
  }

  @media (width < 1025px) {
    section.news-section-container {
      padding-inline: var(--padding-inline-tablet);
    }
  }

</style>