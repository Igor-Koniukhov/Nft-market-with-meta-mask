
import { FunctionComponent } from "react";
import {Collection} from "@_types/nft";
import Image from "next/image"
import Link from "next/link"
import {useListedCollections} from "@hooks/web3";
import {useDispatch} from "react-redux";
import {setAddress} from "../../../../store/slices/collectionSlice";

type CollectionResponse ={
    collections: Collection[]
}
const List:FunctionComponent<CollectionResponse> = ({collections}) =>{

    const dispatch = useDispatch()

    const handleNftCollection = (address: string)=>{
        dispatch(setAddress(address))
        console.log(address)

    }
    return (
        <section className="grid md:grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
        { collections!.map(collection =>
                <div
                    key={collection.collectionId}
                    className="bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
                    <div className="flex h-full">
                        <div className="flex h-full">
                            <Image
                                className="object-cover"
                                src="/images/pumpkin.png"
                                layout="fixed"
                                width="200"
                                height="230"
                                alt={collection.name}
                            />
                        </div>
                        <div className="p-8">
                            <div
                                className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
                                {collection.name}
                            </div>
                            <Link href={`/collections/${collection.token}`}>
                                <a
                                    className="block mt-1 text-lg leading-tight font-medium text-black hover:underline">
                                    {collection.name}
                                </a>
                            </Link>
                            <button type="button" onClick={()=>handleNftCollection(collection.token)}>{collection.name}</button>
                            <p
                                className="mt-2 text-gray-500">
                                description
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </section>
    )
}

export default List;
