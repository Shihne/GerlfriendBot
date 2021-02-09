const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema(
    {
        ownerID: {
            type: Number,
            required: true
        },
        stimulus: {
            type: String,
            required: true
        },
        answer: [
            {
                type: String
            }
        ]

    },
    {
        timestamps: false
    }
);

schema.set('toJSON', {
    virtuals: true
});

module.exports = mongoose.model('Reaction', schema);