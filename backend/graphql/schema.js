const { buildSchema } = require('graphql');

module.exports = buildSchema(`    
    type NFT {
        _id: ID!
        tokenId: String!
        name: String!
        description: String!
        image: String!
        attributes_furry: String!
        attributes_scary: String!     
        creator: User!
        owner: User!
        price: String!
        royalty: String!
        isListed: Boolean!
        isSold: Boolean!
        collectionId: String!
        networkId: String!        
        createdAt: String!
        updatedAt: String!
    }

    type User {
        _id: ID!
        name: String!
        email: String!
        password: String!
        address: String!        
        status: String!
        nfts: [NFT!]!
    }

    type AuthData {
        token: String!
        userId: String!
    }   
    
    type NftData {
        nfts: [NFT!]!
        totalNfts: Int!
    }

    input UserInputData {
        email: String!
        name: String!
        password: String!
        address: String!
    }   
    
    input NftInputData { 
        name: String!
        description: String!
        image: String!
        attributes_furry: String!
        attributes_scary: String!
        tokenId: String!    
        price: String!
        royalty: String!
        isListed: Boolean!
        isSold: Boolean!
        collectionId: String!
        networkId: String!
    }  
    input NftInputBoughtData {        
        isSold: Boolean!    
    }  
        
    type RootQuery {
        login(email: String!, password: String!): AuthData!        
        nfts(page: Int): NftData!
        nft(id: ID!): NFT!
        user: User!
    }

    type RootMutation {
        createUser(userInput: UserInputData): User!        
        createNft(nftInput: NftInputData): NFT!
        updateNft(id: ID!, nftInput: NftInputData): NFT!
        boughtNft(id: ID!, nftBoughtInput: NftInputBoughtData): NFT!
        deleteNft(id: ID!): Boolean        
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);
