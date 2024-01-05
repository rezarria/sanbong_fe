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
  refresh?: string
  userId?: string
  accountId?: string
  user?: User
  payload?: MyPayloadType
  update: (user: User) => void
  updateJwt: (jwt: string, refresh: string) => void
  parseFromLocal: () => ParseStatus
  refreshToken: (token: string) => Promise<void>
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
  updateJwt: (jwt, refresh) => {
    localStorage.setItem("jwt", jwt)
    localStorage.setItem("refresh", refresh)
    const jwtObject: MyPayloadType = jwtDecode(jwt)
    set({
      accountId: jwtObject.ACCOUNTID,
      userId: jwtObject.USERID,
      jwt,
      refresh: refresh,
      payload: jwtObject,
    })
  },
  refreshToken: async (token) => {
    const payload = jwtDecode(token)
    if (!payload.exp) throw new Error("không tồn tại hạn")
    if (payload.exp < Date.now() / 1000) throw new Error("refresh hết hạn")
    const res = await axios.post<{ jwt: string; refresh: string }>("", token)
    if (res.status !== HttpStatusCode.Ok)
      throw new Error("truy vấn api không thành công")
    const data = res.data
    localStorage.setItem("jwt", res.data.jwt)
    localStorage.setItem("refresh", data.refresh)
    set({
      jwt: data.jwt,
      refresh: data.refresh,
    })
  },
  parseFromLocal: () => {
    const jwt = localStorage.getItem("jwt")
    const refresh = localStorage.getItem("refresh")
    if (jwt && refresh) {
      const jwtObject: MyPayloadType = jwtDecode(jwt)
      if (jwtObject.exp && jwtObject.exp < Date.now() / 1000 - 5 * 60) {
        return ParseStatus.EXP
      }
      set({
        accountId: jwtObject.ACCOUNTID,
        userId: jwtObject.USERID,
        jwt,
        refresh: refresh,
        payload: jwtObject,
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
