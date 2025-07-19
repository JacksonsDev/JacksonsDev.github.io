document.addEventListener("DOMContentLoaded", () => {
  const rows = document.querySelectorAll(".skills-row, .skills-row-reverse");

  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  rows.forEach(row => observer.observe(row));
});
