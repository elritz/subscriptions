import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import chalk from "chalk";
import { ProtoGrpcType } from "grpc/generated/services";
import prismaClient from "../../src/PrismaClient";

const PROTO_PATH = __dirname + "/../proto/services.proto";

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const { services } = grpc.loadPackageDefinition(
  packageDefinition
) as any as ProtoGrpcType;

async function CreateFriendRequestMessage(call: any, callback: any) {
  const { id } = call.request;
  const message = await prismaClient.message.findUnique({
    where: {
      id,
    },
  });
  callback(null, true);
}

const server = new grpc.Server();

server.addService(services.Messaging.service, {
  CreateFriendRequestMessage,
});

server.bindAsync(
  "0.0.0.0:50003",
  grpc.ServerCredentials.createInsecure(),
  () => {
    const message = `
    The gRPC server is being started on ${chalk.bold(
      chalk.blueBright(`http://0.0.0.0:50003`)
    )}. You now can invoke any client script by its name, e.g.:
    ${chalk.bold(`$ npm run feed`)}
    or
    ${chalk.bold(`$ npm run signupUser`)}
    See ${chalk.bold(
      `package.json`
    )} for a list of all available scripts or use ${chalk.bold(
      `BloomRPC`
    )} if you prefer a GUI client (download: ${chalk.bold(
      `https://github.com/uw-labs/bloomrpc`
    )}).
`;
    console.log(message);
    server.start();
  }
);
