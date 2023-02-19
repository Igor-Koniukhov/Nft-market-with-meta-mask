const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const nftSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        attributes_furry: {
            type: String,
            required: true
        },
        attributes_scary: {
            type: String,
            required: true
        },
        tokenId: {
            type: String,
            required: true
        },
        creator: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
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
