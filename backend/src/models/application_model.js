import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
   user:          { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
   data:          { type: Object, required: true }, // raw form fields
   documents:     [{
      name:          { type: String, required: true },
      s3Key:         { type: String, required: true },
      url:           { type: String, required: false }
   }],
   status:        { type: String, enum: ['Pending','Approved','Rejected'], default: 'Pending' },
   feedback:      { type: String },
}, {
   timestamps: true
});

const Application = mongoose.model('Application', applicationSchema);
export default Application;