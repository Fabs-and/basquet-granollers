<script>
  export let socialMediaInfo;
</script>

<nav>
  <ul>
    {#each socialMediaInfo as socialMediaItem}
      {#if socialMediaItem.title}
     
        <li>
          <a
            href={socialMediaItem.title.toLowerCase().includes('tiktok') ? `https://www.tiktok.com/${socialMediaItem.caption}` : socialMediaItem.caption}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={socialMediaItem.url} alt={socialMediaItem.alt} />
          </a>
        </li>
      {/if}
    {/each}
  </ul>
</nav>

<style>
  nav {
    width: 11.0544rem;
    height: 1.09956rem;
  }
  ul {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  a {
    display: flex;
    align-items: center;
  }

  @media (max-width: 648px) {
    nav {
      width: auto;
    }
  }
</style>
