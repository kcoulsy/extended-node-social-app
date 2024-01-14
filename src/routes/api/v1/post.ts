import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { createPost } from '../../../services/posts';
import prisma from '../../../db';

export default function postRouter(
  fastify: FastifyInstance,
  options: FastifyPluginOptions,
  done: () => void,
) {
  fastify.route<{
    Body: {
      content: string;
      parentPostId?: string;
      targetUsername?: string;
    };
  }>({
    method: 'POST',
    url: '/',
    async handler(request, reply) {
      const { content, parentPostId } = request.body;

      if (!request.user) {
        return reply.redirect('/auth/login');
      }

      let targetUserId: number | undefined;

      let targetUser;
      if (request.body.targetUsername) {
        targetUser = await prisma.user.findUnique({
          where: {
            username: request.body.targetUsername,
          },
          select: {
            id: true,
            username: true,
            name: true,
          },
        });
        if (targetUser && targetUser.id !== request.user.id) {
          targetUserId = targetUser.id;
        }
      }
      const post = await createPost({
        content,
        parentPostId,
        userId: request.user.id,
        targetUserId,
      });

      return reply.send({
        post,
        targetUser,
      });
    },
  });

  fastify.route<{
    Body: {
      content: string;
    };
    Params: {
      postId: string;
    };
  }>({
    method: 'POST',
    url: '/:postId/comment',
    async handler(request, reply) {
      const { content } = request.body;
      const { postId } = request.params;

      if (!request.user) {
        return reply.redirect('/auth/login');
      }

      const post = await createPost({
        content,
        parentPostId: postId,
        userId: request.user.id,
      });

      return reply.send({
        post,
      });
    },
  });
  done();
}
