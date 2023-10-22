<script lang="ts">
  import NewsItem from "@components/homePage/news/NewsItem.svelte";
  import { sliderLeftArrow, sliderRightArrow } from "@assets/icons";
  import ButtonAnchor from "@components/ButtonAnchor.svelte";
    import { fetchPostsInCategory } from "@utils/apiFunctions";
    import { isLastYearNews } from "@utils/helperFunctions";
  
  export let news: Post[];
  export let featuredNews: Post;
 
  
  let position = 1;
  let currentIndex = 0;
  let prevIndex = 0;
  let direction = "";

  const totalSlides = Math.ceil(news.length / 3);
  
  (async () => {
    const clientFetchNews = await fetchPostsInCategory(19, ["title", "image", "slug", "date", "id"]);
    let clientLastYearNews = clientFetchNews.filter((oneNews) => isLastYearNews(oneNews.date));
    
    if (news.length !== clientLastYearNews.length) {
      news = clientLastYearNews;
    }
  })();
  
  news = news.filter((newsItem) => newsItem.id !== featuredNews.id);

  async function goBack() {
    if (position > 1) {
      position--;
    } else {
      position = totalSlides;
    }
    direction = "prev";
    prevIndex = currentIndex;
    currentIndex = currentIndex === 0 ? totalSlides - 1 : currentIndex - 1;
  }

  async function goForward() {
    if (position < totalSlides) {
      position++;
    } else {
      position = 1;
    }
    direction = "next";
    prevIndex = currentIndex;
    currentIndex = currentIndex === totalSlides - 1 ? 0 : currentIndex + 1;
  }

</script>

<div class="desktop-news-container">
  <NewsItem item={featuredNews} isFeatured={true} />
  <div class="desktop-news-and-controls">
    <div class="carousel">
      {#each Array(totalSlides) as _, i (i)}
        <div
          class="news {direction}"
          class:active={currentIndex === i}
          class:outgoing={prevIndex === i && currentIndex !== i}
        >
          {#each news.slice(i * 3, i * 3 + 3) as newsItem (newsItem.id)}
            <NewsItem item={newsItem} isDesktopNews={true} />
          {/each}
        </div>
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
            >{totalSlides < 10 ? `0${totalSlides}` : totalSlides}</span
          >
        </span>
        <button on:click={goForward}>
          {@html sliderRightArrow}
        </button>
      </div>
      <ButtonAnchor
        slug={"/noticies"}
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
    padding-bottom: var(--padding-section-big);
  }

  .desktop-news-and-controls {
    display: flex;
    flex-direction: column;
    height: inherit;
    justify-content: space-between;
    width: 100%;
    overflow: hidden;
  }

  .carousel {
    position: relative;
    flex-shrink: 0;
    flex: 1;
  }

  .news {
    position: absolute;
    /* left: 0; */
    display: none;
    overflow: hidden;
    /* display: flex; */
    flex-direction: column;
    gap: 2rem;
  }

  .news.active,
  .news.outgoing {
    display: flex;
  }

  .news.next.active {
    animation: slide-in-from-right 0.45s forwards ease-in;
  }

  .news.next.outgoing {
    animation: slide-out-to-left 0.45s forwards ease-in;
  }

  .news.prev.active {
    animation: slide-in-from-left 0.45s forwards ease-in;
  }

  .news.prev.outgoing {
    animation: slide-out-to-right 0.45s forwards ease-in;
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

  @keyframes slide-in-from-right {
    0% {
      transform: translateX(100%);
    }
    100% {
      transform: translateX(0);
    }
  }

  @keyframes slide-in-from-left {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(0);
    }
  }

  @keyframes slide-out-to-right {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(100%);
    }
  }

  @keyframes slide-out-to-left {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-100%);
    }
  }

  @media (width < 1025px) {
    .desktop-news-container {
      padding-bottom: var(--padding-section-medium);
    }
  }

   @media (width > 1400px) {
    .desktop-news-container {
      padding-right: 0rem;
    }
  }
</style>
