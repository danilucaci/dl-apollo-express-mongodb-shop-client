import React from "react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { Layout, Button } from "antd";
import withProtectedRoute from "../hoc/withProtectedRoute";
import Header from "../components/Header/Header";

const { Content, Footer } = Layout;

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

function Profile() {
  const [updateCurrentUser] = useMutation(UPDATE_CURRENT_USER);

  return (
    <Layout>
      <Header />
      <Content style={{ padding: "48px 24px", background: "#fff" }}>
        <Button type="submit">Update</Button>
      </Content>
      <Footer style={{ textAlign: "center" }}>Clothalia</Footer>
    </Layout>
  );
}

export default withProtectedRoute()(Profile);
