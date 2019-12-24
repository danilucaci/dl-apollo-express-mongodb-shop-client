const localResolvers = {
  Mutation: {
    setLocalAuth: (_, { input }, { cache }) => {
      const { isAuthenticated, id, displayName, email, role } = input;

      const data = {
        localAuth: {
          isAuthenticated,
          __typename: "LocalAuth",
          currentLocalUser: {
            id,
            displayName,
            email,
            role,
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
