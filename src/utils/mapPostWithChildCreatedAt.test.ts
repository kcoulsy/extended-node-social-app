import { describe, expect, it } from "vitest";
import { PostWithAuthor, PostWithAuthorAndChildren } from "../services/posts";
import { mapPostWithChildCreatedAt } from "./mapPostWithChildCreatedAt";

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
    },
  ],
};

describe("mapPostWithChildCreatedAt", () => {
  it("should map post with readable createdAt (now)", () => {
    const result = mapPostWithChildCreatedAt(mockPost);
    expect(result.createdAt).toBe("now");
  });

  it("should map post with readable createdAt (1 hour ago)", () => {
    mockPost.createdAt = new Date(Date.now() - 1000 * 60 * 60);
    const result = mapPostWithChildCreatedAt(mockPost);
    expect(result.createdAt).toBe("1 hour ago");
  });

  it('should map child posts with readable createdAt ("now")', () => {
    const result = mapPostWithChildCreatedAt(mockPost);
    expect(result.childPosts[0].createdAt).toBe("now");
  });

  it('should map child posts with readable createdAt ("1 hour ago")', () => {
    mockPost.childPosts[0].createdAt = new Date(Date.now() - 1000 * 60 * 60);
    const result = mapPostWithChildCreatedAt(mockPost);
    expect(result.childPosts[0].createdAt).toBe("1 hour ago");
  });
});
