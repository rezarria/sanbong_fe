"use client"

import { Button, Flex } from "antd"
import { useRef } from "react"
import { EditOutlined } from "@ant-design/icons"
import List, { Ref as ListRef } from "@/components/manager/List"
import Add from "@/components/manager/Add"
import { AddModel, EditModel2, ListModel, ViewModel } from "./type"
import { ChangePasswordButton } from "./ChangePasswordButton"
import RoleSelectInput, {
  RoleSelectInputProps,
} from "@/components/manager/RoleSelectInput"
import UserSelectInput, {
  UserSelectInputProps,
} from "@/components/manager/UserSelectInput"
import ForwardedRefCustomDescriptions, {
  CustomDescriptionRef,
} from "@/components/CustomDescriptions"
import EditNoPatch, { Ref as EditRef } from "@/components/manager/EditNoPatch"
import QueryUserInfo from "./QueryUserInfo"
import QueryRoleInfo from "./QueryRoleInfo"
import Table, { TableRef } from "@/components/manager/list/Table"
import TableRowButton from "@/components/manager/list/TableRowButton"

const MyList = List<ListModel>()
const AccountTable = Table<ListModel>()
const MyEdit2 = EditNoPatch<EditModel2>()
const MyDescriptions = ForwardedRefCustomDescriptions<ViewModel>()

export default function Page() {
  const tableRef = useRef<TableRef>(null)
  const editRef = useRef<EditRef>(null)
  const descriptionRef = useRef<CustomDescriptionRef>(null)

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
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error("Mật khẩu không trùng!"))
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
          {
            label: "Người dùng",
            name: "user",
            required: true,
            validateFirst: true,
            input: <WrapUserSelectInput />,
            rules: [
              {
                required: true,
                message: "Hãy chọn người dùng",
              },
            ],
          },
        ]}
        onClose={() => {
          tableRef.current?.update()
        }}
      />
      <AccountTable
        ref={tableRef}
        url="api/account"
        columns={[
          {
            dataIndex: "username",
            title: "tài khoản",
          },
        ]}
        buttonColRender={(id: string, r, index) => (
          <TableRowButton
            url="api/account"
            description={"xóa tài khoản" + r.username}
            title="Xóa Tài khoản"
            id={id}
            onView={() => {
              descriptionRef.current?.show(r.id)
            }}
            onEdit={() => {
              editRef.current?.show(r.id)
            }}
            onDelete={() => {
              tableRef.current?.update()
            }}
          />
        )}
      />

      <MyDescriptions
        column={12}
        ref={descriptionRef}
        url={"api/account"}
        layout="vertical"
        modalTitle="Thông tin về người dùng"
        sections={[
          {
            label: "ID",
            children: (data) => data.id,
            span: 12,
          },
          {
            label: "Tài khoản",
            span: 6,
            children: (data) => data.username,
          },
          {
            label: "Người dùng",
            span: 6,
            children: (data) => {
              return <QueryUserInfo id={data.userId} />
            },
          },
          {
            label: "Quyền",
            span: 12,
            children: (data) => <QueryRoleInfo id={data.roleIds} />,
          },
        ]}
        button={(id) => (
          <Button
            type="dashed"
            onClick={() => {
              descriptionRef.current?.hide()
              editRef.current?.show(id)
            }}
          >
            <EditOutlined /> Sửa
          </Button>
        )}
      />

      <MyEdit2
        url="api/account"
        name="tài khoản"
        ref={editRef}
        onComplete={() => {
          tableRef.current?.update()
        }}
        sections={[
          { name: "username", label: "Tài khoản" },
          { name: "roleIds", label: "Quyền", input: <WrapRoleSelectInput /> },
          {
            name: "userId",
            label: "Người dùng",
            input: <WrapUserSelectInput />,
          },
        ]}
        button={(id) => <ChangePasswordButton accountId={id} />}
      />
    </Flex>
  )
}

function WrapRoleSelectInput(props: Readonly<RoleSelectInputProps>) {
  return <RoleSelectInput value={props.value} onChange={props.onChange} />
}

function WrapUserSelectInput(props: Readonly<UserSelectInputProps>) {
  return <UserSelectInput value={props.value} onChange={props.onChange} />
}
