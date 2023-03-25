const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        default: 'user'
    }
}, { timestamps: true, versionKey: false })

userSchema.pre('save', async function (next) {
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

userSchema.methods.checkPassword = async function (password) {
    return bcrypt.compare(password, this.password);
}


module.exports = userModel = model('user', userSchema);