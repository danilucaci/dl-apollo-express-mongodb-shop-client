import gql from "graphql-tag";

const ADD_SHOP_ITEM = gql`
  mutation addShopItem($input: AddShopItemInput) {
    addShopItem(input: $input) {
      id
      name
      description
      image
      price
    }
  }
`;

export default ADD_SHOP_ITEM;
