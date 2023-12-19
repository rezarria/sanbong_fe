import { useCallback, useEffect, useRef } from "react"
import useConnect from "./useConnect"
import useAuth from "./useAuth"
import { jwtDecode } from "jwt-decode"
import { HttpStatusCode } from "axios"
import { useRouter } from "next/navigation"

export default function useUpdateJWT() {
  const router = useRouter()
  const [setJwt, connect] = useConnect((s) => [s.setJwt, s.connect])
  const [jwt, refesh, updateJwt] = useAuth((s) => [
    s.jwt,
    s.refesh,
    s.updateJwt,
  ])
  const timeout = useRef<NodeJS.Timeout>()
  const job = useCallback(() => {
    if (jwt && refesh) {
      const payload = jwtDecode(jwt)
      if (payload.exp) {
        const exp = payload.exp
        const now = Date.now() / 1000
        if (exp > now) {
          connect
            .post<{ jwt: string; refesh: string }>("api/refesh", refesh)
            .then((res) => {
              if (res.status === HttpStatusCode.Ok) {
                setJwt(res.data.jwt)
                updateJwt(res.data.jwt, res.data.refesh)
              }
            })
            .catch(() => {
              router.push("/login")
            })
          return
        }
      }
    }
    router.push("/login")
  }, [connect, jwt, refesh, router, setJwt, updateJwt])
  useEffect(() => {
    if (jwt) {
      const payload = jwtDecode(jwt)
      if (payload.exp) {
        const exp = payload.exp
        const now = Date.now() / 1000
        if (exp > now) {
          timeout.current = setTimeout(job, exp * 1000 - now)
          return () => {
            if (timeout.current) clearTimeout(timeout.current)
          }
        }
      }
    }
  }, [job, jwt, updateJwt])
}
