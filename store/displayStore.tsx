import create from "zustand"

interface displayStoreState {
  isSidebarVisibleInMobile: boolean
  setIsSidebarVisibleInMobile: (isSidebarVisibleInMobile: boolean) => void
  reset: () => void
}

const useDisplayStore = create<displayStoreState>()((set) => ({
  isSidebarVisibleInMobile: false,
  setIsSidebarVisibleInMobile: (isSidebarVisibleInMobile: boolean) => set(() => ({isSidebarVisibleInMobile: isSidebarVisibleInMobile})),
  reset: () => set(() => ({
    isSidebarVisibleInMobile: false
  })),
}))

export default useDisplayStore