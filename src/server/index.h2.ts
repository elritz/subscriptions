import { makeExecutableSchema } from "@graphql-tools/schema";
import fs from "fs";
import { createHandler } from "graphql-sse";
import { PubSub } from "graphql-subscriptions";
import http2 from "http2";
import mime from "mime";

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

// Create the GraphQL over SSE handler

// Create a HTTP/2 server using the handler on `/graphql/stream`
const mainServer = (async function () {
  const schema = makeExecutableSchema({ typeDefs, resolvers });
  const handler = createHandler({
    schema, // from the previous step
  });

  const sendFile = (stream, fileName) => {
    const fd = fs.openSync(fileName, "r");
    const stat = fs.fstatSync(fd);
    const headers = {
      "content-length": stat.size,
      "last-modified": stat.mtime.toUTCString(),
      "content-type": mime.getType(fileName),
    };
    stream.respondWithFD(fd, headers);
    stream.on("close", () => {
      console.log("closing file", fileName);
      fs.closeSync(fd);
    });
    stream.end();
  };

  const pushFile = (stream, path, fileName) => {
    stream.pushStream({ ":path": path }, (err, pushStream) => {
      if (err) {
        throw err;
      }
      sendFile(pushStream, fileName);
    });
  };

  const http2Handlers = (req, res) => {
    console.log(req.url);
    if (req.url === "/graphql/stream") {
      return handler(req, res);
    }
    if (req.url === "/") {
      // push style.css
      pushFile(res.stream, "/style.css", "style.css");

      // push all files in scripts directory
      const files = fs.readdirSync(__dirname + "/scripts");
      for (let i = 0; i < files.length; i++) {
        const fileName = __dirname + "/scripts/" + files[i];
        const path = "/scripts/" + files[i];
        pushFile(res.stream, path, fileName);
      }

      // push all files in images directory
      const imageFiles = fs.readdirSync(__dirname + "/images");
      for (let i = 0; i < imageFiles.length; i++) {
        const fileName = __dirname + "/images/" + imageFiles[i];
        const path = "/images/" + imageFiles[i];
        pushFile(res.stream, path, fileName);
      }

      // lastly send index.html file
      sendFile(res.stream, "index.html");
    } else {
      // send empty response for favicon.ico
      if (req.url === "/favicon.ico") {
        res.stream.respond({ ":status": 200 });
        res.stream.end();
        return;
      }
      const fileName = __dirname + req.url;
      sendFile(res.stream, fileName);
    }
  };

  const serverOptions = {
    key: fs.readFileSync("./localhost-privkey.pem"),
    cert: fs.readFileSync("./localhost-cert.pem"),
  };

  const server = http2.createSecureServer(serverOptions, http2Handlers);
  // const server = http.createServer((req, res) => {
  //   if (req.url?.startsWith("/graphql/stream")) return handler(req, res);
  //   return res.writeHead(404).end();
  // });

  server.listen(process.env.PORT, () => {
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
