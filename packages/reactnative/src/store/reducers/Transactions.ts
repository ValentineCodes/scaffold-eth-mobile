import { createSlice } from "@reduxjs/toolkit";
import { BigNumber } from "ethers";

export interface Transaction {
    action: string;
    amount: number;
    gasCost: string;
    timestamp: string;
    from: string;
    to: string;
    nonce: number;
}

export const transactionsSlice = createSlice({
    name: "TRANSACTIONS",
    initialState: [] as Transaction[] | [],
    reducers: {
        addTransaction: (state, action) => {
            return [...state, action.payload]
        }
    }
})

export const {addTransaction} = transactionsSlice.actions

export default transactionsSlice.reducer