import { ethers } from "ethers";
import userDbAbi from './abi/contracts/UserDb.json';




export const contractDBAddress = userDbAbi.networks[5].address;
const rpc = process.env.NEXT_PUBLIC_RPC;
const updaterwallet = 'd7aeecf737c173318857344a30d31df049ecd47aad5711dc007e225f1306bb60';
const provider = new ethers.providers.JsonRpcProvider(rpc);
const updater = new ethers.Wallet(updaterwallet, provider);
export const profileContract = new ethers.Contract(contractDBAddress, userDbAbi.abi, updater);





