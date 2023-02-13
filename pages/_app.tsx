

import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Web3Provider } from '@providers'
import {wrapper} from "../store/store";
import {Provider} from "react-redux"

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function MyApp({ Component, ...rest }: AppProps) {
    let {store, props} = wrapper.useWrappedStore(rest)
    const {pageProps} = props
  return (
    <>
      <ToastContainer />
        <Provider store={store}>
      <Web3Provider>
        <Component {...pageProps} />
      </Web3Provider>
    </Provider>
    </>
  )
}

export default MyApp
