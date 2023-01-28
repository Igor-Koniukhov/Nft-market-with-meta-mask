import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

const initialState = {
    authState: false,
    authUser: "",
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuthState(state, action) {
            state.authState = action.payload
        },
        setAuthUser(state, action) {
            state.authUser = action.payload
        },

        extraReducers: {
            // @ts-ignore
            [HYDRATE]: (state, action) => {
                return {
                    ...state,
                    ...action.payload.auth,
                }
            },
        },
    },
})

export const { setAuthState, setAuthUser } = authSlice.actions
export const selectAuthState = (state: any) => state.auth.authState
export const selectAuthUser = (state: any) => state.auth.authUser
export default authSlice.reducer