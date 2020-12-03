const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema(
    {
        conf: {
            type: Schema.Types.ObjectID,
            ref: 'Conf',
            required: true
        },
        groom: {
            type: Number,
            required: true
        },
        bride: {
            type: Number,
            required: true
        },
        bSex: {
            type: Number
        }
    },
    {
        timestamps: false
    }
);

schema.set('toJSON', {
    virtuals: true
});

module.exports = mongoose.model('MarriageProposal', schema);