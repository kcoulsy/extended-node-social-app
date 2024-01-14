import { intlFormatDistance } from 'date-fns';
import {
  PostWithAuthorAndChildrenWithReactions,
  PostWithAuthorAndChildrenWithReactionsCreatedAt,
} from '../types';

export function mapPostWithChildCreatedAt(
  post: PostWithAuthorAndChildrenWithReactions,
): PostWithAuthorAndChildrenWithReactionsCreatedAt {
  return {
    ...post,
    createdAt: intlFormatDistance(post.createdAt, new Date()),
    childPosts: post.childPosts.map((childPost) => ({
      ...childPost,
      createdAt: intlFormatDistance(childPost.createdAt, new Date()),
    })),
  };
}
