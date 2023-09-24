<script lang='ts'>
import { dateConverter } from "../../utils/helperFunctions";

export let post;
export let isFirstPost: boolean = false;

const {
  title: { rendered: title },
  slug,
  date,
  image,
} = post;

</script>


<article class={isFirstPost ? "isFirstPost" : "card"}>
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
    max-width: 60%;
    border-top-left-radius: 2.9375rem;
    overflow: hidden;
    position: relative;
  }
  
  .isFirstPost a {
    display:block;
    height: 100%;
  }

   .isFirstPost .image-container {
    height: 80%;
    border-top-left-radius: 2.9375rem;
    overflow: hidden;
    /* display: grid;
    place-items: center; */
    background-color:white;
    /* position: relative; */
    z-index: 0;
  }
  
  .isFirstPost .image-container img {
    height: 100%;
    object-fit: cover;
    object-position: start;
    border-top-left-radius: 2.9375rem;
    transition: transform 0.3s;
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
    color: var(--clr-primary);
    display: flex;
    gap: 1rem;
    /* align-items: start; */
  }
  
  .card .info-container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  
  .card .image-container {
    /* position: relative; */
    width: 11.4375rem;
    height: 7.375rem;
    background-color: white;
    flex-shrink: 0;
    /* flex: 1; */
    /* overflow: hidden; */
  }
  
  .card img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top;
    /* overflow: hidden; */
    /* margin: auto; */
  }
  
  a h4:hover {
    color: var(--clr-accent);
  }
</style>