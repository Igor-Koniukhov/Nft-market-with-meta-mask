import {BaseLayout, NftList} from "@ui";
import {NextPage} from "next";
import {useRouter} from "next/router";
import {useDispatch} from "react-redux";
import {setAddress} from "../../store/slices/collectionSlice";
import {Collection} from "@_types/nft";
import {useEffect, useState} from "react";
import {useListedCollections} from "@hooks/web3";


const NftCollection: NextPage = () => {
    const {collections} = useListedCollections()
    const router = useRouter()
    const {pid} = router.query

    const [collectionState, setCollectionState] = useState<Collection>({
        collectionId: 0,
        token: "",
        name: "",
        symbol: "",
        creator: "",
        isPublished: false

    })

    const dispatch = useDispatch()

    dispatch(setAddress(pid))

    const getCurrentCollectionData = (data: Collection[] | undefined) => {
        let collection = data!.filter((c: { token: string }) => c.token === pid)
        setCollectionState(collection[0])
    }
    useEffect(() => {
        if (collections.data != undefined && collections.data.length > 0)
            getCurrentCollectionData(collections.data)
        localStorage.setItem('collection', pid as string)
    }, [collections.data]);


    return (
        <BaseLayout>
            <h1>Collection name: {collectionState.name}</h1>
            <p>Symbol: {collectionState.symbol}</p>
            <p>Creator: {collectionState.creator}</p>
            <p>Collection ID: {collectionState.collectionId}</p>
            <p>Address: {collectionState.token}</p>
            <NftList/>
        </BaseLayout>
    )
}


export default NftCollection;
