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
export interface Struct {
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
        name: "account2",
        src: "/admin/account",
        title: "Tài khoản",
        icon: <LockOutlined />,
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
  {
    name: "login",
    src: "/admin/login",
    title: "Đăng nhập",
    icon: <UserOutlined />,
  },
];

export const structFlated = flat(structFillter(routerItems));

export function structFillter(list: RouterItems[]) {
  return list.filter((i) => !("type" in i)) as Struct[];
}

export function find(paths: string[]): Struct | undefined {
  const list = structFillter(routerItems);
  let cursor = list.find((i) => i.name == paths[0]);
  if (cursor == null) return;
  const _paths = paths.slice(1);
  for (const key of _paths) {
    if (cursor.children == null) return;
    cursor = structFillter(cursor.children).find((i) => i.name == key);
    if (cursor == null) return;
  }
  return cursor;
}

type StructFlatedType = { data: Struct; previous?: StructFlatedType };
function flat(
  structs?: Struct[],
  previous?: StructFlatedType,
): StructFlatedType[] {
  if (structs == null || structs.length === 0) return [];
  const data: StructFlatedType[] = [];
  structs.forEach((struct) => {
    const item: StructFlatedType = { data: struct, previous };
    data.push(item);
    if (struct.children != null && struct.children.length != 0) {
      const children = structFillter(struct.children);
      data.push(...flat(children, item));
    }
  });
  return data;
}

export function queryByName(paths: string[]) {}

export function query2(url: string): Struct[] | undefined {
  const item = structFlated.find((i) => i.data.src == url);
  if (item == null) return undefined;
  const result = [item.data];
  let cursor = item;
  while (cursor.previous != null) {
    cursor = cursor.previous;
    result.push(cursor.data);
  }
  return result.toReversed();
}

export function query(url: string): Struct[] | undefined {
  let arr = structFillter(routerItems);
  const results: Struct[] = [];
  let length = url.length;
  while (true) {
    if (length == 0) break;
    const result = arr.find((i) => (i.src ? url.startsWith(i.src) : false));
    if (result == null || result.src == null) return;
    results.push(result);
    length -= result.src.length;
    if (length != 0) {
      if (result.children == null || result.children.length == 0)
        throw new Error("");
      arr = structFillter(result.children);
    } else {
      return results;
    }
  }
}

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
