import {
  LockOutlined,
  ThunderboltOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { MenuProps } from "antd";
import MenuItem from "antd/es/menu/MenuItem";
import {
  MenuDividerType,
  MenuItemGroupType,
} from "antd/es/menu/hooks/useItems";
import { ReactNode } from "react";

enum Routers {
  Role,
  User,
  Account,
}

type MenuItem = Required<MenuProps>["items"][number];
interface Struct {
  src?: string;
  title?: string;
  name?: string;
  icon?: ReactNode;
  children?: RouterItems[];
}
type RouterItems = Struct | MenuItemGroupType | MenuDividerType;

const routerItems: RouterItems[] = [
  {
    name: "role",
    src: "/admin/role",
    title: "Quyền",
    icon: <ThunderboltOutlined />,
  },
  {
    name: "user",
    src: "/admin/user",
    title: "Người dùng",
    icon: <UserOutlined />,
    children: [
      {
        name: "login",
        src: "/admin/login",
        title: "Đăng nhập",
        icon: <UserOutlined />,
      },
    ],
  },
  { type: "divider" },
  {
    name: "account",
    src: "/admin/account",
    title: "Tài khoản",
    icon: <LockOutlined />,
  },
];

function convertItem(item: RouterItems) {
  if ("type" in item) {
    return { type: item.type } as MenuItem;
  } else {
    return {
      icon: item.icon,
      label: item.title,
      key: item.name,
      children: item.children ? convertItems(item.children) : undefined,
    } as MenuItem;
  }
}

function convertItems(items: RouterItems[]): MenuItem[] {
  return items.map((item) => convertItem(item));
}

type AppRouterItems = typeof routerItems;

const items: MenuProps["items"] = convertItems(routerItems);

export { items, routerItems, type AppRouterItems, Routers as RouterEnum };
export default MenuItem;
