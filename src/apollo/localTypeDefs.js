import gql from "graphql-tag";

const localTypeDefs = gql`
  enum CurrentLocalUserRole {
    ADMIN
    MEMBER
  }

  type CurrentLocalUser {
    id: ID!
    displayName: String!
    email: String!
    role: CurrentLocalUserRole!
  }

  type LocalAuth {
    isAuthenticated: Boolean!
    currentLocalUser: CurrentLocalUser!
  }

  input SetLocalAuthInput {
    isAuthenticated: Boolean!
    id: ID!
    displayName: String!
    email: String!
    role: CurrentLocalUserRole!
  }

  extend type Query {
    localAuth: LocalAuth!
    currentLocalUser: CurrentLocalUser!
  }

  extend type Mutation {
    setLocalAuth(input: SetLocalAuthInput!): LocalAuth!
  }
`;

export default localTypeDefs;
