"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Page() {
  const router = useRouter()
  useEffect(() => {
    localStorage.clear()
    router.push("/login")
  }, [router])
  return <></>
}
