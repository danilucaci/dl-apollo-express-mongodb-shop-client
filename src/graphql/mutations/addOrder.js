import gql from "graphql-tag";

const ADD_ORDER = gql`
  mutation addOrder($input: AddOrderInput!) {
    addOrder(input: $input) {
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
`;

export default ADD_ORDER;
