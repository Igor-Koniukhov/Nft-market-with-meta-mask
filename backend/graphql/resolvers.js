const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const Post = require('../models/post');
const NFT = require('../models/nft');
const {clearImage} = require('../util/file');
const {mongoose} = require("mongoose");

module.exports = {
    createUser: async function ({userInput}, req) {
        //   const email = args.userInput.email;
        const errors = [];
        if (!validator.isEmail(userInput.email)) {
            errors.push({message: 'E-Mail is invalid.'});
        }
        if (
            validator.isEmpty(userInput.password) ||
            !validator.isLength(userInput.password, {min: 5})
        ) {
            errors.push({message: 'Password too short!'});
        }
        if (errors.length > 0) {
            const error = new Error('Invalid input.');
            error.data = errors;
            error.code = 422;
            throw error;
        }
        const existingUser = await User.findOne({email: userInput.email});
        const existingAddress = await User.findOne({address: userInput.address});
        if (existingUser && existingAddress) {
            const error = new Error('User exists already!');
            throw error;
        }
        const hashedPw = await bcrypt.hash(userInput.password, 12);
        const user = new User({
            email: userInput.email,
            name: userInput.name,
            password: hashedPw,
            address: userInput.address
        });
        const createdUser = await user.save();
        return {...createdUser._doc, _id: createdUser._id.toString()};
    },
    login: async function ({email, password}) {
        const user = await User.findOne({email: email});

        if (!user) {
            const error = new Error('User not found.');
            error.code = 401;
            throw error;
        }
        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            const error = new Error('Password is incorrect.');
            error.code = 401;
            throw error;
        }

        const token = jwt.sign(
            {
                userId: user._id.toString(),
                email: user.email
            },
            'somesupersecretsecret',
            {expiresIn: '1h'}
        );
        console.log(user, " user")
        return {token: token, userId: user._id.toString(), name: user.name};
    },
    createNft: async function ({nftInput}, req) {
        if (!req.isAuth) {
            const error = new Error('Not authenticated!');
            error.code = 401;
            throw error;
        }
        const errors = [];

        if (errors.length > 0) {
            const error = new Error('Invalid input.');
            error.data = errors;
            error.code = 422;
            throw error;
        }
        const user = await User.findById(req.userId);
        if (!user) {
            const error = new Error('Invalid user.');
            error.code = 401;
            throw error;
        }
        const nft = new NFT({
            name: nftInput.name,
            description: nftInput.description,
            image: nftInput.image,
            attributes_furry: nftInput.attributes_furry,
            attributes_scary: nftInput.attributes_scary,
            creator: user,
            owner: user,
            tokenId: nftInput.tokenId,
            price: nftInput.price,
            royalty: nftInput.royalty,
            isListed: nftInput.isListed,
            isSold: nftInput.isSold,
            collectionId: nftInput.collectionId,
            networkId: nftInput.networkId

        });
        const createdNft = await nft.save();
        user.nfts.push(createdNft);
        await user.save();
        return {
            ...createdNft._doc,
            _id: createdNft._id.toString(),
            createdAt: createdNft.createdAt.toISOString(),
            updatedAt: createdNft.updatedAt.toISOString()
        };
    },

    nfts: async function ({page}, req) {
        /* if (!req.isAuth) {
             const error = new Error('Not authenticated!');
             error.code = 401;
             throw error;
         }*/
        if (!page) {
            page = 1;
        }
        const perPage = 5;
        const totalNfts = await NFT.find().countDocuments();
        const nfts = await NFT.find()
            .sort({createdAt: -1})
            .skip((page - 1) * perPage)
            .limit(perPage)

        return {
            nfts: nfts.map(async nft => {
                return {
                    ...nft._doc,
                    _id: nft._id.toString(),
                    owner: User.findOne(nft.owner._id),
                    creator: User.findOne(nft.creator._id),
                    createdAt: nft.createdAt.toISOString(),
                    updatedAt: nft.updatedAt.toISOString()
                };
            }),
            totalNfts: totalNfts
        };
    },
    nft: async function ({id}, req) {
        if (!req.isAuth) {
            const error = new Error('Not authenticated!');
            error.code = 401;
            throw error;
        }
        const nft = await NFT.findById(id).populate('creator');
        if (!nft) {
            const error = new Error('No post found!');
            error.code = 404;
            throw error;
        }
        return {
            ...nft._doc,
            _id: nft._id.toString(),
            createdAt: nft.createdAt.toISOString(),
            updatedAt: nft.updatedAt.toISOString()
        };
    },
    boughtNft: async function ({id, nftBoughtInput}, req) {
        const nft = await NFT.findById(id).populate('creator');
        if (!nft) {
            const error = new Error('No nft found!');
            error.code = 404;
            throw error;
        }
        const errors = [];

        if (errors.length > 0) {
            const error = new Error('Invalid input.');
            error.data = errors;
            error.code = 422;
            throw error;
        }

        let owner = await User.findById(nft.owner._id.toString());
        if (nft.owner._id.toString() !== req.userId.toString()){
            owner.nfts = owner.nfts.filter(({_id}) =>
                _id.toString() !== mongoose.Types.ObjectId(id).toString()
            )
            await owner.save()
        }

        if (nft.owner._id.toString() === req.userId) {
            const error = new Error('You are owner!');
            error.code = 401;
            throw error;
        }
        const newOwner = await User.findById(req.userId);
        if (!nft.isSold){
            nft.price = (Number(nft.price) + (Number(nft.price) * Number(nft.royalty))/100)
        }
        nft.isSold = nftBoughtInput.isSold;
        nft.owner = newOwner
        const soldNft = await nft.save();
        newOwner.nfts.push(soldNft)
        await newOwner.save()

        return {
            ...soldNft._doc,
            _id: soldNft._id.toString(),
            createdAt: soldNft.createdAt.toISOString(),
            updatedAt: soldNft.updatedAt.toISOString()
        };
    },
    updatePost: async function ({id, postInput}, req) {
        if (!req.isAuth) {
            const error = new Error('Not authenticated!');
            error.code = 401;
            throw error;
        }
        const post = await Post.findById(id).populate('creator');
        if (!post) {
            const error = new Error('No post found!');
            error.code = 404;
            throw error;
        }
        if (post.creator._id.toString() !== req.userId.toString()) {
            const error = new Error('Not authorized!');
            error.code = 403;
            throw error;
        }
        const errors = [];
        if (
            validator.isEmpty(postInput.title) ||
            !validator.isLength(postInput.title, {min: 5})
        ) {
            errors.push({message: 'Title is invalid.'});
        }
        if (
            validator.isEmpty(postInput.content) ||
            !validator.isLength(postInput.content, {min: 5})
        ) {
            errors.push({message: 'Content is invalid.'});
        }
        if (errors.length > 0) {
            const error = new Error('Invalid input.');
            error.data = errors;
            error.code = 422;
            throw error;
        }
        post.title = postInput.title;
        post.content = postInput.content;
        if (postInput.imageUrl !== 'undefined') {
            post.imageUrl = postInput.imageUrl;
        }
        const updatedPost = await post.save();
        return {
            ...updatedPost._doc,
            _id: updatedPost._id.toString(),
            createdAt: updatedPost.createdAt.toISOString(),
            updatedAt: updatedPost.updatedAt.toISOString()
        };
    },
    deletePost: async function ({id}, req) {
        if (!req.isAuth) {
            const error = new Error('Not authenticated!');
            error.code = 401;
            throw error;
        }
        const post = await Post.findById(id);
        if (!post) {
            const error = new Error('No post found!');
            error.code = 404;
            throw error;
        }
        if (post.creator.toString() !== req.userId.toString()) {
            const error = new Error('Not authorized!');
            error.code = 403;
            throw error;
        }
        clearImage(post.imageUrl);
        await Post.findByIdAndRemove(id);
        const user = await User.findById(req.userId);
        user.posts.pull(id);
        await user.save();
        return true;
    },
    user: async function (args, req) {
        /*if (!req.isAuth) {
            const error = new Error('Not authenticated!');
            error.code = 401;
            throw error;
        }*/
        const user = await User.findById(req.userId);
        if (!user) {
            const error = new Error('No user found!');
            error.code = 404;
            throw error;
        }
        return {...user._doc, _id: user._id.toString()};
    },
    userRoleData: async function ({id}, req) {
        /*if (!req.isAuth) {
            const error = new Error('Not authenticated!');
            error.code = 401;
            throw error;
        }*/
        const user = await User.findById(id);
        if (!user) {
            const error = new Error('No user found!');
            error.code = 404;
            throw error;
        }
        return {...user._doc, _id: user._id.toString()};
    },
    updateStatus: async function ({status}, req) {
        if (!req.isAuth) {
            const error = new Error('Not authenticated!');
            error.code = 401;
            throw error;
        }
        const user = await User.findById(req.userId);
        if (!user) {
            const error = new Error('No user found!');
            error.code = 404;
            throw error;
        }
        user.status = status;
        await user.save();
        return {...user._doc, _id: user._id.toString()};
    }
};
