import React, { useState} from 'react';

import Input from '../../components/ui/Form/Input/Input'
import { required, length, email } from '../../util/validators';

import {NextPage} from "next";
import {BaseLayout} from "@ui";
import {useRouter} from "next/router";
import {useDispatch} from "react-redux";
import {setAuthState} from "../../store/slices/authSlice";


const Login: NextPage = () => {
   const router= useRouter()
    const dispatch = useDispatch()

  const [loginState, setLoginState]=useState( {
    isAuth: false,
    token: null,
    userId: null,
    authLoading: false,
    error: null
  })
  const [state, setState]=useState({
    loginForm: {
      email: {
        value: '',
        valid: false,
        touched: false,
        validators: [required, email]
      },
      password: {
        value: '',
        valid: false,
        touched: false,
        validators: [required, length({ min: 5 })]
      },
      formIsValid: false
    }
  })


 const inputChangeHandler = (input: string | number, value: any) => {

   setState((prevState: { loginForm: { [x: string]: any; }; }) => {
      let isValid = true;
      for (const validator of prevState.loginForm[input].validators) {
        isValid = isValid && validator(value);
      }
      const updatedForm = {
        ...prevState.loginForm,
        [input]: {
          ...prevState.loginForm[input],
          valid: isValid,
          value: value
        }
      };
      let formIsValid = true;
      for (const inputName in updatedForm) {
        formIsValid = true
      }
      return {
        loginForm: updatedForm,
        formIsValid: formIsValid
      };
    });
  };
  const logoutHandler = () => {
    setLoginState({...loginState, isAuth: false, token: null });
    localStorage.removeItem('token');
    localStorage.removeItem('expiryDate');
    localStorage.removeItem('userId');
  };
  const setAutoLogout = (milliseconds: number | undefined) => {
    setTimeout(() => {
      logoutHandler();
    }, milliseconds);
  };

  const loginHandler = ( authData: any ) => {
    const graphqlQuery = {
      query: `
        query UserLogin($email: String!, $password: String!) {
          login(email: $email, password: $password) {
            token
            userId
          }
        }
      `,
      variables: {
        email: authData.loginForm!.email.value,
        password: authData.loginForm!.password.value
      }
    };


    fetch('http://localhost:8080/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(graphqlQuery)
    })
        .then(res => {
          return res.json();
        })
        .then(resData => {
          if (resData.errors && resData.errors[0].status === 422) {
            throw new Error(
                "Validation failed. Make sure the email address isn't used yet!"
            );
          }
          if (resData.errors) {
            console.log(resData.errors)
            throw new Error('User login failed!');
          }

          setLoginState({...loginState,
            isAuth: true,
            token: resData.data.login.token,
            authLoading: false,
            userId: resData.data.login.userId
          });
          localStorage.setItem('token', resData.data.login.token);
          localStorage.setItem('userId', resData.data.login.userId);
          const remainingMilliseconds = 60 * 60 * 1000;
          const expiryDate = new Date(
              new Date().getTime() + remainingMilliseconds
          );
          localStorage.setItem('expiryDate', expiryDate.toISOString());
          setAutoLogout(remainingMilliseconds);
            dispatch(setAuthState(true))
          router.push('/')
        })
        .catch(err => {
          console.log(err);
          setLoginState({...loginState,
            isAuth: false,
            authLoading: false,
            error: err
          });
        });
  };
  const inputBlurHandler = (input: string | number) => {
    setState(prevState => {
        return {
        loginForm: {
          ...prevState.loginForm,
          [input]: {
            ...prevState.loginForm[input],
            touched: true
          }
        }
      };
    });
  };

    return (

      <BaseLayout>
        <div className="mt-5 md:mt-0 md:col-span-2 " style={{maxWidth: "500px"}}>
          <form >
            <div className="shadow sm:rounded-md sm:overflow-hidden">
              <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                <div>

                    <Input
                        id="email"
                        label="Your E-Mail"
                        value={state.loginForm.email.value}
                        onChange={inputChangeHandler}
                        onBlur={inputBlurHandler.bind(this, 'email')}
                        valid={state.loginForm.email.valid}
                        touched={state.loginForm.email.touched}
                        type="email"
                        placeholder="example@gmail.com"
                     />

                </div>
                <div>

                    <Input
                        id="password"
                        label="Password"
                        type="password"
                        value={state.loginForm.password.value}
                        onBlur={inputBlurHandler.bind(this, 'password')}
                        valid={state.loginForm.password.valid}
                        touched={state.loginForm.password.touched}
                        onChange={inputChangeHandler}
                        placeholder="password"
                    />

                </div>



              </div>
              <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                <button
                    onClick={()=>loginHandler(state)}
                    type="button"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  LogIn
                </button>
              </div>
            </div>
          </form>
        </div>
      </BaseLayout>)

}

export default Login;
