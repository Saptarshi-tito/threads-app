import mongoose from "mongoose";

const communitySchema = new mongoose.Schema({
    id: {type: String, required: true},
    username: {type: String, required: true, unique: true},
    name: {type: String, required: true},
    image: String,
    bio: String,
    createdby: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    threads: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Thread'
        }
    ],
members: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
]
    
})

const Community = mongoose.models.Community || mongoose.model('Community', communitySchema);
// 2nd part: first time creating the User Model
// 1st part: when User Model is already created

export default Community;