import { TimelineItemWithPostAndChildren } from "../services/timeline";
import {
  LoggedInUserReactions,
  ReactionCounts,
  TimelineItemWithPostAndChildrenWithReactions,
} from "../types";

export function mapTimelineItemsWithPostReactions(
  timelineItems: TimelineItemWithPostAndChildren[],
  postsReactions: Record<string, ReactionCounts>,
  userReactions?: Record<string, LoggedInUserReactions>
): TimelineItemWithPostAndChildrenWithReactions[] {
  return timelineItems.map((timelineItem) => {
    return {
      ...timelineItem,
      post: {
        ...timelineItem.post,
        reactions: postsReactions[timelineItem.post.id],
        userReactions: userReactions?.[timelineItem.post.id],
        childPosts: timelineItem.post.childPosts.map((childPost) => ({
          ...childPost,
          reactions: postsReactions[childPost.id],
          userReactions: userReactions?.[childPost.id],
        })),
      },
    };
  });
}
