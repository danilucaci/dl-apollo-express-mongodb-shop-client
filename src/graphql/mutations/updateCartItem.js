import gql from "graphql-tag";

const UPDATE_CART_ITEM = gql`
  mutation updateCartItem($input: UpdateCartItemInput) {
    updateCartItem(input: $input) {
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

export default UPDATE_CART_ITEM;
