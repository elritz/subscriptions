import * as protoLoader from "@grpc/proto-loader";

const PROTO_PATH = __dirname + "/../../proto/services.proto";

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
