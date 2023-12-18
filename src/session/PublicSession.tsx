"use client"

import {
  ReactNode,
  createContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import useAuth from "@/store/useAuth"
import { notification } from "antd"
import { useRouter } from "next/navigation"
const context = createContext({})

function Timeout(
  props: Readonly<{
    time: number
  }>,
) {
  const begin = useRef(Date.now()).current
  const [count, setCount] = useState(props.time)
  const router = useRouter()
  useEffect(() => {
    setInterval(() => {
      const n = props.time - (((Date.now() - begin) / 1000) % 60 | 0)
      if (n >= 0) setCount(n)
      else router.push("/admin/user")
    }, 1000)
  })
  return <>{count}</>
}

export default function PublicSession(
  props: Readonly<{ children: ReactNode }>,
) {
  const [jwt, update] = useAuth((s) => [s.jwt, s.parseFromLocal])
  const [api, contextHolder] = notification.useNotification()
  const contextValue = useMemo(() => ({ name: "Ant Design" }), [])
  useEffect(() => {
    update()
  }, [update])
  useEffect(() => {
    console.log(jwt)
    if (jwt) {
      api.warning({
        message: "",
        description: "Đã đăng nhập",
        duration: 0,
      })
      setTimeout(() => {
        api.info({
          message: "Chuyển hướng",
          description: (
            <>
              Sẽ chuyển hướng trong <Timeout time={3} />
            </>
          ),
          duration: 0,
        })
      }, 500)
    }
  }, [api, jwt])
  return (
    <context.Provider value={contextValue}>
      {contextHolder}
      {props.children}
    </context.Provider>
  )
}
