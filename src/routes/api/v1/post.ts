import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { createPost } from "../../../services/posts";

export default function postRouter(
  fastify: FastifyInstance,
  options: FastifyPluginOptions,
  done: () => void
) {
  fastify.route<{
    Body: {
      content: string;
      parentPostId?: string;
    };
  }>({
    method: "POST",
    url: "/",
    handler: async function (request, reply) {
      const { content, parentPostId } = request.body;

      if (!request.user) {
        return reply.redirect("/auth/login");
      }

      const post = await createPost({
        content,
        parentPostId,
        userId: request.user.id,
      });

      return reply.send({
        post,
      });
    },
  });

  done();
}
