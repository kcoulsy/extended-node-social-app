import prisma from "../db";
import { mapPostWithChildCreatedAtToReadable } from "../utils/mapPostWithChildCreatedAtToReadable";

export async function getAllTimelineItemsPaginated(cursor?: number) {
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

  return response.map((timelineItem) => ({
    ...timelineItem,
    post: mapPostWithChildCreatedAtToReadable(timelineItem.post),
  }));
}

export async function getUserTimelinePaginated(
  userId: number,
  cursor?: number
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

  return response.map((timelineItem) => ({
    ...timelineItem,
    post: mapPostWithChildCreatedAtToReadable(timelineItem.post),
  }));
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

  return response.map((timelineItem) => ({
    ...timelineItem,
    post: mapPostWithChildCreatedAtToReadable(timelineItem.post),
  }));
}
