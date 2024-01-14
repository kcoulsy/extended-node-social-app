import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { getUserTimelinePaginated } from '../services/timeline';
import prisma from '../db';

export default function profileRouter(
  fastify: FastifyInstance,
  options: FastifyPluginOptions,
  done: () => void,
) {
  fastify.get<{
    Params: {
      username: string;
    };
  }>('/:username', async (request, reply) => {
    if (!request.params.username) {
      return reply.redirect('/');
    }

    const user = await prisma.user.findUnique({
      where: { username: request.params.username.toLowerCase() },
      include: {
        followedBy: true,
        following: true,
        TimelineItem: true,
      },
    });

    if (!user) {
      return reply.redirect('/');
    }

    const timelineItems = await getUserTimelinePaginated(
      user.id,
      undefined,
      request.user?.id,
    );

    const isFollowedByLoggedInuser = user.followedBy.some(
      (follower) => follower.id === request.user?.id,
    );

    return reply.view('profile', {
      timelineItems,
      profileUser: user,
      isFollowedByLoggedInuser,
    });
  });

  done();
}
