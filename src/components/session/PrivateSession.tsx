"use client"

import { ReactNode, useEffect, useState } from "react"
import useAuth from "../../store/useAuth"
import { useRouter } from "next/navigation"
import useConnect from "../../store/useConnect"
import { Spin } from "antd"

type Props = {
  children?: ReactNode
}

export function PrivateSession(props: Readonly<Props>) {
  const [loading, setLoading] = useState(true)
  const [parseFromLocal, jwt] = useAuth((s) => [s.parseFromLocal, s.jwt])
  const router = useRouter()
  const setJwt = useConnect((s) => s.setJwt)
  useEffect(() => {
    if (!parseFromLocal()) router.push("/login")
  }, [parseFromLocal, router])
  useEffect(() => {
    if (jwt) setJwt(jwt)
    setLoading(false)
  }, [jwt, setJwt])
  return <>{loading ? <Spin /> : props.children}</>
}
