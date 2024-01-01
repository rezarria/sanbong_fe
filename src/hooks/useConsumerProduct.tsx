import useConnect from "@/store/useConnect"
import useConsumerProductStore, {
  ConsumerProduct,
} from "@/store/useConsumerProductStore"
import { useEffect } from "react"

export default function useConsumerProduct() {
  const connect = useConnect((s) => s.connect)
  const store = useConsumerProductStore()
  useEffect(() => {
    if (store.data.size == 0) {
      connect.get<ConsumerProduct[]>("api/consumerProduct").then((res) => {
        store.add(...res.data)
      })
    }
  }, [connect, store.data])
  return {
    data: store.data,
    get(id: string) {
      if (!store.data.has(id)) {
        return connect
          .get<ConsumerProduct>("api/consumerProduct", {
            params: { id },
          })
          .then((res) => {
            store.add(res.data)
            return res.data
          })
      }
      return Promise.resolve(store.data.get(id))
    },
    search(name?: string) {
      return connect
        .get<ConsumerProduct[]>("api/consumerProduct", {
          params: { name },
        })
        .then((res) => {
          store.add(...res.data)
          return res.data
        })
    },
  }
}
