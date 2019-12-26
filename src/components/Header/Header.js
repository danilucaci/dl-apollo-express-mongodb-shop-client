import React, { useState } from "react";
import { NavLink, Link, useHistory } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import Image from "react-bootstrap/Image";
import {
  Layout,
  Menu,
  Button,
  Avatar,
  Dropdown,
  Row,
  Col,
  Typography,
  Spin,
  Icon,
  Badge,
  Divider,
  Drawer,
} from "antd";

import { signInWithGoogle, signOut } from "../../firebase/firebase";
import { LOCAL_AUTH } from "../../apollo/localQueries";
import CURRENT_USER_CART from "../../graphql/queries/currentUserCart";
import avatarPlaceholder from "../../assets/img/avatar-placeholder.png";
import routes from "../../utils/routes";
import {
  formatMoney,
  calculateItemTotal,
  calculateCartTotal,
  getCartSize,
} from "../../utils/helpers";

const { Header: AntDHeader } = Layout;
const { Paragraph, Text, Title } = Typography;

function Dropdowns() {
  const { data, loading, error } = useQuery(CURRENT_USER_CART);
  const [cartOpen, setCartOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  let history = useHistory();

  const {
    data: { localAuth: { currentLocalUser } = {} },
  } = useQuery(LOCAL_AUTH);

  return (
    <>
      <Badge
        onClick={() => setCartOpen((open) => !open)}
        count={
          loading
            ? 0
            : data &&
              data.currentUser &&
              data.currentUser.cart &&
              getCartSize(data.currentUser.cart)
        }
      >
        <Icon
          type="shopping-cart"
          style={{
            padding: 8,
            fontSize: 20,
          }}
        />
      </Badge>

      <Dropdown
        overlay={DropdownMenu}
        onVisibleChange={() => setAccountMenuOpen((open) => !open)}
        visible={accountMenuOpen}
        overlayStyle={{
          minWidth: "160px",
        }}
      >
        <Avatar
          src={
            currentLocalUser.photoURL
              ? currentLocalUser.photoURL
              : avatarPlaceholder
          }
          onError={(e) => (e.target.src = avatarPlaceholder)}
          style={{
            marginLeft: 24,
          }}
        >
          Account
        </Avatar>
      </Dropdown>
      <Drawer
        title="Cart"
        width={320}
        onClose={() => setCartOpen(false)}
        visible={cartOpen}
        bodyStyle={{ paddingBottom: 40 }}
      >
        <Row>
          {loading && (
            <Col>
              <Spin size="large" />
            </Col>
          )}

          {error && (
            <Col>
              <Paragraph strong>Something went wrong</Paragraph>
            </Col>
          )}

          {data && data.currentUser && data.currentUser.cart.length > 0 ? (
            data.currentUser.cart.map((cartItem) => (
              <React.Fragment key={cartItem.id}>
                <Col>
                  <Row type="flex" gutter={[24, 24]}>
                    <Col span={8}>
                      <Image fluid src={cartItem.item.image} />
                    </Col>
                    <Col span={16}>
                      <Link to={routes.shopItem + cartItem.item.id}>
                        <Paragraph strong>{cartItem.item.name}</Paragraph>
                      </Link>
                      <Paragraph>Quantity: {cartItem.quantity}</Paragraph>
                      <Paragraph>Size: {cartItem.size}</Paragraph>
                      <Paragraph>
                        Total:{" "}
                        <Text strong>
                          {formatMoney(calculateItemTotal(cartItem))}
                        </Text>
                      </Paragraph>
                    </Col>
                  </Row>
                </Col>

                <Col>
                  <Divider type="horizontal" />
                </Col>
              </React.Fragment>
            ))
          ) : (
            <>
              <Col>
                <Title level={4}>Your cart is empty</Title>
                <Paragraph>Add some items to get started.</Paragraph>
              </Col>
              <Col>
                <Divider type="horizontal" />
              </Col>
            </>
          )}

          {!loading && (
            <Row style={{ marginTop: "auto" }}>
              <Col>
                <Row type="flex" justify="space-between">
                  <Col>
                    <Title
                      level={4}
                      style={{
                        display: "inline-block",
                        marginRight: 24,
                        marginBottom: 0,
                      }}
                    >
                      Total
                    </Title>
                  </Col>
                  <Col>
                    <Text
                      strong
                      style={{
                        fontSize: 24,
                        display: "inline-block",
                      }}
                    >
                      {data && data.currentUser && data.currentUser.cart
                        ? formatMoney(calculateCartTotal(data.currentUser.cart))
                        : 0}
                    </Text>
                  </Col>
                </Row>
              </Col>
              <Col>
                <Button
                  size="large"
                  type="primary"
                  style={{ width: "100%", marginTop: 16 }}
                  onClick={() => history.push(routes.cart)}
                >
                  Open Cart
                </Button>
              </Col>
            </Row>
          )}
        </Row>
      </Drawer>
    </>
  );
}

function DropdownMenu() {
  return (
    <Menu>
      <Menu.Item key="profile">
        <NavLink to={routes.profile}>
          <Icon type="user" style={{ marginRight: 16 }} />
          Profile
        </NavLink>
      </Menu.Item>
      <Menu.Item key="dashboard">
        <NavLink to={routes.dashboard}>
          <Icon type="dashboard" style={{ marginRight: 16 }} /> Dashboard
        </NavLink>
      </Menu.Item>
      <Menu.Item key="orders">
        <NavLink to={routes.orders}>
          <Icon type="shopping" style={{ marginRight: 16 }} /> Orders
        </NavLink>
      </Menu.Item>
      <Menu.Item key="sign-out" style={{ marginTop: 16 }}>
        <Button
          onClick={() => signOut()}
          icon="logout"
          style={{
            width: "100%",
          }}
        >
          Sign out
        </Button>
      </Menu.Item>
    </Menu>
  );
}

function Header() {
  const {
    data: { localAuth: { isAuthenticated } = {} },
  } = useQuery(LOCAL_AUTH);

  return (
    <AntDHeader
      style={{
        backgroundColor: "white",
        padding: "0 24px",
        borderBottom: "1px solid lightgrey",
      }}
    >
      <Row type="flex" justify="center">
        <Col span={24} lg={18}>
          <Row type="flex" justify="space-between">
            <Col>
              <NavLink to="/">
                <Text strong>Clothalia</Text>
              </NavLink>
            </Col>
            <Col
              style={{
                textDecoration: "none",
              }}
            >
              {isAuthenticated ? (
                <Dropdowns />
              ) : (
                <Button onClick={() => signInWithGoogle()}>Sign in</Button>
              )}
            </Col>
          </Row>
        </Col>
      </Row>
    </AntDHeader>
  );
}

export default Header;
