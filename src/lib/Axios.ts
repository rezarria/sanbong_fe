import axios from "axios";

const connect = axios.create({
  baseURL: "localhost:8080",
});

export { connect };
