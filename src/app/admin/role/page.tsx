import { Space } from "antd";
import Add from "../../../components/Add";
import List from "@/components/List";

type AddType = {
  name: string;
};

type ListType = {
  id: string;
  name: string;
};

const A = List<ListType>();

export default function Page() {
  return (
    <Space direction="vertical" style={{ display: "flex" }}>
      <Add<AddType>
        title={"Thêm quyền"}
        url={""}
        sections={[{ label: "Tên quyền", name: "name" }]}
      />
      <A url={"/api/role"} columnsDef={[]} />
    </Space>
  );
}
