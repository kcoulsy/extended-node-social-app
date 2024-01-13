import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { getUserTimelinePaginated } from "../services/timeline";
import { mapPostWithChildCreatedAtToReadable } from "../utils/mapPostWithChildCreatedAtToReadable";
import prisma from "../db";

export default function profileRouter(
  fastify: FastifyInstance,
  options: FastifyPluginOptions,
  done: () => void
) {
  fastify.get<{
    Params: {
      username: string;
    };
  }>("/:username", async function (request, reply) {
    if (!request.params.username) {
      return reply.redirect("/");
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
      return reply.redirect("/");
    }

    const timelineItems = await getUserTimelinePaginated(user.id);
    const isFollowedByLoggedInuser = user.followedBy.some(
      (follower) => follower.id === request.user?.id
    );

    return reply.view("profile", {
      timelineItems: timelineItems.map((timelineItem) => ({
        ...timelineItem,
        post: mapPostWithChildCreatedAtToReadable(timelineItem.post),
      })),
      profileUser: user,
      isFollowedByLoggedInuser,
    });
  });

  done();
}
