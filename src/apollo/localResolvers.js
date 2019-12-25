const localResolvers = {
  Mutation: {
    setLocalAuth: (_, { input }, { cache }) => {
      const { isAuthenticated, id, displayName, email, role, photoURL } = input;

      const data = {
        localAuth: {
          isAuthenticated,
          __typename: "LocalAuth",
          currentLocalUser: {
            id,
            displayName,
            email,
            role,
            photoURL,
            __typename: "CurrentLocalUser",
          },
        },
      };

      cache.writeData({ data });

      return null;
    },
  },
};

export default localResolvers;
