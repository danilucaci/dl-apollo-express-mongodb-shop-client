import gql from "graphql-tag";

export const SET_LOCAL_AUTH = gql`
  mutation setLocalAuth($input: SetLocalAuthInput!) {
    setLocalAuth(input: $input) @client {
      isAuthenticated
      id
      email
      displayName
      role
    }
  }
`;
