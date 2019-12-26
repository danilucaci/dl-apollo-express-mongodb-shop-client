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
    { called: mutationCalled, error: mutationError },
  ] = useMutation(ADD_CART_ITEM);

  const { data: itemData, loading: itemLoading, error: itemError } = useQuery(
    SHOP_ITEM,
    {
      variables: { id },
    },
  );

  const { data: itemSizesData, loading: itemSizesLoading } = useQuery(
    ITEM_SIZES,
  );

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
              justify={itemLoading ? "center" : "start"}
            >
              {itemError && (
                <Col>
                  <Paragraph>Something went wrong...</Paragraph>
                </Col>
              )}
              {itemLoading && (
                <Col>
                  <Spin size="large" />
                </Col>
              )}
              {itemData && itemData.shopItem && (
                <>
                  <Col md={12}>
                    <Image fluid src={itemData.shopItem.image} />
                  </Col>
                  <Col
                    md={12}
                    style={{
                      padding: 24,
                    }}
                  >
                    <Title level={3}>{itemData.shopItem.name}</Title>
                    <Paragraph>{itemData.shopItem.description}</Paragraph>
                    <Paragraph strong>
                      {formatMoney(itemData.shopItem.price)}
                    </Paragraph>
                    <Select
                      style={{ width: "100%", marginBottom: 24 }}
                      placeholder="Select a size"
                      onChange={handleItemSizeChange}
                      loading={itemSizesLoading}
                    >
                      {itemSizesData &&
                        itemSizesData.__type &&
                        itemSizesData.__type.enumValues.map((size) => (
                          <Option key={size.name} value={size.name}>
                            {size.name}
                          </Option>
                        ))}
                    </Select>
                    <Button
                      type="primary"
                      size="large"
                      loading={itemLoading}
                      onClick={handleAddToCart}
                      disabled={!selectedItemSize}
                      icon={
                        mutationCalled && !mutationError
                          ? "check-circle"
                          : "shopping-cart"
                      }
                    >
                      {mutationCalled && !mutationError
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

export default ShopItem;
// export default withProtectedRoute()(ShopItem);
