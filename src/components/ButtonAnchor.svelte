<script>
  export let text = "";
  export let slug = "";
  export let isFilled = false;
  export let textColor = "";
  export let hoverTextColor = "";
  export let hidden = false;
</script>

<a
  class="g-button-anchor"
  href={slug}
  style="--hoverTextColor:{hoverTextColor}; --textColor: {textColor}"
  class:isFilled
  class:hidden>{text.toUpperCase()}</a
>

<style>
  .g-button-anchor {
    color: var(--textColor);
  }

  .g-button-anchor:hover {
    color: var(--hoverTextColor);
  }
  .hidden {
    display: none;
  }

  .isFilled {
    background-color: var(--hoverTextColor);
  }
</style>
