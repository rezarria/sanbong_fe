"use client"

import { ReactNode } from "react"
import { Spin } from "antd"
import useCheckStatus from "./useCheckStatus"

type Props = {
  children?: ReactNode
}

export function PrivateSession(props: Readonly<Props>) {
  const [loading] = useCheckStatus()
  return <>{loading ? <Spin /> : props.children}</>
}
