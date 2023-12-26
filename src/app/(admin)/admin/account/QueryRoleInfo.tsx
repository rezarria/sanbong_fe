import { useEffect, useState } from "react"
import { Spin } from "antd"
import queryString from "query-string"
import useConnect from "@/store/useConnect"
type Props = {
  id?: string[]
}

export default function QueryRoleInfo(props: Readonly<Props>) {
  const [names, setNames] = useState<string[]>()
  const connect = useConnect((s) => s.connect)
  useEffect(() => {
    if (props.id && props.id.length !== 0) {
      connect
        .get<string[]>("api/role/getName", {
          params: { id: props.id },
          paramsSerializer: (params) =>
            queryString.stringify(params, { arrayFormat: "none" }),
        })
        .then((res) => {
          if (res.status === 200) {
            setNames(res.data)
          }
        })
    }
  }, [connect, props.id])
  return (
    <>
      {props.id && props.id.length !== 0
        ? names?.join(", ") ?? <Spin />
        : "Không có người dùng"}
    </>
  )
}
