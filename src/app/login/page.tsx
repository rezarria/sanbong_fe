"use client";

import LoginPage from "@/components/page/LoginPage";
import { Card, Col, Layout, Row } from "antd";

export default function Page() {
  return (
    <Layout style={{ height: "100vh" }}>
      <Row className="h-full" justify={"center"} align={"middle"}>
        <Col>
          <Card title="Đăng nhập">
            <LoginPage />
          </Card>
        </Col>
      </Row>
    </Layout>
  );
}
