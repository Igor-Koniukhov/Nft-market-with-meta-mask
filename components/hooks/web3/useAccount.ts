import {CryptoHookFactory} from "@_types/hooks";
import {useEffect} from "react";
import useSWR from "swr";
import {toast} from "react-toastify";
import {RoyaltyInfoResponse} from "@_types/nftMarketContract";
import {BigNumber} from "ethers";

type UseAccountResponse = {
    connect: () => void;
    isLoading: boolean;
    isInstalled: boolean;
    withdraw: () => Promise<boolean>;
    getRoyaltyPerTokenId: (tokenId: number) => Promise<RoyaltyInfoResponse>;
    setNewPrice: (tokenId: number, newPrice: string) => void;
    getRoyaltyInfo: (tokenId: number, value: BigNumber)=>Promise<RoyaltyInfoResponse>;
}

type AccountHookFactory = CryptoHookFactory<string, UseAccountResponse>

export type UseAccountHook = ReturnType<AccountHookFactory>

export const hookFactory: AccountHookFactory = ({provider, ethereum, contract, isLoading}) => () => {
    const {data, mutate, isValidating, ...swr} = useSWR(
        provider ? "web3/useAccount" : null,
        async () => {
            const accounts = await provider!.listAccounts();
            const account = accounts[0];

            if (!account) {
                throw "Cannot retreive account! Please, connect to web3 wallet."
            }

            return account;
        }, {
            revalidateOnFocus: false,
            shouldRetryOnError: false
        }
    )

    useEffect(() => {
        ethereum?.on("accountsChanged", handleAccountsChanged);
        return () => {
            ethereum?.removeListener("accountsChanged", handleAccountsChanged);
        }
    })

    const handleAccountsChanged = (...args: unknown[]) => {
        const accounts = args[0] as string[];
        if (accounts.length === 0) {
            console.error("Please, connect to Web3 wallet");
        } else if (accounts[0] !== data) {
            mutate(accounts[0]);
        }
    }

    const connect = async () => {
        try {
            ethereum?.request({method: "eth_requestAccounts"});
        } catch (e) {
            console.error(e);
        }
    }

    const withdraw = async () => {
        try {
            const result = await contract?.withdraw()
            await toast.promise(
                result!.wait(), {
                    pending: "Processing withdraw",
                    success: "funds withdraw successfully",
                    error: "Processing error"
                }
            );
        } catch (e) {
            console.error(e)
            return false
        }
        return true

    }
    const getRoyaltyPerTokenId = async (tokenId: number) => {
        return contract?.getRoyaltyPerTokenId(tokenId) as unknown as RoyaltyInfoResponse;

    }

    const getRoyaltyInfo = async (tokenId: number, value: BigNumber) => {
        return contract?.royaltyInfo(tokenId, value)as unknown as RoyaltyInfoResponse;
    }

    const setNewPrice = async (tokenId: number, newPrice: string) => {
        return contract?.setNewPrice(tokenId, newPrice)

    }


    return {
        ...swr,
        data,
        isValidating,
        isLoading: isLoading as boolean,
        isInstalled: ethereum?.isMetaMask || false,
        mutate,
        connect,
        withdraw,
        getRoyaltyPerTokenId,
        setNewPrice,
        getRoyaltyInfo

    };
}
