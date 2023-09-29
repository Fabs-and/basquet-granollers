<script>
    import { componentIsHTMLElement } from "astro/runtime/server/render/dom.js";

  export let text;
  export let slug = '';
  export let isFilled = false;
  export let textColor;
  export let hoverTextColor;
  export let hidden;
  export let isSmallBtn;

  
</script>


<a href={slug} style='--hoverTextColor:{hoverTextColor}; --textColor: {textColor}' class:isFilled class:hidden class:isSmallBtn>{text.toUpperCase()}</a>


<style >
  .hidden {
    display: none;
  }
  
  a {
    text-decoration: none;
    display: grid;
    place-items: center;
    height: var(--btn-height);
    width: var(--btn-width-regular);
    border: 1px solid var(--clr-accent);
    border-radius: 1.75rem;
    color: var(--textColor);
  }
  
  a:hover {
    cursor: pointer;
    background-color: var(--clr-accent);
    color: var(--hoverTextColor)
  }

  .isFilled {
    background-color: var(--hoverTextColor);
  }

  .isSmallBtn {
    width: var(--btn-width-sm);
  }
</style>