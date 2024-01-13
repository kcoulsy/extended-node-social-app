(async function bootstrap() {
  if (document.querySelector(".homepage")) {
    await import("./homepage.js");
  }

  if (
    document.querySelector(".profile-header__action--unfollow") ||
    document.querySelector(".profile-header__action--follow")
  ) {
    await import("./follow.js");
  }

  if (document.querySelector(".profile")) {
    const timelineLoader = await import("./timelineLoader.js");

    timelineLoader.initTimelineLoader(
      "",
      "/api/v1/timeline/user/" + window.location.pathname.split("/")[2]
    );
  }

  if (document.querySelector(".create-post__form")) {
    await import("./createPost.js");
  }
})();
