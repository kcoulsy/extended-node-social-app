(async function bootstrap() {
  if (
    document.querySelector(".profile-header__action--unfollow") ||
    document.querySelector(".profile-header__action--follow")
  ) {
    await import("./follow.js");
  }
})();
