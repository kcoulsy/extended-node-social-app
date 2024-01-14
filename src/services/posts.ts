import { Post, User } from "@prisma/client";
import prisma from "../db";
import { mapPostWithChildCreatedAt } from "../utils/mapPostWithChildCreatedAt";
import { mapPostSortChildPosts } from "../utils/mapPostSortChildPosts";

export type PostWithAuthorAndChildren = PostWithAuthor & {
  childPosts: PostWithAuthor[];
};

export type PostWithAuthor = Post & {
  author: User;
};

interface CreatePostInput {
  content: string;
  parentPostId?: string;
  userId: number;
  targetUserId?: number;
}

/**
 * Creates a post and returns it with the author and child posts,
 * where the child posts are sorted by createdAt date and
 * the createdAt date is formatted to be human readable.
 *
 * @param {CreatePostInput}
 * @returns {Promise<PostWithAuthorAndChildrenWithReactionsCreatedAt>}
 */
export async function createPost({
  content,
  parentPostId,
  userId,
  targetUserId,
}: CreatePostInput) {
  const post = await prisma.post.create({
    data: {
      content,
      authorId: userId,
      parentPostId: parentPostId ? parseInt(parentPostId) : undefined,
      targetUserId: targetUserId ? targetUserId : undefined,
    },
    include: {
      author: true,
      childPosts: {
        include: {
          author: true,
        },
      },
    },
  });

  if (!parentPostId) {
    await prisma.timelineItem.create({
      data: {
        authorId: targetUserId || userId,
        postId: post.id,
      },
    });
  }

  const postWithSortedChildren = mapPostSortChildPosts({
    ...post,
    reactions: {},
    childPosts: post.childPosts.map((childPost) => ({
      ...childPost,
      reactions: {},
    })),
  });
  return mapPostWithChildCreatedAt(postWithSortedChildren);
}
