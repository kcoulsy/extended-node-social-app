import { z } from 'zod';
import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { createPost } from '../services/posts';

export default function postRouter(
  fastify: FastifyInstance,
  options: FastifyPluginOptions,
  done: () => void,
) {
  fastify.get('/', (request, reply) => {
    reply.view('post');
  });

  const postSchema = z.object({
    content: z.string(),
    parentPostId: z.string().optional(),
  });

  fastify.post('/', async (request, reply) => {
    try {
      const { content, parentPostId } = postSchema.parse(request.body);

      if (!request.user) {
        return await reply.redirect('/auth/login');
      }

      await createPost({
        content,
        parentPostId,
        userId: request.user.id,
      });

      return await reply.redirect('/');
    } catch (err) {
      return reply.redirect('/post');
    }
  });

  done();
}
