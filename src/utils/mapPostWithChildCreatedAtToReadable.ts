import { intlFormatDistance } from "date-fns";
import { PostWithAuthorAndChildren } from "../services/posts";

export function mapPostWithChildCreatedAtToReadable(
  post: PostWithAuthorAndChildren
) {
  return {
    ...post,
    createdAt: intlFormatDistance(post.createdAt, new Date()),
    childPosts: post.childPosts
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .map((childPost) => ({
        ...childPost,
        createdAt: intlFormatDistance(childPost.createdAt, new Date()),
      })),
  };
}
