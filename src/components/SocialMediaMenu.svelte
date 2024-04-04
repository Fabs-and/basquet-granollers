<script>
  export let socialMedia;

  import YoutubeLogo from "@assets/xarxesSocials/YoutubeLogo.svelte";
  import InstagramLogo from "@assets/xarxesSocials/InstagramLogo.svelte";
  import FacebookLogo from "@assets/xarxesSocials/FacebookLogo.svelte";
  import TwitterLogo from "@assets/xarxesSocials/TwitterLogo.svelte";
  import TiktokLogo from "@assets/xarxesSocials/TikTokLogo.svelte";

  const logoComponents = {
    instagram: InstagramLogo,
    facebook: FacebookLogo,
    youtube: YoutubeLogo,
    "x.com": TwitterLogo,
    "X.com": TwitterLogo,
    twitter: TwitterLogo,
    x: TwitterLogo,
    X: TwitterLogo,
    tiktok: TiktokLogo,
  };

  function getLogoComponent(name) {
    const lowerCaseName = name.toLowerCase();
    for (let socialMediaName in logoComponents) {
      if (lowerCaseName.includes(socialMediaName)) {
        return logoComponents[socialMediaName];
      }
    }
    return null;
  }
</script>

<nav>
  <ul>
    {#each socialMedia as socialMediaItem}
      {#if socialMediaItem.name}
        <li>
          <a
            href={socialMediaItem.link}
            title={socialMediaItem.name}
            target="_blank"
            rel="noopener noreferrer"
          >
            <svelte:component this={getLogoComponent(socialMediaItem.name)} />
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
