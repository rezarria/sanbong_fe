import { create } from "zustand";
import { RouterEnum } from "../app/admin/MenuItem";

interface State {
  path: (keyof typeof RouterEnum)[];
  change: (newPath: (keyof typeof RouterEnum)[]) => void;
}

const useAppStore = create<State>()((set) => ({
  path: [],
  change: (newPath) => {
    set(() => ({ path: newPath }));
  },
}));

export default useAppStore;
