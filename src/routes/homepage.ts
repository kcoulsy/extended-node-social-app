import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { getAllTimelineItemsPaginated } from "../services/timeline";
import { mapPostWithChildCreatedAtToReadable } from "../utils/mapPostWithChildCreatedAtToReadable";

export default function homepageRouter(
  fastify: FastifyInstance,
  options: FastifyPluginOptions,
  done: () => void
) {
  fastify.get("/", async function (request, reply) {
    const timelineItems = await getAllTimelineItemsPaginated();

    return reply.view("index", {
      timelineItems: timelineItems.map((timelineItem) => ({
        ...timelineItem,
        post: mapPostWithChildCreatedAtToReadable(timelineItem.post),
      })),
    });
  });

  done();
}
