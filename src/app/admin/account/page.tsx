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
import { ChangePasswordButton } from "./ChangePasswordButton";
import RoleSelectInput, { RoleSelectInputProps } from "./RoleSelectInput";

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
          {
            label: "Tài khoản",
            name: "username",
            required: true,
            validateFirst: true,
            rules: [
              {
                required: true,
                message: "Hãy nhập mật khẩu!",
              },
            ],
          },
          {
            label: "Mật khẩu",
            name: "password",
            type: "password",
            required: true,
            validateFirst: true,
            rules: [
              {
                required: true,
                message: "Hãy nhập mật khẩu!",
              },
            ],
          },
          {
            name: "password2",
            ignore: true,
            label: "Nhập lại mật khẩu",
            type: "password",
            validateFirst: true,
            dependencies: ["password"],
            rules: [
              {
                required: true,
                message: "Hãy nhập mật khẩu!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Mật khẩu không trùng!"));
                },
              }),
            ],
          },
          {
            label: "Quyền",
            name: "roles",
            required: true,
            validateFirst: true,
            input: <WrapRoleSelectInput />,
            rules: [
              {
                required: true,
                message: "Hãy chọn tối thiểu một quyền",
              },
            ],
          },
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
                    title="Xoá tài khoản"
                    description="Bạn có chắc chắn xoá tài khoản này"
                    url="api/account"
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
        url="api/account"
        name="người dùng"
        ref={editRef}
        onComplete={() => {
          listRef.current?.reload();
        }}
        sections={[{ name: "username", label: "Tài khoản" }]}
        button={(id) => <ChangePasswordButton accountId={id} />}
      />
    </Flex>
  );
}

function WrapRoleSelectInput(props: RoleSelectInputProps) {
  const form = Form.useFormInstance();
  return (
    <RoleSelectInput
      onChange={(data) => {
        form.setFieldValue("roles", data);
      }}
    />
  );
}
