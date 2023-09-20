import { mainSponsorsWhite } from "@data/sponsors";
import { slides } from "@data/hero-carousel";
import ButtonAnchor from "@components/ButtonAnchor.astro";

<Fragment>
  <section>
    <div class="image-container">
      <img src="hero-image.avif" />
    </div>

    <div class="hero-info-container">
      <div class="hero-info-flex">
        <h2>{slides[0].title}</h2>
        <p>{slides[0].description}</p>
        <ButtonAnchor slug={slides[0].link} text={slides[0].buttonText} />
      </div>
    </div>

    <div class="sponsors-flex-container">
      <p class="sponsors-title">Patrocinadors principals</p>
      <nav>
        <ul class="hero-sponsors-container">
          {mainSponsorsWhite.map((sponsor) => (
            <Fragment>
              <li>
                <a
                  href={sponsor.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={sponsor.logo} alt={sponsor.alt} />
                </a>
              </li>
            </Fragment>
          ))}
        </ul>
      </nav>
    </div>
  </section>

  <style>{`
  section {
    position: relative;
    margin-top: calc(
      (var(--bottom-header-hg) + var(--header-separator-line-hg)) * -1
    );
  }

  .hero-info-container {
    position: absolute;
    background-color: rgba(0, 0, 0, 0.65);
    left: 0;
    right: 58%;
    bottom: calc(7.875rem + 6rem);;
    top: calc(var(--bottom-header-hg) + var(--header-separator-line-hg)) ;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: center;
    /* mix-blend-mode: multiply; */
  }

  .hero-info-flex {
    display: flex;
    flex-direction: column;
    justify-content: center;
    /* align-items: center; */
    padding-inline: 6.25rem;
    gap: 1.5rem;
    text-wrap: balance;
  }

  .sponsors-flex-container {
    position: absolute;
    left: 0rem;
    right: 0rem;
    /; */
    height: 7.875rem;
    background-color: var(--clr-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 3.05rem;
  }

  .sponsors-title {
    height: 60%;
    padding-right: 3.05rem;
    display: flex;
    align-items: center;
    border-right: 1px solid white;
  }
  ul {
    display: flex;
    align-items: center;
    gap: 3.05rem;
  }
`}</style>
</Fragment>;
