import gql from "graphql-tag";

const SHOP_ITEM = gql`
  query shopItem($id: ID!) {
    shopItem(id: $id) {
      id
      name
      description
      image
      price
    }
  }
`;

export default SHOP_ITEM;
