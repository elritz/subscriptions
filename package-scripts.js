const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

const { series, concurrent, rimraf, mkdirp } = require("nps-utils");

if (!rimraf || !concurrent || !series || !mkdirp) {
  throw new Error("bad nps-utils functions!");
}

// cleaner func
const cleanDist = rimraf("./dist");
const cleanGenerated = rimraf("./src/server/generated");
const cleanDbGenerated = rimraf("./src/tests/db/generated");
const cleanGraphDoc = rimraf("./graphdoc");

// read env variables
let envPath = "";
switch (process.env.NODE_ENV) {
  case "production":
    envPath = path.join(__dirname, "config", ".env.production");
    break;
  case "development":
    envPath = path.join(__dirname, "config", ".env.development");
    break;
  case "test": {
    envPath = path.join(__dirname, "config", ".env.test");
    const sqliteDbPath = path.join(__dirname, "src", "tests", "db");
    if (!fs.existsSync(sqliteDbPath)) fs.mkdirSync(sqliteDbPath);
    process.env.DATABASE_URL = `file:${path.join(sqliteDbPath, "data.sqlite")}`;
    break;
  }
  default:
    throw new Error(`NODE_ENV '${process.env.NODE_ENV}' not managed!`);
}

dotenv.config({ path: envPath });

// export different scripts for different environments!
let scriptsToExport = {};
switch (process.env.NODE_ENV) {
  case "production":
    scriptsToExport = {
      default: {
        description: "clean, build and start the server in production",
        script: series.nps("prisma.migrate.up", "build", "start"),
      },
    };
    break;
  case "development":
    scriptsToExport = {
      default: {
        description: "start the development server",
        script: `npx kill-port ${process.env.PORT}  && nodemon -e ts,tsx -i ./src/tests -i index.d.ts -x ts-node -r tsconfig-paths/register src/`,
      },
    };
    break;
  case "test":
    scriptsToExport = {
      default: {
        description: "start the test suite",
        script: series.nps("clean.db", "jest"),
      },
      jest: "jest",
      majestic: "majestic --port=4001 --noOpen",
      watch: "jest --watch",
    };
    break;

  default:
    throw new Error(`NODE_ENV '${process.env.NODE_ENV}' not managed!`);
}

// common scripts
const commonScriptsToExport = {
  build: series.nps("clean.dist", "generate", "tsc"),
  tsc: "tsc",
  clean: {
    dist: series(cleanDist),
    generated: series(cleanGenerated),
    db: series(cleanDbGenerated),
    graphdoc: series(cleanGraphDoc),
    all: concurrent.nps(
      "clean.dist",
      "clean.generated",
      "clean.db",
      "clean.graphdoc"
    ),
    default: series.nps("clean.all"),
  },
  node: {
    build: "tsc --build",
    clean: "tsc --build --clean",
    flame:
      "npx kill-port 5001 && nodemon -e ts,ts-node -r tsconfig-paths/register src/",
  },
  grpc: {
    default: "ts-node ./grpc/server/server",
    clean: rimraf("./grpc/generated"),
    gen: `proto-loader-gen-types --longs=String --enums=String --defaults --oneofs --grpcLib=@grpc/grpc-js --outDir=./grpc/generated grpc/proto/*.proto`,
    build: series.nps("grpc.clean", "grpc.gen"),
  },
  generate: {
    prismaGenerate: "npx prisma generate",
    graphqlCodegen: "graphql-codegen",
    cnt: "cnt --schema ./prisma/schema.prisma --outDir ./src/server/generated --mq -f -o",
    ct: "create-types --schema ./prisma/schema.prisma --outDir ./src/server/generated",
    default: series.nps(
      "clean.generated",
      "clean.graphdoc",
      "generate.prismaGenerate"
    ),
  },
  prisma: {
    reset: {
      main: "npx prisma migrate reset --force",
      default: series.nps(
        "postgres.dump",
        "prisma.reset.main",
        "prisma.migrate"
      ),
    },
    migrate: {
      dev: "prisma migrate dev",
      reset: "prisma migrate reset",
      default: series.nps("postgres.dump", "prisma.migrate.dev", "generate"),
    },
    studio: "npx prisma studio",
    seed: "ts-node prisma/seed.ts",
  },
  postgres: {
    dump: "node ./db/backup.ts",
    restore: "node ./db/restore.ts",
  },
  apollo: {
    all: `rover subgraph introspect \
    http://localhost:${process.env.PORT}/graphql | \
    APOLLO_KEY=service:barfriends:HK36HSViS1rAb1l5wNG67w \
    rover subgraph publish barfriends@current \
    --name profiling --schema - \
    --routing-url http://profiling.svc.cluster.local:${process.env.PORT}/graphql`,
    introspect:
      "rover subgraph introspect http://localhost:5001/graphql > profiling-schema-rover.graphql",
  },
  fixMissingDeclarations: series(
    "dts-gen -m xss-clean -f ./node_modules/xss-clean/lib/index.d.ts -o"
  ),
};

const scriptsOptions = { silent: false };

scriptsToExport = {
  scripts: { ...scriptsToExport, ...commonScriptsToExport },
  options: { ...scriptsOptions },
};

module.exports = scriptsToExport;
