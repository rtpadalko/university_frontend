import {createSlice} from "@reduxjs/toolkit";

type T_SpecializationsSlice = {
    specialization_name: string
}

const initialState:T_SpecializationsSlice = {
    specialization_name: "",
}


const specializationsSlice = createSlice({
    name: 'specializations',
    initialState: initialState,
    reducers: {
        updateSpecializationName: (state, action) => {
            state.specialization_name = action.payload
        }
    }
})

export const { updateSpecializationName} = specializationsSlice.actions;

export default specializationsSlice.reducer