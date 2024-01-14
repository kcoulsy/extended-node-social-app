import { PostWithAuthorAndChildren } from "../services/posts";

export function mapPostSortChildPosts(post: PostWithAuthorAndChildren) {
  return {
    ...post,
    childPosts: post.childPosts.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    ),
  };
}
