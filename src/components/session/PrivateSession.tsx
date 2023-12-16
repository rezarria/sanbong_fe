"use client"

import { ReactNode } from "react"
import useAuth from "../../store/useAuth"
import { useRouter } from "next/navigation"
import { connect } from "../../lib/Axios"

type Props = {
  children?: ReactNode
}

export function PrivateSession(props: Readonly<Props>) {
  const auth = useAuth()
  const router = useRouter()
  if (auth.jwt)
    connect.defaults.headers.common.Authorization = "Bearer " + auth.jwt
  return <>{props.children}</>
}
