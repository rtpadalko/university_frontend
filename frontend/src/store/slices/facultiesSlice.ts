import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {T_Faculty} from "src/utils/types.ts";
import {AsyncThunkConfig} from "@reduxjs/toolkit/dist/createAsyncThunk";
import {api} from "modules/api.ts";
import {AxiosResponse} from "axios";

type T_FacultiesSlice = {
    faculty_name: string
    selectedFaculty: null | T_Faculty
    faculties: T_Faculty[]
}

const initialState:T_FacultiesSlice = {
    faculty_name: "",
    selectedFaculty: null,
    faculties: []
}

export const fetchFaculty = createAsyncThunk<T_Faculty, string, AsyncThunkConfig>(
    "fetch_Faculty",
    async function(id) {
        const response = await api.faculties.facultiesRead(id) as AxiosResponse<T_Faculty>
        return response.data
    }
)

export const fetchFaculties = createAsyncThunk<T_Faculty[], object, AsyncThunkConfig>(
    "fetch_Faculties",
    async function(_, thunkAPI) {
        const state = thunkAPI.getState();
        const response = await api.faculties.facultiesList({faculty_name: state.faculties.faculty_name}) as AxiosResponse
        return response.data
    }
)

const FacultiesSlice = createSlice({
    name: 'Faculties',
    initialState: initialState,
    reducers: {
        updateQuery: (state, action) => {
            state.faculty_name = action.payload
        },
        removeSelectedFaculty: (state) => {
            state.selectedFaculty = null
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchFaculties.fulfilled, (state:T_FacultiesSlice, action: PayloadAction<T_Faculty[]>) => {
            state.faculties = action.payload
        });
        builder.addCase(fetchFaculty.fulfilled, (state:T_FacultiesSlice, action: PayloadAction<T_Faculty>) => {
            state.selectedFaculty = action.payload
        });
    }
})

export const { updateQuery, removeSelectedFaculty} = FacultiesSlice.actions;

export default FacultiesSlice.reducer