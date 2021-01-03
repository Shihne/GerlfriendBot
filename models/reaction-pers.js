const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema(
    {
        ownerID: {
            type: Schema.Types.ObjectID,
            ref: 'User',
            required: true
        },
        stimulus: {
            type: String,
            required: true
        },
        answer: {
            type: String,
            required: true
        }

    },
    {
        timestamps: false
    }
);

schema.set('toJSON', {
    virtuals: true
});

module.exports = mongoose.model('ReactionPers', schema);