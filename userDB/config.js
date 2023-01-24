import { ethers } from "ethers";
import Web3Modal from 'web3modal';
import userDbAbi from './abi/contracts/UserDb.json';



export const userdbaddress = userDbAbi.networks[1337].address;
const rpc = process.env.NEXT_PUBLIC_RPC;
const updaterwallet = 'd7aeecf737c173318857344a30d31df049ecd47aad5711dc007e225f1306bb60';
const provider = new ethers.providers.JsonRpcProvider(rpc);
const updater = new ethers.Wallet(updaterwallet, provider);
export const usercontract = new ethers.Contract(userdbaddress, userDbAbi.abi, updater);


export async function ethConnect() {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const addressraw = signer.getAddress();
    const addressstr = (await addressraw).valueOf();
    return addressstr;
}


