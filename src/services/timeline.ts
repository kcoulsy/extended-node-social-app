import prisma from "../db";
import { mapPostWithChildCreatedAtToReadable } from "../utils/mapPostWithChildCreatedAtToReadable";
import {
  getHasUserReactionsToPosts,
  getReactionCountsForPosts,
} from "./reaction";

export async function getAllTimelineItemsPaginated(
  cursor?: number,
  userId?: number
) {
  const response = await prisma.timelineItem.findMany({
    take: 10,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { id: "desc" },
    include: {
      author: true,
      post: {
        include: {
          author: true,
          childPosts: {
            include: { author: true },
          },
        },
      },
    },
  });

  const postIds = response.reduce((acc, item) => {
    if (item.post) {
      acc.push(item.post.id);

      if (item.post.childPosts) {
        acc.push(...item.post.childPosts.map((p) => p.id));
      }
    }
    return acc;
  }, [] as number[]);

  const postsReactions = await getReactionCountsForPosts(postIds);

  let userReactions: { [key: string]: Record<string, boolean> } | undefined =
    undefined;

  if (userId) {
    userReactions = await getHasUserReactionsToPosts(postIds, userId);
  }

  return response.map((timelineItem) => {
    const post = mapPostWithChildCreatedAtToReadable(timelineItem.post);
    return {
      ...timelineItem,
      post: {
        ...post,
        reactions: postsReactions[post.id],
        userReactions: userReactions?.[post.id],
        childPosts: post.childPosts.map((childPost) => ({
          ...childPost,
          reactions: postsReactions[childPost.id],
          userReactions: userReactions?.[childPost.id],
        })),
      },
    };
  });
}

export async function getUserTimelinePaginated(
  userId: number,
  cursor?: number,
  loggedInUserId?: number
) {
  const response = await prisma.timelineItem.findMany({
    where: {
      OR: [
        {
          authorId: userId,
        },
        {
          AND: [
            {
              post: {
                authorId: userId,
              },
            },
            {
              post: {
                parentPostId: null,
              },
            },
          ],
        },
      ],
    },
    take: 10,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { id: "desc" },
    include: {
      author: true,
      post: {
        include: {
          author: true,
          childPosts: {
            include: { author: true },
          },
        },
      },
    },
  });

  const postIds = response.reduce((acc, item) => {
    if (item.post) {
      acc.push(item.post.id);

      if (item.post.childPosts) {
        acc.push(...item.post.childPosts.map((p) => p.id));
      }
    }
    return acc;
  }, [] as number[]);

  const postsReactions = await getReactionCountsForPosts(postIds);

  let userReactions: { [key: string]: Record<string, boolean> } | undefined =
    undefined;

  if (loggedInUserId) {
    userReactions = await getHasUserReactionsToPosts(postIds, loggedInUserId);
  }

  return response.map((timelineItem) => {
    const post = mapPostWithChildCreatedAtToReadable(timelineItem.post);
    return {
      ...timelineItem,
      post: {
        ...post,
        reactions: postsReactions[post.id],
        userReactions: userReactions?.[post.id],
        childPosts: post.childPosts.map((childPost) => ({
          ...childPost,
          reactions: postsReactions[childPost.id],
          userReactions: userReactions?.[childPost.id],
        })),
      },
    };
  });
}

export async function getUsersFollowingTimelinePaginated(
  userId: number,
  cursor?: number
) {
  const followingId = await prisma.user.findUnique({
    where: { id: userId },
    select: { following: { select: { id: true } } },
  });

  const response = await prisma.timelineItem.findMany({
    where: {
      OR: [
        {
          authorId: { in: followingId?.following.map((user) => user.id) },
        },
        {
          AND: [
            {
              post: {
                authorId: userId,
              },
            },
            {
              post: {
                parentPostId: null,
              },
            },
          ],
        },
      ],
    },
    take: 10,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { id: "desc" },
    include: {
      author: true,
      post: {
        include: {
          author: true,
          childPosts: {
            include: { author: true },
          },
        },
      },
    },
  });

  const postIds = response.reduce((acc, item) => {
    if (item.post) {
      acc.push(item.post.id);

      if (item.post.childPosts) {
        acc.push(...item.post.childPosts.map((p) => p.id));
      }
    }
    return acc;
  }, [] as number[]);

  const postsReactions = await getReactionCountsForPosts(postIds);

  let userReactions: { [key: string]: Record<string, boolean> } | undefined =
    undefined;

  if (userId) {
    userReactions = await getHasUserReactionsToPosts(postIds, userId);
  }

  return response.map((timelineItem) => {
    const post = mapPostWithChildCreatedAtToReadable(timelineItem.post);
    return {
      ...timelineItem,
      post: {
        ...post,
        reactions: postsReactions[post.id],
        userReactions: userReactions?.[post.id],
        childPosts: post.childPosts.map((childPost) => ({
          ...childPost,
          reactions: postsReactions[childPost.id],
          userReactions: userReactions?.[childPost.id],
        })),
      },
    };
  });
}
