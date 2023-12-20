"use client"

import { ReactNode, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Spin } from "antd"
import useAuth, { ParseStatus } from "../store/useAuth"
import useConnect from "../store/useConnect"
import axios, { HttpStatusCode } from "axios"
import config from "../config/Config"

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
        // axios
        //   .post<{ jwt: string; refesh: string }>(
        //     [config.baseUrl, "api/security/refesh"].join("/"),
        //     jwt,
        //   )
        //   .then((res) => {
        //     if (res.status === HttpStatusCode.Ok) {
        //     }
        //   })
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
