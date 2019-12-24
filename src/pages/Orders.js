import React from "react";
import { Layout, Typography, Spin, Row, Col, Divider } from "antd";
import { useQuery } from "@apollo/react-hooks";
import Image from "react-bootstrap/Image";

import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import CURRENT_USER_ORDERS from "../graphql/queries/currentUserOrders";
import withProtectedRoute from "../hoc/withProtectedRoute";
import "./styles.css";

import { formatMoney, formatOrderDate } from "../utils/helpers";
const { Content } = Layout;

const { Paragraph, Title } = Typography;

function Orders() {
  const { data, loading, error } = useQuery(CURRENT_USER_ORDERS);

  return (
    <Layout style={{ background: "#f3f3f3" }}>
      <Header />
      <Content style={{ padding: "40px 24px" }}>
        <Row type="flex" justify="center">
          <Col lg={16} xl={16}>
            <Row type="flex" justify={loading ? "center" : "start"}>
              <Col style={{ padding: 8 }}>
                <Title level={3}>Your orders</Title>
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

              {data &&
                data.currentUser &&
                data.currentUser.orders &&
                data.currentUser.orders.map((order) => (
                  <Col key={order.id}>
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
                            <Paragraph>{order.id}</Paragraph>
                          </Col>

                          <Col span={10}>
                            <Paragraph strong style={{ marginBottom: 8 }}>
                              Date:
                            </Paragraph>
                            <Paragraph>
                              {formatOrderDate(order.createdAt)}
                            </Paragraph>
                          </Col>

                          <Col span={4}>
                            <Paragraph strong style={{ marginBottom: 8 }}>
                              Total:
                            </Paragraph>
                            <Paragraph>{formatMoney(order.total)}</Paragraph>
                          </Col>
                        </Row>
                      </Col>

                      <Col
                        span={24}
                        style={{ background: "white", padding: 32 }}
                      >
                        <Title level={4} style={{ marginBottom: 16 }}>
                          Items
                        </Title>
                        {order.items.map((item) => (
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
                                  <Paragraph strong>
                                    Size: {item.size}
                                  </Paragraph>
                                  <Paragraph strong>
                                    Quantity: {item.quantity}
                                  </Paragraph>
                                </Col>
                              </Row>
                            </Col>
                            <Col>
                              <Col>
                                <Divider className="ItemsDivider" />
                              </Col>
                            </Col>
                          </Row>
                        ))}
                      </Col>
                    </Row>
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

export default withProtectedRoute()(Orders);
