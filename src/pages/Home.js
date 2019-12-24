import React from "react";
import { Layout, Typography, Spin, Card, Row, Col } from "antd";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";

import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import SHOP_ITEMS from "../graphql/queries/shopItems";
import routes from "../utils/routes";

import { formatMoney } from "../utils/helpers";
const { Content } = Layout;
const { Meta } = Card;

const { Paragraph } = Typography;

function Home() {
  const { data, loading, error } = useQuery(SHOP_ITEMS);

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
              {data &&
                data.shopItems &&
                data.shopItems.map((item) => (
                  <Col key={item.id} span={24} sm={12} md={8} xl={6}>
                    <Link to={routes.shopItem + item.id}>
                      <Card
                        hoverable
                        cover={<img alt="example" src={item.image} />}
                      >
                        <Meta
                          title={item.name}
                          description={formatMoney(item.price)}
                        />
                      </Card>
                    </Link>
                  </Col>
                ))}
            </Row>
          </Col>
        </Row>
      </Content>
      <Footer />
    </Layout>
  );
}

export default Home;
