import gql from "graphql-tag";

const ITEM_SIZES = gql`
  query itemSizes {
    __type(name: "Size") {
      name
      enumValues {
        name
      }
    }
  }
`;

export default ITEM_SIZES;
