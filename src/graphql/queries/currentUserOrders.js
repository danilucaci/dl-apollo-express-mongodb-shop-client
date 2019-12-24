import gql from "graphql-tag";

const CURRENT_USER_ORDERS = gql`
  query currentUser {
    currentUser {
      id
      orders {
        id
        total
        createdAt
        updatedAt
        items {
          id
          name
          description
          image
          price
          size
          quantity
        }
      }
    }
  }
`;

export default CURRENT_USER_ORDERS;
