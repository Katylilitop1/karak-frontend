import { createSlice } from '@reduxjs/toolkit';

const initialState = {
 value: {},
};

export const meetingSlice = createSlice({
    name: 'meeting',
    initialState,
    reducers: {
    pushMeet: (state, action) => {
        state.value = action.payload;
    },
    clearMeet: (state) => {
        state.value = {};
    },
 },
});

export const { pushMeet, clearMeet } = meetingSlice.actions;
export default meetingSlice.reducer;