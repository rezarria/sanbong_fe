import axios from "axios"
import config from "@/config/Config"

export default function useConnect() {
  axios.create({
    baseURL: config.baseUrl,
  })
  return axios
}
