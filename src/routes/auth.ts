import { FastifyInstance, FastifyPluginOptions } from "fastify";
import fastifyPassport from "@fastify/passport";
import { createUser } from "../services/auth";

export default async function authRouter(
  fastify: FastifyInstance,
  options: FastifyPluginOptions,
  done: () => void
) {
  fastify.get("/login", function (request, reply) {
    if (request.user) {
      return reply.redirect("/");
    }
    reply.view("login");
  });

  fastify.get("/register", function (request, reply) {
    if (request.user) {
      return reply.redirect("/");
    }
    reply.view("register");
  });

  fastify.post(
    "/login",
    fastifyPassport.authenticate("local", {
      successReturnToOrRedirect: "/",
      failureRedirect: "/login",
      failureMessage: true,
    })
  );

  fastify.all("/logout", async function (request, reply) {
    request.logout();
    return reply.redirect("/");
  });

  fastify.post("/register", async function (request, reply) {
    // @ts-ignore
    const { username, password, fullName } = request.body;
    const user = await createUser({ username, password, name: fullName });

    if (!user) {
      return reply.redirect("/register");
    }

    try {
      await request.login(user);
    } catch (err) {
      fastify.log.error(err);
      return reply.redirect("/register");
    }

    return reply.redirect("/");
  });

  done();
}
