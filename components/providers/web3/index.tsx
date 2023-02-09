import {createContext, FunctionComponent, useContext, useEffect, useState} from "react"
import {
    createDefaultState,
    createWeb3State,
    loadContract,
    loadDBContract,
    loadFactoryContract,
    Web3State
} from "./utils";
import {ethers} from "ethers";
import {MetaMaskInpageProvider} from "@metamask/providers";
import {NftMarketContract} from "@_types/nftMarketContract";
import {ProfileContract} from "@_types/profileContract";
import {FactoryContract} from "@_types/FactoryContract";
import {useSelector} from "react-redux";
import {selectAddress, selectIndex} from "../../../store/slices/collectionSlice";

const pageReload = () => {
    window.location.reload();
}

const handleAccount = (ethereum: MetaMaskInpageProvider) => async () => {
    const isLocked = !(await ethereum._metamask.isUnlocked());
    if (isLocked) {
        pageReload();
    }
}

const setGlobalListeners = (ethereum: MetaMaskInpageProvider) => {
    ethereum.on("chainChanged", pageReload);
    ethereum.on("accountsChanged", handleAccount(ethereum));
}

const removeGlobalListeners = (ethereum: MetaMaskInpageProvider) => {
    ethereum?.removeListener("chainChanged", pageReload);
    ethereum?.removeListener("accountsChanged", handleAccount);
}

const Web3Context = createContext<Web3State>(createDefaultState());

const Web3Provider: FunctionComponent = ({children}) => {
    const [web3Api, setWeb3Api] = useState<Web3State>(createDefaultState());
    const [address, setAddress] = useState('')
    const collectionIndex = useSelector(selectIndex)
    const collectionAddress = useSelector(selectAddress)


    useEffect(() => {
        async function initWeb3() {
            try {
                const provider = new ethers.providers.Web3Provider(window.ethereum as any);
                const factoryContract = await loadFactoryContract("Factory", provider);

                const contractDB = await loadDBContract("UserDB", provider);

                const signer = provider.getSigner();

                const signedFactoryContract = factoryContract.connect(signer);
                const signedDBContract = contractDB.connect(signer);
                const collections = await signedFactoryContract.getAllCollections();
                setAddress(signedFactoryContract.address)

                if (collections.length === 0) {
                    await signedFactoryContract.createCollection('Pumpkin', 'PNFT', "")
                }
                console.log(collections.length, " length collection")
                const contract = await loadContract("NftMarket", provider, collectionAddress || collections[collectionIndex][0]);
                const signedContract = contract.connect(signer);
                console.log(contract, " this is contract")


                setTimeout(() => setGlobalListeners(window.ethereum), 500);
                setWeb3Api(createWeb3State({
                    ethereum: window.ethereum,
                    provider,
                    factory: signedFactoryContract as unknown as FactoryContract,
                    contract: signedContract as unknown as NftMarketContract || {} as NftMarketContract,
                    profileContract: signedDBContract as unknown as ProfileContract,
                    isLoading: false
                }))
            } catch (e: any) {
                console.error("Please, install web3 wallet");
                setWeb3Api((api) => createWeb3State({
                    ...api as any,
                    isLoading: false,
                }))
            }
        }

        initWeb3();
        return () => removeGlobalListeners(window.ethereum);
    }, [collectionAddress])

    return (
        <Web3Context.Provider value={web3Api}>
            {children}
        </Web3Context.Provider>
    )
}

export function useWeb3() {
    return useContext(Web3Context);
}

export function useHooks() {
    const {hooks} = useWeb3();
    return hooks;
}

export default Web3Provider;









