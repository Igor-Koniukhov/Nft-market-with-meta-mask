import {BaseLayout, NftList} from "@ui";
import {NextPage} from "next";
import {useRouter} from "next/router";
import {useDispatch} from "react-redux";
import {setAddress} from "../../../store/slices/collectionSlice";
import {Collection} from "@_types/nft";
import {useEffect, useState} from "react";
import {useListedCollections} from "@hooks/web3";


const NftListedCollection: NextPage = () => {
    const {collections} = useListedCollections()
    const dispatch = useDispatch()
    const router = useRouter()
    let {pid} = router.query
    const [collectionState, setCollectionState] = useState<Collection>({
        description: "",
        image: "",
        collectionId: 0,
        token: "",
        name: "",
        symbol: "",
        creator: "",
        isPublished: false

    })


    dispatch(setAddress(pid))
    if (pid) {
        localStorage.setItem('collection', pid as string)
    }

    const getCurrentCollectionData = (data: Collection[] | undefined) => {
        let collection = data!.filter((c: { token: string }) => c.token === pid)
        setCollectionState(collection[0])

    }
    const {data} = collections

    useEffect(() => {
        if (data != undefined && data.length > 0)
            getCurrentCollectionData(data)
    }, [data]);


    return (
        <BaseLayout>
            <h3
                className="
                font-bold
                text-3xl
                text-center
                mb-4

                ">
                Listed collection name: {collectionState.symbol}</h3>
            <div className="md:col-span-1 pb-3">
                <div className="px-4 sm:px-0">
                    <p>
                        <span className="font-bold">Token Symbol:</span>
                        <span className="pl-1"> {collectionState.symbol}</span>
                    </p>
                    <p>
                        <span className="font-bold">Collection ID: </span>
                        <span className="pl-2"> {collectionState.collectionId}</span>
                    </p>
                    <p><span className="font-bold">Description:</span><br/>
                        <span className="mt-1 text-sm text-gray-600">{collectionState.description}</span>
                    </p>
                    <p>
                        <span className="font-bold">Creator:</span><br/>
                        <span> {collectionState.creator}</span>
                    </p>

                    <p>
                        <span className="font-bold"> Contract:</span><br/>
                        <span>{collectionState.token}</span>
                    </p>
                </div>
            </div>
            <NftList/>
        </BaseLayout>
    )
}


export default NftListedCollection;
