import { Space } from "antd";
import Add from "./Add";
import List from "./List";

type AddType = {
  name: string;
};

export default function Page() {
  return (
    <Space direction="vertical" style={{ display: "flex" }}>
      <Add<AddType>
        title={"Thêm quyền"}
        url={""}
        sections={[{ label: "Tên quyền", name: "name" }]}
      />
      <List<AddType> url={""} />
    </Space>
  );
}
