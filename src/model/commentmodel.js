const { Schema, model } = require('mongoose');


const commentSchema = Schema({
    commentBy: {
        type: Schema.Types.ObjectId, ref:'user',
        required: true
    },
    commentOn: {
        type: Schema.Types.ObjectId, ref:'post',
    },
    comment: {
        type: String
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true, versionKey: false })



module.exports = commentModel = model('comment', commentSchema);