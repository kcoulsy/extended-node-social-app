import { FastifyInstance } from "fastify";

export default async function authRouter(fastify: FastifyInstance) {
  fastify.get("/login", function (request, reply) {
    reply.view("login");
  });

  fastify.get("/register", function (request, reply) {
    reply.view("register");
  });
}
