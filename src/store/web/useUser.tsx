import { create } from "zustand"

type State = {
  id?: string
  name?: string
  avatar?: string
}

type Action = {
  update(data: State): void
}

const useUser = create<State & Action>((set) => ({
  update(data) {
    set({ ...data })
  },
}))

export default useUser
