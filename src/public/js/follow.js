const followButton = document.querySelector('.profile-header__action--follow')
  || document.querySelector('.profile-header__action--unfollow');

followButton?.addEventListener('click', async (e) => {
  e.preventDefault();

  const { username } = followButton.dataset;
  const isFollowing = followButton.classList.contains(
    'profile-header__action--unfollow',
  );

  const res = await fetch(`/api/v1/user/${username}/follow`, {
    method: 'POST',
    body: JSON.stringify({ follow: !isFollowing }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await res.json();

  if (data.isFollowing) {
    followButton.classList.remove('profile-header__action--follow');
    followButton.classList.add('profile-header__action--unfollow');
    followButton.textContent = 'Unfollow';
  } else {
    followButton.classList.remove('profile-header__action--unfollow');
    followButton.classList.add('profile-header__action--follow');
    followButton.textContent = 'Follow';
  }

  const followerCount = document.querySelector(
    '.profile-header__stat--followers',
  );

  followerCount.textContent = data.followingUsersCount;
});
