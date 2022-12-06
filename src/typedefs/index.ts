import gql from "graphql-tag";

export const typeDefs = gql`
  type Subscription {
    postCreated: Post
    hello: String
  }
  type Query {
    _dummy: String
  }
  type Post {
    id: String
  }
`;
