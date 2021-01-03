const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema(
    {
        conf: {
            type: Schema.Types.ObjectID,
            ref: 'Conf',
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

module.exports = mongoose.model('ReactionConf', schema);