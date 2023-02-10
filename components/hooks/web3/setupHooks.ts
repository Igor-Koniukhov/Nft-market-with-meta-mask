import {Web3Dependencies} from "@_types/hooks";
import {hookFactory as createAccountHook, UseAccountHook} from "./useAccount";
import {hookFactory as createNetworkHook, UseNetworkHook} from "./useNetwork";
import {hookFactory as createListedNftsHook, UseListedNftsHook} from "./useListedNfts";
import {hookFactory as createOwnedNftsHook, UseOwnedNftsHook} from "./useOwnedNfts";
import {hookFactory as createProfileDataHook, UseProfileDataHook} from "./useProfileData";
import {hookFactory as createListedCollectionsHook, UseListedCollectionsHook} from "./useListedCollections";
import {hookFactory as createOwnedCollectionsHook, UseOwnedCollectionsHook} from "./useOwnedCollections";

export type Web3Hooks = {
    useAccount: UseAccountHook;
    useNetwork: UseNetworkHook;
    useListedNfts: UseListedNftsHook;
    useListedCollections: UseListedCollectionsHook;
    useOwnedCollections: UseOwnedCollectionsHook;
    useOwnedNfts: UseOwnedNftsHook;
    useProfile: UseProfileDataHook;
}

export type SetupHooks = {
    (d: Web3Dependencies): Web3Hooks
}

export const setupHooks: SetupHooks = (deps) => {
    return {
        useAccount: createAccountHook(deps),
        useNetwork: createNetworkHook(deps),
        useListedNfts: createListedNftsHook(deps),
        useListedCollections: createListedCollectionsHook(deps),
        useOwnedCollections: createOwnedCollectionsHook(deps),
        useOwnedNfts: createOwnedNftsHook(deps),
        useProfile: createProfileDataHook(deps),
    }
}
