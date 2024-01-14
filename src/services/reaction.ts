import prisma from "../db";
import { LoggedInUserReactions, ReactionCounts } from "../types";

export async function createReaction({
  postId,
  authorId,
  type,
}: {
  postId: number;
  authorId: number;
  type: "like" | "smile" | "star" | "heart";
}) {
  const exisingReaction = await prisma.reaction.findFirst({
    where: {
      postId,
      authorId,
      type,
    },
  });

  if (exisingReaction) {
    return exisingReaction;
  }

  const reaction = await prisma.reaction.create({
    data: {
      postId,
      authorId,
      type,
    },
  });

  return reaction;
}

export async function deleteReaction({
  postId,
  authorId,
  type,
}: {
  postId: number;
  authorId: number;
  type: "like" | "smile" | "star" | "heart";
}) {
  const reaction = await prisma.reaction.findFirst({
    where: {
      postId,
      authorId,
      type,
    },
  });

  if (!reaction) {
    return null;
  }

  await prisma.reaction.delete({
    where: {
      id: reaction.id,
    },
  });

  return null;
}

export async function getReactionCountsForPosts(
  postIds: number[]
): Promise<Record<string, ReactionCounts>> {
  const reactionCounts = await prisma.reaction.groupBy({
    by: ["postId", "type"],
    where: {
      postId: {
        in: postIds,
      },
    },
    _count: {
      type: true,
    },
  });

  // group into an object with type as key and count as value

  const counts = reactionCounts.reduce((acc, curr) => {
    acc[curr.postId] = acc[curr.postId] || {};
    acc[curr.postId][curr.type] = curr._count.type;
    return acc;
  }, {} as Record<string, Record<string, number>>);

  return counts;
}

export async function getReactionCountsForPost(
  postId: number
): Promise<ReactionCounts> {
  const reactionCounts = await prisma.reaction.groupBy({
    by: ["postId", "type"],
    where: {
      postId,
    },
    _count: {
      type: true,
    },
  });

  // group into an object with type as key and count as value

  const counts = reactionCounts.reduce((acc, curr) => {
    acc[curr.type] = curr._count.type;
    return acc;
  }, {} as Record<string, number>);

  return counts;
}

export async function getHasUserReactionsToPost(
  postId: number,
  userId: number
): Promise<LoggedInUserReactions> {
  const reactions = await prisma.reaction.findMany({
    where: {
      postId,
      authorId: userId,
    },
  });

  const hasReactions = reactions.reduce((acc, curr) => {
    acc[curr.type] = true;
    return acc;
  }, {} as Record<string, boolean>);

  return hasReactions;
}

export async function getHasUserReactionsToPosts(
  postIds: number[],
  userId: number
): Promise<Record<string, LoggedInUserReactions>> {
  const reactions = await prisma.reaction.findMany({
    where: {
      postId: {
        in: postIds,
      },
      authorId: userId,
    },
  });

  const hasReactions = reactions.reduce((acc, curr) => {
    acc[curr.postId] = acc[curr.postId] || {};
    acc[curr.postId][curr.type] = true;
    return acc;
  }, {} as Record<string, Record<string, boolean>>);

  return hasReactions;
}
