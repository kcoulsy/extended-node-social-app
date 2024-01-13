import { FastifyInstance, FastifyPluginOptions } from "fastify";
import {
  getAllTimelineItemsPaginated,
  getUserTimelinePaginated,
  getUsersFollowingTimelinePaginated,
} from "../../../services/timeline";
import { mapPostWithChildCreatedAtToReadable } from "../../../utils/mapPostWithChildCreatedAtToReadable";
import prisma from "../../../db";
import { getHasUserReactionsToPosts } from "../../../services/reaction";

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

      const timelineItems = await getAllTimelineItemsPaginated(
        cursor,
        request.user?.id
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
    method: "GET",
    url: "/following",
    handler: async function (request, reply) {
      const cursor = request.query?.cursor
        ? parseInt(request.query.cursor)
        : undefined;

      if (!request.user) {
        return reply.status(401).send({ message: "Unauthorized" });
      }

      const timelineItems = await getUsersFollowingTimelinePaginated(
        request.user?.id,
        cursor
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

      const timelineItems = await getUserTimelinePaginated(
        user.id,
        cursor,
        request.user?.id
      );

      return reply.send({
        timelineItems,
      });
    },
  });

  done();
}
