
import { CryptoHookFactory } from "@_types/hooks";
import { Collection } from "@_types/nft";
import useSWR from "swr";

type UseListedCollectionsResponse = {}
type ListedCollectionsHookFactory = CryptoHookFactory<Collection[], UseListedCollectionsResponse>

export type UseListedCollectionsHook = ReturnType<ListedCollectionsHookFactory>

export const hookFactory: ListedCollectionsHookFactory = ({ factory}) => () => {
  const {data, ...swr} = useSWR(
    factory ? "web3/useListedCollections" : null,
    async () => {
      const allCollections = [] as Collection[];
      const coreCollections = await factory!.getAllCollections();

      for (let i = 0; i < coreCollections.length; i++) {
        const collection = coreCollections[i];

        allCollections.push({
          token: collection.token,
            collectionId: parseInt(collection.collectionId._hex, 16),
            creator: collection.creator,
            symbol: collection.symbol,
            name: collection.name,
            isPublished: collection.isPublished


        })
      }

      return allCollections;
    }
  )



  return {
    ...swr,
    data: data || [],
  };
}
