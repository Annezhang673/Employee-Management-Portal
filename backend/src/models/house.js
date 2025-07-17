import mongoose from 'mongoose';

const houseSchema = new mongoose.Schema({
   address:    { type: String, required: true },
   landlord:   {
      name:    { type: String },
      contact: { type: String }
   },
   facilities: {
      Beds: { type: Number },
      Mattresses: { type: Number },
      Tables: { type: Number },
      Chairs: { type: Number }
   },
   residents:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
   available: { type: Boolean, default:true }
}, {
   timestamps: true
});

const House = mongoose.model('House', houseSchema);
export default House;