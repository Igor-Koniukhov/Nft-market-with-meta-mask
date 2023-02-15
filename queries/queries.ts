import {ApolloClient, gql, InMemoryCache} from "@apollo/client";

const APIURL = 'https://api.studio.thegraph.com/query/41338/market/v0.0.2.3'
const client = new ApolloClient({
    uri: APIURL,
    cache: new InMemoryCache(),
})

const LOCALURL='http://localhost:8080/graphql'

export const getURIById= async (id: string) =>{
    const query = `query GettokenIsMinteds($tokenId: String!){nfts(where: {tokenId: $tokenId}){tokenURI}}`
    client
        .query({
            query: gql(query),
            variables: {
                tokenId: id,
            },
        })
        .then((data) => console.log('Subgraph data: ', data.data.tokenIsMinteds[0].tokenURI))
        .catch((err) => {
            console.log('Error fetching data: ', err)
        })
}

export const getTokenByName = async (name: string)=>{
    const query = `
    query getTokenByName($nftName: String!){
  nfts(where: {nftName_contains: $nftName}) {
    tokenId
    nftName
    tokenURI
    creator
   
  }
}    `
    client
        .query({
            query: gql(query),
            variables: {
                nftName: name,
            },
        })
        .then((data) => console.log('Subgraph data: ', data.data.nfts))
        .catch((err) => {
            console.log('Error fetching data: ', err)
        })
}

export const getTokenByPriceRange = async (param1: string, param2: string)=>{
    console.log(param1, param2, " this")
    const query = `
    query GetTokenByPriceRange($price1: BigInt!,$price2: BigInt!){
    
   nfts(where: {price_gt: $price1, price_lt: $price2}) {
    id
    price
    tokenId
  }
}`
    client
        .query({
            query: gql(query),
            variables: {
                price1: param1,
                price2: param2
            },
        })
        .then((data) => console.log('Subgraph data: ', data.data))
        .catch((err) => {
            console.log('Error fetching data: ', err)
        })
}
