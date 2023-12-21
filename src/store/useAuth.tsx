"use client"

import { create } from "zustand"
import { JwtPayload, jwtDecode } from "jwt-decode"
import axios, { HttpStatusCode } from "axios"

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
  updateJwt: (jwt: string, refesh: string) => void
  parseFromLocal: () => ParseStatus
  refeshToken: (token: string) => Promise<void>
}

export type MyPayloadType = JwtPayload & {
  roles: string
  ACCOUNTID: string
  USERID: string
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
      accountId: jwtObject.ACCOUNTID,
      userId: jwtObject.USERID,
      jwt,
      refesh,
    })
  },
  refeshToken: async (token) => {
    const payload = jwtDecode(token)
    if (!payload.exp) throw new Error("không tồn tại hạn")
    if (payload.exp < Date.now() / 1000) throw new Error("refesh hết hạn")
    const res = await axios.post<{ jwt: string; refesh: string }>("", token)
    if (res.status !== HttpStatusCode.Ok)
      throw new Error("truy vấn api không thành công")
    const data = res.data
    localStorage.setItem("jwt", res.data.jwt)
    localStorage.setItem("refesh", data.refesh)
    set({
      jwt: data.jwt,
      refesh: data.refesh,
    })
  },
  parseFromLocal: () => {
    const jwt = localStorage.getItem("jwt")
    const refesh = localStorage.getItem("refesh")
    if (jwt && refesh) {
      const jwtObject: MyPayloadType = jwtDecode(jwt)
      if (jwtObject.exp && jwtObject.exp < Date.now() / 1000) {
        return ParseStatus.EXP
      }
      set({
        accountId: jwtObject.ACCOUNTID,
        userId: jwtObject.USERID,
        jwt,
        refesh,
      })
      return ParseStatus.LOADED
    }
    return ParseStatus.EMPTY
  },
}))

export enum ParseStatus {
  EMPTY,
  LOADED,
  EXP,
}

export default useAuth
