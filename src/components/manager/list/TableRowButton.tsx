import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons"
import { Button, ButtonProps, Popover, Space } from "antd"
import PopOverButton from "./PopOverButton"
import { ReactNode } from "react"
import DeleteButton from "./DeleteButton"

interface TableRowButtonProps {
  onDelete?(): void
  onEdit?(): void
  onView?(): void
  id: string
  url: string
  title: string
  description: ReactNode
}

function TableRowButton(props: Readonly<TableRowButtonProps>) {
  return (
    <Space>
      <PopOverButton
        onClick={props.onView}
        type="primary"
        content="view"
        icon={<EyeOutlined />}
      ></PopOverButton>
      <PopOverButton
        onClick={props.onEdit}
        content="edit"
        icon={<EditOutlined />}
      ></PopOverButton>
      <DeleteButton
        id={props.id}
        onFinish={props.onDelete}
        title={props.title}
        description={props.description}
        url={props.url}
      />
    </Space>
  )
}

export default TableRowButton
