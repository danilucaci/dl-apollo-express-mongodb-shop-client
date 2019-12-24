import React from "react";
import { NavLink } from "react-router-dom";
import {
  Layout,
  Menu,
  InputNumber,
  Icon,
  Button,
  Typography,
  Form,
  Input,
} from "antd";
import { useMutation } from "@apollo/react-hooks";
import withProtectedRoute from "../hoc/withProtectedRoute";
import routes from "../utils/routes";
import SHOP_ITEMS from "../graphql/queries/shopItems";
import ADD_SHOP_ITEM from "../graphql/mutations/addShopItem";

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
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
    <Form
      layout="vertical"
      style={{
        maxWidth: 480,
      }}
      onSubmit={handleSubmit}
    >
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
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}

const EnhancedAddShopItemForm = Form.create()(AddShopItemForm);

function Dashboard() {
  return (
    <Layout>
      <Header className="header">
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["2"]}
          style={{ lineHeight: "64px" }}
        >
          <Menu.Item key="1">
            <NavLink to={routes.home}>Clothalia</NavLink>
          </Menu.Item>
        </Menu>
      </Header>
      <Layout>
        <Sider width={200} style={{ background: "#fff" }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={["1"]}
            defaultOpenKeys={["shopItems"]}
            style={{ height: "100%", borderRight: 0 }}
          >
            <SubMenu
              key="shopItems"
              title={
                <span>
                  <Icon type="shop" />
                  Shop items
                </span>
              }
            >
              <Menu.Item key="1">
                <Icon type="plus-circle" />
                Add shop item
              </Menu.Item>
            </SubMenu>
          </Menu>
        </Sider>
        <Layout style={{ padding: "0 24px 24px" }}>
          <Title
            level={4}
            style={{
              marginTop: 24,
            }}
          >
            Add shop item
          </Title>
          <Content
            style={{
              background: "#fff",
              padding: 24,
              marginTop: 8,
              minHeight: 280,
            }}
          >
            <EnhancedAddShopItemForm />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}

export default withProtectedRoute()(Dashboard);
