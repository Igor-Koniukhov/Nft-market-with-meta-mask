import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

const initialState = {
    authState: false,
    name: "",
    email: ""
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuthState(state, action) {
            state.authState = action.payload
        },
        setNameUser(state, action) {
            state.name = action.payload
        },
        setEmailUser(state, action){
            state.email=action.payload
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

export const { setAuthState, setNameUser, setEmailUser } = authSlice.actions
export const selectAuthState = (state: any) => state.auth.authState
export const selectNameUser = (state: any) => state.auth.name
export const selectEmailUser = (state: any) => state.auth.email
export default authSlice.reducer
