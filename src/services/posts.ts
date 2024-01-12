import prisma from "../db";

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
    },
  });

  if (!parentPostId) {
    await prisma.timelineItem.create({
      data: {
        authorId: userId,
        postId: post.id,
      },
    });
  }

  return post;
}
