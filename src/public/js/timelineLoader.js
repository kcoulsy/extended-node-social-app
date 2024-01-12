import { createPostHTML } from "./createPostHTML.js";

const allInitialPosts = document.querySelectorAll(".posts__item");
const loadedTimelineItemIds = [...allInitialPosts].map(
  (post) => post.dataset.timelineItemId
);

if (!!window.IntersectionObserver) {
  const observer = new IntersectionObserver(async (entries) => {
    const entry = entries[0];

    if (entry.isIntersecting) {
      const lastTimelineItem = document.querySelector(
        ".posts__item:last-child"
      );

      const lastPostId = lastTimelineItem.dataset.timelineItemId;

      const res = await fetch(
        `${window.location.origin}/api/v1/timeline?cursor=${lastPostId}`,
        {}
      );

      const { timelineItems } = await res.json();

      const filteredTimelineItems = timelineItems.filter(
        (timelineItem) => !loadedTimelineItemIds.includes(`${timelineItem.id}`)
      );

      filteredTimelineItems.forEach((timelineItem) => {
        loadedTimelineItemIds.push(`${timelineItem.id}`);
      });

      const html = filteredTimelineItems
        .map((timelineItem) =>
          createPostHTML(timelineItem.post, `${timelineItem.id}`)
        )
        .join("");

      document.querySelector(".posts").insertAdjacentHTML("beforeend", html);

      observer.unobserve(lastTimelineItem);

      if (filteredTimelineItems.length >= 10) {
        observer.observe(document.querySelector(".posts__item:last-child"));
      }
    }
  }, {});

  observer.observe(document.querySelector(".posts__item:last-child"));
}
