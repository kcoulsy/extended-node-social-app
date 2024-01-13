import { FastifyInstance, FastifyPluginOptions } from "fastify";
import timelineRouter from "./timeline";
import postRouter from "./post";
import userRouter from "./user";

export default function v1Router(
  fastify: FastifyInstance,
  options: FastifyPluginOptions,
  done: () => void
) {
  fastify.register(timelineRouter, { prefix: "/timeline" });
  fastify.register(postRouter, { prefix: "/post" });
  fastify.register(userRouter, { prefix: "/user" });
  done();
}
