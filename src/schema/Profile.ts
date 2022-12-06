import builder from "@builder";
import prismaClient from "@pclient";

const Message = builder.prismaObject("Message", {
  fields: (t) => ({
    id: t.exposeID("id"),
    message: t.relation("response"),
  }),
});

const MessageEntity = builder.asEntity(Message, {
  key: builder.selection<{ id: string }>("id"),
  resolveReference: ({ id }) =>
    prismaClient.message.findFirst({ where: { id: String(id) } }),
});

builder.queryType({
  fields: (t) => ({
    // profile: t.prismaField({
    //   type: "Message",
    //   nullable: true,
    //   args: {
    //     id: t.arg.id({ required: true }),
    //   },

    //   resolve: (query, root, args) =>
    //     prismaClient.message.findUniqueOrThrow({
    //       ...query,
    //       where: { id: String(args.id) },
    //     }),
    // }),
    resolver: t.string({
      resolve: () => {
        return "HELLOW";
      },
    }),
  }),
});

builder.queryFields((t) => ({
  messages: t.fieldWithInput({
    type: [Message],
    input: {
      id: t.input.id({ required: true }),
    },
    nullable: true,
    resolve: (_, { input: { id } }) => {
      console.log(
        "🚀 ~ file: Profile.ts ~ line 62 ~ builder.queryFields ~ args",
        id
      );
      return prismaClient.message.findMany();
    },
  }),
}));
