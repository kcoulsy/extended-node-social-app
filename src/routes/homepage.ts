import { FastifyInstance, FastifyPluginOptions } from "fastify";
import {
  getAllTimelineItemsPaginated,
  getUsersFollowingTimelinePaginated,
} from "../services/timeline";
import { mapPostWithChildCreatedAtToReadable } from "../utils/mapPostWithChildCreatedAtToReadable";

export default function homepageRouter(
  fastify: FastifyInstance,
  options: FastifyPluginOptions,
  done: () => void
) {
  fastify.get("/", async function (request, reply) {
    const timelineItems = await getAllTimelineItemsPaginated();
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
