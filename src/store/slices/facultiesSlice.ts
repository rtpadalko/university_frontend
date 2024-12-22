import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {T_Faculty, T_Specialization} from "modules/types.ts";
import {AsyncThunkConfig} from "@reduxjs/toolkit/dist/createAsyncThunk";
import {api} from "modules/api.ts";
import {AxiosResponse} from "axios";

type T_FacultiesSlice = {
    faculty_name: string
    faculty: null | T_Faculty
    faculties: T_Faculty[]
}

const initialState:T_FacultiesSlice = {
    faculty_name: "",
    faculty: null,
    faculties: []
}

export const fetchFaculty = createAsyncThunk<T_Faculty, string, AsyncThunkConfig>(
    "fetch_faculty",
    async function(id) {
        const response = await api.faculties.facultiesRead(id) as AxiosResponse<T_Specialization>
        return response.data
    }
)

export const fetchFaculties = createAsyncThunk<T_Faculty[], object, AsyncThunkConfig>(
    "fetch_faculties",
    async function(_, thunkAPI) {
        const state = thunkAPI.getState();

        const response = await api.faculties.facultiesList({
            faculty_name: state.faculties.faculty_name
        }) as AxiosResponse<T_Faculty[]>

        return response.data
    }
)

const facultiesSlice = createSlice({
    name: 'faculties',
    initialState: initialState,
    reducers: {
        updateFacultyName: (state, action) => {
            state.faculty_name = action.payload
        },
        removeSelectedFaculty: (state) => {
            state.faculty = null
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchFaculty.fulfilled, (state:T_FacultiesSlice, action: PayloadAction<T_Faculty>) => {
            state.faculty = action.payload
        });
        builder.addCase(fetchFaculties.fulfilled, (state:T_FacultiesSlice, action: PayloadAction<T_Faculty[]>) => {
            state.faculties = action.payload
        });
    }
})

export const { updateFacultyName, removeSelectedFaculty} = facultiesSlice.actions;

export default facultiesSlice.reducer