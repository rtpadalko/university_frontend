import {configureStore, ThunkDispatch} from "@reduxjs/toolkit";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import userReducer from "./slices/userSlice.ts"
import applicantsReducer from "./slices/applicantsSlice.ts"
import specializationsReducer from "./slices/specializationsSlice.ts"
import facultiesReducer from "./slices/facultiesSlice.ts"

export const store = configureStore({
    reducer: {
        user: userReducer,
        applicants: applicantsReducer,
        specializations: specializationsReducer,
        faculties: facultiesReducer
    }
});

export type RootState = ReturnType<typeof store.getState>
export type AppThunkDispatch = ThunkDispatch<RootState, never, never>

export const useAppDispatch = () => useDispatch<AppThunkDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;