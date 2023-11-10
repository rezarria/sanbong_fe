"use client";

import { Button, Flex, Popconfirm, Space } from "antd";
import Add from "@/components/Add";
import List, { Ref as ListRef } from "@/components/List";
import { useRef } from "react";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import View, { ViewRef } from "@/app/admin/role/View";
import Edit, { EditRef } from "./Edit";
import { connect } from "../../../lib/Axios";
import DeleteButton from "../../../components/DeleteButton";

type AddType = {
  name: string;
};

type ListType = {
  id: string;
  name: string;
};

const MyList = List<ListType>();

export default function Page() {
  const listRef = useRef<ListRef>(null);
  const viewRef = useRef<ViewRef>(null);
  const editRef = useRef<EditRef>(null);

  return (
    <Flex vertical={true} className="h-full">
      <Add<AddType>
        title={"Thêm quyền"}
        url={"api/role"}
        sections={[{ label: "Tên quyền", name: "name" }]}
        onClose={() => {
          listRef.current?.reload();
        }}
      />
      <MyList
        url={"api/role"}
        columnsDef={[
          {
            key: "id",
            dataIndex: "id",
            title: "Id",
          },
          {
            key: "name",
            dataIndex: "name",
            title: "Tên quyền",
          },
          {
            key: "buttons",
            title: "Thao tác",
            render(value, record, index) {
              return (
                <Space>
                  <Button
                    title="xem"
                    type="primary"
                    icon={<EyeOutlined />}
                    onClick={() => {
                      viewRef.current?.show(record.id);
                    }}
                  />
                  <Button
                    title="sửa"
                    icon={<EditOutlined />}
                    onClick={() => {
                      editRef.current?.show(record.id);
                    }}
                  />
                  <DeleteButton
                    title="Xoá quyền"
                    description="Bạn có chắc chắn xoá quyền này"
                    url="api/role"
                    id={[record.id]}
                    onFinish={() => {
                      listRef.current?.reload();
                    }}
                  />
                </Space>
              );
            },
          },
        ]}
        ref={listRef}
      />
      <View ref={viewRef} />
      <Edit
        ref={editRef}
        onComplete={() => {
          listRef.current?.reload();
        }}
      />
    </Flex>
  );
}
