import { DesktopOutlined, PieChartOutlined } from "@ant-design/icons";
import { MenuProps } from "antd";
import MenuItem from "antd/es/menu/MenuItem";

enum Routers {
  Role,
  User,
  Account,
}

type MenuItem = Required<MenuProps>["items"][number];
type RouterItems = {
  [key in keyof typeof Routers]: {
    src: string;
    title: string;
  };
};

const routerItems: RouterItems = {
  Role: { src: "/admin/role", title: "Quyền" },
  User: { src: "/admin/user", title: "Người dùng" },
  Account: { src: "/admin/account", title: "Tài khoản" },
};

type AppRouterItems = typeof routerItems;

function getItem<T extends RouterItems>(
  label: React.ReactNode,
  key: keyof T,
  icon?: React.ReactNode,
  children?: MenuItem[],
  src?: string,
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    src,
  } as MenuItem;
}

const items: MenuProps["items"] = [
  getItem<AppRouterItems>(
    routerItems["Role"].title,
    "Role",
    <PieChartOutlined />,
  ),
  getItem<AppRouterItems>(
    routerItems["Account"].title,
    "Account",
    <DesktopOutlined />,
  ),
  getItem<AppRouterItems>(
    routerItems["User"].title,
    "User",
    <DesktopOutlined />,
  ),
];

export { items, routerItems, type AppRouterItems, Routers as RouterEnum };
export default MenuItem;
