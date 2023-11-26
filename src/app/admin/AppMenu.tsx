import { Menu } from "antd";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useAppStore from "@/store/useAppStore";
import { find, query2, queryByName } from "@/components/AppBreadcrumb/method";
import {
  items,
  routerItems,
  structFlated,
} from "@/components/AppBreadcrumb/MenuItem";

function AppMenu() {
  const router = useRouter();
  const pathName = usePathname();
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [change] = useAppStore((s) => [s.change]);
  useEffect(() => {
    const keys = query2(pathName, structFlated);
    if (keys != null) {
      const paths = keys.map((i) => i.name) as string[];
      if (paths.some((i) => i == null)) throw new Error("");
      setSelectedKeys(paths.toReversed());
      change(keys);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Menu
      selectedKeys={selectedKeys}
      theme="dark"
      defaultSelectedKeys={["1"]}
      mode="inline"
      items={items}
      onClick={(i) => {
        const data = find(i.keyPath.toReversed(), routerItems);
        if (data?.src != null) {
          setSelectedKeys(i.keyPath);
          change(queryByName(i.keyPath, structFlated));
          router.push(data.src);
        }
      }}
    />
  );
}

export default AppMenu;
