import { createCommentHTML } from './createPostHTML.js';
import { bindReactionHandler } from './reaction.js';

export function bindCreateCommentForms() {
  // clear all submit event listeners
  document.querySelectorAll('.create-comment__form').forEach((form) => {
    const newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);
  });

  document.querySelectorAll('.create-comment__form').forEach((form) => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const parentPostId = form.parentPostId.value;
      const content = form.content.value;

      console.log({
        parentPostId,
        content,
      });
      const res = await fetch(`/api/v1/post/${parentPostId}/comment`, {
        method: 'POST',
        body: JSON.stringify({
          content,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const { post } = await res.json();

      const html = createCommentHTML(post);
      // const html = createCommentHTML(comment);

      const commentUl = document.querySelector(
        `.comments[data-post-id="${parentPostId}"]`,
      );

      if (commentUl) {
        commentUl.insertAdjacentHTML('afterbegin', html);
      } else {
        form.insertAdjacentHTML(
          'afterend',
          `<h5>Comments</h5><ul class="comments" data-post-id="${parentPostId}">${html}</ul>`,
        );
      }

      form.reset();

      bindCreateCommentForms();
      bindReactionHandler();
    });
  });
}
