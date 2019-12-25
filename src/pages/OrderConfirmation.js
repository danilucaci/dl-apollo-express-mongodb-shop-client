import React from "react";
import { Layout, Typography, Spin, Row, Col, Divider } from "antd";
import { useQuery } from "@apollo/react-hooks";
import Image from "react-bootstrap/Image";

import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import CURRENT_USER_ORDERS from "../graphql/queries/currentUserOrders";
import withProtectedRoute from "../hoc/withProtectedRoute";

import { formatMoney, formatOrderDate } from "../utils/helpers";
const { Content } = Layout;

const { Paragraph, Title } = Typography;

function OrderConfirmation() {
  const { data, loading, error } = useQuery(CURRENT_USER_ORDERS);

  return (
    <Layout style={{ background: "#f3f3f3" }}>
      <Header />
      <Content style={{ padding: "40px 24px" }}>
        <Row type="flex" justify="center">
          <Col lg={20} xl={16}>
            <Row type="flex" justify={loading ? "center" : "start"}>
              <Col style={{ padding: 8 }}>
                <Title level={3}>Your order</Title>
              </Col>
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
              {data && data.currentUser && data.currentUser.orders.length > 0 && (
                <Col>
                  <Row style={{ padding: 12 }}>
                    <Col
                      span={24}
                      style={{
                        background: "white",
                        paddingTop: 32,
                        paddingLeft: 32,
                        paddingRight: 32,
                        paddingBottom: 0,
                      }}
                    >
                      <Row type="flex" gutter={24}>
                        <Col span={10}>
                          <Paragraph strong style={{ marginBottom: 8 }}>
                            Order ID:
                          </Paragraph>
                          <Paragraph>{data.currentUser.orders[0].id}</Paragraph>
                        </Col>

                        <Col span={10}>
                          <Paragraph strong style={{ marginBottom: 8 }}>
                            Date:
                          </Paragraph>
                          <Paragraph>
                            {formatOrderDate(
                              data.currentUser.orders[0].createdAt,
                            )}
                          </Paragraph>
                        </Col>

                        <Col span={4}>
                          <Paragraph strong style={{ marginBottom: 8 }}>
                            Total:
                          </Paragraph>
                          <Paragraph>
                            {formatMoney(data.currentUser.orders[0].total)}
                          </Paragraph>
                        </Col>
                      </Row>
                    </Col>

                    <Col span={24} style={{ background: "white", padding: 32 }}>
                      <Title level={4} style={{ marginBottom: 16 }}>
                        Items
                      </Title>
                      {data.currentUser.orders[0].items.map((item) => (
                        <Row key={item.id} className="ItemsRow">
                          <Col>
                            <Row type="flex" gutter={[24, 24]}>
                              <Col span={6}>
                                <Image fluid src={item.image} />
                              </Col>
                              <Col span={18}>
                                <Paragraph strong>{item.name}</Paragraph>
                                <Paragraph strong>
                                  Cost: {formatMoney(item.price)}
                                </Paragraph>
                                <Paragraph strong>Size: {item.size}</Paragraph>
                                <Paragraph strong>
                                  Quantity: {item.quantity}
                                </Paragraph>
                              </Col>
                            </Row>
                          </Col>
                          <Col>
                            <Divider className="ItemsDivider" />
                          </Col>
                        </Row>
                      ))}
                    </Col>
                  </Row>
                </Col>
              )}
            </Row>
          </Col>
        </Row>
      </Content>
      <Footer />
    </Layout>
  );
}

export default withProtectedRoute()(OrderConfirmation);
