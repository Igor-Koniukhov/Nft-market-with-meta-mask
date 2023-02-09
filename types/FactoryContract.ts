import {
  ContractTransaction,
  ContractInterface,
  BytesLike as Arrayish,
  BigNumber,
  BigNumberish,
} from 'ethers';
import { EthersContractContextV5 } from 'ethereum-abi-types-generator';

export type ContractContext = EthersContractContextV5<
  FactoryContract,
  FactoryContractMethodNames,
  FactoryContractEventsContext,
  FactoryContractEvents
>;

export declare type EventFilter = {
  address?: string;
  topics?: Array<string>;
  fromBlock?: string | number;
  toBlock?: string | number;
};

export interface ContractTransactionOverrides {
  /**
   * The maximum units of gas for the transaction to use
   */
  gasLimit?: number;
  /**
   * The price (in wei) per unit of gas
   */
  gasPrice?: BigNumber | string | number | Promise<any>;
  /**
   * The nonce to use in the transaction
   */
  nonce?: number;
  /**
   * The amount to send with the transaction (i.e. msg.value)
   */
  value?: BigNumber | string | number | Promise<any>;
  /**
   * The chain ID (or network ID) to use
   */
  chainId?: number;
}

export interface ContractCallOverrides {
  /**
   * The address to execute the call as
   */
  from?: string;
  /**
   * The maximum units of gas for the transaction to use
   */
  gasLimit?: number;
}
export type FactoryContractEvents = 'collectionCreated';
export interface FactoryContractEventsContext {
  collectionCreated(...parameters: any): EventFilter;
}
export type FactoryContractMethodNames =
  | 'allCollections'
  | 'collectionsAmount'
  | 'getAllCollections'
  | 'createCollection'
  | 'setNewCollectionIdentity'
  | 'setNewCollectionURI'
  | 'getCollectionById'
  | 'publishCollection'
  | 'hideFromPublishedCollection'
  | 'getOwnedCollections';
export interface CollectionCreatedEventEmittedResponse {
  Collection: string;
  Name: string;
  Symbol: string;
  collectionURI: string;
  collectionId: BigNumberish;
}
export interface AllCollectionsResponse {
  token: string;
  0: string;
  collectionId: BigNumber;
  1: BigNumber;
  creator: string;
  2: string;
  name: string;
  3: string;
  symbol: string;
  4: string;
  collectionURI: string;
  5: string;
  isPublished: boolean;
  6: boolean;
  length: 7;
}
export interface CollectionnftResponse {
  token: string;
  0: string;
  collectionId: BigNumber;
  1: BigNumber;
  creator: string;
  2: string;
  name: string;
  3: string;
  symbol: string;
  4: string;
  collectionURI: string;
  5: string;
  isPublished: boolean;
  6: boolean;
}
export interface FactoryContract {
  on(arg0: string, arg1: (Collection: string, Name: string, Symbol: string, collectionId: BigNumberish) => void);
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: uint256, Indexed: false
   */
  allCollections(
    parameter0: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<AllCollectionsResponse>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  collectionsAmount(overrides?: ContractCallOverrides): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getAllCollections(
    overrides?: ContractCallOverrides
  ): Promise<CollectionnftResponse[]>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param Name Type: string, Indexed: false
   * @param Symbol Type: string, Indexed: false
   * @param collectionURI Type: string, Indexed: false
   */
  createCollection(
    Name: string,
    Symbol: string,
    collectionURI: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param collectionIds Type: uint256, Indexed: false
   * @param name Type: string, Indexed: false
   * @param symbol Type: string, Indexed: false
   */
  setNewCollectionIdentity(
    collectionIds: BigNumberish,
    name: string,
    symbol: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param collectionIds Type: uint256, Indexed: false
   * @param collectionURI Type: string, Indexed: false
   */
  setNewCollectionURI(
    collectionIds: BigNumberish,
    collectionURI: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param collectionIds Type: uint256, Indexed: false
   */
  getCollectionById(
    collectionIds: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<CollectionnftResponse>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param collectionIds Type: uint256, Indexed: false
   */
  publishCollection(
    collectionIds: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param collectionIds Type: uint256, Indexed: false
   */
  hideFromPublishedCollection(
    collectionIds: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param creator Type: address, Indexed: false
   */
  getOwnedCollections(
    creator: string,
    overrides?: ContractCallOverrides
  ): Promise<CollectionnftResponse[]>;
}
