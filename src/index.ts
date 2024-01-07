import Fastify from "fastify";
import fastifyView from "@fastify/view";
import ejs from "ejs";
import authRouter from "./routes/auth";
import path from "path";

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

fastify.register(require("@fastify/static"), {
  root: path.join(__dirname, "public"),
  prefix: "/assets/",
});

fastify.get("/", function (request, reply) {
  reply.view("index", { user: "Bob" });
});

fastify.register(authRouter, { prefix: "/auth" });

fastify.listen({ port: 3000 }, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
