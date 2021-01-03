const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema(
    {
        idVK: {
            type: Number,
            required: true,
            unique: true
        },
        status: {
            type: String
        },
        reactions: [
            {
                type: Schema.Types.ObjectID,
                ref: 'ReactionPers'
            }
        ],
    },
    {
        timestamps: false
    }
);

schema.set('toJSON', {
    virtuals: true
});

module.exports = mongoose.model('User', schema);