<script>
  import ButtonAnchor from "@components/ButtonAnchor.svelte";
  import { membershipCheck } from "@assets/icons";

  import {
    sliderLeftArrowWhite,
    sliderRightArrowWhite,
    closeModalIcon,
  } from "@assets/icons";
  export let item;

  let expanded = false;

  function toggleExpand() {
    expanded = !expanded;
  }

  function toggleDialog() {
    const dialog = document.querySelector("dialog");
    if (dialog.open) {
      dialog.close();
    } else {
      dialog.showModal();
    }
  }
</script>

<article class="membership-article opacity" class:expanded>
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
    <button on:click={toggleDialog} class="button-anchor"> CONTACTA </button>
    <div class="ball-img">
      <img src="membership-ball.png" alt="" class="" />
    </div>
    <button class="llegir-mes" on:click={toggleDialog}>
      {expanded ? `Llegir menys` : `Llegir més`}
    </button>
  </article>
</article>

<dialog id="dialog">
  <button class="modal-button" on:click={toggleDialog}
    >{@html closeModalIcon}</button
  >
  <div class="dialog-container">
    <h3>Vols ser Soci/sòcia d'honor?</h3>
    <!-- <br /> -->
    <br />
    <div>
      <p>Envia'ns un correu electrònic a:</p>
      <p class="g-text-clr-accent">somcbg@cbgranollers.cat</p>
    </div>
    <!-- <br /> -->
    <div>
      <p>O bé, vine a les oficines:</p>
      <p class="g-text-clr-accent">
        dimarts, dimecres o divendres de 17 a 20 h.
      </p>
    </div>
  </div>
</dialog>

<style>
  .modal-button {
    position: absolute;
    top: -1.7rem;
    right: -2rem;
  }

  .expanded {
    height: 47.63rem !important;
  }
  h3 {
    text-wrap: balance;
  }
  dialog {
    overflow: visible;
    margin: auto;
    color: var(--clr-secondary);
    padding-inline: 3.5rem;
    padding-block: 2.69rem;
    /* width: 37.5rem; */
    /* height: 21.25rem; */
    max-width: 60vw;
    z-index: 100;
    background-color: var(--clr-contrast);
    border-radius: 0.4rem;
    border: none;
  }
  .dialog-container {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }
  .dialog-container p {
    font-size: var(--font-size-h4);
    font-weight: 560;
    line-height: 1.5625rem;
  }

  dialog::backdrop {
  /*Opacity property does not work with backdrop*/
  background-color: rgba(0, 0, 0, 0.5);  
}
  .expanded .llegir-mes {
    bottom: -15.62rem;
  }
  .membership-article.expanded::before {
    content: none;
  }

  .llegir-mes {
    display: none;
  }
  .membership-article {
    height: 51.75rem;
    width: 24.1875rem;
    background-color: var(--clr-secondary);
    border-top-left-radius: 2.9375rem;
    overflow: hidden;
    scroll-snap-align: start;
    transition: height 0.3s ease;
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

    .image-container {
      height: 10.125rem;
    }

    .membership-info-container {
      height: 19.5rem;
    }

    .membership-article {
      height: 29.625rem;
      flex-shrink: 0;
      position: relative;
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

  @media (width < 1076px) {
  }
</style>
