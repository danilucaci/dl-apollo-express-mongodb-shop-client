import gql from "graphql-tag";

const DELETE_CART_ITEM = gql`
  mutation deleteCartItem($input: DeleteCartItemInput!) {
    deleteCartItem(input: $input) {
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

export default DELETE_CART_ITEM;
