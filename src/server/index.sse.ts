import fs from "fs";
import Fastify from "fastify";
import { createHandler } from "graphql-sse";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { PubSub } from "graphql-subscriptions";

const pubsub = new PubSub();

const typeDefs = `#graphql
  type Query {
    currentNumber: Int
  }
  type Subscription {
    numberIncremented: Int
  }
`;

// Resolver map
const resolvers = {
  Query: {
    currentNumber() {
      return currentNumber;
    },
  },
  Subscription: {
    numberIncremented: {
      subscribe: () => pubsub.asyncIterator(["NUMBER_INCREMENTED"]),
    },
  },
};

const mainServer = (async function () {
  const schema = makeExecutableSchema({ typeDefs, resolvers });
  const handler = createHandler({
    schema, // from the previous step
  });

  // const sendFile = (stream, fileName) => {
  //   const fd = fs.openSync(fileName, "r");
  //   const stat = fs.fstatSync(fd);
  //   const headers = {
  //     "content-length": stat.size,
  //     "last-modified": stat.mtime.toUTCString(),
  //     "content-type": mime.getType(fileName),
  //   };
  //   stream.respondWithFD(fd, headers);
  //   stream.on("close", () => {
  //     console.log("closing file", fileName);
  //     fs.closeSync(fd);
  //   });
  //   stream.end();
  // };

  // const pushFile = (stream, path, fileName) => {
  //   stream.pushStream({ ":path": path }, (err, pushStream) => {
  //     if (err) {
  //       throw err;
  //     }
  //     sendFile(pushStream, fileName);
  //   });
  // };

  const fastify = Fastify({
    http2: true,
    https: {
      allowHTTP1: true, // fallback support for HTTP1
      key: fs.readFileSync("./localhost-privkey.pem"),
      cert: fs.readFileSync("./localhost-cert.pem"),
    },
  });

  fastify.get("/graphql/stream", (req, res) =>
    handler(
      req.raw,
      res.raw,
      req.body // fastify reads the body for you
    )
  );

  fastify.get("/", function (request, reply) {
    reply.code(200).send({ hello: "world" });
  });

  fastify.listen({ port: Number(process.env.PORT) }, () => {
    console.log(
      `🚀 Server ready at https://localhost:${process.env.PORT}/graphql/stream`
    );
  });
})();

export default mainServer;

// In the background, increment a number every second and notify subscribers when it changes.
let currentNumber = 0;
function incrementNumber() {
  currentNumber++;
  pubsub.publish("NUMBER_INCREMENTED", { numberIncremented: currentNumber });
  setTimeout(incrementNumber, 1000);
}

// Start incrementing
incrementNumber();
