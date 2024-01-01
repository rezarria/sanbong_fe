import { create } from "zustand"

export type ConsumerProduct = {
  id: string
  name: string
  price: number
  priceId: number
  pictures: string[]
}

type State = {
  data: Map<string, ConsumerProduct>
}
type Action = {
  add(...product: ConsumerProduct[]): void
}

const useConsumerProductStore = create<State & Action>((set) => ({
  data: new Map<string, ConsumerProduct>(),
  add(...product) {
    set((v) => {
      const newData = new Map(v.data)
      product.forEach((i) => newData.set(i.id, i))
      return {
        data: newData,
      }
    })
  },
}))

export default useConsumerProductStore
