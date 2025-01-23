import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false
};

export const userSlice = createSlice({
  name: 'AUTH',
  initialState,
  reducers: {
    loginUser: state => {
      return {
        isLoggedIn: true
      };
    },
    logoutUser: state => {
      return {
        isLoggedIn: false
      };
    }
  }
});

export const { loginUser, logoutUser } = userSlice.actions;

export default userSlice.reducer;
