import { describe } from "node:test";
import { expect, it } from "vitest";
import {
  createReaction,
  deleteReaction,
  getHasUserReactionsToPost,
  getHasUserReactionsToPosts,
  getReactionCountsForPosts,
} from "./reaction";
import { prismaMock } from "../test-mocks";

describe("Reaction service", () => {
  describe("createReaction", () => {
    it("should create a reaction", async () => {
      const data = {
        postId: 1,
        authorId: 1,
        type: "like",
      } as const;

      prismaMock.reaction.findFirst.mockResolvedValueOnce(null);

      prismaMock.reaction.create.mockResolvedValueOnce({
        ...data,
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const reaction = await createReaction(data);

      expect(reaction).toEqual({
        ...data,
        id: 1,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });

    it("should return existing reaction if it exists", async () => {
      const data = {
        postId: 1,
        authorId: 1,
        type: "like",
      } as const;

      prismaMock.reaction.findFirst.mockResolvedValueOnce({
        ...data,
        id: 999,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const reaction = await createReaction(data);

      expect(reaction).toEqual({
        ...data,
        id: 999,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });

      expect(prismaMock.reaction.create).not.toHaveBeenCalled();
    });
  });

  describe("deleteReaction", () => {
    it("should delete a reaction", async () => {
      const data = {
        postId: 1,
        authorId: 1,
        type: "like",
      } as const;

      prismaMock.reaction.findFirst.mockResolvedValueOnce({
        ...data,
        id: 999,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const reaction = await deleteReaction(data);

      expect(reaction).toBe(null);

      expect(prismaMock.reaction.delete).toHaveBeenCalledWith({
        where: {
          id: 999,
        },
      });
    });

    it("should return null if reaction does not exist", async () => {
      const data = {
        postId: 1,
        authorId: 1,
        type: "like",
      } as const;

      prismaMock.reaction.findFirst.mockResolvedValueOnce(null);

      const reaction = await deleteReaction(data);

      expect(reaction).toEqual(null);

      expect(prismaMock.reaction.delete).not.toHaveBeenCalled();
    });
  });

  describe("getReactionCountsForPosts", () => {
    it("should return reaction counts for posts", async () => {
      const postIds = [1, 2];

      // @ts-expect-error
      prismaMock.reaction.groupBy.mockResolvedValueOnce([
        {
          postId: 1,
          authorId: 1,
          type: "like",
          _count: {
            type: 2,
          },
        },
        {
          postId: 1,
          authorId: 3,
          type: "smile",
          _count: {
            type: 1,
          },
        },
        {
          postId: 2,
          authorId: 1,
          type: "like",
          _count: {
            type: 2,
          },
        },
        {
          postId: 2,
          authorId: 3,
          type: "smile",
          _count: {
            type: 1,
          },
        },
      ]);

      const result = await getReactionCountsForPosts(postIds);

      expect(result).toEqual({
        1: {
          like: 2,
          smile: 1,
        },
        2: {
          like: 2,
          smile: 1,
        },
      });
    });

    it("should return empty object if no reaction counts", async () => {
      const postIds = [1, 2];

      // @ts-expect-error
      prismaMock.reaction.groupBy.mockResolvedValueOnce([]);

      const result = await getReactionCountsForPosts(postIds);

      expect(result).toEqual({});
    });
  });

  describe("getReactionCountsForPost", () => {
    it("should return reaction counts for post", async () => {
      const postId = 1;

      // @ts-expect-error
      prismaMock.reaction.groupBy.mockResolvedValueOnce([
        {
          postId: 1,
          authorId: 1,
          type: "like",
          _count: {
            type: 2,
          },
        },
        {
          postId: 1,
          authorId: 3,
          type: "smile",
          _count: {
            type: 1,
          },
        },
      ]);

      const result = await getReactionCountsForPosts([postId]);

      expect(result).toEqual({
        1: {
          like: 2,
          smile: 1,
        },
      });
    });

    it("should return empty object if no reaction counts", async () => {
      const postId = 1;

      // @ts-expect-error
      prismaMock.reaction.groupBy.mockResolvedValueOnce([]);

      const result = await getReactionCountsForPosts([postId]);

      expect(result).toEqual({});
    });
  });

  describe("getHasUserReactionsToPost", () => {
    it("should return object with true values if user has reactions to post", async () => {
      const postId = 1;
      const userId = 1;

      prismaMock.reaction.findMany.mockResolvedValueOnce([
        {
          id: 1,
          postId,
          authorId: userId,
          type: "like",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      const result = await getHasUserReactionsToPost(postId, userId);

      expect(result).toEqual({
        like: true,
      });
    });

    it("should return empty object if user has no reactions to post", async () => {
      const postId = 1;
      const userId = 1;

      prismaMock.reaction.findMany.mockResolvedValueOnce([]);

      const result = await getHasUserReactionsToPost(postId, userId);

      expect(result).toEqual({});
    });
  });

  describe("getHasUserReactionsToPosts", () => {
    it("should return object with true values if user has reactions to posts", async () => {
      const postIds = [1, 2];
      const userId = 1;

      prismaMock.reaction.findMany.mockResolvedValueOnce([
        {
          id: 1,
          postId: postIds[0],
          authorId: userId,
          type: "like",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          postId: postIds[1],
          authorId: userId,
          type: "like",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      const result = await getHasUserReactionsToPosts(postIds, userId);

      expect(result).toEqual({
        [postIds[0]]: {
          like: true,
        },
        [postIds[1]]: {
          like: true,
        },
      });
    });

    it("should return empty object if user has no reactions to posts", async () => {
      const postIds = [1, 2];
      const userId = 1;

      prismaMock.reaction.findMany.mockResolvedValueOnce([]);

      const result = await getHasUserReactionsToPosts(postIds, userId);

      expect(result).toEqual({});
    });
  });
});
