import {CryptoHookFactory} from "@_types/hooks";
import {Nft} from "@_types/nft";
import {ethers} from "ethers";
import {useCallback} from "react";
import {toast} from "react-toastify";
import useSWR from "swr";

type UseOwnedNftsResponse = {
    listNft: (tokenId: number, price: number) => Promise<void>
    removeNftFromMarket: (tokenId: number) => Promise<void>
}
type OwnedNftsHookFactory = CryptoHookFactory<Nft[], UseOwnedNftsResponse>

export type UseOwnedNftsHook = ReturnType<OwnedNftsHookFactory>

export const hookFactory: OwnedNftsHookFactory = ({contract}) => () => {
    const {data, ...swr} = useSWR(
        contract ? `web3/useOwnedNfts${contract.address}` : null,
        async () => {
            const nfts = [] as Nft[];
            const coreNfts = await contract!.getOwnedNfts();
            console.log(contract, " from OwnedNftHook")

            for (let i = 0; i < coreNfts.length; i++) {
                const item = coreNfts[i];
                const tokenURI = await contract!.tokenURI(item.tokenId);
                const metaRes = await fetch(tokenURI);
                const meta = await metaRes.json();

                nfts.push({
                    price: parseFloat(ethers.utils.formatEther(item.price)),
                    tokenId: item.tokenId.toNumber(),
                    creator: item.creator,
                    isListed: item.isListed,
                    meta
                })
            }

            return nfts;
        }
    )

    const _contract = contract;
    const listNft = useCallback(async (tokenId: number, price: number) => {
        console.log(tokenId, price)
        try {
            const result = await _contract!.placeNftOnSale(
                tokenId,
                ethers.utils.parseEther(price.toString()),
                {
                    value: ethers.utils.parseEther(0.025.toString())
                }
            )

            await toast.promise(
                result!.wait(), {
                    pending: "Processing transaction",
                    success: "Item has been listed",
                    error: "Processing error"
                }
            );

        } catch (e: any) {
            console.error(e.message);
        }
    }, [_contract])
    const removeNftFromMarket = useCallback(async (tokenId: number) => {
        try {
            const result = await _contract!.removeNftFromSale(tokenId)
            await toast.promise(
                result!.wait(), {
                    pending: "Processing removing from MP",
                    success: "Item has been removed from MP",
                    error: "Processing error"
                }
            );

        } catch (e: any) {
            console.error(e.message);
        }
    }, [_contract])

    return {
        ...swr,
        listNft,
        removeNftFromMarket,
        data: data || [],
    };
}
