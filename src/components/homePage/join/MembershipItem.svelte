<script>
  import { membershipCheck } from "@assets/icons";
  import { toggleDialog, updateUrltoSubdomain } from "@utils/helperFunctions";
  export let item = {};

  let expanded = false;

  function toggleExpand() {
    expanded = !expanded;
  }
</script>

<article class="membership-article opacity" class:expanded>
  <div class="image-container">
    <img
      src={updateUrltoSubdomain(item.image.url)}
      alt={item.image.alt}
      loading="lazy"
    />
    <h3 class="membership-title">{item.title}</h3>
  </div>
  <article class="membership-info-container">
    <div class="membership-price">
      <p>
        <span class="price-number">{item.price}</span>
        / any
      </p>
    </div>
    <div class="membership-advantages">
      {#each item.advantages as advantage}
        <div class="advantage-line">
          <div>
            {@html membershipCheck}
          </div>
          <p>{advantage}</p>
        </div>
      {/each}
    </div>
    <button on:click={toggleDialog} class="g-button-anchor"> CONTACTA </button>
    <div class="ball-img">
      <img src="membership-ball.png" alt="" class="" />
    </div>
    <button class="llegir-mes" on:click={toggleExpand}>
      {expanded ? `Llegir menys` : `Llegir més`}
    </button>
  </article>
</article>

<style>
  h3 {
    font-size: 1.875rem;
    font-weight: 600;
  }
  .expanded {
    height: 52.13rem !important;
  }

  .expanded .llegir-mes {
    bottom: -20.62rem;
  }
  .membership-article.expanded::before {
    content: none;
  }

  .llegir-mes {
    display: none;
  }
  .membership-article {
    height: 51.75rem;
    width: var(--wd-three-columns);
    background-color: var(--clr-secondary);
    border-top-left-radius: var(--brdr-left-top-radius);
    overflow: hidden;
    scroll-snap-align: start;
    transition: height 0.3s ease;
  }

  .membership-title {
    position: absolute;
    left: 1.88rem;
    bottom: 1.88rem;
    z-index: 1;
  }

  .image-container {
    position: relative;
    height: 13.125rem;
    background-color: gray;
  }

  .image-container img {
    opacity: 0.5;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .membership-info-container {
    position: relative;
    height: 38.625rem;
    display: flex;
    flex-direction: column;
    padding: 1.88rem;
  }

  .membership-price {
    width: 100%;
    padding-bottom: 1.88rem;
    border-bottom: 1px solid var(--clr-contrast);
  }
  .price-number {
    font-size: 1.875rem;
    font-weight: 550;
    color: var(--clr-accent);
  }

  .membership-advantages {
    padding-block: 1.88rem;
    display: flex;
    flex-direction: column;
    gap: 0.87rem;
  }

  .g-button-anchor {
    position: absolute;
    left: 1.88rem;
    bottom: 1.88rem;
  }

  .advantage-line {
    display: flex;
    gap: 0.63rem;
  }

  .ball-img {
    position: absolute;
    opacity: 0.24;
    right: 0;
    bottom: 0;
  }

  @media (max-width: 1374px) {
    .membership-article {
      width: var(--wd-three-columns-medium);
      height: 56.13rem;
      justify-content: center;
      gap: 1.3rem;
    }

    .g-button-anchor {
      bottom: -2.69rem;
    }
    .ball-img {
      bottom: -4.38rem;
    }
  }

  @media (max-width: 932px) {
    h3 {
      font-size: 1.375rem;
    }
    .membership-article {
      width: var(--wd-slider-item);
      height: 29.625rem;
      flex-shrink: 0;
      position: relative;
    }

    .membership-title {
      bottom: 1.31rem;
    }

    .g-button-anchor {
      display: none;
    }

    .image-container {
      height: 10.125rem;
    }

    .membership-info-container {
      height: 19.5rem;
    }

    .membership-article::before {
      content: "";
      position: absolute;
      bottom: 0;
      background: linear-gradient(
        0deg,
        #084395 19.71%,
        rgba(8, 67, 149, 0) 124.82%
      );
      z-index: 1;
      width: 100%; /* specify a width */
      height: 9.6875rem;
    }

    .llegir-mes {
      display: block;
      position: absolute;
      bottom: 1.88rem;
      left: 3.5rem;
      z-index: 2;
      color: var(--clr-accent);
      text-decoration: underline;
    }

    .ball-img {
      display: none;
    }
  }

  @media (max-width: 1076px) {
  }
</style>
