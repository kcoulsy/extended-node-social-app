import "./ejs.js";

const timelineItemTemplate = await fetch(
  window.location.origin + "/assets/views/partials/timelineItem.ejs"
).then((res) => res.text());

const timelineItemCommentTemplate = await fetch(
  window.location.origin + "/assets/views/partials/timelineItemComment.ejs"
).then((res) => res.text());

/**
 *
 * @param {import("../../services/posts").PostWithAuthorAndChildren} post
 * @param {string} timelineItemId
 */
export function createPostHTML(post, timelineItemId, user) {
  return ejs.render(
    timelineItemTemplate,
    {
      timelineItem: {
        id: timelineItemId,
        post: post,
        user: user || window.user,
        author: user || window.user,
      },
    },
    {
      includer: (path, data, ...rest) => {
        if (path === "timelineItemComment") {
          return { filename: path, template: timelineItemCommentTemplate };
        }
        return { filename: path, template: "" };
      },
    }
  );
}

export function createCommentHTML(comment) {
  return ejs.render(timelineItemCommentTemplate, {
    comment,
    user: window.user,
  });
}
