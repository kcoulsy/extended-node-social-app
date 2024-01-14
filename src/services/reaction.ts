import prisma from '../db';
import { LoggedInUserReactions, ReactionCounts } from '../types';

interface CreateReactionInput {
  postId: number;
  authorId: number;
  type: 'like' | 'smile' | 'star' | 'heart';
}

/**
 * Adds a reaction to a post if it doesn't exist.
 * If it does exist, it returns the existing reaction.
 *
 * @param {CreateReactionInput}
 * @returns {Promise<Reaction>}
 */
export async function createReaction({
  postId,
  authorId,
  type,
}: CreateReactionInput) {
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

/**
 * Deletes a reaction if it exists.
 *
 * @param {CreateReactionInput}
 * @returns {Promise<null>}
 */
export async function deleteReaction({
  postId,
  authorId,
  type,
}: {
  postId: number;
  authorId: number;
  type: 'like' | 'smile' | 'star' | 'heart';
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

/**
 * Gets the reaction counts for a list of posts
 *
 * @param postIds number[]; the ids of the posts to get the reaction counts for
 * @returns {Promise<Record<string, ReactionCounts>>}
 */
export async function getReactionCountsForPosts(
  postIds: number[],
): Promise<Record<string, ReactionCounts>> {
  const reactionCounts = await prisma.reaction.groupBy({
    by: ['postId', 'type'],
    where: {
      postId: {
        in: postIds,
      },
    },
    _count: {
      type: true,
    },
  });

  const counts = reactionCounts.reduce(
    (acc, curr) => {
      acc[curr.postId] = acc[curr.postId] || {};
      acc[curr.postId][curr.type] = curr._count.type;
      return acc;
    },
    {} as Record<string, Record<string, number>>,
  );

  return counts;
}

/**
 * Gets the reaction counts for a single post
 *
 * @param postId number; the id of the post to get the reaction counts for
 * @returns {Promise<ReactionCounts>}
 */
export async function getReactionCountsForPost(
  postId: number,
): Promise<ReactionCounts> {
  const reactionCounts = await prisma.reaction.groupBy({
    by: ['postId', 'type'],
    where: {
      postId,
    },
    _count: {
      type: true,
    },
  });

  const counts = reactionCounts.reduce(
    (acc, curr) => {
      acc[curr.type] = curr._count.type;
      return acc;
    },
    {} as Record<string, number>,
  );

  return counts;
}

/**
 * Gets whether the logged in user has reactions to a list of posts

 * @param postId number; the id of the post to get the reaction counts for
 * @param userId number; the id of the user to get the reactions for
 * @returns {Promise<LoggedInUserReactions>}
 */
export async function getHasUserReactionsToPost(
  postId: number,
  userId: number,
): Promise<LoggedInUserReactions> {
  const reactions = await prisma.reaction.findMany({
    where: {
      postId,
      authorId: userId,
    },
  });

  const hasReactions = reactions.reduce(
    (acc, curr) => {
      acc[curr.type] = true;
      return acc;
    },
    {} as Record<string, boolean>,
  );

  return hasReactions;
}

/**
 * Gets whether the logged in user has reactions to a list of posts
 *
 * @param postIds number[]; the ids of the posts to get the reaction counts for
 * @param userId number; the id of the user to get the reactions for
 * @returns {Promise<Record<string, LoggedInUserReactions>>}
 */
export async function getHasUserReactionsToPosts(
  postIds: number[],
  userId: number,
): Promise<Record<string, LoggedInUserReactions>> {
  const reactions = await prisma.reaction.findMany({
    where: {
      postId: {
        in: postIds,
      },
      authorId: userId,
    },
  });

  const hasReactions = reactions.reduce(
    (acc, curr) => {
      acc[curr.postId] = acc[curr.postId] || {};
      acc[curr.postId][curr.type] = true;
      return acc;
    },
    {} as Record<string, Record<string, boolean>>,
  );

  return hasReactions;
}
