import { create } from 'zustand';

type ToggleTabStore = {
  tab: string | undefined;
  changeTab: (key: string) => void;
};

export const useToggleTabStore = create<ToggleTabStore>((set) => ({
  tab: undefined,
  changeTab: (key) => set({ tab: key }),
}));
