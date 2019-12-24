import React from "react";
import { Layout, Typography } from "antd";

const { Footer: AntDFooter } = Layout;

const { Paragraph, Text } = Typography;

function Footer() {
  return (
    <AntDFooter
      style={{ textAlign: "center", padding: "80px 24px", background: "white" }}
    >
      <Paragraph>
        &copy; {new Date().getFullYear()} Clothalia
        <Text code>#not-a-real-company</Text>
      </Paragraph>
    </AntDFooter>
  );
}

export default Footer;
