"use client";

import { Button, Flex, Space } from "antd";
import { useRef } from "react";
import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import ViewComponent, { ViewRef } from "@/components/manager/View";
import Edit, { EditRef } from "@/components/manager/Edit";
import List, { Ref as ListRef } from "@/components/manager/List";
import Add from "@/components/manager/Add";
import DeleteButton from "@/components/manager/DeleteButton";
import { AddType, EditModel, ListType, ViewModel } from "./type";

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
        sections={[
          { label: "Tên quyền", name: "name" },
          { label: "Tên hiển thị", name: "displayName" },
        ]}
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
            key: "displayName",
            dataIndex: "displayName",
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
            label: "Tên quyền",
            title: "name",
            name: "name",
          },
        ]}
        button={(id) => (
          <Button
            type="dashed"
            onClick={() => {
              viewRef.current?.hide();
              editRef.current?.show(id);
            }}
          >
            <EditOutlined />
            sửa
          </Button>
        )}
      />
      <MyEdit
        url="api/role"
        name="quyền"
        ref={editRef}
        onComplete={() => {
          listRef.current?.reload();
        }}
        sections={[{ name: "name", label: "Tên quyền" }]}
      />
    </Flex>
  );
}
