import React from "react";
import { Layout, Typography, Spin, Row, Col } from "antd";
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
                      <Row>
                        <Col>
                          <Image fluid src={item.image} />
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
                            {formatMoney(item.price)}
                          </Paragraph>
                          <Paragraph>{item.name}</Paragraph>
                        </Col>
                      </Row>
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
