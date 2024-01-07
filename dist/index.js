"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const view_1 = __importDefault(require("@fastify/view"));
const ejs_1 = __importDefault(require("ejs"));
const fastify = (0, fastify_1.default)({
    logger: true,
});
fastify.register(view_1.default, {
    engine: {
        ejs: ejs_1.default,
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
