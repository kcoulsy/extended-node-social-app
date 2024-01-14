import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import {
  getAllTimelineItemsPaginated,
  getUserTimelinePaginated,
  getUsersFollowingTimelinePaginated,
} from '../../../services/timeline';
import prisma from '../../../db';

export default function timelineRouter(
  fastify: FastifyInstance,
  options: FastifyPluginOptions,
  done: () => void,
) {
  fastify.route<{
    Querystring: {
      cursor?: string;
    };
  }>({
    method: 'GET',
    url: '/',
    async handler(request, reply) {
      const cursor = request.query?.cursor
        ? parseInt(request.query.cursor, 10)
        : undefined;

      const timelineItems = await getAllTimelineItemsPaginated(
        cursor,
        request.user?.id,
      );

      return reply.send({
        timelineItems,
      });
    },
  });

  fastify.route<{
    Querystring: {
      cursor?: string;
    };
  }>({
    method: 'GET',
    url: '/following',
    async handler(request, reply) {
      const cursor = request.query?.cursor
        ? parseInt(request.query.cursor, 10)
        : undefined;

      if (!request.user) {
        return reply.status(401).send({ message: 'Unauthorized' });
      }

      const timelineItems = await getUsersFollowingTimelinePaginated(
        request.user?.id,
        cursor,
      );

      return reply.send({
        timelineItems,
      });
    },
  });

  fastify.route<{
    Querystring: {
      cursor?: string;
    };
    Params: {
      username: string;
    };
  }>({
    method: 'GET',
    url: '/user/:username',
    async handler(request, reply) {
      const cursor = request.query?.cursor
        ? parseInt(request.query.cursor, 10)
        : undefined;

      const user = await prisma.user.findUnique({
        where: { username: request.params.username.toLowerCase() },
      });

      if (!user) {
        return reply.status(404).send({ message: 'User not found' });
      }

      const timelineItems = await getUserTimelinePaginated(
        user.id,
        cursor,
        request.user?.id,
      );

      return reply.send({
        timelineItems,
      });
    },
  });

  done();
}
