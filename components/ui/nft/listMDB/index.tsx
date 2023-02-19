import {FunctionComponent, useEffect, useState} from "react";
import {NftItemMDB} from "@ui/index";
import {useListedNfts} from "@hooks/web3";


const NftListMDB: FunctionComponent = () => {


    const [state, setState] = useState({
        isEditing: false,
        allNfts: [] as any[],
        totalNfts: 0,
        editNft: null,
        status: '',
        nftPage: 1,
        nftsLoading: true,
        editLoading: false
    })
    const {nfts} = useListedNfts();

    useEffect(() => {
        const loadNft = (direction: string) => {
            if (direction) {
                setState({...state, nftsLoading: true, allNfts: []});
            }
            let page = state.nftPage;
            if (direction === 'next') {
                page++;
                setState({...state, nftPage: page});
            }
            if (direction === 'previous') {
                page--;
                setState({...state, nftPage: page});
            }
            const graphqlQuery = {
                query: `
        {
          nfts(page: ${page}) {
            nfts {
              _id
              tokenId
              name
              description
              image
              attributes_furry
              attributes_scary
              creator
              owner
              price
              royalty
              isListed
              isSold
              collectionId              
              createdAt
            }
            totalNfts
          }
        }
      `
            };
            fetch('http://localhost:8080/graphql', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token'),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(graphqlQuery)
            })
                .then(res => {
                    return res.json();
                })
                .then(resData => {
                    if (resData.errors) {
                        throw new Error('Fetching posts failed!');
                    }
                    if (resData) {
                        setState({...state, allNfts: resData.data.nfts.nfts})

                    }

                })
                .catch(e => {
                    console.log(e)
                })
        };
        loadNft('nextT')

    }, [])

    return (
        <div className="mt-12 max-w-lg mx-auto grid gap-5 lg:grid-cols-3 lg:max-w-none">
            {state.allNfts?.map(nft =>
                <div key={nft.image} className="flex flex-col rounded-lg shadow-lg overflow-hidden">
                    <NftItemMDB
                        item={nft}
                        buyNft={nfts.buyNft}
                    />
                </div>
            )}
        </div>
    )
}

export default NftListMDB;
