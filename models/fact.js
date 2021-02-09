const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema(
    {
        number: {
            type: Number,
            required: true
        },
        text: {
            type: String,
            required: true
        },
        author: {
            type: Number
        },
        isRemove: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: false
    }
);

schema.set('toJSON', {
    virtuals: true
});

module.exports = mongoose.model('Fact', schema);