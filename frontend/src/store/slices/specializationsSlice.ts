import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {T_Specialization, T_SpecializationsListResponse} from "src/utils/types.ts";
import {AsyncThunkConfig} from "@reduxjs/toolkit/dist/createAsyncThunk";
import {saveApplicant} from "store/slices/applicantsSlice.ts";
import {api} from "modules/api.ts";
import {AxiosResponse} from "axios";

type T_SpecializationsSlice = {
    specialization_name: string
    selectedSpecialization: null | T_Specialization
    specializations: T_Specialization[]
}

const initialState:T_SpecializationsSlice = {
    specialization_name: "",
    selectedSpecialization: null,
    specializations: []
}

export const fetchSpecialization = createAsyncThunk<T_Specialization, string, AsyncThunkConfig>(
    "fetch_specialization",
    async function(id) {
        const response = await api.specializations.specializationsRead(id) as AxiosResponse<T_Specialization>
        return response.data
    }
)

export const fetchSpecializations = createAsyncThunk<T_Specialization[], object, AsyncThunkConfig>(
    "fetch_specializations",
    async function(_, thunkAPI) {
        const state = thunkAPI.getState();
        const response = await api.specializations.specializationsList({specialization_name: state.specializations.specialization_name}) as AxiosResponse<T_SpecializationsListResponse>

        thunkAPI.dispatch(saveApplicant({
            draft_applicant_id: response.data.draft_applicant_id,
            specializations_count: response.data.specializations_count
        }))

        return response.data.specializations
    }
)

export const addSpecializationToApplicant = createAsyncThunk<void, string, AsyncThunkConfig>(
    "specializations/add_specialization_to_applicant",
    async function(specialization_id) {
        await api.specializations.specializationsAddToApplicantCreate(specialization_id)
    }
)

const specializationsSlice = createSlice({
    name: 'specializations',
    initialState: initialState,
    reducers: {
        updateSpecializationName: (state, action) => {
            state.specialization_name = action.payload
        },
        removeSelectedSpecialization: (state) => {
            state.selectedSpecialization = null
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchSpecializations.fulfilled, (state:T_SpecializationsSlice, action: PayloadAction<T_Specialization[]>) => {
            state.specializations = action.payload
        });
        builder.addCase(fetchSpecialization.fulfilled, (state:T_SpecializationsSlice, action: PayloadAction<T_Specialization>) => {
            state.selectedSpecialization = action.payload
        });
    }
})

export const { updateSpecializationName, removeSelectedSpecialization} = specializationsSlice.actions;

export default specializationsSlice.reducer