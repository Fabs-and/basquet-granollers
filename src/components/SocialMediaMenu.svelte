<script>
  // import { fetchImagesInPageBySlug } from "@utils/apiFunctions/index";

  export let socialMediaLinks = [];

// (async () => {
//     socialMediaLinks = await fetchImagesInPageBySlug("xarxes-socials");
//   })();

  let name;
</script>

<nav>
  <ul>
    {#each socialMediaLinks as socialMediaLink}
      {#if socialMediaLink.title}
     
        <li>
          <a
            title={name}
            href={socialMediaLink.title.toLowerCase().includes('tiktok') ? `https://www.tiktok.com/${socialMediaLink.caption}` : socialMediaLink.caption}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={socialMediaLink.url} alt={socialMediaLink.alt} />
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
