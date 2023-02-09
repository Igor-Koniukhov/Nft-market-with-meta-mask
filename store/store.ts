import {configureStore} from '@reduxjs/toolkit'
import {createWrapper} from 'next-redux-wrapper'
import {networkSlice} from './slices/networkSlice'
import {authSlice} from "./slices/authSlice"
import {collectionSlice} from "./slices/collectionSlice";


const makeStore = () =>
    configureStore({
        reducer: {
            [authSlice.name]: authSlice.reducer,
            [networkSlice.name]: networkSlice.reducer,
            [collectionSlice.name]: collectionSlice.reducer,
        },
        devTools: true,
    })

export const wrapper = createWrapper(makeStore)
