export function removeOpacity(node: Element) {
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
          // Stop observing the element once it has intersected
          // observer.unobserve(node);
        }

        if (!entry.isIntersecting) {
          node.classList.add("g-opacity");
          // observer.unobserve(node);
        }
      });
    },

    {
      rootMargin: "0px",
      threshold: 0.7,
    },
  );

  observer.observe(node);
}
