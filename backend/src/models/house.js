import mongoose from 'mongoose';

const houseSchema = new mongoose.Schema({
   address:    { type: String, required: true },
   landlord:   {
      name:    { type: String },
      contact: { type: String }
   },
   facilities: [String],
   residents:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, {
   timestamps: true
});

const House = mongoose.model('House', houseSchema);
export default House;