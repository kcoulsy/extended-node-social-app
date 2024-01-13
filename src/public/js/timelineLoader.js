import { createPostHTML } from "./createPostHTML.js";

export function initTimelineLoader(
  container = "",
  apiRoute = "/api/v1/timeline"
) {
  console.log("initing observer");
  const allInitialPosts = document.querySelectorAll(
    `${container} .posts__item`
  );
  const loadedTimelineItemIds = [...allInitialPosts].map(
    (post) => post.dataset.timelineItemId
  );

  if (!!window.IntersectionObserver) {
    const observer = new IntersectionObserver(async (entries) => {
      const entry = entries[0];

      if (entry.isIntersecting) {
        const lastTimelineItem = document.querySelector(
          `${container} .posts__item:last-child`
        );

        const lastPostId = lastTimelineItem.dataset.timelineItemId;

        const res = await fetch(
          `${window.location.origin}${apiRoute}?cursor=${lastPostId}`,
          {}
        );

        const { timelineItems } = await res.json();

        const filteredTimelineItems = timelineItems.filter(
          (timelineItem) =>
            !loadedTimelineItemIds.includes(`${timelineItem.id}`)
        );

        filteredTimelineItems.forEach((timelineItem) => {
          loadedTimelineItemIds.push(`${timelineItem.id}`);
        });

        const html = filteredTimelineItems
          .map((timelineItem) =>
            createPostHTML(timelineItem.post, `${timelineItem.id}`)
          )
          .join("");

        document
          .querySelector(`${container} .posts`)
          .insertAdjacentHTML("beforeend", html);

        observer.unobserve(lastTimelineItem);

        if (filteredTimelineItems.length >= 10) {
          observer.observe(
            document.querySelector(`${container} .posts__item:last-child`)
          );
        }
      }
    }, {});

    if (loadedTimelineItemIds.length >= 10) {
      observer.observe(
        document.querySelector(`${container} .posts__item:last-child`)
      );
    }

    return () => {
      console.log("disconnecting observer");
      return observer.disconnect();
    };
  }

  return () => {};
}
