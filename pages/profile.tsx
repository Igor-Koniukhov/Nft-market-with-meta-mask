/* eslint-disable @next/next/no-img-element */

import type {NextPage} from 'next'
import {BaseLayout} from '@ui'

import {Nft, NftMeta, PinataRes} from '@_types/nft';
import {useAccount, useOwnedNfts} from '@hooks/web3';
import {useEffect, useState} from 'react';
import {useWeb3} from "@providers/web3";
import {useEthPrice} from "@hooks/useEthPrice";
import axios from "axios";
import {toast} from "react-toastify";
import {ethers} from "ethers";

const tabs = [
    {name: 'Your Collection', href: '#', current: true},
]

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

const Profile: NextPage = () => {
    const {nfts} = useOwnedNfts()
    const {account} = useAccount()
    const {eth} = useEthPrice()
    const {contract, provider, ethereum} = useWeb3()
    const [activeNft, setActiveNft] = useState<Nft>();
    const [royalty, setRoyalty] = useState<number | undefined>(activeNft?.tokenId)
    const [royaltyAmount, setRoyaltyAmount] = useState("")
    const [recipient, setRecipient] = useState<string | undefined>('')
    const [collectionName, setCollectionName] = useState("")
    const [collectionSymbol, setCollectionSymbol] = useState("")
    const [isVisible, setIsVisible] = useState(false)
    const [isPriceInput, setIsVisiblePriceInput] = useState(false)
    const [newPrice, setNewPrice] = useState("");


    const [nftMeta, setNftMeta] = useState<NftMeta>({
        name: "",
        description: "",
        image: "",
        attributes: [
            {trait_type: "fury", value: "0"},
            {trait_type: "scary", value: "0"}
        ]
    });
    const getSignedData = async () => {
        const messageToSign = await axios.get("/api/verify");
        const accounts = await ethereum?.request({method: "eth_requestAccounts"}) as string[];
        const account = accounts[0];

        const signedData = await ethereum?.request({
            method: "personal_sign",
            params: [JSON.stringify(messageToSign.data), account, messageToSign.data.id]
        })

        return {signedData, account};
    }
    const uploadMetadata = async () => {
        try {
            const {signedData, account} = await getSignedData();

            const promise = axios.put("/api/verify", {
                address: account,
                signature: signedData,
                nft: nftMeta
            })

            const res = await toast.promise(
                promise, {
                    pending: "Uploading metadata",
                    success: "Metadata uploaded",
                    error: "Metadata upload error"
                }
            )

            const data = res.data as PinataRes;

        } catch (e: any) {
            console.error(e.message);
        }
    }

    const royaltyInfo = async () => {
        if (activeNft !== undefined) {
            await account.getRoyaltyInfo(
                activeNft?.tokenId as number,
                ethers.utils.parseEther(`${activeNft?.price}`))
                .then(data => {
                        setRoyaltyAmount(`${ethers.utils.formatEther(data[1]._hex)}`)
                    }
                )
        }

    }
    const handleRoyaltyInfo = async () => {
        await account.getRoyaltyPerTokenId(activeNft?.tokenId as number).then(data => {
                setRoyalty(parseInt(data[1]._hex, 16))
                setRecipient(data[0])
            }
        )
        royaltyInfo()
    }


    useEffect(() => {
        if (activeNft !== undefined) {
            handleRoyaltyInfo();
            contract?.name().then(data =>
                setCollectionName(data)
            )
            contract?.symbol().then(data =>
                setCollectionSymbol(data)
            )
        }
        console.log(collectionName)

    }, [activeNft])

    useEffect(() => {
        if (nfts.data && nfts.data.length > 0) {
            setActiveNft(nfts.data[0]);

        }

        return () => setActiveNft(undefined)
    }, [nfts.data])

    const changePriceHandler = async (tokenId: number | undefined, price: string) => {
        if (tokenId != null) {
            contract?.setNewPrice(tokenId, ethers.utils.parseEther(price)).then(tx =>
                toast.promise(
                    tx!.wait(), {
                        pending: "Changing price",
                        success: "Price has been changed",
                        error: "Price changing error"
                    }
                ).then(() => setIsVisiblePriceInput(false))
            )


        }
    }
    return (
        <BaseLayout>
            <div className="h-full flex">

                <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex-1 flex items-stretch overflow-hidden">
                        <main className="flex-1 overflow-y-auto">
                            <div className="pt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                <div className="flex">
                                    <h1 className="flex-1 text-2xl font-bold text-gray-900">Your NFTs</h1>
                                </div>
                                <div className="mt-3 sm:mt-2">
                                    <div className="hidden sm:block">
                                        <div className="flex items-center border-b border-gray-200">
                                            <nav className="flex-1 -mb-px flex space-x-6 xl:space-x-8"
                                                 aria-label="Tabs">
                                                {tabs.map((tab) => (
                                                    <a
                                                        key={tab.name}
                                                        href={tab.href}
                                                        aria-current={tab.current ? 'page' : undefined}
                                                        className={classNames(
                                                            tab.current
                                                                ? 'border-indigo-500 text-indigo-600'
                                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                                                            'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
                                                        )}
                                                    >
                                                        {tab.name}
                                                    </a>
                                                ))}
                                            </nav>
                                        </div>
                                    </div>
                                </div>

                                <section className="mt-8 pb-16" aria-labelledby="gallery-heading">
                                    <button
                                        onClick={() => {
                                            account.withdraw()
                                        }}
                                        type="button"
                                        className="disabled:text-gray-400
                    disabled:cursor-not-allowed
                    flex-1 ml-3 bg-white
                    py-2 px-4 border
                    border-gray-300
                    rounded-md
                    shadow-sm
                    text-sm font-medium
                    text-gray-700
                    hover:bg-gray-50
                    focus:outline-none
                    focus:ring-2
                    focus:ring-offset-2
                    focus:ring-indigo-500"
                                    >
                                        Withdraw
                                    </button>

                                    <ul
                                        role="list"
                                        className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8"
                                    >
                                        {(nfts.data as Nft[]).map((nft) => (
                                            <li
                                                key={nft.tokenId}
                                                onClick={() => setActiveNft(nft)}
                                                className="relative">
                                                <div
                                                    className={classNames(
                                                        nft.tokenId === activeNft?.tokenId
                                                            ? 'ring-2 ring-offset-2 ring-indigo-500'
                                                            : 'focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-indigo-500',
                                                        'group block w-full aspect-w-10 aspect-h-7 rounded-lg bg-gray-100 overflow-hidden'
                                                    )}
                                                >
                                                    <img
                                                        src={nft.meta.image}
                                                        alt=""
                                                        className={classNames(
                                                            nft.tokenId === activeNft?.tokenId ? '' : 'group-hover:opacity-75',
                                                            'object-cover pointer-events-none'
                                                        )}
                                                    />
                                                    <button type="button"
                                                            className="absolute inset-0 focus:outline-none">
                                                        <span
                                                            className="sr-only">View details for {nft.meta.name}</span>
                                                    </button>
                                                </div>
                                                <p className="mt-2 block text-sm font-medium text-gray-900 truncate pointer-events-none">
                                                    {nft.meta.name}
                                                </p>
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                            </div>
                        </main>

                        {/* Details sidebar */}
                        <aside className="hidden w-96 bg-white p-8 border-l border-gray-200 overflow-y-auto lg:block">
                            {activeNft &&
                                <div className="pb-16 space-y-6">
                                    <div>
                                        <div className="py-3 flex justify-between text-sm font-medium">
                                            <dt className="text-gray-500">Collection :</dt>
                                            <dd className="text-gray-900 text-right">{collectionName}</dd>
                                        </div>
                                        <div className="py-3 flex justify-between text-sm font-medium">
                                            <dt className="text-gray-500">Symbol:</dt>
                                            <dd className="text-gray-900 text-right">{collectionSymbol}</dd>
                                        </div>
                                        <div className="block w-full aspect-w-10 aspect-h-7 rounded-lg overflow-hidden">
                                            <img src={activeNft.meta.image} alt="" className="object-cover"/>
                                        </div>
                                        <div className="mt-4 flex items-start justify-between">
                                            <div>
                                                <h2 className="text-lg font-medium text-gray-900">
                                                    <span className="sr-only">Details for </span>
                                                    {activeNft.meta.name}
                                                </h2>
                                                <p className="text-sm font-medium text-gray-500">{activeNft.meta.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-900">Information</h3>
                                        <dl className="mt-2 border-t border-b border-gray-200 divide-y divide-gray-200">
                                            {activeNft.meta.attributes.map((attr) => (
                                                <div key={attr.trait_type}
                                                     className="py-3 flex justify-between text-sm font-medium">
                                                    <dt className="text-gray-500">{attr.trait_type}:</dt>
                                                    <dd className="text-gray-900 text-right">{attr.value}</dd>
                                                </div>
                                            ))}

                                            <div className="py-3 flex justify-between text-sm font-medium">
                                                <dt className="text-gray-500">
                                                    <button
                                                        type="button"
                                                        className="bg-orange-500 m-1  pl-1 pr-1 border-transparent
                                            rounded-md shadow-sm"
                                                        onClick={() => setIsVisiblePriceInput(!isPriceInput)}>Change
                                                    </button>
                                                    Price ETH:
                                                </dt>
                                                <dd className="text-gray-900 text-right flex justify-center items-center">{activeNft.price}

                                                    <img className="h-6" src="/images/small-eth.webp" alt="ether icon"/>
                                                </dd>
                                            </div>
                                            <div className="py-3 flex justify-between text-sm font-medium">
                                                <dt className="text-gray-500"> Price USA:</dt>
                                                <dd className="text-gray-900 text-right">{(activeNft.price * eth.data).toFixed(2)} $</dd>
                                            </div>
                                            <div className="py-3 flex justify-between text-sm font-medium">
                                                <dt className="text-gray-500">Token ID:</dt>
                                                <dd className="text-gray-900 text-right">{activeNft.tokenId}</dd>
                                            </div>
                                            <div className="py-3 flex justify-between text-sm font-medium">
                                                <dt className="text-gray-500">Royalty(%):</dt>
                                                <dd className="text-gray-900 text-right">{`${royalty as number}`} %</dd>
                                            </div>
                                            <div className="py-3 flex justify-between text-sm font-medium">
                                                <dt className="text-gray-500">Royalty value:</dt>
                                                <dd className="text-gray-900 text-right">{`${royaltyAmount}`} ETH</dd>
                                            </div>
                                            <div className="py-3 flex justify-between text-sm font-medium">
                                                <dt className="text-gray-500">Recipient:</dt>
                                                <dd className="text-gray-900 text-right">{recipient}</dd>
                                            </div>


                                        </dl>
                                    </div>

                                    <div className="flex">
                                        <button
                                            type="button"
                                            onClick={() => setIsVisible(!isVisible)}
                                            className="
                                            flex-1
                                            bg-orange-500
                                            py-2 px-4 border
                                            border-transparent
                                            rounded-md shadow-sm
                                            text-sm font-medium
                                            text-white hover:bg-orange-700
                                            focus:outline-none
                                            focus:ring-2
                                            focus:ring-offset-2
                                            focus:ring-orange-500"
                                        >
                                            Change Data
                                        </button>
                                        {!activeNft.isListed ?
                                            <button
                                                onClick={() => {
                                                    nfts.listNft(
                                                        activeNft.tokenId,
                                                        activeNft.price
                                                    )
                                                }}
                                                type="button"
                                                className="disabled:text-gray-400
                    disabled:cursor-not-allowed
                    flex-1 ml-3 bg-white
                    py-2 px-4 border
                    border-gray-300
                    rounded-md
                    shadow-sm
                    text-sm font-medium
                    text-gray-700
                    hover:bg-gray-50
                    focus:outline-none
                    focus:ring-2
                    focus:ring-offset-2
                    focus:ring-indigo-500"
                                            >
                                                Set on Market
                                            </button> :
                                            <button
                                                onClick={() => {
                                                    nfts.removeNftFromMarket(
                                                        activeNft.tokenId
                                                    )
                                                }}
                                                type="button"
                                                className="disabled:text-gray-400
                    disabled:cursor-not-allowed
                    flex-1 ml-3 bg-white
                    py-2 px-4 border
                    border-gray-300
                    rounded-md
                    shadow-sm
                    text-sm font-medium
                    text-gray-700
                    hover:bg-gray-50
                    focus:outline-none
                    focus:ring-2
                    focus:ring-offset-2
                    focus:ring-indigo-500"
                                            >
                                                Remove from market
                                            </button>
                                        }

                                    </div>
                                </div>
                            }
                        </aside>
                    </div>
                </div>
            </div>

            <div
                className="
           fixed
            top-0
            bottom-0
            left-0
            right-0
            bg-gray-100
            w-auto
            h-auto
            z-10
            pt-36
            "
                style={{display: `${isVisible ? "block" : "none"}`, marginTop: "unset"}}>
                <form className="block m-auto  top-0 bottom-0 right-0 left-0 max-w-3xl">
                    <div className="shadow sm:rounded-md sm:overflow-hidden">
                        <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Name
                                </label>
                                <div className="mt-1 flex rounded-md shadow-sm">
                                    <input
                                        value={activeNft?.meta.name}
                                        onChange={(e) => {
                                            console.log(e.target.value)
                                        }}
                                        type="text"
                                        name="name"
                                        id="name"
                                        className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                                        placeholder="My Nice NFT"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                                    Price ETH
                                </label>
                                <div className="mt-1 flex rounded-md shadow-sm">
                                    <input
                                        value={activeNft?.price}
                                        onChange={(e) => {
                                            console.log(e.target.value)
                                        }}
                                        type="text"
                                        name="price"
                                        id="price"
                                        className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                                        placeholder="price"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                    Description
                                </label>
                                <div className="mt-1">
                      <textarea
                          value={activeNft?.meta.description}
                          onChange={(e) => {
                              console.log(e.target.value)
                          }}
                          id="description"
                          name="description"
                          rows={3}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                          placeholder="Some nft description..."
                      />
                                </div>
                                <p className="mt-2 text-sm text-gray-500">
                                    Brief description of NFT
                                </p>
                            </div>

                            <div className="grid grid-cols-6 gap-6">
                                {activeNft?.meta.attributes.map(attribute =>
                                    <div key={attribute.trait_type} className="col-span-6 sm:col-span-6 lg:col-span-2">
                                        <label htmlFor={attribute.trait_type}
                                               className="block text-sm font-medium text-gray-700">
                                            {attribute.trait_type}
                                        </label>
                                        <input
                                            onChange={(e) => {
                                                console.log(e.target.value)
                                            }}
                                            value={attribute.value}
                                            type="text"
                                            name={attribute.trait_type}
                                            id={attribute.trait_type}
                                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                        />
                                    </div>
                                )}
                            </div>
                            <p className="text-sm !mt-2 text-gray-500">
                                Choose value from 0 to 100
                            </p>
                        </div>
                        <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 flex">
                            <button
                                onClick={uploadMetadata}
                                type="button"
                                className="inline-flex
                                justify-center
                                py-2 px-4
                                border
                                border-transparent
                                shadow-sm
                                text-sm
                                font-medium
                                rounded-md
                                text-white
                                bg-orange-400
                                hover:bg-orange-700
                                focus:outline-none
                                focus:ring-2
                                focus:ring-offset-2
                                focus:ring-orange-500
                                m-1"

                            >
                                Put Data
                            </button>
                            <button
                                onClick={() => setIsVisible(false)}
                                type="button"
                                className="
                                inline-flex
                                justify-center
                                py-2 px-4 border
                                border-transparent
                                shadow-sm text-sm
                                font-medium
                                rounded-md
                                text-white
                                bg-red-400
                                hover:bg-red-600
                                focus:outline-none
                                focus:ring-2
                                focus:ring-offset-2
                                focus:ring-red-500
                                m-1
                                "
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            <div
                className="
           fixed
            top-0
            bottom-0
            left-0
            right-0
            bg-gray-100
            w-auto
            h-auto
            z-10
            pt-36
            "
                style={{display: `${isPriceInput ? "block" : "none"}`, marginTop: "unset"}}>
                <form className="block m-auto  top-0 bottom-0 right-0 left-0 max-w-3xl">
                    <div className="shadow sm:rounded-md sm:overflow-hidden">
                        <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                            <div>
                                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                                    Price ETH
                                </label>
                                <div className="mt-1 flex rounded-md shadow-sm">
                                    <input
                                        onChange={(e) => setNewPrice(e.target.value)}
                                        value={newPrice}
                                        type="text"
                                        name="price"
                                        id="price"
                                        className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                                        placeholder="price"
                                    />
                                </div>
                            </div>

                        </div>
                        <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 flex">
                            <button
                                onClick={() => changePriceHandler(activeNft?.tokenId, newPrice)}
                                type="button"
                                className="inline-flex
                                justify-center
                                py-2 px-4
                                border
                                border-transparent
                                shadow-sm
                                text-sm
                                font-medium
                                rounded-md
                                text-white
                                bg-orange-400
                                hover:bg-orange-700
                                focus:outline-none
                                focus:ring-2
                                focus:ring-offset-2
                                focus:ring-orange-500
                                m-1"

                            >
                                Put Data
                            </button>
                            <button
                                onClick={() => setIsVisiblePriceInput(false)}
                                type="button"
                                className="
                                inline-flex
                                justify-center
                                py-2 px-4 border
                                border-transparent
                                shadow-sm text-sm
                                font-medium
                                rounded-md
                                text-white
                                bg-red-400
                                hover:bg-red-600
                                focus:outline-none
                                focus:ring-2
                                focus:ring-offset-2
                                focus:ring-red-500
                                m-1
                                "
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </BaseLayout>
    )
}

export default Profile
