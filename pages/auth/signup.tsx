/* eslint-disable @next/next/no-img-element */

import type {NextPage} from 'next'
import React, {useRef, useState} from 'react';
import {BaseLayout} from '@ui'
import {useRouter} from "next/router";
import Input from '../../components/ui/Form/Input/Input'
import {email, length, required} from '../../util/validators';
import {useAccount} from "@hooks/web3";

const SignUp: NextPage = () => {
    const router = useRouter()
    const {account}=useAccount()

    const [authInfo, setAuthInfo] = useState({
        isAuth: false,
        authLoading: false,
        error: null
    })
    const [state, setState] = useState({
        signupForm: {
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
                validators: [required, length({min: 5})]
            },
            name: {
                value: '',
                valid: false,
                touched: false,
                validators: [required]
            },
            formIsValid: false
        }
    })

    const inputChangeHandler = (input: string | number, value: any) => {

        setState((prevState: { signupForm: { [x: string]: any; }; }) => {
            let isValid = true;
            for (const validator of prevState.signupForm[input].validators) {
                isValid = isValid && validator(value);
            }
            const updatedForm = {
                ...prevState.signupForm,
                [input]: {
                    ...prevState.signupForm[input],
                    valid: isValid,
                    value: value
                }
            };
            let formIsValid = true;
            for (const inputName in updatedForm) {
                formIsValid = true
            }
            return {
                signupForm: updatedForm,
                formIsValid: formIsValid
            };
        });
    };

    const signupHandler = (state: { signupForm: any; }) => {
        const graphqlQuery = {
            query: `
        mutation CreateNewUser($email: String!, $name: String!, $password: String!, $address: String!) {
          createUser(userInput: {email: $email, name: $name, password: $password, address: $address}) {
            _id
            email
          }
        }
      `,
            variables: {
                email: state.signupForm.email.value,
                name: state.signupForm.name.value,
                password: state.signupForm.password.value,
                address: account.data
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
                    throw new Error('User creation failed!');
                }

                setAuthInfo({...authInfo, isAuth: false, authLoading: false});

                router.push('/auth/login')

            })
            .catch(err => {
                console.log(err);
                setAuthInfo({
                    isAuth: false,
                    authLoading: false,
                    error: err
                });
            });
    };
    const inputBlurHandler = (input: string | number) => {
        setState(prevState => {
            return {
                signupForm: {
                    ...prevState.signupForm,
                    [input]: {
                        ...prevState.signupForm[input],
                        touched: true
                    }
                }
            };
        });
    };


    return (
        <BaseLayout>
            <div>
                <div className="md:grid md:grid-cols-3 md:gap-6">
                    <div className="md:col-span-1">
                        <div className="px-4 sm:px-0">
                            <h3 className="text-lg font-medium leading-6 text-gray-900">Set up your profile</h3>
                        </div>
                    </div>
                    <div className="mt-5 md:mt-0 md:col-span-2 " style={{maxWidth: "500px"}}>
                        <form>
                            <div className="shadow sm:rounded-md sm:overflow-hidden">
                                <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                                    <Input
                                        id="email"
                                        label="Your E-Mail"
                                        value={state.signupForm.email.value}
                                        onChange={inputChangeHandler}
                                        onBlur={inputBlurHandler.bind(this, 'email')}
                                        valid={state.signupForm.email.valid}
                                        touched={state.signupForm.email.touched}
                                        type="email"
                                        placeholder="example@gmail.com"

                                    />
                                    <div>
                                        <div className="mt-1 flex rounded-md shadow-sm">
                                            <Input
                                                id="password"
                                                label="Password"
                                                type="password"
                                                onBlur={inputBlurHandler.bind(this, 'password')}
                                                onChange={inputChangeHandler}
                                                value={state.signupForm.password.value}
                                                valid={state.signupForm.password.valid}
                                                touched={state.signupForm.password.touched}
                                                placeholder='********'
                                            />
                                        </div>
                                    </div>
                                    <Input
                                        id="name"
                                        label="Your Name"
                                        type="text"
                                        onChange={inputChangeHandler}
                                        onBlur={inputBlurHandler.bind(this, 'password')}
                                        value={state.signupForm.name.value}
                                        valid={state.signupForm.name.valid}
                                        touched={state.signupForm.name.touched}
                                        placeholder="your name"
                                    />


                                </div>
                                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                                    <button
                                        onClick={() => signupHandler(state)}
                                        type="button"
                                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Upload
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

            </div>
        </BaseLayout>
    )
}



export default SignUp;
