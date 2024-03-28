<script>
  import DropDownAccordion from "./DropDownAccordion.svelte";
  import SearchWidgetResponsive from "@components/SearchWidgetResponsive.svelte";
  import LaHistoriaLogo from "@assets/LaHistoriaLogo.svelte"
  import SocialMediaMenu from "@components/SocialMediaMenu.svelte";
  import DirectesIcon from "@assets/DirectesIcon.svelte";

  import { logoSmall } from "@assets/logo";
  import { isModalOpen } from "../../../svelte/store.ts";
  import { hamburgerMenuIcon } from "@assets/icons";

  export let navigation;
  export let topHeaderContent;
  export let websiteContent;
  export let socialMediaInfo;

  let isDropdownVisible = false;

const {titol, link} = topHeaderContent[0];


  function handleClick() {
    if ($isModalOpen === "modalMenu") {
      isDropdownVisible = false;
      isModalOpen.set("noModalOpen");
    } else {
      isDropdownVisible = true;
      isModalOpen.set("modalMenu");
    }
  }

  $: {
    if ($isModalOpen === "modalSearchMenu" && isDropdownVisible) {
      isDropdownVisible = false;
    }
  }

 
</script>

<div class="flex-container">
  <button class="dropdown-menu" on:click={handleClick}>
    {@html hamburgerMenuIcon}
  </button>
  <a
    class="logo"
    title="Club Bàsquet Granollers Logo"
    aria-label="Club Bàsquet Granollers Logo"
    href="/"><div>{@html logoSmall}</div></a
  >
  <div class="search-icon">
    <SearchWidgetResponsive {websiteContent} />
  </div>
</div>

<ul
  id="myDropdown"
  class:visible={isDropdownVisible}
  class="dropdown-content-responsive"
>
<li class="top-header-link">
  <a href=""  class="directes" target="_blank">
    <DirectesIcon wd={"35"} title="Icona de Directes" color={"#fff"}/>
    <p >PARTITS EN DIRECTE</p>
  </a>
</li>
  {#if titol}
    <li class="top-header-link">
      {#if !link}
        <p>{titol.toUpperCase()}</p>
      {:else if link.includes("http")}
        <a
          href={link}
          class="underline-links"
          target="_blank"
          rel="noopener noreferrer"
        >
          {titol.toUpperCase()}
        </a>
      {:else}
        <a href={link} class="underline-links">
          {titol.toUpperCase()}
        </a>
      {/if}
    </li>
  {/if}

  {#each navigation as item}
    <li>
      {#if item.desplegable}
        <DropDownAccordion {item} />
      {:else if item.enllac.includes("http")}
        <a href={item.enllac} target="_blank" rel="noopener noreferrer">
          <h5>{item.titol.toUpperCase()}</h5>
        </a>
      {:else}
        <a href={item.enllac}>
          <h5>{item.titol.toUpperCase()}</h5>
        </a>
      {/if}
    </li>
  {/each}
    <div class='la-historia-logo'>
      <a href="https://historiabasquetgranollers.cat/" target="_blank">

        <LaHistoriaLogo wd={"221"} title="Logo de La Història del Bàsquet a Granollers" color={"#fff"}/>
      </a>
    </div>
  <div class="social-media-container">
    <SocialMediaMenu {socialMediaInfo} />
  </div>
</ul>

<style>
  .la-historia-logo {
    position: absolute;
    bottom: 5rem;
    left: 50%;
    transform: translateX(-50%);
  
  }
  .top-header-link {
    margin-inline: auto;
  }

  .directes {
    display: flex;
    gap: 1rem;
  }
  .top-header-link > a {
    color: var(--clr-contrast);
    font-size: var(--fnt-sz-h5);
    font-weight: var(--fnt-wg-medium);
    font-style: italic;
    text-decoration: underline;
  }

  .dropdown-content-responsive {
    position: fixed;
    display: flex;
    background-color: var(--clr-primary);
    color: var(--clr-contrast);
    top: calc(
      var(--hg-header-bottom-section) + var(--hg-header-top-section) +
        var(--hg-sponsors-all-responsive)
    );
    left: 0;
    right: 0;
    bottom: 0;
    padding-inline: var(--pd-x-medium);
    padding-block: 2.06rem;
    flex-direction: column;
    gap: 1.87rem;
    transform: translateX(-100%);
    transition: transform 0.2s ease-in-out;
    overflow: auto;
  }

  .social-media-container {
  margin-top: auto;

  }
  .dropdown-content-responsive.visible {
    transform: translateX(0);
  }
  .dropdown-content-responsive h5 {
    color: var(--clr-contrast);
  }
  /* .dropdown-content a {
    color: var(--clr-contrast);
    text-decoration: none;
    display: block;
  } */
  .flex-container {
    min-height: var(--hg-header-bottom-section);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 0.35rem;
  }

  .search-icon:hover {
    cursor: pointer;
  }

  a {
    color: var(--clr-primary);
    font-weight: var(--fnt-wg-medium);
  }

  @media (max-width: 648px) {
    .dropdown-content-responsive {
      top: calc(
        var(--hg-header-bottom-section) + var(--hg-sponsors-all-responsive)
      );
      padding-inline: var(--pd-x-small);
    }
  }
</style>
