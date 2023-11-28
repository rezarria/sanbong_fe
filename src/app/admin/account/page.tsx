"use client";

import { Button, Flex, Form, Image, Space } from "antd";
import { useRef } from "react";
import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import ViewComponent, { ViewRef } from "@/components/manager/View";
import Edit, { EditRef } from "@/components/manager/Edit";
import List, { Ref as ListRef } from "@/components/manager/List";
import Add from "@/components/manager/Add";
import DeleteButton from "@/components/manager/DeleteButton";
import { AddModel, EditModel, ListModel, ViewModel } from "./type";
import { connect } from "@/lib/Axios";

const MyList = List<ListModel>();
const MyView = ViewComponent<ViewModel>();
const MyEdit = Edit<EditModel>();

export default function Page() {
  const listRef = useRef<ListRef>(null);
  const viewRef = useRef<ViewRef>(null);
  const editRef = useRef<EditRef>(null);

  return (
    <Flex vertical={true} className="h-full">
      <Add<AddModel>
        title={"Thêm Người dùng mới"}
        url={"api/account"}
        sections={[
          { label: "Tài khoản", name: "username" },
          { label: "Mật khẩu", name: "password", type: "password" },
        ]}
        onClose={() => {
          listRef.current?.reload();
        }}
      />
      <MyList
        url={"api/account"}
        columnsDef={[
          {
            key: "#",
            title: "#",
            render: (_v, _d, i) => <span>{i + 1}</span>,
          },
          {
            key: "username",
            dataIndex: "username",
            title: "Tên",
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
                    url="api/user"
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
        url={"api/account"}
        modalTitle="Thông tin về người dùng"
        sections={[
          {
            label: "Tài khoản",
            title: "username",
            name: "username",
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
            <EditOutlined /> Sửa
          </Button>
        )}
      />
      <MyEdit
        url="api/user"
        name="người dùng"
        ref={editRef}
        onComplete={() => {
          listRef.current?.reload();
        }}
        sections={[{ name: "username", label: "Tài khoản" }]}
      />
    </Flex>
  );
}
