
import { FunctionComponent } from "react";
import {Collection} from "@_types/nft";
import Link from "next/link"
import {useDispatch} from "react-redux";
import {setAddress} from "../../../../store/slices/collectionSlice";

type CollectionResponse ={
    path: string,
    collections: Collection[]
}
const List:FunctionComponent<CollectionResponse> = ({collections, path}) =>{
    const dispatch = useDispatch()

    const handleNftCollection = (address: string)=>{
        dispatch(setAddress(address))

    }
    return (
        <section className="grid md:grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
        { collections!.map(collection =>
                <div
                    key={collection.collectionId}
                    className="bg-white rounded-xl shadow-md  flex">
                    <div>
                        <img
                            style={{maxWidth: "200px"}}
                            className="object-cover"
                            src={collection.image}
                            width='300'
                            height='250'
                            alt={collection.name}
                        />
                    </div>

                        <div className="p-2">
                            <div
                                className="uppercase  text-sm text-indigo-500 font-semibold">
                                {collection.name}
                            </div>
                            <Link href={`/collections/${path}/${collection.token}`}>
                                <a
                                    className=" mt-1 text-lg leading-tight font-medium text-black hover:underline">
                                    {collection.name}
                                </a>
                            </Link>
                            <button type="button" onClick={()=>handleNftCollection(collection.token)}>{collection.name}</button>
                            <p style={{overflowWrap: "break-word", hyphens: "auto"}}
                                className="mt-2 text-gray-500 flex text-justify">
                               Description: {collection.description}
                            </p>
                        </div>

                </div>
            )}
        </section>
    )
}

export default List;
