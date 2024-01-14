import { describe, expect, it } from "vitest";
import { PostWithAuthor, PostWithAuthorAndChildren } from "../services/posts";
import { mapPostWithChildCreatedAt } from "./mapPostWithChildCreatedAt";
import { mapPostSortChildPosts } from "./mapPostSortChildPosts";

const timeNow = Date.now();
const timeOneHourAgo = timeNow - 1000 * 60 * 60;
const timeOneDayAgo = timeNow - 1000 * 60 * 60 * 24;

const mockPost: PostWithAuthorAndChildren = {
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
      id: 1,
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
      id: 2,
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
      id: 3,
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
};

describe("mapPostSortChildPost", () => {
  it("should map post with readable createdAt (now)", () => {
    const result = mapPostSortChildPosts(mockPost);
    expect(result.childPosts[0].id).toBe(1);
    expect(result.childPosts[1].id).toBe(3);
    expect(result.childPosts[2].id).toBe(2);
  });
});
