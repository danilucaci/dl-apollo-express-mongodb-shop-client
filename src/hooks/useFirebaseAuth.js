import { useEffect, useRef } from "react";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/react-hooks";

import { auth, signOut } from "../firebase/firebase";
import { LOCAL_AUTH } from "../apollo/localQueries";
import { SET_LOCAL_AUTH } from "../apollo/localMutations";

const SIGNUP_USER = gql`
  mutation signup($input: SignUpInput!) {
    signup(input: $input) {
      id
      email
      displayName
      role
    }
  }
`;

function useFirebaseAuth() {
  const unsuscribeFromAuth = useRef(null);

  const [signup, { error: mutationError, client }] = useMutation(SIGNUP_USER);

  const [setLocalAuth] = useMutation(SET_LOCAL_AUTH);

  const {
    data: { localAuth: { isAuthenticated } = {} },
  } = useQuery(LOCAL_AUTH);

  useEffect(() => {
    unsuscribeFromAuth.current = auth.onAuthStateChanged(
      function handleAuthChange(user) {
        if (user) {
          if (!isAuthenticated && !mutationError) {
            signup({
              variables: {
                input: {
                  id: user.uid,
                  displayName: user.displayName,
                  email: user.email,
                  role: "ADMIN",
                },
              },
              update: (_, { data: { signup } = {} }) => {
                const { __typename, ...data } = signup;

                setLocalAuth({
                  variables: {
                    input: {
                      isAuthenticated: true,
                      ...data,
                    },
                  },
                });
              },
            });
          }
        } else {
          if (isAuthenticated) {
            client.resetStore();
            signOut();
          }
        }
      },
      function handleAuthError(error) {
        console.log(error);
        if (isAuthenticated) {
          client.resetStore();
          signOut();
        }
      },
    );

    return () => {
      if (unsuscribeFromAuth.current) {
        unsuscribeFromAuth.current();
      }
    };
  }, [client, isAuthenticated, mutationError, setLocalAuth, signup]);

  return null;
}

export default useFirebaseAuth;
