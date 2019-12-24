import gql from "graphql-tag";

export const LOCAL_AUTH = gql`
  query localAuth {
    localAuth @client {
      isAuthenticated
      currentLocalUser {
        id
        displayName
        email
        role
      }
    }
  }
`;
