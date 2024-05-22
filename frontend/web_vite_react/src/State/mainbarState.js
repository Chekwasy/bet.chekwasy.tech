import { createSlice } from '@reduxjs/toolkit' //for storing global state object in redux store


const firstState = {
  'gamesSelected': {},
  'setalloddsFunction': false,
};

const mainbarSlice = createSlice({
  name: 'mainbarState',
  initialState: firstState,
  reducers: {
    mainbarUpdate(state, action) {
            state.gamesSelected = action.payload.gamesSelected;
            state.setalloddsFunction = action.payload.setalloddsFunction;
    }
  },
});

export const { mainbarUpdate } = mainbarSlice.actions;
export default mainbarSlice.reducer;