import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { ApolloLink } from "apollo-link";
import { setContext } from "apollo-link-context";
import { InMemoryCache } from "apollo-cache-inmemory";
import { onError } from "apollo-link-error";

import { getUserToken, signOut } from "../firebase/firebase";

import localResolvers from "./localResolvers";
import localTypeDefs from "./localTypeDefs";

const httpLink = new HttpLink({
  uri: "http://localhost:4000/graphql",
});

const authLink = setContext(async (_, { headers }) => {
  const token = await getUserToken();

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    console.group(
      "%c GraphQL Errors: %c %s",
      "color: #FA2658; font-weight: 700",
      "color: #07E33A; font-weight: 700",
      "Apollo Generic Error",
    );
    graphQLErrors.forEach((error) => {
      console.log("%c error: ", "color: #FD01E4; font-weight: 700", error);

      if (error.message === "UNAUTHENTICATED") {
        signOut();
      }
    });
    console.groupEnd();
  }

  if (networkError) {
    console.group(
      "%c Errors: %c %s",
      "color: #FA2658; font-weight: 700",
      "color: #07E33A; font-weight: 700",
      "Apollo Network Error",
    );
    console.log("%c Error: ", "color: #FD01E4; font-weight: 700", networkError);
    console.groupEnd();

    if (networkError.statusCode === 401) {
      signOut();
    }
  }
});

const link = ApolloLink.from([authLink, errorLink, httpLink]);

const cache = new InMemoryCache();

const initialData = {
  localAuth: {
    isAuthenticated: false,
    __typename: "LocalAuth",
    currentLocalUser: {
      id: null,
      displayName: null,
      email: null,
      role: null,
      photoURL: null,
      __typename: "CurrentLocalUser",
    },
  },
};

cache.writeData({
  data: initialData,
});

const apolloClient = new ApolloClient({
  link: link,
  cache: cache,
  resolvers: localResolvers,
  typeDefs: localTypeDefs,
});

apolloClient.onResetStore(() =>
  cache.writeData({
    data: initialData,
  }),
);

export default apolloClient;
