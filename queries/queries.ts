import {ApolloClient, gql, InMemoryCache} from "@apollo/client";

const APIURL = 'https://api.studio.thegraph.com/query/41338/market/v.0.0.1.8'
const client = new ApolloClient({
    uri: APIURL,
    cache: new InMemoryCache(),
})

export const getURIById= async (id: string) =>{
    const query = `query GettokenIsMinteds($tokenId: String!){tokenIsMinteds(where: {tokenId: $tokenId}){tokenURI}}`
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
  tokenIsMinteds(where: {nftName_contains: $nftName}) {
    tokenId
    nftName
    tokenURI
    creator
    mintedAt       
  }
}    `
    client
        .query({
            query: gql(query),
            variables: {
                nftName: name,
            },
        })
        .then((data) => console.log('Subgraph data: ', data.data.tokenIsMinteds))
        .catch((err) => {
            console.log('Error fetching data: ', err)
        })
}