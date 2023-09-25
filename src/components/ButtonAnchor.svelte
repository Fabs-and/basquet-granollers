<script>
  export let text;
  export let slug = '';
  export let isFilled = false;
  export let textColor;
  export let hoverTextColor;
</script>


<a href={slug} style='--hoverTextColor:{hoverTextColor}; --textColor: {textColor}' class={isFilled ? 'isFilled' : ''}>{text.toUpperCase()}</a>


<style >
  a {
    text-decoration: none;
    display: grid;
    place-items: center;
    height: var(--btn-height);
    width: 10rem;
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
</style>