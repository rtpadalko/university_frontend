import {configureStore} from "@reduxjs/toolkit";
import {TypedUseSelectorHook, useSelector} from "react-redux";
import specializationsReducer from "./slices/specializationsSlice.ts"

export const store = configureStore({
    reducer: {
        specializations: specializationsReducer
    }
});

export type RootState = ReturnType<typeof store.getState>
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;