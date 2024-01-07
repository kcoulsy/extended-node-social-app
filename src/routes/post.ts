import { z } from "zod";
import prisma from "../db";
import { FastifyInstance, FastifyPluginOptions } from "fastify";

export default function postRouter(
  fastify: FastifyInstance,
  options: FastifyPluginOptions,
  done: () => void
) {
  fastify.get("/", function (request, reply) {
    reply.view("post");
  });

  const postSchema = z.object({
    content: z.string(),
    parentPostId: z.string().optional(),
  });

  fastify.post("/", async function (request, reply) {
    try {
      const { content, parentPostId } = postSchema.parse(request.body);

      if (!request.user) {
        return reply.redirect("/auth/login");
      }

      await prisma.post.create({
        data: {
          content,
          authorId: request.user.id,
          parentPostId: parentPostId ? parseInt(parentPostId) : undefined,
        },
      });

      return reply.redirect("/");
    } catch (err) {
      console.log(err);
      return reply.redirect("/post");
    }
  });

  done();
}
