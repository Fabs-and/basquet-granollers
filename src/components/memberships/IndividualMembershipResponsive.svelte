<script>
  import ButtonAnchor from "@components/ButtonAnchor.svelte";
  import { membershipCheck } from "@assets/icons";

  import { sliderLeftArrowWhite, sliderRightArrowWhite } from "@assets/icons";
  export let memberships;

  function goBack() {
    console.log("goBack");
  }

  function goForward() {
    console.log("goForward");
  }
</script>

<div class="membership-articles-container">
  {#each memberships as membership}
    <article class="membership-article">
      <div class="image-container">
        <img src="" alt="" />
        <h3 class="memebership-title">{membership.name}</h3>
      </div>
      <article class="membership-info-container">
        <div class="membership-price">
          <p>
            <span class="price-number">{membership.price}</span> / any
          </p>
        </div>
        <div class="membership-advantages">
          {#each membership.advantages as advantage}
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
  {/each}
</div>

<div class="memberships-slider-controls-container">
  <ButtonAnchor text={`contacta`} />
  <div class="memberships-arrows-container">
    <button on:click={goBack}>
      {@html sliderLeftArrowWhite}
    </button>
    <button on:click={goForward}>
      {@html sliderRightArrowWhite}
    </button>
  </div>
</div>

<style>
  .memberships-slider-controls-container {
    display: none;
  }

  .memberships-arrows-container {
    display: none;
  }
  .membership-articles-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.3rem;
  }

  .membership-articles-container > :nth-child(1) {
    justify-self: end;
  }

  .membership-articles-container > :nth-child(3) {
    justify-self: start;
  }

  .membership-article {
    height: 51.75rem;
    width: 18.6875rem;
    background-color: var(--clr-secondary);
    border-top-left-radius: 2.9375rem;
    overflow: hidden;
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

  @media (width < 1105px) {
    .button-anchor {
      display: none;
    }

    .image-container {
      height: 10.125rem;
    }

    .membership-info-container {
      height: 19.5rem;
    }

    .membership-articles-container {
      width: 99.9vw;
      display: flex;
      gap: 1rem;
      overflow-x: scroll;
      scroll-behavior: smooth;
      scroll-snap-type: x mandatory;
    }

    .membership-article {
      height: 29.625rem;
      flex-shrink: 0;
    }
    .memberships-slider-controls-container {
      display: flex;
      justify-content: space-between;
      padding-top: 1.13rem;
    }

    .memberships-arrows-container {
      display: flex;
      gap: 0.56rem;
    }
  }

  @media (width < 1076px) {
  }
</style>
