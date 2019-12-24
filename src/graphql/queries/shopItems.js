import gql from "graphql-tag";

const SHOP_ITEMS = gql`
  query shopItems {
    shopItems {
      id
      name
      description
      image
      price
    }
  }
`;

export default SHOP_ITEMS;
