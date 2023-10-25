<script>
  console.log("am i in the browser?");
  import { onMount } from "svelte";
  import DropDownAccordion from "./DropDownAccordion.svelte";
  import SearchWidgetResponsive from "@components/SearchWidgetResponsive.svelte";

   import SocialMediaMenu from "@components/SocialMediaMenu.svelte";

  import { logoSmall } from "@assets/logo";
  import { isModalOpen } from "../../../svelte/store.ts";
  import { hamburgerMenuIcon } from "@assets/icons";

  export let navigation;
  export let topHeaderContent;
  export let websiteContent;
  export let socialMediaLinks;

  let isDropdownVisible = false;

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

  const { text1, link1 } = topHeaderContent[0];
  const { text2, link2 } = topHeaderContent[0];
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
  {#if text1}
    <li class="top-header-link">
      {#if !link1}
        <p>{text1.toUpperCase()}</p>
      {:else if link1.includes("http")}
        <a
          href={link1}
          class="underline-links"
          target="_blank"
          rel="noopener noreferrer"
        >
          {text1.toUpperCase()}
        </a>
      {:else}
        <a href={link1} class="underline-links">
          {text1.toUpperCase()}
        </a>
      {/if}
    </li>
  {/if}

  {#if text2}
    <li class="top-header-link">
      {#if !link2}
        <p>{text2.toUpperCase()}</p>
      {:else if link2.includes("http")}
        <a
          href={link2}
          class="underline-links"
          target="_blank"
          rel="noopener noreferrer"
        >
          {text2.toUpperCase()}
        </a>
      {:else}
        <a href={link2} class="underline-links">
          {text2.toUpperCase()}
        </a>
      {/if}
    </li>
  {/if}

  {#each navigation as item (item.name)}
    <li>
      {#if item.dropdown}
        <DropDownAccordion {item} />
      {:else if item.link.includes("http")}
        <a href={item.link} target="_blank" rel="noopener noreferrer">
          <h5>{item.name.toUpperCase()}</h5>
        </a>
      {:else}
        <a href={item.link}>
          <h5>{item.name.toUpperCase()}</h5>
        </a>
      {/if}
    </li>
  {/each}

  <div class="social-media-container">
    <SocialMediaMenu {socialMediaLinks}/>
  </div>
</ul>

<style>
  .top-header-link {
    margin-inline: auto;
  }

  .top-header-link > a {
    color: var(--clr-contrast);
    font-size: var(--font-size-h5);
    font-weight: var(--font-weight-bold);
    font-style: italic;
    text-decoration: underline;
  }

  .dropdown-content-responsive {
    position: fixed;
    display: flex;
    background-color: var(--clr-primary);
    color: var(--clr-contrast);
    top: calc(
      var(--bottom-header-hg) + var(--top-header-hg) +
        var(--header-separator-line-responsive-hg)
    );
    left: 0;
    right: 0;
    bottom: 0;
    padding-inline: var(--padding-inline-tablet);
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
    min-height: var(--bottom-header-hg);
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
    font-weight: var(--font-weight-bold);
  }

  @media (width < 648px) {
    .dropdown-content-responsive {
      top: calc(
        var(--bottom-header-hg) + var(--header-separator-line-responsive-hg)
      );
      padding-inline: var(--padding-inline-mobile);
    }
  }
</style>
