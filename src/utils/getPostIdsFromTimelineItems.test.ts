import { describe, expect, it } from 'vitest';
import { TimelineItemWithPostAndChildren } from '../types';
import { getPostIdsFromTimelineItems } from './getPostIdsFromTimelineItems';

const timeNow = Date.now();
const timeOneHourAgo = timeNow - 1000 * 60 * 60;
const timeOneDayAgo = timeNow - 1000 * 60 * 60 * 24;

const mockTimelineItem: TimelineItemWithPostAndChildren = {
  authorId: 1,
  createdAt: new Date(),
  id: 1,
  postId: 1,
  updatedAt: new Date(),
  author: {
    id: 1,
    username: 'username',
    createdAt: new Date(),
    updatedAt: new Date(),
    name: 'name',
    password: 'password',
  },
  post: {
    id: 1,
    content: 'content',
    createdAt: new Date(),
    updatedAt: new Date(),
    authorId: 1,
    targetUserId: null,
    parentPostId: null,
    author: {
      id: 1,
      username: 'username',
      createdAt: new Date(),
      updatedAt: new Date(),
      name: 'name',
      password: 'password',
    },
    childPosts: [
      {
        id: 100,
        content: 'child post',
        createdAt: new Date(timeNow),
        updatedAt: new Date(),
        authorId: 1,
        targetUserId: null,
        parentPostId: null,
        author: {
          id: 1,
          username: 'username',
          createdAt: new Date(),
          updatedAt: new Date(),
          name: 'name',
          password: 'password',
        },
      },
      {
        id: 50,
        content: 'child post 2',
        createdAt: new Date(timeOneDayAgo),
        updatedAt: new Date(),
        authorId: 1,
        targetUserId: null,
        parentPostId: null,
        author: {
          id: 1,
          username: 'username',
          createdAt: new Date(),
          updatedAt: new Date(),
          name: 'name',
          password: 'password',
        },
      },
      {
        id: 75,
        content: 'child post 3',
        createdAt: new Date(timeOneHourAgo),
        updatedAt: new Date(),
        authorId: 1,
        targetUserId: null,
        parentPostId: null,
        author: {
          id: 1,
          username: 'username',
          createdAt: new Date(),
          updatedAt: new Date(),
          name: 'name',
          password: 'password',
        },
      },
    ],
  },
};

describe('getPostIdsFromTimelineItems', () => {
  it('should get all ids including child ids', () => {
    const result = getPostIdsFromTimelineItems([mockTimelineItem]);

    expect(result).toEqual([1, 100, 50, 75]);
  });
});
