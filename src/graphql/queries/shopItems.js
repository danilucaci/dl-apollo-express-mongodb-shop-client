import gql from "graphql-tag";

const SHOP_ITEMS = gql`
  query shopItems($limit: Int! = 8, $skip: Int, $after: String) {
    shopItems(limit: $limit, skip: $skip, after: $after) {
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
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
