export function removeOpacity(node: Element, index: number) {
  // Return early if this is the first element
  if (index === 0) return;

  let firstObservation = true;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (firstObservation) {
          firstObservation = false;
          return;
        }

        if (entry.isIntersecting) {
          node.classList.remove("g-opacity");
        } else {
          node.classList.add("g-opacity");
        }
      });
    },
    {
      rootMargin: "0px",
      threshold: 0.3,
    },
  );

  observer.observe(node);
}
