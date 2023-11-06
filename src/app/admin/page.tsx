"use client";

import { Breadcrumb, theme } from "antd";

const App: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <>
      <div
        style={{ padding: 24, minHeight: 360, background: colorBgContainer }}
      >
        Bill is a cat.
      </div>
    </>
  );
};

export default App;
