import { initTimelineLoader } from "./timelineLoader.js";

const wallTabs = document.querySelectorAll(".wall-tabs__tab");

const isTabs = wallTabs.length > 0;

let disconnectObserver = initTimelineLoader(
  isTabs ? ".wall-tabs__content--active" : ""
);

wallTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    wallTabs.forEach((tab) => tab.classList.remove("wall-tabs__tab--active"));
    tab.classList.add("wall-tabs__tab--active");

    const activeTabContent = document.querySelector(
      ".wall-tabs__content--active"
    );
    activeTabContent.classList.remove("wall-tabs__content--active");

    disconnectObserver();

    const tabContent = document.querySelector(
      `.wall-tabs__content[data-tab="${tab.dataset.tab}"]`
    );

    tabContent.classList.add("wall-tabs__content--active");

    const apiRoute =
      tab.dataset.tab === "following"
        ? "/api/v1/timeline/following"
        : "/api/v1/timeline";

    disconnectObserver = initTimelineLoader(
      ".wall-tabs__content--active",
      apiRoute
    );
  });
});
