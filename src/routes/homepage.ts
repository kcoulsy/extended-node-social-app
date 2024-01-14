import { FastifyInstance, FastifyPluginOptions } from "fastify";
import {
  getAllTimelineItemsPaginated,
  getUsersFollowingTimelinePaginated,
} from "../services/timeline";

export default function homepageRouter(
  fastify: FastifyInstance,
  options: FastifyPluginOptions,
  done: () => void
) {
  fastify.get("/", async function (request, reply) {
    const timelineItems = await getAllTimelineItemsPaginated(
      undefined,
      request.user?.id
    );
    let followingTimelineItems;
    if (request.user) {
      followingTimelineItems = await getUsersFollowingTimelinePaginated(
        request.user.id
      );
    }

    return reply.view("index", {
      allTimelineItems: timelineItems,
      followingTimelineItems,
    });
  });

  done();
}
