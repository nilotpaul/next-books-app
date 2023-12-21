import { create } from 'zustand';

type ManageTabStore = {
  tab: 'Reader' | 'Author';
  changeTab: () => void;
};

export const useManageTabStore = create<ManageTabStore>((set) => ({
  tab: 'Reader',
  changeTab: () => set((state) => ({ tab: state.tab === 'Reader' ? 'Author' : 'Reader' })),
}));
