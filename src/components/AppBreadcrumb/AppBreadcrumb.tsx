import { Breadcrumb } from "antd";
import useAppStore from "@/store/useAppStore";

function AppBreadcrumb() {
  const [path] = useAppStore((s) => [s.path]);
  return (
    <Breadcrumb style={{ margin: "16px 0" }}>
      {path.map((i) => (
        <Breadcrumb.Item key={i.name}>{i.title}</Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
}

export default AppBreadcrumb;
