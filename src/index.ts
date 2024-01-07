import Fastify from "fastify";
import fastifyView from "@fastify/view";
import ejs from "ejs";
import authRouter from "./routes/auth";
import path from "path";
import fastifyPassport from "@fastify/passport";
import fastifyCookie from "@fastify/cookie";
import fastifySession from "@fastify/session";
import { Strategy as LocalStrategy } from "passport-local";
import { login } from "./services/auth";
import prisma from "./db";
import { User } from "@prisma/client";
import postRouter from "./routes/post";

declare module "fastify" {
  interface PassportUser extends User {}
}
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

fastify.register(require("@fastify/formbody"));

// set up secure sessions for @fastify/passport to store data in
fastify.register(fastifyCookie);
fastify.register(fastifySession, {
  secret: "secret with minimum length of 32 characters",
  cookie: {
    secure: false, // TODO set to true in production
  },
});

fastify.register(fastifyPassport.initialize());
fastify.register(fastifyPassport.secureSession());

fastifyPassport.use(
  "local",
  new LocalStrategy(function (username, password, done) {
    fastify.log.info("local strategy", username, password);
    login(username, password)
      .then((user) => {
        fastify.log.info("logged in", user);
        done(null, user);
      })
      .catch((err) => {
        fastify.log.error("failed login", err);
        done(err);
      });
  })
);

fastifyPassport.registerUserSerializer(async (user: User, request) => {
  return user.id;
});
fastifyPassport.registerUserDeserializer(async (id: number, request) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  return user;
});

fastify.addHook("preHandler", function (request, reply, done) {
  // @ts-ignore
  reply.locals = {
    user: request.user,
  };

  done();
});

fastify.register(authRouter, { prefix: "/auth" });
fastify.register(postRouter, { prefix: "/post" });

fastify.get("/", async function (request, reply) {
  const posts = await prisma.post.findMany({
    where: {
      parentPostId: null,
    },
    include: {
      author: true,
      childPosts: {
        include: {
          author: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return reply.view("index", { posts });
});

fastify.listen({ port: 3000 }, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
