"use client"

import { create } from "zustand"
import { JwtPayload, jwtDecode } from "jwt-decode"

interface User {
  id: string
  name: string
  avatar: string
}

interface State {
  jwt?: string
  refesh?: string
  userId?: string
  accountId?: string
  user?: User
  update: (user: User) => void
  updateJwt: (jwt: string, refresh: string) => void
  parseFromLocal: () => boolean
}

export type MyPayloadType = JwtPayload & {
  roles: string
  details__accountId: string
  details__userId: string
}
const useAuth = create<State>()((set) => ({
  update: (user: User) => {
    set({ user })
  },
  updateJwt: (jwt, refesh) => {
    localStorage.setItem("jwt", jwt)
    localStorage.setItem("refesh", refesh)
    const jwtObject: MyPayloadType = jwtDecode(jwt)
    set({
      accountId: jwtObject.details__accountId,
      userId: jwtObject.details__userId,
      jwt,
      refesh,
    })
  },
  parseFromLocal: () => {
    const jwt = localStorage.getItem("jwt")
    const refesh = localStorage.getItem("refesh")
    if (jwt && refesh) {
      const jwtObject: MyPayloadType = jwtDecode(jwt)
      set({
        accountId: jwtObject.details__accountId,
        userId: jwtObject.details__userId,
        jwt,
        refesh,
      })
      return true
    }
    return false
  },
}))

export default useAuth