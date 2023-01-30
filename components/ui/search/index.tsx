/* eslint-disable @next/next/no-img-element */

import {useEffect, useState} from "react";
import {getTokenByName} from "../../../queries/queries";

export default function Search() {
const [inputRequest, setRequest]=useState("")

    useEffect(()=>{
        if(inputRequest.length >1){
            try {
                getTokenByName(inputRequest)
            }catch (e){
                console.error(e, " search error.")           }

            console.log(inputRequest)
        }

    },[inputRequest])

    return (
        <div className="mt-5 md:col-span-2 md:mt-0">
            <form action="#" method="POST">


                <div className="grid grid-cols-3 gap-6">

                    <div className="col-span-3 sm:col-span-2">
                        <label htmlFor="company-website" className="block text-sm font-medium text-gray-700">
                            Search
                        </label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                        <span
                            className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500">
                          🔍
                        </span>
                            <input
                                value={inputRequest}
                                onChange={(e)=>setRequest(e.target.value)}
                                type="text"
                                name="search"
                                id="search"
                                className="block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                placeholder="enter a request"
                            />
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}
