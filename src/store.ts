import { create, type StateCreator } from 'zustand'

export type AppState = {
    isAccessible: boolean
    selectedTeam: string
}

export type AppActions = {
    toggleAccessibility: () => void
    setSelectedTeam: (team: string) => void
}

export type AppStore = AppState & AppActions

const createAppSlice: StateCreator<
    AppStore,
    [],
    [],
    AppStore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
> = (set, get) => ({
  isAccessible:        true,
  selectedTeam:        '',
  toggleAccessibility: () => set(state => ({ isAccessible: !state.isAccessible })),
  setSelectedTeam:     team => set({ selectedTeam: team }),
})

export const useAppStore = create<AppStore>((...a) => ({
  ...createAppSlice(...a),
}))
