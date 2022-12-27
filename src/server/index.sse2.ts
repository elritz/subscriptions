import fs from "fs";
import { GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";
import { createHandler } from "graphql-sse/lib/use/http2";
import { PubSub } from "graphql-subscriptions";
import http2 from "http2";

const pubsub = new PubSub();

/**
 * Construct a GraphQL schema and define the necessary resolvers.
 *
 * type Query {
 *   hello: String
 * }
 * type Subscription {
 *   greetings: String
 * }
 */
const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "Query",
    fields: {
      hello: {
        type: GraphQLString,
        resolve: () => "world",
      },
    },
  }),
  subscription: new GraphQLObjectType({
    name: "Subscription",
    fields: {
      greetings: {
        type: GraphQLString,
        subscribe: async function* () {
          for (const hi of ["Hi", "Bonjour", "Hola", "Ciao", "Zdravo"]) {
            yield { greetings: hi };
          }
        },
      },
    },
  }),
});

const mainServer = (async function () {
  const handler = createHandler({ schema });

  const server = http2.createSecureServer(
    {
      key: fs.readFileSync("./localhost-privkey.pem"),
      cert: fs.readFileSync("./localhost-cert.pem"),
    },
    (req, res) => {
      if (req.url.startsWith("/graphql/stream")) {
        console.log(req.url);
        return handler(req, res);
      } else {
        res.writeHead(404).end();
      }
      return handler(req, res);
    }
  );

  server.listen({ port: Number(process.env.PORT) }, () => {
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
