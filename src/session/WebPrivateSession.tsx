"use client"

import { ReactNode, useEffect, useState } from "react"
import { Spin } from "antd"
import useCheckStatus from "./useCheckStatus"
import { JwtPayload, jwtDecode } from "jwt-decode"
import useUser from "../store/web/useUser"
import useConnect from "../store/useConnect"

type Props = {
  children?: ReactNode
}

function useReadData() {
  const [userId, setUserId] = useState<string>()
  useEffect(() => {
    const jwt = localStorage.getItem("jwt")
    // eslint-disable-next-line react-hooks/rules-of-hooks
    if (jwt) {
      const payload = jwtDecode<
        JwtPayload & {
          USERID: string
        }
      >(jwt)
      setUserId(payload.USERID)
    }
  }, [])
  return [userId]
}

export default function WebPrivateSession(props: Readonly<Props>) {
  const [userId] = useReadData()
  const [loading, setLoading] = useState(true)
  const update = useUser((u) => u.update)
  const setJwt = useConnect((s) => s.setJwt)
  useEffect(() => {
    if (userId) {
      const jwt = localStorage.getItem("jwt")
      if (jwt) {
        fetch("http://localhost:8080/api/user?id=" + userId, {
          headers: {
            Authorization: "Bearer " + jwt,
          },
        })
          .then((res) => res.json())
          .then((data) => {
            update({ id: data.id, name: data.name, avatar: data.avatar })
            setLoading(false)
            setJwt(jwt)
          })
      }
    }
  }, [userId, update, setJwt])
  return <>{loading ? <Spin /> : props.children}</>
}
