import { create } from 'zustand';

type ManageTabStore = {
  tab: string;
  changeTab: (key: string) => void;
};

export const useManageTabStore = create<ManageTabStore>((set) => ({
  tab: 'Reader',
  changeTab: (key) => set({ tab: key }),
}));
