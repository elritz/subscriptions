import builder from "@builder";
import prismaClient from "@src/PrismaClient";

const Personal = builder.prismaObject("Chatroom", {
  fields: (t) => ({
    id: t.exposeID("id"),
    bfsprofileid: t.exposeString("id"),
  }),
});

builder.queryFields((t) => ({
  personals: t.prismaFieldWithInput({
    type: "Chatroom",
    input: {
      id: t.input.id({ required: true }),
    },
    nullable: true,
    resolve: async (query, root, { input: { id } }, context, info) => {
      console.log(
        "🚀 ~ file: Profile.ts ~ line 62 ~ builder.queryFields ~ args",
        id
      );
      const chatroom = await prismaClient.chatroom.findFirst({
        where: {
          id: "123",
        },
      });
      return chatroom;
    },
  }),
}));
