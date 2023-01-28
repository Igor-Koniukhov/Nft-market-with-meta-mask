
import { setupHooks, Web3Hooks } from "@hooks/web3/setupHooks";
import { MetaMaskInpageProvider } from "@metamask/providers";
import { Web3Dependencies } from "@_types/hooks";
import { Contract, ethers, providers } from "ethers";
import userDbAbi from '../../../userDB/abi/contracts/UserDb.json';

declare global {
  interface Window {
    ethereum: MetaMaskInpageProvider;
  }
}

type Nullable<T> = {
  [P in keyof T]: T[P] | null;
}

export type Web3State = {
  isLoading: boolean; // true while loading web3State
  hooks: Web3Hooks;
} & Nullable<Web3Dependencies>


export const createDefaultState = () => {
  return {
    ethereum: null,
    provider: null,
    contract: null,
    profileContract: null,
    isLoading: true,
    hooks: setupHooks({isLoading: true} as any)
  }
}

export const createWeb3State = ({
  ethereum, provider, contract, profileContract, isLoading
}: Web3Dependencies) => {
  return {
    ethereum,
    provider,
    contract,
    profileContract,
    isLoading,
    hooks: setupHooks({ethereum, provider, contract, profileContract, isLoading})
  }
}

const NETWORK_ID = process.env.NEXT_PUBLIC_NETWORK_ID;

export const loadContract = async (
  name: string,  // NftMarket
  provider: providers.Web3Provider
): Promise<Contract> => {
  if (!NETWORK_ID) {
    return Promise.reject("Network ID is not defined!");
  }

  const res = await fetch(`/contracts/${name}.json`);
  const Artifact = await res.json();

  if (Artifact.networks[NETWORK_ID].address) {
    const contract = new ethers.Contract(
      Artifact.networks[NETWORK_ID].address,
      Artifact.abi,
      provider
    )

    return contract;
  } else {
    return Promise.reject(`Contract: [${name}] cannot be loaded!`);
  }
}

export const loadDBContract = async (
    name: string,  // NftMarket
    provider: providers.Web3Provider
): Promise<Contract> => {
  if (!NETWORK_ID) {
    return Promise.reject("Network ID is not defined!");
  }


  const Artifact = userDbAbi as any

  if (Artifact.networks[NETWORK_ID].address) {
    const contract = new ethers.Contract(
        Artifact.networks[NETWORK_ID].address,
        Artifact.abi,
        provider
    )

    return contract;
  } else {
    return Promise.reject(`Contract: [${name}] cannot be loaded!`);
  }
}
