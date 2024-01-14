import { describe, expect, it } from "vitest";
import { prismaMock } from "../test-mocks";
import {
  getAllTimelineItemsPaginated,
  getUserTimelinePaginated,
  getUsersFollowingTimelinePaginated,
} from "./timeline";
import { beforeEach } from "node:test";

const oneHourAgo = Date.now() - 1000 * 60 * 60;
const twoHoursAgo = Date.now() - 1000 * 60 * 60 * 2;

describe("timeline service", () => {
  describe("getAllTimelineItemsPaginated", () => {
    it("should return timeline items with readable createdAts", async () => {
      prismaMock.timelineItem.findMany.mockResolvedValueOnce([
        {
          id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          authorId: 1,
          // @ts-expect-error
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
            createdAt: new Date(oneHourAgo),
            updatedAt: new Date(),
            authorId: 1,
            targetUserId: null,
            parentPostId: null,
            childPosts: [
              {
                id: 1,
                content: "child post",
                createdAt: new Date(),
                updatedAt: new Date(),
                authorId: 1,
                targetUserId: null,
                parentPostId: null,
              },
            ],
          },
        },
      ]);

      // @ts-expect-error
      prismaMock.reaction.groupBy.mockResolvedValueOnce([]);

      const result = await getAllTimelineItemsPaginated();

      expect(result[0].post.createdAt).toBe("1 hour ago");
      expect(result[0].post.childPosts[0].createdAt).toBe("now");
    });

    it("should return reaction counts for posts and childPosts", async () => {
      prismaMock.timelineItem.findMany.mockResolvedValueOnce([
        {
          id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          authorId: 1,
          // @ts-expect-error
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
            createdAt: new Date(oneHourAgo),
            updatedAt: new Date(),
            authorId: 1,
            targetUserId: null,
            parentPostId: null,
            childPosts: [
              {
                id: 2,
                content: "child post",
                createdAt: new Date(),
                updatedAt: new Date(),
                authorId: 1,
                targetUserId: null,
                parentPostId: null,
              },
            ],
          },
        },
      ]);

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
          type: "heart",
          _count: {
            type: 1,
          },
        },
      ]);

      const result = await getAllTimelineItemsPaginated();

      expect(result[0].post.reactions).toEqual({
        like: 2,
        smile: 1,
      });

      expect(result[0].post.childPosts[0].reactions).toEqual({
        like: 2,
        heart: 1,
      });
    });

    it("should sort childPosts by createdAt", async () => {
      prismaMock.timelineItem.findMany.mockResolvedValueOnce([
        {
          id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          authorId: 1,
          // @ts-expect-error
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
            createdAt: new Date(oneHourAgo),
            updatedAt: new Date(),
            authorId: 1,
            targetUserId: null,
            parentPostId: null,
            childPosts: [
              {
                id: 10,
                content: "child post",
                createdAt: new Date(),
                updatedAt: new Date(),
                authorId: 1,
                targetUserId: null,
                parentPostId: null,
              },
              {
                id: 20,
                content: "child post 2",
                createdAt: new Date(twoHoursAgo),
                updatedAt: new Date(),
                authorId: 1,
                targetUserId: null,
                parentPostId: null,
              },
              {
                id: 30,
                content: "child post 3",
                createdAt: new Date(oneHourAgo),
                updatedAt: new Date(),
                authorId: 1,
                targetUserId: null,
                parentPostId: null,
              },
            ],
          },
        },
      ]);

      // @ts-expect-error
      prismaMock.reaction.groupBy.mockResolvedValueOnce([]);

      const result = await getAllTimelineItemsPaginated();

      expect(result[0].post.childPosts[0].id).toBe(10);
      expect(result[0].post.childPosts[1].id).toBe(30);
      expect(result[0].post.childPosts[2].id).toBe(20);
    });

    it("should sort posts by createdAt", async () => {
      prismaMock.timelineItem.findMany.mockResolvedValueOnce([
        {
          id: 1,
          createdAt: new Date(oneHourAgo),
          updatedAt: new Date(),
          authorId: 1,
          // @ts-expect-error
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
            createdAt: new Date(oneHourAgo),
            updatedAt: new Date(),
            authorId: 1,
            targetUserId: null,
            parentPostId: null,
            childPosts: [],
          },
        },
        {
          id: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
          authorId: 1,
          // @ts-expect-error
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
            childPosts: [],
          },
        },
        {
          id: 3,
          createdAt: new Date(twoHoursAgo),
          updatedAt: new Date(),
          authorId: 1,
          // @ts-expect-error
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
            createdAt: new Date(twoHoursAgo),
            updatedAt: new Date(),
            authorId: 1,
            targetUserId: null,
            parentPostId: null,
            childPosts: [],
          },
        },
      ]);

      // @ts-expect-error
      prismaMock.reaction.groupBy.mockResolvedValueOnce([]);

      const result = await getAllTimelineItemsPaginated();

      expect(result[0].id).toBe(1);
      expect(result[1].id).toBe(2);
      expect(result[2].id).toBe(3);
    });
  });

  describe("getUserTimelinePaginated", () => {
    it("should return timeline items with readable createdAts", async () => {
      prismaMock.timelineItem.findMany.mockResolvedValueOnce([
        {
          id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          authorId: 1,
          // @ts-expect-error
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
            createdAt: new Date(oneHourAgo),
            updatedAt: new Date(),
            authorId: 1,
            targetUserId: null,
            parentPostId: null,
            childPosts: [
              {
                id: 1,
                content: "child post",
                createdAt: new Date(),
                updatedAt: new Date(),
                authorId: 1,
                targetUserId: null,
                parentPostId: null,
              },
            ],
          },
        },
      ]);

      // @ts-expect-error
      prismaMock.reaction.groupBy.mockResolvedValueOnce([]);

      const userId = 1;

      const result = await getUserTimelinePaginated(userId);

      expect(result[0].post.createdAt).toBe("1 hour ago");
      expect(result[0].post.childPosts[0].createdAt).toBe("now");
    });

    it("should return reaction counts for posts and childPosts", async () => {
      prismaMock.timelineItem.findMany.mockResolvedValueOnce([
        {
          id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          authorId: 1,
          // @ts-expect-error
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
            createdAt: new Date(oneHourAgo),
            updatedAt: new Date(),
            authorId: 1,
            targetUserId: null,
            parentPostId: null,
            childPosts: [
              {
                id: 2,
                content: "child post",
                createdAt: new Date(),
                updatedAt: new Date(),
                authorId: 1,
                targetUserId: null,
                parentPostId: null,
              },
            ],
          },
        },
      ]);

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
          type: "heart",
          _count: {
            type: 1,
          },
        },
      ]);

      const userId = 1;

      const result = await getUserTimelinePaginated(userId);

      expect(result[0].post.reactions).toEqual({
        like: 2,
        smile: 1,
      });

      expect(result[0].post.childPosts[0].reactions).toEqual({
        like: 2,
        heart: 1,
      });
    });

    it("should sort childPosts by createdAt", async () => {
      prismaMock.timelineItem.findMany.mockResolvedValueOnce([
        {
          id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          authorId: 1,
          // @ts-expect-error
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
            createdAt: new Date(oneHourAgo),
            updatedAt: new Date(),
            authorId: 1,
            targetUserId: null,
            parentPostId: null,
            childPosts: [
              {
                id: 10,
                content: "child post",
                createdAt: new Date(),
                updatedAt: new Date(),
                authorId: 1,
                targetUserId: null,
                parentPostId: null,
              },
              {
                id: 20,
                content: "child post 2",
                createdAt: new Date(twoHoursAgo),
                updatedAt: new Date(),
                authorId: 1,
                targetUserId: null,
                parentPostId: null,
              },
              {
                id: 30,
                content: "child post 3",
                createdAt: new Date(oneHourAgo),
                updatedAt: new Date(),
                authorId: 1,
                targetUserId: null,
                parentPostId: null,
              },
            ],
          },
        },
      ]);

      // @ts-expect-error
      prismaMock.reaction.groupBy.mockResolvedValueOnce([]);

      const userId = 1;

      const result = await getUserTimelinePaginated(userId);

      expect(result[0].post.childPosts[0].id).toBe(10);
      expect(result[0].post.childPosts[1].id).toBe(30);
      expect(result[0].post.childPosts[2].id).toBe(20);
    });

    it("should sort posts by createdAt", async () => {
      prismaMock.timelineItem.findMany.mockResolvedValueOnce([
        {
          id: 1,
          createdAt: new Date(oneHourAgo),
          updatedAt: new Date(),
          authorId: 1,
          // @ts-expect-error
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
            createdAt: new Date(oneHourAgo),
            updatedAt: new Date(),
            authorId: 1,
            targetUserId: null,
            parentPostId: null,
            childPosts: [],
          },
        },
        {
          id: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
          authorId: 1,
          // @ts-expect-error
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
            childPosts: [],
          },
        },
        {
          id: 3,
          createdAt: new Date(twoHoursAgo),
          updatedAt: new Date(),
          authorId: 1,
          // @ts-expect-error
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
            createdAt: new Date(twoHoursAgo),
            updatedAt: new Date(),
            authorId: 1,
            targetUserId: null,
            parentPostId: null,
            childPosts: [],
          },
        },
      ]);

      // @ts-expect-error
      prismaMock.reaction.groupBy.mockResolvedValueOnce([]);

      const userId = 1;

      const result = await getUserTimelinePaginated(userId);

      expect(result[0].id).toBe(1);
      expect(result[1].id).toBe(2);
      expect(result[2].id).toBe(3);
    });
  });

  describe("getUsersFollowingTimelinePaginated", () => {
    it("should return timeline items with readable createdAts", async () => {
      prismaMock.timelineItem.findMany.mockResolvedValueOnce([
        {
          id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          authorId: 1,
          // @ts-expect-error
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
            createdAt: new Date(oneHourAgo),
            updatedAt: new Date(),
            authorId: 1,
            targetUserId: null,
            parentPostId: null,
            childPosts: [
              {
                id: 1,
                content: "child post",
                createdAt: new Date(),
                updatedAt: new Date(),
                authorId: 1,
                targetUserId: null,
                parentPostId: null,
              },
            ],
          },
        },
      ]);

      // @ts-expect-error
      prismaMock.reaction.groupBy.mockResolvedValueOnce([]);

      prismaMock.reaction.findMany.mockResolvedValueOnce([]);

      const userId = 1;

      const result = await getUsersFollowingTimelinePaginated(userId);

      expect(result[0].post.createdAt).toBe("1 hour ago");
      expect(result[0].post.childPosts[0].createdAt).toBe("now");
    });

    it("should return reaction counts for posts and childPosts", async () => {
      prismaMock.timelineItem.findMany.mockResolvedValueOnce([
        {
          id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          authorId: 1,
          // @ts-expect-error
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
            createdAt: new Date(oneHourAgo),
            updatedAt: new Date(),
            authorId: 1,
            targetUserId: null,
            parentPostId: null,
            childPosts: [
              {
                id: 2,
                content: "child post",
                createdAt: new Date(),
                updatedAt: new Date(),
                authorId: 1,
                targetUserId: null,
                parentPostId: null,
              },
            ],
          },
        },
      ]);

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
          type: "heart",
          _count: {
            type: 1,
          },
        },
      ]);

      prismaMock.reaction.findMany.mockResolvedValueOnce([]);

      const userId = 1;

      const result = await getUsersFollowingTimelinePaginated(userId);

      expect(result[0].post.reactions).toEqual({
        like: 2,
        smile: 1,
      });

      expect(result[0].post.childPosts[0].reactions).toEqual({
        like: 2,
        heart: 1,
      });
    });

    it("should sort childPosts by createdAt", async () => {
      prismaMock.timelineItem.findMany.mockResolvedValueOnce([
        {
          id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          authorId: 1,
          // @ts-expect-error
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
            createdAt: new Date(oneHourAgo),
            updatedAt: new Date(),
            authorId: 1,
            targetUserId: null,
            parentPostId: null,
            childPosts: [
              {
                id: 10,
                content: "child post",
                createdAt: new Date(),
                updatedAt: new Date(),
                authorId: 1,
                targetUserId: null,
                parentPostId: null,
              },
              {
                id: 20,
                content: "child post 2",
                createdAt: new Date(twoHoursAgo),
                updatedAt: new Date(),
                authorId: 1,
                targetUserId: null,
                parentPostId: null,
              },
              {
                id: 30,
                content: "child post 3",
                createdAt: new Date(oneHourAgo),
                updatedAt: new Date(),
                authorId: 1,
                targetUserId: null,
                parentPostId: null,
              },
            ],
          },
        },
      ]);

      // @ts-expect-error
      prismaMock.reaction.groupBy.mockResolvedValueOnce([]);

      prismaMock.reaction.findMany.mockResolvedValueOnce([]);

      const userId = 1;

      const result = await getUsersFollowingTimelinePaginated(userId);

      expect(result[0].post.childPosts[0].id).toBe(10);
      expect(result[0].post.childPosts[1].id).toBe(30);
      expect(result[0].post.childPosts[2].id).toBe(20);
    });

    it("should sort posts by createdAt", async () => {
      prismaMock.timelineItem.findMany.mockResolvedValueOnce([
        {
          id: 1,
          createdAt: new Date(oneHourAgo),
          updatedAt: new Date(),
          authorId: 1,
          // @ts-expect-error
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
            createdAt: new Date(oneHourAgo),
            updatedAt: new Date(),
            authorId: 1,
            targetUserId: null,
            parentPostId: null,
            childPosts: [],
          },
        },
        {
          id: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
          authorId: 1,
          // @ts-expect-error
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
            childPosts: [],
          },
        },
        {
          id: 3,
          createdAt: new Date(twoHoursAgo),
          updatedAt: new Date(),
          authorId: 1,
          // @ts-expect-error
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
            createdAt: new Date(twoHoursAgo),
            updatedAt: new Date(),
            authorId: 1,
            targetUserId: null,
            parentPostId: null,
            childPosts: [],
          },
        },
      ]);

      // @ts-expect-error
      prismaMock.reaction.groupBy.mockResolvedValueOnce([]);

      prismaMock.reaction.findMany.mockResolvedValueOnce([]);

      const userId = 1;

      const result = await getUsersFollowingTimelinePaginated(userId);

      expect(result[0].id).toBe(1);
      expect(result[1].id).toBe(2);
      expect(result[2].id).toBe(3);
    });
  });
});
