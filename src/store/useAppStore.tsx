import { create } from "zustand";
import { Struct } from "@/app/admin/MenuItem";

interface State {
  path: Struct[];
  change: (newPath: Struct[]) => void;
}

const useAppStore = create<State>()((set) => ({
  path: [],
  change: (newPath) => {
    set(() => ({ path: newPath }));
  },
}));

export default useAppStore;
