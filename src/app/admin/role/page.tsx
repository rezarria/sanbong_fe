"use client";

import { Button, Flex, Space } from "antd";
import { useRef } from "react";
import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import ViewComponent, { ViewRef } from "@/components/manager/View";
import ViewModel from "./ViewModel";
import Edit, { EditRef } from "@/components/manager/Edit";
import EditModel from "./EditModel";
import List, { Ref as ListRef } from "@/components/manager/List";
import Add from "@/components/manager/Add";
import DeleteButton from "@/components/manager/DeleteButton";

type AddType = {
  name: string;
};

type ListType = {
  id: string;
  name: string;
};

const MyList = List<ListType>();
const MyView = ViewComponent<ViewModel>();
const MyEdit = Edit<EditModel>();

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
            key: "#",
            title: "#",
            render: (_v, _d, i) => <span>{i + 1}</span>,
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
      <MyView
        ref={viewRef}
        url={"api/role"}
        modalTitle="Thông tin về quyền"
        sections={[
          {
            id: "name",
            label: "Tên quyền",
            title: "name",
            name: "name",
          },
        ]}
      />
      <MyEdit
        ref={editRef}
        onComplete={() => {
          listRef.current?.reload();
        }}
        sections={[{ id: "name", name: "name", label: "Tên quyền" }]}
      />
    </Flex>
  );
}
