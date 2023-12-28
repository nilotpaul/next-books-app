import { create } from 'zustand';

type ToggleTabStore = {
  tab: string;
  changeTab: (key: string) => void;
};

export const useToggleTabStore = create<ToggleTabStore>((set) => ({
  tab: '',
  changeTab: (key) => set({ tab: key }),
}));
