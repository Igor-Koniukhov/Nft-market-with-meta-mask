import {ChangeEvent, FunctionComponent, useEffect, useState} from "react";
import axios from "axios";
import {toast} from "react-toastify";
import {CollectionMeta, PinataRes} from "@_types/nft";
import {BigNumberish} from "ethers";
import {useWeb3} from "@providers/web3";


const CollectionCreate: FunctionComponent = () => {
    const {ethereum, factory} = useWeb3();
    const [collectionURI, setCollectionURI] = useState("");

    const [collectionMeta, setCollectionMeta] = useState<CollectionMeta>({
        cName: "",
        cSymbol: "",
        cDescription: "",
        image: "",

    });

    const uploadMetaAndCollectionCreate = async () => {
        try {
            const {signedData, account} = await getSignedData();

            const promise = axios.post("/api/verify-collection", {
                address: account,
                signature: signedData,
                collectionMeta: collectionMeta
            })

            const res = await toast.promise(
                promise, {
                    pending: "Uploading metadata",
                    success: "Metadata uploaded",
                    error: "Metadata upload error"
                }
            )

            const data = res.data as PinataRes;
            setCollectionURI(`${process.env.NEXT_PUBLIC_PINATA_DOMAIN}/ipfs/${data.IpfsHash}`);
        } catch (e: any) {
            console.error(e.message);
        }
    }
    const collectionHandler = async () => {
        if (collectionURI) {
            const promise = factory!.createCollection(
                collectionMeta.cName,
                collectionMeta.cSymbol,
                collectionURI
            )

            await factory!.on('collectionCreated', (
                Collection: string,
                Name: string,
                Symbol: string,
                collectionId: BigNumberish,
            ) => {
                let data = {
                    Collection,
                    Name,
                    Symbol,
                    collectionId
                }


                console.log(data)

            })
            await toast.promise(
                promise, {
                    pending: "Creating collection",
                    success: "Collection created",
                    error: "Image upload error"
                }
            )
            setCollectionMeta(
                {
                    cName: "",
                    cSymbol: "",
                    cDescription: "",
                    image: ""
                }
            )

        } else {
            console.log(" collection URI: ", collectionURI)
        }

    }

    useEffect(() => {
        collectionHandler().catch((e) => {
            console.error(e, " Collection error creation.")
        })
    }, [collectionURI])

    const handleCollectionInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setCollectionMeta({...collectionMeta, [name]: value});
    }
    const handleImage = async (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) {
            console.error("Select a file");
            return;
        }

        const file = e.target.files[0];
        const buffer = await file.arrayBuffer();
        const bytes = new Uint8Array(buffer);

        try {
            const {signedData, account} = await getSignedData();
            const promise = axios.post("/api/verify-image", {
                address: account,
                signature: signedData,
                bytes,
                contentType: file.type,
                fileName: file.name.replace(/\.[^/.]+$/, "")
            });

            const res = await toast.promise(
                promise, {
                    pending: "Uploading collection image",
                    success: "Image uploaded",
                    error: "Image upload error"
                }
            )

            const data = res.data as PinataRes;

            setCollectionMeta({
                ...collectionMeta,
                image: `${process.env.NEXT_PUBLIC_PINATA_DOMAIN}/ipfs/${data.IpfsHash}`
            });
        } catch (e: any) {
            console.error(e.message);
        }
    }
    const getSignedData = async () => {
        const accounts = await ethereum?.request({method: "eth_requestAccounts"}) as string[];
        const account = accounts[0];
        const messageToSign = await axios.get("/api/verify-collection", {params: {address: account as string}});


        const signedData = await ethereum?.request({
            method: "personal_sign",
            params: [JSON.stringify(messageToSign.data), account, messageToSign.data.id]
        })

        return {signedData, account};
    }
    return (
        <>
            <div>

                <div className="md:grid md:grid-cols-3 md:gap-6">

                    <div className="mt-5 md:mt-0 md:col-span-2">
                        <form>
                            <div className="shadow sm:rounded-md sm:overflow-hidden">
                                <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                                    {collectionMeta.image ?
                                        <img src={collectionMeta.image} alt="" className="h-40"/> :
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Image</label>
                                            <div
                                                className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
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
                                                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to
                                                        10MB</p>
                                                </div>
                                            </div>
                                        </div>
                                    }

                                    <div>
                                        <label htmlFor="cDescription"
                                               className="block text-sm font-medium text-gray-700">
                                            Description
                                        </label>
                                        <div className="mt-1">
                      <textarea
                          value={collectionMeta.cDescription}
                          onChange={handleCollectionInputChange}
                          id="cDescription"
                          name="cDescription"
                          rows={3}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                          placeholder="Some collection description..."
                      />
                                        </div>
                                        <p className="mt-2 text-sm text-gray-500">
                                            Brief collection description
                                        </p>
                                    </div>
                                    <div>
                                        <label htmlFor="cName" className="block text-sm font-medium text-gray-700">
                                            Collection Name
                                        </label>
                                        <div className="mt-1 flex rounded-md shadow-sm">
                                            <input
                                                value={collectionMeta.cName}
                                                onChange={handleCollectionInputChange}
                                                type="text"
                                                name="cName"
                                                id="cName"
                                                className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                                                placeholder="Collection name"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="cSymbol"
                                               className="block text-sm font-medium text-gray-700">
                                            Symbol
                                        </label>
                                        <div className="mt-1 flex rounded-md shadow-sm">
                                            <input
                                                value={collectionMeta.cSymbol}
                                                onChange={handleCollectionInputChange}
                                                type="text"
                                                name="cSymbol"
                                                id="cSymbol"
                                                className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                                                placeholder="Collection name"
                                            />
                                        </div>
                                    </div>


                                </div>
                                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                                    <button
                                        onClick={uploadMetaAndCollectionCreate}
                                        type="button"
                                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Create Collection
                                    </button>
                                </div>
                            </div>
                        </form>


                    </div>
                </div>

            </div>
        </>
    )
}

export default CollectionCreate;
