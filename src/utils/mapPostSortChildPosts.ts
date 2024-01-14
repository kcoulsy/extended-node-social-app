import { PostWithAuthorAndChildrenWithReactions } from "../types";

export function mapPostSortChildPosts(
  post: PostWithAuthorAndChildrenWithReactions
): PostWithAuthorAndChildrenWithReactions {
  return {
    ...post,
    childPosts: post.childPosts.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    ),
  };
}
