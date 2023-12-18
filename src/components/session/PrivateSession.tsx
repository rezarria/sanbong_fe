"use client"

import { ReactNode, useEffect } from "react"
import useAuth from "../../store/useAuth"
import { useRouter } from "next/navigation"
import useConnect from "../../store/useConnect"
import { Spin } from "antd"

type Props = {
  children?: ReactNode
}

export function PrivateSession(props: Readonly<Props>) {
  const [parseFromLocal, jwt] = useAuth((s) => [s.parseFromLocal, s.jwt])
  const router = useRouter()
  const setJwt = useConnect((s) => s.setJwt)
  useEffect(() => {
    if (!parseFromLocal()) router.push("/login")
  }, [parseFromLocal])
  useEffect(() => {
    if (jwt) setJwt(jwt)
  }, [jwt, setJwt])
  return <>{jwt ? props.children : <Spin />}</>
}
