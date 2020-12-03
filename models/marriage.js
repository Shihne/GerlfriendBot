const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema(
    {
        conf: {
            type: Schema.Types.ObjectID,
            ref: 'Conf',
            required: true
        },
        husband: {
            type: Number,
            required: true
        },
        hSex: {
            type: Number
        },
        wife: {
            type: Number,
            required: true
        },
        wSex: {
            type: Number
        },
        createdAt: {
            type: Date,
            default: Date.now()
        }
    },
    {
        timestamps: false
    }
);

schema.set('toJSON', {
    virtuals: true
});

module.exports = mongoose.model('Marriage', schema);