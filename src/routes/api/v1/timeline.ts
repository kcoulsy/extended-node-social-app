import { FastifyInstance, FastifyPluginOptions } from "fastify";
import {
  getAllTimelineItemsPaginated,
  getUserTimelinePaginated,
} from "../../../services/timeline";

export default function timelineRouter(
  fastify: FastifyInstance,
  options: FastifyPluginOptions,
  done: () => void
) {
  fastify.route<{
    Querystring: {
      cursor?: string;
    };
  }>({
    method: "GET",
    url: "/",
    handler: async function (request, reply) {
      const cursor = request.query?.cursor
        ? parseInt(request.query.cursor)
        : undefined;

      const timelineItems = await getAllTimelineItemsPaginated(cursor);

      return reply.send({ timelineItems });
    },
  });

  fastify.route<{
    Querystring: {
      cursor?: string;
    };
    Params: {
      userId: string;
    };
  }>({
    method: "GET",
    url: "/user/:userId",
    handler: async function (request, reply) {
      const cursor = request.query?.cursor
        ? parseInt(request.query.cursor)
        : undefined;

      const timelineItems = await getUserTimelinePaginated(
        parseInt(request.params.userId),
        cursor
      );

      return reply.send({ timelineItems });
    },
  });

  done();
}
