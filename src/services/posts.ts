import { Post, User } from "@prisma/client";
import prisma from "../db";
import { mapPostWithChildCreatedAtToReadable } from "../utils/mapPostWithChildCreatedAtToReadable";

export type PostWithAuthorAndChildren = PostWithAuthor & {
  childPosts: PostWithAuthor[];
};

export type PostWithAuthor = Post & {
  author: User;
};

export async function createPost({
  content,
  parentPostId,
  userId,
  targetUserId,
}: {
  content: string;
  parentPostId?: string;
  userId: number;
  targetUserId?: number;
}) {
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

  return mapPostWithChildCreatedAtToReadable(post);
}
