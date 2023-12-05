import axios from "axios"

const connect = axios.create({
  baseURL: "http://localhost:8080",
})

export { connect }
