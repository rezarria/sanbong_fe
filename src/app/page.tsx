import React from "react";
import { Button, ConfigProvider } from "antd";
import locale from "antd/locale/vi_VN";

import theme from "@/theme/themeConfig";

const HomePage = () => (
  <ConfigProvider theme={theme} locale={locale}>
    <div className="App">
      <Button type="primary">Button</Button>
    </div>
  </ConfigProvider>
);

export default HomePage;
