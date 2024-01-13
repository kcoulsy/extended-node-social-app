import { createPostHTML } from "./createPostHTML.js";
const form = document.querySelector(".create-post__form");
const posts = document.querySelector(".posts");

form?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const content = form.content.value;

  const res = await fetch("/api/v1/post", {
    method: "POST",
    body: JSON.stringify({
      content,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const { post } = await res.json();

  const html = createPostHTML(post);

  posts.insertAdjacentHTML("afterbegin", html);

  form.reset();
});