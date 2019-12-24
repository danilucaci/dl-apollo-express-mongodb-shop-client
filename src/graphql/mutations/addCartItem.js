import gql from "graphql-tag";

const ADD_CART_ITEM = gql`
  mutation addCartItem($input: AddCartItemInput) {
    addCartItem(input: $input) {
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
`;

export default ADD_CART_ITEM;
