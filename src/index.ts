import Fastify from "fastify";
import fastifyView from "@fastify/view";
import ejs from "ejs";

const fastify = Fastify({
  logger: true,
});

fastify.register(fastifyView, {
  engine: {
    ejs,
  },
  root: __dirname + "/views",
  includeViewExtension: true,
});

fastify.get("/", function (request, reply) {
  reply.view("index", { user: "Bob" });
});

fastify.listen({ port: 3000 }, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
