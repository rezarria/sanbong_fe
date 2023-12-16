"use client"

import { ReactNode } from "react"
import useAuth from "@/store/useAuth"

export default function PublicSession(props: { children: ReactNode }) {
  const auth = useAuth()
  return <>{props.children}</>
}
