/* eslint-disable @next/next/no-img-element */

import type { NextPage } from 'next'
import {ChangeEvent, useState} from 'react';
import {BaseLayout} from '@ui'
import {required, length, email} from '../../util/validators';
import {useRouter} from "next/router";
import {useDispatch} from "react-redux";



const SignUp: NextPage = () => {
    const router = useRouter()

    const [authInfo, setAuthInfo] = useState({
        isAuth: false,
        authLoading: false,
        error: null
    })
    const [userData, setUserData] = useState({
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


    const inputChangeHandler = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        console.log(userData)
        setUserData(prevState => {
            let isValid = true;
            // @ts-ignore
            for (const validator of prevState.signupForm[name].validators) {
                isValid = isValid && validator(value);
            }
            const updatedForm = {
                ...prevState.signupForm,
                [name]: {
                    // @ts-ignore
                    ...prevState.signupForm[name],
                    valid: isValid,
                    value: value
                }
            };
            let formIsValid = true;
            for (const inputName in updatedForm) {
                // @ts-ignore
                formIsValid = formIsValid && updatedForm[inputName].valid;
            }
            return {
                signupForm: updatedForm,
                formIsValid: formIsValid
            };
        });
    };
    const signupHandler = (userData: { signupForm: any; }) => {
        const graphqlQuery = {
            query: `
        mutation CreateNewUser($email: String!, $name: String!, $password: String!) {
          createUser(userInput: {email: $email, name: $name, password: $password}) {
            _id
            email
          }
        }
      `,
            variables: {
                email: userData.signupForm.email.value,
                name: userData.signupForm.name.value,
                password: userData.signupForm.password.value
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
                console.log(resData);
                setAuthInfo({...authInfo, isAuth: false, authLoading: false });
                console.log(userData, authInfo)
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
                        <form >
                            <div className="shadow sm:rounded-md sm:overflow-hidden">
                                <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                            Email
                                        </label>
                                        <div className="mt-1 flex rounded-md shadow-sm">
                                            <input
                                                value={userData.signupForm['email'].value}
                                                onChange={inputChangeHandler}
                                                type="email"
                                                name="email"
                                                id="email"
                                                className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                                                placeholder="example@gmail.com"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                            Password
                                        </label>
                                        <div className="mt-1 flex rounded-md shadow-sm">
                                            <input
                                                value={userData.signupForm['password'].value}
                                                onChange={inputChangeHandler}
                                                type="password"
                                                name="password"
                                                id="password"
                                                className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                                                placeholder="password"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                            Name
                                        </label>
                                        <div className="mt-1 flex rounded-md shadow-sm">
                                            <input
                                                value={userData.signupForm['name'].value}
                                                onChange={inputChangeHandler}
                                                type="text"
                                                name="name"
                                                id="name"
                                                className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                                                placeholder="Name"
                                            />
                                        </div>
                                    </div>



                                </div>
                                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                                    <button
                                        onClick={()=>signupHandler( userData)}
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
