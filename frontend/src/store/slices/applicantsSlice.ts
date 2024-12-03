import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {T_Applicant, T_Specialization} from "src/utils/types.ts";
import {AsyncThunkConfig} from "@reduxjs/toolkit/dist/createAsyncThunk";
import {api} from "modules/api.ts";
import {AxiosResponse} from "axios";
import {NEXT_YEAR, PREV_YEAR} from "utils/consts.ts";

type T_applicantsSlice = {
    draft_applicant_id: number | null,
    specializations_count: number | null,
    applicant: T_Applicant | null,
    applicants: T_Applicant[],
    filters: T_applicantsFilters,
    save_mm: boolean
}

export type T_applicantsFilters = {
    date_formation_start: string
    date_formation_end: string
    status: number
}

const initialState:T_applicantsSlice = {
    draft_applicant_id: null,
    specializations_count: null,
    applicant: null,
    applicants: [],
    filters: {
        status: 0,
        date_formation_start: PREV_YEAR.toISOString().split('T')[0],
        date_formation_end: NEXT_YEAR.toISOString().split('T')[0]
    },
    save_mm: false
}

export const fetchApplicant = createAsyncThunk<T_Applicant, string, AsyncThunkConfig>(
    "applicants/applicant",
    async function(applicant_id) {
        const response = await api.applicants.applicantsRead(applicant_id) as AxiosResponse<T_Applicant>
        return response.data
    }
)

export const fetchApplicants = createAsyncThunk<T_Applicant[], object, AsyncThunkConfig>(
    "applicants/applicants",
    async function(_, thunkAPI) {
        const state = thunkAPI.getState()

        const response = await api.applicants.applicantsList({
            status: state.applicants.filters.status,
            date_formation_start: state.applicants.filters.date_formation_start,
            date_formation_end: state.applicants.filters.date_formation_end
        }) as AxiosResponse<T_Applicant[]>
        return response.data
    }
)

export const removeSpecializationFromDraftApplicant = createAsyncThunk<T_Specialization[], string, AsyncThunkConfig>(
    "applicants/remove_specialization",
    async function(specialization_id, thunkAPI) {
        const state = thunkAPI.getState()
        const response = await api.applicants.applicantsDeleteSpecializationDelete(state.applicants.applicant.id, specialization_id) as AxiosResponse<T_Specialization[]>
        return response.data
    }
)

export const deleteDraftApplicant = createAsyncThunk<void, object, AsyncThunkConfig>(
    "applicants/delete_draft_applicant",
    async function(_, {getState}) {
        const state = getState()
        await api.applicants.applicantsDeleteDelete(state.applicants.applicant.id)
    }
)

export const sendDraftApplicant = createAsyncThunk<void, object, AsyncThunkConfig>(
    "applicants/send_draft_applicant",
    async function(_, {getState}) {
        const state = getState()
        await api.applicants.applicantsUpdateStatusUserUpdate(state.applicants.applicant.id)
    }
)

export const updateApplicant = createAsyncThunk<void, object, AsyncThunkConfig>(
    "applicants/update_applicant",
    async function(data, {getState}) {
        const state = getState()
        await api.applicants.applicantsUpdateUpdate(state.applicants.applicant.id, {
            ...data
        })
    }
)

export const updateSpecializationValue = createAsyncThunk<void, object, AsyncThunkConfig>(
    "applicants/update_mm_value",
    async function({specialization_id, value},thunkAPI) {
        const state = thunkAPI.getState()
        await api.applicants.applicantsUpdateSpecializationUpdate(state.applicants.applicant.id, specialization_id, {
            priority: value
        })
    }
)

const applicantsSlice = createSlice({
    name: 'applicants',
    initialState: initialState,
    reducers: {
        saveApplicant: (state, action) => {
            state.draft_applicant_id = action.payload.draft_applicant_id
            state.specializations_count = action.payload.specializations_count
        },
        removeApplicant: (state) => {
            state.applicant = null
        },
        triggerUpdateMM: (state) => {
            state.save_mm = !state.save_mm
        },
        updateFilters: (state, action) => {
            state.filters = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchApplicant.fulfilled, (state:T_applicantsSlice, action: PayloadAction<T_Applicant>) => {
            state.applicant = action.payload
        });
        builder.addCase(fetchApplicants.fulfilled, (state:T_applicantsSlice, action: PayloadAction<T_Applicant[]>) => {
            state.applicants = action.payload
        });
        builder.addCase(removeSpecializationFromDraftApplicant.rejected, (state:T_applicantsSlice) => {
            state.applicant = null
        });
        builder.addCase(removeSpecializationFromDraftApplicant.fulfilled, (state:T_applicantsSlice, action: PayloadAction<T_Specialization[]>) => {
            (state.applicant as T_Applicant).specializations = action.payload
        });
        builder.addCase(sendDraftApplicant.fulfilled, (state:T_applicantsSlice) => {
            state.applicant = null
        });
    }
})

export const { saveApplicant, removeApplicant, triggerUpdateMM, updateFilters } = applicantsSlice.actions;

export default applicantsSlice.reducer