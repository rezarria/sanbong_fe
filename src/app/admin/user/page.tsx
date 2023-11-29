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
import UserAvatar from "./UserAvatar";
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
        url={"api/user"}
        sections={[
          { label: "Tên", name: "name" },
          { label: "Ngày sinh", name: "dob", type: "datepicker" },
          {
            label: "Avatar",
            name: "avatar",
            type: "avatar",
          },
        ]}
        onClose={() => {
          listRef.current?.reload();
        }}
      />
      <MyList
        url={"api/user"}
        columnsDef={[
          {
            key: "#",
            title: "#",
            render: (_v, _d, i) => <span>{i + 1}</span>,
          },
          {
            key: "name",
            dataIndex: "name",
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
                    title="Xoá người dùng"
                    description="Bạn có chắc chắn xoá người dùng này"
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
        url={"api/user"}
        modalTitle="Thông tin về người dùng"
        sections={[
          {
            label: "Tên",
            title: "name",
            name: "name",
          },
          {
            label: "Ngày sinh",
            title: "Ngày sinh",
            name: "dob",
            type: "datepicker",
          },
          {
            label: "Avatar",
            title: "Avatar",
            name: "avatar",
            input: (data) => (
              <Image
                className="relative"
                src={connect.defaults.baseURL + data.avatar}
                alt="avatar"
              />
            ),
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
        sections={[
          { name: "name", label: "Tên" },
          {
            name: "dob",
            label: "Ngày sinh",
            type: "datepicker",
          },
          {
            name: "avatar",
            label: "Ảnh đại diện",
            type: "avatar",
          },
        ]}
      >
        <EditAvatar />
      </MyEdit>
    </Flex>
  );
}

function EditAvatar() {
  const avatar = Form.useWatch("avatar", Form.useFormInstance<EditModel>());
  return (
    <Form.Item>
      <UserAvatar url="api/files" value={avatar} />
    </Form.Item>
  );
}
