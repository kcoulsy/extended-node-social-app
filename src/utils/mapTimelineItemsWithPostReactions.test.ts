import { describe, expect, it } from "vitest";
import { mapTimelineItemsWithPostReactions } from "./mapTimelineItemsWithPostReactions";
import { TimelineItemWithPostAndChildren } from "../types";

const timeNow = Date.now();
const timeOneHourAgo = timeNow - 1000 * 60 * 60;
const timeOneDayAgo = timeNow - 1000 * 60 * 60 * 24;

const mockTimelineItem: TimelineItemWithPostAndChildren = {
  authorId: 1,
  createdAt: new Date(),
  id: 1,
  postId: 1,
  updatedAt: new Date(),
  author: {
    id: 1,
    username: "username",
    createdAt: new Date(),
    updatedAt: new Date(),
    name: "name",
    password: "password",
  },
  post: {
    id: 1,
    content: "content",
    createdAt: new Date(),
    updatedAt: new Date(),
    authorId: 1,
    targetUserId: null,
    parentPostId: null,
    author: {
      id: 1,
      username: "username",
      createdAt: new Date(),
      updatedAt: new Date(),
      name: "name",
      password: "password",
    },
    childPosts: [
      {
        id: 100,
        content: "child post",
        createdAt: new Date(timeNow),
        updatedAt: new Date(),
        authorId: 1,
        targetUserId: null,
        parentPostId: null,
        author: {
          id: 1,
          username: "username",
          createdAt: new Date(),
          updatedAt: new Date(),
          name: "name",
          password: "password",
        },
      },
      {
        id: 50,
        content: "child post 2",
        createdAt: new Date(timeOneDayAgo),
        updatedAt: new Date(),
        authorId: 1,
        targetUserId: null,
        parentPostId: null,
        author: {
          id: 1,
          username: "username",
          createdAt: new Date(),
          updatedAt: new Date(),
          name: "name",
          password: "password",
        },
      },
      {
        id: 75,
        content: "child post 3",
        createdAt: new Date(timeOneHourAgo),
        updatedAt: new Date(),
        authorId: 1,
        targetUserId: null,
        parentPostId: null,
        author: {
          id: 1,
          username: "username",
          createdAt: new Date(),
          updatedAt: new Date(),
          name: "name",
          password: "password",
        },
      },
    ],
  },
};

describe("mapTimelineItemsWithPostReactions", () => {
  it("should add reactions to post and childPosts", () => {
    const postReactions = {
      1: {
        like: 1,
        star: 2,
      },
      100: {
        like: 5,
        smile: 10,
      },
    };
    const result = mapTimelineItemsWithPostReactions(
      [mockTimelineItem],
      postReactions
    );

    expect(result[0].post.reactions).toEqual({
      like: 1,
      star: 2,
    });

    expect(result[0].post.childPosts[0].reactions).toEqual({
      like: 5,
      smile: 10,
    });
  });

  it("should add userReactions to post and childPosts", () => {
    const userReactions = {
      1: { like: true },
      100: { like: true, smile: true },
    };
    const result = mapTimelineItemsWithPostReactions(
      [mockTimelineItem],
      {},
      userReactions
    );

    expect(result[0].post.userReactions).toEqual({
      like: true,
    });

    expect(result[0].post.childPosts[0].userReactions).toEqual({
      like: true,
      smile: true,
    });
  });
});
