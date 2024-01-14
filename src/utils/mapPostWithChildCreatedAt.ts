import { intlFormatDistance } from "date-fns";
import { PostWithAuthorAndChildren } from "../services/posts";

type ChildPosts = PostWithAuthorAndChildren["childPosts"];

export type PostWithAuthorAndChildrenCreatedAt = Omit<
  PostWithAuthorAndChildren,
  "createdAt" | "childPosts"
> & {
  createdAt: string;
  childPosts: (Omit<ChildPosts[number], "createdAt"> & { createdAt: string })[];
};

export function mapPostWithChildCreatedAt(
  post: PostWithAuthorAndChildren
): PostWithAuthorAndChildrenCreatedAt {
  return {
    ...post,
    createdAt: intlFormatDistance(post.createdAt, new Date()),
    childPosts: post.childPosts.map((childPost) => ({
      ...childPost,
      createdAt: intlFormatDistance(childPost.createdAt, new Date()),
    })),
  };
}
