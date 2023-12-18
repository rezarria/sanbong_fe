import { create } from "zustand"
import config from "@/config/Config"
import axios, { AxiosInstance } from "axios"

interface State {}

interface Action {
  connect: AxiosInstance
}

const useConnect = create<State & Action>((set) => {
  const connect = axios.create({
    baseURL: config.baseUrl,
  })
  return {
    connect,
  }
})

export default useConnect
