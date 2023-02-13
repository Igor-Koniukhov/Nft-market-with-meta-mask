const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const nftSchema = new Schema(
    {
        tokenId: {
            type: String,
            required: true
        },
        tokenURI: {
            type: String,
            required: true
        },
        nftName: {
            type: String,
            required: true
        },
        creator: {
            type: String,
            required: true
        },
        owner: {
            type: String,
            required: true
        },
        price: {
            type: String,
            required: true
        },
        royalty: {
            type: String,
            required: true
        },
        isListed: {
            type: Boolean,
            required: true
        },
        isSold: {
            type: Boolean,
            required: true
        },
        collectionId: {
            type: String,
            required: true
        },
        networkId: {
            type: String,
            required: true
        },
    },
    {timestamps: true}
);

module.exports = mongoose.model('NFT', nftSchema);
