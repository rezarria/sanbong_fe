import { Breadcrumb } from "antd";
import useAppStore from "../../store/useAppStore";
import { routerItems } from "./MenuItem";

function AppBreadcrumb() {
  const [path] = useAppStore((s) => [s.path]);
  return (
    <Breadcrumb style={{ margin: "16px 0" }}>
      {path.map((i) => (
        <Breadcrumb.Item key={i}>{routerItems.get(i)?.title}</Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
}

export default AppBreadcrumb;
