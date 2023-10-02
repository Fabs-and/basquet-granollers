<script>
  import ButtonAnchor from "@components/ButtonAnchor.svelte";
  import { membershipCheck } from "@assets/icons";

  import { sliderLeftArrowWhite, sliderRightArrowWhite } from "@assets/icons";
  export let item;
</script>

<article class="membership-article opacity">
  <div class="image-container">
    <img src="" alt="" />
    <h3 class="memebership-title">{item.name}</h3>
  </div>
  <article class="membership-info-container">
    <div class="membership-price">
      <p>
        <span class="price-number">{item.price}</span>
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
    <div class="button-anchor">
      <ButtonAnchor text={`contacta`} />
    </div>
    <div class="ball-img">
      <img src="membership-ball.png" alt="" class="" />
    </div>
  </article>
</article>

<style>
  .membership-article {
    height: 51.75rem;
    width: 24.1875rem;
    background-color: var(--clr-secondary);
    border-top-left-radius: 2.9375rem;
    overflow: hidden;
    scroll-snap-align: start;
  }

  .memebership-title {
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

  .button-anchor {
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

  @media (width < 1374px) {
    .membership-article {
      width: 18.3875rem;
      justify-content: center;
      gap: 1.3rem;
    }

   
  }
  @media (width < 932px) {
     .button-anchor {
      display: none;
    }

    /*
    .image-container {
      height: 10.125rem;
    }

    .membership-info-container {
      height: 19.5rem;
    }

   

    .membership-article {
      height: 29.625rem;
      flex-shrink: 0;
    } */
  
  }

  @media (width < 1076px) {
  }
</style>
