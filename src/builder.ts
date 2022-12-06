import SchemaBuilder from "@pothos/core";
import DirectivesPlugin from "@pothos/plugin-directives";
import FederationPlugin from "@pothos/plugin-federation";
import PrismaPlugin from "@pothos/plugin-prisma";
import PrismaUtilsPlugin from "@pothos/plugin-prisma-utils";
import WithInputPlugin from "@pothos/plugin-with-input";
import prismaClient from "@src/PrismaClient";
import { DateTimeResolver } from "graphql-scalars";
import type PrismaTypes from "../prisma/generated";

const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes;
  Scalars: {
    ID: {
      Output: number | string;
      Input: number | string;
    };
    DateTime: {
      Output: Date;
      Input: Date;
    };
  };
}>({
  plugins: [
    DirectivesPlugin,
    PrismaPlugin,
    PrismaUtilsPlugin,
    FederationPlugin,
    WithInputPlugin,
  ],
  prisma: {
    client: prismaClient,
  },
});

builder.addScalarType("DateTime", DateTimeResolver, {});

export default builder;
