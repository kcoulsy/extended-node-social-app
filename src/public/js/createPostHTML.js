import "./ejs.js";

const template = await fetch(
  window.location.origin + "/assets/views/partials/timelineItem.ejs"
).then((res) => res.text());

/**
 *
 * @param {import("../../services/posts").PostWithAuthorAndChildren} post
 * @param {string} timelineItemId
 */
export function createPostHTML(post, timelineItemId) {
  return ejs.render(template, {
    timelineItem: {
      id: timelineItemId,
      post: post,
      user: window.user,
    },
  });
}
