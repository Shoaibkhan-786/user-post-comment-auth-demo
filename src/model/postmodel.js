const { Schema, model } = require('mongoose');


const postSchema = Schema({
    postBy: {
        type: Schema.Types.ObjectId, ref:'user',
        required: true
    },
    title: {
        type: String
    },
    description: {
        type: String
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true, versionKey: false })



module.exports = postModel = model('post', postSchema);