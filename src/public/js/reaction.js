export function bindReactionHandler() {
  document.querySelectorAll('.post__reaction-btn').forEach((form) => {
    const newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);
  });

  document.querySelectorAll('.post__reaction-btn').forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();

      const hasReacted = btn.classList.contains('post__reaction-btn--selected');
      // get post id from nearest .posts__item
      const isComment = btn.closest('.comments__item');
      const parentEl = btn.closest(
        isComment ? '.comments__item' : '.posts__item',
      );
      const postId = isComment
        ? btn.closest('.comments__item').dataset.commentId
        : btn.closest('.posts__item').dataset.postId;

      const type = btn.dataset.reaction;

      const res = await fetch(`/api/v1/reaction/${postId}`, {
        method: hasReacted ? 'DELETE' : 'POST',
        body: JSON.stringify({ type }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const { reactions } = await res.json();

      if (hasReacted) {
        btn.classList.remove('post__reaction-btn--selected');
      } else {
        btn.classList.add('post__reaction-btn--selected');
      }

      ['like', 'smile', 'star', 'heart'].forEach((reaction) => {
        const reactionBtn = parentEl.querySelector(
          `.post__reaction-btn[data-reaction=${reaction}]`,
        );

        if (reactions[reaction]) {
          reactionBtn.querySelector('.post__reaction-count').textContent = reactions[reaction];
        } else {
          reactionBtn.querySelector('.post__reaction-count').textContent = 0;
        }
      });
    });
  });
}
