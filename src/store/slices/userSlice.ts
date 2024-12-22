import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit"
import {T_LoginCredentials, T_RegisterCredentials, T_User} from "modules/types.ts";
import {AsyncThunkConfig} from "@reduxjs/toolkit/dist/createAsyncThunk";
import {api} from "modules/api.ts";
import {AxiosResponse} from "axios";

const initialState:T_User = {
	id: -1,
	username: "",
	is_authenticated: false,
    is_superuser: false
}

export const handleCheck = createAsyncThunk<T_User, object, AsyncThunkConfig>(
    "check",
    async function() {
        const response = await api.users.usersLoginCreate({}) as AxiosResponse<T_User>
        return response.data
    }
)

export const handleLogin = createAsyncThunk<T_User, object, AsyncThunkConfig>(
    "login",
    async function({username, password}:T_LoginCredentials) {
        const response = await api.users.usersLoginCreate({
            username,
            password
        }) as AxiosResponse<T_User>

        return response.data
    }
)

export const handleRegister = createAsyncThunk<T_User, object, AsyncThunkConfig>(
    "register",
    async function({username, email, password}:T_RegisterCredentials) {
        const response = await api.users.usersRegisterCreate({
            username,
            email,
            password
        }) as AxiosResponse<T_User>

        return response.data
    }
)

export const handleLogout = createAsyncThunk<void, object, AsyncThunkConfig>(
    "logout",
    async function() {
        await api.users.usersLogoutCreate()
    }
)

export const handleUpdateProfile = createAsyncThunk<T_User, object, AsyncThunkConfig>(
    "updateProfile",
    async function(userData:T_RegisterCredentials, thunkAPI) {
        const state = thunkAPI.getState()
        const {password} = userData
        const response = await api.users.usersUpdateUpdate(state.user.id, {
            password
        }) as AxiosResponse<T_User>

        return response.data
    }
)

const userSlice = createSlice({
	name: 'user',
	initialState: initialState,
	reducers: {
        updateUserInfo: (state, action) => {
            state.is_authenticated = action.payload.is_authenticated
            state.is_superuser = action.payload.is_superuser
            state.id = action.payload.id
            state.username = action.payload.username
        }
    },
    extraReducers: (builder) => {
        builder.addCase(handleLogin.fulfilled, (state:T_User, action: PayloadAction<T_User>) => {
            state.is_authenticated = true
            state.is_superuser = action.payload.is_superuser
            state.id = action.payload.id
            state.username = action.payload.username
        });
        builder.addCase(handleRegister.fulfilled, (state:T_User, action: PayloadAction<T_User>) => {
            state.is_authenticated = true
            state.is_superuser = false
            state.id = action.payload.id
            state.username = action.payload.username
        });
        builder.addCase(handleLogout.fulfilled, (state:T_User) => {
            state.is_authenticated = false
            state.id = -1
            state.username = ""
        });
    }
})

export const {updateUserInfo} = userSlice.actions

export default userSlice.reducer