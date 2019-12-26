import gql from "graphql-tag";

const SHOP_ITEMS = gql`
  query shopItems(
    $first: Int = 8
    $before: String
    $after: String
    $skip: Int
  ) {
    shopItems(first: $first, before: $before, after: $after, skip: $skip) {
      totalCount
      pageInfo {
        hasNextPage
        startCursor
        endCursor
      }
      edges {
        cursor
        node {
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

export default SHOP_ITEMS;
