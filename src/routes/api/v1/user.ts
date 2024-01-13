import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { createPost } from "../../../services/posts";
import prisma from "../../../db";

export default function userRouter(
  fastify: FastifyInstance,
  options: FastifyPluginOptions,
  done: () => void
) {
  fastify.route<{
    Params: {
      username: string;
    };
    Body: {
      follow: boolean;
    };
  }>({
    method: "POST",
    url: "/:username/follow",
    handler: async function (request, reply) {
      const { username } = request.params;
      const { follow } = request.body;

      console.log(
        { username, follow },
        JSON.stringify(request.body),
        request.body.follow
      );

      if (!request.user) {
        return reply.redirect("/auth/login");
      }

      const user = await prisma.user.findUnique({
        where: { username: username.toLowerCase() },
      });

      if (!user) {
        return reply.status(404).send({ message: "User not found" });
      }

      if (user.id === request.user.id) {
        return reply.status(400).send({ message: "Cannot follow yourself" });
      }

      if (follow) {
        await prisma.user.update({
          where: { id: request.user.id },
          data: {
            following: {
              connect: {
                id: user.id,
              },
            },
          },
        });
      } else {
        await prisma.user.update({
          where: { id: request.user.id },
          data: {
            following: {
              disconnect: {
                id: user.id,
              },
            },
          },
        });
      }

      const followingUsers = await prisma.user.findUnique({
        where: { id: request.user.id },
        include: {
          following: true,
        },
      });

      const followingUsersCount = followingUsers?.following.length ?? 0;

      return reply.send({
        message: "Success",
        isFollowing: follow,
        followingUsersCount,
      });
    },
  });

  done();
}
