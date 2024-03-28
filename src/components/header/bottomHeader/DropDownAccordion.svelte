<script>
  export let item;

</script>

<details>
  <summary>
    <h5>{item.desplegable.toUpperCase()}</h5>
  </summary>
  <ul class="links-container">
    {#each item.values as dropDownItem}
      <li>
        {#if dropDownItem.enllac.includes('http')}
          <a
            href={dropDownItem.enllac}
            target="_blank"
            rel="noopener noreferrer"
          >
            {dropDownItem.nom}
          </a>
        {:else}
          <a href={dropDownItem.enllac}>{dropDownItem.nom}</a>
        {/if}
      </li>
    {/each}
  </ul>
</details>

<style>
  details > summary {
    list-style: none;
  }

  summary::-webkit-details-marker {
    display: none;
  }

  details summary {
    cursor: pointer;
    position: relative;
    transition: margin 0.45s ease-out;
  }

  details[open] summary {
    margin-bottom: 10px;
  }

  summary::before {
    position: absolute;
    top: -20%;
    right: 0rem;
    content: url("../../../collapsibleArrow.svg");
    display: inline-flex;
    justify-content: center;
    align-items: center;
    transform: rotate(0);
    transform-origin: 50% 35%;
    transition: 0.45s transform ease-in-out;
  }

  details[open] > summary:before {
    transform: rotate(-180deg);
    transition: 0.45s transform ease-in-out;
  }

  .links-container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 0.65rem;
  }
</style>
