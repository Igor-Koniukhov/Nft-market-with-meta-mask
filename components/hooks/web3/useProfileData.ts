import {CryptoHookFactory} from "@_types/hooks";
import {UserData, UserDataResponse} from "@_types/nft";
import useSWR from "swr";
import {useCallback} from "react";
import {toast} from "react-toastify";

type UseProfileDataResponse = {
    createProfile: (userUri: string, imageUri: string) => Promise<void>
}
type ProfileDataHookFactory = CryptoHookFactory<UserDataResponse, UseProfileDataResponse>

export type UseProfileDataHook = ReturnType<ProfileDataHookFactory>

export const hookFactory: ProfileDataHookFactory = ({profileContract, provider}) => () => {
    const {data, ...swr} = useSWR(
        profileContract ? "web3/useProfileData" : {} as UserData,
        async () => {
            const accounts = await provider!.listAccounts();
            const account = accounts[0];
            const user = {} as UserDataResponse;
            const userData = await profileContract!.getUserProfileData(account);

            const metaRes = await fetch(userData.accountCid);
            const imageProfile = userData.pictureCid;
            const meta = await metaRes.json();
            user.userName = meta.userName;
            user.userLastName = meta.userLastName;
            user.email = meta.email;
            user.image = imageProfile;
            return user;
        }
    )

    const _contract = profileContract;
    const createProfile = useCallback(async (userUri: string, imageUri: string) => {
        try {
            const accounts = await provider!.listAccounts();
            const account = accounts[0];
            const result = await _contract!.createProfile(userUri, imageUri, account)
            console.log(result.data, parseInt(result.value._hex, 16), result.hash, "result data")

            await toast.promise(
                result!.wait(), {
                    pending: "Profile data upload",
                    success: "Profile customized",
                    error: "Processing error"
                }
            );
        } catch (e: any) {
            console.error(e.message);
        }
    }, [provider])


    return {
        ...swr,
        createProfile,
        data: data || {} as UserDataResponse,
    };
}
