import { create } from "zustand"
import config from "@/config/Config"
import axios, { AxiosInstance } from "axios"

interface State {
  connect: AxiosInstance
}

interface Action {
  setJwt: (token: string) => void
}

const useConnect = create<State & Action>((set) => {
  const connect = axios.create({
    baseURL: config.baseUrl,
  })
  return {
    connect,
    setJwt: (token) => {
      set({
        connect: axios.create({
          baseURL: config.baseUrl,
          headers: {
            Authorization: "Bearer " + token,
          },
        }),
      })
    },
  }
})

export default useConnect
