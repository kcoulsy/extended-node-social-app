import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import {
  createReaction,
  deleteReaction,
  getReactionCountsForPost,
} from '../../../services/reaction';

export default function reactionRouter(
  fastify: FastifyInstance,
  options: FastifyPluginOptions,
  done: () => void,
) {
  fastify.route<{
    Body: {
      type: 'like' | 'smile' | 'star' | 'heart';
    };
    Params: {
      postId: string;
    };
  }>({
    method: 'POST',
    url: '/:postId',
    async handler(request, reply) {
      const { type } = request.body;
      const { postId } = request.params;

      if (!request.user) {
        return reply.redirect('/auth/login');
      }

      if (!['like', 'smile', 'star', 'heart'].includes(type)) {
        return reply.status(400).send({
          error: 'Invalid type',
        });
      }

      await createReaction({
        postId: parseInt(postId, 10),
        authorId: request.user.id,
        type,
      });

      const reactions = await getReactionCountsForPost(parseInt(postId, 10));

      return reply.send({
        reactions,
      });
    },
  });

  fastify.route<{
    Body: {
      type: 'like' | 'smile' | 'star' | 'heart';
    };
    Params: {
      postId: string;
    };
  }>({
    method: 'DELETE',
    url: '/:postId',
    async handler(request, reply) {
      const { type } = request.body;
      const { postId } = request.params;

      if (!request.user) {
        return reply.redirect('/auth/login');
      }

      if (!['like', 'smile', 'star', 'heart'].includes(type)) {
        return reply.status(400).send({
          error: 'Invalid type',
        });
      }

      await deleteReaction({
        postId: parseInt(postId, 10),
        authorId: request.user.id,
        type,
      });

      const reactions = await getReactionCountsForPost(parseInt(postId, 10));

      return reply.send({
        reactions,
      });
    },
  });

  done();
}
