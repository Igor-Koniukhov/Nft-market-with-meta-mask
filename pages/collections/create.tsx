/* eslint-disable @next/next/no-img-element */

import type {NextPage} from 'next'
import {BaseLayout, CollectionCreate, CollectionsList} from '@ui'
import {Collection,} from '@_types/nft';
import {useNetwork, useOwnedCollections} from '@hooks/web3';
import {ExclamationIcon} from '@heroicons/react/solid';


const CreateNewCollection: NextPage = () => {
    const {collections}= useOwnedCollections()
    const {network} = useNetwork();

    if (!network.isConnectedToNetwork) {
        return (
            <BaseLayout>

                <div className="rounded-md bg-yellow-50 p-4 mt-10">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <ExclamationIcon className="h-5 w-5 text-yellow-400" aria-hidden="true"/>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-yellow-800">Attention needed</h3>
                            <div className="mt-2 text-sm text-yellow-700">
                                <p>
                                    {network.isLoading ?
                                        "Loading..." :
                                        `Connect to ${network.targetNetwork}`
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </BaseLayout>
        )
    }

    return (
        <BaseLayout>
            <h1 className="font-bold font-black p-2 mb-2 text-3xl px-4">Create new collection: </h1>
            <CollectionCreate/>
            <h1 className="font-bold font-black p-2 mb-2 text-3xl px-4">Your owned collections: </h1>
            <CollectionsList
                path={collections.path}
                collections={collections.data as Collection[]}
            />

        </BaseLayout>
    )
}

export default CreateNewCollection
