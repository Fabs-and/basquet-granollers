<script>
  import { closeIcon, magnifyingGlass } from "@assets/icons";
  import { formatHTMLContent } from "@utils/helperFunctions";
  import DOMPurify from "dompurify";

  export let websiteContent = [];
  let filteredContent = websiteContent;
  let searchInput = "";
  let showResults = false;
  let showForm = false;

  const handleInput = () => {
    const sanitizedInput = DOMPurify.sanitize(searchInput.toLowerCase());
    // Step 1: Filter the content
    const matchingContent = websiteContent.filter((post) => {
      const title = post.title.rendered.toLowerCase();
      const content = post.content.rendered.toLowerCase();
      const slug = post.slug.toLowerCase();
      return (
        title.includes(sanitizedInput) ||
        content.includes(sanitizedInput) ||
        slug.includes(sanitizedInput)
      );
    });
    // Step 2: Sort the filtered content
    filteredContent = matchingContent.sort((a, b) => {
      const aTitle = a.title.rendered.toLowerCase();
      const bTitle = b.title.rendered.toLowerCase();
      const aContent = a.content.rendered.toLowerCase();
      const bContent = b.content.rendered.toLowerCase();
      // Here, we prioritize matches in the title over matches in the content
      if (aTitle.includes(sanitizedInput) && !bTitle.includes(sanitizedInput)) {
        return -1; // a comes first
      }
      if (!aTitle.includes(sanitizedInput) && bTitle.includes(sanitizedInput)) {
        return 1; // b comes first
      }
      // Fallback to original order if both or neither have the search term in the title
      return 0;
    });
    showResults = searchInput.length > 2 && filteredContent.length > 0;
  };

  const toggleForm = () => {
    showForm = !showForm;
    if (!showForm) {
      searchInput = "";
      showResults = false;
    }
  };
  let hovering = false;

  const hideComponents = () => {
    if (!hovering) {
      searchInput = "";
      showForm = false;
      showResults = false;
    }
  };
</script>

<aside
  id="search-component"
  on:mouseenter={() => (hovering = true)}
  on:mouseleave={() => {
    hovering = false;
    hideComponents();
  }}
>
  <form action="" class="form" class:show={showForm}>
    <input
      style="font-family: 'obviously', sans-serif; font-size: var(--font-size-regular); font-weight: 400;"
      type="search"
      required
      min="2"
      max="24"
      name="search"
      id="search"
      placeholder="Buscar"
      bind:value={searchInput}
      on:input={handleInput}
    />
  </form>
  <button class="search-icon" on:click={toggleForm}>
    {#if showForm}
      <div class="close" style="display: block;">{@html closeIcon}</div>
    {:else}
      <div class="magnifying">{@html magnifyingGlass}</div>
    {/if}
  </button>
  <div class="bridge" class:show={showForm || showResults}></div>
  <div
    class="wrapper"
    class:show={showResults ||
      (searchInput.length > 0 && filteredContent.length === 0)}
  >
    <ul class="results-modal">
      {#if filteredContent.length > 0}
        {#each filteredContent as post}
          <li>
            <a href={`/${post.slug}`}
              >{formatHTMLContent(post.title.rendered)}</a
            >
          </li>
        {/each}
      {:else if searchInput.length > 0}
        <li>No s'ha trobat res</li>
      {/if}
    </ul>
  </div>
</aside>

<style>
  .bridge {
    display: none;
    top: 2.6875rem;
    position: absolute;
    height: 2rem;
    width: var(--searchbox-width);
    left: calc((var(--searchbox-width) * -1) + 1rem);
    background: transparent;
  }

  .bridge.show {
    display: block;
  }
  aside {
    --searchbox-width: 18.875rem;
    position: relative;
    height: 2.6875rem;
    /* padding-top: 0.1rem; */
  }

  ul {
    display: flex;
    flex-direction: column;
    left: calc((var(--searchbox-width) * -1) + 1rem);
    top: 4rem;
    gap: 0.75rem;
    position: absolute;
    /*Max-height is calculated with two lines for results (0.75rem) plus the padding-block times 10 to have around 10 results before scrolling*/
    max-height: 15.5rem;
    background-color: var(--clr-primary);
    /* border-color: var(--clr-secondary); ; */
    padding-inline: 1.31rem;
    padding-block: 0.81rem;
    font-weight: 400;
    width: var(--searchbox-width);
    z-index: 1;
    overflow-y: auto;
  }
  .wrapper {
    display: none;
  }
  .wrapper.show {
    display: flex;
  }

  .wrapper:before {
    content: "";
    width: 0;
    height: 0;
    border-left: 0.71875rem solid transparent; /* Half of the width */
    border-right: 0.71875rem solid transparent; /* Half of the width */
    border-bottom: 0.9375rem solid var(--clr-primary); /* Given height */
    position: absolute;
    top: 3.2rem;
    left: calc((var(--searchbox-width) * -1) + 2rem);
    /* transform: translateX(5%); */
  }

  ::-webkit-scrollbar {
    width: 5px;
  }

  ::-webkit-scrollbar-track {
    background-color: none;
  }

  ::-webkit-scrollbar-thumb {
    background-color: var(--clr-secondary);
    border-radius: 12px;
  }
  .close {
    display: none;
    position: relative;
    top: 0.3rem;
  }

  .search-icon {
    position: absolute;
    right: 0rem;
    bottom: 0.5rem;
  }
  form {
    position: relative;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.5s ease-in-out;
  }

  form.show {
    opacity: 1;
    visibility: visible;
  }

  input {
    display: flex;
    border-radius: 1.34375rem;
    border: 1px solid var(--clr-primary);
    width: 3.7rem; /* Set initial width to 2rem */
    height: 2.6875rem;
    background-color: transparent;
    padding-inline: 1.5rem;
    color: var(--clr-primary);
    margin-right: -1rem;
    position: absolute; /* Absolute position is necessary to use 'right' */
    right: 0; /* Set initial right position to 0 */
    /* Set initial opacity to 0 */
    transition: width 0.3s ease-in-out; /* Set transitions for opacity and width */
    font-size: var(--font-size-regular);
    font-weight: 600;
  }

  input:focus {
    outline: 2px solid var(--clr-primary); /* Blue outline */
  }

  form.show input {
    width: var(--searchbox-width);
    /* Set final opacity to 1 */
  }

  input::placeholder {
    color: var(--clr-primary);
  }

  input[type="search"]::-webkit-search-cancel-button {
    display: none;
  }

  @media (max-width: 1300px) {
    aside {
      --searchbox-width: 15.875rem;
    }
  }
</style>
