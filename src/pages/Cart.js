import React, { useEffect } from "react";
import {
  Layout,
  Spin,
  Typography,
  Row,
  Col,
  Select,
  Divider,
  Button,
} from "antd";
import { useHistory } from "react-router-dom";
import Image from "react-bootstrap/Image";
import { useQuery, useMutation } from "@apollo/react-hooks";
import Header from "../components/Header/Header";

import CURRENT_USER_CART from "../graphql/queries/currentUserCart";
import CURRENT_USER_ORDERS from "../graphql/queries/currentUserOrders";
import DELETE_CART_ITEM from "../graphql/mutations/deleteCartItem";
import UPDATE_CART_ITEM from "../graphql/mutations/updateCartItem";
import ADD_ORDER from "../graphql/mutations/addOrder";
import Footer from "../components/Footer/Footer";
import {
  formatMoney,
  calculateItemTotal,
  calculateCartTotal,
} from "../utils/helpers";
import "./styles.css";

import withProtectedRoute from "../hoc/withProtectedRoute";
import { LOCAL_AUTH } from "../apollo/localQueries";
import routes from "../utils/routes";
const { Content } = Layout;
const { Option } = Select;

const { Paragraph, Title, Text } = Typography;
const quantityValues = Array.from({ length: 10 }, (_, i) => i + 1);

function Cart() {
  const { data: cartData, loading: cartLoading, error: cartError } = useQuery(
    CURRENT_USER_CART,
  );

  const history = useHistory();

  const {
    data: {
      localAuth: { currentLocalUser: { id: currentLocalUserID } = {} } = {},
    },
  } = useQuery(LOCAL_AUTH);

  const [deleteCartItem, { loading: deleteCartItemLoading }] = useMutation(
    DELETE_CART_ITEM,
  );
  const [
    addOrder,
    { loading: addOrderLoading, called: addOrderCalled, error: addOrderError },
  ] = useMutation(ADD_ORDER);
  const [updateCartItem, { loading: updateCartItemLoading }] = useMutation(
    UPDATE_CART_ITEM,
  );

  useEffect(() => {
    // Wait for the mutation to refetch to avoid seeing stale data in the orders confirmation
    if (addOrderCalled && !addOrderLoading && !addOrderError) {
      history.push(routes.orderConfirmation);
    }
  }, [addOrderCalled, addOrderError, addOrderLoading, history]);

  return (
    <Layout>
      <Header />
      <Content
        style={{
          background: "f3f3f3",
          paddingTop: 40,
          paddingLeft: 24,
          paddingRight: 24,
          paddingBottom: 48,
        }}
      >
        <Row type="flex" justify="center">
          <Col span={24} lg={18}>
            <Title level={2} style={{ marginBottom: 24 }}>
              Cart
            </Title>
            <Row gutter={[24, 24]}>
              <Col md={16}>
                <Layout style={{ padding: 20, background: "white" }}>
                  {cartError && <Paragraph>Something went wrong...</Paragraph>}
                  {cartLoading && <Spin size="large" />}
                  {cartData &&
                  cartData.currentUser &&
                  cartData.currentUser.cart.length > 0 ? (
                    cartData.currentUser.cart.map((cartItem) => (
                      <Row key={cartItem.id} className="ItemsRow">
                        <Col>
                          <Row
                            type="flex"
                            justify="space-between"
                            gutter={[16, 16]}
                          >
                            <Col span={24} sm={8}>
                              <Image fluid src={cartItem.item.image} />
                            </Col>
                            <Col span={24} sm={16}>
                              <Row
                                className="CartItemHeight"
                                gutter={[
                                  { xs: 16, sm: 0 },
                                  { xs: 16, sm: 0 },
                                ]}
                              >
                                <Col
                                  span={24}
                                  sm={18}
                                  className="CartItemHeight"
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "flex-start",
                                  }}
                                >
                                  <Paragraph strong style={{ marginBottom: 8 }}>
                                    {cartItem.item.name}
                                  </Paragraph>
                                  <Paragraph style={{ marginBottom: 8 }}>
                                    Size: {cartItem.size}
                                  </Paragraph>
                                  <Paragraph
                                    style={{ marginBottom: 8, marginTop: 8 }}
                                  >
                                    Total:{" "}
                                    {formatMoney(calculateItemTotal(cartItem))}
                                  </Paragraph>
                                  <Button
                                    className="CartItemRemoveButton"
                                    type="ghost"
                                    disabled={deleteCartItemLoading}
                                    loading={deleteCartItemLoading}
                                    onClick={() => {
                                      deleteCartItem({
                                        variables: {
                                          input: {
                                            id: cartItem.id,
                                          },
                                        },
                                        update: (
                                          cache,
                                          { data: { deleteCartItem } },
                                        ) => {
                                          const {
                                            currentUser,
                                          } = cache.readQuery({
                                            query: CURRENT_USER_CART,
                                          });

                                          const filteredUserCart = currentUser.cart.filter(
                                            (item) =>
                                              item.id !== deleteCartItem.id,
                                          );

                                          cache.writeQuery({
                                            query: CURRENT_USER_CART,
                                            data: {
                                              currentUser: {
                                                ...currentUser,
                                                cart: [...filteredUserCart],
                                              },
                                            },
                                          });
                                        },
                                      });
                                    }}
                                  >
                                    Remove from cart
                                  </Button>
                                </Col>
                                <Col span={24} sm={6}>
                                  <Select
                                    placeholder="Quantity"
                                    loading={updateCartItemLoading}
                                    defaultValue={cartItem.quantity}
                                    onChange={(value) =>
                                      updateCartItem({
                                        variables: {
                                          input: {
                                            id: cartItem.id,
                                            quantity: Number(value),
                                          },
                                        },
                                      })
                                    }
                                    style={{ width: "100%" }}
                                  >
                                    {quantityValues.map((x) => (
                                      <Option key={x}>{x}</Option>
                                    ))}
                                  </Select>
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        </Col>
                        <Col>
                          <Divider className="ItemsDivider" />
                        </Col>
                      </Row>
                    ))
                  ) : (
                    <Row>
                      <Col>
                        <Title level={4}>Your cart is empty</Title>
                        <Paragraph>Add some items to get started.</Paragraph>
                      </Col>
                    </Row>
                  )}
                </Layout>
              </Col>
              <Col md={8}>
                <Row style={{ background: "white", padding: 16 }}>
                  <Col>
                    <Title level={3} style={{ marginBottom: 24 }}>
                      Total
                    </Title>
                  </Col>
                  <Col>
                    <Row type="flex" justify="space-between">
                      <Col>
                        <Text>Subtotal</Text>
                      </Col>
                      <Col>
                        <Text strong>
                          {cartData &&
                          cartData.currentUser &&
                          cartData.currentUser.cart
                            ? formatMoney(
                                calculateCartTotal(cartData.currentUser.cart),
                              )
                            : 0}
                        </Text>
                      </Col>
                    </Row>
                  </Col>
                  <Col>
                    <Button
                      type="primary"
                      size="large"
                      style={{ width: "100%", marginTop: 24 }}
                      disabled={addOrderLoading}
                      loading={addOrderLoading}
                      onClick={() => {
                        if (currentLocalUserID) {
                          addOrder({
                            variables: {
                              input: {
                                user: currentLocalUserID,
                              },
                            },
                            // Wait for the mutation to refetch to avoid seeing stale data in the orders confirmation
                            awaitRefetchQueries: true,
                            refetchQueries: [
                              {
                                query: CURRENT_USER_ORDERS,
                              },
                              {
                                query: CURRENT_USER_CART,
                              },
                            ],
                          });
                        }
                      }}
                    >
                      Checkout
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
      </Content>

      <Footer />
    </Layout>
  );
}

export default withProtectedRoute()(Cart);
