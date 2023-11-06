<script>
  import { membershipCheck } from "@assets/icons";
  import { toggleDialog } from "@utils/helperFunctions";

  export let item;
</script>

<article class="sponsor-article opacity">
  <div class="sponsor-title">
    <small>Patrocinador</small>
    <h3>{item.title}</h3>
  </div>
  <div class="sponsor-price">
    <p>
      <span class="price-number">{item.price}</span>
    </p>
  </div>
  <div class="sponsor-advantages">
    {#each item.advantages as advantage}
      <div class="advantage-line">
        <div>
          {@html membershipCheck}
        </div>
        <p>{advantage}</p>
      </div>
    {/each}
  </div>
  <button on:click={toggleDialog} class="button-anchor"> CONTACTA </button>
</article>

<style>
  h3 {
    padding-top: 0.3rem;
  }
  .sponsor-article {
    height: 25.1875rem;
    width: 24.1875rem;
    background-color: var(--clr-secondary);
    border-top-left-radius: 2.9375rem;
    overflow: hidden;
    padding-inline: 1.88rem;
    display: flex;
    flex-direction: column;
    padding-block: 1.38rem;
    gap: 1.13rem;
    scroll-snap-align: start;
  }

  .sponsor-price {
    width: 100%;
    padding-bottom: 1.13rem;
    border-bottom: 1px solid var(--clr-contrast);
  }
  .price-number {
    font-size: 1.875rem;
    font-weight: 550;
    color: var(--clr-accent);
  }

  .sponsor-advantages {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .advantage-line {
    display: flex;
    gap: 0.63rem;
  }

  @media (max-width: 859px) {
    .sponsor-article {
      width: var(--slider-item-width);
      height: 100%;
    }

    .button-anchor {
      display: none;
    }
  }
</style>
