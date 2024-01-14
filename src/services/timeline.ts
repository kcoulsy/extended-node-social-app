import { TimelineItem, User } from "@prisma/client";
import prisma from "../db";
import { mapPostSortChildPosts } from "../utils/mapPostSortChildPosts";
import { mapPostWithChildCreatedAt } from "../utils/mapPostWithChildCreatedAt";
import {
  getHasUserReactionsToPosts,
  getReactionCountsForPosts,
} from "./reaction";
import { PostWithAuthorAndChildren } from "./posts";
import { getPostIdsFromTimelineItems } from "../utils/getPostIdsFromTimelineItems";
import { mapTimelineItemsWithPostReactions } from "../utils/mapTimelineItemsWithPostReactions";
import {
  LoggedInUserReactions,
  TimelineItemWithPostAndChildrenWithReactionsCreatedAt,
} from "../types";

export type TimelineItemWithPostAndChildren = TimelineItem & {
  author: User;
  post: PostWithAuthorAndChildren;
};

/**
 * Gets all timeline items for all users
 *
 * @param cursor number; the id of the last timeline item to get
 * @param loggedInUserId number; the id of the logged in user to get their reactions to posts
 * @returns
 */
export async function getAllTimelineItemsPaginated(
  cursor?: number,
  loggedInUserId?: number
): Promise<TimelineItemWithPostAndChildrenWithReactionsCreatedAt[]> {
  const timelineItems = await prisma.timelineItem.findMany({
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

  const postIds = getPostIdsFromTimelineItems(timelineItems);
  const postsReactions = await getReactionCountsForPosts(postIds);
  let userReactions: Record<string, LoggedInUserReactions> = {};
  if (loggedInUserId) {
    userReactions = await getHasUserReactionsToPosts(postIds, loggedInUserId);
  }

  const timelineItemsWithReactions = mapTimelineItemsWithPostReactions(
    timelineItems,
    postsReactions,
    userReactions
  );

  return timelineItemsWithReactions.map((timelineItem) => {
    const postWithSortedChildren = mapPostSortChildPosts(timelineItem.post);
    const post = mapPostWithChildCreatedAt(postWithSortedChildren);
    return {
      ...timelineItem,
      post,
    };
  });
}

/**
 * Gets the timeline items for a specific user for their profile page
 *
 * @param userId number; the id of the user whose timeline items to get
 * @param cursor number; the id of the last timeline item to get
 * @param loggedInUserId number; the id of the logged in user to get their reactions to posts
 * @returns
 */
export async function getUserTimelinePaginated(
  userId: number,
  cursor?: number,
  loggedInUserId?: number
) {
  const timelineItems = await prisma.timelineItem.findMany({
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

  const postIds = getPostIdsFromTimelineItems(timelineItems);
  const postsReactions = await getReactionCountsForPosts(postIds);
  let userReactions: Record<string, LoggedInUserReactions> = {};
  if (loggedInUserId) {
    userReactions = await getHasUserReactionsToPosts(postIds, loggedInUserId);
  }

  const timelineItemsWithReactions = mapTimelineItemsWithPostReactions(
    timelineItems,
    postsReactions,
    userReactions
  );

  return timelineItemsWithReactions.map((timelineItem) => {
    const postWithSortedChildren = mapPostSortChildPosts(timelineItem.post);
    const post = mapPostWithChildCreatedAt(postWithSortedChildren);
    return {
      ...timelineItem,
      post: {
        ...post,
      },
    };
  });
}

/**
 * Gets the timeline items for a specific user for their following timeline
 *
 * @param loggedInUserId number; the id of the logged in user to get their reactions to posts
 * @param cursor
 * @returns
 */
export async function getUsersFollowingTimelinePaginated(
  loggedInUserId: number,
  cursor?: number
) {
  const followingId = await prisma.user.findUnique({
    where: { id: loggedInUserId },
    select: { following: { select: { id: true } } },
  });

  const timelineItems = await prisma.timelineItem.findMany({
    where: {
      OR: [
        {
          authorId: { in: followingId?.following.map((user) => user.id) },
        },
        {
          AND: [
            {
              post: {
                authorId: loggedInUserId,
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

  const postIds = getPostIdsFromTimelineItems(timelineItems);
  const postsReactions = await getReactionCountsForPosts(postIds);
  let userReactions: Record<string, LoggedInUserReactions> = {};
  if (loggedInUserId) {
    userReactions = await getHasUserReactionsToPosts(postIds, loggedInUserId);
  }

  const timelineItemsWithReactions = mapTimelineItemsWithPostReactions(
    timelineItems,
    postsReactions,
    userReactions
  );

  return timelineItemsWithReactions.map((timelineItem) => {
    const postWithSortedChildren = mapPostSortChildPosts(timelineItem.post);
    const post = mapPostWithChildCreatedAt(postWithSortedChildren);
    return {
      ...timelineItem,
      post: {
        ...post,
      },
    };
  });
}
