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


<a class='button-anchor' href={slug} style='--hoverTextColor:{hoverTextColor}; --textColor: {textColor}' class:isFilled class:hidden class:isSmallBtn>{text.toUpperCase()}</a>


<style >
  .hidden {
    display: none;
  }

  .isFilled {
    background-color: var(--hoverTextColor);
  }

  .isSmallBtn {
    width: var(--btn-width-sm);
  }
</style>