import { createSlice } from '@reduxjs/toolkit';

export const recipientSlice = createSlice({
  name: 'RECIPIENT',
  initialState: [] as string[],
  reducers: {
    addRecipient: (state, action) => {
      const newRecipient = action.payload.toLowerCase();
      if (
        !state.map(recipient => recipient.toLowerCase()).includes(newRecipient)
      ) {
        return [...state, newRecipient];
      } else {
        return state;
      }
    },
    removeRecipient: (state, action) => {
      const removedRecipient = action.payload.toLowerCase();
      return state.filter(
        recipient => recipient.toLowerCase() !== removedRecipient
      );
    },
    clearRecipients: () => []
  }
});

export const { addRecipient, removeRecipient, clearRecipients } =
  recipientSlice.actions;

export default recipientSlice.reducer;
