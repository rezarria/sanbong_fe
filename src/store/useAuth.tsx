"use client"

import { useEffect, useState } from "react"
import { create } from "zustand"
import { JwtPayload, jwtDecode } from "jwt-decode"

interface User {
  id: string
  name: string
  avatar: string
}

interface State {
  jwt?: string
  userId?: string
  accountId?: string
  user?: User
  update: (user: User) => void
  updateJwt: (jwt: string) => void
  parseFromLocal: () => void
}

export type MyPayloadType = JwtPayload & {
  roles: string
  details__accountId: string
  details__userId: string
}
const useAuth = create<State>()((set) => {
  const jwt_token = localStorage.getItem("jwt")
  let user_info = undefined
  if (jwt_token) {
    const jwtObject: MyPayloadType = jwtDecode(jwt_token)
    user_info = {
      accountId: jwtObject.details__accountId,
      userId: jwtObject.details__userId,
      jwt: jwt_token,
    }
  }
  return {
    ...user_info,
    update: (user: User) => {
      set({ user })
    },
    updateJwt: (jwt) => {
      localStorage.setItem("jwt", jwt)
      const jwtObject: MyPayloadType = jwtDecode(jwt)
      set({
        accountId: jwtObject.details__accountId,
        userId: jwtObject.details__userId,
        jwt,
      })
    },
    parseFromLocal: () => {
      const jwt = localStorage.getItem("jwt")
      if (jwt != null) {
        const jwtObject: MyPayloadType = jwtDecode(jwt)
        set({
          accountId: jwtObject.details__accountId,
          userId: jwtObject.details__userId,
          jwt,
        })
      }
    },
  }
})

export default useAuth
