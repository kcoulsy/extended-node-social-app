import { Post, TimelineItem, User } from "@prisma/client";

export type PostWithAuthorAndChildren = PostWithAuthor & {
  childPosts: PostWithAuthor[];
};

export type PostWithAuthor = Post & {
  author: User;
};

export type TimelineItemWithPostAndChildren = TimelineItem & {
  author: User;
  post: PostWithAuthorAndChildren;
};

export interface LoggedInUserReactions {
  [key: string]: boolean;
}

export interface ReactionCounts {
  [key: string]: number;
}

export type TimelineItemWithPostAndChildrenWithReactions =
  TimelineItemWithPostAndChildren & {
    post: {
      reactions: ReactionCounts;
      userReactions?: LoggedInUserReactions;
      childPosts: {
        reactions: ReactionCounts;
        userReactions?: LoggedInUserReactions;
      }[];
    };
  };

export type PostWithAuthorAndChildrenCreatedAt = Omit<
  PostWithAuthorAndChildren,
  "createdAt" | "childPosts"
> & {
  createdAt: string;
  childPosts: (Omit<PostWithAuthor, "createdAt"> & { createdAt: string })[];
};
