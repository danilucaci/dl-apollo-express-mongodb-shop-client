import React from "react";
import {
  Layout,
  InputNumber,
  Button,
  Typography,
  Form,
  Input,
  Row,
  Col,
} from "antd";
import { useMutation } from "@apollo/react-hooks";
import withProtectedRoute from "../hoc/withProtectedRoute";
import SHOP_ITEMS from "../graphql/queries/shopItems";
import ADD_SHOP_ITEM from "../graphql/mutations/addShopItem";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

const { Content } = Layout;
const { Title, Paragraph } = Typography;
const { TextArea } = Input;

function AddShopItemForm({ form }) {
  const [addShopItem, { called, error, loading }] = useMutation(ADD_SHOP_ITEM, {
    update(cache, { data: { addShopItem } }) {
      const { shopItems } = cache.readQuery({ query: SHOP_ITEMS });

      cache.writeQuery({
        query: SHOP_ITEMS,
        data: {
          shopItems: [...shopItems, addShopItem],
        },
      });
    },
  });

  const { getFieldDecorator, validateFields } = form;

  function handleSubmit(e) {
    e.preventDefault();
    validateFields((errors, values) => {
      console.log({ errors });
      console.log({ values });

      if (!errors) {
        const { name, description, image, price } = values;

        addShopItem({
          variables: {
            input: {
              name,
              description,
              image,
              price,
            },
          },
        });
      }
    });
  }

  return (
    <Form layout="vertical" onSubmit={handleSubmit}>
      <Form.Item label="Name" hasFeedback>
        {getFieldDecorator(`name`, {
          rules: [
            {
              required: true,
              message: "Item name is missing",
            },
          ],
        })(<Input placeholder="Item name" />)}
      </Form.Item>
      <Form.Item label="Image url" hasFeedback>
        {getFieldDecorator(`image`, {
          rules: [
            {
              required: true,
              message: "Item image is missing",
            },
          ],
        })(<Input placeholder="Item image url" />)}
      </Form.Item>
      <Form.Item label="Price" hasFeedback>
        {getFieldDecorator(`price`, {
          rules: [
            {
              required: true,
              message: "Item price is missing",
            },
          ],
        })(
          <InputNumber
            style={{
              width: "100%",
            }}
            placeholder="Price"
            initialValue={0}
          />,
        )}
      </Form.Item>
      <Form.Item label="Description" hasFeedback>
        {getFieldDecorator(`description`, {
          rules: [
            {
              required: true,
              message: "Item description is missing",
            },
          ],
        })(<TextArea placeholder="Item description" />)}
      </Form.Item>
      {called && !error && !loading && <Paragraph>Item added</Paragraph>}
      {called && error && (
        <Paragraph>{JSON.stringify(error, null, 2)}</Paragraph>
      )}
      <Form.Item>
        <Button
          type="primary"
          disabled={loading}
          loading={loading}
          size="large"
          htmlType="submit"
          style={{
            minWidth: 200,
          }}
        >
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}

const EnhancedAddShopItemForm = Form.create()(AddShopItemForm);

function Dashboard() {
  return (
    <Layout style={{ background: "#f3f3f3" }}>
      <Header />
      <Content
        style={{
          paddingTop: 40,
          paddingBottom: 80,
        }}
      >
        <Row type="flex" justify="center">
          <Col span={24} md={16} xl={12}>
            <Row gutter={[24, 24]}>
              <Col>
                <Title level={2}>Add shop item</Title>
              </Col>
              <Col
                style={{
                  background: "white",
                  padding: 32,
                }}
              >
                <EnhancedAddShopItemForm />
              </Col>
            </Row>
          </Col>
        </Row>
      </Content>
      <Footer />
    </Layout>
  );
}

export default withProtectedRoute()(Dashboard);
