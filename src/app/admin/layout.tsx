"use client";

import React, { ReactNode, useState } from "react";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
import AppBreadcrumb from "./AppBreadcrumb";
import { RouterEnum, items, routerItems } from "./MenuItem";
import { useRouter } from "next/navigation";

const { Header, Content, Footer, Sider } = Layout;

interface AppProps {
  children: ReactNode;
}

const App: React.FC<AppProps> = (props) => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const router = useRouter();
  return (
    <Layout style={{ height: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
          onClick={(i) => {
            router.push(routerItems[i.key as keyof typeof RouterEnum].src);
          }}
        />
      </Sider>
      <Layout className="h-100">
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content className="flex-auto" style={{ margin: "0 16px" }}>
          <Layout className="h-full">
            <AppBreadcrumb />
            <Content
              style={{
                padding: 24,
                margin: 0,
                minHeight: 280,
                background: colorBgContainer,
              }}
            >
              <>{props.children}</>
            </Content>
          </Layout>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Ant Design ©2023 Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};

export default App;
