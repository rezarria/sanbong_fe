import { Menu } from "antd";
import { RouterEnum, items, routerItems } from "./MenuItem";
import { useRouter } from "next/navigation";

function AppMenu() {
  const router = useRouter();
  return (
    <Menu
      theme="dark"
      defaultSelectedKeys={["1"]}
      mode="inline"
      items={items}
      onClick={(i) => {
        const item = routerItems.get(i.key as keyof typeof RouterEnum);
        if (item != null) {
          router.push(item.src);
        }
      }}
    />
  );
}

export default AppMenu;
