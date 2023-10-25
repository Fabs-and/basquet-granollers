<script>
  import { onMount } from "svelte";
  import { fetchImagesInPageBySlug } from "@utils/apiFunctions/index";

  let socialMediaLinks = [];

  onMount(async () => {
    socialMediaLinks = await fetchImagesInPageBySlug("xarxes-socials");
  });

  let name;
</script>

<nav>
  <ul>
    {#each socialMediaLinks as socialMediaLink}
      {#if socialMediaLink.title}
        {#if socialMediaLink.title.toLowerCase().includes("instagram")}
          { name = "Instagram" }
        {:else if socialMediaLink.title.toLowerCase().includes("facebook")}
          { name = "Facebook"}
        {:else if socialMediaLink.title.toLowerCase().includes("x.com")}
          { name = "Twitter"}
        {:else if socialMediaLink.title.toLowerCase().includes("youtube")}
          { name = "Youtube"}
        {:else if socialMediaLink.title.toLowerCase().includes("twitch")}
          { name = "Twitch" }
        {:else}
          { name = "TikTok" }
        {/if}
        <li>
          <a
            title={name}
            href={name === 'TikTok' ? `https://www.tiktok.com/${socialMediaLink.caption}` : socialMediaLink.caption}
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
