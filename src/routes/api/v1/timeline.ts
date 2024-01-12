import { FastifyInstance, FastifyPluginOptions } from "fastify";
import {
  getAllTimelineItemsPaginated,
  getUserTimelinePaginated,
} from "../../../services/timeline";
import { mapPostWithChildCreatedAtToReadable } from "../../../utils/mapPostWithChildCreatedAtToReadable";
import prisma from "../../../db";

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

      return reply.send({
        timelineItems: timelineItems.map((i) => ({
          ...i,
          post: mapPostWithChildCreatedAtToReadable(i.post),
        })),
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
    method: "GET",
    url: "/user/:username",
    handler: async function (request, reply) {
      const cursor = request.query?.cursor
        ? parseInt(request.query.cursor)
        : undefined;

      const user = await prisma.user.findUnique({
        where: { username: request.params.username.toLowerCase() },
      });

      if (!user) {
        return reply.status(404).send({ message: "User not found" });
      }

      const timelineItems = await getUserTimelinePaginated(user.id, cursor);

      return reply.send({
        timelineItems: timelineItems.map((i) => ({
          ...i,
          post: mapPostWithChildCreatedAtToReadable(i.post),
        })),
      });
    },
  });

  done();
}
