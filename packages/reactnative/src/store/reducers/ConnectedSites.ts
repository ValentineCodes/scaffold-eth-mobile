import {createSlice} from "@reduxjs/toolkit"

export interface ConnectedSite {
    name: string;
    topic: string;
}

export const connectedSiteSlice = createSlice({
    name: 'CONNECTED SITES',
    initialState: [] as ConnectedSite[],
    reducers: {
        addConnectedSite: (state, action) => {
            const connectedSite: ConnectedSite = action.payload
            const newState = state

            const siteIndex = state.findIndex(site => site.name == connectedSite.name)

            if(siteIndex === -1) {
                return [...state, connectedSite]
            } else {
                newState[siteIndex] = connectedSite
                return newState
            }
        },
        removeConnectedSite: (state, action) => {
            return state.filter(site => site.name !== action.payload)
        },
        clearConnectedSites: () => []
    }
})

export const {addConnectedSite, removeConnectedSite, clearConnectedSites} = connectedSiteSlice.actions

export default connectedSiteSlice.reducer