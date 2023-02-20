import {BaseLayout, CreateNFT, NftList} from "@ui";
import {NextPage} from "next";
import {useRouter} from "next/router";
import {useDispatch} from "react-redux";
import {setAddress} from "../../../store/slices/collectionSlice";
import {Collection} from "@_types/nft";
import {useEffect, useState} from "react";
import {useOwnedCollections} from "@hooks/web3";


const NftOwnedCollection: NextPage = () => {
    const {collections} =useOwnedCollections()
    const dispatch = useDispatch()
    const router = useRouter()
    let {pid} = router.query

    const initialCollection:Collection = {
        description: "",
        image: "",
        collectionId: 0,
        token: "",
        name: "",
        symbol: "",
        creator: "",
        isPublished: false

    }

    const [collectionState, setCollectionState] = useState<Collection>(initialCollection)
        dispatch(setAddress(pid))
    if (pid){
        localStorage.setItem('collection', pid as string)
    }
    const getCurrentCollectionData = (data: Collection[] | undefined) => {
            let collection = data!.filter((c: { token: string }) => c.token === pid)
            setCollectionState(collection[0])
    }
    const {data}=collections

    useEffect(() => {
        if (data != undefined && data.length > 0)
            getCurrentCollectionData(data)

    }, [data]);

    return (
        <BaseLayout>
                    <h1
                        className="
                        text-center
                        text-3xl
                        font-bold
                        font-sans
                        ">
                        {` Create your new
                        ${collectionState.symbol}`}
                    </h1>

                    <CreateNFT
                        symbol={collectionState.symbol}
                        description={collectionState.description}
                        creator={collectionState.creator}
                        collectionId={collectionState.collectionId.toString()}
                        address={collectionState.token}
                    />
            <h3
                className="
                font-bold
                text-3xl
                text-center
                mb-4
                "> Owned collection name:  {collectionState.symbol}</h3>
            <NftList/>
        </BaseLayout>
    )
}


export default NftOwnedCollection;
