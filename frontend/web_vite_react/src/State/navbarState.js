import { createSlice } from '@reduxjs/toolkit' //for storing global state object in redux store


const firstState_navbar = {
  'usr': {}
};

const navbarSlice = createSlice({
  name: 'navbarState',
  initialState: firstState_navbar,
  reducers: {
    navbarUpdate(state, action) {
            state.usr = action.payload.usr;
    }
  },
});

export const { navbarUpdate } = navbarSlice.actions;
export default navbarSlice.reducer;