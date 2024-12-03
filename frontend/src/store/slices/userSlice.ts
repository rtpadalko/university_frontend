import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit"
import {T_LoginCredentials, T_RegisterCredentials, T_User} from "src/utils/types.ts";
import {AsyncThunkConfig} from "@reduxjs/toolkit/dist/createAsyncThunk";
import {AxiosResponse} from "axios";
import {api} from "modules/api.ts";

const initialState:T_User = {
	id: -1,
	username: "",
	email: "",
	is_authenticated: false,
    validation_error: false,
    validation_success: false,
    checked: false
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
        const {username, email , password} = userData
        const response = await api.users.usersUpdateUpdate(state.user.id, {
            username,
            email,
            password
        }) as AxiosResponse<T_User>

        return response.data
    }
)


const userSlice = createSlice({
	name: 'user',
	initialState: initialState,
	reducers: {
        setValidationError: (state, action) => {
            state.validation_error = action.payload
        }
	},
    extraReducers: (builder) => {
        builder.addCase(handleLogin.fulfilled, (state:T_User, action: PayloadAction<T_User>) => {
            state.is_authenticated = true
            state.id = action.payload.id
            state.username = action.payload.username
            state.email = action.payload.email
        });
        builder.addCase(handleRegister.fulfilled, (state:T_User, action: PayloadAction<T_User>) => {
            state.is_authenticated = true
            state.id = action.payload.id
            state.username = action.payload.username
            state.email = action.payload.email
        });
        builder.addCase(handleLogout.fulfilled, (state:T_User) => {
            state.is_authenticated = false
            state.id = -1
            state.username = ""
            state.email = ""
            state.validation_error = false
        });
        builder.addCase(handleCheck.fulfilled, (state:T_User, action: PayloadAction<T_User>) => {
            state.is_authenticated = true
            state.id = action.payload.id
            state.username = action.payload.username
            state.email = action.payload.email
            state.checked = true
        });
        builder.addCase(handleCheck.rejected, (state:T_User) => {
            state.is_authenticated = false
            state.id = -1
            state.username = ""
            state.email = ""
            state.validation_error = false
            state.checked = true
        });
        builder.addCase(handleUpdateProfile.fulfilled, (state:T_User, action: PayloadAction<T_User>) => {
            state.id = action.payload.id
            state.username = action.payload.username
            state.email = action.payload.email
            state.validation_error = false
            state.validation_success = true
        });
        builder.addCase(handleUpdateProfile.rejected, (state:T_User) => {
            state.validation_error = true
            state.validation_success = false
        });
    }
})

export const {setValidationError} = userSlice.actions

export default userSlice.reducer