import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import useAuth, { ParseStatus } from "@/store/useAuth"
import useConnect from "@/store/useConnect"

export default function useCheckStatus() {
  const [firstRun, setFirstRun] = useState(true)
  const [ok, setOk] = useState(false)
  const [loading, setLoading] = useState(true)
  const setJwt = useConnect((s) => s.setJwt)
  const router = useRouter()
  const [status, setStatus] = useState<ParseStatus>(ParseStatus.EMPTY)
  const [parseFromLocal, jwt, jwtPayload] = useAuth((s) => [
    s.parseFromLocal,
    s.jwt,
    s.payload,
  ])

  useEffect(() => {
    if (jwt && ok) {
      setJwt(jwt)
      setLoading(false)
    }
  }, [jwt, ok, setJwt])

  useEffect(() => {
    if (firstRun) {
      setStatus(parseFromLocal)
      setFirstRun(false)
    } else
      switch (status) {
        case ParseStatus.LOADED: {
          setOk(true)
          const timeout = setTimeout(
            () => {
              localStorage.clear()
              router.push("/login")
            },
            Date.now() - jwtPayload!.iat! * 1000,
          )
          console.log(`đăng xuất trong ${Date.now() / 1000 - jwtPayload!.iat!}`)
          setOk(true)
          return () => {
            clearTimeout(timeout)
          }
        }
        case ParseStatus.EMPTY:
          router.push("/login")
          break
        case ParseStatus.EXP:
          localStorage.clear()
          router.push("/login")
          break
      }
  }, [firstRun, jwtPayload, parseFromLocal, router, status])
  return [loading]
}
