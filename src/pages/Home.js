import React from "react";
import { Layout, Typography, Spin, Row, Col, Button } from "antd";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import Image from "react-bootstrap/Image";

import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import SHOP_ITEMS from "../graphql/queries/shopItems";
import routes from "../utils/routes";
import { formatMoney } from "../utils/helpers";
const { Content } = Layout;
const { Paragraph } = Typography;

function Home() {
  const {
    data: {
      shopItems: { edges, pageInfo: { hasNextPage, endCursor } = {} } = {},
    } = {},
    loading,
    error,
    fetchMore,
  } = useQuery(SHOP_ITEMS);

  return (
    <Layout style={{ background: "#f3f3f3" }}>
      <Header />
      <Content style={{ padding: "48px 24px" }}>
        <Row type="flex" justify="center">
          <Col lg={20}>
            <Row
              gutter={[24, 24]}
              type="flex"
              justify={loading ? "center" : "start"}
            >
              {error && (
                <Col>
                  <Paragraph>Something went wrong...</Paragraph>
                </Col>
              )}
              {loading && (
                <Col>
                  <Spin size="large" />
                </Col>
              )}
              {edges &&
                edges.map((edge) => (
                  <Col key={edge.node.id} span={24} sm={12} md={8} xl={6}>
                    <Link to={routes.shopItem + edge.node.id}>
                      <Row>
                        <Col>
                          <Image fluid src={edge.node.image} />
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <Paragraph
                            strong
                            style={{
                              marginTop: 12,
                              marginBottom: 4,
                            }}
                          >
                            {formatMoney(edge.node.price)}
                          </Paragraph>
                          <Paragraph>{edge.node.name}</Paragraph>
                        </Col>
                      </Row>
                    </Link>
                  </Col>
                ))}
            </Row>
            {!loading && (
              <Row
                type="flex"
                justify="center"
                style={{
                  marginTop: 80,
                }}
              >
                <Col>
                  <Button
                    size="large"
                    style={{
                      minWidth: 240,
                    }}
                    loading={loading}
                    disabled={loading || !hasNextPage}
                    onClick={() => {
                      fetchMore({
                        variables: {
                          after: endCursor,
                        },
                        updateQuery: (prevResult, { fetchMoreResult }) => {
                          if (!fetchMoreResult) return prevResult;

                          const newEdges = fetchMoreResult.shopItems.edges;
                          const newPageInfo =
                            fetchMoreResult.shopItems.pageInfo;

                          const data = {
                            shopItems: {
                              ...prevResult.shopItems,
                              edges: [
                                ...prevResult.shopItems.edges,
                                ...newEdges,
                              ],
                              pageInfo: newPageInfo,
                            },
                          };

                          return data;
                        },
                      });
                    }}
                  >
                    {hasNextPage ? "Load more" : "No more results"}
                  </Button>
                </Col>
              </Row>
            )}
          </Col>
        </Row>
      </Content>
      <Footer />
    </Layout>
  );
}

export default Home;
