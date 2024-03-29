import {createSlice} from '@reduxjs/toolkit';

export interface ActiveSession {
    site: string;
    topic: string;
    requiredNamespaces: any;
    chainId: number;
    account: string;
}

export const activeSessionSlice = createSlice({
    name: "ACTIVE SESSION",
    initialState: [] as ActiveSession[],
    reducers: {
        addSession: (state, action) => {
            const activeSession: ActiveSession = action.payload
            const newState = state

            const sessionIndex = state.findIndex(session => session.site == activeSession.site)

            if(sessionIndex === -1) {
                return [...state, activeSession]
            } else {
                newState[sessionIndex] = activeSession
                return newState
            }
        },
        removeSession: (state, action) => {
            return state.filter(session => session.site !== action.payload)
        },
        switchSessionAccount: (state, action) => {
            const session = action.payload
            return state.map(activeSession => {
                if(activeSession.site === session.site) {
                    return {
                        ...activeSession,
                        account: session.account
                    }
                }
                return activeSession
            })
        },
        clearSessions: () => []
    }
})

export const {addSession, removeSession, switchSessionAccount, clearSessions} = activeSessionSlice.actions

export default activeSessionSlice.reducer