const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema(
    {
        idVK: {
            type: Number,
            required: true,
            unique: true
        },
        marriages: [
            {
                type: Schema.Types.ObjectID,
                ref: 'Marriage'
            }
        ],
        marriageProposals: [
            {
                type: Schema.Types.ObjectID,
                ref: 'MarriageProposal'
            }
        ],
        //ONLY FOR SCoBLC
        membersIds: [
            {
                type: Number
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

module.exports = mongoose.model('Conf', schema);