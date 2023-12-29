import { useCallback, useEffect, useRef } from "react"
import useConnect from "./useConnect"
import useAuth from "./useAuth"
import { jwtDecode } from "jwt-decode"
import { HttpStatusCode } from "axios"
import { useRouter } from "next/navigation"

export default function useUpdateJWT() {
  const router = useRouter()
  const [setJwt, connect] = useConnect((s) => [s.setJwt, s.connect])
  const [jwt, refresh, updateJwt] = useAuth((s) => [
    s.jwt,
    s.refresh,
    s.updateJwt,
  ])
  const timeout = useRef<NodeJS.Timeout>()
  const job = useCallback(() => {
    if (jwt && refresh) {
      const payload = jwtDecode(jwt)
      if (payload.exp) {
        const exp = payload.exp
        const now = Date.now() / 1000
        if (exp > now) {
          connect
            .post<{ jwt: string; refresh: string }>("api/refresh", refresh)
            .then((res) => {
              if (res.status === HttpStatusCode.Ok) {
                setJwt(res.data.jwt)
                updateJwt(res.data.jwt, res.data.refresh)
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
  }, [connect, jwt, refresh, router, setJwt, updateJwt])
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
