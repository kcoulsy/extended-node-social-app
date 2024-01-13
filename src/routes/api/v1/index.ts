import { FastifyInstance, FastifyPluginOptions } from "fastify";
import timelineRouter from "./timeline";
import postRouter from "./post";
import userRouter from "./user";
import reactionRouter from "./reaction";

export default function v1Router(
  fastify: FastifyInstance,
  options: FastifyPluginOptions,
  done: () => void
) {
  fastify.register(timelineRouter, { prefix: "/timeline" });
  fastify.register(postRouter, { prefix: "/post" });
  fastify.register(userRouter, { prefix: "/user" });
  fastify.register(reactionRouter, { prefix: "/reaction" });
  done();
}
