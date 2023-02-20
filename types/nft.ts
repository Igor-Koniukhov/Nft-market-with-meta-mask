import {BigNumber, BigNumberish} from "ethers";

export type Trait = "fury" | "scary";

export type NftAttribute = {
  trait_type: Trait;
  value: string;
}

export type NftMeta = {
  name: string;
  description: string;
  image: string;
  attributes: NftAttribute[];
}
export type CollectionMeta={
  cName: string;
  cSymbol: string;
  cDescription: string;
  image: string;
}

export type UserData ={
  userName: string;
  userLastName: string;
  email: string;
}
export type UserDataResponse ={
  userName: string;
  userLastName: string;
  email: string;
  image: string;
}

export type NftCore = {
  tokenId: number;
  price: number;
  creator: string;
  isListed: boolean
}
export type Collection = {
  token: string;
  collectionId: number;
  creator: string;
  symbol: string;
  name: string;
  image: string;
  description: string;
  isPublished: boolean;

}

export type Nft = {
  meta: NftMeta
} & NftCore

export type FileReq = {
  bytes: Uint8Array;
  contentType: string;
  fileName: string;
}

export type FullNftData = {
  tokenId: BigNumberish | BigNumber,
  name: string;
  description: string;
  image: string;
  attributes_furry: string;
  attributes_scary: string;
  creator: string,
  owner: string,
  price: BigNumberish | BigNumber,
  royalty: BigNumberish | BigNumber,
  isListed: boolean,
  isSold: boolean,
  collectionId: BigNumberish | BigNumber,
  networkId: BigNumberish | BigNumber

}
export type FullNftDataMDBResponse = {
  _id: string;
  name: string;
  description: string;
  image: string;
  attributes_furry: string;
  attributes_scary: string;
  tokenId: string,
  creator: string,
  owner: string,
  price: string,
  royalty: string,
  isListed: boolean,
  isSold: boolean,
  collectionId: string,
  networkId: string

}

export type PinataRes = {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
  isDuplicate: boolean;
}
