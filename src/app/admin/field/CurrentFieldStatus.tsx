import { Badge, BadgeProps, Spin } from "antd"
import useSWR from "swr"
import useConnect from "../../../store/useConnect"
import { ForwardedRef, forwardRef, useImperativeHandle, useState } from "react"

type Props = {
  fieldId: string
}

export type CurrentFieldStatusRef = {
  run: () => void
  stop: () => void
}

type StatusType = "FREE" | "BUSY" | "DENY" | "UNKNOWN"

const map: {
  [key in StatusType]: {
    status: BadgeProps["status"]
    text: string
  }
} = {
  FREE: {
    status: "success",
    text: "Đang trống",
  },
  BUSY: {
    status: "warning",
    text: "Đầy",
  },
  DENY: { status: "processing", text: "Từ chối dịch vụ" },
  UNKNOWN: { status: "error", text: "Lỗi truy vấn" },
}

function _CurrentFieldStatus(
  props: Readonly<Props>,
  ref: ForwardedRef<CurrentFieldStatusRef>,
) {
  const [running, setRunning] = useState(true)
  useImperativeHandle(
    ref,
    () => ({
      run: () => {
        setRunning(true)
      },
      stop: () => {
        setRunning(false)
      },
    }),
    [],
  )
  const connect = useConnect((s) => s.connect)
  const fetcher = (id: string) =>
    connect
      .get<StatusType>("api/field/getStatus", { params: { id } })
      .then((res) => res.data)
  const res = useSWR(() => (running ? props.fieldId : null), fetcher, {
    refreshInterval: 1000,
  })
  if (!res.isLoading && res.data)
    return <Badge status={map[res.data].status} text={map[res.data].text} />
  return <Spin tip="Loading" size="small" />
}

const CurrentFieldStatus = forwardRef(_CurrentFieldStatus)

export default CurrentFieldStatus
