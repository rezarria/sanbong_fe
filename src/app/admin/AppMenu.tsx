import { Menu } from "antd";
import { find, items, query } from "./MenuItem";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useAppStore from "../../store/useAppStore";

function AppMenu() {
  const router = useRouter();
  const pathName = usePathname();
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [change] = useAppStore((s) => [s.change]);
  useEffect(() => {
    const keys = query(pathName);
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
        const data = find(i.keyPath.toReversed());
        if (data.src != null) {
          setSelectedKeys(i.keyPath);
          router.push(data.src);
        }
      }}
    />
  );
}

export default AppMenu;
