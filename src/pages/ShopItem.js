import React, { useState } from "react";
import { Layout, Spin, Typography, Row, Col, Select, Button } from "antd";
import Image from "react-bootstrap/Image";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/react-hooks";
import Header from "../components/Header/Header";

import SHOP_ITEM from "../graphql/queries/shopItem";
import ITEM_SIZES from "../graphql/queries/itemSizes";
import CURRENT_USER_CART from "../graphql/queries/currentUserCart";
import ADD_CART_ITEM from "../graphql/mutations/addCartItem";
import Footer from "../components/Footer/Footer";
import { formatMoney } from "../utils/helpers";
import withProtectedRoute from "../hoc/withProtectedRoute";
const { Content } = Layout;
const { Option } = Select;

const { Paragraph, Title } = Typography;

function ShopItem() {
  let { id } = useParams();
  const [selectedItemSize, setSelectedItemSize] = useState("");

  const [
    addCartItem,
    { called: addCartItemCalled, error: addCartItemError },
  ] = useMutation(ADD_CART_ITEM);

  const {
    data: { shopItem } = {},
    loading: shopItemLoading,
    error: shopItemError,
  } = useQuery(SHOP_ITEM, {
    variables: { id },
  });

  const {
    data: { __type: { enumValues: shopItemSizes } = {} } = {},
    loading: shopItemSizesLoading,
  } = useQuery(ITEM_SIZES);

  function handleItemSizeChange(value) {
    setSelectedItemSize(value);
  }

  function handleAddToCart() {
    if (selectedItemSize) {
      addCartItem({
        variables: {
          input: {
            item: id,
            quantity: 1,
            size: selectedItemSize,
          },
        },
        refetchQueries: [
          {
            query: CURRENT_USER_CART,
          },
        ],
      });
    }
  }

  return (
    <Layout>
      <Header />
      <Content
        style={{
          paddingTop: 48,
          paddingRight: 16,
          paddingBottom: 48,
          paddingLeft: 16,

          background: "#f3f3f3",
        }}
      >
        <Row type="flex" justify="center">
          <Col lg={16} style={{ padding: 24, background: "#fff" }}>
            <Row
              gutter={[24, 24]}
              type="flex"
              justify={shopItemLoading ? "center" : "start"}
            >
              {shopItemError && (
                <Col>
                  <Paragraph>Something went wrong...</Paragraph>
                </Col>
              )}
              {shopItemLoading && (
                <Col>
                  <Spin size="large" />
                </Col>
              )}
              {shopItem && (
                <>
                  <Col md={12}>
                    <Image fluid src={shopItem.image} />
                  </Col>
                  <Col
                    md={12}
                    style={{
                      padding: 24,
                    }}
                  >
                    <Title level={3}>{shopItem.name}</Title>
                    <Paragraph>{shopItem.description}</Paragraph>
                    <Paragraph strong>{formatMoney(shopItem.price)}</Paragraph>
                    <Select
                      style={{ width: "100%", marginBottom: 24 }}
                      placeholder="Select a size"
                      onChange={handleItemSizeChange}
                      loading={shopItemSizesLoading}
                    >
                      {shopItemSizes &&
                        shopItemSizes.map((size) => (
                          <Option key={size.name} value={size.name}>
                            {size.name}
                          </Option>
                        ))}
                    </Select>
                    <Button
                      type="primary"
                      size="large"
                      loading={shopItemLoading}
                      onClick={handleAddToCart}
                      disabled={!selectedItemSize}
                      icon={
                        addCartItemCalled && !addCartItemError
                          ? "check-circle"
                          : "shopping-cart"
                      }
                    >
                      {addCartItemCalled && !addCartItemError
                        ? "Added!"
                        : "Add to cart"}
                    </Button>
                  </Col>
                </>
              )}
            </Row>
          </Col>
        </Row>
      </Content>
      <Footer />
    </Layout>
  );
}

export default withProtectedRoute()(ShopItem);
