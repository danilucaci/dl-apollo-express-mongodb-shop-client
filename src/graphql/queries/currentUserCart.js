import gql from "graphql-tag";

const CURRENT_USER_CART = gql`
  query currentUser {
    currentUser {
      id
      cart {
        id
        quantity
        size
        item {
          id
          name
          description
          image
          price
        }
      }
    }
  }
`;

export default CURRENT_USER_CART;
