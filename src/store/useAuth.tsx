"use client"

import { useEffect, useState } from "react"
import { create } from "zustand"
import { JwtPayload, jwtDecode } from "jwt-decode"

interface User {
  id: string;
  name: string;
  avatar: string;
}

interface State {
  userId?: string;
  accountId?: string;
  user?: User;
  update: (user: User) => void;
  updateJwt: (jwt: string) => void;
  parseFromLocal: () => void;
}

export type MyPayloadType = JwtPayload & {
  roles: string;
  details__accountId: string;
  details__userId: string;
};
const useAuth = create<State>()((set) => {
  return {
    update: (user: User) => {
      set({ user })
    },
    updateJwt: (jwt) => {
      localStorage.setItem("jwt", jwt)
    },
    parseFromLocal: () => {
      const jwt = localStorage.getItem("jwt")
      if (jwt != null) {
        const jwtObject: MyPayloadType = jwtDecode(jwt)
        set({
          accountId: jwtObject.details__accountId,
          userId: jwtObject.details__userId,
        })
      }
    },
  }
})

export default useAuth
