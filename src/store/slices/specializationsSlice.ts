import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {T_Specialization, T_SpecializationAddData, T_SpecializationsListResponse} from "modules/types.ts";
import {api} from "modules/api.ts";
import {AsyncThunkConfig} from "@reduxjs/toolkit/dist/createAsyncThunk";
import {AxiosResponse} from "axios";
import {saveApplicant} from "store/slices/applicantsSlice.ts";
import {Specialization} from "src/api/Api.ts";

type T_SpecializationsSlice = {
    specialization_name: string
    specialization: null | T_Specialization
    specializations: T_Specialization[]
}

const initialState:T_SpecializationsSlice = {
    specialization_name: "",
    specialization: null,
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
        const response = await api.specializations.specializationsList({
            specialization_name: state.specializations.specialization_name
        }) as AxiosResponse<T_SpecializationsListResponse>

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

export const deleteSpecialization = createAsyncThunk<T_Specialization[], string, AsyncThunkConfig>(
    "delete_specialization",
    async function(specialization_id) {
        const response = await api.specializations.specializationsDeleteDelete(specialization_id) as AxiosResponse<T_Specialization[]>
        return response.data
    }
)

export const updateSpecialization = createAsyncThunk<void, object, AsyncThunkConfig>(
    "update_specialization",
    async function({specialization_id, data}) {
        await api.specializations.specializationsUpdateUpdate(specialization_id as string, data as Specialization)
    }
)

export const updateSpecializationImage = createAsyncThunk<void, object, AsyncThunkConfig>(
    "update_specialization_image",
    async function({specialization_id, data}) {
        await api.specializations.specializationsUpdateImageCreate(specialization_id as string, data as {image?: File})
    }
)

export const createSpecialization = createAsyncThunk<void, T_SpecializationAddData, AsyncThunkConfig>(
    "update_specialization",
    async function(data) {
        await api.specializations.specializationsCreateCreate(data)
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
            state.specialization = null
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchSpecializations.fulfilled, (state:T_SpecializationsSlice, action: PayloadAction<T_Specialization[]>) => {
            state.specializations = action.payload
        });
        builder.addCase(fetchSpecialization.fulfilled, (state:T_SpecializationsSlice, action: PayloadAction<T_Specialization>) => {
            state.specialization = action.payload
        });
        builder.addCase(deleteSpecialization.fulfilled, (state:T_SpecializationsSlice, action: PayloadAction<T_Specialization[]>) => {
            state.specializations = action.payload
        });
    }
})

export const { updateSpecializationName, removeSelectedSpecialization} = specializationsSlice.actions;

export default specializationsSlice.reducer