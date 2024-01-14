import { TimelineItemWithPostAndChildren } from '../types';

export function getPostIdsFromTimelineItems(
  timelineItems: TimelineItemWithPostAndChildren[],
): number[] {
  return timelineItems.reduce((acc, item) => {
    if (item.post) {
      acc.push(item.post.id);

      if (item.post.childPosts) {
        acc.push(...item.post.childPosts.map((p) => p.id));
      }
    }
    return acc;
  }, [] as number[]);
}
