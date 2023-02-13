import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

const initialState = {
    index: 0,
    name: "",
    symbol: "",
    image: "",
    address: ""
}

export const collectionSlice = createSlice({
    name: 'collection',
    initialState,
    reducers: {
        setIndex(state, action) {
            state.index = action.payload
        },
        setName(state, action) {
            state.name = action.payload
        },
        setSymbol(state, action) {
            state.symbol = action.payload
        },
        setImage(state, action) {
            state.image = action.payload
        },
        setAddress(state, action) {
            state.address = action.payload
        },

        extraReducers: {
            // @ts-ignore
            [HYDRATE]: (state, action) => {
                return {
                    ...state,
                    ...action.payload.collection,
                }
            },
        },
    },
})

export const { setIndex, setName, setSymbol, setImage, setAddress } = collectionSlice.actions
export const selectIndex = (state: any) => state.collection.index
export const selectName = (state: any) => state.collection.name
export const selectSymbol =(state: any)=>state.collection.symbol
export const selectImage =(state: any)=>state.collection.image
export const selectAddress =(state: any)=>state.collection.address
export default collectionSlice.reducer
