import type { Profile } from 'types/db/Profile'
import type { Team } from 'types/db/Team'
import type { StateCreator } from 'zustand'
import { create } from 'zustand'

export type AppState = {
  isAccessible: boolean
  localProfile: Profile | null
  selectedTeamID: string
  selectedTeam: Team | null
}

export type AppActions = {
  toggleAccessibility: () => void
  setLocalProfile: (profile: Profile | null) => void
  setSelectedTeamID: (team: string) => void
  setSelectedTeam: (team: Team | null) => void
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
  localProfile:        null,
  selectedTeamID:      '',
  selectedTeam:        null,
  toggleAccessibility: () => set(state => ({ isAccessible: !state.isAccessible })),
  setLocalProfile:     profile => set({ localProfile: profile }),
  setSelectedTeamID:   team => set({ selectedTeamID: team }),
  setSelectedTeam:     team => set({ selectedTeam: team }),
})

export const useAppStore = create<AppStore>((...a) => ({
  ...createAppSlice(...a),
}))
