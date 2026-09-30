import type { StateCreator } from 'zustand'
import { create } from 'zustand'
import type { Profile } from '@/types/db/Profile.ts'
import type { Team } from '@/types/db/Team.ts'

interface AppState {
  isAccessible: boolean
  localProfile: Profile | null
  selectedTeamID: string
  selectedTeam: Team | null
}

interface AppActions {
  toggleAccessibility: () => void
  setLocalProfile: (profile: Profile | null) => void
  setSelectedTeamID: (team: string) => void
  setSelectedTeam: (team: Team | null) => void
}

type AppStore = AppState & AppActions

const createAppSlice: StateCreator<AppStore, [], [], AppStore> = (set) => ({
  isAccessible: true,
  localProfile: null,
  selectedTeamID: '',
  selectedTeam: null,
  toggleAccessibility: () => set((state) => ({ isAccessible: !state.isAccessible })),
  setLocalProfile: (profile) => set({ localProfile: profile }),
  setSelectedTeamID: (team) => set({ selectedTeamID: team }),
  setSelectedTeam: (team) => set({ selectedTeam: team }),
})

const useAppStore = create<AppStore>((...a) => ({
  ...createAppSlice(...a),
}))

export type { AppActions, AppState, AppStore }
export { useAppStore }
