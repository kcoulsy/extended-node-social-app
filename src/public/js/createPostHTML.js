console.log("createPostHTML");
/**
 *
 * @param {import("../../services/posts").PostWithAuthorAndChildren} post
 */
export function createPostHTML(post) {
  const html = `
  <li class="posts__item posts__item--shadow" data-post-id="${post.id}">
  <div class="post__user">
    <a href="/profile/${post.author.username}">
      <img
        class="post__avatar"
        src="https://i.stack.imgur.com/HQwHI.jpg"
        alt="${post.author.username}"
    /></a>
  </div>
  <div class="post__body">
    <h3 class="post__username">
      <a href="/profile/${post.author.username}">
      ${post.author.name}
      </a>
    </h3>
    <p class="post__content">${post.content}</p>
    <p class="post__date">${post.createdAt}</p>
    <div class="post__collab">
    <div class="post__comments">
      <form action="/post" method="post" class="create-comment__form">
        <input
          type="hidden"
          name="parentPostId"
          value="${post.id}"
        />
        <input
          class="input create-comment__form-input"
          type="text"
          name="content"
          placeholder="Add a comment"
        />
        <input
          class="btn btn--primary create-comment__share-btn"
          type="submit"
          value="Reply"
        />
      </form>
      ${
        post.childPosts.length
          ? `<h5>Comments</h5>
        <ul class="comments">
        ${post.childPosts?.map((post) => createPostCommentHTMl(post)).join("")}
        </ul>`
          : ""
      }
    </div>
  </div>
  </div>
</li>`;

  return html;
}

/**
 *
 * @param {import("../../services/posts").PostWithAuthor} post
 */
function createPostCommentHTMl(post) {
  const html = ` <li class="comments__item" data-comment-id="<%= comment.id %>">
  <div class="post__user">
    <a href="/profile/${post.author.username}">
      <img
        class="post__avatar"
        src="https://i.stack.imgur.com/HQwHI.jpg"
        alt="${post.author.username}"
      />
    </a>
  </div>
  <div class="post__body">
    <h3 class="post__username">
      <a href="/profile/${post.author.username}">
      ${post.author.name}
      </a>
    </h3>
    <p class="post__content">${post.content}</p>
    <p class="post__date">${post.createdAt}</p>
  </div>
</li>`;

  return html;
}
