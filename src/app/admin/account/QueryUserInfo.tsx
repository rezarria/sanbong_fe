import { useEffect, useState } from "react"
import { Spin } from "antd"
import { connect } from "@/lib/Axios"
type Props = {
  id?: string
}

export default function QueryUserInfo(props: Readonly<Props>) {
  const [name, setName] = useState<string>()
  useEffect(() => {
    if (props.id) {
      connect
        .get<string>("api/user/getName", { params: { id: props.id } })
        .then((res) => {
          if (res.status === 200) {
            setName(res.data)
          }
        })
    }
  }, [props.id])
  return <>{props.id ? name ?? <Spin /> : "Không có người dùng"}</>
}
