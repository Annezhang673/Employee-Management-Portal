import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
   author:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
   text:      { type: String, required: true },
   createdAt: { type: Date, default: Date.now }
});

export default commentSchema;