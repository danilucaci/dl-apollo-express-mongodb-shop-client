import React from "react";
import {
  Layout,
  Typography,
  Spin,
  Row,
  Col,
  Divider,
  Form,
  Input,
  Button,
} from "antd";
import { useQuery, useMutation } from "@apollo/react-hooks";
import Image from "react-bootstrap/Image";
import gql from "graphql-tag";

import withProtectedRoute from "../hoc/withProtectedRoute";
import Header from "../components/Header/Header";
import { LOCAL_AUTH } from "../apollo/localQueries";
import Footer from "../components/Footer/Footer";
import avatarPlaceholder from "../assets/img/avatar-placeholder.png";

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const UPDATE_CURRENT_USER = gql`
  mutation updateCurrentUser($input: UpdateCurrentUserInput) {
    updateCurrentUser(input: $input) {
      id
      displayName
      email
      role
    }
  }
`;

const Profile = Form.create()(({ form }) => {
  const [
    updateCurrentUser,
    {
      called: updateUserCalled,
      loading: updateUserLoading,
      error: updateUserError,
    },
  ] = useMutation(UPDATE_CURRENT_USER);

  const {
    data: {
      localAuth: { currentLocalUser } = {},
      error: userError,
      loading: userLoading,
    },
  } = useQuery(LOCAL_AUTH);

  const { getFieldDecorator, validateFields } = form;

  function handleSubmit(e) {
    e.preventDefault();
    validateFields((errors, values) => {
      if (!errors) {
        const { fullname, photoURL } = values;

        updateCurrentUser({
          variables: {
            input: {
              displayName: fullname,
              photoURL: photoURL,
            },
          },
          update: (cache, { data: { updateCurrentUser } = {} }) => {
            const localAuthData = cache.readQuery({
              query: LOCAL_AUTH,
            });

            cache.writeData({
              data: {
                localAuth: {
                  ...localAuthData.localAuth,
                  __typename: "LocalAuth",
                  currentLocalUser: {
                    ...localAuthData.currentLocalUser,
                    ...updateCurrentUser,
                    __typename: "CurrentLocalUser",
                  },
                },
              },
            });
          },
        });
      }
    });
  }

  return (
    <Layout style={{ background: "#f3f3f3" }}>
      <Header />
      <Content style={{ padding: "48px 24px" }}>
        <Row type="flex" justify="center">
          <Col md={20} xl={12}>
            <Row
              gutter={[24, 24]}
              type="flex"
              justify={userLoading ? "center" : "start"}
            >
              {userError && (
                <Col>
                  <Paragraph>Something went wrong...</Paragraph>
                </Col>
              )}
              {userLoading && (
                <Col>
                  <Spin size="large" />
                </Col>
              )}

              <Col>
                <Title level={2}>Your account</Title>
              </Col>

              {currentLocalUser && (
                <Col
                  style={{
                    background: "white",
                    padding: 32,
                  }}
                >
                  <Row>
                    <Col>
                      <Row gutter={[24, 24]} type="flex" align="middle">
                        <Col span={3}>
                          <Image
                            fluid
                            roundedCircle
                            src={
                              currentLocalUser.photoURL
                                ? currentLocalUser.photoURL
                                : avatarPlaceholder
                            }
                            onError={(e) => (e.target.src = avatarPlaceholder)}
                          />
                        </Col>
                        <Col span={21}>
                          <Title
                            level={4}
                            style={{
                              marginBottom: 8,
                            }}
                          >
                            {currentLocalUser.displayName}
                          </Title>
                          <Paragraph
                            style={{
                              marginBottom: 0,
                            }}
                          >
                            {currentLocalUser.email}
                          </Paragraph>
                        </Col>
                      </Row>
                    </Col>
                    <Col>
                      <Divider />
                    </Col>
                    <Col>
                      <Title
                        level={4}
                        style={{
                          marginBottom: 24,
                        }}
                      >
                        Update profile
                      </Title>
                      <Form
                        layout="vertical"
                        style={{
                          maxWidth: 480,
                        }}
                        onSubmit={handleSubmit}
                      >
                        <Form.Item label="Full name" hasFeedback>
                          {getFieldDecorator(`fullname`, {
                            rules: [
                              {
                                required: true,
                                message: "Please enter your name",
                              },
                            ],
                          })(<Input placeholder="Full name" />)}
                        </Form.Item>

                        <Form.Item label="Image url" hasFeedback>
                          {getFieldDecorator(`photoURL`)(
                            <Input placeholder="Image url" />,
                          )}
                        </Form.Item>

                        {updateUserCalled &&
                          !updateUserError &&
                          !updateUserLoading && <Paragraph>Updated</Paragraph>}

                        <Form.Item>
                          <Button
                            type="primary"
                            size="large"
                            disabled={updateUserLoading}
                            loading={updateUserLoading}
                            htmlType="submit"
                          >
                            Submit
                          </Button>
                        </Form.Item>
                      </Form>
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
});

export default withProtectedRoute()(Profile);
