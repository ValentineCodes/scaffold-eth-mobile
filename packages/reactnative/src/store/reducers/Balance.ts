import { createSlice } from "@reduxjs/toolkit";

export const balanceSlice = createSlice({
    name: "BALANCE",
    initialState: "",
    reducers: {
        setBalance: (state, action) => {
            return action.payload
        }
    }
})

export const {setBalance} = balanceSlice.actions

export default balanceSlice.reducer