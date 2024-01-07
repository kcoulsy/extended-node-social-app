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

  fastify.post("/", async function (request, reply) {
    // @ts-ignore
    const { title, content, parentPostId } = request.body;
    // const user = await createPost({ title, content });

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
  });

  done();
}
