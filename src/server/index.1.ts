import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginInlineTraceDisabled } from "@apollo/server/plugin/disabled";
import { json } from "body-parser";
import cors from "cors";
import express from "express";
import { createServer } from "http";
import { schema } from "../schema";

interface MyContext {
  authorization?: String;
}

const mainServer = (async function () {
  const app = express();

  const server = new ApolloServer<MyContext>({
    schema,
    plugins: [ApolloServerPluginInlineTraceDisabled()],
  });

  await server.start();

  app.use(
    "/graphql",
    cors<cors.CorsRequest>(),
    json(),
    expressMiddleware(server, {
      context: async ({ req }) => ({ token: req.headers.token }),
    })
  );

  const httpServer = createServer(app);

  await new Promise<void>((resolve) => {
    httpServer.listen({ port: process.env.PORT }, resolve);
  });

  console.log(
    `🚀 Server ready at http://localhost:${process.env.PORT}/graphql`
  );
})();

export default mainServer;
