import { describe, expect, it } from 'vitest';
import { prismaMock } from '../test-mocks';
import { createPost } from './posts';

describe('Posts service', () => {
  describe('createPost', () => {
    it('should create a post', async () => {
      const data = {
        content: 'content',
        userId: 1,
      };

      prismaMock.post.create.mockResolvedValueOnce({
        ...data,
        targetUserId: null,
        parentPostId: null,
        authorId: data.userId,
        // @ts-expect-error
        author: {
          id: 1,
          username: 'username',
          createdAt: new Date(),
          updatedAt: new Date(),
          name: 'name',
          password: 'password',
        },
        childPosts: [],
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const post = await createPost(data);

      expect(post).toEqual({
        ...data,
        targetUserId: null,
        parentPostId: null,
        authorId: data.userId,
        author: {
          id: 1,
          username: 'username',
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          name: 'name',
          password: 'password',
        },
        childPosts: [],
        id: 1,
        createdAt: 'now',
        updatedAt: expect.any(Date),
        reactions: {},
      });
    });
  });

  it('should create a post with target user', async () => {
    const data = {
      content: 'content',
      userId: 1,
      targetUserId: 2,
    };

    prismaMock.post.create.mockResolvedValueOnce({
      ...data,
      targetUserId: data.targetUserId,
      parentPostId: null,
      authorId: data.userId,
      // @ts-expect-error
      author: {
        id: 1,
        username: 'username',
        createdAt: new Date(),
        updatedAt: new Date(),
        name: 'name',
        password: 'password',
      },
      childPosts: [],
      id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const post = await createPost(data);

    expect(post).toEqual({
      ...data,
      targetUserId: data.targetUserId,
      parentPostId: null,
      authorId: data.userId,
      author: {
        id: 1,
        username: 'username',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        name: 'name',
        password: 'password',
      },
      childPosts: [],
      id: 1,
      createdAt: 'now',
      updatedAt: expect.any(Date),
      reactions: {},
    });
  });

  it('should create a timeline item if no parent post id is provided', async () => {
    const data = {
      content: 'content',
      userId: 1,
    };

    prismaMock.post.create.mockResolvedValueOnce({
      ...data,
      targetUserId: null,
      parentPostId: null,
      authorId: data.userId,
      // @ts-expect-error
      author: {
        id: 1,
        username: 'username',
        createdAt: new Date(),
        updatedAt: new Date(),
        name: 'name',
        password: 'password',
      },
      childPosts: [],
      id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const post = await createPost(data);

    expect(prismaMock.timelineItem.create).toHaveBeenCalledWith({
      data: {
        authorId: data.userId,
        postId: post.id,
      },
    });
  });

  it('should create a timeline item for the the target user if a parent post id is not provided', async () => {
    const data = {
      content: 'content',
      userId: 1,
      targetUserId: 2,
    };

    prismaMock.post.create.mockResolvedValueOnce({
      ...data,
      targetUserId: null,
      parentPostId: null,
      authorId: data.userId,
      // @ts-expect-error
      author: {
        id: 1,
        username: 'username',
        createdAt: new Date(),
        updatedAt: new Date(),
        name: 'name',
        password: 'password',
      },
      childPosts: [],
      id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const post = await createPost(data);

    expect(prismaMock.timelineItem.create).toHaveBeenCalledWith({
      data: {
        authorId: data.targetUserId,
        postId: post.id,
      },
    });
  });

  it('should not create a timeline item if a parent post id is provided', async () => {
    const data = {
      content: 'content',
      userId: 1,
      parentPostId: '2',
    };

    prismaMock.post.create.mockResolvedValueOnce({
      ...data,
      targetUserId: null,
      parentPostId: null,
      authorId: data.userId,
      // @ts-expect-error
      author: {
        id: 1,
        username: 'username',
        createdAt: new Date(),
        updatedAt: new Date(),
        name: 'name',
        password: 'password',
      },
      childPosts: [],
      id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await createPost(data);

    expect(prismaMock.timelineItem.create).not.toHaveBeenCalled();
  });
});
