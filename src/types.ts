import { Post, TimelineItem, User } from '@prisma/client';

export type PostWithAuthorAndChildren = PostWithAuthor & {
  childPosts: PostWithAuthor[];
};

export type PostWithAuthor = Post & {
  author: User;
};

export type PostWithAuthorAndReactions = PostWithAuthor & {
  reactions: Record<string, number>;
  userReactions?: LoggedInUserReactions;
};

export type PostWithAuthorAndChildrenWithReactions =
  PostWithAuthorAndReactions & {
    childPosts: PostWithAuthorAndReactions[];
  };

export type PostWithAuthorAndReactionsCreatedAt = Omit<
  PostWithAuthorAndReactions,
  'createdAt'
> & { createdAt: string };

export type PostWithAuthorAndChildrenWithReactionsCreatedAt =
  PostWithAuthorAndReactionsCreatedAt & {
    childPosts: PostWithAuthorAndReactionsCreatedAt[];
  };

export type TimelineItemWithPostAndChildren = TimelineItem & {
  author: User;
  post: PostWithAuthorAndChildren;
};

export type TimelineItemWithPostWithAuthorAndChildrenWithReactions =
  TimelineItem & {
    author: User;
    post: PostWithAuthorAndChildrenWithReactions;
  };

export type TimelineItemWithPostAndChildrenWithReactionsCreatedAt =
  TimelineItem & {
    author: User;
    post: PostWithAuthorAndChildrenWithReactionsCreatedAt;
  };

export interface LoggedInUserReactions {
  [key: string]: boolean;
}

export interface ReactionCounts {
  [key: string]: number;
}
