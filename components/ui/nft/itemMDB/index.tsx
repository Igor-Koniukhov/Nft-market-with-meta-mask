/* eslint-disable @next/next/no-img-element */

import {FunctionComponent} from "react";
import {FullNftDataMDBResponse} from "../../../../types/nft";
import {useWeb3} from "@providers/web3";
import {BigNumberish, ethers} from "ethers";

type NftItemProps = {
    item: FullNftDataMDBResponse;
    buyNft: (token: number, value: number) => Promise<void>;
}

function shortifyAddress(address: string) {
    return `0x****${address.slice(-4)}`
}


const NftItemMDB: FunctionComponent<NftItemProps> = ({item, buyNft}) => {
    const {contract} = useWeb3();

    const nftBoughtEvent = async () => {
        await contract!.on('NftBought', (
            tokenId: BigNumberish,
            price: BigNumberish,
            royaltyAmount: BigNumberish,
            priceWithRoyalty: BigNumberish,
            previousOwner: string,
            owner: string,
            boughtAt: BigNumberish,
        ) => {
            let data = {
                tokenId,
                price,
                royaltyAmount,
                priceWithRoyalty,
                previousOwner,
                owner,
                boughtAt
            };

        })
    }
    const nftBoughtResultToMDB = async (id: string) => {
        const graphqlQuery = {
            query: `
        mutation BoughtNft($nftId: ID!, $isSold: Boolean!) {
          boughtNft(id: $nftId, nftBoughtInput: { isSold: $isSold }) {
            _id
            isSold
            owner {
             name
             address
            }
          }
        }
      `,
            variables: {
                nftId: id,
                isSold: true,
            }
        };

        fetch('http://localhost:8080/graphql', {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token'),
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
                    throw new Error('Bought is failed!');
                }

            })
            .catch(err => {
                console.log(err);

            });
    }

    const buyNfthandler = async () => {
        await buyNft(Number(item.tokenId), Number(ethers.utils.formatEther(item.price))).then((data) => {
                nftBoughtResultToMDB(item._id)
            }
        )
    }
    return (
        <>
            <div className="flex-shrink-0">
                <img
                    className={`h-full w-full object-cover`}
                    src={item!.image}
                    alt="New NFT"
                />
            </div>
            <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                <div className="flex-1">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center mt-2">
                            <div>
                                <img
                                    className="inline-block h-9 w-9 rounded-full"
                                    src="/images/default_avatar.png"
                                    alt=""
                                />
                            </div>
                            <div>
                                <p
                                    className="
                                    text-sm
                                    font-medium
                                    text-gray-700
                                    group-hover:text-gray-900
                                    ml-3"
                                > Creator: {shortifyAddress(item.creator.address)} </p>
                                <p
                                    className="
                                    text-xs
                                    font-medium
                                    text-gray-700
                                    group-hover:text-gray-700
                                    ml-3"
                                >Name: {item.creator.name}</p>
                            </div>
                        </div>

                    </div>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center mt-2">
                            <div>
                                <img
                                    className="inline-block h-9 w-9 rounded-full"
                                    src="/images/default_avatar.png"
                                    alt=""
                                />
                            </div>
                            <div>
                                <p
                                    className="
                                    text-sm
                                    font-medium
                                    text-gray-700
                                    group-hover:text-gray-900
                                    ml-3"
                                > Owner: {shortifyAddress(item.owner.address)} </p>
                                <p
                                    className="
                                    text-xs
                                    font-medium
                                    text-gray-700
                                    group-hover:text-gray-700
                                    ml-3"
                                >Name: {item.owner.name}</p>
                            </div>
                        </div>

                    </div>
                    <div className="block mt-2">
                        <p className="text-xl font-semibold text-gray-900">{item.name}</p>
                        <p className="mt-3 mb-3 text-base text-gray-500">{item.description}</p>
                    </div>
                </div>
                <div className="overflow-hidden mb-4">
                    <dl className="-mx-4 -mt-4 flex flex-wrap">
                        <div className="flex flex-col px-4 pt-4">
                            <dt className="order-2 text-sm font-medium text-gray-500">Price</dt>
                            <dd className="order-1 text-xl font-extrabold text-indigo-600">
                                <div className="flex justify-center items-center">
                                    {ethers.utils.formatEther(item.price)}
                                    <img className="h-6" src="/images/small-eth.webp" alt="ether icon"/>
                                </div>
                            </dd>
                        </div>

                        <div className="flex flex-col px-4 pt-4">
                            <dt className="order-2 text-sm font-medium text-gray-500">
                                furry
                            </dt>
                            <dd className="order-1 text-xl font-extrabold text-indigo-600">
                                {item.attributes_furry}
                            </dd>
                        </div>
                        <div className="flex flex-col px-4 pt-4">
                            <dt className="order-2 text-sm font-medium text-gray-500">
                                scary
                            </dt>
                            <dd className="order-1 text-xl font-extrabold text-indigo-600">
                                {item.attributes_scary}
                            </dd>
                        </div>

                    </dl>
                </div>
                <div>
                    <button
                        onClick={buyNfthandler}
                        type="button"
                        className="disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none disabled:cursor-not-allowed mr-2 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Buy
                    </button>
                    <button
                        type="button"
                        className="disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none disabled:cursor-not-allowed inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Preview
                    </button>
                </div>
            </div>
        </>
    )
}

export default NftItemMDB;
