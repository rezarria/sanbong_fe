import { Button, Popconfirm } from "antd"
import { DeleteOutlined } from "@ant-design/icons"
import { useState } from "react"
import useConnect from "../../store/useConnect"

type Props = {
  id: string[]
  title: string
  description: string
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
            data: { ids: props.id },
          })
          .then(() => {
            setOpen(false)
            setLoading(false)
            props.onFinish?.()
          })
      }}
    >
      <Button
        title="xoá"
        danger
        type="primary"
        icon={<DeleteOutlined />}
        onClick={() => setOpen(true)}
      />
    </Popconfirm>
  )
}
