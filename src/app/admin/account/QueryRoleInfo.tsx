import { useEffect, useState } from "react"
import { Spin } from "antd"
import { connect } from "@/lib/Axios"
import queryString from "query-string"
type Props = {
  id?: string[]
}

export default function QueryRoleInfo(props: Readonly<Props>) {
  const [names, setNames] = useState<string[]>()
  useEffect(() => {
    if (props.id) {
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
  }, [props.id])
  return <>{props.id ? names?.join(", ") ?? <Spin /> : "Không có người dùng"}</>
}
