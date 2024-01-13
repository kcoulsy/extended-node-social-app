import { bindCreateCommentForms } from "./createComment.js";
import { createPostHTML } from "./createPostHTML.js";
import { bindReactionHandler } from "./reaction.js";
const form = document.querySelector(".create-post__form");

form?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const content = form.content.value;
  const profileUsername =
    document.querySelector("[data-username]")?.dataset.username;

  const res = await fetch("/api/v1/post", {
    method: "POST",
    body: JSON.stringify({
      content,
      targetUsername: profileUsername,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const { post, targetUser } = await res.json();

  const html = createPostHTML(post, "new", targetUser);

  document.querySelector(".posts").insertAdjacentHTML("afterbegin", html);

  form.reset();

  bindCreateCommentForms();
  bindReactionHandler();
});
