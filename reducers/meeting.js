import { createSlice, current } from '@reduxjs/toolkit';

const initialState = {
 value: [],
};

// [{{meeting}, coords, isResolved, isKeeped}]

export const meetingSlice = createSlice({
    name: 'meeting',
    initialState,
    reducers: {
    pushMeet: (state, action) => {
        //console.log('entry in pusMeet', action.payload)
        if(state.value.length === 0 && action.payload?.meeting){
            state.value.push(action.payload);
        }else if(action.payload?.meeting){
            if( state.value.every(e => e.coords !== action.payload.coords) ){
                    state.value.push(action.payload);
            }
        };
        //console.log('pushMeet from reducer', current(state.value))
    },
    updateMeet: (state, action) => {
        state.value.find(e => {
            if(e.coords === action.payload.coords){
                e.meeting = action.payload.meeting
                e.isResolved = action.payload.isResolved
                e.isSkiped = action.payload.isSkiped
            } 
        } ) ;
        //console.log('updateMeet from reducer', current(state.value))
    },
    removeMeet: (state, action) => {
        state.value.splice(state.value.findIndex(e => e.coords === action.payload.coords),1);
    },

 },
});

export const { pushMeet, updateMeet, removeMeet } = meetingSlice.actions;
export default meetingSlice.reducer;