
import { CryptoHookFactory } from "@_types/hooks";
import { Collection } from "@_types/nft";
import useSWR from "swr";

type UseOwnedCollectionsResponse = {
    path: string;
}
type OwnedCollectionsHookFactory = CryptoHookFactory<Collection[], UseOwnedCollectionsResponse>

export type UseOwnedCollectionsHook = ReturnType<OwnedCollectionsHookFactory>

export const hookFactory: OwnedCollectionsHookFactory = ({ factory, contract}) => () => {
  const {data, ...swr} = useSWR(
    factory ? `web3/useOwnedCollections/owned/${contract!.address}` : null,
    async () => {
      const ownedCollections = [] as Collection[];
      const coreCollections = await factory!.getOwnedCollections();

      for (let i = 0; i < coreCollections.length; i++) {
        const collection = coreCollections[i];
        const resp = await fetch(collection.collectionURI)
          const collectionMeta = await resp.json()

        ownedCollections.push({
          token: collection.token,
            collectionId: parseInt(collection.collectionId._hex, 16),
            creator: collection.creator,
            symbol: collection.symbol,
            name: collection.name,
            image: collectionMeta.image,
            description: collectionMeta.cDescription,
            isPublished: collection.isPublished

        })
      }

      return ownedCollections;
    }
  )
    const path = "owned"

  return {
    ...swr,
    data: data || [],
      path: path as string
  };
}
