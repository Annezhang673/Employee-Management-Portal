import mongoose from 'mongoose';
import commentSchema from './subschemas/comment.js';

const facilityReportSchema = new mongoose.Schema({
   house:       { type: mongoose.Schema.Types.ObjectId, ref: 'House', required: true },
   title:       { type: String, required: true },
   description: { type: String, required: true },
   author:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
   comments:    [commentSchema],
   createdAt:   { type: Date, default: Date.now },
   status:  { type: String, default: 'Open' }
}, {
   timestamps: true
});

const FacilityReport = mongoose.model('FacilityReport', facilityReportSchema);
export default FacilityReport;
