"use client"

import { ReactNode, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Spin } from "antd"
import useAuth, { ParseStatus } from "@/store/useAuth"
import useConnect from "@/store/useConnect"

type Props = {
  children?: ReactNode
}

export function PrivateSession(props: Readonly<Props>) {
  const [loading, setLoading] = useState(true)
  const [parseFromLocal, jwt] = useAuth((s) => [s.parseFromLocal, s.jwt])
  const [ok, setOk] = useState(false)
  const router = useRouter()
  const setJwt = useConnect((s) => s.setJwt)
  useEffect(() => {
    switch (parseFromLocal()) {
      case ParseStatus.LOADED:
        setOk(true)
        break
      case ParseStatus.EMPTY:
        router.push("/login")
        break
      case ParseStatus.EXP:
        localStorage.clear()
        router.push("/login")
        break
    }
  }, [parseFromLocal, router])
  useEffect(() => {
    if (jwt && ok) {
      setJwt(jwt)
      setLoading(false)
    }
  }, [jwt, ok, setJwt])
  return <>{loading ? <Spin /> : props.children}</>
}
