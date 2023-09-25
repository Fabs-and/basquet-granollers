<script lang='ts'>
import { dateConverter } from "../../utils/helperFunctions";

export let post;
export let isFirstPost: boolean = false;
export let isResponsive: boolean = false;
const {
  title: { rendered: title },
  slug,
  date,
  image,
} = post;

</script>


<article class={isResponsive? "isResponsive" : isFirstPost ? "isFirstPost" : "card"} >
  <a href={`/${slug}`}>
    <div class="image-container">
      <img src={image} alt={title} />
    </div>
    <div class="info-container">
      <h4>{@html title}</h4>
      <p>{`Publicat ${dateConverter(date)}`}</p>
    </div>
  </a>
  </article>

<style>
  p {
    font-style: italic;
    font-weight: 560;
  }
  
  .isFirstPost {
    height: 100%;
    width: 60%;
    border-top-left-radius: 2.9375rem;
    overflow: hidden;
  }
  
  .isFirstPost a {
    display:block;
    height: 100%;
    width: 100%;
  }

   .isFirstPost .image-container {
    height: 80%;
    width: 100%;
    overflow: hidden;
    background-color:white;
    z-index: 0;
  }
  
  .isFirstPost .image-container img {
    height: 100%;
    object-fit: cover;
    object-position: start;
    transition: transform 0.3s;
    margin: auto;
  }

  .isFirstPost img:hover {
    transform: scale(1.1);
  }
  
  .isFirstPost .info-container {
    /* so the z-index has effect and the image does not overflow the info-container when hovered */
    /* position: relative;  */
    color: var(--clr-contrast);
    background-color: var(--clr-secondary);
    height: 20%;
    padding-inline: 1rem;
    padding-block: 0.5rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  article.card {
    height: 25%;
    overflow: hidden;
    /* flex-shrink:0; */
  }

  article.card a{
    color: var(--clr-primary);
    display: flex;
    gap: 1rem;
    height: 100%;
  }
  
   .card .image-container {
    width: 40%;
    height: 7.375rem;
    background-color: white;
    flex-shrink: 0;
  }
  
  .card img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top;
  }

  .card .info-container {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  

  .card p {
    font-style: italic;
    font-weight: 560;
    position: absolute;
    width: 100%;
    bottom: 0;
    z-index: 10;
    background-color: var(--clr-contrast);
}
  
  a h4:hover {
    color: var(--clr-accent);
  }

  .isResponsive {
    height: 18rem;
    width: 18.6875rem;
    flex-shrink: 0;
    border-top-left-radius: 2.9375rem;
    overflow: hidden;
    scroll-snap-align:start;
  }
  
  .isResponsive a {
    display: block;
    height: 100%;
    width: 100%;
  }

   .isResponsive .image-container {
    height: 60%;
    width: 100%;
    overflow: hidden;
    background-color:white;
    z-index: 0;
  }
  
  .isResponsive .image-container img {
    height: 100%;
    object-fit: cover;
    /* object-position: start; */
    transition: transform 0.3s;
    margin: auto;
  }

  .isResponsive img:hover {
    transform: scale(1.1);
  }
  
  .isResponsive .info-container {
    color: var(--clr-contrast);
    width: 100%;
    background-color: var(--clr-secondary);
    height: 40%;
    padding-inline: 1rem;
    padding-block: 0.5rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

 
</style>