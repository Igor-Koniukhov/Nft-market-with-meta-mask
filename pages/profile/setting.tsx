/* eslint-disable @next/next/no-img-element */

import type { NextPage } from 'next'
import {ChangeEvent, useEffect, useState} from 'react';
import { BaseLayout } from '@ui'
import {PinataRes, UserData} from '@_types/nft';
import axios from 'axios';
import { useWeb3 } from '@providers/web3';
import { toast } from "react-toastify";
import {useAccount, useNetwork} from '@hooks/web3';
import { ExclamationIcon } from '@heroicons/react/solid';
import {ethConnect, usercontract} from '../../userDB/config';



const NftCreate: NextPage = () => {
  const {ethereum} = useWeb3();
  const {account}=useAccount();
  const {network} = useNetwork();
  const [userURI, setUserURI] = useState("");
  const [imageURI, setImageURI]=useState("");
  const addressWallet = '0x404a5F514B9BB04B0437c4113c3714367CCb8C53';

  const [userData, setUserData] = useState<UserData>({
    userName: "",
    userLastName: "",
    email: "",
  });


  const handleImage = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      console.error("Select a file");
      return;
    }

    const file = e.target.files[0];
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    
    try {
      const promise = axios.post("/api/verify-image-profile", {
        bytes,
        contentType: file.type,
        fileName: file.name.replace(/\.[^/.]+$/, "")
      });

      const res = await toast.promise(
        promise, {
          pending: "Uploading image",
          success: "Image uploaded",
          error: "Image upload error"
        }
      )

      const data = res.data as PinataRes;
      setImageURI(`${process.env.NEXT_PUBLIC_PINATA_DOMAIN}/ipfs/${data.IpfsHash}`)

    } catch(e: any) {
      console.error(e.message);
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserData({...userData, [name]: value});
  }



  const uploadMetadata = async () => {
    try {


      const promise = axios.post("/api/verify-profile", {

        user: userData
      })

      const res = await toast.promise(
        promise, {
          pending: "Uploading metadata",
          success: "Metadata uploaded",
          error: "Metadata upload error"
        }
      )

      const data = res.data as PinataRes;
      setUserURI(`${process.env.NEXT_PUBLIC_PINATA_DOMAIN}/ipfs/${data.IpfsHash}`);

        await usercontract.createProfile(`${process.env.NEXT_PUBLIC_PINATA_DOMAIN}/ipfs/${data.IpfsHash}`, imageURI, addressWallet);


    } catch (e: any) {
      console.error(e.message);
    }
  }


const getUserData= async ()=>{
  await usercontract.getUserProfileData(addressWallet).then((data: any)=>{
    console.log(data)
  })

}

  if (!network.isConnectedToNetwork) {
    return (
      <BaseLayout>
        <div className="rounded-md bg-yellow-50 p-4 mt-10">
          <div className="flex">

            <div className="flex-shrink-0">
              <ExclamationIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Attention needed</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                { network.isLoading ?
                  "Loading..." :
                  `Connect to ${network.targetNetwork}`
                }
                </p>
              </div>
            </div>
          </div>
        </div>
      </BaseLayout>
    )
  }

  return (
    <BaseLayout>
      <div>

        <div className="md:grid md:grid-cols-3 md:gap-6">
          <button onClick={getUserData} type="button">Click</button>
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Set up your profile</h3>
            </div>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2 " style={{maxWidth: "500px"}}>
            <form>
              <div className="shadow sm:rounded-md sm:overflow-hidden">
                <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                  { imageURI ?
                      <img src={imageURI} alt="" className="h-40" /> :
                      <div style={{maxWidth: "200px"}}>
                        <label className="block text-sm font-medium text-gray-700">Image Profile</label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                          <div className="space-y-1 text-center">
                            <svg
                                className="mx-auto h-12 w-12 text-gray-400"
                                stroke="currentColor"
                                fill="none"
                                viewBox="0 0 48 48"
                                aria-hidden="true"
                            >
                              <path
                                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                  strokeWidth={2}
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                              />
                            </svg>
                            <div className="flex text-sm text-gray-600">
                              <label
                                  htmlFor="file-upload"
                                  className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                              >
                                <span>Upload a file</span>
                                <input
                                    onChange={handleImage}
                                    id="file-upload"
                                    name="file-upload"
                                    type="file"
                                    className="sr-only"
                                />
                              </label>
                              <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                          </div>
                        </div>
                      </div>
                  }
                  <div>
                    <label htmlFor="userName" className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <input
                        value={userData.userName}
                        onChange={handleChange}
                        type="text"
                        name="userName"
                        id="userName"
                        className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                        placeholder="Name"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="userLastName" className="block text-sm font-medium text-gray-700">
                      Last Name
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <input
                          value={userData.userLastName}
                          onChange={handleChange}
                          type="text"
                          name="userLastName"
                          id="userLastName"
                          className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                          placeholder="Last Name"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <input
                          value={userData.email}
                          onChange={handleChange}
                          type="email"
                          name="email"
                          id="email"
                          className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                          placeholder="example@gmail.com"
                      />
                    </div>
                  </div>

                </div>
                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                  <button
                    onClick={uploadMetadata}
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

export default NftCreate
