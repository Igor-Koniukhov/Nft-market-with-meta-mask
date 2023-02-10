/* eslint-disable @next/next/no-img-element */

import type {NextPage} from 'next';
import {BaseLayout, CollectionsList, NftList, Search} from '@ui';
import {useListedCollections, useNetwork} from '@hooks/web3';
import {ExclamationIcon} from '@heroicons/react/solid';
import Pricefilter from "@ui/filter/priceFilter/priceFilter";
import {useState} from "react";
import {getTokenByPriceRange} from "../queries/queries";

import {Collection} from "@_types/nft";



const Home: NextPage = () => {
    const {network} = useNetwork();
   const {collections}=useListedCollections();



    const [priceFrom, setPriceFrom] = useState('25000000000000000');
    const [priceTo, setPriceTo] = useState('1000000000000000000');

    const handleInputFrom = (e: any) => {
        let value = (Number(e.target.value) * 1000000000000000).toFixed(0)
        setPriceFrom(value);

    }
    const handleInputTo = (e: any) => {
        let value = (Number(e.target.value) * 1000000000000000).toFixed(0)
        setPriceTo(value);
    }


    return (
        <BaseLayout>

            <Search/>
            <div className="flex">
            <div>
                <Pricefilter
                    label="From"
                    handleInput={handleInputFrom}
                    price={priceFrom}
                    min="250"
                    max="10000"
                    step="1"
                    id="param1"
                    name="param1"

                />
                <Pricefilter
                    label="From"
                    handleInput={handleInputTo}
                    price={priceTo}
                    min="250"
                    max="10000"
                    step="1"
                    id="param2"
                    name="param2"
                />

            </div>
                <button
                    type="button"
                    className="disabled:bg-slate-50
                    h-fit
                    disabled:text-slate-500
                    disabled:border-slate-200
                    disabled:shadow-none
                    disabled:cursor-not-allowed
                    inline-flex
                    items-center
                    px-4 py-2 border
                    border-gray-300
                    shadow-sm text-base
                    font-medium
                    rounded-md
                    text-gray-700
                    bg-white
                    hover:bg-gray-50
                    focus:outline-none
                    focus:ring-2
                    focus:ring-offset-2
                    focus:ring-indigo-500"
                    onClick={()=>getTokenByPriceRange(priceFrom, priceTo)}
                >Get NFT by range</button>
            </div>
            <CollectionsList
                path={collections.path}
                collections={collections.data as Collection[]}
            />

            <div className="relative bg-white  pt-16 pb-20 px-4 sm:px-6 lg:pt-24 lg:pb-28 lg:px-8">

                <div className="relative big-white">
                    <div className="text-center">
                        <h2 className="text-3xl tracking-tight font-extrabold text-gray-900 sm:text-4xl">Pumpkins
                            NFTs</h2>
                        <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
                            Nfts on sale

                        </p>
                    </div>
                    {network.isConnectedToNetwork ?
                        <NftList/> :
                        <div className="rounded-md bg-yellow-50 p-4 mt-10">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <ExclamationIcon className="h-5 w-5 text-yellow-400" aria-hidden="true"/>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-yellow-800">Attention needed</h3>
                                    <div className="mt-2 text-sm text-yellow-700">
                                        <p>
                                            {network.isLoading ?
                                                "Loading..." :
                                                `Connect to ${network.targetNetwork}`
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </BaseLayout>
    )
}

export default Home
