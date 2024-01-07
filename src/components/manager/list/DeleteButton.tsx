import { Popconfirm } from "antd"
import { DeleteOutlined } from "@ant-design/icons"
import { ReactNode, useState } from "react"
import useConnect from "@/store/useConnect"
import PopOverButton from "../list/PopOverButton"

type Props = {
  id: string
  title: string
  description: ReactNode
  url: string
  onFinish?: () => void
}

export default function DeleteButton(props: Readonly<Props>) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const connect = useConnect((s) => s.connect)
  return (
    <Popconfirm
      open={open}
      title={props.title}
      description={props.description}
      okButtonProps={{ loading }}
      onCancel={() => setOpen(false)}
      onConfirm={() => {
        setLoading(true)
        connect
          .delete<string[]>(props.url, {
            data: { ids: [props.id] },
          })
          .then(() => {
            props.onFinish?.()
            setOpen(false)
            setLoading(false)
          })
      }}
    >
      <PopOverButton
        title="delete"
        danger
        type="primary"
        icon={<DeleteOutlined />}
        onClick={() => setOpen(true)}
      />
    </Popconfirm>
  )
}
