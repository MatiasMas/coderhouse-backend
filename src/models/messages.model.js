import mongoose from 'mongoose';

const MessagesSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    message: String
});

export const MessagesModel = mongoose.model('Messages', MessagesSchema);